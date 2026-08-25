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
  User,
  ShieldCheck,
  Globe,
  MessageCircle,
  Youtube,
  Twitter,
  Image,
  Pin,
  Check,
  X,
} from "lucide-react";

import SiteNav from "@/components/SiteNav";
import { Footer } from "@/pages/Home";
import { localDb } from "@/lib/localDb";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const db = (globalThis as any).__B44_DB__ || localDb;

const ACCENT_OPTIONS = [
  { id: "emerald", label: "Emerald Matrix", color: "bg-emerald-500", border: "border-emerald-500" },
  { id: "cyan", label: "Cyber Cyan", color: "bg-cyan-500", border: "border-cyan-500" },
  { id: "violet", label: "Deep Violet", color: "bg-violet-500", border: "border-violet-500" },
  { id: "amber", label: "Amber Hazard", color: "bg-amber-500", border: "border-amber-500" },
  { id: "crimson", label: "Crimson Emergency", color: "bg-rose-500", border: "border-rose-500" },
];

const PRESET_BANNERS = [
  { id: "patrol", label: "Police Fleet Grid", url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80" },
  { id: "sheriff", label: "Tactical Interceptor", url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80" },
  { id: "night", label: "Obsidian High-Speed", url: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=80" },
  { id: "fire", label: "Emergency Heavy Rescue", url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1600&q=80" },
];

export default function ProfileCustomization() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState("");
  const [myListings, setMyListings] = useState<any[]>([]);

  const [form, setForm] = useState({
    username: "",
    display_name: "",
    roblox_username: "",
    bio: "",
    avatar_url: "",
    banner_url: "",
    accent_color: "emerald",
    theme_bg: "obsidian",
    social_discord: "",
    social_roblox: "",
    social_youtube: "",
    social_twitter: "",
    social_website: "",
    featured_listing_ids: [] as string[],
    show_activity: true,
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
            bio: prof.bio || "ER:LC vehicle liveries, uniforms & emergency packs.",
            avatar_url: prof.avatar_url || user.avatar_url || "",
            banner_url: prof.banner_url || PRESET_BANNERS[0].url,
            accent_color: prof.accent_color || "emerald",
            theme_bg: prof.theme_bg || "obsidian",
            social_discord: prof.social_links?.discord || "",
            social_roblox: prof.social_links?.roblox || "",
            social_youtube: prof.social_links?.youtube || "",
            social_twitter: prof.social_links?.twitter || "",
            social_website: prof.social_links?.website || "",
            featured_listing_ids: prof.featured_listing_ids || [],
            show_activity: prof.show_activity ?? true,
          });
        } else {
          setForm((prev) => ({
            ...prev,
            username: user.username || "creator",
            display_name: user.display_name || user.username || "Creator",
            avatar_url: user.avatar_url || "",
            banner_url: PRESET_BANNERS[0].url,
          }));
        }

        // Load creator listings for featured selection
        const listingQuery = db?.entities?.Listing?.filter || localDb.entities.Listing.filter;
        const allListings: any[] = await listingQuery({ status: "active" }, "-created_date", 50);
        const myItems = allListings.filter(
          (l) => l.seller_id === user.id || l.seller_username === user.username
        );
        setMyListings(myItems);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Avatar image must be 5 MB or smaller.");
      return;
    }
    const url = URL.createObjectURL(file);
    set("avatar_url", url);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Banner image must be 8 MB or smaller.");
      return;
    }
    const url = URL.createObjectURL(file);
    set("banner_url", url);
  };

  const toggleFeatured = (id: string) => {
    const isCurrent = form.featured_listing_ids.includes(id);
    if (isCurrent) {
      set("featured_listing_ids", form.featured_listing_ids.filter((x) => x !== id));
    } else {
      if (form.featured_listing_ids.length >= 4) {
        setError("You can feature up to 4 listings at a time.");
        return;
      }
      set("featured_listing_ids", [...form.featured_listing_ids, id]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    setSavedSuccess(false);

    try {
      const cleanUsername = form.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      if (!cleanUsername || cleanUsername.length < 3) {
        throw new Error("Username must be at least 3 characters long and alphanumeric.");
      }

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
        social_links: {
          discord: form.social_discord.trim(),
          roblox: form.social_roblox.trim(),
          youtube: form.social_youtube.trim(),
          twitter: form.social_twitter.trim(),
          website: form.social_website.trim(),
        },
        featured_listing_ids: form.featured_listing_ids,
        show_activity: form.show_activity,
        badges: ["LibertyX Creator", "Discord Verified"],
      };

      await localDb.saveCreatorProfile(payload);
      setSavedSuccess(true);
      setTimeout(() => {
        navigate(`/u/${cleanUsername}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        {/* Studio Sub-Header */}
        <div className="border-b border-white/[0.06] bg-[#0A0D15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                <Link to="/dashboard" className="hover:text-white transition flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Creator Studio
                </Link>
                <span>/</span>
                <span className="text-emerald-400 font-mono">Storefront Settings</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Customize Public Creator Storefront
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/u/${form.username || "me"}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-zinc-300 transition"
              >
                <span>View Live Profile</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Form + Live Preview */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="flex-1">{error}</p>
              <button onClick={() => setError("")}>
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          )}

          {savedSuccess && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs mb-6">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="flex-1">Profile saved successfully! Redirecting to storefront…</p>
            </div>
          )}

          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* ─── LEFT COLUMN: SETTINGS (7 cols) ─── */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Identity & Handle */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-5 shadow-xl">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Creator Identity & URL</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Your unique public profile handle and display name.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={form.display_name}
                      onChange={(e) => set("display_name", e.target.value)}
                      placeholder="e.g. Oumar Designs"
                      required
                      className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                      Unique Handle * (/u/...)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500">
                        @
                      </span>
                      <input
                        type="text"
                        value={form.username}
                        onChange={(e) => set("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                        placeholder="oumar"
                        required
                        className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] pl-8 pr-3.5 py-2.5 text-xs text-white font-mono placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                    Roblox Username (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.roblox_username}
                    onChange={(e) => set("roblox_username", e.target.value)}
                    placeholder="e.g. Oumar_ERLC"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                    Creator Bio
                  </label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => set("bio", e.target.value)}
                    placeholder="Describe your ER:LC livery design studio, vehicle specialties, and release schedule..."
                    className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] p-3 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 resize-none"
                  />
                </div>
              </div>

              {/* 2. Visual Theme & Media */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-5 shadow-xl">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-emerald-400" />
                    <span>Appearance & Visual Theme</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Customize your storefront's accent highlights and header banner.</p>
                </div>

                {/* Accent Color Picker */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                    Storefront Accent Color
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {ACCENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => set("accent_color", opt.id)}
                        className={cn(
                          "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all",
                          form.accent_color === opt.id
                            ? "border-white/40 bg-white/[0.06] text-white shadow-sm"
                            : "border-white/[0.06] bg-[#07090E] text-zinc-400 hover:text-white"
                        )}
                      >
                        <span className={cn("w-3 h-3 rounded-full shrink-0", opt.color)} />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar & Banner Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                      Avatar Image
                    </label>
                    <input
                      ref={avatarFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <button
                      type="button"
                      onClick={() => avatarFileRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/[0.12] bg-[#07090E] hover:border-emerald-500/40 text-xs font-semibold text-zinc-300 hover:text-white transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Upload Avatar</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                      Banner Image
                    </label>
                    <input
                      ref={bannerFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerUpload}
                    />
                    <button
                      type="button"
                      onClick={() => bannerFileRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/[0.12] bg-[#07090E] hover:border-emerald-500/40 text-xs font-semibold text-zinc-300 hover:text-white transition"
                    >
                      <Image className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Upload Custom Banner</span>
                    </button>
                  </div>
                </div>

                {/* Preset Banners */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                    Or Choose Preset Banner
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_BANNERS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => set("banner_url", b.url)}
                        className={cn(
                          "relative aspect-[16/9] rounded-xl overflow-hidden border-2 transition-all group",
                          form.banner_url === b.url ? "border-emerald-400 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <img src={b.url} alt="" className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/80 py-0.5 text-[9px] font-mono text-center text-zinc-300">
                          {b.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Verified Social Links */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4 shadow-xl">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>Social & Community Connections</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Link your verified Discord server, Roblox group, or social channels.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Discord Server / Invite URL</label>
                    <input
                      type="url"
                      value={form.social_discord}
                      onChange={(e) => set("social_discord", e.target.value)}
                      placeholder="https://discord.gg/your-server"
                      className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Roblox Group / Profile URL</label>
                    <input
                      type="url"
                      value={form.social_roblox}
                      onChange={(e) => set("social_roblox", e.target.value)}
                      placeholder="https://www.roblox.com/groups/..."
                      className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">YouTube Channel URL</label>
                    <input
                      type="url"
                      value={form.social_youtube}
                      onChange={(e) => set("social_youtube", e.target.value)}
                      placeholder="https://youtube.com/@..."
                      className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">X / Twitter URL</label>
                    <input
                      type="url"
                      value={form.social_twitter}
                      onChange={(e) => set("social_twitter", e.target.value)}
                      placeholder="https://x.com/..."
                      className="w-full rounded-xl border border-white/[0.08] bg-[#07090E] px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Pinned Featured Listings */}
              {myListings.length > 0 && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] p-6 space-y-4 shadow-xl">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Pin className="w-4 h-4 text-emerald-400" />
                      <span>Pinned Featured Products (Max 4)</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">Select products to spotlight at the top of your public storefront.</p>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {myListings.map((l) => {
                      const isChecked = form.featured_listing_ids.includes(l.id);
                      return (
                        <div
                          key={l.id}
                          onClick={() => toggleFeatured(l.id)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                            isChecked
                              ? "border-emerald-500/40 bg-emerald-500/10 text-white"
                              : "border-white/[0.06] bg-[#07090E] text-zinc-400 hover:border-white/[0.12]"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-bold text-white truncate">{l.title}</span>
                            <span className="text-[10px] font-mono text-emerald-400 uppercase">{l.category}</span>
                          </div>
                          <div className={cn(
                            "w-4 h-4 rounded flex items-center justify-center text-black",
                            isChecked ? "bg-emerald-500" : "border border-white/20"
                          )}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Changes…" : "Save Public Storefront"}</span>
              </button>

            </div>

            {/* ─── RIGHT COLUMN: LIVE STOREFRONT CARD PREVIEW (5 cols) ─── */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  Live Storefront Mini-Preview
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  /u/{form.username || "username"}
                </span>
              </div>

              {/* Mini Profile Card */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D15] overflow-hidden shadow-2xl">
                {/* Banner */}
                <div className="relative h-28 w-full bg-black/60 overflow-hidden">
                  <img
                    src={form.banner_url || PRESET_BANNERS[0].url}
                    alt=""
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D15] via-transparent to-transparent" />
                </div>

                {/* Avatar & Info */}
                <div className="p-5 -mt-10 space-y-3 relative z-10">
                  <div className="flex items-end justify-between">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-500 bg-black shadow-lg ring-4 ring-[#0A0D15]">
                      {form.avatar_url ? (
                        <img src={form.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-black text-white bg-zinc-900">
                          {(form.display_name || form.username || "C").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      Verified Creator
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {form.display_name || "Creator Name"}
                    </h3>
                    <p className="text-xs font-mono text-zinc-400">@{form.username || "username"}</p>
                  </div>

                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {form.bio || "Your bio will be displayed here for all visitors."}
                  </p>

                  <div className="pt-3 border-t border-white/[0.04] grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-[#07090E]">
                      <span className="text-[10px] text-zinc-500 block font-mono">Products</span>
                      <span className="font-mono font-bold text-white">{myListings.length}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#07090E]">
                      <span className="text-[10px] text-zinc-500 block font-mono">Rating</span>
                      <span className="font-mono font-bold text-emerald-400">5.0 ★</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#07090E]">
                      <span className="text-[10px] text-zinc-500 block font-mono">Status</span>
                      <span className="font-mono font-bold text-zinc-300">Live</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip Card */}
              <div className="p-4 rounded-xl border border-white/[0.06] bg-[#0A0D15]/60 text-xs text-zinc-400 space-y-1">
                <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Public Storefront Protection</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-500">
                  Your private transactions and revenues are never shown on your public profile page.
                </p>
              </div>

            </div>

          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
}
