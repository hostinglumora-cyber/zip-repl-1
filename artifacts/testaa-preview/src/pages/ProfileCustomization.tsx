import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Save, AlertCircle, CheckCircle2, Upload, Image } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
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
  
  const [form, setForm] = useState({
    username: "",
    display_name: "",
    roblox_username: "",
    bio: "",
    avatar_url: "",
    banner_url: "",
    accent_color: "emerald",
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
            bio: prof.bio || "ER:LC vehicle liveries, uniforms & emergency packs.",
            avatar_url: prof.avatar_url || user.avatar_url || "",
            banner_url: prof.banner_url || PRESET_BANNERS[0].url,
            accent_color: prof.accent_color || "emerald",
            social_discord: prof.social_links?.discord || "",
            social_roblox: prof.social_links?.roblox || "",
            social_youtube: prof.social_links?.youtube || "",
            social_twitter: prof.social_links?.twitter || "",
            social_website: prof.social_links?.website || "",
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
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

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
        social_links: {
          discord: form.social_discord.trim(),
          roblox: form.social_roblox.trim(),
          youtube: form.social_youtube.trim(),
          twitter: form.social_twitter.trim(),
          website: form.social_website.trim(),
        },
      };

      await localDb.saveCreatorProfile(payload);
      setSavedSuccess(true);
      setTimeout(() => navigate(`/u/${cleanUsername}`), 1000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell>
      <PageHeader title="Customize Profile" description="Update your public storefront appearance and details." />
      
      <div className="max-w-2xl">
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {savedSuccess && (
          <div className="flex items-center gap-2 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm mb-6">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <p>Profile saved successfully!</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-50">Identity</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Display Name</label>
                <input
                  type="text"
                  value={form.display_name}
                  onChange={(e) => set("display_name", e.target.value)}
                  className="w-full rounded-lg border border-white/[0.08] bg-[#090A0F] px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => set("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  className="w-full rounded-lg border border-white/[0.08] bg-[#090A0F] px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Bio</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                className="w-full rounded-lg border border-white/[0.08] bg-[#090A0F] px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500/50 resize-none"
              />
            </div>
          </div>

          <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-50">Visuals</h2>
            
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Accent Color</label>
              <div className="flex flex-wrap gap-2">
                {ACCENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => set("accent_color", opt.id)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border text-sm transition-colors",
                      form.accent_color === opt.id
                        ? "border-white/[0.18] bg-white/[0.06] text-slate-50"
                        : "border-white/[0.08] bg-[#090A0F] text-slate-400 hover:text-slate-200"
                    )}
                  >
                    <span className={cn("w-3 h-3 rounded-full", opt.color)} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#12151E] border border-white/[0.08] rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-50">Social Links</h2>
            <div className="space-y-3">
              <input
                type="url"
                value={form.social_discord}
                onChange={(e) => set("social_discord", e.target.value)}
                placeholder="Discord URL"
                className="w-full rounded-lg border border-white/[0.08] bg-[#090A0F] px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500/50"
              />
              <input
                type="url"
                value={form.social_roblox}
                onChange={(e) => set("social_roblox", e.target.value)}
                placeholder="Roblox Group URL"
                className="w-full rounded-lg border border-white/[0.08] bg-[#090A0F] px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg px-6 py-2.5 text-sm transition active:scale-[0.98] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Profile"}</span>
          </button>
        </form>
      </div>
    </PageShell>
  );
}
