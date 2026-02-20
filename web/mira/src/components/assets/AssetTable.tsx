import { Pencil, Eye, Trash2, Package } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/types/asset.types";

interface AssetTableProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onViewDetails?: (asset: Asset) => void;
}

export function AssetTable({ assets, onEdit, onViewDetails }: AssetTableProps) {
  if (assets.length === 0) {
    return (
      <div className="mira-card overflow-hidden">
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--mira-gray-100)]">
            <Package className="h-8 w-8 text-[var(--mira-gray-500)]" />
          </div>
          <h3 className="mt-4 text-[15px] font-semibold text-[var(--mira-navy-light)]">
            No assets found
          </h3>
          <p className="mt-2 text-center text-[13px] text-[var(--mira-gray-500)]">
            Try adjusting your filters or add a new asset to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mira-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--mira-gray-100)] bg-[var(--mira-gray-50)]">
              <th className="px-6 py-4 text-left text-[13px] font-semibold text-[var(--mira-navy-light)]">
                Asset ID
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-semibold text-[var(--mira-navy-light)]">
                Asset Name
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-semibold text-[var(--mira-navy-light)]">
                Category
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-semibold text-[var(--mira-navy-light)]">
                Location
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-semibold text-[var(--mira-navy-light)]">
                Assigned To
              </th>
              <th className="px-6 py-4 text-left text-[13px] font-semibold text-[var(--mira-navy-light)]">
                Status
              </th>
              <th className="px-6 py-4 text-right text-[13px] font-semibold text-[var(--mira-navy-light)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr
                key={asset.id}
                className={`border-b border-[var(--mira-gray-100)] transition-colors hover:bg-[var(--mira-gray-50)]/80 ${
                  index === assets.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-6 py-4">
                  {onViewDetails ? (
                    <button
                      type="button"
                      onClick={() => onViewDetails(asset)}
                      className="font-semibold text-[var(--mira-teal)] transition-colors hover:underline"
                    >
                      {asset.id}
                    </button>
                  ) : (
                    <span className="font-semibold text-[var(--mira-navy-light)]">
                      {asset.id}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-[14px] font-medium text-[var(--mira-navy-light)]">
                  {asset.name}
                </td>
                <td className="px-6 py-4 text-[13px] text-[var(--mira-gray-600)]">
                  {asset.category}
                </td>
                <td className="px-6 py-4 text-[13px] text-[var(--mira-gray-600)]">
                  {asset.location}
                </td>
                <td className="px-6 py-4 text-[13px] text-[var(--mira-gray-600)]">
                  {asset.assignedTo}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={asset.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {onViewDetails && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(asset)}
                      className="h-8 w-8 text-[var(--mira-gray-600)] hover:bg-[var(--mira-gray-100)] hover:text-[var(--mira-navy-light)]"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(asset)}
                      className="h-8 w-8 text-[var(--mira-gray-600)] hover:bg-[var(--mira-gray-100)] hover:text-[var(--mira-navy-light)]"
                      title="Edit asset"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[var(--mira-gray-600)] hover:bg-red-50 hover:text-red-600"
                      title="Delete asset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
