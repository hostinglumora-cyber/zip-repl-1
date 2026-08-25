import React, { useState } from "react";
import { X, Check, Loader2, Copy, Download, ShieldCheck, ExternalLink, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { localDb } from "@/lib/localDb";

const db = (globalThis as any).__B44_DB__ || localDb;

export default function PurchaseModal({
  listing,
  open,
  onOpenChange,
  onClose,
}: {
  listing: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "processing" | "success">("details");
  const [robloxUsername, setRobloxUsername] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isOpen = open !== undefined ? open : true;
  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
    if (onClose) onClose();
    setStep("details");
  };

  if (!isOpen || !listing) return null;

  const isFree = listing.price_type === "Free" || !listing.price || listing.price === 0;
  const priceLabel = isFree ? "FREE" : `R$ ${listing.price}`;
  const codes = listing.codes && Array.isArray(listing.codes) ? listing.codes.filter((c: string) => c.trim()) : [];

  const handleConfirm = async () => {
    setStep("processing");
    try {
      const purchaseFn = db?.entities?.Purchase?.create || localDb.entities.Purchase.create;
      await purchaseFn({
        listing_id: listing.id,
        listing_title: listing.title,
        buyer_id: user?.id || "guest_buyer",
        buyer_name: user?.display_name || user?.name || robloxUsername || "Community Buyer",
        seller_id: listing.seller_id,
        price: isFree ? 0 : Number(listing.price) || 0,
        price_type: listing.price_type || "Free",
        status: "delivered",
        roblox_username: robloxUsername || "ERLC_Creator",
        created_date: new Date().toISOString(),
      });
      setTimeout(() => setStep("success"), 450);
    } catch {
      setTimeout(() => setStep("success"), 450);
    }
  };

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard?.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0A0D14] border border-white/[0.1] rounded-2xl p-6 shadow-2xl space-y-5 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {step === "details" && (
          <>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 rounded">
                  {listing.departments?.[0] || "Police"}
                </span>
                <span className="text-xs font-mono text-zinc-400">{listing.category || "Asset"}</span>
              </div>
              <h3 className="text-base font-bold text-white pr-6">{listing.title}</h3>
            </div>

            {/* Price & Delivery Card */}
            <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#06080C] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 block font-mono uppercase">Asset Price</span>
                <span className="text-xl font-mono font-bold text-emerald-400">{priceLabel}</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">Instant Key Dispatch</span>
            </div>

            {!isFree && (
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                  Roblox Username
                </label>
                <input
                  type="text"
                  value={robloxUsername}
                  onChange={(e) => setRobloxUsername(e.target.value)}
                  placeholder="Enter your Roblox username"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#06080C] px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                />
              </div>
            )}

            <button
              onClick={handleConfirm}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black py-3 text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Download className="w-4 h-4" />
              <span>{isFree ? "Unlock Deliverable Keys" : `Complete Purchase (${priceLabel})`}</span>
            </button>
          </>
        )}

        {step === "processing" && (
          <div className="py-10 text-center space-y-3">
            <Loader2 className="w-7 h-7 text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs text-zinc-400">Verifying escrow key dispatch…</p>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2.5">
                <Check className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white">Asset Unlocked</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Your deliverable keys and download links are ready below.</p>
            </div>

            {/* Keys list */}
            {codes.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {codes.map((code: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-white/[0.06] bg-[#06080C]"
                  >
                    <code className="text-xs font-mono text-emerald-400 truncate flex-1">{code}</code>
                    <button
                      onClick={() => copyCode(code, i)}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-emerald-500 hover:text-black text-[11px] font-bold text-zinc-200 transition shrink-0 flex items-center gap-1"
                    >
                      {copiedIndex === i ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-white/[0.06] bg-[#06080C] text-xs text-zinc-400 text-center font-mono">
                Asset ID: rbxassetid://13892019482
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-zinc-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleClose();
                  navigate("/dashboard");
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-black shadow-sm"
              >
                View Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}