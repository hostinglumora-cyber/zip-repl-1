import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
  textClass?: string;
}

export default function Logo({ size = 32, className, withText = true, textClass = "" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 select-none", className)}>
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* L — vertical stem */}
        <rect x="3" y="4" width="6" height="22" rx="2" fill="white" />
        {/* L — base bar */}
        <rect x="3" y="20" width="14" height="6" rx="2" fill="white" />
        {/* X — left-to-right diagonal, emerald */}
        <path d="M19 4 L33 28" stroke="#10b981" strokeWidth="5.5" strokeLinecap="round"/>
        {/* X — right-to-left diagonal, lighter emerald */}
        <path d="M33 4 L19 28" stroke="#10b981" strokeWidth="5.5" strokeLinecap="round" opacity="0.55"/>
      </svg>
      {withText && (
        <span className={cn("font-bold tracking-tight leading-none", textClass)}>
          <span className="text-white">Liberty</span><span style={{ color: "#10b981" }}>X</span>
        </span>
      )}
    </span>
  );
}
