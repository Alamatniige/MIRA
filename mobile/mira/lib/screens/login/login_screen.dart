import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../widgets/mira_button.dart';

/// Login screen - matches web LoginPage design (gradient, teal, glassmorphism)
class LoginScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;

  const LoginScreen({super.key, required this.onLoginSuccess});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;
  String? _error;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    setState(() {
      _error = null;
      _isLoading = true;
    });

    await Future.delayed(const Duration(milliseconds: 800));

    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty) {
      setState(() {
        _error = 'Email is required.';
        _isLoading = false;
      });
      return;
    }
    if (password.isEmpty) {
      setState(() {
        _error = 'Password is required.';
        _isLoading = false;
      });
      return;
    }

    setState(() => _isLoading = false);
    widget.onLoginSuccess();
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenHeight < 600 || screenWidth < 360;
    final horizontalPadding = isSmallScreen ? 20.0 : 24.0;
    final topPadding = isSmallScreen ? 24.0 : 48.0;

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFF8FAFC),
              Color(0xFFEFF6FF),
              Color(0xFFF0FDFA),
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
            child: ConstrainedBox(
              constraints: BoxConstraints(minHeight: screenHeight - MediaQuery.of(context).padding.top - MediaQuery.of(context).padding.bottom),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(height: topPadding),
                    // Logo
                    Container(
                      width: isSmallScreen ? 56 : 64,
                      height: isSmallScreen ? 56 : 64,
                      decoration: BoxDecoration(
                        gradient: AppColors.primaryGradient,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.tealPrimary.withOpacity(0.3),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Icon(Icons.shield_outlined, color: AppColors.white, size: isSmallScreen ? 28 : 32),
                    ),
                    SizedBox(height: isSmallScreen ? 16 : 20),
                    const Text(
                      'Welcome to MIRA',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: AppColors.navyLight,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Management of IT Resources and Assets',
                      style: TextStyle(
                        fontSize: isSmallScreen ? 12 : 13,
                        color: AppColors.gray600,
                      ),
                      textAlign: TextAlign.center,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    SizedBox(height: isSmallScreen ? 24 : 32),
                    // Email field
                    TextField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        labelText: 'Email Address',
                        hintText: 'you@company.com',
                        prefixIcon: Icon(Icons.email_outlined, color: AppColors.gray400),
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Password field
                    TextField(
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        hintText: 'Enter your password',
                        prefixIcon: const Icon(Icons.lock_outline, color: AppColors.gray400),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                            color: AppColors.gray400,
                          ),
                          onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                        ),
                      ),
                    ),
                    if (_error != null) ...[
                      const SizedBox(height: 12),
                      Text(
                        _error!,
                        style: const TextStyle(color: AppColors.statusIssue, fontSize: 13),
                        textAlign: TextAlign.center,
                      ),
                    ],
                    const SizedBox(height: 24),
                    MiraButton(
                      label: _isLoading ? 'Signing in…' : 'Sign In',
                      isLoading: _isLoading,
                      icon: Icons.arrow_forward,
                      onPressed: _handleLogin,
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.shield, size: 14, color: AppColors.tealPrimary),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            'Internal use only. Contact IT for access.',
                            style: TextStyle(fontSize: 12, color: AppColors.gray500),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: topPadding),
                  ],
                ),
            ),
          ),
        ),
      ),
    );
  }
}
