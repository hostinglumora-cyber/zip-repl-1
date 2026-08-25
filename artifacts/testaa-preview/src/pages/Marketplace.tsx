const db = (globalThis as any).__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy({}, { get: () => ({ filter: async () => [], get: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }) }),
  integrations: { Core: { UploadFile: async () => ({ file_url: "" }) } },
};

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Store,
  SlidersHorizontal,
  Search,
  Check,
  Sparkles,
  ShoppingBag,
  Tag,
  ArrowUpDown,
  X,
  ShieldCheck,
  Boxes,
  Gift,
  KeyRound,
  Filter,
  Layers,
  Star,
  Download,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  User,
  Plus,
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { DEPARTMENTS, CATEGORIES } from "@/lib/departments";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";
import PurchaseModal from "@/components/PurchaseModal";

export { Footer };

const SORTS = [
  { id: "new", label: "Newest Drops" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "popular", label: "Most Popular" },
];

export function MarketplaceCard({ listing }: { listing: any }) {
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const isFree = listing.price_type === "Free" || !listing.price || listing.price === 0;
  const image = listing.images && listing.images.length > 0 ? listing.images[0] : null;
  const department = listing.departments && listing.departments.length > 0 ? listing.departments[0] : "General";

  return (
    <>
      <div className="group rounded-2xl border border-white/[0.08] bg-[#0A0E16] hover:border-emerald-500/35 hover:bg-[#0D121D] transition-all flex flex-col justify-between overflow-hidden shadow-lg">
        {/* Media Preview */}
        <Link to={`/listing/${listing.id}`} className="relative block aspect-[16/10] bg-black/40 overflow-hidden">
          {image && !imgErr ? (
            <img
              src={image}
              alt={listing.title}
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#0C1018] to-[#080A0F]">
              <Store className="w-8 h-8 text-zinc-600 mb-1.5" />
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">{department} Asset</span>
            </div>
          )}

          {/* Department Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-black/80 border border-emerald-500/30 px-2 py-0.5 rounded-md backdrop-blur-md">
              {department}
            </span>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-2.5 right-2.5">
            <span
              className={cn(
                "text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-md",
                isFree
                  ? "bg-emerald-500 text-black"
                  : "bg-black/85 text-emerald-300 border border-emerald-500/40"
              )}
            >
              {isFree ? "FREE" : `R$ ${listing.price}`}
            </span>
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1 font-mono">
              <span>{listing.category || "Asset"}</span>
              <div className="flex items-center gap-1 text-emerald-400">
                <Star className="w-3 h-3 fill-emerald-400" />
                <span>5.0</span>
              </div>
            </div>

            <Link to={`/listing/${listing.id}`} className="block group-hover:text-emerald-400 transition-colors">
              <h3 className="text-sm font-bold text-white line-clamp-1 leading-snug">
                {listing.title || "Untitled Listing"}
              </h3>
            </Link>

            <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
              {listing.description || "Authentic ER:LC emergency livery package with instant escrow key delivery."}
            </p>
          </div>

          {/* Card Footer: Creator info + Action button */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                {(listing.seller_name || "C").charAt(0).toUpperCase()}
              </div>
              <span className="text-[11px] text-zinc-300 font-medium truncate">
                {listing.seller_name || "Verified Creator"}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPurchaseOpen(true);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm shrink-0"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>{isFree ? "Get" : "Buy"}</span>
            </button>
          </div>
        </div>
      </div>

      <PurchaseModal
        listing={listing}
        open={purchaseOpen}
        onOpenChange={setPurchaseOpen}
      />
    </>
  );
}

export default function Marketplace() {
  const [params, setParams] = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const dept = params.get("dept") || "";
  const cat = params.get("cat") || "";
  const sort = params.get("sort") || "new";
  const freeOnly = params.get("free") === "1";

  useEffect(() => {
    setLoading(true);
    db.entities.Listing.filter({ status: "active" }, "-created_date", 200)
      .then((rows: any[]) => setListings(rows || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = listings.filter((l) => {
      if (dept && !l.departments?.some((d: string) => d.toLowerCase() === dept.toLowerCase())) return false;
      if (cat && l.category?.toLowerCase() !== cat.toLowerCase()) return false;
      if (freeOnly && l.price_type !== "Free" && Number(l.price) > 0) return false;
      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase();
        const matchTitle = l.title?.toLowerCase().includes(s);
        const matchDesc = l.description?.toLowerCase().includes(s);
        const matchSeller = l.seller_name?.toLowerCase().includes(s);
        if (!matchTitle && !matchDesc && !matchSeller) return false;
      }
      return true;
    });

    if (sort === "price_asc") {
      result = [...result].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sort === "price_desc") {
      result = [...result].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sort === "popular") {
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime()
      );
    }
    return result;
  }, [listings, dept, cat, searchQuery, sort, freeOnly]);

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next);
  };

  const hasActiveFilters = Boolean(dept || cat || freeOnly || sort !== "new" || searchQuery);

  const clearAllFilters = () => {
    setSearchQuery("");
    setParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white selection:bg-emerald-500/25 selection:text-emerald-300 flex flex-col justify-between">
      <div>
        <SiteNav />

        {/* ─── MARKETPLACE HERO & HEADER ─── */}
        <section className="border-b border-white/[0.06] bg-[#0A0D15] py-10 lg:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
                  <Store className="w-3.5 h-3.5" />
                  Official ER:LC Catalog
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  ER:LC Asset Marketplace
                </h1>
                <p className="mt-2 text-sm text-zinc-400 max-w-xl leading-relaxed">
                  Browse authentic vehicle liveries, uniform packs, ELS siren soundbanks, and map templates with sub-second escrow delivery.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-xs sm:text-sm font-bold text-black shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Asset</span>
                </Link>
              </div>
            </div>

            {/* ─── SEARCH & FILTER CONTROLS BAR ─── */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search Bar */}
              <div className="md:col-span-6 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search liveries, Crown Vic, Tahoe, Sheriff, ELS..."
                  className="w-full rounded-2xl border border-white/[0.1] bg-[#07090E] pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 transition shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Department Dropdown */}
              <div className="md:col-span-2">
                <select
                  value={dept}
                  onChange={(e) => setParam("dept", e.target.value)}
                  aria-label="Filter by department"
                  className="w-full rounded-2xl border border-white/[0.1] bg-[#07090E] px-4 py-3 text-xs sm:text-sm text-zinc-200 outline-none focus:border-emerald-500/50 transition"
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
                  className="w-full rounded-2xl border border-white/[0.1] bg-[#07090E] px-4 py-3 text-xs sm:text-sm text-zinc-200 outline-none focus:border-emerald-500/50 transition"
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
                  aria-label="Sort marketplace drops"
                  className="w-full rounded-2xl border border-white/[0.1] bg-[#07090E] px-4 py-3 text-xs sm:text-sm text-zinc-200 outline-none focus:border-emerald-500/50 transition"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Pill Strip */}
            <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setParam("dept", "")}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                    !dept
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                      : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white"
                  )}
                >
                  All Drops
                </button>

                {DEPARTMENTS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setParam("dept", dept === d.id ? "" : d.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5",
                      dept.toLowerCase() === d.id.toLowerCase()
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                        : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white"
                    )}
                  >
                    <span>{d.short}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setParam("free", freeOnly ? "" : "1")}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1",
                    freeOnly
                      ? "bg-emerald-500 text-black font-bold border-emerald-400"
                      : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white"
                  )}
                >
                  <Tag className="w-3 h-3" />
                  <span>Free Only</span>
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-zinc-400 hover:text-red-400 transition flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ─── LISTINGS GRID OR EMPTY STATE ─── */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 text-xs text-zinc-400 font-mono">
            <span>SHOWING {filtered.length} VERIFIED RELEASES</span>
            <span>ESCROW PROTECTED</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-72 rounded-2xl border border-white/[0.06] bg-[#0A0D15] animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-12 sm:p-20 text-center max-w-xl mx-auto shadow-2xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 mx-auto mb-5 shadow-inner">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No matching listings found</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
                {hasActiveFilters
                  ? "Try resetting your search query or department filters to see more community uploads."
                  : "Be the first creator to upload an authentic ER:LC asset and establish your storefront."}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-black transition shadow-lg shadow-emerald-500/20"
                  >
                    Reset Filters
                  </button>
                ) : (
                  <Link
                    to="/sell"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-black transition shadow-lg shadow-emerald-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish First Asset</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((listing) => (
                <MarketplaceCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
