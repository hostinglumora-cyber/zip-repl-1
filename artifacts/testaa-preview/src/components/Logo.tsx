import React from "react";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
  textClass?: string;
}

// Crisp geometric LX monogram — no background box, fully transparent
export default function Logo({ size = 32, className, withText = true, textClass = "" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* L stroke — vertical */}
        <rect x="4" y="4" width="5" height="22" rx="2" fill="white" />
        {/* L stroke — horizontal base */}
        <rect x="4" y="21" width="14" height="5" rx="2" fill="white" />
        {/* X stroke — top-left to bottom-right */}
        <rect
          x="13.5"
          y="4"
          width="4.5"
          height="24"
          rx="2"
          transform="rotate(-42 18 16)"
          fill="#10B981"
        />
        {/* X stroke — top-right to bottom-left */}
        <rect
          x="14"
          y="4"
          width="4.5"
          height="24"
          rx="2"
          transform="rotate(42 14 16)"
          fill="rgba(255,255,255,0.6)"
        />
      </svg>

      {withText && (
        <span className={cn("font-bold tracking-tight text-white leading-none", textClass)}>
          Liberty<span className="text-emerald-400">X</span>
        </span>
      )}
    </span>
  );
}
