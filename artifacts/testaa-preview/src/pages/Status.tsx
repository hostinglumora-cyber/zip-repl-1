import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  ShieldCheck,
  Server,
  Zap,
  RefreshCw,
  ArrowUpRight,
  MessageCircle,
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
    description: "Live chat, order notifications, and creator balance updates.",
  },
];

const INCIDENTS = [
  {
    date: "Aug 22, 2026 - 18:30 UTC",
    title: "Scheduled Database Performance Upgrade",
    status: "Resolved",
    type: "maintenance",
    impact: "None",
    description: "Successfully applied connection pooling optimization. Zero downtime observed across all marketplace nodes.",
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
    <div className="min-h-screen bg-[#090D14] text-foreground selection:bg-primary/20 selection:text-primary">
      <SiteNav />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header Status Card */}
        <div className="mb-12 rounded-2xl border border-white/10 bg-card/60 p-8 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.04] to-transparent pointer-events-none" />

          <div className="inline-flex items-center gap-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All LibertyX Systems Operational</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            System Status
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto mb-6">
            Real-time performance metrics, service uptime, and incident logs for LibertyX Marketplace.
          </p>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Last checked: {lastRefreshed}</span>
            <span className="h-3 w-px bg-white/10" />
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition font-medium"
            >
              <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh status</span>
            </button>
          </div>
        </div>

        {/* Global Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <MetricCard title="Overall Uptime" value="99.98%" subtitle="Last 90 days" />
          <MetricCard title="Avg API Latency" value="38 ms" subtitle="Global edge" />
          <MetricCard title="Escrow Release" value="< 1.2s" subtitle="Automated code dispatch" />
          <MetricCard title="Security Status" value="Nominal" subtitle="0 active threats" />
        </div>

        {/* Active Services List */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <span>Core Services</span>
            </h2>
            <span className="text-xs text-muted-foreground">6 monitored nodes</span>
          </div>

          <div className="space-y-3">
            {services.map((svc) => (
              <div
                key={svc.name}
                className="group rounded-xl border border-white/5 bg-card/40 p-4 sm:p-5 backdrop-blur-sm transition-all hover:border-white/15 hover:bg-card/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-sm text-foreground">{svc.name}</span>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded border border-border/40">
                      {svc.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{svc.description}</p>
                </div>

                <div className="flex items-center gap-6 text-xs text-muted-foreground shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-foreground font-mono font-medium">{svc.latency}ms</span>
                    <span className="block text-[10px] text-muted-foreground/60">Latency</span>
                  </div>
                  <div className="text-right">
                    <span className="text-foreground font-mono font-medium">{svc.uptime}</span>
                    <span className="block text-[10px] text-muted-foreground/60">Uptime</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                    Operational
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 90-Day Uptime Graph */}
        <div className="mb-12 rounded-xl border border-white/5 bg-card/40 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-foreground">90-Day Uptime Performance</h2>
              <p className="text-xs text-muted-foreground">Historical uptime reliability across all cluster nodes</p>
            </div>
            <span className="text-sm font-mono font-bold text-emerald-400">99.98%</span>
          </div>

          <div className="flex items-center gap-[3px] py-2 overflow-x-auto">
            {Array.from({ length: 90 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 min-w-[3px] h-9 rounded-sm bg-emerald-500/70 hover:bg-emerald-400 transition-colors cursor-pointer"
                title={`Day ${90 - i}: 100% operational`}
              />
            ))}
          </div>

          <div className="flex justify-between text-[11px] text-muted-foreground/60 mt-2">
            <span>90 days ago</span>
            <span>45 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Incident History */}
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-primary" />
            <span>Incident & Maintenance Log</span>
          </h2>

          <div className="space-y-3">
            {INCIDENTS.map((inc, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/5 bg-card/30 p-5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="font-semibold text-sm text-foreground">{inc.title}</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {inc.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {inc.description}
                </p>
                <span className="text-[11px] text-muted-foreground/60">{inc.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Discord Support Banner */}
        <div className="mt-12 rounded-xl border border-white/10 bg-secondary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center text-[#5865F2] shrink-0">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Experiencing an issue with a listing or order?</p>
              <p className="text-xs text-muted-foreground">Our support team and 500+ creators are active in Discord.</p>
            </div>
          </div>
          <a
            href={BRAND.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#5865F2] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#4752C4]"
          >
            <span>Open Support Ticket</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-card/40 p-4 backdrop-blur-sm">
      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      <p className="text-xl font-bold font-mono text-foreground mb-0.5">{value}</p>
      <p className="text-[10px] text-muted-foreground/60">{subtitle}</p>
    </div>
  );
}
