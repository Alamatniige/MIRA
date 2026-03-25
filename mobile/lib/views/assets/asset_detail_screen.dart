import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/asset.dart';
import '../../widgets/status_badge.dart';
import '../../dto/asset_response_dto.dart';
import '../../services/assets_service.dart';
import 'report_issue_screen.dart';

/// Asset detail - matches web AssetDetailsModal
class AssetDetailScreen extends StatefulWidget {
  final Asset asset;

  /// Live DTO from the API, used to drive action button state.
  /// When null the action buttons are still shown but in a safe disabled state.
  final AssetResponseDto? liveAsset;

  const AssetDetailScreen({super.key, required this.asset, this.liveAsset});

  @override
  State<AssetDetailScreen> createState() => _AssetDetailScreenState();
}

class _AssetDetailScreenState extends State<AssetDetailScreen> {
  final _service = AssetsService();
  bool _isRequesting = false;
  bool _isReporting = false;

  // Mutable copy so it can be refreshed after actions
  AssetResponseDto? _liveAsset;

  @override
  void initState() {
    super.initState();
    _liveAsset = widget.liveAsset;
  }

  String? get _assetUuid => _liveAsset?.id ?? widget.liveAsset?.id;

  bool get _canRequest =>
      _liveAsset?.assignmentStatus?.toLowerCase() == 'available';

  String? get _requestDisabledReason {
    final status = _liveAsset?.assignmentStatus?.toLowerCase();
    if (status == null) return null;
    if (status == 'pending')
      return 'A request is already pending for this asset.';
    if (status == 'unavailable' || status == 'approved')
      return 'This asset is currently unavailable.';
    return null;
  }

  Future<void> _refreshLiveAsset() async {
    final id = _assetUuid;
    if (id == null || id.isEmpty) return;
    try {
      final updated = await _service.getAssetDetails(id);
      if (mounted) setState(() => _liveAsset = updated);
    } catch (_) {
      // Refresh is best-effort; ignore failures
    }
  }

