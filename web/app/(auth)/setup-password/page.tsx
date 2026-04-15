'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

function SetupPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  const emailFromUrl = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailFromUrl);
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !tempPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const response = await fetch(`${NEXT_PUBLIC_API_URL}/setup-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          tempPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to setup password');
      }

      const roleName = result.data?.User?.Role?.name || 'Staff';

      if (roleName === 'Admin' || roleName === 'Super Admin') {
        login(result.data.accessToken, result.data.User);
        setIsStaff(false);
        setSuccessMessage('Password set successfully! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        setIsStaff(true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isStaff) {
    return (
      <div className="bg-white/70 backdrop-blur-3xl border border-white/40 p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(15,118,110,0.12)] relative group transition-all duration-500 text-center max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#0F766E] via-[#2DD4BF] to-[#0E7490] rounded-t-[2.5rem]" />
        <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-br from-white/40 to-transparent pointer-events-none" />

        <div className="mx-auto w-20 h-20 flex items-center justify-center mb-6">
          <Image
            src="/mira-web-favicon/icon0.svg"
            alt="MIRA Logo"
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Setup Complete</h2>
        <p className="text-slate-500 font-medium mb-10">
          Your enterprise credentials are now active.
        </p>

        <div className="bg-[#f1f5f9]/50 border border-slate-200/40 p-8 rounded-[1.5rem] relative">
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            As a Staff member, please log in via the{' '}
            <strong className="text-[#0F766E] font-bold">MIRA Mobile Interface</strong> using your
            institutional email and new access key.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center gap-8">
      {/* Form Card */}
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
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Account Setup
            </h2>
            <p className="text-slate-500 text-sm font-semibold tracking-wide flex items-center justify-center gap-2 uppercase">
              <span className="w-8 h-[1px] bg-slate-200" />
              MIRA Service Initialization
              <span className="w-8 h-[1px] bg-slate-200" />
            </p>
          </div>

          {(error || successMessage) && (
            <div
              className={cn(
                'mb-6 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 border',
                error
                  ? 'bg-red-50 border-red-100 text-red-600'
                  : 'bg-green-50 border-green-100 text-green-600',
              )}
            >
              {error || successMessage}
            </div>
          )}

          <form onSubmit={handleSetup} className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mira.com"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 transition-all font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2 group/field">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 group-focus-within/field:text-[#0F766E] transition-colors ml-1">
                Temporary Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within/field:text-[#0F766E] transition-all duration-300" />
                </div>
                <input
                  type={showTempPassword ? 'text' : 'password'}
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  placeholder="Verify from email"
                  required
                  className="w-full bg-[#f1f5f9]/50 border border-slate-200/60 text-slate-900 rounded-2xl pl-12 pr-14 py-4 outline-none focus:border-[#0F766E]/50 focus:bg-white focus:ring-[6px] focus:ring-[#0F766E]/5 transition-all duration-300 placeholder:text-slate-400 font-semibold tracking-widest shadow-inner-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowTempPassword(!showTempPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#0F766E] focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  {showTempPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 group/field">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 group-focus-within/field:text-[#0F766E] transition-colors ml-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within/field:text-[#0F766E] transition-all duration-300" />
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  className="w-full bg-[#f1f5f9]/50 border border-slate-200/60 text-slate-900 rounded-2xl pl-12 pr-14 py-4 outline-none focus:border-[#0F766E]/50 focus:bg-white focus:ring-[6px] focus:ring-[#0F766E]/5 transition-all duration-300 placeholder:text-slate-400 font-semibold tracking-widest shadow-inner-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#0F766E] focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 group/field">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 group-focus-within/field:text-[#0F766E] transition-colors ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within/field:text-[#0F766E] transition-all duration-300" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat Password"
                  required
                  className="w-full bg-[#f1f5f9]/50 border border-slate-200/60 text-slate-900 rounded-2xl pl-12 pr-14 py-4 outline-none focus:border-[#0F766E]/50 focus:bg-white focus:ring-[6px] focus:ring-[#0F766E]/5 transition-all duration-300 placeholder:text-slate-400 font-semibold tracking-widest shadow-inner-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#0F766E] focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full flex items-center justify-center gap-3 py-7 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed',
                  'bg-[#0F766E] hover:bg-[#115e59] shadow-[0_20px_40px_-12px_rgba(15,118,110,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(15,118,110,0.5)] hover:-translate-y-0.5 active:translate-y-0',
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Initialize Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
                {/* Premium button shine */}
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SetupPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Auras */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-linear-to-br from-[#0F766E]/20 to-transparent rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-linear-to-tl from-[#0E7490]/20 to-transparent rounded-full blur-[120px] animate-pulse pointer-events-none"
        style={{ animationDelay: '2s' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(45,212,191,0.05)_0%,transparent_70%)] pointer-events-none" />

      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <Loader2 className="w-8 h-8 text-[#0F766E] animate-spin" />
            <p className="text-slate-400 font-medium">Preparing secure setup...</p>
          </div>
        }
      >
        <SetupPasswordForm />
      </Suspense>
    </div>
  );
}
