import '../models/asset.dart';

class AssetResponseDto {
  const AssetResponseDto({
    required this.id,
    required this.tag,
    required this.assetName,
    required this.serialNumber,
    required this.specification,
    required this.currentStatus,
    required this.isAssigned,
    this.assignmentStatus,
    this.assetTypeName,
    this.roomName,
    this.floorName,
  });

  final String id;
  final String tag;
  final String assetName;
  final String serialNumber;
  final String specification;
  final String currentStatus;
  final bool isAssigned;
  final String? assignmentStatus;
  final String? assetTypeName;
  final String? roomName;
  final String? floorName;

  factory AssetResponseDto.fromJson(Map<String, dynamic> json) {
    final assetType = json['assetTypeRel'] as Map<String, dynamic>?;
    final room = json['roomRel'] as Map<String, dynamic>?;
    final floor = json['floorRel'] as Map<String, dynamic>?;

    return AssetResponseDto(
      id: (json['id'] as String? ?? '').trim(),
      tag: (json['tag'] as String? ?? '').trim(),
      assetName: (json['assetName'] as String? ?? '').trim(),
      serialNumber: (json['serialNumber'] as String? ?? '').trim(),
      specification: (json['specification'] as String? ?? '').trim(),
      currentStatus: (json['currentStatus'] as String? ?? '').trim(),
      isAssigned: json['isAssigned'] as bool? ?? false,
      assignmentStatus: (json['assignmentStatus'] as String?)?.trim(),
      assetTypeName: (assetType?['name'] as String?)?.trim(),
      roomName: (room?['name'] as String?)?.trim(),
      floorName: (floor?['name'] as String?)?.trim(),
    );
  }

  Asset toAsset({String? assignedTo, String? assignedToId}) {
    return Asset(
      id: tag.isNotEmpty ? tag : id,
      name: assetName,
      category: assetTypeName?.isNotEmpty == true ? assetTypeName! : 'Asset',
      serialNumber: serialNumber,
      specifications: specification,
      location: _locationLabel(),
      status: _displayStatus(currentStatus),
      assignedTo: assignedTo,
      assignedToId: assignedToId,
      purchaseDate: '-',
      warrantyExpiry: '-',
    );
  }

  String _locationLabel() {
    final parts = <String>[
      if (floorName?.isNotEmpty == true) floorName!,
      if (roomName?.isNotEmpty == true) roomName!,
    ];
    if (parts.isEmpty) {
      return 'Unspecified';
    }
    return parts.join(' - ');
  }

  static String _displayStatus(String rawStatus) {
    final normalized = rawStatus
        .trim()
        .toLowerCase()
        .replaceAll('_', ' ')
        .replaceAll('-', ' ');
    final compact = normalized
        .split(RegExp(r'\s+'))
        .where((part) => part.isNotEmpty)
        .join(' ');

    if (compact == 'under maintenance' || compact == 'maintenance') {
      return 'Maintenance';
    }

    if (compact.isEmpty) {
      return 'Unknown';
    }

    return compact
        .split(' ')
        .map(
          (word) => word.isEmpty
              ? word
              : '${word[0].toUpperCase()}${word.substring(1)}',
        )
        .join(' ');
  }
}
