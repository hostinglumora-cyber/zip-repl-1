import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronRight,
  BookOpen,
  ArrowUpRight,
  MessageCircle,
  Sparkles,
  Layers,
  ShieldCheck,
  Code2,
  FileText,
  Compass,
  Menu,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import { Footer } from "@/pages/Home";
import { MintSearchDialog } from "@/components/docs/MintSearchDialog";
import { MintFeedback } from "@/components/docs/MintFeedback";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export interface NavGroup {
  group: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: {
    label: string;
    pageId: string;
    badge?: string;
    to?: string;
  }[];
}

export const DOCS_NAVIGATION: NavGroup[] = [
  {
    group: "Getting Started",
    icon: Sparkles,
    items: [
      { label: "Quickstart", pageId: "quickstart", badge: "Popular" },
      { label: "Overview & Features", pageId: "overview" },
      { label: "Account Setup & Auth", pageId: "account" },
    ],
  },
  {
    group: "Creator Guides",
    icon: Layers,
    items: [
      { label: "Selling Your First Asset", pageId: "selling" },
      { label: "Listing Types & Bundles", pageId: "listing-types" },
      { label: "Delivering Digital Codes", pageId: "codes" },
    ],
  },
  {
    group: "Safety & Security",
    icon: ShieldCheck,
    items: [
      { label: "Scam-Shield Escrow", pageId: "scam-protection", badge: "Protected" },
      { label: "Roblox ID Verification", pageId: "verification" },
    ],
  },
  {
    group: "Developer API",
    icon: Code2,
    items: [
      { label: "REST API Reference", pageId: "api" },
      { label: "Discord Bot Webhooks", pageId: "webhooks" },
    ],
  },
  {
    group: "Legal & Policies",
    icon: FileText,
    items: [
      { label: "Privacy Policy", pageId: "privacy", to: "/privacy" },
      { label: "Terms of Service", pageId: "tos", to: "/tos" },
    ],
  },
];

interface DocsLayoutProps {
  children: React.ReactNode;
  title?: string;
  badge?: string;
  description?: string;
  readingTime?: string;
  currentPageId?: string;
  onSelectPage?: (pageId: string) => void;
  toc?: { id: string; label: string }[];
  prevPage?: { label: string; pageId: string };
  nextPage?: { label: string; pageId: string };
}

