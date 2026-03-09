import '../models/asset.dart';
import '../models/activity.dart';

/// Mock user for staff app (Sarah Chen)
const String mockUserEmail = 'sarah.chen@company.com';
const String mockUserName = 'Sarah Chen';
const String mockUserId = 'USR-001';

/// Assets assigned to Sarah Chen (mock staff user)
final List<Asset> mockMyAssets = [
  const Asset(
    id: 'AST-001',
    name: 'Dell Latitude 5540',
    category: 'Laptop',
    serialNumber: 'DL5540-2024-001',
    specifications: 'Intel i7, 16GB RAM, 512GB SSD',
    location: 'Building A - Floor 2',
    status: 'Active',
    assignedTo: 'Sarah Chen',
    assignedToId: 'USR-001',
    purchaseDate: '2024-01-15',
    warrantyExpiry: '2027-01-15',
  ),
  const Asset(
    id: 'AST-004',
    name: 'Dell UltraSharp U2723QE',
    category: 'Monitor',
    serialNumber: 'DU27-2023-044',
    specifications: '27" 4K IPS, USB-C Hub',
    location: 'Building A - Floor 2',
    status: 'Active',
    assignedTo: 'Sarah Chen',
    assignedToId: 'USR-001',
    purchaseDate: '2023-08-05',
    warrantyExpiry: '2026-08-05',
  ),
  const Asset(
    id: 'AST-012',
    name: 'Logitech MX Keys',
    category: 'Peripheral',
    serialNumber: 'LMX-2023-012',
    specifications: 'Wireless, Backlit, Multi-device',
    location: 'Building A - Floor 2',
    status: 'Active',
    assignedTo: 'Sarah Chen',
    assignedToId: 'USR-001',
    purchaseDate: '2023-07-22',
    warrantyExpiry: '2025-07-22',
  ),
];

/// All assets for QR scan lookup (mock)
final List<Asset> mockAllAssets = [
  ...mockMyAssets,
  const Asset(
    id: 'AST-002',
    name: 'HP LaserJet Pro M404',
    category: 'Printer',
    serialNumber: 'HP404-2023-012',
    specifications: 'Monochrome, 40ppm, Duplex',
    location: 'Building A - Floor 1',
    status: 'Active',
    assignedTo: null,
    assignedToId: null,
    purchaseDate: '2023-06-20',
    warrantyExpiry: '2026-06-20',
  ),
  const Asset(
    id: 'AST-003',
    name: 'MacBook Pro 16"',
    category: 'Laptop',
    serialNumber: 'MBP16-2024-003',
    specifications: 'M3 Pro, 36GB RAM, 1TB SSD',
    location: 'Building B - Floor 3',
    status: 'Active',
    assignedTo: 'James Wilson',
    assignedToId: 'USR-002',
    purchaseDate: '2024-03-10',
    warrantyExpiry: '2027-03-10',
  ),
  const Asset(
    id: 'AST-005',
    name: 'Lenovo ThinkPad X1 Carbon',
    category: 'Laptop',
    serialNumber: 'LTP-X1-2022-005',
    specifications: 'Intel i5, 8GB RAM, 256GB SSD',
    location: 'Storage Room B',
    status: 'Maintenance',
    assignedTo: null,
    assignedToId: null,
    purchaseDate: '2022-04-12',
    warrantyExpiry: '2025-04-12',
  ),
];

Asset? findAssetById(String id) {
  try {
    return mockAllAssets.firstWhere((a) => a.id == id);
  } catch (_) {
    return null;
  }
}

/// Mock activity history for timeline
final List<ActivityItem> mockActivityHistory = [
  ActivityItem(
    id: 'act-1',
    assetName: 'Dell Latitude 5540',
    assetId: 'AST-001',
    action: 'Assigned',
    dateTime: DateTime.now().subtract(const Duration(hours: 2)),
    type: 'assigned',
  ),
  ActivityItem(
    id: 'act-2',
    assetName: 'Dell UltraSharp U2723QE',
    assetId: 'AST-004',
    action: 'Issue Reported',
    dateTime: DateTime.now().subtract(const Duration(days: 1)),
    type: 'reported',
  ),
  ActivityItem(
    id: 'act-3',
    assetName: 'Logitech MX Keys',
    assetId: 'AST-012',
    action: 'Assigned',
    dateTime: DateTime.now().subtract(const Duration(days: 3)),
    type: 'assigned',
  ),
  ActivityItem(
    id: 'act-4',
    assetName: 'Lenovo ThinkPad X1 Carbon',
    assetId: 'AST-005',
    action: 'Maintenance',
    dateTime: DateTime.now().subtract(const Duration(days: 5)),
    type: 'maintenance',
  ),
  ActivityItem(
    id: 'act-5',
    assetName: 'Dell Latitude 5540',
    assetId: 'AST-001',
    action: 'Scanned',
    dateTime: DateTime.now().subtract(const Duration(days: 7)),
    type: 'assigned',
  ),
];
