'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-50 via-teal-50/30 to-slate-100 dark:from-[#020617] dark:via-[#041112] dark:to-[#020617] px-4">
      {/* Decorative blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-[#0f766e]/10 blur-3xl dark:bg-[#0f766e]/5" />
        <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-[#0e7490]/10 blur-3xl dark:bg-[#0e7490]/5" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="rounded-2xl border border-border bg-card shadow-lg px-8 py-12 flex flex-col items-center gap-6 dark:shadow-teal-950/30">
          {/* Icon */}
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-red-500 to-red-600 shadow-md">
            <AlertTriangle className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-red-500 dark:text-red-400">
              Something went wrong
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Unexpected Error</h1>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              {error.message || 'An unexpected error occurred. Please try again.'}
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-border" />

          {/* Action */}
          <div className="w-full">
            <Button
              onClick={reset}
              className="w-full gap-2 bg-linear-to-r from-[#0f766e] to-[#0e7490] hover:from-[#0d6c65] hover:to-[#0b6582] text-white shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </Button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-muted-foreground/70">
            MIRA – Management of IT Resources and Assets
          </p>
        </div>
      </div>
    </div>
  );
}
