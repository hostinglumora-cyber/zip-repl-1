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
    { to: "/creators", label: "Creators" },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand */}
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
                  "px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all",
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

        {/* Right: Messages, Wishlist, User Chip */}
        <div className="hidden sm:flex items-center gap-2.5">
          {user ? (
            <>
              {/* Wishlist Link */}
              <Link
                to="/favorites"
                className="p-2 rounded-xl border border-white/[0.08] bg-[#0A0D15] text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition shadow-sm"
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
              </Link>

              {/* Messages Link */}
              <Link
                to="/messages"
                className="p-2 rounded-xl border border-white/[0.08] bg-[#0A0D15] text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition shadow-sm"
                title="Direct Messages"
              >
                <MessageCircle className="w-4 h-4" />
              </Link>

              {/* Sleek Profile Chip */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#0C1018] hover:border-emerald-500/30 p-1.5 pr-2.5 transition-all group"
                >
                  {avatarUrl && !imgErr ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      onError={() => setImgErr(true)}
                      className="h-7 w-7 rounded-xl object-cover ring-1 ring-emerald-500/30 group-hover:ring-emerald-400 transition"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black ring-1 ring-emerald-500/30">
                      {initial}
                    </div>
                  )}

                  <div className="text-left hidden lg:block max-w-[110px]">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-white leading-tight truncate">{displayName}</p>
                      {user.roblox_verified && (
                        <span className="w-2 h-2 rounded-full bg-blue-400" title="Roblox Verified" />
                      )}
                    </div>
                    {displayHandle && (
                      <p className="text-[9px] text-zinc-400 font-mono leading-tight truncate">{displayHandle}</p>
                    )}
                  </div>

                  <ChevronDown className={cn("w-3 h-3 text-zinc-500 transition-transform duration-200 ml-0.5", userDropdown && "rotate-180 text-emerald-400")} />
                </button>

                {/* Dropdown Menu */}
                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/[0.08] bg-[#0B0F17] p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white truncate">{displayName}</p>
                        {user.roblox_verified && (
                          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                            ✓ Roblox
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 font-mono truncate">{displayHandle || "Verified Creator"}</p>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        to="/u/me"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
                      >
                        <Store className="w-3.5 h-3.5 text-emerald-400" />
                        <span>My Public Storefront</span>
                      </Link>

                      <Link
                        to="/dashboard/storefront"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
                      >
                        <Palette className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Storefront Builder</span>
                      </Link>

                      <Link
                        to="/favorites"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        <span>My Wishlist</span>
                      </Link>

                      <Link
                        to="/messages"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Direct Messages</span>
                      </Link>

                      <Link
                        to="/following"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
                      >
                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Followed Creators</span>
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Creator Studio</span>
                      </Link>

                      <Link
                        to="/sell"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Publish New Asset</span>
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
            </>
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
            <Link to="/u/me" className="p-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">
                {initial}
              </div>
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold text-black bg-emerald-500 px-3 py-1.5 rounded-lg"
            >
              Login
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="sm:hidden border-t border-white/[0.06] bg-[#07090E] px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-zinc-300 hover:text-white rounded-xl hover:bg-white/[0.03]"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <>
              <Link
                to="/messages"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-emerald-400 rounded-xl hover:bg-white/[0.03]"
              >
                Messages
              </Link>
              <Link
                to="/favorites"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-rose-400 rounded-xl hover:bg-white/[0.03]"
              >
                Wishlist
              </Link>
              <Link
                to="/dashboard/storefront"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-emerald-400 rounded-xl hover:bg-white/[0.03]"
              >
                Storefront Builder
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-sm font-semibold text-red-400"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
