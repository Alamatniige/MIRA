"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAssets } from "@/hooks/useAssets";
import { Asset } from "@/types/mira"

import { FullPageLoader } from "@/components/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { QRCodeSVG } from "qrcode.react";

/* ──────────────────────────────── helpers ──────────────────────────────── */

const statCards = [
  {
    label: "Total Assets",
    value: "1,284",
    sub: "+12 this month",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
    color: "from-teal-500/10 to-teal-600/10 text-teal-700 border-teal-200/60 dark:from-teal-500/15 dark:to-teal-400/5 dark:text-teal-300 dark:border-teal-400/20",
    valueColor: "text-teal-800 dark:text-teal-200",
  },
  {
    label: "Assigned",
    value: "896",
    sub: "69.8% utilization",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
    color: "from-blue-500/10 to-blue-600/10 text-blue-700 border-blue-200/60 dark:from-sky-500/15 dark:to-sky-400/5 dark:text-sky-300 dark:border-sky-400/20",
    valueColor: "text-blue-800 dark:text-sky-200",
  },
  {
    label: "Available",
    value: "321",
    sub: "Ready to deploy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    color: "from-emerald-500/10 to-emerald-600/10 text-emerald-700 border-emerald-200/60 dark:from-emerald-500/15 dark:to-emerald-400/5 dark:text-emerald-300 dark:border-emerald-400/20",
    valueColor: "text-emerald-800 dark:text-emerald-200",
  },
  {
    label: "Under Maintenance",
    value: "67",
    sub: "Needs attention",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    color: "from-amber-500/10 to-amber-600/10 text-amber-700 border-amber-200/60 dark:from-amber-500/15 dark:to-amber-400/5 dark:text-amber-300 dark:border-amber-400/20",
    valueColor: "text-amber-800 dark:text-amber-200",
  },
];

type CategoryMeta = { icon: ReactNode; bg: string; text: string };
const categoryMeta: Record<string, CategoryMeta> = {
  Laptop: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M0 21h24" />
      </svg>
    ),
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-300",
  },
  Monitor: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <polyline points="8 21 12 17 16 21" />
      </svg>
    ),
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-700 dark:text-sky-300",
  },
  Server: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="6" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-300",
  },
  Network: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="9" y="2" width="6" height="4" rx="1" />
        <rect x="16" y="10" width="6" height="4" rx="1" />
        <rect x="2" y="10" width="6" height="4" rx="1" />
        <rect x="9" y="18" width="6" height="4" rx="1" />
        <path d="M12 6v4M5 12h4M15 12h4M12 14v4" />
      </svg>
    ),
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-700 dark:text-teal-300",
  },
  Desktop: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
  },
  Peripheral: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="3" y="8" width="18" height="12" rx="2" />
        <path d="M12 8V4M8 4h8" />
        <circle cx="12" cy="14" r="2" />
      </svg>
    ),
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-300",
  },
};

const statusDot: Record<string, string> = {
  Assigned: "bg-emerald-500",
  Available: "bg-slate-400",
  "Under Maintenance": "bg-amber-400",
  Retired: "bg-red-400",
};

const avatarColors = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
];

function getAvatarColor(initials: string) {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % avatarColors.length;
  return avatarColors[idx];
}

/* ─────────────────────────────── component ─────────────────────────────── */

