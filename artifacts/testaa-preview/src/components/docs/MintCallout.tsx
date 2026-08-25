import React from "react";
import { Info, AlertTriangle, CheckCircle2, AlertOctagon, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "tip" | "warning" | "danger" | "note";

interface MintCalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<
  CalloutType,
  {
    container: string;
    iconColor: string;
    titleColor: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultTitle: string;
  }
> = {
  tip: {
    container: "border-emerald-500/30 bg-emerald-950/20 text-emerald-200/90 shadow-[0_0_20px_rgba(16,185,129,0.05)]",
    iconColor: "text-emerald-400",
    titleColor: "text-emerald-300",
    icon: CheckCircle2,
    defaultTitle: "Tip",
  },
  info: {
    container: "border-blue-500/30 bg-blue-950/20 text-blue-200/90 shadow-[0_0_20px_rgba(59,130,246,0.05)]",
    iconColor: "text-blue-400",
    titleColor: "text-blue-300",
    icon: Info,
    defaultTitle: "Info",
  },
  note: {
    container: "border-violet-500/30 bg-violet-950/20 text-violet-200/90 shadow-[0_0_20px_rgba(139,92,246,0.05)]",
    iconColor: "text-violet-400",
    titleColor: "text-violet-300",
    icon: Lightbulb,
    defaultTitle: "Note",
  },
  warning: {
    container: "border-amber-500/30 bg-amber-950/20 text-amber-200/90 shadow-[0_0_20px_rgba(245,158,11,0.05)]",
    iconColor: "text-amber-400",
    titleColor: "text-amber-300",
    icon: AlertTriangle,
    defaultTitle: "Warning",
  },
  danger: {
    container: "border-rose-500/30 bg-rose-950/20 text-rose-200/90 shadow-[0_0_20px_rgba(244,63,94,0.05)]",
    iconColor: "text-rose-400",
    titleColor: "text-rose-300",
    icon: AlertOctagon,
    defaultTitle: "Caution",
  },
};

export function MintCallout({
  type = "info",
  title,
  children,
  className,
}: MintCalloutProps) {
  const current = styles[type] || styles.info;
  const Icon = current.icon;

  return (
    <div
      className={cn(
        "my-6 flex gap-3.5 rounded-xl border p-4 backdrop-blur-sm transition-all",
        current.container,
        className
      )}
    >
      <div className="shrink-0 pt-0.5">
        <Icon className={cn("h-5 w-5", current.iconColor)} />
      </div>
      <div className="flex-1 text-sm leading-relaxed">
        {title && (
          <div className={cn("font-semibold mb-1", current.titleColor)}>
            {title || current.defaultTitle}
          </div>
        )}
        <div className="text-muted-foreground text-[13px] [&>p]:mb-2 [&>p:last-child]:mb-0 [&_a]:text-foreground [&_a]:underline">
          {children}
        </div>
      </div>
    </div>
  );
}
