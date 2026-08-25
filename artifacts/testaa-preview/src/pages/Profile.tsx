import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Store, UserPlus, UserCheck, MessageCircle, BadgeCheck, Search, Star } from "lucide-react";
import PageShell from "@/components/PageShell";
import ListingCard from "@/components/ListingCard";
import EmptyState from "@/components/EmptyState";
import { localDb } from "@/lib/localDb";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

export default function Profile() {
  const { username, id } = useParams<{ username?: string; id?: string }>();
  const lookupUsername = username || id || "me";
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "reviews" | "about">("products");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

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

        const listingQuery = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
        const allListings: any[] = await listingQuery({ status: "active" }, "-created_date", 100);
        
        const creatorListings = allListings.filter((l) => {
          const matchUser = l.seller_username && l.seller_username.toLowerCase() === prof.username.toLowerCase();
          const matchId = l.seller_id && l.seller_id === prof.user_id;
          return matchUser || matchId;
        });
        setListings(creatorListings);

        const fCount = localDb.getFollowersCount(prof.username);
        setFollowersCount(fCount);

        if (user?.id) {
          const following = await localDb.isFollowing(user.id, prof.username);
          setIsFollowing(following);
        }
      } catch (err) {
        console.error("Error loading creator profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [lookupUsername, user?.id]);

  const handleToggleFollow = async () => {
    if (!user) {
      navigate(`/login?returnTo=/u/${lookupUsername}`);
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

  if (loading) {
    return (
      <PageShell>
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading profile...</p>
        </div>
      </PageShell>
    );
  }

  if (!profile) {
    return (
      <PageShell>
        <EmptyState
          icon={Store}
          title="Creator Not Found"
          description={`The creator @${lookupUsername} does not exist.`}
          action={{
            label: "Explore Marketplace",
            onClick: () => navigate("/marketplace"),
          }}
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Header Banner & Profile */}
      <div className="bg-[#12151E] border-b border-white/[0.08]">
        <div className="h-32 w-full bg-[#1C212E] relative overflow-hidden">
          {profile.banner_url && (
            <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover opacity-50" />
          )}
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-12 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-[#12151E] bg-[#1C212E] shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-50">
                    {(profile.display_name || profile.username || "C").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="space-y-1 mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-50">{profile.display_name}</h1>
                  <BadgeCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase">@{profile.username}</div>
                <p className="text-sm text-slate-400 max-w-md line-clamp-2">{profile.bio}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-1">
              <button
                onClick={handleToggleFollow}
                className={cn(
                  "flex items-center gap-2 font-semibold rounded-lg px-4 py-2 text-sm transition-colors",
                  isFollowing
                    ? "bg-[#1C212E] text-slate-50 border border-white/[0.08]"
                    : "bg-emerald-500 hover:bg-emerald-400 text-black"
                )}
              >
                {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isFollowing ? "Following" : "Follow"}
              </button>
              <Link
                to={`/messages?to=${profile.username}`}
                className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] rounded-lg px-4 py-2 text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-6 pb-6 text-sm">
            <div><span className="font-bold text-slate-50">{listings.length}</span> <span className="text-slate-500 uppercase text-xs font-medium ml-1">Products</span></div>
            <div><span className="font-bold text-slate-50">{followersCount}</span> <span className="text-slate-500 uppercase text-xs font-medium ml-1">Followers</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex items-center gap-4 border-b border-white/[0.08] pb-4">
          {(["products", "reviews", "about"] as const).map((tab) => (
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

        {activeTab === "products" && (
          listings.length === 0 ? (
            <EmptyState
              icon={Store}
              title="No Products"
              description="This creator has not listed any products yet."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {listings.map(l => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )
        )}

        {activeTab === "reviews" && (
          <EmptyState
            icon={Star}
            title="No Reviews"
            description="Reviews are not available for this creator yet."
          />
        )}

        {activeTab === "about" && (
          <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-5 space-y-4 max-w-2xl">
            <h3 className="text-sm font-semibold text-slate-50">About Creator</h3>
            <p className="text-sm text-slate-400 whitespace-pre-wrap">{profile.bio || "No bio provided."}</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}