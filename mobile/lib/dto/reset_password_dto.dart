class ResetPasswordResponseDto {
  const ResetPasswordResponseDto({required this.message});

  final String message;

  factory ResetPasswordResponseDto.fromJson(Map<String, dynamic> json) {
    return ResetPasswordResponseDto(message: json['message'] as String? ?? '');
  }
}
