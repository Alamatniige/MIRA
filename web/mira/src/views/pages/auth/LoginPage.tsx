"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, isLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      router.replace("/dashboard");
    } else {
      setError(result.error ?? "Login failed.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/2 h-full w-full animate-pulse opacity-20"
          style={{
            background: "radial-gradient(circle at 30% 50%, rgba(45, 212, 191, 0.3) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 h-full w-full animate-pulse opacity-20"
          style={{
            animationDelay: "1s",
            background: "radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Decorative shapes */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Main card with glassmorphism */}
        <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-gray-200/50">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none z-0" />
          
          <div className="relative z-10 p-8 md:p-10">
            {/* Logo and header */}
            <div className="mb-8 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 blur-lg opacity-50" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-xl font-bold text-white shadow-lg">
                  <Shield className="h-8 w-8" />
                </div>
              </div>
              <h1 className="text-center text-2xl font-bold text-slate-800">
                Welcome to MIRA
              </h1>
              <p className="mt-2 text-center text-sm text-slate-600">
              Management of IT Resources and Assets
              </p>
            </div>

            {/* Login form */}
            <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
              {/* Email field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 z-20 text-gray-400 transition-colors pointer-events-none group-focus-within:text-teal-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="relative z-10 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3.5 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 z-20 text-gray-400 transition-colors pointer-events-none group-focus-within:text-teal-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="relative z-10 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-12 py-3.5 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-slate-700"
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

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              {/* Login button */}
              <button
                type="submit"
                disabled={submitting}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-teal-600 hover:to-teal-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                <span className="relative z-10">{submitting ? "Signing in…" : "Sign In"}</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="text-center text-xs text-gray-500">
                <Shield className="mr-1 inline h-3 w-3 text-teal-500" />
                Internal use only. Contact IT for access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
