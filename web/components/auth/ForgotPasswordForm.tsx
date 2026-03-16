'use client';

import React, { useState } from 'react';
import { ShieldCheck, Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,118,110,0.1),rgba(248,250,252,1))] p-4 relative overflow-hidden">
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-[#0F766E]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-[#0E7490]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500 text-center">
          <div className="bg-white/80 backdrop-blur-xl border border-[#0F766E]/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(15,118,110,0.06)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#0F766E] to-[#2dd4bf]" />
            
            <div className="flex justify-center mb-6">
               <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-[#0F766E] to-[#0E7490] shadow-[0_4px_20px_rgba(15,118,110,0.2)]">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">Check your email</h2>
            <p className="text-slate-500 mb-8">
              We've sent a password reset link to <span className="font-semibold text-slate-800">{email}</span>.
            </p>

            <Link href="/login" className="w-full">
              <Button
                variant="outline"
                className="w-full py-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0F766E] transition-all font-semibold"
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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,118,110,0.1),rgba(248,250,252,1))] p-4 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-[#0F766E]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-[#0E7490]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10 animate-in fade-in zoom-in-95 duration-500 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        {/* Logo Section / Left Side */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-[#0F766E] to-[#0E7490] shadow-[0_4px_20px_rgba(15,118,110,0.2)] mb-8">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 tracking-widest mb-4">
            MIRA
          </h1>
          <p className="text-[#0F766E] text-base lg:text-lg uppercase tracking-[0.2em] font-bold mb-4">
            Management of IT Resources & Assets
          </p>
          <p className="text-slate-500 text-sm lg:text-base leading-relaxed font-medium max-w-md">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Forgot Password Card / Right Side */}
        <div className="w-full max-w-md flex-1">
          <div className="bg-white/80 backdrop-blur-xl border border-[#0F766E]/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(15,118,110,0.06)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#0F766E] to-[#2dd4bf]" />

            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800">Forgot password?</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                No worries, it happens. Well send you reset instructions.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#0F766E] transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="admin@mira.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 transition-all placeholder:text-slate-400 font-medium shadow-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-6 rounded-xl text-white font-semibold text-sm transition-all relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed',
                    'bg-linear-to-r from-[#0F766E] to-[#0E7490] hover:from-[#115e59] hover:to-[#155e75] shadow-[0_4px_14px_rgba(15,118,110,0.25)]',
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}

                  {/* Button shine effect */}
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F766E] transition-colors font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
