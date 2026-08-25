import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Tag,
  Check,
  Heart,
  Store,
  Layers,
  Image as ImageIcon,
  Flame,
  BadgeCheck,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { localDb } from "@/lib/localDb";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

const CATEGORIES = [
  "All Assets",
  "Law Enforcement",
  "Sheriff",
  "Fire & Rescue",
  "EMS",
  "DOT",
  "Civilian",
  "Map Templates",
  "Uniforms",
  "ELS",
  "Bundles",
  "Services",
];

export function MarketplaceCard({ listing }: { listing: any }) {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    if (user?.id && listing?.id) {
      localDb.isFavorite(user.id, listing.id).then(setIsFav).catch(() => {});
    }
  }, [user?.id, listing?.id]);

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert("Please log in to save items to your wishlist.");
      return;
    }
    const res = await localDb.toggleFavorite(user.id, listing);
    setIsFav(res.favorited);
  };

  const isFree = listing.price_type === "Free" || !listing.price || listing.price === 0;
  const priceDisplay = isFree ? "FREE" : `R$ ${listing.price}`;
  const firstImage = listing.images && listing.images.length > 0 ? listing.images[0] : null;

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group rounded-2xl border border-white/[0.08] hover:border-emerald-500/40 bg-[#0A0D14] overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-xl"
    >
      <div>
        {/* Card Thumbnail */}
        <div className="relative aspect-[16/10] bg-black/60 overflow-hidden flex items-center justify-center">
          {firstImage && !imgErr ? (
            <img
              src={firstImage}
              alt={listing.title}
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-500">
              <ImageIcon className="w-8 h-8 opacity-40 text-emerald-400 mb-1" />
              <span className="text-[10px] font-mono">Image Preview</span>
            </div>
          )}

          {/* Category Tag Badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-[#07090E]/90 border border-emerald-500/30 px-2 py-0.5 rounded backdrop-blur-md">
              {listing.category || "Asset"}
            </span>
          </div>

          {/* Wishlist Heart */}
          <button
            type="button"
            onClick={handleToggleFav}
            className={cn(
              "absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/[0.1] transition",
              isFav ? "text-rose-500" : "text-zinc-400 hover:text-white"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", isFav && "fill-rose-500")} />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-zinc-400 truncate">
              {listing.listing_type || "Single Skin"}
            </span>
            {listing.seller_username && (
              <span className="text-[10px] text-zinc-400 truncate">
                by @{listing.seller_username}
              </span>
            )}
          </div>

          <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-emerald-400 transition">
            {listing.title}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {listing.description || "Authentic ER:LC emergency livery textures."}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & Vault Escrow */}
      <div className="p-4 pt-0 flex items-center justify-between border-t border-white/[0.04] mt-2">
        <div>
          <span className="text-[9px] font-mono text-zinc-500 uppercase block">PRICE</span>
          <span className="text-xs sm:text-sm font-black font-mono text-emerald-400">{priceDisplay}</span>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-300 group-hover:text-white transition">
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get("cat") || "All Assets";
  const searchQ = searchParams.get("q") || "";

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        const queryFn = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
        const rows = await queryFn({ status: "active" }, "-created_date", 100);
        setListings(rows || []);
      } catch (err) {
        setListings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  const filtered = listings.filter((item) => {
    // Category match
    if (selectedCategory !== "All Assets") {
      const matchCat =
        item.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        (Array.isArray(item.departments) &&
          item.departments.some((d: string) => d.toLowerCase() === selectedCategory.toLowerCase()));
      if (!matchCat) return false;
    }

    // Search query match (title, desc, tags, vehicle_models, seller)
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase().replace("#", "");
      const titleMatch = item.title?.toLowerCase().includes(q);
      const descMatch = item.description?.toLowerCase().includes(q);
      const modelMatch = item.vehicle_models?.toLowerCase().includes(q);
      const sellerMatch = item.seller_username?.toLowerCase().includes(q);
      const tagMatch =
        Array.isArray(item.tags) &&
        item.tags.some((t: string) => t.toLowerCase().replace("#", "").includes(q));

      if (!titleMatch && !descMatch && !modelMatch && !sellerMatch && !tagMatch) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#06080C] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* ─── MARKETPLACE TOP STRIP ─── */}
        <div className="border-b border-white/[0.06] bg-[#0A0D14]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-2">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Marketplace Catalog</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  ER:LC Emergency Assets & Liveries
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                  Browse community created liveries, uniform packages, map templates, and ELS profiles.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQ}
                  onChange={(e) => {
                    const val = e.target.value;
                    const next = new URLSearchParams(searchParams);
                    if (val) next.set("q", val);
                    else next.delete("q");
                    setSearchParams(next);
                  }}
                  placeholder="Search liveries, tags, vehicles..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#06080C] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 transition"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      if (cat === "All Assets") next.delete("cat");
                      else next.set("cat", cat);
                      setSearchParams(next);
                    }}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                      isSelected
                        ? "bg-emerald-500 text-black font-bold shadow-sm"
                        : "bg-[#06080C] border border-white/[0.06] text-zinc-400 hover:text-white hover:border-white/[0.12]"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── CATALOG GRID ─── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="py-20 text-center text-xs text-zinc-500 animate-pulse">
              Loading marketplace catalog…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-12 text-center max-w-md mx-auto shadow-xl space-y-3">
              <Store className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No listings found</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {searchQ || selectedCategory !== "All Assets"
                  ? "Try resetting your search filters or searching for another vehicle model."
                  : "Be the first creator to publish an ER:LC asset."}
              </p>
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black"
              >
                Become a Creator
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((item) => (
                <MarketplaceCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export { Footer };
