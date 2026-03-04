import type {
  DepartmentDistribution,
  MovementPoint,
  UtilizationSummary,
} from "@/types/mira";

const UTILIZATION_SUMMARY: UtilizationSummary = {
  utilizationRate: 0.84,
  activeAssetCount: 1032,
  totalAssetCount: 1248,
};

const DEPARTMENT_DISTRIBUTION: DepartmentDistribution[] = [
  { department: "IT", assetCount: 320, percentage: 0.26 },
  { department: "OPERATIONS", assetCount: 295, percentage: 0.24 },
  { department: "FINANCE", assetCount: 220, percentage: 0.18 },
  { department: "HR", assetCount: 175, percentage: 0.14 },
  { department: "OTHER", assetCount: 238, percentage: 0.18 },
];

const MOVEMENT_TREND: MovementPoint[] = [
  { month: "OCT", assignments: 42, returns: 18, maintenanceTransfers: 6 },
  { month: "NOV", assignments: 48, returns: 22, maintenanceTransfers: 7 },
  { month: "DEC", assignments: 51, returns: 20, maintenanceTransfers: 10 },
  { month: "JAN", assignments: 57, returns: 24, maintenanceTransfers: 9 },
  { month: "FEB", assignments: 60, returns: 26, maintenanceTransfers: 11 },
  { month: "MAR", assignments: 64, returns: 28, maintenanceTransfers: 12 },
];

export function useReports() {
  return {
    utilization: UTILIZATION_SUMMARY,
    departmentDistribution: DEPARTMENT_DISTRIBUTION,
    movementTrend: MOVEMENT_TREND,
  };
}

