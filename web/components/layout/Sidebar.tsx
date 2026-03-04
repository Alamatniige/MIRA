"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Asset", href: "/asset" },
  { label: "Assignment", href: "/assignment" },
  { label: "Report", href: "/report" },
  { label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-xs font-semibold text-primary">
            IT
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide">
              MIRA
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Management of IT Resources &amp; Assets
            </span>
          </div>
        </div>
      </div>

      <nav className="mt-4 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname === "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "text-slate-300 hover:bg-primary/10 hover:text-white",
                isActive &&
                  "bg-primary/15 text-white shadow-[inset_3px_0_0_0_rgba(15,118,110,1)]"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full bg-slate-500 transition-colors",
                  isActive && "bg-primary"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden px-4 pb-4 pt-6 text-xs text-slate-500 md:block">
        IT Department · Internal Use Only
      </div>
    </aside>
  );
}

