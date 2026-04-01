import 'package:flutter/material.dart';
import '../../dto/asset_response_dto.dart';
import '../../services/assets_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/asset_thumbnail.dart';
import '../../widgets/status_badge.dart';
import 'asset_detail_screen.dart';

class AllAssetsScreen extends StatefulWidget {
  const AllAssetsScreen({super.key});

  @override
  State<AllAssetsScreen> createState() => _AllAssetsScreenState();
}

class _AllAssetsScreenState extends State<AllAssetsScreen> {
  final AssetsService _assetsService = AssetsService();
  bool _isLoading = true;
  String? _errorMessage;
  List<AssetResponseDto> _assetDtos = [];

  @override
  void initState() {
    super.initState();
    _loadAssets();
  }

  Future<void> _loadAssets() async {
    if (mounted) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });
    }

    try {
      final assetDtos = await _assetsService.getAllAssets();
      if (!mounted) return;

      setState(() {
        _assetDtos = assetDtos;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
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

  Color _statusAccentColor(String status) {
    final lower = status.toLowerCase();
    if (lower == 'active') return AppColors.statusActive;
    if (lower == 'maintenance') return AppColors.statusMaintenance;
    if (lower == 'reported' || lower == 'issue')
      return AppColors.statusReported;
    if (lower == 'disposed') return AppColors.statusDisposed;
    return AppColors.gray500;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.gray50,
      appBar: AppBar(
        title: Text(
          'All Assets',
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurface,
            fontWeight: FontWeight.w700,
          ),
        ),
        elevation: 0,
        backgroundColor: Colors.transparent,
        iconTheme: IconThemeData(
          color: Theme.of(context).colorScheme.onSurface,
        ),
        centerTitle: true,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.error_outline,
                    color: Theme.of(context).colorScheme.error,
                    size: 48,
                  ),
                  const SizedBox(height: 16),
                  Text('Failed to load assets: $_errorMessage'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _loadAssets,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            )
          : _assetDtos.isEmpty
          ? const Center(child: Text('No assets available.'))
          : RefreshIndicator(
              onRefresh: _loadAssets,
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 16,
                ),
                itemCount: _assetDtos.length,
                itemBuilder: (context, index) {
                  final dto = _assetDtos[index];
                  final asset = dto.toAsset();
                  final accent = _statusAccentColor(asset.status);

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => AssetDetailScreen(
                                asset: asset,
                                liveAsset: dto,
                              ),
                            ),
                          );
                        },
                        borderRadius: BorderRadius.circular(24),
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Theme.of(context).colorScheme.surface,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(
                              color: isDark
                                  ? Colors.white.withValues(alpha: 0.04)
                                  : AppColors.gray100.withValues(alpha: 0.5),
                              width: 1,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Theme.of(context).colorScheme.shadow
                                    .withValues(alpha: isDark ? 0.1 : 0.03),
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
                                      ? AppColors.darkSurfaceVariant
                                      : AppColors.gray50,
                                  borderRadius: BorderRadius.circular(18),
                                ),
                                child: AssetThumbnail(
                                  asset: asset,
                                  fallbackIcon: _iconForCategory(
                                    asset.category,
                                  ),
                                  backgroundColor: isDark
                                      ? AppColors.darkSurfaceVariant
                                      : AppColors.gray50,
                                  iconColor: isDark
                                      ? AppColors.tealLight
                                      : AppColors.tealPrimary,
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
                                        color: Theme.of(
                                          context,
                                        ).colorScheme.onSurface,
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
                },
              ),
            ),
    );
  }
}
