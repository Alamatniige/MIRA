import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import '../config/app_config.dart';
import '../storage/token_storage.dart';
import 'api_exception.dart';

typedef TokenProvider = Future<String?> Function();

class ApiClient {
  ApiClient({
    http.Client? httpClient,
    TokenProvider? tokenProvider,
    TokenStorage? tokenStorage,
  }) : _http = httpClient ?? http.Client(),
       _tokenProvider = tokenProvider,
       _tokenStorage = tokenStorage ?? TokenStorage();

  final http.Client _http;
  final TokenProvider? _tokenProvider;
  final TokenStorage _tokenStorage;

  Uri _buildUri(String path, [Map<String, dynamic>? query]) {
    final base = AppConfig.normalizedBaseUrl;
    final normalizedPath = path.startsWith('/') ? path : '/$path';
    final uri = Uri.parse('$base$normalizedPath');

    if (query == null || query.isEmpty) return uri;

    final qp = <String, String>{};
    for (final entry in query.entries) {
      if (entry.value != null) {
        qp[entry.key] = entry.value.toString();
      }
    }
    return uri.replace(queryParameters: qp);
  }

  Future<Map<String, String>> _headers({
    Map<String, String>? headers,
    bool requiresAuth = true,
  }) async {
    final out = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client-Type': 'mobile',
      ...?headers,
    };

    if (!requiresAuth) {
      return out;
    }

    final token =
        await (_tokenProvider?.call() ?? _tokenStorage.getAccessToken());

    if (token != null && token.isNotEmpty) {
      out['Authorization'] = 'Bearer $token';
    }

