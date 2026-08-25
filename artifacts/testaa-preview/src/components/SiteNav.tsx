import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Store, FileText, Activity, LogOut, User } from "lucide-react";
import Logo from "@/components/Logo";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [imgErr, setImgErr] = useState(false);
  const location = useLocation();

  const syncUser = () => {
    try {
      const raw = window.localStorage.getItem("discord_user");
      if (raw) {
        setUser(JSON.parse(raw));
      } else {
        setUser(null);
      }
    } catch {
      window.localStorage.removeItem("discord_user");
      setUser(null);
    }
  };

  useEffect(() => {
    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [location.pathname]);

  const navLinks = [
    { to: "/marketplace", label: "Marketplace", icon: Store },
    { to: "/docs", label: "Documentation", icon: FileText },
    { to: "/status", label: "Status", icon: Activity },
  ];

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.localStorage.removeItem("discord_user");
    setUser(null);
    window.location.href = "/";
  };

  const displayName = user ? `@${user.username || user.name || "user"}` : null;
  const avatarUrl = user?.avatarUrl || (user?.id ? `https://cdn.discordapp.com/embed/avatars/0.png` : null);
  const initial = ((user?.username || user?.name || "U").charAt(0)).toUpperCase();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/[0.08] bg-[#050505]/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="shrink-0 flex items-center gap-2 group">
          <Logo textClass="text-2xl sm:text-3xl font-black group-hover:opacity-90 transition" />
        </Link>

        {/* Big Nav Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((l) => {
            const isActive = location.pathname.startsWith(l.to);
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-5 py-2.5 text-sm sm:text-base font-semibold rounded-xl transition-all flex items-center gap-2.5 ${
                  isActive
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Login or User profile */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-500/40 hover:bg-white/[0.06]"
              >
                {avatarUrl && !imgErr ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    onError={() => setImgErr(true)}
                    className="h-7 w-7 rounded-full ring-2 ring-emerald-500/40 object-cover"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold ring-2 ring-emerald-500/30">
                    {initial}
                  </div>
                )}
                <span className="max-w-[140px] truncate">{displayName}</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] px-6 py-2.5 text-sm sm:text-base font-bold text-white transition hover:border-emerald-500/40"
            >
              <User className="w-4 h-4 text-emerald-400" />
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-xl border border-white/[0.08] text-zinc-300"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-white/[0.08] px-4 py-6 space-y-3 bg-[#050505]/98 backdrop-blur-2xl">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-xl text-zinc-300 hover:text-white hover:bg-white/[0.05] transition"
            >
              <l.icon className="w-5 h-5 text-emerald-400" />
              {l.label}
            </Link>
          ))}
          
          <div className="pt-3 border-t border-white/[0.08]">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.1] bg-white/[0.04] text-white font-semibold"
                >
                  <div className="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                    {initial}
                  </div>
                  <span>{displayName} (Dashboard)</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 bg-red-500/10 text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/[0.08] text-white font-bold text-base"
              >
                <User className="w-4 h-4 text-emerald-400" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
