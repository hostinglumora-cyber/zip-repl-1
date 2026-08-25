import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Star, MessageCircle, BadgeCheck, Check, Share2, ImageIcon, Store, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import PageShell from "@/components/PageShell";
import PurchaseModal from "@/components/PurchaseModal";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const [showPurchase, setShowPurchase] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "creator">("details");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const getFn = db?.entities?.Listing?.get || localDb.entities.Listing.get;
        const revQuery = db?.entities?.Review?.filter || localDb.entities.Review.filter;

        const foundListing = await getFn(id);
        setListing(foundListing);

        const revs = await revQuery({ listing_id: id }, "-created_date", 50);
        setReviews(revs || []);

        if (user?.id && id) {
          const fav = await localDb.isFavorite(user.id, id);
          setIsFav(fav);
        }
      } catch (err) {
        setListing(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, user?.id]);

  const handleToggleFav = async () => {
    if (!user) {
      alert("Please sign in to save favorites.");
      return;
    }
    const res = await localDb.toggleFavorite(user.id, listing);
    setIsFav(res.favorited);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <PageShell>
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading details…</p>
        </div>
      </PageShell>
    );
  }

  if (!listing) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto py-24 text-center">
          <Store className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-50 mb-2">Asset Not Found</h2>
          <p className="text-sm text-slate-400 mb-6">This listing may have been removed.</p>
          <Link
            to="/marketplace"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg px-4 py-2 text-sm"
          >
            Explore Marketplace
          </Link>
        </div>
      </PageShell>
    );
  }

  const isFree = listing.price_type === "Free" || !listing.price || listing.price === 0;
  const priceDisplay = isFree ? "FREE" : `R$ ${listing.price}`;
  const images = listing.images && listing.images.length > 0 ? listing.images : [];
  const tags: string[] = Array.isArray(listing.tags)
    ? listing.tags
    : typeof listing.tags === "string"
    ? listing.tags.split(",").map((t: string) => t.trim())
    : [];

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : null;

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link to="/marketplace" className="hover:text-slate-50 transition-colors">Marketplace</Link>
            <span>/</span>
            <span>{listing.category || "Asset"}</span>
            <span>/</span>
            <span className="text-slate-50">{listing.title}</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 hover:bg-white/[0.04] text-slate-400 hover:text-slate-50 rounded-lg px-3 py-1.5 text-sm transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            {copied ? "Copied" : "Share"}
          </button>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column - Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-video rounded-xl bg-[#12151E] border border-white/[0.08] overflow-hidden flex items-center justify-center">
              {images.length > 0 && !imgError[activeImg] ? (
                <img
                  src={images[activeImg]}
                  alt={listing.title}
                  onError={() => setImgError((prev) => ({ ...prev, [activeImg]: true }))}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-slate-500">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span className="text-xs uppercase font-medium">No Image</span>
                </div>
              )}
              <button
                onClick={handleToggleFav}
                className={cn(
                  "absolute top-4 right-4 p-2 rounded-lg bg-[#12151E]/80 backdrop-blur-md border border-white/[0.08] transition-colors",
                  isFav ? "text-emerald-400 border-emerald-500/30" : "text-slate-400 hover:text-slate-50"
                )}
              >
                <Heart className={cn("w-4 h-4", isFav && "fill-emerald-400")} />
              </button>
            </div>

            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={cn(
                      "w-24 aspect-video rounded-xl overflow-hidden border transition-colors shrink-0 bg-[#12151E]",
                      activeImg === idx ? "border-emerald-500/30 ring-1 ring-emerald-500" : "border-white/[0.08] opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-50 mb-2">
                {listing.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-slate-400">
                {averageRating ? (
                  <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Star className="w-4 h-4 fill-emerald-400" />
                    <span>{averageRating}</span>
                    <span className="text-slate-500">({reviews.length})</span>
                  </div>
                ) : (
                  <span>No reviews</span>
                )}
              </div>
            </div>

            {/* Creator Row */}
            <div className="flex items-center justify-between p-4 bg-[#12151E] border border-white/[0.08] rounded-xl">
              <Link to={`/u/${listing.seller_username}`} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1C212E] text-emerald-400 flex items-center justify-center font-bold">
                  {(listing.seller_name || "C").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-slate-50">{listing.seller_name}</span>
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-500 uppercase">@{listing.seller_username}</span>
                </div>
              </Link>
              <Link
                to={`/messages?to=${listing.seller_username}`}
                className="hover:bg-white/[0.04] text-slate-400 hover:text-slate-50 rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </Link>
            </div>

            {/* Price & Action */}
            <div className="p-5 bg-[#12151E] border border-white/[0.08] rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase">Price</span>
                <span className="text-xl font-bold tracking-tight text-slate-50">{priceDisplay}</span>
              </div>
              <button
                onClick={() => setShowPurchase(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg px-4 py-3 text-sm active:scale-[0.98] transition-all"
              >
                Purchase Asset
              </button>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-500 uppercase">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t} className="bg-[#1C212E] text-slate-400 text-xs font-medium px-2 py-1 rounded-lg border border-white/[0.08]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-white/[0.08] pb-4">
            {(["details", "reviews", "creator"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "text-sm font-semibold capitalize px-3 py-1.5 rounded-lg transition-colors",
                  activeTab === tab ? "bg-[#1C212E] text-slate-50" : "text-slate-400 hover:text-slate-50 hover:bg-white/[0.04]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-5">
            {activeTab === "details" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-50">Description</h3>
                <p className="text-sm text-slate-400 whitespace-pre-wrap leading-relaxed">
                  {listing.description || "No description provided."}
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-slate-50">Customer Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="text-sm text-slate-500">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r, i) => (
                      <div key={i} className="p-4 bg-[#1C212E] rounded-xl border border-white/[0.08] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-50">{r.reviewer_name}</span>
                          <div className="flex items-center gap-1 text-emerald-400">
                            <Star className="w-4 h-4 fill-emerald-400" />
                            <span className="text-sm font-semibold">{r.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "creator" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-50">About {listing.seller_name}</h3>
                <Link
                  to={`/u/${listing.seller_username}`}
                  className="inline-flex bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] rounded-lg px-4 py-2 text-sm transition-colors"
                >
                  View Full Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <PurchaseModal listing={listing} open={showPurchase} onOpenChange={setShowPurchase} />
    </PageShell>
  );
}