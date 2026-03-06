import 'package:flutter/material.dart';
import '../../controllers/assets_controller.dart';
import '../../theme/app_theme.dart';
import '../../widgets/asset_card.dart';

/// My Assets list - staff's assigned assets
class MyAssetsScreen extends StatefulWidget {
  const MyAssetsScreen({super.key});

  @override
  State<MyAssetsScreen> createState() => _MyAssetsScreenState();
}

class _MyAssetsScreenState extends State<MyAssetsScreen> {
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final controller = AssetsController();
    return Scaffold(
      appBar: AppBar(title: const Text('My Assets')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : controller.myAssets.isEmpty
              ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.inventory_2_outlined,
                    size: 64,
                    color: AppColors.gray400,
                  ),
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
                itemCount: controller.myAssets.length,
                itemBuilder: (context, index) {
                  final asset = controller.myAssets[index];
                  return AssetCard(
                    asset: asset,
                    onTap: () => controller.openDetails(context, asset),
                    onReportIssue: () => controller.reportIssue(context, asset),
                  );
                },
              ),
            ),
    );
  }
}
