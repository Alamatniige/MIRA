"use client";
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--mira-gray-50)]">
      <Sidebar isCollapsed={isCollapsed} />
      <div className={`transition-all duration-300 ${isCollapsed ? "pl-20" : "pl-64"}`}>
        <TopBar onMenuClick={() => setIsCollapsed(!isCollapsed)} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
