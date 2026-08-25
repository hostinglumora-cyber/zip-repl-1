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
  Users,
  Palette,
  MessageCircle,
  Heart,
  Globe,
  Plus,
  Server,
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

  const isOwnerOrStaff =
    user?.username?.toLowerCase() === "eazykims" ||
    user?.id?.toLowerCase() === "eazykims" ||
    user?.is_owner ||
    ["owner", "admin", "moderator", "support"].includes(user?.role || "");

  const navLinks = [
    { to: "/marketplace", label: "Marketplace" },
    { to: "/creators", label: "Creators" },
    { to: "/hosting", label: "Hosting", badge: "$12.99" },
    { to: "/dashboard", label: "Creator Studio" },
    { to: "/docs", label: "Docs" },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand */}
        <Link to="/" className="shrink-0 flex items-center gap-2 group py-1">
          <Logo textClass="text-2xl font-black tracking-tight" />
        </Link>

        {/* Center: Global Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
                  active
                    ? "text-emerald-400 bg-emerald-500/10 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/15 px-1.5 py-0.2 rounded border border-blue-500/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions & User Dropdown */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Direct Messages Shortcut */}
          <Link
            to="/messages"
            className="p-2 rounded-xl border border-white/[0.08] bg-[#0A0D15] hover:bg-white/[0.04] text-zinc-400 hover:text-white transition relative"
            title="Messages"
          >
            <MessageCircle className="w-4 h-4 text-zinc-300" />
          </Link>

          {/* Favorites Wishlist Shortcut */}
          <Link
            to="/favorites"
            className="p-2 rounded-xl border border-white/[0.08] bg-[#0A0D15] hover:bg-white/[0.04] text-zinc-400 hover:text-white transition"
            title="Saved Wishlist"
          >
            <Heart className="w-4 h-4 text-zinc-300" />
          </Link>

          {/* Admin shortcut for staff */}
          {isOwnerOrStaff && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-red-400 transition"
              title="Admin Operations"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          {/* Publish Asset button */}
          <Link
            to="/sell"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 text-xs font-bold transition shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Asset</span>
          </Link>

          {/* User Account Avatar / Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-white/[0.08] hover:border-emerald-500/40 bg-[#0A0D15] transition"
              >
                <div className="w-6 h-6 rounded-lg overflow-hidden border border-emerald-500/30 bg-black flex items-center justify-center text-[10px] font-bold text-white">
                  {avatarUrl && !imgErr ? (
                    <img src={avatarUrl} alt="" onError={() => setImgErr(true)} className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                <span className="text-xs font-semibold text-zinc-200 max-w-[90px] truncate">{displayName}</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/[0.1] bg-[#0A0D15] p-2 shadow-2xl space-y-1 text-xs">
                  <div className="p-2.5 border-b border-white/[0.06] mb-1">
                    <span className="font-bold text-white block truncate">{displayName}</span>
                    <span className="text-[10px] text-zinc-500 font-mono block truncate">{displayHandle}</span>
                  </div>

                  <Link
                    to={`/u/${user.username || "me"}`}
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/[0.04] text-zinc-300 hover:text-white"
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-400" />
                    <span>My Public Storefront</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/[0.04] text-zinc-300 hover:text-white"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Creator Studio</span>
                  </Link>

                  <Link
                    to="/dashboard/storefront"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/[0.04] text-zinc-300 hover:text-white"
                  >
                    <Palette className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Storefront Builder</span>
                  </Link>

                  <Link
                    to="/hosting"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/[0.04] text-zinc-300 hover:text-white"
                  >
                    <Server className="w-3.5 h-3.5 text-blue-400" />
                    <span>Community Hosting</span>
                  </Link>

                  {isOwnerOrStaff && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-red-500/10 text-red-400"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Operations</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-red-500/10 text-red-400 text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-xs font-semibold text-zinc-200 transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl border border-white/[0.08] text-zinc-400 hover:text-white"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#07090E] p-4 space-y-3">
          <div className="space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-white/[0.04]"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-white/[0.06] space-y-2">
            <Link
              to="/sell"
              onClick={() => setOpen(false)}
              className="block w-full text-center py-2.5 rounded-xl bg-emerald-500 text-black text-xs font-bold"
            >
              Publish Asset
            </Link>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  handleSignOut();
                  setOpen(false);
                }}
                className="block w-full text-center py-2 rounded-xl border border-white/[0.08] text-xs text-red-400"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center py-2 rounded-xl border border-white/[0.08] text-xs text-zinc-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
