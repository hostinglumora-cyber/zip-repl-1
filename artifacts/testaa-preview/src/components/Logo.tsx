import React from "react";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
  textClass?: string;
}

export default function Logo({
  size = 36,
  className,
  withText = true,
  textClass = "",
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3 select-none group", className)}>
      {/* Floating Transparent Geometric LX Vector Mark (No Background Box) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="lxSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id="lxEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Clean Geometric 'L' Stem */}
        <path
          d="M5 8C5 6.3 6.3 5 8 5H12V23C12 24.1 12.9 25 14 25H25V29C25 30.1 24.1 31 23 31H8C6.3 31 5 29.7 5 28V8Z"
          fill="url(#lxSilverGrad)"
        />

        {/* Geometric 'X' Top Wing */}
        <path
          d="M16 6.5C16 5.7 16.7 5 17.5 5H25C28.3 5 31 7.7 31 11V17C31 17.8 30.3 18.5 29.5 18.5H25V13.5C25 12.1 23.9 11 22.5 11H16V6.5Z"
          fill="url(#lxSilverGrad)"
        />

        {/* Dynamic Emerald Slanted Core */}
        <path
          d="M14 17L26 29C27 30 28.5 29.3 28.5 28V24L20 15.5H15.5C14.4 15.5 13.5 16.5 14 17Z"
          fill="url(#lxEmeraldGrad)"
        />
      </svg>

      {/* Brand Wordmark */}
      {withText && (
        <span className={cn("font-bold tracking-tight text-white flex items-center gap-1", textClass)}>
          <span>Liberty</span>
          <span className="text-emerald-400 font-extrabold">X</span>
        </span>
      )}
    </span>
  );
}
