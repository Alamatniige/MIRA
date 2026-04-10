import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

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

  int _currentPage = 0;
  double _pageValue = 0.0;

  List<OnboardingData> get _pages => [
    OnboardingData(
      title: 'Smart IT Inventory',
      subtitle:
          'Turn your messy asset list into an organized, always up-to-date workspace with effortless tracking.',
      illustration: 'assets/illustrations/inventory.png',
      accentColor: AppColors.tealPrimary,
    ),
    OnboardingData(
      title: 'Real-time Visibility',
      subtitle:
          'Monitor hardware status, assign items to team members, and manage lifecycle events.',
      illustration: 'assets/illustrations/visibility.png',
      accentColor: AppColors.tealPrimary,
    ),
    OnboardingData(
      title: 'Seamless Reporting',
      subtitle:
          'Generate detailed reports and history logs for compliance and internal audits without the headache.',
      illustration: 'assets/illustrations/reporting.png',
      accentColor: AppColors.tealPrimary,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _pageController.addListener(() {
      setState(() {
        _pageValue = _pageController.page ?? 0.0;
      });
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onPageChanged(int index) {
    setState(() {
      _currentPage = index;
    });
  }

  void _handleNext() {
    if (_currentPage < _pages.length - 1) {
      _pageController.animateToPage(
        _currentPage + 1,
        duration: const Duration(milliseconds: 700),
        curve: Curves.fastOutSlowIn,
      );
    } else {
      _finishOnboarding();
    }
  }

  void _finishOnboarding() async {
    await Future.delayed(const Duration(milliseconds: 150));
    if (!mounted) return;
    widget.onGetStarted();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: Colors
          .white, // Pure white seamlessly blends with illustration backgrounds
      body: Stack(
        children: [
          // 1. Image Layer (Takes up top 60%)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: size.height * 0.62,
            child: _buildImageSlider(),
          ),

          // 3. Skip button has been moved to the bottom sheet component

          // 4. Premium Bottom Sheet Component (Bottom 40%)
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: _buildBottomContentSheet(size, isDark),
          ),
        ],
      ),
    );
  }

  Widget _buildImageSlider() {
    return PageView.builder(
      controller: _pageController,
      onPageChanged: _onPageChanged,
      itemCount: _pages.length,
      physics: const BouncingScrollPhysics(),
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.fromLTRB(16, 60, 16, 24),
          child: Image.asset(_pages[index].illustration, fit: BoxFit.contain),
        );
      },
    );
  }

  Widget _buildBottomContentSheet(Size size, bool isDark) {
    return Container(
      height: size.height * 0.40,
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(40)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.05),
            blurRadius: 30,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(
            36,
            40,
            36,
            32,
          ), // Reduced bottom padding to drop pagination
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Independent Sliding Texts Layer
              Expanded(
                child: Stack(
                  children: List.generate(_pages.length, (index) {
                    final isVisible = _currentPage == index;
                    return AnimatedOpacity(
                      duration: const Duration(milliseconds: 400),
                      opacity: isVisible ? 1.0 : 0.0,
                      curve: Curves.easeOut,
                      child: AnimatedSlide(
                        duration: const Duration(milliseconds: 400),
                        offset: isVisible ? Offset.zero : const Offset(0, 0.1),
                        curve: Curves.easeOutCubic,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Text(
                              _pages[index].title,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 30,
                                fontWeight: FontWeight.w800,
                                color: isDark ? Colors.white : AppColors.navy,
                                letterSpacing: -0.5,
                                height: 1.1,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              _pages[index].subtitle,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 16,
                                color: isDark
                                    ? AppColors.gray400
                                    : AppColors.gray600,
                                height: 1.6,
                                fontWeight: FontWeight.w400,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                ),
              ),

              // Bottom Buttons (Skip & Next / Get Started)
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: _currentPage == _pages.length - 1
                    ? SizedBox(
                        key: const ValueKey('get_started'),
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: _finishOnboarding,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: _pages[_currentPage].accentColor,
                            foregroundColor: Colors.white,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(28),
                            ),
                          ),
                          child: const Text(
                            'Get Started',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      )
                    : Row(
                        key: const ValueKey('skip_next'),
                        children: [
                          Expanded(
                            child: SizedBox(
                              height: 56,
                              child: OutlinedButton(
                                onPressed: _finishOnboarding,
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: AppColors.tealPrimary,
                                  side: const BorderSide(
                                    color: AppColors.tealPrimary,
                                    width: 1.5,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(28),
                                  ),
                                ),
                                child: const Text(
                                  'Skip',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: SizedBox(
                              height: 56,
                              child: ElevatedButton(
                                onPressed: _handleNext,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor:
                                      _pages[_currentPage].accentColor,
                                  foregroundColor: Colors.white,
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(28),
                                  ),
                                ),
                                child: const Text(
                                  'Next',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
              ),

              const SizedBox(height: 48),

              // Sleek Page Indicators (Center Bottom)
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _pages.length,
                  (index) => AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeOutCubic,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    height: 6,
                    width: _currentPage == index ? 24 : 6,
                    decoration: BoxDecoration(
                      color: _currentPage == index
                          ? _pages[_currentPage].accentColor
                          : (isDark ? AppColors.gray700 : AppColors.gray300),
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
