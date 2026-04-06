import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  // Mock notifications data with grouping
  final List<_NotificationModel> _todayNotifications = [
    _NotificationModel(
      title: 'New Asset Assigned',
      message: 'A MacBook Pro 14" has been assigned to your department.',
      time: '2 hours ago',
      icon: Icons.inventory_2_rounded,
      color: AppColors.bluePrimary,
      isRead: false,
    ),
    _NotificationModel(
      title: 'Maintenance Alert',
      message: 'The yearly maintenance for IT-Room-01 UPS is due today.',
      time: '4 hours ago',
      icon: Icons.error_outline_rounded,
      color: AppColors.statusMaintenance,
      isRead: false,
    ),
  ];

  final List<_NotificationModel> _earlierNotifications = [
    _NotificationModel(
      title: 'Asset Approved',
      message: 'Your request for a Logitech MX Master 3S has been approved.',
      time: 'Yesterday',
      icon: Icons.check_circle_rounded,
      color: AppColors.statusActive,
      isRead: true,
    ),
    _NotificationModel(
      title: 'System Update',
      message: 'MIRA Mobile v2.0.4 is now available in the App Store.',
      time: '2 days ago',
      icon: Icons.update_rounded,
      color: AppColors.tealPrimary,
      isRead: true,
    ),
    _NotificationModel(
      title: 'Reported Issue Received',
      message:
          'Your report regarding the project monitor flickering has been noted.',
      time: '3 days ago',
      icon: Icons.report_problem_rounded,
      color: AppColors.statusReported,
      isRead: true,
    ),
  ];

  void _markAllAsRead() {
    setState(() {
      for (var n in _todayNotifications) {
        n.isRead = true;
      }
      for (var n in _earlierNotifications) {
        n.isRead = true;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.gray50,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
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
                        color: isDark ? AppColors.gray300 : AppColors.gray400,
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
                  (context, index) => _NotificationCard(
                    notification: _todayNotifications[index],
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
                  (context, index) => _NotificationCard(
                    notification: _earlierNotifications[index],
                  ),
                  childCount: _earlierNotifications.length,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _NotificationModel {
  final String title;
  final String message;
  final String time;
  final IconData icon;
  final Color color;
  bool isRead;

  _NotificationModel({
    required this.title,
    required this.message,
    required this.time,
    required this.icon,
    required this.color,
    required this.isRead,
  });
}

class _NotificationCard extends StatelessWidget {
  final _NotificationModel notification;

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
