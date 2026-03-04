import { Search } from "lucide-react";

interface AssetFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  deptFilter: string;
  onDeptFilterChange: (value: string) => void;
}

export function AssetFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  deptFilter,
  onDeptFilterChange,
}: AssetFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mira-gray-400)]" />
        <input
          type="search"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-56 rounded-lg border border-[var(--mira-gray-200)] bg-white pl-9 pr-4 text-sm focus:border-[var(--mira-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--mira-teal)]/20"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="h-10 rounded-lg border border-[var(--mira-gray-200)] bg-white px-3 text-sm text-[var(--mira-gray-600)] focus:border-[var(--mira-teal)] focus:outline-none"
      >
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="maintenance">Maintenance</option>
        <option value="issue">Issue</option>
        <option value="disposed">Disposed</option>
      </select>
      <select
        value={deptFilter}
        onChange={(e) => onDeptFilterChange(e.target.value)}
        className="h-10 rounded-lg border border-[var(--mira-gray-200)] bg-white px-3 text-sm text-[var(--mira-gray-600)] focus:border-[var(--mira-teal)] focus:outline-none"
      >
        <option value="all">All departments</option>
        <option value="it">IT</option>
        <option value="hr">HR</option>
        <option value="ops">Operations</option>
      </select>
    </div>
  );
}
