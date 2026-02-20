"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { AssetModal } from "./AssetModal";
import { AssetTable } from "@/components/assets/AssetTable";
import { AssetFilters } from "@/components/assets/AssetFilters";
import type { AssetStatus } from "@/types/asset.types";

const mockAssets = [
  {
    id: "AST-1042",
    name: "Dell Latitude 5520",
    category: "Laptop",
    location: "Building A - Floor 2",
    assignedTo: "John Doe",
    status: "active" as AssetStatus,
  },
  {
    id: "AST-1038",
    name: "HP EliteDisplay E243",
    category: "Monitor",
    location: "Building A - Floor 2",
    assignedTo: "—",
    status: "maintenance" as AssetStatus,
  },
  {
    id: "AST-1021",
    name: 'MacBook Pro 14"',
    category: "Laptop",
    location: "Building B - Floor 1",
    assignedTo: "Jane Smith",
    status: "active" as AssetStatus,
  },
  {
    id: "AST-1015",
    name: "Lenovo ThinkPad X1",
    category: "Laptop",
    location: "Storage",
    assignedTo: "—",
    status: "disposed" as AssetStatus,
  },
  {
    id: "AST-1009",
    name: "Logitech MX Keys",
    category: "Peripheral",
    location: "Building A - Floor 2",
    assignedTo: "Jane Smith",
    status: "active" as AssetStatus,
  },
];

export function AssetListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<(typeof mockAssets)[0] | null>(null);

  const filtered = mockAssets.filter((a) => {
    const matchSearch =
      !search ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AssetFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          deptFilter={deptFilter}
          onDeptFilterChange={setDeptFilter}
        />
        <button
          type="button"
          onClick={() => {
            setEditingAsset(null);
            setModalOpen(true);
          }}
          className="mira-btn-primary inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Asset
        </button>
      </div>

      <AssetTable
        assets={filtered}
        onEdit={(asset) => {
          setEditingAsset(asset);
          setModalOpen(true);
        }}
      />

      <AssetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        asset={editingAsset}
      />
    </div>
  );
}
