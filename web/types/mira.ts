export type AssetStatus =
  | "ACTIVE"
  | "AVAILABLE"
  | "UNDER_MAINTENANCE"
  | "RETIRED";

export type Department =
  | "IT"
  | "OPERATIONS"
  | "FINANCE"
  | "HR"
  | "OTHER"
  | string;

export interface Asset {
  id: string;
  tag: string;
  name: string;
  category: string;
  specifications?: string;
  location: string;
  status: AssetStatus;
  assignedTo?: string;
  department?: Department;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  assignee: string;
  department: Department;
  status: "ASSIGNED" | "RETURNED" | "UNDER_MAINTENANCE";
  notes?: string;
  assignedAt: string;
  returnedAt?: string;
}

export interface MaintenanceEvent {
  id: string;
  assetId: string;
  type: "PREVENTIVE" | "CORRECTIVE" | "UPGRADE";
  openedAt: string;
  closedAt?: string;
  vendor?: string;
  notes?: string;
}

export interface UtilizationSummary {
  utilizationRate: number;
  activeAssetCount: number;
  totalAssetCount: number;
}

export interface DepartmentDistribution {
  department: Department;
  assetCount: number;
  percentage: number;
}

export interface MovementPoint {
  month: string;
  assignments: number;
  returns: number;
  maintenanceTransfers: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  department: string;
  phone: string;
  role?: {
    name: string;
  };
}
