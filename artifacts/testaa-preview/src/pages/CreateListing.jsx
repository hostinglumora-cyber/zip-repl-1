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
  MapPin,
  Hash,
  Loader2,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { localDb, readFileAsDataUrl } from "@/lib/localDb";
import { DEPARTMENTS } from "@/lib/departments";

const STEPS = [
  { num: "01", label: "Asset Type" },
  { num: "02", label: "Details & Tags" },
  { num: "03", label: "Media Upload" },
  { num: "04", label: "Pricing & Escrow" },
  { num: "05", label: "Review & Publish" },
];

const FORMAT_TYPES = [
  { id: "Single", label: "Single Vehicle Livery", desc: "Livery skin for a single ER:LC vehicle model." },
  { id: "Bundle", label: "Agency Fleet Pack", desc: "Matching livery package across Tahoe, Crown Vic, Charger, etc." },
  { id: "Uniforms", label: "Uniform & EUP Pack", desc: "Class A/B/C duty uniforms, patrol vests, and badge duty wear." },
  { id: "ELS", label: "ELS & Siren Profile", desc: "Lighting pattern stage configs and electronic siren soundbanks." },
  { id: "Map", label: "Map Template", desc: "Custom station layouts, spawn points, training areas, and map builds." },
  { id: "Services", label: "Custom Service / Commission", desc: "Custom department branding, livery requests, or Discord setups." },
];

const SUGGESTED_TAGS = [
  "#ERLC",
  "#Police",
  "#Sheriff",
  "#StatePolice",
  "#Fire",
  "#DOT",
  "#EMS",
  "#Livery",
  "#Map",
  "#Uniform",
  "#ELS",
  "#Tahoe",
  "#CrownVic",
  "#Explorer",
  "#Charger",
  "#Silverado",
  "#4K",
];

