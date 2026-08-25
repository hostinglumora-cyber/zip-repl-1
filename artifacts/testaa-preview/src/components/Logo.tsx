import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
  textClass?: string;
}

export default function Logo({ className, textClass = "" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 select-none font-black tracking-tight", className)}>
      <span className={cn("text-xl sm:text-2xl font-black tracking-tight text-white", textClass)}>
        Liberty<span className="text-emerald-400">X</span>
      </span>
    </span>
  );
}
