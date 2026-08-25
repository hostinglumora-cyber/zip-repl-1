const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Upload, X, ShieldCheck, Package, Code2, Gift, Boxes, Plus, Sparkles, Image as ImageIcon } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import SiteNav from "@/components/SiteNav";
import { DEPARTMENTS, ERLC_TAG, CATEGORIES, LISTING_TYPES } from "@/lib/departments";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "type", label: "Type" },
  { id: "details", label: "Details" },
  { id: "media", label: "Media" },
  { id: "codes", label: "Codes" },
  { id: "submit", label: "Submit" },
];

const TYPE_ICONS = { Single: Package, Bundle: Boxes, Free: Gift, Code: Code2 };
const ALL_TAGS = [...DEPARTMENTS.map((d) => ({ id: d.id, name: d.short, logo: d.logo, color: d.color })), ERLC_TAG];

export default function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    listing_type: "Single",
    category: "Liveries",
    departments: ["police"],
    title: "",
    headline: "",
    description: "",
    price_type: "Robux",
    price: 150,
    images: [],
    codes: [],
    bundle_items: [],
    agreed: false,
  });
  const [saving, setSaving] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [bundleInput, setBundleInput] = useState("");

  const update = (patch) => setForm((current) => ({ ...current, ...patch }));

  const toggleDept = (id) => {
    update({
      departments: form.departments.includes(id)
        ? form.departments.filter((d) => d !== id)
        : [...form.departments, id],
    });
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      update({ images: [...form.images, imageUrlInput.trim()] });
      setImageUrlInput("");
    }
  };

  const addCode = () => {
    if (codeInput.trim()) {
      update({ codes: [...form.codes, codeInput.trim()] });
      setCodeInput("");
    }
  };

  const addBundleItem = () => {
    if (bundleInput.trim()) {
      update({ bundle_items: [...form.bundle_items, bundleInput.trim()] });
      setBundleInput("");
    }
  };

  const canNext = () => {
    if (step === 0) return form.listing_type && form.category;
    if (step === 1) return form.title.trim() && form.departments.length > 0;
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return form.agreed;
    return true;
  };

  const submit = async () => {
    setSaving(true);
    try {
      const activeUser = user || {
        id: "creator_demo",
        display_name: "LibertyX Creator",
        email: "creator@libertyx.com",
      };

      const pt = form.listing_type === "Free" ? "Free" : form.price_type;
      const record = await db.entities.Listing.create({
        title: form.title.trim() || "Untitled ER:LC Asset",
        headline: form.headline.trim() || "Custom Emergency Response asset",
        description: form.description.trim() || "High quality ER:LC asset published on LibertyX Marketplace.",
        listing_type: form.listing_type,
        category: form.category || "Liveries",
        departments: form.departments.length ? form.departments : ["police"],
        images: form.images.length ? form.images : ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"],
        codes: form.codes.length ? form.codes : ["rbxassetid://18294029104"],
        bundle_items: form.bundle_items,
        price_type: pt,
        price: pt === "Free" ? 0 : Number(form.price) || 100,
        currency: "ROBUX",
        status: "active",
        seller_id: activeUser.id,
        seller_name: activeUser.display_name || activeUser.full_name || "LibertyX Creator",
        created_date: new Date().toISOString(),
      });

      if (!record?.id) throw new Error("The listing could not be saved.");
      navigate(`/listing/${record.id}`);
    } catch (e) {
      alert(e.message || "Could not create listing. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D14] text-foreground selection:bg-emerald-500/20 selection:text-emerald-300">
      <SiteNav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Top Header */}
        <div className="mb-8">
          <Link to="/marketplace" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Marketplace
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Publish an ER:LC Asset</h1>
          <p className="text-xs text-muted-foreground mt-1">Upload your liveries, uniform sets, ELS profiles, or server map templates.</p>
        </div>

        {/* Stepper Bar */}
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full grid place-items-center text-xs font-bold transition",
                    i < step
                      ? "bg-emerald-500 text-black"
                      : i === step
                      ? "bg-emerald-500/20 border border-emerald-500 text-emerald-400"
                      : "bg-secondary text-muted-foreground/50 border border-white/5"
                  )}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={cn("text-[10px] font-medium hidden sm:block", i <= step ? "text-foreground" : "text-muted-foreground/40")}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-px mx-2", i < step ? "bg-emerald-500" : "bg-white/10")} />
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-card/50 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
          {/* Step 0: Type + Category */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Select Listing Format</h2>
                <p className="text-xs text-muted-foreground">What type of product are you releasing?</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {LISTING_TYPES.map((t) => {
                  const Icon = TYPE_ICONS[t.id] || Package;
                  const isSelected = form.listing_type === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => update({ listing_type: t.id, price_type: t.id === "Free" ? "Free" : form.price_type })}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-xl border text-left transition-all",
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 text-foreground shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                          : "border-white/5 bg-secondary/40 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                      )}
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{t.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">Asset Category</label>
                <select
                  value={form.category}
                  onChange={(e) => update({ category: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-secondary/60 px-4 py-2.5 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id} className="bg-zinc-900 text-foreground">
                      {c.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 1: Details & Pricing */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Asset Details & Tags</h2>
                <p className="text-xs text-muted-foreground">Describe your asset and set your price.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Asset Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="e.g. 2024 State Police Slicktop Livery Pack"
                  className="w-full rounded-xl border border-white/10 bg-secondary/40 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Catchy Headline</label>
                <input
                  value={form.headline}
                  onChange={(e) => update({ headline: e.target.value })}
                  placeholder="e.g. 4K realistic decals with daylight optimized reflections"
                  className="w-full rounded-xl border border-white/10 bg-secondary/40 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Department Tags *</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map((tag) => {
                    const isSelected = form.departments.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleDept(tag.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold transition border",
                          isSelected
                            ? "bg-emerald-500/15 border-emerald-500 text-emerald-300"
                            : "bg-secondary/40 border-white/5 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Price Model</label>
                  <select
                    value={form.price_type}
                    disabled={form.listing_type === "Free"}
                    onChange={(e) => update({ price_type: e.target.value, price: e.target.value === "Free" ? 0 : form.price })}
                    className="w-full rounded-xl border border-white/10 bg-secondary/40 px-3 py-2.5 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Robux" className="bg-zinc-900">Robux (R$)</option>
                    <option value="Free" className="bg-zinc-900">Free Giveaway</option>
                  </select>
                </div>
                {form.price_type !== "Free" && form.listing_type !== "Free" && (
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Price in Robux (R$)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => update({ price: Number(e.target.value) })}
                      min="1"
                      className="w-full rounded-xl border border-white/10 bg-secondary/40 px-3 py-2.5 text-xs text-foreground focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Media & Previews */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Showcase Media</h2>
                <p className="text-xs text-muted-foreground">Add high-resolution screenshots or vehicle previews.</p>
              </div>

              <div className="flex gap-2">
                <input
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Paste image URL (e.g. Imgur, Discord CDN, Unsplash)..."
                  className="w-full rounded-xl border border-white/10 bg-secondary/40 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 shrink-0"
                >
                  Add Image
                </button>
              </div>

              {form.images.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-2xl p-8 text-center bg-secondary/10">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs font-medium text-foreground">No images added yet</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    We will use a clean placeholder livery screenshot if none are provided.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary/60 border border-white/10 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => update({ images: form.images.filter((_, idx) => idx !== i) })}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-red-500 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Codes & Deliverables */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Deliverables Vault</h2>
                <p className="text-xs text-muted-foreground">Add private Roblox asset IDs, pastebin links, or Google Drive templates.</p>
              </div>

              <div className="flex gap-2">
                <input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="e.g. rbxassetid://18294029104 or Google Drive Link"
                  className="w-full rounded-xl border border-white/10 bg-secondary/40 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCode}
                  className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 shrink-0"
                >
                  Add Code
                </button>
              </div>

              <div className="space-y-2">
                {form.codes.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-secondary/30 text-xs font-mono text-emerald-300">
                    <span className="truncate">{c}</span>
                    <button
                      type="button"
                      onClick={() => update({ codes: form.codes.filter((_, idx) => idx !== i) })}
                      className="text-muted-foreground hover:text-red-400 p-1"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  These codes are securely encrypted in our escrow vault and will only be released to buyers after checkout.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Review & Agree */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Final Review</h2>
                <p className="text-xs text-muted-foreground">Review your listing details before publishing.</p>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-secondary/30 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Title:</span> <span className="font-bold text-foreground">{form.title || "Untitled"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Category:</span> <span className="text-foreground">{form.category}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Price:</span> <span className="font-bold text-emerald-400">{form.price_type === "Free" ? "Free" : `${form.price} R$`}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Deliverables:</span> <span className="text-foreground">{form.codes.length || 1} token(s) attached</span></div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.agreed}
                  onChange={(e) => update({ agreed: e.target.checked })}
                  className="mt-0.5 rounded border-white/10 bg-secondary text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I confirm that I own this asset, that it contains no stolen decals, and that deliverable tokens are accurate and active.
                </span>
              </label>
            </div>
          )}

          {/* Footer Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-xl border border-white/10 bg-secondary/40 px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                disabled={!canNext()}
                onClick={() => setStep((s) => s + 1)}
                className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition disabled:opacity-50"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                disabled={!canNext() || saving}
                onClick={submit}
                className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/25 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Publish Asset Now</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
