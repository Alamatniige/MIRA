import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../theme/app_theme.dart';
import '../../data/mock_data.dart';
import '../../models/asset.dart';
import '../../widgets/status_badge.dart';
import '../assets/asset_detail_screen.dart';

/// High-end QR Scanner - full screen dark, glowing frame, bottom sheet
class QrScannerScreen extends StatefulWidget {
  final VoidCallback? onBack;

  const QrScannerScreen({super.key, this.onBack});

  @override
  State<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends State<QrScannerScreen>
    with SingleTickerProviderStateMixin {
  final MobileScannerController _controller = MobileScannerController(
    detectionSpeed: DetectionSpeed.normal,
    facing: CameraFacing.back,
    torchEnabled: false,
  );

  bool _hasScanned = false;
  late AnimationController _scanLineController;

  @override
  void initState() {
    super.initState();
    _scanLineController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    _scanLineController.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) {
    if (_hasScanned) return;
    final barcodes = capture.barcodes;
    if (barcodes.isEmpty) return;

    final code = barcodes.first.rawValue;
    if (code == null || code.isEmpty) return;

    _hasScanned = true;

    String? assetId;
    if (code.startsWith('AST-') || code.startsWith('MIRA-')) {
      final parts = code.split('-');
      if (parts.contains('AST') && parts.length > 1) {
        final idx = parts.indexOf('AST');
        if (idx + 1 < parts.length) {
          assetId = 'AST-${parts[idx + 1]}';
        }
      }
      if (assetId == null && code.startsWith('AST-')) {
        assetId = code;
      }
    }
    assetId ??= code;

    final asset = findAssetById(assetId);
    if (!mounted) return;

    if (asset != null) {
      _showScanResultSheet(context, asset);
    } else {
      _showInvalidScan(context, code);
    }
  }

  void _showScanResultSheet(BuildContext context, Asset asset) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => _ScanResultSheet(
        asset: asset,
        onViewDetails: () {
          Navigator.pop(ctx);
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => AssetDetailScreen(asset: asset),
            ),
          );
        },
      ),
    ).then((_) => setState(() => _hasScanned = false));
  }

  void _showInvalidScan(BuildContext context, String code) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Not a MIRA Asset'),
        content: Text(
          'Scanned code: $code\n\nThis doesn\'t match any known asset.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('OK'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              setState(() => _hasScanned = false);
            },
            child: const Text('Scan Again'),
          ),
        ],
      ),
    ).then((_) => setState(() => _hasScanned = false));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        fit: StackFit.expand,
        children: [
          MobileScanner(controller: _controller, onDetect: _onDetect),
          // Dark overlay with cutout
          CustomPaint(painter: _ScannerOverlayPainter()),
          // Glowing scan frame
          Center(
            child: Container(
              width: 260,
              height: 260,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: AppColors.tealLight.withOpacity(0.8),
                  width: 3,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.tealLight.withOpacity(0.3),
                    blurRadius: 24,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(17),
                child: Stack(
                  children: [
                    // Animated scanning line
                    AnimatedBuilder(
                      animation: _scanLineController,
                      builder: (context, child) {
                        return Positioned(
                          top: 0,
                          left: 0,
                          right: 0,
                          child: Transform.translate(
                            offset: Offset(0, 260 * _scanLineController.value),
                            child: Container(
                              height: 3,
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    Colors.transparent,
                                    AppColors.tealLight.withOpacity(0.8),
                                    Colors.transparent,
                                  ],
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
          // Back button
          Positioned(
            top: MediaQuery.of(context).padding.top + 8,
            left: 16,
            child: IconButton(
              onPressed: () => widget.onBack != null
                  ? widget.onBack!()
                  : Navigator.maybePop(context),
              icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
              style: IconButton.styleFrom(backgroundColor: Colors.black38),
            ),
          ),
          // Flash toggle
          Positioned(
            top: MediaQuery.of(context).padding.top + 8,
            right: 16,
            child: ValueListenableBuilder(
              valueListenable: _controller,
              builder: (context, state, child) {
                return IconButton(
                  onPressed: () => _controller.toggleTorch(),
                  icon: Icon(
                    state.torchState == TorchState.on
                        ? Icons.flash_on
                        : Icons.flash_off,
                    color: Colors.white,
                  ),
                  style: IconButton.styleFrom(backgroundColor: Colors.black38),
                );
              },
            ),
          ),
          // Instruction text
          Positioned(
            bottom: 120,
            left: 0,
            right: 0,
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 14,
                ),
                decoration: BoxDecoration(
                  color: Colors.black54,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Text(
                  'Align QR code inside the frame',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          ),
          // Simulate scan (for testing)
          Positioned(
            bottom: 40,
            left: 24,
            right: 24,
            child: TextButton(
              onPressed: () {
                if (_hasScanned) return;
                _hasScanned = true;
                final asset = mockMyAssets.isNotEmpty
                    ? mockMyAssets.first
                    : mockAllAssets.first;
                _showScanResultSheet(context, asset);
              },
              child: Text(
                'Simulate scan (${mockAllAssets.first.id})',
                style: TextStyle(color: AppColors.gray400, fontSize: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Dark overlay with transparent center (scan area)
class _ScannerOverlayPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black.withOpacity(0.5)
      ..style = PaintingStyle.fill;

    final path = Path()..addRect(Rect.fromLTWH(0, 0, size.width, size.height));

    const frameSize = 260.0;
    final centerX = size.width / 2;
    final centerY = size.height / 2;
    final frameRect = RRect.fromRectAndRadius(
      Rect.fromCenter(
        center: Offset(centerX, centerY),
        width: frameSize,
        height: frameSize,
      ),
      const Radius.circular(20),
    );

    final cutout = Path()..addRRect(frameRect);
    final combined = Path.combine(PathOperation.difference, path, cutout);
    canvas.drawPath(combined, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _ScanResultSheet extends StatelessWidget {
  final Asset asset;
  final VoidCallback onViewDetails;

  const _ScanResultSheet({required this.asset, required this.onViewDetails});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppColors.navy.withOpacity(0.15),
            blurRadius: 24,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
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
            const SizedBox(height: 24),
            Text(
              asset.name,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.navy,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              asset.id,
              style: TextStyle(fontSize: 14, color: AppColors.gray500),
            ),
            const SizedBox(height: 16),
            StatusBadge(status: asset.status),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: onViewDetails,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.tealPrimary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: const Text('View Full Details'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
