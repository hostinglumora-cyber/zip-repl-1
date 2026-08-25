import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  Sparkles,
  ExternalLink,
  Store,
  Palette,
  Globe,
  MessageCircle,
  Plus,
  Trash2,
  Image,
  Radio,
  Clock,
  DollarSign,
  HelpCircle,
  Layers,
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { localDb } from "@/lib/localDb";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

export default function StorefrontBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    display_name: "",
    roblox_username: "",
    bio: "",
    avatar_url: "",
    banner_url: "",
    accent_color: "emerald",
    theme_bg: "obsidian",
    status: "open",
    status_message: "Currently accepting custom commissions",
    announcement: "",
    services: [] as any[],
    custom_faqs: [] as any[],
    gallery_images: [] as string[],
    social_discord: "",
    social_roblox: "",
    social_youtube: "",
    social_twitter: "",
    social_website: "",
  });

  const set = (k: string, v: any) => setForm((prev) => ({ ...prev, [k]: v }));

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const prof = await localDb.getCreatorProfile(user.username || user.id);
        if (prof) {
          setForm({
            username: prof.username || user.username || "creator",
            display_name: prof.display_name || user.display_name || user.username || "Creator",
            roblox_username: prof.roblox_username || "",
            bio: prof.bio || "ER:LC vehicle liveries, uniform packages & emergency agency packs.",
            avatar_url: prof.avatar_url || user.avatar_url || "",
            banner_url: prof.banner_url || "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80",
            accent_color: prof.accent_color || "emerald",
            theme_bg: prof.theme_bg || "obsidian",
            status: prof.status || "open",
            status_message: prof.status_message || "Currently accepting custom commissions",
            announcement: prof.announcement || "",
            services: prof.services || [],
            custom_faqs: prof.custom_faqs || [],
            gallery_images: prof.gallery_images || [],
            social_discord: prof.social_links?.discord || "",
            social_roblox: prof.social_links?.roblox || "",
            social_youtube: prof.social_links?.youtube || "",
            social_twitter: prof.social_links?.twitter || "",
            social_website: prof.social_links?.website || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  const addService = () => {
    set("services", [
      ...form.services,
      {
        id: `srv_${Date.now()}`,
        title: "Custom ER:LC Vehicle Livery",
        category: "Liveries",
        price: 250,
        delivery_estimate: "24-48 Hours",
        description: "Custom 4K department livery fitted to your server's vehicle fleet.",
        requirements: "Send department logo and vehicle models required.",
      },
    ]);
  };

  const updateService = (index: number, field: string, value: any) => {
    const next = [...form.services];
    next[index] = { ...next[index], [field]: value };
    set("services", next);
  };

  const removeService = (index: number) => {
    set("services", form.services.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    set("custom_faqs", [
      ...form.custom_faqs,
      {
        q: "How do I install liveries once purchased?",
        a: "All purchases include direct Roblox asset IDs and template files with installation instructions.",
      },
    ]);
  };

  const updateFaq = (index: number, field: string, value: string) => {
    const next = [...form.custom_faqs];
    next[index] = { ...next[index], [field]: value };
    set("custom_faqs", next);
  };

  const removeFaq = (index: number) => {
    set("custom_faqs", form.custom_faqs.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const cleanUsername = form.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      const payload = {
        id: `profile_${user?.id || cleanUsername}`,
        user_id: user?.id || "creator_local",
        username: cleanUsername,
        display_name: form.display_name.trim() || cleanUsername,
        roblox_username: form.roblox_username.trim(),
        bio: form.bio.trim(),
        avatar_url: form.avatar_url,
        banner_url: form.banner_url,
        accent_color: form.accent_color,
        theme_bg: form.theme_bg,
        status: form.status,
        status_message: form.status_message,
        announcement: form.announcement,
        services: form.services,
        custom_faqs: form.custom_faqs,
        gallery_images: form.gallery_images,
        social_links: {
          discord: form.social_discord.trim(),
          roblox: form.social_roblox.trim(),
          youtube: form.social_youtube.trim(),
          twitter: form.social_twitter.trim(),
          website: form.social_website.trim(),
        },
        badges: ["LibertyX Creator", "Discord Verified"],
      };

      await localDb.saveCreatorProfile(payload);
      setSavedSuccess(true);
      setTimeout(() => navigate(`/u/${cleanUsername}`), 1000);
    } catch (err: any) {
      setError(err.message || "Failed to save storefront.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* Header */}
        <div className="border-b border-white/[0.06] bg-[#0A0D15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                <Link to="/dashboard" className="hover:text-white transition flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Creator Studio
                </Link>
                <span>/</span>
                <span className="text-emerald-400 font-mono">Storefront Builder</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Personal Marketplace Builder
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/u/${form.username || "me"}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-zinc-300 transition"
              >
                <span>View Live Store</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Builder Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="flex-1">{error}</p>
            </div>
          )}

          {savedSuccess && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs mb-6">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="flex-1">Storefront updated successfully! Opening live storefront…</p>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
            
            {/* 1. Commission Status & Announcement Banner */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-5 shadow-xl">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span>Storefront Status & Announcement Banner</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Control your commission availability status badge and broadcast notice.</p>
              </div>

              {/* Status Radio Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "open", label: "🟢 Open for Commissions", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" },
                  { id: "away", label: "🟡 Away / Slow Queue", color: "border-amber-500/40 bg-amber-500/10 text-amber-400" },
                  { id: "closed", label: "🔴 Closed for Orders", color: "border-rose-500/40 bg-rose-500/10 text-rose-400" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => set("status", s.id)}
                    className={cn(
                      "p-3 rounded-xl border text-xs font-bold transition-all text-left",
                      form.status === s.id
                        ? s.color
                        : "border-white/[0.06] bg-[#07090E] text-zinc-400 hover:text-white"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                  Custom Status Message
                </label>
                <input
                  type="text"
                  value={form.status_message}
                  onChange={(e) => set("status_message", e.target.value)}
                  placeholder="e.g. Currently accepting emergency vehicle livery commissions (24h turnaround)"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                  Top Announcement Strip (Optional)
                </label>
                <input
                  type="text"
                  value={form.announcement}
                  onChange={(e) => set("announcement", e.target.value)}
                  placeholder="e.g. 🔥 New State Police 4K Ghost Fleet pack dropping this Friday!"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* 2. Custom Services & Commissions */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-400" />
                    <span>Custom Services & Commissions</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Offer custom livery, uniform, or server design commissions with Robux pricing.</p>
                </div>

                <button
                  type="button"
                  onClick={addService}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>

              {form.services.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 border border-dashed border-white/[0.06] rounded-xl">
                  No custom services listed yet. Click "+ Add Service" to offer commission slots.
                </div>
              ) : (
                <div className="space-y-4">
                  {form.services.map((srv, idx) => (
                    <div key={srv.id || idx} className="p-4 rounded-xl border border-white/[0.06] bg-[#07090E] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 font-mono">Service #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeService(idx)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-zinc-400 mb-1">Service Title</label>
                          <input
                            type="text"
                            value={srv.title}
                            onChange={(e) => updateService(idx, "title", e.target.value)}
                            placeholder="e.g. Custom Department Livery Pack"
                            className="w-full rounded-lg border border-white/[0.08] bg-[#0A0D15] px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">Price (R$)</label>
                          <input
                            type="number"
                            value={srv.price}
                            onChange={(e) => updateService(idx, "price", parseFloat(e.target.value) || 0)}
                            placeholder="250"
                            className="w-full rounded-lg border border-white/[0.08] bg-[#0A0D15] px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">Delivery Estimate</label>
                          <input
                            type="text"
                            value={srv.delivery_estimate}
                            onChange={(e) => updateService(idx, "delivery_estimate", e.target.value)}
                            placeholder="e.g. 24 - 48 Hours"
                            className="w-full rounded-lg border border-white/[0.08] bg-[#0A0D15] px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">Requirements from Buyer</label>
                          <input
                            type="text"
                            value={srv.requirements}
                            onChange={(e) => updateService(idx, "requirements", e.target.value)}
                            placeholder="e.g. Provide vector logos and vehicle models"
                            className="w-full rounded-lg border border-white/[0.08] bg-[#0A0D15] px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Description & Scope</label>
                        <textarea
                          rows={2}
                          value={srv.description}
                          onChange={(e) => updateService(idx, "description", e.target.value)}
                          placeholder="Detail what is included in this commission..."
                          className="w-full rounded-lg border border-white/[0.08] bg-[#0A0D15] p-2.5 text-xs text-white outline-none focus:border-emerald-500/50 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Custom FAQs */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400" />
                    <span>Storefront Custom FAQs</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Answer common questions from buyers on your storefront.</p>
                </div>

                <button
                  type="button"
                  onClick={addFaq}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              {form.custom_faqs.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 border border-dashed border-white/[0.06] rounded-xl">
                  No custom FAQs added yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {form.custom_faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-white/[0.06] bg-[#07090E] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 font-mono">FAQ #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeFaq(idx)}
                          className="p-1 rounded text-red-400 hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => updateFaq(idx, "q", e.target.value)}
                        placeholder="Question (e.g. Do you accept Robux gamepass payouts?)"
                        className="w-full rounded-lg border border-white/[0.08] bg-[#0A0D15] px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                      />

                      <textarea
                        rows={2}
                        value={faq.a}
                        onChange={(e) => updateFaq(idx, "a", e.target.value)}
                        placeholder="Answer..."
                        className="w-full rounded-lg border border-white/[0.08] bg-[#0A0D15] p-2.5 text-xs text-white outline-none focus:border-emerald-500/50 resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Storefront…" : "Publish Storefront Updates"}</span>
            </button>

          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
}
