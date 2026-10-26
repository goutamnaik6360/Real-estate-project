import {
  createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile,
} from "firebase/auth";
import {
  addDoc, collection as firestoreCollection, doc, getDoc, getDocs, onSnapshot,
  query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { auth, db, firebaseReady, functions } from "./firebase";
import { httpsCallable } from "firebase/functions";

const PROFILE_CACHE_KEY = "estateSyncProfile";
const subscriptions = new Map();
const authListeners = new Set();
let currentProfile = (() => {
  try { return JSON.parse(localStorage.getItem(PROFILE_CACHE_KEY) || "null"); }
  catch { return null; }
})();

function publishProfile(profile) {
  currentProfile = profile;
  if (profile) localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
  else localStorage.removeItem(PROFILE_CACHE_KEY);
  authListeners.forEach((listener) => listener(profile));
}

function requireFirebase() {
  if (!firebaseReady || !auth || !db) {
    throw new Error("Firebase is not configured. Add your Firebase web app settings to .env.local and restart the app.");
  }
}

function collectionName(name) { return name === "users" ? "profiles" : name; }
function normalizeSnapshot(snapshot) {
  const data = snapshot.data();
  return { ...data, id: snapshot.id, created: data.createdAt?.toDate?.().toISOString?.() || data.created || null };
}
function dataFrom(input) {
  return input instanceof FormData ? Object.fromEntries(input.entries()) : { ...input };
}
function parseFilters(filter = "") {
  return [...filter.matchAll(/([\w]+)\s*=\s*["']([^"']*)["']/g)].map((match) => [match[1], match[2]]);
}
function applyFilters(records, filters) {
  return records.filter((record) => filters.every(([field, value]) => String(record[field] ?? "") === value));
}
function applySort(records, sort = "") {
  if (!sort) return records;
  const descending = sort.startsWith("-");
  const field = descending ? sort.slice(1) : sort;
  return records.sort((a, b) => {
    const value = String(a[field] ?? "").localeCompare(String(b[field] ?? ""), undefined, { numeric: true });
    return descending ? -value : value;
  });
}

async function createAccount(input) {
  requireFirebase();
  const values = dataFrom(input);
  const email = String(values.email || "").trim().toLowerCase();
  const name = String(values.name || "").trim();
  const password = String(values.password || "");
  const role = values.role === "agent" ? "agent" : "user";
  if (!email || !name || password.length < 8) {
    throw new Error("Enter your name, a valid email, and a password with at least 8 characters.");
  }
  const user = (await createUserWithEmailAndPassword(auth, email, password)).user;
  try {
    await updateProfile(user, { displayName: name });
    await setDoc(doc(db, "profiles", user.uid), {
      id: user.uid,
      name,
      email: user.email,
      role,
      status: role === "agent" ? "pending" : "approved",
      phone: String(values.phone || "").trim(),
      aadhaar: String(values.aadhaar || "").trim(),
      location: String(values.location || "").trim(),
      experience: "",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    await deleteUser(user).catch(() => {});
    await signOut(auth).catch(() => {});
    throw error;
  }
  await signOut(auth);
  return { email, role };
}
async function login(email, password) {
  requireFirebase();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const snapshot = await getDoc(doc(db, "profiles", credential.user.uid));
  if (!snapshot.exists()) {
    await signOut(auth);
    throw new Error("Your profile is missing. Contact ESTATE-SYNC support.");
  }
  let profile = normalizeSnapshot(snapshot);
  const bootstrapEmail = String(import.meta.env.VITE_ADMIN_BOOTSTRAP_EMAIL || "").trim().toLowerCase();
  if (bootstrapEmail && profile.email === bootstrapEmail && profile.role !== "admin") {
    if (!functions) {
      await signOut(auth);
      throw new Error("Admin setup is not configured yet. Ask the project owner to finish the one-time setup.");
    }
    try {
      const bootstrapAdmin = httpsCallable(functions, "bootstrapFirstAdmin");
      await bootstrapAdmin({});
      const refreshed = await getDoc(doc(db, "profiles", credential.user.uid));
      if (!refreshed.exists()) throw new Error("The Admin profile could not be loaded after setup.");
      profile = normalizeSnapshot(refreshed);
    } catch (error) {
      await signOut(auth);
      publishProfile(null);
      throw error;
    }
  }
  publishProfile(profile);
  return { record: profile, user: credential.user };
}

async function fetchRecords(name, options = {}) {
  requireFirebase();
  const target = collectionName(name);
  const filters = parseFilters(options.filter);
  const profile = currentProfile;
  const constraints = [];

  if (target === "profiles") {
    if (profile?.role === "admin") {
      constraints.push(where("role", "==", "agent"), where("status", "==", "pending"));
    } else {
      if (!auth.currentUser) return [];
      const own = await getDoc(doc(db, target, auth.currentUser.uid));
      return applySort(applyFilters(own.exists() ? [normalizeSnapshot(own)] : [], filters), options.sort);
    }
  }
  if (target === "notifications") {
    if (!auth.currentUser) return [];
    constraints.push(where("user", "==", auth.currentUser.uid));
  } else if (target === "requests" && profile?.role === "user") {
    constraints.push(where("user", "==", profile.id));
  } else if (target === "requests" && profile?.role === "agent") {
    constraints.push(filters.some(([field]) => field === "assignedAgent")
      ? where("assignedAgent", "==", profile.id)
      : where("status", "==", "pending_agent"));
  } else if (target === "support_tickets" && profile?.role !== "admin") {
    if (!auth.currentUser) return [];
    constraints.push(where("userId", "==", auth.currentUser.uid));
  }

  const snapshot = await getDocs(query(firestoreCollection(db, target), ...constraints));
  return applySort(applyFilters(snapshot.docs.map(normalizeSnapshot), filters), options.sort);
}

class FirebaseCollection {
  constructor(name) { this.name = collectionName(name); }
  async create(input) {
    if (this.name === "profiles") {
      throw new Error("Create accounts through the registration form.");
    }
    requireFirebase();
    const payload = dataFrom(input);
    const record = {
      ...payload,
      userId: payload.userId ?? auth.currentUser?.uid ?? null,
      createdAt: serverTimestamp(),
      created: new Date().toISOString(),
    };
    const saved = await addDoc(firestoreCollection(db, this.name), record);
    return { ...record, id: saved.id };
  }
  authWithPassword(email, password) { return login(email, password); }
  getFullList(options = {}) { return fetchRecords(this.name, options); }
  async update(id, changes) {
    requireFirebase();
    await updateDoc(doc(db, this.name, id), { ...changes, updatedAt: serverTimestamp() });
    if (this.name === "profiles" && currentProfile?.id === id) publishProfile({ ...currentProfile, ...changes });
    return { id, ...changes };
  }
  subscribe(_event, callback) {
    requireFirebase();
    const uid = auth.currentUser?.uid;
    if (this.name !== "notifications" || !uid) return () => {};
    const key = this.name + "-" + uid + "-" + crypto.randomUUID();
    const q = query(firestoreCollection(db, this.name), where("user", "==", uid));
    const unsubscribe = onSnapshot(q, (snapshot) => snapshot.docChanges().forEach((change) => {
      callback({ action: change.type === "added" ? "create" : "update", record: normalizeSnapshot(change.doc) });
    }));
    subscriptions.set(key, { collection: this.name, unsubscribe });
    return () => { subscriptions.get(key)?.unsubscribe(); subscriptions.delete(key); };
  }
  unsubscribe() {
    for (const [key, subscription] of subscriptions) {
      if (subscription.collection === this.name) {
        subscription.unsubscribe();
        subscriptions.delete(key);
      }
    }
  }
}

export const backend = {
  authStore: {
    get isValid() { return Boolean(currentProfile?.id); },
    get model() { return currentProfile; },
    clear() { publishProfile(null); return auth ? signOut(auth) : Promise.resolve(); },
  },
  collection(name) { return new FirebaseCollection(name); },
  authWithPassword: login,
  createAccount,
};

export function subscribeToAuth(listener) {
  authListeners.add(listener);
  listener(currentProfile);
  return () => authListeners.delete(listener);
}

if (auth) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) { publishProfile(null); return; }
    try {
      const snapshot = await getDoc(doc(db, "profiles", user.uid));
      publishProfile(snapshot.exists()
        ? normalizeSnapshot(snapshot)
        : { id: user.uid, email: user.email, name: user.displayName || "", role: "user" });
    } catch (error) {
      console.error("Unable to load the Firebase profile:", error);
    }
  });
}

