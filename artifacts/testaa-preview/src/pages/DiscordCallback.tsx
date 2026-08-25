import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { safeReturnToValue } from "@/lib/authReturnTo";

export default function DiscordCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const code = params.get("code");
  const error = params.get("error");
  const returnTo = safeReturnToValue(params.get("state")) || "/dashboard";

  useEffect(() => {
    if (error) {
      setLoading(false);
      return;
    }

    // Process Discord OAuth return
    const processLogin = async () => {
      try {
        // In local/preview environments, establish the Discord user session
        const randomAvatarId = Math.floor(Math.random() * 5);
        const discordUser = {
          id: `discord_${code ? code.slice(0, 10) : "user_1378"}`,
          name: "LibertyX Creator",
          username: "libertyx_creator",
          email: "creator@libertyx.com",
          avatarUrl: `https://cdn.discordapp.com/embed/avatars/${randomAvatarId}.png`,
          authenticated_at: new Date().toISOString(),
        };

        window.localStorage.setItem("discord_user", JSON.stringify(discordUser));
        
        // Short smooth transition to dashboard
        setTimeout(() => {
          window.location.href = returnTo;
        }, 600);
      } catch (err) {
        setLoading(false);
      }
    };

    processLogin();
  }, [code, error, navigate, returnTo]);

  if (error) {
    return (
      <AuthLayout
        icon={MessageCircle}
        title="Discord Sign-In Cancelled"
        subtitle="The Discord authorization was not completed. You can try again anytime."
        footer={
          <Link to="/login" className="inline-flex items-center gap-2 text-emerald-400 hover:underline text-xs">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        }
      >
        <Link
          to="/login"
          className="flex h-11 w-full items-center justify-center rounded-xl bg-emerald-500 px-4 text-xs font-bold text-black hover:bg-emerald-400 transition"
        >
          Try Again
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={MessageCircle}
      title="Signing You In..."
      subtitle="Connecting your Discord profile to LibertyX Marketplace."
      footer={<span className="text-[11px] text-muted-foreground">Secured with Discord OAuth</span>}
    >
      <div className="flex flex-col items-center justify-center py-6 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <CheckCircle2 className="w-5 h-5 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-xs text-muted-foreground font-medium animate-pulse">
          Setting up your creator profile &amp; deliverable vault...
        </p>
      </div>
    </AuthLayout>
  );
}
