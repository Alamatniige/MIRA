import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/notification.dart';
import '../../services/notification_service.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  final NotificationService _notificationService = NotificationService();

  List<NotificationModel> _todayNotifications = [];
  List<NotificationModel> _earlierNotifications = [];
  bool _isLoading = true;
  String? _error;

  // Track seen IDs to trigger push only for new items
  final Set<String> _seenNotificationIds = {};
  bool _isFirstLoad = true;

  @override
  void initState() {
    super.initState();
    _fetchNotifications();
    // In a real app, SSE or FCM would be used.
    // For this implementation, we poll every 30s to detect new events.
    _startPolling();
  }

  @override
  void dispose() {
    // Polling usually managed via a Timer, but for simplicity we use it in initState
    super.dispose();
  }

  void _startPolling() {
    Future.delayed(const Duration(seconds: 30), () {
      if (mounted) {
        _fetchNotifications(silent: true);
        _startPolling();
      }
    });
  }

  Future<void> _fetchNotifications({bool silent = false}) async {
    if (!silent) {
      setState(() {
        _isLoading = true;
        _error = null;
      });
    }

    try {
      final notifications = await _notificationService.getNotifications();

      // Check for new notifications to trigger "push"
      if (!_isFirstLoad) {
        for (var notif in notifications) {
          if (!_seenNotificationIds.contains(notif.id) && !notif.isRead) {
            await _notificationService.triggerPushNotification(notif);
          }
        }
      }

      _seenNotificationIds.addAll(notifications.map((n) => n.id));
      _isFirstLoad = false;
      _groupNotifications(notifications);
    } catch (e) {
      if (!silent) {
        setState(() {
          _error = 'Failed to load notifications: $e';
        });
      }
    } finally {
      if (!silent) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _groupNotifications(List<NotificationModel> notifications) {
    final now = DateTime.now();
    final todayStart = DateTime(now.year, now.month, now.day);

    setState(() {
      _todayNotifications = notifications
          .where((n) => n.createdAt.isAfter(todayStart))
          .toList();
      _earlierNotifications = notifications
          .where((n) => n.createdAt.isBefore(todayStart))
          .toList();
    });
  }

  Future<void> _markAllAsRead() async {
    try {
      await _notificationService.markAllAsRead();
      setState(() {
        for (var n in _todayNotifications) {
          n.isRead = true;
        }
        for (var n in _earlierNotifications) {
          n.isRead = true;
        }
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to mark all as read: $e')),
      );
    }
  }

  Future<void> _markAsRead(NotificationModel notif) async {
    if (notif.isRead) return;

    try {
      await _notificationService.markAsRead(notif.id);
      // Fix 7: only flip isRead after the API confirms success
      if (mounted) {
        setState(() {
          notif.isRead = true;
        });
      }
    } catch (e) {
      // Fix 7: surface the failure so the user can retry
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text(
              'Could not mark notification as read. Tap to retry.',
            ),
            behavior: SnackBarBehavior.floating,
            action: SnackBarAction(
              label: 'Retry',
              onPressed: () => _markAsRead(notif),
            ),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.gray50,
      body: RefreshIndicator(
        onRefresh: _fetchNotifications,
        color: AppColors.tealPrimary,
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(
            parent: AlwaysScrollableScrollPhysics(),
          ),
          slivers: [
            // Premium Header
            SliverAppBar(
              expandedHeight: 100.0,
              floating: false,
              pinned: true,
              elevation: 0,
              backgroundColor: isDark
                  ? AppColors.darkBackground
                  : AppColors.gray50,
              leadingWidth: 70,
              leading: Padding(
                padding: const EdgeInsets.only(left: 16),
                child: Center(
                  child: GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.darkSurface : AppColors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(
                              alpha: isDark ? 0.2 : 0.05,
                            ),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Icon(
                        Icons.arrow_back_ios_new_rounded,
                        color: Theme.of(context).colorScheme.onSurface,
                        size: 16,
                      ),
                    ),
                  ),
                ),
              ),
              actions: const [],
              flexibleSpace: FlexibleSpaceBar(
                centerTitle: true,
                title: Text(
                  'Notifications',
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurface,
                    fontWeight: FontWeight.w800,
                    fontSize: 20,
                    letterSpacing: -0.8,
                  ),
                ),
                background: Container(
                  decoration: BoxDecoration(
                    gradient: isDark
                        ? AppColors.darkBackgroundGradient
                        : AppColors.softBackgroundGradient,
                  ),
                ),
              ),
            ),

            if (_isLoading && _todayNotifications.isEmpty)
              const SliverFillRemaining(
                child: Center(
                  child: CircularProgressIndicator(
                    color: AppColors.tealPrimary,
                  ),
                ),
              )
            else if (_error != null && _todayNotifications.isEmpty)
              SliverFillRemaining(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 48,
                        color: AppColors.statusMaintenance,
                      ),
                      const SizedBox(height: 16),
                      Text(_error!, textAlign: TextAlign.center),
                      TextButton(
                        onPressed: _fetchNotifications,
                        child: const Text('Try Again'),
                      ),
                    ],
                  ),
                ),
              )
            else if (_todayNotifications.isEmpty &&
                _earlierNotifications.isEmpty)
              const SliverFillRemaining(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.notifications_none,
                        size: 48,
                        color: AppColors.gray400,
                      ),
                      SizedBox(height: 16),
                      Text(
                        'No notifications yet',
                        style: TextStyle(color: AppColors.gray400),
                      ),
                    ],
                  ),
                ),
              )
            else ...[
              // Today Section
              if (_todayNotifications.isNotEmpty) ...[
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(24, 20, 24, 12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'TODAY',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: isDark
                                ? AppColors.gray300
                                : AppColors.gray400,
                            letterSpacing: 1.2,
                          ),
                        ),
                        GestureDetector(
                          onTap: _markAllAsRead,
                          child: Text(
                            'Mark all as read',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: isDark
                                  ? AppColors.tealLight
                                  : AppColors.tealPrimary,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) => GestureDetector(
                        onTap: () => _markAsRead(_todayNotifications[index]),
                        child: _NotificationCard(
                          notification: _todayNotifications[index],
                        ),
                      ),
                      childCount: _todayNotifications.length,
                    ),
                  ),
                ),
              ],

              // Earlier Section
              if (_earlierNotifications.isNotEmpty) ...[
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(24, 24, 24, 12),
                    child: Text(
                      'EARLIER',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: isDark ? AppColors.gray300 : AppColors.gray400,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(24, 0, 24, 100),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) => GestureDetector(
                        onTap: () => _markAsRead(_earlierNotifications[index]),
                        child: _NotificationCard(
                          notification: _earlierNotifications[index],
                        ),
                      ),
                      childCount: _earlierNotifications.length,
                    ),
                  ),
                ),
              ],
            ],
          ],
        ),
      ),
    );
  }
}

