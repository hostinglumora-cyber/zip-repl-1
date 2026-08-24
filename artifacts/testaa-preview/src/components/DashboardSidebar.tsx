import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Store, Plus, User, ShieldCheck,
  FileText, Gauge, LogOut, X, BadgeCheck, ShoppingBag, Package,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Logo from "@/components/Logo";

const NAV = [
  { group: "Overview", items: [
    { label: "Panel", to: "/dashboard", icon: LayoutDashboard },
    { label: "Marketplace", to: "/marketplace", icon: Store },
  ]},
  { group: "Sell", items: [
    { label: "Create Listing", to: "/sell", icon: Plus },
    { label: "My Listings", to: "/dashboard", icon: Package },
    { label: "Orders", to: "/dashboard", icon: ShoppingBag },
  ]},
  { group: "Account", items: [
    { label: "My Profile", to: "/u/me", icon: User },
    { label: "Activity", to: "/dashboard", icon: LayoutDashboard },
  ]},
  { group: "Platform", items: [
    { label: "Status", to: "/status", icon: Gauge },
    { label: "Documentation", to: "/docs", icon: FileText },
    { label: "Admin", to: "/admin", icon: ShieldCheck, admin: true },
  ]},
];

export default function DashboardSidebar({ open, setOpen }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (to) => location.pathname === to;

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen w-[260px] shrink-0 bg-sidebar border-r border-border flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-5 h-16 flex items-center justify-between border-b border-border">
          <Link to="/"><Logo size={28} textClass="text-base" /></Link>
          <button className="lg:hidden text-muted-foreground" onClick={() => setOpen(false)}><X className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV.map((section) => (
            <div key={section.group}>
              <p className="px-2 mb-2 text-[11px] uppercase tracking-widest text-muted-foreground/50 font-semibold">{section.group}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  if (item.admin && user?.role !== "admin") return null;
                  const active = isActive(item.to);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-primary/15 grid place-items-center text-primary font-semibold text-sm">
              {(user?.display_name || user?.full_name || user?.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate flex items-center gap-1">
                {user?.display_name || user?.full_name || "Member"}
                {user?.role === "admin" && <BadgeCheck className="w-3.5 h-3.5 text-primary" />}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button onClick={() => logout()} className="text-muted-foreground hover:text-foreground p-1.5 rounded hover:bg-secondary">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}