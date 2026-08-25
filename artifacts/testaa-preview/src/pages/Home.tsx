const db = (globalThis as any).__B44_DB__ || { entities: new Proxy({}, { get: () => ({ filter: async () => [] }) }) };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ShieldCheck, Zap, Boxes, MessageCircle,
  ArrowUpRight, ChevronDown, Lock, Upload, BadgeCheck,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { DEPARTMENTS } from "@/lib/departments";
import { BRAND } from "@/lib/brand";
import { MarketplaceCard } from "@/pages/Marketplace";
import { cn } from "@/lib/utils";

export { MarketplaceCard as ListingCard };

const FAQS = [
  { q: "How does Scam-Shield escrow work?", a: "Codes vault-lock on upload and release automatically the moment payment clears — no DM trust required." },
  { q: "Are there listing fees?", a: "Zero. LibertyX charges no listing fees. Creators keep 100% of every transaction, always." },
  { q: "How do I earn a Verified badge?", a: "Complete 5 successful transactions with positive reviews. The badge applies automatically to your profile." },
  { q: "Can I sell fleet bundles?", a: "Yes. Package full department packs — Crown Vic, Tahoe, Charger, Explorer — into a single bundle with multi-code delivery." },
];

const FEATURES = [
  { icon: ShieldCheck, title: "Scam-Shield Escrow", desc: "Codes vault-locked until payment clears. Zero DM trust required." },
  { icon: Zap, title: "Sub-2s Code Delivery", desc: "Asset IDs, Pastebins, Drive links unlock instantly post-checkout." },
  { icon: BadgeCheck, title: "Verified Creator System", desc: "5-star reputation tracking and a verified badge for trusted sellers." },
  { icon: Boxes, title: "Fleet Bundle Builder", desc: "Package liveries, ELS, and uniforms into discounted mega-packs." },
  { icon: MessageCircle, title: "Discord Webhook Drops", desc: "Auto-post new drops to your Discord server the moment they go live." },
  { icon: Lock, title: "0% Listing Fees", desc: "Keep 100% of every sale. Always free to publish." },
];

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    db.entities.Listing.filter({ status: "active" }, "-created_date", 8)
      .then((rows: any[]) => setListings(rows || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen text-white" style={{ background: "#050505" }}>
      <SiteNav />

      {/* ── HERO ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ minHeight: "88vh", paddingTop: "80px", paddingBottom: "100px" }}
      >
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)",
          }}
        />
        {/* Bottom glow */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "900px", height: "380px",
            background: "radial-gradient(ellipse at bottom, rgba(16,185,129,0.13) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          {/* Pill */}
          <div
            className="inline-flex items-center gap-2 mb-8 rounded-full border px-4 py-1.5 text-xs font-medium"
            style={{ borderColor: "rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.05)", color: "#6ee7b7" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Zero listing fees · Scam-Shield escrow · 500+ creators
          </div>

          {/* Headline */}
          <h1
            className="text-white mb-6"
            style={{ fontSize: "clamp(2.6rem, 8vw, 5.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em" }}
          >
            The ER:LC marketplace<br />
            <span style={{ color: "#10b981" }}>built right.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed mb-10" style={{ color: "#6b7280" }}>
            Discover, sell, and deliver liveries, ELS profiles, uniform sets, and server templates — protected by automated escrow with zero listing fees.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-black transition hover:opacity-90"
              style={{ background: "#10b981" }}
            >
              Browse Marketplace <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 rounded-xl border px-7 py-3.5 text-sm font-medium transition hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "#9ca3af" }}
            >
              Upload Asset
            </Link>
          </div>
        </div>
      </section>

      {/* ── LISTINGS ── */}
      {!loading && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {listings.length === 0 ? (
            <div className="text-center rounded-2xl border py-24" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border mb-5" style={{ borderColor: "rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.06)" }}>
                <Upload className="h-6 w-6" style={{ color: "#10b981" }} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No listings yet</h2>
              <p className="text-sm mb-6" style={{ color: "#6b7280" }}>Be the first to publish an ER:LC asset and build the LibertyX catalog.</p>
              <Link to="/sell" className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-black" style={{ background: "#10b981" }}>
                <Upload className="h-4 w-4" /> Publish First Asset
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "#10b981" }}>Latest</p>
                  <h2 className="text-2xl font-bold text-white">Just published</h2>
                </div>
                <Link to="/marketplace" className="text-xs font-semibold flex items-center gap-1" style={{ color: "#10b981" }}>
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {listings.map((l) => <MarketplaceCard key={l.id} listing={l} />)}
              </div>
            </>
          )}
        </section>
      )}

      {/* ── STATS ── */}
      <section className="border-y py-12" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {([ ["500+", "Active Creators"], ["100%", "Escrow Protected"], ["< 2s", "Code Delivery"], ["0%", "Listing Fees"] ] as [string, string][]).map(([v, l]) => (
            <div key={l}>
              <p className="text-3xl font-extrabold font-mono" style={{ color: "#10b981" }}>{v}</p>
              <p className="text-xs font-medium mt-1" style={{ color: "#6b7280" }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-lg mx-auto mb-14">
          <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "#10b981" }}>Why LibertyX</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Built different.</h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "#6b7280" }}>Every feature built for ER:LC communities that take quality seriously.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border p-6 transition-all hover:border-white/10" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border mb-4" style={{ borderColor: "rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.06)", color: "#10b981" }}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEPARTMENTS ── */}
      <section className="py-16 border-t px-4 sm:px-6 lg:px-8" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: "#10b981" }}>ER:LC Units</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Every department. Every role.</h2>
            </div>
            <Link to="/marketplace" className="text-xs font-semibold flex items-center gap-1" style={{ color: "#10b981" }}>
              Browse all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DEPARTMENTS.map((d) => (
              <Link key={d.id} to={`/marketplace?dept=${d.id}`} className="group rounded-2xl border p-5 transition-all hover:border-white/10" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <div className="h-16 mb-4 flex items-center justify-center">
                  <img src={d.logo} alt={d.name} className="h-12 w-full object-contain transition-transform group-hover:scale-105" />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "#4b5563" }}>{d.short}</p>
                <h3 className="text-sm font-bold text-white mt-0.5">{d.name}</h3>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "#6b7280" }}>{d.blurb}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: "#10b981" }}>
                  Explore {d.short} <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 border-t px-4 sm:px-6 lg:px-8" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "#10b981" }}>FAQ</p>
            <h2 className="text-2xl font-extrabold text-white">Common questions.</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((f, i) => (
              <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white transition">
                  {f.q}
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200 shrink-0 ml-4", openFaq === i && "rotate-180")} style={{ color: openFaq === i ? "#10b981" : "#6b7280" }} />
                </button>
                {openFaq === i && (
                  <div className="border-t px-5 py-4 text-xs leading-relaxed" style={{ borderColor: "rgba(255,255,255,0.04)", color: "#9ca3af" }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl border p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6" style={{ borderColor: "rgba(16,185,129,0.15)", background: "linear-gradient(135deg, rgba(16,185,129,0.07), rgba(255,255,255,0.01) 70%)" }}>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "#10b981" }}>Start selling</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">Ready to publish your work?</h2>
            <p className="text-xs sm:text-sm leading-relaxed max-w-lg" style={{ color: "#6b7280" }}>
              Get your storefront live in under 2 minutes. Zero fees, automated escrow, Discord webhooks included.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/sell" className="rounded-xl px-5 py-3 text-xs font-bold text-black transition hover:opacity-90" style={{ background: "#10b981" }}>Create Listing →</Link>
            <a href={BRAND.discordUrl} target="_blank" rel="noreferrer" className="rounded-xl border px-5 py-3 text-xs font-medium transition hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#9ca3af" }}>Join Discord</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#030303" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 py-12">
        <div className="col-span-2 lg:col-span-1">
          <span className="text-lg font-bold block mb-3">
            <span className="text-white">Liberty</span><span style={{ color: "#10b981" }}>X</span>
          </span>
          <p className="text-xs leading-relaxed max-w-xs" style={{ color: "#6b7280" }}>The scam-protected marketplace for ER:LC creators.</p>
          <a href="https://discord.gg/YYqFdVp5Fw" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs hover:underline" style={{ color: "#10b981" }}>
            <MessageCircle className="h-3.5 w-3.5" style={{ color: "#5865f2" }} /> 500+ creators on Discord <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-3.5" style={{ color: "#d1d5db" }}>Explore</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/marketplace" className="hover:text-white transition" style={{ color: "#6b7280" }}>Marketplace</Link></li>
            <li><Link to="/status" className="hover:text-white transition" style={{ color: "#6b7280" }}>System Status</Link></li>
            <li><Link to="/sell" className="hover:text-white transition" style={{ color: "#6b7280" }}>Creator Studio</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-3.5" style={{ color: "#d1d5db" }}>Docs</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/docs" className="hover:text-white transition" style={{ color: "#6b7280" }}>Quickstart</Link></li>
            <li><Link to="/docs?page=selling" className="hover:text-white transition" style={{ color: "#6b7280" }}>Selling Guide</Link></li>
            <li><Link to="/docs?page=api" className="hover:text-white transition" style={{ color: "#6b7280" }}>API Reference</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-3.5" style={{ color: "#d1d5db" }}>Legal</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/privacy" className="hover:text-white transition" style={{ color: "#6b7280" }}>Privacy Policy</Link></li>
            <li><Link to="/tos" className="hover:text-white transition" style={{ color: "#6b7280" }}>Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs" style={{ borderColor: "rgba(255,255,255,0.06)", color: "#374151" }}>
        © {new Date().getFullYear()} LibertyX Marketplace. Not affiliated with Roblox Corporation.
      </div>
    </footer>
  );
}
