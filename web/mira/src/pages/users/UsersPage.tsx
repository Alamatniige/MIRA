"use client";

import { useState } from "react";
import { Search, Plus, Mail, MoreVertical } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

const mockUsers = [
  { id: "1", name: "Maria Santos", email: "maria.santos@company.com", role: "Admin", department: "IT", status: "active" as const },
  { id: "2", name: "John Doe", email: "john.doe@company.com", role: "Manager", department: "Operations", status: "active" as const },
  { id: "3", name: "Jane Smith", email: "jane.smith@company.com", role: "Staff", department: "HR", status: "active" as const },
  { id: "4", name: "Carlos Reyes", email: "carlos.reyes@company.com", role: "Staff", department: "IT", status: "inactive" as const },
  { id: "5", name: "Ana Cruz", email: "ana.cruz@company.com", role: "Viewer", department: "Finance", status: "active" as const },
];

const roleColors: Record<string, string> = {
  Admin: "bg-[var(--mira-navy)] text-white",
  Manager: "bg-[var(--mira-teal)] text-white",
  Staff: "bg-[var(--mira-teal-muted)] text-[var(--mira-teal)]",
  Viewer: "bg-[var(--mira-gray-100)] text-[var(--mira-gray-700)]",
};

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchDept = deptFilter === "all" || u.department === deptFilter;
    return matchSearch && matchRole && matchDept;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--mira-navy-light)]">
            User Management
          </h1>
          <p className="mt-1 text-sm text-[var(--mira-gray-500)]">
            Manage users, roles, and access
          </p>
        </div>
        <button type="button" className="mira-btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add User
        </button>
      </div>

      <div className="mira-card flex flex-wrap items-center gap-4 p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mira-gray-400)]" />
          <input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-[var(--mira-gray-200)] bg-white pl-9 pr-4 text-sm focus:border-[var(--mira-teal)] focus:outline-none focus:ring-2 focus:ring-[var(--mira-teal)]/20"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 rounded-lg border border-[var(--mira-gray-200)] bg-white px-3 text-sm text-[var(--mira-gray-600)]"
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
          className="h-10 rounded-lg border border-[var(--mira-gray-200)] bg-white px-3 text-sm text-[var(--mira-gray-600)]"
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
              <tr className="border-b border-[var(--mira-gray-200)] bg-[var(--mira-gray-50)]">
                <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                  User
                </th>
                <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                  Role
                </th>
                <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                  Department
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
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[var(--mira-gray-100)] hover:bg-[var(--mira-gray-50)]"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--mira-teal-muted)] text-sm font-medium text-[var(--mira-teal)]">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-[var(--mira-navy-light)]">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-[var(--mira-gray-600)]">
                    {user.email}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-0.5 text-xs font-medium ${roleColors[user.role] ?? ""}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[var(--mira-gray-600)]">
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
                      className="rounded p-1.5 text-[var(--mira-gray-500)] hover:bg-[var(--mira-gray-100)]"
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
            <Mail className="h-10 w-10 text-[var(--mira-gray-300)]" strokeWidth={1.25} />
            <p className="text-sm text-[var(--mira-gray-500)]">No users match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
