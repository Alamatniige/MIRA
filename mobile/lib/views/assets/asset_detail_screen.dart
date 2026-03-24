import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/asset.dart';
import '../../widgets/status_badge.dart';
import '../../dto/asset_response_dto.dart';
import '../../services/assets_service.dart';

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
    final descController = TextEditingController();
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Report an Issue'),
        content: TextField(
          controller: descController,
          decoration: const InputDecoration(
            labelText: 'Description',
            hintText: 'Describe the issue…',
          ),
          maxLines: 4,
          textCapitalization: TextCapitalization.sentences,
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(
              backgroundColor: AppColors.statusReported,
            ),
            onPressed: () {
              if (descController.text.trim().isEmpty) return;
              Navigator.pop(ctx, true);
            },
            child: const Text('Submit Report'),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;
    final description = descController.text.trim();
    if (description.isEmpty) return;

    setState(() => _isReporting = true);
    try {
      await _service.reportIssue(_assetUuid ?? widget.asset.id, description);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Issue reported successfully.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to report issue: $e'),
          behavior: SnackBarBehavior.floating,
          backgroundColor: AppColors.statusReported,
        ),
      );
    } finally {
      if (mounted) setState(() => _isReporting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final disabledReason = _requestDisabledReason;

    return Scaffold(
      appBar: AppBar(title: Text(widget.asset.id)),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (disabledReason != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Text(
                    disabledReason,
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 12, color: AppColors.gray500),
                  ),
                ),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _isReporting ? null : _handleReportIssue,
                      icon: _isReporting
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.report_outlined),
                      label: const Text('Report Issue'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.statusReported,
                        side: const BorderSide(color: AppColors.statusReported),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: FilledButton.icon(
                      onPressed: (_canRequest && !_isRequesting)
                          ? _handleRequestAssignment
                          : null,
                      icon: _isRequesting
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Icon(Icons.assignment_outlined),
                      label: const Text('Request Asset'),
                      style: FilledButton.styleFrom(
                        backgroundColor: AppColors.tealPrimary,
                        padding: const EdgeInsets.symmetric(vertical: 12),
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
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.navy.withValues(alpha: 0.06),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
                border: Border.all(color: AppColors.gray200),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.tealMuted,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      Icons.inventory_2_outlined,
                      color: AppColors.teal,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.asset.name,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: AppColors.navyLight,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${widget.asset.id} · ${widget.asset.category}',
                          style: TextStyle(
                            fontSize: 13,
                            color: AppColors.gray500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  StatusBadge(status: widget.asset.status),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Details grid - matches web modal
            _DetailRow(
              label: 'Serial Number',
              value: widget.asset.serialNumber,
            ),
            _DetailRow(label: 'Location', value: widget.asset.location),
            _DetailRow(
              label: 'Assigned To',
              value: widget.asset.assignedTo ?? 'Unassigned',
            ),
            _DetailRow(
              label: 'Purchase Date',
              value: widget.asset.purchaseDate,
            ),
            _DetailRow(
              label: 'Warranty',
              value: 'Until ${widget.asset.warrantyExpiry}',
            ),
            const SizedBox(height: 16),
            if (widget.asset.specifications.isNotEmpty)
              _DetailRow(
                label: 'Specifications',
                value: widget.asset.specifications,
              ),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _DetailRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: AppColors.gray500,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(fontSize: 14, color: AppColors.navyLight),
          ),
        ],
      ),
    );
  }
}
