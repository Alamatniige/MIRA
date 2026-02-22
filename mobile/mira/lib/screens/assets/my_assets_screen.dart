import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../data/mock_data.dart';
import '../../models/asset.dart';
import '../../widgets/asset_card.dart';
import 'asset_detail_screen.dart';

/// My Assets list - staff's assigned assets
class MyAssetsScreen extends StatelessWidget {
  const MyAssetsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Assets'),
      ),
      body: mockMyAssets.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.inventory_2_outlined, size: 64, color: AppColors.gray400),
                  const SizedBox(height: 16),
                  Text(
                    'No assets assigned',
                    style: TextStyle(fontSize: 16, color: AppColors.gray600),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Contact IT to request equipment',
                    style: TextStyle(fontSize: 14, color: AppColors.gray500),
                  ),
                ],
              ),
            )
          : RefreshIndicator(
              onRefresh: () async {
                await Future.delayed(const Duration(milliseconds: 500));
              },
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: mockMyAssets.length,
                itemBuilder: (context, index) {
                  final asset = mockMyAssets[index];
                  return AssetCard(
                    asset: asset,
                    onTap: () => _openDetails(context, asset),
                    onReportIssue: () => _reportIssue(context, asset),
                  );
                },
              ),
            ),
    );
  }

  void _openDetails(BuildContext context, Asset asset) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => AssetDetailScreen(asset: asset),
      ),
    );
  }

  void _reportIssue(BuildContext context, Asset asset) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Report issue for ${asset.name} (frontend only)'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
