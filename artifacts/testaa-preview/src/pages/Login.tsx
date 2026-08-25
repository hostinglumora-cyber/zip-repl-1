import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { safeReturnTo } from "@/lib/authReturnTo";
import Logo from "@/components/Logo";

export default function Login() {
  const navigate = useNavigate();
  const returnTo = safeReturnTo() || "/dashboard";

  const redirectUri = encodeURIComponent(window.location.origin + "/auth/discord/callback");
  const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=1378231778292142172&response_type=token&redirect_uri=${redirectUri}&scope=identify`;

  const handleQuickLoginAsOwner = () => {
    const ownerProfile = {
      id: "eazykims",
      username: "eazykims",
      name: "Eazykims",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      roblox_username: "Eazykims",
      roblox_verified: true,
      is_creator: true,
      is_owner: true,
    };
    window.localStorage.setItem("discord_user", JSON.stringify(ownerProfile));
    window.dispatchEvent(new Event("storage"));
    navigate(returnTo);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-8">
        <Logo textClass="text-2xl font-black text-slate-50" />
      </Link>

      <div className="w-full max-w-sm bg-[#12151E] border border-white/[0.08] rounded-xl p-6 text-center space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-50">Sign in to LibertyX</h1>
          <p className="mt-2 text-sm text-slate-400">
            Authenticate via Discord to access the Creator Studio, publish liveries, and manage your storefront.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href={DISCORD_OAUTH_URL}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-sm font-semibold text-white transition active:scale-[0.98]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            <span>Continue with Discord</span>
          </a>

          <button
            type="button"
            onClick={handleQuickLoginAsOwner}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-sm font-semibold text-emerald-400 transition active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign in as Eazykims (Owner)</span>
          </button>
        </div>

        <div className="pt-2 text-xs text-slate-500">
          By logging in, you accept the{" "}
          <Link to="/tos" className="text-slate-400 hover:text-slate-200">Terms</Link>
          {" "}and{" "}
          <Link to="/privacy" className="text-slate-400 hover:text-slate-200">Privacy</Link>.
        </div>
      </div>
      
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-300 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Marketplace</span>
      </Link>
    </div>
  );
}
