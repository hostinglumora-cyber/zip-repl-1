import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function DiscordCallback() {
  const [params] = useSearchParams();
  const hasCode = Boolean(params.get("code"));
  const error = params.get("error");

  return (
    <AuthLayout
      icon={MessageCircle}
      title={error ? "Discord sign-in cancelled" : hasCode ? "Discord sign-in received" : "Discord sign-in"}
      subtitle={
        error
          ? "You can return and try again whenever you’re ready."
          : hasCode
            ? "The authorization was received. Account exchange still needs to be connected on the server."
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