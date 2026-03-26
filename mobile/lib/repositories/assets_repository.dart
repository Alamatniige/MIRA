import '../dto/assignment_response_dto.dart';
import '../models/asset.dart';
import '../models/dashboard_data.dart';
import '../services/assets_service.dart';
import '../services/user_service.dart';

class AssetsRepository {
  AssetsRepository({AssetsService? assetsService, UserService? userService})
    : _assetsService = assetsService ?? AssetsService(),
      _userService = userService ?? UserService();

  final AssetsService _assetsService;
  final UserService _userService;

  Future<DashboardData> getDashboardData() async {
    final userFuture = _userService.getMe();
    final assignedFuture = _assetsService.getMyAssignedAssets();
    final pendingFuture = _assetsService.getMyPendingAssignments();
    final allAssetsFuture = _assetsService.getAllAssets();
    final maintenanceFuture = _assetsService.getMaintenanceAssets();

    final user = await userFuture;
    final assignedAssets = await assignedFuture;
    final pendingAssets = await pendingFuture;
    final allAssets = await allAssetsFuture;
    final maintenanceAssets = await maintenanceFuture;

    final detailedAssignedAssets = await _buildAssignedAssets(
      assignedAssets,
      assignedTo: user.fullName,
      assignedToId: user.id,
    );

    final detailedPendingAssets = await _buildAssignedAssets(
      pendingAssets,
      assignedTo: user.fullName,
      assignedToId: user.id,
    );

    return DashboardData(
      userFirstName: _firstName(user.fullName),
      totalAssets: allAssets.length,
      activeAssetsCount: detailedAssignedAssets.length,
      maintenanceAssetsCount: maintenanceAssets.length,
      myAssets: detailedAssignedAssets,
      pendingRequests: detailedPendingAssets,
      avatarUrl: user.avatarUrl,
    );
  }

  Future<List<Asset>> _buildAssignedAssets(
    List<AssignmentResponseDto> assignments, {
    required String assignedTo,
    required String assignedToId,
  }) async {
    if (assignments.isEmpty) {
      return const [];
    }

    return Future.wait(
      assignments.map((assignment) async {
        try {
          final detail = await _assetsService.getAssetDetails(
            assignment.assetId,
          );
          return detail.toAsset(
            assignedTo: assignedTo,
            assignedToId: assignedToId,
          );
        } catch (_) {
          return assignment.toFallbackAsset(
            assignedTo: assignedTo,
            assignedToId: assignedToId,
          );
        }
      }),
    );
  }

  String _firstName(String fullName) {
    final trimmed = fullName.trim();
    if (trimmed.isEmpty) {
      return 'User';
    }

    return trimmed.split(RegExp(r'\s+')).first;
  }
}
