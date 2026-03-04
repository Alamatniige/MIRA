"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const kpis = [
  { label: "Total Assets", value: "1,248", sub: "All registered IT hardware" },
  { label: "Active Assets", value: "1,032", sub: "Currently operational" },
  { label: "Assigned Assets", value: "874", sub: "Allocated to staff" },
  { label: "Under Maintenance", value: "46", sub: "With IT or vendor" },
  { label: "Unassigned Assets", value: "198", sub: "Available in inventory" },
];

const recentActivity = [
  {
    tag: "LPT-02318",
    name: "Lenovo ThinkPad T14",
    assignee: "Santos, Mark (IT Operations)",
    status: "Assigned",
    statusVariant: "success" as const,
    date: "2026-03-04 09:32",
  },
  {
    tag: "MON-00872",
    name: "Dell UltraSharp 27\"",
    assignee: "Unassigned",
    status: "Returned",
    statusVariant: "muted" as const,
    date: "2026-03-03 17:10",
  },
  {
    tag: "SRV-00041",
    name: "HPE ProLiant DL380",
    assignee: "Data Center Rack A-03",
    status: "Under Maintenance",
    statusVariant: "warning" as const,
    date: "2026-03-03 14:22",
  },
  {
    tag: "LPT-02197",
    name: "MacBook Pro 14\"",
    assignee: "Dela Cruz, Ana (Finance)",
    status: "Assigned",
    statusVariant: "success" as const,
    date: "2026-03-02 11:47",
  },
];

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            High-level view of IT hardware assets across the organization.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary/80" />
            <CardContent className="pt-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                {kpi.label}
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {kpi.value}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Asset Status Distribution</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500">
                Overview of hardware lifecycle states.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-6">
              <div className="relative h-40 w-40 rounded-full bg-teal-50">
                <div className="absolute inset-2 rounded-full border-4 border-primary/70" />
                <div className="absolute inset-5 rounded-full border-4 border-secondary/70 border-l-transparent border-b-transparent" />
                <div className="absolute inset-10 rounded-full bg-card" />
                <div className="absolute inset-12 flex items-center justify-center">
                  <span className="text-xs font-medium text-slate-600">
                    72% Active
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" /> Active
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-secondary" /> Assigned
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-teal-300" /> Under
                Maintenance
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300" /> Retired
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Assets per Department</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500">
                Distribution across major business units.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-1">
              {[
                { label: "IT & Infrastructure", value: 320, width: "88%" },
                { label: "Operations", value: 240, width: "74%" },
                { label: "Finance", value: 160, width: "56%" },
                { label: "HR & Admin", value: 112, width: "44%" },
                { label: "Others", value: 88, width: "36%" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>{item.label}</span>
                    <span className="font-medium text-slate-700">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Asset Assignment Trend</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500">
                Monthly assignment and return activity.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-40">
              <div className="absolute inset-0">
                <div className="flex h-full items-end justify-between gap-1">
                  {["O", "N", "D", "J", "F", "M"].map((m, idx) => (
                    <div
                      key={m}
                      className="flex flex-1 flex-col items-center justify-end gap-1"
                    >
                      <div className="relative flex h-24 w-full items-end justify-center">
                        <div className="absolute inset-x-0 bottom-0 h-px bg-slate-100" />
                        <div
                          className="w-2 rounded-full bg-gradient-to-t from-primary/70 to-secondary/80"
                          style={{ height: `${50 + idx * 8}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {m}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              Stable assignment volume with a slight uptick in Q1.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent Asset Activity</CardTitle>
            <p className="mt-0.5 text-xs text-slate-500">
              Latest movements handled by the IT department.
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Asset Tag</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Updated</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {recentActivity.map((row) => (
                <TableRow key={row.tag}>
                  <TableCell className="font-mono text-xs text-slate-800">
                    {row.tag}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-xs text-slate-700">
                    {row.assignee}
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.statusVariant}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {row.date}
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="text-[11px] font-medium text-primary hover:underline">
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

