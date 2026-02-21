import 'package:flutter/material.dart';

/// Provides dark mode state and toggle to descendants (e.g. ProfileScreen)
class ThemeModeScope extends InheritedWidget {
  final VoidCallback toggleDarkMode;
  final bool isDarkMode;

  const ThemeModeScope({
    super.key,
    required this.toggleDarkMode,
    required this.isDarkMode,
    required super.child,
  });

  static ThemeModeScope of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<ThemeModeScope>();
    assert(scope != null, 'ThemeModeScope not found');
    return scope!;
  }

  @override
  bool updateShouldNotify(ThemeModeScope old) => isDarkMode != old.isDarkMode;
}
