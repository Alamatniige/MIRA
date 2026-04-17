'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FullPageLoader } from '@/components/ui/loader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import {
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Clock,
  CheckCircle2,
  Activity,
  TrendingUp,
  User,
  Box,
  Calendar,
  ExternalLink,
  ShieldAlert,
  Search,
  Download,
  Eye,
} from 'lucide-react';
import Image from 'next/image';
import { BuildingFloorMap } from './BuildingFloorMap';
import { useIssueReports, useUpdateReportStatus } from '@/hooks/useReports';
import { toast } from 'sonner';

type Report = {
  id: string;
  assetTag: string;
  name: string;
  user: string;
  date: string;
  description: string;
  status: 'open' | 'in_progress' | 'return_requested' | 'resolved';
  images?: string[];
  adminNote?: string;
  initials?: string;
};

const kpis = (reports: Report[]) => [
  {
    label: 'Total Incidents',
    value: reports.length.toString(),
    sub: 'All reported asset issues',
    icon: <Activity className="h-5 w-5" />,
    color:
      'from-slate-500/10 to-slate-600/10 text-slate-700 border-slate-200/60 dark:from-slate-500/15 dark:to-slate-400/5 dark:text-slate-300 dark:border-slate-400/20',
    valueColor: 'text-slate-800 dark:text-slate-100',
  },
  {
    label: 'Open Cases',
    value: reports.filter((r) => r.status === 'open').length.toString(),
    sub: 'Awaiting triage',
    icon: <AlertCircle className="h-5 w-5" />,
    color:
      'from-red-500/10 to-red-600/10 text-red-700 border-red-200/60 dark:from-red-500/15 dark:to-red-400/5 dark:text-red-300 dark:border-red-500/20',
    valueColor: 'text-red-800 dark:text-red-300',
  },
  {
    label: 'In Progress',
    value: reports.filter((r) => r.status === 'in_progress').length.toString(),
    sub: 'Technician assigned',
    icon: <Clock className="h-5 w-5" />,
    color:
      'from-amber-500/10 to-amber-600/10 text-amber-700 border-amber-200/60 dark:from-amber-500/15 dark:to-amber-400/5 dark:text-amber-300 dark:border-amber-500/20',
    valueColor: 'text-amber-800 dark:text-amber-200',
  },
  {
    label: 'Resolved',
    value: reports.filter((r) => r.status === 'resolved').length.toString(),
    sub: 'Closed this month',
    icon: <CheckCircle2 className="h-5 w-5" />,
    color:
      'from-emerald-500/10 to-emerald-600/10 text-emerald-700 border-emerald-200/60 dark:from-emerald-500/15 dark:to-emerald-400/5 dark:text-emerald-300 dark:border-emerald-500/20',
    valueColor: 'text-emerald-800 dark:text-emerald-200',
  },
];

