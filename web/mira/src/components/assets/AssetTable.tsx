import Link from "next/link";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { Asset } from "@/types/asset.types";

interface AssetTableProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
}

export function AssetTable({ assets, onEdit }: AssetTableProps) {
  return (
    <div className="mira-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--mira-gray-200)] bg-[var(--mira-gray-50)]">
              <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                Asset ID
              </th>
              <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                Asset Name
              </th>
              <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                Category
              </th>
              <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                Location
              </th>
              <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                Status
              </th>
              <th className="px-6 py-3 text-right font-medium text-[var(--mira-gray-600)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr
                key={asset.id}
                className="border-b border-[var(--mira-gray-100)] hover:bg-[var(--mira-gray-50)]"
              >
                <td className="px-6 py-3 font-medium text-[var(--mira-navy-light)]">
                  <Link href={`/assets/${asset.id}`} className="hover:underline">
                    {asset.id}
                  </Link>
                </td>
                <td className="px-6 py-3 text-[var(--mira-gray-700)]">
                  {asset.name}
                </td>
                <td className="px-6 py-3 text-[var(--mira-gray-600)]">
                  {asset.category}
                </td>
                <td className="px-6 py-3 text-[var(--mira-gray-600)]">
                  {asset.location}
                </td>
                <td className="px-6 py-3 text-[var(--mira-gray-600)]">
                  {asset.assignedTo}
                </td>
                <td className="px-6 py-3">
                  <StatusBadge status={asset.status} />
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/assets/${asset.id}`}
                      className="rounded p-1.5 text-[var(--mira-gray-500)] hover:bg-[var(--mira-gray-100)]"
                      title="View"
                    >
                      <Eye className="h-4 w-4" strokeWidth={1.75} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onEdit(asset)}
                      className="rounded p-1.5 text-[var(--mira-gray-500)] hover:bg-[var(--mira-gray-100)]"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    </button>
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
