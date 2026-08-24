import React from "react";
import { CheckCircle2, AlertCircle, Clock, Activity } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";

const SERVICES = [
  { name: "Marketplace", status: "operational", uptime: "99.98%", latency: "142ms" },
  { name: "Authentication", status: "operational", uptime: "99.99%", latency: "88ms" },
  { name: "File Storage", status: "operational", uptime: "99.95%", latency: "210ms" },
  { name: "Payments", status: "operational", uptime: "99.97%", latency: "340ms" },
  { name: "Realtime", status: "operational", uptime: "99.99%", latency: "45ms" },
];

const INCIDENTS = [
  { date: "Aug 21, 2026", title: "Scheduled maintenance completed", status: "resolved", type: "maintenance" },
  { date: "Aug 14, 2026", title: "Brief file upload delay", status: "resolved", type: "incident" },
];

const UPTIME_DAYS = 90;

export default function Status() {
  const allOperational = SERVICES.every((s) => s.status === "operational");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-5 ${allOperational ? "bg-primary/10 border border-primary/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${allOperational ? "bg-primary" : "bg-amber-400"} animate-pulse`} />
            <span className={`font-medium ${allOperational ? "text-primary" : "text-amber-400"}`}>
              {allOperational ? "All systems operational" : "Partial outage"}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">System Status</h1>
          <p className="text-muted-foreground">Real-time status of Siren services.</p>
        </div>

        <div className="space-y-3 mb-12">
          {SERVICES.map((s) => (
            <div key={s.name} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-medium">{s.name}</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-muted-foreground hidden sm:inline">{s.latency}</span>
                <span className="text-muted-foreground hidden sm:inline">{s.uptime}</span>
                <span className="text-primary text-sm font-medium">Operational</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">90-day uptime</h2>
            <span className="text-sm text-primary">99.97% uptime</span>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: UPTIME_DAYS }).map((_, i) => (
              <div key={i} className="flex-1 h-10 rounded-sm bg-primary/70 hover:bg-primary transition" title="Operational" />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>90 days ago</span><span>Today</span>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Past incidents</h2>
          <div className="space-y-3">
            {INCIDENTS.map((inc, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
                {inc.type === "maintenance" ? <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{inc.title}</span>
                    <span className="text-xs text-primary">Resolved</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{inc.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}