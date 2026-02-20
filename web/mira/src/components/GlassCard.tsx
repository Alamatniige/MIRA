import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-lg shadow-primary/5',
        'transition-all duration-300',
        hover && 'hover:shadow-xl hover:shadow-primary/10 hover:bg-white/80 hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  );
}
