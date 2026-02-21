/// Activity history item for timeline
class ActivityItem {
  final String id;
  final String assetName;
  final String assetId;
  final String action; // e.g. "Issue Reported", "Assigned", "Maintenance"
  final DateTime dateTime;
  final String type; // assigned, reported, maintenance, all

  const ActivityItem({
    required this.id,
    required this.assetName,
    required this.assetId,
    required this.action,
    required this.dateTime,
    required this.type,
  });
}
