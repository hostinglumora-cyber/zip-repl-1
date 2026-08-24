import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import NotificationsBell from "@/components/NotificationsBell";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <DashboardSidebar open={open} setOpen={setOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center gap-4 px-4 lg:px-8">
          <button className="lg:hidden text-muted-foreground" onClick={() => setOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              placeholder="Search listings, members, codesâ¦"
              className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <NotificationsBell />
            <Link to="/sell" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium bg-primary hover:opacity-90 text-primary-foreground px-3.5 py-2 rounded-lg transition">
              Sell
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}