import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Upload,
  AlertCircle,
  X,
  Store,
  DollarSign,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Star,
  ShoppingBag,
  Eye,
  Check,
  Layers,
  FileCode,
} from "lucide-react";
import { localDb } from "@/lib/localDb";
import { DEPARTMENTS, CATEGORIES } from "@/lib/departments";

const STEPS = [
  { id: 0, label: "Asset Format" },
  { id: 1, label: "Details" },
  { id: 2, label: "Screenshots" },
  { id: 3, label: "Pricing" },
  { id: 4, label: "Delivery Keys" },
  { id: 5, label: "Review & Publish" },
];

const FORMAT_TYPES = [
  { id: "Single", label: "Single Vehicle Livery", desc: "Single vehicle skin for Tahoe, Crown Vic, Charger, etc." },
  { id: "Bundle", label: "Fleet Pack / Bundle", desc: "Multi-vehicle department pack with matching liveries." },
  { id: "Uniforms", label: "Uniform & EUP Pack", desc: "Class A/B/C uniforms, tactical vests, and badges." },
  { id: "ELS", label: "ELS & Siren Config", desc: "Lighting pattern profiles and custom siren soundbanks." },
  { id: "Map", label: "Server Map Template", desc: "Custom station layouts, spawn points, and map builds." },
];

