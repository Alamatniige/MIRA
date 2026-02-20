import { Asset, User, Assignment, ConditionEntry, AssignmentHistoryEntry } from '@/types';

export const mockAssets: Asset[] = [
  { id: 'AST-001', name: 'Dell Latitude 5540', category: 'Laptop', serialNumber: 'DL5540-2024-001', specifications: 'Intel i7, 16GB RAM, 512GB SSD', location: 'Building A - Floor 2', status: 'Active', assignedTo: 'Sarah Chen', assignedToId: 'USR-001', purchaseDate: '2024-01-15', warrantyExpiry: '2027-01-15' },
  { id: 'AST-002', name: 'HP LaserJet Pro M404', category: 'Printer', serialNumber: 'HP404-2023-012', specifications: 'Monochrome, 40ppm, Duplex', location: 'Building A - Floor 1', status: 'Active', assignedTo: null, assignedToId: null, purchaseDate: '2023-06-20', warrantyExpiry: '2026-06-20' },
  { id: 'AST-003', name: 'MacBook Pro 16"', category: 'Laptop', serialNumber: 'MBP16-2024-003', specifications: 'M3 Pro, 36GB RAM, 1TB SSD', location: 'Building B - Floor 3', status: 'Active', assignedTo: 'James Wilson', assignedToId: 'USR-002', purchaseDate: '2024-03-10', warrantyExpiry: '2027-03-10' },
  { id: 'AST-004', name: 'Dell UltraSharp U2723QE', category: 'Monitor', serialNumber: 'DU27-2023-044', specifications: '27" 4K IPS, USB-C Hub', location: 'Building A - Floor 2', status: 'Active', assignedTo: 'Sarah Chen', assignedToId: 'USR-001', purchaseDate: '2023-08-05', warrantyExpiry: '2026-08-05' },
  { id: 'AST-005', name: 'Lenovo ThinkPad X1 Carbon', category: 'Laptop', serialNumber: 'LTP-X1-2022-005', specifications: 'Intel i5, 8GB RAM, 256GB SSD', location: 'Storage Room B', status: 'Maintenance', assignedTo: null, assignedToId: null, purchaseDate: '2022-04-12', warrantyExpiry: '2025-04-12' },
  { id: 'AST-006', name: 'Cisco IP Phone 8845', category: 'Phone', serialNumber: 'CIP-8845-006', specifications: 'VoIP, 5" Display, HD Camera', location: 'Building A - Floor 1', status: 'Active', assignedTo: 'Emily Rodriguez', assignedToId: 'USR-003', purchaseDate: '2023-01-18', warrantyExpiry: '2026-01-18' },
  { id: 'AST-007', name: 'HP EliteDesk 800 G9', category: 'Desktop', serialNumber: 'HPE800-2021-007', specifications: 'Intel i7, 32GB RAM, 1TB SSD', location: 'IT Storage', status: 'Disposed', assignedTo: null, assignedToId: null, purchaseDate: '2021-02-28', warrantyExpiry: '2024-02-28' },
  { id: 'AST-008', name: 'iPad Pro 12.9"', category: 'Tablet', serialNumber: 'IPP12-2024-008', specifications: 'M2 Chip, 256GB, Wi-Fi + Cellular', location: 'Building B - Floor 1', status: 'Active', assignedTo: 'Michael Park', assignedToId: 'USR-004', purchaseDate: '2024-05-20', warrantyExpiry: '2026-05-20' },
  { id: 'AST-009', name: 'APC Smart-UPS 1500VA', category: 'UPS', serialNumber: 'APC1500-2023-009', specifications: '1500VA/1000W, LCD, USB', location: 'Server Room A', status: 'Active', assignedTo: null, assignedToId: null, purchaseDate: '2023-11-01', warrantyExpiry: '2026-11-01' },
  { id: 'AST-010', name: 'Dell Latitude 3420', category: 'Laptop', serialNumber: 'DL3420-2022-010', specifications: 'Intel i5, 8GB RAM, 256GB SSD', location: 'Building A - Floor 3', status: 'Maintenance', assignedTo: 'Lisa Thompson', assignedToId: 'USR-005', purchaseDate: '2022-09-15', warrantyExpiry: '2025-09-15' },
  { id: 'AST-011', name: 'Samsung 49" Ultrawide', category: 'Monitor', serialNumber: 'SAM49-2024-011', specifications: '49" DQHD, 120Hz, USB-C', location: 'Building B - Floor 2', status: 'Active', assignedTo: 'James Wilson', assignedToId: 'USR-002', purchaseDate: '2024-02-14', warrantyExpiry: '2027-02-14' },
  { id: 'AST-012', name: 'Logitech MX Keys', category: 'Peripheral', serialNumber: 'LMX-2023-012', specifications: 'Wireless, Backlit, Multi-device', location: 'Building A - Floor 2', status: 'Active', assignedTo: 'Sarah Chen', assignedToId: 'USR-001', purchaseDate: '2023-07-22', warrantyExpiry: '2025-07-22' },
];

