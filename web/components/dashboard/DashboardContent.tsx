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
  MoreHorizontal,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  Wrench,
  Monitor,
  Home
} from "lucide-react";
import { 
  useDashboardStats, 
  useDashboardRooms, 
  useDashboardActivity 
} from "@/hooks/useDashboard";
import { useMemo } from "react";

export function DashboardContent() {
  const { stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { rooms, isLoading: roomsLoading, error: roomsError } = useDashboardRooms();
  const { activities, isLoading: activityLoading, error: activityError } = useDashboardActivity();

  const kpis = useMemo(() => [
    {
      label: "Total Assets",
      value: stats?.totalAssets.toLocaleString() || "0",
      sub: "All registered IT hardware",
      icon: <Package className="h-5 w-5" />,
      color: "from-teal-500/10 to-teal-600/10 text-teal-700 border-teal-200/60 dark:from-teal-500/15 dark:to-teal-400/5 dark:text-teal-300 dark:border-teal-400/20",
      valueColor: "text-teal-800 dark:text-teal-200",
    },
    {
      label: "Active Assets",
      value: stats?.activeAssets.toLocaleString() || "0",
      sub: "Currently operational",
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "from-emerald-500/10 to-emerald-600/10 text-emerald-700 border-emerald-200/60 dark:from-emerald-500/15 dark:to-emerald-400/5 dark:text-emerald-300 dark:border-emerald-400/20",
      valueColor: "text-emerald-800 dark:text-emerald-200",
    },
    {
      label: "Assigned Assets",
      value: stats?.assignedAssets.toLocaleString() || "0",
      sub: "Allocated to staff",
      icon: <UserCheck className="h-5 w-5" />,
      color: "from-blue-500/10 to-blue-600/10 text-blue-700 border-blue-200/60 dark:from-sky-500/15 dark:to-sky-400/5 dark:text-sky-300 dark:border-sky-400/20",
      valueColor: "text-blue-800 dark:text-sky-200",
    },
    {
      label: "Under Maintenance",
      value: stats?.underMaintenance.toLocaleString() || "0",
      sub: "With IT or vendor",
      icon: <Wrench className="h-5 w-5" />,
      color: "from-amber-500/10 to-amber-600/10 text-amber-700 border-amber-200/60 dark:from-amber-500/15 dark:to-amber-400/5 dark:text-amber-300 dark:border-amber-400/20",
      valueColor: "text-amber-800 dark:text-amber-200",
    },
    {
      label: "Unassigned Assets",
      value: stats?.unassignedAssets.toLocaleString() || "0",
      sub: "Available in inventory",
      icon: <Monitor className="h-5 w-5" />,
      color: "from-slate-400/10 to-slate-500/10 text-slate-600 border-slate-200/60 dark:from-slate-400/10 dark:to-slate-500/5 dark:text-slate-300 dark:border-slate-500/25",
      valueColor: "text-slate-800 dark:text-slate-100",
    },
  ], [stats]);

  const activePercent = stats?.activePercentage || 0;
  const assignedPercent = stats && stats.totalAssets > 0 ? (stats.assignedAssets / stats.totalAssets) * 100 : 0;

  const activeDashOffset = 289 * (1 - activePercent / 100);
  const assignedDashOffset = 276 * (1 - assignedPercent / 100);

  if (statsLoading || roomsLoading || activityLoading) {
    return <FullPageLoader label="Loading dashboard data..." />;
  }

  if (statsError || roomsError || activityError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-amber-500" />
        <h2 className="text-xl font-bold">Failed to load dashboard</h2>
        <p className="mt-2 text-slate-500">{statsError || roomsError || activityError}</p>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
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

      {/* KPI Section - Scrollable horizontal carousel on mobile, grid on desktop */}
      <div className="flex w-full overflow-x-auto pb-4 gap-3 no-scrollbar md:grid md:grid-cols-3 lg:grid-cols-5 md:pb-0 md:overflow-x-visible">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`flex flex-col gap-2 rounded-xl border bg-gradient-to-br p-3 sm:p-4 transition-all hover:shadow-md dark:hover:shadow-teal-900/30 dark:bg-[#09090b] min-w-[160px] md:min-w-0 flex-shrink-0 md:flex-shrink ${kpi.color}`}
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
                  <circle 
                    cx="50" cy="50" r="46" 
                    fill="transparent" 
                    stroke="url(#gradient-active)" 
                    strokeWidth="8" 
                    strokeDasharray="289" 
                    strokeDashoffset={activeDashOffset} 
                    strokeLinecap="round" 
                    className="drop-shadow-md transition-all duration-1000 ease-in-out" 
                  />
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
                  <circle 
                    cx="50" cy="50" r="44" 
                    fill="transparent" 
                    stroke="url(#gradient-assigned)" 
                    strokeWidth="10" 
                    strokeDasharray="276" 
                    strokeDashoffset={assignedDashOffset} 
                    strokeLinecap="round" 
                    className="drop-shadow-md transition-all duration-1000 ease-in-out" 
                  />
                  <defs>
                    <linearGradient id="gradient-assigned" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-slate-100">
                    {Math.round(activePercent)}<span className="text-xl text-slate-500 dark:text-slate-400">%</span>
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Active</span>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 sm:p-2 dark:border-teal-500/15 dark:bg-teal-900/10">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 shadow-sm" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-teal-300/70">Active</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-teal-100">{stats?.activeAssets.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 sm:p-2 dark:border-teal-500/15 dark:bg-teal-900/10">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-sm" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-teal-300/70">Assigned</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-teal-100">{stats?.assignedAssets.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets per Room */}
        <Card className="col-span-1 overflow-hidden border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl transition-all dark:border-teal-500/10 dark:bg-[#09090b] dark:shadow-teal-900/20 md:col-span-2">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-base">Assets per Room</CardTitle>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Distribution across physical locations
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-4 space-y-5">
              {rooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Package className="mb-2 h-8 w-8 opacity-20" />
                  <p className="text-sm text-slate-400">No data available</p>
                </div>
              ) : (
                rooms.map((item, i) => {
                  return (
                    <div key={item.label} className="group relative">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-teal-100">
                          <div className="rounded-md bg-slate-100 p-1.5 text-slate-500 transition-colors group-hover:bg-slate-200 group-hover:text-slate-700 dark:bg-teal-900/25 dark:text-teal-300 dark:group-hover:bg-teal-800/40 dark:group-hover:text-teal-100">
                            <Home className="h-3.5 w-3.5" />
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
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
