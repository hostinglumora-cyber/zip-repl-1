import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface MintFeedbackProps {
  className?: string;
}

export function MintFeedback({ className }: MintFeedbackProps) {
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  return (
    <div
      className={cn(
        "my-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/70 bg-card/40 p-4 px-5 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
        <MessageSquare className="h-4 w-4 text-primary/70" />
        <span>Was this page helpful?</span>
      </div>

      {voted ? (
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="h-4 w-4" />
          <span>Thanks for your feedback!</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoted("up")}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>Yes</span>
          </button>
          <button
            onClick={() => setVoted("down")}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            <span>No</span>
          </button>
        </div>
      )}
    </div>
  );
}
