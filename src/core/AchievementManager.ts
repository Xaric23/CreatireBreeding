/**
 * Achievement System
 * 
 * Tracks and manages player achievements.
 */

import { Creature } from '../creatures/Creature';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export class AchievementManager {
  private achievements: Map<string, Achievement> = new Map();
  private onUnlockCallbacks: ((achievement: Achievement) => void)[] = [];
  
  constructor() {
    this.initializeAchievements();
    this.loadProgress();
  }
  
  /**
   * Initialize all achievements
   */
  private initializeAchievements(): void {
    const achievementList: Achievement[] = [
      {
        id: 'first_creature',
        name: 'First Steps',
        description: 'Create your first creature',
        unlocked: false
      },
      {
        id: 'first_breed',
        name: 'Breeder',
        description: 'Successfully breed two creatures',
        unlocked: false
      },
      {
        id: 'population_10',
        name: 'Growing Family',
        description: 'Reach a population of 10 creatures',
        unlocked: false
      },
      {
        id: 'population_25',
        name: 'Thriving Colony',
        description: 'Reach a population of 25 creatures',
        unlocked: false
      },
      {
        id: 'generation_5',
        name: 'Generational',
        description: 'Breed a 5th generation creature',
        unlocked: false
      },
      {
        id: 'generation_10',
        name: 'Dynasty',
        description: 'Breed a 10th generation creature',
        unlocked: false
      },
      {
        id: 'rainbow_breeder',
        name: 'Rainbow Breeder',
        description: 'Have creatures of 5 different colors',
        unlocked: false
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Breed a creature with speed > 0.9',
        unlocked: false
      },
      {
        id: 'giant',
        name: 'Giant',
        description: 'Breed a creature with size > 1.5',
        unlocked: false
      },
      {
        id: 'save_game',
        name: 'Prepared',
        description: 'Save your game',
        unlocked: false
      }
    ];
    
    achievementList.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }
  
  /**
   * Check and unlock achievements based on game state
   */
  checkAchievements(creatures: Creature[]): void {
    // First creature
    if (creatures.length >= 1) {
      this.unlock('first_creature');
    }
    
    // Population milestones
    if (creatures.length >= 10) {
      this.unlock('population_10');
    }
    if (creatures.length >= 25) {
      this.unlock('population_25');
    }
    
    // Generation milestones
    const maxGeneration = Math.max(...creatures.map(c => c.generation), 0);
    if (maxGeneration >= 5) {
      this.unlock('generation_5');
    }
    if (maxGeneration >= 10) {
      this.unlock('generation_10');
    }
    
    // Rainbow breeder - count unique colors
    const uniqueColors = new Set(creatures.map(c => c.traits.bodyColor));
    if (uniqueColors.size >= 5) {
      this.unlock('rainbow_breeder');
    }
    
    // Speed demon
    const hasFastCreature = creatures.some(c => c.traits.speed > 0.9);
    if (hasFastCreature) {
      this.unlock('speed_demon');
    }
    
    // Giant
    const hasGiant = creatures.some(c => c.traits.size > 1.5);
    if (hasGiant) {
      this.unlock('giant');
    }
  }
  
  /**
   * Unlock an achievement
   */
  unlock(achievementId: string): void {
    const achievement = this.achievements.get(achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = Date.now();
      this.saveProgress();
      
      // Notify callbacks
      this.onUnlockCallbacks.forEach(callback => callback(achievement));
    }
  }
  
  /**
   * Register callback for achievement unlocks
   */
  onUnlock(callback: (achievement: Achievement) => void): void {
    this.onUnlockCallbacks.push(callback);
  }
  
  /**
   * Get all achievements
   */
  getAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }
  
  /**
   * Get unlocked achievements count
   */
  getUnlockedCount(): number {
    return Array.from(this.achievements.values()).filter(a => a.unlocked).length;
  }
  
  /**
   * Save progress to localStorage
   */
  private saveProgress(): void {
    const data = Array.from(this.achievements.values());
    localStorage.setItem('achievements', JSON.stringify(data));
  }
  
  /**
   * Load progress from localStorage
   */
  private loadProgress(): void {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      try {
        const data = JSON.parse(saved) as Achievement[];
        data.forEach(savedAchievement => {
          const achievement = this.achievements.get(savedAchievement.id);
          if (achievement && savedAchievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedAt = savedAchievement.unlockedAt;
          }
        });
      } catch (error) {
        console.error('Failed to load achievements:', error);
      }
    }
  }
  
  /**
   * Reset all achievements
   */
  reset(): void {
    this.achievements.forEach(achievement => {
      achievement.unlocked = false;
      achievement.unlockedAt = undefined;
    });
    this.saveProgress();
  }
}
