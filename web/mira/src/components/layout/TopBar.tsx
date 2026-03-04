"use client";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { Search, Bell, User, ChevronDown } from "lucide-react";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/assets": "Asset Registry",
  "/assignment": "Asset Assignment",
  "/monitoring": "Monitoring",
  "/reports": "Reports",
  "/users": "Users",
  "/settings": "Settings",
};

interface TopBarProps {
  title?: string;
  onMenuClick?: () => void;
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const displayTitle = title ?? routeTitles[pathname] ?? "Dashboard";

  return (
    <header 
      className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-teal-200/50 bg-white pl-4 pr-8 shadow-sm"
    >
      {/* Left: Sidebar Toggle + Page Title */}
      <div className="flex shrink-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center rounded-xl p-2.5 text-teal-600 transition-all duration-200 hover:bg-teal-50 hover:shadow-sm hover:scale-105"
          aria-label="Toggle sidebar"
        >
          <Icon icon="mynaui:sidebar" className="h-6 w-6 text-teal-600" />
        </button>
        <h1 className="text-xl font-bold text-teal-700">
          {displayTitle}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-500 transition-colors group-focus-within:text-teal-600" />
          <input
            type="search"
            placeholder="Search..."
            className="h-10 w-64 rounded-xl border border-teal-200/60 bg-white/80 pl-9 pr-4 text-sm placeholder:text-teal-400/70 shadow-sm transition-all duration-200 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-300/30 focus:shadow-md hover:border-teal-300"
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-xl p-2.5 text-teal-600 transition-all duration-200 hover:bg-teal-50 hover:shadow-sm hover:scale-105"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-red-400 to-red-500 ring-2 ring-white shadow-sm" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 rounded-xl border border-teal-200/60 bg-white/80 px-3 py-2 shadow-sm transition-all duration-200 hover:border-teal-300 hover:shadow-md cursor-pointer group">
          <div 
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d9488] text-white shadow-md transition-transform group-hover:scale-110"
          >
            <User className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-teal-900">
              IT Admin
            </p>
            <p className="text-xs text-teal-600/80">admin@company.com</p>
          </div>
          <ChevronDown className="h-4 w-4 text-teal-500 transition-transform group-hover:rotate-180" />
        </div>
      </div>
    </header>
  );
}
