class AppConfig {
  AppConfig._();

  //Base Url
  // flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:8080',
  );

  static const int connectTimeoutMs = int.fromEnvironment(
    'CONNECT_TIMEOUT_MS',
    defaultValue: 15000,
  );

  static const int receiveTimeoutMs = int.fromEnvironment(
    'RECEIVE_TIMEOUT_MS',
    defaultValue: 20000,
  );

  static Duration get connectTimeout =>
      Duration(milliseconds: connectTimeoutMs);

  static Duration get receiveTimeout =>
      Duration(milliseconds: receiveTimeoutMs);

  // Normalized base URL so API client can safely append paths.
  static String get normalizedBaseUrl {
    if (apiBaseUrl.endsWith('/')) {
      return apiBaseUrl.substring(0, apiBaseUrl.length - 1);
    }
    return apiBaseUrl;
  }
}
