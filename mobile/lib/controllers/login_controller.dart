import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../models/types.dart';
import '../repositories/auth_repository.dart';

class LoginController {
  LoginController({AuthRepository? authRepository})
    : _authRepository = authRepository ?? AuthRepository();

  static const String _rememberMeKey = 'remember_me';
  static const String _rememberedEmailKey = 'remembered_email';
  static const String _rememberedPasswordKey = 'remembered_password';

  final AuthRepository _authRepository;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  Future<RememberedLogin> loadRememberedLogin() async {
    final prefs = await SharedPreferences.getInstance();
    final rememberMe = prefs.getBool(_rememberMeKey) ?? false;
    final email = prefs.getString(_rememberedEmailKey)?.trim();
    final password = await _secureStorage.read(key: _rememberedPasswordKey);

    // Keep UI state consistent if persisted data is incomplete.
    if (!rememberMe || email == null || email.isEmpty) {
      return const RememberedLogin(
        rememberMe: false,
        email: null,
        password: null,
      );
    }

    return RememberedLogin(rememberMe: true, email: email, password: password);
  }

  Future<AuthUser> signIn({
    required String email,
    required String password,
    required bool rememberMe,
  }) async {
    final user = await _authRepository.loginStaff(
      email: email,
      password: password,
    );

    final prefs = await SharedPreferences.getInstance();
    if (rememberMe) {
      await prefs.setBool(_rememberMeKey, true);
      await prefs.setString(_rememberedEmailKey, email);
      await _secureStorage.write(key: _rememberedPasswordKey, value: password);
    } else {
      await prefs.setBool(_rememberMeKey, false);
      await prefs.remove(_rememberedEmailKey);
      await _secureStorage.delete(key: _rememberedPasswordKey);
    }

    return user;
  }
}

class RememberedLogin {
  const RememberedLogin({required this.rememberMe, this.email, this.password});

  final bool rememberMe;
  final String? email;
  final String? password;
}
