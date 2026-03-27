import 'dart:io';

import '../models/types.dart';
import '../services/assets_service.dart';
import '../services/user_service.dart';

class ProfileController {
  ProfileController({UserService? userService, AssetsService? assetsService})
    : _userService = userService ?? UserService(),
      _assetsService = assetsService ?? AssetsService();

  final UserService _userService;
  final AssetsService _assetsService;

  Future<UserProfile> loadProfile() => _userService.getMe();

  Future<int> getActiveAssetsCount() async {
    final assets = await _assetsService.getMyAssignedAssets();
    return assets.length;
  }

  Future<String> uploadAvatar(File file) => _userService.uploadAvatar(file);
}
