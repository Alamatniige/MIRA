class LoginResponseDto {
  const LoginResponseDto({required this.accessToken, required this.user});

  final String accessToken;
  final AuthUserDto user;

  factory LoginResponseDto.fromEnvelope(Map<String, dynamic> envelope) {
    final data = envelope['data'];
    if (data is! Map<String, dynamic>) {
      throw const FormatException('Invalid login response payload.');
    }

    final accessToken = data['access_token'];
    if (accessToken is! String || accessToken.trim().isEmpty) {
      throw const FormatException('Missing access token in login response.');
    }

    return LoginResponseDto(
      accessToken: accessToken,
      user: AuthUserDto.fromJson(data['user']),
    );
  }
}

class AuthUserDto {
  const AuthUserDto({
    required this.id,
    required this.email,
    required this.fullName,
    required this.department,
    required this.roleName,
  });

  final String id;
  final String email;
  final String fullName;
  final String department;
  final String roleName;

  factory AuthUserDto.fromJson(dynamic raw) {
    if (raw is! Map<String, dynamic>) {
      throw const FormatException('Invalid user payload in login response.');
    }

    final role = raw['role'];
    final roleName = role is Map<String, dynamic>
        ? role['name'] as String? ?? ''
        : '';

    return AuthUserDto(
      id: (raw['id'] as String? ?? '').trim(),
      email: (raw['email'] as String? ?? '').trim(),
      fullName: (raw['fullName'] as String? ?? '').trim(),
      department: (raw['department'] as String? ?? '').trim(),
      roleName: roleName.trim(),
    );
  }
}
