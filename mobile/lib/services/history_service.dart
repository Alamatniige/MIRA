import '../core/network/api_client.dart';
import '../dto/history_item_dto.dart';

class HistoryService {
  HistoryService({ApiClient? apiClient}) : _apiClient = apiClient ?? ApiClient();

  final ApiClient _apiClient;

  Future<List<HistoryItemDto>> getHistoryAll() async {
    final response = await _apiClient.get('/history/all');
    if (response is! List) return [];
    return response.map((item) => HistoryItemDto.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<List<HistoryItemDto>> getHistoryAssigned() async {
    final response = await _apiClient.get('/history/assigned');
    if (response is! List) return [];
    return response.map((item) => HistoryItemDto.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<List<HistoryItemDto>> getHistoryReported() async {
    final response = await _apiClient.get('/history/reported');
    if (response is! List) return [];
    return response.map((item) => HistoryItemDto.fromJson(item as Map<String, dynamic>)).toList();
  }
}
