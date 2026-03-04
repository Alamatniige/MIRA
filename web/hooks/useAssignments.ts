import type { Assignment } from "@/types/mira";

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "asgmt-1",
    assetId: "asset-lpt-02318",
    assetTag: "LPT-02318",
    assetName: "Lenovo ThinkPad T14",
    assignee: "Santos, Mark",
    department: "IT",
    status: "ASSIGNED",
    notes: "Primary workstation for IT Operations.",
    assignedAt: "2026-03-04T09:32:00Z",
  },
  {
    id: "asgmt-2",
    assetId: "asset-lpt-02197",
    assetTag: "LPT-02197",
    assetName: 'MacBook Pro 14"',
    assignee: "Dela Cruz, Ana",
    department: "FINANCE",
    status: "ASSIGNED",
    notes: "Finance lead; requires mobility.",
    assignedAt: "2026-03-02T11:47:00Z",
  },
  {
    id: "asgmt-3",
    assetId: "asset-mon-00872",
    assetTag: "MON-00872",
    assetName: 'Dell UltraSharp 27"',
    assignee: "Unassigned",
    department: "OTHER",
    status: "RETURNED",
    notes: "Returned to central inventory.",
    assignedAt: "2025-12-15T09:00:00Z",
    returnedAt: "2026-03-03T17:10:00Z",
  },
];

export function useAssignments() {
  const assignments = MOCK_ASSIGNMENTS;

  return {
    assignments,
    activeAssignments: assignments.filter((a) => a.status === "ASSIGNED"),
    returnedAssignments: assignments.filter((a) => a.status === "RETURNED"),
  };
}

