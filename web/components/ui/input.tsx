import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 shadow-xs outline-none transition-colors",
          "placeholder:text-slate-400",
          "focus:border-primary focus:ring-2 focus:ring-primary/20",
          "disabled:cursor-not-allowed disabled:bg-slate-50",
          "dark:border-white/10 dark:bg-[#09090b] dark:text-zinc-100 dark:placeholder:text-zinc-500",
          "dark:focus:border-teal-500 dark:focus:ring-teal-500/20",
          "dark:disabled:bg-teal-950/30",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

