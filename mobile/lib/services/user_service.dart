import '../core/network/api_client.dart';
import '../models/types.dart';

class UserService {
  UserService({ApiClient? apiClient}) : _apiClient = apiClient ?? ApiClient();

  final ApiClient _apiClient;

  Future<UserProfile> getMe() async {
    final json = await _apiClient.get('/users/me') as Map<String, dynamic>;
    return UserProfile.fromJson(json);
  }
}
