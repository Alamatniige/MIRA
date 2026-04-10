import 'dart:async';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

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

  // ── Fix 1: Global error handler ────────────────────────────────────────────

  // 1a. Catch Flutter widget/framework exceptions (render errors, etc.)
  FlutterError.onError = (FlutterErrorDetails details) {
    // Keep default behavior in debug so the red error screen still works.
    FlutterError.presentError(details);
  };

  // 1b. Override the render error widget with a branded fallback.
  ErrorWidget.builder = (FlutterErrorDetails details) {
    return const CrashFallbackScreen();
  };

  // 1c. Catch platform-channel / dart:ui level errors.
  PlatformDispatcher.instance.onError = (error, stack) {
    // Log in debug; in production wire this to a crash reporter.
    debugPrint('[MIRA] Unhandled platform error: $error');
    return true; // returning true prevents the default crash
  };

  // 1d. Catch all unhandled async exceptions thrown inside the Flutter zone.
  runZonedGuarded(
    () => runApp(const MiraApp()),
    (error, stack) {
      debugPrint('[MIRA] Unhandled async error: $error');
    },
  );
}

// ── Branded crash fallback widget ─────────────────────────────────────────────

/// Shown whenever a widget's build() throws an unhandled error at runtime.
/// Matches the visual language of _DashboardErrorState: icon + message + action.
class CrashFallbackScreen extends StatelessWidget {
  const CrashFallbackScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.gray50,
      appBar: AppBar(
        backgroundColor: AppColors.tealPrimary,
        title: const Text(
          'Something went wrong',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
        automaticallyImplyLeading: false,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.error_outline_rounded,
                size: 64,
                color: AppColors.statusReported,
              ),
              const SizedBox(height: 24),
              const Text(
                'Oops! An unexpected error occurred.',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.navy,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              const Text(
                'Please restart the app. If this keeps happening, contact IT support.',
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.gray500,
                  height: 1.5,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              ElevatedButton.icon(
                onPressed: () => SystemNavigator.pop(),
                icon: const Icon(Icons.refresh_rounded),
                label: const Text(
                  'Restart App',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.tealPrimary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 14,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
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

// ── Existing app widgets (unchanged) ──────────────────────────────────────────

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
