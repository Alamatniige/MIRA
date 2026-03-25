import '../core/network/api_exception.dart';
import '../core/network/api_client.dart';
import '../dto/asset_response_dto.dart';
import '../dto/issue_report_dto.dart';
import '../dto/assignment_response_dto.dart';
import '../dto/return_qr_scan_dto.dart';

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

  /// Validates the scanned global return QR payload and returns the authenticated
  /// user's active assignments so they can choose which asset to return.
  Future<ReturnQrScanResponseDto> scanReturnQr(String scannedData) async {
    final response = await _apiClient.post(
      '/qr/return/scan',
      body: {'scannedData': scannedData},
    );
    if (response is! Map<String, dynamic>) {
      throw const ApiException(
        'Unexpected return QR scan response from server.',
      );
    }
    return ReturnQrScanResponseDto.fromJson(response);
  }

  /// Marks the active assignment for [assetId] as returned.
  Future<void> returnAsset(String assetId) async {
    await _apiClient.post('/return', body: {'assetId': assetId});
  }

  /// Submits a pending assignment request for [assetId].
  Future<void> requestAssignment(String assetId, {String notes = ''}) async {
    await _apiClient.post(
      '/assign/request',
      body: {'assetId': assetId, 'notes': notes},
    );
  }

  /// Reports an issue for [assetId] with the given [description].
  Future<void> reportIssue(String assetId, String description) async {
    await _apiClient.post(
      '/issues/create',
      body: {'assetId': assetId, 'description': description},
    );
  }

  Future<List<IssueReportDto>> getReportedIssues() async {
    final response = await _apiClient.get('/reports');
    if (response is List) {
      return response
          .map((e) => IssueReportDto.fromJson(e as Map<String, dynamic>))
          .toList();
    }
    return [];
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
