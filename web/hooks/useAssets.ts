import type { Asset } from "@/types/mira";

const MOCK_ASSETS: Asset[] = [
  {
    id: "asset-lpt-02318",
    tag: "LPT-02318",
    name: "Lenovo ThinkPad T14",
    category: "Laptop",
    specifications: "Intel i7 · 16 GB · 512 GB SSD",
    location: "HQ – 8F IT",
    status: "ACTIVE",
    assignedTo: "Santos, Mark",
    department: "IT",
    createdAt: "2025-11-01T09:15:00Z",
    updatedAt: "2026-03-04T09:32:00Z",
  },
  {
    id: "asset-mon-00872",
    tag: "MON-00872",
    name: "Dell UltraSharp 27\"",
    category: "Monitor",
    specifications: "27\" QHD · USB-C",
    location: "HQ – 7F Finance",
    status: "AVAILABLE",
    assignedTo: undefined,
    department: "FINANCE",
    createdAt: "2025-09-10T10:00:00Z",
    updatedAt: "2026-03-03T17:10:00Z",
  },
  {
    id: "asset-srv-00041",
    tag: "SRV-00041",
    name: "HPE ProLiant DL380",
    category: "Server",
    specifications: "2× Xeon · 128 GB RAM · RAID 10",
    location: "Data Center A",
    status: "UNDER_MAINTENANCE",
    assignedTo: "Data Center Rack A-03",
    department: "IT",
    createdAt: "2024-03-21T08:00:00Z",
    updatedAt: "2026-03-03T14:22:00Z",
  },
];

export function useAssets() {
  const assets = MOCK_ASSETS;

  return {
    assets,
    total: assets.length,
    active: assets.filter((a) => a.status === "ACTIVE").length,
    available: assets.filter((a) => a.status === "AVAILABLE").length,
    underMaintenance: assets.filter((a) => a.status === "UNDER_MAINTENANCE")
      .length,
  };
}

