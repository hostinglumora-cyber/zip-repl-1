import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Star,
  Store,
  Share2,
  UserPlus,
  UserCheck,
  MessageCircle,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Calendar,
  ShoppingBag,
  Layers,
  Sparkles,
  Search,
  BadgeCheck,
  ArrowLeft,
  ChevronRight,
  Globe,
  Youtube,
  Twitter,
  Github,
  Award,
  Flame,
  CheckCircle2,
  Car,
  Tag,
  Clock,
  Heart,
  Send,
  SlidersHorizontal,
  HelpCircle,
  ThumbsUp,
  Flag,
  DollarSign,
  Briefcase,
  Radio,
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { MarketplaceCard } from "@/pages/Marketplace";
import { localDb } from "@/lib/localDb";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

const ACCENT_COLORS: Record<string, { ring: string; text: string; bg: string; border: string; glow: string }> = {
  emerald: {
    ring: "ring-emerald-500",
    text: "text-emerald-400",
    bg: "bg-emerald-500",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
  },
  cyan: {
    ring: "ring-cyan-500",
    text: "text-cyan-400",
    bg: "bg-cyan-500",
    border: "border-cyan-500/30",
    glow: "shadow-cyan-500/20",
  },
  violet: {
    ring: "ring-violet-500",
    text: "text-violet-400",
    bg: "bg-violet-500",
    border: "border-violet-500/30",
    glow: "shadow-violet-500/20",
  },
  amber: {
    ring: "ring-amber-500",
    text: "text-amber-400",
    bg: "bg-amber-500",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/20",
  },
  crimson: {
    ring: "ring-rose-500",
    text: "text-rose-400",
    bg: "bg-rose-500",
    border: "border-rose-500/30",
    glow: "shadow-rose-500/20",
  },
};

