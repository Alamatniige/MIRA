import 'package:flutter/material.dart';

import '../data/mock_data.dart';
import '../models/asset.dart';
import '../views/assets/asset_detail_screen.dart';
import '../views/scan/qr_scanner_screen.dart';

class DashboardController {
  String getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  int get totalAssets => mockMyAssets.length;

  int get activeAssetsCount =>
      mockMyAssets.where((a) => a.status.toLowerCase() == 'active').length;

  int get maintenanceAssetsCount =>
      mockMyAssets.where((a) => a.status.toLowerCase() == 'maintenance').length;

  List<Asset> get myAssets => mockMyAssets;

  String get userFirstName => mockUserName.split(' ').first;

  void onScanTap(BuildContext context) {
    Navigator.of(
      context,
    ).push(MaterialPageRoute(builder: (context) => const QrScannerScreen()));
  }

  void openDetails(BuildContext context, Asset asset) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => AssetDetailScreen(asset: asset)),
    );
  }
}
