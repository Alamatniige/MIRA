import * as React from "react";
import { cn } from "@/lib/utils";

const variants: Record<
  "default" | "success" | "warning" | "danger" | "muted",
  string
> = {
  default:
    "border-transparent bg-slate-100 text-slate-700",
  success:
    "border-transparent bg-primary/10 text-primary",
  warning:
    "border-transparent bg-amber-50 text-amber-700",
  danger:
    "border-transparent bg-red-50 text-red-700",
  muted:
    "border-transparent bg-slate-50 text-slate-500",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

