import React from "react";
import Link from "next/link";
import {
  Package,
  CheckCircle,
  Wrench,
  Trash2,
  Plus,
  UserPlus,
  FileText,
  Check,
  AlertCircle,
  Settings,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/SummaryCard";

const summaryCards = [
  { title: "Total Assets", value: "248", icon: Package, variant: "teal" as const },
  {
    title: "Active Assets",
    value: "212",
    icon: CheckCircle,
    trend: "85% of total",
    variant: "green" as const,
  },
  {
    title: "Under Maintenance",
    value: "18",
    icon: Wrench,
    trend: "7% of total",
    variant: "amber" as const,
  },
  {
    title: "Disposed Assets",
    value: "18",
    icon: Trash2,
    trend: "Archived",
    variant: "slate" as const,
  },
];

const pieData = [
  { label: "Active", value: 85, color: "var(--status-active)" },
  { label: "Maintenance", value: 7, color: "var(--status-maintenance)" },
  { label: "Issue", value: 3, color: "var(--status-issue)" },
  { label: "Disposed", value: 5, color: "var(--status-disposed)" },
];

const recentActivities = [
  { id: "AST-1042", action: "Assigned to John Doe", date: "2 hours ago", type: "assignment" },
  { id: "AST-1038", action: "Status updated to Maintenance", date: "5 hours ago", type: "maintenance" },
  { id: "AST-1021", action: "New asset registered", date: "1 day ago", type: "new" },
  { id: "AST-1015", action: "Disposed", date: "2 days ago", type: "disposed" },
  { id: "AST-1009", action: "Assigned to Jane Smith", date: "3 days ago", type: "assignment" },
];

export function DashboardPage() {
  const total = pieData.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const segments = pieData.map((d) => {
    const length = (d.value / total) * 100;
    const seg = { ...d, length, offset };
    offset += length;
    return seg;
  });

  const activityIcons: Record<string, React.ReactNode> = {
    assignment: <Check className="h-4 w-4 text-[var(--status-active)]" />,
    maintenance: <Wrench className="h-4 w-4 text-[var(--status-maintenance)]" />,
    new: <Plus className="h-4 w-4 text-[var(--mira-teal)]" />,
    disposed: <Trash2 className="h-4 w-4 text-[var(--status-disposed)]" />,
    issue: <AlertCircle className="h-4 w-4 text-[var(--status-issue)]" />,
  };

  return (
    <div className="min-h-full space-y-10 pb-4">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
            variant={card.variant}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Asset Status — modern donut */}
        <div className="mira-card overflow-hidden p-6 lg:col-span-1">
          <h2 className="mb-6 text-[15px] font-semibold tracking-tight text-[var(--mira-navy-light)]">
            Asset Status
          </h2>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="relative h-40 w-40 shrink-0">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full -rotate-90"
              >
                {segments.map((d) => (
                  <circle
                    key={d.label}
                    cx="50"
                    cy="50"
                    r="36"
                    fill="none"
                    stroke={d.color}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${d.length} ${100 - d.length}`}
                    strokeDashoffset={-d.offset}
                    className="transition-opacity duration-300"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-[var(--mira-navy-light)]">
                  {total}%
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {pieData.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[var(--mira-gray-50)] px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: d.color }}
                    />
                    <span className="text-[13px] font-medium text-[var(--mira-gray-700)]">
                      {d.label}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold tabular-nums text-[var(--mira-navy-light)]">
                    {d.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activities — minimal list */}
        <div className="mira-card overflow-hidden lg:col-span-2">
          <div className="px-6 py-5">
            <h2 className="text-[15px] font-semibold tracking-tight text-[var(--mira-navy-light)]">
              Recent Activity
            </h2>
            <p className="mt-0.5 text-[13px] text-[var(--mira-gray-500)]">
              Latest updates across your assets
            </p>
          </div>
          <div className="divide-y divide-[var(--mira-gray-100)]">
            {recentActivities.map((row) => (
              <div
                key={row.id}
                className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-[var(--mira-gray-50)]/80"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--mira-gray-100)]">
                  {activityIcons[row.type] ?? (
                    <Settings className="h-4 w-4 text-[var(--mira-gray-500)]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-[var(--mira-navy-light)]">
                    {row.id}
                  </p>
                  <p className="truncate text-[13px] text-[var(--mira-gray-600)]">
                    {row.action}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] text-[var(--mira-gray-500)]">
                  {row.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions — pill-style cards */}
      <div className="mira-card p-6">
        <h2 className="mb-5 text-[15px] font-semibold tracking-tight text-[var(--mira-navy-light)]">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/assets?add=1"
            className="group flex items-center gap-4 rounded-2xl border border-[var(--mira-gray-200)] bg-white p-4 transition-all duration-200 hover:border-[var(--mira-teal)]/40 hover:bg-[var(--mira-teal-muted)]/50 hover:shadow-[var(--shadow)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--mira-teal-muted)] text-[var(--mira-teal)] transition-all duration-200 group-hover:bg-[var(--mira-teal)] group-hover:text-white group-hover:shadow-md">
              <Plus className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[var(--mira-navy-light)]">
                Add Asset
              </p>
              <p className="text-[12px] text-[var(--mira-gray-500)]">
                Register new hardware
              </p>
            </div>
          </Link>
          <Link
            href="/assignment"
            className="group flex items-center gap-4 rounded-2xl border border-[var(--mira-gray-200)] bg-white p-4 transition-all duration-200 hover:border-[var(--mira-teal)]/40 hover:bg-[var(--mira-teal-muted)]/50 hover:shadow-[var(--shadow)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--mira-gray-100)] text-[var(--mira-navy-light)] transition-all duration-200 group-hover:bg-[var(--mira-teal)] group-hover:text-white group-hover:shadow-md">
              <UserPlus className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[var(--mira-navy-light)]">
                Assign Asset
              </p>
              <p className="text-[12px] text-[var(--mira-gray-500)]">
                Assign to staff
              </p>
            </div>
          </Link>
          <Link
            href="/reports"
            className="group flex items-center gap-4 rounded-2xl border border-[var(--mira-gray-200)] bg-white p-4 transition-all duration-200 hover:border-[var(--mira-teal)]/40 hover:bg-[var(--mira-teal-muted)]/50 hover:shadow-[var(--shadow)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--mira-gray-100)] text-[var(--mira-navy-light)] transition-all duration-200 group-hover:bg-[var(--mira-teal)] group-hover:text-white group-hover:shadow-md">
              <FileText className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[var(--mira-navy-light)]">
                Generate Report
              </p>
              <p className="text-[12px] text-[var(--mira-gray-500)]">
                Export and analytics
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