export const mockUsers: User[] = [
  { id: 'USR-001', name: 'Sarah Chen', email: 'sarah.chen@company.com', department: 'Engineering', role: 'Staff' },
  { id: 'USR-002', name: 'James Wilson', email: 'james.wilson@company.com', department: 'Design', role: 'Staff' },
  { id: 'USR-003', name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com', department: 'Marketing', role: 'Staff' },
  { id: 'USR-004', name: 'Michael Park', email: 'michael.park@company.com', department: 'Sales', role: 'Staff' },
  { id: 'USR-005', name: 'Lisa Thompson', email: 'lisa.thompson@company.com', department: 'HR', role: 'Staff' },
  { id: 'USR-006', name: 'David Kim', email: 'david.kim@company.com', department: 'IT', role: 'IT Department' },
  { id: 'USR-007', name: 'Admin User', email: 'admin@company.com', department: 'IT', role: 'IT Department' },
];

export const mockAssignments: Assignment[] = [
  { id: 'AGN-001', assetId: 'AST-001', assetName: 'Dell Latitude 5540', assignedTo: 'Sarah Chen', department: 'Engineering', dateAssigned: '2024-01-20', dateReturned: null, status: 'Active' },
  { id: 'AGN-002', assetId: 'AST-003', assetName: 'MacBook Pro 16"', assignedTo: 'James Wilson', department: 'Design', dateAssigned: '2024-03-15', dateReturned: null, status: 'Active' },
  { id: 'AGN-003', assetId: 'AST-006', assetName: 'Cisco IP Phone 8845', assignedTo: 'Emily Rodriguez', department: 'Marketing', dateAssigned: '2023-02-01', dateReturned: null, status: 'Active' },
  { id: 'AGN-004', assetId: 'AST-008', assetName: 'iPad Pro 12.9"', assignedTo: 'Michael Park', department: 'Sales', dateAssigned: '2024-05-25', dateReturned: null, status: 'Active' },
  { id: 'AGN-005', assetId: 'AST-007', assetName: 'HP EliteDesk 800 G9', assignedTo: 'Lisa Thompson', department: 'HR', dateAssigned: '2021-03-10', dateReturned: '2024-01-15', status: 'Returned' },
  { id: 'AGN-006', assetId: 'AST-010', assetName: 'Dell Latitude 3420', assignedTo: 'Lisa Thompson', department: 'HR', dateAssigned: '2022-10-01', dateReturned: null, status: 'Pending' },
  { id: 'AGN-007', assetId: 'AST-004', assetName: 'Dell UltraSharp U2723QE', assignedTo: 'Sarah Chen', department: 'Engineering', dateAssigned: '2023-08-10', dateReturned: null, status: 'Active' },
  { id: 'AGN-008', assetId: 'AST-011', assetName: 'Samsung 49" Ultrawide', assignedTo: 'James Wilson', department: 'Design', dateAssigned: '2024-02-20', dateReturned: null, status: 'Active' },
];

export const mockAssignmentHistory: AssignmentHistoryEntry[] = [
  { date: '2024-01-20', assignedTo: 'Sarah Chen', action: 'Assigned' },
  { date: '2023-06-15', assignedTo: 'Tom Baker', action: 'Returned' },
  { date: '2023-01-10', assignedTo: 'Tom Baker', action: 'Assigned' },
  { date: '2022-11-05', assignedTo: 'IT Storage', action: 'Received from vendor' },
];

export const mockConditionHistory: ConditionEntry[] = [
  { date: '2024-06-01', condition: 'Good', notes: 'Regular check - all components functional' },
  { date: '2024-01-20', condition: 'Excellent', notes: 'New device, freshly configured' },
  { date: '2023-06-15', condition: 'Good', notes: 'Minor scratches on lid, all specs pass' },
  { date: '2023-01-10', condition: 'Excellent', notes: 'Initial deployment - brand new' },
];

export const assetCategories = ['Laptop', 'Desktop', 'Monitor', 'Printer', 'Phone', 'Tablet', 'Peripheral', 'UPS', 'Server', 'Network'];

export const locations = ['Building A - Floor 1', 'Building A - Floor 2', 'Building A - Floor 3', 'Building B - Floor 1', 'Building B - Floor 2', 'Building B - Floor 3', 'Server Room A', 'IT Storage', 'Storage Room B'];
