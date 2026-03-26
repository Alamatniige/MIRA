import 'package:flutter/material.dart';

import '../models/asset.dart';

class AssetThumbnail extends StatelessWidget {
  const AssetThumbnail({
    super.key,
    required this.asset,
    required this.fallbackIcon,
    required this.backgroundColor,
    required this.iconColor,
    this.borderRadius = const BorderRadius.all(Radius.circular(18)),
  });

  final Asset asset;
  final IconData fallbackIcon;
  final Color backgroundColor;
  final Color iconColor;
  final BorderRadius borderRadius;

  static const String _defaultApiBaseUrl = 'http://10.0.2.2:8080';

  @override
  Widget build(BuildContext context) {
    final thumbnailUrl = _resolveImageUrl(_firstImageUrl());

    return ClipRRect(
      borderRadius: borderRadius,
      child: Container(
        color: backgroundColor,
        child: thumbnailUrl == null
            ? _buildFallback()
            : Image.network(
                thumbnailUrl,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return _buildFallback();
                },
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) {
                    return child;
                  }

                  return Stack(
                    fit: StackFit.expand,
                    children: [
                      _buildFallback(),
                      const Center(
                        child: SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                      ),
                    ],
                  );
                },
              ),
      ),
    );
  }

  Widget _buildFallback() {
    return Center(child: Icon(fallbackIcon, color: iconColor, size: 26));
  }

  String? _firstImageUrl() {
    for (final image in asset.images) {
      final trimmed = image.trim();
      if (trimmed.isNotEmpty) {
        return trimmed;
      }
    }

    return null;
  }

  String? _resolveImageUrl(String? imageUrl) {
    if (imageUrl == null) {
      return null;
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    final baseUrl = const String.fromEnvironment(
      'API_BASE_URL',
      defaultValue: _defaultApiBaseUrl,
    );
    if (imageUrl.startsWith('/')) {
      return '$baseUrl$imageUrl';
    }

    return '$baseUrl/$imageUrl';
  }
}
