"use client";
import { useState, useEffect } from "react";
import { Calendar, User, Package, Check } from "lucide-react";
import { AssignmentTimeline } from "@/components/assignment/AssignmentTimeline";
import { PageLoading } from "@/components/ui/PageLoading";

const mockAssignments = [
  { id: "AST-1042", to: "John Doe", date: "2025-02-17", acknowledged: true },
  { id: "AST-1021", to: "Jane Smith", date: "2025-02-14", acknowledged: true },
  { id: "AST-1009", to: "Jane Smith", date: "2025-02-14", acknowledged: true },
  { id: "AST-0992", to: "Mike Johnson", date: "2025-02-10", acknowledged: true },
];

export function AssetAssignmentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoading message="Loading assignments..." />;
  }

  return (
    <div className="min-h-full space-y-10 pb-4">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* New Assignment — same card style as dashboard sections */}
        <div className="mira-card max-w-2xl p-6 lg:col-span-1">
          <h2 className="mb-1 text-[15px] font-semibold tracking-tight text-[var(--mira-navy-light)]">
            New Assignment
          </h2>
          <p className="mb-5 text-[13px] text-[var(--mira-gray-500)]">
            Assign an asset to an employee
          </p>
          <form className="space-y-5">
            <div>
              <label className="mb-2 flex items-center gap-2 text-[13px] font-medium text-[var(--mira-navy-light)]">
                <Package className="h-4 w-4 text-[var(--mira-gray-500)]" strokeWidth={1.75} />
                Select Asset
              </label>
              <select className="mira-input h-11 w-full rounded-xl border-[var(--mira-gray-200)] bg-[var(--mira-white)] text-[13px] text-[var(--mira-navy-light)]">
                <option value="">Choose an asset...</option>
                <option value="AST-1038">AST-1038 – HP EliteDisplay E243</option>
                <option value="AST-1040">AST-1040 – Dell KB522 Wired Keyboard</option>
              </select>
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-[13px] font-medium text-[var(--mira-navy-light)]">
                <User className="h-4 w-4 text-[var(--mira-gray-500)]" strokeWidth={1.75} />
                Select Employee
              </label>
              <select className="mira-input h-11 w-full rounded-xl border-[var(--mira-gray-200)] bg-[var(--mira-white)] text-[13px] text-[var(--mira-navy-light)]">
                <option value="">Choose an employee...</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
                <option value="3">Mike Johnson</option>
              </select>
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-[13px] font-medium text-[var(--mira-navy-light)]">
                <Calendar className="h-4 w-4 text-[var(--mira-gray-500)]" strokeWidth={1.75} />
                Assignment Date
              </label>
              <input
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="mira-input h-11 w-full rounded-xl border-[var(--mira-gray-200)] bg-[var(--mira-white)] text-[13px] text-[var(--mira-navy-light)]"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--mira-gray-300)] text-[var(--mira-teal)] focus:ring-[var(--mira-teal)]"
              />
              <span className="text-[13px] text-[var(--mira-gray-600)]">
                Employee has acknowledged receipt of this asset
              </span>
            </label>
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--mira-teal)] px-4 py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-[var(--mira-teal)]/90"
            >
              <Check className="h-4 w-4" strokeWidth={2} />
              Confirm Assignment
            </button>
          </form>
        </div>

        {/* Assignment History — same list style as Recent Activity */}
        <div className="mira-card overflow-hidden lg:col-span-2">
          <div className="px-6 py-5">
            <h2 className="text-[15px] font-semibold tracking-tight text-[var(--mira-navy-light)]">
              Assignment History
            </h2>
            <p className="mt-0.5 text-[13px] text-[var(--mira-gray-500)]">
              Recent asset assignments
            </p>
          </div>
          <AssignmentTimeline assignments={mockAssignments} />
        </div>
      </div>
    </div>
  );
}
