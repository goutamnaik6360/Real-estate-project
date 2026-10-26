import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { defineSecret, defineString } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";

initializeApp();
const db = getFirestore();
const auth = getAuth();
const region = "asia-east2";
const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const OTP_HMAC_SECRET = defineSecret("OTP_HMAC_SECRET");
const ADMIN_BOOTSTRAP_EMAIL = defineSecret("ADMIN_BOOTSTRAP_EMAIL");
const EMAIL_FROM = defineString("EMAIL_FROM");
const MAX_ATTEMPTS = 5;
const CODE_TTL_MS = 5 * 60 * 1000;
const RESEND_DELAY_MS = 60 * 1000;

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function digest(value) {
  return createHmac("sha256", OTP_HMAC_SECRET.value()).update(value).digest("hex");
}

function validEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function requiredText(value, label, maxLength, required = true) {
  const text = String(value || "").trim();
  if ((required && !text) || text.length > maxLength) {
    throw new HttpsError("invalid-argument", `Enter a valid ${label}.`);
  }
  return text;
}

async function sendCodeEmail(email, code) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY.value()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM.value(),
      to: [email],
      subject: "Your ESTATE-SYNC verification code",
      text: `Your ESTATE-SYNC verification code is ${code}. It expires in 5 minutes. If you did not request this code, you can ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:24px auto;padding:28px;border:1px solid #e2e8f0;border-radius:16px"><p style="color:#2563eb;font-weight:700;letter-spacing:2px">ESTATE-SYNC</p><h1 style="font-size:22px;color:#0f172a">Verify your email</h1><p style="color:#475569">Enter this code to finish creating your account. It expires in 5 minutes.</p><p style="font-size:32px;font-weight:800;letter-spacing:8px;color:#0f172a">${code}</p><p style="font-size:13px;color:#64748b">If you did not request this code, ignore this email.</p></div>`,
    }),
  });
  if (!response.ok) {
    const details = await response.text();
    console.error("Email provider rejected OTP message:", response.status, details.slice(0, 500));
    throw new HttpsError("unavailable", "The verification email could not be sent. Try again shortly.");
  }
}

export const requestSignupEmailOtp = onCall(
  { region, secrets: [RESEND_API_KEY, OTP_HMAC_SECRET], maxInstances: 5 },
  async (request) => {
    const email = cleanEmail(request.data?.email);
    if (!validEmail(email)) throw new HttpsError("invalid-argument", "Enter a valid email address.");

    try {
      await auth.getUserByEmail(email);
      throw new HttpsError("already-exists", "This email is already registered. Sign in or use another email.");
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      if (error?.code !== "auth/user-not-found") throw error;
    }

    const now = Date.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const emailKey = digest(`email:${email}`);
    const ip = String(request.rawRequest?.ip || "unknown");
    const ipKey = digest(`ip:${ip}`);
    const challengeRef = db.collection("signupOtpChallenges").doc(emailKey);
    const emailRateRef = db.collection("signupOtpRates").doc(emailKey);
    const ipRateRef = db.collection("signupOtpRates").doc(ipKey);
    const code = String(randomInt(0, 1000000)).padStart(6, "0");

    await db.runTransaction(async (transaction) => {
      const [challengeSnapshot, emailRateSnapshot, ipRateSnapshot] = await Promise.all([
        transaction.get(challengeRef), transaction.get(emailRateRef), transaction.get(ipRateRef),
      ]);
      const challenge = challengeSnapshot.data() || {};
      const emailRate = emailRateSnapshot.data() || {};
      const ipRate = ipRateSnapshot.data() || {};
      const emailCount = emailRate.day === day ? Number(emailRate.count || 0) : 0;
      const ipCount = ipRate.day === day ? Number(ipRate.count || 0) : 0;

      if (now - Number(challenge.sentAtMs || 0) < RESEND_DELAY_MS) {
        throw new HttpsError("resource-exhausted", "Wait 60 seconds before requesting another code.");
      }
      if (emailCount >= 5 || ipCount >= 20) {
        throw new HttpsError("resource-exhausted", "Too many code requests. Try again tomorrow.");
      }

      transaction.set(challengeRef, {
        codeDigest: digest(`${email}:${code}`),
        sentAtMs: now,
        expiresAtMs: now + CODE_TTL_MS,
        attempts: 0,
        consumed: false,
        updatedAt: FieldValue.serverTimestamp(),
      });
      transaction.set(emailRateRef, { day, count: emailCount + 1, updatedAt: FieldValue.serverTimestamp() });
      transaction.set(ipRateRef, { day, count: ipCount + 1, updatedAt: FieldValue.serverTimestamp() });
    });

    try {
      await sendCodeEmail(email, code);
    } catch (error) {
      await challengeRef.delete().catch(() => {});
      throw error;
    }

    return { sent: true, expiresInSeconds: CODE_TTL_MS / 1000 };
  },
);