export default function Profile() {
  const { username, id } = useParams<{ username?: string; id?: string }>();
  const lookupUsername = username || id || "me";
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "all" | "featured" | "bundles" | "free" | "services" | "reviews" | "about"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewSort, setReviewSort] = useState<"newest" | "highest" | "lowest">("newest");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const prof = await localDb.getCreatorProfile(lookupUsername);
        if (!prof) {
          setProfile(null);
          setLoading(false);
          return;
        }

        setProfile(prof);
        document.title = `${prof.display_name || prof.username} (@${prof.username}) | LibertyX Creator Storefront`;

        const listingQuery = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
        const allListings: any[] = await listingQuery({ status: "active" }, "-created_date", 100);
        
        const creatorListings = allListings.filter((l) => {
          const matchUser = l.seller_username && l.seller_username.toLowerCase() === prof.username.toLowerCase();
          const matchId = l.seller_id && l.seller_id === prof.user_id;
          const matchName = l.seller_name && l.seller_name.toLowerCase() === (prof.display_name || "").toLowerCase();
          return matchUser || matchId || matchName;
        });
        setListings(creatorListings);

        const purchaseQuery = db?.entities?.Purchase?.filter || localDb.entities.Purchase.filter;
        const allPurchases: any[] = await purchaseQuery({}, "-created_date", 100);
        const creatorPurchases = allPurchases.filter(
          (p) => p.seller_id === prof.user_id || p.seller_id === prof.id
        );
        setPurchases(creatorPurchases);

        const reviewQuery = db?.entities?.Review?.filter || localDb.entities.Review.filter;
        const allReviews: any[] = await reviewQuery({}, "-created_date", 100);
        const creatorReviews = allReviews.filter((r) => {
          const matchedListing = creatorListings.some((l) => l.id === r.listing_id);
          return matchedListing || r.creator_username?.toLowerCase() === prof.username.toLowerCase();
        });
        setReviews(creatorReviews);

        const fCount = localDb.getFollowersCount(prof.username);
        setFollowersCount(fCount);

        if (user?.id) {
          const following = await localDb.isFollowing(user.id, prof.username);
          setIsFollowing(following);

          const hasBought = allPurchases.some(
            (p) => p.buyer_id === user.id && (p.seller_id === prof.user_id || creatorListings.some((l) => l.id === p.listing_id))
          );
          setCanReview(hasBought);
        }
      } catch (err) {
        console.error("Error loading creator profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [lookupUsername, user?.id]);

  const isOwner = user?.id && profile?.user_id && user.id === profile.user_id;
  const accent = ACCENT_COLORS[profile?.accent_color || "emerald"] || ACCENT_COLORS.emerald;

  const handleToggleFollow = async () => {
    if (!user) {
      navigate(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    try {
      const res = await localDb.toggleFollow(user.id, profile);
      setIsFollowing(res.following);
      setFollowersCount(res.count);
    } catch (err: any) {
      alert(err.message || "Failed to update follow.");
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/u/${profile.username}`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handlePostReview = async () => {
    if (!user || !newReviewText.trim()) return;
    setSubmittingReview(true);
    try {
      const reviewFn = db?.entities?.Review?.create || localDb.entities.Review.create;
      const rev = await reviewFn({
        creator_username: profile.username,
        creator_id: profile.user_id || profile.id,
        reviewer_id: user.id,
        reviewer_name: user.display_name || user.username || "Verified Buyer",
        reviewer_username: user.username,
        reviewer_avatar: user.avatar_url,
        rating: newReviewRating,
        comment: newReviewText.trim(),
        verified_purchase: true,
        helpful_count: 0,
        created_date: new Date().toISOString(),
      });
      setReviews([rev, ...reviews]);
      setNewReviewText("");
    } catch {
      // ignore
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    if (!user) return alert("Please log in to vote.");
    if (helpfulVoted[reviewId]) return;
    const updated = await localDb.voteReviewHelpful(reviewId, user.id);
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
    setHelpfulVoted((prev) => ({ ...prev, [reviewId]: true }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-zinc-500">Loading creator storefront…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="max-w-md mx-auto my-auto p-10 text-center rounded-2xl border border-white/[0.08] bg-[#0A0D15] shadow-2xl">
          <Store className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-1">Creator Not Found</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            The creator profile <strong className="text-white">@{lookupUsername}</strong> does not exist or has not been registered.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-black transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Marketplace</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const featuredListings = listings.filter((l) =>
    profile.featured_listing_ids && Array.isArray(profile.featured_listing_ids)
      ? profile.featured_listing_ids.includes(l.id)
      : false
  );

  const bundleListings = listings.filter((l) => l.listing_type === "Bundle" || l.category === "Bundles");
  const freeListings = listings.filter((l) => l.price_type === "Free" || !l.price || l.price === 0);
  const servicesList = profile.services || [];

  const activeCatalog = (() => {
    let base = listings;
    if (activeTab === "featured") base = featuredListings.length > 0 ? featuredListings : listings;
    if (activeTab === "bundles") base = bundleListings;
    if (activeTab === "free") base = freeListings;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return base.filter(
        (l) =>
          l.title?.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q) ||
          l.vehicle_models?.toLowerCase().includes(q) ||
          l.category?.toLowerCase().includes(q)
      );
    }
    return base;
  })();

  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === "highest") return (b.rating || 5) - (a.rating || 5);
    if (reviewSort === "lowest") return (a.rating || 5) - (b.rating || 5);
    return new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime();
  });

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* Announcement Strip */}
        {profile.announcement && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 py-2.5 px-4 text-center text-xs font-semibold text-emerald-300">
            {profile.announcement}
          </div>
        )}

        {/* ─── 1. CREATOR FULL-WIDTH BANNER ─── */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-black/80 border-b border-white/[0.08]">
          <img
            src={profile.banner_url || "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80"}
            alt={`${profile.display_name} Banner`}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-black/40" />

          {/* Owner Customization shortcut */}
          {isOwner && (
            <div className="absolute top-4 right-4 flex gap-2">
              <Link
                to="/dashboard/storefront"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.15] bg-black/60 hover:bg-black text-xs font-semibold text-white backdrop-blur-md transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Storefront</span>
              </Link>
            </div>
          )}
        </div>

        {/* ─── 2. CREATOR HEADER & PROFILE CARD ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-10">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Top Row: Avatar + Details + Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className={cn(
                    "w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 bg-black shadow-xl ring-4 ring-black/80",
                    accent.border
                  )}>
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#121824] to-[#0A0D15] text-2xl font-black text-white">
                        {(profile.display_name || profile.username || "C").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={cn(
                      "absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#0A0D15]",
                      profile.status === "closed" ? "bg-rose-500" : profile.status === "away" ? "bg-amber-500" : "bg-emerald-500"
                    )}
                    title={profile.status_message || "Active"}
                  />
                </div>

                {/* Creator Title & Badges */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {profile.display_name || profile.username}
                    </h1>

                    {profile.roblox_username && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-bold text-blue-400">
                        <Check className="w-3 h-3" /> Roblox Verified
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                      <BadgeCheck className="w-3.5 h-3.5" /> LibertyX Creator
                    </span>

                    {profile.status_message && (
                      <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded">
                        {profile.status_message}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-zinc-400 font-mono">
                    <span className="text-zinc-300">@{profile.username}</span>
                    {profile.roblox_username && (
                      <>
                        <span>•</span>
                        <span>Roblox: <strong className="text-zinc-200">{profile.roblox_username}</strong></span>
                      </>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1 text-zinc-500">
                      <Calendar className="w-3 h-3" />
                      <span>Joined {new Date(profile.created_date || Date.now()).getFullYear()}</span>
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed pt-1">
                    {profile.bio || "Authentic ER:LC emergency vehicle liveries, uniform templates, and department packs."}
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm",
                    isFollowing
                      ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/15 hover:scale-[1.02]"
                  )}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow Creator</span>
                    </>
                  )}
                </button>

                <Link
                  to={`/messages?to=${profile.username}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-zinc-200 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Message</span>
                </Link>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-zinc-200 transition"
                  title="Share Storefront URL"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? "Copied" : "Share"}</span>
                </button>
              </div>
            </div>

            {/* Public Stats HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.06]">
              <div className="p-3 rounded-xl border border-white/[0.04] bg-[#07090E]">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">Active Products</span>
                <span className="text-xl font-mono font-bold text-white">{listings.length}</span>
              </div>

              <div className="p-3 rounded-xl border border-white/[0.04] bg-[#07090E]">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">Total Deliveries</span>
                <span className="text-xl font-mono font-bold text-white">{purchases.length}</span>
              </div>

              <div className="p-3 rounded-xl border border-white/[0.04] bg-[#07090E]">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">Customer Rating</span>
                <div className="flex items-center gap-1 text-xl font-mono font-bold text-emerald-400">
                  <Star className="w-4 h-4 fill-emerald-400" />
                  <span>{averageRating}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-white/[0.04] bg-[#07090E]">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">Followers</span>
                <span className="text-xl font-mono font-bold text-white">{followersCount}</span>
              </div>
            </div>

          </div>
        </div>

        {/* ─── 3. STOREFRONT TABS & CATALOG ─── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          
          {/* Tab Strip + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: "all", label: "All Products", count: listings.length },
                { id: "featured", label: "Featured", count: featuredListings.length },
                { id: "bundles", label: "Fleet Bundles", count: bundleListings.length },
                { id: "free", label: "Free Drops", count: freeListings.length },
                { id: "services", label: "Custom Services", count: servicesList.length },
                { id: "reviews", label: "Reviews", count: reviews.length },
                { id: "about", label: "About Creator" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all shrink-0 flex items-center gap-1.5",
                    activeTab === tab.id
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm"
                      : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white"
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="text-[10px] font-mono bg-white/[0.08] px-1.5 py-0.2 rounded font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search within Storefront */}
            {activeTab !== "reviews" && activeTab !== "about" && activeTab !== "services" && (
              <div className="relative sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${profile.display_name}'s store...`}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0A0D15] pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                />
              </div>
            )}
          </div>

          {/* CATALOG TAB CONTENT */}
          {(activeTab === "all" || activeTab === "featured" || activeTab === "bundles" || activeTab === "free") && (
            <div>
              {activeCatalog.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-12 text-center max-w-md mx-auto shadow-xl">
                  <Store className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <h3 className="text-base font-bold text-white mb-1">No products in this category</h3>
                  <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                    {searchQuery ? "No items match your search filter." : "This creator has not listed any items here yet."}
                  </p>
                  {isOwner && (
                    <Link
                      to="/sell"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black"
                    >
                      Publish New Asset
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {activeCatalog.map((listing) => (
                    <MarketplaceCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SERVICES / COMMISSIONS TAB */}
          {activeTab === "services" && (
            <div>
              {servicesList.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-12 text-center max-w-md mx-auto shadow-xl">
                  <Briefcase className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <h3 className="text-base font-bold text-white mb-1">No custom services listed</h3>
                  <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                    This creator is currently only offering pre-packaged catalog assets.
                  </p>
                  {isOwner && (
                    <Link
                      to="/dashboard/storefront"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black"
                    >
                      Add Services in Storefront Builder
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {servicesList.map((srv: any, i: number) => (
                    <div
                      key={srv.id || i}
                      className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4 shadow-xl flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                            {srv.category || "Commission"}
                          </span>
                          <span className="text-base font-mono font-bold text-white">R$ {srv.price || 0}</span>
                        </div>

                        <h3 className="text-base font-bold text-white">{srv.title}</h3>
                        <p className="text-xs text-zinc-300 leading-relaxed">{srv.description}</p>

                        <div className="pt-2 text-xs text-zinc-400 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Turnaround: <strong className="text-white">{srv.delivery_estimate || "24-48 Hours"}</strong></span>
                          </div>
                          {srv.requirements && (
                            <p className="text-[11px] text-zinc-500">Requirements: {srv.requirements}</p>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/[0.04]">
                        <Link
                          to={`/messages?to=${profile.username}&listing=custom_service&title=${encodeURIComponent(srv.title)}`}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Request Commission</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REVIEWS TAB CONTENT */}
          {activeTab === "reviews" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Verified Customer Reviews</h3>
                  <p className="text-xs text-zinc-400">Feedback from purchasers with verified escrow deliveries.</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                    <Star className="w-4 h-4 fill-emerald-400" />
                    <span>{averageRating} ★ ({reviews.length})</span>
                  </div>

                  <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value as any)}
                    className="rounded-xl border border-white/[0.08] bg-[#07090E] px-3 py-1.5 text-xs text-zinc-300 outline-none"
                  >
                    <option value="newest">Newest</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                  </select>
                </div>
              </div>

              {/* Verified Review Submission Box */}
              {canReview && (
                <div className="rounded-2xl border border-emerald-500/25 bg-[#0A0D15] p-5 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-emerald-400" />
                      <span>Leave a Verified Review</span>
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-0.5"
                        >
                          <Star
                            className={cn(
                              "w-4 h-4",
                              star <= newReviewRating ? "text-emerald-400 fill-emerald-400" : "text-zinc-600"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Write your review on asset quality, ELS patterns, or delivery speed..."
                    className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] p-3 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 resize-none"
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handlePostReview}
                      disabled={submittingReview || !newReviewText.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingReview ? "Posting…" : "Post Verified Review"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {sortedReviews.length === 0 ? (
                <div className="p-10 text-center text-xs text-zinc-500 rounded-2xl border border-white/[0.06] bg-[#0A0D15]">
                  No reviews recorded yet for this creator.
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedReviews.map((r, i) => (
                    <div key={r.id || i} className="rounded-2xl border border-white/[0.06] bg-[#0A0D15] p-4 text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{r.reviewer_name || "Verified Buyer"}</span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 rounded">
                            ✓ Verified Purchase
                          </span>
                        </div>
                        <div className="flex text-emerald-400">
                          {[...Array(r.rating || 5)].map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-emerald-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-zinc-300 leading-relaxed">{r.comment}</p>

                      {/* Creator Reply Display */}
                      {r.seller_reply && (
                        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] space-y-1">
                          <span className="font-bold text-emerald-400 block text-[11px]">Creator Reply:</span>
                          <p className="text-zinc-300">{r.seller_reply.text}</p>
                        </div>
                      )}

                      {/* Helpful Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[11px] text-zinc-500">
                        <span>{new Date(r.created_date || Date.now()).toLocaleDateString()}</span>
                        <button
                          type="button"
                          onClick={() => handleHelpful(r.id)}
                          className={cn(
                            "flex items-center gap-1 text-zinc-400 hover:text-white transition",
                            helpfulVoted[r.id] && "text-emerald-400"
                          )}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful ({r.helpful_count || 0})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABOUT & SOCIALS & FAQS TAB */}
          {activeTab === "about" && (
            <div className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4 shadow-xl">
                  <h3 className="font-bold text-sm text-white">Creator Bio</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                    {profile.bio || "No extended bio provided."}
                  </p>

                  <div className="pt-4 border-t border-white/[0.06] space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-mono">LibertyX Handle:</span>
                      <span className="font-mono text-zinc-300">@{profile.username}</span>
                    </div>
                    {profile.roblox_username && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-mono">Roblox Account:</span>
                        <span className="font-mono text-blue-400">@{profile.roblox_username}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4 shadow-xl">
                  <h3 className="font-bold text-sm text-white">Verified Links</h3>
                  <div className="space-y-2.5">
                    {profile.social_links?.discord && (
                      <a
                        href={profile.social_links.discord}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-[#07090E] hover:border-[#5865F2]/40 text-xs text-white transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <MessageCircle className="w-4 h-4 text-[#5865F2]" />
                          <span>Discord Community</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                      </a>
                    )}

                    {profile.social_links?.roblox && (
                      <a
                        href={profile.social_links.roblox}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-[#07090E] hover:border-blue-500/40 text-xs text-white transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <span>Roblox Profile / Group</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                      </a>
                    )}

                    {profile.social_links?.youtube && (
                      <a
                        href={profile.social_links.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-[#07090E] hover:border-red-500/40 text-xs text-white transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <Youtube className="w-4 h-4 text-red-400" />
                          <span>YouTube Channel</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                      </a>
                    )}

                    {profile.social_links?.twitter && (
                      <a
                        href={profile.social_links.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-[#07090E] hover:border-zinc-400 text-xs text-white transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <Twitter className="w-4 h-4 text-zinc-300" />
                          <span>X / Twitter</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Custom FAQs */}
              {profile.custom_faqs && profile.custom_faqs.length > 0 && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4 shadow-xl">
                  <h3 className="font-bold text-sm text-white">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    {profile.custom_faqs.map((faq: any, i: number) => (
                      <div key={i} className="p-3.5 rounded-xl border border-white/[0.04] bg-[#07090E] space-y-1">
                        <p className="text-xs font-bold text-white">{faq.q}</p>
                        <p className="text-xs text-zinc-400">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
}