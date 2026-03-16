'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '../ui/button';
import { NotificationBell } from '../notifications/NotificationBell';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user: currentUser } = useAuth();

  const initials = currentUser?.fullName
    ? currentUser.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??';

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-teal-100 bg-white/80 dark:border-white/10 dark:bg-[#000000]/90 px-6 backdrop-blur-xl shadow-[0_4px_24px_rgba(15,118,110,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
      {/* Top Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-3px bg-linear-to-r from-[#0F766E] to-[#0E7490]" />

      {/* Left Section */}
      <div className="flex items-center gap-8" />

      <div className="flex items-center gap-5">
        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle Dark Mode"
          className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 shadow-sm transition-all hover:border-[#0F766E]/30 hover:bg-[#0F766E]/5 hover:text-[#0F766E] dark:hover:text-teal-400"
        >
          <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notification Bell */}
        <NotificationBell />

        <div className="h-6 w-1px bg-slate-200 dark:bg-slate-800" />

        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 bg-transparent px-2 py-1.5 transition-all hover:bg-white dark:hover:bg-slate-900/50 hover:shadow-sm cursor-pointer group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-[#0F766E] to-[#0E7490] text-xs font-bold text-white shadow-[0_0_10px_rgba(15,118,110,0.2)] group-hover:shadow-[0_0_15px_rgba(15,118,110,0.4)] transition-all">
            {initials}
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
