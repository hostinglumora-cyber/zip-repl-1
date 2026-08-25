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
  Car,
  Sparkles,
  Compass,
  Star,
  CheckCircle2,
  Store,
  Check,
  Search,
  BookOpen,
  Code2,
  Layers,
  FileCode,
  Radio,
  Plus,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { DEPARTMENTS } from "@/lib/departments";
import { BRAND } from "@/lib/brand";
import { MarketplaceCard } from "@/pages/Marketplace";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

export { MarketplaceCard as ListingCard };

const FAQS = [
  {
    id: "escrow",
    q: "How does escrow key delivery work?",
    a: "When an asset is uploaded, deliverable keys (Roblox asset IDs, livery files, Pastebin hashes, Google Drive links) are securely vault-locked. Upon payment clearance, the protocol releases the key directly to the buyer's dashboard with an unalterable delivery receipt.",
  },
  {
    id: "fees",
    q: "Are there any listing or platform commission fees?",
    a: "No. LibertyX maintains a 0% listing fee model. Creators keep 100% of their earnings on both free community releases and Robux-priced assets.",
  },
  {
    id: "verified",
    q: "How do creators earn the Verified Creator badge?",
    a: "Verified Creator status is awarded to creators with a proven track record of scam-free escrow fulfillments and positive customer feedback. Badging is audited and displayed on all listings.",
  },
  {
    id: "bundles",
    q: "Can I bundle multi-vehicle fleet liveries together?",
    a: "Yes. The Creator Studio allows you to package matching liveries for multiple vehicles (such as Tahoe, Crown Victoria, Charger, and Explorer) alongside ELS configs into a single package with multi-code delivery.",
  },
  {
    id: "delivery",
    q: "How fast are deliverable keys received after purchase?",
    a: "Delivery is instant and automated. Vault keys unlock directly in your account dashboard and transaction receipt in under 2 seconds after checkout.",
  },
];

