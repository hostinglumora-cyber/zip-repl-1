import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Server,
  Cpu,
  Activity,
  Terminal,
  RotateCw,
  Play,
  Square,
  Key,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Plus,
  Lock,
  ExternalLink,
  MessageCircle,
  Clock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";

export default function Hosting() {
  const { user } = useAuth();
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeServerId, setActiveServerId] = useState<string>("");
  const [newServerName, setNewServerName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

  const loadServers = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const list = await localDb.getHostingServers(user.id || "eazykims");
      setServers(list);
      if (list.length > 0 && !activeServerId) {
        setActiveServerId(list[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServers();
  }, [user]);

  const activeServer = servers.find((s) => s.id === activeServerId) || servers[0];

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName.trim() || !user) return;
    setCreating(true);

    try {
      const s = await localDb.createHostingServer(user.id, newServerName.trim());
      setServers([s, ...servers]);
      setActiveServerId(s.id);
      setNewServerName("");
      setShowCreateModal(false);
    } finally {
      setCreating(false);
    }
  };

  const handleServerAction = async (action: "restart" | "stop" | "start") => {
    if (!activeServer) return;
    setActionBusy(true);

    try {
      let nextStatus = "online";
      let logMsg = "";
      if (action === "restart") {
        nextStatus = "online";
        logMsg = `[${new Date().toLocaleTimeString()}] [System] Manual server restart initiated by @${user?.username || "operator"}.`;
      } else if (action === "stop") {
        nextStatus = "stopped";
        logMsg = `[${new Date().toLocaleTimeString()}] [System] Server process halted gracefully.`;
      } else if (action === "start") {
        nextStatus = "online";
        logMsg = `[${new Date().toLocaleTimeString()}] [System] Node started. Listening on port 3000.`;
      }

      const updated = await localDb.updateHostingServer(activeServer.id, {
        status: nextStatus,
        logs: [logMsg, ...activeServer.logs].slice(0, 50),
      });

      setServers((prev) => prev.map((s) => (s.id === activeServer.id ? updated : s)));
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* ─── HOSTING HEADER & PRODUCT OVERVIEW ─── */}
        <div className="border-b border-white/[0.06] bg-[#0A0D15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-2.5">
                  <Server className="h-3.5 w-3.5" />
                  <span>Cloud Node Hosting for ER:LC Communities</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  LibertyX Community Hosting
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                  Dedicated high-speed cloud instances for ER:LC custom bot integrations, community CAD/MDT systems, and Discord logging webhooks.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#07090E] text-right">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">SUBSCRIPTION PLAN</span>
                  <span className="text-xl font-mono font-black text-emerald-400">$12.99 USD</span>
                  <span className="text-[10px] text-zinc-500 block">per month / server</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-xs font-bold text-black transition shadow-md shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Deploy New Node</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MAIN HOSTING DASHBOARD ─── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          
          {servers.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-12 text-center max-w-lg mx-auto shadow-xl space-y-4">
              <Server className="w-12 h-12 text-blue-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Active Hosting Nodes</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Deploy an automated ER:LC bot hosting instance for your roleplay server with 99.99% uptime and instant webhook relays.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition"
              >
                <Plus className="w-4 h-4" />
                <span>Deploy Node ($12.99/mo)</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Pane: Server List (4 cols) */}
              <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-4 space-y-3 shadow-xl h-fit">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-xs font-bold text-white">My Community Servers</span>
                  <span className="text-[10px] font-mono text-zinc-500">{servers.length} Active</span>
                </div>

                <div className="space-y-2">
                  {servers.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveServerId(s.id)}
                      className={cn(
                        "w-full p-3.5 rounded-xl border text-left transition-all space-y-1",
                        s.id === activeServerId
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                          : "border-white/[0.06] bg-[#07090E] text-zinc-300 hover:text-white"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate text-white">{s.server_name}</span>
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{s.status}</span>
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono">Plan: {s.plan}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Pane: Active Server Console & Controls (8 cols) */}
              {activeServer && (
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Status & Controls Strip */}
                  <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-white">{activeServer.server_name}</h2>
                          <span className={cn(
                            "text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded",
                            activeServer.status === "online"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/10 text-red-400 border border-red-500/30"
                          )}>
                            ● {activeServer.status}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500 font-mono">ID: {activeServer.id}</span>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleServerAction("restart")}
                          disabled={actionBusy}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-[#07090E] hover:bg-white/[0.04] text-xs font-semibold text-zinc-200 transition"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-blue-400" />
                          <span>Restart</span>
                        </button>
                        {activeServer.status === "online" ? (
                          <button
                            type="button"
                            onClick={() => handleServerAction("stop")}
                            disabled={actionBusy}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs font-semibold text-red-400 transition"
                          >
                            <Square className="w-3.5 h-3.5" />
                            <span>Stop</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleServerAction("start")}
                            disabled={actionBusy}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-black transition"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Start</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3 rounded-xl border border-white/[0.04] bg-[#07090E]">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">CPU Load</span>
                        <span className="text-lg font-mono font-bold text-white">{activeServer.cpu_usage}%</span>
                      </div>

                      <div className="p-3 rounded-xl border border-white/[0.04] bg-[#07090E]">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Memory Used</span>
                        <span className="text-lg font-mono font-bold text-white">{activeServer.memory_usage_mb} MB / 2 GB</span>
                      </div>

                      <div className="p-3 rounded-xl border border-white/[0.04] bg-[#07090E]">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Uptime</span>
                        <span className="text-lg font-mono font-bold text-emerald-400">{activeServer.uptime}</span>
                      </div>

                      <div className="p-3 rounded-xl border border-white/[0.04] bg-[#07090E]">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Next Bill</span>
                        <span className="text-lg font-mono font-bold text-white">{activeServer.next_billing_date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Live Console Logs */}
                  <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Live Container Logs</span>
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-400">Stream Active</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#05070A] border border-white/[0.06] font-mono text-xs text-zinc-300 space-y-1 h-44 overflow-y-auto">
                      {activeServer.logs?.map((l: string, idx: number) => (
                        <p key={idx} className="leading-relaxed">{l}</p>
                      ))}
                    </div>
                  </div>

                  {/* Protected Environment Secrets */}
                  <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 shadow-xl space-y-3">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Protected Environment Variables</span>
                    </h3>

                    <div className="space-y-2">
                      {Object.entries(activeServer.env_vars || {}).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.04] bg-[#07090E] text-xs font-mono">
                          <span className="text-zinc-400 font-bold">{key}</span>
                          <span className="text-zinc-500">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Deploy Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0A0D15] border border-white/[0.1] rounded-2xl p-6 space-y-4 text-white">
            <h3 className="text-base font-bold text-white">Deploy LibertyX Community Node</h3>
            <p className="text-xs text-zinc-400">Deploy high-performance ER:LC bot hosting instance ($12.99 USD / month).</p>
            <form onSubmit={handleCreateServer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 font-mono">Server / Community Name</label>
                <input
                  type="text"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  placeholder="e.g. Liberty County State Roleplay Bot"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50"
                  required
                />
              </div>

              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs space-y-1 text-zinc-300">
                <div className="flex justify-between font-bold">
                  <span>Monthly Rate:</span>
                  <span className="text-emerald-400 font-mono">$12.99 USD / mo</span>
                </div>
                <p className="text-[11px] text-zinc-500">Includes 2GB RAM, sub-20ms Discord gateway, and automatic restart supervisor.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/[0.08] text-xs text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition"
                >
                  {creating ? "Provisioning…" : "Confirm Deployment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
