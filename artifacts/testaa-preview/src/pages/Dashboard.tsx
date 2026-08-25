import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Store,
  DollarSign,
  Star,
  Plus,
  ShoppingBag,
  ExternalLink,
  Trash2,
  CheckCircle2,
  MessageCircle,
  BarChart3,
  Settings,
  Sparkles,
  Palette,
  TrendingUp,
  Send,
  Globe,
} from "lucide-react";

import PageShell from "@/components/PageShell";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";
import RobloxConnectModal from "@/components/RobloxConnectModal";

const db = (globalThis as any).__B44_DB__ || localDb;

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "orders" | "messages" | "reviews" | "storefront" | "settings"
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
      <PageShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-sm w-full p-6 text-center rounded-xl bg-[#12151E] border border-white/[0.08]">
            <Store className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-sm font-semibold text-slate-50 mb-2">Creator Studio Authentication</h2>
            <p className="text-xs text-slate-400 mb-6">
              Sign in with Discord to access your creator inventory, sales, and storefront builder.
            </p>
            <Link
              to="/login?returnTo=/dashboard"
              className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-sm font-semibold text-black active:scale-[0.98]"
            >
              Sign in with Discord
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "products", label: "Products", count: activeListings.length, icon: Store },
    { id: "orders", label: "Orders", count: orders.length, icon: ShoppingBag },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "reviews", label: "Reviews", count: reviews.length, icon: Star },
    { id: "storefront", label: "Storefront", icon: Palette },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <PageShell noPadding fullWidth>
      <div className="flex min-h-[calc(100vh-56px)] bg-[#090A0F] text-slate-50">
        {/* Left Sidebar */}
        <aside className="w-56 shrink-0 bg-[#12151E] border-r border-white/[0.08] flex flex-col hidden md:flex">
          <div className="p-4 border-b border-white/[0.08]">
            <h2 className="text-sm font-semibold text-slate-50 truncate flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Creator Studio
            </h2>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "storefront") navigate("/dashboard/storefront");
                    else setActiveTab(item.id as any);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-400 hover:text-slate-50 hover:bg-white/[0.04]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="text-xs bg-white/[0.06] text-slate-300 px-1.5 py-0.5 rounded">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/[0.08]">
            <Link
              to="/sell"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-sm font-semibold text-black active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Publish Asset
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-50">
                  {navItems.find(n => n.id === activeTab)?.label}
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Welcome back, {activeUser.display_name || activeUser.username}.
                </p>
              </div>
              <Link
                to={`/u/${activeUser.username || "me"}`}
                target="_blank"
                className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] rounded-lg px-4 py-2 text-sm"
              >
                <span>View Store</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-4">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Products</span>
                    <p className="text-xl font-bold text-slate-50">{activeListings.length}</p>
                  </div>
                  <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-4">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Revenue</span>
                    <p className="text-xl font-bold text-emerald-400">R$ {totalSalesRevenue}</p>
                  </div>
                  <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-4">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Orders</span>
                    <p className="text-xl font-bold text-slate-50">{orders.length}</p>
                  </div>
                  <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-4">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Followers</span>
                    <p className="text-xl font-bold text-slate-50">{followersCount}</p>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS */}
            {activeTab === "products" && (
              <div className="bg-[#12151E] border border-white/[0.08] rounded-xl overflow-hidden">
                {activeListings.length === 0 ? (
                  <EmptyState 
                    icon={Store}
                    title="No products yet"
                    description="Publish your first asset to start selling."
                    action={{ label: "Publish Asset", href: "/sell" }}
                  />
                ) : (
                  <div className="divide-y divide-white/[0.08]">
                    {activeListings.map((l) => (
                      <div key={l.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#090A0F] border border-white/[0.08] flex items-center justify-center overflow-hidden shrink-0">
                            {l.images?.[0] ? (
                              <img src={l.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Store className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-50 truncate max-w-[200px] sm:max-w-xs">{l.title}</p>
                            <p className="text-xs text-slate-400">{l.price_type === "Free" ? "Free" : `R$ ${l.price}`}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/listing/${l.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-50 hover:bg-white/[0.04]"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteListing(l.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ORDERS */}
            {activeTab === "orders" && (
              <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-4">
                {orders.length === 0 ? (
                  <EmptyState icon={ShoppingBag} title="No orders yet" description="Sales will appear here." />
                ) : (
                  <div className="space-y-2">
                    {orders.map((o: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg border border-white/[0.04] bg-[#090A0F] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="text-sm font-semibold text-slate-50">{o.listing_title || "Asset"}</p>
                            <p className="text-xs text-slate-500">Buyer: {o.buyer_name || "Customer"}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm font-semibold text-emerald-400">
                          {o.price ? `R$ ${o.price}` : "Free"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <EmptyState icon={Star} title="No reviews yet" description="Reviews will appear here." />
                ) : (
                  reviews.map((r: any) => (
                    <div key={r.id} className="bg-[#12151E] border border-white/[0.08] rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-slate-50">{r.reviewer_name}</span>
                        <div className="flex text-emerald-400">
                          {[...Array(r.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-emerald-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-400">{r.comment}</p>
                      
                      {r.seller_reply ? (
                        <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04]">
                          <span className="text-xs font-semibold text-emerald-400 block mb-1">Your Reply:</span>
                          <p className="text-sm text-slate-300">{r.seller_reply.text}</p>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyInputs[r.id] || ""}
                            onChange={(e) => setReplyInputs({ ...replyInputs, [r.id]: e.target.value })}
                            placeholder="Write a reply..."
                            className="flex-1 rounded-lg border border-white/[0.08] bg-[#090A0F] px-3 py-1.5 text-sm text-slate-50 outline-none focus:border-emerald-500/50"
                          />
                          <button
                            onClick={() => handlePostReply(r.id)}
                            disabled={submittingReply === r.id || !replyInputs[r.id]?.trim()}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-5 space-y-4 max-w-lg">
                <h3 className="text-sm font-semibold text-slate-50 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  Roblox Verification
                </h3>
                <p className="text-sm text-slate-400">
                  Link your Roblox account for verified badges.
                </p>
                {activeUser.roblox_verified ? (
                  <div className="p-3 rounded-lg bg-[#090A0F] border border-white/[0.08] text-sm text-slate-300 flex justify-between items-center">
                    <span>Linked: @{activeUser.roblox_username}</span>
                    <button onClick={() => setRobloxModalOpen(true)} className="text-blue-400 text-xs font-semibold hover:underline">
                      Update
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setRobloxModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    Verify Account
                  </button>
                )}
              </div>
            )}
            
          </div>
        </main>
      </div>

      <RobloxConnectModal open={robloxModalOpen} onClose={() => setRobloxModalOpen(false)} />
    </PageShell>
  );
}
