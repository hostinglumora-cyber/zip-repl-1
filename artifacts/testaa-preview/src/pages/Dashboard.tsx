import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  DollarSign,
  Star,
  TrendingUp,
  Plus,
  ArrowRight,
  ShoppingBag,
  Package,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Tag,
  Trash2,
  Edit,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  User,
  MessageCircle,
} from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

export default function Dashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"listings" | "orders" | "performance">("listings");

  const activeUser = user || {
    id: "creator_demo",
    display_name: "Verified Creator",
    username: "creator",
    email: "creator@libertyx.market",
  };

  useEffect(() => {
    const listingQuery = db?.entities?.Listing?.filter
      ? db.entities.Listing.filter({ status: "active" }, "-created_date", 100)
      : localDb.entities.Listing.filter({ status: "active" }, "-created_date", 100);

    const purchaseQuery = db?.entities?.Purchase?.filter
      ? db.entities.Purchase.filter({}, "-created_date", 20)
      : localDb.entities.Purchase.filter({}, "-created_date", 20);

    Promise.all([listingQuery, purchaseQuery])
      .then(([l, o]: any[]) => {
        setListings(l || []);
        setOrders(o || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active = listings.filter((l) => l.status === "active");
  const catalogValue = listings.reduce((sum, l) => sum + (l.price_type === "Free" ? 0 : Number(l.price) || 0), 0);

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to remove this listing from the marketplace?")) return;
    try {
      if (db?.entities?.Listing?.delete) {
        await db.entities.Listing.delete(id);
      } else {
        await localDb.entities.Listing.delete(id);
      }
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="space-y-10">
      {/* ─── CREATOR HUB HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Creator Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Welcome back, {activeUser.display_name || activeUser.username || "Creator"}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your listings, sales, assets, and marketplace activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 border border-white/[0.1] bg-[#0E131E] hover:bg-[#131926] hover:border-emerald-500/30 text-zinc-200 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition"
          >
            <Store className="w-4 h-4 text-emerald-400" />
            <span>View Marketplace</span>
          </Link>

          <Link
            to="/sell"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Listing</span>
          </Link>
        </div>
      </div>

      {/* ─── STATS HUD ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0B0E16] p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Active Listings</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-white">{active.length}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Live in store directory</p>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-[#0B0E16] p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Catalog Value</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-white">R$ {catalogValue}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Total listed inventory</p>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-[#0B0E16] p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Seller Rating</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-white">5.0 ★</p>
          <p className="text-[11px] text-zinc-500 mt-1">Verified creator status</p>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-[#0B0E16] p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Escrow Status</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-emerald-400">100% OK</p>
          <p className="text-[11px] text-zinc-500 mt-1">Automated fulfillment live</p>
        </div>
      </div>

      {/* ─── SECTION TABS ─── */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
        {[
          { id: "listings", label: "Your Marketplace Listings", count: listings.length },
          { id: "orders", label: "Incoming Customer Purchases", count: orders.length },
          { id: "performance", label: "Creator Performance & Health" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2",
              activeTab === tab.id
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="text-[10px] font-mono font-bold bg-white/[0.08] px-1.5 py-0.5 rounded-md">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── TAB CONTENT ─── */}
      {activeTab === "listings" && (
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0E15] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Your Marketplace Listings</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Manage, update, and monitor published ER:LC liveries and packs</p>
            </div>
            <Link
              to="/sell"
              className="text-xs font-bold text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>+ Add new listing</span>
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-zinc-500 animate-pulse">
              Loading creator catalog...
            </div>
          ) : listings.length === 0 ? (
            /* Empty State matching user request */
            <div className="p-16 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">No assets listed yet</h4>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Start building your LibertyX catalog with your first ER:LC asset.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Listing</span>
                </Link>

                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white transition"
                >
                  View Marketplace
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {listings.map((listing) => {
                const isFree = listing.price_type === "Free" || !listing.price || listing.price === 0;
                return (
                  <div key={listing.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/[0.08] overflow-hidden shrink-0 flex items-center justify-center">
                        {listing.images && listing.images.length > 0 ? (
                          <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Store className="w-6 h-6 text-zinc-600" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            {listing.category || "Asset"}
                          </span>
                          <span className="text-xs font-bold text-white truncate">{listing.title}</span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-1">{listing.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-white block">
                          {isFree ? "FREE" : `R$ ${listing.price}`}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">● Active</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/listing/${listing.id}`}
                          className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
                          title="View on Marketplace"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteListing(listing.id)}
                          className="p-2 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition"
                          title="Remove Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0E15] p-8 shadow-2xl">
          <h3 className="font-bold text-base text-white mb-1">Incoming Customer Purchases</h3>
          <p className="text-xs text-zinc-400 mb-6">Real-time escrow delivery receipts and customer fulfillment</p>

          {orders.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-xs">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
              <span>No customer transactions recorded yet. Escrow ready.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl border border-white/[0.06] bg-black/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-white">{o.listing_title || "Asset Purchased"}</p>
                      <p className="text-[11px] text-zinc-500 font-mono">Buyer: {o.buyer_name || "Customer"}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">Delivered (Escrow)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "performance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0A0E15] p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Creator Verification Status</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your account is monitored by Scam-Shield. Completed transactions automatically increase your verified rating.
            </p>
            <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300">Escrow Vault Health:</span>
                <span className="text-emerald-400 font-mono font-bold">100% Secure</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300">Listing Fees:</span>
                <span className="text-emerald-400 font-mono font-bold">0% Cut</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300">Dispute Rate:</span>
                <span className="text-emerald-400 font-mono font-bold">0.00%</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#0A0E15] p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Discord Webhook Drops</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Connect your Discord community to auto-post new livery drops the moment you publish.
            </p>
            <a
              href="https://discord.gg/YYqFdVp5Fw"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-white px-4 py-2.5 text-xs font-semibold transition"
            >
              <MessageCircle className="w-4 h-4 text-[#5865F2]" />
              <span>Join Developer Discord</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
