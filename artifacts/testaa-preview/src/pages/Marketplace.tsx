import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Store } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import ListingCard from "@/components/ListingCard";
import EmptyState from "@/components/EmptyState";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All", "Police", "Sheriff", "Fire & Rescue", "EMS", "DOT",
  "Civilian", "Map Templates", "Uniforms", "ELS", "Bundles", "Services",
];

const SORT_OPTIONS = [
  { value: "-created_date", label: "Newest" },
  { value: "price", label: "Price: Low → High" },
  { value: "-price", label: "Price: High → Low" },
];

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCat = searchParams.get("cat") || "All";
  const searchQ = searchParams.get("q") || "";
  const sortBy = searchParams.get("sort") || "-created_date";

  useEffect(() => {
    localDb.entities.Listing.filter({ status: "active" }, sortBy, 200)
      .then((rows: any[]) => setListings(rows || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [sortBy]);

  const filtered = listings.filter((item) => {
    if (selectedCat !== "All") {
      const match =
        item.category?.toLowerCase() === selectedCat.toLowerCase() ||
        (Array.isArray(item.departments) &&
          item.departments.some((d: string) => d.toLowerCase() === selectedCat.toLowerCase()));
      if (!match) return false;
    }
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase().replace("#", "");
      const fields = [item.title, item.description, item.vehicle_models, item.seller_username];
      const matchText = fields.some((f) => f?.toLowerCase().includes(q));
      const matchTag = Array.isArray(item.tags) && item.tags.some((t: string) => t.toLowerCase().replace("#", "").includes(q));
      if (!matchText && !matchTag) return false;
    }
    return true;
  });

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "All" || value === "-created_date") next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  return (
    <PageShell>
      <PageHeader
        title="Marketplace"
        description="Discover ER:LC creations from the community."
        badge={{ label: `${filtered.length} assets` }}
      />

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQ}
            onChange={(e) => updateParam("q", e.target.value)}
            placeholder="Search liveries, tags, vehicles..."
            className="w-full rounded-lg border border-white/[0.08] bg-[#12151E] pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="rounded-lg border border-white/[0.08] bg-[#12151E] px-3 py-2 text-sm text-slate-300 outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => updateParam("cat", cat)}
            className={cn(
              "filter-chip whitespace-nowrap",
              selectedCat === cat && "active"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500 animate-pulse">Loading…</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No listings found"
          description={searchQ || selectedCat !== "All"
            ? "Try adjusting your search or filters."
            : "Be the first to publish an ER:LC asset."}
          action={{ label: "Publish Asset", href: "/sell" }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
