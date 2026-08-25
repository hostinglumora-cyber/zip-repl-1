import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Sparkles, Package } from "lucide-react";
import PageShell from "@/components/PageShell";
import ListingCard from "@/components/ListingCard";
import CreatorCard from "@/components/CreatorCard";
import EmptyState from "@/components/EmptyState";
import { localDb } from "@/lib/localDb";

const CATEGORIES = [
  { label: "Police", to: "/marketplace?cat=Law+Enforcement" },
  { label: "Sheriff", to: "/marketplace?cat=Sheriff" },
  { label: "Fire & Rescue", to: "/marketplace?cat=Fire+%26+Rescue" },
  { label: "EMS", to: "/marketplace?cat=EMS" },
  { label: "DOT", to: "/marketplace?cat=DOT" },
  { label: "Civilian", to: "/marketplace?cat=Civilian" },
  { label: "Maps", to: "/marketplace?cat=Map+Templates" },
  { label: "Uniforms", to: "/marketplace?cat=Uniforms" },
  { label: "ELS", to: "/marketplace?cat=ELS" },
];

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      localDb.entities.Listing.filter({ status: "active" }, "-created_date", 12),
      localDb.getDeduplicatedCreators(),
    ])
      .then(([rows, creatorList]) => {
        setListings(rows || []);
        setCreators(creatorList || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const trending = listings.slice(0, 4);
  const newReleases = listings.slice(0, 8);
  const topCreators = creators.slice(0, 6);

  return (
    <PageShell noPadding>
      {/* ─── Hero ─── */}
      <section className="py-16 sm:py-20 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Status badge */}
          <div className="mb-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-[#12151E] text-xs font-medium text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LibertyX v1.0 is now live
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-50 mb-3">
            The ER:LC marketplace.
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto mb-6">
            Discover verified liveries, uniforms, and assets from community creators.
          </p>

          {/* Search */}
          <div className="max-w-lg mx-auto relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search liveries, uniforms, vehicles, creators..."
              className="w-full rounded-lg border border-white/[0.08] bg-[#12151E] pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Link
              to={searchQuery ? `/marketplace?q=${encodeURIComponent(searchQuery)}` : "/marketplace"}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition active:scale-[0.98]"
            >
              Browse Marketplace
            </Link>
            <Link
              to="/sell"
              className="px-5 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-slate-200 text-sm font-semibold transition active:scale-[0.98]"
            >
              Become a Creator
            </Link>
          </div>

          {/* Category chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-transparent text-xs font-medium text-slate-400 hover:text-slate-200 hover:border-white/[0.18] transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trending ─── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Trending" linkTo="/marketplace" linkLabel="View all" />
          {!loading && trending.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No listings yet"
              description="Be the first to publish an ER:LC asset."
              action={{ label: "Publish Asset", href: "/sell" }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {trending.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── New Releases ─── */}
      {newReleases.length > 0 && (
        <section className="py-12 sm:py-16 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="New Releases" linkTo="/marketplace" linkLabel="View all" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newReleases.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── Creators ─── */}
      <section className="py-12 sm:py-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Creators" linkTo="/creators" linkLabel="View all" />
          {!loading && topCreators.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No creators yet"
              description="Be the first creator to publish on LibertyX."
              action={{ label: "Get Started", href: "/sell" }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCreators.map((c) => <CreatorCard key={c.username} creator={c} />)}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function SectionHeader({ title, linkTo, linkLabel }: { title: string; linkTo: string; linkLabel: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-bold tracking-tight text-slate-50">{title}</h2>
      <Link
        to={linkTo}
        className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        {linkLabel}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
