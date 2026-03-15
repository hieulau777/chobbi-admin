import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default:
      "bg-indigo-600/90 text-slate-50 border border-indigo-500/80",
    outline:
      "border border-slate-600 text-slate-200 bg-slate-900/60",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

