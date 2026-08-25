import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Store,
  UserCheck,
  UserMinus,
  Star,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  Compass,
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

export default function Following() {
  const { user } = useAuth();
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [creatorProfiles, setCreatorProfiles] = useState<Record<string, any>>({});
  const [creatorListings, setCreatorListings] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const list = localDb.getFollowingList(user.id);
        setFollowingList(list);

        // Load profiles & listings for each followed creator
        const profMap: Record<string, any> = {};
        const listMap: Record<string, any[]> = {};
        const listingQuery = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
        const allListings: any[] = await listingQuery({ status: "active" }, "-created_date", 100);

        for (const item of list) {
          const username = item.creator_username;
          if (!username) continue;
          const p = await localDb.getCreatorProfile(username);
          if (p) profMap[username] = p;

          const myItems = allListings.filter(
            (l) => l.seller_username?.toLowerCase() === username.toLowerCase() || l.seller_id === p?.user_id
          );
          listMap[username] = myItems;
        }

        setCreatorProfiles(profMap);
        setCreatorListings(listMap);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.id]);

  const handleUnfollow = async (creatorUsername: string) => {
    if (!user?.id) return;
    const prof = creatorProfiles[creatorUsername] || { username: creatorUsername };
    await localDb.toggleFollow(user.id, prof);
    setFollowingList((prev) => prev.filter((f) => f.creator_username !== creatorUsername));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="max-w-md mx-auto my-auto p-10 text-center rounded-2xl border border-white/[0.08] bg-[#0A0D15] shadow-2xl">
          <Users className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Sign in to view your followed creators</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Follow your favorite ER:LC designers and livery studios to stay updated on new drops.
          </p>
          <Link
            to="/login?returnTo=/following"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-xs font-bold text-black transition"
          >
            Sign in with Discord
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* Header */}
        <div className="border-b border-white/[0.06] bg-[#0A0D15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-0.5 text-xs font-semibold text-emerald-400 mb-2">
                <Users className="h-3.5 w-3.5" />
                <span>Followed Creators & Studios</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Following Directory
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Stay updated with release drops from your favorite verified ER:LC creators.
              </p>
            </div>

            <Link
              to="/creators"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#07090E] hover:bg-white/[0.04] text-xs font-semibold text-zinc-200 transition"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Explore Creators</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="py-20 text-center text-xs text-zinc-500 animate-pulse">
              Loading followed creators…
            </div>
          ) : followingList.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-12 text-center max-w-md mx-auto shadow-xl">
              <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">You aren't following any creators yet</h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Discover verified livery designers, emergency vehicle modelers, and uniform studios in the marketplace.
              </p>
              <Link
                to="/creators"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-black transition"
              >
                <span>Browse Creators Directory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Following <strong className="text-white">{followingList.length}</strong> verified creators</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {followingList.map((item) => {
                  const prof = creatorProfiles[item.creator_username] || {};
                  const prods = creatorListings[item.creator_username] || [];
                  const followers = localDb.getFollowersCount(item.creator_username);

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4 hover:border-emerald-500/30 transition-all flex flex-col justify-between shadow-xl"
                    >
                      <div>
                        {/* Top: Avatar & Action */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3.5">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-emerald-500/30 bg-black shrink-0">
                              {prof.avatar_url ? (
                                <img src={prof.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-white bg-zinc-900">
                                  {(prof.display_name || item.creator_name || "C").charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-bold text-sm text-white">{prof.display_name || item.creator_name}</h3>
                                <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                              </div>
                              <span className="text-xs font-mono text-zinc-400">@{item.creator_username}</span>
                              <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono mt-0.5">
                                <span>{prods.length} Products</span>
                                <span>•</span>
                                <span>{followers} Followers</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUnfollow(item.creator_username)}
                            className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-red-500/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 transition"
                            title="Unfollow"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Bio snippet */}
                        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                          {prof.bio || "Verified ER:LC emergency livery & uniform designer."}
                        </p>
                      </div>

                      {/* Footer: Store Link */}
                      <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          Storefront Live
                        </span>

                        <Link
                          to={`/u/${item.creator_username}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline"
                        >
                          <span>Visit Storefront</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
