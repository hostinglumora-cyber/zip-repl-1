import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Store, Gauge, FileText, ArrowRight, User } from "lucide-react";
import Logo from "@/components/Logo";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [discordUser, setDiscordUser] = useState<any>(null);
  const [avatarError, setAvatarError] = useState(false);

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

  const avatarSrc = discordUser?.avatarUrl || "https://cdn.discordapp.com/embed/avatars/0.png";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07090E]/90 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="shrink-0 flex items-center gap-2.5">
          <Logo size={34} textClass="text-lg font-bold" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition flex items-center gap-2"
            >
              <l.icon className="w-3.5 h-3.5 text-zinc-400" />
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {discordUser ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/[0.06] hover:border-white/15"
            >
              {!avatarError && avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt=""
                  onError={() => setAvatarError(true)}
                  className="h-6 w-6 rounded-full ring-1 ring-emerald-500/40 object-cover"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                  {(discordUser.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="max-w-28 truncate font-medium">{discordUser.name || "Dashboard"}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-xs text-zinc-400 hover:text-white px-3.5 py-1.5 transition font-medium"
            >
              Sign In
            </Link>
          )}
          <Link
            to="/sell"
            className="text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>Start Selling</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          className="md:hidden text-zinc-400 hover:text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/[0.06] px-4 py-4 space-y-2 bg-[#07090E]">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-400 rounded-lg hover:bg-white/[0.04] hover:text-white"
            >
              <l.icon className="w-4 h-4" />
              <span>{l.label}</span>
            </Link>
          ))}
          <Link
            to="/sell"
            onClick={() => setOpen(false)}
            className="block text-center mt-2 bg-emerald-500 text-black font-semibold px-4 py-2.5 rounded-xl text-xs"
          >
            Start Selling
          </Link>
          {!discordUser && (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center px-3 py-2 text-xs text-zinc-400 font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
