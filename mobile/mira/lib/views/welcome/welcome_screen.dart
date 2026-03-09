import 'dart:math';
import 'dart:ui';

import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../widgets/mira_button.dart';

/// Data model for onboarding pages
class OnboardingData {
  final String title;
  final String subtitle;
  final String illustration;
  final Color accentColor;

  OnboardingData({
    required this.title,
    required this.subtitle,
    required this.illustration,
    required this.accentColor,
  });
}

class WelcomeScreen extends StatefulWidget {
  final VoidCallback onGetStarted;

  const WelcomeScreen({super.key, required this.onGetStarted});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen>
    with TickerProviderStateMixin {
  late final PageController _pageController;
  late final AnimationController _blobController;
  
  int _currentPage = 0;
  bool _ctaPressed = false;

  final List<OnboardingData> _pages = [
    OnboardingData(
      title: 'Smart IT Inventory',
      subtitle: 'Turn your messy asset list into an organized, always up-to-date workspace with effortless tracking.',
      illustration: 'assets/illustrations/scan.png',
      accentColor: AppColors.tealPrimary,
    ),
    OnboardingData(
      title: 'Real-time Visibility',
      subtitle: 'Monitor hardware status, assign items to team members, and manage lifecycle events in one glance.',
      illustration: 'assets/illustrations/scan.png', // Reusing same for now as per current assets
      accentColor: AppColors.bluePrimary,
    ),
    OnboardingData(
      title: 'Seamless Reporting',
      subtitle: 'Generate detailed reports and history logs for compliance and internal audits without the headache.',
      illustration: 'assets/illustrations/scan.png',
      accentColor: AppColors.tealBlue,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    
    _blobController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 20),
    )..repeat();
  }

  @override
  void dispose() {
    _pageController.dispose();
    _blobController.dispose();
    super.dispose();
  }

  void _onPageChanged(int index) {
    setState(() {
      _currentPage = index;
    });
  }

  void _handleNext() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeInOutCubic,
      );
    } else {
      _finishOnboarding();
    }
  }

  void _finishOnboarding() async {
    setState(() => _ctaPressed = true);
    await Future.delayed(const Duration(milliseconds: 150));
    if (!mounted) return;
    widget.onGetStarted();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    
    return Scaffold(
      backgroundColor: AppColors.gray50,
      body: Stack(
        children: [
          // 1. Dynamic Background
          _buildBackground(size),
          
          // 2. Main Content
          SafeArea(
            child: Column(
              children: [
                // Top Action: Skip
                Align(
                  alignment: Alignment.topRight,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: TextButton(
                      onPressed: _finishOnboarding,
                      style: TextButton.styleFrom(
                        foregroundColor: AppColors.gray500,
                      ),
                      child: const Text(
                        'Skip',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                  ),
                ),
                
                // Onboarding Pages
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: _onPageChanged,
                    itemCount: _pages.length,
                    itemBuilder: (context, index) {
                      return _buildPage(_pages[index]);
                    },
                  ),
                ),
                
                // Bottom Actions: Indicators & CTA
                _buildBottomSection(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBackground(Size size) {
    return AnimatedBuilder(
      animation: _blobController,
      builder: (context, child) {
        return Stack(
          children: [
            // Base Gradient
            Container(
              decoration: const BoxDecoration(
                gradient: AppColors.softBackgroundGradient,
              ),
            ),
            
            // Moving Blobs
            _buildBlob(
              size: size.width * 1.2,
              color: AppColors.tealMuted.withOpacity(0.4),
              top: -size.height * 0.2 + (sin(_blobController.value * 2 * pi) * 40),
              left: -size.width * 0.3 + (cos(_blobController.value * 2 * pi) * 30),
            ),
            
            _buildBlob(
              size: size.width * 0.9,
              color: AppColors.bluePrimary.withOpacity(0.08),
              bottom: size.height * 0.1 + (cos(_blobController.value * 2 * pi) * 50),
              right: -size.width * 0.2 + (sin(_blobController.value * 2 * pi) * 40),
            ),

            // Subtle Grain/Texture overlay could go here
            
            // Blur for the blobs
            Positioned.fill(
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 60, sigmaY: 60),
                child: Container(color: Colors.transparent),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildBlob({
    required double size,
    required Color color,
    double? top,
    double? left,
    double? right,
    double? bottom,
  }) {
    return Positioned(
      top: top,
      left: left,
      right: right,
      bottom: bottom,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: color,
          shape: BoxShape.circle,
        ),
      ),
    );
  }

  Widget _buildPage(OnboardingData page) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Illustration with Glow
          Flexible(
            flex: 3,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Glow
                Container(
                  width: 240,
                  height: 240,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [
                        page.accentColor.withOpacity(0.2),
                        page.accentColor.withOpacity(0),
                      ],
                    ),
                  ),
                ),
                
                // Image
                Hero(
                  tag: 'onboarding_image',
                  child: Image.asset(
                    page.illustration,
                    height: 220,
                    fit: BoxFit.contain,
                  ),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 48),
          
          // Content Card
          Flexible(
            flex: 2,
            child: Column(
              children: [
                Text(
                  page.title,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    color: AppColors.navy,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  page.subtitle,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 15,
                    color: AppColors.gray600,
                    height: 1.6,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomSection() {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Page Indicators
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              _pages.length,
              (index) => AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.only(right: 8),
                height: 8,
                width: _currentPage == index ? 24 : 8,
                decoration: BoxDecoration(
                  color: _currentPage == index 
                      ? _pages[_currentPage].accentColor 
                      : AppColors.gray300,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
          ),
          
          const SizedBox(height: 40),
          
          // CTA Button
          MiraButton(
            label: _currentPage == _pages.length - 1 ? 'Get Started' : 'Continue',
            icon: Icons.arrow_forward_rounded,
            backgroundColor: _pages[_currentPage].accentColor,
            onPressed: _handleNext,
          ),
          
          const SizedBox(height: 12),
        ],
      ),
    );
  }
}

