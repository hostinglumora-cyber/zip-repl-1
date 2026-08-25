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
  Plus,
  Users,
  Flame,
  UserPlus,
  UserCheck,
  Server,
  MapPin,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { DEPARTMENTS } from "@/lib/departments";
import { BRAND } from "@/lib/brand";
import { MarketplaceCard } from "@/pages/Marketplace";
import { localDb } from "@/lib/localDb";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

export { MarketplaceCard as ListingCard };

const CATEGORIES_LIST = [
  { id: "Law Enforcement", label: "🚓 Law Enforcement", to: "/marketplace?cat=Law+Enforcement" },
  { id: "Sheriff", label: "🚔 Sheriff", to: "/marketplace?dept=Sheriff" },
  { id: "Fire & Rescue", label: "🔥 Fire & Rescue", to: "/marketplace?cat=Fire+%26+Rescue" },
  { id: "EMS", label: "🚑 EMS", to: "/marketplace?cat=EMS" },
  { id: "DOT & Transit", label: "🚧 DOT & Transit", to: "/marketplace?cat=DOT" },
  { id: "Civilian", label: "🚗 Civilian", to: "/marketplace?cat=Civilian" },
  { id: "Liveries", label: "🎨 Liveries", to: "/marketplace?cat=Liveries" },
  { id: "Uniforms", label: "👕 Uniforms", to: "/marketplace?cat=Uniforms" },
  { id: "Maps", label: "🗺️ Maps", to: "/marketplace?cat=Map+Templates" },
  { id: "ELS", label: "⚡ ELS", to: "/marketplace?cat=ELS" },
  { id: "Bundles", label: "📦 Bundles", to: "/marketplace?cat=Bundles" },
  { id: "Services", label: "🛠️ Services", to: "/marketplace?cat=Services" },
];

