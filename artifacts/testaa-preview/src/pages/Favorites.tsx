import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Store,
  ArrowRight,
  Trash2,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const list = localDb.getFavorites(user.id);
    setFavorites(list);
    setLoading(false);
  }, [user]);

  const handleRemove = async (listingId: string) => {
    if (!user) return;
    await localDb.toggleFavorite(user.id, { id: listingId });
    setFavorites((prev) => prev.filter((f) => f.listing_id !== listingId));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="max-w-md mx-auto my-auto p-10 text-center rounded-2xl border border-white/[0.08] bg-[#0A0D15] shadow-2xl">
          <Heart className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Sign in to view your wishlist</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Save your favorite ER:LC vehicle liveries, uniform packages, and ELS profiles.
          </p>
          <Link
            to="/login?returnTo=/favorites"
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
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-0.5 text-xs font-semibold text-rose-400 mb-2">
                <Heart className="h-3.5 w-3.5 fill-rose-400" />
                <span>Saved Assets</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                My Favorites & Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Your saved ER:LC livery packs, uniform designs, and server assets.
              </p>
            </div>

            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#07090E] hover:bg-white/[0.04] text-xs font-semibold text-zinc-200 transition"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="py-20 text-center text-xs text-zinc-500 animate-pulse">
              Loading wishlist…
            </div>
          ) : favorites.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-12 text-center max-w-md mx-auto shadow-xl">
              <Heart className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Your wishlist is empty</h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Click the heart icon on any asset in the marketplace to save it for quick access.
              </p>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-black transition"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] overflow-hidden flex flex-col justify-between shadow-xl group hover:border-emerald-500/30 transition-all"
                >
                  <div>
                    <div className="aspect-[16/10] bg-black/60 relative overflow-hidden">
                      {fav.listing_image ? (
                        <img src={fav.listing_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <Store className="w-8 h-8" />
                        </div>
                      )}

                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-black/85 border border-emerald-500/30 px-2 py-0.5 rounded">
                          {fav.listing_department || "Police"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(fav.listing_id)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/80 text-rose-400 hover:bg-rose-500 hover:text-white transition shadow-sm"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <Link to={`/listing/${fav.listing_id}`} className="block">
                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition line-clamp-1">
                          {fav.listing_title}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-mono">By {fav.seller_name || "Creator"}</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {fav.listing_price_type === "Free" || !fav.listing_price ? "FREE" : `R$ ${fav.listing_price}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border-t border-white/[0.04] bg-[#07090E]">
                    <Link
                      to={`/listing/${fav.listing_id}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.04] hover:bg-emerald-500 hover:text-black text-xs font-bold text-zinc-200 transition"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>View Asset</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
