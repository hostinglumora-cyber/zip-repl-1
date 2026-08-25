import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, User, Check, ArrowLeft } from "lucide-react";
import { safeReturnTo } from "@/lib/authReturnTo";
import Logo from "@/components/Logo";

export default function Login() {
  const returnTo = safeReturnTo() || "/dashboard";
  const [customUsername, setCustomUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  // Generate OAuth URL supporting Token Grant for direct client-side fetch
  const redirectUri = encodeURIComponent(window.location.origin + "/auth/discord/callback");
  const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=1378231778292142172&response_type=token&redirect_uri=${redirectUri}&scope=identify`;

  const AVATARS = [
    { id: 0, url: "https://cdn.discordapp.com/embed/avatars/0.png", label: "Blue" },
    { id: 1, url: "https://cdn.discordapp.com/embed/avatars/1.png", label: "Gray" },
    { id: 2, url: "https://cdn.discordapp.com/embed/avatars/2.png", label: "Green" },
    { id: 3, url: "https://cdn.discordapp.com/embed/avatars/3.png", label: "Yellow" },
    { id: 4, url: "https://cdn.discordapp.com/embed/avatars/4.png", label: "Red" },
  ];

  const handleQuickConnect = (usernameToUse?: string, avatarIdx?: number) => {
    const finalUsername = (usernameToUse || customUsername || "creator").replace(/^@/, "").trim();
    if (!finalUsername) return;

    const avIdx = avatarIdx !== undefined ? avatarIdx : selectedAvatar;
    const user = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: finalUsername,
      username: finalUsername,
      email: `${finalUsername}@libertyx.market`,
      avatarUrl: AVATARS[avIdx].url,
    };

    window.localStorage.setItem("discord_user", JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));
    window.location.href = returnTo;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between px-4 py-10 relative overflow-hidden">
      {/* Top Navbar Back */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <Link to="/">
          <Logo textClass="text-2xl font-black" />
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <div className="rounded-3xl border border-white/[0.1] bg-[#0A0D12] p-8 sm:p-10 shadow-2xl relative">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] mb-4">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white">Login to LibertyX</h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Access the verified marketplace, creator hub, and code delivery escrow.
            </p>
          </div>

          <div className="space-y-4">
            {/* Primary OAuth button */}
            <a
              href={DISCORD_OAUTH_URL}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-sm font-bold text-white transition-all shadow-lg shadow-[#5865F2]/20"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              <span>Login with Discord</span>
            </a>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">or custom handle</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* Direct Discord Username Connect */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
              <label className="block text-xs font-semibold text-zinc-300">
                Connect your Discord handle:
              </label>
              
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono font-bold text-sm">@</span>
                <input
                  type="text"
                  value={customUsername}
                  onChange={(e) => setCustomUsername(e.target.value)}
                  placeholder="sulman"
                  className="w-full rounded-xl border border-white/[0.1] bg-black/60 pl-8 pr-4 py-2.5 text-sm text-white font-medium outline-none focus:border-emerald-500 transition"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customUsername.trim()) {
                      handleQuickConnect();
                    }
                  }}
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <p className="text-[11px] text-zinc-400 mb-2">Select Discord avatar color:</p>
                <div className="flex items-center gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`relative rounded-full transition-all ${
                        selectedAvatar === av.id
                          ? "ring-2 ring-emerald-400 scale-110"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={av.url} alt="" className="w-7 h-7 rounded-full" />
                      {selectedAvatar === av.id && (
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 text-black">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickConnect()}
                disabled={!customUsername.trim()}
                className="w-full mt-2 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-xs font-bold text-black transition flex items-center justify-center gap-2"
              >
                <User className="w-3.5 h-3.5" />
                <span>Connect as @{customUsername.trim() || "username"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Demo Preset Profiles */}
            <div className="pt-2">
              <p className="text-[11px] text-zinc-500 mb-2 text-center font-medium">Quick 1-click test profiles:</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "sulman", av: 2 },
                  { name: "apex_creator", av: 0 },
                  { name: "erlc_studio", av: 4 },
                ].map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleQuickConnect(p.name, p.av)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2 hover:bg-white/[0.06] hover:border-emerald-500/30 transition text-left"
                  >
                    <img src={AVATARS[p.av].url} alt="" className="w-5 h-5 rounded-full" />
                    <span className="text-[11px] font-semibold text-zinc-300 truncate">@{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Scam-Shield automatically verifies Discord seller accounts. All code delivery keys are encrypted until transaction settlement.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} LibertyX Marketplace. Protected by Scam-Shield escrow.
      </div>
    </div>
  );
}
