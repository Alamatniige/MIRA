import 'package:flutter/material.dart';

import '../../core/network/error_formatter.dart';
import '../../services/assets_service.dart';
import '../../dto/return_qr_scan_dto.dart';
import '../../theme/app_theme.dart';

enum _ReturnSheetState { loading, empty, list, confirming, success, error }

class ReturnAssetSheet extends StatefulWidget {
  const ReturnAssetSheet({super.key, required this.scannedData});

  final String scannedData;

  @override
  State<ReturnAssetSheet> createState() => _ReturnAssetSheetState();
}

class _ReturnAssetSheetState extends State<ReturnAssetSheet> {
  final _service = AssetsService();

  _ReturnSheetState _state = _ReturnSheetState.loading;
  List<ReturnableAssignmentDto> _assignments = [];
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _loadAssignments();
  }

  Future<void> _loadAssignments() async {
    setState(() => _state = _ReturnSheetState.loading);
    try {
      final result = await _service.scanReturnQr(widget.scannedData);
      setState(() {
        _assignments = result.assignments;
        _state = result.assignments.isEmpty
            ? _ReturnSheetState.empty
            : _ReturnSheetState.list;
      });
    } catch (e) {
      setState(() {
        // Fix 4: formatted message, not raw e.toString()
        _errorMessage = formatErrorForUser(e);
        _state = _ReturnSheetState.error;
      });
    }
  }

  Future<void> _confirmReturn(ReturnableAssignmentDto item) async {
    setState(() => _state = _ReturnSheetState.confirming);
    try {
      await _service.returnAsset(item.assetId);
      setState(() => _state = _ReturnSheetState.success);
    } catch (e) {
      setState(() => _state = _ReturnSheetState.list);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            // Fix 4: formatted message, not raw e.toString()
            content: Text('Failed to return asset: ${formatErrorForUser(e)}'),
            backgroundColor: AppColors.statusReported,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppColors.navy.withValues(alpha: 0.12),
            blurRadius: 24,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Drag handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.gray300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Title row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Return an Asset',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.navy,
                  ),
                ),
                if (_state != _ReturnSheetState.confirming)
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, size: 20),
                    style: IconButton.styleFrom(
                      foregroundColor: AppColors.gray500,
                    ),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            const Divider(height: 1, color: AppColors.gray100),
            const SizedBox(height: 20),

            // State body
            _buildBody(),
          ],
        ),
      ),
    );
  }

  Widget _buildBody() {
    switch (_state) {
      case _ReturnSheetState.loading:
        return const _CenteredContent(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation(AppColors.tealPrimary),
          ),
        );

      case _ReturnSheetState.empty:
        return const _CenteredContent(
          child: Column(
            children: [
              Icon(
                Icons.inventory_2_outlined,
                size: 48,
                color: AppColors.gray400,
              ),
              SizedBox(height: 12),
              Text(
                'No active assignments to return.',
                style: TextStyle(fontSize: 14, color: AppColors.gray500),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        );

      case _ReturnSheetState.list:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Select the asset you want to return:',
              style: TextStyle(
                fontSize: 12,
                color: AppColors.gray500,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 12),
            ConstrainedBox(
              constraints: const BoxConstraints(maxHeight: 360),
              child: ListView.separated(
                shrinkWrap: true,
                itemCount: _assignments.length,
                separatorBuilder: (_, _) =>
                    const Divider(height: 1, color: AppColors.gray100),
                itemBuilder: (context, index) {
                  final item = _assignments[index];
                  return _AssignmentTile(
                    item: item,
                    onTap: () => _confirmReturn(item),
                  );
                },
              ),
            ),
          ],
        );

      case _ReturnSheetState.confirming:
        return const _CenteredContent(
          child: Column(
            children: [
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation(AppColors.tealPrimary),
              ),
              SizedBox(height: 16),
              Text(
                'Processing return…',
                style: TextStyle(fontSize: 14, color: AppColors.gray500),
              ),
            ],
          ),
        );

      case _ReturnSheetState.success:
        return _CenteredContent(
          child: Column(
            children: [
              const Icon(
                Icons.check_circle_outline,
                size: 64,
                color: AppColors.tealPrimary,
              ),
              const SizedBox(height: 16),
              const Text(
                'Asset Returned Successfully',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.navy,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'The asset has been checked back in.',
                style: TextStyle(fontSize: 13, color: AppColors.gray500),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.tealPrimary,
                    foregroundColor: AppColors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
                  ),
                  child: const Text(
                    'Done',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            ],
          ),
        );

      case _ReturnSheetState.error:
        return _CenteredContent(
          child: Column(
            children: [
              const Icon(
                Icons.error_outline,
                size: 48,
                color: AppColors.statusReported,
              ),
              const SizedBox(height: 12),
              const Text(
                'Something went wrong',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: AppColors.navy,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Text(
                _errorMessage,
                style: const TextStyle(fontSize: 12, color: AppColors.gray500),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: _loadAssignments,
                child: const Text(
                  'Try Again',
                  style: TextStyle(color: AppColors.tealPrimary),
                ),
              ),
            ],
          ),
        );
    }
  }
}

/// Wraps a child with min-height padding so spinner/empty/etc. states look good.
class _CenteredContent extends StatelessWidget {
  const _CenteredContent({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 24),
        child: Center(child: child),
      ),
    );
  }
}

class _AssignmentTile extends StatelessWidget {
  const _AssignmentTile({required this.item, required this.onTap});

  final ReturnableAssignmentDto item;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: AppColors.tealMuted,
          borderRadius: BorderRadius.circular(10),
        ),
        child: const Icon(
          Icons.computer_outlined,
          color: AppColors.tealDark,
          size: 20,
        ),
      ),
      title: Text(
        item.assetName,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: AppColors.navy,
        ),
      ),
      subtitle: Text(
        '${item.assetTag} · ${item.department}',
        style: const TextStyle(fontSize: 12, color: AppColors.gray500),
      ),
      trailing: _statusChip(item.status),
      onTap: onTap,
    );
  }

  Widget _statusChip(String status) {
    final isConfirmed = status.toUpperCase() == 'CONFIRMED';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: isConfirmed ? AppColors.tealMuted : const Color(0xFFFEF3C7),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        isConfirmed ? 'Confirmed' : 'Pending',
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: isConfirmed ? AppColors.tealDark : const Color(0xFF92400E),
        ),
      ),
    );
  }
}
