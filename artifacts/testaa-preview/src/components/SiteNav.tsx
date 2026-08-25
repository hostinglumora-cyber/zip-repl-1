import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Store, FileText, Activity } from "lucide-react";
import Logo from "@/components/Logo";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("discord_user");
      if (raw) setUser(JSON.parse(raw));
    } catch { window.localStorage.removeItem("discord_user"); }
  }, []);

  const navLinks = [
    { to: "/marketplace", label: "Marketplace", icon: Store },
    { to: "/docs", label: "Docs", icon: FileText },
    { to: "/status", label: "Status", icon: Activity },
  ];

  const displayName = user ? `@${user.username || user.name}` : null;
  const avatarUrl = user?.avatarUrl || `https://cdn.discordapp.com/embed/avatars/0.png`;
  const initial = ((user?.username || user?.name || "U").charAt(0)).toUpperCase();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: "rgba(5,5,5,0.9)", borderColor: "rgba(255,255,255,0.07)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="shrink-0">
          <Logo size={30} textClass="text-sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className="px-3.5 py-2 text-xs font-medium rounded-lg transition flex items-center gap-1.5 hover:bg-white/5" style={{ color: "#9ca3af" }}>
              <l.icon className="w-3.5 h-3.5" />{l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.03)", color: "#e5e7eb" }}>
              {!imgErr ? (
                <img src={avatarUrl} alt="" onError={() => setImgErr(true)} className="h-6 w-6 rounded-full" style={{ objectFit: "cover" }} />
              ) : (
                <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "rgba(16,185,129,0.2)", color: "#10b981" }}>{initial}</div>
              )}
              <span className="max-w-[120px] truncate">{displayName}</span>
            </Link>
          ) : (
            <Link to="/login" className="text-xs font-medium transition hover:text-white" style={{ color: "#9ca3af" }}>Sign In</Link>
          )}
          <Link to="/sell" className="text-xs font-bold text-black px-4 py-2 rounded-xl transition hover:opacity-90" style={{ background: "#10b981" }}>
            Start Selling
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ color: "#9ca3af" }}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t px-4 py-4 space-y-2" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#050505" }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg hover:bg-white/5 transition" style={{ color: "#9ca3af" }}>
              <l.icon className="w-4 h-4" /> {l.label}
            </Link>
          ))}
          <Link to="/sell" onClick={() => setOpen(false)} className="block text-center mt-2 text-black font-bold px-4 py-2.5 rounded-xl text-xs" style={{ background: "#10b981" }}>Start Selling</Link>
          {!user && <Link to="/login" onClick={() => setOpen(false)} className="flex items-center justify-center text-xs mt-1" style={{ color: "#9ca3af" }}>Sign In</Link>}
        </div>
      )}
    </header>
  );
}
