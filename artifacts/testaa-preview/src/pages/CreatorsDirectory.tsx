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
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { localDb } from "@/lib/localDb";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

export default function CreatorsDirectory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [creators, setCreators] = useState<any[]>([]);
  const [listingsCountMap, setListingsCountMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [followedMap, setFollowedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        const listingQuery = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
        const allListings: any[] = await listingQuery({ status: "active" }, "-created_date", 200);

        // Calculate listing counts per creator
        const counts: Record<string, number> = {};
        const extractedCreators: Record<string, any> = {};

        allListings.forEach((l) => {
          const u = (l.seller_username || l.seller_name || "creator").toLowerCase();
          counts[u] = (counts[u] || 0) + 1;
          if (!extractedCreators[u]) {
            extractedCreators[u] = {
              username: l.seller_username || u,
              display_name: l.seller_name || u,
              bio: "ER:LC emergency vehicle livery & uniform designer.",
              avatar_url: l.images && l.images.length > 0 ? l.images[0] : null,
              roblox_username: l.roblox_asset_id ? "Verified" : "",
            };
          }
        });

        // Also fetch from registered profiles store
        const registered = localDb.entities.CreatorProfile.getAll();
        registered.forEach((p: any) => {
          if (p.username) {
            extractedCreators[p.username.toLowerCase()] = p;
          }
        });

        const list = Object.values(extractedCreators);
        setCreators(list);
        setListingsCountMap(counts);

        // Check follows
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

  const filtered = creators.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const inUser = c.username?.toLowerCase().includes(q);
    const inName = c.display_name?.toLowerCase().includes(q);
    const inBio = c.bio?.toLowerCase().includes(q);
    return inUser || inName || inBio;
  });

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* Header */}
        <div className="border-b border-white/[0.06] bg-[#0A0D15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-2.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>Creator & Studio Directory</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  Discover ER:LC Creators
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                  Browse verified vehicle livery designers, uniform modelers, and emergency pack creators with public storefronts.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/following"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#07090E] hover:bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-zinc-300 transition"
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>View Following</span>
                </Link>

                <Link
                  to="/dashboard/profile"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-black shadow-md shadow-emerald-500/20 transition"
                >
                  <span>My Storefront</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-8 max-w-md relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators by name, handle (@oumar), or style..."
                className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6 text-xs text-zinc-400 font-mono">
            <span>Showing <strong className="text-white">{filtered.length}</strong> verified creators</span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs text-zinc-500 animate-pulse">
              Loading creators directory…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-12 text-center max-w-md mx-auto shadow-xl">
              <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No creators found</h3>
              <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                Be the first creator to register your unique handle and storefront on LibertyX!
              </p>
              <Link
                to="/dashboard/profile"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black"
              >
                Create Storefront
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((creator) => {
                const prodCount = listingsCountMap[creator.username?.toLowerCase()] || 0;
                const followers = localDb.getFollowersCount(creator.username);
                const isF = followedMap[creator.username] || false;

                return (
                  <div
                    key={creator.username}
                    className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5 space-y-4 hover:border-emerald-500/35 transition-all flex flex-col justify-between shadow-xl group"
                  >
                    <div>
                      {/* Avatar & Badges */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <Link to={`/u/${creator.username}`} className="flex items-center gap-3 min-w-0">
                          <div className="w-13 h-13 rounded-2xl overflow-hidden border border-emerald-500/30 bg-black shrink-0">
                            {creator.avatar_url ? (
                              <img src={creator.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-white bg-zinc-900">
                                {(creator.display_name || creator.username || "C").charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition truncate">
                                {creator.display_name}
                              </h3>
                              <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            </div>
                            <span className="text-xs font-mono text-zinc-400 block truncate">@{creator.username}</span>
                          </div>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleToggleFollow(creator)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0",
                            isF
                              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : "bg-white/[0.06] hover:bg-emerald-500 hover:text-black text-zinc-200"
                          )}
                        >
                          {isF ? "Following" : "Follow"}
                        </button>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                        {creator.bio || "Authentic ER:LC emergency livery & uniform designer."}
                      </p>

                      {/* Stats */}
                      <div className="mt-3 pt-3 border-t border-white/[0.04] grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                        <div className="p-1.5 rounded-lg bg-[#07090E]">
                          <span className="text-zinc-500 block text-[9px]">PRODUCTS</span>
                          <span className="font-bold text-white">{prodCount}</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-[#07090E]">
                          <span className="text-zinc-500 block text-[9px]">RATING</span>
                          <span className="font-bold text-emerald-400">5.0 ★</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-[#07090E]">
                          <span className="text-zinc-500 block text-[9px]">FOLLOWERS</span>
                          <span className="font-bold text-white">{followers}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Storefront CTA */}
                    <div className="pt-2">
                      <Link
                        to={`/u/${creator.username}`}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500 hover:text-black text-xs font-bold text-zinc-200 transition"
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>View Storefront</span>
                      </Link>
                    </div>
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
