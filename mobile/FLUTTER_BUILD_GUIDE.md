# Flutter Development and Production Commands

## Dev Commands (Local API - 10.0.2.2:8080)

# Emulator - Android

flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080

# Physical Phone on Local Network (replace IP with your PC IP)

flutter run --dart-define=API_BASE_URL=http://192.168.1.8:8080

# Chrome/Web

flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:8080

---

## Production Commands (Render API)

# Build Release APK (Universal)

flutter build apk --release --dart-define=API_BASE_URL=https://mira-api-jly2.onrender.com

# Build Release APK (Split by ABI - smaller downloads)

flutter build apk --release --split-per-abi --dart-define=API_BASE_URL=https://mira-api-jly2.onrender.com

# Run Release on Device

flutter run --release --dart-define=API_BASE_URL=https://mira-api-jly2.onrender.com

# Install APK on Device

adb install build/app/outputs/flutter-apk/app-release.apk

---

## Android Keystore Setup (One-time)

1. Generate a keystone (from `mobile/` directory):
   keytool -genkey -v -keystore android/mira-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mira_key

2. Fill in `android/key.properties` with the values you used above.

3. Do NOT commit `mira-release-key.jks` to Git. Add to .gitignore.

4. For team sharing, use a secure secret manager (e.g., 1Password, LastPass).

---

## Output Locations

- **Release APK (universal)**: `mobile/build/app/outputs/flutter-apk/app-release.apk`
- **Release APKs (split)**: `mobile/build/app/outputs/flutter-apk/app-*-release.apk`

---

## Notes

- Use `API_BASE_URL=https://mira-api-jly2.onrender.com` for production builds
- Use `API_BASE_URL=http://10.0.2.2:8080` for local emulator dev
- Use `API_BASE_URL=http://192.168.1.x:8080` for physical phone dev
- Release builds are signed with `key.properties` after keystore setup
