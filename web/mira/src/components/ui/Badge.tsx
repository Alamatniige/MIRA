type Status = "active" | "maintenance" | "issue" | "disposed";

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  maintenance: {
    label: "Maintenance",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  issue: {
    label: "Issue",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  disposed: {
    label: "Disposed",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export function StatusBadge({
  status,
  label,
}: {
  status: Status;
  label?: string;
}) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {label ?? config.label}
    </span>
  );
}
