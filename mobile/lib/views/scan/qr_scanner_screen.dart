import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../core/network/api_exception.dart';
import '../../core/network/error_formatter.dart';
import '../../theme/app_theme.dart';
import '../../models/asset.dart';
import '../../widgets/status_badge.dart';
import '../../services/assets_service.dart';
import '../assets/asset_detail_screen.dart';
import 'return_asset_sheet.dart';
import '../../dto/asset_response_dto.dart';

/// High-end QR Scanner - full screen dark, glowing frame, bottom sheet
class QrScannerScreen extends StatefulWidget {
  final VoidCallback? onBack;

  const QrScannerScreen({super.key, this.onBack});

  @override
  State<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends State<QrScannerScreen>
    with SingleTickerProviderStateMixin, WidgetsBindingObserver {
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
    WidgetsBinding.instance.addObserver(this);
    _scanLineController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    switch (state) {
      case AppLifecycleState.paused:
      case AppLifecycleState.inactive:
        _controller.stop();
        break;
      case AppLifecycleState.resumed:
        _controller.start();
        break;
      default:
        break;
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
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
    HapticFeedback.mediumImpact();

    // Global return QR — route to asset picker sheet
    if (code.startsWith('mira-return:')) {
      _showReturnAssetSheet(context, code);
      return;
    }

    // Asset QR — fetch live details and navigate to detail screen
    if (code.startsWith('mira-asset:')) {
      final assetId = code.substring(11);
      _showAssetFromQr(assetId);
      return;
    }

    // If it doesn't match MIRA patterns, it's invalid
    _showInvalidScan(context, code);
  }

  Future<void> _showAssetFromQr(String assetId) async {
    _controller.stop();

    // Show a loading indicator while fetching
    if (!mounted) return;
    final nav = Navigator.of(context);
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => PopScope(
        canPop: false,
        child: Center(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.7),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.1),
                width: 1,
              ),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(
                  width: 40,
                  height: 40,
                  child: CircularProgressIndicator(
                    strokeWidth: 3,
                    valueColor: AlwaysStoppedAnimation(AppColors.tealLight),
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  'Identifying Asset...',
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.9),
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );

    try {
      // Use Future.wait to ensure a minimum loading time of 800ms for premium feel
      final results = await Future.wait([
        AssetsService().getAssetDetails(assetId),
        Future.delayed(const Duration(milliseconds: 800)),
      ]);

      final dto = results[0] as AssetResponseDto;

      if (!mounted) return;
      nav.pop(); // dismiss loading
      final result = await nav.push<bool>(
        MaterialPageRoute(
          builder: (_) => AssetDetailScreen(
            asset: dto.toAsset(),
            liveAsset: dto,
            viewMode: AssetDetailViewMode.assignment,
          ),
        ),
      );

      // If request was successful, navigate back to dashboard
      if (result == true && mounted) {
        if (widget.onBack != null) {
          widget.onBack!();
        } else {
          nav.pop();
        }
        return;
      }

      if (mounted) {
        _controller.start();
        setState(() => _hasScanned = false);
      }
    } on ApiException catch (e) {
      // Fix 3: server/auth errors ≠ invalid QR — show a specific dialog
      if (!mounted) return;
      nav.pop(); // dismiss loading
      _showAssetLoadError(context, e.message);
    } on SocketException {
      if (!mounted) return;
      nav.pop();
      _showAssetLoadError(
        context,
        'No internet connection. Please check your network and try again.',
      );
    } on TimeoutException {
      if (!mounted) return;
      nav.pop();
      _showAssetLoadError(context, 'The request timed out. Please try again.');
    } catch (e) {
      if (!mounted) return;
      nav.pop();
      _showAssetLoadError(context, formatErrorForUser(e));
    }

    if (mounted) {
      _controller.start();
      setState(() => _hasScanned = false);
    }
  }

  void _showReturnAssetSheet(BuildContext context, String scannedData) {
    _controller.stop();
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      isDismissible: false,
      enableDrag: false,
      builder: (_) => ReturnAssetSheet(scannedData: scannedData),
    ).then((_) {
      if (mounted) {
        _controller.start();
        setState(() => _hasScanned = false);
      }
    });
  }

  void _showScanResultSheet(BuildContext context, Asset asset) {
    _controller.stop();
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => _ScanResultSheet(
        asset: asset,
        onViewDetails: () {
          Navigator.pop(ctx);
          // Re-fetch live DTO so liveAsset is available for request/report actions
          _showAssetFromQr(asset.id);
        },
      ),
    ).then((_) {
      if (mounted) {
        _controller.start();
        setState(() => _hasScanned = false);
      }
    });
  }

  /// Fix 3: Shown ONLY for network/server errors — NOT for unrecognised QR content.
  void _showAssetLoadError(BuildContext context, String message) {
    _controller.stop();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Could Not Load Asset'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              if (mounted) setState(() => _hasScanned = false);
            },
            child: const Text('Try Again'),
          ),
        ],
      ),
    ).then((_) {
      if (mounted) {
        _controller.start();
        setState(() => _hasScanned = false);
      }
    });
  }

  /// Shown ONLY when the QR content successfully resolves but matches no known MIRA asset.
  void _showInvalidScan(BuildContext context, String code) {
    _controller.stop();
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
              if (mounted) setState(() => _hasScanned = false);
            },
            child: const Text('Scan Again'),
          ),
        ],
      ),
    ).then((_) {
      if (mounted) {
        _controller.start();
        setState(() => _hasScanned = false);
      }
    });
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
                  color: AppColors.tealLight.withValues(alpha: 0.8),
                  width: 3,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.tealLight.withValues(alpha: 0.3),
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
                                    AppColors.tealLight.withValues(alpha: 0.8),
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
      ..color = Colors.black.withValues(alpha: 0.5)
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
            color: AppColors.navy.withValues(alpha: 0.15),
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
