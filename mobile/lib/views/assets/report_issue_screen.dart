import 'package:flutter/material.dart';
import '../../models/asset.dart';
import '../../services/assets_service.dart';
import '../../theme/app_theme.dart';

class ReportIssueScreen extends StatefulWidget {
  final Asset asset;
  final String assetIdToReport; // Allows passing actual UUID

  const ReportIssueScreen({
    super.key,
    required this.asset,
    required this.assetIdToReport,
  });

  @override
  State<ReportIssueScreen> createState() => _ReportIssueScreenState();
}

class _ReportIssueScreenState extends State<ReportIssueScreen> {
  final TextEditingController _descController = TextEditingController();
  final AssetsService _service = AssetsService();
  
  bool _isSubmitting = false;

  @override
  void dispose() {
    _descController.dispose();
    super.dispose();
  }

  Future<void> _submitReport() async {
    final description = _descController.text.trim();
    if (description.isEmpty) return;

    setState(() => _isSubmitting = true);
    try {
      await _service.reportIssue(widget.assetIdToReport, description);
      
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Issue reported successfully.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      Navigator.of(context).pop(true); // Return true to indicate success
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
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.gray50,
      appBar: AppBar(
        title: Text(
          'Report Issue',
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
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            boxShadow: [
              BoxShadow(
                color: Theme.of(context).colorScheme.shadow.withValues(alpha: 0.05),
                blurRadius: 20,
                offset: const Offset(0, -4),
              ),
            ],
          ),
          child: FilledButton(
            onPressed: (_isSubmitting || _descController.text.trim().isEmpty) 
               ? null 
               : _submitReport,
            style: FilledButton.styleFrom(
              backgroundColor: AppColors.statusReported,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: _isSubmitting
                ? const SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                  )
                : const Text(
                    'Submit Report',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                  ),
          ),
        ),
      ),
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Asset Header Info
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkSurfaceVariant : AppColors.tealMuted,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isDark ? Colors.white.withValues(alpha: 0.05) : AppColors.tealLight.withValues(alpha: 0.3),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.darkSurface : Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.warning_amber_rounded,
                        color: AppColors.statusReported,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Reporting on:',
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark ? AppColors.darkOnSurfaceVariant : AppColors.tealDark,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            widget.asset.name,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: isDark ? Colors.white : AppColors.navy,
                            ),
                          ),
                          Text(
                            '${widget.asset.category} · ${widget.asset.id}',
                            style: TextStyle(
                              fontSize: 13,
                              color: isDark ? AppColors.darkOnSurfaceVariant : AppColors.tealDark.withValues(alpha: 0.8),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              Text(
                'Issue Details',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Theme.of(context).colorScheme.onSurface,
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Describe the problem you are experiencing with this asset clearly so our IT team can help.',
                style: TextStyle(
                  fontSize: 14,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 20),

              TextField(
                controller: _descController,
                autofocus: true,
                maxLines: 6,
                textInputAction: TextInputAction.done,
                textCapitalization: TextCapitalization.sentences,
                onChanged: (_) => setState(() {}),
                style: TextStyle(
                  fontSize: 15,
                  color: Theme.of(context).colorScheme.onSurface,
                ),
                decoration: InputDecoration(
                  hintText: 'E.g., The screen is flickering and there is a crack on the bottom left corner...',
                  hintStyle: TextStyle(
                    color: Theme.of(context).colorScheme.onSurfaceVariant.withValues(alpha: 0.6),
                  ),
                  filled: true,
                  fillColor: Theme.of(context).colorScheme.surface,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(
                      color: isDark ? Colors.white.withValues(alpha: 0.1) : AppColors.gray200,
                    ),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(
                      color: isDark ? Colors.white.withValues(alpha: 0.1) : AppColors.gray200,
                    ),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(
                      color: AppColors.statusReported,
                      width: 2,
                    ),
                  ),
                  contentPadding: const EdgeInsets.all(20),
                ),
              ),
              const SizedBox(height: 24),
              
              // Placeholder for future Photo Upload feature
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 24),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isDark ? Colors.white.withValues(alpha: 0.1) : AppColors.gray200,
                    style: BorderStyle.none, // Hide border if dashed isn't used easily
                  ),
                ),
                child: Column(
                  children: [
                    Icon(
                      Icons.add_a_photo_outlined,
                      size: 32,
                      color: Theme.of(context).colorScheme.onSurfaceVariant.withValues(alpha: 0.5),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Attach Photo (Optional)',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
