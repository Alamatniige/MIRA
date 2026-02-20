import { cn } from '@/lib/utils';
import type { AssetStatus } from '@/types/asset.types';

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  maintenance: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  issue: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  disposed: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  // Legacy PascalCase (e.g. from Dashboard / @/types)
  Active: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Maintenance: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  Disposed: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const fallbackConfig = { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };

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