export default function Home() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [creatorTab, setCreatorTab] = useState<"trending" | "new" | "top">("trending");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [followedMap, setFollowedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const query = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
    Promise.all([
      query({ status: "active" }, "-created_date", 24),
      localDb.getDeduplicatedCreators(),
    ])
      .then(([rows, creatorList]: [any[], any[]]) => {
        setListings(rows || []);
        setCreators(creatorList || []);

        if (user?.id) {
          const map: Record<string, boolean> = {};
          creatorList.forEach((c) => {
            localDb.isFollowing(user.id, c.username).then((isF) => {
              map[c.username] = isF;
            });
          });
          setFollowedMap(map);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleToggleFollow = async (c: any) => {
    if (!user) {
      alert("Please sign in to follow creators.");
      return;
    }
    const res = await localDb.toggleFollow(user.id, c);
    setFollowedMap((prev) => ({ ...prev, [c.username]: res.following }));
  };

  const displayedListings = listings.slice(0, 8);

  const tabCreators = (() => {
    if (creatorTab === "top") {
      return [...creators].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
    }
    if (creatorTab === "new") {
      return [...creators].sort((a, b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime());
    }
    return creators;
  })().slice(0, 6);

  return (
    <div className="min-h-screen text-white bg-[#070709] selection:bg-emerald-500/25 selection:text-emerald-300">
      <SiteNav />

      {/* ─── TIGHT COMPACT ERM HERO ─── */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-white/[0.07] overflow-hidden">
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-44 opacity-20"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.35) 0%, transparent 70%)",
            filter: "blur(45px)",
          }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-4">
          
          {/* Sleek pill release badge */}
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-[#111215] px-3.5 py-1 text-xs font-semibold text-emerald-400 hover:border-emerald-500/40 transition shadow-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>✨ Introducing Verified Community Drops</span>
            <span className="text-zinc-500 text-[10px]">→</span>
          </Link>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Discover ER:LC creations from the community.
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Browse verified emergency vehicle liveries, uniform packages, ELS profiles, and map templates with instant automated escrow release.
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative pt-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search liveries, uniforms, vehicles, maps, creators..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#111215] pl-9 pr-24 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 shadow-xl transition"
            />
            <Link
              to={searchQuery ? `/marketplace?q=${encodeURIComponent(searchQuery)}` : "/marketplace"}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition"
            >
              Search
            </Link>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2 max-w-3xl mx-auto">
            {CATEGORIES_LIST.map((c) => (
              <Link
                key={c.id}
                to={c.to}
                className="px-2.5 py-1 rounded-lg border border-white/[0.06] bg-[#111215] hover:border-emerald-500/30 hover:text-white text-zinc-400 text-xs font-medium transition"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEDUPLICATED CREATOR DISCOVERY ─── */}
      {creators.length > 0 && (
        <section className="py-10 px-4 sm:px-6 lg:px-8 border-b border-white/[0.07] bg-[#0A0B0E]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Featured ER:LC Creators
                </h2>
                <p className="text-xs text-zinc-400">Discover verified design studios and emergency asset creators.</p>
              </div>

              <div className="flex items-center gap-1 bg-[#111215] p-1 rounded-xl border border-white/[0.06]">
                {[
                  { id: "trending", label: "🔥 Trending" },
                  { id: "top", label: "🏆 Top Sellers" },
                  { id: "new", label: "🆕 New" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setCreatorTab(t.id as any)}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-lg transition",
                      creatorTab === t.id
                        ? "bg-emerald-500 text-black font-bold shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {tabCreators.map((c) => {
                const isF = followedMap[c.username] || false;
                return (
                  <div
                    key={c.username}
                    className="rounded-xl border border-white/[0.07] bg-[#111215] p-3.5 space-y-2.5 hover:border-emerald-500/35 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <Link to={`/u/${c.username}`} className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-500/30 bg-black shrink-0">
                            {c.avatar_url ? (
                              <img src={c.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-white bg-zinc-900 text-xs">
                                {(c.display_name || c.username || "C").charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <h3 className="font-bold text-xs text-white truncate">{c.display_name}</h3>
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            </div>
                            <span className="text-[10px] font-mono text-zinc-400 block truncate">@{c.username}</span>
                          </div>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleToggleFollow(c)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0",
                            isF
                              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : "bg-white/[0.06] hover:bg-emerald-500 hover:text-black text-zinc-200"
                          )}
                        >
                          {isF ? "Following" : "Follow"}
                        </button>
                      </div>

                      <div className="pt-2 border-t border-white/[0.04] grid grid-cols-3 gap-1 text-center text-[10px] font-mono">
                        <div className="p-1 rounded bg-[#070709]">
                          <span className="text-zinc-500 block text-[9px]">PRODUCTS</span>
                          <span className="font-bold text-white">{c.products_count}</span>
                        </div>
                        <div className="p-1 rounded bg-[#070709]">
                          <span className="text-zinc-500 block text-[9px]">RATING</span>
                          <span className="font-bold text-emerald-400">{c.rating ? `${c.rating} ★` : "—"}</span>
                        </div>
                        <div className="p-1 rounded bg-[#070709]">
                          <span className="text-zinc-500 block text-[9px]">SALES</span>
                          <span className="font-bold text-white">{c.sales_count}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/u/${c.username}`}
                      className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/[0.04] hover:bg-emerald-500 hover:text-black text-xs font-bold text-zinc-300 transition"
                    >
                      <span>View Storefront</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── LIVE MARKETPLACE CATALOG ─── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Community Releases & Drops
            </h2>
            <p className="text-xs text-zinc-400">Verified ER:LC emergency vehicle liveries, uniform packages, and maps.</p>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline"
          >
            <span>View All ({listings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dynamic Connected Listings Grid */}
        {!loading && displayedListings.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.07] bg-[#111215] p-8 text-center max-w-md mx-auto shadow-xl space-y-2">
            <Store className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">No listings yet</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Be the first creator to publish an ER:LC vehicle skin, uniform pack, or map template.
            </p>
            <div className="pt-2">
              <Link
                to="/sell"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-bold text-black transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish First Asset</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedListings.map((listing) => (
              <MarketplaceCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* ─── COMPACT PROMOTIONAL STRIP ─── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/[0.07] bg-[#0A0B0E]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-5 rounded-xl border border-white/[0.07] bg-[#111215] space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                0% Commission
              </span>
              <h3 className="text-sm font-bold text-white mt-1.5">Publish on LibertyX</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Retain 100% of proceeds on your liveries and packs with automated vault escrow delivery.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/sell" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline">
                Open Creator Studio <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/[0.07] bg-[#111215] space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                $12.99 / mo
              </span>
              <h3 className="text-sm font-bold text-white mt-1.5">LibertyX Community Hosting</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dedicated high-performance cloud nodes for ER:LC bot hosting and community servers.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/hosting" className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:underline">
                Explore Hosting Plans <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#050507] text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-black text-sm text-white">
            Liberty<span className="text-emerald-400">X</span>
          </Link>
          <span className="text-zinc-600">•</span>
          <span className="text-[11px] text-zinc-500 font-mono">ER:LC Marketplace & Platform</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap text-xs text-zinc-400">
          <Link to="/marketplace" className="hover:text-white transition">Marketplace</Link>
          <Link to="/creators" className="hover:text-white transition">Creators</Link>
          <Link to="/hosting" className="hover:text-white transition">Hosting</Link>
          <Link to="/docs" className="hover:text-white transition">Documentation</Link>
          <Link to="/status" className="hover:text-white transition">Status</Link>
          <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link to="/tos" className="hover:text-white transition">Terms</Link>
        </div>

        <div className="text-[11px] text-zinc-600 font-mono">
          © {new Date().getFullYear()} LibertyX.
        </div>
      </div>
    </footer>
  );
}
