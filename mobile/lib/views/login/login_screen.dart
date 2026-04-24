import 'package:flutter/material.dart';
import '../../controllers/login_controller.dart';
import '../../core/network/api_exception.dart';
import '../../theme/app_theme.dart';
import '../../widgets/mira_gradient_button.dart';
import 'forgot_password_screen.dart';

/// Login screen - fully redesigned with premium inputs, glowing centerpiece, and beautiful gradients
class LoginScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;

  const LoginScreen({super.key, required this.onLoginSuccess});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _loginController = LoginController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  // Define focus nodes to animate the borders when focused
  final FocusNode _emailFocus = FocusNode();
  final FocusNode _passwordFocus = FocusNode();

  bool _obscurePassword = true;
  bool _isLoading = false;
  bool _rememberMe = false;
  String? _error;
  // True when the server returns 403 + inactive account — shows a dedicated
  // banner with admin contact guidance instead of the generic error.
  bool _isAccountDeactivated = false;

  @override
  void initState() {
    super.initState();
    // Add listeners to trigger rebuilds on focus change and animate borders
    _emailFocus.addListener(() => setState(() {}));
    _passwordFocus.addListener(() => setState(() {}));
    _loadSavedCredentials();
  }

  Future<void> _loadSavedCredentials() async {
    final remembered = await _loginController.loadRememberedLogin();
    if (!mounted) {
      return;
    }

    setState(() {
      _rememberMe = remembered.rememberMe;
      _emailController.text = remembered.email ?? '';
      _passwordController.text = remembered.password ?? '';
    });
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _emailFocus.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    setState(() {
      _error = null;
      _isAccountDeactivated = false;
      _isLoading = true;
    });

    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty) {
      setState(() {
        _error = 'Please enter your email address.';
        _isLoading = false;
      });
      return;
    }
    // Fix 8: client-side email format validation before any network call
    if (!RegExp(r'^[^@]+@[^@]+\.[^@]+$').hasMatch(email)) {
      setState(() {
        _error = 'Please enter a valid email address.';
        _isLoading = false;
      });
      return;
    }
    if (password.isEmpty) {
      setState(() {
        _error = 'Please enter your password.';
        _isLoading = false;
      });
      return;
    }

    try {
      await _loginController.signIn(
        email: email,
        password: password,
        rememberMe: _rememberMe,
      );

      if (!mounted) {
        return;
      }

      setState(() => _isLoading = false);
      widget.onLoginSuccess();
    } on ApiException catch (e) {
      debugPrint(
        '[LoginScreen] ApiException status=${e.statusCode} message=${e.message} cause=${e.cause}',
      );
      if (!mounted) return;

      final mappedError = _mapLoginError(e);
      setState(() {
        _error = mappedError;
        _isAccountDeactivated = mappedError == null && e.statusCode == 403;
        _isLoading = false;
      });
    } catch (_) {
      debugPrint('[LoginScreen] Unknown login error');
      if (!mounted) {
        return;
      }

      setState(() {
        _error = 'Unable to sign in right now. Please try again.';
        _isLoading = false;
      });
    }
  }

  /// Maps a caught [ApiException] to a user-friendly string.
  /// Returns [null] for the deactivated-account case so the caller can show
  /// a dedicated banner instead.
  String? _mapLoginError(ApiException error) {
    // Deactivated account: 403 + server message containing 'inactive'.
    // Return null so _handleLogin can set _isAccountDeactivated = true.
    if (error.statusCode == 403 &&
        error.message.toLowerCase().contains('inactive')) {
      return null;
    }

    // Check status codes first — they produce deterministic, friendly messages.
    // Never show the raw server body for auth failures; it can be ambiguous or
    // developer-facing (e.g. "Unauthorized", "Bad credentials").
    if (error.statusCode == 401 || error.statusCode == 403) {
      return 'Incorrect email or password. Please try again.';
    }

    if (error.statusCode == 429) {
      return 'Too many sign-in attempts. Please wait a moment and try again.';
    }

    if (error.statusCode == 408) {
      return 'Request timed out. Please check your network and try again.';
    }

    if (error.statusCode != null && error.statusCode! >= 500) {
      return 'The server is temporarily unavailable. Please try again later.';
    }

    // For all other cases, use the server message if it looks user-friendly,
    // otherwise fall back to the generic message.
    final message = error.message.trim();
    if (message.isNotEmpty) return message;

    return 'Unable to sign in right now. Please try again.';
  }

  @override
  Widget build(BuildContext context) {
    // The login screen is typically designed around a dark/rich background first
    // Since the app supports dark mode, we will make this stunning in both by using the teal backgrounds.
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: AppColors.tealDark,
      body: Stack(
        children: [
          // Background Gradient Base
          Container(
            decoration: BoxDecoration(
              gradient: isDark
                  ? AppColors.darkTealBackgroundGradient
                  : const LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [AppColors.tealDark, AppColors.tealPrimary],
                    ),
            ),
          ),

          // Large floating orb 1 (Top Right)
          Positioned(
            top: -100,
            right: -80,
            child: Container(
              width: 400,
              height: 400,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    AppColors.tealLight.withValues(alpha: isDark ? 0.3 : 0.4),
                    Colors.transparent,
                  ],
                  stops: const [0.2, 1.0],
                ),
              ),
            ),
          ),

          // Large floating orb 2 (Bottom Left)
          Positioned(
            bottom: -80,
            left: -120,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    Colors.white.withValues(alpha: isDark ? 0.05 : 0.2),
                    Colors.transparent,
                  ],
                  stops: const [0.1, 1.0],
                ),
              ),
            ),
          ),

          // Main Content
          SafeArea(
            bottom: false,
            child: Column(
              children: [
                _buildTopSection(context),
                Expanded(child: _buildBottomSection(context)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopSection(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      child: Column(
        children: [
          // Glowing Logo Centerpiece
          Stack(
            alignment: Alignment.center,
            children: [
              // Outer Soft Glow
              Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.15),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.white.withValues(alpha: 0.2),
                      blurRadius: 30,
                      spreadRadius: 10,
                    ),
                  ],
                ),
              ),
              // Inner Bright Ring
              Container(
                width: 70,
                height: 70,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.3),
                ),
              ),
              // Core Icon Circle
              Container(
                height: 56,
                width: 56,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.white.withValues(alpha: 0.5),
                      blurRadius: 15,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Center(
                  child: Image.asset(
                    'mira-favicon/web-app-manifest-192x192.png',
                    width: 32,
                    height: 32,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          const Text(
            'Welcome Back',
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: -0.5,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Sign in to your MIRA account',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.white.withValues(alpha: 0.8),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomSection(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final theme = Theme.of(context);

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : Colors.white,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(40),
          topRight: Radius.circular(40),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.15),
            blurRadius: 30,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(40),
          topRight: Radius.circular(40),
        ),
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(32, 28, 32, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildModernTextField(
                  context: context,
                  label: 'Email Address',
                  controller: _emailController,
                  node: _emailFocus,
                  icon: Icons.email_rounded,
                  keyboardType: TextInputType.emailAddress,
                  hintText: 'hello@company.com',
                ),
                const SizedBox(height: 16),

                _buildModernTextField(
                  context: context,
                  label: 'Password',
                  controller: _passwordController,
                  node: _passwordFocus,
                  icon: Icons.lock_rounded,
                  isPassword: true,
                  hintText: '••••••••',
                ),

                const SizedBox(height: 20),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    InkWell(
                      borderRadius: BorderRadius.circular(8),
                      onTap: () => setState(() => _rememberMe = !_rememberMe),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Row(
                          children: [
                            SizedBox(
                              width: 24,
                              height: 24,
                              child: Checkbox(
                                value: _rememberMe,
                                onChanged: (value) => setState(
                                  () => _rememberMe = value ?? false,
                                ),
                                activeColor: isDark
                                    ? AppColors.tealLight
                                    : AppColors.tealPrimary,
                                checkColor: isDark
                                    ? AppColors.darkSurface
                                    : Colors.white,
                                side: BorderSide(
                                  color: isDark
                                      ? AppColors.gray600
                                      : AppColors.gray400,
                                  width: 1.5,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(6),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Text(
                              'Remember me',
                              style: theme.textTheme.labelMedium?.copyWith(
                                color: isDark
                                    ? AppColors.gray300
                                    : AppColors.gray600,
                                fontWeight: FontWeight.w500,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ForgotPasswordScreen(),
                          ),
                        );
                      },
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.zero,
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        overlayColor:
                            (isDark
                                    ? AppColors.tealLight
                                    : AppColors.tealPrimary)
                                .withValues(alpha: 0.1),
                      ),
                      child: Text(
                        'Forgot Password?',
                        style: theme.textTheme.labelMedium?.copyWith(
                          color: isDark
                              ? AppColors.tealLight
                              : AppColors.tealPrimary,
                          fontWeight: FontWeight.w700,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ),

                // ── Deactivated account banner ────────────────────────────
                if (_isAccountDeactivated) ...[
                  const SizedBox(height: 24),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF59E0B).withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: const Color(0xFFF59E0B).withValues(alpha: 0.35),
                      ),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF59E0B).withValues(alpha: 0.15),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.lock_person_rounded,
                            color: Color(0xFFB45309),
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Account Deactivated',
                                style: theme.textTheme.bodyMedium?.copyWith(
                                  color: const Color(0xFF92400E),
                                  fontWeight: FontWeight.w800,
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Your account has been deactivated. Please contact your IT administrator to restore access.',
                                style: theme.textTheme.bodySmall?.copyWith(
                                  color: const Color(0xFFB45309),
                                  fontWeight: FontWeight.w500,
                                  height: 1.45,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],

                // ── Generic error banner ──────────────────────────────────
                if (_error != null) ...[
                  const SizedBox(height: 24),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                      vertical: 12,
                      horizontal: 16,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.statusReported.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: AppColors.statusReported.withValues(alpha: 0.3),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.error_outline_rounded,
                          color: AppColors.statusReported,
                          size: 18,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            _error!,
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: AppColors.statusReported,
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 32),

                MiraGradientButton(
                  label: _isLoading ? 'SIGNING IN...' : 'SIGN IN',
                  isLoading: _isLoading,
                  onPressed: _isLoading ? null : _handleLogin,
                ),

                // Extra padding for keyboard/bottom screen area
                const SizedBox(height: 60),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildModernTextField({
    required BuildContext context,
    required String label,
    required TextEditingController controller,
    required FocusNode node,
    required IconData icon,
    bool isPassword = false,
    TextInputType? keyboardType,
    required String hintText,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isFocused = node.hasFocus;

    // Determine colors based on theme and focus state
    final primaryColor = isDark ? AppColors.tealLight : AppColors.tealPrimary;
    final bgColor = isDark ? AppColors.darkBackground : AppColors.gray50;

    // Border logic inside the elevated container
    final borderColor = isFocused
        ? primaryColor
        : (isDark ? Colors.white.withValues(alpha: 0.05) : AppColors.gray200);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            color: isDark ? AppColors.gray300 : AppColors.gray600,
            fontSize: 13,
          ),
        ),
        const SizedBox(height: 8),
        AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: borderColor,
              width: isFocused ? 2 : 1, // Thicker border when focused
            ),
            boxShadow: isFocused
                ? [
                    BoxShadow(
                      color: primaryColor.withValues(alpha: 0.15),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ]
                : [],
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
            child: TextField(
              controller: controller,
              focusNode: node,
              obscureText: isPassword ? _obscurePassword : false,
              keyboardType: keyboardType,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 16,
                color: isDark ? Colors.white : AppColors.navy,
                letterSpacing: isPassword && _obscurePassword ? 2 : null,
              ),
              cursorColor: primaryColor,
              decoration: InputDecoration(
                prefixIcon: Icon(
                  icon,
                  color: isFocused ? primaryColor : AppColors.gray400,
                  size: 22,
                ),
                suffixIcon: isPassword
                    ? IconButton(
                        icon: Icon(
                          _obscurePassword
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                          color: isFocused ? primaryColor : AppColors.gray400,
                          size: 22,
                        ),
                        onPressed: () => setState(
                          () => _obscurePassword = !_obscurePassword,
                        ),
                      )
                    : null,
                hintText: hintText,
                hintStyle: TextStyle(
                  color: AppColors.gray400,
                  fontWeight: FontWeight.w400,
                  letterSpacing: isPassword ? 2 : null,
                ),
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