export const completeSignupWithOtp = onCall(
  { region, secrets: [OTP_HMAC_SECRET], maxInstances: 5 },
  async (request) => {
    const email = cleanEmail(request.data?.email);
    const code = String(request.data?.code || "").trim();
    const password = String(request.data?.password || "");
    const name = requiredText(request.data?.name, "full name", 120);
    const role = request.data?.role === "agent" ? "agent" : "user";
    const phone = requiredText(request.data?.phone, "phone number", 32, role === "agent");
    const aadhaar = requiredText(request.data?.aadhaar, "Aadhaar number", 32, role === "agent");
    const location = requiredText(request.data?.location, "city or location", 120, role === "agent");

    if (!validEmail(email)) throw new HttpsError("invalid-argument", "Enter a valid email address.");
    if (!/^\d{6}$/.test(code)) throw new HttpsError("invalid-argument", "Enter the 6-digit email code.");
    if (password.length < 8 || password.length > 128) throw new HttpsError("invalid-argument", "Password must be at least 8 characters.");

    const emailKey = digest(`email:${email}`);
    const challengeRef = db.collection("signupOtpChallenges").doc(emailKey);
    const result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(challengeRef);
      const challenge = snapshot.data();
      if (!challenge || challenge.consumed || Number(challenge.expiresAtMs) < Date.now()) return "expired";
      if (Number(challenge.attempts || 0) >= MAX_ATTEMPTS) return "locked";

      const expected = Buffer.from(String(challenge.codeDigest || ""), "hex");
      const actual = Buffer.from(digest(`${email}:${code}`), "hex");
      if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
        transaction.update(challengeRef, { attempts: Number(challenge.attempts || 0) + 1 });
        return "invalid";
      }
      transaction.update(challengeRef, { consumed: true, consumedAt: FieldValue.serverTimestamp() });
      return "ok";
    });

    if (result === "locked") throw new HttpsError("resource-exhausted", "Too many incorrect codes. Request a new code.");
    if (result !== "ok") throw new HttpsError("failed-precondition", "The code is incorrect or expired. Request a new code and try again.");

    let user;
    try {
      user = await auth.createUser({ email, password, displayName: name, emailVerified: true });
      const profile = {
        id: user.uid,
        name,
        email,
        role,
        status: role === "agent" ? "pending" : "approved",
        phone,
        aadhaar,
        location,
        experience: "",
        createdAt: FieldValue.serverTimestamp(),
      };
      await db.collection("profiles").doc(user.uid).set(profile);
    } catch (error) {
      if (user) await auth.deleteUser(user.uid).catch(() => {});
      await challengeRef.delete().catch(() => {});
      if (error?.code === "auth/email-already-exists") {
        throw new HttpsError("already-exists", "This email is already registered. Sign in or use another email.");
      }
      console.error("Could not finalize verified signup:", error);
      throw new HttpsError("internal", "Account creation failed. Request a new email code and try again.");
    }

    await challengeRef.delete().catch(() => {});
    return { email, role };
  },
);


export const bootstrapFirstAdmin = onCall(
  { region, secrets: [ADMIN_BOOTSTRAP_EMAIL], maxInstances: 2 },
  async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Sign in before setting up the Admin account.");
    const email = cleanEmail(request.auth.token.email);
    if (!email || email !== cleanEmail(ADMIN_BOOTSTRAP_EMAIL.value()) || request.auth.token.email_verified !== true) {
      throw new HttpsError("permission-denied", "This account is not authorized for initial Admin setup.");
    }

    const uid = request.auth.uid;
    const profileRef = db.collection("profiles").doc(uid);
    const bootstrapRef = db.collection("system").doc("adminBootstrap");
    const outcome = await db.runTransaction(async (transaction) => {
      const [profileSnapshot, bootstrapSnapshot] = await Promise.all([
        transaction.get(profileRef), transaction.get(bootstrapRef),
      ]);
      if (!profileSnapshot.exists) throw new HttpsError("failed-precondition", "Create this account through registration before Admin setup.");
      if (bootstrapSnapshot.exists && bootstrapSnapshot.data().adminUid !== uid) {
        throw new HttpsError("failed-precondition", "The initial Admin account has already been set up.");
      }
      const profile = profileSnapshot.data();
      if (profile.role === "admin") return "already-admin";
      transaction.update(profileRef, { role: "admin", status: "approved" });
      transaction.set(bootstrapRef, { adminUid: uid, email, createdAt: FieldValue.serverTimestamp() });
      return "promoted";
    });

    return { role: "admin", outcome };
  },
);
