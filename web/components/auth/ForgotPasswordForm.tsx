'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft, Eye, EyeOff, ShieldCheck, Timer } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useForgotPassword, ForgotPasswordStep } from '@/hooks/useForgotPassword';

export function ForgotPasswordForm() {
  const {
    step,
    email,
    isLoading,
    error,
    expirySeconds,
    submitEmail,
    verifyOtp,
    resetPassword,
    resendOtp,
    clearError,
  } = useForgotPassword();

  const [formData, setFormData] = useState({
    email: '',
    otp: ['', '', '', '', '', ''],
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === ForgotPasswordStep.OTP) {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitEmail(formData.email);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value.slice(-1);
    setFormData({ ...formData, otp: newOtp });

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    clearError();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOtp(formData.otp.join(''));
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(formData.newPassword, formData.confirmPassword);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isExpired = expirySeconds <= 0;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] sm:p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-linear-to-br from-[#0F766E]/20 to-transparent rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-linear-to-tl from-[#0E7490]/20 to-transparent rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(45,212,191,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full sm:max-w-md h-full sm:h-auto relative z-10 animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center sm:gap-8">
        <div className="w-full h-full sm:h-auto">
          <div className="bg-white/70 backdrop-blur-3xl border-none sm:border sm:border-white/40 p-6 sm:p-8 rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-[0_32px_64px_-16px_rgba(15,118,110,0.12)] relative group transition-all duration-500 hover:sm:shadow-[0_48px_80px_-20px_rgba(15,118,110,0.18)] overflow-hidden h-full sm:h-auto flex flex-col justify-center">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#0F766E] via-[#2DD4BF] to-[#0E7490] sm:rounded-t-[2.5rem]" />
            <div className="absolute inset-0 sm:rounded-[2.5rem] bg-linear-to-br from-white/40 to-transparent pointer-events-none" />

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

            <div className="text-center mb-6 relative">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                {step === ForgotPasswordStep.Email && 'Security Recovery'}
                {step === ForgotPasswordStep.OTP && 'Check Your Email'}
                {step === ForgotPasswordStep.NewPassword && 'New Password'}
                {step === ForgotPasswordStep.Success && 'Account Secured'}
              </h2>
              <p className="text-slate-500 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 uppercase">
                <span className="w-8 h-[1px] bg-slate-200" />
                {step === ForgotPasswordStep.Email && 'MIRA Account Access'}
                {step === ForgotPasswordStep.OTP && 'Enter 6-digit code'}
                {step === ForgotPasswordStep.NewPassword && 'Create your credentials'}
                {step === ForgotPasswordStep.Success && 'Reset successful'}
                <span className="w-8 h-[1px] bg-slate-200" />
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            {step === ForgotPasswordStep.Email && (
              <form onSubmit={handleEmailSubmit} className="space-y-4 relative">
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
                      placeholder="admin@mira.cloud"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#f1f5f9]/50 border border-slate-200/60 text-slate-900 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#0F766E]/50 focus:bg-white focus:ring-[6px] focus:ring-[#0F766E]/5 transition-all duration-300 placeholder:text-slate-400 font-semibold shadow-inner-sm"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="lg"
                    className="w-full flex items-center justify-center gap-3 py-7 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed bg-[#0F766E] hover:bg-[#115e59] shadow-[0_20px_40px_-12px_rgba(15,118,110,0.4)]"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Reset Code <ArrowRight className="w-5 h-5" /></>}
                    <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
                  </Button>
                </div>
              </form>
            )}

            {step === ForgotPasswordStep.OTP && (
              <form onSubmit={handleOtpVerify} className="space-y-6 relative text-center">
                <div className="space-y-2">
                  <p className="text-slate-500 text-sm font-medium">
                    Enter the code sent to <span className="text-[#0F766E] font-bold">{email}</span>
                  </p>
                </div>

                <div className="flex justify-between gap-2">
                  {formData.otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 bg-[#f1f5f9]/50 border border-slate-200/60 text-center text-xl font-bold text-slate-900 rounded-xl outline-none focus:border-[#0F766E]/50 focus:bg-white focus:ring-[6px] focus:ring-[#0F766E]/5 transition-all"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 text-sm font-bold">
                  <Timer className={cn("w-4 h-4", isExpired ? "text-red-500" : "text-[#0F766E]")} />
                  <span className={isExpired ? "text-red-500" : "text-[#0F766E]"}>
                    {isExpired ? 'Code expired' : `Expires in ${formatTimer(expirySeconds)}`}
                  </span>
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={isLoading || isExpired || formData.otp.some(d => !d)}
                    size="lg"
                    className="w-full flex items-center justify-center gap-3 py-7 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all relative overflow-hidden group bg-[#0F766E] hover:bg-[#115e59] shadow-[0_20px_40px_-12px_rgba(15,118,110,0.4)]"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                  </Button>

                  <div className="text-sm font-medium text-slate-500">
                    Didn&apos;t receive a code?{' '}
                    <button
                      type="button"
                      onClick={resendOtp}
                      className="text-[#0F766E] font-bold hover:underline"
                    >
                      Resend
                    </button>
                  </div>
                </div>
              </form>
            )}

            {step === ForgotPasswordStep.NewPassword && (
              <form onSubmit={handlePasswordReset} className="space-y-4 relative">
                <div className="space-y-2 group/field">
                  <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full bg-[#f1f5f9]/50 border border-slate-200/60 text-slate-900 rounded-2xl pl-12 pr-14 py-4 outline-none focus:border-[#0F766E]/50 focus:bg-white focus:ring-[6px] focus:ring-[#0F766E]/5 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-4 text-slate-400 hover:text-[#0F766E]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 group/field">
                  <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-[#f1f5f9]/50 border border-slate-200/60 text-slate-900 rounded-2xl pl-12 pr-14 py-4 outline-none focus:border-[#0F766E]/50 focus:bg-white focus:ring-[6px] focus:ring-[#0F766E]/5 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-4 text-slate-400 hover:text-[#0F766E]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="lg"
                    className="w-full flex items-center justify-center gap-3 py-7 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all relative overflow-hidden group bg-[#0F766E]"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                  </Button>
                </div>
              </form>
            )}

            {step === ForgotPasswordStep.Success && (
              <div className="text-center space-y-6 relative animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                    <ShieldCheck className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Successfully Reset</h3>
                  <p className="text-slate-500 font-medium">Your password has been updated. You can now use it to sign in.</p>
                </div>
                <Link href="/login" className="block w-full">
                  <Button className="w-full py-7 rounded-2xl bg-[#0F766E] hover:bg-[#115e59] text-white font-black uppercase tracking-widest text-sm">
                    Back to Login
                  </Button>
                </Link>
              </div>
            )}

            {step !== ForgotPasswordStep.Success && (
              <div className="mt-6 text-center border-t border-slate-100 pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#0F766E] transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