  Future<void> _handleRequestAssignment() async {
    // Show optional notes dialog
    final notesController = TextEditingController();
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Request Assignment'),
        content: TextField(
          controller: notesController,
          decoration: const InputDecoration(
            labelText: 'Notes (optional)',
            hintText: 'Any additional information…',
          ),
          maxLines: 3,
          textCapitalization: TextCapitalization.sentences,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Submit Request'),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;

    setState(() => _isRequesting = true);
    try {
      await _service.requestAssignment(
        _assetUuid ?? widget.asset.id,
        notes: notesController.text.trim(),
      );
      if (!mounted) return;
      // Refresh so the button reflects the new Pending state immediately
      await _refreshLiveAsset();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Assignment request submitted successfully.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      // Re-sync UI with server state (handles stale-data 409)
      await _refreshLiveAsset();
      final message = e.toString().contains('409')
          ? 'This asset is no longer available for request.'
          : 'Failed to submit request: $e';
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          behavior: SnackBarBehavior.floating,
          backgroundColor: AppColors.statusReported,
        ),
      );
    } finally {
      if (mounted) setState(() => _isRequesting = false);
    }
  }

  Future<void> _handleReportIssue() async {
    final reported = await Navigator.of(context).push<bool>(
      MaterialPageRoute(
        builder: (_) => ReportIssueScreen(
          asset: widget.asset,
          assetIdToReport: _assetUuid ?? widget.asset.id,
        ),
      ),
    );

    if (reported == true && mounted) {
      // Refresh the asset to ensure the UI shows any status updates
      await _refreshLiveAsset();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final disabledReason = _requestDisabledReason;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'Asset Details',
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurface,
            fontWeight: FontWeight.w700,
            letterSpacing: -0.3,
          ),
        ),
        elevation: 0,
        backgroundColor: Colors.transparent,
        iconTheme: IconThemeData(
          color: Theme.of(context).colorScheme.onSurface,
        ),
        centerTitle: true,
      ),
      bottomNavigationBar: SafeArea(
        child: Container(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            border: Border(
              top: BorderSide(
                color: isDark ? Colors.white.withValues(alpha: 0.05) : AppColors.gray200.withValues(alpha: 0.5),
                width: 1,
              ),
            ),
            boxShadow: [
              BoxShadow(
                color: Theme.of(context).colorScheme.shadow.withValues(alpha: isDark ? 0.2 : 0.05),
                blurRadius: 20,
                offset: const Offset(0, -4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (disabledReason != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Text(
                    disabledReason,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Theme.of(context).colorScheme.onSurfaceVariant.withValues(alpha: 0.8),
                    ),
                  ),
                ),
              Row(
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppColors.statusReported.withValues(alpha: isDark ? 0.12 : 0.08),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: AppColors.statusReported.withValues(alpha: isDark ? 0.3 : 0.2),
                          width: 1.5,
                        ),
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: _isReporting ? null : _handleReportIssue,
                          borderRadius: BorderRadius.circular(16),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                if (_isReporting)
                                  const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.statusReported),
                                  )
                                else
                                  const Icon(Icons.report_outlined, color: AppColors.statusReported, size: 20),
                                const SizedBox(width: 8),
                                const Text(
                                  'Report Issue',
                                  style: TextStyle(
                                    color: AppColors.statusReported,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 15,
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
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: (_canRequest && !_isRequesting) ? AppColors.primaryGradient : null,
                        color: (_canRequest && !_isRequesting) 
                            ? null 
                            : (isDark ? AppColors.darkSurfaceVariant.withValues(alpha: 0.5) : AppColors.gray200),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: (_canRequest && !_isRequesting)
                            ? [
                                BoxShadow(
                                  color: AppColors.tealPrimary.withValues(alpha: isDark ? 0.4 : 0.2),
                                  blurRadius: 16,
                                  offset: const Offset(0, 4),
                                )
                              ]
                            : [],
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: (_canRequest && !_isRequesting) ? _handleRequestAssignment : null,
                          borderRadius: BorderRadius.circular(16),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                if (_isRequesting)
                                  const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                  )
                                else
                                  Icon(
                                    Icons.assignment_outlined, 
                                    color: (_canRequest && !_isRequesting) 
                                        ? Colors.white 
                                        : Theme.of(context).colorScheme.onSurfaceVariant.withValues(alpha: 0.5), 
                                    size: 20),
                                const SizedBox(width: 8),
                                Text(
                                  'Request Asset',
                                  style: TextStyle(
                                    color: (_canRequest && !_isRequesting) 
                                        ? Colors.white 
                                        : Theme.of(context).colorScheme.onSurfaceVariant.withValues(alpha: 0.5),
                                    fontWeight: FontWeight.w700,
                                    fontSize: 15,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Elegant Centered Header
            Container(
              width: 88,
              height: 88,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.1),
                boxShadow: [
                  BoxShadow(
                    color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.05),
                    blurRadius: 24,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Icon(
                Icons.inventory_2_rounded,
                size: 40,
                color: Theme.of(context).colorScheme.primary,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              widget.asset.name,
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.w800,
                color: Theme.of(context).colorScheme.onSurface,
                letterSpacing: -0.5,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            StatusBadge(status: widget.asset.status),
            const SizedBox(height: 36),

            // Images Gallery
            if (widget.asset.images.isNotEmpty) ...[
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Asset Photos',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: Theme.of(context).colorScheme.onSurface,
                    letterSpacing: -0.3,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                height: 220,
                child: ListView.separated(
                  physics: const BouncingScrollPhysics(),
                  scrollDirection: Axis.horizontal,
                  clipBehavior: Clip.none,
                  itemCount: widget.asset.images.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 16),
                  itemBuilder: (context, index) {
                    final img = widget.asset.images[index];
                    final fullUrl = img.startsWith('http') 
                        ? img 
                        : '${const String.fromEnvironment('API_BASE_URL', defaultValue: 'http://10.0.2.2:8080')}$img';
                    return Container(
                      width: 280,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Theme.of(context).colorScheme.shadow.withValues(alpha: 0.08),
                            blurRadius: 16,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          color: Theme.of(context).colorScheme.surfaceVariant,
                          child: Image.network(
                            fullUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Center(
                                child: Icon(
                                  Icons.broken_image_rounded,
                                  color: Theme.of(context).colorScheme.onSurfaceVariant.withValues(alpha: 0.5),
                                  size: 48,
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 36),
            ],

            // Details Card
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Information',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Theme.of(context).colorScheme.onSurface,
                  letterSpacing: -0.3,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Container(
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Theme.of(context).colorScheme.shadow.withValues(alpha: 0.04),
                    blurRadius: 24,
                    offset: const Offset(0, 8),
                  ),
                ],
                border: Border.all(
                  color: isDark ? Colors.white.withValues(alpha: 0.08) : AppColors.gray200,
                  width: 1,
                ),
              ),
              child: Column(
                children: [
                  _DetailRow(icon: Icons.tag_rounded, label: 'Asset Tag', value: widget.asset.id),
                  _Divider(isDark: isDark),
                  _DetailRow(icon: Icons.category_rounded, label: 'Category', value: widget.asset.category),
                  _Divider(isDark: isDark),
                  _DetailRow(icon: Icons.numbers_rounded, label: 'Serial Number', value: widget.asset.serialNumber),
                  _Divider(isDark: isDark),
                  _DetailRow(icon: Icons.location_on_rounded, label: 'Location', value: widget.asset.location),
                  _Divider(isDark: isDark),
                  _DetailRow(icon: Icons.person_rounded, label: 'Assigned To', value: widget.asset.assignedTo ?? 'Unassigned'),
                  if (widget.asset.specifications.isNotEmpty) ...[
                    _Divider(isDark: isDark),
                    _DetailRow(icon: Icons.info_outline_rounded, label: 'Specifications', value: widget.asset.specifications),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Divider extends StatelessWidget {
  final bool isDark;
  const _Divider({required this.isDark});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Divider(
      height: 1,
      thickness: 1,
      color: isDark ? Colors.white.withValues(alpha: 0.08) : AppColors.gray100,
      indent: 56,
      endIndent: 20,
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _DetailRow({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surfaceVariant.withValues(alpha: isDark ? 0.3 : 1.0),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              icon,
              size: 20,
              color: isDark ? Theme.of(context).colorScheme.onSurfaceVariant : AppColors.gray500,
            ),
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
                    fontWeight: FontWeight.w500,
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
