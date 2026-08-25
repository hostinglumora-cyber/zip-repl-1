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
  size = 28,
  className,
  withText = true,
  textClass = "",
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none group", className)}>
      {/* Handcrafted Geometric LX Vector Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Subtle Outer Glow & Gradients */}
          <linearGradient id="lxBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#131B24" />
            <stop offset="100%" stopColor="#080C12" />
          </linearGradient>

          <linearGradient id="lxSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id="lxEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Outer Squircle Container */}
        <rect
          width="36"
          height="36"
          rx="10"
          fill="url(#lxBg)"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1.2"
        />

        {/* Geometric 'L' shape with curved outer corner */}
        <path
          d="M8.5 10C8.5 8.6 9.6 7.5 11 7.5H14.5V22C14.5 22.8 15.2 23.5 16 23.5H23.5V27C23.5 28.1 22.6 28.5 21.5 28.5H11C9.6 28.5 8.5 27.4 8.5 26V10Z"
          fill="url(#lxSilver)"
        />

        {/* Geometric 'X' chevron & forward stroke with emerald accent */}
        <path
          d="M17.5 8.5C17.5 7.7 18.2 7 19 7H24C26.8 7 28.5 8.8 28.5 11.5V16.5C28.5 17.3 27.8 18 27 18H23.5V14.5C23.5 13.1 22.4 12 21 12H17.5V8.5Z"
          fill="url(#lxSilver)"
        />

        {/* Center Dynamic Emerald Slanted Core */}
        <path
          d="M16 16.5L24 24.5C24.8 25.3 26 24.7 26 23.6V20.5L20 14.5H16.9C16.1 14.5 15.5 15.5 16 16.5Z"
          fill="url(#lxEmerald)"
        />
      </svg>

      {/* Brand Text */}
      {withText && (
        <span className={cn("font-bold tracking-tight text-foreground flex items-center gap-1", textClass)}>
          <span>Liberty</span>
          <span className="text-emerald-400 font-extrabold">X</span>
        </span>
      )}
    </span>
  );
}
