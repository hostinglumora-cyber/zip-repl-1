const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

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
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { Image } from "@/components/ui/image";
import { DEPARTMENTS, CATEGORIES } from "@/lib/departments";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const SORTS = [
  { id: "new", label: "Newest Drops" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "popular", label: "Most Popular" },
];

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
      if (dept && !l.departments?.includes(dept)) return false;
      if (cat && l.category !== cat) return false;
      if (freeOnly && l.price_type !== "Free") return false;
      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase();
        if (
          !l.title?.toLowerCase().includes(s) &&
          !l.seller_name?.toLowerCase().includes(s) &&
          !l.description?.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });

    if (sort === "price_asc") {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "price_desc") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === "popular") {
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else {
      result = [...result].sort(
        (a, b) =>
          new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime()
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

  return (
    <div className="min-h-screen bg-[#090D14] text-foreground selection:bg-primary/20 selection:text-primary">
      <SiteNav />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Marketplace Header Banner */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/10 px-3 py-1 text-xs font-semibold text-zinc-300 mb-3">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Verified Creator Showcase</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              LibertyX Marketplace
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Browse, filter, and instantly acquire scam-protected liveries, uniforms, ELS configs, and emergency templates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
            >
              <Store className="h-4 w-4" />
              <span>List Your Asset</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Top Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search liveries, creator handles, vehicle models, or ELS packs..."
                className="w-full rounded-xl border border-white/10 bg-secondary/40 pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-secondary/70 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="rounded-xl border border-white/10 bg-secondary/40 px-3 py-2.5 text-xs text-foreground focus:border-primary/50 focus:outline-none w-full sm:w-auto cursor-pointer"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-zinc-900 text-foreground">
                    {s.label}
                  </option>
                ))}
              </select>

              {/* Free Only Toggle Button */}
              <button
                onClick={() => setParam("free", freeOnly ? "" : "1")}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all shrink-0",
                  freeOnly
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-white/10 bg-secondary/40 text-muted-foreground hover:text-foreground"
                )}
              >
                <Gift className="h-3.5 w-3.5" />
                <span>Free Only</span>
              </button>
            </div>
          </div>

          {/* Department Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setParam("dept", "")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shrink-0",
                !dept
                  ? "bg-white/15 text-white border border-white/20 shadow-sm"
                  : "bg-secondary/40 text-muted-foreground border border-white/5 hover:text-foreground hover:bg-secondary/70"
              )}
            >
              All Departments
            </button>
            {DEPARTMENTS.map((d) => {
              const isSelected = dept === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setParam("dept", isSelected ? "" : d.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shrink-0",
                    isSelected
                      ? "bg-white/15 text-white border border-white/20 shadow-sm"
                      : "bg-secondary/40 text-muted-foreground border border-white/5 hover:text-foreground hover:bg-secondary/70"
                  )}
                >
                  <span>{d.name}</span>
                </button>
              );
            })}
            <button
              onClick={() => setParam("dept", dept === "ERLC" ? "" : "ERLC")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shrink-0",
                dept === "ERLC"
                  ? "bg-white/15 text-white border border-white/20 shadow-sm"
                  : "bg-secondary/40 text-muted-foreground border border-white/5 hover:text-foreground hover:bg-secondary/70"
              )}
            >
              ER:LC Special
            </button>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setParams(new URLSearchParams());
                }}
                className="ml-auto flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
              >
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
          <span>
            {loading ? "Loading assets..." : `Showing ${filtered.length} asset${filtered.length === 1 ? "" : "s"}`}
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Scam-Shield Guaranteed</span>
          </span>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/5 bg-card/40 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-secondary/60" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 bg-secondary/80 rounded w-3/4" />
                  <div className="h-3 bg-secondary/50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-card/20 py-20 text-center px-4">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-base font-bold text-foreground mb-1">No assets found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
              We couldn't find any listings matching your search or filters.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setParams(new URLSearchParams());
                }}
                className="rounded-xl border border-white/10 bg-secondary/60 px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
              >
                Clear Filters
              </button>
              <Link
                to="/sell"
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                Be First to List
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((l) => (
              <MarketplaceCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export function MarketplaceCard({ listing }: { listing: any }) {
  const cover = listing.images?.[0];
  const isFree = listing.price_type === "Free" || listing.price === 0;

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group flex flex-col justify-between rounded-2xl border border-white/5 bg-card/40 overflow-hidden backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-card/80 hover:shadow-2xl"
    >
      <div>
        {/* Cover Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/60">
          {cover ? (
            <Image
              src={cover}
              alt={listing.title}
              fittingType="fill"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center">
              <Store className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}

          {/* Tag Badges */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <span className="rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white border border-white/10">
              {listing.category || "Asset"}
            </span>
          </div>

          {/* Scam-shield badge */}
          <div className="absolute right-3 top-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4">
          <h3 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            by {listing.seller_name || "Verified Creator"}
          </p>

          {listing.headline && (
            <p className="text-[11px] text-muted-foreground/70 line-clamp-2 mt-2 leading-relaxed">
              {listing.headline}
            </p>
          )}
        </div>
      </div>

      {/* Footer Price & Action Bar */}
      <div className="border-t border-white/5 bg-secondary/20 p-4 pt-3 flex items-center justify-between">
        <span
          className={cn(
            "rounded-lg px-2.5 py-1 text-xs font-bold font-mono tracking-tight",
            isFree
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-white/10 text-white border border-white/10"
          )}
        >
          {isFree ? "Free" : `${listing.price || 0} R$`}
        </span>

        <span className="text-[11px] font-medium text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          <span>View Asset</span>
          <span>→</span>
        </span>
      </div>
    </Link>
  );
}
