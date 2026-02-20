"use client";

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[var(--mira-teal)] border-t-transparent" />
      <p className="text-sm font-medium text-[var(--mira-gray-600)] dark:text-[var(--mira-gray-400)]">
        {message}
      </p>
    </div>
  );
}
