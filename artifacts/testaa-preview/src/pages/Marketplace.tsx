const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Store, SlidersHorizontal, Search, Check } from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { ListingCard, Footer } from "@/pages/Home";
import { DEPARTMENTS, ERLC_TAG, CATEGORIES } from "@/lib/departments";

const SORTS = [
  { id: "new", label: "Newest" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "popular", label: "Most Popular" },
];

export default function Marketplace() {
  const [params, setParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const dept = params.get("dept") || "";
  const cat = params.get("cat") || "";
  const sort = params.get("sort") || "new";
  const freeOnly = params.get("free") === "1";

  useEffect(() => {
    setLoading(true);
    db.entities.Listing.filter({ status: "active" }, "-created_date", 200)
      .then((rows) => setListings(rows))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = listings.filter((l) => {
      if (dept && !l.departments?.includes(dept)) return false;
      if (cat && l.category !== cat) return false;
      if (freeOnly && l.price_type !== "Free") return false;
      if (q) {
        const s = q.toLowerCase();
        if (!l.title?.toLowerCase().includes(s) && !l.seller_name?.toLowerCase().includes(s)) return false;
      }
      return true;
    });
    if (sort === "price_asc") result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === "price_desc") result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sort === "popular") result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    else result = [...result].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    return result;
  }, [listings, dept, cat, q, sort, freeOnly]);

  const setParam = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Real listings from verified Liberty County creators.</p>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Filters */}
          <aside className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search listingsâ¦"
                className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <FilterGroup title="Department">
              <button onClick={() => setParam("dept", "")} className={`filter-chip ${!dept ? "active" : ""}`}>All</button>
              {DEPARTMENTS.map((d) => (
                <button key={d.id} onClick={() => setParam("dept", d.id === dept ? "" : d.id)} className={`filter-chip ${dept === d.id ? "active" : ""}`}>{d.short}</button>
              ))}
              <button onClick={() => setParam("dept", dept === "ERLC" ? "" : "ERLC")} className={`filter-chip ${dept === "ERLC" ? "active" : ""}`}>ERLC</button>
            </FilterGroup>

            <FilterGroup title="Category">
              <button onClick={() => setParam("cat", "")} className={`filter-chip ${!cat ? "active" : ""}`}>All</button>
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setParam("cat", c.id === cat ? "" : c.id)} className={`filter-chip ${cat === c.id ? "active" : ""}`}>{c.id}</button>
              ))}
            </FilterGroup>

            <FilterGroup title="Sort">
              {SORTS.map((s) => (
                <button key={s.id} onClick={() => setParam("sort", s.id)} className={`filter-chip ${sort === s.id ? "active" : ""}`}>{s.label}</button>
              ))}
            </FilterGroup>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold mb-3 flex items-center gap-1.5"><SlidersHorizontal className="w-3 h-3" /> Filters</h3>
              <button onClick={() => setParam("free", freeOnly ? "" : "1")} className={`filter-chip w-full justify-start flex items-center gap-2 ${freeOnly ? "active" : ""}`}>
                <span className={`w-4 h-4 rounded border flex items-center justify-center ${freeOnly ? "bg-primary border-primary" : "border-border"}`}>
                  {freeOnly && <Check className="w-3 h-3 text-primary-foreground" />}
                </span>
                Free only
              </button>
            </div>

            {(dept || cat || freeOnly || sort !== "new") && (
              <button onClick={() => setParams(new URLSearchParams())} className="text-xs text-primary hover:opacity-70">Clear all filters</button>
            )}
          </aside>

          {/* Grid */}
          <div>
            <p className="text-sm text-muted-foreground mb-4">{loading ? "Loadingâ¦" : `${filtered.length} listing${filtered.length !== 1 ? "s" : ""}`}</p>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="aspect-[4/3] bg-secondary animate-pulse" />
                    <div className="p-4 space-y-2"><div className="h-4 bg-secondary rounded w-2/3 animate-pulse" /><div className="h-3 bg-secondary rounded w-1/3 animate-pulse" /></div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border border-border bg-card py-20 text-center">
                <Store className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-foreground font-medium mb-1">No listings match your filters</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or clearing filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((l) => <ListingCard key={l.id} listing={l} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold mb-3 flex items-center gap-1.5"><SlidersHorizontal className="w-3 h-3" /> {title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}