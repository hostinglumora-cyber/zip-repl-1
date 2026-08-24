import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ChevronRight, BookOpen, ArrowUpRight, MessageCircle } from "lucide-react";
import Logo from "@/components/Logo";
import { Footer } from "@/pages/Home";

const NAV = [
  { group: "Getting Started", items: [
    { label: "Introduction", to: "/docs" },
    { label: "Quickstart", to: "/docs" },
    { label: "Creating an Account", to: "/docs" },
    { label: "Using the Marketplace", to: "/docs" },
  ]},
  { group: "Marketplace", items: [
    { label: "Browsing", to: "/docs" },
    { label: "Purchasing", to: "/docs" },
    { label: "Downloads", to: "/docs" },
    { label: "Favorites", to: "/docs" },
  ]},
  { group: "Selling", items: [
    { label: "Creating a Listing", to: "/docs" },
    { label: "Products", to: "/docs" },
    { label: "Bundles", to: "/docs" },
    { label: "Free Products", to: "/docs" },
    { label: "Codes", to: "/docs" },
    { label: "Managing Sales", to: "/docs" },
  ]},
  { group: "Account", items: [
    { label: "Profile", to: "/docs" },
    { label: "Purchases", to: "/docs" },
    { label: "Notifications", to: "/docs" },
    { label: "Settings", to: "/docs" },
  ]},
  { group: "Legal", items: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/tos" },
  ]},
];

export default function DocsLayout({ children, title, description, toc }) {
  const location = useLocation();
  const [q, setQ] = useState("");

  const filteredNav = q
    ? NAV.map((s) => ({ ...s, items: s.items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())) })).filter((s) => s.items.length > 0)
    : NAV;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo size={28} textClass="text-base" />
            <span className="text-muted-foreground/40 text-sm font-normal">/ Documentation</span>
          </Link>
          <div className="hidden items-center gap-4 text-sm text-muted-foreground md:flex"><Link to="/" className="hover:text-foreground">Back to marketplace</Link><span className="h-4 w-px bg-border" /><a href="https://discord.com" className="inline-flex items-center gap-1.5 hover:text-foreground"><MessageCircle className="h-3.5 w-3.5 text-[#5865F2]" /> Community <ArrowUpRight className="h-3 w-3" /></a></div>
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search docsâ¦" className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 grid lg:grid-cols-[240px_minmax(0,1fr)_190px] gap-12">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 h-fit hidden lg:block">
            <div className="flex items-center gap-2 mb-4 px-2">
            <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Liberty docs</span>
          </div>
          <nav className="space-y-5">
            {filteredNav.map((sec) => (
              <div key={sec.group}>
                <p className="px-2 mb-1.5 text-xs uppercase tracking-widest text-muted-foreground/50 font-semibold">{sec.group}</p>
                <div className="space-y-0.5">
                  {sec.items.map((it, i) => {
                    const active = location.pathname === it.to && it.label !== "Introduction";
                    return (
                      <Link key={it.label + i} to={it.to} className={`block px-3 py-1.5 rounded-lg text-sm transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                        {it.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <article className="max-w-2xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground/50 mb-4">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-muted-foreground">Docs</span>
          </nav>
          {title && <h1 className="text-4xl font-bold tracking-tight mb-3">{title}</h1>}
          {description && <p className="text-lg text-muted-foreground mb-8">{description}</p>}
          <div className="prose-docs">{children}</div>

          {/* Prev/Next */}
          <div className="mt-12 pt-8 border-t border-border grid grid-cols-2 gap-4">
            <Link to="/docs" className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition">
              <p className="text-xs text-muted-foreground mb-1">â Previous</p>
              <p className="font-medium text-foreground text-sm">Introduction</p>
            </Link>
            <Link to="/docs" className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition text-right">
              <p className="text-xs text-muted-foreground mb-1">Next â</p>
              <p className="font-medium text-foreground text-sm">Browsing</p>
            </Link>
          </div>
        </article>

        {/* TOC */}
        {toc && toc.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-semibold mb-3">On this page</p>
              <nav className="space-y-1.5 border-l border-border pl-3">
                {toc.map((t) => (
                  <a key={t.id} href={`#${t.id}`} className="block text-sm text-muted-foreground hover:text-primary transition">{t.label}</a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
      <Footer />
    </div>
  );
}