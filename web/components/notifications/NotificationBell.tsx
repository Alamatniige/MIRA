'use client';

import { useRef, useState, useEffect } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { NotificationPanel } from './NotificationPanel';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, error, fetchNotifications, markAllRead, markRead } =
    useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="outline"
        size="icon"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 shadow-sm transition-all hover:border-[#0F766E]/30 hover:bg-[#0F766E]/5 hover:text-[#0F766E] dark:hover:text-teal-400"
      >
        <Bell className="h-4.5 w-4.5" />
        {error ? (
          <span
            className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500"
            title="Notifications unavailable"
          >
            <AlertTriangle className="h-2.5 w-2.5 text-white" />
          </span>
        ) : unreadCount > 0 ? (
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 border border-white" />
          </span>
        ) : null}
      </Button>

      {open && (
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
          onMarkRead={markRead}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
