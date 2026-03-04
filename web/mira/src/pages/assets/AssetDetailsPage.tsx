"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import type { AssetStatus } from "@/types/asset.types";

const mockAsset = {
  id: "AST-1042",
  name: "Dell Latitude 5520",
  category: "Laptop",
  location: "Building A - Floor 2",
  assignedTo: "John Doe",
  status: "active" as AssetStatus,
  serialNumber: "DL5520-2024-001",
  purchaseDate: "2024-01-15",
  warranty: "2 years",
};

export function AssetDetailsPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const assetId = id ?? mockAsset.id;

  return (
    <div className="space-y-6">
      <Link
        href="/assets"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--mira-gray-600)] hover:text-[var(--mira-teal)]"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        Back to assets
      </Link>

      <div className="mira-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[var(--mira-navy-light)]">
              {mockAsset.name}
            </h1>
            <p className="mt-1 text-sm text-[var(--mira-gray-500)]">
              {assetId} · {mockAsset.category}
            </p>
          </div>
          <StatusBadge status={mockAsset.status} />
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-[var(--mira-gray-500)]">
              Serial Number
            </dt>
            <dd className="mt-1 text-[var(--mira-gray-700)]">
              {mockAsset.serialNumber}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--mira-gray-500)]">
              Location
            </dt>
            <dd className="mt-1 text-[var(--mira-gray-700)]">
              {mockAsset.location}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--mira-gray-500)]">
              Assigned To
            </dt>
            <dd className="mt-1 text-[var(--mira-gray-700)]">
              {mockAsset.assignedTo}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--mira-gray-500)]">
              Purchase Date
            </dt>
            <dd className="mt-1 text-[var(--mira-gray-700)]">
              {mockAsset.purchaseDate}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--mira-gray-500)]">
              Warranty
            </dt>
            <dd className="mt-1 text-[var(--mira-gray-700)]">
              {mockAsset.warranty}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
