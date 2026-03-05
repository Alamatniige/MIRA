"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

/* ─────────────────────────────── mock data ─────────────────────────────── */

type Asset = {
  tag: string;
  name: string;
  brand: string;
  category: string;

  location: string;
  status: "Assigned" | "Available" | "Under Maintenance" | "Retired";
  statusVariant: "success" | "muted" | "warning" | "danger";
  assignedTo: { name: string; initials: string } | null;

};

const assets: Asset[] = [
  {
    tag: "LPT-02318",
    name: "ThinkPad T14 Gen 4",
    brand: "Lenovo",
    category: "Laptop",
    location: "HQ – 8F IT",
    status: "Assigned",
    statusVariant: "success",
    assignedTo: { name: "Santos, Mark", initials: "MS" },
  },
  {
    tag: "MON-00872",
    name: 'UltraSharp U2722D 27"',
    brand: "Dell",
    category: "Monitor",
    location: "HQ – 7F Finance",
    status: "Available",
    statusVariant: "muted",
    assignedTo: null,
  },
  {
    tag: "SRV-00041",
    name: "ProLiant DL380 Gen10",
    brand: "HPE",
    category: "Server",
    location: "Data Center A",
    status: "Under Maintenance",
    statusVariant: "warning",
    assignedTo: { name: "DC Rack A-03", initials: "DC" },
  },
  {
    tag: "LPT-02101",
    name: 'MacBook Pro 14"',
    brand: "Apple",
    category: "Laptop",
    location: "HQ – 5F Design",
    status: "Assigned",
    statusVariant: "success",
    assignedTo: { name: "Reyes, Ana", initials: "AR" },
  },
  {
    tag: "NET-00310",
    name: "Catalyst 2960X-48FPD",
    brand: "Cisco",
    category: "Network",
    location: "Server Room B",
    status: "Available",
    statusVariant: "muted",
    assignedTo: null,
  },
  {
    tag: "PER-00554",
    name: "MX Keys S",
    brand: "Logitech",
    category: "Peripheral",
    location: "HQ – 3F Operations",
    status: "Assigned",
    statusVariant: "success",
    assignedTo: { name: "Cruz, Lena", initials: "LC" },
  },
  {
    tag: "DSK-00193",
    name: "OptiPlex 7010 Tower",
    brand: "Dell",
    category: "Desktop",
    location: "HQ – 6F HR",
    status: "Assigned",
    statusVariant: "success",
    assignedTo: { name: "Garcia, Ben", initials: "BG" },
  },
  {
    tag: "SRV-00058",
    name: "PowerEdge R750",
    brand: "Dell",
    category: "Server",
    location: "Data Center B",
    status: "Available",
    statusVariant: "muted",
    assignedTo: null,
  },
  {
    tag: "LPT-01984",
    name: "EliteBook 840 G10",
    brand: "HP",
    category: "Laptop",
    location: "HQ – 4F Finance",
    status: "Under Maintenance",
    statusVariant: "warning",
    assignedTo: { name: "Tan, Joyce", initials: "JT" },
  },
  {
    tag: "MON-00921",
    name: "27GN950-B UltraGear 4K",
    brand: "LG",
    category: "Monitor",
    location: "HQ – 5F Design",
    status: "Retired",
    statusVariant: "danger",
    assignedTo: null,
  },
];

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
    color: "from-teal-500/10 to-teal-600/10 text-teal-700 border-teal-200/60",
    valueColor: "text-teal-800",
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
    color: "from-blue-500/10 to-blue-600/10 text-blue-700 border-blue-200/60",
    valueColor: "text-blue-800",
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
    color: "from-emerald-500/10 to-emerald-600/10 text-emerald-700 border-emerald-200/60",
    valueColor: "text-emerald-800",
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
    color: "from-amber-500/10 to-amber-600/10 text-amber-700 border-amber-200/60",
    valueColor: "text-amber-800",
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
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-orange-100 text-orange-700",
  "bg-emerald-100 text-emerald-700",
];
function getAvatarColor(initials: string) {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % avatarColors.length;
  return avatarColors[idx];
}

/* ─────────────────────────────── component ─────────────────────────────── */

