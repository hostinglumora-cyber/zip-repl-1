import React from "react";
import { cn } from "@/lib/utils";

interface MintStepsProps {
  children: React.ReactNode;
  className?: string;
}

export function MintSteps({ children, className }: MintStepsProps) {
  return (
    <div className={cn("relative my-8 border-l border-border/80 ml-3.5 pl-6 space-y-9", className)}>
      {children}
    </div>
  );
}

interface MintStepProps {
  number?: number | string;
  title: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}

export function MintStep({ number, title, badge, children, className }: MintStepProps) {
  return (
    <div className={cn("relative group", className)}>
      {/* Step node pill on the vertical line */}
      <div className="absolute -left-[37px] top-0 flex h-7 w-7 items-center justify-center rounded-full border border-primary/40 bg-card text-xs font-bold text-primary shadow-[0_0_15px_rgba(46,204,113,0.2)] transition-all group-hover:scale-110 group-hover:border-primary">
        {number ?? "•"}
      </div>
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <h3 className="text-base font-semibold text-foreground tracking-tight m-0">
            {title}
          </h3>
          {badge && (
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}
