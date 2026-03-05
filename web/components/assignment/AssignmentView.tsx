"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FullPageLoader } from "@/components/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClipboardList,
  UserCheck,
  RotateCcw,
  Wrench,
  ChevronRight,
  Search,
  CalendarDays,
  SlidersHorizontal,
} from "lucide-react";

const stats = [
  {
    label: "Total Assignments",
    value: "874",
    sub: "All-time records",
    icon: <ClipboardList className="h-5 w-5" />,
    color: "from-teal-500/10 to-teal-600/10 text-teal-700 border-teal-200/60 dark:border-teal-800/40 dark:text-teal-400",
    valueColor: "text-teal-800 dark:text-teal-300",
  },
  {
    label: "Currently Assigned",
    value: "631",
    sub: "Active with staff",
    icon: <UserCheck className="h-5 w-5" />,
    color: "from-emerald-500/10 to-emerald-600/10 text-emerald-700 border-emerald-200/60 dark:border-emerald-800/40 dark:text-emerald-400",
    valueColor: "text-emerald-800 dark:text-emerald-300",
  },
  {
    label: "Returned",
    value: "198",
    sub: "Back in inventory",
    icon: <RotateCcw className="h-5 w-5" />,
    color: "from-slate-400/10 to-slate-500/10 text-slate-600 border-slate-200/60 dark:border-slate-700/40 dark:text-slate-400",
    valueColor: "text-slate-800 dark:text-slate-200",
  },
  {
    label: "Under Maintenance",
    value: "45",
    sub: "Pending return",
    icon: <Wrench className="h-5 w-5" />,
    color: "from-amber-500/10 to-amber-600/10 text-amber-700 border-amber-200/60 dark:border-amber-800/40 dark:text-amber-400",
    valueColor: "text-amber-800 dark:text-amber-300",
  },
];

const history = [
  {
    asset: "LPT-02318",
    name: "Lenovo ThinkPad T14",
    assignee: "Santos, Mark",
    initials: "MS",
    department: "IT Operations",
    date: "Mar 4, 2026 · 09:32",
    status: "Active",
    statusVariant: "success" as const,
  },
  {
    asset: "LPT-02197",
    name: 'MacBook Pro 14"',
    assignee: "Dela Cruz, Ana",
    initials: "AD",
    department: "Finance",
    date: "Mar 2, 2026 · 11:47",
    status: "Active",
    statusVariant: "success" as const,
  },
  {
    asset: "MON-00872",
    name: 'Dell UltraSharp 27"',
    assignee: "Unassigned",
    initials: "–",
    department: "Inventory",
    date: "Mar 3, 2026 · 17:10",
    status: "Returned",
    statusVariant: "muted" as const,
  },
  {
    asset: "SRV-00041",
    name: "HPE ProLiant DL380",
    assignee: "Data Center A-03",
    initials: "DC",
    department: "Infrastructure",
    date: "Mar 1, 2026 · 14:05",
    status: "Under Maintenance",
    statusVariant: "warning" as const,
  },
];

