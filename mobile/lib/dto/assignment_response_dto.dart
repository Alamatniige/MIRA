import '../models/asset.dart';

class AssignmentResponseDto {
  const AssignmentResponseDto({
    required this.id,
    required this.assetId,
    required this.assetTag,
    required this.assetName,
    required this.department,
    required this.status,
    required this.notes,
    this.assigneeName,
  });

  final String id;
  final String assetId;
  final String assetTag;
  final String assetName;
  final String department;
  final String status;
  final String notes;
  final String? assigneeName;

  factory AssignmentResponseDto.fromJson(Map<String, dynamic> json) {
    return AssignmentResponseDto(
      id: (json['id'] as String? ?? '').trim(),
      assetId: (json['assetId'] as String? ?? '').trim(),
      assetTag: (json['assetTag'] as String? ?? '').trim(),
      assetName: (json['assetName'] as String? ?? '').trim(),
      department: (json['department'] as String? ?? '').trim(),
      status: (json['status'] as String? ?? '').trim(),
      notes: (json['notes'] as String? ?? '').trim(),
      assigneeName:
          (json['assignee'] as String?)?.trim() ??
          (json['fullName'] as String?)?.trim(),
    );
  }

  Asset toFallbackAsset({String? assignedTo, String? assignedToId}) {
    return Asset(
      id: assetTag.isNotEmpty ? assetTag : assetId,
      uuid: assetId,
      name: assetName,
      category: 'Asset',
      serialNumber: '-',
      specifications: notes,
      location: department.isNotEmpty ? department : 'Unspecified',
      status: 'Active',
      assignedTo: assignedTo ?? assigneeName,
      assignedToId: assignedToId,
      purchaseDate: '-',
      warrantyExpiry: '-',
    );
  }
}
