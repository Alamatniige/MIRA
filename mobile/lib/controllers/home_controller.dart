import 'package:flutter/material.dart';

import '../data/mock_data.dart';
import '../views/scan/qr_scanner_screen.dart';

class HomeController {
  int get myAssetsCount => mockMyAssets.length;

  int get activeAssetsCount =>
      mockMyAssets.where((a) => a.status.toLowerCase() == 'active').length;

  String get userFirstName => mockUserName.split(' ').first;

  void onScanTap(BuildContext context) {
    Navigator.of(
      context,
    ).push(MaterialPageRoute(builder: (context) => const QrScannerScreen()));
  }
}