const badgeStyles: Record<string, string> = {
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  warning:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  muted:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export function AssignmentView() {
  const [viewTimeline, setViewTimeline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <FullPageLoader label="Loading assignments..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Asset Assignment
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Assign and reassign IT hardware assets to staff or departments.
          </p>
        </div>
        <Button
          size="sm"
          className="h-9 self-start rounded-full bg-gradient-to-r from-[#0F766E] to-[#0E7490] px-5 text-xs font-semibold text-white shadow-md hover:opacity-90 md:self-auto"
        >
          + Assign Asset
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`flex flex-col gap-2 rounded-xl border bg-gradient-to-br p-4 transition-shadow hover:shadow-md ${s.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium opacity-80">{s.label}</span>
              <span className="opacity-60">{s.icon}</span>
            </div>
            <p className={`text-2xl font-bold tracking-tight ${s.valueColor}`}>
              {s.value}
            </p>
            <p className="text-[10px] font-medium opacity-60">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* New Assignment Form */}
        <Card className="overflow-hidden border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0F766E] to-[#0E7490] rounded-t-xl" />
          <CardHeader className="pb-3 pt-6">
            <CardTitle className="text-base">New Assignment</CardTitle>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Capture a new asset assignment or reassignment.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {/* Select Asset */}
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Asset
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <select className="h-9 w-full rounded-lg border border-slate-200 bg-white/80 pl-8 pr-3 text-[11px] text-slate-700 shadow-sm focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
                    <option>Search or select asset…</option>
                    <option>LPT-02318 · Lenovo ThinkPad T14</option>
                    <option>LPT-02197 · MacBook Pro 14&quot;</option>
                    <option>MON-00872 · Dell UltraSharp 27&quot;</option>
                    <option>SRV-00041 · HPE ProLiant DL380</option>
                  </select>
                </div>
              </div>

              {/* Assignee + Department */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Assign To
                  </label>
                  <Input
                    placeholder="Staff full name"
                    className="h-8 border-slate-200 bg-white/80 text-[11px] placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-[#0F766E]/20 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Department
                  </label>
                  <Input
                    placeholder="e.g. Finance, IT"
                    className="h-8 border-slate-200 bg-white/80 text-[11px] placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-[#0F766E]/20 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                  />
                </div>
              </div>

              {/* Date + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <CalendarDays className="h-3 w-3" /> Date
                  </label>
                  <Input
                    type="date"
                    className="h-8 border-slate-200 bg-white/80 text-[11px] focus:border-[#0F766E] focus:ring-[#0F766E]/20 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <SlidersHorizontal className="h-3 w-3" /> Status
                  </label>
                  <select className="h-8 w-full rounded-lg border border-slate-200 bg-white/80 px-2 text-[11px] text-slate-700 shadow-sm focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
                    <option>Assigned</option>
                    <option>Returned</option>
                    <option>Under Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-[11px] text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:placeholder:text-zinc-500"
                  placeholder="Purpose, project, or special conditions for this assignment."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-slate-200 px-4 text-[11px] dark:border-white/10 dark:text-zinc-300"
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 rounded-full bg-gradient-to-r from-[#0F766E] to-[#0E7490] px-5 text-[11px] font-semibold text-white shadow-md hover:opacity-90"
                >
                  Confirm Assignment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Assignment History */}
        <Card className="overflow-hidden border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]">
          <CardHeader className="relative border-b border-slate-100 pb-4 dark:border-white/5">
            <div className="pr-32">
              <CardTitle className="text-base">Assignment History</CardTitle>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Track historical movements of key assets.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewTimeline((v) => !v)}
              className="absolute right-6 top-5 flex items-center gap-1 text-xs font-semibold text-[#0F766E] transition-colors hover:text-[#0E7490] dark:text-teal-400 dark:hover:text-teal-300"
            >
              {viewTimeline ? "View as table" : "View as timeline"}
              <ChevronRight className="h-3 w-3" />
            </button>
          </CardHeader>

          <CardContent className="p-0">
            {viewTimeline ? (
              /* Timeline View */
              <div className="space-y-0 divide-y divide-slate-100 dark:divide-white/5">
                {history.map((item, index) => (
                  <div
                    key={item.asset}
                    className="group flex gap-4 px-5 py-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-zinc-900/50"
                  >
                    {/* Timeline dot + line */}
                    <div className="flex flex-col items-center">
                      <span
                        className={`mt-1 flex h-2.5 w-2.5 flex-shrink-0 rounded-full ${item.statusVariant === "success"
                          ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                          : item.statusVariant === "warning"
                            ? "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]"
                            : "bg-slate-400"
                          }`}
                      />
                      {index < history.length - 1 && (
                        <span className="mt-1.5 flex-1 w-px bg-slate-200 dark:bg-white/5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500">
                            {item.asset}
                          </p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {item.name}
                          </p>
                        </div>
                        <Badge
                          variant={item.statusVariant}
                          className={`mt-0.5 flex-shrink-0 text-[10px] ${badgeStyles[item.statusVariant]}`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-[9px] font-bold text-slate-600 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300">
                          {item.initials}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {item.assignee}
                          </span>{" "}
                          · {item.department}
                        </p>
                      </div>
                      <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                        {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Table View */
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-black/50">
                  <TableRow className="border-slate-100 hover:bg-transparent dark:border-white/5">
                    <TableHead className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:p-4">
                      Asset
                    </TableHead>
                    <TableHead className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:p-4">
                      Assignee
                    </TableHead>
                    <TableHead className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:p-4">
                      Department
                    </TableHead>
                    <TableHead className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:p-4">
                      Date Assigned
                    </TableHead>
                    <TableHead className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:p-4">
                      Status
                    </TableHead>
                    <TableHead className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:p-4">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow
                      key={item.asset}
                      className="group cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50/80 dark:border-white/5 dark:hover:bg-zinc-900/50"
                    >
                      <TableCell className="p-3 sm:p-4">
                        <p className="font-mono text-[11px] font-medium text-slate-400 dark:text-slate-500 group-hover:text-[#0F766E] dark:group-hover:text-teal-400 transition-colors">
                          {item.asset}
                        </p>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {item.name}
                        </p>
                      </TableCell>
                      <TableCell className="p-3 sm:p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-[10px] font-bold text-slate-600 shadow-sm dark:from-slate-700 dark:to-slate-800 dark:text-slate-300">
                            {item.initials}
                          </div>
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {item.assignee}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-3 text-xs text-slate-500 dark:text-slate-400 sm:p-4">
                        {item.department}
                      </TableCell>
                      <TableCell className="p-3 text-xs text-slate-500 dark:text-slate-400 sm:p-4">
                        {item.date}
                      </TableCell>
                      <TableCell className="p-3 sm:p-4">
                        <Badge
                          variant={item.statusVariant}
                          className={`text-[10px] shadow-sm ${badgeStyles[item.statusVariant]}`}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-3 sm:p-4">
                        <button className="flex items-center gap-0.5 text-[11px] font-semibold text-[#0F766E] transition-colors hover:text-[#0E7490] dark:text-teal-400 dark:hover:text-teal-300">
                          View trail <ChevronRight className="h-3 w-3" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
