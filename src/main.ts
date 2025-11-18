/**
 * Main Application
 * 
 * Entry point for the 3D Creature Breeding Game.
 * Integrates all systems: creatures, breeding, environment, UI, and save/load.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Creature } from './creatures/Creature';
import { BreedingManager } from './creatures/BreedingManager';
import { Environment } from './world/Environment';
import { UIManager } from './ui/UIManager';
import { SaveLoadManager } from './core/SaveLoadManager';
import { EvolutionSimulator } from './core/EvolutionSimulator';
import { FoodManager } from './world/FoodManager';
import { BiomeManager, BiomeType } from './world/BiomeManager';
import { AchievementManager } from './core/AchievementManager';
import { AudioManager } from './core/AudioManager';
import { MultiplayerPoolManager } from './core/MultiplayerPoolManager';

class Game {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private environment: Environment;
  private creatures: Creature[] = [];
  private uiManager: UIManager;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private clock: THREE.Clock;
  private evolutionSimulator: EvolutionSimulator;
  private foodManager: FoodManager;
  private biomeManager: BiomeManager;
  private achievementManager: AchievementManager;
  private audioManager: AudioManager;
  
  constructor() {
    // Initialize Three.js
    this.renderer = this.createRenderer();
    this.camera = this.createCamera();
    this.controls = this.createControls();
    
    // Initialize game systems
    this.environment = new Environment();
    this.uiManager = new UIManager();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    
    // Initialize new systems
    this.evolutionSimulator = new EvolutionSimulator();
    this.foodManager = new FoodManager(this.environment.scene);
    this.biomeManager = new BiomeManager(this.environment.scene);
    this.achievementManager = new AchievementManager();
    this.audioManager = new AudioManager();
    
    // Set up event listeners
    this.setupEventListeners();
    this.setupUICallbacks();
    this.setupAchievementCallbacks();
    
    // Initialize audio on first user interaction
    document.addEventListener('click', () => {
      this.audioManager.initialize();
    }, { once: true });
    
    // Try to load saved game
    if (SaveLoadManager.hasSaveFile()) {
      const loaded = this.loadGame();
      if (!loaded) {
        this.initializeDefaultCreatures();
      }
    } else {
      this.initializeDefaultCreatures();
    }
    
    // Start game loop
    this.animate();
    
    console.log('3D Creature Breeding Game initialized!');
  }
  
  /**
   * Create the WebGL renderer
   */
  private createRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const container = document.getElementById('canvas-container');
    if (container) {
      container.appendChild(renderer.domElement);
    }
    
    return renderer;
  }
  
  /**
   * Create the camera
   */
  private createCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
    return camera;
  }
  
  /**
   * Create orbit controls for camera
   */
  private createControls(): OrbitControls {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below ground
    return controls;
  }
  
  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Window resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Mouse/Touch click for creature selection
    window.addEventListener('click', (event) => this.onMouseClick(event));
    window.addEventListener('touchend', (event) => {
      // Check if touch is on a button or UI element
      const target = event.target as HTMLElement;
      const isButton = target.tagName === 'BUTTON' || target.closest('button');
      const isUIElement = target.closest('.ui-panel');
      
      // Only prevent default for canvas touches (not UI elements)
      // This allows buttons to work on mobile
      if (event.cancelable && !isButton && !isUIElement) {
        event.preventDefault();
        // Convert touch to click-like event for creature selection
        const touch = event.changedTouches[0];
        this.onMouseClick(touch as any);
      }
    });
    
    // Mouse move for hover effects
    window.addEventListener('mousemove', (event) => this.onMouseMove(event));
  }
  
  /**
   * Set up UI callbacks
   */
  private setupUICallbacks(): void {
    this.uiManager.onCreate(() => this.createRandomCreature());
    this.uiManager.onBreed((c1, c2) => this.breedCreatures(c1, c2));
    this.uiManager.onSave(() => this.saveGame());
    this.uiManager.onLoad(() => this.loadGame());
    this.uiManager.onReset(() => this.resetGame());
    this.uiManager.onEvolutionToggle(() => this.toggleEvolution());
    this.uiManager.onBiomeChange((biome) => this.changeBiome(biome));
    this.uiManager.onMusicToggle(() => this.toggleMusic());
    this.uiManager.onSfxToggle(() => this.toggleSfx());
    this.uiManager.onExportPool(() => this.exportPool());
    this.uiManager.onImportPool(() => this.importPool());
  }
  
  /**
   * Set up achievement callbacks
   */
  private setupAchievementCallbacks(): void {
    this.achievementManager.onUnlock((achievement) => {
      this.uiManager.showNotification(`Achievement Unlocked: ${achievement.name}!`, 'success');
      this.audioManager.playAchievementSound();
    });
    
    // Update UI with initial achievements
    this.uiManager.updateAchievements(this.achievementManager.getAchievements());
  }
  
  /**
   * Initialize with some default creatures
   */
  private initializeDefaultCreatures(): void {
    for (let i = 0; i < 3; i++) {
      this.createRandomCreature();
    }
  }
  
  /**
   * Create a new random creature
   */
  private createRandomCreature(): void {
    const creature = new Creature();
    this.addCreature(creature);
    this.uiManager.showNotification(`Created ${creature.name}!`, 'success');
    this.audioManager.playCreationSound();
  }
  
  /**
   * Add a creature to the game
   */
  private addCreature(creature: Creature): void {
    this.creatures.push(creature);
    this.environment.scene.add(creature.mesh);
    this.updateGameState();
  }
  
  /**
   * Remove a creature from the game
   */
  private removeCreature(creature: Creature): void {
    const index = this.creatures.indexOf(creature);
    if (index !== -1) {
      this.creatures.splice(index, 1);
      this.environment.scene.remove(creature.mesh);
      this.updateGameState();
    }
  }
  
  /**
   * Update all game state displays
   */
  private updateGameState(): void {
    this.uiManager.updatePopulationStats(this.creatures);
    this.uiManager.updateStatsCharts(this.creatures);
    this.achievementManager.checkAchievements(this.creatures);
    this.uiManager.updateAchievements(this.achievementManager.getAchievements());
  }
  
  /**
   * Breed two creatures
   */
  private breedCreatures(creature1: Creature, creature2: Creature): void {
    try {
      if (!BreedingManager.canBreed(creature1, creature2)) {
        const status = BreedingManager.getBreedingStatus(creature1, creature2);
        this.uiManager.showNotification(status, 'error');
        this.audioManager.playErrorSound();
        return;
      }
      
      const offspring = BreedingManager.breed(creature1, creature2);
      this.addCreature(offspring);
      this.uiManager.clearSelection();
      this.uiManager.showNotification(
        `${creature1.name} and ${creature2.name} created ${offspring.name}!`,
        'success'
      );
      this.audioManager.playBreedingSound();
      this.achievementManager.unlock('first_breed');
    } catch (error) {
      this.uiManager.showNotification(
        error instanceof Error ? error.message : 'Breeding failed',
        'error'
      );
      this.audioManager.playErrorSound();
    }
  }
  
  /**
   * Save game state
   */
  private saveGame(): void {
    const creatureData = this.creatures.map(c => c.toData());
    const success = SaveLoadManager.saveGame(creatureData);
    
    if (success) {
      this.uiManager.showNotification('Game saved successfully!', 'success');
      this.achievementManager.unlock('save_game');
    } else {
      this.uiManager.showNotification('Failed to save game', 'error');
      this.audioManager.playErrorSound();
    }
  }
  
  /**
   * Load game state
   */
  private loadGame(): boolean {
    const gameData = SaveLoadManager.loadGame();
    
    if (!gameData) {
      this.uiManager.showNotification('No save file found', 'error');
      return false;
    }
    
    // Clear existing creatures
    this.creatures.forEach(creature => {
      this.environment.scene.remove(creature.mesh);
    });
    this.creatures = [];
    
    // Load creatures from save data
    gameData.creatures.forEach(data => {
      const creature = new Creature(data);
      this.addCreature(creature);
    });
    
    this.uiManager.clearSelection();
    this.uiManager.showNotification(
      `Loaded ${gameData.creatures.length} creatures!`,
      'success'
    );
    
    return true;
  }
  
  /**
   * Reset the game
   */
  private resetGame(): void {
    // Remove all creatures
    this.creatures.forEach(creature => {
      this.environment.scene.remove(creature.mesh);
    });
    this.creatures = [];
    
    // Delete save
    SaveLoadManager.deleteSave();
    
    // Reset systems
    this.evolutionSimulator.reset();
    this.foodManager.clear();
    
    // Create new default creatures
    this.initializeDefaultCreatures();
    
    this.uiManager.clearSelection();
    this.uiManager.showNotification('Game reset!', 'info');
  }
  
  /**
   * Toggle evolution simulation
   */
  private toggleEvolution(): void {
    const config = this.evolutionSimulator.getConfig();
    config.enabled = !config.enabled;
    this.evolutionSimulator.setConfig(config);
    this.uiManager.updateEvolutionButton(config.enabled);
    
    if (config.enabled) {
      this.uiManager.showNotification('Evolution simulation started', 'info');
    } else {
      this.uiManager.showNotification('Evolution simulation stopped', 'info');
    }
  }
  
  /**
   * Change biome
   */
  private changeBiome(biomeType: BiomeType): void {
    const ambientLight = this.environment.scene.children.find(
      child => child instanceof THREE.AmbientLight
    ) as THREE.AmbientLight;
    
    this.biomeManager.switchBiome(biomeType, this.environment.ground, ambientLight);
    this.uiManager.showNotification(`Switched to ${biomeType} biome`, 'success');
  }
  
  /**
   * Toggle music
   */
  private toggleMusic(): void {
    this.audioManager.toggleMusic();
    const config = this.audioManager.getConfig();
    this.uiManager.updateMusicButton(config.musicEnabled);
    
    if (config.musicEnabled && config.enabled) {
      this.audioManager.playBackgroundMusic();
    }
  }
  
  /**
   * Toggle sound effects
   */
  private toggleSfx(): void {
    this.audioManager.toggleSfx();
    const config = this.audioManager.getConfig();
    this.uiManager.updateSfxButton(config.sfxEnabled);
  }
  
  /**
   * Export breeding pool
   */
  private exportPool(): void {
    const creatureData = this.creatures.map(c => c.toData());
    MultiplayerPoolManager.downloadPool(creatureData);
    this.uiManager.showNotification('Breeding pool exported!', 'success');
  }
  
  /**
   * Import breeding pool
   */
  private importPool(): void {
    MultiplayerPoolManager.uploadPool((data) => {
      if (data && data.creatures) {
        const currentData = this.creatures.map(c => c.toData());
        const merged = MultiplayerPoolManager.mergeCreatures(currentData, data.creatures, 10);
        
        // Add imported creatures
        const importCount = merged.length - currentData.length;
        for (let i = currentData.length; i < merged.length; i++) {
          const creature = new Creature(merged[i]);
          this.addCreature(creature);
        }
        
        this.uiManager.showNotification(
          `Imported ${importCount} creatures from ${data.exportedBy}`,
          'success'
        );
      } else {
        this.uiManager.showNotification('Failed to import breeding pool', 'error');
        this.audioManager.playErrorSound();
      }
    });
  }
  
  /**
   * Handle window resize
   */
  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  /**
   * Handle mouse click
   */
  private onMouseClick(event: MouseEvent): void {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check for intersections with creatures
    const creatureMeshes = this.creatures.map(c => c.mesh);
    const intersects = this.raycaster.intersectObjects(creatureMeshes, true);
    
    if (intersects.length > 0) {
      // Find which creature was clicked
      const clickedMesh = intersects[0].object;
      const creature = this.creatures.find(c => 
        c.mesh === clickedMesh || c.mesh.children.includes(clickedMesh)
      );
      
      if (creature) {
        this.uiManager.selectCreature(creature);
        this.updateCreatureVisuals();
      }
    }
  }
  
  /**
   * Handle mouse move
   */
  private onMouseMove(event: MouseEvent): void {
    // Update mouse position
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  
  /**
   * Update creature visuals based on selection
   */
  private updateCreatureVisuals(): void {
    this.creatures.forEach(creature => {
      const isSelected = this.uiManager.isSelected(creature);
      
      // Update creature scale to show selection
      if (isSelected) {
        creature.mesh.scale.setScalar(1.2);
      } else {
        creature.mesh.scale.setScalar(1.0);
      }
    });
  }
  
  /**
   * Main game loop
   */
  private animate(): void {
    requestAnimationFrame(() => this.animate());
    
    const deltaTime = this.clock.getDelta();
    
    // Update environment
    this.environment.update(deltaTime);
    
    // Update creatures
    this.creatures.forEach(creature => {
      creature.update(deltaTime);
    });
    
    // Update evolution simulator
    this.evolutionSimulator.update(
      deltaTime,
      this.creatures,
      (c1, c2) => this.breedCreatures(c1, c2),
      (c) => this.removeCreature(c)
    );
    
    // Update food system
    this.foodManager.update(deltaTime, this.creatures);
    
    // Update controls
    this.controls.update();
    
    // Render scene
    this.renderer.render(this.environment.scene, this.camera);
  }
}

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