export function AssetRegistry() {
  const [open, setOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedQrAsset, setSelectedQrAsset] = useState<Asset | null>(null); // Default to first asset for demo
  const [selectedViewAsset, setSelectedViewAsset] = useState<Asset | null>(null);
  const [selectedEditAsset, setSelectedEditAsset] = useState<Asset | null>(null);
  const [selectedDeleteAsset, setSelectedDeleteAsset] = useState<Asset | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const { assets, filterOptions, error, refresh } = useAssets();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filtered = assets.filter(
    (a) =>
      a.assetName?.toLowerCase().includes(search.toLowerCase()) ||
      a.roomRel?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.floorRel?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <FullPageLoader label="Loading asset registry..." />;
  }

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Asset Registry
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Centralized view of all IT hardware assets managed by the department.
          </p>
        </div>
        <Button
          size="sm"
          className="h-9 rounded-full bg-gradient-to-r from-[#0F766E] to-[#0E7490] px-5 text-xs font-semibold shadow-sm hover:shadow-lg transition-all active:scale-95"
          onClick={() => setOpen(true)}
        >
          <span className="mr-1.5 text-sm leading-none">+</span>
          Add Asset
        </Button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`flex flex-col gap-2 rounded-xl border bg-gradient-to-br p-4 transition-all hover:shadow-md dark:hover:shadow-teal-900/30 dark:bg-[#09090b] ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold opacity-75 dark:opacity-90">{card.label}</span>
              <span className="opacity-60 dark:opacity-80">{card.icon}</span>
            </div>
            <p className={`text-2xl font-bold tracking-tight ${card.valueColor}`}>
              {card.value}
            </p>
            <p className="text-[10px] font-medium opacity-55 dark:opacity-70">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main table card ── */}
      <Card className="overflow-hidden shadow-sm">
        {/* Filter bar */}
        <CardHeader className="border-b border-slate-100 dark:border-teal-800/25 bg-white dark:bg-[#09090b] pb-3 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold">Asset Inventory</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <Input
                  placeholder="Search assets…"
                  className="h-8 w-52 pl-8 text-[11px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Filters */}
              {[
                {
                  label: "Status",
                  options: ["All", ...filterOptions.statuses],
                },
                {
                  label: "Category",
                  options: ["All", ...filterOptions.categories],
                },
                {
                  label: "Room",
                  options: ["All", ...filterOptions.rooms],
                },
                {
                  label: "Floor",
                  options: ["All", ...filterOptions.floors],
                },
              ].map((f) => (
                <select
                  key={f.label}
                  className="h-8 rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-2.5 text-[11px] text-slate-700 dark:text-slate-300 focus:border-primary dark:focus:border-teal-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-teal-500/20 outline-none transition-colors"
                >
                  <option value="">{f.label}: All</option>
                  {f.options.slice(1).map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ))}

              {/* Export button */}
              <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-3 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-teal-900/20 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table className="table-fixed w-full">
            <colgroup>
              <col style={{ width: "14%" }} />{/* Asset Tag */}
              <col style={{ width: "30%" }} />{/* Asset */}
              <col style={{ width: "18%" }} />{/* Category */}
              <col style={{ width: "24%" }} />{/* Location */}
              <col style={{ width: "14%" }} />{/* Actions */}
            </colgroup>
            <TableHeader>
              <tr className="bg-slate-50/80 dark:bg-teal-950/50">
                {[
                  { label: "Asset Tag", cls: "pl-5" },
                  { label: "Asset", cls: "pl-4" },
                  { label: "Category", cls: "pl-4" },
                  { label: "Location", cls: "pl-4" },
                  { label: "Actions", cls: "pl-4 pr-4 text-left" },
                ].map(({ label, cls }) => (
                  <TableHead
                    key={label}
                    className={`py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400 ${cls ?? ""}`}
                  >
                    {label}
                  </TableHead>
                ))}
              </tr>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 text-slate-300">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                      <p className="text-xs text-slate-400">No assets match your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((asset) => {
                  const cat = asset.assetTypeRel?.name ? categoryMeta[asset.assetTypeRel.name] : undefined;
                  return (
                    <TableRow
                      key={asset.tag}
                      className="group border-b border-slate-100 dark:border-teal-800/20 transition-colors hover:bg-primary/[0.03] dark:hover:bg-teal-900/20 align-middle"
                    >
                      {/* Asset Tag */}
                      <TableCell className="pl-5 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 tracking-wide">
                          {asset.tag}
                        </span>
                      </TableCell>

                      {/* Asset name + brand */}
                      <TableCell className="pl-4 py-3">
                        <div>
                          <p className="text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 leading-tight truncate">
                            {asset.assetName}
                          </p>
                          <p className="mt-0.5 text-[10.5px] text-slate-400 dark:text-slate-500">
                            {asset.serialNumber}
                          </p>
                        </div>
                      </TableCell>

                      {/* Category chip */}
                      <TableCell className="pl-4 py-3 whitespace-nowrap">
                        {cat ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${cat.bg} ${cat.text}`}>
                            {cat.icon}
                            {asset.assetTypeRel?.name}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">{asset.assetTypeRel?.name || "Uncategorized"}</span>
                        )}
                      </TableCell>


                      {/* Location */}
                      <TableCell className="pl-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3 w-3 text-slate-400 shrink-0">
                            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {asset.roomRel?.name} {asset.floorRel ? `– ${asset.floorRel.name}` : ""}
                        </span>
                      </TableCell>



                      {/* Actions */}
                      <TableCell className="pl-4 py-3 pr-4">
                        <div className="flex justify-start items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* View */}
                          <button
                            title="View"
                            onClick={() => {
                              setSelectedViewAsset(asset);
                              setViewOpen(true);
                            }}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-primary hover:bg-primary/10 transition-colors"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          {/* Edit */}
                          <button
                            title="Edit"
                            onClick={() => {
                              setEditModal(true);
                              setSelectedEditAsset(asset);
                            }}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          {/* Delete */}
                          <button
                            title="Delete"
                            onClick={() => {
                              setDeleteModal(true);
                              setSelectedDeleteAsset(asset);
                            }}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-colors"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination footer */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-teal-800/25 bg-white dark:bg-[#09090b] px-5 py-3">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">{filtered.length}</span> of{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">{assets.length}</span> assets
            </p>
            <div className="flex items-center gap-1">
              <button className="h-7 rounded-md border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-2.5 text-[11px] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-teal-900/20 transition-colors">
                ← Prev
              </button>
              <button className="h-7 rounded-md border border-primary bg-primary/5 dark:bg-primary/10 px-2.5 text-[11px] font-medium text-primary dark:text-teal-300">
                1
              </button>
              <button className="h-7 rounded-md border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-2.5 text-[11px] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-teal-900/20 transition-colors">
                Next →
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Generate QR Modal ── */}
      <Modal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        className={open ? "translate-x-[52%] h-[480px]" : "h-[480px]"}   // Shift to the right if the other modal is open
      >
        <div className="space-y-4 text-xs flex flex-col h-[440px] pt-4">

          {selectedQrAsset ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-teal-800/30 bg-slate-50 dark:bg-slate-900/50 p-6 text-center">
              <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-white">
                <QRCodeSVG
                  value={JSON.stringify({ tag: selectedQrAsset.id, name: selectedQrAsset.assetName, category: selectedQrAsset.assetTypeRel?.name })}
                  size={220}
                  level="H"
                />
              </div>
              <p className="mt-5 text-[15px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">{selectedQrAsset.id ? `${selectedQrAsset.id.slice(0, 8)}...` : ""}</p>
              <p className="mt-1.5 text-[12px] text-slate-500">{selectedQrAsset.assetName}</p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-teal-800/30 text-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <rect x="7" y="7" width="3" height="3" />
                <rect x="14" y="7" width="3" height="3" />
                <rect x="7" y="14" width="3" height="3" />
                <rect x="14" y="14" width="3" height="3" />
              </svg>
              <p className="text-[11px] text-slate-500">Select an asset above to view its QR code</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 mt-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-full border-slate-200 px-4 text-[11px]"
              onClick={() => setQrOpen(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!selectedQrAsset}
              className="h-8 rounded-full bg-slate-900 px-5 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              onClick={() => window.print()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mr-1.5 h-3.5 w-3.5">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print Tag
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Add Asset Modal ── */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Asset"
        description="Register a new IT hardware asset into the MIRA registry."
        overlayClassName={qrOpen ? "!bg-transparent dark:!bg-transparent !backdrop-blur-none pointer-events-none" : ""} // Remove double overlay
        className={qrOpen ? "pointer-events-auto -translate-x-[52%] h-[480px]" : "h-[480px]"} // Shift to the left if QR modal is open
      >
        <form className="space-y-4 text-xs flex flex-col h-[390px]">
          {/* Row 1: Tag + Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Asset Tag
              </label>
              <Input placeholder="e.g. LPT-02319" className="h-8 text-[11px]" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Asset Name
              </label>
              <Input placeholder="e.g. Lenovo ThinkPad T14 Gen 3" className="h-8 text-[11px]" />
            </div>
          </div>

          {/* Row 2: Category + Status */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Category",
                opts: ["Laptop", "Desktop", "Monitor", "Server", "Network", "Peripheral"],
                ph: "Select category",
              },
              {
                label: "Status",
                opts: ["Active", "Available", "Under Maintenance", "Retired"],
                ph: "Select status",
              },
            ].map((f) => (
              <div key={f.label}>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  {f.label}
                </label>
                <select className="h-8 w-full rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-2 text-[11px] text-slate-700 dark:text-slate-200 focus:border-primary dark:focus:border-teal-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-teal-500/20 outline-none transition-colors">
                  <option value="">{f.ph}</option>
                  {f.opts.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Row 3: Location */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Location
            </label>
            <Input placeholder="e.g. HQ – 8F IT" className="h-8 text-[11px]" />
          </div>



          {/* Notes removed per request */}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1 mt-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-full border-slate-200 px-4 text-[11px]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isGeneratingQr}
              onClick={() => {
                setIsGeneratingQr(true);
                // Simulate saving logic and QR generation delay
                setTimeout(() => {
                  setIsGeneratingQr(false);
                  setQrOpen(true);
                }, 1000); // 1-second loading state
              }}
              size="sm"
              className="h-8 rounded-full bg-gradient-to-r from-[#0F766E] to-[#0E7490] px-5 text-[11px] font-semibold text-white shadow-sm hover:shadow-lg transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-80 flex items-center justify-center gap-1.5"
            >
              {isGeneratingQr ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                "Save & Generate QR"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── View Asset Modal ── */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="View Asset Details"
        description="Detailed information and QR code for this asset."
        className="w-full max-w-lg"
      >
        {selectedViewAsset && (
          <div className="space-y-4 text-xs flex flex-col pt-4 pr-1 pb-1">
            <div className="flex gap-5">
              <div className="flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-teal-800/30 rounded-2xl bg-slate-50 dark:bg-slate-900/50 shrink-0">
                <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-white mb-3">
                  <QRCodeSVG
                    value={JSON.stringify({ tag: selectedViewAsset.id, name: selectedViewAsset.assetName, category: selectedViewAsset.assetTypeRel?.name })}
                    size={110}
                    level="H"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="h-8 w-full rounded-full bg-slate-900 px-4 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-95 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                  onClick={() => window.print()}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mr-1.5 h-3.5 w-3.5">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  Print QR
                </Button>
              </div>

              <div className="flex-1 space-y-4 pt-1">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Asset Tag</h4>
                  <div className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 font-mono text-[13px] font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
                    {selectedViewAsset.id}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Asset Name</h4>
                  <p className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-tight">{selectedViewAsset.assetName}</p>
                  <p className="text-[12px] text-slate-500 mt-1">{selectedViewAsset.serialNumber} &nbsp;•&nbsp; {selectedViewAsset.assetTypeRel?.name}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="p-3.5 border border-slate-100 dark:border-teal-800/25 rounded-xl bg-slate-50/50 dark:bg-[#09090b]">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status</h4>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${statusDot[selectedViewAsset.currentStatus] || 'bg-slate-400'}`}></span>
                  <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">{selectedViewAsset.currentStatus}</span>
                </div>
              </div>

              <div className="p-3.5 border border-slate-100 dark:border-teal-800/25 rounded-xl bg-slate-50/50 dark:bg-[#09090b]">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Location</h4>
                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-slate-400">
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {selectedViewAsset.roomRel?.name} {selectedViewAsset.floorRel ? `– ${selectedViewAsset.floorRel.name}` : ""}
                </div>
              </div>
            </div>

            <div className="p-3.5 border border-slate-100 dark:border-teal-800/25 rounded-xl bg-slate-50/50 dark:bg-[#09090b] flex-1">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Assignment Details</h4>
              {selectedViewAsset.assignedTo ? (
                <div className="flex items-center gap-3 mt-1">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold ${getAvatarColor(selectedViewAsset.assignedTo.slice(0, 2).toUpperCase())} shadow-sm`}>
                    {selectedViewAsset.assignedTo.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{selectedViewAsset.assignedTo}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">Current Assignee</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <p className="text-[12px] font-medium text-slate-500 italic">This asset is not currently assigned to anyone.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 mt-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-slate-200 px-5 text-[11px] font-medium"
                onClick={() => setViewOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Asset Modal ── */}
      <Modal
        open={editModal}
        onClose={() => setEditModal(false)}
        title="Edit Asset"
        description="Update asset details"
      >
        {selectedEditAsset && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="assetName" className="text-[12px] font-medium text-slate-500">Asset Name</label>
                <input
                  type="text"
                  id="assetName"
                  value={selectedEditAsset.assetName}
                  onChange={(e) => setSelectedEditAsset({ ...selectedEditAsset, assetName: e.target.value })}
                  className="border border-slate-200 dark:border-teal-800/25 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="assetType" className="text-[12px] font-medium text-slate-500">Asset Type</label>
                <input
                  type="text"
                  id="assetType"
                  value={selectedEditAsset.assetTypeRel?.name}
                  onChange={(e) => setSelectedEditAsset({ ...selectedEditAsset, assetTypeRel: { name: e.target.value } })}
                  className="border border-slate-200 dark:border-teal-800/25 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-slate-200 px-5 text-[11px] font-medium"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="h-8 rounded-full px-5 text-[11px] font-medium"
                onClick={() => {
                  // Handle edit logic here
                  setEditModal(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
