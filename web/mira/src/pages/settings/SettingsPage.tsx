"use client";

import { useState } from "react";
import {
  Building2,
  Bell,
  Shield,
  Palette,
  Save,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyCritical, setNotifyCritical] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-[var(--mira-navy-light)]">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--mira-gray-500)]">
          System and preference settings
        </p>
      </div>

      {/* General */}
      <div className="mira-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[var(--mira-gray-200)] px-6 py-4">
          <Building2 className="h-5 w-5 text-[var(--mira-teal)]" strokeWidth={1.75} />
          <h2 className="text-base font-semibold text-[var(--mira-navy-light)]">
            General
          </h2>
        </div>
        <div className="space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--mira-gray-700)]">
              Organization name
            </label>
            <input
              type="text"
              defaultValue="MIRA – IT Asset Management"
              className="mira-input w-full max-w-md"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--mira-gray-700)]">
              Timezone
            </label>
            <select className="mira-input w-full max-w-md">
              <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--mira-gray-700)]">
              Date format
            </label>
            <select className="mira-input w-full max-w-md">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="mira-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[var(--mira-gray-200)] px-6 py-4">
          <Bell className="h-5 w-5 text-[var(--mira-teal)]" strokeWidth={1.75} />
          <h2 className="text-base font-semibold text-[var(--mira-navy-light)]">
            Notifications
          </h2>
        </div>
        <div className="space-y-5 p-6">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-sm font-medium text-[var(--mira-gray-700)]">
              Email notifications
            </span>
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--mira-gray-300)] text-[var(--mira-teal)] focus:ring-[var(--mira-teal)]"
            />
          </label>
          <p className="text-xs text-[var(--mira-gray-500)]">
            Receive weekly summaries and assignment updates by email.
          </p>
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-sm font-medium text-[var(--mira-gray-700)]">
              Critical alerts
            </span>
            <input
              type="checkbox"
              checked={notifyCritical}
              onChange={(e) => setNotifyCritical(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--mira-gray-300)] text-[var(--mira-teal)] focus:ring-[var(--mira-teal)]"
            />
          </label>
          <p className="text-xs text-[var(--mira-gray-500)]">
            Get notified immediately when an asset has a critical health issue.
          </p>
        </div>
      </div>

      {/* Security */}
      <div className="mira-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[var(--mira-gray-200)] px-6 py-4">
          <Shield className="h-5 w-5 text-[var(--mira-teal)]" strokeWidth={1.75} />
          <h2 className="text-base font-semibold text-[var(--mira-navy-light)]">
            Security
          </h2>
        </div>
        <div className="space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--mira-gray-700)]">
              Session timeout (minutes)
            </label>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="mira-input w-full max-w-xs"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="480">8 hours</option>
            </select>
            <p className="mt-1 text-xs text-[var(--mira-gray-500)]">
              Users will be signed out after this period of inactivity.
            </p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="mira-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[var(--mira-gray-200)] dark:border-border px-6 py-4">
          <Palette className="h-5 w-5 text-[var(--mira-teal)]" strokeWidth={1.75} />
          <h2 className="text-base font-semibold text-[var(--mira-navy-light)] dark:text-foreground">
            Appearance
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-[var(--mira-gray-500)] dark:text-muted-foreground">
            Choose how MIRA looks. Dark mode applies to the entire app including the sidebar and top bar.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'light' as const, label: 'Light', icon: Sun },
              { value: 'dark' as const, label: 'Dark', icon: Moon },
              { value: 'system' as const, label: 'System', icon: Monitor },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
                  theme === value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:bg-muted',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" className="mira-btn-primary inline-flex items-center gap-2">
          <Save className="h-4 w-4" strokeWidth={2} />
          Save changes
        </button>
      </div>
    </div>
  );
}
