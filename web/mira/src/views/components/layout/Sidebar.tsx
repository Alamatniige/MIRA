"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Package,
  UserPlus,
  FileText,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assets", label: "Asset Registry", icon: Package },
  { href: "/assignment", label: "Asset Assignment", icon: UserPlus },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/users", label: "Users", icon: Users },
];

interface SidebarProps {
  isCollapsed?: boolean;
}

export function Sidebar({ isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <aside 
      className={`fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-teal-700/30 bg-[#0f766e] text-white shadow-xl transition-all duration-300 dark:bg-[var(--mira-gray-200)] dark:border-[var(--mira-gray-300)] ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className={`flex h-16 items-center border-b border-white/20 backdrop-blur-sm transition-all duration-300 dark:border-[var(--mira-gray-300)] ${
        isCollapsed ? "justify-center px-0" : "gap-3 px-5"
      }`}>
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d9488] font-bold text-white shadow-lg transition-transform hover:scale-105 dark:bg-[var(--mira-teal)]"
        >
          M
        </div>
        {!isCollapsed && (
          <span className="font-bold tracking-tight text-lg dark:text-[var(--foreground)]">MIRA</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={isCollapsed ? label : undefined}
              className={`group relative flex items-center rounded-xl transition-all duration-200 ${
                isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-3 py-3"
              } ${
                isActive
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm dark:bg-white/15 dark:text-[var(--foreground)]"
                  : "text-teal-50/90 hover:bg-white/10 hover:text-white hover:shadow-md dark:text-[var(--mira-gray-600)] dark:hover:bg-white/10 dark:hover:text-[var(--foreground)]"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div 
                  className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#14b8a6]"
                />
              )}
              <Icon 
                className={`h-5 w-5 shrink-0 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} 
                strokeWidth={isActive ? 2 : 1.75} 
              />
              {!isCollapsed && (
                <>
                  <span className="relative z-10 text-sm font-medium">{label}</span>
                  {isActive && (
                    <div 
                      className="absolute inset-0 rounded-xl bg-[#14b8a6] opacity-20"
                    />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/20 p-3 space-y-1 backdrop-blur-sm dark:border-[var(--mira-gray-300)]">
        <Link
          href="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={`group relative flex items-center rounded-xl transition-all duration-200 ${
            isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-3 py-3"
          } ${
            pathname === "/settings" || pathname?.startsWith("/settings/")
              ? "bg-white/20 text-white shadow-lg backdrop-blur-sm dark:bg-white/15 dark:text-[var(--foreground)]"
              : "text-teal-50/90 hover:bg-white/10 hover:text-white hover:shadow-md dark:text-[var(--mira-gray-600)] dark:hover:bg-white/10 dark:hover:text-[var(--foreground)]"
          }`}
        >
          {/* Active indicator */}
          {(pathname === "/settings" || pathname?.startsWith("/settings/")) && (
            <div 
              className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#14b8a6]"
            />
          )}
          <Settings 
            className={`h-5 w-5 shrink-0 transition-transform ${pathname === "/settings" || pathname?.startsWith("/settings/") ? "scale-110" : "group-hover:scale-110"}`} 
            strokeWidth={pathname === "/settings" || pathname?.startsWith("/settings/") ? 2 : 1.75} 
          />
          {!isCollapsed && (
            <>
              <span className="relative z-10 text-sm font-medium">Settings</span>
              {(pathname === "/settings" || pathname?.startsWith("/settings/")) && (
                <div 
                  className="absolute inset-0 rounded-xl bg-[#14b8a6] opacity-20"
                />
              )}
            </>
          )}
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={`flex w-full items-center rounded-xl transition-all duration-200 hover:bg-white/10 hover:text-white hover:shadow-md dark:text-[var(--mira-gray-600)] dark:hover:bg-white/10 dark:hover:text-[var(--foreground)] ${
            isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-3 py-3"
          } text-sm font-medium text-teal-50/90`}
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform hover:scale-110" strokeWidth={1.75} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
