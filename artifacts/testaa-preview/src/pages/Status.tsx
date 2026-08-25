import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, RefreshCw, Server, Clock } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";

interface ServiceStatus {
  name: string;
  category: string;
  status: "operational" | "degraded" | "outage";
  uptime: string;
  latency: number;
}

const INCIDENTS = [
  {
    date: "Aug 24, 2026 — 20:00 UTC",
    title: "Database Indexing & Edge Caching Optimization",
    status: "Resolved",
    duration: "12m",
    description: "Applied global query indexing improvements. Zero downtime observed across all marketplace nodes.",
  },
  {
    date: "Aug 18, 2026 — 14:15 UTC",
    title: "Discord Webhook Rate-Limit Resolution",
    status: "Resolved",
    duration: "8m",
    description: "Upgraded webhook dispatch queue with automatic exponential backoff.",
  },
];

export default function Status() {
  const [healthData, setHealthData] = useState<any>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());
  const [refreshing, setRefreshing] = useState(false);

  const runHealthCheck = async () => {
    setRefreshing(true);
    try {
      const data = await localDb.getSystemHealth();
      setHealthData(data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } finally {
      setTimeout(() => setRefreshing(false), 250);
    }
  };

  useEffect(() => {
    runHealthCheck();
    const interval = setInterval(runHealthCheck, 15000);
    return () => clearInterval(interval);
  }, []);

  const overall = healthData?.overall || "operational";
  const overallLatency = healthData?.latency || 8;
  const nodes: ServiceStatus[] = healthData?.nodes || [];

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="text-center space-y-4">
          <div className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs font-semibold",
            overall === "operational"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-400"
          )}>
            <span className={cn("h-2 w-2 rounded-full", overall === "operational" ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse")} />
            <span>
              {overall === "operational" ? "All Systems Operational" : "Degraded Performance"}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">System Status</h1>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
            <span>Last updated: {lastRefreshed}</span>
            <button
              onClick={runHealthCheck}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Uptime", value: "99.99%" },
            { label: "Avg Latency", value: `${overallLatency}ms` },
            { label: "Escrow Speed", value: "< 1.2s" },
            { label: "Active Nodes", value: nodes.length },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#12151E] border border-white/[0.08] rounded-xl p-4 text-center">
              <span className="text-xs font-medium text-slate-500 uppercase">{stat.label}</span>
              <p className="text-2xl font-bold text-slate-50 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-50 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-500" />
            <span>Services</span>
          </h2>
          <div className="bg-[#12151E] border border-white/[0.08] rounded-xl overflow-hidden divide-y divide-white/[0.08]">
            {nodes.map((svc) => (
              <div key={svc.name} className="p-4 flex items-center justify-between hover:bg-[#1C212E] transition-colors">
                <div className="flex items-center gap-3">
                  {svc.status === "operational" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-50">{svc.name}</p>
                    <p className="text-xs text-slate-500">{svc.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-50">{svc.latency}ms</p>
                    <p className="text-xs text-slate-500">Latency</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-50">{svc.uptime}</p>
                    <p className="text-xs text-slate-500">Uptime</p>
                  </div>
                  <span className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-lg border",
                    svc.status === "operational" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  )}>
                    {svc.status === "operational" ? "Operational" : "Degraded"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-50 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-500" />
            <span>Incident History</span>
          </h2>
          <div className="space-y-4">
            {INCIDENTS.map((inc, i) => (
              <div key={i} className="bg-[#12151E] border border-white/[0.08] rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">{inc.date}</span>
                  <span className="text-[10px] font-semibold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {inc.status} • {inc.duration}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-50 mb-1">{inc.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{inc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
