const db = (globalThis as any).__B44_DB__ || { entities: new Proxy({}, { get: () => ({ filter: async () => [] }) }) };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Boxes,
  MessageCircle,
  ArrowUpRight,
  ChevronDown,
  Lock,
  Upload,
  BadgeCheck,
  Flame,
  Shield,
  Car,
  Truck,
  Sparkles,
  Compass,
  Layers,
  Star,
  Tag,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Store,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { DEPARTMENTS } from "@/lib/departments";
import { BRAND } from "@/lib/brand";
import { MarketplaceCard } from "@/pages/Marketplace";
import { cn } from "@/lib/utils";

export { MarketplaceCard as ListingCard };

const FAQS = [
  {
    id: "escrow",
    q: "How does the Scam-Shield escrow protocol work?",
    a: "When a creator publishes an asset, deliverable keys (Roblox asset IDs, livery files, Pastebin hashes, Google Drive links) are securely vault-locked. As soon as a transaction clears, the release protocol delivers the key to the buyer with an unalterable receipt and proof of provenance.",
  },
  {
    id: "fees",
    q: "Are there any listing or platform commission fees?",
    a: "No. LibertyX operates on a strict 0% listing fee model. Creators keep 100% of their earnings on both free community releases and Robux-priced packs.",
  },
  {
    id: "verified",
    q: "How do creators earn the Verified Creator badge?",
    a: "Verified Creator status is awarded to creators with a proven track record of 5+ verified scam-free escrow fulfillments and positive customer feedback. Badging is audited and granted automatically to creator profiles and listings.",
  },
  {
    id: "bundles",
    q: "Can I bundle multi-vehicle fleet liveries and ELS profiles together?",
    a: "Yes. The Creator Studio includes a multi-asset bundle generator allowing you to link liveries for Tahoe, Crown Vic, Charger, and Explorer alongside custom siren soundbanks and ELS configs in a single package with multi-code delivery.",
  },
  {
    id: "delivery",
    q: "How fast are digital asset keys delivered after purchase?",
    a: "Delivery is instant and automated. Deliverable keys unlock directly into your buyer dashboard and transaction receipt in under 2 seconds after checkout.",
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    tag: "SECURITY PROTOCOL",
    title: "Scam-Shield Escrow",
    desc: "Digital deliverable keys are encrypted inside an isolated vault. No direct message handoffs or lost file links.",
  },
  {
    icon: Zap,
    tag: "SUB-2S LATENCY",
    title: "Instant Code Delivery",
    desc: "Roblox asset IDs and download links unlock into the buyer's inventory instantly upon payment clearance.",
  },
  {
    icon: BadgeCheck,
    tag: "REPUTATION ENGINE",
    title: "Verified Creator System",
    desc: "Community ratings, verified ER:LC track records, and tamper-proof seller provenance for peace of mind.",
  },
  {
    icon: Boxes,
    tag: "STUDIO TOOLS",
    title: "Fleet Bundle Generator",
    desc: "Package entire agency fleets, liveries, ELS configs, and uniform assets into discounted multi-tier bundles.",
  },
  {
    icon: MessageCircle,
    tag: "COMMUNITY SYNC",
    title: "Discord Webhook Drops",
    desc: "Broadcast newly published liveries, price drops, and updates automatically to your community Discord server.",
  },
  {
    icon: Lock,
    tag: "100% TO CREATORS",
    title: "0% Marketplace Cut",
    desc: "Keep 100% of your earnings. No hidden platform cuts, no monthly developer subscriptions, always free to publish.",
  },
];

