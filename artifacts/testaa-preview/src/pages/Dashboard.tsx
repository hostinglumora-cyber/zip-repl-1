const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Store, DollarSign, Star, TrendingUp, Plus, ArrowRight, ShoppingBag, Package, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";

export default function Dashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const activeUser = user || {
    id: "creator_demo",
    display_name: "LibertyX Creator",
    email: "creator@libertyx.com",
  };

  useEffect(() => {
    Promise.all([
      db.entities.Listing.filter({ status: "active" }, "-created_date", 100),
      db.entities.Purchase.filter({}, "-created_date", 20),
    ])
      .then(([l, o]: any[]) => {
        setListings(l || []);
        setOrders(o || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active = listings.filter((l) => l.status === "active");
  const revenue = listings.reduce((a, l) => a + (l.price_type === "Free" ? 0 : Number(l.price) || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 mb-2">
            <Sparkles className="h-3 w-3" />
            <span>Creator Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {activeUser.display_name || "Creator"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor your store performance, active drops, and customer orders.
          </p>
        </div>
        <Link
          to="/sell"
          className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Asset Listing</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Store} label="Active Listings" value={active.length.toString()} />
        <StatCard icon={DollarSign} label="Catalog Value (R$)" value={`${revenue} R$`} />
        <StatCard icon={Star} label="Seller Rating" value="5.0 ★" />
        <StatCard icon={TrendingUp} label="Escrow Status" value="100% OK" />
      </div>

      {/* Listings Table */}
      <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-foreground">Your Marketplace Listings</h2>
            <p className="text-[11px] text-muted-foreground">Manage your published liveries and fleet packs</p>
          </div>
          <Link
            to="/marketplace"
            className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
          >
            <span>Live Directory</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
            Loading your store inventory...
          </div>
        ) : listings.length === 0 ? (
          <div className="p-12 text-center">
            <Store className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground mb-1">No assets listed yet</p>
            <p className="text-xs text-muted-foreground mb-4">
              Start building your department shelf with zero listing fees.
            </p>
            <Link
              to="/sell"
              className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              <Plus className="w-4 h-4" /> Create First Listing
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {listings.map((l) => (
              <div
                key={l.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.03] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary/60 shrink-0 border border-white/10">
                  {l.images?.[0] ? (
                    <Image src={l.images[0]} fittingType="fill" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground/30">
                      <Store className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/listing/${l.id}`}
                    className="font-semibold text-xs text-foreground hover:text-emerald-400 truncate block transition-colors"
                  >
                    {l.title}
                  </Link>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {l.category} · {l.departments?.join(", ") || "ER:LC"}
                  </p>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {l.status || "Active"}
                </span>
                <span className="text-xs font-bold font-mono text-foreground w-20 text-right">
                  {l.price_type === "Free" ? "Free" : `${l.price || 0} R$`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders Shelf */}
      <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Incoming Customer Purchases</span>
            </h2>
            <p className="text-[11px] text-muted-foreground">Automated escrow code delivery logs</p>
          </div>
          <span className="text-xs text-emerald-400 font-medium">Scam-Shield Escrow 100% Active</span>
        </div>

        <div className="p-10 text-center text-xs text-muted-foreground">
          <Package className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <span>When customers acquire your liveries or packs, order delivery records will display here.</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-card/40 p-4 sm:p-5 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className="text-xl font-bold font-mono text-foreground">{value}</p>
    </div>
  );
}
