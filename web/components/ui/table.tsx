import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs shadow-slate-100 dark:border-white/10 dark:bg-[#09090b] dark:shadow-black/40">
      <table
        className={cn(
          "w-full border-collapse text-left text-xs text-slate-700 dark:text-slate-200",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "bg-slate-50/80 text-[11px] uppercase tracking-wide text-slate-500 dark:bg-teal-950/50 dark:text-slate-400",
        className
      )}
      {...props}
    />
  );
}

export function TableBody(
  props: React.HTMLAttributes<HTMLTableSectionElement>
) {
  return <tbody {...props} />;
}

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-t border-slate-100 hover:bg-slate-50/60 dark:border-teal-800/20 dark:hover:bg-teal-900/20",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("px-4 py-2.5 font-medium", className)}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-4 py-2.5 align-middle text-xs text-slate-700 dark:text-slate-300",
        className
      )}
      {...props}
    />
  );
}

