import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Store,
  FileText,
  Activity,
  PlusCircle,
  LogOut,
  LayoutDashboard,
  Sparkles,
  ChevronDown,
  User,
  ShieldCheck,
  House,
} from "lucide-react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [imgErr, setImgErr] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { to: "/", label: "Home", icon: House },
    { to: "/marketplace", label: "Marketplace", icon: Store },
    { to: "/docs", label: "Documentation", icon: FileText },
    { to: "/status", label: "Status", icon: Activity },
  ];

  const handleSignOut = () => {
    window.localStorage.removeItem("discord_user");
    setUser(null);
    setUserDropdown(false);
    navigate("/");
  };

  const displayName = user?.name || user?.username || "Creator";
  const displayHandle = user?.username ? `@${user.username}` : "";
  const avatarUrl = user?.avatarUrl;
  const initial = (displayName.charAt(0) || "C").toUpperCase();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.08] bg-[#07090E]/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand with breathing room */}
        <Link to="/" className="shrink-0 flex items-center gap-2 group py-1">
          <Logo textClass="text-2xl sm:text-3xl font-black tracking-tight" />
        </Link>

        {/* Global Nav Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-xl transition-all",
                  isActive
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Account Menu / Creator CTA / Login */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            to="/sell"
            className="text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-white/[0.04]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Sell Asset</span>
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2.5 rounded-2xl border border-white/[0.1] bg-[#0E131E] hover:border-emerald-500/40 hover:bg-[#131926] p-1.5 pr-3 transition-all shadow-sm group"
              >
                {avatarUrl && !imgErr ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    onError={() => setImgErr(true)}
                    className="h-8 w-8 rounded-xl object-cover ring-2 ring-emerald-500/30 group-hover:ring-emerald-400 transition"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black ring-2 ring-emerald-500/30">
                    {initial}
                  </div>
                )}

                <div className="text-left hidden md:block max-w-[120px]">
                  <p className="text-xs font-bold text-white leading-tight truncate">{displayName}</p>
                  {displayHandle && (
                    <p className="text-[10px] text-zinc-400 font-mono leading-tight truncate">{displayHandle}</p>
                  )}
                </div>

                <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ml-0.5", userDropdown && "rotate-180 text-emerald-400")} />
              </button>

              {/* Account Dropdown Menu */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-white/[0.1] bg-[#0C1017] p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="px-3.5 py-3 border-b border-white/[0.06] mb-1.5">
                    <p className="text-xs font-bold text-white leading-none truncate">{displayName}</p>
                    <p className="text-[11px] text-zinc-400 font-mono mt-1 truncate">{displayHandle || "Verified Creator"}</p>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.06] rounded-xl transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                      <span>Creator Dashboard</span>
                    </Link>

                    <Link
                      to="/sell"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.06] rounded-xl transition"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-400" />
                      <span>Publish New Asset</span>
                    </Link>

                    <Link
                      to="/u/me"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.06] rounded-xl transition"
                    >
                      <User className="w-4 h-4 text-zinc-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/docs"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.06] rounded-xl transition"
                    >
                      <FileText className="w-4 h-4 text-zinc-400" />
                      <span>Documentation</span>
                    </Link>
                  </div>

                  <div className="pt-1.5 mt-1.5 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          {user ? (
            <Link to="/dashboard" className="p-1">
              {avatarUrl && !imgErr ? (
                <img src={avatarUrl} alt="" className="h-7 w-7 rounded-lg object-cover ring-1 ring-emerald-500/40" />
              ) : (
                <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                  {initial}
                </div>
              )}
            </Link>
          ) : (
            <Link to="/login" className="px-3 py-1.5 bg-emerald-500 text-black text-xs font-bold rounded-lg">
              Login
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-2 rounded-xl border border-white/[0.1] text-zinc-300 hover:text-white"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="sm:hidden border-t border-white/[0.08] px-4 py-5 space-y-2 bg-[#07090E]/98 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-zinc-200 hover:text-white hover:bg-white/[0.05] transition"
            >
              <link.icon className="w-4 h-4 text-emerald-400" />
              <span>{link.label}</span>
            </Link>
          ))}

          <div className="pt-3 border-t border-white/[0.08] space-y-2">
            <Link
              to="/sell"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Asset</span>
            </Link>

            {user && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  handleSignOut();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
