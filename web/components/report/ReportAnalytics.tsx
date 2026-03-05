"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FullPageLoader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Activity,
  Wrench,
  PieChart,
  MoveUpRight,
  ChevronRight
} from "lucide-react";

export function ReportAnalytics() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <FullPageLoader label="Loading reports..." />;
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-teal-300 dark:to-cyan-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time utilization, maintenance, and asset distribution metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-xl border-slate-200 dark:border-teal-800/30 bg-white/50 dark:bg-[#09090b] px-4 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-teal-900/20 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <Download className="mr-2 h-3.5 w-3.5" />
            Export CSV
          </Button>
          <Button
            size="sm"
            className="h-9 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#0E7490] px-4 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
          >
            <FileText className="mr-2 h-3.5 w-3.5" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="overflow-hidden border-slate-200/60 dark:border-teal-500/10 dark:bg-[#09090b] shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">Utilization Rate</CardTitle>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Active assets in use</p>
            </div>
            <div className="rounded-full bg-slate-50 dark:bg-teal-900/30 p-2 text-slate-500 dark:text-teal-300">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">84%</span>
                  <span className="flex items-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="mr-0.5 h-3 w-3" />
                    +2.4%
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Target: &gt; 80%</p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/20 dark:hover:bg-emerald-500/20 font-medium">Healthy</Badge>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mb-1.5 font-medium uppercase tracking-wider">
                <span>Current Status</span>
                <span>Optimized</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-teal-950/60 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 shadow-sm transition-all duration-500" style={{ width: '84%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200/60 dark:border-teal-500/10 dark:bg-[#09090b] shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">Maintenance</CardTitle>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Avg. events per month</p>
            </div>
            <div className="rounded-full bg-slate-50 dark:bg-teal-900/30 p-2 text-slate-500 dark:text-teal-300">
              <Wrench className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">37</span>
                  <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    High demand
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Preventive & corrective</p>
              </div>
              <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/20 dark:hover:bg-amber-500/20 font-medium">Monitor</Badge>
            </div>
            <div className="mt-6 flex items-end justify-between gap-1.5 h-12">
              {[35, 42, 38, 45, 37, 48].map((val, idx) => (
                <div key={idx} className="group relative flex-1">
                  <div
                    className="w-full rounded-t-sm bg-slate-200 dark:bg-teal-900/40 transition-all group-hover:bg-slate-400 dark:group-hover:bg-teal-500"
                    style={{ height: `${val}%` }}
                  />
                  {idx === 5 && (
                    <div className="absolute -top-1 left-0 right-0 h-1 bg-slate-900 dark:bg-teal-400 rounded-full" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase">
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200/60 dark:border-teal-500/10 dark:bg-[#09090b] shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">Distribution</CardTitle>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Total reach: 12 Locations</p>
            </div>
            <div className="rounded-full bg-slate-50 dark:bg-teal-900/30 p-2 text-slate-500 dark:text-teal-300">
              <PieChart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3.5">
              {[
                { label: "IT & Infra", value: "26%", color: "bg-teal-600 dark:bg-teal-500" },
                { label: "Operations", value: "24%", color: "bg-teal-500 dark:bg-teal-400" },
                { label: "Finance", value: "18%", color: "bg-cyan-500 dark:bg-cyan-400" },
                { label: "HR & Admin", value: "14%", color: "bg-sky-400 dark:bg-sky-400" },
                { label: "Marketing", value: "18%", color: "bg-slate-300 dark:bg-slate-600" },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-teal-950/60">
                    <div className={cn("h-full rounded-full transition-all duration-700", item.color)} style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200/60 dark:border-teal-500/10 dark:bg-[#09090b] shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Assets per Department</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 dark:text-slate-500">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 pt-6">
              <div className="absolute inset-0 flex items-end justify-between gap-4 pb-8 px-2">
                {[
                  { label: "IT", h: 90, count: 124 },
                  { label: "Ops", h: 80, count: 98 },
                  { label: "Fin", h: 65, count: 72 },
                  { label: "HR", h: 50, count: 45 },
                  { label: "Other", h: 55, count: 52 },
                ].map((bar) => (
                  <div
                    key={bar.label}
                    className="group relative flex flex-1 flex-col items-center justify-end gap-3"
                  >
                    <div className="invisible absolute -top-8 mb-2 whitespace-nowrap rounded bg-slate-900 dark:bg-teal-800 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                      {bar.count} units
                    </div>
                    <div className="flex h-full w-full items-end rounded-xl bg-slate-50/50 dark:bg-teal-950/30 p-1.5 transition-colors group-hover:bg-slate-100/80 dark:group-hover:bg-teal-900/30">
                      <div
                        className="mx-auto w-full rounded-lg bg-gradient-to-t from-teal-600 to-teal-400 dark:from-teal-500 dark:to-cyan-400 shadow-sm transition-all duration-1000 group-hover:from-teal-500 group-hover:to-cyan-300"
                        style={{ height: `${bar.h}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 transition-colors group-hover:text-slate-900 dark:group-hover:text-slate-200">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-teal-500/10 dark:bg-[#09090b] shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Asset Movement Trend</CardTitle>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <MoveUpRight className="h-3 w-3" />
              <span>12% Uptrend</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 overflow-hidden rounded-2xl bg-slate-50/50 dark:bg-teal-950/30 p-4">
              <div className="absolute left-4 top-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Monthly Avg</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">4,281</span>
              </div>
              <svg
                viewBox="0 0 320 160"
                className="h-full w-full transform transition-transform duration-700 hover:scale-[1.02]"
                preserveAspectRatio="none"
              >
                <path
                  fill="url(#fill-gradient)"
                  d="M0,120 C40,110 60,85 80,90 C100,95 120,105 140,90 C160,75 180,65 200,70 C220,75 240,55 260,50 C280,45 300,55 320,50 L320,160 L0,160 Z"
                  className="transition-all duration-1000"
                />
                <path
                  fill="none"
                  stroke="url(#line-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M0,120 C40,110 60,85 80,90 C100,95 120,105 140,90 C160,75 180,65 200,70 C220,75 240,55 260,50 C280,45 300,55 320,50"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="line-gradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                  <linearGradient id="fill-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Data shows consistent growth in asset transitions.
              </p>
              <Button variant="link" className="h-auto p-0 text-[11px] font-bold text-teal-600 dark:text-teal-400 decoration-teal-600 dark:decoration-teal-400 underline-offset-4">
                View detailed logs <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