const PLATFORM_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Scam-Shield Escrow",
    desc: "Deliverable keys and download links are vault-locked until payment verification. No Discord DM handoffs or middleman delays.",
    tag: "Security",
  },
  {
    icon: Zap,
    title: "Sub-2s Automated Dispatch",
    desc: "Roblox asset keys unlock into customer inventories instantly without waiting for creators to be online.",
    tag: "Automated",
  },
  {
    icon: Lock,
    title: "0% Platform Commission",
    desc: "Creators retain 100% of listed proceeds. Zero listing cuts, no monthly developer fees.",
    tag: "Free to Sell",
  },
  {
    icon: Boxes,
    title: "Fleet & Bundle Publishing",
    desc: "Package entire agency fleets, ELS siren soundbanks, and uniform templates into multi-item discounted packs.",
    tag: "Creator Tool",
  },
  {
    icon: MessageCircle,
    title: "Discord Webhook Relays",
    desc: "Broadcast new asset releases and updates automatically to your roleplay server community.",
    tag: "Integration",
  },
  {
    icon: BadgeCheck,
    title: "Verified Creator Badging",
    desc: "Tamper-proof seller provenance, verified creator ratings, and authenticated Roblox credentials.",
    tag: "Provenance",
  },
];

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const query = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
    query({ status: "active" }, "-created_date", 24)
      .then((rows: any[]) => setListings(rows || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const displayedListings = listings.filter((l) => {
    if (selectedDept !== "All") {
      const matchesDept = l.departments?.some((d: string) => d.toLowerCase() === selectedDept.toLowerCase());
      if (!matchesDept) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = l.title?.toLowerCase().includes(q);
      const inDesc = l.description?.toLowerCase().includes(q);
      const inCat = l.category?.toLowerCase().includes(q);
      return inTitle || inDesc || inCat;
    }
    return true;
  }).slice(0, 8);

  const topListing = listings.length > 0 ? listings[0] : null;

  return (
    <div className="min-h-screen text-white bg-[#07090E] selection:bg-emerald-500/25 selection:text-emerald-300">
      <SiteNav />

      {/* ─── MINTLIFY-INSPIRED HERO SECTION ─── */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-white/[0.06] overflow-hidden">
        {/* Subtle grid lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Ambient Top Glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-60 opacity-20"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.4) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left: Clean Heading & Mintlify-Style Cards */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-3.5 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LibertyX Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                The modern asset marketplace for ER:LC creators.
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
                Discover, buy, and publish verified vehicle fleet liveries, uniform packages, ELS siren soundbanks, and custom server map builds.
              </p>

              {/* Mintlify-Style Action Search */}
              <div className="max-w-lg relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog by title, vehicle model, or category..."
                  className="w-full rounded-2xl border border-white/[0.08] bg-[#0A0D15] pl-11 pr-28 py-3.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 shadow-lg transition"
                />
                <Link
                  to={searchQuery ? `/marketplace?q=${encodeURIComponent(searchQuery)}` : "/marketplace"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
                >
                  Search
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-xs sm:text-sm font-bold text-black shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Compass className="w-4 h-4" />
                  <span>Browse Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#0A0D15] hover:bg-[#0E1320] hover:border-emerald-500/30 px-5 py-3 text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-all"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Publish Asset (0% Fee)</span>
                </Link>
              </div>

              {/* Mintlify Quick Entry Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.06]">
                <Link
                  to="/marketplace"
                  className="p-3.5 rounded-xl border border-white/[0.06] bg-[#0A0D15]/80 hover:border-emerald-500/30 hover:bg-[#0E1320] transition group"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-0.5 group-hover:text-emerald-400">
                    <Store className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Store Directory</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Browse liveries, ELS & uniforms</p>
                </Link>

                <Link
                  to="/docs"
                  className="p-3.5 rounded-xl border border-white/[0.06] bg-[#0A0D15]/80 hover:border-emerald-500/30 hover:bg-[#0E1320] transition group"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-0.5 group-hover:text-emerald-400">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Documentation</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Guides, escrow & webhooks</p>
                </Link>
              </div>
            </div>

            {/* Right: Real Top Asset or Interactive Publisher Card */}
            <div className="lg:col-span-5">
              {topListing ? (
                <div className="rounded-2xl border border-white/[0.09] bg-[#0A0D15] p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                      Featured Drop
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{topListing.category || "Asset"}</span>
                  </div>

                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black/60 relative border border-white/[0.06]">
                    {topListing.images && topListing.images.length > 0 ? (
                      <img src={topListing.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Store className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-emerald-500 text-black">
                        {topListing.price_type === "Free" || !topListing.price ? "FREE" : `R$ ${topListing.price}`}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{topListing.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">{topListing.description}</p>
                  </div>

                  <Link
                    to={`/listing/${topListing.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-emerald-500 hover:text-black text-xs font-bold text-zinc-200 transition"
                  >
                    <span>Inspect Asset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/[0.09] bg-[#0A0D15] p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                      Creator Studio
                    </span>
                    <span className="text-xs font-mono text-zinc-400">0% Commission</span>
                  </div>

                  <div className="p-5 rounded-xl border border-dashed border-white/[0.1] bg-black/40 text-center space-y-2">
                    <Store className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold text-white">Publish Your First Asset</h4>
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                      Upload your ER:LC vehicle liveries, uniform packages, or ELS soundbanks.
                    </p>
                  </div>

                  <Link
                    to="/sell"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Open Creator Studio</span>
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ─── LIVE MARKETPLACE CATALOG SHOWCASE ─── */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/[0.06]">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
              Live Catalog
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Community Releases & Drops
            </h2>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["All", "Police", "Sheriff", "Fire", "DOT"].map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all",
                  selectedDept === dept
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm"
                    : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                {dept === "All" ? "All Units" : dept}
              </button>
            ))}

            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline ml-2"
            >
              <span>View full catalog ({listings.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dynamic Connected Listings Grid */}
        {!loading && displayedListings.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-12 text-center max-w-md mx-auto shadow-xl">
            <Store className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white mb-1">No assets found</h3>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              Be the first creator to upload a verified livery, ELS profile, or server map pack.
            </p>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-black transition"
            >
              <Upload className="w-4 h-4" />
              <span>Publish First Asset</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayedListings.map((listing) => (
              <MarketplaceCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* ─── ER:LC AGENCY DEPARTMENTS DIRECTORY ─── */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#080B10]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
                Department Directory
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ER:LC Agency Units
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
            >
              Browse all departments <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept.id}
                to={`/marketplace?dept=${dept.id}`}
                className="rounded-2xl border border-white/[0.08] bg-[#06080C] p-5 hover:border-emerald-500/35 hover:bg-[#0A0D15] transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-20 w-full rounded-xl bg-black/40 border border-white/[0.04] p-3 flex items-center justify-center mb-4 group-hover:border-emerald-500/20 transition-colors">
                    <img
                      src={dept.logo}
                      alt={dept.name}
                      className="max-h-14 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {dept.short} UNIT
                  </span>

                  <h3 className="text-sm font-bold text-white mt-2 mb-1">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {dept.blurb}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-emerald-400 transition-colors">
                  <span>Explore {dept.short}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLATFORM PILLARS (MINTLIFY STYLE MATRIX) ─── */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1.5">
            Architecture
          </p>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Built for creators & server owners.
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Eliminating Discord DM scams with automated escrow delivery and verified seller track records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLATFORM_PILLARS.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-zinc-500 group-hover:text-emerald-400 transition-colors">
                  <span>Verified Standard</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#080B10]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
              FAQ
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.id}
                  className={cn(
                    "rounded-xl border transition-all overflow-hidden",
                    isOpen
                      ? "border-emerald-500/30 bg-[#06080C]"
                      : "border-white/[0.06] bg-[#06080C]/60 hover:border-white/[0.1]"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-xs sm:text-sm font-bold text-white transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 shrink-0 transition-transform duration-200 ml-3",
                        isOpen ? "rotate-180 text-emerald-400" : "text-zinc-500"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 border-t border-white/[0.04] text-xs text-zinc-400 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CREATOR ONBOARDING BANNER ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-[#0C121A] via-[#0A0E15] to-[#07090E] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="max-w-lg">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
              Creator Studio
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1 mb-2">
              Ready to publish your ER:LC liveries?
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sign in via Discord in seconds, upload your asset bundle, and receive automated escrow payments with 0% listing fees.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/sell"
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-xs font-bold text-black transition shadow-md shadow-emerald-500/20"
            >
              Open Creator Studio
            </Link>
            <a
              href={BRAND.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] px-5 py-3 text-xs font-semibold text-white transition flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#5865F2]" />
              <span>Join Discord</span>
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
    <footer className="border-t border-white/[0.06] bg-[#040508] text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <Link to="/" className="inline-block mb-3">
            <span className="text-xl font-black text-white">
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
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#5865F2]" />
            Join creators on Discord <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Marketplace</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/marketplace" className="hover:text-white transition">Browse All</Link></li>
            <li><Link to="/marketplace?dept=Police" className="hover:text-white transition">Police Liveries</Link></li>
            <li><Link to="/marketplace?dept=Sheriff" className="hover:text-white transition">Sheriff Fleet</Link></li>
            <li><Link to="/marketplace?dept=Fire" className="hover:text-white transition">Fire & Rescue</Link></li>
            <li><Link to="/marketplace?dept=DOT" className="hover:text-white transition">DOT & Transit</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Creator Studio</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/dashboard" className="hover:text-white transition">Overview</Link></li>
            <li><Link to="/sell" className="hover:text-white transition">Publish Asset</Link></li>
            <li><Link to="/docs" className="hover:text-white transition">Documentation</Link></li>
            <li><Link to="/status" className="hover:text-white transition">System Status</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Legal</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="/tos" className="hover:text-white transition">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.04] py-5 text-center text-[11px] text-zinc-500 font-mono">
        © {new Date().getFullYear()} LibertyX Marketplace. All rights reserved.
      </div>
    </footer>
  );
}
