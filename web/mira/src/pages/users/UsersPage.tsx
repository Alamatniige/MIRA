"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Mail, MoreVertical } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { UserModal } from "./UserModal";
import { PageLoading } from "@/components/ui/PageLoading";

const mockUsers = [
  { id: "1", name: "Maria Santos", email: "maria.santos@company.com", role: "Admin", department: "IT", status: "active" as const },
  { id: "2", name: "John Doe", email: "john.doe@company.com", role: "Manager", department: "Operations", status: "active" as const },
  { id: "3", name: "Jane Smith", email: "jane.smith@company.com", role: "Staff", department: "HR", status: "active" as const },
  { id: "4", name: "Carlos Reyes", email: "carlos.reyes@company.com", role: "Staff", department: "IT", status: "inactive" as const },
  { id: "5", name: "Ana Cruz", email: "ana.cruz@company.com", role: "Viewer", department: "Finance", status: "active" as const },
];

const roleColors: Record<string, string> = {
  Admin: "bg-[var(--mira-navy)] text-white dark:bg-[var(--mira-gray-200)] dark:text-[var(--foreground)]",
  Manager: "bg-[var(--mira-teal)] text-white dark:bg-[var(--mira-teal)] dark:text-[var(--mira-navy)]",
  Staff: "bg-[var(--mira-teal-muted)] text-[var(--mira-teal)] dark:bg-[var(--mira-teal-muted)] dark:text-[var(--mira-teal)]",
  Viewer: "bg-[var(--mira-gray-100)] text-[var(--mira-gray-700)] dark:bg-[var(--mira-gray-200)] dark:text-[var(--mira-gray-300)]",
};

export function UsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [addUserOpen, setAddUserOpen] = useState(false);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchDept = deptFilter === "all" || u.department === deptFilter;
    return matchSearch && matchRole && matchDept;
  });

  if (isLoading) {
    return <PageLoading message="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--mira-navy-light)] dark:text-[var(--foreground)]">
            User Management
          </h1>
          <p className="mt-1 text-sm text-[var(--mira-gray-500)] dark:text-[var(--mira-gray-400)]">
            Manage users, roles, and access
          </p>
        </div>
        <button
          type="button"
          className="mira-btn-primary inline-flex items-center gap-2"
          onClick={() => setAddUserOpen(true)}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add User
        </button>
      </div>

      <div className="mira-card flex flex-wrap items-center gap-4 p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mira-gray-400)] dark:text-[var(--mira-gray-500)]" />
          <input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-[var(--mira-gray-200)] bg-white pl-9 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--mira-gray-500)] focus:border-[var(--mira-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--mira-teal)]/20 dark:bg-[var(--mira-white)] dark:border-[var(--mira-gray-200)] dark:text-[var(--foreground)] dark:placeholder-[var(--mira-gray-500)]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 rounded-lg border border-[var(--mira-gray-200)] bg-[var(--mira-white)] px-3 text-sm text-[var(--mira-gray-600)] dark:text-[var(--mira-gray-300)]"
        >
          <option value="all">All roles</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Staff">Staff</option>
          <option value="Viewer">Viewer</option>
        </select>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="h-10 rounded-lg border border-[var(--mira-gray-200)] bg-[var(--mira-white)] px-3 text-sm text-[var(--mira-gray-600)] dark:text-[var(--mira-gray-300)]"
        >
          <option value="all">All departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Operations">Operations</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      <div className="mira-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--mira-gray-200)] bg-[var(--mira-gray-50)] dark:bg-[var(--mira-gray-100)] dark:border-[var(--mira-gray-200)]">
                <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)] dark:text-[var(--mira-gray-400)]">
                  User
                </th>
                <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)] dark:text-[var(--mira-gray-400)]">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)] dark:text-[var(--mira-gray-400)]">
                  Role
                </th>
                <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)] dark:text-[var(--mira-gray-400)]">
                  Department
                </th>
                <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)] dark:text-[var(--mira-gray-400)]">
                  Status
                </th>
                <th className="px-6 py-3 text-right font-medium text-[var(--mira-gray-600)] dark:text-[var(--mira-gray-400)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[var(--mira-gray-100)] hover:bg-[var(--mira-gray-50)] dark:border-[var(--mira-gray-200)] dark:hover:bg-[var(--mira-gray-100)]"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--mira-teal-muted)] text-sm font-medium text-[var(--mira-teal)]">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-[var(--mira-navy-light)] dark:text-[var(--foreground)]">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-[var(--mira-gray-600)] dark:text-[var(--mira-gray-400)]">
                    {user.email}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-0.5 text-xs font-medium ${roleColors[user.role] ?? ""}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[var(--mira-gray-600)] dark:text-[var(--mira-gray-400)]">
                    {user.department}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge
                      status={user.status === "active" ? "active" : "disposed"}
                      label={user.status === "active" ? "Active" : "Inactive"}
                    />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      type="button"
                      className="rounded p-1.5 text-[var(--mira-gray-500)] hover:bg-[var(--mira-gray-100)] dark:text-[var(--mira-gray-400)] dark:hover:bg-[var(--mira-gray-200)]"
                      aria-label="More options"
                    >
                      <MoreVertical className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Mail className="h-10 w-10 text-[var(--mira-gray-300)] dark:text-[var(--mira-gray-500)]" strokeWidth={1.25} />
            <p className="text-sm text-[var(--mira-gray-500)] dark:text-[var(--mira-gray-400)]">No users match your filters</p>
          </div>
        )}
      </div>

      <UserModal open={addUserOpen} onClose={() => setAddUserOpen(false)} />
    </div>
  );
}
