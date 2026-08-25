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
  Eye,
  Check,
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
    q: "How does the digital escrow release work?",
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
    title: "Escrow Vault Security",
    desc: "Digital deliverable keys are encrypted inside an isolated vault until transaction clearance. Zero DM trust required.",
  },
  {
    icon: Zap,
    title: "Sub-2s Automated Delivery",
    desc: "Roblox asset keys unlock into the buyer's inventory automatically without waiting for creators to be online.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Creator Badging",
    desc: "Community ratings, verified ER:LC creator track records, and tamper-proof seller provenance.",
  },
  {
    icon: Boxes,
    title: "Fleet & Bundle Tools",
    desc: "Package entire agency fleets, liveries, ELS soundbanks, and uniform assets into discounted bundles.",
  },
  {
    icon: MessageCircle,
    title: "Discord Webhook Integration",
    desc: "Broadcast new asset drops and updates automatically to your roleplay community server.",
  },
  {
    icon: Lock,
    title: "0% Marketplace Cut",
    desc: "Keep 100% of your earnings. No hidden platform cuts, no monthly developer fees.",
  },
];

// High quality fallback community showcase if db is initializing
const SPOTLIGHT_ITEM = {
  title: "2024 State Police Slicktop Ghost Fleet",
  category: "Liveries",
  department: "Police",
  creator: "ApexLiveryStudio",
  rating: "5.0",
  price: "150 R$",
  vehicles: ["2024 Tahoe", "Crown Victoria", "Explorer Interceptor", "Dodge Charger"],
  features: ["4K Daylight Reflections", "Stage 3 ELS Profile", "Custom Unit Decals", "Full Unit Template"],
};

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

      {/* ─── FULL-WIDTH EXPANSIVE HERO SECTION ─── */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-white/[0.06] overflow-hidden">
        {/* Subtle geometric grid matrix */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Ambient Top Glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-64 opacity-20"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.4) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Copy & CTAs */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>The ER:LC Asset Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Discover verified liveries, ELS profiles & emergency assets.
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
                Buy, sell, and download authentic vehicle fleet packs, uniform templates, and server map assets for Emergency Response: Liberty County.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-8 py-4 text-sm font-bold text-black shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Compass className="w-4 h-4" />
                  <span>Browse Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.12] bg-[#0E131E] hover:bg-[#131926] hover:border-emerald-500/30 px-7 py-4 text-sm font-semibold text-white transition-all"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Start Selling</span>
                </Link>
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-4 flex items-center gap-6 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Escrow Delivery</span>
                </div>
                <span className="text-zinc-700">•</span>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>&lt; 2s Key Dispatch</span>
                </div>
                <span className="text-zinc-700">•</span>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>0% Creator Fees</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Spotlight Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-white/[0.1] bg-[#0B0F17] p-6 sm:p-7 shadow-2xl overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                      Featured Drop
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Police Fleet</span>
                  </div>

                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold font-mono">
                    <Star className="w-3.5 h-3.5 fill-emerald-400" />
                    <span>5.0</span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-white mb-2 leading-snug">
                  {SPOTLIGHT_ITEM.title}
                </h3>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                  Complete 4-vehicle agency livery package with ultra-crisp daylight reflections and custom stage-3 lighting pattern configs.
                </p>

                {/* Vehicle Badges */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {SPOTLIGHT_ITEM.vehicles.map((v, i) => (
                    <div key={i} className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-white/[0.04] text-[11px] text-zinc-300 font-medium">
                      <Car className="w-3 h-3 text-emerald-400" />
                      <span>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Feature Checklist */}
                <div className="space-y-1.5 mb-6 text-xs text-zinc-400 border-t border-white/[0.06] pt-4">
                  {SPOTLIGHT_ITEM.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Card CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block uppercase">Listed Value</span>
                    <span className="text-lg font-mono font-black text-emerald-400">{SPOTLIGHT_ITEM.price}</span>
                  </div>

                  <Link
                    to="/marketplace?dept=Police"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
                  >
                    <span>Inspect Pack</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── LATEST RELEASES & FEATURED ASSETS ─── */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/[0.07]">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
              Live Catalog
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Latest Releases & Featured Drops
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
              <span>View full catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Listings Grid */}
        {!loading && displayedListings.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-[#0B0F17] p-12 text-center max-w-xl mx-auto shadow-xl">
            <Store className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No listings active in this department</h3>
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

      {/* ─── ER:LC CATEGORIES & DEPARTMENTS ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#0A0D15]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
                Department Directory
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ER:LC Units — Built for every roleplay agency.
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400 hover:underline"
            >
              Explore all units <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept.id}
                to={`/marketplace?dept=${dept.id}`}
                className="rounded-3xl border border-white/[0.08] bg-[#07090E] p-6 hover:border-emerald-500/40 hover:bg-[#0C1019] transition-all group flex flex-col justify-between shadow-md"
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
                  <span>Browse {dept.short} Liveries</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY LIBERTYX (REDESIGNED) ─── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
            Why LibertyX
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Built different for creators & server owners.
          </h2>
          <p className="mt-3 text-base text-zinc-400 leading-relaxed">
            Eliminating Discord DM scams, missing codes, and lost templates with automated digital fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-7 flex flex-col justify-between hover:border-emerald-500/35 hover:bg-[#0E121D] transition-all group shadow-md"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 mb-5 group-hover:scale-105 transition-transform shadow-inner">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-zinc-500 group-hover:text-emerald-400 transition-colors font-medium">
                  <span>Verified Standard</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400/70" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#0A0D15]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
              Frequently Asked
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Clear answers on digital keys, escrow release, and badging.
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
                      ? "border-emerald-500/35 bg-[#07090E] shadow-md"
                      : "border-white/[0.06] bg-[#07090E]/60 hover:border-white/[0.12]"
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
        </div>
      </section>

      {/* ─── CREATOR BANNER ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-emerald-500/25 bg-gradient-to-r from-[#0C121A] via-[#0A0E15] to-[#07090E] p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              Creator Onboarding
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 mb-2">
              Ready to publish your ER:LC liveries?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Create an account via Discord in 15 seconds, upload your asset package, and receive automated escrow payments with 0% fees.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/sell"
              className="rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-7 py-3.5 text-xs sm:text-sm font-bold text-black transition shadow-lg shadow-emerald-500/20"
            >
              Open Creator Studio
            </Link>
            <a
              href={BRAND.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] px-6 py-3.5 text-xs sm:text-sm font-semibold text-white transition flex items-center gap-2"
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
            Join creators on Discord <ArrowUpRight className="w-3.5 h-3.5" />
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
            <li><Link to="/sell" className="hover:text-white transition">Publish Asset</Link></li>
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
        © {new Date().getFullYear()} LibertyX Marketplace. Not affiliated with Roblox Corporation.
      </div>
    </footer>
  );
}
