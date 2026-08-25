import React, { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { safeReturnToValue } from "@/lib/authReturnTo";

export default function DiscordCallback() {
  const [params] = useSearchParams();
  const processed = useRef(false);
  const code = params.get("code");
  const error = params.get("error");
  const returnTo = safeReturnToValue(params.get("state")) || "/dashboard";

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    if (error || !code) return;

    const seed = code.slice(0, 8);
    const avatarIdx = Math.abs(parseInt(seed.slice(0, 4), 16)) % 5;
    const discordUser = {
      id: `discord_${seed}`,
      name: `user_${seed}`,
      username: `user_${seed}`,
      email: "",
      avatarUrl: `https://cdn.discordapp.com/embed/avatars/${avatarIdx}.png`,
    };
    window.localStorage.setItem("discord_user", JSON.stringify(discordUser));
    const t = setTimeout(() => { window.location.replace(returnTo); }, 900);
    return () => clearTimeout(t);
  }, [code, error, returnTo]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#050505" }}>
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full mb-5" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
          <AlertCircle className="h-6 w-6" />
        </div>
        <h1 className="text-lg font-bold text-white mb-2">Sign-in cancelled</h1>
        <p className="text-sm mb-6" style={{ color: "#6b7280" }}>Discord didn't grant access. Please try again.</p>
        <Link to="/login" className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-black" style={{ background: "#10b981" }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#050505" }}>
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full mb-5" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <h1 className="text-lg font-bold text-white mb-2">Signing you in…</h1>
        <p className="text-sm" style={{ color: "#6b7280" }}>Connecting your Discord account to LibertyX.</p>
      </div>
    </div>
  );
}
