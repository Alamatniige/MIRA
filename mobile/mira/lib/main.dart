import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'theme/theme_mode_scope.dart';
import 'screens/welcome/welcome_screen.dart';
import 'screens/login/login_screen.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'screens/scan/qr_scanner_screen.dart';
import 'screens/history/history_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'widgets/modern_bottom_nav.dart';

void main() {
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

  void _onGetStarted() {
    setState(() => _showWelcome = false);
  }

  @override
  Widget build(BuildContext context) {
    if (_showWelcome) {
      return WelcomeScreen(onGetStarted: _onGetStarted);
    }
    return AuthWrapper();
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  bool _isLoggedIn = false;

  void _onLoginSuccess() {
    setState(() => _isLoggedIn = true);
  }

  void _onLogout() {
    setState(() => _isLoggedIn = false);
  }

  @override
  Widget build(BuildContext context) {
    if (!_isLoggedIn) {
      return LoginScreen(onLoginSuccess: _onLoginSuccess);
    }
    return MainShell(onLogout: _onLogout);
  }
}

class MainShell extends StatefulWidget {
  final VoidCallback onLogout;

  const MainShell({super.key, required this.onLogout});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: [
          const DashboardScreen(),
          QrScannerScreen(onBack: () => setState(() => _currentIndex = 0)),
          const HistoryScreen(),
          ProfileScreen(onLogout: widget.onLogout),
        ],
      ),
      bottomNavigationBar: ModernBottomNav(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
      ),
    );
  }
}
