import 'package:flutter/material.dart';
import '../../controllers/dashboard_controller.dart';
import '../../models/asset.dart';
import '../../models/dashboard_data.dart';
import '../../theme/app_theme.dart';
import '../../widgets/asset_thumbnail.dart';
import '../../widgets/status_badge.dart';
import '../assets/all_assets_screen.dart';

/// Premium Dashboard - modern design with glassmorphism, refined cards, premium FAB
class DashboardScreen extends StatefulWidget {
  final Future<void> Function() onProfileTap;

  const DashboardScreen({super.key, required this.onProfileTap});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final DashboardController _controller = DashboardController();
  DashboardData? _dashboardData;
  String? _errorMessage;
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
      });
    }

    try {
      final dashboardData = await _controller.loadDashboard();
      if (!mounted) {
        return;
      }

      setState(() {
        _dashboardData = dashboardData;
        _isLoading = false;
      });
    } catch (error) {
      if (!mounted) {
        return;
      }

      setState(() {
        _errorMessage = error.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final dashboard = _dashboardData;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: _isLoading && dashboard == null
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && dashboard == null
            ? _DashboardErrorState(
                message: _errorMessage!,
                onRetry: _loadDashboard,
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
                        padding: const EdgeInsets.fromLTRB(24, 32, 24, 20),
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
                                          fontSize: 14,
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
                                          fontSize: 34,
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
                                    width: 50,
                                    height: 50,
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
                                              size: 24,
                                            ),
                                          )
                                        : null,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              'Here\'s your asset overview',
                              style: TextStyle(
                                fontSize: 16,
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
                          height: 150,
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
                        padding: const EdgeInsets.fromLTRB(24, 32, 24, 16),
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
                          padding: const EdgeInsets.fromLTRB(24, 32, 24, 16),
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
  const _DashboardErrorState({required this.message, required this.onRetry});

  final String message;
  final Future<void> Function() onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.cloud_off_rounded,
              size: 52,
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
            const SizedBox(height: 16),
            Text(
              'Failed to load dashboard',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              message,
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: onRetry, child: const Text('Retry')),
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
      width: 156,
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
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
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
                          fontSize: 32,
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
                  width: 56,
                  height: 56,
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
