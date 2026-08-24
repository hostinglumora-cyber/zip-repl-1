const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useRef, useState } from "react";
import { Bell, Star, ShoppingBag, CheckCircle2, X } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";

export default function NotificationsBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    (async () => {
      try {
        const [reviews, purchases] = await Promise.all([
          db.entities.Review.filter({}, "-created_date", 20).catch(() => []),
          db.entities.Purchase.filter({ seller_id: user.id }, "-created_date", 20).catch(() => []),
        ]);
        const myListings = await db.entities.Listing.filter({ seller_id: user.id }, "-created_date", 100).catch(() => []);
        const ids = new Set(myListings.map((l) => l.id));
        const reviewNotifs = reviews
          .filter((r) => ids.has(r.listing_id))
          .map((r) => ({ id: r.id, type: "review", title: `${r.reviewer_name || "Someone"} reviewed your listing`, sub: r.comment?.slice(0, 60) || "", icon: Star, time: r.created_date }));
        const purchaseNotifs = purchases.map((p) => ({
          id: p.id, type: "purchase",
          title: `${p.buyer_name || "Someone"} ${p.price_type === "Free" ? "claimed" : "purchased"} "${p.listing_title || "your listing"}"`,
          sub: p.price_type === "Free" ? "Free claim" : `${p.price} R$ Â· ${p.status}`,
          icon: ShoppingBag, time: p.created_date,
        }));
        const all = [...reviewNotifs, ...purchaseNotifs].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 12);
        setItems(all);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, user]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition">
        <Bell className="w-5 h-5" />
        {items.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="font-semibold text-sm text-foreground">Notifications</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-muted-foreground text-sm">Loadingâ¦</div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">You're all caught up.</p>
                <p className="text-muted-foreground/50 text-xs mt-1">New reviews and orders will appear here.</p>
              </div>
            ) : (
              items.map((n) => {
                const Icon = n.icon;
                return (
                  <Link key={n.id} to="/dashboard" onClick={() => setOpen(false)} className="flex gap-3 px-4 py-3 hover:bg-secondary border-b border-border last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 grid place-items-center shrink-0"><Icon className="w-4 h-4 text-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{n.title}</p>
                      {n.sub && <p className="text-xs text-muted-foreground truncate">{n.sub}</p>}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
          <Link to="/dashboard" onClick={() => setOpen(false)} className="block text-center text-xs text-primary hover:opacity-70 py-2.5 border-t border-border">View all activity</Link>
        </div>
      )}
    </div>
  );
}