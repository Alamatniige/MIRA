import Link from "next/link";

export function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--mira-gray-50)]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(135deg, var(--mira-navy) 0%, transparent 50%, var(--mira-teal-muted) 100%)",
        }}
      />
      <div className="relative w-full max-w-md px-4">
        <div className="mira-card p-8 shadow-[var(--shadow-md)]">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--mira-navy)] text-2xl font-bold text-white">
              MIRA
            </div>
            <h1 className="text-center text-lg font-semibold text-[var(--mira-navy-light)]">
              MIRA – IT Hardware Asset Management System
            </h1>
            <p className="mt-1 text-center text-sm text-[var(--mira-gray-500)]">
              Management of IT Resources and Assets
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[var(--mira-navy-light)]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="mira-input w-full"
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[var(--mira-navy-light)]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mira-input w-full"
                autoComplete="current-password"
              />
            </div>
            <Link
              href="/dashboard"
              className="mira-btn-primary flex w-full items-center justify-center py-2.5 text-sm"
            >
              Login
            </Link>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--mira-gray-500)]">
            Internal use only. Contact IT for access.
          </p>
          <p className="mt-3 text-center text-sm">
            <Link
              href="/staff"
              className="font-medium text-[var(--mira-teal)] hover:underline"
            >
              I&apos;m an employee — view my assigned assets
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
