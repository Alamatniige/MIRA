"use client";

import { useMemo, useState } from "react";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { FullPageLoader } from "@/components/ui/loader";
import {
  ShieldCheck,
  RefreshCw,
  Search,
  FilterX,
  Clock,
  MapPin,
  User,
  Target,
  FileText,
  AlertTriangle,
  Download,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AuditLogsContent() {
  const { logs, isLoading, error, refresh } = useAuditLogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const actionCategories = useMemo(() => {
    const categories = new Set<string>();
    logs.forEach(log => categories.add(log.action));
    return Array.from(categories).sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        log.action.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q) ||
        log.actorName?.toLowerCase().includes(q);

      const matchesAction = selectedAction === "all" || log.action === selectedAction;

      const logDate = new Date(log.createdAt);
      const matchesStartDate = !startDate || logDate >= new Date(startDate);
      const matchesEndDate = !endDate || logDate <= new Date(new Date(endDate).setHours(23, 59, 59));

      return matchesSearch && matchesAction && matchesStartDate && matchesEndDate;
    });
  }, [logs, searchQuery, selectedAction, startDate, endDate]);

  const groupedLogs = useMemo(() => {
    const groups: Record<string, typeof logs> = {};
    filteredLogs.forEach(log => {
      const date = new Date(log.createdAt).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(log);
    });
    return groups;
  }, [filteredLogs]);

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      toast.error("No logs to export");
      return;
    }

    const headers = ["Timestamp", "Action", "Description", "Actor Name", "Target Type", "IP Address"];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map((log) => [
        `"${new Date(log.createdAt).toLocaleString().replace(/"/g, '""')}"`,
        `"${log.action.replace(/"/g, '""')}"`,
        `"${log.description.replace(/"/g, '""')}"`,
        `"${(log.actorName || log.actorId || "").replace(/"/g, '""')}"`,
        `"${(log.targetType || "").replace(/"/g, '""')}"`,
        `"${(log.ipAddress || "").replace(/"/g, '""')}"`,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("Exporting logs...");
  };

  if (isLoading && logs.length === 0) {
    return <FullPageLoader label="Loading audit logs..." />;
  }

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN')) return <ShieldCheck className="h-4 w-4" />;
    if (action.includes('CREATE') || action.includes('ADD')) return <FileText className="h-4 w-4" />;
    if (action.includes('DELETE') || action.includes('DEACTIVATED')) return <AlertTriangle className="h-4 w-4 text-rose-500" />;
    if (action.includes('ROLE')) return <User className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getActionStyles = (action: string) => {
    if (action.includes('DELETE') || action.includes('DEACTIVATED'))
      return "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400";
    if (action.includes('CREATE') || action.includes('ADD'))
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    if (action.includes('LOGIN'))
      return "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400";
    return "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            Audit Logs
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            A comprehensive record of all administrative and security actions within the MIRA ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "shadow-sm transition-all border-slate-200 dark:border-slate-800",
              showFilters && "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-500/50"
            )}
          >
            <FilterX className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Advanced Filters"}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="shadow-sm border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="mr-2 h-4 w-4 text-emerald-500" />
            Export
          </Button>
          <Button
            variant="ghost"
            onClick={refresh}
            className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full"
          >
            <RefreshCw className={cn("h-5 w-5 text-indigo-600", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="border-indigo-500/10 bg-indigo-50/30 dark:bg-indigo-900/5 backdrop-blur-sm shadow-inner animate-in slide-in-from-top-4 duration-300">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Search Description</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Action Type</label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full h-11 px-3 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">All Actions</option>
                {actionCategories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">From Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-indigo-500 pointer-events-auto"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">To Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
              />
            </div>
          </CardContent>
          {(searchQuery || selectedAction !== "all" || startDate || endDate) && (
            <div className="px-6 pb-4 flex items-center justify-between border-t border-indigo-500/5 pt-4">
              <div className="flex flex-wrap gap-2">
                {searchQuery && <span className="px-2 py-1 bg-white dark:bg-slate-800 text-xs rounded border border-indigo-100 flex items-center gap-1">Search: {searchQuery} <FilterX className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} /></span>}
                {selectedAction !== "all" && <span className="px-2 py-1 bg-white dark:bg-slate-800 text-xs rounded border border-indigo-100 flex items-center gap-1">Action: {selectedAction} <FilterX className="h-3 w-3 cursor-pointer" onClick={() => setSelectedAction("all")} /></span>}
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedAction("all");
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 uppercase tracking-tighter underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </Card>
      )}

      {Object.keys(groupedLogs).length === 0 ? (
        <Card className="border-dashed border-2 py-20 flex flex-col items-center justify-center text-center opacity-70">
          <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <FilterX className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No logs found</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-xs">
            We couldn't find any audit logs matching your current filters. Try broadening your criteria.
          </p>
        </Card>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedLogs).map(([date, logs]) => (
            <div key={date} className="relative">
              <div className="sticky top-20 z-10 py-2 flex items-center gap-4 bg-transparent backdrop-blur-sm -mx-4 px-4 overflow-hidden">
                <div className="h-px flex-1 bg-indigo-500/20"></div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 bg-white/50 dark:bg-slate-900/50 px-4 py-1.5 rounded-full border border-indigo-500/10 shadow-sm">
                  {date}
                </h2>
                <div className="h-px flex-1 bg-indigo-500/20"></div>
              </div>

              <div className="mt-8 relative ml-4 sm:ml-12 border-l-2 border-indigo-500/20 pl-8 space-y-10 pb-4">
                {logs.map((log, index) => (
                  <div key={log.id} className={cn(
                    "relative group animate-in slide-in-from-left-4 duration-500",
                    `delay-[${index * 50}ms]`
                  )}>
                    {/* Timeline Node */}
                    <div className="absolute -left-[45px] top-1 h-8 w-8 rounded-full border-4 border-white dark:border-slate-900 bg-indigo-500 shadow-lg shadow-indigo-500/40 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                      <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                    </div>

                    <Card className="overflow-hidden border-slate-200/60 bg-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 dark:border-indigo-500/10 dark:bg-[#09090b] transition-all transform hover:-translate-y-1">
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-xl border flex items-center justify-center shadow-inner",
                              getActionStyles(log.action)
                            )}>
                              {getActionIcon(log.action)}
                            </div>
                            <div>
                              <div className="text-xs font-bold uppercase tracking-tighter text-slate-400 mb-0.5">
                                {log.action.replace(/_/g, ' ')}
                              </div>
                              <div className="text-xs text-indigo-500 font-medium flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none mb-1">Authenticated via IP</span>
                              <span className="font-mono text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">{log.ipAddress || "::1"}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                          {log.description}
                        </p>

                        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6">
                          <div className="flex items-center gap-2 group/actor">
                            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                              {log.actorName ? log.actorName.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase leading-none">Initiated By</div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{log.actorName || log.actorId}</div>
                            </div>
                          </div>

                          {log.targetType && (
                            <div className="px-4 border-l border-slate-200 dark:border-slate-800">
                              <div className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">Target Resource</div>
                              <div className="flex items-center gap-1.5">
                                <Target className="h-3.5 w-3.5 text-indigo-500" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">{log.targetType}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
