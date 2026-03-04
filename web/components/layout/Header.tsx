"use client";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-card/80 px-6 backdrop-blur">
      <div className="flex items-center gap-6">
        <div className="hidden flex-col lg:flex">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            IT ADMIN CONSOLE
          </span>
          <span className="text-sm font-semibold text-slate-900">
            MIRA – Management of IT Resources and Assets
          </span>
        </div>
        <div className="relative hidden w-72 items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 shadow-sm ring-0 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 md:flex">
          <span className="mr-2 text-xs text-slate-400">⌕</span>
          <input
            className="w-full bg-transparent text-[11px] outline-none placeholder:text-slate-400"
            placeholder="Search asset tag, asset name, or department"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-primary/50 hover:text-primary"
        >
          <span className="text-sm">⦿</span>
          <span className="absolute right-1 top-1 inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs shadow-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
            AD
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-[11px] font-medium text-slate-900">
              IT Administrator
            </span>
            <span className="text-[10px] text-slate-500">IT Department</span>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            className="ml-1 rounded-full border-0 text-slate-500 hover:bg-slate-100"
            aria-label="Admin menu"
          >
            ⋮
          </Button>
        </div>
      </div>
    </header>
  );
}

