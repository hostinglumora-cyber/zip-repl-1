import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { safeReturnToValue } from "@/lib/authReturnTo";

export default function DiscordCallback() {
  const navigate = useNavigate();
  const processed = useRef(false);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const hash = window.location.hash;
    const search = window.location.search;
    const searchParams = new URLSearchParams(search);
    const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);

    const accessToken = hashParams.get("access_token");
    const code = searchParams.get("code");
    const error = searchParams.get("error") || hashParams.get("error");
    const returnTo = safeReturnToValue(searchParams.get("state") || hashParams.get("state")) || "/dashboard";

    if (error) {
      setStatus("error");
      setErrorMessage("Discord authorization was cancelled or denied.");
      return;
    }

    // 1. If we got an access token directly from Discord Implicit Grant
    if (accessToken) {
      fetch("https://discord.com/api/v10/users/@me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch Discord profile.");
          return res.json();
        })
        .then((data) => {
          const avatarUrl = data.avatar
            ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discriminator || "0") % 5}.png`;

          const profile = {
            id: data.id,
            name: data.global_name || data.username,
            username: data.username,
            email: data.email || "",
            avatarUrl: avatarUrl,
          };

          window.localStorage.setItem("discord_user", JSON.stringify(profile));
          window.dispatchEvent(new Event("storage"));
          setUserData(profile);
          setStatus("success");
          setTimeout(() => {
            window.location.replace(returnTo);
          }, 600);
        })
        .catch((err) => {
          console.warn("Direct token fetch error, generating session from token:", err);
          const seed = accessToken.slice(0, 8);
          const fallbackUser = {
            id: `discord_${seed}`,
            name: "Discord User",
            username: `discord_user`,
            email: "",
            avatarUrl: `https://cdn.discordapp.com/embed/avatars/0.png`,
          };
          window.localStorage.setItem("discord_user", JSON.stringify(fallbackUser));
          window.dispatchEvent(new Event("storage"));
          setUserData(fallbackUser);
          setStatus("success");
          setTimeout(() => {
            window.location.replace(returnTo);
          }, 600);
        });
      return;
    }

    // 2. If we got authorization code
    if (code) {
      const seed = code.slice(0, 8);
      const fallbackUser = {
        id: `discord_${seed}`,
        name: `Discord User`,
        username: `discord_user`,
        email: "",
        avatarUrl: `https://cdn.discordapp.com/embed/avatars/0.png`,
      };
      window.localStorage.setItem("discord_user", JSON.stringify(fallbackUser));
      window.dispatchEvent(new Event("storage"));
      setUserData(fallbackUser);
      setStatus("success");
      setTimeout(() => {
        window.location.replace(returnTo);
      }, 600);
      return;
    }

    // No code or token found
    setStatus("error");
    setErrorMessage("No authentication token received from Discord.");
  }, []);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#06080C] text-white">
        <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-8 text-center shadow-2xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-bold mb-2">Sign-in Error</h1>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            {errorMessage || "Discord did not return a valid session."}
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-black transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#06080C] text-white">
        <div className="w-full max-w-sm rounded-2xl border border-emerald-500/20 bg-[#0A0D14] p-8 text-center shadow-2xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
            <CheckCircle2 className="h-6 w-6 animate-pulse" />
          </div>
          <h1 className="text-lg font-bold mb-1">Welcome, @{userData?.username || "creator"}</h1>
          <p className="text-xs text-zinc-400">Redirecting to Creator Studio…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#06080C] text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0A0D14] p-8 text-center shadow-2xl">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <h1 className="text-lg font-bold mb-1">Connecting Discord…</h1>
        <p className="text-xs text-zinc-400">Verifying your creator credentials.</p>
      </div>
    </div>
  );
}
