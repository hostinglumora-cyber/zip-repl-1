import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { localDb } from "@/lib/localDb";

interface ListingCardProps {
  listing: any;
  compact?: boolean;
}

export default function ListingCard({ listing, compact }: ListingCardProps) {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    if (user?.id && listing?.id) {
      localDb.isFavorite(user.id, listing.id).then(setIsFav).catch(() => {});
    }
  }, [user?.id, listing?.id]);

  const handleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    const res = await localDb.toggleFavorite(user.id, listing);
    setIsFav(res.favorited);
  };

  const isFree = listing.price_type === "Free" || !listing.price || listing.price === 0;
  const price = isFree ? "Free" : `R$ ${listing.price}`;
  const img = listing.images?.[0];

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group block rounded-xl border border-white/[0.08] hover:border-white/[0.18] bg-[#12151E] overflow-hidden transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] bg-[#0D0F16] overflow-hidden">
        {img && !imgErr ? (
          <img
            src={img}
            alt={listing.title}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-slate-600" />
            </div>
          </div>
        )}

        {/* Category pill */}
        <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider text-slate-300 bg-[#090A0F]/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/[0.08]">
          {listing.category || listing.departments?.[0] || "Asset"}
        </span>

        {/* Fav button */}
        {user && (
          <button
            type="button"
            onClick={handleFav}
            className={cn(
              "absolute top-2 right-2 p-1.5 rounded-lg bg-[#090A0F]/80 backdrop-blur-sm border border-white/[0.08] transition",
              isFav ? "text-rose-400" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Heart className={cn("w-3 h-3", isFav && "fill-rose-400")} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-slate-100 truncate group-hover:text-white transition-colors">
            {listing.title}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-slate-500 truncate">
            {listing.seller_username ? `@${listing.seller_username}` : "Creator"}
          </span>
          <span className={cn(
            "text-xs font-bold font-mono shrink-0",
            isFree ? "text-emerald-400" : "text-slate-200"
          )}>
            {price}
          </span>
        </div>
      </div>
    </Link>
  );
}
