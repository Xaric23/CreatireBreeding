# GitHub Actions Workflows

This directory contains automated workflows for building the CreatireBreeding Android APK.

## Available Workflows

### 1. Create Release (`create-release.yml`)

**Purpose:** Creates a GitHub release with a version tag, which automatically triggers the APK build.

**Triggers:**
- Manual trigger via "Actions" tab (with version input)
- Push of version tags (e.g., `v1.0.0`)

**What it does:**
1. Creates a version tag (if triggered manually)
2. Generates release notes from commits
3. Creates a GitHub release
4. Automatically triggers the Release Build workflow

**How to create a release manually:**
1. Go to "Actions" tab
2. Select "Create Release"
3. Click "Run workflow"
4. Enter version number (e.g., `1.0.0`)
5. Optionally mark as pre-release
6. Click "Run workflow"
7. The release will be created and APK will be built automatically

**How to create a release via tag:**
1. Create and push a version tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. The workflow runs automatically
3. Release is created with the APK attached

### 2. Build Android APK (`build-apk.yml`)

**Purpose:** Automatically builds the Android APK on push and pull requests.

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual trigger via "Actions" tab (with debug/release option)

**What it does:**
1. Sets up Node.js 20 and JDK 21
2. Installs npm dependencies
3. Builds the web app (TypeScript + Vite)
4. Syncs with Android using Capacitor
5. Builds the debug APK (or release if manually triggered)
6. Uploads the APK as a workflow artifact
7. **NEW:** Automatically creates a GitHub release with the APK when pushed to `main` branch

**Automatic Releases:**
When code is pushed to the `main` branch, the workflow will:
- Generate a version number based on date and build number (e.g., `2025.11.14.42`)
- Create a GitHub release with that version
- Attach the built APK to the release
- Users can download directly from the Releases page

**Artifacts:**
- `app-debug-apk`: Debug APK (kept for 30 days)
- `app-release-apk`: Release APK (kept for 90 days)
- `apk-metadata`: Build metadata (kept for 30 days)

**How to download:**
1. Go to the "Actions" tab in GitHub
2. Click on a completed workflow run
3. Scroll down to "Artifacts"
4. Download the APK

**Manual trigger:**
1. Go to "Actions" tab
2. Select "Build Android APK"
3. Click "Run workflow"
4. Choose "debug" or "release"
5. Click "Run workflow"

### 3. Release Build (`release-build.yml`)

**Purpose:** Automatically builds and attaches APK to GitHub releases.

**Triggers:**
- When a GitHub release is created or published
- Manual trigger via "Actions" tab

**What it does:**
1. Builds a release APK
2. Signs the APK (if signing secrets are configured)
3. Renames APK with version number
4. Attaches APK to the GitHub release
5. Uploads APK as artifact

**APK Naming:**
- Signed: `CreatireBreeding-v1.0.0.apk`
- Unsigned: `CreatireBreeding-v1.0.0-unsigned.apk`

**How to use:**
1. Create a new release in GitHub
2. The workflow runs automatically
3. APK is attached to the release
4. Users can download directly from the release page

## Configuring APK Signing (Optional)

To enable automatic signing of release APKs, configure these GitHub secrets:

### Step 1: Create a Release Keystore

```bash
keytool -genkey -v -keystore release.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### Step 2: Encode Keystore as Base64

```bash
base64 -w 0 release.keystore > keystore.base64
```

### Step 3: Add GitHub Secrets

Go to repository Settings → Secrets and variables → Actions → New repository secret:

1. **KEYSTORE_BASE64**
   - Content of `keystore.base64` file
   
2. **KEYSTORE_PASSWORD**
   - Password used when creating the keystore
   
3. **KEY_ALIAS**
   - Alias used (e.g., `my-key-alias`)
   
4. **KEY_PASSWORD**
   - Key password (same as keystore password if not different)

### Step 4: Verify

Create a new release and the APK will be automatically signed!

## Workflow Requirements

All workflows require:
- Node.js 20+
- JDK 21
- Android SDK
- Gradle

These are automatically installed by the workflows using GitHub Actions.

## Troubleshooting

### Build fails with "Java version" error
- The workflows are configured to use JDK 21
- Check the "Set up JDK 21" step in the workflow logs

### APK not attached to release
- Ensure the release was created properly
- Check the workflow logs for errors
- Verify the release event triggered the workflow

### Signing fails
- Verify all four secrets are set correctly
- Ensure the keystore was encoded properly
- Check the base64 encoding has no line breaks

## Development

To test workflow changes locally, you can use [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run the build workflow
act push -j build-apk

# Run the release workflow
act release -j build-release
```

## Build Status

[![Build Android APK](../../actions/workflows/build-apk.yml/badge.svg)](../../actions/workflows/build-apk.yml)

Add this badge to your README.md to show build status!

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Android APK Build Guide](../../APK_BUILD_GUIDE.md)
- [Android Development Guide](../../ANDROID_BUILD.md)
