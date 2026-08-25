import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Store, Gauge, FileText, ArrowRight, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [discordUser, setDiscordUser] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("discord_user");
      if (saved) setDiscordUser(JSON.parse(saved));
    } catch {
      window.localStorage.removeItem("discord_user");
    }
  }, []);

  const links = [
    { label: "Marketplace", to: "/marketplace", icon: Store },
    { label: "Docs", to: "/docs", icon: FileText },
    { label: "Status", to: "/status", icon: Gauge },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090D14]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="shrink-0 flex items-center gap-2">
          <Logo size={28} textClass="text-base font-bold" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition flex items-center gap-2"
            >
              <l.icon className="w-3.5 h-3.5" />
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {discordUser ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition hover:bg-secondary"
            >
              <img
                src={discordUser.avatarUrl}
                alt=""
                className="h-6 w-6 rounded-full ring-2 ring-[#5865F2]/40"
              />
              <span className="max-w-28 truncate font-medium">{discordUser.name}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 transition font-medium"
            >
              Sign In
            </Link>
          )}
          <Link
            to="/sell"
            className="text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground px-3.5 py-2 rounded-xl transition inline-flex items-center gap-1.5 shadow-lg shadow-primary/20"
          >
            <span>Start Selling</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 px-4 py-4 space-y-1.5 bg-[#090D14]">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground rounded-lg hover:bg-secondary hover:text-foreground"
            >
              <l.icon className="w-4 h-4" />
              <span>{l.label}</span>
            </Link>
          ))}
          <Link
            to="/sell"
            onClick={() => setOpen(false)}
            className="block text-center mt-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl text-xs"
          >
            Start Selling
          </Link>
          {!discordUser && (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center px-3 py-2 text-xs text-muted-foreground font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
