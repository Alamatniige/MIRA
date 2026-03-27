export type AssetConditionStatus = 'Good' | 'Under Review' | 'Under Maintenance';
export type AssetAssignmentStatus = 'Available' | 'Pending' | 'Approved' | 'Unavailable';

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
  // Added by migration 20260317000000_reports_location_schema
  floorId?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface AssetFloor {
  id: number;
  name: string;
  createdAt: string;
  // Added by migration 20260317000000_reports_location_schema
  level?: number;
}

// --- Floor Map (Reports page visualization) ---

export interface FloorMapRoom {
  roomId: number;
  roomName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  assetCount: number;
}

export interface FloorMap {
  floorId: number;
  floorName: string;
  level: number;
  rooms: FloorMapRoom[];
}

// --- Issue Reports ---

export interface IssueReport {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  reportedBy: string;
  userName: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | string;
  reportAt: string;
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
  currentStatus: AssetConditionStatus | string;
  assignmentStatus: AssetAssignmentStatus | string;
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
  status: 'PENDING' | 'CONFIRMED' | 'RETURNED' | 'REJECTED';
  notes?: string;
  assignedAt: string;
  confirmedAt?: string;
  returnedAt?: string;
  rejectedAt?: string;
  rejectedByUserId?: string;
  rejectionReason?: string;
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
  avatarUrl?: string;
  assetsCount?: number;
}

export type NotificationType =
  | 'report_created'
  | 'asset_assigned'
  | 'asset_registered'
  | 'asset_request'
  | 'maintenance_scheduled';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  performedBy: string;
  read: boolean;
  createdAt: string;
}
