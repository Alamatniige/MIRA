import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import '../core/network/api_client.dart';
import '../core/network/api_exception.dart';
import '../dto/notification_dto.dart';
import '../models/notification.dart';

class NotificationService {
  static const _channel = MethodChannel('com.example.mira/notifications');
  final ApiClient _apiClient;

  NotificationService({ApiClient? apiClient}) 
      : _apiClient = apiClient ?? ApiClient();

  Future<List<NotificationModel>> getNotifications() async {
    final response = await _apiClient.get('/notifications');
    
    if (response is! List) {
      throw const ApiException('Unexpected notifications response 001');
    }

    return response
        .map((n) => NotificationDto.fromJson(n as Map<String, dynamic>))
        .map((dto) => NotificationModel.fromDto(dto))
        .toList();
  }

  /// Triggers a system-level notification UI for the given model.
  /// Uses MethodChannel as the project currently lacks a third-party push plugin.
  Future<void> triggerPushNotification(NotificationModel notification) async {
    try {
      await _channel.invokeMethod('showNotification', {
        'id': notification.id,
        'title': notification.title,
        'message': notification.message,
        'type': notification.assetId, // Payload
      });
      
      // Fallback: If on-screen context is available, would show SnackBar here.
      debugPrint('MIRA Dispatch: Triggered push for ${notification.title}');
    } on PlatformException catch (e) {
      debugPrint('Notification channel not available on this platform: ${e.message}');
    }
  }

  Future<int> getUnreadCount() async {
    try {
      final response = await _apiClient.get('/notifications/unread-count');
      if (response is Map<String, dynamic>) {
        final count = response['unread_count'] ?? response['unreadCount'];
        if (count == null) return 0;
        if (count is int) return count;
        return int.tryParse(count.toString()) ?? 0;
      }
    } catch (e) {
      debugPrint('MIRA Error: Failed to fetch unread count: $e');
    }
    return 0;
  }

  Future<void> markAsRead(String id) async {
    await _apiClient.patch('/notifications/$id/read');
  }

  Future<void> markAllAsRead() async {
    await _apiClient.patch('/notifications/read-all');
  }
}
