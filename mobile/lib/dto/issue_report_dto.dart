class IssueReportDto {
  final String id;
  final String assetId;
  final String assetTag;
  final String assetName;
  final String reportedBy;
  final String userName;
  final String description;
  final String status;
  final String reportAt;

  final String? image;
  final String? adminNote;

  IssueReportDto({
    required this.id,
    required this.assetId,
    required this.assetTag,
    required this.assetName,
    required this.reportedBy,
    required this.userName,
    required this.description,
    required this.status,
    required this.reportAt,
    this.image,
    this.adminNote,
  });

  factory IssueReportDto.fromJson(Map<String, dynamic> json) {
    return IssueReportDto(
      id: json['id']?.toString() ?? '',
      assetId: json['assetId']?.toString() ?? '',
      assetTag: json['assetTag']?.toString() ?? '',
      assetName: json['assetName']?.toString() ?? 'Unknown Asset',
      reportedBy: json['reportedBy']?.toString() ?? '',
      userName: json['userName']?.toString() ?? 'Unknown User',
      description: json['description']?.toString() ?? '',
      status: json['status']?.toString() ?? 'open',
      reportAt: json['reportAt']?.toString() ?? DateTime.now().toIso8601String(),
      image: json['image']?.toString(),
      adminNote: json['adminNote']?.toString(),
    );
  }
}
