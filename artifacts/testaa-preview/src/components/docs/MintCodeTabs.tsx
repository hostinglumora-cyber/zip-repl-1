import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeTab {
  title: string;
  code: string;
  language?: string;
  filename?: string;
}

interface MintCodeTabsProps {
  tabs?: CodeTab[];
  filename?: string;
  code?: string;
  language?: string;
  className?: string;
}

export function MintCodeTabs({
  tabs,
  filename,
  code,
  language,
  className,
}: MintCodeTabsProps) {
  const activeTabs: CodeTab[] = tabs || [
    {
      title: filename || language || "Terminal",
      code: code || "",
      language: language || "bash",
      filename: filename,
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentTab = activeTabs[activeIdx] || activeTabs[0];

  const handleCopy = async () => {
    if (!currentTab?.code) return;
    try {
      await navigator.clipboard.writeText(currentTab.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <div
      className={cn(
        "my-6 overflow-hidden rounded-xl border border-border/80 bg-zinc-950/80 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm",
        className
      )}
    >
      {/* Tab Header Bar */}
      <div className="flex items-center justify-between border-b border-border/50 bg-secondary/30 px-3.5 py-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {activeTabs.map((tab, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={tab.title + idx}
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                  isActive
                    ? "bg-zinc-800 text-primary shadow-sm border border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-800/40"
                )}
              >
                <Terminal className="h-3.5 w-3.5 opacity-60" />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-zinc-800 hover:text-foreground"
          title="Copy code"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="relative overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-200">
        <pre className="m-0 font-mono">
          <code>{currentTab.code}</code>
        </pre>
      </div>
    </div>
  );
}
