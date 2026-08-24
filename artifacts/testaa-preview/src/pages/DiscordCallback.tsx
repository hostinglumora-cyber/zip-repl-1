import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function DiscordCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [profileError, setProfileError] = useState("");
  const hasCode = Boolean(params.get("code"));
  const error = params.get("error");

  useEffect(() => {
    if (!hasCode || error) return;
    fetch("/api/discord/me")
      .then((response) => {
        if (!response.ok) throw new Error("Discord profile unavailable");
        return response.json();
      })
      .then((profile) => {
        window.localStorage.setItem("discord_user", JSON.stringify(profile));
        navigate("/", { replace: true });
      })
      .catch(() => setProfileError("We received the Discord response, but could not load your profile yet."));
  }, [error, hasCode, navigate]);

  return (
    <AuthLayout
      icon={MessageCircle}
      title={error || profileError ? "Discord sign-in needs attention" : hasCode ? "Discord sign-in received" : "Discord sign-in"}
      subtitle={
        error || profileError
          ? profileError || "You can return and try again whenever you’re ready."
          : hasCode
            ? "Loading your Discord profile…"
            : "Start sign-in from the login page."
      }
      footer={
        <Link to="/login" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Discord login
        </Link>
      }
    >
      <Link to="/marketplace" className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
        Browse the marketplace
      </Link>
    </AuthLayout>
  );
}