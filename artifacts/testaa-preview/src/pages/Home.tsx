const db = (globalThis as any).__B44_DB__ || { entities: new Proxy({}, { get: () => ({ filter: async () => [] }) }) };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ShieldCheck, Zap, Boxes, MessageCircle,
  ArrowUpRight, ChevronDown, Lock, Upload, BadgeCheck,
  Flame, Shield, Car, Truck, Terminal, Sparkles, Layers,
  ExternalLink, CheckCircle2, ChevronRight, Compass
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
    q: "How does Scam-Shield escrow protect buyers & creators?",
    a: "When a creator publishes an asset, deliverable keys (Roblox asset IDs, template files, Pastebin hashes, Drive links) are securely vault-locked. The instant payment completes, the release protocol delivers the key to the buyer with an unalterable receipt and proof of provenance.",
  },
  {
    id: "fees",
    q: "What are the marketplace commission & listing fees?",
    a: "LibertyX operates on a strict 0% listing fee model. Creators keep 100% of their earnings on free releases and Robux-priced drops alike.",
  },
  {
    id: "verified",
    q: "How do creators earn the Verified Creator badge?",
    a: "Link your verified Roblox developer identity and execute 5 successful scam-free escrow deliveries with positive buyer feedback. Badging is audited and applied automatically.",
  },
  {
    id: "bundles",
    q: "Can I bundle multi-vehicle liveries and ELS profiles together?",
    a: "Yes. The Creator Studio includes a multi-asset bundle generator allowing you to link liveries for Tahoe, Crown Vic, Charger, and Explorer alongside custom siren soundbanks and ELS scripts in a single package.",
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    tag: "SECURITY LAYER",
    title: "Scam-Shield Escrow Engine",
    desc: "Digital deliverable keys are encrypted inside an isolated vault. Zero trust required between unknown parties.",
  },
  {
    icon: Zap,
    tag: "SUB-SECOND SYNC",
    title: "Instant Automated Delivery",
    desc: "Roblox asset IDs and drive links populate into the buyer's inventory in under 2 seconds after checkout.",
  },
  {
    icon: BadgeCheck,
    tag: "TRUST PROTOCOL",
    title: "Verified Creator Badging",
    desc: "Reputation scoring, verified ER:LC community track records, and tamper-proof seller provenance.",
  },
  {
    icon: Boxes,
    tag: "STUDIO TOOLS",
    title: "Fleet Bundle Builder",
    desc: "Package entire agency fleets, liveries, sirens, and uniform assets into discounted multi-tier bundles.",
  },
  {
    icon: MessageCircle,
    tag: "DISCORD INTEGRATION",
    title: "Live Webhook Drops",
    desc: "Broadcast new asset releases, price drops, and updates automatically to your community Discord server.",
  },
  {
    icon: Lock,
    tag: "TRANSPARENT VALUE",
    title: "0% Marketplace Cut",
    desc: "Keep 100% of your earnings. No hidden transaction cuts or recurring developer subscription fees.",
  },
];

