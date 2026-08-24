import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { safeReturnTo } from "@/lib/authReturnTo";

const DISCORD_CLIENT_ID = "1378231778292142172";

function discordAuthorizeUrl(returnTo: string) {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    response_type: "code",
    redirect_uri: `${window.location.origin}/auth/discord/callback`,
    scope: "identify guilds",
    state: returnTo,
  });
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export default function Login() {
  const returnTo = safeReturnTo();

  return (
    <AuthLayout
      icon={MessageCircle}
      title="Welcome back"
      subtitle="Use your Discord account to enter Liberty Marketplace"
      footer={
        <span className="text-muted-foreground">
          New here? Your Discord profile will create an account automatically.
        </span>
      }
    >
      <a
        href={discordAuthorizeUrl(returnTo)}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-[#5865F2] px-4 text-sm font-semibold text-white shadow-lg shadow-[#5865F2]/20 transition hover:-translate-y-0.5 hover:bg-[#4752C4]"
      >
        <MessageCircle className="h-5 w-5" />
        Continue with Discord
        <ArrowRight className="h-4 w-4" />
      </a>

      <div className="mt-6 rounded-xl border border-border bg-secondary/50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">A safer marketplace</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Discord identity helps creators and buyers build trust without another password to remember.
            </p>
          </div>
        </div>
      </div>

      <Link to="/" className="mt-6 block text-center text-sm text-muted-foreground transition hover:text-foreground">
        Back to home
      </Link>
    </AuthLayout>
  );
}