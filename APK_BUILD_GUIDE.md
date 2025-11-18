# APK Build Guide

This guide explains how to build an APK for the CreatireBreeding Android app.

## Quick Start

### Build Debug APK

The fastest way to build a debug APK:

```bash
npm run android:build
```

The APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Build Release APK

For a production-ready release APK:

```bash
npm run android:build:release
```

The APK will be located at: `android/app/build/outputs/apk/release/app-release.apk`

**Note:** Release builds require signing configuration. See [Release Build Configuration](#release-build-configuration) below.

## Prerequisites

### Required Software

1. **Node.js** (version 16.x or higher)
2. **Java Development Kit (JDK) 21**
   - ⚠️ **Important**: This project requires JDK 21 for Capacitor 7.4.4+
   - Download from: https://adoptium.net/temurin/releases/?version=21
3. **Android SDK** (API 33+)
   - Can be installed via Android Studio or standalone

### Environment Setup

#### Install Android SDK (if not using Android Studio)

```bash
# On Ubuntu/Debian
sudo apt-get install android-sdk

# Set environment variables (add to ~/.bashrc or ~/.zshrc)
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```

#### Verify Installation

```bash
# Check Java version (must be 21)
java --version

# Check Node.js version
node --version

# Check Android SDK
echo $ANDROID_HOME
```

## Build Steps

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Build Web Assets

```bash
npm run build
```

This compiles TypeScript and builds the web app with Vite.

### Step 3: Sync to Android

```bash
npx cap sync android
```

This copies web assets to the Android project.

### Step 4: Build APK

#### Option A: Using npm script (Recommended)

```bash
# Debug APK
npm run android:build

# Release APK
npm run android:build:release
```

#### Option B: Using Gradle directly

```bash
cd android

# Debug APK
./gradlew assembleDebug

# Release APK
./gradlew assembleRelease
```

### Step 5: Locate the APK

- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

## Installing the APK

### On Physical Device

1. Enable "Install from Unknown Sources" in device settings
2. Transfer the APK to your device
3. Tap the APK file to install

### Using ADB

```bash
# Install debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Install release APK
adb install android/app/build/outputs/apk/release/app-release.apk

# Launch the app
adb shell am start -n com.creatirebreeding.app/.MainActivity
```

## Release Build Configuration

To build a signed release APK for distribution:

### 1. Create a Keystore

```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Follow the prompts to enter keystore password and certificate information.

### 2. Configure Signing

Create or edit `android/keystore.properties`:

```properties
storeFile=my-release-key.keystore
storePassword=your-keystore-password
keyAlias=my-key-alias
keyPassword=your-key-password
```

**⚠️ Important**: Never commit `keystore.properties` or your keystore file to git!

### 3. Update build.gradle

Edit `android/app/build.gradle` to add signing configuration:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 4. Build Signed Release

```bash
npm run android:build:release
```

## Troubleshooting

### Java Version Issues

**Error**: `error: invalid source release: 21`

**Solution**: This project requires JDK 21 for Capacitor 7.4.4+. Ensure you have JDK 21 installed:

```bash
# Check current Java version
java --version

# Install JDK 21
# On Ubuntu/Debian
sudo apt-get install openjdk-21-jdk

# Or download from Adoptium
# https://adoptium.net/temurin/releases/?version=21

# Switch to JDK 21
sudo update-alternatives --config java
```

The project includes `org.gradle.java.home` setting in `android/gradle.properties` to ensure Gradle uses Java 21.

**Note**: The build configuration files are set to use Java 21:
- `android/app/build.gradle`
- `android/app/capacitor.build.gradle`
- `android/capacitor-cordova-android-plugins/build.gradle`
- `android/gradle.properties`

### Build Fails After Capacitor Sync

The project is configured to use Java 21 by default. If you encounter build issues:

1. Verify Java 21 is installed: `java --version`
2. Check `android/gradle.properties` has the correct Java path
3. Stop and restart Gradle daemon:
   ```bash
   cd android
   ./gradlew --stop
   ./gradlew assembleDebug
   ```

### Clean Build

If you encounter build issues:

```bash
cd android
./gradlew clean
cd ..
npm run android:build
```

### Gradle Daemon Issues

```bash
cd android
./gradlew --stop
cd ..
npm run android:build
```

## APK Details

### Debug APK

- **Size**: ~4.8 MB
- **Signed**: Debug keystore (auto-generated)
- **Optimized**: No
- **Use case**: Testing and development

### Release APK

- **Size**: ~4.5 MB (slightly smaller after optimization)
- **Signed**: Your release keystore
- **Optimized**: Yes (proguard optional)
- **Use case**: Distribution to users, Google Play Store

## App Information

- **Package Name**: `com.creatirebreeding.app`
- **App Name**: CreatireBreeding
- **Version**: 1.0 (versionCode: 1)
- **Min SDK**: 23 (Android 6.0)
- **Target SDK**: 35 (Android 15)

## Continuous Integration

For CI/CD pipelines, use the npm scripts:

```bash
# In your CI configuration
npm ci
npm run android:build
```

## Additional Resources

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Android Build Guide](ANDROID_BUILD.md) - Complete Android development guide
- [Gradle User Guide](https://docs.gradle.org/current/userguide/userguide.html)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)

## Support

If you encounter issues:

1. Check this troubleshooting section
2. Review `ANDROID_BUILD.md` for detailed Android setup
3. Check Android Studio logs: `android/build/reports/`
4. Run with verbose output: `./gradlew assembleDebug --info`
5. Open an issue on GitHub with error details

---

**Built APK successfully? Great! You can now install it on Android devices and test your creature breeding game on mobile! 📱🧬**
