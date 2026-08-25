const db = globalThis.__B44_DB__ || { entities: new Proxy({}, { get: () => ({ filter: async () => [] }) }) };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Store,
  Users,
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
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { DEPARTMENTS } from "@/lib/departments";
import { Image } from "@/components/ui/image";
import Logo from "@/components/Logo";
import { BRAND } from "@/lib/brand";
import { MarketplaceCard } from "@/pages/Marketplace";
import { cn } from "@/lib/utils";

export { MarketplaceCard as ListingCard };

const SHOWCASE_TABS = [
  { id: "police", label: "Police Fleet", icon: Shield, tag: "Popular" },
  { id: "sheriff", label: "Sheriff Department", icon: Car, tag: "Featured" },
  { id: "fire", label: "Fire & Rescue", icon: Flame, tag: "ELS" },
  { id: "dot", label: "DOT & Civilian", icon: Truck, tag: "Templates" },
];

const FAQS = [
  {
    q: "How does the Scam-Shield escrow work?",
    a: "When a creator publishes an asset, deliverable tokens (Roblox asset IDs, Drive templates, Pastebins) are encrypted in our escrow vault. Once a buyer completes checkout, the codes are released automatically with verifiable receipt tracking.",
  },
  {
    q: "Are there any fees for listing products?",
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
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("police");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    db.entities.Listing.filter({ status: "active" }, "-created_date", 8)
      .then((rows: any[]) => setListings(rows || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const departmentListings = listings.filter((l) => {
    if (activeTab === "police") return l.departments?.includes("police") || !l.departments?.length;
    if (activeTab === "sheriff") return l.departments?.includes("sheriff");
    if (activeTab === "fire") return l.departments?.includes("fire");
    return l.departments?.includes("dot") || l.departments?.includes("ERLC");
  });

  return (
    <div className="min-h-screen bg-[#090D14] text-foreground selection:bg-emerald-500/20 selection:text-emerald-300">
      <SiteNav />

      <main className="overflow-hidden">
        {/* ERM-Style Expansive Hero Section */}
        <section className="relative pt-20 pb-20 md:pt-32 md:pb-28 text-center px-4 sm:px-6 lg:px-8">
          {/* Ambient Radial Gradient Blurs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14),transparent_65%)] pointer-events-none blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent_60%)] pointer-events-none blur-3xl" />

          <div className="relative mx-auto max-w-5xl">
            {/* Centered Glowing Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md text-emerald-300 mb-8 shadow-[0_0_24px_rgba(16,185,129,0.18)]">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-semibold tracking-wide">Introducing LibertyX Marketplace</span>
              <span className="h-3 w-px bg-emerald-500/30" />
              <span className="text-xs font-medium text-emerald-400">ER:LC v2.0</span>
            </div>

            {/* Massive Bold Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-foreground">
              Streamline Your <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                ER:LC Marketplace Scenes.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-muted-foreground">
              The creator-first marketplace for Emergency Response: Liberty County. Discover high-resolution liveries, uniform packs, ELS profiles, and server assets with automated Scam-Shield escrow.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-black shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-card/60 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:border-emerald-500/40 hover:bg-secondary/70"
              >
                <span>Start Selling Free</span>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Zero Listing Fees</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>100% Escrow Delivery</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>500+ ER:LC Creators</span>
              </span>
            </div>
          </div>

          {/* Interactive Showcase Preview Mockup (ERM Style) */}
          <div className="relative mx-auto max-w-6xl mt-16 lg:mt-24">
            <div className="rounded-3xl border border-white/10 bg-card/50 p-4 sm:p-6 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
              {/* Tab Selector Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {SHOWCASE_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all shrink-0",
                          isActive
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                            : "bg-secondary/40 text-muted-foreground border border-transparent hover:text-foreground hover:bg-secondary/70"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline"
                >
                  <span>View All 100+ Assets</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Showcase Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-2xl bg-secondary/50 animate-pulse"
                    />
                  ))
                ) : departmentListings.length > 0 ? (
                  departmentListings.slice(0, 4).map((item) => (
                    <MarketplaceCard key={item.id} listing={item} />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-2xl bg-secondary/20">
                    <Store className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm font-bold text-foreground">Be the first to list a {activeTab} asset</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">
                      Upload your livery or pack to be featured in the showcase.
                    </p>
                    <Link
                      to="/sell"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400"
                    >
                      Publish Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Live Platform Stats */}
        <section className="border-y border-white/5 bg-secondary/20 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem value="500+" label="Active ER:LC Creators" sub="Verified accounts" />
              <StatItem value="100%" label="Scam-Shield Escrow" sub="Encrypted token vault" />
              <StatItem value="< 1.2s" label="Code Delivery" sub="Instant unlock after pay" />
              <StatItem value="0%" label="Listing Fees" sub="Keep 100% of sales" />
            </div>
          </div>
        </section>

        {/* ERM-Style Feature Grid */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 block">
                Why LibertyX
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                Built for creator trust and speed.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Say goodbye to Discord DM scams and lost asset links. LibertyX brings automated security and instant payouts to ER:LC creators.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={ShieldCheck}
                title="Automated Scam-Shield"
                description="Deliverable asset codes, Roblox decal IDs, and Google Drive links are safely escrowed and released instantly after checkout."
              />
              <FeatureCard
                icon={Boxes}
                title="Fleet & Mega Bundles"
                description="Easily package complete police fleets, uniform sets, and ELS lighting profiles into single discounted marketplace listings."
              />
              <FeatureCard
                icon={MessageCircle}
                title="Discord Community & Drops"
                description="Connect with over 500+ ER:LC creators on Discord and receive automatic webhook pings whenever new assets go live."
              />
            </div>
          </div>
        </section>

        {/* Department Grid */}
        <section className="py-20 border-t border-white/5 bg-secondary/10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 block">
                  Department Directory
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {DEPARTMENTS.map((d) => (
                <Link
                  key={d.id}
                  to={`/marketplace?dept=${d.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:bg-card/80 hover:shadow-2xl"
                >
                  <div className="relative mb-6 flex h-24 items-center justify-center">
                    <img
                      src={d.logo}
                      alt={d.name}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                    {d.short}
                  </span>
                  <h3 className="text-base font-bold text-foreground mt-0.5">{d.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{d.blurb}</p>
                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:underline">
                    <span>Explore {d.short} assets</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs Accordion */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 block">
                Frequently Asked Questions
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                Got questions? We have answers.
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur-sm overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-foreground hover:text-emerald-300 transition"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform duration-200",
                          isOpen && "transform rotate-180 text-emerald-400"
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-white/5 pt-3">
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
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-card/90 to-teal-950/30 p-8 sm:p-12 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 block">
                Join 500+ Verified Creators
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                Ready to publish your ER:LC work?
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                Get your storefront live in under 2 minutes. Zero listing fees, automated code escrow, and direct Discord drop webhooks.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/sell"
                className="rounded-xl bg-emerald-500 px-6 py-3.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                Create a Listing →
              </Link>
              <a
                href={BRAND.discordUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-secondary/50 px-5 py-3.5 text-xs font-semibold text-foreground hover:bg-secondary transition"
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
      <p className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 mb-1">{value}</p>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-card/70 hover:shadow-xl">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-5">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#090D14]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 sm:px-6 py-12 lg:grid-cols-4 lg:px-8">
        <div className="col-span-2 lg:col-span-1">
          <Logo size={28} textClass="text-base font-bold" />
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted-foreground">
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
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground">Explore</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/marketplace" className="text-muted-foreground hover:text-foreground">Marketplace Directory</Link></li>
            <li><Link to="/status" className="text-muted-foreground hover:text-foreground">System Status (99.9%)</Link></li>
            <li><Link to="/sell" className="text-muted-foreground hover:text-foreground">Creator Studio</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground">Documentation</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/docs" className="text-muted-foreground hover:text-foreground">Quickstart Guide</Link></li>
            <li><Link to="/docs?page=selling" className="text-muted-foreground hover:text-foreground">Selling Guide</Link></li>
            <li><Link to="/docs?page=scam-protection" className="text-muted-foreground hover:text-foreground">Scam-Shield Escrow</Link></li>
            <li><Link to="/docs?page=api" className="text-muted-foreground hover:text-foreground">REST API Reference</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground">Legal & Privacy</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/tos" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            <li><Link to="/admin" className="text-muted-foreground/40 hover:text-muted-foreground">Admin Portal</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 text-center text-xs text-muted-foreground/60 px-4">
        <span>© {new Date().getFullYear()} {BRAND.name}. Built for Emergency Response: Liberty County. Not affiliated with Roblox Corporation.</span>
      </div>
    </footer>
  );
}
