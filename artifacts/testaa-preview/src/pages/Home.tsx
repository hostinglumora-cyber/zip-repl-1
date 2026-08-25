const db = globalThis.__B44_DB__ || { entities: new Proxy({}, { get: () => ({ filter: async () => [] }) }) };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Store,
  Sparkles,
  Zap,
  Boxes,
  MessageCircle,
  ArrowUpRight,
  ChevronDown,
  Car,
  Flame,
  Shield,
  Truck,
  FileCheck,
  KeyRound,
  CheckCircle2,
  Lock,
  Layers,
  Search,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { DEPARTMENTS } from "@/lib/departments";
import { Image } from "@/components/ui/image";
import Logo from "@/components/Logo";
import { BRAND } from "@/lib/brand";
import { MarketplaceCard } from "@/pages/Marketplace";
import { cn } from "@/lib/utils";

export { MarketplaceCard as ListingCard };

// High quality default showcase assets so it never displays an empty state
const SHOWCASE_PREVIEWS = {
  police: [
    {
      id: "preview-p1",
      title: "2024 State Police Slicktop Ghost Fleet",
      headline: "4K 8-vehicle fleet pack with ultra-realistic daylight reflections",
      category: "Liveries",
      departments: ["Police"],
      price_type: "Robux",
      price: 250,
      images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"],
      seller_name: "ApexLiveryStudio",
      codes: ["rbxassetid://18294029104"],
      status: "active",
    },
    {
      id: "preview-p2",
      title: "River City Highway Patrol Charger & Tahoe",
      headline: "Dual cruiser pack with custom patrol division markings",
      category: "Liveries",
      departments: ["Police"],
      price_type: "Robux",
      price: 180,
      images: ["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80"],
      seller_name: "LibertyCustoms",
      codes: ["rbxassetid://19384729102"],
      status: "active",
    },
    {
      id: "preview-p3",
      title: "Tactical SWAT Bearcat & Interceptor Pack",
      headline: "Heavy response unit liveries with matte tactical stealth finish",
      category: "Bundles",
      departments: ["Police"],
      price_type: "Robux",
      price: 320,
      images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"],
      seller_name: "VanguardTactical",
      codes: ["rbxassetid://17283940192"],
      status: "active",
    },
    {
      id: "preview-p4",
      title: "Metropolitan Traffic Enforcement Pack",
      headline: "High-visibility chevron livery and safety unit markings",
      category: "Free",
      departments: ["Police"],
      price_type: "Free",
      price: 0,
      images: ["https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"],
      seller_name: "CommunityDrops",
      codes: ["rbxassetid://16284920194"],
      status: "active",
    },
  ],
  sheriff: [
    {
      id: "preview-s1",
      title: "Liberty County Sheriff Mega Fleet (12 Vehicles)",
      headline: "Complete county-wide livery package including K-9 & Supervisor units",
      category: "Bundles",
      departments: ["Sheriff"],
      price_type: "Robux",
      price: 450,
      images: ["https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80"],
      seller_name: "CountyWorks",
      codes: ["rbxassetid://19284019283"],
      status: "active",
    },
    {
      id: "preview-s2",
      title: "Sheriff Rural Patrol F-150 & Explorer",
      headline: "Off-road mountain division livery with mud-splatter textures",
      category: "Liveries",
      departments: ["Sheriff"],
      price_type: "Robux",
      price: 160,
      images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"],
      seller_name: "RidgeLineDesign",
      codes: ["rbxassetid://18294729103"],
      status: "active",
    },
  ],
  fire: [
    {
      id: "preview-f1",
      title: "River City Fire & Rescue Engine + Ladder Livery",
      headline: "Realistic reflective gold leaf decals with NFPA compliant chevrons",
      category: "Liveries",
      departments: ["Fire"],
      price_type: "Robux",
      price: 220,
      images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80"],
      seller_name: "BravestDesigns",
      codes: ["rbxassetid://17283910293"],
      status: "active",
    },
    {
      id: "preview-f2",
      title: "Paramedic ALS Ambulance Fleet & ELS Profile",
      headline: "Full EMS skin pack with custom pattern light configurations",
      category: "ELS",
      departments: ["Fire"],
      price_type: "Robux",
      price: 190,
      images: ["https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80"],
      seller_name: "MedTechRescue",
      codes: ["rbxassetid://18273910294"],
      status: "active",
    },
  ],
  dot: [
    {
      id: "preview-d1",
      title: "Liberty DOT Highway Maintenance & Tow Fleet",
      headline: "High-vis amber strobe liveries for F-550, flatbed, and arrow boards",
      category: "Liveries",
      departments: ["DOT"],
      price_type: "Robux",
      price: 150,
      images: ["https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80"],
      seller_name: "TransitWorks",
      codes: ["rbxassetid://18293019284"],
      status: "active",
    },
    {
      id: "preview-d2",
      title: "Custom Roadwork & Incident Zone Scene Templates",
      headline: "Prefab barricade layouts, flares, and traffic cones for roleplay scenes",
      category: "Map Templates",
      departments: ["DOT"],
      price_type: "Free",
      price: 0,
      images: ["https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80"],
      seller_name: "SceneBuilderX",
      codes: ["rbxassetid://19284019203"],
      status: "active",
    },
  ],
};

