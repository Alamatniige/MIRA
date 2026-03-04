"use client";
import { useState } from "react";
import { Calendar, User, Package, Check } from "lucide-react";
import { AssignmentTimeline } from "@/components/assignment/AssignmentTimeline";

const mockAssignments = [
  { id: "AST-1042", to: "John Doe", date: "2025-02-17", acknowledged: true },
  { id: "AST-1021", to: "Jane Smith", date: "2025-02-14", acknowledged: true },
  { id: "AST-1009", to: "Jane Smith", date: "2025-02-14", acknowledged: true },
  { id: "AST-0992", to: "Mike Johnson", date: "2025-02-10", acknowledged: true },
];

export function AssetAssignmentPage() {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="space-y-8">
      <div className="mira-card max-w-2xl p-6">
        <h2 className="mb-6 text-base font-semibold text-[var(--mira-navy-light)]">
          New Assignment
        </h2>
        <form className="space-y-5">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--mira-gray-700)]">
              <Package className="h-4 w-4" strokeWidth={1.75} />
              Select Asset
            </label>
            <select className="mira-input w-full">
              <option value="">Choose an asset...</option>
              <option value="AST-1038">AST-1038 – HP EliteDisplay E243</option>
              <option value="AST-1040">AST-1040 – Dell KB522 Wired Keyboard</option>
            </select>
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--mira-gray-700)]">
              <User className="h-4 w-4" strokeWidth={1.75} />
              Select Employee
            </label>
            <select className="mira-input w-full">
              <option value="">Choose an employee...</option>
              <option value="1">John Doe</option>
              <option value="2">Jane Smith</option>
              <option value="3">Mike Johnson</option>
            </select>
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--mira-gray-700)]">
              <Calendar className="h-4 w-4" strokeWidth={1.75} />
              Assignment Date
            </label>
            <input
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="mira-input w-full"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--mira-gray-300)] text-[var(--mira-teal)] focus:ring-[var(--mira-teal)]"
            />
            <span className="text-sm text-[var(--mira-gray-700)]">
              Employee has acknowledged receipt of this asset
            </span>
          </label>
          <button
            type="submit"
            className="mira-btn-primary inline-flex items-center gap-2"
          >
            <Check className="h-4 w-4" strokeWidth={2} />
            Confirm Assignment
          </button>
        </form>
      </div>

      <div className="mira-card overflow-hidden">
        <div className="border-b border-[var(--mira-gray-200)] px-6 py-4">
          <h2 className="text-base font-semibold text-[var(--mira-navy-light)]">
            Assignment History
          </h2>
        </div>
        <div className="p-6">
          <AssignmentTimeline assignments={mockAssignments} />
        </div>
      </div>
    </div>
  );
}
