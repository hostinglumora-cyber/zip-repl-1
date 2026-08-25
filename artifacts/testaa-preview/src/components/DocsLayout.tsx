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
  Server,
  Store,
  Palette,
  UploadCloud,
} from "lucide-react";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
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
      { label: "Account Setup", pageId: "account" },
      { label: "Discord Login", pageId: "discord-auth" },
      { label: "Roblox Verification", pageId: "verification" },
    ],
  },
  {
    group: "Marketplace",
    icon: Store,
    items: [
      { label: "Browsing & Filtering", pageId: "browsing" },
      { label: "Search & Hashtags", pageId: "search" },
      { label: "Instant Escrow Buying", pageId: "buying" },
      { label: "Order Receipts & Keys", pageId: "orders" },
      { label: "Verified Reviews", pageId: "reviews" },
    ],
  },
  {
    group: "Selling & Publishing",
    icon: UploadCloud,
    items: [
      { label: "Become a Creator (0% Fee)", pageId: "selling", badge: "0% Fee" },
      { label: "Create a Listing", pageId: "create-listing" },
      { label: "Product Images & Media", pageId: "media" },
      { label: "Tags & Hashtag Search", pageId: "tags" },
      { label: "Fleet Bundles & ELS", pageId: "bundles" },
      { label: "Digital Code Delivery", pageId: "codes" },
    ],
  },
  {
    group: "Creator Studio",
    icon: Layers,
    items: [
      { label: "Studio Dashboard Overview", pageId: "studio-overview" },
      { label: "Managing Products", pageId: "studio-products" },
      { label: "Customer Orders", pageId: "studio-orders" },
      { label: "Reviews & Seller Replies", pageId: "studio-reviews" },
      { label: "Direct Buyer Messages", pageId: "studio-messages" },
      { label: "Product Analytics", pageId: "studio-analytics" },
    ],
  },
  {
    group: "Storefronts",
    icon: Palette,
    items: [
      { label: "Personal Storefront URLs", pageId: "storefront-urls" },
      { label: "Storefront Builder", pageId: "storefront-builder" },
      { label: "Custom Banners & Colors", pageId: "storefront-branding" },
      { label: "Custom Services & FAQs", pageId: "storefront-services" },
    ],
  },
  {
    group: "Community Hosting",
    icon: Server,
    items: [
      { label: "Hosting Overview ($12.99/mo)", pageId: "hosting-overview" },
      { label: "Deploying a Node", pageId: "hosting-deploy" },
      { label: "Bot Environment Secrets", pageId: "hosting-env" },
      { label: "Container Logs & Monitoring", pageId: "hosting-logs" },
    ],
  },
  {
    group: "Developers",
    icon: Code2,
    items: [
      { label: "REST API Reference", pageId: "api" },
      { label: "Discord Webhook Relays", pageId: "webhooks" },
    ],
  },
  {
    group: "Policies & Safety",
    icon: FileText,
    items: [
      { label: "Scam-Shield Escrow", pageId: "scam-protection", badge: "Protected" },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between selection:bg-emerald-500/25 selection:text-emerald-300">
      <div>
        <SiteNav />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-10">
          
          {/* Left Sidebar (Sticky Mintlify Navigation) */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto pr-4 border-r border-white/[0.06]">
            <div className="space-y-6">
              {DOCS_NAVIGATION.map((group) => (
                <div key={group.group} className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                    {group.icon && <group.icon className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{group.group}</span>
                  </div>

                  <div className="space-y-0.5 pl-5 border-l border-white/[0.06]">
                    {group.items.map((item) => {
                      const isSelected = item.pageId === currentPageId;
                      return item.to ? (
                        <Link
                          key={item.pageId}
                          to={item.to}
                          className="block py-1.5 text-xs text-zinc-400 hover:text-white transition"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          key={item.pageId}
                          type="button"
                          onClick={() => onSelectPage?.(item.pageId)}
                          className={cn(
                            "w-full text-left py-1.5 text-xs transition flex items-center justify-between",
                            isSelected
                              ? "text-emerald-400 font-bold"
                              : "text-zinc-400 hover:text-white"
                          )}
                        >
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content Pane */}
          <main className="flex-1 min-w-0 max-w-3xl space-y-8">
            <div className="space-y-3 pb-6 border-b border-white/[0.06]">
              {badge && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                  {badge}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{title}</h1>
              {description && <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>}
            </div>

            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-6">
              {children}
            </div>

            {/* Pagination Prev/Next */}
            <div className="flex items-center justify-between pt-8 border-t border-white/[0.06]">
              {prevPage ? (
                <button
                  type="button"
                  onClick={() => onSelectPage?.(prevPage.pageId)}
                  className="p-3 rounded-xl border border-white/[0.08] hover:border-emerald-500/30 bg-[#0A0D15] text-left text-xs font-semibold text-zinc-300 hover:text-white transition"
                >
                  <span className="block text-[10px] text-zinc-500 font-mono">PREVIOUS</span>
                  <span>← {prevPage.label}</span>
                </button>
              ) : <div />}

              {nextPage && (
                <button
                  type="button"
                  onClick={() => onSelectPage?.(nextPage.pageId)}
                  className="p-3 rounded-xl border border-white/[0.08] hover:border-emerald-500/30 bg-[#0A0D15] text-right text-xs font-semibold text-zinc-300 hover:text-white transition"
                >
                  <span className="block text-[10px] text-zinc-500 font-mono">NEXT</span>
                  <span>{nextPage.label} →</span>
                </button>
              )}
            </div>
          </main>

          {/* Right Table of Contents */}
          {toc.length > 0 && (
            <aside className="hidden xl:block w-48 shrink-0 sticky top-24 h-fit space-y-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                On this page
              </span>
              <div className="space-y-1.5 text-xs">
                {toc.map((t) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className="block text-zinc-400 hover:text-emerald-400 transition truncate"
                  >
                    {t.label}
                  </a>
                ))}
              </div>
            </aside>
          )}

        </div>
      </div>

      <MintSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectPage={(pid) => {
          onSelectPage?.(pid);
          setSearchOpen(false);
        }}
      />

      <Footer />
    </div>
  );
}
