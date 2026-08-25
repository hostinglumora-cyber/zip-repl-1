import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { safeReturnTo } from "@/lib/authReturnTo";
import Logo from "@/components/Logo";

export default function Login() {
  const returnTo = safeReturnTo() || "/dashboard";

  // Discord OAuth URL with implicit grant token callback for instant profile & avatar sync
  const redirectUri = encodeURIComponent(window.location.origin + "/auth/discord/callback");
  const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=1378231778292142172&response_type=token&redirect_uri=${redirectUri}&scope=identify`;

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      
      {/* Top Header */}
      <header className="h-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <Link to="/">
          <Logo textClass="text-2xl font-black" />
        </Link>
      </header>

      {/* Main Login Area */}
      <main className="max-w-md w-full mx-auto px-4 py-8">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0A0D15] p-8 sm:p-10 shadow-2xl text-center space-y-6">
          
          {/* Discord Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] flex items-center justify-center mx-auto shadow-inner">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Sign in with Discord</h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Connect your Discord account to browse, purchase, or publish verified ER:LC assets.
            </p>
          </div>

          {/* Integrated OAuth Button */}
          <div>
            <a
              href={DISCORD_OAUTH_URL}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-sm font-bold text-white transition-all shadow-xl shadow-[#5865F2]/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              <span>Continue with Discord</span>
            </a>
          </div>

          <div className="pt-2 text-[11px] text-zinc-500">
            By signing in, you agree to our{" "}
            <Link to="/tos" className="text-zinc-400 underline hover:text-white">Terms</Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-zinc-400 underline hover:text-white">Privacy Policy</Link>.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-white/[0.06] flex items-center justify-center text-xs text-zinc-600">
        © {new Date().getFullYear()} LibertyX Marketplace.
      </footer>
    </div>
  );
}
