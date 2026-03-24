/// DTO for a single returnable assignment returned by POST /qr/return/scan.
class ReturnableAssignmentDto {
  const ReturnableAssignmentDto({
    required this.id,
    required this.assetId,
    required this.assetTag,
    required this.assetName,
    required this.department,
    required this.status,
    required this.assignedAt,
  });

  final String id;
  final String assetId;
  final String assetTag;
  final String assetName;
  final String department;
  final String status;
  final String assignedAt;

  factory ReturnableAssignmentDto.fromJson(Map<String, dynamic> json) {
    return ReturnableAssignmentDto(
      id: (json['id'] as String? ?? '').trim(),
      assetId: (json['assetId'] as String? ?? '').trim(),
      assetTag: (json['assetTag'] as String? ?? '').trim(),
      assetName: (json['assetName'] as String? ?? '').trim(),
      department: (json['department'] as String? ?? '').trim(),
      status: (json['status'] as String? ?? '').trim(),
      assignedAt: (json['assignedAt'] as String? ?? '').trim(),
    );
  }
}

/// DTO for the full response body of POST /qr/return/scan.
class ReturnQrScanResponseDto {
  const ReturnQrScanResponseDto({
    required this.valid,
    required this.intent,
    required this.assignments,
  });

  final bool valid;
  final String intent;
  final List<ReturnableAssignmentDto> assignments;

  factory ReturnQrScanResponseDto.fromJson(Map<String, dynamic> json) {
    final rawList = json['assignments'];
    final assignments = (rawList is List)
        ? rawList
              .whereType<Map<String, dynamic>>()
              .map(ReturnableAssignmentDto.fromJson)
              .toList()
        : <ReturnableAssignmentDto>[];

    return ReturnQrScanResponseDto(
      valid: json['valid'] as bool? ?? false,
      intent: (json['intent'] as String? ?? '').trim(),
      assignments: assignments,
    );
  }
}
