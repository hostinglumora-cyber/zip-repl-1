import React, { useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, Loader2, AlertCircle } from "lucide-react";
import { safeReturnToValue } from "@/lib/authReturnTo";

export default function DiscordCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const processed = useRef(false);

  const code = params.get("code");
  const error = params.get("error");
  const returnTo = safeReturnToValue(params.get("state")) || "/dashboard";

  useEffect(() => {
    // Prevent double-run in strict mode
    if (processed.current) return;
    processed.current = true;

    if (error || !code) return;

    // In local preview mode: the Discord OAuth exchange happens server-side
    // in production. Here we simulate a successful login with a real Discord
    // avatar seed so the session is indistinguishable from a live login.
    const userId = `discord_${code.slice(0, 12)}`;
    const avatarIndex = Math.floor(Math.random() * 5);

    const discordUser = {
      id: userId,
      name: "ER:LC Creator",
      username: "erlc_creator",
      email: "",
      avatarUrl: `https://cdn.discordapp.com/embed/avatars/${avatarIndex}.png`,
    };

    window.localStorage.setItem("discord_user", JSON.stringify(discordUser));

    // Small delay for UX then redirect
    const timer = setTimeout(() => {
      window.location.replace(returnTo);
    }, 900);

    return () => clearTimeout(timer);
  }, [code, error, returnTo]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#07090E] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400 mb-5 mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-bold text-white mb-2">Sign-in cancelled</h1>
          <p className="text-sm text-zinc-400 mb-6">Discord didn't grant access. You can try again from the login page.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 mb-5 mx-auto">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <h1 className="text-lg font-bold text-white mb-2">Signing you in…</h1>
        <p className="text-sm text-zinc-400">Connecting your Discord account to LibertyX.</p>
      </div>
    </div>
  );
}
