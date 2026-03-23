import '../core/network/api_exception.dart';
import '../core/storage/token_storage.dart';
import '../models/types.dart';
import '../services/auth_service.dart';

class AuthRepository {
  AuthRepository({AuthService? authService, TokenStorage? tokenStorage})
    : _authService = authService ?? AuthService(),
      _tokenStorage = tokenStorage ?? TokenStorage();

  final AuthService _authService;
  final TokenStorage _tokenStorage;

  Future<AuthUser> loginStaff({
    required String email,
    required String password,
  }) async {
    final login = await _authService.login(email: email, password: password);

    if (login.user.roleName.toLowerCase() != 'staff') {
      throw const ApiException(
        'Access denied. Mobile app is restricted to staff accounts.',
        statusCode: 401,
      );
    }

    await _tokenStorage.saveSession(
      accessToken: login.accessToken,
      userId: login.user.id,
      userEmail: login.user.email,
    );

    return AuthUser(
      id: login.user.id,
      email: login.user.email,
      fullName: login.user.fullName,
      department: login.user.department,
      roleName: login.user.roleName,
    );
  }

  Future<void> logout() async {
    await _tokenStorage.clearSession();
  }

  /// Sends a 6-digit OTP to [email] for password reset.
  /// Always completes without throwing — the backend never exposes
  /// whether the email is registered.
  Future<void> forgotPassword({required String email}) async {
    await _authService.forgotPassword(email: email);
  }

  /// Verifies [otp] for [email] and returns a short-lived reset token.
  /// Throws [ApiException] on invalid/expired OTP.
  Future<String> verifyOtp({required String email, required String otp}) async {
    final result = await _authService.verifyOtp(email: email, otp: otp);
    if (result.resetToken.isEmpty) {
      throw const ApiException('Received empty reset token from server.');
    }
    return result.resetToken;
  }

  /// Sets a new password using the [resetToken] issued by [verifyOtp].
  /// Throws [ApiException] on invalid/expired token.
  Future<void> resetPassword({
    required String resetToken,
    required String newPassword,
  }) async {
    await _authService.resetPassword(
      resetToken: resetToken,
      newPassword: newPassword,
    );
  }
}
