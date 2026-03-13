"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useRef, useState, useEffect } from "react";
import { Bell, Moon, Sun, Package, Wrench, UserCheck, X, CheckCheck } from "lucide-react";
import { User as UserType } from "@/types/mira";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "../ui/button";

const NOTIFICATIONS = [
  {
    id: 1,
    icon: Package,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    title: "New asset registered",
    description: "LPT-02318 (Lenovo ThinkPad T14) was added to inventory.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: Wrench,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    title: "Maintenance scheduled",
    description: "SRV-00041 (HPE ProLiant DL380) sent for servicing.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    icon: UserCheck,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    title: "Asset assigned",
    description: "LPT-02197 assigned to Dela Cruz, Ana (Finance).",
    time: "Yesterday",
    unread: false,
  },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const { getCurrentUser } = useUsers();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  // Close on outside click
  useEffect(() => {
    if (!notifOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, [getCurrentUser]);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-teal-100 bg-white/80 dark:border-white/10 dark:bg-[#000000]/90 px-6 backdrop-blur-xl shadow-[0_4px_24px_rgba(15,118,110,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
      {/* Top Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0F766E] to-[#0E7490]" />

      {/* Left Section */}
      <div className="flex items-center gap-8" />

      <div className="flex items-center gap-5">
        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle Dark Mode"
          className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 shadow-sm transition-all hover:border-[#0F766E]/30 hover:bg-[#0F766E]/5 hover:text-[#0F766E] dark:hover:text-teal-400"
        >
          <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notification Bell */}
        <div className="relative" ref={panelRef}>
          <Button
            variant="outline"
            size="icon"
            aria-label="Notifications"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 shadow-sm transition-all hover:border-[#0F766E]/30 hover:bg-[#0F766E]/5 hover:text-[#0F766E] dark:hover:text-teal-400"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 border border-white" />
              </span>
            )}
          </Button>

          {/* Dropdown Panel */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-3 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#041112] shadow-xl shadow-slate-200/60 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
                    >
                      <CheckCheck className="h-3 w-3" />
                      Mark all read
                    </button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setNotifOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Notification List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3.5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50",
                        n.unread && "bg-blue-50/40 dark:bg-blue-500/5"
                      )}
                    >
                      <div className={cn("mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full", n.iconBg)}>
                        <Icon className={cn("h-4 w-4", n.iconColor)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn("text-xs font-semibold truncate", n.unread ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300")}>{n.title}</p>
                          {n.unread && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />}
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{n.description}</p>
                        <p className="mt-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">{n.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2.5">
                <Button variant="ghost" className="w-full rounded-lg py-1.5 text-xs font-medium text-[#0F766E] dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-colors">
                  View all notifications
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

        <Link href="/profile" className="flex items-center gap-3 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 bg-transparent px-2 py-1.5 transition-all hover:bg-white dark:hover:bg-slate-900/50 hover:shadow-sm cursor-pointer group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0F766E] to-[#0E7490] text-xs font-bold text-white shadow-[0_0_10px_rgba(15,118,110,0.2)] group-hover:shadow-[0_0_15px_rgba(15,118,110,0.4)] transition-all">
            AD
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#0F766E] dark:group-hover:text-teal-400 transition-colors">
              {currentUser?.fullName}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {currentUser?.role?.name}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
