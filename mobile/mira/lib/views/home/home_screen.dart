import 'package:flutter/material.dart';
import '../../controllers/home_controller.dart';
import '../../theme/app_theme.dart';

/// Home/Dashboard - matches web Dashboard summary cards
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = HomeController();
    final myCount = controller.myAssetsCount;
    final activeCount = controller.activeAssetsCount;

    return Scaffold(
      appBar: AppBar(
        title: const Text('MIRA'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
                  'Hello, ${controller.userFirstName}',
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.navy,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Here\'s your asset overview',
              style: TextStyle(fontSize: 14, color: AppColors.gray600),
            ),
            const SizedBox(height: 24),
            // Summary cards - matches web StatCard
            Row(
              children: [
                Expanded(
                  child: _StatCard(
                    title: 'My Assets',
                    value: '$myCount',
                    trend: 'Assigned to you',
                    icon: Icons.inventory_2_outlined,
                    color: AppColors.teal,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _StatCard(
                    title: 'Active',
                    value: '$activeCount',
                    trend: 'In use',
                    icon: Icons.check_circle_outline,
                    color: AppColors.statusActive,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            // Quick action - Scan QR
            GestureDetector(
              onTap: () => controller.onScanTap(context),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.gray200),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.teal.withOpacity(0.06),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: AppColors.tealMuted,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(Icons.qr_code_scanner, color: AppColors.teal, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Scan Asset QR',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: AppColors.navyLight,
                            ),
                          ),
                          Text(
                            'Quick lookup by scanning',
                            style: TextStyle(fontSize: 13, color: AppColors.gray500),
                          ),
                        ],
                      ),
                    ),
                    Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.gray400),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final String trend;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.title,
    required this.value,
    required this.trend,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: AppColors.navy.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(color: AppColors.gray200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(fontSize: 13, color: AppColors.gray500, fontWeight: FontWeight.w500),
              ),
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 20),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AppColors.navyLight,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            trend,
            style: TextStyle(fontSize: 13, color: AppColors.gray500),
          ),
        ],
      ),
    );
  }
}
