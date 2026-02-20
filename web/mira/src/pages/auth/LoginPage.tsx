import { Link } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--mira-gray-50)] via-white to-[var(--mira-teal-muted)]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/2 h-full w-full animate-pulse opacity-20"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, var(--mira-teal) 0%, transparent 50%), radial-gradient(circle at 70% 80%, var(--mira-navy) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 h-full w-full animate-pulse opacity-20"
          style={{
            animationDelay: "1s",
            background:
              "radial-gradient(circle at 60% 30%, var(--mira-teal-light) 0%, transparent 50%), radial-gradient(circle at 20% 70%, var(--mira-navy-light) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Decorative shapes */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-[var(--mira-teal)]/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-[var(--mira-navy)]/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Main card with glassmorphism */}
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/20 dark:bg-[var(--mira-gray-100)]/90 dark:border-[var(--mira-gray-200)]">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative p-8 md:p-10">
            {/* Logo and header */}
            <div className="mb-8 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--mira-teal)] to-[var(--mira-teal-dark)] blur-lg opacity-50" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--mira-teal)] to-[var(--mira-teal-dark)] text-xl font-bold text-white shadow-lg">
                  <Shield className="h-8 w-8" />
                </div>
              </div>
              <h1 className="text-center text-2xl font-bold text-[var(--mira-navy-light)] dark:text-[var(--mira-navy)]">
                Welcome to MIRA
              </h1>
              <p className="mt-2 text-center text-sm text-[var(--mira-gray-500)] dark:text-[var(--mira-gray-400)]">
                IT Hardware Asset Management System
              </p>
            </div>

            {/* Login form */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Email field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[var(--mira-navy-light)] dark:text-[var(--mira-navy)]"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--mira-gray-400)] transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-[var(--mira-gray-200)] bg-white/80 px-10 py-3.5 text-sm transition-all duration-200 placeholder:text-[var(--mira-gray-400)] focus:border-[var(--mira-teal)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--mira-teal)]/20 dark:border-[var(--mira-gray-300)] dark:bg-[var(--mira-gray-50)]/50 dark:focus:border-[var(--mira-teal)]"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[var(--mira-navy-light)] dark:text-[var(--mira-navy)]"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--mira-gray-400)] transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[var(--mira-gray-200)] bg-white/80 px-10 pr-12 py-3.5 text-sm transition-all duration-200 placeholder:text-[var(--mira-gray-400)] focus:border-[var(--mira-teal)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--mira-teal)]/20 dark:border-[var(--mira-gray-300)] dark:bg-[var(--mira-gray-50)]/50 dark:focus:border-[var(--mira-teal)]"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--mira-gray-400)] transition-colors hover:bg-[var(--mira-gray-100)] hover:text-[var(--mira-navy-light)] dark:hover:bg-[var(--mira-gray-200)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <Link
                href="/dashboard"
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[var(--mira-teal)] to-[var(--mira-teal-dark)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Sign In</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--mira-teal-light)] to-[var(--mira-teal)] opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </form>

            {/* Footer links */}
            <div className="mt-8 space-y-4 border-t border-[var(--mira-gray-200)] pt-6 dark:border-[var(--mira-gray-300)]">
              <p className="text-center text-xs text-[var(--mira-gray-500)] dark:text-[var(--mira-gray-400)]">
                <Shield className="mr-1 inline h-3 w-3" />
                Internal use only. Contact IT for access.
              </p>
              <Link
                href="/staff"
                className="flex items-center justify-center gap-2 text-center text-sm font-medium text-[var(--mira-teal)] transition-colors hover:text-[var(--mira-teal-dark)] hover:underline dark:text-[var(--mira-teal-light)]"
              >
                I&apos;m an employee — view my assigned assets
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
