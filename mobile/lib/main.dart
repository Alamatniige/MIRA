import 'package:flutter/material.dart';
import 'core/storage/token_storage.dart';
import 'core/storage/onboarding_storage.dart';
import 'theme/app_theme.dart';
import 'theme/theme_mode_scope.dart';
import 'views/welcome/welcome_screen.dart';
import 'views/login/login_screen.dart';
import 'views/dashboard/dashboard_screen.dart';
import 'views/scan/qr_scanner_screen.dart';
import 'views/history/history_screen.dart';
import 'views/profile/profile_screen.dart';
import 'widgets/modern_bottom_nav.dart';

import 'package:shared_preferences/shared_preferences.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Pre-initialize SharedPreferences for faster access throughout the app
  await SharedPreferences.getInstance();
  runApp(const MiraApp());
}

class MiraApp extends StatefulWidget {
  const MiraApp({super.key});

  @override
  State<MiraApp> createState() => _MiraAppState();
}

class _MiraAppState extends State<MiraApp> {
  bool _isDarkMode = false;

  void _toggleDarkMode() {
    setState(() => _isDarkMode = !_isDarkMode);
  }

  @override
  Widget build(BuildContext context) {
    return ThemeModeScope(
      toggleDarkMode: _toggleDarkMode,
      isDarkMode: _isDarkMode,
      child: MaterialApp(
        title: 'MIRA',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: _isDarkMode ? ThemeMode.dark : ThemeMode.light,
        home: const AppInitialScreen(),
      ),
    );
  }
}

/// Shows WelcomeScreen first, then AuthWrapper after user taps "Get Started"
class AppInitialScreen extends StatefulWidget {
  const AppInitialScreen({super.key});

  @override
  State<AppInitialScreen> createState() => _AppInitialScreenState();
}

class _AppInitialScreenState extends State<AppInitialScreen> {
  bool _showWelcome = true;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _checkOnboardingStatus();
  }

  Future<void> _checkOnboardingStatus() async {
    final completed = await OnboardingStorage().isCompleted();
    if (mounted) {
      setState(() {
        _showWelcome = !completed;
        _isLoading = false;
      });
    }
  }

  Future<void> _onGetStarted() async {
    await OnboardingStorage().completeOnboarding();
    if (mounted) {
      setState(() => _showWelcome = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: AppColors.gray50,
        body: Center(
          child: CircularProgressIndicator(color: AppColors.tealPrimary),
        ),
      );
    }

    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 450),
      switchInCurve: Curves.easeOutCubic,
      switchOutCurve: Curves.easeInCubic,
      transitionBuilder: (child, animation) {
        final slideAnimation =
            Tween<Offset>(
              begin: const Offset(0.06, 0.04),
              end: Offset.zero,
            ).animate(
              CurvedAnimation(parent: animation, curve: Curves.easeOutCubic),
            );

        return FadeTransition(
          opacity: animation,
          child: SlideTransition(position: slideAnimation, child: child),
        );
      },
      child: _showWelcome
          ? WelcomeScreen(
              key: const ValueKey('welcome'),
              onGetStarted: _onGetStarted,
            )
          : const AuthWrapper(key: ValueKey('auth')),
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  bool _isLoggedIn = false;
  bool _isCheckingSession = true;

  @override
  void initState() {
    super.initState();
    _checkExistingSession();
  }

  Future<void> _checkExistingSession() async {
    final hasToken = await TokenStorage().hasAccessToken();
    if (mounted) {
      setState(() {
        _isLoggedIn = hasToken;
        _isCheckingSession = false;
      });
    }
  }

  void _onLoginSuccess() {
    setState(() => _isLoggedIn = true);
  }

  Future<void> _onLogout() async {
    await TokenStorage().clearSession();
    if (mounted) {
      setState(() => _isLoggedIn = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isCheckingSession) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: AppColors.tealPrimary),
        ),
      );
    }
    if (!_isLoggedIn) {
      return LoginScreen(onLoginSuccess: _onLoginSuccess);
    }
    return MainShell(onLogout: _onLogout);
  }
}

class MainShell extends StatefulWidget {
  final Future<void> Function() onLogout;

  const MainShell({super.key, required this.onLogout});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;
  bool _isLoading = false;

  Future<void> _onTabTapped(int index) async {
    if (_currentIndex == index) return;

    setState(() {
      _isLoading = true;
    });

    // Artificial delay to show loading state
    await Future.delayed(const Duration(milliseconds: 800));

    if (mounted) {
      setState(() {
        _currentIndex = index;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background content
          IndexedStack(
            index: _currentIndex,
            children: [
              DashboardScreen(
                onProfileTap: () async {
                  await Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => ProfileScreen(onLogout: widget.onLogout),
                    ),
                  );
                },
              ),
              if (_currentIndex == 1)
                QrScannerScreen(onBack: () => _onTabTapped(0))
              else
                const SizedBox.shrink(),
              const HistoryScreen(),
            ],
          ),

          // Loading Overlay
          if (_isLoading)
            Container(
              color: Theme.of(
                context,
              ).scaffoldBackgroundColor.withValues(alpha: 0.8),
              child: const Center(child: CircularProgressIndicator()),
            ),

          // Floating Bottom Navigation Bar
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: ModernBottomNav(
              currentIndex: _currentIndex,
              onTap: _onTabTapped,
            ),
          ),
        ],
      ),
    );
  }
}
