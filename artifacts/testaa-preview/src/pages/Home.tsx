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
  SlidersHorizontal,
  Flame,
  Shield,
  Layers,
  FileCode,
  Users,
  Eye,
  Activity,
  Play,
  Volume2,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { DEPARTMENTS } from "@/lib/departments";
import { BRAND } from "@/lib/brand";
import { MarketplaceCard } from "@/pages/Marketplace";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

export { MarketplaceCard as ListingCard };

// Interactive showcase preview items
const HERO_SHOWCASE = [
  {
    id: "police",
    name: "State Police Ghost Slicktop Fleet",
    dept: "Police",
    price: "150 R$",
    vehicles: ["2024 Tahoe PPV", "Crown Victoria", "Explorer Interceptor", "Dodge Charger"],
    tags: ["4K Textures", "Daylight Reflections", "Stage 3 ELS"],
    rating: "5.0 ★",
    creator: "ApexLiveryStudio",
    image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sheriff",
    name: "County Sheriff High-Vis Patrol Pack",
    dept: "Sheriff",
    price: "140 R$",
    vehicles: ["Silverado 1500", "Tahoe PPV", "Dodge Charger Pursuit"],
    tags: ["Gold Leaf Decals", "Reflective Chevrons", "K9 Unit Variant"],
    rating: "5.0 ★",
    creator: "CountyGraphics",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "fire",
    name: "Battalion 4 Heavy Rescue & Ladder",
    dept: "Fire",
    price: "110 R$",
    vehicles: ["Pierce Enforcer Engine", "Heavy Rescue 1", "F-450 Ambulance"],
    tags: ["NFPA Rear Chevrons", "Gold Leaf Trim", "Paramedic Fly-Car"],
    rating: "5.0 ★",
    creator: "RescueGraphics",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dot",
    name: "Highway Safety & Incident Management",
    dept: "DOT",
    price: "FREE",
    vehicles: ["F-250 Road Ranger", "Arrow Board Truck", "Heavy Wrecker"],
    tags: ["Amber ELS Mapping", "Escort Markings", "High-Vis Striping"],
    rating: "5.0 ★",
    creator: "DOTWorks",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
  },
];

const FAQS = [
  {
    id: "escrow",
    q: "How does Scam-Shield escrow delivery work?",
    a: "When a creator uploads an asset, deliverable keys (Roblox asset IDs, livery files, Pastebin hashes, Google Drive links) are securely vault-locked. As soon as a transaction clears, our automated protocol releases the keys directly into your account and delivery receipt in under 2 seconds.",
  },
  {
    id: "fees",
    q: "Are there any listing or commission fees for creators?",
    a: "None. LibertyX operates on a strict 0% listing fee policy. Creators keep 100% of their earnings on both free community drops and Robux-priced packages.",
  },
  {
    id: "verified",
    q: "How do I earn the Verified Creator badge?",
    a: "Verified Creator status is granted automatically after completing 5+ successful escrow fulfillments with positive customer ratings. Badges appear across your profile, storefront, and asset cards.",
  },
  {
    id: "bundles",
    q: "Can I bundle multi-vehicle fleet liveries together?",
    a: "Yes. The Creator Studio allows you to bundle matching liveries for multiple vehicles (such as Tahoe, Crown Victoria, Charger, and Explorer) alongside ELS siren soundbanks into a single package with multi-code delivery.",
  },
  {
    id: "delivery",
    q: "How fast do I receive deliverable keys after purchase?",
    a: "Delivery is instant and automated. Vault keys unlock directly in your account dashboard and transaction receipt in under 2 seconds after checkout.",
  },
];

const STATS = [
  { label: "Assets Listed", value: "1,240+", sub: "Verified ER:LC liveries & packs" },
  { label: "Creator Cut", value: "0% Fee", sub: "100% of proceeds kept by creators" },
  { label: "Delivery Latency", value: "< 1.8s", sub: "Automated escrow key dispatch" },
  { label: "Platform Uptime", value: "99.99%", sub: "Edge-replicated infrastructure" },
];

