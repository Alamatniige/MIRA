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
  
  const [animateGraphs, setAnimateGraphs] = useState(false);

  useEffect(() => {
    if (!statsLoading && !roomsLoading) {
      const timer = setTimeout(() => setAnimateGraphs(true), 150);
      return () => clearTimeout(timer);
    }
  }, [statsLoading, roomsLoading]);

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
        <Card className="col-span-1 h-fit overflow-hidden border border-slate-200/50 bg-gradient-to-b from-white/80 to-slate-50/50 shadow-sm backdrop-blur-xl transition-all dark:border-white/10 dark:from-[#0f1115] dark:to-[#09090b] dark:shadow-2xl">
          <CardHeader className="pb-4 pt-5 px-6 border-b border-transparent dark:border-transparent">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-400">Asset Status</CardTitle>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Hardware lifecycle states
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-6 px-6">
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex h-52 w-52 items-center justify-center">
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-400/20 to-blue-500/20 rounded-full blur-2xl dark:from-teal-900/40 dark:to-blue-900/40 opacity-70" />
                
                {/* Outer Ring - Active */}
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform drop-shadow-xl" viewBox="0 0 100 100">
                  {/* Track */}
                  <circle cx="50" cy="50" r="44" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-100/80 dark:text-slate-800/80" />
                  {/* Progress */}
                  <circle 
                    cx="50" cy="50" r="44" 
                    fill="transparent" 
                    stroke="url(#gradient-active)" 
                    strokeWidth="7" 
                    strokeDasharray="276" 
                    strokeDashoffset={animateGraphs ? 276 * (1 - activePercent / 100) : 276} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-in-out [filter:drop-shadow(0_0_4px_rgba(14,165,233,0.4))]" 
                  />
                  <defs>
                    <linearGradient id="gradient-active" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Inner Ring - Assigned */}
                <svg className="absolute h-40 w-40 -rotate-90 transform drop-shadow-lg" viewBox="0 0 100 100">
                  {/* Track */}
                  <circle cx="50" cy="50" r="44" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-100/80 dark:text-slate-800/80" />
                  {/* Progress */}
                  <circle 
                    cx="50" cy="50" r="44" 
                    fill="transparent" 
                    stroke="url(#gradient-assigned)" 
                    strokeWidth="7" 
                    strokeDasharray="276" 
                    strokeDashoffset={animateGraphs ? 276 * (1 - assignedPercent / 100) : 276} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-in-out [filter:drop-shadow(0_0_4px_rgba(236,72,153,0.4))]" 
                  />
                  <defs>
                    <linearGradient id="gradient-assigned" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#d946ef" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/40 dark:bg-[#09090b]/40 backdrop-blur-[1px] m-10 rounded-full border border-white/50 dark:border-white/10 shadow-sm">
                  <span className="text-4xl font-extrabold tracking-tighter text-slate-900 dark:text-white drop-shadow-sm">
                    {Math.round(activePercent)}<span className="text-xl text-slate-500 dark:text-slate-400">%</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-0.5">Active</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="group flex items-center gap-3 rounded-xl border border-slate-100/80 bg-slate-50/50 p-3 hover:bg-slate-100 transition-colors dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 shadow-[0_2px_10px_-2px_rgba(16,185,129,0.5)]">
                  <div className="h-3 w-3 rounded-full bg-white dark:bg-white/90" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Active</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{stats?.activeAssets.toLocaleString()}</span>
                </div>
              </div>
              <div className="group flex items-center gap-3 rounded-xl border border-slate-100/80 bg-slate-50/50 p-3 hover:bg-slate-100 transition-colors dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_2px_10px_-2px_rgba(236,72,153,0.5)]">
                  <div className="h-3 w-3 rounded-full bg-white dark:bg-white/90" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Assigned</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{stats?.assignedAssets.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets per Room */}
        <Card className="col-span-1 overflow-hidden border border-slate-200/50 bg-gradient-to-b from-white/80 to-slate-50/50 shadow-sm backdrop-blur-xl transition-all dark:border-white/10 dark:from-[#0f1115] dark:to-[#09090b] dark:shadow-2xl md:col-span-2 flex flex-col">
          <CardHeader className="pb-4 pt-5 px-6 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-400">Assets per Room</CardTitle>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Distribution across physical locations
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 pb-6 flex-1">
            <div className="space-y-6 h-full flex flex-col justify-center">
              {rooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="rounded-full bg-slate-100 p-4 dark:bg-white/5 mb-3">
                    <Package className="h-8 w-8 text-slate-400 dark:text-slate-600" />
                  </div>
                  <h3 className="font-medium text-slate-900 dark:text-white">No data available</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try adding some assets to a room.</p>
                </div>
              ) : (
                rooms.map((item, i) => {
                  return (
                    <div key={item.label} className="group relative">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 shadow-sm transition-all group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-white/10 dark:text-slate-300 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-300">
                            <Home className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.label}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-bold text-slate-900 dark:text-white">
                            {item.value}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">items</span>
                        </div>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100/80 dark:bg-white/5 shadow-inner">
                        <div
                          className="relative h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                          style={{ width: animateGraphs ? item.width : "0%", animationDelay: `${i * 150}ms` }}
                        >
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />
                          <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]" />
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
