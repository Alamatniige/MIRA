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
  LogOut
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/lib/auth";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Assets", href: "/asset", icon: Box },
  { label: "Assignments", href: "/assignment", icon: ClipboardList },
  { label: "Reports", href: "/report", icon: BarChart3 },
];

const SETTINGS_ITEM = { label: "Settings", href: "/settings", icon: Settings };

export interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out",
        "bg-gradient-to-b from-[#041112] to-[#020809] border-r border-[#0F766E]/20 shadow-[4px_0_24px_rgba(15,118,110,0.08)]",
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
              <span className="text-white font-bold tracking-wider text-xl leading-tight">MIRA</span>
              <span className="text-[10px] text-teal-400/80 font-medium uppercase tracking-widest mt-0.5">IT Admin Portal</span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 z-50 flex items-center justify-center w-6 h-6 rounded-full bg-[#0F766E] text-white border-2 border-[#041112] hover:bg-[#0E7490] hover:scale-110 transition-all shadow-[0_0_10px_rgba(15,118,110,0.5)]"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 ml-0.5" /> : <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
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
                  ? "bg-gradient-to-r from-[#0F766E]/25 to-transparent text-white border-l-[3px] border-[#2dd4bf] shadow-[inset_0_0_20px_rgba(15,118,110,0.1)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent hover:scale-[1.02]",
                isCollapsed ? "justify-center px-0" : ""
              )}
            >
              <Icon
                className={cn(
                  "flex-shrink-0 w-5 h-5 transition-all duration-300",
                  isActive ? "text-[#2dd4bf] drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" : "text-slate-400 group-hover:text-teal-400"
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
      <div className="p-3 border-t border-slate-700/40 space-y-2">
        <Link
          href={SETTINGS_ITEM.href}
          className={cn(
            "group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-300",
            pathname === SETTINGS_ITEM.href
              ? "bg-gradient-to-r from-[#0F766E]/25 to-transparent text-white border-l-[3px] border-[#2dd4bf] shadow-[inset_0_0_20px_rgba(15,118,110,0.1)]"
              : "text-slate-400 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent hover:scale-[1.02]",
            isCollapsed ? "justify-center px-0" : ""
          )}
        >
          <SETTINGS_ITEM.icon
            className={cn(
              "flex-shrink-0 w-5 h-5 transition-all duration-300",
              pathname === SETTINGS_ITEM.href ? "text-[#2dd4bf] drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" : "text-slate-400 group-hover:text-teal-400"
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
          onClick={async () => {
            await logout();
          }}
          className={cn(
            "w-full group relative flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-300",
            "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border-l-[3px] border-transparent hover:scale-[1.02]",
            isCollapsed ? "justify-center px-0" : ""
          )}
        >
          <LogOut
            className={cn(
              "flex-shrink-0 w-5 h-5 transition-all duration-300",
              "text-slate-400 group-hover:text-rose-400"
            )}
          />
          {!isCollapsed && (
            <span className="font-medium text-sm whitespace-nowrap">Log Out</span>
          )}

          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-[#0F766E] text-white text-xs font-semibold rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              Log Out
              <div className="absolute top-1/2 -left-1 -mt-1 border-t-4 border-t-transparent border-r-4 border-r-[#0F766E] border-b-4 border-b-transparent"></div>
            </div>
          )}
        </Button>
      </div>
    </aside>
  );
}

