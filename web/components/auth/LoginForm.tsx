"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function LoginForm() {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        const storedEmail = localStorage.getItem("rememberedEmail");
        if (storedEmail) {
            setFormData(prev => ({ ...prev, email: storedEmail }));
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
                localStorage.setItem("rememberedEmail", formData.email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            // Redirect happens inside login function
        } catch (err: any) {
            setError(err.message || "Failed to sign in. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
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

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                                {error}
                            </div>
                        )}

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
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••••••"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-11 pr-12 py-3.5 outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 transition-all placeholder:text-slate-400 font-medium tracking-wider shadow-sm"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-2 h-full flex items-center text-slate-400 hover:text-[#0F766E] focus:outline-none transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
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
                                <label htmlFor="remember" className="text-sm text-slate-600 font-medium cursor-pointer select-none">
                                    Remember me
                                </label>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    size="lg"
                                    className={cn(
                                        "w-full flex items-center justify-center gap-2 py-6 rounded-xl text-white font-semibold text-sm transition-all relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed",
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
                                </Button>
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
