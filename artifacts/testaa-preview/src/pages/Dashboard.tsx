import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  BarChart3,
  Users,
  Palette,
  Eye,
  Heart,
  TrendingUp,
  Clock,
  Radio,
  Send,
  Globe,
  Settings,
  HelpCircle,
  FileCheck,
  Layers,
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";
import RobloxConnectModal from "@/components/RobloxConnectModal";

const db = (globalThis as any).__B44_DB__ || localDb;

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "orders" | "reviews" | "analytics" | "settings"
  >("overview");

  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [submittingReply, setSubmittingReply] = useState<string | null>(null);
  const [robloxModalOpen, setRobloxModalOpen] = useState(false);

  const activeUser = user || {
    id: "creator_demo",
    display_name: "Creator",
    username: "creator",
    roblox_username: "",
    roblox_verified: false,
  };

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const listingQuery = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
        const purchaseQuery = db?.entities?.Purchase?.filter || localDb.entities.Purchase.filter;
        const reviewQuery = db?.entities?.Review?.filter || localDb.entities.Review.filter;

        const [allListings, allPurchases, allReviews] = await Promise.all([
          listingQuery({ status: "active" }, "-created_date", 100),
          purchaseQuery({}, "-created_date", 100),
          reviewQuery({}, "-created_date", 100),
        ]);

        const myListings = allListings.filter(
          (l: any) => l.seller_id === user.id || l.seller_username === user.username
        );
        const myOrders = allPurchases.filter(
          (p: any) => p.seller_id === user.id || myListings.some((l: any) => l.id === p.listing_id)
        );
        const myReviews = allReviews.filter(
          (r: any) => r.creator_username === user.username || myListings.some((l: any) => l.id === r.listing_id)
        );

        setListings(myListings);
        setOrders(myOrders);
        setReviews(myReviews);

        if (user.username) {
          const fCount = localDb.getFollowersCount(user.username);
          setFollowersCount(fCount);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const activeListings = listings.filter((l) => l.status === "active");
  const totalCatalogValue = activeListings.reduce((sum, l) => sum + (l.price_type === "Free" ? 0 : Number(l.price) || 0), 0);
  const totalSalesRevenue = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to remove this asset?")) return;
    try {
      const deleteFn = db?.entities?.Listing?.delete || localDb.entities.Listing.delete;
      await deleteFn(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handlePostReply = async (reviewId: string) => {
    const replyText = replyInputs[reviewId];
    if (!replyText || !replyText.trim() || !user) return;
    setSubmittingReply(reviewId);

    try {
      const updated = await localDb.addReviewReply(reviewId, replyText, user.id);
      setReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
      setReplyInputs((prev) => ({ ...prev, [reviewId]: "" }));
    } catch (err: any) {
      alert(err.message || "Failed to post reply.");
    } finally {
      setSubmittingReply(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="max-w-md mx-auto my-auto p-10 text-center rounded-2xl border border-white/[0.08] bg-[#0A0D15] shadow-2xl">
          <Store className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Creator Studio Authentication</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Please sign in with Discord to access your creator inventory, sales, and storefront builder.
          </p>
          <Link
            to="/login?returnTo=/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-xs font-bold text-black transition"
          >
            Sign in with Discord
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* ─── CREATOR STUDIO TOP BAR ─── */}
        <div className="border-b border-white/[0.06] bg-[#0A0D15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-0.5 text-xs font-semibold text-emerald-400 mb-2">
                <Sparkles className="h-3 w-3" />
                <span>Creator Studio Workspace</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{activeUser.display_name || activeUser.username}</span>
                {activeUser.roblox_verified && (
                  <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.2 rounded font-bold">
                    ✓ Roblox Verified
                  </span>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Manage your ER:LC asset catalog, customer deliveries, review replies, and personal storefront.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to={`/u/${activeUser.username || "me"}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 border border-white/[0.08] bg-[#07090E] hover:bg-white/[0.04] text-zinc-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
              >
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Public Storefront</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </Link>

              <Link
                to="/dashboard/storefront"
                className="inline-flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
              >
                <Palette className="w-4 h-4" />
                <span>Storefront Builder</span>
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

        {/* ─── MAIN DASHBOARD BODY ─── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
          
          {/* TAB BAR */}
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-3 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "products", label: "My Products", count: activeListings.length, icon: Store },
              { id: "orders", label: "Orders & Sales", count: orders.length, icon: ShoppingBag },
              { id: "reviews", label: "Reviews & Replies", count: reviews.length, icon: Star },
              { id: "analytics", label: "Store Analytics", icon: BarChart3 },
              { id: "settings", label: "Account Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shrink-0",
                    activeTab === tab.id
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="text-[10px] font-mono font-bold bg-white/[0.08] px-1.5 py-0.2 rounded">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 1. OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats HUD */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5">
                  <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-1">Active Products</span>
                  <p className="text-2xl font-mono font-black text-white">{activeListings.length}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Live on marketplace</p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5">
                  <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-1">Total Sales Revenue</span>
                  <p className="text-2xl font-mono font-black text-emerald-400">R$ {totalSalesRevenue}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">100% Retained (0% cut)</p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5">
                  <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-1">Completed Deliveries</span>
                  <p className="text-2xl font-mono font-black text-white">{orders.length}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Automated escrow keys</p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5">
                  <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-1">Storefront Followers</span>
                  <p className="text-2xl font-mono font-black text-white">{followersCount}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Subscribed users</p>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/sell"
                  className="p-5 rounded-2xl border border-white/[0.08] bg-[#0A0D15] hover:border-emerald-500/30 hover:bg-[#0E1320] transition group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400">Publish New Livery</span>
                    <Plus className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Upload ER:LC vehicle liveries, EUP uniforms, or ELS soundbanks with instant escrow delivery.
                  </p>
                </Link>

                <Link
                  to="/dashboard/storefront"
                  className="p-5 rounded-2xl border border-white/[0.08] bg-[#0A0D15] hover:border-emerald-500/30 hover:bg-[#0E1320] transition group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400">Customize Storefront</span>
                    <Palette className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Update your commission status, announcement notice, custom services, and FAQ items.
                  </p>
                </Link>

                <Link
                  to="/messages"
                  className="p-5 rounded-2xl border border-white/[0.08] bg-[#0A0D15] hover:border-emerald-500/30 hover:bg-[#0E1320] transition group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400">Buyer Messages</span>
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Answer questions from prospective buyers and manage custom commission requests.
                  </p>
                </Link>
              </div>
            </div>
          )}

          {/* 2. PRODUCTS TAB */}
          {activeTab === "products" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] overflow-hidden shadow-xl">
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">Active Product Listings</h3>
                  <p className="text-xs text-zinc-400">Manage your published ER:LC liveries and packs.</p>
                </div>
                <Link
                  to="/sell"
                  className="text-xs font-bold text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>+ Publish New Asset</span>
                </Link>
              </div>

              {activeListings.length === 0 ? (
                <div className="p-14 text-center max-w-sm mx-auto">
                  <Store className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white mb-1">No products listed yet</h4>
                  <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                    Publish your first ER:LC vehicle skin, ELS config, or uniform pack.
                  </p>
                  <Link
                    to="/sell"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black"
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

          {/* 3. ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 shadow-xl space-y-4">
              <div>
                <h3 className="font-bold text-sm text-white">Customer Escrow Deliveries</h3>
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

          {/* 4. REVIEWS & SELLER REPLIES TAB */}
          {activeTab === "reviews" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 shadow-xl space-y-6">
              <div>
                <h3 className="font-bold text-sm text-white">Customer Reviews & Seller Replies</h3>
                <p className="text-xs text-zinc-400">Read customer feedback and reply directly to verified buyers.</p>
              </div>

              {reviews.length === 0 ? (
                <div className="p-10 text-center text-zinc-500 text-xs">
                  No customer reviews received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="p-4 rounded-xl border border-white/[0.06] bg-[#07090E] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{r.reviewer_name || "Verified Buyer"}</span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 rounded">
                            ✓ Verified Purchase
                          </span>
                        </div>
                        <div className="flex text-emerald-400">
                          {[...Array(r.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-emerald-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">{r.comment}</p>

                      {/* Existing Seller Reply */}
                      {r.seller_reply && (
                        <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] text-xs space-y-1">
                          <span className="font-bold text-emerald-400 block">Creator Reply:</span>
                          <p className="text-zinc-300">{r.seller_reply.text}</p>
                        </div>
                      )}

                      {/* Reply Box */}
                      {!r.seller_reply && (
                        <div className="flex gap-2 pt-2 border-t border-white/[0.04]">
                          <input
                            type="text"
                            value={replyInputs[r.id] || ""}
                            onChange={(e) => setReplyInputs({ ...replyInputs, [r.id]: e.target.value })}
                            placeholder="Write a reply to this customer..."
                            className="flex-1 rounded-xl border border-white/[0.08] bg-[#0A0D15] px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                          />
                          <button
                            type="button"
                            onClick={() => handlePostReply(r.id)}
                            disabled={submittingReply === r.id || !replyInputs[r.id]?.trim()}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition disabled:opacity-50 flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Reply</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. STORE ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 shadow-xl space-y-6">
              <div>
                <h3 className="font-bold text-sm text-white">Product Performance & Metrics</h3>
                <p className="text-xs text-zinc-400">Track views, favorites, and conversion rates across your inventory.</p>
              </div>

              {activeListings.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500">
                  Publish assets to view real performance analytics.
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {activeListings.map((l) => (
                    <div key={l.id} className="py-3.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{l.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{l.category} • {l.listing_type}</span>
                      </div>

                      <div className="flex items-center gap-6 font-mono text-center">
                        <div>
                          <span className="text-white font-bold block">{orders.filter((o) => o.listing_id === l.id).length}</span>
                          <span className="text-[9px] text-zinc-500">ORDERS</span>
                        </div>
                        <div>
                          <span className="text-emerald-400 font-bold block">100%</span>
                          <span className="text-[9px] text-zinc-500">FULFILLMENT</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Roblox Identity Verification</span>
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Link your Roblox account to gain the verified badge on your liveries and storefront.
                </p>

                {activeUser.roblox_verified ? (
                  <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-between text-xs">
                    <span className="text-blue-300 font-mono">Linked: @{activeUser.roblox_username}</span>
                    <button
                      type="button"
                      onClick={() => setRobloxModalOpen(true)}
                      className="text-xs font-bold text-blue-400 underline"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRobloxModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    Verify Roblox Account
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4">
                <h3 className="font-bold text-sm text-white">Creator Terms & Rate</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your creator account has 0% platform listing fees.
                </p>
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Platform Cut:</span>
                    <span className="text-emerald-400 font-mono font-bold">0% Commission</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Escrow Security:</span>
                    <span className="text-emerald-400 font-mono font-bold">Automated</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <RobloxConnectModal
        open={robloxModalOpen}
        onClose={() => setRobloxModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
