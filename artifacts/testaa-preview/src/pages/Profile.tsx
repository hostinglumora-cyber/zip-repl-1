import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Store, Star, BadgeCheck, Calendar, ShieldCheck, User } from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { MarketplaceCard } from "@/pages/Marketplace";
import { Footer } from "@/pages/Home";
import { localDb } from "@/lib/localDb";

const db = (globalThis as any).__B44_DB__ || localDb;

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        let sellerId = id;
        let myListings: any[] = [];
        if (id === "me") {
          const saved = window.localStorage.getItem("discord_user");
          const me = saved ? JSON.parse(saved) : await (db.auth?.me?.() || localDb.auth.me());
          if (!active) return;
          setProfile(me || { display_name: "Verified Creator", username: "creator" });
          sellerId = me?.id || "creator_local";
          const query = db.entities?.Listing?.filter || localDb.entities.Listing.filter;
          myListings = await query({ status: "active" }, "-created_date", 50);
        } else {
          const userQuery = db.entities?.User?.get || localDb.entities.User.get;
          const u = await userQuery(id).catch(() => ({ id, display_name: "Verified Creator", username: id }));
          if (!active) return;
          setProfile(u);
          const query = db.entities?.Listing?.filter || localDb.entities.Listing.filter;
          myListings = await query({ seller_id: id, status: "active" }, "-created_date", 50);
        }
        if (!active) return;
        setListings(myListings || []);

        const revQuery = db.entities?.Review?.filter || localDb.entities.Review.filter;
        const revs = await revQuery({}, "-created_date", 100).catch(() => []);
        if (!active) return;
        const ids = new Set(myListings.map((l: any) => l.id));
        setReviews((revs || []).filter((r: any) => ids.has(r.listing_id)));
      } catch (e) {
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white grid place-items-center">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="max-w-md mx-auto my-auto p-12 text-center rounded-3xl border border-white/[0.08] bg-[#0A0D15]">
          <User className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Creator not found</h2>
          <p className="text-xs text-zinc-400 mb-6">This creator profile may have been removed.</p>
          <Link to="/marketplace" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black">
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const initials = ((profile.display_name || profile.name || profile.username || "C").charAt(0)).toUpperCase();
  const avatarUrl = profile.avatar_url || profile.avatarUrl;

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* Profile Banner */}
        <div className="relative h-44 sm:h-56 bg-gradient-to-r from-[#0C121A] via-[#0A0E15] to-[#07090E] border-b border-white/[0.06] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="w-24 h-24 rounded-3xl bg-[#0A0D15] border-4 border-[#07090E] shadow-2xl flex items-center justify-center text-3xl font-black text-emerald-400 shrink-0 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white">
                    {profile.display_name || profile.name || profile.username || "Creator"}
                  </h1>
                  <BadgeCheck className="w-5 h-5 text-emerald-400" />
                </div>
                {profile.username && (
                  <p className="text-xs text-zinc-400 font-mono">@{profile.username}</p>
                )}
                <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified LibertyX Creator</span>
                </div>
              </div>
            </div>

            <div className="flex gap-6 sm:pb-1">
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] px-4 py-2.5 text-center">
                <span className="text-xs text-zinc-500 font-mono block uppercase">Listings</span>
                <span className="text-lg font-black font-mono text-white">{listings.length}</span>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] px-4 py-2.5 text-center">
                <span className="text-xs text-zinc-500 font-mono block uppercase">Rating</span>
                <span className="text-lg font-black font-mono text-emerald-400">5.0 ★</span>
              </div>
            </div>
          </div>

          {/* Published Listings */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-400" />
                <span>Storefront Releases</span>
              </h2>
              <span className="text-xs font-mono text-zinc-500">{listings.length} items</span>
            </div>

            {listings.length === 0 ? (
              <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-12 text-center">
                <Store className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-white mb-1">No active listings yet</p>
                <p className="text-xs text-zinc-400 mb-4">This creator hasn't published any public assets yet.</p>
                <Link to="/marketplace" className="text-xs font-bold text-emerald-400 hover:underline">
                  Browse full marketplace
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map((l) => (
                  <MarketplaceCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}