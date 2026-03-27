# MIRA Android Release Signing Setup

## Overview

This guide walks you through creating a production-grade Android APK with proper signing.

---

## Step 1: Generate Your Release Keystore (One-time)

From the `mobile/` directory, run:

```powershell
keytool -genkey -v -keystore android/mira-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mira_key
```

You'll be prompted for:

- **Keystore password**: Create a strong password (you'll need this in `key.properties`)
- **Key password**: Same or different (you'll also need this in `key.properties`)
- **Name, organization, etc.**: Fill in your details (these become part of the certificate)

Example:

```
What is your first and last name?
  [Unknown]: John Doe
What is the name of your organizational unit?
  [Unknown]: IT
What is the name of your organization?
  [Unknown]: My Company
What is the name of your City or Locality?
  [Unknown]: Manila
What is the name of your State or Province?
  [Unknown]: Metro Manila
What is the two-letter country code for this unit?
  [Unknown]: PH
```

After completion, you'll have `android/mira-release-key.jks`.

---

## Step 2: Configure key.properties

Open `mobile/android/key.properties` and fill in the values you just created:

```properties
storeFile=mira-release-key.jks
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=mira_key
keyPassword=YOUR_KEY_PASSWORD
```

Example:

```properties
storeFile=mira-release-key.jks
storePassword=MySecurePassword123!
keyAlias=mira_key
keyPassword=MyKeyPassword123!
```

---

## Step 3: Secure Your Keystore

**CRITICAL**: The keystore file contains your signing keys. Do NOT commit it to Git.

Check `.gitignore` includes:

```
android/mira-release-key.jks
android/key.properties
```

For team/CI/CD, store the keystore in a secure secret manager:

- GitHub Secrets (for CI/CD)
- 1Password / LastPass (for team sharing)
- Google Secret Manager
- AWS Secrets Manager

---

## Step 4: Verify Configuration

Run the build script to test:

```powershell
# From mobile/ directory
.\build-prod.ps1
```

Select option 1 or 2 to build an APK. If successful, congrats! 🎉

---

## Step 5: Using the Convenience Scripts

### Development Builds

Run from `mobile/` directory:

```powershell
.\run-dev.ps1
```

This will prompt you to choose:

- Android Emulator (local API)
- Physical Phone (local network)
- Chrome/Web
- Custom IP

### Production Builds

Run from `mobile/` directory:

```powershell
.\build-prod.ps1
```

This will prompt you to choose:

- Universal APK
- Split APKs per ABI
- Run release on device
- Install APK on device

---

## Manual Commands (If Not Using Scripts)

### Development

```bash
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080
flutter run --dart-define=API_BASE_URL=http://192.168.1.8:8080
flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:8080
```

### Production Build (Signed)

```bash
flutter build apk --release --dart-define=API_BASE_URL=https://mira-api-jly2.onrender.com
flutter build apk --release --split-per-abi --dart-define=API_BASE_URL=https://mira-api-jly2.onrender.com
```

### Install APK

```bash
adb install build/app/outputs/flutter-apk/app-release.apk
```

---

## Troubleshooting

### "Keystore file not found"

- Make sure `android/key.properties` points to the correct file path
- Default: `storeFile=mira-release-key.jks` (relative to `android/` folder)

### "Invalid password for keystore"

- Check passwords in `key.properties` match what you entered during `keytool`
- Passwords are case-sensitive

### "keytool command not found"

- Java is likely not in your PATH
- Install Java JDK or add it to PATH
- Or use full path: `"c:\Program Files\Java\jdk-21\bin\keytool.exe"`

### APK won't install

- Check device is connected: `adb devices`
- Uninstall old version first: `adb uninstall com.example.mira`
- Then install: `adb install build/app/outputs/flutter-apk/app-release.apk`

---

## Next Steps

- **Play Store Release**: When ready, update `applicationId` in `build.gradle.kts` and follow Google Play Store publishing guide.
- **Version Management**: Update `versionCode` and `versionName` in `build.gradle.kts` before each release.
- **Custom Domain**: Change `applicationId = "com.example.mira"` to your domain (e.g., `"com.mycompany.mira"`).

---

## Files Created

- `android/key.properties` — Keystore configuration (add to .gitignore)
- `run-dev.ps1` — Interactive development launcher
- `build-prod.ps1` — Interactive production builder
- `FLUTTER_BUILD_GUIDE.md` — Quick reference commands
- `ANDROID_RELEASE_SETUP.md` — This setup guide
