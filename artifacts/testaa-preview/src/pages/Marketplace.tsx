import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  ShieldCheck,
  Tag,
  Store,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Plus,
  ArrowRight,
  BadgeCheck,
  SlidersHorizontal,
  X,
  Car,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { DEPARTMENTS, CATEGORIES } from "@/lib/departments";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";
import PurchaseModal from "@/components/PurchaseModal";
import { localDb } from "@/lib/localDb";

const db = (globalThis as any).__B44_DB__ || localDb;

export { Footer };

const SORTS = [
  { id: "new", label: "Newest Drops" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "popular", label: "Most Popular" },
];

export function MarketplaceCard({ listing }: { listing: any }) {
  const [showPurchase, setShowPurchase] = useState(false);
  const isFree = listing.price_type === "Free" || !listing.price || listing.price === 0;
  const priceDisplay = isFree ? "FREE" : `R$ ${listing.price}`;
  const department = listing.departments && listing.departments.length > 0 ? listing.departments[0] : "Police";

  return (
    <>
      <div className="group rounded-2xl border border-white/[0.08] bg-[#090C12] hover:border-emerald-500/35 hover:bg-[#0D111A] transition-all flex flex-col justify-between overflow-hidden shadow-lg">
        <div>
          {/* Screenshot / Preview */}
          <Link to={`/listing/${listing.id}`} className="block relative aspect-[16/10] bg-black/60 overflow-hidden">
            {listing.images && listing.images.length > 0 ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#0D121B] to-[#07090E]">
                <Store className="w-8 h-8 text-zinc-700 mb-1" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase">{department} Livery</span>
              </div>
            )}

            {/* Department Tag */}
            <div className="absolute top-2.5 left-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-black/85 border border-emerald-500/30 px-2 py-0.5 rounded backdrop-blur-md">
                {department}
              </span>
            </div>

            {/* Price Tag Pill */}
            <div className="absolute bottom-2.5 right-2.5">
              <span className={cn(
                "text-xs font-mono font-extrabold px-2.5 py-0.5 rounded shadow-md",
                isFree ? "bg-white text-black font-bold" : "bg-emerald-500 text-black font-bold"
              )}>
                {priceDisplay}
              </span>
            </div>
          </Link>

          {/* Details */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span className="truncate">{listing.category || "Asset"} • {listing.listing_type || "Single"}</span>
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <Star className="w-3 h-3 fill-emerald-400" />
                <span>5.0</span>
              </div>
            </div>

            <Link to={`/listing/${listing.id}`} className="block">
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition line-clamp-1">
                {listing.title}
              </h3>
            </Link>

            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Card Footer: Creator & Action */}
        <div className="px-4 py-3 border-t border-white/[0.04] bg-[#07090E] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0">
              {(listing.seller_name || "C").charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-zinc-400 truncate">{listing.seller_name || "Creator"}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowPurchase(true)}
            className="px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-emerald-500 hover:text-black text-xs font-bold text-zinc-200 transition shrink-0"
          >
            {isFree ? "Get Free" : "Purchase"}
          </button>
        </div>
      </div>

      <PurchaseModal
        listing={listing}
        open={showPurchase}
        onOpenChange={setShowPurchase}
      />
    </>
  );
}

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const dept = searchParams.get("dept") || "";
  const cat = searchParams.get("cat") || "";
  const freeOnly = searchParams.get("free") === "true";
  const sort = searchParams.get("sort") || "new";

  const setParam = (key: string, val: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!val) {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
  };

  useEffect(() => {
    const query = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
    query({ status: "active" }, "-created_date", 100)
      .then((rows: any[]) => setListings(rows || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = listings
    .filter((l) => {
      // Department filter
      if (dept) {
        const matchesDept = l.departments?.some((d: string) => d.toLowerCase() === dept.toLowerCase());
        if (!matchesDept) return false;
      }
      // Category filter
      if (cat) {
        const matchesCat = l.category?.toLowerCase() === cat.toLowerCase();
        if (!matchesCat) return false;
      }
      // Free only
      if (freeOnly) {
        const isFree = l.price_type === "Free" || !l.price || l.price === 0;
        if (!isFree) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = l.title?.toLowerCase().includes(q);
        const inDesc = l.description?.toLowerCase().includes(q);
        const inSeller = l.seller_name?.toLowerCase().includes(q);
        const inCat = l.category?.toLowerCase().includes(q);
        return inTitle || inDesc || inSeller || inCat;
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sort === "price_desc") return (b.price || 0) - (a.price || 0);
      return new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime();
    });

  return (
    <div className="min-h-screen bg-[#06080C] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* ─── MARKETPLACE HEADER & FILTERS ─── */}
        <div className="border-b border-white/[0.06] bg-[#080B10]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-2.5">
                  <Store className="h-3.5 w-3.5" />
                  <span>Verified Asset Catalog</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  ER:LC Marketplace Directory
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                  Browse authentic vehicle liveries, uniform packs, ELS siren soundbanks, and map templates with instant escrow delivery.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-xs sm:text-sm font-bold text-black shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Asset</span>
                </Link>
              </div>
            </div>

            {/* ─── SEARCH & CONTROLS ROW ─── */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search Bar */}
              <div className="md:col-span-6 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search liveries, Tahoe, Crown Vic, Sheriff, ELS..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#06080C] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Department Dropdown */}
              <div className="md:col-span-2">
                <select
                  value={dept}
                  onChange={(e) => setParam("dept", e.target.value)}
                  aria-label="Filter by department"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#06080C] px-3.5 py-2.5 text-xs sm:text-sm text-zinc-200 outline-none focus:border-emerald-500/50 transition"
                >
                  <option value="">All Departments</option>
                  <option value="Police">Police</option>
                  <option value="Sheriff">Sheriff</option>
                  <option value="Fire">Fire & Rescue</option>
                  <option value="DOT">DOT & Transit</option>
                </select>
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-2">
                <select
                  value={cat}
                  onChange={(e) => setParam("cat", e.target.value)}
                  aria-label="Filter by category"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#06080C] px-3.5 py-2.5 text-xs sm:text-sm text-zinc-200 outline-none focus:border-emerald-500/50 transition"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => {
                    const catId = typeof c === "string" ? c : c.id;
                    return (
                      <option key={catId} value={catId}>
                        {catId}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="md:col-span-2">
                <select
                  value={sort}
                  onChange={(e) => setParam("sort", e.target.value)}
                  aria-label="Sort listings"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#06080C] px-3.5 py-2.5 text-xs sm:text-sm text-zinc-200 outline-none focus:border-emerald-500/50 transition"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Pills */}
            <div className="mt-4 flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-mono text-zinc-500 mr-1">Filter:</span>
                {["", "Police", "Sheriff", "Fire", "DOT"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setParam("dept", d || null)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-semibold border transition-all",
                      (dept === d || (!dept && d === ""))
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white"
                    )}
                  >
                    {d || "All Units"}
                  </button>
                ))}
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-semibold select-none">
                <input
                  type="checkbox"
                  checked={freeOnly}
                  onChange={(e) => setParam("free", e.target.checked ? "true" : null)}
                  className="rounded border-white/[0.1] bg-[#06080C] text-emerald-500 focus:ring-0"
                />
                <span>Free Drops Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* ─── MARKETPLACE ASSET GRID ─── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-mono text-zinc-400">
              Showing <strong className="text-white">{filtered.length}</strong> active assets
            </span>

            {(dept || cat || freeOnly || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-emerald-400 hover:underline inline-flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs text-zinc-500 animate-pulse">
              Loading marketplace assets…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#090C12] p-12 text-center max-w-md mx-auto shadow-xl">
              <Store className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <h3 className="text-base font-bold text-white mb-1">No assets match your search</h3>
              <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                Try adjusting your search terms, changing the department filter, or resetting all filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold transition hover:bg-emerald-400"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((listing) => (
                <MarketplaceCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
