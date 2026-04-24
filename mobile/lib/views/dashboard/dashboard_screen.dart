import 'dart:ui';
import 'package:flutter/material.dart';

import '../../controllers/dashboard_controller.dart';
import '../../core/network/api_exception.dart';
import '../../core/network/error_formatter.dart';
import '../../models/asset.dart';
import '../../models/dashboard_data.dart';
import '../../theme/app_theme.dart';
import '../../widgets/asset_thumbnail.dart';
import '../../widgets/status_badge.dart';
import '../assets/all_assets_screen.dart';
import '../notifications/notifications_screen.dart';


/// Premium Dashboard - modern design with glassmorphism, refined cards, premium FAB
class DashboardScreen extends StatefulWidget {
  final Future<void> Function() onProfileTap;
  /// Called when the server returns 401/403 — clears the session and sends
  /// the user back to the login screen.
  final Future<void> Function()? onSessionExpired;

  const DashboardScreen({
    super.key,
    required this.onProfileTap,
    this.onSessionExpired,
  });

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final DashboardController _controller = DashboardController();
  DashboardData? _dashboardData;
  String? _errorMessage;
  bool _isSessionError = false;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboard();
  }

  Future<void> _loadDashboard() async {
    if (mounted) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
        _isSessionError = false;
      });
    }

    try {
      final dashboardData = await _controller.loadDashboard();
      if (!mounted) return;

      setState(() {
        _dashboardData = dashboardData;
        _isLoading = false;
      });
    } catch (error) {
      if (!mounted) return;

      final isSession = error is ApiException &&
          (error.statusCode == 401 || error.statusCode == 403);

      setState(() {
        _errorMessage = formatErrorForUser(error);
        _isSessionError = isSession;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final dashboard = _dashboardData;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: _isLoading && dashboard == null
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && dashboard == null
            ? _DashboardErrorState(
                message: _errorMessage!,
                isSessionError: _isSessionError,
                onRetry: _loadDashboard,
                onLogout: widget.onSessionExpired,
              )
            : RefreshIndicator(
                onRefresh: _loadDashboard,
                child: CustomScrollView(
                  physics: const BouncingScrollPhysics(
                    parent: AlwaysScrollableScrollPhysics(),
                  ),
                  slivers: [
                    // Modern clean header text
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(24, 20, 24, 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        _controller.getGreeting(),
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w700,
                                          color: Theme.of(
                                            context,
                                          ).colorScheme.primary,
                                          letterSpacing: 0.8,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        dashboard?.userFirstName ?? 'User',
                                        style: TextStyle(
                                          fontSize: 24,
                                          fontWeight: FontWeight.w800,
                                          color: Theme.of(
                                            context,
                                          ).colorScheme.onSurface,
                                          letterSpacing: -0.5,
                                          height: 1.15,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                ),

                                // Notification and Avatar group
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    // Notification Icon
                                    GestureDetector(
                                      onTap: () => Navigator.of(context).push(
                                        MaterialPageRoute(
                                          builder: (_) =>
                                              const NotificationScreen(),
                                        ),
                                      ),
                                      child: Container(
                                        width: 44,
                                        height: 44,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: Theme.of(context)
                                              .colorScheme
                                              .surface
                                              .withValues(
                                                alpha: isDark ? 0.4 : 0.8,
                                              ),
                                          border: Border.all(
                                            color: Colors.white.withValues(
                                              alpha: isDark ? 0.1 : 0.4,
                                            ),
                                            width: 1.5,
                                          ),
                                          boxShadow: [
                                            BoxShadow(
                                              color: Colors.black.withValues(
                                                alpha: isDark ? 0.2 : 0.05,
                                              ),
                                              blurRadius: 20,
                                              offset: const Offset(0, 8),
                                            ),
                                          ],
                                        ),
                                        child: ClipRRect(
                                          borderRadius:
                                              BorderRadius.circular(22),
                                          child: BackdropFilter(
                                            filter: ImageFilter.blur(
                                              sigmaX: 5,
                                              sigmaY: 5,
                                            ),
                                            child: Center(
                                              child: Stack(
                                                clipBehavior: Clip.none,
                                                children: [
                                                  Icon(
                                                    Icons
                                                        .notifications_none_rounded,
                                                    color: Theme.of(context)
                                                        .colorScheme
                                                        .onSurface,
                                                    size: 22,
                                                  ),
                                                  // Notification Badge
                                                  if ((dashboard
                                                              ?.unreadNotificationCount ??
                                                          0) >
                                                      0)
                                                    Positioned(
                                                      right: -1,
                                                      top: -1,
                                                      child: Container(
                                                        width: 11,
                                                        height: 11,
                                                        decoration:
                                                            BoxDecoration(
                                                          color: AppColors
                                                              .statusReported,
                                                          shape:
                                                              BoxShape.circle,
                                                          border: Border.all(
                                                            color: Theme.of(
                                                              context,
                                                            ).colorScheme.surface,
                                                            width: 2,
                                                          ),
                                                          boxShadow: [
                                                            BoxShadow(
                                                              color: AppColors
                                                                  .statusReported
                                                                  .withValues(
                                                                    alpha: 0.4,
                                                                  ),
                                                              blurRadius: 4,
                                                              spreadRadius: 0,
                                                            ),
                                                          ],
                                                        ),
                                                      ),
                                                    ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 12),

                                    // Avatar with profile navigation
                                    GestureDetector(
                                      onTap: () async {
                                        await widget.onProfileTap();
                                        if (!mounted) {
                                          return;
                                        }
                                        await _loadDashboard();
                                      },
                                      child: Container(
                                        width: 42,
                                        height: 42,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          gradient: dashboard?.avatarUrl == null
                                              ? AppColors.primaryGradient
                                              : null,
                                          color: dashboard?.avatarUrl != null
                                              ? Colors.white
                                              : null,
                                          image: dashboard?.avatarUrl != null
                                              ? DecorationImage(
                                                image: NetworkImage(
                                                  dashboard!.avatarUrl!,
                                                ),
                                                fit: BoxFit.cover,
                                              )
                                              : null,
                                          boxShadow: [
                                            BoxShadow(
                                              color: Theme.of(context)
                                                  .colorScheme
                                                  .primary
                                                  .withValues(alpha: 0.2),
                                              blurRadius: 16,
                                              offset: const Offset(0, 4),
                                            ),
                                          ],
                                        ),
                                        child: dashboard?.avatarUrl == null
                                            ? const Center(
                                              child: Icon(
                                                Icons.person_rounded,
                                                color: Colors.white,
                                                size: 20,
                                              ),
                                            )
                                            : null,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Here\'s your asset overview',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w500,
                                color: Theme.of(
                                  context,
                                ).colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Summary cards
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(24, 8, 24, 0),
                        child: SizedBox(
                          height: 132,
                          child: ListView(
                            scrollDirection: Axis.horizontal,
                            physics: const BouncingScrollPhysics(),
                            clipBehavior: Clip.none,
                            children: [
                              _SummaryCard(
                                label: 'All Assets',
                                value: '${dashboard?.totalAssets ?? 0}',
                                icon: Icons.inventory_2_rounded,
                                accentColor: const Color(0xFF0D9488),
                                showArrow: true,
                                onTap: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (_) => const AllAssetsScreen(),
                                    ),
                                  );
                                },
                              ),
                              const SizedBox(width: 16),
                              _SummaryCard(
                                label: 'Assigned to you',
                                value: '${dashboard?.activeAssetsCount ?? 0}',
                                icon: Icons.check_circle_rounded,
                                accentColor: const Color(0xFF22C55E),
                              ),
                              const SizedBox(width: 16),
                              _SummaryCard(
                                label: 'Maintenance',
                                value:
                                    '${dashboard?.maintenanceAssetsCount ?? 0}',
                                icon: Icons.build_rounded,
                                accentColor: const Color(0xFFEAB308),
                              ),
                              const SizedBox(width: 16),
                              _SummaryCard(
                                label: 'Pending Requests',
                                value:
                                    '${dashboard?.pendingRequests.length ?? 0}',
                                icon: Icons.hourglass_bottom_rounded,
                                accentColor: const Color(0xFFF59E0B),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    // Assigned Assets
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(24, 24, 24, 12),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Text(
                              'Assigned Assets',
                              style: Theme.of(context).textTheme.titleLarge
                                  ?.copyWith(
                                    fontWeight: FontWeight.w800,
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurface,
                                    letterSpacing: -0.3,
                                  ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: Theme.of(context)
                                    .colorScheme
                                    .surfaceContainerHighest
                                    .withValues(alpha: 0.5),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '${dashboard?.myAssets.length ?? 0} items',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: Theme.of(context).colorScheme.primary,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    dashboard == null || dashboard.myAssets.isEmpty
                        ? const SliverToBoxAdapter(
                            child: Padding(
                              padding: EdgeInsets.all(40),
                              child: _EmptyAssetsState(),
                            ),
                          )
                        : SliverPadding(
                            padding: const EdgeInsets.fromLTRB(24, 0, 24, 0),
                            sliver: SliverList(
                              delegate: SliverChildBuilderDelegate((
                                context,
                                index,
                              ) {
                                final asset = dashboard.myAssets[index];
                                return _AssetListCard(
                                  asset: asset,
                                  onTap: () =>
                                      _controller.openDetails(context, asset),
                                );
                              }, childCount: dashboard.myAssets.length),
                            ),
                          ),

                    // Pending Requests Section
                    if (dashboard != null &&
                        dashboard.pendingRequests.isNotEmpty)
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(24, 24, 24, 12),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Text(
                                'Pending Requests',
                                style: Theme.of(context).textTheme.titleLarge
                                    ?.copyWith(
                                      fontWeight: FontWeight.w800,
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.onSurface,
                                      letterSpacing: -0.3,
                                    ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: Theme.of(context)
                                      .colorScheme
                                      .surfaceContainerHighest
                                      .withValues(alpha: 0.5),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  '${dashboard.pendingRequests.length} items',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.primary,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    if (dashboard != null &&
                        dashboard.pendingRequests.isNotEmpty)
                      SliverPadding(
                        padding: const EdgeInsets.fromLTRB(24, 0, 24, 110),
                        sliver: SliverList(
                          delegate: SliverChildBuilderDelegate((
                            context,
                            index,
                          ) {
                            final asset = dashboard.pendingRequests[index];
                            return _AssetListCard(
                              asset: asset,
                              onTap: () =>
                                  _controller.openDetails(context, asset),
                            );
                          }, childCount: dashboard.pendingRequests.length),
                        ),
                      ),
                  ],
                ),
              ),
      ),
    );
  }
}

class _DashboardErrorState extends StatelessWidget {
  const _DashboardErrorState({
    required this.message,
    required this.onRetry,
    this.isSessionError = false,
    this.onLogout,
  });

  final String message;
  final Future<void> Function() onRetry;
  final bool isSessionError;
  final Future<void> Function()? onLogout;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final iconColor = isSessionError
        ? AppColors.statusReported
        : Theme.of(context).colorScheme.onSurfaceVariant;

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Icon bubble
            Container(
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: isDark ? 0.15 : 0.08),
                shape: BoxShape.circle,
              ),
              child: Icon(
                isSessionError
                    ? Icons.lock_person_rounded
                    : Icons.cloud_off_rounded,
                size: 48,
                color: iconColor,
              ),
            ),
            const SizedBox(height: 24),

            // Title
            Text(
              isSessionError ? 'Session Expired' : 'Failed to Load Dashboard',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                    color: Theme.of(context).colorScheme.onSurface,
                    letterSpacing: -0.3,
                  ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10),

            // Message
            Text(
              isSessionError
                  ? 'Your session is no longer valid. Please log out and sign in again to continue.'
                  : message,
              style: TextStyle(
                fontSize: 14,
                height: 1.5,
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 28),

            // Action buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Retry / Refresh button (always shown)
                OutlinedButton.icon(
                  onPressed: onRetry,
                  icon: const Icon(Icons.refresh_rounded, size: 18),
                  label: const Text('Retry'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),

                // Logout button — only for session errors
                if (isSessionError && onLogout != null) ...
                  [
                    const SizedBox(width: 12),
                    FilledButton.icon(
                      onPressed: onLogout,
                      icon: const Icon(Icons.logout_rounded, size: 18),
                      label: const Text('Log Out'),
                      style: FilledButton.styleFrom(
                        backgroundColor: AppColors.statusReported,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                    ),
                  ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyAssetsState extends StatelessWidget {
  const _EmptyAssetsState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Theme.of(
                context,
              ).colorScheme.primary.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.inventory_2_outlined,
              size: 56,
              color: Theme.of(
                context,
              ).colorScheme.primary.withValues(alpha: 0.6),
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'No assets assigned',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Scan a QR code to add an asset',
            style: TextStyle(
              fontSize: 14,
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color accentColor;
  final VoidCallback? onTap;
  final bool showArrow;

  const _SummaryCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.accentColor,
    this.onTap,
    this.showArrow = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = Theme.of(context).colorScheme.surface;

    return Container(
      width: 140,
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(
          color: isDark
              ? Colors.white.withValues(alpha: 0.05)
              : Colors.transparent,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: accentColor.withValues(alpha: isDark ? 0.15 : 0.08),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
          BoxShadow(
            color: Theme.of(
              context,
            ).colorScheme.shadow.withValues(alpha: isDark ? 0.3 : 0.04),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(28),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: accentColor.withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(icon, color: accentColor, size: 22),
                    ),
                    if (showArrow)
                      Icon(
                        Icons.arrow_outward_rounded,
                        color: accentColor.withValues(alpha: 0.6),
                        size: 18,
                      ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      alignment: Alignment.centerLeft,
                      child: Text(
                        value,
                        style: TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.w800,
                          color: Theme.of(context).colorScheme.onSurface,
                          letterSpacing: -0.5,
                          height: 1.1,
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      label,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

IconData _iconForCategory(String category) {
  final lower = category.toLowerCase();
  if (lower.contains('laptop') || lower.contains('computer')) {
    return Icons.laptop_mac_rounded;
  }
  if (lower.contains('monitor') || lower.contains('display')) {
    return Icons.monitor_rounded;
  }
  if (lower.contains('keyboard') || lower.contains('peripheral')) {
    return Icons.keyboard_rounded;
  }
  if (lower.contains('printer')) return Icons.print_rounded;
  if (lower.contains('phone')) return Icons.smartphone_rounded;
  return Icons.devices_other_rounded;
}

class _AssetListCard extends StatelessWidget {
  final Asset asset;
  final VoidCallback onTap;

  const _AssetListCard({required this.asset, required this.onTap});

  Color _statusAccentColor() {
    final lower = asset.status.toLowerCase();
    if (lower == 'active') return AppColors.statusActive;
    if (lower == 'maintenance') return AppColors.statusMaintenance;
    if (lower == 'reported' || lower == 'issue') {
      return AppColors.statusReported;
    }
    if (lower == 'disposed') return AppColors.statusDisposed;
    return AppColors.gray500;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final accent = _statusAccentColor();

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(24),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: isDark
                    ? Colors.white.withValues(alpha: 0.08)
                    : AppColors.gray200.withValues(alpha: 0.5),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: Theme.of(
                    context,
                  ).colorScheme.shadow.withValues(alpha: isDark ? 0.2 : 0.03),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: isDark
                        ? Theme.of(context).colorScheme.surfaceContainerHighest
                              .withValues(alpha: 0.3)
                        : AppColors.gray50,
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: AssetThumbnail(
                    asset: asset,
                    fallbackIcon: _iconForCategory(asset.category),
                    backgroundColor: isDark
                        ? Theme.of(context).colorScheme.surfaceContainerHighest
                              .withValues(alpha: 0.3)
                        : AppColors.gray50,
                    iconColor: Theme.of(context).colorScheme.primary,
                    borderRadius: BorderRadius.circular(18),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        asset.name,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Theme.of(context).colorScheme.onSurface,
                          letterSpacing: -0.2,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: BoxDecoration(
                              color: accent,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              '${asset.category} · ${asset.id}',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                color: Theme.of(
                                  context,
                                ).colorScheme.onSurfaceVariant,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                StatusBadge(status: asset.status),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