export default function CreateListing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef(null);

  const savedUser = (() => {
    try {
      const raw = window.localStorage.getItem("discord_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [form, setForm] = useState({
    title: "",
    description: "",
    listing_type: "Single",
    category: "Liveries",
    departments: ["Police"],
    price_type: "Robux",
    price: "150",
    images: [],
    imageUrlInput: "",
    codes: [""],
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleDept = (d) => {
    set(
      "departments",
      form.departments.includes(d)
        ? form.departments.filter((x) => x !== d)
        : [...form.departments, d]
    );
  };

  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      setErr("Images must be 5 MB or smaller.");
      return;
    }
    const url = URL.createObjectURL(file);
    set("images", [...form.images, url]);
  };

  const handleAddImageUrl = () => {
    if (!form.imageUrlInput.trim()) return;
    set("images", [...form.images, form.imageUrlInput.trim()]);
    set("imageUrlInput", "");
  };

  const canNext = () => {
    if (step === 0) return !!form.listing_type && !!form.category;
    if (step === 1) return form.title.trim().length >= 3 && form.description.trim().length >= 5 && form.departments.length > 0;
    if (step === 2) return true; // Screenshots optional but recommended
    if (step === 3) return form.price_type === "Free" || Number(form.price) >= 0;
    if (step === 4) return form.codes.some((c) => c.trim().length > 0);
    return true;
  };

  const handlePublish = async () => {
    setBusy(true);
    setErr("");
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        listing_type: form.listing_type,
        category: form.category,
        departments: form.departments,
        price_type: form.price_type,
        price: form.price_type === "Free" ? 0 : parseFloat(form.price) || 0,
        images: form.images.length > 0 ? form.images : [],
        codes: form.codes.filter((c) => c.trim()),
        seller_name: savedUser?.name || savedUser?.username || "Verified Creator",
        seller_id: savedUser?.id || "creator_local",
        status: "active",
        created_date: new Date().toISOString(),
      };

      const dbClient = (globalThis).__B44_DB__ || localDb;
      const rec = await dbClient.entities.Listing.create(payload);
      if (!rec?.id) throw new Error("Save failed — no record ID returned.");

      setDone(true);
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (e) {
      setErr(e.message || "Failed to publish listing. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-10 text-center rounded-3xl border border-emerald-500/30 bg-[#0B0F17] shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Asset Published!</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Your asset is live on the marketplace and deliverable keys are vault-locked in Scam-Shield escrow.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Redirecting to Creator Studio…</span>
          </div>
        </div>
      </div>
    );
  }

  const isFree = form.price_type === "Free" || !form.price || form.price === "0";
  const primaryDept = form.departments[0] || "Police";

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col selection:bg-emerald-500/25 selection:text-emerald-300">
      
      {/* ─── FOCUSED STUDIO HEADER (NO CLUTTER) ─── */}
      <header className="h-16 border-b border-white/[0.08] bg-[#07090E]/95 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            to="/marketplace"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit to Marketplace</span>
          </Link>
          <span className="h-4 w-px bg-white/[0.1] hidden sm:block" />
          <span className="text-xs font-mono text-zinc-500 hidden sm:block uppercase tracking-wider">
            Creator Studio // Asset Publisher
          </span>
        </div>

        {/* Step pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-xs text-zinc-400 hidden sm:inline">— {STEPS[step].label}</span>
        </div>
      </header>

      {/* ─── MAIN TWO-COLUMN PUBLISHING WORKSPACE ─── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        
        {/* Step Progress Pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, idx) => {
            const isPast = idx < step;
            const isCurrent = idx === step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (isPast) setStep(idx);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                  isCurrent
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm"
                    : isPast
                    ? "border-emerald-500/20 bg-black/40 text-emerald-300/80 cursor-pointer"
                    : "border-white/[0.06] bg-white/[0.02] text-zinc-500 cursor-not-allowed"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isPast
                      ? "bg-emerald-500 text-black"
                      : isCurrent
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/[0.08] text-zinc-500"
                  }`}
                >
                  {isPast ? "✓" : idx + 1}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Error Alert */}
        {err && (
          <div className="flex items-center gap-3 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs mb-8">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="flex-1">{err}</p>
            <button onClick={() => setErr("")}>
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ─── LEFT COLUMN: STEP FORM (7 cols) ─── */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STEP 0: FORMAT & CATEGORY */}
            {step === 0 && (
              <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Select Asset Format</h2>
                  <p className="text-xs text-zinc-400 mt-1">Choose how your asset will be packaged and delivered.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FORMAT_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => set("listing_type", t.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        form.listing_type === t.id
                          ? "border-emerald-500/50 bg-emerald-500/10 text-white shadow-sm"
                          : "border-white/[0.06] bg-[#07090E] text-zinc-400 hover:border-white/[0.12] hover:text-white"
                      }`}
                    >
                      <p className="text-xs font-bold text-white mb-1">{t.label}</p>
                      <p className="text-[11px] text-zinc-400 leading-snug">{t.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 font-mono">
                    Category *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => {
                      const catId = typeof c === "string" ? c : c.id;
                      return (
                        <button
                          key={catId}
                          type="button"
                          onClick={() => set("category", catId)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            form.category === catId
                              ? "bg-emerald-500 text-black font-bold border-emerald-400 shadow-sm"
                              : "border-white/[0.08] bg-[#07090E] text-zinc-300 hover:text-white"
                          }`}
                        >
                          {catId}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: DETAILS & DEPARTMENTS */}
            {step === 1 && (
              <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Asset Title & Breakdown</h2>
                  <p className="text-xs text-zinc-400 mt-1">Describe what vehicle models or templates are included.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. 2024 State Police Ghost Fleet Pack"
                    className="w-full rounded-2xl border border-white/[0.1] bg-[#07090E] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                    Full Description *
                  </label>
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Detail the included vehicles (Tahoe, Crown Vic, Explorer), livery resolutions (4K), lighting patterns, or installation guide..."
                    className="w-full rounded-2xl border border-white/[0.1] bg-[#07090E] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 font-mono">
                    Compatible Departments * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {DEPARTMENTS.map((d) => {
                      const isSelected = form.departments.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => toggleDept(d.id)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? "border-emerald-500/50 bg-emerald-500/10 text-white shadow-sm"
                              : "border-white/[0.06] bg-[#07090E] text-zinc-400 hover:border-white/[0.12] hover:text-white"
                          }`}
                        >
                          <div className="h-8 w-full flex items-center justify-center mb-1">
                            <img src={d.logo} alt={d.name} className="h-6 w-auto object-contain" />
                          </div>
                          <p className="text-xs font-bold text-white truncate">{d.short}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: MEDIA SCREENSHOTS */}
            {step === 2 && (
              <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Showcase Screenshots</h2>
                  <p className="text-xs text-zinc-400 mt-1">Upload high-resolution screenshots of your asset in game.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {form.images.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-video rounded-2xl overflow-hidden border border-white/[0.1] bg-black group"
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/80 text-white hover:text-red-400 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                      e.target.value = "";
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => fileRef.current && fileRef.current.click()}
                    className="aspect-video rounded-2xl border border-dashed border-white/[0.15] bg-[#07090E] hover:bg-white/[0.03] hover:border-emerald-500/40 text-zinc-400 hover:text-white flex flex-col items-center justify-center gap-1.5 transition"
                  >
                    <Upload className="w-5 h-5 text-emerald-400" />
                    <span className="text-[11px] font-bold">Upload Image</span>
                  </button>
                </div>

                <div className="pt-2 flex gap-2">
                  <input
                    type="url"
                    value={form.imageUrlInput}
                    onChange={(e) => set("imageUrlInput", e.target.value)}
                    placeholder="Or paste screenshot image URL..."
                    className="flex-1 rounded-xl border border-white/[0.1] bg-[#07090E] px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-white transition"
                  >
                    Add URL
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PRICING */}
            {step === 3 && (
              <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Price & Availability</h2>
                  <p className="text-xs text-zinc-400 mt-1">Set free download or price in Robux. You keep 100% of proceeds.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => set("price_type", "Free")}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      form.price_type === "Free"
                        ? "border-emerald-500/50 bg-emerald-500/10 text-white shadow-sm"
                        : "border-white/[0.06] bg-[#07090E] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <p className="text-sm font-bold text-white mb-1">Free Community Drop</p>
                    <p className="text-[11px] text-zinc-400 leading-snug">Available for everyone in the community to download for free.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => set("price_type", "Robux")}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      form.price_type === "Robux"
                        ? "border-emerald-500/50 bg-emerald-500/10 text-white shadow-sm"
                        : "border-white/[0.06] bg-[#07090E] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <p className="text-sm font-bold text-white mb-1">Robux Pricing (R$)</p>
                    <p className="text-[11px] text-zinc-400 leading-snug">Set your Robux price. 0% platform commission fee.</p>
                  </button>
                </div>

                {form.price_type === "Robux" && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                      Price in Robux (R$) *
                    </label>
                    <div className="relative max-w-xs">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-emerald-400">
                        R$
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={form.price}
                        onChange={(e) => set("price", e.target.value)}
                        placeholder="150"
                        className="w-full rounded-2xl border border-white/[0.1] bg-[#07090E] pl-11 pr-4 py-3 text-sm text-white font-mono font-bold outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: DELIVERY CODES */}
            {step === 4 && (
              <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Escrow Delivery Keys</h2>
                  <p className="text-xs text-zinc-400 mt-1">Enter your Roblox Asset IDs, Pastebin URLs, or Google Drive download links.</p>
                </div>

                <div className="space-y-3">
                  {form.codes.map((code, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                          const next = [...form.codes];
                          next[idx] = e.target.value;
                          set("codes", next);
                        }}
                        placeholder={`Deliverable Key #${idx + 1} (e.g. rbxassetid://12345678 or https://drive.google.com/...)`}
                        className="flex-1 rounded-xl border border-white/[0.1] bg-[#07090E] px-4 py-3 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 font-mono"
                      />
                      {form.codes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => set("codes", form.codes.filter((_, j) => j !== idx))}
                          className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => set("codes", [...form.codes, ""])}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Deliverable Key</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & PUBLISH */}
            {step === 5 && (
              <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Review & Finalize</h2>
                  <p className="text-xs text-zinc-400 mt-1">Review your asset details before publishing live to the marketplace.</p>
                </div>

                <div className="space-y-3 divide-y divide-white/[0.06]">
                  <div className="flex justify-between text-xs py-2">
                    <span className="text-zinc-400">Format & Category:</span>
                    <span className="font-bold text-white">{form.listing_type} • {form.category}</span>
                  </div>
                  <div className="flex justify-between text-xs py-2">
                    <span className="text-zinc-400">Departments:</span>
                    <span className="font-bold text-emerald-400">{form.departments.join(", ")}</span>
                  </div>
                  <div className="flex justify-between text-xs py-2">
                    <span className="text-zinc-400">Price:</span>
                    <span className="font-mono font-bold text-white">{form.price_type === "Free" ? "FREE" : `R$ ${form.price}`}</span>
                  </div>
                  <div className="flex justify-between text-xs py-2">
                    <span className="text-zinc-400">Delivery Keys Vaulted:</span>
                    <span className="font-mono font-bold text-emerald-400">{form.codes.filter(c => c.trim()).length} Keys</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={busy}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{busy ? "Publishing to Marketplace…" : "Publish Asset Live"}</span>
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => step > 0 && setStep(step - 1)}
                disabled={step === 0 || busy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.02] text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.06] transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              {step < STEPS.length - 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (canNext()) {
                      setErr("");
                      setStep(step + 1);
                    } else {
                      setErr("Please complete the required fields in this step.");
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* ─── RIGHT COLUMN: LIVE LISTING CARD PREVIEW (5 cols) ─── */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                Live Storefront Preview
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                Auto-Updating
              </span>
            </div>

            {/* Live Mock Marketplace Card */}
            <div className="rounded-3xl border border-white/[0.1] bg-[#0A0D15] overflow-hidden shadow-2xl">
              <div className="aspect-[16/10] bg-black/60 relative overflow-hidden flex items-center justify-center">
                {form.images.length > 0 ? (
                  <img src={form.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6">
                    <Store className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                    <span className="text-xs font-mono text-zinc-500 uppercase">{primaryDept} Asset Preview</span>
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-black/85 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                    {primaryDept}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-lg bg-emerald-500 text-black shadow-md">
                    {isFree ? "FREE" : `R$ ${form.price || "150"}`}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>{form.category} • {form.listing_type}</span>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Star className="w-3 h-3 fill-emerald-400" />
                    <span>5.0</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-1">
                  {form.title || "Untitled Asset Listing"}
                </h3>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {form.description || "Describe your asset to show customers what vehicle models and features are included."}
                </p>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-zinc-400">
                    Seller: <strong className="text-white">{savedUser?.name || savedUser?.username || "You"}</strong>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">Escrow Ready</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-white/[0.06] bg-[#0A0D15]/60 text-xs text-zinc-400 space-y-2">
              <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Automated Escrow Guarantees</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-500">
                Buyers receive instant access to vaulted deliverable keys upon transaction completion. Zero DM handoffs.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
