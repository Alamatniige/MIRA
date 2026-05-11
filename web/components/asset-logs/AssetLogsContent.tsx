"use client";

import { useMemo, useState } from "react";
import { useAssetLogs } from "@/hooks/useAssetLogs";
import { FullPageLoader } from "@/components/ui/loader";
import { 
  History, 
  RefreshCw, 
  Search, 
  FilterX, 
  Clock, 
  Package, 
  User, 
  Activity,
  AlertTriangle,
  Tag,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AssetLogsContent() {
  const { logs, isLoading, error, refresh } = useAssetLogs();
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
        log.assetName?.toLowerCase().includes(q) ||
        log.assetTag?.toLowerCase().includes(q);
      
      const matchesAction = selectedAction === "all" || log.action === selectedAction;
      
      const logDate = new Date(log.timestamp);
      const matchesStartDate = !startDate || logDate >= new Date(startDate);
      const matchesEndDate = !endDate || logDate <= new Date(new Date(endDate).setHours(23, 59, 59));

      return matchesSearch && matchesAction && matchesStartDate && matchesEndDate;
    });
  }, [logs, searchQuery, selectedAction, startDate, endDate]);

  const groupedLogs = useMemo(() => {
    const groups: Record<string, typeof logs> = {};
    filteredLogs.forEach(log => {
      const date = new Date(log.timestamp).toLocaleDateString(undefined, { 
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

    const headers = ["Timestamp", "Action", "Description", "Asset Name", "Asset Tag", "Actor Name"];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map((log) => [
        `"${new Date(log.timestamp).toLocaleString().replace(/"/g, '""')}"`,
        `"${log.action.replace(/"/g, '""')}"`,
        `"${log.description.replace(/"/g, '""')}"`,
        `"${(log.assetName || "Unknown").replace(/"/g, '""')}"`,
        `"${(log.assetTag || "").replace(/"/g, '""')}"`,
        `"${(log.actorName || "Global System").replace(/"/g, '""')}"`,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Asset_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("Exporting asset logs...");
  };

  if (isLoading && logs.length === 0) {
    return <FullPageLoader label="Loading asset logs..." />;
  }

  const getActionIcon = (action: string) => {
    if (action.includes('REGISTERED')) return <Package className="h-4 w-4" />;
    if (action.includes('ASSIGNED')) return <User className="h-4 w-4" />;
    if (action.includes('RETURNED')) return <History className="h-4 w-4" />;
    if (action.includes('STATUS')) return <Activity className="h-4 w-4" />;
    if (action.includes('DELETED')) return <AlertTriangle className="h-4 w-4 text-rose-500" />;
    return <Tag className="h-4 w-4" />;
  };

  const getActionStyles = (action: string) => {
    if (action.includes('DELETED') || action.includes('REJECTED')) 
      return "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400";
    if (action.includes('REGISTERED') || action.includes('ASSIGNED') || action.includes('CONFIRMED')) 
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    return "border-teal-500/20 bg-teal-500/10 text-teal-600 dark:text-teal-400";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <History className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            Asset Logs
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            A chronological timeline of asset lifecycle events, conditions, and ownership transfers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-9 flex-1 sm:flex-none sm:px-5 rounded-full shadow-sm transition-all border-slate-200 dark:border-slate-800 text-xs font-semibold",
              showFilters && "bg-teal-50 border-teal-200 text-teal-600 dark:bg-teal-900/20 dark:border-teal-500/50"
            )}
          >
            <FilterX className="mr-2 h-3.5 w-3.5" />
            {showFilters ? "Hide" : "Filters"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportCSV}
            className="h-9 flex-1 sm:flex-none sm:px-5 rounded-full shadow-sm border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold"
          >
            <Download className="mr-2 h-3.5 w-3.5 text-teal-500" />
            Export
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={refresh}
            className="h-9 w-9 p-0 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-full shrink-0"
          >
            <RefreshCw className={cn("h-4 w-4 text-teal-600", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="border-teal-500/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm animate-in slide-in-from-top-4 duration-300 overflow-hidden rounded-2xl">
          <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Search Assets</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Name or Tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Action Category</label>
              <select 
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full h-11 px-3 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="all">All Events</option>
                {actionCategories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Starts From</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ends At</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-teal-500"
              />
            </div>
          </CardContent>
          {(searchQuery || selectedAction !== "all" || startDate || endDate) && (
            <div className="px-6 pb-4 flex items-center justify-between border-t border-teal-500/5 pt-4">
              <div className="flex flex-wrap gap-2">
                {searchQuery && <span className="px-2 py-1 bg-white dark:bg-slate-800 text-xs rounded border border-teal-100 flex items-center gap-1">Search: {searchQuery} <FilterX className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} /></span>}
                {selectedAction !== "all" && <span className="px-2 py-1 bg-white dark:bg-slate-800 text-xs rounded border border-teal-100 flex items-center gap-1">Action: {selectedAction} <FilterX className="h-3 w-3 cursor-pointer" onClick={() => setSelectedAction("all")} /></span>}
              </div>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedAction("all");
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-xs font-bold text-teal-600 hover:text-teal-800 dark:text-teal-400 uppercase tracking-tighter underline"
              >
                Clear filters
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
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Empty lifecycle history</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-xs">
            No asset lifecycle events found matching your current filter criteria.
          </p>
        </Card>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedLogs).map(([date, logs]) => (
            <div key={date} className="relative">
              <div className="sticky top-16 sm:top-20 z-10 py-2 flex items-center gap-3 sm:gap-4 bg-transparent backdrop-blur-sm -mx-2 sm:-mx-4 px-2 sm:px-4 overflow-hidden">
                <div className="h-px flex-1 bg-teal-500/20"></div>
                <h2 className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-teal-600 dark:text-teal-400 bg-white/80 dark:bg-slate-900/80 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-teal-500/10 shadow-sm whitespace-nowrap">
                  {date}
                </h2>
                <div className="h-px flex-1 bg-teal-500/20"></div>
              </div>

              <div className="mt-6 sm:mt-8 relative ml-2 sm:ml-12 border-l-2 border-teal-500/20 pl-6 sm:pl-8 space-y-8 sm:space-y-10 pb-4">
                {logs.map((log, index) => (
                  <div key={log.id} className={cn(
                    "relative group animate-in slide-in-from-left-4 duration-500"
                  )}>
                    {/* Timeline Node */}
                    <div className="absolute -left-[35px] sm:-left-[45px] top-1 h-6 w-6 sm:h-8 sm:w-8 rounded-full border-4 border-white dark:border-slate-900 bg-teal-500 shadow-lg shadow-teal-500/40 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                      <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white"></div>
                    </div>

                    <Card className="overflow-hidden border-slate-200/60 bg-white/80 dark:bg-[#09090b]/80 shadow-sm hover:shadow-md dark:border-teal-500/10 transition-all">
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start sm:items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-xl border flex items-center justify-center shadow-inner shrink-0",
                              getActionStyles(log.action)
                            )}>
                              {getActionIcon(log.action)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 mb-0.5">
                                {log.action.replace(/_/g, ' ')}
                              </div>
                              <div className="text-[10px] text-teal-500 font-medium flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 sm:self-center">
                             <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                               <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest leading-none mb-1.5">Asset Reference</span>
                               <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg w-full sm:w-auto">
                                  <Package className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[120px] sm:max-w-none">{log.assetName || "Unknown"}</span>
                                  <span className="text-[9px] bg-teal-500 text-white px-1.5 py-0.5 rounded font-black shrink-0">{log.assetTag || "---"}</span>
                               </div>
                             </div>
                          </div>
                        </div>

                        <div className="mt-4 border-t border-slate-100 dark:border-white/5 pt-4">
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                            &quot;{log.description}&quot;
                          </p>
                          
                          <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-slate-400">
                             <div className="flex items-center gap-1.5">
                                <User className="h-3 w-3" />
                                <span className="font-medium">Action by: <span className="text-slate-700 dark:text-slate-300">{log.actorName || "System"}</span></span>
                             </div>
                          </div>
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
