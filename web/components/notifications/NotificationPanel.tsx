'use client';

import { CheckCheck, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { NotificationItem } from './NotificationItem';
import { Notification } from '@/types/mira';

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
  onClose: () => void;
}

export function NotificationPanel({
  notifications,
  unreadCount,
  onMarkAllRead,
  onMarkRead,
  onClose,
}: NotificationPanelProps) {
  return (
    <div className="absolute right-0 top-full mt-3 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#041112] shadow-xl shadow-slate-200/60 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </button>
          )}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Notification List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
            No notifications
          </p>
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onClick={onMarkRead} />
          ))
        )}
      </div>
    </div>
  );
}
