import 'api_exception.dart';

/// Converts any caught exception into a safe, user-friendly string.
///
/// - [ApiException] already carries a human-readable message set by [ApiClient],
///   so we surface it directly.
/// - Everything else gets a generic fallback so no raw class names, stack
///   traces, or platform exception details are ever shown to the user.
String formatErrorForUser(Object error) {
  if (error is ApiException) return error.message;
  return 'An unexpected error occurred. Please try again.';
}
