'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  ClipboardList,
  UserCheck,
  RotateCcw,
  Wrench,
  ChevronRight,
  Search,
  CalendarDays,
  SlidersHorizontal,
  Check,
  Eye,
} from 'lucide-react';

import { useAssignments } from '@/hooks/useAssignments';
import { useAssets } from '@/hooks/useAssets';
import { Modal } from '../ui/modal';
import type { User } from '@/types/mira';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  );
}

const badgeStyles: Record<string, string> = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  muted: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

function statusVariant(status: string): 'success' | 'warning' | 'muted' {
  if (status === 'CONFIRMED') return 'success';
  if (status === 'PENDING') return 'warning';
  return 'muted';
}

const EMPTY_FORM = {
  assetQuery: '',
  assetId: '',
  userQuery: '',
  userId: '',
  department: '',
  date: new Date().toISOString().split('T')[0],
  notes: '',
};

export function AssignmentView() {
  const [viewTimeline, setViewTimeline] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMorOpen, setIsMorOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [assignmentToConfirm, setAssignmentToConfirm] = useState<{
    id: string;
    asset: string;
    name: string;
    assignee: string;
    initials: string;
    department: string;
  } | null>(null);
  const [viewingAssignment, setViewingAssignment] = useState<{
    asset: string;
    name: string;
    assignee: string;
    initials: string;
    department: string;
    date: string;
    status: string;
    statusVariant: 'success' | 'warning' | 'muted';
    notes?: string;
  } | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [assetOpen, setAssetOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Store the last submitted form data for the MOR modal
  const [morData, setMorData] = useState(EMPTY_FORM);

  const { assignments, users, isLoading, createAssignment, confirmAssignment } = useAssignments();
  const { assets, refresh: refreshAssets } = useAssets();

  const occupiedAssetIds = new Set(
    assignments.filter((a) => a.status !== 'RETURNED').map((a) => a.assetId),
  );
  const unassignedAssets = assets.filter((a) => !occupiedAssetIds.has(a.id));

  const filteredAssets = unassignedAssets.filter(
    (a) =>
      a.tag.toLowerCase().includes(form.assetQuery.toLowerCase()) ||
      a.assetName.toLowerCase().includes(form.assetQuery.toLowerCase()),
  );
  const filteredUsers = users.filter(
    (u: User) =>
      u.fullName.toLowerCase().includes(form.userQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(form.userQuery.toLowerCase()),
  );

  // Derived stats
  const totalCount = assignments.length;
  const assignedCount = assignments.filter((a) => a.status !== 'RETURNED').length;
  const returnedCount = assignments.filter((a) => a.status === 'RETURNED').length;
  const pendingCount = assignments.filter((a) => a.status === 'PENDING').length;

  const stats = [
    {
      label: 'Total Assignments',
      value: totalCount,
      sub: 'All-time records',
      icon: <ClipboardList className="h-5 w-5" />,
      color:
        'from-teal-500/10 to-teal-600/10 text-teal-700 border-teal-200/60 dark:border-teal-800/40 dark:text-teal-400',
      valueColor: 'text-teal-800 dark:text-teal-300',
    },
    {
      label: 'Currently Assigned',
      value: assignedCount,
      sub: 'Active with staff',
      icon: <UserCheck className="h-5 w-5" />,
      color:
        'from-emerald-500/10 to-emerald-600/10 text-emerald-700 border-emerald-200/60 dark:border-emerald-800/40 dark:text-emerald-400',
      valueColor: 'text-emerald-800 dark:text-emerald-300',
    },
    {
      label: 'Returned',
      value: returnedCount,
      sub: 'Back in inventory',
      icon: <RotateCcw className="h-5 w-5" />,
      color:
        'from-slate-400/10 to-slate-500/10 text-slate-600 border-slate-200/60 dark:border-slate-700/40 dark:text-slate-400',
      valueColor: 'text-slate-800 dark:text-slate-200',
    },
    {
      label: 'Pending Confirmation',
      value: pendingCount,
      sub: 'Awaiting admin confirm',
      icon: <Wrench className="h-5 w-5" />,
      color:
        'from-amber-500/10 to-amber-600/10 text-amber-700 border-amber-200/60 dark:border-amber-800/40 dark:text-amber-400',
      valueColor: 'text-amber-800 dark:text-amber-300',
    },
  ];

  const handleConfirmAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.assetId || !form.userId) return;
    setIsSubmitting(true);
    try {
      await createAssignment(form.assetId, form.userId, form.notes);
      setMorData(form);
      setForm(EMPTY_FORM);
      setIsModalOpen(false);
      setIsMorOpen(true);
    } catch (err) {
      console.error('Failed to create assignment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalConfirm = async () => {
    if (!assignmentToConfirm) return;
    try {
      await confirmAssignment(assignmentToConfirm.id);
    } catch (err) {
      console.error('Failed to confirm assignment:', err);
    } finally {
      setIsConfirmModalOpen(false);
      setAssignmentToConfirm(null);
    }
  };

  if (isLoading) {
    return <FullPageLoader label="Loading assignments..." />;
  }

  return (
    <>
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
            className="h-9 self-start rounded-full bg-linear-to-r from-[#0F766E] to-[#0E7490] px-5 text-xs font-semibold text-white shadow-md hover:opacity-90 md:self-auto"
            onClick={() => setIsModalOpen(true)}
          >
            + Assign Asset
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`flex flex-col gap-2 rounded-xl border bg-linear-to-br p-4 transition-shadow hover:shadow-md ${s.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium opacity-80">{s.label}</span>
                <span className="opacity-60">{s.icon}</span>
              </div>
              <p className={`text-2xl font-bold tracking-tight ${s.valueColor}`}>{s.value}</p>
              <p className="text-[10px] font-medium opacity-60">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="w-full">
          {/* Assignment History */}
          <Card className="w-full overflow-hidden border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#09090b]">
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
                {viewTimeline ? 'View as table' : 'View as timeline'}
                <ChevronRight className="h-3 w-3" />
              </button>
            </CardHeader>

            <CardContent className="p-0">
              {viewTimeline ? (
                /* Timeline View */
                <div className="space-y-0 divide-y divide-slate-100 dark:divide-white/5">
                  {assignments.map((a, index) => {
                    const variant = statusVariant(a.status);
                    const label =
                      a.status === 'CONFIRMED'
                        ? 'Confirmed'
                        : a.status === 'RETURNED'
                          ? 'Returned'
                          : 'Pending';
                    const initials = getInitials(a.assignee);
                    const dateStr = formatDate(a.assignedAt);
                    return (
                      <div
                        key={a.id}
                        className="group flex gap-4 px-5 py-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-zinc-900/50"
                      >
                        {/* Timeline dot + line */}
                        <div className="flex flex-col items-center">
                          <span
                            className={`mt-1 flex h-2.5 w-2.5 shrink-0 rounded-full ${
                              variant === 'success'
                                ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
                                : variant === 'warning'
                                  ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                                  : 'bg-slate-400'
                            }`}
                          />
                          {index < assignments.length - 1 && (
                            <span className="mt-1.5 flex-1 w-px bg-slate-200 dark:bg-white/5" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500">
                                {a.assetTag}
                              </p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {a.assetName}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              <Badge
                                variant={variant}
                                className={`shrink-0 text-[10px] ${badgeStyles[variant]}`}
                              >
                                {label}
                              </Badge>
                              <div className="flex gap-2">
                                {a.status === 'PENDING' && (
                                  <button
                                    onClick={() => {
                                      setAssignmentToConfirm({
                                        id: a.id,
                                        asset: a.assetTag,
                                        name: a.assetName,
                                        assignee: a.assignee,
                                        initials,
                                        department: a.department,
                                      });
                                      setIsConfirmModalOpen(true);
                                    }}
                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600/10 text-teal-600 transition-all hover:bg-teal-600 hover:text-white dark:bg-teal-500/10 dark:text-teal-400 dark:hover:bg-teal-500 dark:hover:text-white"
                                    title="Confirm Assignment"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setViewingAssignment({
                                      asset: a.assetTag,
                                      name: a.assetName,
                                      assignee: a.assignee,
                                      initials,
                                      department: a.department,
                                      date: dateStr,
                                      status: label,
                                      statusVariant: variant,
                                      notes: a.notes,
                                    });
                                    setIsViewModalOpen(true);
                                  }}
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-1.5 flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-slate-100 to-slate-200 text-[9px] font-bold text-slate-600 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300">
                              {initials}
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400">
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {a.assignee}
                              </span>{' '}
                              · {a.department}
                            </p>
                          </div>
                          <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                            {dateStr}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Table View */
                <div className="overflow-x-auto">
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
                      {assignments.map((a) => {
                        const variant = statusVariant(a.status);
                        const label =
                          a.status === 'CONFIRMED'
                            ? 'Confirmed'
                            : a.status === 'RETURNED'
                              ? 'Returned'
                              : 'Pending';
                        const initials = getInitials(a.assignee);
                        const dateStr = formatDate(a.assignedAt);
                        return (
                          <TableRow
                            key={a.id}
                            className="group cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50/80 dark:border-white/5 dark:hover:bg-zinc-900/50"
                          >
                            <TableCell className="p-3 sm:p-4">
                              <p className="font-mono text-[11px] font-medium text-slate-400 dark:text-slate-500 group-hover:text-[#0F766E] dark:group-hover:text-teal-400 transition-colors">
                                {a.assetTag}
                              </p>
                              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                                {a.assetName}
                              </p>
                            </TableCell>
                            <TableCell className="p-3 sm:p-4">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-slate-100 to-slate-200 text-[10px] font-bold text-slate-600 shadow-sm dark:from-slate-700 dark:to-slate-800 dark:text-slate-300">
                                  {initials}
                                </div>
                                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                                  {a.assignee}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="p-3 text-xs text-slate-500 dark:text-slate-400 sm:p-4">
                              {a.department}
                            </TableCell>
                            <TableCell className="p-3 text-xs text-slate-500 dark:text-slate-400 sm:p-4">
                              {dateStr}
                            </TableCell>
                            <TableCell className="p-3 sm:p-4">
                              <Badge
                                variant={variant}
                                className={`text-[10px] shadow-sm ${badgeStyles[variant]}`}
                              >
                                {label}
                              </Badge>
                            </TableCell>
                            <TableCell className="p-3 sm:p-4">
                              <div className="flex items-center gap-2">
                                {a.status === 'PENDING' && (
                                  <button
                                    onClick={() => {
                                      setAssignmentToConfirm({
                                        id: a.id,
                                        asset: a.assetTag,
                                        name: a.assetName,
                                        assignee: a.assignee,
                                        initials,
                                        department: a.department,
                                      });
                                      setIsConfirmModalOpen(true);
                                    }}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600/10 text-teal-700 transition-all hover:bg-teal-600 hover:text-white dark:bg-teal-500/10 dark:text-teal-400 dark:hover:bg-teal-500 dark:hover:text-white"
                                    title="Confirm Assignment"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    setViewingAssignment({
                                      asset: a.assetTag,
                                      name: a.assetName,
                                      assignee: a.assignee,
                                      initials,
                                      department: a.department,
                                      date: dateStr,
                                      status: label,
                                      statusVariant: variant,
                                      notes: a.notes,
                                    });
                                    setIsViewModalOpen(true);
                                  }}
                                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all hover:bg-slate-100 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-700"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Asset */}
      <Modal
        open={isModalOpen}
        onClose={() => {
          refreshAssets();
          setIsModalOpen(false);
        }}
        title="New Asset Assignment"
        description="Capture a new asset assignment or reassignment."
      >
        <form className="space-y-5 py-2" onSubmit={handleConfirmAssignment}>
          {/* Select Asset */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Select Asset
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoComplete="off"
                placeholder="Search by tag or name…"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-[12px] text-slate-700 shadow-sm focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200 transition-all"
                value={form.assetQuery}
                onChange={(e) => {
                  setForm({ ...form, assetQuery: e.target.value, assetId: '' });
                  setAssetOpen(true);
                }}
                onFocus={() => setAssetOpen(true)}
                required={!form.assetId}
              />
              {assetOpen && filteredAssets.length > 0 && (
                <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-zinc-900 text-[12px]">
                  {filteredAssets.map((asset) => (
                    <li
                      key={asset.id}
                      className="cursor-pointer px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200"
                      onMouseDown={() => {
                        setForm({
                          ...form,
                          assetQuery: `${asset.tag} · ${asset.assetName}`,
                          assetId: asset.id,
                        });
                        setAssetOpen(false);
                      }}
                    >
                      <span className="font-mono text-teal-600 dark:text-teal-400">
                        {asset.tag}
                      </span>
                      {' · '}
                      {asset.assetName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Assignee + Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Assign To
              </label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Search staff name…"
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[12px] text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200 transition-all"
                value={form.userQuery}
                onChange={(e) => {
                  setForm({ ...form, userQuery: e.target.value, userId: '', department: '' });
                  setUserOpen(true);
                }}
                onFocus={() => setUserOpen(true)}
                required={!form.userId}
              />
              {userOpen && filteredUsers.length > 0 && (
                <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-zinc-900 text-[12px]">
                  {filteredUsers.map((u: User) => (
                    <li
                      key={u.id}
                      className="cursor-pointer px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200"
                      onMouseDown={() => {
                        setForm({
                          ...form,
                          userQuery: u.fullName,
                          userId: u.id,
                          department: u.department,
                        });
                        setUserOpen(false);
                      }}
                    >
                      <span className="font-medium">{u.fullName}</span>
                      <span className="ml-1.5 text-slate-400">{u.department}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Department
              </label>
              <Input
                placeholder="Auto-filled from user"
                className="h-9 rounded-xl border-slate-200 bg-slate-50/50 text-[12px] placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-[#0F766E]/20 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            </div>
          </div>

          {/* Date + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" /> Date
              </label>
              <Input
                type="date"
                className="h-9 rounded-xl border-slate-200 bg-slate-50/50 text-[12px] focus:border-[#0F766E] focus:ring-[#0F766E]/20 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" /> Initial Status
              </label>
              <div className="flex h-9 items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[12px] text-amber-600 dark:border-white/10 dark:bg-zinc-900/50 dark:text-amber-400 font-medium">
                Pending
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Notes
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-[12px] text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200 dark:placeholder:text-zinc-500 transition-all"
              placeholder="Purpose, project, or special conditions for this assignment."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-full border-slate-200 px-6 text-[11px] font-medium dark:border-white/10 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/5"
              onClick={() => {
                setForm(EMPTY_FORM);
                setIsModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !form.assetId || !form.userId}
              className="h-9 rounded-full bg-linear-to-r from-[#0F766E] to-[#0E7490] px-6 text-[11px] font-semibold text-white shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving…' : 'Confirm Assignment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Memo Modal */}
      <Modal
        open={isMorOpen}
        onClose={() => setIsMorOpen(false)}
        title="Memorandum of Receipt"
        description="Official document for asset assignment."
        className="max-w-3xl"
      >
        <div className="space-y-8 p-4 bg-white dark:bg-zinc-950 rounded-lg border border-slate-100 dark:border-zinc-800 overflow-auto relative print:p-0 print:border-0">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ClipboardList className="h-32 w-32" />
          </div>

          {/* Header */}
          <div className="flex justify-between items-start border-b pb-6 dark:border-zinc-800">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tighter flex items-center gap-2">
                <span className="bg-teal-600 text-white p-1 rounded">MI</span>RA
              </h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">
                Asset Management System
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase">
                MOR No.
              </p>
              <p className="text-lg font-mono font-bold text-teal-600">
                MOR-2026-{(Math.random() * 10000).toFixed(0).padStart(4, '0')}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-2 gap-8 text-xs">
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mb-1.5">
                  Recipient Details
                </h4>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {morData.userQuery}
                </p>
                <p className="text-slate-600 dark:text-slate-400">{morData.department}</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mb-1.5">
                  Assignment Date
                </h4>
                <p className="text-slate-900 dark:text-slate-100">
                  {morData.date || new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mb-1.5">
                  Asset Information
                </h4>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {morData.assetQuery}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mb-1.5">
                  Status
                </h4>
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-0">
                  Pending
                </Badge>
              </div>
            </div>
          </div>

          {/* Notes */}
          {morData.notes && (
            <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
              <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mb-2">
                Terms & Conditions
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic">
                {morData.notes}
              </p>
            </div>
          )}

          <div className="pt-8 text-[11px] text-slate-500 leading-relaxed max-w-2xl">
            I hereby acknowledge receipt of the asset(s) listed above in good working condition. I
            understand that I am responsible for the proper care and maintenance of this equipment.
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-16">
            <div className="text-center">
              <div className="border-b border-slate-300 dark:border-zinc-700 pb-2 mb-2 min-h-8" />
              <p className="text-[10px] font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                Received By
              </p>
              <p className="text-[9px] text-slate-500">Date & Signature</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-300 dark:border-zinc-700 pb-2 mb-2 min-h-8" />
              <p className="text-[10px] font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                Issued By
              </p>
              <p className="text-[9px] text-slate-500">Asset Management Officer</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t mt-8 dark:border-zinc-800 print:hidden">
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-full px-6 text-[11px]"
              onClick={() => setIsMorOpen(false)}
            >
              Close
            </Button>
            <Button
              size="sm"
              className="h-9 rounded-full bg-slate-900 px-6 text-[11px] font-semibold text-white shadow-lg hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-200 transition-all active:scale-95"
              onClick={() => window.print()}
            >
              Print MOR
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Modal */}
      <Modal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Assignment"
        description="Please verify the details before confirming."
        className="max-w-sm"
      >
        <div className="space-y-6 pt-2">
          {assignmentToConfirm && (
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-zinc-900/50">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <span>Asset</span>
                  <span className="font-mono">{assignmentToConfirm.asset}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {assignmentToConfirm.name}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-teal-500 to-teal-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm font-mono">
                      {assignmentToConfirm.initials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {assignmentToConfirm.assignee}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {assignmentToConfirm.department}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10 rounded-full px-6 text-[11px] font-medium"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex-1 h-10 rounded-full bg-linear-to-r from-[#0F766E] to-[#0E7490] px-6 text-[11px] font-semibold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
              onClick={handleFinalConfirm}
            >
              Confirm Now
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Assignment Details"
        description="Full documentation of this asset movement."
        className="max-w-md"
      >
        {viewingAssignment && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <Badge
                variant={viewingAssignment.statusVariant}
                className={`text-[10px] ${badgeStyles[viewingAssignment.statusVariant]}`}
              >
                {viewingAssignment.status}
              </Badge>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> {viewingAssignment.date}
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-4 dark:border-white/5 dark:bg-zinc-900/30">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Asset Information
                </h4>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-teal-100 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono font-medium text-teal-600 dark:text-teal-400">
                      {viewingAssignment.asset}
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {viewingAssignment.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-4 dark:border-white/5 dark:bg-zinc-900/30">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Assignee Details
                </h4>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-[12px] font-bold text-slate-600 dark:text-slate-300 font-mono">
                    {viewingAssignment.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {viewingAssignment.assignee}
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {viewingAssignment.department}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-4 dark:border-white/5 dark:bg-zinc-900/30">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Internal Notes
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  {viewingAssignment?.notes || 'No notes provided.'}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full h-11 rounded-full border-slate-200 text-slate-600 dark:border-zinc-800 dark:text-zinc-400 font-semibold"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close Details
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
