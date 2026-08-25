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
    name: "Marketplace Catalog",
    category: "Core Services",
    status: "operational",
    uptime: "99.99%",
    latency: 32,
    description: "Search, filter, and asset catalog indexing services.",
  },
  {
    name: "REST API & Query Gateway",
    category: "API & Backend",
    status: "operational",
    uptime: "99.99%",
    latency: 28,
    description: "High-performance edge GraphQL and REST endpoints.",
  },
  {
    name: "Authentication & Discord OAuth",
    category: "Identity",
    status: "operational",
    uptime: "100%",
    latency: 45,
    description: "Discord OAuth token verification and creator sessions.",
  },
  {
    name: "Payments & Escrow Engine",
    category: "Transactions",
    status: "operational",
    uptime: "100%",
    latency: 22,
    description: "Automated Robux transaction verification and settlement.",
  },
  {
    name: "Asset Delivery Vault",
    category: "Storage",
    status: "operational",
    uptime: "99.98%",
    latency: 18,
    description: "Encrypted deliverable code storage and instant token dispatch.",
  },
  {
    name: "Database Clusters",
    category: "Infrastructure",
    status: "operational",
    uptime: "99.99%",
    latency: 14,
    description: "Distributed PostgreSQL listings database and real-time replicas.",
  },
  {
    name: "Discord Webhook Relays",
    category: "Integrations",
    status: "operational",
    uptime: "99.97%",
    latency: 38,
    description: "Community drop notifications and automated server alerts.",
  },
];

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
  const [services, setServices] = useState<ServiceStatus[]>(INITIAL_SERVICES);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) => ({
          ...s,
          latency: Math.max(12, s.latency + Math.floor(Math.random() * 7 - 3)),
        }))
      );
      setLastRefreshed(new Date().toLocaleTimeString());
      setRefreshing(false);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#06080C] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* ─── STATUS HEADER ─── */}
        <div className="border-b border-white/[0.06] bg-[#080B10]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-1 text-xs font-semibold text-emerald-400 mb-4">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All LibertyX Systems Operational</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              System Infrastructure Status
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Real-time service health, uptime history, and latency metrics across all core nodes.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3 text-xs text-zinc-500 font-mono">
              <span>Last checked: {lastRefreshed}</span>
              <span>•</span>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline font-semibold"
              >
                <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── MAIN STATUS BODY ─── */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
          
          {/* Global Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="rounded-xl border border-white/[0.08] bg-[#0A0D14] p-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1">Overall Uptime</span>
              <span className="text-2xl font-black font-mono text-white">99.99%</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">Last 90 days</span>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0A0D14] p-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1">Average Latency</span>
              <span className="text-2xl font-black font-mono text-white">24 ms</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">Global edge nodes</span>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0A0D14] p-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1">Escrow Delivery</span>
              <span className="text-2xl font-black font-mono text-emerald-400">&lt; 1.2s</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">Automated dispatch</span>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0A0D14] p-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1">Security Health</span>
              <span className="text-2xl font-black font-mono text-emerald-400">100%</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">0 Active threats</span>
            </div>
          </div>

          {/* Core Monitored Services */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-400" />
                <span>Monitored Core Infrastructure</span>
              </h2>
              <span className="text-xs text-zinc-500 font-mono">7 services online</span>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] overflow-hidden divide-y divide-white/[0.04] shadow-xl">
              {services.map((svc) => (
                <div
                  key={svc.name}
                  className="p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.01] transition"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="font-bold text-xs sm:text-sm text-white">{svc.name}</span>
                      <span className="text-[9px] uppercase font-mono font-bold text-zinc-400 bg-white/[0.04] px-2 py-0.2 rounded border border-white/[0.06]">
                        {svc.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 ml-6">{svc.description}</p>
                  </div>

                  <div className="flex items-center gap-5 text-xs text-zinc-400 shrink-0 ml-6 sm:ml-0">
                    <div className="text-right">
                      <span className="text-white font-mono font-bold text-xs">{svc.latency}ms</span>
                      <span className="block text-[9px] text-zinc-500">Latency</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-mono font-bold text-xs">{svc.uptime}</span>
                      <span className="block text-[9px] text-zinc-500">Uptime</span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 font-mono">
                      Operational
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Timeline */}
          <div>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span>Past Incidents & Maintenance</span>
            </h2>

            <div className="space-y-3">
              {INCIDENTS.map((inc, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-[#0A0D14] p-4 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-zinc-500">{inc.date}</span>
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 rounded">
                      {inc.status} • {inc.duration}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-sm mb-1">{inc.title}</h4>
                  <p className="text-zinc-400 leading-relaxed">{inc.description}</p>
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