const STATS = [
  { val: "500+", label: "Verified Creators", sub: "Active ER:LC Designers" },
  { val: "100%", label: "Escrow Protected", sub: "Zero-Scam Delivery" },
  { val: "< 2s", label: "Delivery Latency", sub: "Instant Token Release" },
  { val: "0%", label: "Platform Cut", sub: "Creators Keep 100%" },
];

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    db.entities.Listing.filter({ status: "active" }, "-created_date", 20)
      .then((rows: any[]) => setListings(rows || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const displayedListings = listings.filter((l) => {
    if (selectedDept === "All") return true;
    return l.departments?.some((d: string) => d.toLowerCase() === selectedDept.toLowerCase());
  }).slice(0, 8);

  return (
    <div className="min-h-screen text-white bg-[#07090E] selection:bg-emerald-500/25 selection:text-emerald-300">
      <SiteNav />

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-white/[0.06] overflow-hidden">
        {/* Subtle geometric grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Ambient Top Glow (Subtle & Refined) */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-64 opacity-15"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.45) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono uppercase tracking-wider text-[11px]">ER:LC Marketplace 2.0</span>
            <span className="h-3 w-px bg-emerald-500/30" />
            <span className="text-zinc-300">Scam-Shield Escrow</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
            The verified marketplace for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              ER:LC liveries, ELS & assets.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            Discover high-detail fleet packs, custom uniform sets, ELS configurations, and server map templates. Backed by instant escrow delivery and zero platform fees.
          </p>

          {/* Action CTAs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-8 py-4 text-sm sm:text-base font-bold text-black shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Compass className="w-5 h-5" />
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/sell"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.12] bg-[#0E121B] hover:bg-[#131924] hover:border-emerald-500/30 px-8 py-4 text-sm sm:text-base font-semibold text-white transition-all shadow-md"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Publish Asset</span>
            </Link>
          </div>

          {/* Metric Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {STATS.map((s, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.07] bg-[#0B0E15]/80 p-4 text-left backdrop-blur-md hover:border-emerald-500/30 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{s.val}</span>
                  <span className="text-[10px] font-mono text-zinc-500">0{idx + 1}</span>
                </div>
                <p className="text-xs font-bold text-white leading-tight">{s.label}</p>
                <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIVE MARKETPLACE SHOWCASE (BROUGHT UP HIGH) ─── */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Featured Community Releases
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {["All", "Police", "Sheriff", "Fire", "DOT"].map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all",
                  selectedDept === dept
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm"
                    : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                {dept === "All" ? "All Departments" : dept}
              </button>
            ))}

            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline ml-2"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Listings Grid or Empty State */}
        {!loading && displayedListings.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-[#0A0E15] p-12 sm:p-16 text-center max-w-2xl mx-auto shadow-xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mx-auto mb-5 shadow-inner">
              <Store className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No assets found in this department</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6 max-w-md mx-auto leading-relaxed">
              Be the first creator to upload a verified livery, ELS profile, or server map pack for this department.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-black transition shadow-lg shadow-emerald-500/20"
              >
                <Upload className="w-4 h-4" />
                <span>Publish First Asset</span>
              </Link>
              <button
                type="button"
                onClick={() => setSelectedDept("All")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white transition"
              >
                Reset Filter
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayedListings.map((listing) => (
              <MarketplaceCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* ─── WHY LIBERTYX IS BUILT DIFFERENT (REDESIGNED) ─── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#0A0D14]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Engine Architecture
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Why LibertyX is built different.
            </h2>
            <p className="mt-3 text-base text-zinc-400 leading-relaxed">
              Engineered exclusively for Emergency Response: Liberty County roleplay servers, asset creators, and department leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/[0.08] bg-[#07090E] p-7 flex flex-col justify-between hover:border-emerald-500/35 hover:bg-[#0C1017] transition-all group shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform shadow-inner">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                        {f.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                      {f.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-zinc-500 group-hover:text-emerald-400 transition-colors font-medium">
                    <span>Verified Protocol</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400/70" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── DEPARTMENT UNITS DIRECTORY ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#07090E]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1.5">
                <Shield className="w-3.5 h-3.5" />
                Department Categories
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ER:LC Units — Every department. Every role.
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400 hover:underline"
            >
              Browse all departments <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept.id}
                to={`/marketplace?dept=${dept.id}`}
                className="rounded-3xl border border-white/[0.08] bg-[#0B0F17] p-6 hover:border-emerald-500/40 hover:bg-[#0E1420] transition-all group flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="h-24 w-full rounded-2xl bg-black/40 border border-white/[0.04] p-4 flex items-center justify-center mb-5 group-hover:border-emerald-500/20 transition-colors">
                    <img
                      src={dept.logo}
                      alt={dept.name}
                      className="max-h-16 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    {dept.short} UNIT
                  </span>

                  <h3 className="text-base font-bold text-white mt-2.5 mb-1.5">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {dept.blurb}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-emerald-400 transition-colors">
                  <span>Explore {dept.short} Liveries</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Knowledge Base
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Everything you need to know about transactions, escrow release, and badging.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.id}
                className={cn(
                  "rounded-2xl border transition-all overflow-hidden",
                  isOpen
                    ? "border-emerald-500/35 bg-[#0C111A] shadow-md"
                    : "border-white/[0.06] bg-[#090C12] hover:border-white/[0.12]"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-sm sm:text-base font-bold text-white transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 shrink-0 transition-transform duration-200 ml-4",
                      isOpen ? "rotate-180 text-emerald-400" : "text-zinc-500"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 border-t border-white/[0.04] text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── CREATOR BANNER ─── */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-[#0C1217] via-[#090D14] to-[#07090E] p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              Developer Onboarding
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 mb-2">
              Ready to launch your ER:LC studio?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Create an account in 30 seconds via Discord, upload your livery packages, and receive automated escrow payments with 0% fees.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/sell"
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-xs sm:text-sm font-bold text-black transition shadow-lg shadow-emerald-500/20"
            >
              Open Creator Studio
            </Link>
            <a
              href={BRAND.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] px-6 py-3.5 text-xs sm:text-sm font-semibold text-white transition flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#5865F2]" />
              Join Discord Community
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#05060A] text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <Link to="/" className="inline-block mb-3">
            <span className="text-2xl font-black text-white">
              Liberty<span className="text-emerald-400">X</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-4">
            The modern, scam-protected marketplace built for Emergency Response: Liberty County creators, designers, and community servers.
          </p>
          <a
            href="https://discord.gg/YYqFdVp5Fw"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:underline"
          >
            <MessageCircle className="w-4 h-4 text-[#5865F2]" />
            Join 500+ creators on Discord <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Marketplace</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/marketplace" className="hover:text-white transition">Browse All Drops</Link></li>
            <li><Link to="/marketplace?dept=Police" className="hover:text-white transition">Police Liveries</Link></li>
            <li><Link to="/marketplace?dept=Sheriff" className="hover:text-white transition">Sheriff Fleet</Link></li>
            <li><Link to="/marketplace?dept=Fire" className="hover:text-white transition">Fire & Rescue</Link></li>
            <li><Link to="/marketplace?dept=DOT" className="hover:text-white transition">DOT & Transit</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Creator Hub</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/dashboard" className="hover:text-white transition">Creator Dashboard</Link></li>
            <li><Link to="/sell" className="hover:text-white transition">Publish New Asset</Link></li>
            <li><Link to="/docs" className="hover:text-white transition">Documentation</Link></li>
            <li><Link to="/status" className="hover:text-white transition">System Status</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Legal</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="/tos" className="hover:text-white transition">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06] py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} LibertyX Marketplace. Not affiliated with Roblox Corporation or Emergency Response: Liberty County.
      </div>
    </footer>
  );
}
