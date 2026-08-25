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
  Tag,
  Car,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { localDb } from "@/lib/localDb";
import { DEPARTMENTS, CATEGORIES } from "@/lib/departments";

const STEPS = [
  { num: "01", label: "Asset Type" },
  { num: "02", label: "Details" },
  { num: "03", label: "Media" },
  { num: "04", label: "Pricing & Escrow" },
  { num: "05", label: "Review & Publish" },
];

const FORMAT_TYPES = [
  { id: "Single", label: "Single Vehicle Skin", desc: "Livery for a single vehicle model (Tahoe, Crown Vic, Charger, etc.)" },
  { id: "Bundle", label: "Agency Fleet Pack", desc: "Matching liveries across multiple department vehicles." },
  { id: "Uniforms", label: "Uniform & EUP Pack", desc: "Class A/B/C duty uniforms, tactical vests, and duty belts." },
  { id: "ELS", label: "ELS & Siren Profile", desc: "Lighting pattern configs and electronic siren soundbanks." },
  { id: "Map", label: "Server Map Template", desc: "Custom station layouts, spawn points, and roleplay builds." },
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
    vehicle_models: "2024 Tahoe PPV, Crown Victoria",
    tags: "liveries, police, 4k",
    roblox_asset_id: "",
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
    if (step === 2) return true;
    if (step === 3) return (form.price_type === "Free" || Number(form.price) >= 0) && form.codes.some((c) => c.trim().length > 0);
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
        vehicle_models: form.vehicle_models,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        roblox_asset_id: form.roblox_asset_id.trim(),
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
      setTimeout(() => navigate("/dashboard"), 1600);
    } catch (e) {
      setErr(e.message || "Failed to publish listing. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#06080C] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="max-w-md mx-auto my-auto p-8 sm:p-10 text-center rounded-2xl border border-emerald-500/30 bg-[#090C12] shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Asset Published!</h2>
          <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
            Your asset is live in the marketplace catalog with automated escrow delivery.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Redirecting to Creator Studio…</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isFree = form.price_type === "Free" || !form.price || form.price === "0";
  const primaryDept = form.departments[0] || "Police";

  return (
    <div className="min-h-screen bg-[#06080C] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* Studio Sub-Header */}
        <div className="border-b border-white/[0.06] bg-[#080B10]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                <Link to="/marketplace" className="hover:text-white transition flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Marketplace
                </Link>
                <span>/</span>
                <span className="text-emerald-400 font-mono">Creator Studio</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Publish ER:LC Asset
              </h1>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {STEPS.map((s, idx) => {
                const isPast = idx < step;
                const isCurrent = idx === step;
                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      if (isPast) setStep(idx);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shrink-0 ${
                      isCurrent
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                        : isPast
                        ? "border-emerald-500/20 bg-black/40 text-emerald-300/70"
                        : "border-white/[0.06] bg-white/[0.02] text-zinc-500"
                    }`}
                  >
                    <span className="font-mono text-[10px]">{s.num}</span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main 2-Column Workflow Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {err && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs mb-6">
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
              
              {/* STEP 0: ASSET TYPE & CATEGORY */}
              {step === 0 && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-6 sm:p-7 space-y-6 shadow-xl">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">01. Asset Type & Format</h2>
                    <p className="text-xs text-zinc-400 mt-1">Select the delivery structure and asset category.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FORMAT_TYPES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => set("listing_type", t.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          form.listing_type === t.id
                            ? "border-emerald-500/50 bg-emerald-500/10 text-white shadow-sm"
                            : "border-white/[0.06] bg-[#06080C] text-zinc-400 hover:border-white/[0.12] hover:text-white"
                        }`}
                      >
                        <p className="text-xs font-bold text-white mb-1">{t.label}</p>
                        <p className="text-[11px] text-zinc-400 leading-snug">{t.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/[0.06]">
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5 font-mono">
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
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              form.category === catId
                                ? "bg-emerald-500 text-black font-bold border-emerald-400"
                                : "border-white/[0.08] bg-[#06080C] text-zinc-300 hover:text-white"
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
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-6 sm:p-7 space-y-5 shadow-xl">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">02. Asset Details & Breakdown</h2>
                    <p className="text-xs text-zinc-400 mt-1">Provide clear specifications of what is included in this package.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                      Asset Title *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                      placeholder="e.g. 2024 State Police Ghost Slicktop Fleet"
                      className="w-full rounded-xl border border-white/[0.08] bg-[#06080C] px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                      Description & Features *
                    </label>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="Detail the vehicle models included (Tahoe, Crown Vic, Explorer), 4K daylight reflection notes, ELS configs, and installation instructions..."
                      className="w-full rounded-xl border border-white/[0.08] bg-[#06080C] px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
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
                            className={`p-3 rounded-xl border text-center transition-all ${
                              isSelected
                                ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                                : "border-white/[0.06] bg-[#06080C] text-zinc-400 hover:text-white"
                            }`}
                          >
                            <div className="h-7 w-full flex items-center justify-center mb-1">
                              <img src={d.logo} alt={d.name} className="h-5 w-auto object-contain" />
                            </div>
                            <p className="text-xs font-bold text-white truncate">{d.short}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                      Vehicle Models (comma separated)
                    </label>
                    <input
                      type="text"
                      value={form.vehicle_models}
                      onChange={(e) => set("vehicle_models", e.target.value)}
                      placeholder="e.g. 2024 Tahoe, Crown Victoria, Explorer Interceptor"
                      className="w-full rounded-xl border border-white/[0.08] bg-[#06080C] px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: MEDIA & ROBLOX ASSET INFO */}
              {step === 2 && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-6 sm:p-7 space-y-5 shadow-xl">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">03. Screenshots & Roblox Asset Info</h2>
                    <p className="text-xs text-zinc-400 mt-1">Upload high-res in-game screenshots and link optional Roblox IDs.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {form.images.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-black group"
                      >
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 p-1 rounded bg-black/80 text-white hover:text-red-400 transition"
                        >
                          <X className="w-3 h-3" />
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
                      className="aspect-video rounded-xl border border-dashed border-white/[0.12] bg-[#06080C] hover:bg-white/[0.02] hover:border-emerald-500/40 text-zinc-400 hover:text-white flex flex-col items-center justify-center gap-1 transition"
                    >
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span className="text-[11px] font-bold">Upload Image</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={form.imageUrlInput}
                      onChange={(e) => set("imageUrlInput", e.target.value)}
                      placeholder="Or paste screenshot image URL..."
                      className="flex-1 rounded-xl border border-white/[0.08] bg-[#06080C] px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white transition"
                    >
                      Add URL
                    </button>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06]">
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                      Roblox Asset / Model ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.roblox_asset_id}
                      onChange={(e) => set("roblox_asset_id", e.target.value)}
                      placeholder="e.g. 13892019482 or rbxassetid://13892019482"
                      className="w-full rounded-xl border border-white/[0.08] bg-[#06080C] px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: PRICING & ESCROW DELIVERY KEYS */}
              {step === 3 && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-6 sm:p-7 space-y-6 shadow-xl">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">04. Pricing & Escrow Keys</h2>
                    <p className="text-xs text-zinc-400 mt-1">Set your Robux price and enter vault-locked deliverable keys.</p>
                  </div>

                  {/* Pricing Switcher */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => set("price_type", "Free")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        form.price_type === "Free"
                          ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                          : "border-white/[0.06] bg-[#06080C] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <p className="text-xs font-bold text-white mb-1">Free Community Drop</p>
                      <p className="text-[11px] text-zinc-400 leading-snug">Available for 0 R$ to all community creators.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => set("price_type", "Robux")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        form.price_type === "Robux"
                          ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                          : "border-white/[0.06] bg-[#06080C] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <p className="text-xs font-bold text-white mb-1">Robux Pricing (R$)</p>
                      <p className="text-[11px] text-zinc-400 leading-snug">You keep 100% of proceeds (0% platform cut).</p>
                    </button>
                  </div>

                  {form.price_type === "Robux" && (
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                        Price in Robux (R$) *
                      </label>
                      <div className="relative max-w-xs">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-emerald-400">
                          R$
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={form.price}
                          onChange={(e) => set("price", e.target.value)}
                          placeholder="150"
                          className="w-full rounded-xl border border-white/[0.08] bg-[#06080C] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white font-mono font-bold outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>
                  )}

                  {/* Escrow Keys Vault */}
                  <div className="pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                        Escrow Deliverable Keys *
                      </label>
                    </div>
                    <p className="text-[11px] text-zinc-400 mb-3">
                      Enter direct download links (Google Drive, Pastebin, Mega) or Roblox Asset IDs. These are encrypted until checkout.
                    </p>

                    <div className="space-y-2.5">
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
                            placeholder={`Deliverable Key #${idx + 1} (e.g. rbxassetid://138920... or https://drive.google.com/...)`}
                            className="flex-1 rounded-xl border border-white/[0.08] bg-[#06080C] px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 font-mono"
                          />
                          {form.codes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => set("codes", form.codes.filter((_, j) => j !== idx))}
                              className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => set("codes", [...form.codes, ""])}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline pt-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Deliverable Key</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & PUBLISH */}
              {step === 4 && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-6 sm:p-7 space-y-6 shadow-xl">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">05. Review & Publish</h2>
                    <p className="text-xs text-zinc-400 mt-1">Confirm your asset listing before publishing live to the catalog.</p>
                  </div>

                  <div className="space-y-2.5 divide-y divide-white/[0.06]">
                    <div className="flex justify-between text-xs py-2">
                      <span className="text-zinc-400">Title:</span>
                      <span className="font-bold text-white">{form.title}</span>
                    </div>
                    <div className="flex justify-between text-xs py-2">
                      <span className="text-zinc-400">Category & Type:</span>
                      <span className="font-bold text-white">{form.category} • {form.listing_type}</span>
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
                      <span className="text-zinc-400">Vaulted Keys:</span>
                      <span className="font-mono font-bold text-emerald-400">{form.codes.filter((c) => c.trim()).length} Keys Ready</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={busy}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{busy ? "Publishing to Marketplace…" : "Publish Asset Live"}</span>
                  </button>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => step > 0 && setStep(step - 1)}
                  disabled={step === 0 || busy}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs font-semibold text-zinc-300 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
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
                        setErr("Please complete the required fields before continuing.");
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-sm transition"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>

            {/* ─── RIGHT COLUMN: LIVE STORE PREVIEW (5 cols) ─── */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  Live Catalog Card Preview
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Live Sync
                </span>
              </div>

              {/* Live Preview Card */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D14] overflow-hidden shadow-xl">
                <div className="aspect-[16/10] bg-black/60 relative overflow-hidden flex items-center justify-center">
                  {form.images.length > 0 ? (
                    <img src={form.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6">
                      <Store className="w-8 h-8 text-zinc-700 mx-auto mb-1" />
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{primaryDept} Livery</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-black/85 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {primaryDept}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-emerald-500 text-black shadow-md">
                      {isFree ? "FREE" : `R$ ${form.price || "150"}`}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>{form.category} • {form.listing_type}</span>
                    <div className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Star className="w-3 h-3 fill-emerald-400" />
                      <span>5.0</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {form.title || "Untitled Asset Listing"}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {form.description || "Enter your asset description to show customers included vehicle models and features."}
                  </p>

                  <div className="pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-xs text-zinc-400">
                    <span>Seller: <strong className="text-white">{savedUser?.name || savedUser?.username || "You"}</strong></span>
                    <span className="text-[11px] font-mono text-emerald-400">Escrow Ready</span>
                  </div>
                </div>
              </div>

              {/* Escrow Guarantee Note */}
              <div className="p-4 rounded-xl border border-white/[0.06] bg-[#0A0D14]/60 text-xs text-zinc-400 space-y-1">
                <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Automated Key Protection</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-500">
                  Deliverable keys are dispatched instantly upon verified checkout. Zero commission fees.
                </p>
              </div>

            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
