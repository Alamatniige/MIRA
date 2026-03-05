"use client";

import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFound() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 dark:from-[#020617] dark:via-[#041112] dark:to-[#020617] px-4">
            {/* Decorative blobs */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-[#0f766e]/10 blur-3xl dark:bg-[#0f766e]/5" />
                <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-[#0e7490]/10 blur-3xl dark:bg-[#0e7490]/5" />
            </div>

            <div className="relative z-10 w-full max-w-md text-center">
                {/* Card */}
                <div className="rounded-2xl border border-border bg-card shadow-lg px-8 py-12 flex flex-col items-center gap-6 dark:shadow-teal-950/30">

                    {/* Icon */}
                    <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0f766e] to-[#0e7490] shadow-md">
                        <FileQuestion className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>

                    {/* 404 heading */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0e7490] dark:text-teal-400">
                            Error 404
                        </p>
                        <h1 className="text-7xl font-bold tracking-tight bg-gradient-to-br from-[#0f766e] to-[#0e7490] bg-clip-text text-transparent leading-none">
                            404
                        </h1>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">
                            Page Not Found
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                            The page you are looking for doesn&apos;t exist or may have been moved.
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-border" />

                    {/* Actions */}
                    <div className="w-full">
                        <Button
                            asChild
                            className="w-full gap-2 bg-gradient-to-r from-[#0f766e] to-[#0e7490] hover:from-[#0d6c65] hover:to-[#0b6582] text-white shadow-sm"
                        >
                            <Link href="/dashboard">
                                <Home className="w-4 h-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>

                    {/* Footer note */}
                    <p className="text-xs text-muted-foreground/70">
                        MIRA – Management of IT Resources and Assets
                    </p>
                </div>
            </div>
        </div>
    );
}
