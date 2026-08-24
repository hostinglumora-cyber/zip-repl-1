const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Upload, X, ShieldCheck, Package, Code2, Gift, Boxes } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import SiteNav from "@/components/SiteNav";
import { DEPARTMENTS, ERLC_TAG, CATEGORIES, LISTING_TYPES } from "@/lib/departments";
import { Image } from "@/components/ui/image";

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
    category: "",
    departments: [],
    title: "",
    headline: "",
    description: "",
    price_type: "Free",
    price: 0,
    images: [],
    codes: [],
    bundle_items: [],
    agreed: false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [bundleInput, setBundleInput] = useState("");

  const update = (patch) => setForm({ ...form, ...patch });

  const toggleDept = (id) => {
    update({ departments: form.departments.includes(id) ? form.departments.filter((d) => d !== id) : [...form.departments, id] });
  };

  const handleFiles = async (files) => {
    if (form.images.length + files.length > 10) { alert("Maximum 10 images."); return; }
    setUploading(true);
    try {
      const urls = [];
      for (const file of Array.from(files).slice(0, 10 - form.images.length)) {
        const { file_url } = await db.integrations.Core.UploadFile({ file });
        urls.push(file_url);
      }
      update({ images: [...form.images, ...urls] });
    } catch (e) { alert("Upload failed."); } finally { setUploading(false); }
  };

  const addCode = () => {
    if (codeInput.trim()) { update({ codes: [...form.codes, codeInput.trim()] }); setCodeInput(""); }
  };
  const addBundleItem = () => {
    if (bundleInput.trim()) { update({ bundle_items: [...form.bundle_items, bundleInput.trim()] }); setBundleInput(""); }
  };

  const canNext = () => {
    if (step === 0) return form.listing_type && form.category;
    if (step === 1) return form.title.trim() && form.departments.length > 0;
    if (step === 2) return form.images.length > 0;
    if (step === 3) return true;
    if (step === 4) return form.agreed;
    return true;
  };

  const submit = async () => {
    if (!user) return navigate("/login");
    setSaving(true);
    try {
      const pt = form.listing_type === "Free" ? "Free" : form.price_type;
      const record = await db.entities.Listing.create({
        title: form.title.trim(),
        headline: form.headline.trim(),
        description: form.description.trim(),
        listing_type: form.listing_type,
        category: form.category,
        departments: form.departments,
        images: form.images,
        codes: form.codes,
        bundle_items: form.bundle_items,
        price_type: pt,
        price: pt === "Free" ? 0 : Number(form.price) || 0,
        currency: "ROBUX",
        status: "active",
        seller_id: user.id,
        seller_name: user.display_name || user.full_name || user.email,
      });
      navigate(`/listing/${record.id}`);
    } catch (e) { alert("Could not create listing. Please try again."); } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-9 h-9 rounded-full grid place-items-center text-sm font-semibold transition ${
                  i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary/15 border border-primary text-primary" : "bg-secondary text-muted-foreground/50 border border-border"
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i <= step ? "text-foreground" : "text-muted-foreground/50"}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
          {/* Step 1: Type + Category */}
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-1">Listing type</h2>
              <p className="text-muted-foreground mb-6">What are you listing?</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {LISTING_TYPES.map((t) => {
                  const Icon = TYPE_ICONS[t.id];
                  return (
                    <button key={t.id} onClick={() => update({ listing_type: t.id, price_type: t.id === "Free" ? "Free" : form.price_type })}
                      className={`text-left p-4 rounded-xl border transition flex items-start gap-3 ${form.listing_type === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 bg-secondary/30"}`}>
                      <div className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${form.listing_type === t.id ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}><Icon className="w-5 h-5" /></div>
                      <div><div className="font-semibold mb-0.5">{t.id}</div><div className="text-sm text-muted-foreground">{t.desc}</div></div>
                    </button>
                  );
                })}
              </div>

              <h3 className="text-lg font-bold mb-1">Category</h3>
              <p className="text-muted-foreground text-sm mb-4">Pick the asset category.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {CATEGORIES.map((c) => (
                  <button key={c.id} onClick={() => update({ category: c.id })}
                    className={`text-left p-4 rounded-xl border transition ${form.category === c.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 bg-secondary/30"}`}>
                    <div className="font-semibold mb-0.5">{c.id}</div>
                    <div className="text-sm text-muted-foreground">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold mb-1">Listing details</h2>
                <p className="text-muted-foreground mb-6">Tell buyers what this is.</p>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Title</label>
                <input value={form.title} onChange={(e) => update({ title: e.target.value })} placeholder="e.g. River City Police Livery Pack v2" className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Headline <span className="text-muted-foreground/50">(optional)</span></label>
                <input value={form.headline} onChange={(e) => update({ headline: e.target.value })} placeholder="Everything you need to launch your department." className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => update({ description: e.target.value })} rows={4} placeholder="Describe what's includedâ¦" className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Department tags</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map((t) => {
                    const on = form.departments.includes(t.id);
                    return (
                      <button key={t.id} onClick={() => toggleDept(t.id)} className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition ${on ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"}`}>
                        {t.logo ? (
                          <span className="w-5 h-5 rounded-full overflow-hidden bg-transparent grid place-items-center"><Image src={t.logo} fittingType="contain" className="w-full h-full object-contain mix-blend-screen" /></span>
                        ) : (
                          <span className="w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold" style={{ background: t.color, color: "#000" }}>{t.id[0]}</span>
                        )}
                        <span className="text-sm">{t.name}</span>
                        {on && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bundle items */}
              {form.listing_type === "Bundle" && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Included assets</label>
                  <div className="flex gap-2 mb-3">
                    <input value={bundleInput} onChange={(e) => setBundleInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBundleItem())} placeholder="e.g. 5 Police Liveries" className="flex-1 bg-secondary border border-border rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary/50" />
                    <button onClick={addBundleItem} className="px-4 py-2.5 rounded-lg bg-secondary border border-border hover:bg-secondary/70 text-sm font-medium">Add</button>
                  </div>
                  {form.bundle_items.length > 0 && (
                    <div className="space-y-2">
                      {form.bundle_items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-2">
                          <Package className="w-4 h-4 text-primary shrink-0" />
                          <span className="flex-1 text-sm">{item}</span>
                          <button onClick={() => update({ bundle_items: form.bundle_items.filter((_, idx) => idx !== i) })} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Payment */}
              {form.listing_type !== "Free" && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Payment method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Free", "Robux"].map((p) => (
                      <button key={p} onClick={() => update({ price_type: p })} className={`py-2.5 rounded-lg border text-sm font-medium transition ${form.price_type === p ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>{p}</button>
                    ))}
                  </div>
                  {form.price_type === "Robux" && (
                    <div className="mt-3">
                      <label className="block text-sm text-muted-foreground mb-1.5">Price (Robux)</label>
                      <input type="number" min="0" value={form.price} onChange={(e) => update({ price: e.target.value })} className="w-full bg-secondary border border-border rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary/50" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Media */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-1">Add media</h2>
              <p className="text-muted-foreground mb-6">Upload up to 10 photos of your asset.</p>
              <label className="block border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-10 text-center cursor-pointer transition">
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-foreground font-medium">{uploading ? "Uploadingâ¦" : "Click to upload"}</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10 images</p>
              </label>
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-5">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-secondary group">
                      <Image src={url} fittingType="fill" className="w-full h-full" />
                      <button onClick={() => update({ images: form.images.filter((_, idx) => idx !== i) })} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-background/80 grid place-items-center opacity-0 group-hover:opacity-100 transition">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-bold">COVER</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Codes */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-1">Add codes</h2>
              <p className="text-muted-foreground mb-6">Paste the codes buyers receive after purchase. These are kept separate from your description and only revealed to buyers.</p>
              <div className="flex gap-2 mb-4">
                <input value={codeInput} onChange={(e) => setCodeInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCode())} placeholder="Paste a codeâ¦" className="flex-1 bg-secondary border border-border rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary/50" />
                <button onClick={addCode} className="px-4 py-2.5 rounded-lg bg-secondary border border-border hover:bg-secondary/70 text-sm font-medium">Add</button>
              </div>
              {form.codes.length > 0 ? (
                <div className="space-y-2">
                  {form.codes.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-2">
                      <span className="text-xs text-muted-foreground/50 font-mono">#{i + 1}</span>
                      <code className="flex-1 text-sm text-primary font-mono truncate">{c}</code>
                      <button onClick={() => update({ codes: form.codes.filter((_, idx) => idx !== i) })} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/50 py-8 text-center">No codes added yet. (Optional for free items)</p>
              )}
            </div>
          )}

          {/* Step 5: Submit */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-1">Review & submit</h2>
              <p className="text-muted-foreground mb-6">Please read and agree to the marketplace rules before listing.</p>
              <div className="rounded-xl border border-border bg-secondary/30 p-5 mb-5 space-y-3 text-sm text-muted-foreground">
                <Rule n="1" text="You may only list assets you created or have rights to sell." />
                <Rule n="2" text="No scams, fake codes, or misrepresentation. Violations result in a permanent ban." />
                <Rule n="3" text="Free listings are always allowed. Paid listings are priced in Robux and processed securely." />
                <Rule n="4" text="By listing you agree to our Privacy Policy and Terms of Service." />
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.agreed} onChange={(e) => update({ agreed: e.target.checked })} className="mt-0.5 w-5 h-5 rounded accent-primary" />
                <span className="text-sm text-muted-foreground">I have read and agree to the <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>, <Link to="/tos" className="text-primary underline">Terms of Service</Link>, and marketplace rules.</span>
              </label>
              <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 p-4 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-muted-foreground">Your listing is protected. Buyers cannot scam you â codes are only released after payment confirmation.</p>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 px-3 py-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(step + 1)} disabled={!canNext()} className="inline-flex items-center gap-1.5 bg-primary hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-primary-foreground font-semibold px-5 py-2.5 rounded-lg text-sm">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit} disabled={!canNext() || saving} className="inline-flex items-center gap-1.5 bg-primary hover:opacity-90 disabled:opacity-30 text-primary-foreground font-semibold px-5 py-2.5 rounded-lg text-sm">
                {saving ? "Publishingâ¦" : "Publish listing"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Rule({ n, text }) {
  return (
    <div className="flex gap-3">
      <span className="w-5 h-5 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-bold shrink-0">{n}</span>
      <p>{text}</p>
    </div>
  );
}