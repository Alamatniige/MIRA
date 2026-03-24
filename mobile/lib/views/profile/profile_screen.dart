import 'package:flutter/material.dart';
import '../../controllers/profile_controller.dart';
import '../../models/types.dart';
import '../../theme/app_theme.dart';
import '../../theme/theme_mode_scope.dart';

/// Profile - stunning premium layout matching the dashboard and history pages
class ProfileScreen extends StatefulWidget {
  final Future<void> Function() onLogout;

  const ProfileScreen({super.key, required this.onLogout});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isLoading = true;
  bool _isLoggingOut = false;
  UserProfile? _profile;
  String? _errorMessage;

  final _controller = ProfileController();

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final profile = await _controller.loadProfile();
      if (mounted) {
        setState(() {
          _profile = profile;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.gray50,
      body: SafeArea(
        child: _isLoading || _isLoggingOut
            ? const Center(
                child: CircularProgressIndicator(color: AppColors.tealPrimary),
              )
            : _errorMessage != null
            ? Center(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.error_outline,
                        color: AppColors.statusReported,
                        size: 48,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Failed to load profile',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 18,
                          color: Theme.of(context).colorScheme.onSurface,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _errorMessage!,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _isLoading = true;
                            _errorMessage = null;
                          });
                          _loadProfile();
                        },
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                ),
              )
            : CustomScrollView(
                physics: const BouncingScrollPhysics(
                  parent: AlwaysScrollableScrollPhysics(),
                ),
                slivers: [
                  // Modern floating header text
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(16, 24, 24, 8),
                      child: Row(
                        children: [
                          IconButton(
                            icon: Icon(
                              Icons.arrow_back_ios_new_rounded,
                              color: Theme.of(context).colorScheme.onSurface,
                              size: 24,
                            ),
                            onPressed: () => Navigator.of(context).pop(),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Profile',
                            style: TextStyle(
                              fontSize: 34,
                              fontWeight: FontWeight.w800,
                              color: Theme.of(context).colorScheme.onSurface,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Avatar Centerpiece
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 32),
                      child: Column(
                        children: [
                          Stack(
                            alignment: Alignment.center,
                            children: [
                              // Outer glow ring
                              Container(
                                width: 140,
                                height: 140,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color:
                                      (isDark
                                              ? AppColors.tealLight
                                              : AppColors.tealPrimary)
                                          .withValues(alpha: 0.08),
                                ),
                              ),
                              // Middle glowing ring
                              Container(
                                width: 120,
                                height: 120,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color:
                                      (isDark
                                              ? AppColors.tealLight
                                              : AppColors.tealPrimary)
                                          .withValues(alpha: 0.15),
                                ),
                              ),
                              // Core Avatar
                              Container(
                                width: 100,
                                height: 100,
                                decoration: BoxDecoration(
                                  gradient: AppColors.primaryGradient,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppColors.tealPrimary.withValues(
                                        alpha: 0.4,
                                      ),
                                      blurRadius: 24,
                                      offset: const Offset(0, 8),
                                    ),
                                  ],
                                ),
                                child: Center(
                                  child: Text(
                                    (_profile != null &&
                                                _profile!.fullName.isNotEmpty
                                            ? _profile!.fullName[0]
                                            : '?')
                                        .toUpperCase(),
                                    style: const TextStyle(
                                      fontSize: 40,
                                      fontWeight: FontWeight.w800,
                                      color: Colors.white,
                                      letterSpacing: -1,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          Text(
                            _profile?.fullName ?? '',
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w800,
                              color: Theme.of(context).colorScheme.onSurface,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color:
                                  (isDark
                                          ? AppColors.tealLight
                                          : AppColors.tealPrimary)
                                      .withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              _profile?.department ?? '',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
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

                  // Info Cards
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      child: Column(
                        children: [
                          _PremiumInfoCard(
                            children: [
                              _PremiumInfoRow(
                                icon: Icons.badge_rounded,
                                label: 'Role',
                                value: _profile?.roleName ?? '',
                                color: AppColors.bluePrimary,
                              ),
                              _PremiumInfoRow(
                                icon: Icons.email_rounded,
                                label: 'Email Address',
                                value: _profile?.email ?? '',
                                color: AppColors.tealPrimary,
                              ),
                              _PremiumInfoRow(
                                icon: Icons.phone_rounded,
                                label: 'Phone Number',
                                value: _profile?.phoneNumber ?? '',
                                color: AppColors.navy,
                              ),
                              _PremiumInfoRow(
                                icon: Icons.inventory_2_rounded,
                                label: 'Assigned Assets',
                                value: '${_profile?.assetsCount ?? 0} Items',
                                color: AppColors.statusMaintenance,
                                isLast: true,
                              ),
                            ],
                          ),

                          const SizedBox(height: 20),

                          // Settings Card
                          _PremiumInfoCard(
                            children: [
                              Padding(
                                padding: const EdgeInsets.all(20),
                                child: Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color:
                                            (isDark
                                                    ? AppColors.darkOnSurface
                                                    : AppColors.navy)
                                                .withValues(alpha: 0.08),
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: Icon(
                                        isDark
                                            ? Icons.dark_mode_rounded
                                            : Icons.light_mode_rounded,
                                        size: 22,
                                        color: isDark
                                            ? AppColors.darkOnSurface
                                            : AppColors.navy,
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            'App Appearance',
                                            style: TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.w600,
                                              color: Theme.of(
                                                context,
                                              ).colorScheme.onSurfaceVariant,
                                            ),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            ThemeModeScope.of(
                                                  context,
                                                ).isDarkMode
                                                ? 'Dark Mode'
                                                : 'Light Mode',
                                            style: TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.w700,
                                              color: Theme.of(
                                                context,
                                              ).colorScheme.onSurface,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Switch(
                                      value: ThemeModeScope.of(
                                        context,
                                      ).isDarkMode,
                                      onChanged: (_) => ThemeModeScope.of(
                                        context,
                                      ).toggleDarkMode(),
                                      activeThumbColor: AppColors.tealLight,
                                      activeTrackColor: AppColors.tealLight
                                          .withValues(alpha: 0.3),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 48),

                          // Premium Logout Button
                          SizedBox(
                            width: double.infinity,
                            child: Material(
                              color: Colors.transparent,
                              child: InkWell(
                                onTap: () => _showLogoutDialog(context),
                                borderRadius: BorderRadius.circular(20),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 18,
                                  ),
                                  decoration: BoxDecoration(
                                    color: AppColors.statusReported.withValues(
                                      alpha: 0.1,
                                    ),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                      color: AppColors.statusReported
                                          .withValues(alpha: 0.3),
                                      width: 1,
                                    ),
                                  ),
                                  child: const Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.logout_rounded,
                                        color: AppColors.statusReported,
                                        size: 22,
                                      ),
                                      SizedBox(width: 12),
                                      Text(
                                        'Log Out',
                                        style: TextStyle(
                                          color: AppColors.statusReported,
                                          fontSize: 16,
                                          fontWeight: FontWeight.w700,
                                          letterSpacing: 0.2,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 48),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Theme.of(context).colorScheme.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text(
          'Log out',
          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 22),
        ),
        content: Text(
          'Are you sure you want to log out of your account?',
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
            fontSize: 15,
          ),
        ),
        actionsPadding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: Text(
              'Cancel',
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx); // Pop the dialog

              setState(() {
                _isLoggingOut = true;
              });

              // Capture navigator before async gap
              final navigator = Navigator.of(context);
              await widget.onLogout();

              if (mounted) {
                // Pop the profile screen so we return to root layout where AuthWrapper handles the switch
                navigator.pop();
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.statusReported,
              foregroundColor: Colors.white,
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              'Log out',
              style: TextStyle(fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }
}

class _PremiumInfoCard extends StatelessWidget {
  final List<Widget> children;

  const _PremiumInfoCard({required this.children});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : Colors.white,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(
          color: isDark
              ? Colors.white.withValues(alpha: 0.04)
              : AppColors.gray100,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Theme.of(
              context,
            ).colorScheme.shadow.withValues(alpha: isDark ? 0.2 : 0.04),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(children: children),
    );
  }
}

class _PremiumInfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;
  final bool isLast;

  const _PremiumInfoRow({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(icon, size: 22, color: color),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      value,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        if (!isLast)
          Padding(
            padding: const EdgeInsets.only(left: 76, right: 20),
            child: Divider(
              height: 1,
              color: (isDark ? Colors.white : AppColors.gray400).withValues(
                alpha: 0.1,
              ),
            ),
          ),
      ],
    );
  }
}
