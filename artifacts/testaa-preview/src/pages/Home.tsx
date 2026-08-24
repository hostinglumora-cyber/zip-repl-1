const db = globalThis.__B44_DB__ || { entities: new Proxy({}, { get: () => ({ filter: async () => [] }) }) };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, BookOpen, Check, ChevronRight, CircleHelp, Heart, Package, ShieldCheck, Sparkles, Store, TrendingUp, Users } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { DEPARTMENTS } from "@/lib/departments";
import { Image } from "@/components/ui/image";
import Logo from "@/components/Logo";
import { BRAND } from "@/lib/brand";

const departmentAccents = ["#3b82f6", "#ef4444", "#eab308", "#f59e0b"];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.Listing.filter({ status: "active" }, "-created_date", 6)
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-48 left-[8%] h-[520px] w-[720px] rounded-full bg-primary/[0.12] blur-[140px]" />
            <div className="absolute top-20 right-[-10%] h-[460px] w-[520px] rounded-full bg-blue-500/[0.08] blur-[150px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.12)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.12)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
            <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
              <div>
                <div className="mb-7 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Built for Liberty County
                  </span>
                  <Link to="/docs" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/30 hover:text-foreground">
                    <BookOpen className="h-3.5 w-3.5" /> Read the guide <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-[-0.045em] lg:text-7xl">
                  Your next <span className="text-primary">scene-ready</span> asset starts here.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                  Liberty Marketplace is the trusted home for ER:LC liveries, uniforms, ELS packs, and map templates from creators who know the county.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link to="/marketplace" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:opacity-90">
                    Explore the marketplace <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/sell" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 font-semibold text-foreground transition hover:border-primary/40 hover:bg-secondary">
                    List an asset
                  </Link>
                </div>
                <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                  {["Zero listing fees", "Up to 10 photos", "Scam-protected"].map((item) => (
                    <span key={item} className="inline-flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-primary/15 text-primary"><Check className="h-3 w-3" /></span>{item}</span>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-6 rounded-[2rem] bg-primary/[0.08] blur-2xl" />
                <div className="relative rounded-3xl border border-border bg-card/90 p-3 shadow-2xl shadow-black/30 backdrop-blur">
                  <div className="flex items-center justify-between border-b border-border px-3 pb-3 pt-1">
                    <div><p className="text-sm font-semibold">Creator shelf</p><p className="text-xs text-muted-foreground">Featured drops from Liberty County</p></div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Live</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 p-1 pt-4">
                    {(loading ? [0, 1, 2, 3] : listings.slice(0, 4)).map((item, i) => loading ? (
                      <div key={i} className="aspect-[1.15] animate-pulse rounded-2xl bg-secondary" />
                    ) : <PreviewCard key={item.id} listing={item} />)}
                    {!loading && listings.length === 0 && [0, 1, 2, 3].map((i) => (
                      <div key={i} className="group relative aspect-[1.15] overflow-hidden rounded-2xl border border-border bg-secondary/50 p-4">
                        <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary/60" />
                        <Store className="absolute bottom-4 left-4 h-5 w-5 text-muted-foreground/30" />
                        <div className="absolute bottom-4 right-4 h-8 w-16 rounded bg-background/50" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 px-3 pb-2 pt-4 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> Verified assets, ready for your next scene.</div>
                </div>
                <div className="relative mx-auto mt-4 hidden w-fit items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 shadow-xl sm:flex">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary"><TrendingUp className="h-4 w-4" /></div>
                  <div><p className="text-xs font-bold">New drops</p><p className="text-[11px] text-muted-foreground">every week</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Browse by department</p><h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Built around your unit.</h2></div>
            <Link to="/marketplace" className="hidden items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex">View all assets <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DEPARTMENTS.map((d, i) => (
              <Link key={d.id} to={`/marketplace?dept=${d.id}`} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/20">
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: departmentAccents[i] }} />
                <div className="relative mb-5 flex h-24 items-center justify-center">
                  <img src={d.logo} alt={d.name} className="h-full w-full object-contain transition duration-300 group-hover:scale-105" />
                </div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d.short}</p>
                <h3 className="text-lg font-bold">{d.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{d.blurb}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Explore department <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-card/40">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            <Stat icon={Users} value="4" label="Core departments" />
            <Stat icon={Package} value="10" label="Photos per listing" />
            <Stat icon={ShieldCheck} value="100%" label="Scam-protected" />
            <Stat icon={Store} value="0%" label="Listing fees" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid gap-8 rounded-3xl border border-primary/20 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/.13),transparent_48%)] p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
            <div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">For creators</p><h2 className="max-w-2xl text-3xl font-bold tracking-tight lg:text-4xl">No listings yet — be the first to build the shelf.</h2><p className="mt-4 max-w-xl leading-7 text-muted-foreground">Share what you make with the Liberty County community. Start free, add your department, and publish in minutes.</p></div>
            <Link to="/sell" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90">Create a listing <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ icon: Icon, value, label }) {
  return <div className="flex items-center gap-4"><div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div><div><div className="text-2xl font-bold">{value}</div><div className="text-sm text-muted-foreground">{label}</div></div></div>;
}

function PreviewCard({ listing }) {
  const cover = listing.images?.[0];
  return <Link to={`/listing/${listing.id}`} className="group overflow-hidden rounded-2xl border border-border bg-secondary/50"><div className="aspect-[1.15] overflow-hidden bg-secondary">{cover ? <Image src={cover} alt={listing.title} fittingType="fill" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center"><Store className="h-6 w-6 text-muted-foreground/30" /></div>}</div><div className="p-3"><p className="truncate text-xs font-semibold">{listing.title}</p><p className="mt-1 text-[11px] text-muted-foreground">{listing.price_type === "Free" ? "Free" : `${listing.price} R$`}</p></div></Link>;
}

export function ListingCard({ listing }) {
  const cover = listing.images?.[0];
  return <Link to={`/listing/${listing.id}`} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40"><div className="relative aspect-[4/3] overflow-hidden bg-secondary">{cover ? <Image src={cover} alt={listing.title} fittingType="fill" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center"><Store className="h-10 w-10 text-muted-foreground/30" /></div>}<span className="absolute left-3 top-3 rounded-md bg-background/80 px-2 py-1 text-[11px] font-medium backdrop-blur">{listing.category}</span></div><div className="p-4"><h3 className="truncate font-semibold group-hover:text-primary">{listing.title}</h3><p className="mt-1 text-sm text-muted-foreground">by {listing.seller_name || "Anonymous"}</p></div></Link>;
}

export function Footer() {
  return <footer className="border-t border-border"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 py-12 lg:grid-cols-4 lg:px-8"><div className="col-span-2 lg:col-span-1"><Logo size={32} textClass="text-base" /><p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">{BRAND.tagline}</p></div>{[{ h: "Explore", links: [["Marketplace", "/marketplace"], ["Departments", "/marketplace"], ["Status", "/status"]] }, { h: "Create", links: [["List an asset", "/sell"], ["Documentation", "/docs"]] }, { h: "Community", links: [["Login", "/login"], ["Privacy", "/privacy"], ["Terms", "/tos"]] }].map((col) => <div key={col.h}><h4 className="mb-4 text-sm font-semibold">{col.h}</h4><ul className="space-y-2.5">{col.links.map(([label, to]) => <li key={label}><Link to={to} className="text-sm text-muted-foreground transition hover:text-foreground">{label}</Link></li>)}</ul></div>)}</div><div className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left"><span>© {new Date().getFullYear()} {BRAND.name}. Not affiliated with Roblox or ER:LC.</span><Link to="/admin" className="text-muted-foreground/50 transition hover:text-muted-foreground">Admin panel</Link></div></footer>;
}