const COMMUNITY_REVIEWS = [
  {
    author: "Chief_Anderson",
    role: "Server Owner (River City RP)",
    comment: "The 2024 State Police ghost pack transformed our fleet. Flawless 4K daylight reflections on the Tahoe and Charger with zero texture stretching.",
    rating: 5,
    tag: "Verified Buyer",
  },
  {
    author: "DeputyMiller",
    role: "Fleet Lead (Liberty County SO)",
    comment: "Finally a marketplace where I don't have to deal with Discord DM scams. Purchased the sheriff pack and had the Roblox asset IDs in 2 seconds.",
    rating: 5,
    tag: "Verified Buyer",
  },
  {
    author: "TrooperTailor",
    role: "Creator (50+ Releases)",
    comment: "0% listing fees and automated escrow key delivery made LibertyX our official storefront. The bundle publisher saves hours of work.",
    rating: 5,
    tag: "Verified Creator",
  },
];

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [activeHeroTab, setActiveHeroTab] = useState<string>("police");
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

  const heroItem = HERO_SHOWCASE.find((i) => i.id === activeHeroTab) || HERO_SHOWCASE[0];

  return (
    <div className="min-h-screen text-white bg-[#05060A] selection:bg-emerald-500/25 selection:text-emerald-300">
      <SiteNav />

      {/* ─── HERO SECTION (FIVEBENCH + ERMBOT INSPIRED) ─── */}
      <section className="relative pt-14 pb-20 lg:pt-20 lg:pb-28 border-b border-white/[0.06] overflow-hidden">
        {/* Subtle grid pattern */}
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
            background: "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.45) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Sharp Copy & Direct Marketplace Search */}
            <div className="lg:col-span-7 space-y-6">
              {/* Telemetry pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-3.5 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified ER:LC Creator Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.06] text-white">
                The premier marketplace for authentic ER:LC liveries & assets.
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
                Discover, purchase, and publish 4K vehicle fleet packs, uniform templates, ELS configs, and custom server map builds with automated escrow delivery.
              </p>

              {/* Direct Quick Search */}
              <div className="max-w-lg relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 1,200+ liveries, Tahoe, Crown Vic, Sheriff, ELS..."
                  className="w-full rounded-2xl border border-white/[0.1] bg-[#0A0E17] pl-11 pr-28 py-3.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 shadow-lg transition"
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
                  <span>Browse Full Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#090C14] hover:bg-[#0E1320] hover:border-emerald-500/30 px-5 py-3 text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-all"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Start Selling (0% Cut)</span>
                </Link>
              </div>

              {/* Trust Strip */}
              <div className="pt-3 flex items-center gap-5 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Scam-Shield Escrow</span>
                </div>
                <span className="text-zinc-700">•</span>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>&lt; 2s Key Delivery</span>
                </div>
                <span className="text-zinc-700">•</span>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>0% Creator Fee</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Vehicle Showcase Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/[0.09] bg-[#090D15] p-5 sm:p-6 shadow-2xl space-y-4">
                
                {/* Showcase Department Switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/[0.04]">
                  {HERO_SHOWCASE.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveHeroTab(item.id)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all text-center",
                        activeHeroTab === item.id
                          ? "bg-emerald-500 text-black font-bold shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      )}
                    >
                      {item.dept}
                    </button>
                  ))}
                </div>

                {/* Main Preview Image */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/[0.08] bg-black/60">
                  <img
                    src={heroItem.image}
                    alt={heroItem.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />

                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-black/85 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {heroItem.dept} UNIT
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-emerald-500 text-black shadow-md">
                      {heroItem.price}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
                    <span>Seller: <strong className="text-white">{heroItem.creator}</strong></span>
                    <span className="text-emerald-400 font-bold">{heroItem.rating}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{heroItem.name}</h3>
                </div>

                {/* Vehicle Badges */}
                <div className="grid grid-cols-2 gap-1.5">
                  {heroItem.vehicles.map((v, i) => (
                    <div key={i} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-black/40 border border-white/[0.04] text-[11px] text-zinc-300 font-medium">
                      <Car className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/[0.04]">
                  {heroItem.tags.map((t, i) => (
                    <span key={i} className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                      ✓ {t}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/marketplace?dept=${heroItem.dept}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-emerald-500 hover:text-black text-xs font-bold text-zinc-200 transition"
                >
                  <span>Inspect {heroItem.dept} Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── FIVEBENCH-STYLE TELEMETRY STATS STRIP ─── */}
      <section className="border-b border-white/[0.06] bg-[#07090F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">{s.label}</span>
              <p className="text-2xl sm:text-3xl font-mono font-black text-white">{s.value}</p>
              <p className="text-xs text-zinc-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LIVE MARKETPLACE DROPS & RELEASES ─── */}
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
          <div className="rounded-2xl border border-white/[0.08] bg-[#090C12] p-10 text-center max-w-md mx-auto">
            <Store className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white mb-1">No assets found</h3>
            <p className="text-xs text-zinc-400 mb-4">Try selecting another department or resetting filters.</p>
            <button
              onClick={() => {
                setSelectedDept("All");
                setSearchQuery("");
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

      {/* ─── ER:LC AGENCY UNITS (ERMBOT INSPIRED DIRECTORY) ─── */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#07090F]">
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
                className="rounded-2xl border border-white/[0.08] bg-[#05070C] p-5 hover:border-emerald-500/35 hover:bg-[#0A0D15] transition-all group flex flex-col justify-between"
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

      {/* ─── WHY LIBERTYX / ESCROW SECURITY BENTO ─── */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1.5">
            Security & Infrastructure
          </p>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Built different for creators & server owners.
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Eliminating Discord DM scams with automated escrow delivery and verified seller track records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Large Escrow */}
          <div className="md:col-span-2 rounded-2xl border border-white/[0.08] bg-[#090D15] p-7 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Scam-Shield Escrow Vault</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed">
                Deliverable keys and download tokens are encrypted inside an isolated vault until payment clearance. Zero trust required, zero middleman delay.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-emerald-400 font-mono">
              <span>Automated 100% Guaranteed Dispatch</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: 0% Fee */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#090D15] p-7 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">0% Platform Cut</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Creators retain 100% of listed proceeds. No hidden commission, listing fee, or monthly developer costs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-emerald-400 font-mono">
              <span>Creators Keep 100%</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Instant Dispatch */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#090D15] p-7 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Sub-2s Automated Delivery</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Roblox asset IDs and files unlock into your inventory instantly without waiting for creators to come online.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-emerald-400 font-mono">
              <span>Instant Checkout Receipt</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4: Multi-Vehicle Bundles */}
          <div className="md:col-span-2 rounded-2xl border border-white/[0.08] bg-[#090D15] p-7 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Boxes className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Fleet & Bundle Publishing</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed">
                Package entire agency fleets, ELS siren soundbanks, and uniform templates into multi-item discounted bundles with single-click checkout.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-emerald-400 font-mono">
              <span>Multi-Asset Vault Packaging</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMMUNITY TESTIMONIALS ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#07090F]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
              Community Feedback
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Trusted by ER:LC creators & server owners.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {COMMUNITY_REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-[#05070C] p-6 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-emerald-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-emerald-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {rev.tag}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.04]">
                  <p className="text-xs font-bold text-white">{rev.author}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">{rev.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#05060A]">
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
                      ? "border-emerald-500/30 bg-[#080B12]"
                      : "border-white/[0.06] bg-[#080B12]/50 hover:border-white/[0.1]"
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
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-[#0C121A] via-[#0A0E15] to-[#05060A] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
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
    <footer className="border-t border-white/[0.06] bg-[#030407] text-zinc-400">
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
