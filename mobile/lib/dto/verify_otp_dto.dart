class VerifyOTPResponseDto {
  const VerifyOTPResponseDto({required this.message, required this.resetToken});

  final String message;
  final String resetToken;

  factory VerifyOTPResponseDto.fromJson(Map<String, dynamic> json) {
    return VerifyOTPResponseDto(
      message: json['message'] as String? ?? '',
      resetToken: json['reset_token'] as String? ?? '',
    );
  }
}
