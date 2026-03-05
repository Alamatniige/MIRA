"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { isLoading, token } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-[#0F766E] animate-spin" />
            </div>
        );
    }

    if (!token) {
        return null; // AuthProvider handles redirect
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div
                className={cn(
                    "flex h-screen flex-1 flex-col transition-all duration-300 ease-in-out overflow-y-auto w-full",
                    isCollapsed ? "md:pl-20 pl-0" : "md:pl-64 pl-0"
                )}
            >
                <Header />
                <main className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-[#041112] dark:to-[#020809] px-4 md:px-6 pb-8 pt-6 overflow-x-hidden">
                    <div className="mx-auto max-w-6xl space-y-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
