/**
 * Save/Load System
 * 
 * Manages saving and loading game state to/from local storage.
 */

import { CreatureData } from '../creatures/Creature';

export interface GameData {
  creatures: CreatureData[];
  timestamp: number;
  version: string;
}

export class SaveLoadManager {
  private static readonly SAVE_KEY = 'creature_breeding_save';
  private static readonly VERSION = '1.0.0';
  
  /**
   * Save game data to local storage
   */
  static saveGame(creatures: CreatureData[]): boolean {
    try {
      const gameData: GameData = {
        creatures: creatures,
        timestamp: Date.now(),
        version: this.VERSION
      };
      
      const jsonData = JSON.stringify(gameData);
      localStorage.setItem(this.SAVE_KEY, jsonData);
      
      console.log(`Game saved successfully with ${creatures.length} creatures`);
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }
  
  /**
   * Load game data from local storage
   */
  static loadGame(): GameData | null {
    try {
      const jsonData = localStorage.getItem(this.SAVE_KEY);
      
      if (!jsonData) {
        console.log('No saved game found');
        return null;
      }
      
      const gameData: GameData = JSON.parse(jsonData);
      
      // Validate version compatibility
      if (gameData.version !== this.VERSION) {
        console.warn(`Save file version ${gameData.version} may not be compatible with ${this.VERSION}`);
      }
      
      console.log(`Game loaded successfully with ${gameData.creatures.length} creatures`);
      return gameData;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }
  
  /**
   * Check if a save file exists
   */
  static hasSaveFile(): boolean {
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }
  
  /**
   * Delete saved game
   */
  static deleteSave(): boolean {
    try {
      localStorage.removeItem(this.SAVE_KEY);
      console.log('Save file deleted');
      return true;
    } catch (error) {
      console.error('Failed to delete save:', error);
      return false;
    }
  }
  
  /**
   * Export save data as downloadable JSON file
   */
  static exportSave(): void {
    const jsonData = localStorage.getItem(this.SAVE_KEY);
    
    if (!jsonData) {
      console.error('No save data to export');
      return;
    }
    
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `creature_breeding_save_${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('Save exported successfully');
  }
  
  /**
   * Import save data from JSON file
   */
  static async importSave(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const jsonData = event.target?.result as string;
          const gameData: GameData = JSON.parse(jsonData);
          
          // Validate data structure
          if (!gameData.creatures || !Array.isArray(gameData.creatures)) {
            throw new Error('Invalid save file format');
          }
          
          localStorage.setItem(this.SAVE_KEY, jsonData);
          console.log('Save imported successfully');
          resolve(true);
        } catch (error) {
          console.error('Failed to import save:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        console.error('Failed to read file');
        resolve(false);
      };
      
      reader.readAsText(file);
    });
  }
}