const SHOWCASE_TABS = [
  { id: "police", label: "Police Fleet", icon: Shield },
  { id: "sheriff", label: "Sheriff Department", icon: Car },
  { id: "fire", label: "Fire & Rescue", icon: Flame },
  { id: "dot", label: "DOT & Civilian", icon: Truck },
];

const FAQS = [
  {
    q: "How does the Scam-Shield escrow vault work?",
    a: "When a creator publishes an asset, deliverable tokens (Roblox asset IDs, Drive templates, Pastebins) are encrypted in our escrow vault. Once a buyer completes checkout, the codes are released automatically with verifiable receipt tracking.",
  },
  {
    q: "Are there any listing fees?",
    a: "No! LibertyX Marketplace maintains a 0% listing fee policy. Creators keep 100% of their listed value on both free community giveaways and Robux-priced assets.",
  },
  {
    q: "How do I become a verified creator?",
    a: "Once you link your Roblox account and complete 5 successful scam-free asset transactions with positive reviews, the Verified Creator checkmark is automatically applied to your profile and listings.",
  },
  {
    q: "Can I sell multi-vehicle fleet bundles?",
    a: "Yes! The Creator Studio allows you to package full department packs (e.g. Crown Vic, Tahoe, Charger, Explorer) into a single discounted bundle with multi-code delivery.",
  },
];

