import Link from "next/link";
import { AlertCircle, Package } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

const myAssets = [
  {
    id: "AST-1042",
    name: "Dell Latitude 5520",
    category: "Laptop",
    status: "active" as const,
    assignedDate: "Feb 17, 2025",
  },
  {
    id: "AST-1009",
    name: "Logitech MX Keys",
    category: "Peripheral",
    status: "active" as const,
    assignedDate: "Feb 14, 2025",
  },
];

export function MyAssetsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-[var(--mira-navy-light)]">
          My Assigned Assets
        </h1>
        <p className="mt-1 text-sm text-[var(--mira-gray-500)]">
          View your assigned equipment and report issues
        </p>
      </div>

      <div className="flex justify-end">
        <Link
          href="/staff/report"
          className="mira-btn-primary inline-flex items-center gap-2"
        >
          <AlertCircle className="h-4 w-4" strokeWidth={2} />
          Report Issue
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {myAssets.map((asset) => (
          <div
            key={asset.id}
            className="mira-card flex flex-col gap-4 p-6 transition-shadow hover:shadow-[var(--shadow-md)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--mira-teal-muted)]">
                <Package className="h-6 w-6 text-[var(--mira-teal)]" strokeWidth={1.75} />
              </div>
              <StatusBadge status={asset.status} />
            </div>
            <div>
              <p className="font-semibold text-[var(--mira-navy-light)]">
                {asset.name}
              </p>
              <p className="text-sm text-[var(--mira-gray-500)]">
                {asset.category} · {asset.id}
              </p>
            </div>
            <p className="text-xs text-[var(--mira-gray-500)]">
              Assigned on {asset.assignedDate}
            </p>
            <button
              type="button"
              className="mira-btn-secondary mt-auto w-full text-sm"
            >
              View details
            </button>
          </div>
        ))}
      </div>

      {myAssets.length === 0 && (
        <div className="mira-card flex flex-col items-center justify-center gap-3 py-16">
          <Package className="h-12 w-12 text-[var(--mira-gray-300)]" strokeWidth={1.25} />
          <p className="text-sm text-[var(--mira-gray-500)]">
            No assets assigned to you
          </p>
        </div>
      )}
    </div>
  );
}
