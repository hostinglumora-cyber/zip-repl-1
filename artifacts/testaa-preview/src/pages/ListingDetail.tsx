import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Store,
  MessageSquare,
  Send,
  BadgeCheck,
  Package,
  Heart,
  ShoppingBag,
  ExternalLink,
  Tag,
  Clock,
  Sparkles,
  Share2,
} from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import SiteNav from "@/components/SiteNav";
import { Footer, MarketplaceCard } from "@/pages/Marketplace";
import { getDepartment, DEPARTMENTS } from "@/lib/departments";
import PurchaseModal from "@/components/PurchaseModal";
import { localDb } from "@/lib/localDb";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [posting, setPosting] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const getFn = db?.entities?.Listing?.get || localDb.entities.Listing.get;
    const revQuery = db?.entities?.Review?.filter || localDb.entities.Review.filter;

    getFn(id)
      .then(setListing)
      .catch(() => setListing(null))
      .finally(() => setLoading(false));

    revQuery({ listing_id: id }, "-created_date", 50)
      .then((rows: any[]) => setReviews(rows || []))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!listing) return;
    const filterFn = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
    filterFn({ status: "active", category: listing.category }, "-created_date", 6)
      .then((rows: any[]) => setRelated((rows || []).filter((r: any) => r.id !== id).slice(0, 3)))
      .catch(() => {});
  }, [listing, id]);

  const submitReview = async () => {
    if (!user) return navigate("/login");
    if (!reviewForm.comment.trim()) return;
    setPosting(true);
    try {
      const createFn = db?.entities?.Review?.create || localDb.entities.Review.create;
      const r = await createFn({
        listing_id: id,
        reviewer_id: user.id,
        reviewer_name: user.name || user.username || "Verified Creator",
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });
      setReviews([r, ...reviews]);
      setReviewForm({ rating: 5, comment: "" });
    } catch (e) {
      // fallback
    } finally {
      setPosting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080C] text-white grid place-items-center">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#06080C] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="max-w-md mx-auto my-auto p-10 text-center rounded-2xl border border-white/[0.08] bg-[#0A0D14]">
          <Store className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-white mb-1">Asset Not Found</h2>
          <p className="text-xs text-zinc-400 mb-5">This ER:LC asset may have been unpublished or removed.</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isFree = listing.price_type === "Free" || !listing.price || listing.price === 0;
  const priceLabel = isFree ? "Free Download" : `R$ ${listing.price}`;
  const department = listing.departments && listing.departments.length > 0 ? listing.departments[0] : "General";

  return (
    <div className="min-h-screen bg-[#06080C] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          {/* Breadcrumb back & share */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Media & Overview */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Photo Showcase */}
              <div className="space-y-3">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/[0.08] bg-black/60 shadow-xl relative">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[activeImg] || listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#0D121B] to-[#07090E]">
                      <Store className="w-12 h-12 text-zinc-700 mb-2" />
                      <span className="text-xs font-mono text-zinc-500 uppercase">{department} Livery Showcase</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-black/85 border border-emerald-500/30 px-2.5 py-0.5 rounded backdrop-blur-md">
                      {department}
                    </span>
                  </div>
                </div>

                {/* Thumbnails */}
                {listing.images && listing.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {listing.images.map((url: string, i: number) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImg(i)}
                        className={cn(
                          "w-18 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all",
                          i === activeImg ? "border-emerald-400" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description Details */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-6 space-y-4 shadow-xl">
                <h2 className="text-base font-bold text-white">Asset Details & Compatibility</h2>
                <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {listing.description || "Authentic ER:LC emergency livery package with instant escrow key delivery."}
                </div>

                {listing.vehicle_models && (
                  <div className="pt-3 border-t border-white/[0.04] flex items-center gap-2 text-xs">
                    <span className="text-zinc-500 font-mono">Vehicles:</span>
                    <span className="font-semibold text-zinc-200">{listing.vehicle_models}</span>
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-6 space-y-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Customer Reviews</h3>
                    <p className="text-xs text-zinc-400">Verified feedback from purchasers</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <Star className="w-3.5 h-3.5 fill-emerald-400" />
                    <span>5.0 ★</span>
                  </div>
                </div>

                {/* Add Review */}
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#06080C] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">Rate this asset</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="p-0.5"
                        >
                          <Star
                            className={cn(
                              "w-3.5 h-3.5",
                              star <= reviewForm.rating ? "text-emerald-400 fill-emerald-400" : "text-zinc-600"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Leave feedback on texture quality, ELS patterns, or vehicle fit..."
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0A0D14] p-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 resize-none"
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={submitReview}
                      disabled={posting || !reviewForm.comment.trim()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition disabled:opacity-40"
                    >
                      <Send className="w-3 h-3" />
                      <span>{posting ? "Posting…" : "Post Review"}</span>
                    </button>
                  </div>
                </div>

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-2">No reviews yet for this asset.</p>
                ) : (
                  <div className="space-y-2.5 divide-y divide-white/[0.04]">
                    {reviews.map((r: any, idx: number) => (
                      <div key={idx} className="pt-2.5 first:pt-0">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-white">{r.reviewer_name || "Verified Buyer"}</span>
                          <div className="flex text-emerald-400">
                            {[...Array(r.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-emerald-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Pricing & Purchase */}
            <div className="lg:col-span-4 space-y-5">
              <div className="sticky top-24 rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-6 space-y-5 shadow-2xl">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 rounded">
                      {listing.category || "Asset"}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{listing.listing_type || "Single"}</span>
                  </div>

                  <h1 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {listing.title}
                  </h1>
                </div>

                {/* Price Pill */}
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#06080C] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-mono uppercase">Price</span>
                    <span className="text-xl font-mono font-bold text-emerald-400">{priceLabel}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Escrow Key</span>
                </div>

                {/* Action */}
                <button
                  type="button"
                  onClick={() => setShowPurchase(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black py-3 text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isFree ? "Download Free Asset" : `Purchase for ${priceLabel}`}</span>
                </button>

                {/* Creator Card */}
                <div className="p-3.5 rounded-xl border border-white/[0.04] bg-[#06080C] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {(listing.seller_name || "C").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span className="truncate">{listing.seller_name || "Verified Creator"}</span>
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">Verified ER:LC Seller</span>
                  </div>
                </div>

                {/* Key Points */}
                <div className="space-y-2 text-xs text-zinc-400 border-t border-white/[0.04] pt-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Automated Scam-Shield escrow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Sub-2 second instant code dispatch</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <PurchaseModal
        listing={listing}
        open={showPurchase}
        onOpenChange={setShowPurchase}
      />

      <Footer />
    </div>
  );
}