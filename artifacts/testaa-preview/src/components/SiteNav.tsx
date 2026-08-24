import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Store, Gauge, FileText, ArrowRight, MessageCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Marketplace", to: "/marketplace", icon: Store },
    { label: "Status", to: "/status", icon: Gauge },
    { label: "Docs", to: "/docs", icon: FileText },
  ];
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="shrink-0"><Logo size={30} textClass="text-lg" /></Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition flex items-center gap-2">
              <l.icon className="w-4 h-4" /> {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 transition inline-flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5 text-[#5865F2]" /> Login</Link>
          <Link to="/sell" className="text-sm font-medium bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5">
             Start Selling <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border px-5 py-4 space-y-1 bg-background">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-muted-foreground rounded-lg hover:bg-secondary hover:text-foreground">
              <l.icon className="w-4 h-4" /> {l.label}
            </Link>
          ))}
          <Link to="/sell" onClick={() => setOpen(false)} className="block text-center mt-2 bg-primary text-primary-foreground font-medium px-4 py-2.5 rounded-lg">Start Selling</Link>
        </div>
      )}
    </header>
  );
}