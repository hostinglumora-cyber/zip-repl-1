import React, { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/ListingCard";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";
import { Heart } from "lucide-react";

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const list = localDb.getFavorites(user.id);
    const db = (globalThis as any).__B44_DB__ || localDb;
    const listingQuery = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
    listingQuery({ status: "active" }, "-created_date", 100).then((allListings: any[]) => {
       const resolved = list.map(f => allListings.find(l => l.id === f.listing_id)).filter(Boolean);
       setFavorites(resolved);
       setLoading(false);
    });
  }, [user]);

  if (!user) {
    return (
      <PageShell>
        <EmptyState
          icon={Heart}
          title="Sign in to view favorites"
          description="Save your favorite ER:LC vehicle liveries, uniform packages, and ELS profiles."
          actionLabel="Sign in with Discord"
          actionHref="/login?returnTo=/favorites"
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Favorites"
        description="Your saved ER:LC livery packs, uniform designs, and server assets."
      />
      
      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500 animate-pulse">
          Loading wishlist…
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Your saved items will appear here."
          actionLabel="Browse Marketplace"
          actionHref="/marketplace"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
