import 'package:flutter/material.dart';
import '../dto/notification_dto.dart';
import '../theme/app_theme.dart';

class NotificationModel {
  final String id;
  final String title;
  final String message;
  final String time;
  final IconData icon;
  final Color color;
  bool isRead;
  final String? assetId;
  final String? actorId;
  final DateTime createdAt;

  NotificationModel({
    required this.id,
    required this.title,
    required this.message,
    required this.time,
    required this.icon,
    required this.color,
    required this.isRead,
    required this.createdAt,
    this.assetId,
    this.actorId,
  });

  factory NotificationModel.fromDto(NotificationDto dto) {
    return NotificationModel(
      id: dto.id,
      title: dto.title,
      message: dto.message,
      time: _getTimeString(dto.createdAt),
      icon: _getIconForType(dto.type),
      color: _getColorForType(dto.type),
      isRead: dto.isRead,
      createdAt: dto.createdAt,
      assetId: dto.assetId,
      actorId: dto.actorId,
    );
  }

  static String _getTimeString(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) return 'Just now';
    if (difference.inMinutes < 60) return '${difference.inMinutes}m ago';
    if (difference.inHours < 24) return '${difference.inHours}h ago';
    if (difference.inDays == 1) return 'Yesterday';
    if (difference.inDays < 7) return '${difference.inDays}d ago';
    
    return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
  }

  static IconData _getIconForType(String type) {
    switch (type) {
      case 'REPORT_SUBMITTED':
        return Icons.report_problem_rounded;
      case 'REQUEST_PENDING':
        return Icons.inventory_2_rounded;
      case 'REQUEST_ACCEPTED':
        return Icons.check_circle_rounded;
      case 'REQUEST_REJECTED':
        return Icons.cancel_rounded;
      case 'asset_registered':
        return Icons.add_business_rounded;
      case 'asset_assigned':
        return Icons.assignment_ind_rounded;
      default:
        return Icons.notifications_rounded;
    }
  }

  static Color _getColorForType(String type) {
    switch (type) {
      case 'REPORT_SUBMITTED':
        return AppColors.statusReported;
      case 'REQUEST_PENDING':
        return AppColors.bluePrimary;
      case 'REQUEST_ACCEPTED':
        return AppColors.statusActive;
      case 'REQUEST_REJECTED':
        return AppColors.statusMaintenance;
      case 'asset_registered':
        return AppColors.tealPrimary;
      case 'asset_assigned':
        return AppColors.bluePrimary;
      default:
        return AppColors.gray400;
    }
  }
}
