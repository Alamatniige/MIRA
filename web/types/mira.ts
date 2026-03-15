export type AssetStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'UNDER_MAINTENANCE';

export type Department = 'IT' | 'OPERATIONS' | 'FINANCE' | 'HR' | 'OTHER' | string;

export interface AssetType {
  id: number;
  name: string;
  createdAt: string;
}

export interface AssetRoom {
  id: number;
  name: string;
  createdAt: string;
}

export interface AssetFloor {
  id: number;
  name: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  tag: string;
  assetName: string;
  assetType: number | null;
  assetTypeRel?: AssetType;
  serialNumber: string;
  specification: string;
  room: number | null;
  roomRel?: AssetRoom;
  floor: number | null;
  floorRel?: AssetFloor;
  currentStatus: AssetStatus | string;
  isAssigned: boolean;
  createdAt: string;
  image?: string[];

  // Optional fields for UI state or relations not directly present in the base table
  assignedTo?: string;
  qrCodeUrl?: string;
  updatedAt?: string;
}

export interface Assignment {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  assignee: string;
  issuedByUserId?: string;
  issuerName?: string;
  department: Department;
  status: 'PENDING' | 'CONFIRMED' | 'RETURNED';
  notes?: string;
  assignedAt: string;
  returnedAt?: string;
}

export interface MaintenanceEvent {
  id: string;
  assetId: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'UPGRADE';
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
  phoneNumber: string;
  role?: {
    name: string;
  };
  status?: string;
  lastActive?: string;
  assetsCount?: number;
}
