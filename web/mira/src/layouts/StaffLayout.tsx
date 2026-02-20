import Link from "next/link";

export function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--mira-gray-50)]">
      <header className="sticky top-0 z-20 border-b border-[var(--mira-gray-200)] bg-[var(--mira-white)] shadow-[var(--shadow-sm)]">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/staff" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--mira-navy)] font-semibold text-white">
              M
            </div>
            <span className="font-semibold text-[var(--mira-navy-light)]">
              MIRA – My Assets
            </span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-[var(--mira-gray-600)] hover:text-[var(--mira-teal)]"
          >
            Switch to IT view
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
