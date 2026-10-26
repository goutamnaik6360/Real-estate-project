import { useCallback, useEffect, useState } from "react";
import { backend } from "../lib/firebaseBackend";
import { Check, Clock3, LogOut, MapPin, Phone, RefreshCw, ShieldCheck, UserRound, X } from "lucide-react";

export default function AdminDashboard() {
  const currentUser = backend.authStore.model;
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyAgentId, setBusyAgentId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadPendingAgents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const pending = await backend.collection("users").getFullList({
        filter: 'role="agent" && status="pending"',
        sort: "-created",
      });
      setAgents(pending);
    } catch (err) {
      console.error("Could not load pending agent applications:", err);
      setError("Could not load agent applications. Check that this account has the Admin role and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      window.location.replace("/login");
      return;
    }
    if (currentUser.role !== "admin") {
      window.location.replace(currentUser.role === "agent" ? "/dashboard/agent" : "/dashboard/user");
      return;
    }
    loadPendingAgents();
  }, [currentUser?.id, currentUser?.role, loadPendingAgents]);

  const decideAgent = async (agent, status) => {
    setBusyAgentId(agent.id);
    setError("");
    setNotice("");
    try {
      await backend.collection("users").update(agent.id, { status });
      setAgents((current) => current.filter((item) => item.id !== agent.id));
      setNotice(`${agent.name || "Agent application"} ${status === "approved" ? "approved" : "rejected"}.`);
    } catch (err) {
      console.error(`Could not ${status} agent application:`, err);
      setError("The decision could not be saved. Confirm the Admin role and try again.");
    } finally {
      setBusyAgentId("");
    }
  };

  const logout = async () => {
    await backend.authStore.clear();
    window.location.replace("/login");
  };

  if (currentUser?.role !== "admin") return null;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-700 p-3 text-white"><ShieldCheck size={24} /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">ESTATE-SYNC</p>
              <h1 className="text-xl font-black text-slate-900">Agent approvals</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadPendingAgents} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50" aria-label="Refresh applications">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700">
              <LogOut size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">Review agent applications</p>
            <h2 className="mt-1 text-3xl font-black text-slate-900">Approve or reject Agents</h2>
          </div>
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">{agents.length} pending</span>
        </div>

        {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800" role="alert">{error}</div>}
        {notice && <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800" role="status">{notice}</div>}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-600" role="status">
            <RefreshCw size={28} className="mx-auto mb-3 animate-spin text-blue-600" />
            Loading agent applications...
          </div>
        ) : agents.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 inline-flex rounded-2xl bg-emerald-100 p-4 text-emerald-700"><Check size={28} /></div>
            <h3 className="text-xl font-black text-slate-900">No pending applications</h3>
            <p className="mt-2 text-slate-600">New Agent registrations will appear here for review.</p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {agents.map((agent) => {
              const maskedId = agent.aadhaar ? `•••• ${String(agent.aadhaar).slice(-4)}` : "Not provided";
              const isBusy = busyAgentId === agent.id;
              return (
                <article key={agent.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-blue-50 p-3 text-blue-700"><UserRound size={22} /></div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900">{agent.name || "Unnamed Agent"}</h3>
                        <p className="mt-0.5 break-all text-sm text-slate-500">{agent.email}</p>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800"><Clock3 size={13} />Pending</span>
                  </div>
                  <div className="grid gap-3 p-6 text-sm sm:grid-cols-2">
                    <Info icon={<Phone size={16} />} label="Phone" value={agent.phone || "Not provided"} />
                    <Info icon={<MapPin size={16} />} label="Location" value={agent.location || "Not provided"} />
                    <Info icon={<ShieldCheck size={16} />} label="Aadhaar" value={maskedId} />
                  </div>
                  <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 p-5 sm:flex-row">
                    <button onClick={() => decideAgent(agent, "approved")} disabled={isBusy} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 font-bold text-white hover:bg-emerald-800 disabled:opacity-50">
                      <Check size={18} /> {isBusy ? "Saving..." : "Approve Agent"}
                    </button>
                    <button onClick={() => decideAgent(agent, "rejected")} disabled={isBusy} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">
                      <X size={18} /> Reject
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">{icon}{label}</p>
      <p className="mt-2 break-words font-semibold text-slate-900">{value}</p>
    </div>
  );
}
