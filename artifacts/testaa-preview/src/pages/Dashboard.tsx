import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  DollarSign,
  Star,
  Plus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Trash2,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

export default function Dashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"listings" | "orders" | "settings">("listings");

  const activeUser = user || {
    id: "creator_demo",
    display_name: "Creator",
    username: "creator",
    email: "",
  };

  useEffect(() => {
    const listingQuery = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
    const purchaseQuery = db?.entities?.Purchase?.filter || localDb.entities.Purchase.filter;

    Promise.all([
      listingQuery({ status: "active" }, "-created_date", 100),
      purchaseQuery({}, "-created_date", 50),
    ])
      .then(([l, o]: any[]) => {
        setListings(l || []);
        setOrders(o || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeListings = listings.filter((l) => l.status === "active");
  const totalCatalogValue = activeListings.reduce((sum, l) => sum + (l.price_type === "Free" ? 0 : Number(l.price) || 0), 0);

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to remove this asset from the marketplace?")) return;
    try {
      const deleteFn = db?.entities?.Listing?.delete || localDb.entities.Listing.delete;
      await deleteFn(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* ─── CREATOR STUDIO HEADER ─── */}
        <div className="border-b border-white/[0.06] bg-[#0A0D15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-0.5 text-xs font-semibold text-emerald-400 mb-2">
                <Sparkles className="h-3 w-3" />
                <span>Creator Studio</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Welcome, {activeUser.display_name || activeUser.username || "Creator"}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Manage your ER:LC asset catalog, published packages, and escrow transactions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 border border-white/[0.08] bg-[#07090E] hover:bg-white/[0.04] text-zinc-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
              >
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Marketplace</span>
              </Link>

              <Link
                to="/sell"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-500/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Asset</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ─── REAL DATA STATS HUD ─── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-1">Active Listings</span>
              <p className="text-2xl font-mono font-black text-white">{activeListings.length}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Published assets</p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-1">Catalog Value</span>
              <p className="text-2xl font-mono font-black text-white">R$ {totalCatalogValue}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Total inventory listed</p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-1">Completed Orders</span>
              <p className="text-2xl font-mono font-black text-white">{orders.length}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Escrow delivered</p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-1">Creator Commission</span>
              <p className="text-2xl font-mono font-black text-emerald-400">0% Cut</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Keep 100% of sales</p>
            </div>
          </div>

          {/* TAB BAR */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            {[
              { id: "listings", label: "My Assets", count: activeListings.length },
              { id: "orders", label: "Customer Orders", count: orders.length },
              { id: "settings", label: "Creator Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2",
                  activeTab === tab.id
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                )}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] font-mono font-bold bg-white/[0.08] px-1.5 py-0.2 rounded">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* LISTINGS TAB */}
          {activeTab === "listings" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] overflow-hidden shadow-xl">
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">Your Published Assets</h3>
                  <p className="text-xs text-zinc-400">Manage your active ER:LC liveries and packs.</p>
                </div>
                <Link
                  to="/sell"
                  className="text-xs font-bold text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>+ Add New Asset</span>
                </Link>
              </div>

              {loading ? (
                <div className="p-10 text-center text-xs text-zinc-500 animate-pulse">
                  Loading catalog…
                </div>
              ) : activeListings.length === 0 ? (
                <div className="p-14 text-center max-w-sm mx-auto">
                  <Store className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white mb-1">No assets listed yet</h4>
                  <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                    Start building your LibertyX catalog by publishing your first ER:LC asset.
                  </p>
                  <Link
                    to="/sell"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create First Listing</span>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {activeListings.map((l) => {
                    const isFree = l.price_type === "Free" || !l.price || l.price === 0;
                    return (
                      <div key={l.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
                            {l.images && l.images.length > 0 ? (
                              <img src={l.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Store className="w-5 h-5 text-zinc-600" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 rounded">
                                {l.departments?.[0] || "Police"}
                              </span>
                              <span className="text-xs font-bold text-white truncate">{l.title}</span>
                            </div>
                            <p className="text-xs text-zinc-400 line-clamp-1">{l.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-white block">
                              {isFree ? "FREE" : `R$ ${l.price}`}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">● Live</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              to={`/listing/${l.id}`}
                              className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
                              title="View in store"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteListing(l.id)}
                              className="p-2 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition"
                              title="Delete listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 shadow-xl space-y-4">
              <div>
                <h3 className="font-bold text-sm text-white">Customer Escrow Orders</h3>
                <p className="text-xs text-zinc-400">Automated deliverable keys dispatched to purchasers.</p>
              </div>

              {orders.length === 0 ? (
                <div className="p-10 text-center text-zinc-500 text-xs">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                  <span>No customer orders recorded yet. Escrow ready.</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {orders.map((o: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-white/[0.04] bg-[#07090E] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white">{o.listing_title || "Asset Package"}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">Buyer: {o.buyer_name || "Customer"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {o.price ? `R$ ${o.price}` : "Free"}
                        </span>
                        <span className="block text-[10px] text-zinc-500 font-mono">Delivered</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4">
                <h3 className="font-bold text-sm text-white">Creator Verification</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your creator account is registered with 0% platform listing fees.
                </p>
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Platform Cut:</span>
                    <span className="text-emerald-400 font-mono font-bold">0% Commission</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Escrow Security:</span>
                    <span className="text-emerald-400 font-mono font-bold">Encrypted</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4">
                <h3 className="font-bold text-sm text-white">Discord Community Webhook</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Connect your Discord server to automatically broadcast new livery drops.
                </p>
                <a
                  href="https://discord.gg/YYqFdVp5Fw"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-white px-4 py-2 text-xs font-semibold transition"
                >
                  <MessageCircle className="w-4 h-4 text-[#5865F2]" />
                  <span>Join Creator Discord</span>
                </a>
              </div>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
}
