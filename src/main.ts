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
    
    // Set up event listeners
    this.setupEventListeners();
    this.setupUICallbacks();
    
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
  }
  
  /**
   * Add a creature to the game
   */
  private addCreature(creature: Creature): void {
    this.creatures.push(creature);
    this.environment.scene.add(creature.mesh);
    this.uiManager.updatePopulationStats(this.creatures);
  }
  
  /**
   * Remove a creature from the game (for future use)
   */
  /*
  private removeCreature(creature: Creature): void {
    const index = this.creatures.indexOf(creature);
    if (index !== -1) {
      this.creatures.splice(index, 1);
      this.environment.scene.remove(creature.mesh);
      this.uiManager.updatePopulationStats(this.creatures);
    }
  }
  */
  
  /**
   * Breed two creatures
   */
  private breedCreatures(creature1: Creature, creature2: Creature): void {
    try {
      if (!BreedingManager.canBreed(creature1, creature2)) {
        const status = BreedingManager.getBreedingStatus(creature1, creature2);
        this.uiManager.showNotification(status, 'error');
        return;
      }
      
      const offspring = BreedingManager.breed(creature1, creature2);
      this.addCreature(offspring);
      this.uiManager.clearSelection();
      this.uiManager.showNotification(
        `${creature1.name} and ${creature2.name} created ${offspring.name}!`,
        'success'
      );
    } catch (error) {
      this.uiManager.showNotification(
        error instanceof Error ? error.message : 'Breeding failed',
        'error'
      );
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
    } else {
      this.uiManager.showNotification('Failed to save game', 'error');
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
    
    // Create new default creatures
    this.initializeDefaultCreatures();
    
    this.uiManager.clearSelection();
    this.uiManager.showNotification('Game reset!', 'info');
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
