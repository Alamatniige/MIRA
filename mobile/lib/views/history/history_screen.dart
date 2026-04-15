import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/activity.dart';
import '../../controllers/history_controller.dart';
import '../../core/network/error_formatter.dart';
import '../../services/assets_service.dart';
import '../assets/asset_detail_screen.dart';
import 'reported_issue_detail_screen.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  final HistoryController _controller = HistoryController();
  String _selectedFilter = 'all';
  bool _isLoading = true;
  // Fix 2: proper error state fields
  bool _hasError = false;
  String _errorMessage = '';
  List<ActivityItem> _items = [];

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    if (!mounted) return;
    setState(() {
      _isLoading = true;
      _hasError = false;
      _errorMessage = '';
    });
    try {
      final data = await _controller.loadHistory(_selectedFilter);
      if (mounted) setState(() => _items = data);
    } catch (e) {
      // Fix 2: surface the error instead of swallowing it
      if (mounted) {
        setState(() {
          _hasError = true;
          _errorMessage = formatErrorForUser(e);
        });
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  static const List<Map<String, String>> _filters = [
    {'id': 'all', 'label': 'All Activity'},
    {'id': 'assigned', 'label': 'Assigned'},
    {'id': 'reported', 'label': 'Reported'},
  ];

  void _onSearchChanged(String query) {
    _controller.setSearchQuery(query);
    setState(() => _items = _controller.getFilteredAndSortedItems());
  }

  void _onSortChanged(String field) {
    final newAscending = _controller.sortBy == field
        ? !_controller.sortAscending
        : false;
    _controller.setSort(field, newAscending);
    setState(() => _items = _controller.getFilteredAndSortedItems());
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
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 20, 24, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Activity History',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: Theme.of(context).colorScheme.onSurface,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 20),
                    _buildSearchBar(isDark),
                  ],
                ),
              ),
            ),

            SliverToBoxAdapter(
              child: SizedBox(
                height: 40,
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  itemCount: _filters.length,
                  separatorBuilder: (context, index) =>
                      const SizedBox(width: 12),
                  itemBuilder: (context, index) {
                    final filter = _filters[index];
                    final isSelected = _selectedFilter == filter['id'];
                    return _FilterPill(
                      label: filter['label']!,
                      isSelected: isSelected,
                      onTap: () {
                        setState(() => _selectedFilter = filter['id']!);
                        _loadInitialData();
                      },
                    );
                  },
                ),
              ),
            ),

            // Only show sort controls when we have data
            if (!_isLoading && !_hasError)
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                  child: Row(
                    children: [
                      Text(
                        'Sorting by:',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                      ),
                      const SizedBox(width: 12),
                      _SortOption(
                        label: 'Date',
                        isActive: _controller.sortBy == 'date',
                        isAscending: _controller.sortAscending,
                        onTap: () => _onSortChanged('date'),
                      ),
                      const SizedBox(width: 8),
                      _SortOption(
                        label: 'Name',
                        isActive: _controller.sortBy == 'name',
                        isAscending: _controller.sortAscending,
                        onTap: () => _onSortChanged('name'),
                      ),
                    ],
                  ),
                ),
              ),

            const SliverToBoxAdapter(child: SizedBox(height: 24)),

            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              sliver: _buildBody(isDark),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 48)),
          ],
        ),
      ),
    );
  }

  // Fix 2: tri-state body: loading → error → success list
  Widget _buildBody(bool isDark) {
    if (_isLoading) {
      return const SliverToBoxAdapter(
        child: Center(
          child: Padding(
            padding: EdgeInsets.all(48),
            child: CircularProgressIndicator(),
          ),
        ),
      );
    }

    if (_hasError) {
      return SliverToBoxAdapter(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
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
                  'Failed to load activity',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  _errorMessage,
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: _loadInitialData,
                  child: const Text('Try Again'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return _buildActivitiesList(isDark);
  }

  Widget _buildSearchBar(bool isDark) {
    return Container(
      height: 44,
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark
              ? Colors.white.withValues(alpha: 0.08)
              : AppColors.gray200,
        ),
        boxShadow: [
          if (!isDark)
            BoxShadow(
              color: AppColors.navy.withValues(alpha: 0.02),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
        ],
      ),
      child: TextField(
        onChanged: _onSearchChanged,
        textAlignVertical: TextAlignVertical.center,
        style: TextStyle(
          fontSize: 16,
          color: Theme.of(context).colorScheme.onSurface,
        ),
        decoration: InputDecoration(
          filled: false,
          hintText: 'Search activities...',
          hintStyle: TextStyle(
            fontSize: 15,
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
          border: InputBorder.none,
          enabledBorder: InputBorder.none,
          focusedBorder: InputBorder.none,
          prefixIcon: Icon(
            Icons.search_rounded,
            size: 20,
            color: Theme.of(context).colorScheme.primary,
          ),
          contentPadding: const EdgeInsets.symmetric(
            vertical: 0,
            horizontal: 16,
          ),
          isDense: false,
        ),
      ),
    );
  }

  Widget _buildActivitiesList(bool isDark) {
    // Fix P3: distinct empty state copy — never reused for error states
    if (_items.isEmpty) {
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
                  'No activity yet',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Try adjusting your filters or search',
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
      delegate: SliverChildBuilderDelegate((context, index) {
        final item = _items[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: _ActivityCard(
            activity: item,
            onTap: () => _openAsset(context, item),
          ),
        );
      }, childCount: _items.length),
    );
  }

  void _openAsset(BuildContext context, ActivityItem activity) async {
    try {
      final assetsService = AssetsService();

      if (activity.type == 'reported') {
        final reports = await assetsService.getReportedIssues();
        final issue = reports.firstWhere(
          (r) => r.id == activity.id,
          orElse: () => throw Exception('Issue report not found'),
        );

        if (context.mounted) {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => ReportedIssueDetailScreen(issue: issue),
            ),
          );
        }
        return;
      }

      final assetDto = await assetsService.getAssetDetails(activity.assetId);
      if (context.mounted) {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => AssetDetailScreen(
              asset: assetDto.toAsset(),
              viewMode: AssetDetailViewMode.browse,
            ),
          ),
        );
      }
    } catch (e) {
      // Fix M4: use formatter instead of e.toString()
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Could not load details: ${formatErrorForUser(e)}'),
          ),
        );
      }
    }
  }
}

