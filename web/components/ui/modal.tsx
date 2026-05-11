import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string; // For the modal box itself
  overlayClassName?: string; // For the darkened background wrapper
  showCloseButton?: boolean; // Option to hide the X button
  contentClassName?: string; // Option to override body padding
  mobileBottomSheet?: boolean; // Option to display as a bottom sheet on mobile
}

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  className,
  overlayClassName,
  showCloseButton = true,
  contentClassName,
  mobileBottomSheet = false,
}: ModalProps) {
  if (!open) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex bg-black/60 backdrop-blur-sm dark:bg-[#000000]/80 print:hidden overflow-hidden transition-all duration-300',
        mobileBottomSheet ? 'items-end sm:items-center justify-center' : 'items-center justify-center',
        overlayClassName,
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'w-full bg-white shadow-xl shadow-slate-900/10 dark:bg-[#09090b] dark:shadow-black/50 transition-all flex flex-col',
          mobileBottomSheet
            ? 'rounded-t-[2rem] rounded-b-none border-x-0 border-b-0 animate-in slide-in-from-bottom-full duration-500 ease-out max-h-[92dvh] w-full pb-[env(safe-area-inset-bottom)] m-0 sm:max-w-lg sm:rounded-2xl sm:border sm:border-slate-200 sm:mb-0 sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95'
            : 'max-w-lg border border-slate-200 rounded-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]',
          className,
        )}
      >
        {title && (
          <div className="flex items-start justify-between border-b border-slate-100 px-5 py-3 dark:border-teal-800/25">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
              {description ? (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>
              ) : null}
            </div>
            {onClose && showCloseButton ? (
              <Button
                variant="ghost"
                size="icon-xs"
                type="button"
                onClick={onClose}
                className={cn(
                  'h-7 w-7 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-teal-800/40 dark:hover:text-slate-200 transition-colors',
                )}
              >
                <X className="h-3 w-3" />
              </Button>
            ) : null}
          </div>
        )}
        <div className={cn('px-5 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-teal-800/40', contentClassName)}>{children}</div>
      </div>
    </div>
  );
}
