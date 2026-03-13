"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FullPageLoader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  History,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  MoreVertical,
  Activity,
  Box,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  UserCheck,
  Wrench,
  Monitor,
  Server,
  Briefcase,
  Landmark,
  Users,
  MoreHorizontal
} from "lucide-react";

const kpis = [
  {
    label: "Total Assets",
    value: "1,248",
    sub: "All registered IT hardware",
    icon: <Package className="h-5 w-5" />,
    color: "from-teal-500/10 to-teal-600/10 text-teal-700 border-teal-200/60 dark:from-teal-500/15 dark:to-teal-400/5 dark:text-teal-300 dark:border-teal-400/20",
    valueColor: "text-teal-800 dark:text-teal-200",
  },
  {
    label: "Active Assets",
    value: "1,032",
    sub: "Currently operational",
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "from-emerald-500/10 to-emerald-600/10 text-emerald-700 border-emerald-200/60 dark:from-emerald-500/15 dark:to-emerald-400/5 dark:text-emerald-300 dark:border-emerald-400/20",
    valueColor: "text-emerald-800 dark:text-emerald-200",
  },
  {
    label: "Assigned Assets",
    value: "874",
    sub: "Allocated to staff",
    icon: <UserCheck className="h-5 w-5" />,
    color: "from-blue-500/10 to-blue-600/10 text-blue-700 border-blue-200/60 dark:from-sky-500/15 dark:to-sky-400/5 dark:text-sky-300 dark:border-sky-400/20",
    valueColor: "text-blue-800 dark:text-sky-200",
  },
  {
    label: "Under Maintenance",
    value: "46",
    sub: "With IT or vendor",
    icon: <Wrench className="h-5 w-5" />,
    color: "from-amber-500/10 to-amber-600/10 text-amber-700 border-amber-200/60 dark:from-amber-500/15 dark:to-amber-400/5 dark:text-amber-300 dark:border-amber-400/20",
    valueColor: "text-amber-800 dark:text-amber-200",
  },
  {
    label: "Unassigned Assets",
    value: "198",
    sub: "Available in inventory",
    icon: <Monitor className="h-5 w-5" />,
    color: "from-slate-400/10 to-slate-500/10 text-slate-600 border-slate-200/60 dark:from-slate-400/10 dark:to-slate-500/5 dark:text-slate-300 dark:border-slate-500/25",
    valueColor: "text-slate-800 dark:text-slate-100",
  },
];

const recentActivity = [
  {
    tag: "LPT-02318",
    name: "Lenovo ThinkPad T14",
    assignee: "Santos, Mark",
    dept: "IT Operations",
    status: "Assigned",
    statusVariant: "success" as const,
    date: "A few mins ago",
    initials: "MS"
  },
  {
    tag: "MON-00872",
    name: "Dell UltraSharp 27\"",
    assignee: "Unassigned",
    dept: "Inventory",
    status: "Returned",
    statusVariant: "muted" as const,
    date: "2 hours ago",
    initials: "UN"
  },
  {
    tag: "SRV-00041",
    name: "HPE ProLiant DL380",
    assignee: "Data Center A-03",
    dept: "Infrastructure",
    status: "Under Maintenance",
    statusVariant: "warning" as const,
    date: "Yesterday",
    initials: "DC"
  },
  {
    tag: "LPT-02197",
    name: "MacBook Pro 14\"",
    assignee: "Dela Cruz, Ana",
    dept: "Finance",
    status: "Assigned",
    statusVariant: "success" as const,
    date: "Yesterday",
    initials: "AD"
  },
];

const departments = [
  { label: "IT & Infrastructure", value: 320, width: "88%", icon: Server },
  { label: "Operations", value: 240, width: "74%", icon: Briefcase },
  { label: "Finance", value: 160, width: "56%", icon: Landmark },
  { label: "HR & Admin", value: 112, width: "44%", icon: Users },
  { label: "Others", value: 88, width: "36%", icon: MoreHorizontal },
];

