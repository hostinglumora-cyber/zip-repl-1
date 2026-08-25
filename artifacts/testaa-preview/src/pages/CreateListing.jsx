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
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { localDb, readFileAsDataUrl } from "@/lib/localDb";
import { cn } from "@/lib/utils";

const STEPS = [
  { num: "01", label: "Asset Type" },
  { num: "02", label: "Details & Tags" },
  { num: "03", label: "Media Upload" },
  { num: "04", label: "Pricing & Escrow" },
  { num: "05", label: "Review & Publish" },
];

const FORMAT_TYPES = [
  { id: "Single", label: "Single Vehicle Livery" },
  { id: "Bundle", label: "Agency Fleet Pack" },
  { id: "Uniforms", label: "Uniform & EUP Pack" },
  { id: "ELS", label: "ELS & Siren Profile" },
  { id: "Map", label: "Map Template" },
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
    vehicle_models: "",
    tags: [],
    tagInput: "",
    price_type: "Robux",
    price: "150",
    images: [],
    codes: [""],
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

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

  const removeImage = (idx) => {
    set("images", form.images.filter((_, i) => i !== idx));
  };

  const handleAddTag = () => {
    const clean = form.tagInput.trim();
    if (!clean) return;
    const formatted = clean.startsWith("#") ? clean : `#${clean}`;
    if (!form.tags.includes(formatted)) {
      set("tags", [...form.tags, formatted]);
    }
    set("tagInput", "");
  };

  const removeTag = (t) => {
    set("tags", form.tags.filter((x) => x !== t));
  };

  const handlePublish = async () => {
    if (!form.title.trim()) {
      setErr("Title required.");
      return;
    }
    setBusy(true);
    setErr("");

    try {
      const priceNum = form.price_type === "Free" ? 0 : parseInt(form.price, 10) || 0;
      const sellerId = savedUser?.id || "demo_user";
      const sellerUsername = savedUser?.username || "demo";
      const sellerName = savedUser?.name || "Demo User";

      const newListing = await localDb.entities.Listing.create({
        title: form.title.trim(),
        description: form.description.trim(),
        listing_type: form.listing_type,
        category: form.category,
        vehicle_models: form.vehicle_models,
        tags: form.tags,
        price_type: form.price_type,
        price: priceNum,
        images: form.images,
        codes: form.codes.filter(Boolean),
        seller_id: sellerId,
        seller_username: sellerUsername,
        seller_name: sellerName,
        status: "active",
        created_date: new Date().toISOString(),
      });

      navigate(`/listing/${newListing.id}`);
    } catch (e) {
      setErr(e.message || "Failed to publish.");
    } finally {
      setBusy(false);
    }
  };

  if (!savedUser) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-sm w-full p-6 text-center rounded-xl bg-[#12151E] border border-white/[0.08]">
            <Store className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-sm font-semibold text-slate-50 mb-2">Creator Auth Required</h2>
            <Link
              to="/login?returnTo=/sell"
              className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-sm font-semibold text-black active:scale-[0.98]"
            >
              Sign in with Discord
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Header & Steps */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link to="/dashboard" className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Publish Asset</h1>
          </div>
          <div className="flex gap-2 bg-[#12151E] p-1.5 rounded-xl border border-white/[0.08] overflow-x-auto">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors",
                  step === i ? "bg-emerald-500 text-black" : step > i ? "text-slate-300" : "text-slate-500"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {err && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {err}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
          {/* Left Form Area */}
          <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-6">
            
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-50">Asset Format</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FORMAT_TYPES.map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => set("listing_type", fmt.id)}
                      className={cn(
                        "p-4 rounded-xl border text-sm font-semibold text-left transition-colors",
                        form.listing_type === fmt.id
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-white/[0.08] bg-[#090A0F] text-slate-300 hover:border-white/[0.18]"
                      )}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
                <div className="pt-4 flex justify-end">
                  <button onClick={() => setStep(1)} className="bg-emerald-500 text-black px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-50">Details & Tags</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                      placeholder="e.g. 2024 Tahoe Livery"
                      className="w-full rounded-lg border border-white/[0.08] bg-[#090A0F] px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="Details about your asset..."
                      className="w-full rounded-lg border border-white/[0.08] bg-[#090A0F] p-3 text-sm text-slate-50 outline-none focus:border-emerald-500/50 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Tags</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={form.tagInput}
                        onChange={(e) => set("tagInput", e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                        placeholder="Type and press enter"
                        className="flex-1 rounded-lg border border-white/[0.08] bg-[#090A0F] px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500/50"
                      />
                      <button onClick={handleAddTag} className="bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 px-3 py-2 rounded-lg text-sm">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map((t) => (
                        <span key={t} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                          {t} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(t)} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex justify-between">
                  <button onClick={() => setStep(0)} className="text-slate-400 hover:text-slate-50 text-sm font-semibold">Back</button>
                  <button onClick={() => setStep(2)} className="bg-emerald-500 text-black px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-50">Media Upload</h2>
                <div 
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center bg-[#090A0F] hover:border-emerald-500/50 cursor-pointer transition-colors"
                >
                  <input type="file" ref={fileRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  {uploadingImage ? (
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  ) : (
                    <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                  )}
                  <p className="text-sm text-slate-300 mt-2 font-medium">Click to upload images</p>
                </div>
                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-white/[0.08]">
                        <img src={img} className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-black/60 rounded text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="pt-4 flex justify-between">
                  <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-50 text-sm font-semibold">Back</button>
                  <button onClick={() => setStep(3)} className="bg-emerald-500 text-black px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-50">Pricing & Delivery</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => set("price_type", "Robux")} className={cn("p-3 rounded-xl border text-sm font-semibold text-left", form.price_type === "Robux" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-white/[0.08] bg-[#090A0F] text-slate-300")}>Robux</button>
                  <button onClick={() => set("price_type", "Free")} className={cn("p-3 rounded-xl border text-sm font-semibold text-left", form.price_type === "Free" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-white/[0.08] bg-[#090A0F] text-slate-300")}>Free</button>
                </div>
                {form.price_type === "Robux" && (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Price (R$)</label>
                    <input type="number" value={form.price} onChange={e => set("price", e.target.value)} className="w-full rounded-lg border border-white/[0.08] bg-[#090A0F] px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500/50 font-mono" />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-500">Delivery Links / Codes</label>
                  {form.codes.map((code, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" value={code} onChange={e => { const c = [...form.codes]; c[i] = e.target.value; set("codes", c); }} placeholder="https://..." className="flex-1 rounded-lg border border-white/[0.08] bg-[#090A0F] px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500/50 font-mono" />
                      {form.codes.length > 1 && <button onClick={() => set("codes", form.codes.filter((_, idx) => idx !== i))} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  ))}
                  <button onClick={() => set("codes", [...form.codes, ""])} className="text-emerald-400 text-xs font-semibold flex items-center gap-1">+ Add Link</button>
                </div>
                <div className="pt-4 flex justify-between">
                  <button onClick={() => setStep(2)} className="text-slate-400 hover:text-slate-50 text-sm font-semibold">Back</button>
                  <button onClick={() => setStep(4)} className="bg-emerald-500 text-black px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-50">Review & Publish</h2>
                <div className="bg-[#090A0F] border border-white/[0.08] rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Title</span><span className="text-slate-50 font-medium">{form.title || "Untitled"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Format</span><span className="text-slate-50 font-medium">{form.listing_type}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Price</span><span className="text-emerald-400 font-mono font-medium">{form.price_type === "Free" ? "Free" : `R$ ${form.price}`}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Images</span><span className="text-slate-50 font-medium">{form.images.length}</span></div>
                </div>
                <div className="pt-4 flex justify-between">
                  <button onClick={() => setStep(3)} className="text-slate-400 hover:text-slate-50 text-sm font-semibold">Back</button>
                  <button onClick={handlePublish} disabled={busy} className="bg-emerald-500 text-black px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
                    <CheckCircle2 className="w-4 h-4" />
                    {busy ? "Publishing..." : "Publish"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Live Preview Card */}
          <div className="hidden md:block sticky top-6 self-start">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Live Preview</h3>
            <div className="bg-[#12151E] border border-white/[0.08] rounded-xl overflow-hidden shadow-lg">
              <div className="aspect-[4/3] bg-[#090A0F] relative">
                {form.images[0] ? (
                  <img src={form.images[0]} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                    <Store className="w-8 h-8 opacity-50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-xs font-mono font-bold text-emerald-400 border border-emerald-500/20">
                  {form.price_type === "Free" ? "Free" : `R$ ${form.price || 0}`}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {form.listing_type}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-50 truncate">{form.title || "Untitled Asset"}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{form.description || "Asset description will appear here..."}</p>
                <div className="mt-4 flex gap-1 flex-wrap">
                  {form.tags.slice(0,3).map(t => <span key={t} className="text-[10px] text-slate-500 bg-white/[0.04] px-1.5 py-0.5 rounded">{t}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
