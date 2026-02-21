import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/asset.dart';
import '../../widgets/status_badge.dart';

/// Asset detail - matches web AssetDetailsModal
class AssetDetailScreen extends StatelessWidget {
  final Asset asset;

  const AssetDetailScreen({super.key, required this.asset});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(asset.id),
        actions: [
          IconButton(
            icon: const Icon(Icons.report_outlined),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Report issue for ${asset.name}'),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.navy.withOpacity(0.06),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
                border: Border.all(color: AppColors.gray200),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.tealMuted,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(Icons.inventory_2_outlined, color: AppColors.teal, size: 24),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          asset.name,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: AppColors.navyLight,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${asset.id} · ${asset.category}',
                          style: TextStyle(fontSize: 13, color: AppColors.gray500),
                        ),
                      ],
                    ),
                  ),
                  StatusBadge(status: asset.status),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Details grid - matches web modal
            _DetailRow(label: 'Serial Number', value: asset.serialNumber),
            _DetailRow(label: 'Location', value: asset.location),
            _DetailRow(label: 'Assigned To', value: asset.assignedTo ?? 'Unassigned'),
            _DetailRow(label: 'Purchase Date', value: asset.purchaseDate),
            _DetailRow(label: 'Warranty', value: 'Until ${asset.warrantyExpiry}'),
            const SizedBox(height: 16),
            if (asset.specifications.isNotEmpty)
              _DetailRow(label: 'Specifications', value: asset.specifications),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _DetailRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.gray500),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(fontSize: 14, color: AppColors.navyLight),
          ),
        ],
      ),
    );
  }
}
