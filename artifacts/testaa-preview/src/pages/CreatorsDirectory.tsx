import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Store,
  BadgeCheck,
  Star,
  ArrowRight,
  UserPlus,
  UserCheck,
  Compass,
  Check,
  ShieldCheck,
  SlidersHorizontal,
  Flame,
  Zap,
  TrendingUp,
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { localDb } from "@/lib/localDb";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

export default function CreatorsDirectory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "trending" | "new" | "top">("all");
  const [followedMap, setFollowedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        const list = await localDb.getDeduplicatedCreators();
        setCreators(list || []);

        if (user?.id) {
          const map: Record<string, boolean> = {};
          for (const c of list) {
            const isF = await localDb.isFollowing(user.id, c.username);
            map[c.username] = isF;
          }
          setFollowedMap(map);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.id]);

  const handleToggleFollow = async (creator: any) => {
    if (!user?.id) {
      navigate("/login?returnTo=/creators");
      return;
    }
    const res = await localDb.toggleFollow(user.id, creator);
    setFollowedMap((prev) => ({ ...prev, [creator.username]: res.following }));
  };

  const filtered = creators
    .filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.username?.toLowerCase().includes(q) ||
        c.display_name?.toLowerCase().includes(q) ||
        c.bio?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (activeTab === "top") return (b.sales_count || 0) - (a.sales_count || 0);
      if (activeTab === "new") return new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime();
      return (b.products_count || 0) - (a.products_count || 0);
    });

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* ─── CREATOR DIRECTORY HEADER ─── */}
        <div className="border-b border-white/[0.06] bg-[#0A0D15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-2.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>Verified Creator Index</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  ER:LC Creators & Studios
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                  Discover verified emergency vehicle livery designers, uniform creators, and custom map developers with public storefronts.
                </p>
              </div>

              <Link
                to="/sell"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-xs sm:text-sm font-bold text-black shadow-md shadow-emerald-500/20 transition-all shrink-0"
              >
                <span>Publish as a Creator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Search & Tabs */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 bg-[#07090E] p-1 rounded-xl border border-white/[0.08]">
                {[
                  { id: "all", label: "All Studios" },
                  { id: "trending", label: "🔥 Trending" },
                  { id: "new", label: "🆕 New" },
                  { id: "top", label: "🏆 Top Sellers" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={cn(
                      "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition",
                      activeTab === t.id
                        ? "bg-emerald-500 text-black font-bold shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="relative sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search creators by name or handle..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── CREATORS LIST ─── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          
          {loading ? (
            <div className="py-20 text-center text-xs text-zinc-500 animate-pulse">
              Loading creator directory…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-12 text-center max-w-md mx-auto shadow-xl space-y-3">
              <Users className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No creators found</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {searchQuery
                  ? "No creators match your search query."
                  : "Be the first creator to register and publish an ER:LC asset on LibertyX."}
              </p>
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black"
              >
                Become a Creator
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c) => {
                const isF = followedMap[c.username] || false;
                return (
                  <div
                    key={c.username}
                    className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4 hover:border-emerald-500/35 transition-all flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <Link to={`/u/${c.username}`} className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-emerald-500/30 bg-black shrink-0">
                            {c.avatar_url ? (
                              <img src={c.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-white bg-zinc-900">
                                {(c.display_name || c.username || "C").charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <h3 className="font-bold text-sm text-white truncate">{c.display_name}</h3>
                              <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            </div>
                            <span className="text-xs font-mono text-zinc-400 block truncate">@{c.username}</span>
                          </div>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleToggleFollow(c)}
                          className={cn(
                            "px-3 py-1 rounded-xl text-xs font-bold transition shrink-0",
                            isF
                              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : "bg-white/[0.06] hover:bg-emerald-500 hover:text-black text-zinc-200"
                          )}
                        >
                          {isF ? "Following" : "Follow"}
                        </button>
                      </div>

                      <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                        {c.bio || "Authentic ER:LC emergency livery designer."}
                      </p>

                      <div className="mt-4 pt-3 border-t border-white/[0.04] grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                        <div className="p-2 rounded-lg bg-[#07090E]">
                          <span className="text-zinc-500 block text-[9px]">PRODUCTS</span>
                          <span className="font-bold text-white">{c.products_count}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#07090E]">
                          <span className="text-zinc-500 block text-[9px]">RATING</span>
                          <span className="font-bold text-emerald-400">{c.rating ? `${c.rating} ★` : "—"}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#07090E]">
                          <span className="text-zinc-500 block text-[9px]">DELIVERIES</span>
                          <span className="font-bold text-white">{c.sales_count}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/u/${c.username}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500 hover:text-black text-xs font-bold text-zinc-200 transition"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>View Public Storefront</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
}