class _SortOption extends StatelessWidget {
  final String label;
  final bool isActive;
  final bool isAscending;
  final VoidCallback onTap;

  const _SortOption({
    required this.label,
    required this.isActive,
    required this.isAscending,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primaryColor = isDark ? AppColors.tealLight : AppColors.tealPrimary;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isActive
              ? primaryColor.withValues(alpha: 0.1)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isActive
                ? primaryColor
                : (isDark
                      ? Colors.white.withValues(alpha: 0.1)
                      : AppColors.gray200),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: isActive
                    ? primaryColor
                    : Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
            if (isActive) ...[
              const SizedBox(width: 4),
              Icon(
                isAscending
                    ? Icons.arrow_upward_rounded
                    : Icons.arrow_downward_rounded,
                size: 14,
                color: primaryColor,
              ),
            ],
          ],
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
          padding: const EdgeInsets.symmetric(horizontal: 16),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: isSelected
                  ? Colors.transparent
                  : (isDark
                        ? Colors.white.withValues(alpha: 0.08)
                        : AppColors.gray200),
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: primaryColor.withValues(alpha: 0.3),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ]
                : null,
          ),
          child: Text(
            label,
            style: TextStyle(
              color: textColor,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
              fontSize: 14,
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

  const _ActivityCard({required this.activity, required this.onTap});

  Color _statusColor() {
    if (activity.type == 'reported') return AppColors.statusReported;

    switch (activity.action) {
      case 'Assigned':
        return AppColors.statusActive;
      case 'Pending':
        return AppColors.statusMaintenance;
      case 'Rejected':
        return AppColors.statusReported;
      case 'Returned':
        return AppColors.statusDisposed;
      default:
        return AppColors.statusDisposed;
    }
  }

  IconData _statusIcon() {
    if (activity.type == 'reported') return Icons.warning_rounded;

    switch (activity.action) {
      case 'Assigned':
        return Icons.check_circle_rounded;
      case 'Pending':
        return Icons.hourglass_empty_rounded;
      case 'Rejected':
        return Icons.cancel_rounded;
      case 'Returned':
        return Icons.history_rounded;
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
          color: isDark
              ? Colors.white.withValues(alpha: 0.05)
              : AppColors.gray200,
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
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(_statusIcon(), color: color, size: 18),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            activity.assetName,
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: Theme.of(context).colorScheme.onSurface,
                            ),
                          ),
                          Text(
                            'Status · $formattedDate',
                            style: TextStyle(
                              fontSize: 12,
                              color: Theme.of(
                                context,
                              ).colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        activity.action.toUpperCase(),
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
                  padding: EdgeInsets.symmetric(vertical: 10),
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
                const SizedBox(height: 8),
                if (activity.description != null &&
                    activity.description!.isNotEmpty) ...[
                  Text(
                    activity.description!,
                    style: TextStyle(
                      fontSize: 14,
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 8),
                ],
                Row(
                  children: [
                    Icon(
                      Icons.access_time_rounded,
                      size: 16,
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '${dt.day}/${dt.month}/${dt.year} at ${dt.hour}:${dt.minute.toString().padLeft(2, '0')}',
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
}
