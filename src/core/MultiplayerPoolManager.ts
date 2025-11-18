/**
 * Multiplayer Pool Manager
 * 
 * Manages import/export of breeding data for shared breeding pool.
 */

import { CreatureData } from '../creatures/Creature';

export interface BreedingPoolData {
  creatures: CreatureData[];
  exportedBy: string;
  exportedAt: number;
  version: string;
}

export class MultiplayerPoolManager {
  private static readonly VERSION = '1.0.0';
  
  /**
   * Export creatures to breeding pool
   */
  static exportToPool(creatures: CreatureData[], playerName: string = 'Anonymous'): string {
    const data: BreedingPoolData = {
      creatures: creatures,
      exportedBy: playerName,
      exportedAt: Date.now(),
      version: this.VERSION
    };
    
    return JSON.stringify(data, null, 2);
  }
  
  /**
   * Import creatures from breeding pool
   */
  static importFromPool(jsonData: string): BreedingPoolData | null {
    try {
      const data = JSON.parse(jsonData) as BreedingPoolData;
      
      // Validate data structure
      if (!data.creatures || !Array.isArray(data.creatures)) {
        throw new Error('Invalid breeding pool data');
      }
      
      // Check version compatibility
      if (data.version !== this.VERSION) {
        console.warn('Version mismatch, data may be incompatible');
      }
      
      return data;
    } catch (error) {
      console.error('Failed to import breeding pool:', error);
      return null;
    }
  }
  
  /**
   * Download breeding pool as file
   */
  static downloadPool(creatures: CreatureData[], playerName: string = 'Anonymous'): void {
    const data = this.exportToPool(creatures, playerName);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `breeding-pool-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
  
  /**
   * Upload breeding pool from file
   */
  static uploadPool(callback: (data: BreedingPoolData | null) => void): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const data = this.importFromPool(content);
        callback(data);
      };
      reader.readAsText(file);
    };
    
    input.click();
  }
  
  /**
   * Merge imported creatures with existing population
   */
  static mergeCreatures(existing: CreatureData[], imported: CreatureData[], maxImport: number = 10): CreatureData[] {
    // Take up to maxImport creatures from imported pool
    const toImport = imported.slice(0, maxImport);
    
    // Update IDs to avoid conflicts
    toImport.forEach(creature => {
      creature.id = 'imported_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      // Mark as generation 1 in new environment
      creature.generation = 1;
      creature.parentIds = null;
    });
    
    return [...existing, ...toImport];
  }
}
