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

### Advanced Features (NEW!)
- **🧪 Evolution Simulator**: Autonomous multi-generation evolution with configurable speed and natural selection
- **🍖 Feeding System**: Food automatically spawns across the map, creatures eat to restore energy
- **🏞️ Multiple Biomes**: Four distinct biomes (Grassland, Desert, Forest, Snow) with unique environments
- **📊 Stats Visualization**: Real-time charts and graphs showing trait distributions and population trends
- **🏆 Achievement System**: 10 achievements to unlock tracking various milestones
- **🎵 Audio System**: Background music and sound effects for all major actions
- **🌐 Multiplayer Pool**: Export and import breeding pools to share creatures with other players
- **✏️ Creature Naming**: Auto-generated unique names for each creature

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

**🌐 Play Online**: Visit the live version at [https://xaric23.github.io/CreatireBreeding](https://xaric23.github.io/CreatireBreeding)

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
- **UI Buttons**: Access all game features

**Mobile/Android:**
- **Touch & Drag**: Rotate camera view
- **Pinch**: Zoom in/out
- **Tap Creature**: Select for breeding (max 2)
- **UI Buttons**: Access all game features

### Gameplay

1. **Create Creatures**: Click "Create Random Creature" to spawn new creatures with random traits
2. **Select Parents**: Click on two creatures in the 3D world to select them for breeding
3. **Breed**: Click "Breed Selected Creatures" to create offspring
4. **Observe**: Watch creatures move autonomously based on their behavioral traits
5. **Feed**: Creatures automatically eat green food orbs to restore energy
6. **Evolve**: Enable evolution mode to automate breeding across generations
7. **Change Biomes**: Switch between Grassland, Desert, Forest, and Snow biomes
8. **View Stats**: Toggle statistics to see population trends and trait distributions
9. **Earn Achievements**: Unlock achievements by reaching various milestones
10. **Share**: Export your breeding pool to share with other players
11. **Save Progress**: Click "Save Game" to persist your population

### Breeding Rules
- Parents must have sufficient energy (>50%)
- Cannot breed with direct parents or offspring
- Offspring inherit averaged traits with small random mutations
- Colors may blend (e.g., Red + Blue = Purple)

### Evolution Mode
- Automatically breeds creatures when population is below target
- Configurable speed (generations per minute)
- Optional natural selection removes weakest creatures
- Great for observing long-term evolution trends

### Achievements
- **First Steps**: Create your first creature
- **Breeder**: Successfully breed two creatures
- **Growing Family**: Reach a population of 10 creatures
- **Thriving Colony**: Reach a population of 25 creatures
- **Generational**: Breed a 5th generation creature
- **Dynasty**: Breed a 10th generation creature
- **Rainbow Breeder**: Have creatures of 5 different colors
- **Speed Demon**: Breed a creature with speed > 0.9
- **Giant**: Breed a creature with size > 1.5
- **Prepared**: Save your game

## 📁 Project Structure

```
CreatireBreeding/
├── src/                     # TypeScript source code
│   ├── core/               # Core systems
│   │   ├── Genetics.ts     # Genetic trait system
│   │   ├── SaveLoadManager.ts  # Save/load functionality
│   │   ├── EvolutionSimulator.ts  # Evolution automation
│   │   ├── AchievementManager.ts  # Achievement tracking
│   │   ├── AudioManager.ts  # Sound effects and music
│   │   └── MultiplayerPoolManager.ts  # Import/export breeding pools
│   ├── creatures/          # Creature-related code
│   │   ├── Creature.ts     # Creature class with 3D mesh
│   │   └── BreedingManager.ts  # Breeding logic
│   ├── world/              # Environment and world
│   │   ├── Environment.ts  # 3D scene, terrain, lighting
│   │   ├── BiomeManager.ts  # Biome switching system
│   │   └── FoodManager.ts  # Food spawning and feeding
│   ├── ui/                 # User interface
│   │   ├── UIManager.ts    # UI controls and updates
│   │   └── StatsVisualizer.ts  # Charts and statistics
│   └── main.ts             # Application entry point
├── android/                # Android app (generated by Capacitor)
│   └── app/               # Android source and resources
├── .github/                # GitHub Actions workflows
│   └── workflows/         # Automated build and deployment
│       ├── build-apk.yml  # Android APK build
│       ├── create-release.yml  # Release automation
│       ├── release-build.yml  # Release APK build
│       └── deploy-pages.yml  # GitHub Pages deployment
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

The project includes GitHub Actions workflows for automated builds and deployment:

### Continuous Integration
- **Auto-build on push**: APKs are automatically built when code is pushed to `main` or `develop`
- **Auto-release on main**: When code is pushed to `main`, a GitHub release is automatically created with the APK attached
- **Pull Request builds**: APKs are built for all pull requests
- **Manual triggers**: Build debug or release APKs on-demand from the Actions tab

### GitHub Pages Deployment
- **Auto-deploy**: The web version is automatically deployed to GitHub Pages when code is pushed to `main`
- **Live URL**: Visit [https://xaric23.github.io/CreatireBreeding](https://xaric23.github.io/CreatireBreeding) to play online
- **Manual triggers**: Deploy manually from the Actions tab if needed

### Release Automation
- **Create releases**: Use the "Create Release" workflow to automatically create GitHub releases
- **Automatic release builds**: When you create a GitHub release, an APK is automatically built and attached
- **APK signing**: Configure secrets for automatic APK signing in releases
- **Versioned naming**: APKs are named with the release version (e.g., `CreatireBreeding-v1.0.0.apk`)

### Creating a Release
**Option 1: Via GitHub Actions (Recommended)**
1. Go to the [Actions tab](https://github.com/Xaric23/CreatireBreeding/actions)
2. Select "Create Release" workflow
3. Click "Run workflow"
4. Enter version number (e.g., `1.0.0`)
5. Click "Run workflow"
6. The release and APK will be created automatically

**Option 2: Via Git Tag**
```bash
git tag v1.0.0
git push origin v1.0.0
```
The release will be created automatically with the APK attached.

### How to Get Pre-Built APKs
1. **From Releases (Recommended)**: Go to [Releases](https://github.com/Xaric23/CreatireBreeding/releases) and download the latest APK - automatically created on every push to main!
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

#### Evolution Simulator (`src/core/EvolutionSimulator.ts`)
Automated evolution system:
- Configurable auto-breeding speed
- Population management
- Natural selection option
- Multi-generation simulation

#### Food Manager (`src/world/FoodManager.ts`)
Feeding mechanics:
- Periodic food spawning
- Automatic feeding when creatures are nearby
- Energy restoration system

#### Biome Manager (`src/world/BiomeManager.ts`)
Multiple environment types:
- Four distinct biomes (Grassland, Desert, Forest, Snow)
- Dynamic environment switching
- Biome-specific colors and decorations

#### Achievement System (`src/core/AchievementManager.ts`)
Player progression tracking:
- 10 unique achievements
- Persistent progress storage
- Unlock notifications

#### Audio Manager (`src/core/AudioManager.ts`)
Sound system:
- Web Audio API implementation
- Background music with melody loops
- Sound effects for all major actions
- Toggleable music and SFX

#### Stats Visualizer (`src/ui/StatsVisualizer.ts`)
Data visualization:
- ASCII art charts for trait distributions
- Generation distribution charts
- Population statistics
- Real-time updates

#### Multiplayer Pool (`src/core/MultiplayerPoolManager.ts`)
Breeding pool sharing:
- Export creatures as JSON
- Import creatures from other players
- Automatic ID conflict resolution
- Version compatibility checking

## 🎯 Future Enhancements

All planned features have been implemented! Possible future additions:
- [ ] More biome types
- [ ] Additional achievements
- [ ] Advanced trait visualizations
- [ ] Creature combat system
- [ ] Territory/nesting mechanics

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
