import 'package:flutter/material.dart';
import '../../controllers/forgot_password_controller.dart';
import '../../theme/app_theme.dart';
import '../../widgets/mira_gradient_button.dart';
import 'otp_verification_screen.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  final FocusNode _emailFocus = FocusNode();
  final _controller = ForgotPasswordController();

  @override
  void initState() {
    super.initState();
    _emailFocus.addListener(() => setState(() {}));
    _controller.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _emailController.dispose();
    _emailFocus.dispose();
    _controller.dispose();
    super.dispose();
  }

  Future<void> _handleReset() async {
    await _controller.submitEmail(_emailController.text);

    if (!mounted) return;
    if (_controller.step == ForgotPasswordStep.otp) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => OTPVerificationScreen(
            email: _controller.email,
            controller: _controller,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
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

          // Custom Back Button
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.only(top: 8.0, left: 8.0),
              child: IconButton(
                icon: const Icon(
                  Icons.arrow_back_ios_new_rounded,
                  color: Colors.white,
                ),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopSection(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      child: Column(
        children: [
          // Glowing Centerpiece
          Stack(
            alignment: Alignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(
                    0xFFEAB308,
                  ).withAlpha((0.15 * 255).toInt()),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(
                        0xFFEAB308,
                      ).withAlpha((0.2 * 255).toInt()),
                      blurRadius: 30,
                      spreadRadius: 10,
                    ),
                  ],
                ),
              ),
              Container(
                width: 70,
                height: 70,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFEAB308).withAlpha((0.3 * 255).toInt()),
                ),
              ),
              Container(
                height: 50,
                width: 50,
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
                    Icons.lock_reset_rounded,
                    size: 28,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          const Text(
            'Recover Account',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: -0.5,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Enter your email to reset password',
            style: TextStyle(
              fontSize: 16,
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
            padding: const EdgeInsets.fromLTRB(32, 48, 32, 32),
            child: _buildForm(context, theme, isDark),
          ),
        ),
      ),
    );
  }

  Widget _buildForm(BuildContext context, ThemeData theme, bool isDark) {
    return Column(
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

        if (_controller.error != null) ...[
          const SizedBox(height: 24),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
            decoration: BoxDecoration(
              color: AppColors.statusReported.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: AppColors.statusReported.withValues(alpha: 0.3),
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
                  _controller.error!,
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
          label: _controller.isLoading ? 'SENDING...' : 'SEND RESET CODE',
          isLoading: _controller.isLoading,
          onPressed: _controller.isLoading ? null : _handleReset,
        ),

        const SizedBox(height: 24),

        Center(
          child: TextButton(
            onPressed: () => Navigator.of(context).pop(),
            style: TextButton.styleFrom(
              overlayColor:
                  (isDark ? AppColors.tealLight : AppColors.tealPrimary)
                      .withValues(alpha: 0.1),
            ),
            child: Text(
              'Back to Sign In',
              style: theme.textTheme.labelMedium?.copyWith(
                color: isDark ? AppColors.gray300 : AppColors.gray600,
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
          ),
        ),

        const SizedBox(height: 40),
      ],
    );
  }

  Widget _buildModernTextField({
    required BuildContext context,
    required String label,
    required TextEditingController controller,
    required FocusNode node,
    required IconData icon,
    TextInputType? keyboardType,
    required String hintText,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isFocused = node.hasFocus;

    final primaryColor = isDark ? AppColors.tealLight : AppColors.tealPrimary;
    final bgColor = isDark ? AppColors.darkBackground : AppColors.gray50;

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
            fontSize: 14,
          ),
        ),
        const SizedBox(height: 8),
        AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: borderColor, width: isFocused ? 2 : 1),
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
              keyboardType: keyboardType,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 16,
                color: isDark ? Colors.white : AppColors.navy,
              ),
              cursorColor: primaryColor,
              decoration: InputDecoration(
                prefixIcon: Icon(
                  icon,
                  color: isFocused ? primaryColor : AppColors.gray400,
                  size: 22,
                ),
                hintText: hintText,
                hintStyle: const TextStyle(
                  color: AppColors.gray400,
                  fontWeight: FontWeight.w400,
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
