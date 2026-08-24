const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, ShieldCheck, Store, MessageSquare, Send, BadgeCheck, Package, Heart } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import SiteNav from "@/components/SiteNav";
import { Footer, ListingCard } from "@/pages/Home";
import { getDepartment, DEPARTMENTS } from "@/lib/departments";
import { Image } from "@/components/ui/image";
import PurchaseModal from "@/components/PurchaseModal";

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [posting, setPosting] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);

  useEffect(() => {
    db.entities.Listing.get(id).then(setListing).catch(() => setListing(null)).finally(() => setLoading(false));
    db.entities.Review.filter({ listing_id: id }, "-created_date", 50).then(setReviews).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!listing) return;
    db.entities.Listing.filter({ status: "active", category: listing.category }, "-created_date", 6)
      .then((rows) => setRelated(rows.filter((r) => r.id !== id).slice(0, 3)))
      .catch(() => {});
  }, [listing, id]);

  const isOwner = user && listing && user.id === listing.seller_id;

  const submitReview = async () => {
    if (!user) return navigate("/login");
    if (!reviewForm.comment.trim()) return;
    setPosting(true);
    try {
      const r = await db.entities.Review.create({
        listing_id: id,
        reviewer_id: user.id,
        reviewer_name: user.display_name || user.full_name || user.email,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });
      setReviews([r, ...reviews]);
      setReviewForm({ rating: 5, comment: "" });
    } catch (e) {
      alert("Could not post review.");
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background grid place-items-center"><div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" /></div>;
  if (!listing) return (
    <div className="min-h-screen bg-background text-foreground grid place-items-center">
      <div className="text-center"><p className="text-muted-foreground mb-4">Listing not found.</p><Link to="/marketplace" className="text-primary">Back to marketplace</Link></div>
    </div>
  );

  const isFree = listing.price_type === "Free";
  const priceLabel = isFree ? "Free" : `${listing.price} R$`;
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-8">
        <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Marketplace
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Left: gallery + info */}
          <div>
            <div className="aspect-video rounded-xl overflow-hidden bg-secondary border border-border mb-3">
              {listing.images?.[activeImg] ? (
                <Image src={listing.images[activeImg]} fittingType="fill" className="w-full h-full" />
              ) : (
                <div className="w-full h-full grid place-items-center text-muted-foreground/30"><Store className="w-12 h-12" /></div>
              )}
            </div>
            {listing.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {listing.images.map((url, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition ${i === activeImg ? "border-primary" : "border-transparent"}`}>
                    <Image src={url} fittingType="fill" className="w-full h-full" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-secondary border border-border text-xs text-foreground">{listing.category}</span>
                {listing.listing_type && <span className="px-2.5 py-1 rounded-md bg-secondary border border-border text-xs text-muted-foreground">{listing.listing_type}</span>}
                {listing.departments?.map((d) => {
                  const dep = getDepartment(d) || { name: d };
                  return <span key={d} className="px-2.5 py-1 rounded-md bg-secondary border border-border text-xs text-muted-foreground">{dep.name}</span>;
                })}
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{listing.title}</h1>
              {listing.headline && <p className="text-lg text-muted-foreground mb-3">{listing.headline}</p>}
              <Link to={`/u/${listing.seller_id}`} className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1.5">
                by {listing.seller_name || "Anonymous"}
                {listing.featured && <BadgeCheck className="w-4 h-4 text-primary" />}
              </Link>
              {listing.description && <p className="text-muted-foreground leading-relaxed mt-5 whitespace-pre-wrap">{listing.description}</p>}

              {/* Bundle items */}
              {listing.bundle_items?.length > 0 && (
                <div className="mt-6 rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold flex items-center gap-2 mb-3"><Package className="w-4 h-4 text-primary" /> Included in bundle</h3>
                  <ul className="space-y-2">
                    {listing.bundle_items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" /> Reviews {reviews.length > 0 && <span className="text-sm text-muted-foreground">({reviews.length})</span>}</h2>
                {avgRating && <span className="flex items-center gap-1 text-sm"><Star className="w-4 h-4 fill-primary text-primary" /> {avgRating}</span>}
              </div>

              {user && !isOwner && (
                <div className="rounded-xl border border-border bg-card p-4 mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                        <Star className={`w-6 h-6 ${n <= reviewForm.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={2} placeholder="Leave a reviewâ¦" className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 resize-none" />
                  <button onClick={submitReview} disabled={posting || !reviewForm.comment.trim()} className="mt-2 inline-flex items-center gap-1.5 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg">
                    <Send className="w-3.5 h-3.5" /> {posting ? "Postingâ¦" : "Post review"}
                  </button>
                </div>
              )}

              {reviews.length === 0 ? (
                <p className="text-muted-foreground/50 text-sm py-6 text-center">No reviews yet.</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Link to={`/u/${r.reviewer_id}`} className="text-sm font-medium hover:text-primary">{r.reviewer_name || "Member"}</Link>
                        <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}`} />)}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-10 pt-8 border-t border-border">
                <h2 className="text-xl font-bold mb-5">Related listings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {related.map((l) => <ListingCard key={l.id} listing={l} />)}
                </div>
              </div>
            )}
          </div>

          {/* Right: purchase panel */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-3xl font-bold">{priceLabel}</span>
                <span className="text-sm text-muted-foreground">{listing.price_type}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary mb-5">
                <ShieldCheck className="w-4 h-4" /> Scam-protected purchase
              </div>
              {isOwner ? (
                <Link to="/dashboard" className="block text-center bg-secondary hover:bg-secondary/70 border border-border text-foreground font-medium py-3 rounded-xl">Manage listing</Link>
              ) : (
                <button onClick={() => setShowPurchase(true)} className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold py-3 rounded-xl transition mb-3">
                  {isFree ? "Get for free" : `Buy with ${listing.price_type}`}
                </button>
              )}
              <div className="space-y-2.5 text-sm text-muted-foreground mt-5 pt-5 border-t border-border">
                <Row label="Category" value={listing.category} />
                <Row label="Type" value={listing.listing_type || "Single"} />
                <Row label="Departments" value={listing.departments?.join(", ") || "â"} />
                <Row label="Media" value={`${listing.images?.length || 0} photos`} />
                {listing.codes?.length > 0 && <Row label="Includes" value={`${listing.codes.length} code(s)`} />}
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
      {showPurchase && <PurchaseModal listing={listing} onClose={() => setShowPurchase(false)} />}
    </div>
  );
}

function Row({ label, value }) {
  return <div className="flex justify-between"><span className="text-muted-foreground/60">{label}</span><span className="text-foreground text-right">{value}</span></div>;
}