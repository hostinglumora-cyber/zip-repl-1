import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ChevronRight, ExternalLink, MessageCircle, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const NAV = [
  {
    group: "Getting Started",
    items: [
      { label: "Introduction", to: "/docs" },
      { label: "Quickstart", to: "/docs" },
      { label: "Creating an Account", to: "/docs" },
      { label: "Using the Marketplace", to: "/docs" },
    ],
  },
  {
    group: "Marketplace",
    items: [
      { label: "Browsing", to: "/docs" },
      { label: "Purchasing", to: "/docs" },
      { label: "Downloads", to: "/docs" },
      { label: "Favorites", to: "/docs" },
    ],
  },
  {
    group: "Selling",
    items: [
      { label: "Creating a Listing", to: "/docs" },
      { label: "Products", to: "/docs" },
      { label: "Bundles", to: "/docs" },
      { label: "Free Products", to: "/docs" },
      { label: "Codes", to: "/docs" },
      { label: "Managing Sales", to: "/docs" },
    ],
  },
  {
    group: "Account",
    items: [
      { label: "Profile", to: "/docs" },
      { label: "Purchases", to: "/docs" },
      { label: "Notifications", to: "/docs" },
      { label: "Settings", to: "/docs" },
    ],
  },
  {
    group: "Legal",
    items: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/tos" },
    ],
  },
];

export default function DocsLayout({ children, title, description, toc }: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  toc?: { id: string; label: string }[];
}) {
  const location = useLocation();
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState(toc?.[0]?.id ?? "");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!toc?.length) return;
    const els = toc.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-72px 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [toc]);

  const filteredNav = q
    ? NAV.map((s) => ({
        ...s,
        items: s.items.filter((i) =>
          i.label.toLowerCase().includes(q.toLowerCase())
        ),
      })).filter((s) => s.items.length > 0)
    : NAV;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── Top nav bar ── */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border h-14 flex items-center">
        <div className="w-full max-w-[90rem] mx-auto px-4 lg:px-6 flex items-center gap-4">
          {/* Left: logo + breadcrumb */}
          <Link to="/" className="flex items-center gap-2 shrink-0 mr-2">
            <Logo size={24} textClass="text-sm font-semibold" />
          </Link>
          <span className="hidden sm:block text-border select-none">/</span>
          <span className="hidden sm:block text-sm text-muted-foreground font-medium">Docs</span>

          {/* Search — Mintlify-style pill */}
          <div className="relative hidden md:flex items-center ml-4 flex-1 max-w-xs">
            <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search docs..."
              className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition"
            />
            <kbd className="absolute right-3 text-[10px] text-muted-foreground/50 font-mono hidden sm:block">⌘K</kbd>
          </div>

          <div className="ml-auto flex items-center gap-3 text-sm">
            <Link to="/" className="hidden md:block text-muted-foreground hover:text-foreground transition text-sm">
              Marketplace
            </Link>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition text-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#5865F2]" />
              Community
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => setMobileNavOpen((v) => !v)}
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 w-full max-w-[90rem] mx-auto">
        {/* ── Sidebar ── */}
        <aside
          className={`
            fixed md:sticky top-14 z-40 md:z-auto
            w-64 shrink-0 h-[calc(100vh-3.5rem)] overflow-y-auto
            bg-background border-r border-border
            transition-transform duration-200
            ${mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="px-4 py-6">
            <nav className="space-y-6">
              {filteredNav.map((sec) => (
                <div key={sec.group}>
                  <p className="px-2 mb-1 text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest">
                    {sec.group}
                  </p>
                  <div className="space-y-0.5 mt-1">
                    {sec.items.map((it, i) => {
                      const active =
                        location.pathname === it.to && it.label === "Introduction";
                      return (
                        <Link
                          key={it.label + i}
                          to={it.to}
                          onClick={() => setMobileNavOpen(false)}
                          className={`
                            flex items-center px-2 py-1.5 rounded-md text-sm transition
                            ${active
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary"}
                          `}
                        >
                          {it.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobileNavOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground transition">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/docs" className="hover:text-foreground transition">Docs</Link>
              {title && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-foreground">{title}</span>
                </>
              )}
            </nav>

            {/* Page title */}
            {title && (
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight mb-3">
                  {title}
                </h1>
                {description && (
                  <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
                )}
                <div className="mt-6 border-b border-border" />
              </div>
            )}

            {/* Page body */}
            <div className="docs-content">{children}</div>

            {/* Prev / Next */}
            <div className="mt-12 pt-6 border-t border-border grid sm:grid-cols-2 gap-3">
              <Link
                to="/docs"
                className="group flex flex-col gap-1 rounded-lg border border-border hover:border-primary/40 bg-card hover:bg-card/80 p-4 transition"
              >
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Previous
                </span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition">
                  Introduction
                </span>
              </Link>
              <Link
                to="/docs"
                className="group flex flex-col gap-1 rounded-lg border border-border hover:border-primary/40 bg-card hover:bg-card/80 p-4 transition text-right"
              >
                <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition">
                  Browsing
                </span>
              </Link>
            </div>
          </div>
        </main>

        {/* ── Right TOC ── */}
        {toc && toc.length > 0 && (
          <aside className="hidden xl:block w-52 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
            <div className="px-4 py-6">
              <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest mb-3">
                On this page
              </p>
              <nav className="space-y-1">
                {toc.map((t) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className={`
                      block text-sm py-1 border-l-2 pl-3 transition
                      ${activeId === t.id
                        ? "border-primary text-primary font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}
                    `}
                  >
                    {t.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
