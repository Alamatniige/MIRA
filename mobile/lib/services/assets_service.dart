import '../core/network/api_exception.dart';
import '../core/network/api_client.dart';
import '../dto/asset_response_dto.dart';
import '../dto/assignment_response_dto.dart';

class AssetsService {
  AssetsService({ApiClient? apiClient}) : _apiClient = apiClient ?? ApiClient();

  final ApiClient _apiClient;

  Future<List<AssignmentResponseDto>> getMyAssignedAssets() async {
    final response = await _apiClient.get('/assign/active');
    if (response is! List) {
      throw const ApiException(
        'Unexpected assigned assets response from server.',
      );
    }

    return response
        .whereType<Map<String, dynamic>>()
        .map(AssignmentResponseDto.fromJson)
        .toList();
  }

  Future<List<AssetResponseDto>> getAllAssets() async {
    return _getAssetList('/assets');
  }

  Future<List<AssetResponseDto>> getMaintenanceAssets() async {
    return _getAssetList(
      '/assets',
      query: const {'status': 'under_maintenance'},
    );
  }

  Future<AssetResponseDto> getAssetDetails(String assetId) async {
    final response = await _apiClient.get('/assets/$assetId');
    if (response is! Map<String, dynamic>) {
      throw const ApiException('Unexpected asset detail response from server.');
    }

    return AssetResponseDto.fromJson(response);
  }

  Future<List<AssetResponseDto>> _getAssetList(
    String path, {
    Map<String, dynamic>? query,
  }) async {
    final response = await _apiClient.get(path, query: query);
    if (response is! List) {
      throw const ApiException('Unexpected assets response from server.');
    }

    return response
        .whereType<Map<String, dynamic>>()
        .map(AssetResponseDto.fromJson)
        .toList();
  }
}
