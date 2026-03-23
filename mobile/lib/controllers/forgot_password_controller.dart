import 'package:flutter/foundation.dart';

import '../core/network/api_exception.dart';
import '../repositories/auth_repository.dart';

enum ForgotPasswordStep { email, otp, newPassword, success }

class ForgotPasswordController extends ChangeNotifier {
  ForgotPasswordController({AuthRepository? authRepository})
    : _authRepository = authRepository ?? AuthRepository();

  final AuthRepository _authRepository;

  ForgotPasswordStep step = ForgotPasswordStep.email;
  bool isLoading = false;
  String? error;

  /// Set once the backend confirms the email exists, used in subsequent steps.
  String _email = '';
  String get email => _email;

  /// Set after OTP verification; required for the reset-password step.
  String _resetToken = '';
  String get resetToken => _resetToken;

  void _setLoading(bool value) {
    isLoading = value;
    notifyListeners();
  }

  void _setError(String? message) {
    error = message;
    notifyListeners();
  }

  void clearError() => _setError(null);

  /// Step 1 — Submit email to request OTP.
  Future<void> submitEmail(String email) async {
    final trimmed = email.trim();
    if (trimmed.isEmpty) {
      _setError('Please enter your registered email address.');
      return;
    }

    _setLoading(true);
    _setError(null);

    try {
      await _authRepository.forgotPassword(email: trimmed);
      _email = trimmed;
      step = ForgotPasswordStep.otp;
    } on ApiException catch (e) {
      _setError(e.message);
    } catch (_) {
      _setError('An unexpected error occurred. Please try again.');
    } finally {
      _setLoading(false);
    }
  }

  /// Step 2 — Verify the 6-digit OTP.
  Future<void> verifyOtp(String otp) async {
    final trimmed = otp.trim();
    if (trimmed.length != 6) {
      _setError('Please enter the 6-digit code from your email.');
      return;
    }

    _setLoading(true);
    _setError(null);

    try {
      _resetToken = await _authRepository.verifyOtp(
        email: _email,
        otp: trimmed,
      );
      step = ForgotPasswordStep.newPassword;
    } on ApiException catch (e) {
      _setError(e.message);
    } catch (_) {
      _setError('An unexpected error occurred. Please try again.');
    } finally {
      _setLoading(false);
    }
  }

  /// Step 3 — Set the new password.
  Future<void> resetPassword(String newPassword, String confirmPassword) async {
    if (newPassword != confirmPassword) {
      _setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      _setError('Password must be at least 8 characters.');
      return;
    }

    _setLoading(true);
    _setError(null);

    try {
      await _authRepository.resetPassword(
        resetToken: _resetToken,
        newPassword: newPassword,
      );
      step = ForgotPasswordStep.success;
    } on ApiException catch (e) {
      _setError(e.message);
    } catch (_) {
      _setError('An unexpected error occurred. Please try again.');
    } finally {
      _setLoading(false);
    }
  }

  /// Re-send OTP — goes back to email step and re-submits.
  Future<void> resendOtp() async {
    step = ForgotPasswordStep.email;
    notifyListeners();
    await submitEmail(_email);
  }
}
