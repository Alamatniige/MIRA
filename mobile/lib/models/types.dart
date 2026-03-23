class AuthUser {
  const AuthUser({
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
}

class UserProfile {
  const UserProfile({
    required this.id,
    required this.email,
    required this.fullName,
    required this.department,
    required this.roleName,
    required this.phoneNumber,
    required this.assetsCount,
  });

  final String id;
  final String email;
  final String fullName;
  final String department;
  final String roleName;
  final String phoneNumber;
  final int assetsCount;

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    final role = json['role'] as Map<String, dynamic>? ?? {};
    return UserProfile(
      id: json['id'] as String? ?? '',
      email: json['email'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      department: json['department'] as String? ?? '',
      roleName: role['name'] as String? ?? '',
      phoneNumber: json['phoneNumber'] as String? ?? '',
      assetsCount: json['assetsCount'] as int? ?? 0,
    );
  }
}
