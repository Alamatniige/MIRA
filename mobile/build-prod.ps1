#!/usr/bin/env powershell
# Production build commands

Write-Host "MIRA Flutter Production Build" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Check if key.properties exists
if (-not (Test-Path "android/key.properties")) {
    Write-Host "ERROR: android/key.properties not found!" -ForegroundColor Red
    Write-Host "Please set up your Android release keystore first:" -ForegroundColor Yellow
    Write-Host "1. Run: keytool -genkey -v -keystore android/mira-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mira_key" -ForegroundColor Yellow
    Write-Host "2. Fill in android/key.properties with your keystore values" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Select build type:" -ForegroundColor Cyan
Write-Host "1) Universal APK (single file, larger)" -ForegroundColor White
Write-Host "2) Split APKs by ABI (smaller per-device downloads)" -ForegroundColor White
Write-Host "3) Run release on device" -ForegroundColor White
Write-Host "4) Install APK on device (adb)" -ForegroundColor White
$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "Building universal release APK..." -ForegroundColor Green
        flutter build apk --release --dart-define=API_BASE_URL=https://mira-api-jly2.onrender.com
        Write-Host "APK ready at: build/app/outputs/flutter-apk/app-release.apk" -ForegroundColor Green
    }
    "2" {
        Write-Host "Building split release APKs (per ABI)..." -ForegroundColor Green
        flutter build apk --release --split-per-abi --dart-define=API_BASE_URL=https://mira-api-jly2.onrender.com
        Write-Host "APKs ready at: build/app/outputs/flutter-apk/" -ForegroundColor Green
        Get-ChildItem "build/app/outputs/flutter-apk/" -Filter "app-*-release.apk" | ForEach-Object {
            Write-Host "  - $($_.Name)" -ForegroundColor Cyan
        }
    }
    "3" {
        Write-Host "Running release build on device..." -ForegroundColor Green
        flutter run --release --dart-define=API_BASE_URL=https://mira-api-jly2.onrender.com
    }
    "4" {
        if (-not (Test-Path "build/app/outputs/flutter-apk/app-release.apk")) {
            Write-Host "ERROR: APK not found. Build it first with option 1 or 2." -ForegroundColor Red
            exit 1
        }
        Write-Host "Installing APK on connected device..." -ForegroundColor Green
        adb install build/app/outputs/flutter-apk/app-release.apk
        Write-Host "Installation complete" -ForegroundColor Green
    }
    default {
        Write-Host "Invalid option" -ForegroundColor Red
    }
}