export default function DocsLayout({
  children,
  title,
  badge,
  description,
  readingTime = "3 min read",
  currentPageId = "quickstart",
  onSelectPage,
  toc = [],
  prevPage,
  nextPage,
}: DocsLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!toc || toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -60% 0%" }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc, currentPageId]);

  const filteredNav = filterQuery.trim()
    ? DOCS_NAVIGATION.map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(filterQuery.toLowerCase())
        ),
      })).filter((group) => group.items.length > 0)
    : DOCS_NAVIGATION;

  const handleNavClick = (item: { pageId: string; to?: string }) => {
    setMobileNavOpen(false);
    if (item.to) return;
    if (onSelectPage) {
      onSelectPage(item.pageId);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D14] text-foreground selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Search Modal */}
      <MintSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectDoc={(page) => {
          if (onSelectPage) onSelectPage(page);
        }}
      />

      {/* Mintlify Sticky Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#090D14]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Section Badge */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <Logo size={28} textClass="text-base font-bold" />
            </Link>

            <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-4">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                <span>Documentation</span>
              </span>
            </div>
          </div>

          {/* Top Quick Navigation Tabs */}
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <button
              onClick={() => onSelectPage && onSelectPage("quickstart")}
              className={cn(
                "transition-colors hover:text-foreground",
                currentPageId === "quickstart" && "text-emerald-400 font-semibold"
              )}
            >
              Quickstart
            </button>
            <button
              onClick={() => onSelectPage && onSelectPage("selling")}
              className={cn(
                "transition-colors hover:text-foreground",
                currentPageId === "selling" && "text-emerald-400 font-semibold"
              )}
            >
              Creator Guides
            </button>
            <button
              onClick={() => onSelectPage && onSelectPage("api")}
              className={cn(
                "transition-colors hover:text-foreground",
                currentPageId === "api" && "text-emerald-400 font-semibold"
              )}
            >
              API Reference
            </button>
          </div>

          {/* Search Trigger & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-44 sm:w-60 items-center justify-between rounded-lg border border-white/10 bg-secondary/40 px-3 text-xs text-muted-foreground transition-all hover:border-emerald-500/40 hover:bg-secondary/70 hover:text-foreground focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-emerald-400/80" />
                <span>Search docs...</span>
              </div>
              <span className="hidden sm:inline-flex items-center rounded border border-white/10 bg-black/40 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                Ctrl K
              </span>
            </button>

            <Link
              to="/marketplace"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-emerald-500/40 hover:text-foreground hover:bg-secondary"
            >
              <Compass className="h-3.5 w-3.5 text-emerald-400" />
              <span>Marketplace</span>
            </Link>

            <button
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted-foreground md:hidden hover:text-foreground"
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_220px] gap-10">
        {/* Left Navigation Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-72 transform bg-[#090D14] p-6 border-r border-white/5 transition-transform duration-200 lg:static lg:w-full lg:p-0 lg:border-none lg:bg-transparent lg:translate-x-0",
            mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 space-y-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
              <input
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter navigation..."
                className="w-full rounded-lg border border-white/10 bg-secondary/30 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>

            <nav className="space-y-6">
              {filteredNav.map((group) => {
                const GroupIcon = group.icon || BookOpen;
                return (
                  <div key={group.group}>
                    <div className="flex items-center gap-2 px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
                      <GroupIcon className="h-3.5 w-3.5 text-emerald-400/80" />
                      <span>{group.group}</span>
                    </div>

                    <div className="space-y-0.5 border-l border-white/5 ml-3 pl-2">
                      {group.items.map((item) => {
                        const isActive = currentPageId === item.pageId;
                        const linkContent = (
                          <div
                            className={cn(
                              "group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-all",
                              isActive
                                ? "text-foreground font-semibold border-l-2 border-zinc-400 -ml-[9px] pl-3.5"
                                : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground font-medium"
                            )}
                          >
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span
                                className={cn(
                                  "rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                                  isActive
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-secondary text-muted-foreground border border-border/50"
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                        );

                        if (item.to) {
                          return (
                            <Link key={item.label} to={item.to} className="block no-underline">
                              {linkContent}
                            </Link>
                          );
                        }

                        return (
                          <button
                            key={item.label}
                            onClick={() => handleNavClick(item)}
                            className="w-full text-left focus:outline-none"
                          >
                            {linkContent}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="rounded-xl border border-white/5 bg-secondary/20 p-3.5">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-foreground">
                <MessageCircle className="h-4 w-4 text-[#5865F2]" />
                <span>Discord Community</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-2.5">
                Need help with a livery or trade? Join 500+ ER:LC creators.
              </p>
              <a
                href={BRAND.discordUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:underline"
              >
                Join Discord Server <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </aside>

        {mobileNavOpen && (
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Central Content Canvas */}
        <main className="min-w-0 max-w-3xl">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mb-5 font-medium">
            <Link to="/" className="hover:text-foreground transition-colors">
              LibertyX
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/docs" className="hover:text-foreground transition-colors">
              Docs
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{title || "Documentation"}</span>
          </nav>

          <div className="mb-8 border-b border-white/5 pb-8">
            <div className="flex items-center gap-2.5 mb-2">
              {badge && (
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  {badge}
                </span>
              )}
              <span className="text-xs text-muted-foreground/60">{readingTime}</span>
            </div>

            {title && (
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                {title}
              </h1>
            )}

            {description && (
              <p className="text-base text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <div className="prose-docs">{children}</div>

          <MintFeedback />

          <div className="mt-10 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPage ? (
              <button
                onClick={() => onSelectPage && onSelectPage(prevPage.pageId)}
                className="group flex flex-col items-start rounded-xl border border-white/10 bg-card/40 p-4 text-left backdrop-blur-sm transition-all hover:border-emerald-500/40 hover:bg-card/80"
              >
                <span className="text-[11px] font-medium text-muted-foreground/60 flex items-center gap-1 mb-1">
                  ← Previous
                </span>
                <span className="text-sm font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
                  {prevPage.label}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextPage ? (
              <button
                onClick={() => onSelectPage && onSelectPage(nextPage.pageId)}
                className="group flex flex-col items-end rounded-xl border border-white/10 bg-card/40 p-4 text-right backdrop-blur-sm transition-all hover:border-emerald-500/40 hover:bg-card/80"
              >
                <span className="text-[11px] font-medium text-muted-foreground/60 flex items-center gap-1 mb-1">
                  Next →
                </span>
                <span className="text-sm font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
                  {nextPage.label}
                </span>
              </button>
            ) : (
              <div />
            )}
          </div>
        </main>

        {/* Right Dynamic TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {toc && toc.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                  On this page
                </p>
                <nav className="space-y-1.5 border-l border-white/5 pl-3">
                  {toc.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cn(
                          "block text-xs transition-colors py-0.5 leading-relaxed",
                          isActive
                            ? "text-emerald-400 font-semibold border-l-2 border-emerald-400 -ml-[13px] pl-3"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            <div className="pt-6 border-t border-white/5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                Community & Help
              </p>
              <div className="space-y-2 text-xs">
                <a
                  href={BRAND.discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#5865F2]" />
                  <span>Join 500+ on Discord</span>
                </a>
                <Link
                  to="/status"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>System Status (99.9%)</span>
                </Link>
                <Link
                  to="/sell"
                  className="flex items-center gap-2 text-emerald-400 font-medium hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Publish New Asset</span>
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
