import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import CreatorCard from "@/components/CreatorCard";
import EmptyState from "@/components/EmptyState";
import { localDb } from "@/lib/localDb";
import { useAuth } from "@/lib/AuthContext";

export default function CreatorsDirectory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [followedMap, setFollowedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        const list = await localDb.getDeduplicatedCreators();
        setCreators(list || []);

        if (user?.id) {
          const map: Record<string, boolean> = {};
          for (const c of list) {
            const isF = await localDb.isFollowing(user.id, c.username);
            map[c.username] = isF;
          }
          setFollowedMap(map);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.id]);

  const handleToggleFollow = async (creator: any) => {
    if (!user?.id) {
      navigate("/login?returnTo=/creators");
      return;
    }
    const res = await localDb.toggleFollow(user.id, creator);
    setFollowedMap((prev) => ({ ...prev, [creator.username]: res.following }));
  };

  const filtered = creators.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.username?.toLowerCase().includes(q) ||
      c.display_name?.toLowerCase().includes(q) ||
      c.bio?.toLowerCase().includes(q)
    );
  });

  return (
    <PageShell>
      <PageHeader 
        title="Creators" 
        description="Discover ER:LC creators"
        action={
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators..."
              className="w-full bg-[#1C212E] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/30 transition-colors"
            />
          </div>
        }
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="py-20 text-center text-sm text-slate-500 animate-pulse">
            Loading creators...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No creators found"
            description="No creators match your search."
            action={{
              label: "Clear search",
              onClick: () => setSearchQuery(""),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <CreatorCard
                key={c.username}
                creator={c}
                isFollowing={followedMap[c.username] || false}
                onToggleFollow={() => handleToggleFollow(c)}
              />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
