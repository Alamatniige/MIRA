import * as React from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm dark:bg-[#000000]/80">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-card shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#09090b] dark:shadow-black/50">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-3 dark:border-teal-800/25">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {description}
              </p>
            ) : null}
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-teal-800/40 dark:hover:text-slate-200 transition-colors"
              )}
            >
              ✕
            </button>
          ) : null}
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

