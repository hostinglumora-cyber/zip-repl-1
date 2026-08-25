import React, { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import CreatorCard from "@/components/CreatorCard";
import ListingCard from "@/components/ListingCard";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";
import { Users } from "lucide-react";

const db = (globalThis as any).__B44_DB__ || localDb;

export default function Following() {
  const { user } = useAuth();
  const [creators, setCreators] = useState<any[]>([]);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const list = localDb.getFollowingList(user.id);
        const profMap: any[] = [];
        let allListingsFromCreators: any[] = [];
        
        const listingQuery = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
        const allListings: any[] = await listingQuery({ status: "active" }, "-created_date", 100);

        for (const item of list) {
          const username = item.creator_username;
          if (!username) continue;
          
          const p = await localDb.getCreatorProfile(username);
          if (p) {
             profMap.push(p);
             const myItems = allListings.filter(
               (l) => l.seller_username?.toLowerCase() === username.toLowerCase() || l.seller_id === p?.user_id
             );
             allListingsFromCreators = [...allListingsFromCreators, ...myItems];
          }
        }
        
        setCreators(profMap);
        setRecentListings(allListingsFromCreators.slice(0, 8)); // Top 8 recent
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.id]);

  if (!user) {
    return (
      <PageShell>
        <EmptyState
          icon={Users}
          title="Sign in to view followed creators"
          description="Follow your favorite ER:LC designers and livery studios to stay updated."
          actionLabel="Sign in with Discord"
          actionHref="/login?returnTo=/following"
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Following"
        description="Stay updated with release drops from your favorite verified creators."
      />

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500 animate-pulse">
          Loading followed creators…
        </div>
      ) : creators.length === 0 ? (
        <EmptyState
          icon={Users}
          title="You aren't following any creators yet"
          description="Discover verified livery designers and uniform studios in the marketplace."
          actionLabel="Browse Creators"
          actionHref="/creators"
        />
      ) : (
        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-50 mb-6">Creators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {creators.map((c) => (
                <CreatorCard key={c.id || c.username} creator={c} />
              ))}
            </div>
          </section>

          {recentListings.length > 0 && (
            <section>
              <h2 className="text-xl font-bold tracking-tight text-slate-50 mb-6">Recent from Following</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recentListings.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </PageShell>
  );
}
