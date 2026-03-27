'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulation of API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real implementation, we would call an API endpoint here
      // For now, we just simulate success
      setSubmitted(true);
    } catch (err: unknown) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden font-sans">
        {/* Dynamic Background Auras */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-linear-to-br from-[#0F766E]/20 to-transparent rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-linear-to-tl from-[#0E7490]/20 to-transparent rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(45,212,191,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500 text-center">
          <div className="bg-white/70 backdrop-blur-3xl border border-white/40 p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(15,118,110,0.12)] relative group transition-all duration-500">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#0F766E] via-[#2DD4BF] to-[#0E7490] rounded-t-[2.5rem]" />
            <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-br from-white/40 to-transparent pointer-events-none" />

            <div className="flex justify-center mb-8 relative">
              <div className="relative group">
                <div className="absolute -inset-4 bg-linear-to-r from-[#0F766E]/20 to-[#0E7490]/20 rounded-full blur-2xl opacity-100" />
                <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-[#0F766E] to-[#0E7490] shadow-[0_4px_20px_rgba(15,118,110,0.25)]">
                  <Mail className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight transition-all relative">Check your email</h2>
            <p className="text-slate-500 mb-10 font-medium">
              We've sent a password reset link to <span className="font-bold text-[#0F766E]">{email}</span>.
            </p>

            <Link href="/login" className="w-full block">
              <Button
                variant="outline"
                className="w-full py-7 rounded-2xl border-slate-200/60 text-slate-600 hover:bg-slate-50 hover:text-[#0F766E] hover:border-[#0F766E]/30 transition-all font-bold uppercase tracking-widest text-xs"
              >
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Auras */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-linear-to-br from-[#0F766E]/20 to-transparent rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-linear-to-tl from-[#0E7490]/20 to-transparent rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(45,212,191,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center gap-8">
        {/* Forgot Password Card */}
        <div className="w-full">
          <div className="bg-white/70 backdrop-blur-3xl border border-white/40 p-8 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(15,118,110,0.12)] relative group transition-all duration-500 hover:shadow-[0_48px_80px_-20px_rgba(15,118,110,0.18)] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#0F766E] via-[#2DD4BF] to-[#0E7490] rounded-t-[2.5rem]" />
            <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-br from-white/40 to-transparent pointer-events-none" />

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
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Security Recovery</h2>
              <p className="text-slate-500 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 uppercase">
                <span className="w-8 h-[1px] bg-slate-200" />
                MIRA Account Access
                <span className="w-8 h-[1px] bg-slate-200" />
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f1f5f9]/50 border border-slate-200/60 text-slate-900 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#0F766E]/50 focus:bg-white focus:ring-[6px] focus:ring-[#0F766E]/5 transition-all duration-300 placeholder:text-slate-400 font-semibold shadow-inner-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className={cn(
                    'w-full flex items-center justify-center gap-3 py-7 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed',
                    'bg-[#0F766E] hover:bg-[#115e59] shadow-[0_20px_40px_-12px_rgba(15,118,110,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(15,118,110,0.5)] hover:-translate-y-0.5 active:translate-y-0',
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Send Reset
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </>
                  )}

                  {/* Premium button shine */}
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
                </Button>
              </div>
            </form>

            <div className="mt-4 text-center border-t border-slate-100 pt-3 relative">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#0F766E] transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
