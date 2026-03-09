import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
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
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  // Define focus nodes to animate the borders when focused
  final FocusNode _emailFocus = FocusNode();
  final FocusNode _passwordFocus = FocusNode();

  bool _obscurePassword = true;
  bool _isLoading = false;
  bool _rememberMe = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    // Add listeners to trigger rebuilds on focus change and animate borders
    _emailFocus.addListener(() => setState(() {}));
    _passwordFocus.addListener(() => setState(() {}));
    _loadSavedCredentials();
  }

  Future<void> _loadSavedCredentials() async {
    final prefs = await SharedPreferences.getInstance();
    final savedEmail = prefs.getString('remembered_email');
    final savedPassword = prefs.getString('remembered_password');
    final rememberMe = prefs.getBool('remember_me') ?? false;

    if (rememberMe && savedEmail != null) {
      setState(() {
        _emailController.text = savedEmail;
        if (savedPassword != null) {
          _passwordController.text = savedPassword;
        }
        _rememberMe = true;
      });
    }
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
      _isLoading = true;
    });

    await Future.delayed(const Duration(milliseconds: 1000));

    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty) {
      setState(() {
        _error = 'Please enter your email address.';
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

    // Save or clear credentials based on "Remember Me"
    final prefs = await SharedPreferences.getInstance();
    if (_rememberMe) {
      await prefs.setBool('remember_me', true);
      await prefs.setString('remembered_email', email);
      await prefs.setString('remembered_password', password); // In a real app, use secure storage
    } else {
      await prefs.setBool('remember_me', false);
      await prefs.remove('remembered_email');
      await prefs.remove('remembered_password');
    }

    setState(() => _isLoading = false);
    widget.onLoginSuccess();
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
                    AppColors.tealLight.withOpacity(isDark ? 0.3 : 0.4),
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
                    Colors.white.withOpacity(isDark ? 0.05 : 0.2),
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
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
      child: Column(
        children: [
          // Glowing Logo Centerpiece
          Stack(
            alignment: Alignment.center,
            children: [
              // Outer Soft Glow
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFEAB308).withOpacity(0.15),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFEAB308).withOpacity(0.2),
                      blurRadius: 30,
                      spreadRadius: 10,
                    ),
                  ],
                ),
              ),
              // Inner Bright Ring
              Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFEAB308).withOpacity(0.3),
                ),
              ),
              // Core Icon Circle
              Container(
                height: 70,
                width: 70,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: [Color(0xFFFACC15), Color(0xFFEAB308)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Color(0xFFEAB308),
                      blurRadius: 15,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(
                    Icons.email_rounded,
                    size: 36,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 32),

          const Text(
            'Welcome Back',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: -0.5,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Sign in to your MIRA account',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: Colors.white.withOpacity(0.8),
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
            color: Colors.black.withOpacity(0.15),
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
            padding: const EdgeInsets.fromLTRB(32, 48, 32, 32),
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

                const SizedBox(height: 24),

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
                    Row(
                      children: [
                        SizedBox(
                          width: 24,
                          height: 24,
                          child: Checkbox(
                            value: _rememberMe,
                            onChanged: (value) =>
                                setState(() => _rememberMe = value ?? false),
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
                                .withOpacity(0.1),
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

                if (_error != null) ...[
                  const SizedBox(height: 24),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                      vertical: 12,
                      horizontal: 16,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.statusReported.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: AppColors.statusReported.withOpacity(0.3),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.error_outline_rounded,
                          color: AppColors.statusReported,
                          size: 18,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          _error!,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: AppColors.statusReported,
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],

                const SizedBox(height: 48),

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
        : (isDark ? Colors.white.withOpacity(0.05) : AppColors.gray200);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            color: isDark ? AppColors.gray300 : AppColors.gray600,
            fontSize: 14,
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
                      color: primaryColor.withOpacity(0.15),
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
                contentPadding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