class _NotificationCard extends StatelessWidget {
  final NotificationModel notification;

  const _NotificationCard({required this.notification});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: GlassCard(
        padding: const EdgeInsets.all(14),
        borderRadius: 20,
        blur: isDark ? 10 : 5,
        borderColor: notification.isRead
            ? null
            : (isDark ? AppColors.tealLight : AppColors.tealPrimary),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Premium Icon Container
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    notification.color.withValues(alpha: 0.2),
                    notification.color.withValues(alpha: 0.05),
                  ],
                ),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: notification.color.withValues(alpha: 0.1),
                  width: 1,
                ),
              ),
              child: Icon(
                notification.icon,
                color: notification.color,
                size: 22,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          notification.title,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: Theme.of(context).colorScheme.onSurface,
                            letterSpacing: -0.2,
                          ),
                        ),
                      ),
                      if (!notification.isRead)
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: isDark
                                ? AppColors.tealLight
                                : AppColors.tealPrimary,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: isDark
                                    ? AppColors.tealLight
                                    : AppColors.tealPrimary,
                                blurRadius: 6,
                                spreadRadius: 0,
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    notification.message,
                    style: TextStyle(
                      fontSize: 12,
                      color: Theme.of(context).colorScheme.onSurfaceVariant
                          .withValues(alpha: notification.isRead ? 0.7 : 1.0),
                      height: 1.5,
                      fontWeight: notification.isRead
                          ? FontWeight.w400
                          : FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Icon(
                        Icons.access_time_rounded,
                        size: 12,
                        color: AppColors.gray400,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        notification.time,
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppColors.gray400,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