const STATS = [
  { val: "500+", label: "Verified Creators", sub: "Active ER:LC Designers" },
  { val: "100%", label: "Escrow Protected", sub: "Zero-Scam Delivery" },
  { val: "< 2s", label: "Code Delivery", sub: "Instant Token Release" },
  { val: "0%", label: "Platform Cut", sub: "Creators Keep 100%" },
];

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    db.entities.Listing.filter({ status: "active" }, "-created_date", 8)
      .then((rows: any[]) => setListings(rows || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen text-white bg-[#050505] selection:bg-emerald-500/30 selection:text-emerald-300">
      <SiteNav />

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 border-b border-white/[0.06]">
        {/* Futuristic subtle grid matrix */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Ambient Top Horizon Glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 opacity-20"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.4) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono uppercase tracking-wider text-[11px]">ER:LC Marketplace 2.0</span>
            <span className="h-3.5 w-px bg-emerald-500/30" />
            <span className="text-zinc-300">Scam-Shield Escrow Enabled</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
            The next-generation marketplace{" "}
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              for ER:LC creators.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            Discover, buy, and publish community-crafted liveries, custom uniform templates, ELS configurations, and map packs with automated delivery and 0% listing fees.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-8 py-4 text-sm sm:text-base font-bold text-black shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Compass className="w-5 h-5" />
              Explore Marketplace
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/sell"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] px-8 py-4 text-sm sm:text-base font-semibold text-white transition hover:border-emerald-500/30"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              Publish Asset
            </Link>
          </div>

          {/* Verification Bar */}
          <div className="mt-12 inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/[0.06] bg-[#0A0D12]/80 px-6 py-3 text-xs text-zinc-400 backdrop-blur-md">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Scam-Shield Escrow</span>
            </div>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <div className="flex items-center gap-2 font-medium">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>Sub-2s Code Release</span>
            </div>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <div className="flex items-center gap-2 font-medium">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>0% Creator Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE MARKETPLACE / EMPTY STATE ─── */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Asset Stream
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Community Releases
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition group"
          >
            View full catalog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {!loading && listings.length === 0 ? (
          /* Futuristic Human-Designed Empty State */
          <div className="relative rounded-3xl border border-white/[0.08] bg-[#0A0D12] p-8 sm:p-14 text-center overflow-hidden">
            {/* Grid Pattern in empty card */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative max-w-md mx-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-6 shadow-inner">
                <Layers className="h-8 w-8 animate-pulse" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
                No listings active in catalog
              </h3>
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                Be the first creator to publish an authentic ER:LC asset, launch your storefront, and establish your verified seller reputation.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-xs sm:text-sm font-bold text-black transition shadow-lg shadow-emerald-500/20"
                >
                  <Upload className="w-4 h-4" />
                  Publish First ER:LC Asset
                </Link>
                <Link
                  to="/docs"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] px-5 py-3 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white transition"
                >
                  Seller Guidelines
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {listings.map((l) => (
              <MarketplaceCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>

      {/* ─── FUTURISTIC STATS HUD ─── */}
      <section className="py-16 border-y border-white/[0.06] bg-[#07090E]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((s, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-white/[0.06] bg-[#0C1017] p-6 sm:p-7 hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    0{idx + 1} // TELEMETRY
                  </span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500/40 group-hover:bg-emerald-400 transition" />
                </div>
                <p className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mb-1">
                  {s.val}
                </p>
                <p className="text-sm font-bold text-zinc-200">{s.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES: "WHY LIBERTYX" ─── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
                className="rounded-3xl border border-white/[0.08] bg-[#0A0D12] p-7 flex flex-col justify-between hover:border-emerald-500/30 hover:bg-[#0D1117] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
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
                  <span>Explore capability</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── DEPARTMENT UNITS DIRECTORY ─── */}
      <section className="py-20 border-t border-white/[0.06] bg-[#07090E]/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1.5">
                <Shield className="w-3.5 h-3.5" />
                Agency Classification
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ER:LC Units. Every department. Every role.
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400 hover:underline"
            >
              Browse all units <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept.id}
                to={`/marketplace?dept=${dept.id}`}
                className="rounded-3xl border border-white/[0.08] bg-[#0A0D12] p-6 hover:border-emerald-500/40 hover:bg-[#0E121A] transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Logo Container */}
                  <div className="h-24 w-full rounded-2xl bg-black/40 border border-white/[0.04] p-4 flex items-center justify-center mb-5 group-hover:border-emerald-500/20 transition-colors">
                    <img
                      src={dept.logo}
                      alt={dept.name}
                      className="max-h-16 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
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
                  <span>Inspect {dept.short} Packs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
            <Terminal className="w-3.5 h-3.5" />
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
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? "border-emerald-500/30 bg-[#0C1017]"
                    : "border-white/[0.06] bg-[#0A0D12] hover:border-white/[0.12]"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-sm sm:text-base font-bold text-white transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ml-4 ${
                      isOpen ? "rotate-180 text-emerald-400" : "text-zinc-500"
                    }`}
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
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-[#0C1217] via-[#0A0D12] to-[#07090E] p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
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
              Join Discord Server
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
    <footer className="border-t border-white/[0.08] bg-[#030406] text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <Link to="/" className="inline-block mb-3">
            <span className="text-2xl font-black text-white">
              Liberty <span className="text-emerald-400">X</span>
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
            <li><Link to="/marketplace" className="hover:text-white transition">Browse Assets</Link></li>
            <li><Link to="/marketplace?dept=Police" className="hover:text-white transition">Police Liveries</Link></li>
            <li><Link to="/marketplace?dept=Sheriff" className="hover:text-white transition">Sheriff Packs</Link></li>
            <li><Link to="/marketplace?dept=Fire" className="hover:text-white transition">Fire & Rescue</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Developers</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/sell" className="hover:text-white transition">Creator Studio</Link></li>
            <li><Link to="/docs" className="hover:text-white transition">Documentation</Link></li>
            <li><Link to="/docs?page=selling" className="hover:text-white transition">Seller Guide</Link></li>
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
