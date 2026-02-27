

"use client";
import { Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import type { Asset } from "@/types/asset.types";

type AssetDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
};

// Extended fields for display (mock or from API later)
const getAssetDetails = (asset: Asset) => ({
  ...asset,
  serialNumber: `SN-${asset.id}-001`,
  purchaseDate: "2024-01-15",
  warranty: "2 years",
});

export function AssetDetailsModal({ open, onClose, asset }: AssetDetailsModalProps) {
  if (!asset) return null;

  const details = getAssetDetails(asset);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-[var(--mira-gray-200)] sm:max-w-[520px]">
        <DialogHeader className="space-y-3 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--mira-teal-muted)] text-[var(--mira-teal)]">
              <Package className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-[15px] font-semibold tracking-tight text-[var(--mira-navy-light)]">
                {details.name}
              </DialogTitle>
              <p className="mt-0.5 text-[13px] text-[var(--mira-gray-500)]">
                {details.id} · {details.category}
              </p>
            </div>
            <StatusBadge status={details.status} />
          </div>
        </DialogHeader>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-[13px] font-medium text-[var(--mira-gray-500)]">
              Serial Number
            </dt>
            <dd className="mt-1 text-[14px] text-[var(--mira-navy-light)]">
              {details.serialNumber}
            </dd>
          </div>
          <div>
            <dt className="text-[13px] font-medium text-[var(--mira-gray-500)]">
              Location
            </dt>
            <dd className="mt-1 text-[14px] text-[var(--mira-navy-light)]">
              {details.location}
            </dd>
          </div>
          <div>
            <dt className="text-[13px] font-medium text-[var(--mira-gray-500)]">
              Assigned To
            </dt>
            <dd className="mt-1 text-[14px] text-[var(--mira-navy-light)]">
              {details.assignedTo}
            </dd>
          </div>
          <div>
            <dt className="text-[13px] font-medium text-[var(--mira-gray-500)]">
              Purchase Date
            </dt>
            <dd className="mt-1 text-[14px] text-[var(--mira-navy-light)]">
              {details.purchaseDate}
            </dd>
          </div>
          <div>
            <dt className="text-[13px] font-medium text-[var(--mira-gray-500)]">
              Warranty
            </dt>
            <dd className="mt-1 text-[14px] text-[var(--mira-navy-light)]">
              {details.warranty}
            </dd>
          </div>
        </dl>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-[var(--mira-gray-200)] text-[var(--mira-navy-light)]"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
