"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { FullPageLoader } from "@/components/ui/loader";
import { 
  AlertTriangle, 
  RefreshCw, 
  Activity,
  Clock,
  AlertCircle,
  Package,
  CheckCircle2,
  XCircle,
  UserCheck,
  PackagePlus,
  PencilLine,
  Trash2,
  ClipboardCheck,
  ShieldCheck,
  LucideIcon,
  Search,
  FilterX,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/types/mira";

const ICON_MAP: Record<NotificationType, { icon: LucideIcon; iconColor: string; iconBg: string }> = {
  REPORT_SUBMITTED: {
    icon: AlertCircle,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-500/10',
  },
  REQUEST_PENDING: {
    icon: Package,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  REQUEST_ACCEPTED: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  REQUEST_REJECTED: {
    icon: XCircle,
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-500/10',
  },
  asset_assigned: {
    icon: UserCheck,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  asset_registered: {
    icon: PackagePlus,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  asset_updated: {
    icon: PencilLine,
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-50 dark:bg-violet-500/10',
  },
  asset_deleted: {
    icon: Trash2,
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-500/10',
  },
  asset_status_changed: {
    icon: RefreshCw,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50 dark:bg-orange-500/10',
  },
  issue_acknowledged: {
    icon: ClipboardCheck,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  issue_resolved: {
    icon: ShieldCheck,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
};

const formatTypeLabel = (type: string) => {
  return type
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

export function ActivityLogsContent() {
  const { notifications, isLoading, error, fetchNotifications, markRead } = useNotifications();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  const typeSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (typeSelectRef.current && !typeSelectRef.current.contains(e.target as Node)) {
        setIsTypeSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Derived available types from the notification stream
  const availableTypes = useMemo(() => {
    const types = new Set(notifications.map(n => n.type));
    return Array.from(types);
  }, [notifications]);

  // Apply Filters
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !n.title.toLowerCase().includes(q) &&
          !n.message.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      // Status
      if (statusFilter === "unread" && n.is_read) return false;
      if (statusFilter === "read" && !n.is_read) return false;
      // Type
      if (typeFilter !== "all" && n.type !== typeFilter) return false;

      return true;
    });
  }, [notifications, searchQuery, statusFilter, typeFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const isFiltering = searchQuery !== "" || statusFilter !== "all" || typeFilter !== "all";

  if (isLoading && notifications.length === 0) {
    return <FullPageLoader label="Loading activity logs..." />;
  }

  if (error && notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-amber-500" />
        <h2 className="text-xl font-bold">Failed to load activity logs</h2>
        <p className="mt-2 text-slate-500">{error}</p>
        <Button className="mt-6" onClick={fetchNotifications}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            Activity Logs
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Monitor recent actions, notifications, and system updates.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchNotifications}
          className="w-full sm:w-auto mt-4 md:mt-0"
        >
          <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <Card className="overflow-hidden border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl dark:border-teal-500/10 dark:bg-[#09090b] dark:shadow-teal-900/20">
        
        {/* Advanced Filters */}
        <div className="border-b border-slate-100 dark:border-slate-800 p-4 sm:p-5 bg-white/40 dark:bg-[#041112]/40">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[320px] shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 w-full shadow-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
              {/* Status Segmented Control */}
              <div className="flex bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-lg border border-slate-200/50 dark:border-slate-800/80 shrink-0 h-10 w-full sm:w-auto">
                {(['all', 'unread', 'read'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "flex-1 sm:flex-none px-4 text-xs font-semibold rounded-md capitalize transition-all h-full",
                      statusFilter === status 
                        ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700/50" 
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Custom Elegant Select for Type */}
              <div ref={typeSelectRef} className="relative shrink-0 w-full sm:w-[180px]">
                <button
                  type="button"
                  onClick={() => setIsTypeSelectOpen((prev) => !prev)}
                  className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white/60 px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/20 dark:border-slate-800/80 dark:bg-[#09090b]/60 dark:focus-visible:ring-teal-800 text-slate-700 dark:text-slate-300 transition-colors hover:bg-white dark:hover:bg-[#09090b] shadow-sm"
                >
                  <span className="truncate pr-2">
                    {typeFilter === "all" ? "All Types" : formatTypeLabel(typeFilter)}
                  </span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200", isTypeSelectOpen && "rotate-180")} />
                </button>

                {isTypeSelectOpen && (
                  <div className="absolute z-50 left-0 right-0 top-full mt-1.5 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-[#041112] p-1 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-2">
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center px-3 py-2 text-sm rounded-md transition-colors",
                        typeFilter === "all"
                          ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-teal-950/20 font-medium"
                      )}
                      onClick={() => {
                        setTypeFilter("all");
                        setIsTypeSelectOpen(false);
                      }}
                    >
                      All Types
                    </button>
                    {availableTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={cn(
                          "flex w-full items-center px-3 py-2 text-sm rounded-md transition-colors",
                          typeFilter === type
                            ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 font-semibold"
                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-teal-950/20 font-medium"
                        )}
                        onClick={() => {
                          setTypeFilter(type);
                          setIsTypeSelectOpen(false);
                        }}
                      >
                        {formatTypeLabel(type)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isFiltering && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="shrink-0 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white sm:px-2"
                >
                  <FilterX className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-8 my-8 space-y-8">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center pl-6">
                <FilterX className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {isFiltering ? "No activity matching your filters" : "No recent activity"}
                </p>
                {isFiltering && (
                  <button onClick={clearFilters} className="mt-2 text-xs text-teal-600 hover:underline dark:text-teal-400">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const { icon: Icon, iconColor, iconBg } = ICON_MAP[notification.type] ?? {
                  icon: AlertCircle,
                  iconColor: 'text-slate-500',
                  iconBg: 'bg-slate-50 dark:bg-slate-500/10',
                };
                
                return (
                  <div key={notification.id} className="relative pl-8 pr-6 group" onClick={() => !notification.is_read && markRead(notification.id)}>
                    {/* Timeline dot */}
                    <div className="absolute -left-[9px] top-6 h-4 w-4 rounded-full bg-white dark:bg-[#09090b] border-2 border-slate-300 dark:border-slate-700 z-10 transition-transform group-hover:scale-110 group-hover:border-teal-500 dark:group-hover:border-teal-400" />
                    
                    <div className={cn(
                      "flex flex-col sm:flex-row gap-4 p-5 rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-teal-950/20 cursor-pointer border",
                      !notification.is_read 
                        ? "bg-slate-50/50 dark:bg-teal-950/10 border-blue-100/50 dark:border-blue-900/30 shadow-sm" 
                        : "border-transparent"
                    )}>
                      
                      <div className={cn("shrink-0 flex items-center justify-center h-12 w-12 rounded-xl", iconBg)}>
                        <Icon className={cn("h-6 w-6", iconColor)} />
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-2">
                          <h4 className={cn(
                            "text-base font-semibold truncate",
                            !notification.is_read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"
                          )}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                            <Clock className="h-3 w-3" />
                            {new Date(notification.created_at).toLocaleString()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {notification.message}
                        </p>
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
  );
}
