import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Store,
  MessageCircle,
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
  Check,
  Image as ImageIcon,
  AlertCircle,
  Car,
  MapPin,
} from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import SiteNav from "@/components/SiteNav";
import { Footer, MarketplaceCard } from "@/pages/Marketplace";
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
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);

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

  useEffect(() => {
    if (!listing) return;
    const filterFn = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
    filterFn({ status: "active" }, "-created_date", 10)
      .then((rows: any[]) =>
        setRelated((rows || []).filter((r: any) => r.id !== id && r.category === listing.category).slice(0, 4))
      )
      .catch(() => {});
  }, [listing, id]);

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

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?returnTo=/listing/${id}`);
      return;
    }
    if (!reviewText.trim()) return;
    setSubmittingReview(true);

    try {
      const createFn = db?.entities?.Review?.create || localDb.entities.Review.create;
      const rev = await createFn({
        listing_id: id,
        creator_username: listing.seller_username,
        reviewer_id: user.id,
        reviewer_name: user.display_name || user.username || "Verified Buyer",
        reviewer_username: user.username,
        rating: reviewRating,
        comment: reviewText.trim(),
        verified_purchase: true,
        created_date: new Date().toISOString(),
      });

      setReviews([rev, ...reviews]);
      setReviewText("");
    } catch (err: any) {
      alert(err.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-zinc-500">Loading asset details…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="max-w-md mx-auto my-auto p-10 text-center rounded-2xl border border-white/[0.08] bg-[#0A0D15] shadow-2xl">
          <Store className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-1">Asset Not Found</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            This listing may have been removed or is no longer active in the marketplace.
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
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* Breadcrumb strip */}
        <div className="border-b border-white/[0.06] bg-[#0A0D15]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2 truncate">
              <Link to="/marketplace" className="hover:text-white transition flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Marketplace
              </Link>
              <span>/</span>
              <span className="text-zinc-300">{listing.category || "Asset"}</span>
              <span>/</span>
              <span className="text-emerald-400 truncate">{listing.title}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Share"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── MAIN PRODUCT VIEW ─── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Media Gallery (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[16/10] rounded-2xl border border-white/[0.08] bg-black/80 overflow-hidden shadow-2xl flex items-center justify-center">
                {images.length > 0 && !imgError[activeImg] ? (
                  <img
                    src={images[activeImg]}
                    alt={listing.title}
                    onError={() => setImgError((prev) => ({ ...prev, [activeImg]: true }))}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-40 text-emerald-400" />
                    <span className="text-xs font-mono">Image preview unavailable</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleToggleFav}
                  className={cn(
                    "absolute top-4 right-4 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/[0.1] transition",
                    isFav ? "text-rose-500" : "text-zinc-400 hover:text-white"
                  )}
                  title="Save to Wishlist"
                >
                  <Heart className={cn("w-4 h-4", isFav && "fill-rose-500")} />
                </button>
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImg(idx)}
                      className={cn(
                        "w-20 aspect-[16/10] rounded-xl overflow-hidden border-2 transition shrink-0 bg-black",
                        activeImg === idx ? "border-emerald-400 ring-2 ring-emerald-500/20" : "border-white/[0.08] opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Buy & Details Box (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                    {listing.category || "Asset"}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                    {listing.listing_type || "Single"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {listing.title}
                </h1>

                {/* Rating & Creator Bar */}
                <div className="flex items-center gap-3 pt-1 text-xs">
                  {averageRating ? (
                    <div className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-emerald-400" />
                      <span>{averageRating} ({reviews.length} reviews)</span>
                    </div>
                  ) : (
                    <span className="text-zinc-500 font-mono">No reviews yet</span>
                  )}
                </div>
              </div>

              {/* Creator Card Strip */}
              <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#0A0D15] flex items-center justify-between gap-3">
                <Link
                  to={`/u/${listing.seller_username || "creator"}`}
                  className="flex items-center gap-3 min-w-0 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                    {(listing.seller_name || "C").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition truncate">
                        {listing.seller_name || "Creator"}
                      </span>
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 block truncate">@{listing.seller_username || "creator"}</span>
                  </div>
                </Link>

                <Link
                  to={`/messages?to=${encodeURIComponent(listing.seller_username || "creator")}&listing=${listing.id}&title=${encodeURIComponent(listing.title)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-zinc-300 transition"
                  title="Message seller about this product"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Message</span>
                </Link>
              </div>

              {/* Pricing & Checkout Block */}
              <div className="p-6 rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-[#0C111A] to-[#0A0D15] shadow-xl space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono text-zinc-400 uppercase">Instant Escrow Delivery</span>
                  <span className="text-3xl font-black font-mono text-emerald-400">{priceDisplay}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPurchase(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold transition shadow-md shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isFree ? "Claim Asset (Free)" : "Purchase & Unlock Vault Key"}</span>
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400 font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Automated Escrow
                  </span>
                  <span>•</span>
                  <span>Instant Key Reveal</span>
                </div>
              </div>

              {/* Specifications */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-5 space-y-3 text-xs">
                <h3 className="font-bold text-white uppercase font-mono text-[11px] tracking-wider">Specifications</h3>
                
                {listing.vehicle_models && (
                  <div className="flex justify-between border-b border-white/[0.04] pb-2">
                    <span className="text-zinc-500 font-mono">Compatible Models:</span>
                    <span className="text-zinc-300 font-medium text-right">{listing.vehicle_models}</span>
                  </div>
                )}

                {listing.roblox_asset_id && (
                  <div className="flex justify-between border-b border-white/[0.04] pb-2">
                    <span className="text-zinc-500 font-mono">Roblox Asset ID:</span>
                    <span className="text-emerald-400 font-mono">#{listing.roblox_asset_id}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-zinc-500 font-mono">Delivery Method:</span>
                  <span className="text-zinc-300 font-mono">Vault Key Dispatch</span>
                </div>
              </div>

              {/* Hashtag Chips */}
              {tags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-zinc-500 block">TAGS:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <Link
                        key={t}
                        to={`/marketplace?q=${encodeURIComponent(t.replace("#", ""))}`}
                        className="px-2.5 py-1 rounded-lg border border-white/[0.06] bg-[#0A0D15] hover:border-emerald-500/30 hover:text-emerald-400 text-zinc-400 text-xs font-mono transition"
                      >
                        {t.startsWith("#") ? t : `#${t}`}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Description & Overview */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-white">Product Description & Asset Details</h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {listing.description || "No extended description provided by creator."}
            </p>
          </div>

          {/* ─── CUSTOMER REVIEWS SECTION ─── */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Customer Reviews</h3>
                <p className="text-xs text-zinc-400">Feedback from purchasers who received escrow keys.</p>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-emerald-400" />
                <span>{averageRating ? `${averageRating} ★` : "No reviews yet"}</span>
              </div>
            </div>

            {/* Leave Review Form */}
            <form onSubmit={handlePostReview} className="p-4 rounded-xl border border-white/[0.06] bg-[#07090E] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Write a Review</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-0.5"
                    >
                      <Star
                        className={cn(
                          "w-4 h-4",
                          star <= reviewRating ? "text-emerald-400 fill-emerald-400" : "text-zinc-600"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={2}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your feedback on textures, installation, and quality..."
                className="w-full rounded-xl border border-white/[0.08] bg-[#0A0D15] p-3 text-xs text-white outline-none focus:border-emerald-500/50 resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingReview || !reviewText.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition disabled:opacity-50"
                >
                  {submittingReview ? "Submitting…" : "Post Review"}
                </button>
              </div>
            </form>

            {/* Reviews stream */}
            {reviews.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">
                No customer reviews recorded yet for this asset.
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((r, idx) => (
                  <div key={r.id || idx} className="p-4 rounded-xl border border-white/[0.04] bg-[#07090E] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{r.reviewer_name || "Verified Purchaser"}</span>
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
                    <p className="text-zinc-300 leading-relaxed">{r.comment}</p>
                    {r.seller_reply && (
                      <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                        <span className="font-bold text-emerald-400 text-[11px] block">Creator Reply:</span>
                        <p className="text-zinc-300">{r.seller_reply.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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