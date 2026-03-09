import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Floating Modern BottomNavigationBar with prominent central Scan button
class ModernBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const ModernBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.only(bottom: 24),
        child: Align(
          alignment: Alignment.bottomCenter,
          child: Container(
            height: 72,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : Colors.white,
              borderRadius: BorderRadius.circular(36),
              border: Border.all(
                color: isDark ? Colors.white.withOpacity(0.08) : AppColors.gray200,
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.tealPrimary.withOpacity(isDark ? 0.3 : 0.15),
                  blurRadius: 24,
                  offset: const Offset(0, 8),
                ),
                BoxShadow(
                  color: isDark ? Colors.black.withOpacity(0.4) : AppColors.navy.withOpacity(0.08),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Dashboard Tab
                _NavItemWidget(
                  icon: currentIndex == 0 ? Icons.space_dashboard_rounded : Icons.space_dashboard_outlined,
                  isSelected: currentIndex == 0,
                  onTap: () => onTap(0),
                ),
                
                const SizedBox(width: 28),
                
                // Prominent Central Scan Button
                GestureDetector(
                  onTap: () => onTap(1),
                  behavior: HitTestBehavior.opaque,
                  child: Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.tealPrimary.withOpacity(0.5),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.qr_code_scanner_rounded,
                        color: Colors.white,
                        size: 28,
                      ),
                    ),
                  ),
                ),
                
                const SizedBox(width: 28),
                
                // History Tab
                _NavItemWidget(
                  icon: currentIndex == 2 ? Icons.history_rounded : Icons.history,
                  isSelected: currentIndex == 2,
                  onTap: () => onTap(2),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItemWidget extends StatelessWidget {
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _NavItemWidget({
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primaryColor = isDark ? AppColors.tealLight : AppColors.tealPrimary;
    final unselectedColor = isDark ? AppColors.gray400 : AppColors.gray500;
    
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Center(
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOutCubic,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isSelected 
                ? primaryColor.withOpacity(0.12) 
                : Colors.transparent,
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            size: isSelected ? 30 : 26, // Slightly larger when selected
            color: isSelected ? primaryColor : unselectedColor,
          ),
        ),
      ),
    );
  }
}
