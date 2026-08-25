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
  ExternalLink,
  ChevronDown,
  User,
  ShieldCheck,
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
    { to: "/marketplace", label: "Marketplace", icon: Store },
    { to: "/sell", label: "Creator Studio", icon: PlusCircle },
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
    <header className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/[0.07] bg-[#07090E]/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="shrink-0 flex items-center gap-2 group py-1">
            <Logo textClass="text-2xl sm:text-3xl font-black tracking-tight" />
            <span className="hidden sm:inline-flex text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md ml-1">
              Marketplace
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.to);
              const Icon = link.icon;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-2",
                    isActive
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 shadow-sm"
                      : "text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-emerald-400" : "text-zinc-400")} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Account Menu / Login */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2.5 rounded-2xl border border-white/[0.1] bg-[#0E121B] hover:border-emerald-500/40 hover:bg-[#121824] p-1.5 pr-3.5 transition-all shadow-md group"
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

                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-white flex items-center gap-1 leading-tight">
                    <span>{displayName}</span>
                    <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                  </div>
                  {displayHandle && (
                    <div className="text-[10px] text-zinc-400 font-mono leading-tight">
                      {displayHandle}
                    </div>
                  )}
                </div>

                <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ml-1", userDropdown && "rotate-180 text-emerald-400")} />
              </button>

              {/* Account Dropdown Menu */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/[0.1] bg-[#0C1017] p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="px-3.5 py-3 border-b border-white/[0.06] mb-1.5">
                    <p className="text-xs font-bold text-white leading-none">{displayName}</p>
                    <p className="text-[11px] text-zinc-400 font-mono mt-1">{displayHandle || "Verified Creator"}</p>
                    <div className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Scam-Shield Escrow
                    </div>
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
                      <span>Publish Asset</span>
                    </Link>

                    <Link
                      to="/marketplace"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.06] rounded-xl transition"
                    >
                      <Store className="w-4 h-4 text-emerald-400" />
                      <span>Marketplace Directory</span>
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
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition"
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
              className="inline-flex items-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          {user ? (
            <Link to="/dashboard" className="p-1 rounded-xl">
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

          {user && (
            <div className="pt-3 border-t border-white/[0.08] space-y-1">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Creator Dashboard</span>
              </Link>
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
            </div>
          )}
        </div>
      )}
    </header>
  );
}
