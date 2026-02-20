import { cn } from '@/lib/utils';
import type { AssetStatus } from '@/types/asset.types';

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  active: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  maintenance: {
    bg: 'bg-amber-100 dark:bg-amber-900/50',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  issue: {
    bg: 'bg-orange-100 dark:bg-orange-900/50',
    text: 'text-orange-700 dark:text-orange-300',
    dot: 'bg-orange-500 dark:bg-orange-400',
  },
  disposed: {
    bg: 'bg-red-100 dark:bg-red-900/50',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500 dark:bg-red-400',
  },
  // Legacy PascalCase (e.g. from Dashboard / @/types)
  Active: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  Maintenance: {
    bg: 'bg-amber-100 dark:bg-amber-900/50',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  Disposed: {
    bg: 'bg-red-100 dark:bg-red-900/50',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500 dark:bg-red-400',
  },
};

const fallbackConfig = {
  bg: 'bg-gray-100 dark:bg-gray-800',
  text: 'text-gray-700 dark:text-gray-300',
  dot: 'bg-gray-500 dark:bg-gray-400',
};

interface StatusBadgeProps {
  status: AssetStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? fallbackConfig;
  const displayStatus = typeof status === 'string' ? status.charAt(0).toUpperCase() + status.slice(1) : status;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', config.bg, config.text, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {displayStatus}
    </span>
  );
}
