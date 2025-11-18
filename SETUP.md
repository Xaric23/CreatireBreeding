# Setup Guide for CreatireBreeding 3D Game

This guide will help you set up and run the 3D Creature Breeding Game on your local machine.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Running the Game](#running-the-game)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required
- **Node.js** (version 16.x or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
  
- **npm** (usually comes with Node.js)
  - Verify installation: `npm --version`

### Optional (for Python demo)
- **Python** (version 3.6 or higher)
  - Download from: https://www.python.org/
  - Verify installation: `python --version` or `python3 --version`

## Installation Steps

### 1. Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/Xaric23/CreatireBreeding.git

# Or using SSH
git clone git@github.com:Xaric23/CreatireBreeding.git

# Navigate to the project directory
cd CreatireBreeding
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Three.js (3D graphics library)
- TypeScript (type-safe JavaScript)
- Vite (build tool and dev server)
- Type definitions for Three.js

**Expected output:**
```
added 24 packages, and audited 25 packages in 5s
found 0 vulnerabilities
```

### 3. Verify Installation

Check that TypeScript compiles without errors:

```bash
npm run build
```

You should see output like:
```
✓ built in 1.68s
```

## Running the Game

### Development Mode (Recommended)

Start the development server with hot-reload:

```bash
npm run dev
```

The game will automatically open in your default browser at:
```
http://localhost:3000
```

**Development Features:**
- Hot Module Replacement (HMR) - changes reflect instantly
- Source maps for debugging
- Fast refresh on file changes

### Production Preview

Build and preview the production version:

```bash
npm run build
npm run preview
```

This creates an optimized build in the `dist/` directory.

## Building for Production

### Create Production Build

```bash
npm run build
```

**Output:**
- Compiled files in `dist/` directory
- Minified JavaScript bundle (~540KB)
- Optimized HTML and assets
- Source maps for debugging

### Deploy the Build

The `dist/` folder can be deployed to any static hosting service:

**Popular Options:**
- **GitHub Pages**: Free hosting for GitHub repos
- **Netlify**: Drag-and-drop deployment
- **Vercel**: Optimized for frontend frameworks
- **AWS S3**: Scalable cloud storage

**Example: Deploying to GitHub Pages**

```bash
# Build the project
npm run build

# Deploy dist folder to gh-pages branch
# (requires gh-pages package: npm install -D gh-pages)
npx gh-pages -d dist
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Change port in vite.config.ts, or kill the process using port 3000
# On Linux/Mac:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### 2. Module Not Found

**Error:** `Cannot find module 'three'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. TypeScript Errors

**Error:** `TS2307: Cannot find module`

**Solution:**
```bash
# Ensure TypeScript is installed
npm install -D typescript

# Regenerate type declarations
npx tsc --noEmit
```

#### 4. Build Fails

**Error:** Build exits with error code

**Solution:**
```bash
# Clean build artifacts
rm -rf dist

# Rebuild
npm run build
```

#### 5. Browser Not Opening

**Issue:** Dev server starts but browser doesn't open

**Solution:**
- Manually open: http://localhost:3000
- Check browser default settings
- Try different browser

### Browser Compatibility

**Supported Browsers:**
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

**Not Supported:**
- Internet Explorer (any version) ❌

### Performance Issues

If the game runs slowly:

1. **Reduce Population**: Limit creatures to < 20
2. **Disable Shadows**: Comment out shadow rendering in `Environment.ts`
3. **Lower Quality**: Reduce geometry segments in `Creature.ts`
4. **Close Other Tabs**: Free up system resources

## Development

### Project Structure

```
CreatireBreeding/
├── src/                    # Source code
│   ├── core/              # Core systems
│   │   ├── Genetics.ts    # Genetic algorithms
│   │   └── SaveLoadManager.ts  # Persistence
│   ├── creatures/         # Creature logic
│   │   ├── Creature.ts    # Creature class
│   │   └── BreedingManager.ts  # Breeding system
│   ├── world/             # 3D environment
│   │   └── Environment.ts # Scene, terrain, lighting
│   ├── ui/                # User interface
│   │   └── UIManager.ts   # UI controls
│   └── main.ts            # Application entry
├── public/                # Static assets
├── dist/                  # Build output (generated)
├── index.html            # HTML entry point
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── vite.config.ts        # Build config
```

### Making Changes

1. **Edit Source Files**: Modify files in `src/`
2. **Hot Reload**: Changes appear instantly in dev mode
3. **Type Check**: Run `npx tsc --noEmit` to check types
4. **Build**: Run `npm run build` to create production build

### Adding Features

**Example: Add New Creature Trait**

1. Update `GeneticTraits` interface in `src/core/Genetics.ts`
2. Modify `generateRandomTraits()` for new trait
3. Update `breedTraits()` for inheritance logic
4. Adjust `Creature.createMesh()` to visualize trait
5. Test and rebuild

### Debugging

**Browser DevTools:**
- Open DevTools: `F12` or `Cmd+Option+I` (Mac)
- Console: View logs and errors
- Sources: Set breakpoints in TypeScript
- Performance: Monitor frame rate

**Console Commands:**
```javascript
// Access game state (in browser console)
window.game  // Game instance (if exposed)

// Monitor Three.js renderer
console.log(renderer.info)  // Render stats
```

## Python Demo (Legacy)

The repository includes a Python proof-of-concept:

```bash
python demo.py
# or
python3 demo.py
```

This runs a text-based creature breeding simulation.

## Additional Resources

- **Three.js Docs**: https://threejs.org/docs/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Vite Guide**: https://vitejs.dev/guide/

## Getting Help

If you encounter issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Review error messages in console
3. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - System information (OS, Node version, browser)

## License

This project is licensed under the MIT License.

---

**Happy Breeding! 🧬**
