const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { X, ShieldCheck, Check, Loader2, Copy, Package } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PurchaseModal({ listing, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ roblox_username: "" });
  const [purchase, setPurchase] = useState(null);
  const [copied, setCopied] = useState(null);

  if (!user) {
    return (
      <Shell onClose={onClose}>
        <div className="text-center py-6">
          <h3 className="text-xl font-bold mb-2">Sign in to continue</h3>
          <p className="text-muted-foreground text-sm mb-6">You need an account to {listing.price_type === "Free" ? "claim" : "purchase"} this asset.</p>
          <button onClick={() => navigate("/login")} className="bg-primary hover:opacity-90 text-primary-foreground font-semibold px-5 py-2.5 rounded-lg text-sm">Go to sign in</button>
        </div>
      </Shell>
    );
  }

  const isFree = listing.price_type === "Free";
  const priceLabel = isFree ? "Free" : `${listing.price} R$`;

  const handlePurchase = async () => {
    if (!isFree && !form.roblox_username.trim()) return;
    setStep("processing");
    try {
      const rec = await db.entities.Purchase.create({
        listing_id: listing.id,
        listing_title: listing.title,
        buyer_id: user.id,
        buyer_name: user.display_name || user.full_name || user.email,
        seller_id: listing.seller_id,
        price: listing.price || 0,
        price_type: listing.price_type,
        status: isFree ? "completed" : "pending",
        roblox_username: form.roblox_username,
      });
      setPurchase(rec);
      setTimeout(() => setStep("success"), 700);
    } catch (e) {
      setStep("form");
      alert("Something went wrong. Please try again.");
    }
  };

  const copy = (code, i) => {
    navigator.clipboard?.writeText(code);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Shell onClose={onClose}>
      {step === "form" && (
        <>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold">{isFree ? "Claim this asset" : "Checkout"}</h3>
              <p className="text-muted-foreground text-sm mt-0.5">{listing.title}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{priceLabel}</div>
              <div className="text-xs text-muted-foreground">{listing.price_type}</div>
            </div>
          </div>

          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3.5 flex gap-2.5 mb-5">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isFree
                ? "This is a free asset. Codes will be revealed instantly."
                : "Scam-protected: your Robux payment is held until the seller delivers. The seller only gets paid after you confirm delivery."}
            </p>
          </div>

          {isFree ? (
            <p className="text-sm text-muted-foreground mb-6">Click below to reveal the codes included with this listing.</p>
          ) : (
            <Field label="Roblox username" placeholder="Your Roblox username" value={form.roblox_username} onChange={(v) => setForm({ ...form, roblox_username: v })} />
          )}

          <button
            onClick={handlePurchase}
            disabled={!isFree && !form.roblox_username.trim()}
            className="w-full mt-6 bg-primary hover:opacity-90 disabled:opacity-40 text-primary-foreground font-semibold py-3 rounded-xl transition inline-flex items-center justify-center gap-2"
          >
            {isFree ? "Reveal codes" : `Pay ${priceLabel} securely`}
          </button>
        </>
      )}

      {step === "processing" && (
        <div className="py-12 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Processing your orderâ¦</p>
        </div>
      )}

      {step === "success" && (
        <>
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-primary/15 grid place-items-center mb-4">
              <Check className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{isFree ? "Codes revealed!" : "Order placed!"}</h3>
            <p className="text-muted-foreground text-sm mt-1">
              {isFree ? "Copy your codes below." : "The seller will deliver your codes shortly. We'll notify you."}
            </p>
          </div>

          {isFree && listing.codes?.length > 0 && (
            <div className="space-y-2 mb-6">
              {listing.codes.map((c, i) => (
                <div key={i} className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-2.5">
                  <code className="flex-1 text-sm text-primary font-mono truncate">{c}</code>
                  <button onClick={() => copy(c, i)} className="text-muted-foreground hover:text-foreground p-1">
                    {copied === i ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {isFree && listing.codes?.length === 0 && (
            <div className="rounded-xl bg-secondary border border-border p-4 mb-6 text-sm text-muted-foreground flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" /> No codes attached â contact the seller for delivery.
            </div>
          )}

          {!isFree && (
            <div className="rounded-xl bg-secondary border border-border p-4 mb-6 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 mb-1"><Package className="w-4 h-4 text-primary" /> Order #{purchase?.id?.slice(-6).toUpperCase()}</p>
              <p>Track your order in your dashboard under Activity.</p>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 bg-secondary hover:bg-secondary/70 border border-border text-foreground font-medium py-2.5 rounded-lg text-sm">Close</button>
            <button onClick={() => navigate("/dashboard")} className="flex-1 bg-primary hover:opacity-90 text-primary-foreground font-semibold py-2.5 rounded-lg text-sm">Go to dashboard</button>
          </div>
        </>
      )}
    </Shell>
  );
}

function Shell({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        {children}
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-muted-foreground mb-1.5">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary/50" />
    </div>
  );
}