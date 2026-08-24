import React from "react";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export default function Logo({ size = 30, className, withText = true, textClass = "" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <img src="/branding/liberty-mark.svg.png" alt="" className="shrink-0 object-contain" style={{ width: size, height: size }} />
      {withText && (
        <span className={cn("font-bold tracking-tight text-foreground", textClass)}>
          {BRAND.name}
        </span>
      )}
    </span>
  );
}