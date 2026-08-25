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
  Compass,
  SlidersHorizontal,
  UserCheck,
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
    { to: "/marketplace", label: "Marketplace" },
    { to: "/dashboard", label: "Creator Studio" },
    { to: "/docs", label: "Documentation" },
    { to: "/status", label: "Status" },
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
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.07] bg-[#07090E]/95 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left: Brand with breathing room */}
        <Link to="/" className="shrink-0 flex items-center gap-2 group py-1">
          <Logo textClass="text-2xl font-black tracking-tight" />
        </Link>

        {/* Center: Global Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to || (link.to !== "/" && location.pathname.startsWith(link.to));

            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all",
                  isActive
                    ? "text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: User Profile / Login */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-[#0C1018] hover:border-emerald-500/30 p-1.5 pr-3 transition-all group"
              >
                {avatarUrl && !imgErr ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    onError={() => setImgErr(true)}
                    className="h-8 w-8 rounded-xl object-cover ring-1 ring-emerald-500/30 group-hover:ring-emerald-400 transition"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black ring-1 ring-emerald-500/30">
                    {initial}
                  </div>
                )}

                <div className="text-left hidden md:block max-w-[120px]">
                  <p className="text-xs font-bold text-white leading-tight truncate">{displayName}</p>
                  {displayHandle && (
                    <p className="text-[10px] text-zinc-400 font-mono leading-tight truncate">{displayHandle}</p>
                  )}
                </div>

                <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ml-0.5", userDropdown && "rotate-180 text-emerald-400")} />
              </button>

              {/* Dropdown matching user spec: Profile, Creator Studio, Account, Sign out */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/[0.08] bg-[#0B0F17] p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[10px] text-zinc-400 font-mono truncate">{displayHandle || "Verified Creator"}</p>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      to="/u/me"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
                    >
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Creator Studio</span>
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Account</span>
                    </Link>
                  </div>

                  <div className="pt-1 mt-1 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 text-xs font-bold shadow-md shadow-emerald-500/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
            className="p-2 rounded-xl border border-white/[0.08] text-zinc-300 hover:text-white"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="sm:hidden border-t border-white/[0.08] px-4 py-4 space-y-1 bg-[#07090E]/98 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl text-zinc-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <span>{link.label}</span>
            </Link>
          ))}

          {user && (
            <div className="pt-2 mt-2 border-t border-white/[0.08] space-y-1">
              <Link
                to="/u/me"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-zinc-300"
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  handleSignOut();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-400 text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
