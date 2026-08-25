import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Upload,
  AlertCircle,
  X,
  Image as ImageIcon,
  Tag,
  ShieldCheck,
  Store,
  DollarSign,
  Plus,
  Trash2,
  FileCode,
  Sparkles,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { localDb } from "@/lib/localDb";
import { DEPARTMENTS, CATEGORIES } from "@/lib/departments";

const STEPS = [
  { id: 0, label: "Asset Details" },
  { id: 1, label: "Category" },
  { id: 2, label: "Files / Delivery" },
  { id: 3, label: "Pricing" },
  { id: 4, label: "Preview" },
  { id: 5, label: "Publish" },
];

const FORMAT_TYPES = [
  { id: "Single", label: "Single Vehicle Livery", desc: "Single vehicle skin for Explorer, Tahoe, Charger, etc." },
  { id: "Bundle", label: "Agency Fleet Bundle", desc: "Multi-vehicle department pack with matching liveries." },
  { id: "Uniforms", label: "Uniform & EUP Pack", desc: "Class A/B/C uniforms, vests, duty belts, and badges." },
  { id: "ELS", label: "ELS & Siren Profile", desc: "Lighting pattern configs, siren soundbanks, stage controls." },
  { id: "Map", label: "Server Map Template", desc: "Custom roleplay map builds, station layouts, spawn points." },
  { id: "Code", label: "Digital Access Key", desc: "Redeemable VIP pass, whitelist token, or developer code." },
];

