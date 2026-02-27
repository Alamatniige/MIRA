import 'package:flutter/material.dart';

import '../data/mock_data.dart';
import '../models/asset.dart';
import '../views/assets/asset_detail_screen.dart';

class AssetsController {
  List<Asset> get myAssets => mockMyAssets;

  Future<void> refresh() async {
    await Future.delayed(const Duration(milliseconds: 500));
  }

  void openDetails(BuildContext context, Asset asset) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => AssetDetailScreen(asset: asset)),
    );
  }

  void reportIssue(BuildContext context, Asset asset) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Report issue for ${asset.name} (frontend only)'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
