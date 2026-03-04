"use client";

import React, { useState } from "react";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate authentication delay
        setTimeout(() => {
            setIsLoading(false);
            // Redirect to dashboard (assuming "/" is the dashboard or "/dashboard")
            router.push("/");
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,118,110,0.1),rgba(248,250,252,1))] p-4 relative overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-1/4 -left-64 w-96 h-96 bg-[#0F766E]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-[#0E7490]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-5xl relative z-10 animate-in fade-in zoom-in-95 duration-500 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
                {/* Logo Section / Left Side */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
                    <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#0E7490] shadow-[0_4px_20px_rgba(15,118,110,0.2)] mb-8">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 tracking-widest mb-4">MIRA</h1>
                    <p className="text-[#0F766E] text-base lg:text-lg uppercase tracking-[0.2em] font-bold mb-4">
                        IT Admin Console
                    </p>
                    <p className="text-slate-500 text-sm lg:text-base leading-relaxed font-medium max-w-md">
                        Enterprise management of IT resources, hardware assets, and administrative assignments.
                    </p>
                </div>

                {/* Login Card / Right Side */}
                <div className="w-full max-w-md flex-1">
                    <div className="bg-white/80 backdrop-blur-xl border border-[#0F766E]/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(15,118,110,0.06)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F766E] to-[#2dd4bf]" />

                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800">Welcome back</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Please enter your credentials to access the system.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 transition-all placeholder:text-slate-400 font-medium shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Password
                                    </label>
                                    <a href="#" className="text-xs text-[#0F766E] hover:text-[#0E7490] transition-colors font-semibold">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#0F766E] transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••••••"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 transition-all placeholder:text-slate-400 font-medium tracking-wider shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
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
                                            Sign In
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}

                                    {/* Button shine effect */}
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center border-t border-slate-100 pt-6">
                            <p className="text-xs text-slate-500 font-medium">
                                By signing in, you agree to the <br />
                                <a href="#" className="text-slate-700 hover:text-[#0F766E] transition-colors underline decoration-slate-300 underline-offset-4 font-semibold">Terms of Service</a> & <a href="#" className="text-slate-700 hover:text-[#0F766E] transition-colors underline decoration-slate-300 underline-offset-4 font-semibold">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
