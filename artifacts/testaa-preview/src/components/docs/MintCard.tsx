import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MintCardGroupProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export function MintCardGroup({ children, cols = 2, className }: MintCardGroupProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4 my-6", colClasses[cols], className)}>
      {children}
    </div>
  );
}

interface MintCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  href?: string;
  to?: string;
  tag?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function MintCard({
  title,
  description,
  icon: Icon,
  href,
  to,
  tag,
  className,
  children,
  onClick,
}: MintCardProps) {
  const content = (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/90 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
        (href || to || onClick) && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary transition-colors group-hover:bg-primary/20">
                <Icon className="h-4 w-4" />
              </div>
            )}
            <h4 className="text-sm font-semibold text-foreground tracking-tight m-0 transition-colors group-hover:text-primary">
              {title}
            </h4>
          </div>
          {tag ? (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-secondary text-muted-foreground border border-border">
              {tag}
            </span>
          ) : (
            (href || to || onClick) && (
              <div className="text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary">
                {href ? <ArrowUpRight className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            )
          )}
        </div>

        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed m-0">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block no-underline">
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block no-underline">
        {content}
      </a>
    );
  }

  return content;
}
