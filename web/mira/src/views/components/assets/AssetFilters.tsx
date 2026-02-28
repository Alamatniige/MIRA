import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <div className="relative min-w-[200px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mira-gray-500)]" />
        <Input
          type="search"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 w-full rounded-xl border-[var(--mira-gray-200)] bg-[var(--mira-white)] pl-9 text-[13px] text-[var(--mira-navy-light)] placeholder:text-[var(--mira-gray-500)] focus-visible:ring-[var(--mira-teal)]"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="hidden h-4 w-4 text-[var(--mira-gray-500)] sm:block" />
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-11 w-[160px] rounded-xl border-[var(--mira-gray-200)] bg-[var(--mira-white)] text-[13px] text-[var(--mira-navy-light)]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--mira-white)] border-[var(--mira-gray-200)]">
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="issue">Issue</SelectItem>
            <SelectItem value="disposed">Disposed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deptFilter} onValueChange={onDeptFilterChange}>
          <SelectTrigger className="h-11 w-[160px] rounded-xl border-[var(--mira-gray-200)] bg-[var(--mira-white)] text-[13px] text-[var(--mira-navy-light)]">
            <SelectValue placeholder="All departments" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--mira-white)] border-[var(--mira-gray-200)]">
            <SelectItem value="all">All departments</SelectItem>
            <SelectItem value="it">IT</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
            <SelectItem value="ops">Operations</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
