import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, UserPlus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";

interface CreatorCardProps {
  creator: any;
  onFollowChange?: (username: string, following: boolean) => void;
}

export default function CreatorCard({ creator, onFollowChange }: CreatorCardProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user?.id && creator?.username) {
      localDb.isFollowing(user.id, creator.username).then(setIsFollowing).catch(() => {});
    }
  }, [user?.id, creator?.username]);

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || loading) return;
    setLoading(true);
    try {
      const res = await localDb.toggleFollow(user.id, creator);
      setIsFollowing(res.following);
      onFollowChange?.(creator.username, res.following);
    } catch {} finally {
      setLoading(false);
    }
  };

  const initial = (creator.display_name || creator.username || "C").charAt(0).toUpperCase();

  return (
    <Link
      to={`/u/${creator.username}`}
      className="group block rounded-xl border border-white/[0.08] hover:border-white/[0.18] bg-[#12151E] p-4 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Avatar + info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/[0.08] bg-[#1C212E] shrink-0 flex items-center justify-center">
            {creator.avatar_url ? (
              <img src={creator.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-slate-400">{initial}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-slate-100 truncate">{creator.display_name}</span>
              {creator.roblox_verified && <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </div>
            <span className="text-xs text-slate-500 block truncate">@{creator.username}</span>
          </div>
        </div>

        {/* Follow */}
        {user && user.username !== creator.username && (
          <button
            type="button"
            onClick={handleFollow}
            disabled={loading}
            className={cn(
              "shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition active:scale-[0.98]",
              isFollowing
                ? "bg-white/[0.06] text-emerald-400 border border-emerald-500/20"
                : "bg-white/[0.06] text-slate-300 border border-white/[0.08] hover:bg-white/[0.1]"
            )}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.06] text-xs text-slate-500">
        <span>{creator.products_count || 0} products</span>
        <span>{creator.rating ? `${creator.rating} ★` : "No reviews"}</span>
        <span>{creator.sales_count || 0} sales</span>
      </div>
    </Link>
  );
}