export default function CreateListing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef(null);

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
    if (step === 0) return form.title.trim().length >= 3 && form.description.trim().length >= 5;
    if (step === 1) return form.departments.length > 0 && !!form.category;
    if (step === 2) return form.codes.some((c) => c.trim().length > 0);
    if (step === 3) return form.price_type === "Free" || Number(form.price) >= 0;
    return true;
  };

  const handlePublish = async () => {
    setBusy(true);
    setErr("");
    try {
      const saved = window.localStorage.getItem("discord_user");
      const user = saved ? JSON.parse(saved) : null;

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
        seller_name: user?.name || user?.username || "Verified Creator",
        seller_id: user?.id || "creator_local",
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
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="max-w-md mx-auto my-auto p-10 text-center rounded-3xl border border-emerald-500/30 bg-[#0B0E16] shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Asset Published!</h2>
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            Your listing is live on the marketplace and deliverable keys are vault-locked in Scam-Shield escrow.
          </p>
          <p className="text-[11px] font-mono text-emerald-400">Redirecting to Creator Hub…</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 mb-2">
              <Sparkles className="h-3 w-3" />
              <span>Asset Publishing Workflow</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Publish an ER:LC Asset
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Upload your vehicle liveries, uniform packages, ELS siren soundbanks, or map templates.
            </p>
          </div>

          {/* ─── 6-STEP PROGRESS BAR ─── */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
            {STEPS.map((s, idx) => {
              const isPast = idx < step;
              const isCurrent = idx === step;
              return (
                <React.Fragment key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (isPast) setStep(idx);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
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
                  {idx < STEPS.length - 1 && <div className="w-3 h-px bg-white/[0.1] shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Error Message */}
          {err && (
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="flex-1">{err}</p>
              <button onClick={() => setErr("")}>
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          )}

          {/* ─── STEP 0: ASSET DETAILS ─── */}
          {step === 0 && (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                  Asset Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. 2024 State Police Ghost Slicktop Fleet Pack"
                  className="w-full rounded-2xl border border-white/[0.1] bg-[#07090E] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                  Description & Vehicle Breakdown *
                </label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Detail what is included: vehicle models (Tahoe, Crown Vic, Explorer), livery 4K templates, ELS lighting patterns, installation notes..."
                  className="w-full rounded-2xl border border-white/[0.1] bg-[#07090E] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 font-mono">
                  Asset Format Type
                </label>
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
              </div>
            </div>
          )}

          {/* ─── STEP 1: CATEGORY & DEPARTMENTS ─── */}
          {step === 1 && (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 font-mono">
                  Asset Category *
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set("category", c)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        form.category === c
                          ? "bg-emerald-500 text-black font-bold border-emerald-400 shadow-sm"
                          : "border-white/[0.08] bg-[#07090E] text-zinc-300 hover:text-white"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 font-mono">
                  Department Classification * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DEPARTMENTS.map((d) => {
                    const isSelected = form.departments.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleDept(d.id)}
                        className={`p-4 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? "border-emerald-500/50 bg-emerald-500/10 text-white shadow-sm"
                            : "border-white/[0.06] bg-[#07090E] text-zinc-400 hover:border-white/[0.12] hover:text-white"
                        }`}
                      >
                        <div className="h-10 w-full flex items-center justify-center mb-2">
                          <img src={d.logo} alt={d.name} className="h-8 w-auto object-contain" />
                        </div>
                        <p className="text-xs font-bold text-white">{d.name}</p>
                        <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
                          {isSelected ? "● Selected" : "Tap to select"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: FILES & ESCROW CODES ─── */}
          {step === 2 && (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                    Preview Media (Images)
                  </label>
                  <span className="text-[11px] text-zinc-500">Max 5 MB per image</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {form.images.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.1] bg-black group"
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 p-1 rounded-lg bg-black/80 text-white hover:text-red-400 transition"
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
                    className="aspect-video rounded-xl border border-dashed border-white/[0.15] bg-[#07090E] hover:bg-white/[0.03] hover:border-emerald-500/40 text-zinc-400 hover:text-white flex flex-col items-center justify-center gap-1 transition"
                  >
                    <Upload className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-bold">Upload Screenshot</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.imageUrlInput}
                    onChange={(e) => set("imageUrlInput", e.target.value)}
                    placeholder="Or paste image URL (https://imgur.com/...)"
                    className="flex-1 rounded-xl border border-white/[0.1] bg-[#07090E] px-4 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-white transition"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Escrow Delivery Codes Vault */}
              <div className="pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                    Scam-Shield Escrow Delivery Keys *
                  </label>
                </div>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                  Enter Roblox Asset IDs, Pastebin tokens, Google Drive links, or direct redeemable keys. These are vault-locked until payment clearance.
                </p>

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
                        className="flex-1 rounded-xl border border-white/[0.1] bg-[#07090E] px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 font-mono"
                      />
                      {form.codes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => set("codes", form.codes.filter((_, j) => j !== idx))}
                          className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition"
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
                    <span>Add Another Deliverable Code</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 3: PRICING ─── */}
          {step === 3 && (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 font-mono">
                  Price Configuration *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => set("price_type", "Free")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      form.price_type === "Free"
                        ? "border-emerald-500/50 bg-emerald-500/10 text-white shadow-sm"
                        : "border-white/[0.06] bg-[#07090E] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <p className="text-xs font-bold text-white mb-1">Free Release</p>
                    <p className="text-[11px] text-zinc-400">Available to all ER:LC creators for free download.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => set("price_type", "Robux")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      form.price_type === "Robux"
                        ? "border-emerald-500/50 bg-emerald-500/10 text-white shadow-sm"
                        : "border-white/[0.06] bg-[#07090E] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <p className="text-xs font-bold text-white mb-1">Robux Pricing</p>
                    <p className="text-[11px] text-zinc-400">Price in Robux (R$). You keep 100% of the sale.</p>
                  </button>
                </div>
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

              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-300 leading-relaxed">
                  <strong>0% Platform Commission:</strong> LibertyX does not take any listing cut. All proceeds are directly disbursed to your creator account upon verified escrow release.
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 4: PREVIEW ─── */}
          {step === 4 && (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Listing Preview</h3>
                <p className="text-xs text-zinc-400">Review how your listing appears in the marketplace before publishing.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-white/[0.06] bg-[#07090E] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      {form.departments.join(", ") || "General"}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{form.category}</span>
                  </div>

                  <h4 className="text-base font-bold text-white">{form.title || "Untitled Asset"}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{form.description}</p>
                  
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Price:</span>
                    <span className="font-mono font-extrabold text-emerald-400">
                      {form.price_type === "Free" ? "FREE" : `R$ ${form.price}`}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-white/[0.06] bg-[#07090E] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Escrow Keys:</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{form.codes.filter(c => c.trim()).length} Keys Vaulted</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Screenshots:</span>
                    <span className="text-xs font-mono font-bold text-white">{form.images.length} Uploaded</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Platform Cut:</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">0% Commission</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 5: PUBLISH CONFIRMATION ─── */}
          {step === 5 && (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 text-center shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Ready to Go Live?</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                By publishing, your asset becomes instantly discoverable on LibertyX Marketplace with automated Scam-Shield escrow key delivery.
              </p>

              <button
                type="button"
                onClick={handlePublish}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{busy ? "Publishing to Marketplace…" : "Confirm & Publish Asset"}</span>
              </button>
            </div>
          )}

          {/* ─── NAVIGATION BUTTONS ─── */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => step > 0 && setStep(step - 1)}
              disabled={step === 0 || busy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.02] text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.06] transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (canNext()) {
                    setErr("");
                    setStep(step + 1);
                  } else {
                    setErr("Please complete all required fields before proceeding.");
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
