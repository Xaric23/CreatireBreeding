/**
 * UI Manager
 * 
 * Manages user interface interactions and updates.
 */

import { Creature } from '../creatures/Creature';
import { StatsVisualizer } from './StatsVisualizer';
import { BiomeType } from '../world/BiomeManager';

export class UIManager {
  private selectedCreatures: Creature[] = [];
  private onBreedCallback: ((creature1: Creature, creature2: Creature) => void) | null = null;
  private onCreateCallback: (() => void) | null = null;
  private onSaveCallback: (() => void) | null = null;
  private onLoadCallback: (() => void) | null = null;
  private onResetCallback: (() => void) | null = null;
  private onEvolutionToggleCallback: (() => void) | null = null;
  private onBiomeChangeCallback: ((biome: BiomeType) => void) | null = null;
  private onMusicToggleCallback: (() => void) | null = null;
  private onSfxToggleCallback: (() => void) | null = null;
  private onExportPoolCallback: (() => void) | null = null;
  private onImportPoolCallback: (() => void) | null = null;
  private showStats: boolean = false;
  
  constructor() {
    this.setupEventListeners();
  }
  
  /**
   * Set up UI event listeners
   */
  private setupEventListeners(): void {
    // Create creature button
    const createBtn = document.getElementById('create-creature-btn');
    createBtn?.addEventListener('click', () => {
      if (this.onCreateCallback) {
        this.onCreateCallback();
      }
    });
    
    // Breed button
    const breedBtn = document.getElementById('breed-btn');
    breedBtn?.addEventListener('click', () => {
      if (this.selectedCreatures.length === 2 && this.onBreedCallback) {
        this.onBreedCallback(this.selectedCreatures[0], this.selectedCreatures[1]);
      }
    });
    
    // Save button
    const saveBtn = document.getElementById('save-game-btn');
    saveBtn?.addEventListener('click', () => {
      if (this.onSaveCallback) {
        this.onSaveCallback();
      }
    });
    
    // Load button
    const loadBtn = document.getElementById('load-game-btn');
    loadBtn?.addEventListener('click', () => {
      if (this.onLoadCallback) {
        this.onLoadCallback();
      }
    });
    
    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    resetBtn?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset? This will delete all creatures.')) {
        if (this.onResetCallback) {
          this.onResetCallback();
        }
      }
    });
    
    // Evolution toggle button
    const evolutionBtn = document.getElementById('evolution-toggle-btn');
    evolutionBtn?.addEventListener('click', () => {
      if (this.onEvolutionToggleCallback) {
        this.onEvolutionToggleCallback();
      }
    });
    
    // Biome buttons
    document.getElementById('biome-grassland-btn')?.addEventListener('click', () => {
      if (this.onBiomeChangeCallback) this.onBiomeChangeCallback(BiomeType.GRASSLAND);
    });
    document.getElementById('biome-desert-btn')?.addEventListener('click', () => {
      if (this.onBiomeChangeCallback) this.onBiomeChangeCallback(BiomeType.DESERT);
    });
    document.getElementById('biome-forest-btn')?.addEventListener('click', () => {
      if (this.onBiomeChangeCallback) this.onBiomeChangeCallback(BiomeType.FOREST);
    });
    document.getElementById('biome-snow-btn')?.addEventListener('click', () => {
      if (this.onBiomeChangeCallback) this.onBiomeChangeCallback(BiomeType.SNOW);
    });
    
    // Audio toggle buttons
    document.getElementById('music-toggle-btn')?.addEventListener('click', () => {
      if (this.onMusicToggleCallback) this.onMusicToggleCallback();
    });
    document.getElementById('sfx-toggle-btn')?.addEventListener('click', () => {
      if (this.onSfxToggleCallback) this.onSfxToggleCallback();
    });
    
    // Multiplayer pool buttons
    document.getElementById('export-pool-btn')?.addEventListener('click', () => {
      if (this.onExportPoolCallback) this.onExportPoolCallback();
    });
    document.getElementById('import-pool-btn')?.addEventListener('click', () => {
      if (this.onImportPoolCallback) this.onImportPoolCallback();
    });
    
    // Stats toggle button
    document.getElementById('toggle-stats-btn')?.addEventListener('click', () => {
      this.showStats = !this.showStats;
      const chartsDiv = document.getElementById('stats-charts');
      const btn = document.getElementById('toggle-stats-btn');
      if (chartsDiv && btn) {
        chartsDiv.style.display = this.showStats ? 'block' : 'none';
        btn.textContent = this.showStats ? 'Hide Charts' : 'Show Charts';
      }
    });
  }
  
  /**
   * Register callback for breeding
   */
  onBreed(callback: (creature1: Creature, creature2: Creature) => void): void {
    this.onBreedCallback = callback;
  }
  
  /**
   * Register callback for creating new creature
   */
  onCreate(callback: () => void): void {
    this.onCreateCallback = callback;
  }
  
  /**
   * Register callback for saving game
   */
  onSave(callback: () => void): void {
    this.onSaveCallback = callback;
  }
  
  /**
   * Register callback for loading game
   */
  onLoad(callback: () => void): void {
    this.onLoadCallback = callback;
  }
  
  /**
   * Register callback for reset
   */
  onReset(callback: () => void): void {
    this.onResetCallback = callback;
  }
  
  /**
   * Register callback for evolution toggle
   */
  onEvolutionToggle(callback: () => void): void {
    this.onEvolutionToggleCallback = callback;
  }
  
  /**
   * Register callback for biome change
   */
  onBiomeChange(callback: (biome: BiomeType) => void): void {
    this.onBiomeChangeCallback = callback;
  }
  
  /**
   * Register callback for music toggle
   */
  onMusicToggle(callback: () => void): void {
    this.onMusicToggleCallback = callback;
  }
  
  /**
   * Register callback for SFX toggle
   */
  onSfxToggle(callback: () => void): void {
    this.onSfxToggleCallback = callback;
  }
  
  /**
   * Register callback for export pool
   */
  onExportPool(callback: () => void): void {
    this.onExportPoolCallback = callback;
  }
  
  /**
   * Register callback for import pool
   */
  onImportPool(callback: () => void): void {
    this.onImportPoolCallback = callback;
  }
  
  /**
   * Update population statistics display
   */
  updatePopulationStats(creatures: Creature[]): void {
    const statsDiv = document.getElementById('population-stats');
    if (!statsDiv) return;
    
    const totalCount = creatures.length;
    const avgGeneration = creatures.length > 0
      ? (creatures.reduce((sum, c) => sum + c.generation, 0) / creatures.length).toFixed(1)
      : 0;
    const maxGeneration = creatures.length > 0
      ? Math.max(...creatures.map(c => c.generation))
      : 0;
    
    statsDiv.innerHTML = `
      <div class="stat">Total Creatures: ${totalCount}</div>
      <div class="stat">Avg Generation: ${avgGeneration}</div>
      <div class="stat">Max Generation: ${maxGeneration}</div>
    `;
  }
  
  /**
   * Update selected creatures display
   */
  updateSelectedCreatures(): void {
    const selectedDiv = document.getElementById('selected-creatures');
    const breedBtn = document.getElementById('breed-btn') as HTMLButtonElement;
    
    if (!selectedDiv || !breedBtn) return;
    
    if (this.selectedCreatures.length === 0) {
      selectedDiv.innerHTML = '<p class="instructions">Select 2 creatures to breed</p>';
      breedBtn.disabled = true;
    } else if (this.selectedCreatures.length === 1) {
      const creature = this.selectedCreatures[0];
      selectedDiv.innerHTML = `
        <div class="creature-card selected">
          <strong>${creature.name}</strong>
          <div class="stat">Generation: ${creature.generation}</div>
          <div class="stat">Energy: ${creature.energy.toFixed(1)}/${creature.traits.stamina.toFixed(1)}</div>
        </div>
        <p class="instructions">Select 1 more creature</p>
      `;
      breedBtn.disabled = true;
    } else if (this.selectedCreatures.length === 2) {
      const c1 = this.selectedCreatures[0];
      const c2 = this.selectedCreatures[1];
      
      selectedDiv.innerHTML = `
        <div class="creature-card selected">
          <strong>${c1.name}</strong>
          <div class="stat">Gen ${c1.generation} | Energy: ${c1.energy.toFixed(1)}</div>
        </div>
        <div class="creature-card selected">
          <strong>${c2.name}</strong>
          <div class="stat">Gen ${c2.generation} | Energy: ${c2.energy.toFixed(1)}</div>
        </div>
      `;
      breedBtn.disabled = false;
    }
  }
  
  /**
   * Select a creature
   */
  selectCreature(creature: Creature): void {
    // Check if already selected
    const index = this.selectedCreatures.findIndex(c => c.id === creature.id);
    
    if (index !== -1) {
      // Deselect
      this.selectedCreatures.splice(index, 1);
    } else {
      // Select (max 2)
      if (this.selectedCreatures.length < 2) {
        this.selectedCreatures.push(creature);
      } else {
        // Replace oldest selection
        this.selectedCreatures.shift();
        this.selectedCreatures.push(creature);
      }
    }
    
    this.updateSelectedCreatures();
  }
  
  /**
   * Clear selected creatures
   */
  clearSelection(): void {
    this.selectedCreatures = [];
    this.updateSelectedCreatures();
  }
  
  /**
   * Check if a creature is selected
   */
  isSelected(creature: Creature): boolean {
    return this.selectedCreatures.some(c => c.id === creature.id);
  }
  
  /**
   * Show a notification message
   */
  showNotification(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.padding = '20px 40px';
    notification.style.borderRadius = '8px';
    notification.style.color = 'white';
    notification.style.fontSize = '16px';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
    
    // Set background color based on type
    switch (type) {
      case 'success':
        notification.style.background = 'rgba(76, 175, 80, 0.95)';
        break;
      case 'error':
        notification.style.background = 'rgba(244, 67, 54, 0.95)';
        break;
      default:
        notification.style.background = 'rgba(33, 150, 243, 0.95)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  /**
   * Update statistics charts
   */
  updateStatsCharts(creatures: Creature[]): void {
    if (!this.showStats) return;
    
    const chartsDiv = document.getElementById('stats-charts');
    if (!chartsDiv) return;
    
    chartsDiv.innerHTML = `
      ${StatsVisualizer.getStatsSummary(creatures)}
      ${StatsVisualizer.createGenerationChart(creatures)}
      ${StatsVisualizer.createTraitChart(creatures, 'size')}
      ${StatsVisualizer.createTraitChart(creatures, 'speed')}
    `;
  }
  
  /**
   * Update achievements display
   */
  updateAchievements(achievements: { id: string; name: string; description: string; unlocked: boolean }[]): void {
    const achievementsDiv = document.getElementById('achievements-list');
    if (!achievementsDiv) return;
    
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    
    achievementsDiv.innerHTML = `
      <div class="stat">${unlockedCount}/${achievements.length} Unlocked</div>
      ${achievements.map(a => `
        <div class="achievement ${a.unlocked ? 'unlocked' : ''}">
          <strong>${a.name}</strong>
          <div>${a.description}</div>
        </div>
      `).join('')}
    `;
  }
  
  /**
   * Update evolution button state
   */
  updateEvolutionButton(enabled: boolean): void {
    const btn = document.getElementById('evolution-toggle-btn');
    if (btn) {
      btn.textContent = enabled ? 'Stop Evolution' : 'Start Evolution';
      btn.classList.toggle('active', enabled);
    }
  }
  
  /**
   * Update music button state
   */
  updateMusicButton(enabled: boolean): void {
    const btn = document.getElementById('music-toggle-btn');
    if (btn) {
      btn.textContent = enabled ? 'Music: On' : 'Music: Off';
      btn.classList.toggle('active', enabled);
    }
  }
  
  /**
   * Update SFX button state
   */
  updateSfxButton(enabled: boolean): void {
    const btn = document.getElementById('sfx-toggle-btn');
    if (btn) {
      btn.textContent = enabled ? 'SFX: On' : 'SFX: Off';
      btn.classList.toggle('active', enabled);
    }
  }
}
