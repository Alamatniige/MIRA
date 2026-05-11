'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function LoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Redirect happens inside login function
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to sign in. Please check your credentials.');
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] sm:p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Auras */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-linear-to-br from-[#0F766E]/20 to-transparent rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-linear-to-tl from-[#0E7490]/20 to-transparent rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(45,212,191,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full sm:max-w-md h-full sm:h-auto relative z-10 animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center justify-center sm:gap-8">
        {/* Login Card */}
        <div className="w-full h-full sm:h-auto">
          <div className="bg-white/70 backdrop-blur-3xl border-none sm:border sm:border-white/40 p-6 sm:p-8 rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-[0_32px_64px_-16px_rgba(15,118,110,0.12)] relative group transition-all duration-500 hover:sm:shadow-[0_48px_80px_-20px_rgba(15,118,110,0.18)] overflow-hidden h-full sm:h-auto flex flex-col justify-center">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#0F766E] via-[#2DD4BF] to-[#0E7490] sm:rounded-t-[2.5rem]" />
            <div className="absolute inset-0 sm:rounded-[2.5rem] bg-linear-to-br from-white/40 to-transparent pointer-events-none" />

            {/* Branding inside Card */}
            <div className="flex items-center justify-center gap-2 mb-6 relative -translate-x-2">
              <div className="relative group/logo">
                <div className="absolute -inset-4 bg-linear-to-r from-[#0F766E]/20 to-[#0E7490]/20 rounded-full blur-2xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500" />
                <Image
                  src="/mira-web-favicon/icon0.svg"
                  alt="MIRA Logo"
                  width={48}
                  height={48}
                  className="w-10 h-10 object-contain relative transition-transform duration-500 group-hover/logo:scale-110"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">
                  MIRA
                </h1>
                <div className="h-1 w-full bg-linear-to-r from-[#0F766E] to-[#2DD4BF] rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-white/40 animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-6 relative">
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">Welcome Back!</h2>
              <p className="text-slate-500 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 uppercase">

                Smart asset tracking starts here.

              </p>
            </div>


            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 relative">
              <div className="space-y-2 group/field">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 group-focus-within/field:text-[#0F766E] transition-colors ml-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within/field:text-[#0F766E] transition-all duration-300" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="admin@mira.cloud"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#f1f5f9]/50 border border-slate-200/60 text-slate-900 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#0F766E]/50 focus:bg-white focus:ring-[6px] focus:ring-[#0F766E]/5 transition-all duration-300 placeholder:text-slate-400 font-semibold shadow-inner-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 group/field">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 group-focus-within/field:text-[#0F766E] transition-colors">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-black uppercase tracking-[0.05em] text-[#0F766E] hover:text-[#0E7490] transition-colors"
                  >
                    Reset Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within/field:text-[#0F766E] transition-all duration-300" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#f1f5f9]/50 border border-slate-200/60 text-slate-900 rounded-2xl pl-12 pr-14 py-4 outline-none focus:border-[#0F766E]/50 focus:bg-white focus:ring-[6px] focus:ring-[#0F766E]/5 transition-all duration-300 placeholder:text-slate-400 font-semibold tracking-widest shadow-inner-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 h-full flex items-center text-slate-400 hover:text-[#0F766E] focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E] accent-[#0F766E] cursor-pointer transition-colors"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-slate-600 font-medium cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className={cn(
                    'w-full flex items-center justify-center gap-3 py-7 rounded-xl text-white font-black text-sm uppercase tracking-widest transition-all relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed',
                    'bg-[#0F766E] hover:bg-[#115e59] shadow-[0_20px_40px_-12px_rgba(15,118,110,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(15,118,110,0.5)] hover:-translate-y-0.5 active:translate-y-0',
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </>
                  )}

                  {/* Premium button shine */}
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
                </Button>
              </div>
            </form>

            <div className="mt-4 text-center border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-500 font-medium">
                By signing in, you agree to use the system responsibly. <br />

              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
