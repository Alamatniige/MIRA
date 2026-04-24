import 'package:flutter/material.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:mira/theme/app_theme.dart';
import 'package:google_fonts/google_fonts.dart';

/// Service to show premium motion toasts consistent with MIRA design system
class ToastService {
  /// Base configuration for premium toasts
  static MotionToast _baseToast({
    required IconData icon,
    required Color primaryColor,
    required String title,
    required String message,
  }) {
    return MotionToast(
      icon: icon,
      primaryColor: Colors.white,
      secondaryColor: primaryColor,
      title: Text(
        title,
        style: GoogleFonts.poppins(
          fontWeight: FontWeight.w700,
          fontSize: 15,
          color: AppColors.navy,
        ),
      ),
      description: Text(
        message,
        style: GoogleFonts.poppins(
          fontSize: 13,
          fontWeight: FontWeight.w500,
          color: AppColors.gray600,
        ),
      ),
      toastAlignment: Alignment.topCenter,
      animationType: AnimationType.slideInFromTop,
      dismissable: true,
      displayBorder: true,
      displaySideBar: true,
      borderRadius: 20,
      width: 340,
      height: 90,
    );
  }

  /// Shows a success toast with teal theme
  static void showSuccess(BuildContext context, String message, {String? title}) {
    _baseToast(
      icon: Icons.check_circle_rounded,
      primaryColor: AppColors.tealPrimary,
      title: title ?? "Success",
      message: message,
    ).show(context);
  }

  /// Shows an error toast with red theme
  static void showError(BuildContext context, String message, {String? title}) {
    _baseToast(
      icon: Icons.error_rounded,
      primaryColor: AppColors.statusIssue,
      title: title ?? "Error",
      message: message,
    ).show(context);
  }

  /// Shows a warning toast with yellow theme
  static void showWarning(BuildContext context, String message, {String? title}) {
    _baseToast(
      icon: Icons.warning_rounded,
      primaryColor: AppColors.statusMaintenance,
      title: title ?? "Warning",
      message: message,
    ).show(context);
  }

  /// Shows an info toast with blue theme
  static void showInfo(BuildContext context, String message, {String? title}) {
    _baseToast(
      icon: Icons.info_rounded,
      primaryColor: AppColors.bluePrimary,
      title: title ?? "Information",
      message: message,
    ).show(context);
  }
}
