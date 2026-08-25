import React from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: { label: string; color?: string };
  actions?: React.ReactNode;
}

export default function PageHeader({ title, description, badge, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        {badge && (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 border ${badge.color || "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
            {badge.label}
          </span>
        )}
        <h1 className="text-xl font-bold tracking-tight text-slate-50">{title}</h1>
        {description && (
          <p className="text-sm text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
