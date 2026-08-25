import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-slate-500" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-slate-200 mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action.href ? (
            <a
              href={action.href}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition active:scale-[0.98]"
            >
              {action.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition active:scale-[0.98]"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );

  return content;
}
