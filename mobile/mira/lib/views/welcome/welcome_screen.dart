import 'dart:math';
import 'dart:ui';

import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../widgets/mira_button.dart';

/// Welcome/Splash screen - shows first when app launches, before Login
class WelcomeScreen extends StatefulWidget {
  final VoidCallback onGetStarted;

  const WelcomeScreen({super.key, required this.onGetStarted});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen>
    with TickerProviderStateMixin {
  late final AnimationController _controller;
  late final AnimationController _glowController;

  Animation<double> _logoFade = const AlwaysStoppedAnimation(0);
  Animation<Offset> _logoSlide = const AlwaysStoppedAnimation(Offset.zero);

  Animation<double> _titleFade = const AlwaysStoppedAnimation(0);
  Animation<Offset> _titleSlide = const AlwaysStoppedAnimation(Offset.zero);

  Animation<double> _bodyFade = const AlwaysStoppedAnimation(0);
  Animation<Offset> _bodySlide = const AlwaysStoppedAnimation(Offset.zero);

  Animation<double> _ctaFade = const AlwaysStoppedAnimation(0);
  Animation<Offset> _ctaSlide = const AlwaysStoppedAnimation(Offset.zero);

  Animation<double> _glowScale = const AlwaysStoppedAnimation(1.0);

  bool _ctaPressed = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );

    _logoFade = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.0, 0.45, curve: Curves.easeOutCubic),
    );
    _logoSlide = Tween<Offset>(
      begin: const Offset(0, 0.18),
      end: Offset.zero,
    ).animate(_logoFade);

    _titleFade = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.18, 0.65, curve: Curves.easeOutCubic),
    );
    _titleSlide = Tween<Offset>(
      begin: const Offset(0, 0.22),
      end: Offset.zero,
    ).animate(_titleFade);

    _bodyFade = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.36, 0.85, curve: Curves.easeOutCubic),
    );
    _bodySlide = Tween<Offset>(
      begin: const Offset(0, 0.24),
      end: Offset.zero,
    ).animate(_bodyFade);

    _ctaFade = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.55, 1.0, curve: Curves.easeOutCubic),
    );
    _ctaSlide = Tween<Offset>(
      begin: const Offset(0, 0.26),
      end: Offset.zero,
    ).animate(_ctaFade);

    _glowController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    )..repeat(reverse: true);
    _glowScale = Tween<double>(begin: 0.96, end: 1.02).animate(
      CurvedAnimation(parent: _glowController, curve: Curves.easeInOut),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    _glowController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isSmallHeight = constraints.maxHeight < 720;
          final horizontalPadding = isSmallHeight ? 20.0 : 28.0;
          final contentMaxWidth = min(constraints.maxWidth, 480.0);

          return Container(
            width: double.infinity,
            height: double.infinity,
            decoration: const BoxDecoration(
              gradient: AppColors.softBackgroundGradient,
            ),
            child: Stack(
              children: [
                SafeArea(
                  child: Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(
                        horizontal: horizontalPadding,
                        vertical: isSmallHeight ? 16 : 24,
                      ),
                      child: ConstrainedBox(
                        constraints: BoxConstraints(maxWidth: contentMaxWidth),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            SizedBox(height: isSmallHeight ? 32 : 56),
                            FadeTransition(
                              opacity: _logoFade,
                              child: SlideTransition(
                                position: _logoSlide,
                                child: _buildHeroCard(isCompact: isSmallHeight),
                              ),
                            ),
                            SizedBox(height: isSmallHeight ? 20 : 28),
                            FadeTransition(
                              opacity: _titleFade,
                              child: SlideTransition(
                                position: _titleSlide,
                                child: _buildTitleAndSubtitle(),
                              ),
                            ),
                            const SizedBox(height: 10),
                            FadeTransition(
                              opacity: _bodyFade,
                              child: SlideTransition(
                                position: _bodySlide,
                                child: _buildBodyText(),
                              ),
                            ),
                            const Spacer(),
                            Padding(
                              padding: EdgeInsets.only(
                                bottom: isSmallHeight ? 4 : 12,
                              ),
                              child: _buildCtaSection(isCompact: isSmallHeight),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildHeroCard({required bool isCompact}) {
    return ScaleTransition(
      scale: _glowScale,
      child: SizedBox(
        width: isCompact ? 220 : 240,
        height: isCompact ? 220 : 240,
        child: Stack(
          alignment: Alignment.center,
          children: [
            Positioned.fill(
              child: Align(
                alignment: const Alignment(0, 0.1),
                child: Container(
                  width: isCompact ? 210 : 230,
                  height: isCompact ? 210 : 230,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(120),
                    gradient: RadialGradient(
                      colors: [
                        AppColors.tealMuted.withOpacity(0.9),
                        AppColors.tealMuted.withOpacity(0.0),
                      ],
                      radius: 0.9,
                    ),
                  ),
                ),
              ),
            ),
            FittedBox(
              fit: BoxFit.contain,
              child: Image.asset('assets/illustrations/scan.png'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTitleAndSubtitle() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          'Welcome to MIRA',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w700,
            color: AppColors.navy,
          ),
        ),
        const SizedBox(height: 8),
      ],
    );
  }

  Widget _buildBodyText() {
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 360),
        child: Text(
          'Turn your IT inventory into an organized, always up‑to‑date workspace.',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 13,
            color: AppColors.gray600,
            height: 1.6,
          ),
        ),
      ),
    );
  }

  Widget _buildCtaSection({required bool isCompact}) {
    return FadeTransition(
      opacity: _ctaFade,
      child: SlideTransition(
        position: _ctaSlide,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedScale(
              scale: _ctaPressed ? 0.97 : 1.0,
              duration: const Duration(milliseconds: 140),
              curve: Curves.easeOutCubic,
              child: MiraButton(
                label: 'Get Started',
                icon: Icons.arrow_forward_rounded,
                backgroundColor: AppColors.tealLight,
                onPressed: () async {
                  setState(() {
                    _ctaPressed = true;
                  });
                  await Future.delayed(const Duration(milliseconds: 120));
                  if (!mounted) return;
                  setState(() {
                    _ctaPressed = false;
                  });
                  widget.onGetStarted();
                },
              ),
            ),
            SizedBox(height: isCompact ? 18 : 26),
          ],
        ),
      ),
    );
  }
}
