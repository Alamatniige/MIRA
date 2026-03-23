class ForgotPasswordResponseDto {
  const ForgotPasswordResponseDto({required this.message});

  final String message;

  factory ForgotPasswordResponseDto.fromJson(Map<String, dynamic> json) {
    return ForgotPasswordResponseDto(message: json['message'] as String? ?? '');
  }
}
