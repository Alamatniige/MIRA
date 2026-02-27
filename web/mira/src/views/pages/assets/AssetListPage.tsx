"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { AssetModal } from "./AssetModal";
import { AssetDetailsModal } from "./AssetDetailsModal";
import { AssetTable } from "@/components/assets/AssetTable";
import { AssetFilters } from "@/components/assets/AssetFilters";
import { PageLoading } from "@/components/ui/PageLoading";
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
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<(typeof mockAssets)[0] | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<(typeof mockAssets)[0] | null>(null);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = mockAssets.filter((a) => {
    const matchSearch =
      !search ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (isLoading) {
    return <PageLoading message="Loading assets..." />;
  }

  return (
    <div className="min-h-full space-y-10 pb-4">
      {/* Filters — mira-card like dashboard sections */}
      <div className="mira-card p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-[var(--mira-navy-light)]">
              Asset Management
            </h2>
            <p className="mt-0.5 text-[13px] text-[var(--mira-gray-500)]">
              Manage and track all IT hardware assets
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingAsset(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-[var(--mira-gray-200)] bg-[var(--mira-white)] px-4 py-2.5 text-[14px] font-semibold text-[var(--mira-navy-light)] transition-all duration-200 hover:border-[var(--mira-teal)]/40 hover:bg-[var(--mira-teal-muted)]/50 hover:shadow-[var(--shadow)]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add Asset
          </button>
        </div>
        <AssetFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          deptFilter={deptFilter}
          onDeptFilterChange={setDeptFilter}
        />
      </div>

      {/* Assets Table */}
      <AssetTable
        assets={filtered}
        onEdit={(asset) => {
          setEditingAsset(asset);
          setModalOpen(true);
        }}
        onViewDetails={(asset) => {
          setViewingAsset(asset);
          setDetailsModalOpen(true);
        }}
      />

      <AssetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        asset={editingAsset}
      />

      <AssetDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setViewingAsset(null);
        }}
        asset={viewingAsset}
      />
    </div>
  );
}