export default function CreateListing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
    category: "Law Enforcement",
    departments: ["Police"],
    vehicle_models: "2024 Tahoe PPV, Crown Victoria",
    tags: ["#ERLC", "#Police", "#Livery"],
    tagInput: "",
    roblox_asset_id: "",
    price_type: "Robux",
    price: "150",
    images: [],
    imageUrlInput: "",
    codes: [""],
    requirements: "",
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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setErr("");

    try {
      const base64Url = await readFileAsDataUrl(file);
      set("images", [...form.images, base64Url]);
    } catch (error) {
      setErr(error.message || "Failed to load image.");
    } finally {
      setUploadingImage(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleAddImageUrl = () => {
    if (!form.imageUrlInput.trim()) return;
    set("images", [...form.images, form.imageUrlInput.trim()]);
    set("imageUrlInput", "");
  };

  const removeImage = (idx) => {
    set("images", form.images.filter((_, i) => i !== idx));
  };

  const handleAddTag = (tagToAdd) => {
    const clean = (tagToAdd || form.tagInput).trim();
    if (!clean) return;
    const formatted = clean.startsWith("#") ? clean : `#${clean}`;
    if (form.tags.includes(formatted)) return;
    if (form.tags.length >= 8) {
      setErr("Maximum 8 tags per listing.");
      return;
    }
    set("tags", [...form.tags, formatted]);
    set("tagInput", "");
  };

  const removeTag = (tagToRemove) => {
    set("tags", form.tags.filter((t) => t !== tagToRemove));
  };

  const handlePublish = async () => {
    if (!form.title.trim()) {
      setErr("Listing title is required.");
      return;
    }
    setBusy(true);
    setErr("");

    try {
      const priceNum = form.price_type === "Free" ? 0 : parseInt(form.price, 10) || 0;
      const sellerId = savedUser?.id || "eazykims";
      const sellerUsername = savedUser?.username || "eazykims";
      const sellerName = savedUser?.name || savedUser?.username || "Eazykims";

      const newListing = await localDb.entities.Listing.create({
        title: form.title.trim(),
        description: form.description.trim(),
        listing_type: form.listing_type,
        category: form.category,
        departments: form.departments,
        vehicle_models: form.vehicle_models.trim(),
        tags: form.tags,
        roblox_asset_id: form.roblox_asset_id.trim(),
        price_type: form.price_type,
        price: priceNum,
        images: form.images,
        codes: form.codes.filter(Boolean),
        requirements: form.requirements.trim(),
        seller_id: sellerId,
        seller_username: sellerUsername,
        seller_name: sellerName,
        status: "active",
        created_date: new Date().toISOString(),
      });

      // Also ensure creator profile exists
      const prof = await localDb.getCreatorProfile(sellerUsername);
      if (!prof) {
        await localDb.saveCreatorProfile({
          user_id: sellerId,
          username: sellerUsername,
          display_name: sellerName,
          avatar_url: savedUser?.avatarUrl || null,
          bio: "ER:LC emergency liveries and custom assets.",
          accent_color: "emerald",
        });
      }

      navigate(`/listing/${newListing.id}`);
    } catch (e) {
      setErr(e.message || "Failed to publish listing.");
    } finally {
      setBusy(false);
    }
  };

  if (!savedUser) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between">
        <SiteNav />
        <div className="max-w-md mx-auto my-auto p-10 text-center rounded-2xl border border-white/[0.08] bg-[#0A0D15] shadow-2xl">
          <Store className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Creator Authentication Required</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Please sign in with Discord to publish ER:LC assets with instant escrow payouts.
          </p>
          <Link
            to="/login?returnTo=/sell"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-xs font-bold text-black transition"
          >
            Sign in with Discord
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* ─── PUBLISH HEADER & STEPPER ─── */}
        <div className="border-b border-white/[0.06] bg-[#0A0D15]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                  <Link to="/dashboard" className="hover:text-white transition flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Creator Studio
                  </Link>
                  <span>/</span>
                  <span className="text-emerald-400 font-mono">Publish Asset</span>
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Publish ER:LC Marketplace Asset
                </h1>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                  0% Listing Cut
                </span>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="grid grid-cols-5 gap-2">
              {STEPS.map((s, idx) => (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setStep(idx)}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all",
                    step === idx
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                      : idx < step
                      ? "border-emerald-500/20 bg-black/40 text-zinc-300"
                      : "border-white/[0.04] bg-black/20 text-zinc-600"
                  )}
                >
                  <span className="text-[10px] font-mono block">{s.num}</span>
                  <span className="text-xs font-bold truncate block">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── MAIN FORM BODY ─── */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {err && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="flex-1">{err}</p>
            </div>
          )}

          {/* STEP 1: FORMAT & TYPE */}
          {step === 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-base font-bold text-white">Select Asset Category & Format</h2>
                <p className="text-xs text-zinc-400 mt-1">Choose how your asset package is structured for buyers.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {FORMAT_TYPES.map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => {
                      set("listing_type", fmt.id);
                      if (fmt.id === "Map") set("category", "Map Templates");
                      if (fmt.id === "Uniforms") set("category", "Uniforms");
                    }}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all space-y-1",
                      form.listing_type === fmt.id
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-white/[0.06] bg-[#07090E] text-zinc-400 hover:text-white"
                    )}
                  >
                    <span className="text-xs font-bold text-white block">{fmt.label}</span>
                    <span className="text-[11px] text-zinc-400 block leading-relaxed">{fmt.desc}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                  Primary Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50"
                >
                  <option value="Law Enforcement">Law Enforcement (Police, Sheriff, Highway Patrol)</option>
                  <option value="Fire & Rescue">Fire & Rescue / EMS</option>
                  <option value="DOT">DOT & Transit</option>
                  <option value="Civilian">Civilian Vehicles & Liveries</option>
                  <option value="Map Templates">Map Templates & Station Builds</option>
                  <option value="Uniforms">Uniforms & EUP Duty Wear</option>
                  <option value="ELS & Siren">ELS Lighting & Siren Soundbanks</option>
                  <option value="Server Packs">Full Server Asset Packs</option>
                  <option value="Services">Custom Services & Commissions</option>
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
                >
                  <span>Next: Details & Tags</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS & TAGS */}
          {step === 1 && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-base font-bold text-white">Asset Details & Tags</h2>
                <p className="text-xs text-zinc-400 mt-1">Provide clear specifications and search hashtags.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. 2024 State Police Ghost Tahoe & Explorer Livery Pack"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                    Description & Features
                  </label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Describe livery textures, 4K quality, template compatibility, and unit variants included..."
                    className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] p-3 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                      Compatible Vehicle / Map Models
                    </label>
                    <input
                      type="text"
                      value={form.vehicle_models}
                      onChange={(e) => set("vehicle_models", e.target.value)}
                      placeholder="e.g. 2024 Tahoe PPV, Crown Victoria, Dodge Charger"
                      className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                      Roblox Asset / Template ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.roblox_asset_id}
                      onChange={(e) => set("roblox_asset_id", e.target.value)}
                      placeholder="e.g. 1827492819"
                      className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 font-mono"
                    />
                  </div>
                </div>

                {/* Hashtag System */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                    Search Hashtags (Max 8)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={form.tagInput}
                      onChange={(e) => set("tagInput", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Type a tag and press enter (e.g. #Sheriff)..."
                      className="flex-1 rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag()}
                      className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-white transition"
                    >
                      Add Tag
                    </button>
                  </div>

                  {/* Selected Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {form.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-mono text-emerald-400 font-bold"
                      >
                        {t}
                        <button type="button" onClick={() => removeTag(t)} className="hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Tag Suggestions */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-zinc-500 font-mono mr-1">Suggestions:</span>
                    {SUGGESTED_TAGS.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleAddTag(st)}
                        className="text-[10px] font-mono text-zinc-400 hover:text-emerald-400 bg-[#07090E] border border-white/[0.04] px-2 py-0.5 rounded transition"
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-xs font-bold text-zinc-300 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
                >
                  <span>Next: Media Upload</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: MEDIA UPLOADS (FIXED PERSISTENCE) */}
          {step === 2 && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-base font-bold text-white">Product Images & Showcase</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Upload screenshot renders of your vehicle livery, uniform, or map template (PNG, JPG, WebP supported).
                </p>
              </div>

              {/* Upload Drop Area */}
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/[0.1] hover:border-emerald-500/40 rounded-2xl p-8 text-center bg-[#07090E] hover:bg-[#0A0D15] cursor-pointer transition group space-y-2"
              >
                <input
                  type="file"
                  ref={fileRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                {uploadingImage ? (
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                ) : (
                  <Upload className="w-8 h-8 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
                )}
                <h4 className="text-xs font-bold text-white">Click to browse or drag & drop images</h4>
                <p className="text-[11px] text-zinc-500">Supports PNG, JPG, WEBP up to 8 MB</p>
              </div>

              {/* Direct Image URL input */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={form.imageUrlInput}
                  onChange={(e) => set("imageUrlInput", e.target.value)}
                  placeholder="Or paste direct image URL (https://...)"
                  className="flex-1 rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-white transition"
                >
                  Add URL
                </button>
              </div>

              {/* Uploaded Images List */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/[0.06]">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black border border-white/[0.08] group">
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/80 text-red-400 hover:bg-red-500 hover:text-white transition shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-xs font-bold text-zinc-300 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
                >
                  <span>Next: Pricing & Escrow</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PRICING & ESCROW CODES */}
          {step === 3 && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-base font-bold text-white">Pricing & Vault Escrow Delivery</h2>
                <p className="text-xs text-zinc-400 mt-1">Set Robux price and enter the deliverable code/link that unlocks upon purchase.</p>
              </div>

              {/* Price Type */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "Robux", label: "Robux Pricing", desc: "List asset for Robux (100% kept by creator)" },
                  { id: "Free", label: "Free Drop", desc: "Free community release for all users" },
                ].map((pt) => (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => set("price_type", pt.id)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      form.price_type === pt.id
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-white/[0.06] bg-[#07090E] text-zinc-400 hover:text-white"
                    )}
                  >
                    <span className="text-xs font-bold text-white block">{pt.label}</span>
                    <span className="text-[11px] text-zinc-400 block">{pt.desc}</span>
                  </button>
                ))}
              </div>

              {form.price_type === "Robux" && (
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                    Robux Price (R$)
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="150"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-emerald-500/50"
                  />
                </div>
              )}

              {/* Vault Deliverable Codes */}
              <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
                    Vault Escrow Deliverable Codes / Links *
                  </label>
                  <p className="text-[11px] text-zinc-500 mb-2">
                    Enter the Roblox Asset ID, direct download URL, or Google Drive / Pastebin template link. Locked until purchase.
                  </p>
                </div>

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
                      placeholder="e.g. Asset ID: 1827491829 or https://drive.google.com/..."
                      className="flex-1 rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-emerald-500/50"
                    />
                    {form.codes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => set("codes", form.codes.filter((_, i) => i !== idx))}
                        className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => set("codes", [...form.codes, ""])}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add another deliverable code</span>
                </button>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-xs font-bold text-zinc-300 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
                >
                  <span>Next: Review & Publish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & PUBLISH */}
          {step === 4 && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-base font-bold text-white">Review & Publish Asset</h2>
                <p className="text-xs text-zinc-400 mt-1">Verify all details before publishing live to the marketplace catalog.</p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-[#07090E] p-4 space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/[0.04] pb-2">
                  <span className="text-zinc-500 font-mono">Title:</span>
                  <span className="font-bold text-white">{form.title || "Untitled"}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-2">
                  <span className="text-zinc-500 font-mono">Category:</span>
                  <span className="text-emerald-400">{form.category} • {form.listing_type}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-2">
                  <span className="text-zinc-500 font-mono">Price:</span>
                  <span className="font-mono font-bold text-white">{form.price_type === "Free" ? "FREE" : `R$ ${form.price}`}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-2">
                  <span className="text-zinc-500 font-mono">Uploaded Images:</span>
                  <span className="font-mono text-zinc-300">{form.images.length} files</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-mono">Deliverable Codes:</span>
                  <span className="font-mono text-emerald-400">{form.codes.filter(Boolean).length} Vault Keys</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-xs font-bold text-zinc-300 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs sm:text-sm font-bold transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{busy ? "Publishing Asset…" : "Publish Asset to Marketplace"}</span>
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
}
