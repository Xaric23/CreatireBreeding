# CreatireBreeding - 3D Creature Breeding Game

A fully interactive 3D creature breeding and evolution game built with Three.js and TypeScript. Create unique creatures with procedurally generated appearances, breed them to combine traits, and watch them evolve across generations.

**Now available for Web and Android! 📱**

[![Build Android APK](https://github.com/Xaric23/CreatireBreeding/actions/workflows/build-apk.yml/badge.svg)](https://github.com/Xaric23/CreatireBreeding/actions/workflows/build-apk.yml)

![3D Creature Breeding Game](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)

## ✨ Features

### Core Features
- **🎨 Procedural 3D Generation**: Creatures are dynamically generated with unique body parts, colors, and patterns
- **🧬 Genetic System**: Complex trait inheritance with mutations for size, speed, stamina, colors, and body proportions
- **🔄 Breeding Mechanics**: Combine two creatures to create offspring with blended traits
- **🌍 3D Environment**: Fully navigable 3D world with terrain, trees, rocks, and dynamic day/night cycle
- **🤖 AI Behavior**: Autonomous creature movement influenced by behavioral traits (curiosity, aggression, social)
- **💾 Save/Load System**: Persistent game state using browser local storage
- **🎮 Interactive UI**: Click/touch-to-select creatures, breeding controls, and population statistics
- **📱 Android Support**: Native Android app with touch controls via Capacitor

### Creature Traits
- **Physical**: Size, speed, stamina
- **Visual**: Body color, accent color, pattern type (spots, stripes, spikes)
- **Proportions**: Head size, body length, limb length
- **Behavioral**: Aggression, curiosity, social tendency

## 🚀 Quick Start

### Web Version

#### Prerequisites
- Node.js 16+ and npm

#### Installation

```bash
# Clone the repository
git clone https://github.com/Xaric23/CreatireBreeding.git
cd CreatireBreeding

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will automatically open in your browser at `http://localhost:3000`

#### Build for Production

```bash
npm run build
npm run preview
```

### Android Version

For building and running the Android app, see the comprehensive **[Android Build Guide](ANDROID_BUILD.md)** or **[APK Build Guide](APK_BUILD_GUIDE.md)**.

#### Quick Android Setup

```bash
# Install dependencies (if not done)
npm install

# Build APK directly
npm run android:build

# Or build and sync to Android
npm run android:sync

# Open in Android Studio
npm run android:open

# Or run directly (requires Android SDK)
npm run android:run
```

**Prerequisites for Android:**
- Android Studio
- Android SDK (API 33+)
- Java Development Kit (JDK) 21

**Download APK:**
- Pre-built APKs are available in [GitHub Releases](https://github.com/Xaric23/CreatireBreeding/releases)
- Or from [GitHub Actions](https://github.com/Xaric23/CreatireBreeding/actions/workflows/build-apk.yml) artifacts

See [ANDROID_BUILD.md](ANDROID_BUILD.md) for detailed instructions.

## 🎮 How to Play

### Controls

**Web (Desktop):**
- **Mouse Drag**: Rotate camera view
- **Mouse Scroll**: Zoom in/out
- **Click Creature**: Select for breeding (max 2)

**Mobile/Android:**
- **Touch & Drag**: Rotate camera view
- **Pinch**: Zoom in/out
- **Tap Creature**: Select for breeding (max 2)

### Gameplay

1. **Create Creatures**: Click "Create Random Creature" to spawn new creatures with random traits
2. **Select Parents**: Click on two creatures in the 3D world to select them for breeding
3. **Breed**: Click "Breed Selected Creatures" to create offspring
4. **Observe**: Watch creatures move autonomously based on their behavioral traits
5. **Save Progress**: Click "Save Game" to persist your population
6. **Load Game**: Reload your saved creatures at any time

### Breeding Rules
- Parents must have sufficient energy (>50%)
- Cannot breed with direct parents or offspring
- Offspring inherit averaged traits with small random mutations
- Colors may blend (e.g., Red + Blue = Purple)

## 📁 Project Structure

```
CreatireBreeding/
├── src/                     # TypeScript source code
│   ├── core/               # Core systems
│   │   ├── Genetics.ts     # Genetic trait system
│   │   └── SaveLoadManager.ts  # Save/load functionality
│   ├── creatures/          # Creature-related code
│   │   ├── Creature.ts     # Creature class with 3D mesh
│   │   └── BreedingManager.ts  # Breeding logic
│   ├── world/              # Environment and world
│   │   └── Environment.ts  # 3D scene, terrain, lighting
│   ├── ui/                 # User interface
│   │   └── UIManager.ts    # UI controls and updates
│   └── main.ts             # Application entry point
├── android/                # Android app (generated by Capacitor)
│   └── app/               # Android source and resources
├── .github/                # GitHub Actions workflows
│   └── workflows/         # Automated build workflows
├── public/                 # Static assets
├── dist/                   # Build output (generated)
├── index.html             # HTML entry point
├── capacitor.config.ts    # Capacitor configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
├── package.json           # Dependencies and scripts
├── README.md              # This file
├── ANDROID_BUILD.md       # Android build guide
├── APK_BUILD_GUIDE.md     # APK build guide
└── SETUP.md               # Web setup guide
```

## 🤖 Automated Builds

The project includes GitHub Actions workflows for automated APK building:

### Continuous Integration
- **Auto-build on push**: APKs are automatically built when code is pushed to `main` or `develop`
- **Pull Request builds**: APKs are built for all pull requests
- **Manual triggers**: Build debug or release APKs on-demand from the Actions tab

### Release Automation
- **Automatic release builds**: When you create a GitHub release, an APK is automatically built and attached
- **APK signing**: Configure secrets for automatic APK signing in releases
- **Versioned naming**: APKs are named with the release version (e.g., `CreatireBreeding-v1.0.0.apk`)

### How to Get Pre-Built APKs
1. **From Releases**: Go to [Releases](https://github.com/Xaric23/CreatireBreeding/releases) and download the APK
2. **From Actions**: Go to [Actions](https://github.com/Xaric23/CreatireBreeding/actions), select a workflow run, and download artifacts
3. **Build Manually**: Trigger a workflow run from the Actions tab

See [.github/workflows/README.md](.github/workflows/README.md) for detailed workflow documentation.

## 🛠️ Technical Details

### Technologies
- **Three.js** (v0.181+): 3D graphics rendering
- **TypeScript** (v5.9+): Type-safe development
- **Vite** (v7.2+): Fast build tool and dev server
- **Capacitor** (v7.4+): Native mobile app platform (iOS/Android)

### Architecture

#### Genetics System (`src/core/Genetics.ts`)
Manages trait generation and inheritance with realistic genetic algorithms:
- Random trait generation for first-generation creatures
- Mendelian-inspired trait inheritance
- Mutation system for evolutionary variation
- Color blending with RGB interpolation

#### Creature Class (`src/creatures/Creature.ts`)
Each creature is a self-contained entity with:
- Procedural 3D mesh generation based on genetic traits
- Autonomous AI behavior and pathfinding
- Energy system affecting movement and breeding
- Serializable data for save/load

#### Breeding System (`src/creatures/BreedingManager.ts`)
Handles reproduction logic:
- Validation of breeding compatibility
- Trait combination algorithms
- Energy cost for breeding
- Parent-offspring relationship tracking

#### Environment (`src/world/Environment.ts`)
Creates the 3D world:
- Procedural terrain with height variation
- Dynamic lighting with day/night cycle
- Decorative elements (trees, rocks)
- Atmospheric effects and fog

#### Save/Load System (`src/core/SaveLoadManager.ts`)
Persistent game state:
- JSON serialization of creature data
- Browser localStorage integration
- Import/export functionality
- Version compatibility checking

## 🎯 Future Enhancements

### Planned Features
- [ ] Evolution simulation mode (autonomous multi-generation evolution)
- [ ] Creature naming system
- [ ] Feeding and habitat management
- [ ] Multiple biomes with different environments
- [ ] Creature stats visualization (charts/graphs)
- [ ] Multiplayer breeding pool
- [ ] Achievement system
- [ ] Sound effects and music

## 🐛 Known Issues

- Creatures may occasionally overlap when spawned
- Camera controls can be sensitive on some devices
- Large populations (100+) may impact performance

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Three.js](https://threejs.org/) - Amazing 3D library
- Inspired by creature breeding mechanics from games like Spore and Pokémon
- Genetic algorithms based on real-world heredity principles

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Enjoy breeding your creatures! 🧬🎮**