export default function Home() {
  const [dbListings, setDbListings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"police" | "sheriff" | "fire" | "dot">("police");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    db.entities.Listing.filter({ status: "active" }, "-created_date", 20)
      .then((rows: any[]) => setDbListings(rows || []))
      .catch(() => setDbListings([]));
  }, []);

  // Merge database listings with high quality default showcase items
  const currentTabDbListings = dbListings.filter((l) => {
    const depts = (l.departments || []).map((d: string) => d.toLowerCase());
    return depts.includes(activeTab.toLowerCase());
  });

  const activeDisplayListings = [
    ...currentTabDbListings,
    ...(SHOWCASE_PREVIEWS[activeTab] || []),
  ].slice(0, 4);

  return (
    <div className="min-h-screen bg-[#07090E] text-foreground selection:bg-emerald-500/20 selection:text-emerald-300">
      <SiteNav />

      <main>
        {/* FiveBench-Style Clean Dark Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
          {/* Subtle Dark Grid Lines Texture (No bright blurs) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="relative mx-auto max-w-5xl text-center">
            {/* Status Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1 text-xs text-zinc-300 mb-8 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">Status:</span>
              <span className="font-medium text-zinc-200">Operational • Zero Scam Escrow</span>
            </div>

            {/* Massive FiveBench-Style Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
              Built for scenes.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                Powered for creators.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-zinc-400">
              LibertyX builds scam-protected delivery vaults, department liveries, and server asset tooling for Emergency Response: Liberty County creators who run tight operations.
            </p>

            {/* Actions */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs sm:text-sm font-semibold text-black transition-all hover:bg-emerald-400 shadow-sm"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-6 py-3 text-xs sm:text-sm font-medium text-zinc-300 backdrop-blur-md transition-all hover:bg-white/[0.06] hover:text-white"
              >
                <span>Read the docs</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
              </Link>
            </div>

            {/* 4 Feature Pills Row (Like FiveBench) */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#0D1117] px-3 py-1.5 text-xs text-zinc-300 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Automated Escrow
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#0D1117] px-3 py-1.5 text-xs text-zinc-300 font-medium">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                Scam-Shield Protection
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#0D1117] px-3 py-1.5 text-xs text-zinc-300 font-medium">
                <Boxes className="h-3.5 w-3.5 text-emerald-400" />
                Server Asset Vault
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#0D1117] px-3 py-1.5 text-xs text-zinc-300 font-medium">
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                Instant Code Delivery
              </span>
            </div>
          </div>
        </section>

        {/* Live Interactive Showcase Canvas (FiveBench Style) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0C0F17] p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
            {/* Top Bar with Tab Selectors */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Live Marketplace Showcase
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Browse authentic ER:LC community liveries and asset packs.
                </p>
              </div>

              {/* Department Tab Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {SHOWCASE_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all shrink-0",
                        isActive
                          ? "bg-white/[0.08] text-white border border-white/[0.15] shadow-sm"
                          : "bg-white/[0.02] text-zinc-400 border border-transparent hover:text-zinc-200 hover:bg-white/[0.05]"
                      )}
                    >
                      <Icon className={cn("h-3.5 w-3.5", isActive ? "text-emerald-400" : "text-zinc-500")} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Showcase Grid of 4 Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeDisplayListings.map((item) => (
                <MarketplaceCard key={item.id} listing={item} />
              ))}
            </div>

            {/* Bottom Showcase Footer Link */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono text-[11px]">
                Showing curated {activeTab} department catalog
              </span>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 hover:underline"
              >
                <span>View full directory</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Live Metrics Ticker */}
        <section className="border-y border-white/[0.06] bg-[#0A0D14] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatItem value="500+" label="Active ER:LC Creators" sub="Verified accounts" />
              <StatItem value="100%" label="Scam-Shield Escrow" sub="Encrypted token vault" />
              <StatItem value="< 1.2s" label="Code Delivery" sub="Instant unlock after pay" />
              <StatItem value="0%" label="Listing Fees" sub="Keep 100% of sales" />
            </div>
          </div>
        </section>

        {/* FiveBench-Style 3-Column Architecture Cards */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-2 block font-semibold">
              Platform Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Built for speed, security, and creators.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Say goodbye to Discord DM scams and lost asset links. LibertyX brings automated security and instant payouts to ER:LC.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon={ShieldCheck}
              title="Automated Scam-Shield"
              description="Deliverable asset codes, Roblox decal IDs, and Google Drive links are safely escrowed and released instantly after checkout."
            />
            <FeatureCard
              icon={Boxes}
              title="Fleet & Mega Bundles"
              description="Package complete police fleets, uniform sets, and ELS lighting profiles into single discounted marketplace listings."
            />
            <FeatureCard
              icon={MessageCircle}
              title="Discord Webhook Feeds"
              description="Connect with over 500+ ER:LC creators on Discord and receive automatic webhook alerts whenever new assets drop."
            />
          </div>
        </section>

        {/* Department Directory */}
        <section className="py-16 border-t border-white/[0.06] bg-[#0A0D14] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-1.5 block font-semibold">
                  Department Directory
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Assets for every emergency unit.
                </h2>
              </div>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline"
              >
                <span>Browse all departments</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DEPARTMENTS.map((d) => (
                <Link
                  key={d.id}
                  to={`/marketplace?dept=${d.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0C0F17] p-5 transition-all hover:border-white/[0.15] hover:bg-[#10141F]"
                >
                  <div className="relative mb-5 flex h-20 items-center justify-center">
                    <img
                      src={d.logo}
                      alt={d.name}
                      className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    {d.short}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{d.name}</h3>
                  <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{d.blurb}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:underline">
                    <span>Explore {d.short}</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs Accordion */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-1.5 block font-semibold">
                Support &amp; FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-2.5">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-white/[0.06] bg-[#0C0F17] overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-4.5 text-left text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-zinc-500 transition-transform duration-200",
                          isOpen && "transform rotate-180 text-emerald-400"
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4.5 pb-4.5 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Creator Onboarding Callout Banner */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0C0F17] p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1.5 block font-semibold">
                Join 500+ Verified Creators
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Ready to publish your ER:LC work?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                Get your storefront live in under 2 minutes. Zero listing fees, automated code escrow, and direct Discord drops.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/sell"
                className="rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-black transition hover:bg-emerald-400"
              >
                Create a Listing →
              </Link>
              <a
                href={BRAND.discordUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-xs font-medium text-zinc-300 hover:bg-white/[0.06] transition"
              >
                Join Discord
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StatItem({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-2xl sm:text-3xl font-extrabold font-mono text-white mb-1">{value}</p>
      <p className="text-xs font-semibold text-zinc-300">{label}</p>
      <p className="text-[11px] text-zinc-500 mt-0.5">{sub}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0C0F17] p-6 transition-all hover:border-white/[0.15]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-emerald-400 mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-bold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#07090E]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 py-12 lg:grid-cols-4 lg:px-8">
        <div className="col-span-2 lg:col-span-1">
          <Logo size={32} textClass="text-base font-bold" />
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-zinc-400">
            {BRAND.tagline}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href={BRAND.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#5865F2]" />
              <span>500+ on Discord</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-zinc-200">Explore</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/marketplace" className="text-zinc-400 hover:text-white">Marketplace Directory</Link></li>
            <li><Link to="/status" className="text-zinc-400 hover:text-white">System Status (99.9%)</Link></li>
            <li><Link to="/sell" className="text-zinc-400 hover:text-white">Creator Studio</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-zinc-200">Documentation</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/docs" className="text-zinc-400 hover:text-white">Quickstart Guide</Link></li>
            <li><Link to="/docs?page=selling" className="text-zinc-400 hover:text-white">Selling Guide</Link></li>
            <li><Link to="/docs?page=scam-protection" className="text-zinc-400 hover:text-white">Scam-Shield Escrow</Link></li>
            <li><Link to="/docs?page=api" className="text-zinc-400 hover:text-white">REST API Reference</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-zinc-200">Legal</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/privacy" className="text-zinc-400 hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/tos" className="text-zinc-400 hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06] py-5 text-center text-xs text-zinc-600 px-4">
        <span>© {new Date().getFullYear()} {BRAND.name}. Built for Emergency Response: Liberty County. Not affiliated with Roblox Corporation.</span>
      </div>
    </footer>
  );
}
