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
    q: "How does digital escrow delivery work?",
    a: "When you publish or purchase an asset, deliverable keys (Roblox asset IDs, livery files, Pastebin hashes, Google Drive links) are securely held in an isolated vault. The moment payment clears, the keys are automatically revealed to the buyer with an instant delivery receipt.",
  },
  {
    id: "fees",
    q: "Are there any listing or platform commission fees?",
    a: "No. LibertyX operates on a strict 0% listing fee model. Creators keep 100% of their earnings on both free community drops and Robux-priced packages.",
  },
  {
    id: "verified",
    q: "How do creators earn the Verified Creator badge?",
    a: "Verified Creator status is awarded to designers with 5+ successful escrow fulfillments and positive customer reviews. Badges are displayed automatically across creator profiles and asset cards.",
  },
  {
    id: "bundles",
    q: "Can I bundle multi-vehicle fleet liveries together?",
    a: "Yes. The Creator Studio allows you to package matching liveries for multiple vehicles (such as Tahoe, Crown Victoria, Charger, and Explorer) alongside ELS siren soundbanks into a single discounted bundle.",
  },
  {
    id: "delivery",
    q: "How fast are deliverable keys received after purchase?",
    a: "Delivery is instant and automated. Vault keys unlock directly in your account dashboard and transaction receipt in under 2 seconds after checkout.",
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Escrow Token Vault",
    desc: "Deliverable keys are encrypted until payment clearance. No Discord DM handoffs or middleman delays.",
  },
  {
    icon: Zap,
    title: "Sub-2s Automated Dispatch",
    desc: "Roblox asset keys unlock into customer inventories instantly without waiting for creators to come online.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Creator Badging",
    desc: "Community ratings, verified seller track records, and authentic provenance badges on every asset.",
  },
  {
    icon: Boxes,
    title: "Fleet Bundle Publishing",
    desc: "Package entire agency fleets, ELS siren soundbanks, and uniform templates into multi-item packs.",
  },
  {
    icon: MessageCircle,
    title: "Discord Webhook Relays",
    desc: "Broadcast new asset drops and updates automatically to your roleplay server or design community.",
  },
  {
    icon: Lock,
    title: "0% Marketplace Cut",
    desc: "You keep 100% of your earnings. No listing fees, monthly developer cuts, or hidden commissions.",
  },
];

// Highlighted asset spotlight
const SPOTLIGHT_ITEM = {
  title: "2024 State Police Slicktop Ghost Fleet",
  category: "Liveries",
  department: "Police",
  creator: "ApexLiveryStudio",
  rating: "5.0",
  price: "150 R$",
  vehicles: ["2024 Tahoe PPV", "Crown Victoria", "Explorer Interceptor", "Dodge Charger"],
  features: ["4K Daylight Reflections", "Stage 3 ELS Pattern Mapping", "Matching Unit Decals", "Full Installation Guide"],
};

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [quickSearch, setQuickSearch] = useState("");

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
    if (quickSearch.trim()) {
      const q = quickSearch.toLowerCase();
      const matchTitle = l.title?.toLowerCase().includes(q);
      const matchDesc = l.description?.toLowerCase().includes(q);
      const matchCat = l.category?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCat;
    }
    return true;
  }).slice(0, 8);

  return (
    <div className="min-h-screen text-white bg-[#06080C] selection:bg-emerald-500/25 selection:text-emerald-300">
      <SiteNav />

      {/* ─── EXPANSIVE HERO SECTION (CLEAN & BALANCED) ─── */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-white/[0.06] overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Ambient Top Glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-2/3 max-w-3xl h-56 opacity-15"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.45) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Sharp headline & concise copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="tracking-wide">ER:LC Verified Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Authentic ER:LC liveries, ELS profiles & emergency packs.
              </h1>

              <p className="text-base text-zinc-400 max-w-lg leading-relaxed">
                Discover and publish vehicle fleet wraps, uniform packages, siren soundbanks, and roleplay map builds with automated escrow delivery.
              </p>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-xs sm:text-sm font-bold text-black shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#0B0F17] hover:bg-[#101520] hover:border-emerald-500/30 px-6 py-3.5 text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-all"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Start Selling</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-3 flex items-center gap-5 text-xs text-zinc-500 font-mono">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Escrow Delivery</span>
                </div>
                <span className="text-zinc-700">•</span>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>&lt; 2s Key Dispatch</span>
                </div>
                <span className="text-zinc-700">•</span>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>0% Creator Fee</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Spotlight Asset Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-6 shadow-2xl relative group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                      Featured Drop
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{SPOTLIGHT_ITEM.category}</span>
                  </div>

                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold font-mono">
                    <Star className="w-3.5 h-3.5 fill-emerald-400" />
                    <span>{SPOTLIGHT_ITEM.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  {SPOTLIGHT_ITEM.title}
                </h3>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed line-clamp-2">
                  Complete 4-vehicle agency livery package with ultra-crisp daylight reflections and custom stage-3 lighting pattern configs.
                </p>

                {/* Vehicle Badges */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {SPOTLIGHT_ITEM.vehicles.map((v, i) => (
                    <div key={i} className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-white/[0.04] text-[11px] text-zinc-300 font-medium">
                      <Car className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-1.5 mb-5 text-xs text-zinc-400 border-t border-white/[0.06] pt-3.5">
                  {SPOTLIGHT_ITEM.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Action */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block uppercase">Price</span>
                    <span className="text-base font-mono font-bold text-emerald-400">{SPOTLIGHT_ITEM.price}</span>
                  </div>

                  <Link
                    to="/marketplace?dept=Police"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
                  >
                    <span>Inspect Asset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── LIVE MARKETPLACE SHOWCASE ─── */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/[0.06]">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
              Live Catalog
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Featured Community Releases
            </h2>
          </div>

          {/* Department Filter Pills */}
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
                    : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                {dept === "All" ? "All Departments" : dept}
              </button>
            ))}

            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline ml-2"
            >
              <span>View all ({listings.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dynamic Listings Grid */}
        {!loading && displayedListings.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-10 text-center max-w-md mx-auto">
            <Store className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white mb-1">No assets found</h3>
            <p className="text-xs text-zinc-400 mb-4">Try selecting another department or resetting filters.</p>
            <button
              onClick={() => {
                setSelectedDept("All");
                setQuickSearch("");
              }}
              className="text-xs font-bold text-emerald-400 underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayedListings.map((listing) => (
              <MarketplaceCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* ─── ER:LC AGENCY DEPARTMENTS ─── */}
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

      {/* ─── WHY LIBERTYX (NATURAL & CONCISE) ─── */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1.5">
            Platform Security
          </p>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Built for creators & server owners.
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Eliminating Discord DM scams with automated escrow delivery and verified seller track records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all group"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
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
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-[#0C121A] via-[#0A0E15] to-[#06080C] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
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
