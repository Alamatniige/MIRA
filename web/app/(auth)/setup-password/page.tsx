"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

function SetupPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();

    const emailFromUrl = searchParams.get("email") || "";

    const [email, setEmail] = useState(emailFromUrl);
    const [tempPassword, setTempPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showTempPassword, setShowTempPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [isStaff, setIsStaff] = useState(false);

    useEffect(() => {
        if (emailFromUrl) {
            setEmail(emailFromUrl);
        }
    }, [emailFromUrl]);

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !tempPassword || !newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters long.");
            return;
        }

        setIsLoading(true);

        try {
            const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

            const response = await fetch(`${NEXT_PUBLIC_API_URL}/setup-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    tempPassword,
                    newPassword,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || "Failed to setup password");
            }

            const roleName = result.data?.User?.Role?.name || "Staff";

            if (roleName === "Admin" || roleName === "Super Admin") {
                login(result.data.accessToken, result.data.User);
                setIsStaff(false);
                setSuccessMessage("Password set successfully! Redirecting to dashboard...");
                setTimeout(() => {
                    router.push("/admin/dashboard");
                }, 2000);
            } else {
                setIsStaff(true);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isStaff) {
        return (
            <div className="bg-white/80 backdrop-blur-xl border border-[#0F766E]/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(15,118,110,0.06)] relative overflow-hidden text-center max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F766E] to-[#2dd4bf]" />

                <div className="mx-auto bg-[#0F766E]/10 p-4 rounded-2xl w-20 h-20 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-10 h-10 text-[#0F766E]" />
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Setup Complete</h2>
                <p className="text-slate-500 font-medium mb-8">Your password has been successfully set.</p>

                <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                    <p className="text-slate-600 text-sm leading-relaxed">
                        As a Staff member, please log in at the <strong className="text-[#0F766E]">MIRA Mobile Application</strong> using your email and new password.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl relative z-10 animate-in fade-in zoom-in-95 duration-500 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
            {/* Logo Section / Left Side */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#0E7490] shadow-[0_4px_20px_rgba(15,118,110,0.2)] mb-8">
                    <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 tracking-widest mb-4">MIRA</h1>
                <p className="text-[#0F766E] text-base lg:text-lg uppercase tracking-[0.2em] font-bold mb-4">
                    Setup Password
                </p>
                <p className="text-slate-500 text-sm lg:text-base leading-relaxed font-medium max-w-md">
                    Please provide your temporary password and choose a secure new password to activate your account.
                </p>
            </div>

            {/* Form Card / Right Side */}
            <div className="w-full max-w-md flex-1">
                <div className="bg-white/80 backdrop-blur-xl border border-[#0F766E]/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(15,118,110,0.06)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F766E] to-[#2dd4bf]" />

                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-slate-800">Secure your account</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Activate your MIRA administrative credentials.</p>
                    </div>

                    {(error || successMessage) && (
                        <div className={cn(
                            "mb-6 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 border",
                            error ? "bg-red-50 border-red-100 text-red-600" : "bg-green-50 border-green-100 text-green-600"
                        )}>
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

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                Temporary Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#0F766E] transition-colors" />
                                </div>
                                <input
                                    type={showTempPassword ? "text" : "password"}
                                    value={tempPassword}
                                    onChange={(e) => setTempPassword(e.target.value)}
                                    placeholder="From your email"
                                    required
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-11 pr-12 py-3 outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 transition-all font-medium shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowTempPassword(!showTempPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#0F766E] focus:outline-none transition-colors"
                                >
                                    {showTempPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                New Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#0F766E] transition-colors" />
                                </div>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    required
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-11 pr-12 py-3 outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 transition-all font-medium shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#0F766E] focus:outline-none transition-colors"
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                Confirm New Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#0F766E] transition-colors" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat new password"
                                    required
                                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-11 pr-12 py-3 outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 transition-all font-medium shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#0F766E] focus:outline-none transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={cn(
                                    "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed",
                                    "bg-gradient-to-r from-[#0F766E] to-[#0E7490] hover:from-[#115e59] hover:to-[#155e75] shadow-[0_4px_14px_rgba(15,118,110,0.25)]"
                                )}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Finish Setup
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
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
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,118,110,0.1),rgba(248,250,252,1))] p-4 relative overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-1/4 -left-64 w-96 h-96 bg-[#0F766E]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-[#0E7490]/10 rounded-full blur-[120px] pointer-events-none" />

            <Suspense fallback={
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <Loader2 className="w-8 h-8 text-[#0F766E] animate-spin" />
                    <p className="text-slate-400 font-medium">Preparing secure setup...</p>
                </div>
            }>
                <SetupPasswordForm />
            </Suspense>
        </div>
    );
}
