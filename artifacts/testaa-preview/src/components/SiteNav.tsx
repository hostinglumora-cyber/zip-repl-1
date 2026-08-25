import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu, X, Search, MessageCircle, Bell, ChevronDown, LogOut,
  User, ShieldCheck, LayoutDashboard, Store, Palette, Server, Heart,
  Package, Settings, ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [imgErr, setImgErr] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const syncUser = () => {
    try {
      const raw = window.localStorage.getItem("discord_user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  const isStaff =
    user?.username?.toLowerCase() === "eazykims" ||
    user?.is_owner ||
    ["owner", "admin", "moderator", "support"].includes(user?.role || "");

  const navLinks = [
    { to: "/marketplace", label: "Marketplace" },
    { to: "/creators", label: "Creators" },
    { to: "/hosting", label: "Hosting" },
    { to: "/docs", label: "Docs" },
  ];

  const handleSignOut = () => {
    window.localStorage.removeItem("discord_user");
    setUser(null);
    setUserOpen(false);
    navigate("/");
  };

  const displayName = user?.name || user?.username || "User";
  const avatarUrl = user?.avatarUrl || user?.avatar_url;
  const initial = (displayName.charAt(0) || "U").toUpperCase();

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-white/[0.08] bg-[#090A0F]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

        {/* Left: Logo */}
        <Link to="/" className="shrink-0 text-sm font-bold text-slate-100 hover:text-white transition-colors">
          Liberty<span className="text-emerald-400">X</span>
        </Link>

        {/* Center: Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.to || location.pathname.startsWith(link.to + "/");
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "text-slate-50 bg-white/[0.06]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-1.5">
          <Link
            to="/marketplace"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </Link>

          {user && (
            <>
              <Link
                to="/messages"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors"
                title="Messages"
              >
                <MessageCircle className="w-4 h-4" />
              </Link>
              <Link
                to="/favorites"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors"
                title="Favorites"
              >
                <Heart className="w-4 h-4" />
              </Link>
            </>
          )}

          {/* User dropdown or Login */}
          {user ? (
            <div className="relative ml-1" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-6 h-6 rounded-md overflow-hidden bg-[#1C212E] border border-white/[0.08] flex items-center justify-center text-[10px] font-semibold text-slate-400">
                  {avatarUrl && !imgErr ? (
                    <img src={avatarUrl} alt="" onError={() => setImgErr(true)} className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-white/[0.08] bg-[#12151E] p-1.5 shadow-2xl shadow-black/50 text-sm">
                  {/* User info */}
                  <div className="px-2.5 py-2 border-b border-white/[0.06] mb-1">
                    <span className="font-semibold text-slate-100 block text-sm truncate">{displayName}</span>
                    <span className="text-xs text-slate-500 block truncate">@{user.username || "user"}</span>
                  </div>

                  <DropdownLink to={`/u/${user.username || "me"}`} icon={Store} label="My Storefront" onClick={() => setUserOpen(false)} />
                  <DropdownLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setUserOpen(false)} />
                  <DropdownLink to="/messages" icon={MessageCircle} label="Messages" onClick={() => setUserOpen(false)} />
                  <DropdownLink to="/sell" icon={Package} label="Publish Asset" onClick={() => setUserOpen(false)} />
                  <DropdownLink to="/dashboard/storefront" icon={Palette} label="Storefront" onClick={() => setUserOpen(false)} />

                  {isStaff && (
                    <>
                      <div className="my-1 border-t border-white/[0.06]" />
                      <DropdownLink to="/admin" icon={ShieldCheck} label="Admin" onClick={() => setUserOpen(false)} className="text-rose-400 hover:bg-rose-500/10" />
                    </>
                  )}

                  <div className="my-1 border-t border-white/[0.06]" />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-1 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition active:scale-[0.98]"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#090A0F] px-4 py-3 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/[0.04]"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/[0.06] space-y-1.5 mt-2">
            {user ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/[0.04]">Dashboard</Link>
                <Link to="/messages" className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/[0.04]">Messages</Link>
                <Link to="/sell" className="block w-full text-center py-2 rounded-lg bg-emerald-500 text-black text-sm font-semibold">Publish Asset</Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="block w-full text-center py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="block w-full text-center py-2 rounded-lg bg-emerald-500 text-black text-sm font-semibold">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function DropdownLink({ to, icon: Icon, label, onClick, className }: { to: string; icon: any; label: string; onClick?: () => void; className?: string }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] transition-colors",
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </Link>
  );
}
