import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { backend } from "../lib/firebaseBackend";
import { User, Mail, Lock, AlertCircle, Building2, Phone, FileText, MapPin } from "lucide-react";

function registrationMessage(error) {
  if (["auth/email-already-in-use", "functions/already-exists"].includes(error?.code)) {
    return "This email already has an account. Sign in or use another email address.";
  }
  if (error?.code === "auth/weak-password") return "Choose a stronger password with at least 8 characters.";
  if (error?.code === "auth/invalid-email") return "Enter a valid email address.";
  if (error?.code === "auth/operation-not-allowed") return "Email and password sign-in is disabled in Firebase Authentication settings.";
  if (error?.code === "permission-denied" || error?.code === "firestore/permission-denied") {
    return "Firebase could not save your profile. Check the Firestore security rules and try again.";
  }
  return error?.message || "Could not create your account. Please try again.";
}

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    try {
      await backend.createAccount({
        email: cleanEmail,
        password,
        name: name.trim(),
        role,
        phone: phone.trim(),
        aadhaar: aadhar.trim(),
        location: location.trim(),
      });
      navigate("/login", { state: { email: cleanEmail, registrationComplete: true } });
    } catch (registrationError) {
      console.error(registrationError);
      setError(registrationMessage(registrationError));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-4">
            <Building2 className="text-blue-600" size={24} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-500">Join ESTATE-SYNC and get started</p>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm border border-red-100">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
          {["user", "agent"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => { setRole(option); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg capitalize transition-all ${role === option ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {option}
            </button>
          ))}
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" required placeholder="Full Name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="email" required placeholder="Email Address" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="password" required minLength={8} placeholder="Password (min. 8 chars)" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} />
          </div>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="tel" required={role === "agent"} placeholder={role === "agent" ? "Phone Number" : "Phone Number (optional)"} autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} />
          </div>
          {role === "agent" && (
            <>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" required placeholder="Aadhaar Number" autoComplete="off" value={aadhar} onChange={(event) => setAadhar(event.target.value)} className={inputClass} />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" required placeholder="City / Location" autoComplete="address-level2" value={location} onChange={(event) => setLocation(event.target.value)} className={inputClass} />
              </div>
            </>
          )}
          <button type="submit" disabled={loading} className="w-full bg-[#0f172a] hover:bg-slate-800 text-white py-4 rounded-xl font-bold mt-2 transition-all disabled:opacity-60">
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
