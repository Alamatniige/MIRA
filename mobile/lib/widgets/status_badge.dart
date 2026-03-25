import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Status badge - matches web StatusBadge (active, maintenance, issue, disposed)
class StatusBadge extends StatelessWidget {
  final String status;

  const StatusBadge({super.key, required this.status});

  static String _normalize(String value) {
    return value
        .trim()
        .toLowerCase()
        .replaceAll('_', ' ')
        .replaceAll('-', ' ')
        .split(RegExp(r'\s+'))
        .where((part) => part.isNotEmpty)
        .join(' ');
  }

  static Color _bgColor(String s, bool isDark) {
    final lower = _normalize(s);
    final alpha = isDark ? 0.25 : 0.15;
    if (lower == 'active' || lower == 'available') {
      return AppColors.statusActive.withValues(alpha: alpha);
    }
    if (lower == 'maintenance' || lower == 'under maintenance') {
      return AppColors.statusMaintenance.withValues(alpha: alpha);
    }
    if (lower == 'reported' || lower == 'issue') {
      return AppColors.statusReported.withValues(alpha: alpha);
    }
    if (lower == 'disposed') {
      return AppColors.statusDisposed.withValues(alpha: isDark ? 0.3 : 0.2);
    }
    return isDark ? AppColors.gray700 : AppColors.gray200;
  }

  static Color _textColor(String s, bool isDark) {
    final lower = _normalize(s);
    if (isDark) {
      if (lower == 'active' || lower == 'available') return const Color(0xFF4ADE80);
      if (lower == 'maintenance' || lower == 'under maintenance') return const Color(0xFFFACC15);
      if (lower == 'reported' || lower == 'issue') return const Color(0xFFF87171);
      if (lower == 'disposed') return AppColors.gray400;
      return AppColors.gray400;
    } else {
      if (lower == 'active' || lower == 'available') return const Color(0xFF15803D);
      if (lower == 'maintenance' || lower == 'under maintenance') return const Color(0xFFA16207);
      if (lower == 'reported' || lower == 'issue') return const Color(0xFFB91C1C);
      if (lower == 'disposed') return AppColors.gray700;
      return AppColors.gray600;
    }
  }

  static Color _dotColor(String s) {
    final lower = _normalize(s);
    if (lower == 'active' || lower == 'available') return AppColors.statusActive;
    if (lower == 'maintenance' || lower == 'under maintenance') return AppColors.statusMaintenance;
    if (lower == 'reported' || lower == 'issue') return AppColors.statusReported;
    if (lower == 'disposed') return AppColors.statusDisposed;
    return AppColors.gray500;
  }

  String get _displayText {
    final normalized = _normalize(status);
    if (normalized.isEmpty) return status;
    return normalized
        .split(' ')
        .map((word) => '${word[0].toUpperCase()}${word.substring(1)}')
        .join(' ');
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: _bgColor(status, isDark),
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
                fontWeight: FontWeight.w700,
                color: _textColor(status, isDark),
                letterSpacing: 0.2,
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
