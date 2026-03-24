import 'package:flutter/material.dart';

import '../models/asset.dart';
import '../models/dashboard_data.dart';
import '../repositories/assets_repository.dart';
import '../views/assets/asset_detail_screen.dart';
import '../views/scan/qr_scanner_screen.dart';

class DashboardController {
  DashboardController({AssetsRepository? assetsRepository})
    : _assetsRepository = assetsRepository ?? AssetsRepository();

  final AssetsRepository _assetsRepository;

  String getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  Future<DashboardData> loadDashboard() {
    return _assetsRepository.getDashboardData();
  }

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
