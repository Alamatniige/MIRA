import 'dart:io';

import '../core/network/api_client.dart';
import '../models/types.dart';

class UserService {
  UserService({ApiClient? apiClient}) : _apiClient = apiClient ?? ApiClient();

  final ApiClient _apiClient;

  Future<UserProfile> getMe() async {
    final json = await _apiClient.get('/users/me') as Map<String, dynamic>;
    return UserProfile.fromJson(json);
  }

  Future<String> uploadAvatar(File file) async {
    final response = await _apiClient.multipartPost(
      '/users/me/avatar',
      fileField: 'image',
      file: file,
    );
    return response['avatarUrl'] as String;
  }
}
