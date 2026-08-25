import React, { useState } from "react";
import { Search, ArrowRight, X, Hash, BookOpen, Layers, ShieldCheck, Sparkles, Code2, Webhook, UserCheck, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface SearchDocItem {
  id: string;
  title: string;
  category: string;
  page: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const DOCS_SEARCH_ITEMS: SearchDocItem[] = [
  { id: "quickstart", title: "Quickstart Guide", category: "Getting Started", page: "quickstart", description: "Get started with LibertyX Marketplace in under 5 minutes.", icon: Sparkles },
  { id: "overview", title: "Platform Overview & Features", category: "Getting Started", page: "overview", description: "Core escrow architecture, zero-fee creator model, and speed.", icon: Sparkles },
  { id: "account", title: "Account Setup & Authentication", category: "Getting Started", page: "account", description: "Sign in with Discord, connect Roblox ID, and manage public profiles.", icon: UserCheck },
  { id: "selling", title: "Selling Your First Asset", category: "Creator Guides", page: "selling", description: "5-step wizard to upload liveries, uniforms, and ELS configs.", icon: Layers },
  { id: "listing-types", title: "Listing Types & Bundles", category: "Creator Guides", page: "listing-types", description: "Singles, Department Bundles, Free giveaways, and Digital Codes.", icon: Layers },
  { id: "codes", title: "Delivering Digital Codes", category: "Creator Guides", page: "codes", description: "Roblox Asset IDs, Pastebin scripts, and deliverable vault tokens.", icon: KeyRound },
  { id: "scam-protection", title: "Scam-Shield Escrow Protection", category: "Safety & Security", page: "scam-protection", description: "How automated code release and dispute protection works.", icon: ShieldCheck },
  { id: "verification", title: "Roblox ID Verification", category: "Safety & Security", page: "verification", description: "Verify your Roblox account with game code confirmation.", icon: ShieldCheck },
  { id: "api", title: "REST API Reference", category: "Developer", page: "api", description: "Programmatically list assets, verify orders, and check health.", icon: Code2 },
  { id: "webhooks", title: "Discord Bot Webhooks", category: "Developer", page: "webhooks", description: "Real-time purchase notifications and community bot feeds.", icon: Webhook },
];

interface MintSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectDoc?: (page: string, sectionId?: string) => void;
}

export function MintSearchDialog({ open, onOpenChange, onSelectDoc }: MintSearchDialogProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = query.trim()
    ? DOCS_SEARCH_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : DOCS_SEARCH_ITEMS;

  const handleSelect = (item: SearchDocItem) => {
    onOpenChange(false);
    setQuery("");
    if (onSelectDoc) {
      onSelectDoc(item.page, item.id);
    } else {
      navigate(`/docs?page=${item.page}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setQuery(""); }}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden border-white/[0.06] bg-[#0D1117] shadow-2xl">
        <DialogTitle className="sr-only">Search Documentation</DialogTitle>

        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 h-12">
          <Search className="h-4 w-4 text-zinc-500 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-zinc-600 focus:outline-none"
            autoFocus
          />

          {/* Clear button — only when there's text */}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="flex h-5 w-5 items-center justify-center rounded text-zinc-500 hover:text-zinc-300 transition"
            >
              <X className="h-3 w-3" />
            </button>
          )}

          {/* ESC badge — spaced away from clear button */}
          <kbd className="ml-1 shrink-0 rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 select-none">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[340px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-zinc-600">
              No results for "<span className="text-zinc-400">{query}</span>"
            </div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map((item) => {
                const Icon = item.icon || Hash;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="w-full group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-white/[0.04]"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-500 group-hover:text-zinc-300 shrink-0 transition">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-300 group-hover:text-white truncate transition">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-zinc-600 truncate">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="h-3 w-3 text-zinc-700 group-hover:text-zinc-400 transition shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer — keyboard hints with proper dark badges */}
        <div className="flex items-center gap-4 border-t border-white/[0.06] px-4 py-2 text-[10px] text-zinc-600">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1 py-px font-mono text-zinc-500">↑</kbd>
            <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1 py-px font-mono text-zinc-500">↓</kbd>
            <span className="ml-0.5">navigate</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1 py-px font-mono text-zinc-500">↵</kbd>
            <span className="ml-0.5">select</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
