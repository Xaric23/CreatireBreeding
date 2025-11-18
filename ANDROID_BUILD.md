# Android Build Guide for CreatireBreeding

This guide will help you build and run the CreatireBreeding game as an Android app.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Building the Android App](#building-the-android-app)
- [Running on Device/Emulator](#running-on-deviceemulator)
- [Troubleshooting](#troubleshooting)
- [Development Workflow](#development-workflow)

## Prerequisites

### Required Software

1. **Node.js** (version 16.x or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Android Studio** (latest stable version)
   - Download from: https://developer.android.com/studio
   - Required for building and running Android apps
   - Includes Android SDK and tools

3. **Java Development Kit (JDK) 21**
   - Required for Capacitor 7.4.4+
   - Usually installed with Android Studio, or download from https://adoptium.net/temurin/releases/?version=21
   - Verify installation: `java --version`

### Android Studio Setup

After installing Android Studio:

1. **Install Android SDK**:
   - Open Android Studio
   - Go to `Tools > SDK Manager`
   - Install Android SDK Platform 33 or higher
   - Install Android SDK Build-Tools 33 or higher

2. **Configure Environment Variables**:
   
   **On Windows:**
   ```cmd
   setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
   setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools"
   ```
   
   **On macOS/Linux:**
   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   ```

3. **Accept Android Licenses**:
   ```bash
   # Run in terminal
   sdkmanager --licenses
   ```

## Quick Start

### 1. Install Dependencies

```bash
# Clone the repository (if not already done)
git clone https://github.com/Xaric23/CreatireBreeding.git
cd CreatireBreeding

# Install Node.js dependencies
npm install
```

### 2. Build for Android

```bash
# Build web app and sync with Android
npm run android:sync
```

This command:
- Compiles TypeScript code
- Builds the web app with Vite
- Copies assets to Android project
- Syncs Capacitor plugins

### 3. Open in Android Studio

```bash
# Open Android project in Android Studio
npm run android:open
```

### 4. Run the App

From Android Studio:
1. Connect an Android device or start an emulator
2. Click the green "Run" button (▶️)
3. Select your device/emulator
4. Wait for the app to install and launch

## Building the Android App

### Development Build

For testing during development:

```bash
# Build and open Android Studio
npm run android:sync
npm run android:open
```

Then in Android Studio:
- Select `Build > Build Bundle(s) / APK(s) > Build APK(s)`
- APK will be generated in: `android/app/build/outputs/apk/debug/`

### Release Build (Production)

For publishing to Google Play Store:

1. **Create a Keystore**:
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Signing** in `android/app/build.gradle`:
   ```gradle
   android {
       ...
       signingConfigs {
           release {
               storeFile file('path/to/my-release-key.keystore')
               storePassword 'your-keystore-password'
               keyAlias 'my-key-alias'
               keyPassword 'your-key-password'
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

3. **Build Release APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. **Build App Bundle (for Play Store)**:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

Release artifacts will be in:
- APK: `android/app/build/outputs/apk/release/`
- Bundle: `android/app/build/outputs/bundle/release/`

## Running on Device/Emulator

### Using Android Studio

1. Open the Android project:
   ```bash
   npm run android:open
   ```

2. Click the "Run" button (▶️) in the toolbar

3. Select your target device from the dropdown

### Using Command Line

```bash
# Run on connected device or emulator
npm run android:run
```

This command will:
- Build the web app
- Sync with Android
- Launch the app on the first available device/emulator

### Using ADB (Manual)

```bash
# Build the APK first
cd android
./gradlew assembleDebug

# Install on device
adb install app/build/outputs/apk/debug/app-debug.apk

# Launch the app
adb shell am start -n com.creatirebreeding.app/.MainActivity
```

## Troubleshooting

### Common Issues

#### 1. "ANDROID_HOME not set"

**Error:** `ANDROID_HOME environment variable not set`

**Solution:**
- Follow the [Android Studio Setup](#android-studio-setup) section above
- Restart your terminal/IDE after setting environment variables
- Verify: `echo $ANDROID_HOME` (should show SDK path)

#### 2. "SDK licenses not accepted"

**Error:** `Failed to install the following Android SDK packages as some licences have not been accepted`

**Solution:**
```bash
sdkmanager --licenses
# Accept all licenses by typing 'y'
```

#### 3. "Gradle build failed"

**Error:** Build fails with Gradle errors

**Solution:**
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleDebug
```

#### 4. "Device not found"

**Error:** `No connected devices found`

**Solution for Physical Device:**
- Enable Developer Options on your Android device
- Enable USB Debugging
- Connect via USB
- Accept debugging permission on device
- Verify: `adb devices`

**Solution for Emulator:**
- Open Android Studio
- Go to `Tools > Device Manager`
- Create and start an Android Virtual Device (AVD)

#### 5. "App crashes on launch"

**Error:** App installs but crashes immediately

**Solution:**
- Check device logs: `adb logcat`
- Ensure you ran `npm run build` before syncing
- Verify all dependencies are installed: `npm install`
- Clean and rebuild: `npm run android:sync`

#### 6. "Port already in use" (Development Server)

**Error:** When running dev server for live reload

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows (then taskkill /PID <pid>)
```

### Performance Issues

If the game runs slowly on Android:

1. **Reduce Creature Count**: Limit to 10-15 creatures
2. **Lower Graphics Quality**: Reduce geometry in `Creature.ts`
3. **Disable Shadows**: Comment out shadow rendering in `Environment.ts`
4. **Target Modern Devices**: Test on devices with good GPU support

### WebGL Issues

**Error:** Black screen or WebGL not working

**Solution:**
- Ensure device supports WebGL 2.0
- Check device GPU compatibility
- Update device graphics drivers
- Test on different device/emulator

## Development Workflow

### Live Reload (Hot Reloading)

For faster development, use Capacitor live reload:

1. **Get your computer's local IP**:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

2. **Update capacitor.config.ts**:
   ```typescript
   const config: CapacitorConfig = {
     appId: 'com.creatirebreeding.app',
     appName: 'CreatireBreeding',
     webDir: 'dist',
     server: {
       url: 'http://YOUR_IP:3000', // e.g., http://192.168.1.100:3000
       cleartext: true
     }
   };
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Sync and run**:
   ```bash
   npm run android:sync
   npm run android:open
   # Click Run in Android Studio
   ```

Now changes will reload automatically!

**Note:** Remove the `server` config before building for production.

### Making Changes

Typical workflow:

1. **Edit source files** in `src/`
2. **Build web app**: `npm run build`
3. **Sync to Android**: `npx cap sync android`
4. **Run in Android Studio** or `npm run android:run`

### Testing

- **Web Testing**: `npm run dev` - Test in browser first
- **Android Testing**: `npm run android:run` - Test on device/emulator

## Android-Specific Features

### App Icons

Replace icons in `android/app/src/main/res/`:
- `mipmap-hdpi/`: 72x72px
- `mipmap-mdpi/`: 48x48px
- `mipmap-xhdpi/`: 96x96px
- `mipmap-xxhdpi/`: 144x144px
- `mipmap-xxxhdpi/`: 192x192px

### Splash Screen

Update splash screen in `android/app/src/main/res/drawable/splash.png`

### App Name

Change in `android/app/src/main/res/values/strings.xml`:
```xml
<resources>
    <string name="app_name">CreatireBreeding</string>
</resources>
```

### Permissions

Permissions are defined in `android/app/src/main/AndroidManifest.xml`.

Currently includes:
- `INTERNET` - For web content loading
- `ACCESS_NETWORK_STATE` - For network status

Add more as needed for future features.

## Publishing to Google Play Store

### Steps

1. **Build signed release**: Follow [Release Build](#release-build-production)
2. **Create Google Play Console account**: https://play.google.com/console
3. **Create new app** in Play Console
4. **Upload AAB** (Android App Bundle) to internal testing
5. **Complete store listing**:
   - Screenshots (phone, tablet)
   - App icon (512x512px)
   - Feature graphic (1024x500px)
   - Description
   - Category
   - Content rating
6. **Submit for review**

### Requirements

- Google Play Developer account ($25 one-time fee)
- Privacy policy URL (required)
- App content rating completed
- Target API level 33+ (Android 13+)

## Additional Resources

- **Capacitor Documentation**: https://capacitorjs.com/docs
- **Android Developer Guide**: https://developer.android.com/guide
- **Three.js Mobile**: https://threejs.org/docs/#manual/introduction/Creating-a-scene
- **Vite Build Guide**: https://vitejs.dev/guide/build.html

## Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review Android Studio logs: `View > Tool Windows > Logcat`
3. Check device logs: `adb logcat`
4. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Device information (model, Android version)
   - Android Studio version

---

**Happy Mobile Breeding! 🧬📱**
