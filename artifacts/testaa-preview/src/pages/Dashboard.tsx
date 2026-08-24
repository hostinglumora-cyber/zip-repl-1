const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Store, DollarSign, Star, TrendingUp, Plus, ArrowRight, ShoppingBag, Package } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import { Image } from "@/components/ui/image";

export default function Dashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      db.entities.Listing.filter({ seller_id: user.id }, "-created_date", 100),
      db.entities.Purchase.filter({ seller_id: user.id }, "-created_date", 20),
    ])
      .then(([l, o]) => { setListings(l); setOrders(o); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const active = listings.filter((l) => l.status === "active");
  const sold = listings.filter((l) => l.status === "sold");
  const revenue = orders.filter((o) => o.price_type !== "Free").reduce((a, o) => a + (o.price || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.display_name || user?.full_name?.split(" ")[0] || "Member"}</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your store.</p>
        </div>
        <Link to="/sell" className="inline-flex items-center gap-1.5 bg-primary hover:opacity-90 text-primary-foreground font-semibold px-4 py-2.5 rounded-lg text-sm">
          <Plus className="w-4 h-4" /> New listing
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Store} label="Active listings" value={active.length} />
        <StatCard icon={DollarSign} label="Revenue (R$)" value={revenue} />
        <StatCard icon={Star} label="Avg rating" value="â" />
        <StatCard icon={TrendingUp} label="Total sold" value={sold.length} />
      </div>

      {/* Listings table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Your listings</h2>
          <Link to="/u/me" className="text-sm text-primary hover:opacity-70 inline-flex items-center gap-1">View profile <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loadingâ¦</div>
        ) : listings.length === 0 ? (
          <div className="p-12 text-center">
            <Store className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">You haven't listed anything yet.</p>
            <Link to="/sell" className="inline-flex items-center gap-1.5 bg-primary hover:opacity-90 text-primary-foreground font-medium px-4 py-2 rounded-lg text-sm">
              <Plus className="w-4 h-4" /> Create your first listing
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {listings.map((l) => (
              <div key={l.id} className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/30">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                  {l.images?.[0] ? <Image src={l.images[0]} fittingType="fill" className="w-full h-full" /> : <div className="w-full h-full grid place-items-center text-muted-foreground/30"><Store className="w-5 h-5" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/listing/${l.id}`} className="font-medium text-foreground hover:text-primary truncate block">{l.title}</Link>
                  <p className="text-xs text-muted-foreground">{l.category} Â· {l.departments?.join(", ") || "No tags"}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${l.status === "active" ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>{l.status}</span>
                <span className="text-sm font-medium text-foreground w-20 text-right">{l.price_type === "Free" ? "Free" : `${l.price} R$`}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Incoming orders */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary" /> Incoming orders</h2>
          {pendingOrders.length > 0 && <span className="text-xs bg-amber-500/15 text-amber-400 px-2 py-1 rounded">{pendingOrders.length} pending</span>}
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            <Package className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            No orders yet. When someone buys your listing, it shows up here.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((o) => (
              <div key={o.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{o.listing_title || "Listing"}</p>
                  <p className="text-xs text-muted-foreground">from {o.buyer_name}{o.roblox_username ? ` Â· @${o.roblox_username}` : ""}</p>
                </div>
                <span className="text-sm font-medium text-foreground">{o.price_type === "Free" ? "Free" : `${o.price} R$`}</span>
                <span className={`text-xs px-2 py-1 rounded ${o.status === "completed" ? "bg-primary/15 text-primary" : "bg-amber-500/15 text-amber-400"}`}>{o.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="w-9 h-9 rounded-lg bg-primary/10 grid place-items-center mb-3"><Icon className="w-5 h-5 text-primary" /></div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}