export type AssetStatus = 'Active' | 'Maintenance' | 'Disposed';

export type UserRole = 'Staff' | 'IT Department';

export interface Asset {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  specifications: string;
  location: string;
  status: AssetStatus;
  assignedTo: string | null;
  assignedToId: string | null;
  purchaseDate: string;
  warrantyExpiry: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  avatar?: string;
}

export interface Assignment {
  id: string;
  assetId: string;
  assetName: string;
  assignedTo: string;
  department: string;
  dateAssigned: string;
  dateReturned: string | null;
  status: 'Active' | 'Returned' | 'Pending';
}

export interface ConditionEntry {
  date: string;
  condition: string;
  notes: string;
}

export interface AssignmentHistoryEntry {
  date: string;
  assignedTo: string;
  action: string;
}
