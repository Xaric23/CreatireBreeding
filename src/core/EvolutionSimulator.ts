/**
 * Evolution Simulator
 * 
 * Manages autonomous multi-generation evolution simulation.
 */

import { Creature } from '../creatures/Creature';
import { BreedingManager } from '../creatures/BreedingManager';

export interface SimulationConfig {
  enabled: boolean;
  speed: number; // Generations per minute
  maxPopulation: number;
  targetPopulation: number;
  autoBreed: boolean;
  naturalSelection: boolean; // Remove weak creatures
}

export class EvolutionSimulator {
  private config: SimulationConfig = {
    enabled: false,
    speed: 1,
    maxPopulation: 50,
    targetPopulation: 20,
    autoBreed: true,
    naturalSelection: false
  };
  
  private lastBreedTime: number = 0;
  private generationCount: number = 0;
  
  /**
   * Update configuration
   */
  setConfig(config: Partial<SimulationConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Get current configuration
   */
  getConfig(): SimulationConfig {
    return { ...this.config };
  }
  
  /**
   * Update simulation
   */
  update(_deltaTime: number, creatures: Creature[], onBreed: (c1: Creature, c2: Creature) => void, onRemove: (c: Creature) => void): void {
    if (!this.config.enabled || !this.config.autoBreed) return;
    
    const now = Date.now();
    const breedInterval = (60 / this.config.speed) * 1000; // Convert to milliseconds
    
    if (now - this.lastBreedTime > breedInterval) {
      this.lastBreedTime = now;
      
      // Try to breed if population is below target
      if (creatures.length < this.config.targetPopulation) {
        this.tryAutoBreed(creatures, onBreed);
      }
      
      // Apply natural selection if enabled
      if (this.config.naturalSelection && creatures.length > this.config.maxPopulation) {
        this.applyNaturalSelection(creatures, onRemove);
      }
    }
  }
  
  /**
   * Try to automatically breed creatures
   */
  private tryAutoBreed(creatures: Creature[], onBreed: (c1: Creature, c2: Creature) => void): void {
    // Find eligible breeding pairs
    const eligible = creatures.filter(c => c.energy > 0.5 * c.traits.stamina);
    
    if (eligible.length < 2) return;
    
    // Select two random eligible creatures
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < shuffled.length - 1; i++) {
      const c1 = shuffled[i];
      const c2 = shuffled[i + 1];
      
      if (BreedingManager.canBreed(c1, c2)) {
        onBreed(c1, c2);
        this.generationCount++;
        break;
      }
    }
  }
  
  /**
   * Apply natural selection by removing weak creatures
   */
  private applyNaturalSelection(creatures: Creature[], onRemove: (c: Creature) => void): void {
    // Sort by fitness score (combination of traits)
    const sorted = [...creatures].sort((a, b) => {
      const fitnessA = this.calculateFitness(a);
      const fitnessB = this.calculateFitness(b);
      return fitnessA - fitnessB;
    });
    
    // Remove weakest creatures
    const toRemove = Math.min(5, creatures.length - this.config.targetPopulation);
    for (let i = 0; i < toRemove; i++) {
      onRemove(sorted[i]);
    }
  }
  
  /**
   * Calculate fitness score for a creature
   */
  private calculateFitness(creature: Creature): number {
    return (
      creature.traits.size +
      creature.traits.speed +
      creature.traits.stamina +
      creature.energy / creature.traits.stamina
    ) / 4;
  }
  
  /**
   * Get generation count
   */
  getGenerationCount(): number {
    return this.generationCount;
  }
  
  /**
   * Reset generation count
   */
  reset(): void {
    this.generationCount = 0;
    this.lastBreedTime = 0;
  }
}
