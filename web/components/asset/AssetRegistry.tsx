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
import { Modal } from "@/components/ui/modal";

const assets = [
  {
    tag: "LPT-02318",
    name: "Lenovo ThinkPad T14",
    category: "Laptop",
    specs: "i7 · 16 GB · 512 GB SSD",
    location: "HQ – 8F IT",
    status: "Assigned",
    statusVariant: "success" as const,
    assignedTo: "Santos, Mark",
  },
  {
    tag: "MON-00872",
    name: "Dell UltraSharp 27\"",
    category: "Monitor",
    specs: "QHD · USB-C",
    location: "HQ – 7F Finance",
    status: "Available",
    statusVariant: "muted" as const,
    assignedTo: "Unassigned",
  },
  {
    tag: "SRV-00041",
    name: "HPE ProLiant DL380",
    category: "Server",
    specs: "2× Xeon · 128 GB RAM",
    location: "Data Center A",
    status: "Under Maintenance",
    statusVariant: "warning" as const,
    assignedTo: "Data Center Rack A-03",
  },
];

export function AssetRegistry() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Asset Registry
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Centralized view of all IT hardware assets managed by the IT
            department.
          </p>
        </div>
        <Button
          size="lg"
          className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 text-xs font-semibold shadow-sm"
          onClick={() => setOpen(true)}
        >
          + Add Asset
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Asset Inventory</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Search asset tag, name, or location"
                className="h-8 w-64 text-[11px]"
              />
              <select className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option>Status: All</option>
                <option>Active</option>
                <option>Available</option>
                <option>Under Maintenance</option>
                <option>Retired</option>
              </select>
              <select className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option>Department: All</option>
                <option>IT</option>
                <option>Operations</option>
                <option>Finance</option>
                <option>HR</option>
              </select>
              <select className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option>Location: All</option>
                <option>HQ</option>
                <option>Data Center</option>
                <option>Branches</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Asset Tag</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Specifications</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>QR Code</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.tag}>
                  <TableCell className="font-mono text-xs text-slate-800">
                    {asset.tag}
                  </TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {asset.specs}
                  </TableCell>
                  <TableCell className="text-xs text-slate-700">
                    {asset.location}
                  </TableCell>
                  <TableCell>
                    <Badge variant={asset.statusVariant}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-700">
                    {asset.assignedTo}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-dashed border-slate-300 text-[10px] text-slate-500">
                      QR
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2 text-[11px] font-medium">
                      <button className="text-primary hover:underline">
                        View
                      </button>
                      <button className="text-slate-600 hover:underline">
                        Edit
                      </button>
                      <button className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Asset"
        description="Register a new IT hardware asset into the MIRA registry."
      >
        <form className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">
                Asset Tag
              </label>
              <Input
                placeholder="e.g. LPT-02319"
                className="h-8 text-[11px]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">
                Asset Name
              </label>
              <Input
                placeholder="e.g. Lenovo ThinkPad T14 Gen 3"
                className="h-8 text-[11px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">
                Category
              </label>
              <select className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option>Select category</option>
                <option>Laptop</option>
                <option>Desktop</option>
                <option>Monitor</option>
                <option>Server</option>
                <option>Network</option>
                <option>Peripheral</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">
                Status
              </label>
              <select className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option>Active</option>
                <option>Available</option>
                <option>Under Maintenance</option>
                <option>Retired</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">
                Location
              </label>
              <Input
                placeholder="e.g. HQ – 8F IT"
                className="h-8 text-[11px]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">
                Specifications (optional)
              </label>
              <Input
                placeholder="CPU, RAM, storage, special notes"
                className="h-8 text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-700">
              Notes
            </label>
            <textarea
              className="min-h-[64px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Any additional information relevant to IT or audit."
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-full border-slate-200 px-3 text-[11px]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 rounded-full bg-gradient-to-r from-primary to-secondary px-4 text-[11px] font-semibold"
            >
              Save Asset
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

