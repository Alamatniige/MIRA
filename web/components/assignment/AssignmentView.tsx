"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const history = [
  {
    asset: "LPT-02318 · Lenovo ThinkPad T14",
    assignee: "Santos, Mark",
    department: "IT Operations",
    date: "2026-03-04 09:32",
    status: "Active",
    statusVariant: "success" as const,
  },
  {
    asset: "LPT-02197 · MacBook Pro 14\"",
    assignee: "Dela Cruz, Ana",
    department: "Finance",
    date: "2026-03-02 11:47",
    status: "Active",
    statusVariant: "success" as const,
  },
  {
    asset: "MON-00872 · Dell UltraSharp 27\"",
    assignee: "Unassigned",
    department: "Inventory",
    date: "2026-03-03 17:10",
    status: "Returned",
    statusVariant: "muted" as const,
  },
];

export function AssignmentView() {
  const [viewTimeline, setViewTimeline] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Asset Assignment
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Assign and reassign IT hardware assets to staff or departments.
          </p>
        </div>
        <Button
          size="lg"
          className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 text-xs font-semibold shadow-sm"
        >
          Assign Asset
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>New Assignment</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500">
                Capture a new asset assignment or reassignment.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Select Asset
                </label>
                <select className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[11px] text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20">
                  <option>Search or select asset</option>
                  <option>LPT-02318 · Lenovo ThinkPad T14</option>
                  <option>LPT-02197 · MacBook Pro 14&quot;</option>
                  <option>MON-00872 · Dell UltraSharp 27&quot;</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-700">
                    Assign To (Staff)
                  </label>
                  <Input
                    placeholder="Full name of staff"
                    className="h-8 text-[11px]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-700">
                    Department / Unit
                  </label>
                  <Input
                    placeholder="e.g. Finance, Operations, IT"
                    className="h-8 text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-700">
                    Assignment Date
                  </label>
                  <Input
                    type="date"
                    className="h-8 text-[11px]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-700">
                    Status
                  </label>
                  <select className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <option>Assigned</option>
                    <option>Returned</option>
                    <option>Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  className="min-h-[64px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Purpose, project, or any special conditions for this assignment."
                />
              </div>

              <div className="mt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-slate-200 px-3 text-[11px]"
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 rounded-full bg-gradient-to-r from-primary to-secondary px-4 text-[11px] font-semibold"
                >
                  Confirm Assignment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle>Assignment History</CardTitle>
                <p className="mt-0.5 text-xs text-slate-500">
                  Track historical movements of key assets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewTimeline((v) => !v)}
                className="text-[11px] font-medium text-primary hover:underline"
              >
                {viewTimeline ? "View as table" : "View as timeline"}
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0 pt-0">
            {viewTimeline ? (
              <div className="space-y-4 px-5 py-4">
                {history.map((item, index) => (
                  <div
                    key={item.asset}
                    className="relative flex gap-3"
                  >
                    <div className="flex flex-col items-center">
                      <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-primary" />
                      {index < history.length - 1 && (
                        <span className="mt-1 h-10 w-px bg-slate-200" />
                      )}
                    </div>
                    <div className="flex-1 rounded-lg bg-slate-50/60 px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-900">
                          {item.asset}
                        </p>
                        <Badge variant={item.statusVariant}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600">
                        Assigned to{" "}
                        <span className="font-medium">{item.assignee}</span> ·{" "}
                        {item.department}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <tr>
                    <TableHead>Asset</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date Assigned</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.asset}>
                      <TableCell>{item.asset}</TableCell>
                      <TableCell>{item.assignee}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {item.date}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.statusVariant}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <button className="text-[11px] font-medium text-primary hover:underline">
                          View trail
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

