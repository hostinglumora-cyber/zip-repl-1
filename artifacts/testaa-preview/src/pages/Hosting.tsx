import React, { useEffect, useState } from "react";
import { Server, RotateCw, Play, Square, Plus, Terminal, Lock } from "lucide-react";

import PageShell from "@/components/PageShell";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";

export default function Hosting() {
  const { user } = useAuth();
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeServerId, setActiveServerId] = useState<string>("");
  const [newServerName, setNewServerName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

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
    <PageShell>
      <PageHeader 
        title="Host your community tools" 
        description="Dedicated high-speed cloud instances for ER:LC custom bot integrations."
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
        {servers.length === 0 ? (
          <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-8 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <Server className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-50">No Active Hosting Nodes</h3>
            <p className="text-sm text-slate-400">
              Deploy an automated ER:LC bot hosting instance for your roleplay server with 99.99% uptime.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy Node ($12.99/mo)</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Server List */}
            <div className="lg:col-span-1 bg-[#12151E] border border-white/[0.08] rounded-xl p-4 space-y-3 h-fit">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="text-xs font-semibold text-slate-50">My Servers</span>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="p-1 hover:bg-white/[0.06] rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
              <div className="space-y-2">
                {servers.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveServerId(s.id)}
                    className={cn(
                      "w-full p-3 rounded-lg border text-left transition-colors",
                      s.id === activeServerId
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-white/[0.08] bg-[#090A0F] text-slate-400 hover:text-slate-50 hover:bg-[#1C212E]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold truncate">{s.server_name}</span>
                      <span className="flex items-center gap-1 text-[10px] uppercase font-semibold">
                        <span className={cn("w-1.5 h-1.5 rounded-full", s.status === "online" ? "bg-emerald-400 animate-pulse" : "bg-rose-400")} />
                        {s.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Server Dashboard */}
            {activeServer && (
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-5 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-50 flex items-center gap-2">
                        {activeServer.server_name}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">ID: {activeServer.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleServerAction("restart")}
                        disabled={actionBusy}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] rounded-lg text-sm transition"
                      >
                        <RotateCw className="w-4 h-4" />
                        <span>Restart</span>
                      </button>
                      {activeServer.status === "online" ? (
                        <button
                          onClick={() => handleServerAction("stop")}
                          disabled={actionBusy}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm transition"
                        >
                          <Square className="w-4 h-4" />
                          <span>Stop</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleServerAction("start")}
                          disabled={actionBusy}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-sm transition"
                        >
                          <Play className="w-4 h-4" />
                          <span>Start</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Status", value: activeServer.status === 'online' ? 'Running' : 'Stopped' },
                      { label: "Memory", value: activeServer.status === 'online' ? `${activeServer.memory_usage_mb} MB` : '0 MB' },
                      { label: "Uptime", value: activeServer.status === 'online' ? activeServer.uptime : '-' },
                      { label: "Plan", value: activeServer.plan },
                    ].map((metric) => (
                      <div key={metric.label} className="bg-[#090A0F] border border-white/[0.08] rounded-lg p-3">
                        <span className="text-xs font-medium text-slate-500 uppercase">{metric.label}</span>
                        <p className="text-sm font-semibold text-slate-50 mt-1">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-5 shadow-sm space-y-3">
                  <h3 className="text-sm font-semibold text-slate-50 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Console Logs</span>
                  </h3>
                  <div className="bg-[#090A0F] border border-white/[0.08] rounded-lg p-3 h-48 overflow-y-auto font-mono text-xs text-slate-400 space-y-1">
                    {activeServer.logs?.map((l: string, idx: number) => (
                      <p key={idx}>{l}</p>
                    ))}
                  </div>
                </div>

                <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-5 shadow-sm space-y-3">
                  <h3 className="text-sm font-semibold text-slate-50 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Environment Variables</span>
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(activeServer.env_vars || {}).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-[#090A0F] border border-white/[0.08] rounded-lg text-sm">
                        <span className="font-semibold text-slate-300">{key}</span>
                        <span className="text-slate-500 font-mono text-xs">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090A0F]/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#12151E] border border-white/[0.08] rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-50">Deploy LibertyX Community Node</h3>
            <p className="text-xs text-slate-400">Deploy high-performance ER:LC bot hosting instance ($12.99 USD / month).</p>
            <form onSubmit={handleCreateServer} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Server Name</label>
                <input
                  type="text"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  placeholder="e.g. My RP Bot"
                  className="w-full bg-[#090A0F] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-50 focus:outline-none focus:border-emerald-500/30"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] rounded-lg text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-sm transition active:scale-[0.98]"
                >
                  {creating ? "Deploying..." : "Confirm Deployment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
}
