'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarGradient } from '@/utils/user';

interface AvatarProps {
  src?: string;
  fullName?: string;
  userId?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-28 w-28 text-2xl',
};

export function Avatar({ src, fullName, userId, className, size = 'md' }: AvatarProps) {
  const initials = getInitials(fullName || '');
  const gradient = getAvatarGradient(userId || 'default');

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full overflow-hidden relative shadow-sm transition-all',
        SIZES[size],
        !src && `bg-linear-to-br ${gradient} text-white font-bold`,
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={fullName || 'User'}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
