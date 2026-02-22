import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// MIRA premium design system - Blue to teal gradient, Material Design 3
class AppColors {
  // Primary gradient: Blue → Teal
  static const Color bluePrimary = Color(0xFF2563EB);
  static const Color teal = Color(0xFF0D9488); // alias for tealPrimary
  static const Color tealPrimary = Color(0xFF0D9488);
  static const Color tealLight = Color(0xFF14B8A6);
  static const Color tealMuted = Color(0xFFCCFBF1);
  static const Color tealDark = Color(0xFF0F766E);

  static const Color navy = Color(0xFF0F172A);
  static const Color navyLight = Color(0xFF1E293B);
  static const Color white = Color(0xFFFFFFFF);
  static const Color gray50 = Color(0xFFF8FAFC);
  static const Color gray100 = Color(0xFFF1F5F9);
  static const Color gray200 = Color(0xFFE2E8F0);
  static const Color gray300 = Color(0xFFCBD5E1);
  static const Color gray400 = Color(0xFF94A3B8);
  static const Color gray500 = Color(0xFF64748B);
  static const Color gray600 = Color(0xFF475569);
  static const Color gray700 = Color(0xFF334155);

  // Status colors
  static const Color statusActive = Color(0xFF22C55E);
  static const Color statusMaintenance = Color(0xFFEAB308);
  static const Color statusReported = Color(0xFFEF4444);
  static const Color statusIssue = Color(0xFFEF4444);
  static const Color statusDisposed = Color(0xFF94A3B8);

  static const Color background = Color(0xFFF1F5F9);
  static const Color backgroundGradientStart = Color(0xFFF8FAFC);
  static const Color backgroundGradientEnd = Color(0xFFEFF6FF);
  static const Color foreground = Color(0xFF0F172A);

  /// Primary gradient for headers, FAB, buttons
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [bluePrimary, tealPrimary],
  );

  /// Soft background gradient
  static const LinearGradient softBackgroundGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [backgroundGradientStart, backgroundGradientEnd, gray100],
  );

  // Dark mode colors
  static const Color darkBackground = Color(0xFF0F172A);
  static const Color darkSurface = Color(0xFF1E293B);
  static const Color darkSurfaceVariant = Color(0xFF334155);
  static const Color darkOnSurface = Color(0xFFF8FAFC);
  static const Color darkOnSurfaceVariant = Color(0xFF94A3B8);

  /// Dark mode background gradient
  static const LinearGradient darkBackgroundGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
  );
}

/// Reusable glassmorphism container
class GlassCard extends StatelessWidget {
  final Widget child;
  final double borderRadius;
  final EdgeInsetsGeometry? padding;
  final double blur;
  final Color? tintColor;

  const GlassCard({
    super.key,
    required this.child,
    this.borderRadius = 18,
    this.padding,
    this.blur = 10,
    this.tintColor,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
        child: Container(
          padding: padding ?? const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: (tintColor ?? Colors.white).withOpacity(0.75),
            borderRadius: BorderRadius.circular(borderRadius),
            border: Border.all(
              color: Colors.white.withOpacity(0.5),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: AppColors.navy.withOpacity(0.06),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: child,
        ),
      ),
    );
  }
}

/// Elevated card with soft shadow (no blur - for performance)
class ElevatedCard extends StatelessWidget {
  final Widget child;
  final double borderRadius;
  final EdgeInsetsGeometry? padding;
  final Color? color;

  const ElevatedCard({
    super.key,
    required this.child,
    this.borderRadius = 18,
    this.padding,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding ?? const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color ?? AppColors.white,
        borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: [
          BoxShadow(
            color: AppColors.navy.withOpacity(0.06),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
          BoxShadow(
            color: Colors.white.withOpacity(0.8),
            blurRadius: 0,
            offset: const Offset(0, -1),
          ),
        ],
      ),
      child: child,
    );
  }
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.light(
        primary: AppColors.tealPrimary,
        onPrimary: AppColors.white,
        secondary: AppColors.tealLight,
        surface: AppColors.white,
        onSurface: AppColors.navy,
        onSurfaceVariant: AppColors.gray600,
        outline: AppColors.gray300,
        error: AppColors.statusIssue,
      ),
      scaffoldBackgroundColor: AppColors.background,
      textTheme: GoogleFonts.poppinsTextTheme(ThemeData.light().textTheme).copyWith(
        displayLarge: GoogleFonts.poppins(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.navy),
        displayMedium: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.navy),
        headlineMedium: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.navy),
        titleLarge: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.navyLight),
        titleMedium: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.navyLight),
        bodyLarge: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w400, color: AppColors.foreground),
        bodyMedium: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.gray600),
        labelLarge: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w500),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        foregroundColor: AppColors.white,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.white),
      ),
      cardTheme: CardThemeData(
        color: AppColors.white,
        elevation: 0,
        shadowColor: AppColors.navy.withOpacity(0.06),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        margin: EdgeInsets.zero,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          foregroundColor: AppColors.white,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 0,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.gray300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.tealPrimary, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.white,
        selectedItemColor: AppColors.tealPrimary,
        unselectedItemColor: AppColors.gray500,
        type: BottomNavigationBarType.fixed,
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.tealPrimary,
        foregroundColor: AppColors.white,
        elevation: 8,
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.dark(
        primary: AppColors.tealLight,
        onPrimary: AppColors.white,
        secondary: AppColors.tealPrimary,
        surface: AppColors.darkSurface,
        onSurface: AppColors.darkOnSurface,
        onSurfaceVariant: AppColors.darkOnSurfaceVariant,
        outline: AppColors.gray500,
        error: AppColors.statusIssue,
      ),
      scaffoldBackgroundColor: AppColors.darkBackground,
      textTheme: GoogleFonts.poppinsTextTheme(ThemeData.dark().textTheme).copyWith(
        displayLarge: GoogleFonts.poppins(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.darkOnSurface),
        displayMedium: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.darkOnSurface),
        headlineMedium: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w600, color: AppColors.darkOnSurface),
        titleLarge: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.darkOnSurface),
        titleMedium: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.darkOnSurface),
        bodyLarge: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w400, color: AppColors.darkOnSurface),
        bodyMedium: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.darkOnSurfaceVariant),
        labelLarge: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w500),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        foregroundColor: AppColors.white,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.white),
      ),
      cardTheme: CardThemeData(
        color: AppColors.darkSurface,
        elevation: 0,
        shadowColor: Colors.black26,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        margin: EdgeInsets.zero,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          foregroundColor: AppColors.white,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 0,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.darkSurface,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.darkSurfaceVariant),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.tealLight, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.darkSurface,
        selectedItemColor: AppColors.tealLight,
        unselectedItemColor: AppColors.gray500,
        type: BottomNavigationBarType.fixed,
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.tealPrimary,
        foregroundColor: AppColors.white,
        elevation: 8,
      ),
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return AppColors.tealLight;
          return AppColors.gray500;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return AppColors.tealLight.withOpacity(0.5);
          return AppColors.darkSurfaceVariant;
        }),
      ),
    );
  }
}
