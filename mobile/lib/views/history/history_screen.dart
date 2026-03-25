import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../data/mock_data.dart';
import '../../data/mock_data.dart';
import '../../models/activity.dart';
import '../../dto/issue_report_dto.dart';
import '../../services/assets_service.dart';
import '../assets/asset_detail_screen.dart';
import 'reported_issue_detail_screen.dart';

/// Activity History - modern premium timeline with pill filters and glowing cards
class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  String _selectedFilter = 'all';
  bool _isLoading = true;
  bool _isLoadingIssues = false;
  List<IssueReportDto> _reportedIssues = [];
  final AssetsService _assetsService = AssetsService();

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    // Mock general activity load
    await Future.delayed(const Duration(milliseconds: 600));
    if (mounted) setState(() => _isLoading = false);
    
    // Load real reported issues quietly in parallel
    _fetchReportedIssues();
  }

  Future<void> _fetchReportedIssues() async {
    if (!mounted) return;
    setState(() => _isLoadingIssues = true);
    try {
      final issues = await _assetsService.getReportedIssues();
      if (mounted) setState(() => _reportedIssues = issues);
    } catch (_) {
      // ignore
    } finally {
      if (mounted) setState(() => _isLoadingIssues = false);
    }
  }

  static const List<Map<String, String>> _filters = [
    {'id': 'all', 'label': 'All Activity'},
    {'id': 'assigned', 'label': 'Assigned'},
    {'id': 'reported', 'label': 'Reported Issues'},
    {'id': 'maintenance', 'label': 'Maintenance'},
  ];

  List<ActivityItem> get _filteredActivities {
    if (_selectedFilter == 'all') return mockActivityHistory;
    return mockActivityHistory.where((a) => a.type == _selectedFilter).toList();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.gray50,
      body: SafeArea(
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(
            parent: AlwaysScrollableScrollPhysics(),
          ),
          slivers: [
            // Modern floating header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 32, 24, 20),
                child: Text(
                  'Activity History',
                  style: TextStyle(
                    fontSize: 34,
                    fontWeight: FontWeight.w800,
                    color: Theme.of(context).colorScheme.onSurface,
                    letterSpacing: -0.5,
                  ),
                ),
              ),
            ),
            
            // Premium Filter pills
            SliverToBoxAdapter(
              child: SizedBox(
                height: 48,
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  itemCount: _filters.length,
                  separatorBuilder: (context, index) => const SizedBox(width: 12),
                  itemBuilder: (context, index) {
                    final filter = _filters[index];
                    final isSelected = _selectedFilter == filter['id'];
                    return _FilterPill(
                      label: filter['label']!,
                      isSelected: isSelected,
                      onTap: () => setState(() => _selectedFilter = filter['id']!),
                    );
                  },
                ),
              ),
            ),
            
            const SliverToBoxAdapter(child: SizedBox(height: 32)),
            
            // Timeline Content
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              sliver: _isLoading || (_selectedFilter == 'reported' && _isLoadingIssues)
                  ? const SliverToBoxAdapter(
                      child: Center(
                        child: Padding(
                          padding: EdgeInsets.all(48),
                          child: CircularProgressIndicator(),
                        ),
                      ),
                    )
                  : (_selectedFilter == 'reported')
                      ? _buildReportedIssuesList(isDark)
                      : _buildMockActivitiesList(isDark),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 48)),
          ],
        ),
      ),
    );
  }

  Widget _buildMockActivitiesList(bool isDark) {
    if (_filteredActivities.isEmpty) {
      return SliverToBoxAdapter(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(48),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: isDark 
                        ? AppColors.darkSurfaceVariant.withValues(alpha: 0.5)
                        : AppColors.tealMuted.withValues(alpha: 0.5),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.history_rounded,
                    size: 56,
                    color: isDark 
                        ? AppColors.tealLight.withValues(alpha: 0.7)
                        : AppColors.tealPrimary.withValues(alpha: 0.7),
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'No activity found',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Try selecting a different filter',
                  style: TextStyle(
                    fontSize: 14,
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }
    
    return SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, index) {
          final item = _filteredActivities[index];
          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: _ActivityCard(
              activity: item,
              onTap: () => _openAsset(context, item),
            ),
          );
        },
        childCount: _filteredActivities.length,
      ),
    );
  }

  Widget _buildReportedIssuesList(bool isDark) {
    if (_reportedIssues.isEmpty) {
      return SliverToBoxAdapter(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(48),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.check_circle_outline_rounded, size: 64, color: AppColors.tealLight),
                const SizedBox(height: 16),
                Text(
                  'No issues reported',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: Theme.of(context).colorScheme.onSurface),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, index) {
          final issue = _reportedIssues[index];
          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: _ReportedIssueCard(
              issue: issue,
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => ReportedIssueDetailScreen(issue: issue),
                  ),
                );
              },
            ),
          );
        },
        childCount: _reportedIssues.length,
      ),
    );
  }

  void _openAsset(BuildContext context, ActivityItem activity) {
    final asset = findAssetById(activity.assetId);
    if (asset != null) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => AssetDetailScreen(asset: asset),
        ),
      );
    }
  }
}