    return out;
  }

  Future<dynamic> get(
    String path, {
    Map<String, dynamic>? query,
    Map<String, String>? headers,
    bool requiresAuth = true,
  }) async {
    final uri = _buildUri(path, query);
    final h = await _headers(headers: headers, requiresAuth: requiresAuth);

    try {
      final response = await _http
          .get(uri, headers: h)
          .timeout(AppConfig.receiveTimeout);
      return _handleResponse(response);
    } on TimeoutException catch (e) {
      debugPrint('[ApiClient][GET] timeout uri=$uri error=$e');
      throw ApiException(
        'Request timeout. Check your network and API_BASE_URL.',
        cause: e,
      );
    } on HandshakeException catch (e) {
      debugPrint('[ApiClient][GET] handshake uri=$uri error=$e');
      throw ApiException(
        'TLS/SSL handshake failed. If using local API, use http:// URL.',
        cause: e,
      );
    } on SocketException catch (e) {
      debugPrint('[ApiClient][GET] socket uri=$uri error=$e');
      throw ApiException(
        'Unable to reach API server. If using a physical phone, set API_BASE_URL to your PC LAN IP (for example: http://192.168.1.8:8080). 10.0.2.2 works only on Android emulator.',
        cause: e,
      );
    } catch (e) {
      debugPrint('[ApiClient][GET] unknown uri=$uri error=$e');
      throw ApiException('Network error', cause: e);
    }
  }

  Future<dynamic> post(
    String path, {
    Object? body,
    Map<String, dynamic>? query,
    Map<String, String>? headers,
    bool requiresAuth = true,
  }) async {
    final uri = _buildUri(path, query);
    final h = await _headers(headers: headers, requiresAuth: requiresAuth);

    try {
      final response = await _http
          .post(uri, headers: h, body: body == null ? null : jsonEncode(body))
          .timeout(AppConfig.receiveTimeout);
      return _handleResponse(response);
    } on TimeoutException catch (e) {
      debugPrint('[ApiClient][POST] timeout uri=$uri error=$e');
      throw ApiException(
        'Request timeout. Check your network and API_BASE_URL.',
        cause: e,
      );
    } on HandshakeException catch (e) {
      debugPrint('[ApiClient][POST] handshake uri=$uri error=$e');
      throw ApiException(
        'TLS/SSL handshake failed. If using local API, use http:// URL.',
        cause: e,
      );
    } on SocketException catch (e) {
      debugPrint('[ApiClient][POST] socket uri=$uri error=$e');
      throw ApiException(
        'Unable to reach API server. If using a physical phone, set API_BASE_URL to your PC LAN IP (for example: http://192.168.1.8:8080). 10.0.2.2 works only on Android emulator.',
        cause: e,
      );
    } catch (e) {
      debugPrint('[ApiClient][POST] unknown uri=$uri error=$e');
      debugPrint('[ApiClient][POST] unknown uri=$uri error=$e');
      throw ApiException('Network error', cause: e);
    }
  }

  Future<dynamic> multipartPost(
    String path, {
    required String fileField,
    required File file,
    Map<String, String>? fields,
    Map<String, String>? headers,
    bool requiresAuth = true,
  }) async {
    final uri = _buildUri(path);
    final h = await _headers(headers: headers, requiresAuth: requiresAuth);

    try {
      final request = http.MultipartRequest('POST', uri);
      request.headers.addAll(h);
      request.headers.remove('Content-Type');

      if (fields != null) {
        request.fields.addAll(fields);
      }

      final multipartFile = await http.MultipartFile.fromPath(fileField, file.path);
      request.files.add(multipartFile);

      final streamedResponse = await _http.send(request).timeout(AppConfig.receiveTimeout);
      final response = await http.Response.fromStream(streamedResponse);
      return _handleResponse(response);
    } on TimeoutException catch (e) {
      debugPrint('[ApiClient][MultipartPOST] timeout uri=$uri error=$e');
      throw ApiException(
        'Request timeout. Check your network and API_BASE_URL.',
        cause: e,
      );
    } on HandshakeException catch (e) {
      debugPrint('[ApiClient][MultipartPOST] handshake uri=$uri error=$e');
      throw ApiException(
        'TLS/SSL handshake failed. If using local API, use http:// URL.',
        cause: e,
      );
    } on SocketException catch (e) {
      debugPrint('[ApiClient][MultipartPOST] socket uri=$uri error=$e');
      throw ApiException(
        'Unable to reach API server. Check your connection.',
        cause: e,
      );
    } catch (e) {
      debugPrint('[ApiClient][MultipartPOST] unknown uri=$uri error=$e');
      throw ApiException('Network error', cause: e);
    }
  }

  Future<dynamic> put(
    String path, {
    Object? body,
    Map<String, dynamic>? query,
    Map<String, String>? headers,
    bool requiresAuth = true,
  }) async {
    final uri = _buildUri(path, query);
    final h = await _headers(headers: headers, requiresAuth: requiresAuth);

    try {
      final response = await _http
          .put(uri, headers: h, body: body == null ? null : jsonEncode(body))
          .timeout(AppConfig.receiveTimeout);
      return _handleResponse(response);
    } on TimeoutException catch (e) {
      debugPrint('[ApiClient][PUT] timeout uri=$uri error=$e');
      throw ApiException(
        'Request timeout. Check your network and API_BASE_URL.',
        cause: e,
      );
    } on HandshakeException catch (e) {
      debugPrint('[ApiClient][PUT] handshake uri=$uri error=$e');
      throw ApiException(
        'TLS/SSL handshake failed. If using local API, use http:// URL.',
        cause: e,
      );
    } on SocketException catch (e) {
      debugPrint('[ApiClient][PUT] socket uri=$uri error=$e');
      throw ApiException(
        'Unable to reach API server. If using a physical phone, set API_BASE_URL to your PC LAN IP (for example: http://192.168.1.8:8080). 10.0.2.2 works only on Android emulator.',
        cause: e,
      );
    } catch (e) {
      debugPrint('[ApiClient][PUT] unknown uri=$uri error=$e');
      throw ApiException('Network error', cause: e);
    }
  }

  Future<dynamic> delete(
    String path, {
    Object? body,
    Map<String, dynamic>? query,
    Map<String, String>? headers,
    bool requiresAuth = true,
  }) async {
    final uri = _buildUri(path, query);
    final h = await _headers(headers: headers, requiresAuth: requiresAuth);

    try {
      final request = http.Request('DELETE', uri)..headers.addAll(h);

      if (body != null) {
        request.body = jsonEncode(body);
      }

      final streamed = await _http
          .send(request)
          .timeout(AppConfig.receiveTimeout);
      final response = await http.Response.fromStream(streamed);
      return _handleResponse(response);
    } on TimeoutException catch (e) {
      debugPrint('[ApiClient][DELETE] timeout uri=$uri error=$e');
      throw ApiException(
        'Request timeout. Check your network and API_BASE_URL.',
        cause: e,
      );
    } on HandshakeException catch (e) {
      debugPrint('[ApiClient][DELETE] handshake uri=$uri error=$e');
      throw ApiException(
        'TLS/SSL handshake failed. If using local API, use http:// URL.',
        cause: e,
      );
    } on SocketException catch (e) {
      debugPrint('[ApiClient][DELETE] socket uri=$uri error=$e');
      throw ApiException(
        'Unable to reach API server. If using a physical phone, set API_BASE_URL to your PC LAN IP (for example: http://192.168.1.8:8080). 10.0.2.2 works only on Android emulator.',
        cause: e,
      );
    } catch (e) {
      debugPrint('[ApiClient][DELETE] unknown uri=$uri error=$e');
      throw ApiException('Network error', cause: e);
    }
  }

  dynamic _handleResponse(http.Response response) {
    if (response.statusCode == 204 || response.body.isEmpty) {
      return null;
    }

    final dynamic decoded = _tryDecodeJson(response.body);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiException(
        _extractErrorMessage(decoded) ?? 'API error: ${response.statusCode}',
        statusCode: response.statusCode,
      );
    }

    return decoded;
  }

  dynamic _tryDecodeJson(String raw) {
    try {
      return jsonDecode(raw);
    } catch (_) {
      return raw;
    }
  }

  String? _extractErrorMessage(dynamic decoded) {
    if (decoded is Map<String, dynamic>) {
      final message = decoded['message'] ?? decoded['error'];
      if (message is String && message.trim().isNotEmpty) {
        return message;
      }
    }
    if (decoded is String && decoded.trim().isNotEmpty) {
      return decoded;
    }

    return null;
  }

  void dispose() {
    _http.close();
  }
}
