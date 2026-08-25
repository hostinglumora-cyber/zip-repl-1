import React from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-50">Page not found</h2>
          <p className="text-sm text-slate-400">The page you're looking for doesn't exist.</p>
        </div>
        <Link
          to="/marketplace"
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg px-4 py-2 text-sm active:scale-[0.98] transition-all"
        >
          Back to Marketplace
        </Link>
      </div>
    </PageShell>
  );
}
