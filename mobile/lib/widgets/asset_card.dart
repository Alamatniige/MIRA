import 'package:flutter/material.dart';
import '../models/asset.dart';
import '../theme/app_theme.dart';
import 'status_badge.dart';

/// Asset card - matches web AssetCard design
class AssetCard extends StatelessWidget {
  final Asset asset;
  final VoidCallback? onTap;
  final VoidCallback? onReportIssue;

  const AssetCard({
    super.key,
    required this.asset,
    this.onTap,
    this.onReportIssue,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          asset.name,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: AppColors.navyLight,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${asset.category} · ${asset.id}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.gray500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  StatusBadge(status: asset.status),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.location_on_outlined, size: 14, color: AppColors.gray500),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      asset.location,
                      style: const TextStyle(fontSize: 12, color: AppColors.gray600),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.gray100.withOpacity(0.5),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Center(
                  child: Icon(Icons.qr_code_2, size: 40, color: AppColors.gray400),
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: onTap,
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.navyLight,
                        side: const BorderSide(color: AppColors.gray300),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      child: const Text('View Details'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  OutlinedButton.icon(
                    onPressed: onReportIssue,
                    icon: const Icon(Icons.report_outlined, size: 16),
                    label: const Text('Report'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.navyLight,
                      side: const BorderSide(color: AppColors.gray300),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
