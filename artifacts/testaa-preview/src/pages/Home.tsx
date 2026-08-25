const db = (globalThis as any).__B44_DB__ || { entities: new Proxy({}, { get: () => ({ filter: async () => [] }) }) };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  House, PanelBottom, Library, Gem, Settings, LogIn, LogOut,
  CloudCog, MessageCircle, Palette, ChevronLeft, ChevronRight,
  ArrowRight, ShieldCheck, Zap, Boxes, Lock, BadgeCheck,
  Upload, Compass, Sparkles, Terminal, ChevronDown, User, Shield,
  Layers, Search, CheckCircle2, AlertTriangle, Activity
} from "lucide-react";
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
    tag: "SECURITY ENGINE",
    title: "Scam-Shield Escrow Vault",
    desc: "Asset IDs and files are encrypted in isolated vaults until checkout is verified. Zero DM trust required.",
  },
  {
    icon: Zap,
    tag: "AUTOMATED FULFILLMENT",
    title: "Instant Code Release",
    desc: "Roblox asset keys unlock into the buyer's inventory in under two seconds post-transaction.",
  },
  {
    icon: BadgeCheck,
    tag: "TRUST ARCHITECTURE",
    title: "Verified Creator System",
    desc: "Automated reputation tracking, community ratings, and anti-scam seller history.",
  },
  {
    icon: Boxes,
    tag: "STUDIO PROTOCOL",
    title: "Fleet Bundle Generator",
    desc: "Package entire agency fleets, liveries, ELS scripts, and uniform assets into discounted bundles.",
  },
  {
    icon: MessageCircle,
    tag: "DISCORD INTEGRATION",
    title: "Live Webhook Drops",
    desc: "Broadcast newly published liveries and map packs directly to your Discord server in real-time.",
  },
  {
    icon: Lock,
    tag: "ZERO COMMISSIONS",
    title: "0% Marketplace Cut",
    desc: "Keep 100% of every sale. No hidden platform cuts, no monthly developer subscriptions.",
  },
];

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    db.entities.Listing.filter({ status: "active" }, "-created_date", 8)
      .then((rows: any[]) => setListings(rows || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));

    try {
      const raw = window.localStorage.getItem("discord_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* ─── LEFT SIDEBAR (ERMBOT STYLE) ─── */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden md:flex w-16 flex-col items-center justify-between border-r border-white/[0.08] bg-[#000000] py-4 shadow-2xl">
        {/* Top Icon Group */}
        <div className="flex flex-col items-center gap-3">
          {/* Discord Profile / Login Button */}
          <Link
            to={user ? "/dashboard" : "/login"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#5865F2] hover:bg-[#4752C4] transition-transform hover:scale-105 shadow-lg shadow-[#5865F2]/20"
            title={user ? `@${user.username}` : "Login with Discord"}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="h-11 w-11 rounded-full object-cover" />
            ) : (
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
            )}
          </Link>

          <div className="h-px w-8 bg-white/[0.08] my-1" />

          {/* Navigation Icon Rail */}
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.12] text-white border border-white/10 transition"
            title="Home"
          >
            <House className="h-5 w-5 text-white" />
          </Link>

          <Link
            to="/marketplace"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] transition"
            title="Marketplace"
          >
            <PanelBottom className="h-5 w-5" />
          </Link>

          <Link
            to="/docs"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] transition"
            title="Documentation"
          >
            <Library className="h-5 w-5" />
          </Link>

          <Link
            to="/sell"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition"
            title="Creator Studio"
          >
            <Gem className="h-5 w-5" />
          </Link>
        </div>

        {/* Bottom Utility Icon Group */}
        <div className="flex flex-col items-center gap-2.5">
          <Link
            to="/status"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 hover:text-emerald-400 hover:bg-white/[0.05] transition"
            title="System Status"
          >
            <CloudCog className="h-4.5 w-4.5" />
          </Link>

          <a
            href="https://discord.gg/YYqFdVp5Fw"
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 hover:text-[#5865F2] hover:bg-white/[0.05] transition"
            title="Discord Community"
          >
            <MessageCircle className="h-4.5 w-4.5" />
          </a>

          <Link
            to={user ? "/dashboard" : "/login"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition"
            title={user ? "Dashboard Settings" : "Login"}
          >
            <Settings className="h-4.5 w-4.5" />
          </Link>

          {user && (
            <button
              onClick={() => {
                window.localStorage.removeItem("discord_user");
                setUser(null);
                window.location.reload();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition"
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA (Offset for Left Rail) ─── */}
      <div className="flex-1 md:pl-16 flex flex-col min-w-0">
        
        {/* ─── TOP BREADCRUMB BAR (ERMBOT STYLE) ─── */}
        <header className="sticky top-0 z-40 h-14 border-b border-white/[0.08] bg-[#000000]/90 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-zinc-400">
            <div className="flex items-center gap-1">
              <button
                onClick={() => window.history.back()}
                className="h-7 w-7 rounded-lg border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.05] transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => window.history.forward()}
                className="h-7 w-7 rounded-lg border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.05] transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <span className="h-4 w-px bg-white/[0.1]" />

            <div className="flex items-center gap-2 text-white font-bold">
              <span>Home</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/marketplace"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] transition"
            >
              <PanelBottom className="w-3.5 h-3.5 text-emerald-400" />
              Marketplace
            </Link>

            <Link
              to="/docs"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] transition"
            >
              <Library className="w-3.5 h-3.5 text-emerald-400" />
              Documentation
            </Link>

            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                @{user.username || user.name}
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] px-4 py-1.5 text-xs font-bold text-white transition"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                Login
              </Link>
            )}
          </div>
        </header>

        {/* ─── HERO SECTION ─── */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center overflow-hidden">
          
          {/* Subtle Ambient Vignette (No bright neon blobs) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative max-w-5xl mx-auto">
            {/* Shimmer Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs text-zinc-300 mb-8 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Introducing Scam-Shield Escrow</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </div>

            {/* Giant Bold Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              The next-gen platform <br />
              <span className="text-white">to build your roleplay server.</span>
            </h1>

            {/* Sub-headline */}
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
              Discover authentic ER:LC liveries, ELS configs, uniform sets, and server map templates. <br />
              <span className="text-zinc-300 font-medium">Fast, Safe, and Secure.</span>
            </p>

            {/* Centered Shimmer Button (ERM Style) */}
            <div className="mt-8 flex justify-center">
              <Link
                to="/marketplace"
                className="group relative inline-flex items-center justify-center rounded-full border border-white/20 bg-black px-8 py-3.5 text-base font-bold text-white shadow-2xl transition-all hover:scale-105 active:scale-95 hover:border-emerald-500/50"
                style={{
                  boxShadow: "0 0 35px -5px rgba(16, 185, 129, 0.25)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  <Compass className="w-5 h-5 text-emerald-400" />
                  Explore Marketplace
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/10 via-emerald-500/20 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            {/* ─── REALISTIC PANEL MOCKUP (ERMBOT STYLE) ─── */}
            <div className="relative mt-16 max-w-5xl mx-auto rounded-2xl border border-white/[0.12] bg-[#0A0D12] shadow-2xl overflow-hidden text-left">
              {/* Mock Window Top Bar */}
              <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#07090E] px-4 py-3 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-zinc-600 font-mono">|</span>
                  <span className="font-mono text-zinc-400">Home / LibertyX / Panel</span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ESCROW ACTIVE
                </div>
              </div>

              {/* Mock Dashboard Interior */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Panel Column 1: Asset Publisher */}
                <div className="rounded-xl border border-white/[0.06] bg-black/40 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Verified Studio</span>
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Publish ER:LC Asset</h4>
                  <p className="text-xs text-zinc-400">Upload liveries, ELS soundbanks, uniform templates with automated escrow delivery.</p>
                  <Link to="/sell" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:underline">
                    Create new listing <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Panel Column 2: Escrow Vault Status */}
                <div className="rounded-xl border border-white/[0.06] bg-black/40 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Security Telemetry</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Scam-Shield Escrow</h4>
                  <div className="space-y-2 text-xs text-zinc-400">
                    <div className="flex justify-between"><span>Token Keys:</span><span className="text-white font-mono">Encrypted</span></div>
                    <div className="flex justify-between"><span>Release Latency:</span><span className="text-emerald-400 font-mono">&lt; 1.8s</span></div>
                    <div className="flex justify-between"><span>Listing Fees:</span><span className="text-emerald-400 font-mono">0% Free</span></div>
                  </div>
                </div>

                {/* Panel Column 3: Live Verification */}
                <div className="rounded-xl border border-white/[0.06] bg-black/40 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Community Pulse</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">500+ ER:LC Creators</h4>
                  <p className="text-xs text-zinc-400">Join top department livery artists and server founders sharing verified work.</p>
                  <a href="https://discord.gg/YYqFdVp5Fw" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5865F2] hover:underline">
                    <MessageCircle className="w-3.5 h-3.5" /> Join Creator Discord
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── LIVE MARKETPLACE RELEASES ─── */}
        <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">Authentic Drops</p>
              <h2 className="text-2xl font-black text-white">Latest Releases</h2>
            </div>
            <Link to="/marketplace" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
              Browse all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!loading && listings.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-12 text-center">
              <Layers className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No listings yet</h3>
              <p className="text-xs text-zinc-400 mb-6 max-w-sm mx-auto">
                Be the first to publish an authentic ER:LC livery, uniform pack, or ELS configuration.
              </p>
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition"
              >
                <Upload className="w-4 h-4" /> Publish First Asset
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {listings.map((l) => (
                <MarketplaceCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </section>

        {/* ─── FEATURES ─── */}
        <section className="py-20 px-4 sm:px-8 border-t border-white/[0.08] bg-[#000000]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-14">
              <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">Built for ER:LC</p>
              <h2 className="text-3xl font-black text-white">Why LibertyX is built different.</h2>
              <p className="mt-2 text-sm text-zinc-400">Everything designed for high-standard emergency response roleplay communities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-6 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">{f.tag}</span>
                    <h3 className="text-base font-bold text-white mt-1 mb-1.5">{f.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── DEPARTMENT DIRECTORY ─── */}
        <section className="py-20 px-4 sm:px-8 border-t border-white/[0.08] bg-[#050505]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/[0.08]">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">Agency Classification</p>
                <h2 className="text-2xl font-black text-white">ER:LC Units. Every department. Every role.</h2>
              </div>
              <Link to="/marketplace" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                Browse all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DEPARTMENTS.map((dept) => (
                <Link
                  key={dept.id}
                  to={`/marketplace?dept=${dept.id}`}
                  className="group rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-5 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-20 w-full rounded-xl bg-black/50 border border-white/[0.04] p-3 flex items-center justify-center mb-4">
                      <img src={dept.logo} alt={dept.name} className="max-h-14 w-auto object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">{dept.short} UNIT</span>
                    <h3 className="text-sm font-bold text-white mt-1 mb-1">{dept.name}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{dept.blurb}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-emerald-400">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-20 px-4 sm:px-8 border-t border-white/[0.08] max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">Knowledge Base</p>
            <h2 className="text-3xl font-black text-white">Common Questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen ? "border-emerald-500/30 bg-[#0A0D12]" : "border-white/[0.08] bg-[#050505]"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-bold text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180 text-emerald-400" : "text-zinc-500"}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.04]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <Footer />

      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#000000] py-12 px-4 sm:px-8 text-zinc-400 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xl font-black text-white">Liberty <span className="text-emerald-400">X</span></span>
          <p className="mt-1 text-zinc-500">The scam-protected marketplace for ER:LC creators.</p>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/marketplace" className="hover:text-white transition">Marketplace</Link>
          <Link to="/docs" className="hover:text-white transition">Documentation</Link>
          <Link to="/status" className="hover:text-white transition">Status</Link>
          <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link to="/tos" className="hover:text-white transition">Terms</Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/[0.06] text-center text-zinc-600">
        © {new Date().getFullYear()} LibertyX Marketplace. Not affiliated with Roblox Corporation.
      </div>
    </footer>
  );
}
