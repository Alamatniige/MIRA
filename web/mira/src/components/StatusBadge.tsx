import { cn } from '@/lib/utils';
import type { AssetStatus } from '@/types';

const statusConfig: Record<AssetStatus, { bg: string; text: string; dot: string }> = {
  Active: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Maintenance: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  Disposed: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

interface StatusBadgeProps {
  status: AssetStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', config.bg, config.text, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {status}
    </span>
  );
}
