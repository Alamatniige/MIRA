"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Box,
  ClipboardList,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LogOut,
  User,
  Loader2
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/lib/auth";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Assets", href: "/asset", icon: Box },
  { label: "Assignments", href: "/assignment", icon: ClipboardList },
  { label: "Reports", href: "/report", icon: BarChart3 },
  { label: "Users", href: "/users", icon: User },
];

const SETTINGS_ITEM = { label: "Settings", href: "/settings", icon: Settings };

export interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out",
        "bg-white dark:bg-[#000000] border-r border-teal-100 dark:border-white/10 shadow-[4px_0_24px_rgba(15,118,110,0.03)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.8)]",
        "backdrop-blur-xl",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Top Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0F766E] to-[#0E7490]" />

      {/* Header */}
      <div className="flex items-center justify-between h-20 px-4 mt-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F766E] to-[#0E7490] shadow-[0_0_15px_rgba(15,118,110,0.3)] border border-white/10">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in duration-300 whitespace-nowrap">
              <span className="text-slate-900 dark:text-white font-bold tracking-wider text-xl leading-tight">MIRA</span>
              <span className="text-[10px] text-[#0F766E] dark:text-teal-400/80 font-medium uppercase tracking-widest mt-0.5">IT Admin Portal</span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 z-50 flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 dark:bg-[#0F766E] text-teal-700 dark:text-white border border-teal-200 dark:border-[#041112] hover:bg-teal-100 dark:hover:bg-[#0E7490] hover:text-[#0F766E] dark:hover:text-white hover:scale-110 transition-all shadow-sm dark:shadow-[0_0_10px_rgba(15,118,110,0.5)]"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 ml-0.5" /> : <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-300",
                isActive
                  ? "bg-[#0F766E]/10 dark:bg-gradient-to-r dark:from-[#0F766E]/25 dark:to-transparent text-[#0F766E] dark:text-white border-l-[3px] border-[#0F766E] dark:border-[#2dd4bf] dark:shadow-[inset_0_0_20px_rgba(15,118,110,0.1)]"
                  : "text-slate-600 dark:text-slate-400 hover:text-[#0F766E] dark:hover:text-white hover:bg-teal-100/50 dark:hover:bg-white/5 border-l-[3px] border-transparent hover:scale-[1.02]",
                isCollapsed ? "justify-center px-0" : ""
              )}
            >
              <Icon
                className={cn(
                  "flex-shrink-0 w-5 h-5 transition-all duration-300",
                  isActive ? "text-[#0F766E] dark:text-[#2dd4bf] dark:drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" : "text-slate-400 group-hover:text-[#0F766E] dark:group-hover:text-teal-400"
                )}
              />

              {!isCollapsed && (
                <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-[#0F766E] text-white text-xs font-semibold rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                  {item.label}
                  {/* Tooltip Arrow */}
                  <div className="absolute top-1/2 -left-1 -mt-1 border-t-4 border-t-transparent border-r-4 border-r-[#0F766E] border-b-4 border-b-transparent"></div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-teal-100 dark:border-slate-700/40 space-y-2">
        <Link
          href={SETTINGS_ITEM.href}
          className={cn(
            "group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-300",
            pathname === SETTINGS_ITEM.href
              ? "bg-[#0F766E]/10 dark:bg-gradient-to-r dark:from-[#0F766E]/25 dark:to-transparent text-[#0F766E] dark:text-white border-l-[3px] border-[#0F766E] dark:border-[#2dd4bf] dark:shadow-[inset_0_0_20px_rgba(15,118,110,0.1)]"
              : "text-slate-600 dark:text-slate-400 hover:text-[#0F766E] dark:hover:text-white hover:bg-teal-100/50 dark:hover:bg-white/5 border-l-[3px] border-transparent hover:scale-[1.02]",
            isCollapsed ? "justify-center px-0" : ""
          )}
        >
          <SETTINGS_ITEM.icon
            className={cn(
              "flex-shrink-0 w-5 h-5 transition-all duration-300",
              pathname === SETTINGS_ITEM.href ? "text-[#0F766E] dark:text-[#2dd4bf] dark:drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" : "text-slate-400 group-hover:text-[#0F766E] dark:group-hover:text-teal-400"
            )}
          />
          {!isCollapsed && (
            <span className="font-medium text-sm whitespace-nowrap">{SETTINGS_ITEM.label}</span>
          )}

          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-[#0F766E] text-white text-xs font-semibold rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              {SETTINGS_ITEM.label}
              <div className="absolute top-1/2 -left-1 -mt-1 border-t-4 border-t-transparent border-r-4 border-r-[#0F766E] border-b-4 border-b-transparent"></div>
            </div>
          )}
        </Link>

        <Button
          variant="ghost"
          disabled={isLoggingOut}
          onClick={async () => {
            setIsLoggingOut(true);
            try {
              // The logout function handles the redirect, so we keep the loading state
              // active during the page transition to provide a seamless UX.
              await logout();
            } catch (error) {
              console.error(error);
              setIsLoggingOut(false);
            }
          }}
          className={cn(
            "w-full group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-300",
            "bg-transparent text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border-l-[3px] border-transparent hover:scale-[1.02]",
            isCollapsed ? "justify-center px-0" : "justify-start px-3",
            isLoggingOut && "opacity-70 cursor-not-allowed"
          )}
        >
          {isLoggingOut ? (
            <Loader2
              className={cn(
                "flex-shrink-0 w-5 h-5 animate-spin transition-all duration-300",
                "text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400"
              )}
            />
          ) : (
            <LogOut
              className={cn(
                "flex-shrink-0 w-5 h-5 transition-all duration-300",
                "text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400"
              )}
            />
          )}
          {!isCollapsed && (
            <span className="font-medium text-sm whitespace-nowrap">
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </span>
          )}

          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              {isLoggingOut ? "Logging out..." : "Log Out"}
              <div className="absolute top-1/2 -left-1 -mt-1 border-t-4 border-t-transparent border-r-4 border-r-rose-600 border-b-4 border-b-transparent"></div>
            </div>
          )}
        </Button>
      </div>
    </aside>
  );
}

