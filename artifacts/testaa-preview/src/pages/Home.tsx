const db = globalThis.__B44_DB__ || { entities: new Proxy({}, { get: () => ({ filter: async () => [] }) }) };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ShieldCheck, Store, Sparkles, Zap, Boxes, MessageCircle,
  ArrowUpRight, ChevronDown, Shield, Flame, Truck, Car, Lock, Star,
  BadgeCheck, Upload, Search, Users, TrendingUp, Package
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { DEPARTMENTS } from "@/lib/departments";
import { BRAND } from "@/lib/brand";
import { MarketplaceCard } from "@/pages/Marketplace";
import { cn } from "@/lib/utils";

export { MarketplaceCard as ListingCard };

const FAQS = [
  {
    q: "How does the Scam-Shield escrow vault work?",
    a: "When a creator publishes an asset, deliverable tokens (Roblox asset IDs, Drive links, Pastebins) are encrypted in our escrow vault. Once a buyer checks out, codes release automatically with verifiable receipt tracking.",
  },
  {
    q: "Are there listing fees?",
    a: "No. LibertyX maintains a 0% listing fee policy. Creators keep 100% of their listed value on free giveaways and Robux-priced assets alike.",
  },
  {
    q: "How do I get the Verified Creator badge?",
    a: "Link your Roblox account and complete 5 successful scam-free transactions with positive reviews. The badge is applied automatically to your profile and listings.",
  },
  {
    q: "Can I sell multi-vehicle fleet bundles?",
    a: "Yes. The Creator Studio lets you package full department packs (Crown Vic, Tahoe, Charger, Explorer) into a single discounted bundle with multi-code delivery.",
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Scam-Shield Escrow",
    desc: "Deliverable codes are vault-locked until payment clears. No more DM scams or lost asset links.",
  },
  {
    icon: Zap,
    title: "Instant Code Delivery",
    desc: "Roblox asset IDs, Pastebins, and Drive links unlock in under two seconds post-checkout.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Creator System",
    desc: "5-star reputation tracking, review system, and an official verified badge for trusted sellers.",
  },
  {
    icon: Boxes,
    title: "Fleet Bundle Builder",
    desc: "Package liveries, ELS, and uniform sets into discounted mega-packs with one click.",
  },
  {
    icon: MessageCircle,
    title: "Discord Webhook Drops",
    desc: "Auto-post new asset drops to your Discord server the moment they go live.",
  },
  {
    icon: Lock,
    title: "0% Listing Fees",
    desc: "Keep 100% of every sale. Publish free or paid — we never take a cut.",
  },
];

