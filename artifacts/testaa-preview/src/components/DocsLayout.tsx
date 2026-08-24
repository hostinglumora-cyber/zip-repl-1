import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ChevronRight, BookOpen, ArrowUpRight, MessageCircle, Layers, ShoppingBag, Tag, User, Scale, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";
import { Footer } from "@/pages/Home";

const NAV = [
  { group: "Getting Started", icon: Sparkles, items: [
    { label: "Introduction", to: "/docs" },
    { label: "Quickstart", to: "/docs" },
    { label: "Creating an Account", to: "/docs" },
    { label: "Using the Marketplace", to: "/docs" },
  ]},
  { group: "Marketplace", icon: ShoppingBag, items: [
    { label: "Browsing", to: "/docs" },
    { label: "Purchasing", to: "/docs" },
    { label: "Downloads", to: "/docs" },
    { label: "Favorites", to: "/docs" },
  ]},
  { group: "Selling", icon: Tag, items: [
    { label: "Creating a Listing", to: "/docs" },
    { label: "Products", to: "/docs" },
    { label: "Bundles", to: "/docs" },
    { label: "Free Products", to: "/docs" },
    { label: "Codes", to: "/docs" },
    { label: "Managing Sales", to: "/docs" },
  ]},
  { group: "Account", icon: User, items: [
    { label: "Profile", to: "/docs" },
    { label: "Purchases", to: "/docs" },
    { label: "Notifications", to: "/docs" },
    { label: "Settings", to: "/docs" },
  ]},
  { group: "Legal", icon: Scale, items: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/tos" },
  ]},
];

export default function DocsLayout({ children, title, description, toc }) {
  const location = useLocation();
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState("");

  // Track which TOC section is in view for the active highlight
  useEffect(() => {
    if (!toc || toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  const filteredNav = q
    ? NAV.map((s) => ({ ...s, items: s.items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())) })).filter((s) => s.items.length > 0)
    : NAV;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Ambient aurora backdrop */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[520px] w-[720px] rounded-full bg-primary/[0.07] blur-[160px]" />
        <div className="absolute top-1/3 right-0 h-[420px] w-[480px] rounded-full bg-blue-500/[0.05] blur-[170px]" />
        <div className="absolute bottom-0 left-0 h-[380px] w-[520px] rounded-full bg-primary/[0.04] blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-background/70 border-b border-border/60">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative">
              <Logo size={28} textClass="text-base" />
              <span className="absolute -inset-1 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-60 transition duration-500 -z-10" />
            </span>
            <span className="text-muted-foreground/40 text-sm font-normal font-mono">{"/"} Documentation</span>
          </Link>
          <div className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
            <Link to="/" className="hover:text-foreground transition">Back to marketplace</Link>
            <span className="h-4 w-px bg-border" />
            <a href="https://discord.com" className="inline-flex items-center gap-1.5 hover:text-foreground transition">
              <MessageCircle className="h-3.5 w-3.5 text-[#5865F2]" /> Community <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="relative w-56 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search docs…"
              className="w-full bg-secondary/60 border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:bg-secondary focus:ring-2 focus:ring-primary/10 transition"
            />
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-12 grid lg:grid-cols-[240px_minmax(0,1fr)_190px] gap-12">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 h-fit hidden lg:block">
          <div className="flex items-center gap-2 mb-5 px-2">
            <span className="relative">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="absolute -inset-1.5 rounded-lg bg-primary/20 blur-md -z-10" />
            </span>
            <span className="text-sm font-semibold text-foreground tracking-tight">Liberty docs</span>
          </div>
          <nav className="space-y-6">
            {filteredNav.map((sec) => (
              <div key={sec.group}>
                <p className="px-2 mb-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50 font-semibold flex items-center gap-1.5">
                  <sec.icon className="w-3 h-3" /> {sec.group}
                </p>
                <div className="space-y-0.5">
                  {sec.items.map((it, i) => {
                    const active = location.pathname === it.to && it.label !== "Introduction";
                    return (
                      <Link
                        key={it.label + i}
                        to={it.to}
                        className={`block px-3 py-1.5 rounded-lg text-sm transition relative ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}
                      >
                        {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-primary" />}
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
        <article className="max-w-2xl relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground/50 mb-6">
            <Link to="/" className="hover:text-foreground transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-muted-foreground">Docs</span>
          </nav>

          {/* Hero header */}
          {title && (
            <div className="relative mb-10">
              <div className="absolute -inset-x-4 -top-6 -bottom-6 -z-10 rounded-3xl bg-gradient-to-br from-primary/[0.06] via-transparent to-blue-500/[0.04]" />
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary mb-5">
                <Layers className="h-3 w-3" /> Documentation
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-4 bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
          )}
          {description && <p className="text-lg text-muted-foreground mb-10 leading-relaxed">{description}</p>}
          <div className="prose-docs">{children}</div>

          {/* Prev/Next */}
          <div className="mt-14 pt-8 border-t border-border/60 grid grid-cols-2 gap-4">
            <Link to="/docs" className="group rounded-2xl border border-border bg-card/60 p-4 hover:border-primary/30 hover:bg-card transition relative overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition" />
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">← Previous</p>
              <p className="font-medium text-foreground text-sm relative">Introduction</p>
            </Link>
            <Link to="/docs" className="group rounded-2xl border border-border bg-card/60 p-4 hover:border-primary/30 hover:bg-card transition text-right relative overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-l from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition" />
              <p className="text-xs text-muted-foreground mb-1 flex items-center justify-end gap-1">Next →</p>
              <p className="font-medium text-foreground text-sm relative">Browsing</p>
            </Link>
          </div>
        </article>

        {/* TOC */}
        {toc && toc.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50 font-semibold mb-3">On this page</p>
              <nav className="space-y-1.5 border-l border-border pl-3">
                {toc.map((t) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className={`block text-sm transition ${activeId === t.id ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {t.label}
                  </a>
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
