import '../dto/history_item_dto.dart';
import '../models/activity.dart';
import '../services/history_service.dart';

class HistoryRepository {
  HistoryRepository({HistoryService? historyService})
    : _historyService = historyService ?? HistoryService();

  final HistoryService _historyService;

  Future<List<ActivityItem>> getHistoryAll() async {
    final dtos = await _historyService.getHistoryAll();
    return dtos.map((dto) => _mapToModel(dto)).toList();
  }

  Future<List<ActivityItem>> getHistoryAssigned() async {
    final dtos = await _historyService.getHistoryAssigned();
    return dtos.map((dto) => _mapToModel(dto)).toList();
  }

  Future<List<ActivityItem>> getHistoryReported() async {
    final dtos = await _historyService.getHistoryReported();
    return dtos.map((dto) => _mapToModel(dto)).toList();
  }

  ActivityItem _mapToModel(HistoryItemDto dto) {
    return ActivityItem(
      id: dto.id,
      assetName: dto.assetName,
      assetId: dto.assetId,
      action: dto.action,
      dateTime: DateTime.tryParse(dto.timestamp) ?? DateTime.now(),
      type: dto.type,
    );
  }
}