export function AssetRegistry() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filtered = assets.filter(
    (a) =>
      a.tag.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase())
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
          className="h-9 rounded-full bg-gradient-to-r from-primary to-secondary px-5 text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
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
            className={`flex flex-col gap-2 rounded-xl border bg-gradient-to-br p-4 transition-shadow hover:shadow-md ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium opacity-80">{card.label}</span>
              <span className="opacity-60">{card.icon}</span>
            </div>
            <p className={`text-2xl font-bold tracking-tight ${card.valueColor}`}>
              {card.value}
            </p>
            <p className="text-[10px] font-medium opacity-60">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main table card ── */}
      <Card className="overflow-hidden shadow-sm">
        {/* Filter bar */}
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-card pb-3 pt-4">
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
                  options: ["All", "Assigned", "Available", "Under Maintenance", "Retired"],
                },
                {
                  label: "Category",
                  options: ["All", "Laptop", "Desktop", "Monitor", "Server", "Network", "Peripheral"],
                },
                {
                  label: "Location",
                  options: ["All", "HQ", "Data Center", "Branches"],
                },
              ].map((f) => (
                <select
                  key={f.label}
                  className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 text-[11px] text-slate-700 dark:text-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">{f.label}: All</option>
                  {f.options.slice(1).map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ))}

              {/* Export button */}
              <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
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
              <tr className="bg-slate-50/80 dark:bg-slate-800/30">
                {[
                  { label: "Asset Tag", cls: "pl-5" },
                  { label: "Asset", cls: "pl-4" },
                  { label: "Category", cls: "pl-4" },
                  { label: "Location", cls: "pl-4" },
                  { label: "Actions", cls: "pl-4 pr-4 text-left" },
                ].map(({ label, cls }) => (
                  <TableHead
                    key={label}
                    className={`py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ${cls ?? ""}`}
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
                  const cat = categoryMeta[asset.category];
                  return (
                    <TableRow
                      key={asset.tag}
                      className="group border-b border-slate-100 dark:border-slate-800/60 transition-colors hover:bg-primary/[0.03] dark:hover:bg-primary/[0.06] align-middle"
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
                            {asset.name}
                          </p>
                          <p className="mt-0.5 text-[10.5px] text-slate-400 dark:text-slate-500">
                            {asset.brand}
                          </p>
                        </div>
                      </TableCell>

                      {/* Category chip */}
                      <TableCell className="pl-4 py-3 whitespace-nowrap">
                        {cat ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${cat.bg} ${cat.text}`}>
                            {cat.icon}
                            {asset.category}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">{asset.category}</span>
                        )}
                      </TableCell>


                      {/* Location */}
                      <TableCell className="pl-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3 w-3 text-slate-400 shrink-0">
                            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {asset.location}
                        </span>
                      </TableCell>



                      {/* Actions */}
                      <TableCell className="pl-4 py-3 pr-4">
                        <div className="flex justify-start items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* View */}
                          <button
                            title="View"
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
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-card px-5 py-3">
            <p className="text-[11px] text-slate-400">
              Showing{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">{filtered.length}</span> of{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">{assets.length}</span> assets
            </p>
            <div className="flex items-center gap-1">
              <button className="h-7 rounded-md border border-slate-200 dark:border-slate-700 px-2.5 text-[11px] text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                ← Prev
              </button>
              <button className="h-7 rounded-md border border-primary bg-primary/5 px-2.5 text-[11px] font-medium text-primary">
                1
              </button>
              <button className="h-7 rounded-md border border-slate-200 dark:border-slate-700 px-2.5 text-[11px] text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Next →
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Add Asset Modal ── */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Asset"
        description="Register a new IT hardware asset into the MIRA registry."
      >
        <form className="space-y-4 text-xs">
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
                <select className="h-8 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-[11px] text-slate-700 dark:text-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
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



          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Notes
              <span className="ml-1 font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              className="min-h-[64px] w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[11px] text-slate-800 dark:text-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Any additional information relevant to IT or audit."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
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
              type="submit"
              size="sm"
              className="h-8 rounded-full bg-gradient-to-r from-primary to-secondary px-5 text-[11px] font-semibold shadow-sm hover:opacity-90 transition-opacity"
            >
              Save Asset
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
