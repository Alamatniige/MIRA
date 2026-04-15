#!/usr/bin/env powershell
# Production build commands

$ErrorActionPreference = "Stop"

$apiBaseUrl = "https://mira-api-jly2.onrender.com"
$outputDir = "build/app/outputs/flutter-apk"

function Get-VersionInput {
    $versionName = Read-Host "Version name (e.g. 1.2.0)"
    if ([string]::IsNullOrWhiteSpace($versionName)) {
        $versionName = "1.0.0"
    }

    $buildNumber = Read-Host "Build number (integer, e.g. 12)"
    if ([string]::IsNullOrWhiteSpace($buildNumber)) {
        $buildNumber = "1"
    }

    if ($buildNumber -notmatch "^\d+$") {
        Write-Host "ERROR: Build number must be an integer." -ForegroundColor Red
        exit 1
    }

    return @{
        VersionName = $versionName
        BuildNumber = $buildNumber
        VersionTag  = "v$versionName+$buildNumber"
    }
}

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
Write-Host "4) Install latest APK on device (adb)" -ForegroundColor White
$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        $v = Get-VersionInput
        Write-Host "Building universal release APK ($($v.VersionTag))..." -ForegroundColor Green

        flutter build apk --release --build-name=$($v.VersionName) --build-number=$($v.BuildNumber) --dart-define=API_BASE_URL=$apiBaseUrl
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

        $src = Join-Path $outputDir "app-release.apk"
        $dst = Join-Path $outputDir "mira-$($v.VersionTag)-release.apk"

        if (-not (Test-Path $src)) {
            Write-Host "ERROR: Expected APK not found at $src" -ForegroundColor Red
            exit 1
        }

        Move-Item $src $dst -Force
        Write-Host "APK ready at: $dst" -ForegroundColor Green
    }

    "2" {
        $v = Get-VersionInput
        Write-Host "Building split release APKs ($($v.VersionTag))..." -ForegroundColor Green

        flutter build apk --release --split-per-abi --build-name=$($v.VersionName) --build-number=$($v.BuildNumber) --dart-define=API_BASE_URL=$apiBaseUrl
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

        Write-Host "Renaming split APKs..." -ForegroundColor Green

        $apkFiles = Get-ChildItem $outputDir -Filter "app-*-release.apk" -File
        if (-not $apkFiles -or $apkFiles.Count -eq 0) {
            Write-Host "ERROR: No split APK files found in $outputDir" -ForegroundColor Red
            exit 1
        }

        foreach ($file in $apkFiles) {
            if ($file.Name -match "^app-(.+)-release\.apk$") {
                $abi = $matches[1]
                $newName = "mira-$($v.VersionTag)-$abi-release.apk"
                $newPath = Join-Path $outputDir $newName
                Move-Item $file.FullName $newPath -Force
                Write-Host "  - $newName" -ForegroundColor Cyan
            } else {
                Write-Host "  - Skipped (unexpected format): $($file.Name)" -ForegroundColor Yellow
            }
        }

        Write-Host "APKs ready at: $outputDir" -ForegroundColor Green
    }

    "3" {
        Write-Host "Running release build on device..." -ForegroundColor Green
        flutter run --release --dart-define=API_BASE_URL=$apiBaseUrl
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }

    "4" {
        if (-not (Test-Path $outputDir)) {
            Write-Host "ERROR: Output directory not found. Build first with option 1 or 2." -ForegroundColor Red
            exit 1
        }

        $apk = Get-ChildItem $outputDir -Filter "mira-*-release.apk" -File |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 1

        if (-not $apk) {
            $fallback = Join-Path $outputDir "app-release.apk"
            if (Test-Path $fallback) {
                $apk = Get-Item $fallback
            }
        }

        if (-not $apk) {
            Write-Host "ERROR: No APK found. Build first with option 1 or 2." -ForegroundColor Red
            exit 1
        }

        Write-Host "Installing APK: $($apk.Name)" -ForegroundColor Green
        adb install "$($apk.FullName)"
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

        Write-Host "Installation complete" -ForegroundColor Green
    }

    default {
        Write-Host "Invalid option" -ForegroundColor Red
        exit 1
    }
}