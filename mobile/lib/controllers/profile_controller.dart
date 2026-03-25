import 'dart:io';

import '../models/types.dart';
import '../services/user_service.dart';

class ProfileController {
  ProfileController({UserService? userService})
    : _userService = userService ?? UserService();

  final UserService _userService;

  Future<UserProfile> loadProfile() => _userService.getMe();

  Future<String> uploadAvatar(File file) => _userService.uploadAvatar(file);
}