export function ReportAnalytics() {
  const { reports: rawReports, isLoading: reportsLoading, refetch } = useIssueReports();
  const { updateStatus, isUpdating: statusUpdating } = useUpdateReportStatus();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  // Map API IssueReport → local Report shape
  const reports: Report[] = rawReports.map((r) => ({
    id: r.id,
    assetTag: r.assetTag || r.assetId,
    name: r.assetName || 'Unknown Asset',
    user: r.userName || 'Unknown User',
    date: r.reportAt ? new Date(r.reportAt).toLocaleDateString('en-CA') : '',
    description: r.description,
    status: r.status.toLowerCase() as Report['status'],
    images: r.image ? [r.image] : [],
    adminNote: (r as any).adminNote,
    initials: r.userName
      ? r.userName
          .split(' ')
          .filter(Boolean)
          .map((n) => n[0].toUpperCase())
          .join('')
      : '?',
  }));

  const handleUpdateStatus = async (specificStatus?: Report['status']) => {
    if (!selectedReport) return;

    let nextStatus: Report['status'] = specificStatus || 'open';
    if (!specificStatus) {
      if (selectedReport.status === 'open') nextStatus = 'in_progress';
      else if (selectedReport.status === 'in_progress' || selectedReport.status === 'return_requested') nextStatus = 'resolved';
      else return; // already resolved
    }

    try {
      await updateStatus(selectedReport.id, nextStatus, nextStatus === 'return_requested' ? adminNote : undefined);
      const successMsg =
        nextStatus === 'in_progress'
          ? 'Acknowledge: Under Maintenance'
          : nextStatus === 'return_requested'
            ? 'Return Requested'
            : 'Resolved: Good';
      toast.success(`Case #${selectedReport.id}: ${successMsg}`);
      
      setShowNoteInput(false);
      setAdminNote('');
      refetch();
      setSelectedReport((prev) => (prev ? { ...prev, status: nextStatus, adminNote: nextStatus === 'return_requested' ? adminNote : prev.adminNote } : null));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  if (reportsLoading) {
    return <FullPageLoader label="Loading reports..." />;
  }

  const filteredReports = reports.filter((report) => {
    const query = searchQuery.toLowerCase();
    return (
      report.name.toLowerCase().includes(query) ||
      report.assetTag.toLowerCase().includes(query) ||
      report.user.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query)
    );
  });

  const reportKpis = kpis(reports);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reports
          </h1>
          <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Real-time monitoring of asset performance issues, maintenance requests, and resolution
            tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-slate-200/60 bg-white/50 px-5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <Download className="mr-2 h-3.5 w-3.5" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Building Map Visualization */}
      <div className="-mt-6">
        <BuildingFloorMap />
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
        {reportKpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`flex flex-col gap-2 rounded-2xl border bg-linear-to-br p-4 transition-all hover:shadow-lg hover:-translate-y-0.5 dark:hover:shadow-teal-900/10 dark:bg-[#09090b] ${kpi.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-75 dark:opacity-90">
                {kpi.label}
              </span>
              <div className="rounded-lg bg-white/30 p-1.5 dark:bg-black/20">{kpi.icon}</div>
            </div>
            <div className="flex items-end justify-between">
              <p className={`text-3xl font-bold tracking-tight ${kpi.valueColor}`}>{kpi.value}</p>
              <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span>+4%</span>
              </div>
            </div>
            <p className="text-[10px] font-medium opacity-60 dark:opacity-70">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl transition-all dark:border-teal-500/10 dark:bg-[#09090b] dark:shadow-teal-900/20">
        <CardHeader className="relative border-b border-slate-100 pb-4 dark:border-teal-800/20">
          <div className="flex flex-wrap items-center justify-between gap-4 pr-10">
            <div>
              <CardTitle className="text-base font-bold">Case Directory</CardTitle>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Detailed record of hardware malfunctions and repair history.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-48 rounded-full border border-slate-200 bg-white/50 pl-8 text-[11px] outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-white/5 dark:bg-white/5"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-100/30 dark:bg-teal-950/20">
              <TableRow className="border-slate-100 dark:border-teal-800/20">
                <TableHead className="w-30 px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-teal-400/60">
                  Asset Tag
                </TableHead>
                <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-teal-400/60">
                  Name
                </TableHead>
                <TableHead className="w-45 px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-teal-400/60">
                  User
                </TableHead>
                <TableHead className="w-35 px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-teal-400/60">
                  Date of Reported
                </TableHead>
                <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-teal-400/60">
                  Description
                </TableHead>
                <TableHead className="w-25 px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-teal-400/60 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow
                  key={report.id}
                  className="group cursor-pointer border-b border-slate-50 transition-all hover:bg-slate-100/40 dark:border-teal-800/10 dark:hover:bg-teal-900/10"
                  onClick={() => setSelectedReport(report)}
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-100 dark:bg-teal-900/30">
                        <Box className="h-3.5 w-3.5 text-slate-500 dark:text-teal-400" />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-teal-300">
                        {report.assetTag}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {report.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-emerald-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                        {report.initials}
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                        {report.user}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {report.date}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="line-clamp-1 text-xs text-slate-600 dark:text-slate-400">
                      {report.description}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button
                      size="xs"
                      variant="outline"
                      className="h-8 w-8 rounded-full border-slate-200 bg-white p-0 hover:bg-teal-50 hover:text-teal-600 dark:border-white/10 dark:bg-white/5 dark:hover:bg-teal-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(report);
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredReports.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    No cases match your filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Case Details Modal */}
      <Modal
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport ? 'Incident Investigation' : ''}
        description={selectedReport ? `Overview of Case #${selectedReport.id}` : ''}
        className="max-w-4xl"
        contentClassName="px-0 py-0"
      >
        {selectedReport && (
          <div className="flex flex-col bg-slate-50/50 dark:bg-[#020617]">
            {/* Modal Header/Subheader */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-teal-800/15 bg-white dark:bg-[#09090b]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 dark:bg-teal-500/20">
                    <ShieldAlert className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedReport.name}
                    </h2>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <span className="font-mono text-teal-600 dark:text-teal-400">
                        {selectedReport.assetTag}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>Logged by {selectedReport.user}</span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    selectedReport.status === 'open'
                      ? 'danger'
                      : (selectedReport.status === 'in_progress' || selectedReport.status === 'return_requested')
                        ? 'warning'
                        : 'success'
                  }
                  className="px-3 py-1 text-[11px] font-bold uppercase"
                >
                  {selectedReport.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <div className="grid gap-0 md:grid-cols-[1fr_320px]">
              <div className="p-6 space-y-6">
                {/* Description Box */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-teal-600" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Statement of Problem
                    </h3>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white p-4 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-teal-800/15 dark:bg-white/5 dark:text-slate-300">
                    {selectedReport.description}
                  </div>
                </div>

                {/* Evidence/Images */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-3.5 w-3.5 text-teal-600" />
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Visual Evidence
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      {selectedReport.images?.length ?? 0} Attached
                    </span>
                  </div>

                  {selectedReport.images && selectedReport.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedReport.images.map((src, index) => (
                        <div
                          key={src}
                          className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-white/5 dark:bg-white/5"
                        >
                          <Image
                            src={src}
                            alt={`Evidence ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                          <button className="absolute bottom-3 right-3 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-all hover:bg-white hover:text-teal-600 opacity-0 group-hover:opacity-100">
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-white/5 dark:bg-white/5">
                      <div className="space-y-1">
                        <ImageIcon className="mx-auto h-8 w-8 text-slate-300" />
                        <p className="text-xs text-slate-400">No photos provided for this case.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="border-l border-slate-100 bg-slate-50/50 p-6 dark:border-teal-800/15 dark:bg-black/20">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Case Metadata
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Asset Code', value: selectedReport.assetTag, icon: Box },
                        { label: 'Reported On', value: selectedReport.date, icon: Calendar },
                        { label: 'Logged By', value: selectedReport.user, icon: User },
                        { label: 'System ID', value: selectedReport.id, icon: FileText },
                      ].map((item) => (
                        <div key={item.label} className="flex gap-3">
                          <div className="mt-1 h-3.5 w-3.5 text-teal-600">
                            <item.icon className="h-full w-full" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {item.label}
                            </span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                              {item.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 dark:border-teal-800/15">
                    {showNoteInput ? (
                      <div className="space-y-3 mb-4 animate-in fade-in slide-in-from-top-2">
                        <textarea
                          placeholder="Add note for the user (e.g. 'Please surrender this device to IT for repairs')"
                          className="w-full h-20 min-h-[80px] rounded-lg border border-slate-200 bg-white/50 p-3 text-xs outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-white/10 dark:bg-black/20 dark:text-slate-200"
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => setShowNoteInput(false)}
                            disabled={statusUpdating}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="flex-1 bg-amber-600 text-white hover:bg-amber-700 text-xs"
                            onClick={() => handleUpdateStatus('return_requested')}
                            disabled={statusUpdating}
                          >
                            {statusUpdating ? 'Sending...' : 'Confirm Request'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedReport.status === 'in_progress' ? (
                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-500 dark:hover:bg-amber-900/50"
                              onClick={() => setShowNoteInput(true)}
                              disabled={statusUpdating}
                            >
                              Request Return
                            </Button>
                            <Button
                              className="flex-1 bg-slate-900 text-white hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500"
                              onClick={() => handleUpdateStatus('resolved')}
                              disabled={statusUpdating}
                            >
                              {statusUpdating ? 'Updating...' : 'Resolve Case'}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500"
                            onClick={() => handleUpdateStatus()}
                            disabled={statusUpdating || selectedReport.status === 'resolved'}
                          >
                            {statusUpdating
                              ? 'Updating...'
                              : selectedReport.status === 'open'
                                ? 'Acknowledge Case'
                                : selectedReport.status === 'return_requested'
                                  ? 'Resolve Case'
                                  : 'Case Resolved'}
                          </Button>
                        )}
                      </div>
                    )}
                    <p className="mt-3 text-[10px] text-center text-slate-400 px-4 leading-tight">
                      {selectedReport.status === 'resolved'
                        ? 'The asset has been returned to Good condition.'
                        : selectedReport.status === 'return_requested'
                          ? `Awaiting asset return. Note: ${selectedReport.adminNote || 'None'}`
                          : selectedReport.status === 'in_progress'
                            ? 'Asset is currently Under Maintenance.'
                            : 'Asset is currently Under Review.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
