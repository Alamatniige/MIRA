import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Status badge - matches web StatusBadge (active, maintenance, issue, disposed)
class StatusBadge extends StatelessWidget {
  final String status;

  const StatusBadge({super.key, required this.status});

  static Color _bgColor(String s) {
    final lower = s.toLowerCase();
    if (lower == 'active') return AppColors.statusActive.withOpacity(0.15);
    if (lower == 'maintenance') return AppColors.statusMaintenance.withOpacity(0.15);
    if (lower == 'reported' || lower == 'issue') return AppColors.statusReported.withOpacity(0.15);
    if (lower == 'disposed') return AppColors.statusDisposed.withOpacity(0.2);
    return AppColors.gray200;
  }

  static Color _textColor(String s) {
    final lower = s.toLowerCase();
    if (lower == 'active') return const Color(0xFF15803D);
    if (lower == 'maintenance') return const Color(0xFFA16207);
    if (lower == 'reported' || lower == 'issue') return const Color(0xFFB91C1C);
    if (lower == 'disposed') return AppColors.gray700;
    return AppColors.gray600;
  }

  static Color _dotColor(String s) {
    final lower = s.toLowerCase();
    if (lower == 'active') return AppColors.statusActive;
    if (lower == 'maintenance') return AppColors.statusMaintenance;
    if (lower == 'reported' || lower == 'issue') return AppColors.statusReported;
    if (lower == 'disposed') return AppColors.statusDisposed;
    return AppColors.gray500;
  }

  String get _displayText {
    if (status.isEmpty) return status;
    return '${status[0].toUpperCase()}${status.substring(1).toLowerCase()}';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: _bgColor(status),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: _dotColor(status),
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 6),
          Flexible(
            child: Text(
              _displayText,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: _textColor(status),
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
