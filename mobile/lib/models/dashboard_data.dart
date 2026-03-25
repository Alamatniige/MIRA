import 'asset.dart';

class DashboardData {
  const DashboardData({
    required this.userFirstName,
    required this.totalAssets,
    required this.activeAssetsCount,
    required this.maintenanceAssetsCount,
    required this.myAssets,
    this.avatarUrl,
  });

  final String userFirstName;
  final int totalAssets;
  final int activeAssetsCount;
  final int maintenanceAssetsCount;
  final List<Asset> myAssets;
  final String? avatarUrl;
}
