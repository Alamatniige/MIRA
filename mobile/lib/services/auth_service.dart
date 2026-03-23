import '../core/network/api_client.dart';
import '../core/network/api_exception.dart';
import '../dto/forgot_password_dto.dart';
import '../dto/login_response_dto.dart';
import '../dto/reset_password_dto.dart';
import '../dto/verify_otp_dto.dart';

class AuthService {
  AuthService({ApiClient? apiClient}) : _apiClient = apiClient ?? ApiClient();

  final ApiClient _apiClient;

  Future<LoginResponseDto> login({
    required String email,
    required String password,
  }) async {
    final response = await _apiClient.post(
      '/login',
      body: {'email': email, 'password': password},
      requiresAuth: false,
    );

    if (response is! Map<String, dynamic>) {
      throw const ApiException('Unexpected login response from server.');
    }

    try {
      return LoginResponseDto.fromEnvelope(response);
    } on FormatException catch (e) {
      throw ApiException(e.message);
    }
  }

  Future<ForgotPasswordResponseDto> forgotPassword({
    required String email,
  }) async {
    final response = await _apiClient.post(
      '/forgot-password',
      body: {'email': email},
      requiresAuth: false,
    );

    if (response is! Map<String, dynamic>) {
      throw const ApiException('Unexpected response from server.');
    }

    return ForgotPasswordResponseDto.fromJson(response);
  }

  Future<VerifyOTPResponseDto> verifyOtp({
    required String email,
    required String otp,
  }) async {
    final response = await _apiClient.post(
      '/verify-otp',
      body: {'email': email, 'otp': otp},
      requiresAuth: false,
    );

    if (response is! Map<String, dynamic>) {
      throw const ApiException('Unexpected response from server.');
    }

    return VerifyOTPResponseDto.fromJson(response);
  }

  Future<ResetPasswordResponseDto> resetPassword({
    required String resetToken,
    required String newPassword,
  }) async {
    final response = await _apiClient.post(
      '/reset-password',
      body: {'reset_token': resetToken, 'new_password': newPassword},
      requiresAuth: false,
    );

    if (response is! Map<String, dynamic>) {
      throw const ApiException('Unexpected response from server.');
    }

    return ResetPasswordResponseDto.fromJson(response);
  }
}
