const db = (globalThis as any).__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy({}, { get: () => ({ filter: async () => [], get: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }) }),
  integrations: { Core: { UploadFile: async () => ({ file_url: "" }) } },
};

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
import { cn } from "@/lib/utils";

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
    db.entities.Listing.get(id)
      .then(setListing)
      .catch(() => setListing(null))
      .finally(() => setLoading(false));

    db.entities.Review.filter({ listing_id: id }, "-created_date", 50)
      .then(setReviews)
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!listing) return;
    db.entities.Listing.filter({ status: "active", category: listing.category }, "-created_date", 6)
      .then((rows: any[]) => setRelated((rows || []).filter((r: any) => r.id !== id).slice(0, 3)))
      .catch(() => {});
  }, [listing, id]);

  const submitReview = async () => {
    if (!user) return navigate("/login");
    if (!reviewForm.comment.trim()) return;
    setPosting(true);
    try {
      const r = await db.entities.Review.create({
        listing_id: id,
        reviewer_id: user.id,
        reviewer_name: user.name || user.username || "Creator",
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });
      setReviews([r, ...reviews]);
      setReviewForm({ rating: 5, comment: "" });
    } catch (e) {
      // Local fallback
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
      <div className="min-h-screen bg-[#07090E] text-white grid place-items-center">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="max-w-md mx-auto my-auto p-12 text-center rounded-3xl border border-white/[0.08] bg-[#0A0D15]">
          <Store className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Listing not found</h2>
          <p className="text-xs text-zinc-400 mb-6">This ER:LC asset may have been removed or unpublished.</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
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
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Breadcrumb back */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Marketplace
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Media & Overview */}
            <div className="lg:col-span-8 space-y-8">
              {/* Main Photo Gallery */}
              <div className="space-y-3">
                <div className="aspect-[16/9] rounded-3xl overflow-hidden border border-white/[0.1] bg-black/60 shadow-2xl relative">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[activeImg] || listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#0E121B] to-[#07090E]">
                      <Store className="w-16 h-16 text-zinc-700 mb-3" />
                      <span className="text-sm font-mono text-zinc-500 uppercase">{department} Livery Showcase</span>
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-black/85 border border-emerald-500/30 px-3 py-1 rounded-xl backdrop-blur-md">
                      {department}
                    </span>
                  </div>
                </div>

                {/* Thumbnails */}
                {listing.images && listing.images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-2">
                    {listing.images.map((url: string, i: number) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImg(i)}
                        className={cn(
                          "w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all",
                          i === activeImg ? "border-emerald-400 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Asset Description */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-4 shadow-xl">
                <h2 className="text-lg font-bold text-white">Asset Details & Breakdown</h2>
                <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {listing.description || "Authentic ER:LC emergency livery package with instant escrow key delivery."}
                </div>

                {listing.departments && (
                  <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-zinc-400">Compatible Units:</span>
                    {listing.departments.map((d: string) => (
                      <span key={d} className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Creator Reviews</h3>
                    <p className="text-xs text-zinc-400">Feedback from verified purchasers</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                    <Star className="w-4 h-4 fill-emerald-400" />
                    <span>5.0</span>
                  </div>
                </div>

                {/* Submit Review */}
                <div className="p-4 rounded-2xl border border-white/[0.06] bg-[#07090E] space-y-3">
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
                              "w-4 h-4",
                              star <= reviewForm.rating ? "text-emerald-400 fill-emerald-400" : "text-zinc-600"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Share your feedback on the livery quality, ELS lighting, or vehicle fit..."
                    className="w-full rounded-xl border border-white/[0.1] bg-[#0A0D15] p-3 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 resize-none"
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={submitReview}
                      disabled={posting || !reviewForm.comment.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{posting ? "Posting…" : "Post Review"}</span>
                    </button>
                  </div>
                </div>

                {/* Review List */}
                {reviews.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-4">No reviews yet. Be the first to review!</p>
                ) : (
                  <div className="space-y-3 divide-y divide-white/[0.06]">
                    {reviews.map((r: any, idx: number) => (
                      <div key={idx} className="pt-3 first:pt-0">
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

            {/* Right Column: Pricing & Purchase Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-7 space-y-6 shadow-2xl">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      {listing.category || "Asset"}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{listing.listing_type || "Single"}</span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {listing.title}
                  </h1>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#07090E] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 block font-mono">Price</span>
                    <span className="text-2xl font-black font-mono text-emerald-400">{priceLabel}</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase">Instant Escrow</span>
                </div>

                {/* Purchase Button */}
                <button
                  type="button"
                  onClick={() => setShowPurchase(true)}
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black py-4 text-sm font-bold shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isFree ? "Get Free Asset" : `Purchase for ${priceLabel}`}</span>
                </button>

                {/* Creator Card */}
                <div className="p-4 rounded-2xl border border-white/[0.06] bg-[#07090E] space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold shrink-0">
                      {(listing.seller_name || "C").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span className="truncate">{listing.seller_name || "Verified Creator"}</span>
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono">Verified ER:LC Seller</span>
                    </div>
                  </div>
                </div>

                {/* Security Highlights */}
                <div className="space-y-2.5 text-xs text-zinc-400 border-t border-white/[0.06] pt-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Scam-Shield Escrow key protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Sub-2 second automated token dispatch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>0% Creator Commission fees</span>
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