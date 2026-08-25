import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  HelpCircle,
  Radio,
  Store,
} from "lucide-react";

import PageShell from "@/components/PageShell";
import { localDb } from "@/lib/localDb";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

export default function StorefrontBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    display_name: "",
    status: "open",
    status_message: "Currently accepting custom commissions",
    announcement: "",
    services: [] as any[],
    custom_faqs: [] as any[],
  });

  const set = (k: string, v: any) => setForm((prev) => ({ ...prev, [k]: v }));

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const prof = await localDb.getCreatorProfile(user.username || user.id);
        if (prof) {
          setForm((f) => ({
            ...f,
            username: prof.username || user.username || "creator",
            display_name: prof.display_name || user.display_name || user.username || "Creator",
            status: prof.status || "open",
            status_message: prof.status_message || "Currently accepting custom commissions",
            announcement: prof.announcement || "",
            services: prof.services || [],
            custom_faqs: prof.custom_faqs || [],
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [user]);

  const addService = () => {
    set("services", [
      ...form.services,
      {
        id: `srv_${Date.now()}`,
        title: "Custom Service",
        price: 0,
        description: "",
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
    set("custom_faqs", [...form.custom_faqs, { q: "", a: "" }]);
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
        status: form.status,
        status_message: form.status_message,
        announcement: form.announcement,
        services: form.services,
        custom_faqs: form.custom_faqs,
      };

      await localDb.saveCreatorProfile(payload as any);
      setSavedSuccess(true);
      setTimeout(() => navigate(`/u/${cleanUsername}`), 1000);
    } catch (err: any) {
      setError(err.message || "Failed to save storefront.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell noPadding fullWidth>
      <div className="min-h-[calc(100vh-56px)] bg-[#090A0F] text-slate-50 flex flex-col md:flex-row">
        
        {/* Left: Settings Panel */}
        <div className="w-full md:w-[450px] shrink-0 bg-[#12151E] border-r border-white/[0.08] flex flex-col h-[calc(100vh-56px)] md:sticky md:top-[56px] overflow-y-auto">
          <div className="p-4 border-b border-white/[0.08] sticky top-0 bg-[#12151E]/90 backdrop-blur z-10 flex items-center justify-between">
            <Link to="/dashboard" className="text-slate-400 hover:text-slate-50 transition p-1">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-sm font-semibold text-slate-50">Storefront Builder</h1>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>

          <div className="p-5 space-y-8">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            {savedSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Saved successfully
              </div>
            )}

            {/* Status */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-3.5 h-3.5" /> Status & Announce
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: "open", label: "Open for Commissions" },
                  { id: "away", label: "Away / Slow Queue" },
                  { id: "closed", label: "Closed for Orders" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => set("status", s.id)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-semibold text-left border transition-colors",
                      form.status === s.id
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-white/[0.08] bg-[#090A0F] text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={form.status_message}
                onChange={(e) => set("status_message", e.target.value)}
                placeholder="Status Message..."
                className="w-full rounded-lg border border-white/[0.08] bg-[#090A0F] px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 outline-none focus:border-emerald-500/50"
              />
              <input
                type="text"
                value={form.announcement}
                onChange={(e) => set("announcement", e.target.value)}
                placeholder="Top Announcement Strip..."
                className="w-full rounded-lg border border-white/[0.08] bg-[#090A0F] px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Services */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Store className="w-3.5 h-3.5" /> Services
                </h2>
                <button type="button" onClick={addService} className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold">
                  + Add
                </button>
              </div>
              <div className="space-y-3">
                {form.services.map((srv, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-white/[0.08] bg-[#090A0F] space-y-2 relative group">
                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="text"
                      value={srv.title}
                      onChange={(e) => updateService(idx, "title", e.target.value)}
                      placeholder="Service Title"
                      className="w-full bg-transparent text-sm font-semibold text-slate-50 outline-none"
                    />
                    <input
                      type="number"
                      value={srv.price}
                      onChange={(e) => updateService(idx, "price", parseFloat(e.target.value) || 0)}
                      placeholder="Price (R$)"
                      className="w-full bg-transparent text-xs text-emerald-400 font-mono outline-none"
                    />
                    <textarea
                      rows={2}
                      value={srv.description}
                      onChange={(e) => updateService(idx, "description", e.target.value)}
                      placeholder="Description"
                      className="w-full bg-transparent text-xs text-slate-400 outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5" /> FAQs
                </h2>
                <button type="button" onClick={addFaq} className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold">
                  + Add
                </button>
              </div>
              <div className="space-y-3">
                {form.custom_faqs.map((faq, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-white/[0.08] bg-[#090A0F] space-y-2 relative group">
                    <button
                      type="button"
                      onClick={() => removeFaq(idx)}
                      className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => updateFaq(idx, "q", e.target.value)}
                      placeholder="Question"
                      className="w-full bg-transparent text-sm font-semibold text-slate-50 outline-none pr-6"
                    />
                    <textarea
                      rows={2}
                      value={faq.a}
                      onChange={(e) => updateFaq(idx, "a", e.target.value)}
                      placeholder="Answer"
                      className="w-full bg-transparent text-xs text-slate-400 outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 p-4 md:p-8 bg-[#090A0F] overflow-y-auto hidden md:block">
          <div className="max-w-3xl mx-auto rounded-xl border border-white/[0.08] bg-[#12151E] overflow-hidden">
            {form.announcement && (
              <div className="bg-emerald-500 text-black text-xs font-bold text-center py-2 px-4">
                {form.announcement}
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-50">{form.display_name}</h2>
              <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium border border-white/[0.08] bg-[#1C212E]">
                <span className={cn("w-2 h-2 rounded-full", form.status === "open" ? "bg-emerald-400" : form.status === "away" ? "bg-yellow-400" : "bg-red-400")} />
                <span className="text-slate-300">{form.status_message}</span>
              </div>
              
              {form.services.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-bold text-slate-50">Services</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {form.services.map((s, i) => (
                      <div key={i} className="p-4 rounded-xl border border-white/[0.08] bg-[#090A0F]">
                        <h4 className="text-sm font-semibold text-slate-50">{s.title || "Untitled"}</h4>
                        <p className="text-xs text-slate-400 mt-1">{s.description || "No description"}</p>
                        <p className="text-sm font-mono text-emerald-400 mt-2">R$ {s.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {form.custom_faqs.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-bold text-slate-50">FAQ</h3>
                  <div className="space-y-3">
                    {form.custom_faqs.map((f, i) => (
                      <div key={i} className="p-4 rounded-xl border border-white/[0.08] bg-[#090A0F]">
                        <h4 className="text-sm font-semibold text-slate-50">{f.q || "Question"}</h4>
                        <p className="text-xs text-slate-400 mt-1">{f.a || "Answer"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </PageShell>
  );
}
