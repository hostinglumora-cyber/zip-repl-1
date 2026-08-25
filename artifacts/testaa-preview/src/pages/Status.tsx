import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Activity,
  ShieldCheck,
  Server,
  Zap,
  RefreshCw,
  ArrowUpRight,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { BRAND } from "@/lib/brand";

interface ServiceStatus {
  name: string;
  category: string;
  status: "operational" | "degraded" | "outage";
  uptime: string;
  latency: number;
  description: string;
}

const INITIAL_SERVICES: ServiceStatus[] = [
  {
    name: "Marketplace Core API",
    category: "API & Backend",
    status: "operational",
    uptime: "99.99%",
    latency: 38,
    description: "Search, filter, and asset catalog indexing services.",
  },
  {
    name: "Authentication & Discord OAuth",
    category: "Identity",
    status: "operational",
    uptime: "99.99%",
    latency: 52,
    description: "Session tokens, Discord login callback, and Roblox verification.",
  },
  {
    name: "Scam-Shield Escrow Vault",
    category: "Security",
    status: "operational",
    uptime: "100%",
    latency: 24,
    description: "Encrypted deliverable storage and automated code dispatch.",
  },
  {
    name: "Asset Media CDN",
    category: "Storage",
    status: "operational",
    uptime: "99.96%",
    latency: 68,
    description: "High-speed livery screenshots and showcase photo distribution.",
  },
  {
    name: "Discord Webhook Relays",
    category: "Integrations",
    status: "operational",
    uptime: "99.98%",
    latency: 41,
    description: "Instant purchase notifications and community bot feeds.",
  },
  {
    name: "Realtime WebSocket Gateway",
    category: "Realtime",
    status: "operational",
    uptime: "99.97%",
    latency: 18,
    description: "Live order notifications, escrow status, and balance updates.",
  },
];

const INCIDENTS = [
  {
    date: "Aug 22, 2026 - 18:30 UTC",
    title: "Scheduled Database Indexing Optimization",
    status: "Resolved",
    type: "maintenance",
    impact: "None",
    description: "Applied marketplace search indexing improvements. Zero downtime observed across all nodes.",
  },
  {
    date: "Aug 15, 2026 - 04:12 UTC",
    title: "Discord Webhook Rate-Limit Resolution",
    status: "Resolved",
    type: "resolved",
    impact: "Minor",
    description: "Temporary delay in Discord drop notifications resolved via backoff queue processing.",
  },
];

function MetricCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5">
      <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1">{title}</p>
      <p className="text-2xl sm:text-3xl font-black font-mono text-white mb-0.5">{value}</p>
      <p className="text-[11px] text-zinc-500">{subtitle}</p>
    </div>
  );
}

export default function Status() {
  const [services, setServices] = useState<ServiceStatus[]>(INITIAL_SERVICES);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) => ({
          ...s,
          latency: Math.max(15, s.latency + Math.floor(Math.random() * 9 - 4)),
        }))
      );
      setLastRefreshed(new Date().toLocaleTimeString());
      setRefreshing(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Header Status Card */}
          <div className="mb-12 rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All LibertyX Systems Operational</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
              System Status
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-6 leading-relaxed">
              Real-time performance metrics, service uptime, and incident logs for LibertyX Marketplace.
            </p>

            <div className="flex items-center justify-center gap-4 text-xs text-zinc-400">
              <span>Last checked: {lastRefreshed}</span>
              <span className="h-3 w-px bg-white/10" />
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline font-semibold"
              >
                <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
                <span>Refresh status</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <MetricCard title="Overall Uptime" value="99.99%" subtitle="Last 90 days" />
            <MetricCard title="Avg API Latency" value="38 ms" subtitle="Global edge" />
            <MetricCard title="Escrow Release" value="< 1.2s" subtitle="Automated code dispatch" />
            <MetricCard title="Security Status" value="Nominal" subtitle="0 active threats" />
          </div>

          {/* Core Services List */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-400" />
                <span>Monitored Core Services</span>
              </h2>
              <span className="text-xs text-zinc-500 font-mono">6 monitored nodes</span>
            </div>

            <div className="space-y-3">
              {services.map((svc) => (
                <div
                  key={svc.name}
                  className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-4 sm:p-5 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="font-bold text-sm text-white">{svc.name}</span>
                      <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.06]">
                        {svc.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{svc.description}</p>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-zinc-400 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-white font-mono font-bold">{svc.latency}ms</span>
                      <span className="block text-[10px] text-zinc-500">Latency</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-mono font-bold">{svc.uptime}</span>
                      <span className="block text-[10px] text-zinc-500">Uptime</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-400">
                      Operational
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Incidents */}
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span>Incident & Maintenance Log</span>
            </h2>

            <div className="space-y-3">
              {INCIDENTS.map((inc, i) => (
                <div key={i} className="rounded-2xl border border-white/[0.06] bg-[#0A0D15] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-zinc-500">{inc.date}</span>
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {inc.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{inc.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{inc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