export function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <FullPageLoader label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            High-level view of IT hardware assets across the organization.
          </p>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`flex flex-col gap-2 rounded-xl border bg-gradient-to-br p-4 transition-all hover:shadow-md dark:hover:shadow-teal-900/30 dark:bg-[#09090b] ${kpi.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold opacity-75 dark:opacity-90">{kpi.label}</span>
              <span className="opacity-60 dark:opacity-80">{kpi.icon}</span>
            </div>
            <p className={`text-2xl font-bold tracking-tight ${kpi.valueColor}`}>
              {kpi.value}
            </p>
            <p className="text-[10px] font-medium opacity-55 dark:opacity-70">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Asset Status Distribution */}
        <Card className="col-span-1 overflow-hidden border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl transition-all dark:border-teal-500/10 dark:bg-[#09090b] dark:shadow-teal-900/20">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-base">Asset Status</CardTitle>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Hardware lifecycle states
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative flex h-48 w-48 items-center justify-center">
                {/* Outer Ring */}
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-teal-900/50" />
                  <circle cx="50" cy="50" r="46" fill="transparent" stroke="url(#gradient-active)" strokeWidth="8" strokeDasharray="289" strokeDashoffset="75" strokeLinecap="round" className="drop-shadow-md transition-all duration-1000 ease-in-out" />
                  <defs>
                    <linearGradient id="gradient-active" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Inner Ring */}
                <svg className="absolute h-36 w-36 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-teal-900/50" />
                  <circle cx="50" cy="50" r="44" fill="transparent" stroke="url(#gradient-assigned)" strokeWidth="10" strokeDasharray="276" strokeDashoffset="120" strokeLinecap="round" className="drop-shadow-md transition-all duration-1000 ease-in-out" />
                  <defs>
                    <linearGradient id="gradient-assigned" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-slate-100">
                    72<span className="text-xl text-slate-500 dark:text-slate-400">%</span>
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Active</span>
                </div>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2 dark:border-teal-500/15 dark:bg-teal-900/10">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 shadow-sm" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-teal-300/70">Active</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-teal-100">1,032</span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2 dark:border-teal-500/15 dark:bg-teal-900/10">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-sm" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-teal-300/70">Assigned</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-teal-100">874</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets per Department */}
        <Card className="col-span-1 overflow-hidden border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl transition-all dark:border-teal-500/10 dark:bg-[#09090b] dark:shadow-teal-900/20 md:col-span-2">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-base">Assets per Department</CardTitle>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Distribution across major business units
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-4 space-y-5">
              {departments.map((item, i) => {
                const DeptIcon = item.icon;
                return (
                  <div key={item.label} className="group relative">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-teal-100">
                        <div className="rounded-md bg-slate-100 p-1.5 text-slate-500 transition-colors group-hover:bg-slate-200 group-hover:text-slate-700 dark:bg-teal-900/25 dark:text-teal-300 dark:group-hover:bg-teal-800/40 dark:group-hover:text-teal-100">
                          <DeptIcon className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-teal-100">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-teal-950/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                        style={{ width: item.width, animationDelay: `${i * 150}ms` }}
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid for Asset Trend & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Trend Chart */}
        <Card className="col-span-1 border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl transition-all dark:border-teal-500/10 dark:bg-[#09090b] dark:shadow-teal-900/20">
          <CardHeader>
            <div>
              <CardTitle className="text-base">Asset Assignment Trend</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Monthly assignment activity
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-48">
              <div className="absolute inset-0">
                <div className="flex h-full items-end justify-between gap-1.5">
                  {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map((m, idx) => {
                    const heightValue = 40 + [10, 20, 15, 30, 45, 55][idx];
                    return (
                      <div
                        key={m}
                        className="group flex flex-1 flex-col items-center justify-end gap-2"
                      >
                        <div className="relative flex h-36 w-full items-end justify-center">
                          <div className="absolute inset-x-0 bottom-0 h-px bg-slate-100 dark:bg-teal-800/30" />
                          <div
                            className="w-full max-w-[20px] rounded-t-sm bg-gradient-to-t from-teal-500/90 to-cyan-400/90 transition-all duration-500 group-hover:from-teal-400 group-hover:to-cyan-300 dark:from-teal-500/70 dark:to-cyan-400/70"
                            style={{ height: `${heightValue}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          {m}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400">
              Stable assignment volume with a major uptick in Q1.
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity Table */}
        <Card className="col-span-1 overflow-hidden border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl transition-all dark:border-teal-500/10 dark:bg-[#09090b] dark:shadow-teal-900/20 md:col-span-2">
          <CardHeader className="relative border-b border-slate-100 pb-4 dark:border-teal-800/30">
            <div className="pr-20">
              <CardTitle className="text-base">Recent Asset Activity</CardTitle>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Latest movements handled by IT
              </p>
            </div>
            <Button variant="ghost" size="sm" className="absolute right-6 top-6 flex items-center gap-1 text-xs font-semibold text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
              View All <ChevronRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-teal-950/40">
                <TableRow className="border-slate-100 hover:bg-transparent dark:border-teal-800/25">
                  <TableHead className="w-[120px] p-3 font-medium text-slate-500 dark:text-slate-400 sm:p-4">Asset Tag</TableHead>
                  <TableHead className="p-3 font-medium text-slate-500 dark:text-slate-400 sm:p-4">Device</TableHead>
                  <TableHead className="p-3 font-medium text-slate-500 dark:text-slate-400 sm:p-4">Assignee</TableHead>
                  <TableHead className="p-3 font-medium text-slate-500 dark:text-slate-400 sm:p-4">Status</TableHead>
                  <TableHead className="p-3 font-medium text-slate-500 dark:text-slate-400 sm:p-4">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((row) => (
                  <TableRow
                    key={row.tag}
                    className="group cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50/80 dark:border-teal-800/20 dark:hover:bg-teal-900/20"
                  >
                    <TableCell className="p-3 font-mono text-xs font-medium text-slate-600 transition-colors group-hover:text-teal-600 dark:text-teal-400/80 dark:group-hover:text-teal-300 sm:p-4">
                      {row.tag}
                    </TableCell>
                    <TableCell className="p-3 sm:p-4">
                      <span className="font-medium text-slate-900 dark:text-slate-100">{row.name}</span>
                    </TableCell>
                    <TableCell className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-bold text-slate-600 shadow-sm dark:from-teal-900/60 dark:to-teal-800/60 dark:text-teal-200">
                          {row.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{row.assignee}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{row.dept}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-3 sm:p-4">
                      <Badge
                        variant={row.statusVariant}
                        className={`shadow-sm ${row.statusVariant === 'success'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25'
                          : row.statusVariant === 'warning'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:hover:bg-amber-500/25'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700/50 dark:text-slate-200 dark:hover:bg-slate-700'
                          }`}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-3 text-xs text-slate-500 dark:text-slate-400 sm:p-4">
                      {row.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