class _ReportedIssueCard extends StatelessWidget {
  final IssueReportDto issue;
  final VoidCallback onTap;
  const _ReportedIssueCard({required this.issue, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final dt = DateTime.tryParse(issue.reportAt) ?? DateTime.now();
    final formattedDate = '${dt.day}/${dt.month}/${dt.year}';

    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? Colors.white.withValues(alpha: 0.05) : AppColors.gray200,
        ),
        boxShadow: [
          BoxShadow(
            color: Theme.of(context).colorScheme.shadow.withValues(alpha: 0.04),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(24),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.statusReported.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(Icons.warning_rounded, color: AppColors.statusReported, size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            issue.assetName,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: Theme.of(context).colorScheme.onSurface,
                            ),
                          ),
                          Text(
                            'Tag: ${issue.assetTag} · $formattedDate',
                            style: TextStyle(
                              fontSize: 12,
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.darkSurfaceVariant : AppColors.gray100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        issue.status.toUpperCase(),
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  child: Divider(height: 1),
                ),
                Text(
                  'Issue Description',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  issue.description.isNotEmpty ? issue.description : 'No description provided.',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: Theme.of(context).colorScheme.onSurface,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Icon(Icons.person_rounded, size: 16, color: Theme.of(context).colorScheme.onSurfaceVariant),
                    const SizedBox(width: 6),
                    Text(
                      'Reported by ${issue.userName}',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const Spacer(),
                    // Placeholder for Images preview
                    Icon(Icons.image_outlined, size: 18, color: Theme.of(context).colorScheme.primary),
                    const SizedBox(width: 4),
                    Text(
                      '0 Photos',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Theme.of(context).colorScheme.primary,
                      ),
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

class _FilterPill extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterPill({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    final primaryColor = isDark ? AppColors.tealLight : AppColors.tealPrimary;
    final backgroundColor = isSelected 
        ? primaryColor 
        : (isDark ? AppColors.darkSurface : Colors.white);
        
    final textColor = isSelected 
        ? Colors.white 
        : Theme.of(context).colorScheme.onSurfaceVariant;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(24),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: isSelected 
                  ? Colors.transparent 
                  : (isDark ? Colors.white.withValues(alpha: 0.08) : AppColors.gray200),
              width: 1,
            ),
            boxShadow: isSelected ? [
              BoxShadow(
                color: primaryColor.withValues(alpha: 0.3),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ] : null,
          ),
          child: Text(
            label,
            style: TextStyle(
              color: textColor,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
              fontSize: 14,
              letterSpacing: 0.2,
            ),
          ),
        ),
      ),
    );
  }
}

class _ActivityCard extends StatelessWidget {
  final ActivityItem activity;
  final VoidCallback onTap;

  const _ActivityCard({
    required this.activity,
    required this.onTap,
  });

  Color _statusColor() {
    switch (activity.type) {
      case 'assigned':
        return AppColors.statusActive;
      case 'reported':
        return AppColors.statusReported;
      case 'maintenance':
        return AppColors.statusMaintenance;
      default:
        return AppColors.statusDisposed;
    }
  }

  IconData _statusIcon() {
    switch (activity.type) {
      case 'assigned':
        return Icons.person_add_alt_rounded;
      case 'reported':
        return Icons.warning_rounded;
      case 'maintenance':
        return Icons.build_rounded;
      default:
        return Icons.history_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final color = _statusColor();
    final dt = activity.dateTime;
    final formattedDate = '${dt.day}/${dt.month}/${dt.year}';

    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? Colors.white.withValues(alpha: 0.05) : AppColors.gray200,
        ),
        boxShadow: [
          BoxShadow(
            color: Theme.of(context).colorScheme.shadow.withValues(alpha: 0.04),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(24),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(_statusIcon(), color: color, size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            activity.assetName,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: Theme.of(context).colorScheme.onSurface,
                            ),
                          ),
                          Text(
                            'Action · $formattedDate',
                            style: TextStyle(
                              fontSize: 12,
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        activity.type.toUpperCase(),
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: color,
                        ),
                      ),
                    ),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  child: Divider(height: 1),
                ),
                Text(
                  'Activity Details',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  activity.action,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: Theme.of(context).colorScheme.onSurface,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Icon(Icons.access_time_rounded, size: 16, color: Theme.of(context).colorScheme.onSurfaceVariant),
                    const SizedBox(width: 6),
                    Text(
                      _formatDateFull(activity.dateTime),
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
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

  String _formatDateFull(DateTime dt) {
    return '${dt.day}/${dt.month}/${dt.year} at ${dt.hour}:${dt.minute.toString().padLeft(2, '0')}';
  }
}
