class HistoryItemDto {
  final String id;
  final String assetId;
  final String assetName;
  final String action;
  final String type;
  final String timestamp;
  final String description;

  HistoryItemDto({
    required this.id,
    required this.assetId,
    required this.assetName,
    required this.action,
    required this.type,
    required this.timestamp,
    required this.description,
  });

  factory HistoryItemDto.fromJson(Map<String, dynamic> json) {
    return HistoryItemDto(
      id: json['id']?.toString() ?? '',
      assetId: json['assetId']?.toString() ?? '',
      assetName: json['assetName']?.toString() ?? 'Unknown Asset',
      action: json['action']?.toString() ?? '',
      type: json['type']?.toString() ?? '',
      timestamp: json['timestamp']?.toString() ?? DateTime.now().toIso8601String(),
      description: json['description']?.toString() ?? '',
    );
  }
}
