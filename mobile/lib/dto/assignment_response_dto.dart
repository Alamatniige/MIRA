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
    this.confirmedAt,
    this.confirmedByName,
  });

  final String id;
  final String assetId;
  final String assetTag;
  final String assetName;
  final String department;
  final String status;
  final String notes;
  final String? assigneeName;
  final DateTime? confirmedAt;
  final String? confirmedByName;

  factory AssignmentResponseDto.fromJson(Map<String, dynamic> json) {
    DateTime? parseDateTime(dynamic value) {
      if (value == null) return null;
      if (value is String) {
        try {
          return DateTime.parse(value);
        } catch (_) {
          return null;
        }
      }
      return null;
    }

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
          (json['fullName'] as String?)?.trim() ??
          (json['assigneeName'] as String?)?.trim(),
      confirmedAt: parseDateTime(json['confirmedAt']),
      confirmedByName:
          (json['confirmedByName'] as String?)?.trim() ??
          (json['approvedBy'] as String?)?.trim(),
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