const DEPT_TABS = [
  { id: "Police", label: "Police", icon: Shield },
  { id: "Sheriff", label: "Sheriff", icon: Car },
  { id: "Fire", label: "Fire & Rescue", icon: Flame },
  { id: "DOT", label: "DOT", icon: Truck },
];

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Police");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.Listing.filter({ status: "active" }, "-created_date", 50)
      .then((rows: any[]) => setListings(rows || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const deptListings = listings.filter((l) => {
    const depts = (l.departments || []).map((d: string) => d.toLowerCase());
    return depts.some((d: string) => d === activeTab.toLowerCase() || d === activeTab);
  }).slice(0, 4);

  const recentListings = listings.slice(0, 8);

  return (
    <div className="min-h-screen text-foreground" style={{ backgroundColor: "#080B11" }}>
      <SiteNav />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]" style={{ paddingTop: "80px", paddingBottom: "90px" }}>
        {/* Barely-there vertical lines grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
        {/* Single low-key green glow at very top center */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: "600px",
            height: "300px",
            background: "radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          {/* Status pill */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3.5 py-1 text-[11px] font-medium" style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400">Marketplace</span>
            <span className="h-3 w-px bg-white/10" />
            <span className="text-zinc-300">Operational</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.08]">
            The ultimate marketplace{" "}
            <br className="hidden sm:block" />
            <span className="text-emerald-400">for ER:LC creators.</span>
          </h1>

          {/* Sub-copy */}
          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-400">
            Discover, sell, and deliver high-quality liveries, ELS profiles, uniform sets, and server templates — protected by automated Scam-Shield escrow with 0% listing fees.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-emerald-400"
            >
              Browse Marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] px-6 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              Upload Asset
            </Link>
          </div>

          {/* Trust chips */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Scam-Shield Escrow</span>
            <span className="h-1 w-1 rounded-full bg-zinc-600 hidden sm:block" />
            <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-emerald-400" /> 0% Listing Fees</span>
            <span className="h-1 w-1 rounded-full bg-zinc-600 hidden sm:block" />
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-emerald-400" /> Instant Delivery</span>
            <span className="h-1 w-1 rounded-full bg-zinc-600 hidden sm:block" />
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-emerald-400" /> 500+ Creators</span>
          </div>
        </div>
      </section>

      {/* ─── REAL LISTINGS or EMPTY STATE ─── */}
      {!loading && listings.length === 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="rounded-2xl border border-white/[0.06] p-10 sm:p-16" style={{ background: "rgba(255,255,255,0.02)" }}>
            <Store className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No listings published yet</h2>
            <p className="text-sm text-zinc-400 mb-6">
              Be the first to publish an ER:LC asset and build the LibertyX catalog.
            </p>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition"
            >
              <Upload className="h-4 w-4" />
              Publish Your First Asset
            </Link>
          </div>
        </section>
      )}

      {!loading && listings.length > 0 && (
        <>
          {/* Recent Listings Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-1.5">Latest Drops</p>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Just Published</h2>
              </div>
              <Link to="/marketplace" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentListings.map((l) => (
                <MarketplaceCard key={l.id} listing={l} />
              ))}
            </div>
          </section>

          {/* Department Browse Section */}
          <section className="py-16 border-t border-white/[0.06] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-1.5">Browse by Department</p>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Department Directory</h2>
              </div>
              <div className="flex items-center gap-1.5">
                {DEPT_TABS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                        activeTab === t.id
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "text-zinc-400 border border-transparent hover:text-white hover:bg-white/[0.04]"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {deptListings.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {deptListings.map((l) => (
                  <MarketplaceCard key={l.id} listing={l} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/[0.08] py-12 text-center">
                <p className="text-sm text-zinc-500">No {activeTab} assets yet.</p>
                <Link to="/sell" className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline">
                  <Upload className="h-3.5 w-3.5" /> Publish one
                </Link>
              </div>
            )}
          </section>
        </>
      )}

      {/* ─── STATS BAR ─── */}
      <section className="border-y border-white/[0.06] py-12" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat val="500+" label="Active Creators" />
            <Stat val="100%" label="Escrow Delivery" />
            <Stat val="< 2s" label="Code Release" />
            <Stat val="0%" label="Listing Fees" />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-2">Why LibertyX</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built different.
          </h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            Every feature was designed for ER:LC communities that take asset quality seriously.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/[0.06] p-6 transition hover:border-white/[0.15]"
              style={{ background: "#0C0F17" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] text-emerald-400 mb-4" style={{ background: "rgba(16,185,129,0.06)" }}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DEPARTMENT CARDS ─── */}
      <section className="py-16 border-t border-white/[0.06] px-4 sm:px-6 lg:px-8" style={{ background: "#090C13" }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-1.5">ER:LC Units</p>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white">Every department. Every role.</h2>
            </div>
            <Link to="/marketplace" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
              Browse all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DEPARTMENTS.map((d) => (
              <Link
                key={d.id}
                to={`/marketplace?dept=${d.id}`}
                className="group rounded-2xl border border-white/[0.06] p-5 transition hover:border-white/[0.14] hover:bg-white/[0.02]"
                style={{ background: "#0C0F17" }}
              >
                <div className="h-18 mb-4 flex items-center justify-center">
                  <img src={d.logo} alt={d.name} className="h-14 w-full object-contain transition-transform group-hover:scale-105" />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{d.short}</p>
                <h3 className="text-sm font-bold text-white mt-0.5">{d.name}</h3>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{d.blurb}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400">
                  Explore {d.short} <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 border-t border-white/[0.06] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-2">FAQ</p>
            <h2 className="text-2xl font-extrabold text-white">Common questions.</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((f, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: "#0C0F17" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-xs sm:text-sm font-medium text-zinc-200 hover:text-white transition"
                >
                  {f.q}
                  <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform duration-200 shrink-0 ml-4", openFaq === i && "rotate-180 text-emerald-400")} />
                </button>
                {openFaq === i && (
                  <div className="border-t border-white/[0.04] px-5 py-4 text-xs text-zinc-400 leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-emerald-500/[0.15] p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.05), #0C0F17 60%)" }}>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-2">Start selling</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">Ready to publish your work?</h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed">
              Get your storefront live in under 2 minutes. Zero fees, automated escrow, and Discord drop webhooks included.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/sell" className="rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-black hover:bg-emerald-400 transition">
              Create Listing →
            </Link>
            <a href={BRAND.discordUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-white/[0.1] px-5 py-3 text-xs font-medium text-zinc-300 hover:bg-white/[0.04] transition" style={{ background: "rgba(255,255,255,0.02)" }}>
              Join Discord
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ val, label }: { val: string; label: string }) {
  return (
    <div>
      <p className="text-2xl sm:text-3xl font-extrabold font-mono text-white">{val}</p>
      <p className="mt-1 text-xs text-zinc-400 font-medium">{label}</p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]" style={{ background: "#07090E" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 py-12">
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-3">
            <LxMark size={28} />
            <span className="font-bold text-white">Liberty<span className="text-emerald-400">X</span></span>
          </div>
          <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">{BRAND.tagline}</p>
          <a href={BRAND.discordUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline">
            <MessageCircle className="h-3.5 w-3.5 text-[#5865F2]" /> 500+ creators on Discord <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3.5">Explore</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/marketplace" className="text-zinc-400 hover:text-white">Marketplace</Link></li>
            <li><Link to="/status" className="text-zinc-400 hover:text-white">System Status</Link></li>
            <li><Link to="/sell" className="text-zinc-400 hover:text-white">Creator Studio</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3.5">Docs</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/docs" className="text-zinc-400 hover:text-white">Quickstart</Link></li>
            <li><Link to="/docs?page=selling" className="text-zinc-400 hover:text-white">Selling Guide</Link></li>
            <li><Link to="/docs?page=api" className="text-zinc-400 hover:text-white">REST API</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3.5">Legal</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/privacy" className="text-zinc-400 hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/tos" className="text-zinc-400 hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06] py-4 text-center text-[11px] text-zinc-600">
        © {new Date().getFullYear()} {BRAND.name}. Not affiliated with Roblox Corporation.
      </div>
    </footer>
  );
}

// Minimal clean LX mark for footer use
function LxMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 8C5 6.3 6.3 5 8 5H12V23C12 24.1 12.9 25 14 25H25V29C25 30.1 24.1 31 23 31H8C6.3 31 5 29.7 5 28V8Z" fill="white" fillOpacity="0.9"/>
      <path d="M16 6.5C16 5.7 16.7 5 17.5 5H25C28.3 5 31 7.7 31 11V17C31 17.8 30.3 18.5 29.5 18.5H25V13.5C25 12.1 23.9 11 22.5 11H16V6.5Z" fill="white" fillOpacity="0.5"/>
      <path d="M14 17L26 29C27 30 28.5 29.3 28.5 28V24L20 15.5H15.5C14.4 15.5 13.5 16.5 14 17Z" fill="#10B981"/>
    </svg>
  );
}
