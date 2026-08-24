const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Store, Star, BadgeCheck, Calendar } from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { ListingCard, Footer } from "@/pages/Home";
import { Image } from "@/components/ui/image";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        let sellerId = id;
        let myListings = [];
        if (id === "me") {
          const me = await db.auth.me();
          if (!active) return;
          setProfile(me);
          sellerId = me.id;
          myListings = await db.entities.Listing.filter({ seller_id: me.id, status: "active" }, "-created_date", 50);
        } else {
          const u = await db.entities.User.get(id);
          if (!active) return;
          setProfile(u);
          myListings = await db.entities.Listing.filter({ seller_id: id, status: "active" }, "-created_date", 50);
        }
        if (!active) return;
        setListings(myListings);
        const revs = await db.entities.Review.filter({}, "-created_date", 100).catch(() => []);
        if (!active) return;
        const ids = new Set(myListings.map((l) => l.id));
        setReviews(revs.filter((r) => ids.has(r.listing_id)));
      } catch (e) {
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="min-h-screen bg-background grid place-items-center"><div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" /></div>;
  if (!profile) return (
    <div className="min-h-screen bg-background text-foreground grid place-items-center">
      <div className="text-center"><p className="text-muted-foreground mb-4">User not found.</p><Link to="/marketplace" className="text-primary">Back</Link></div>
    </div>
  );

  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null;
  const initials = (profile.display_name || profile.full_name || profile.email || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="relative h-40 lg:h-56 bg-gradient-to-br from-primary/10 via-background to-background border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(160_70%_42%/0.1),transparent_60%)]" />
      </div>

      <div className="max-w-5xl mx-auto px-5 lg:px-8 -mt-14 relative">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
          <div className="w-24 h-24 rounded-2xl bg-primary/15 border-4 border-background grid place-items-center text-3xl font-bold text-primary shrink-0">
            {profile.avatar_url ? <Image src={profile.avatar_url} fittingType="fill" className="w-full h-full rounded-xl" /> : initials}
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{profile.display_name || profile.full_name || "Member"}</h1>
              {profile.role === "admin" && <BadgeCheck className="w-5 h-5 text-primary" />}
            </div>
            {profile.discord_username && <p className="text-sm text-muted-foreground">@{profile.discord_username}</p>}
            <p className="text-xs text-muted-foreground/60 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" /> Joined {new Date(profile.created_date).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-6 sm:pb-1">
            <Stat label="Listings" value={listings.length} />
            <Stat label="Rating" value={avgRating || "â"} />
          </div>
        </div>

        {profile.bio && <p className="text-muted-foreground mt-6 max-w-2xl leading-relaxed">{profile.bio}</p>}

        <div className="mt-10 mb-16">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Store className="w-5 h-5 text-primary" /> Listings</h2>
          {listings.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-16 text-center">
              <Store className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No active listings yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>

        {reviews.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> Reviews</h2>
            <div className="space-y-3">
              {reviews.slice(0, 8).map((r) => (
                <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <Link to={`/u/${r.reviewer_id}`} className="text-sm font-medium hover:text-primary">{r.reviewer_name || "Member"}</Link>
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}`} />)}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center sm:text-left">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}