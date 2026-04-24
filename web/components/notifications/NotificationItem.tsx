'use client';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  Package,
  Wrench,
  UserCheck,
  AlertCircle,
  PackagePlus,
  LucideIcon,
  CheckCircle2,
  XCircle,
  PencilLine,
  Trash2,
  RefreshCw,
  ClipboardCheck,
  ShieldCheck,
} from 'lucide-react';
import { Notification, NotificationType } from '@/types/mira';

const ICON_MAP: Record<NotificationType, { icon: LucideIcon; iconColor: string; iconBg: string }> =
{
  REPORT_SUBMITTED: {
    icon: AlertCircle,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  REQUEST_PENDING: {
    icon: Package,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  REQUEST_ACCEPTED: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  REQUEST_REJECTED: {
    icon: XCircle,
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-500/10',
  },
  asset_assigned: {
    icon: UserCheck,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  asset_registered: {
    icon: PackagePlus,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  asset_updated: {
    icon: PencilLine,
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-50 dark:bg-violet-500/10',
  },
  asset_deleted: {
    icon: Trash2,
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-500/10',
  },
  asset_status_changed: {
    icon: RefreshCw,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50 dark:bg-orange-500/10',
  },
  issue_acknowledged: {
    icon: ClipboardCheck,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  issue_resolved: {
    icon: ShieldCheck,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  return_requested: {
    icon: RefreshCw,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50 dark:bg-orange-500/10',
  },
  asset_returned: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
};

function formatTime(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

interface NotificationItemProps {
  notification: Notification;
  onClick?: (id: string) => void;
  onClose?: () => void;
}

export function NotificationItem({ notification, onClick, onClose }: NotificationItemProps) {
  const router = useRouter();

  const handleNavigation = () => {
    if (!notification.is_read) {
      onClick?.(notification.id);
    }
    
    onClose?.();

    let path = '';
    switch (notification.type) {
      case 'REPORT_SUBMITTED':
      case 'issue_acknowledged':
      case 'issue_resolved':
        path = '/report';
        break;
      case 'asset_registered':
      case 'asset_updated':
      case 'asset_deleted':
      case 'asset_status_changed':
        path = '/asset';
        break;
      case 'REQUEST_PENDING':
      case 'REQUEST_ACCEPTED':
      case 'REQUEST_REJECTED':
      case 'asset_assigned':
      case 'return_requested':
      case 'asset_returned':
        path = '/assignment';
        break;
    }

    if (path) {
      router.push(path);
    }
  };

  const {
    icon: Icon,
    iconColor,
    iconBg,
  } = ICON_MAP[notification.type] ?? {
    icon: AlertCircle,
    iconColor: 'text-slate-500',
    iconBg: 'bg-slate-50 dark:bg-slate-500/10',
  };

  return (
    <div
      onClick={handleNavigation}
      className={cn(
        'flex items-start gap-3 px-4 py-3.5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50',
        !notification.is_read && 'bg-blue-50/40 dark:bg-blue-500/5',
      )}
    >
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          iconBg,
        )}
      >
        <Icon className={cn('h-4 w-4', iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'text-xs font-semibold truncate',
              !notification.is_read
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300',
            )}
          >
            {notification.title}
          </p>
          {!notification.is_read && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {notification.message}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            {formatTime(notification.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
