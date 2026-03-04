"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Search, Bell, ChevronDown, ShieldAlert } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#0F766E]/10 bg-white/80 px-6 backdrop-blur-xl shadow-[0_4px_24px_rgba(15,118,110,0.03)]">
      {/* Left Section - Empty now but kept for layout balance */}
      <div className="flex items-center gap-8">
      </div>

      <div className="flex items-center gap-5">
        <div className="relative hidden w-80 items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition-all focus-within:border-[#2dd4bf] focus-within:ring-4 focus-within:ring-[#0F766E]/10 md:flex group">
          <Search className="mr-2.5 h-4 w-4 text-slate-400 group-focus-within:text-[#0F766E] transition-colors" />
          <input
            className="w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400 font-medium"
            placeholder="Search asset tag, name, or department..."
          />
          <div className="absolute right-2 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            ⌘K
          </div>
        </div>

        <button
          aria-label="Notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-[#0F766E]/30 hover:bg-[#0F766E]/5 hover:text-[#0F766E]"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 border border-white"></span>
          </span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        <Link href="/profile" className="flex items-center gap-3 rounded-xl border border-transparent hover:border-slate-200 bg-transparent px-2 py-1.5 transition-all hover:bg-white hover:shadow-sm cursor-pointer group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0F766E] to-[#0E7490] text-xs font-bold text-white shadow-[0_0_10px_rgba(15,118,110,0.2)] group-hover:shadow-[0_0_15px_rgba(15,118,110,0.4)] transition-all">
            AD
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-xs font-semibold text-slate-800 group-hover:text-[#0F766E] transition-colors">
              IT Administrator
            </span>
            <span className="text-[10px] font-medium text-slate-500">
              Admin Access
            </span>
          </div>

        </Link>
      </div>
    </header>
  );
}
