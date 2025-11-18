/**
 * Breeding Manager
 * 
 * Manages the breeding process between two creatures.
 */

import { Creature, CreatureData } from './Creature';
import { GeneticsManager } from '../core/Genetics';

export class BreedingManager {
  /**
   * Breed two creatures to create offspring
   * 
   * @param parent1 - First parent creature
   * @param parent2 - Second parent creature
   * @returns New offspring creature
   */
  static breed(parent1: Creature, parent2: Creature): Creature {
    // Check if parents have enough energy
    if (parent1.energy < parent1.traits.stamina * 0.5 || 
        parent2.energy < parent2.traits.stamina * 0.5) {
      throw new Error('Parents need more energy to breed');
    }
    
    // Create offspring traits by combining parent genetics
    const offspringTraits = GeneticsManager.breedTraits(
      parent1.traits,
      parent2.traits
    );
    
    // Generate offspring name from parents
    const offspringName = this.generateOffspringName(parent1.name, parent2.name);
    
    // Determine generation
    const offspringGeneration = Math.max(parent1.generation, parent2.generation) + 1;
    
    // Create offspring data
    const offspringData: Partial<CreatureData> = {
      name: offspringName,
      traits: offspringTraits,
      generation: offspringGeneration,
      parentIds: [parent1.id, parent2.id],
      birthTime: Date.now()
    };
    
    // Create offspring creature
    const offspring = new Creature(offspringData);
    
    // Position offspring near parents
    offspring.position.set(
      (parent1.position.x + parent2.position.x) / 2 + (Math.random() - 0.5) * 2,
      0,
      (parent1.position.z + parent2.position.z) / 2 + (Math.random() - 0.5) * 2
    );
    offspring.mesh.position.copy(offspring.position);
    
    // Reduce parent energy
    parent1.energy *= 0.7;
    parent2.energy *= 0.7;
    
    return offspring;
  }
  
  /**
   * Generate a name for offspring by blending parent names
   */
  private static generateOffspringName(name1: string, name2: string): string {
    // Take first half of first name and second half of second name
    const midPoint1 = Math.floor(name1.length / 2);
    const midPoint2 = Math.floor(name2.length / 2);
    
    const part1 = name1.substring(0, midPoint1);
    const part2 = name2.substring(midPoint2);
    
    return part1 + part2;
  }
  
  /**
   * Check if two creatures can breed
   */
  static canBreed(creature1: Creature, creature2: Creature): boolean {
    // Must be different creatures
    if (creature1.id === creature2.id) {
      return false;
    }
    
    // Must have enough energy
    if (creature1.energy < creature1.traits.stamina * 0.5 || 
        creature2.energy < creature2.traits.stamina * 0.5) {
      return false;
    }
    
    // Cannot breed with direct parent or offspring
    if (creature1.parentIds && 
        (creature1.parentIds.includes(creature2.id))) {
      return false;
    }
    
    if (creature2.parentIds && 
        (creature2.parentIds.includes(creature1.id))) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Get breeding compatibility message
   */
  static getBreedingStatus(creature1: Creature, creature2: Creature): string {
    if (creature1.id === creature2.id) {
      return 'Cannot breed with self';
    }
    
    if (creature1.energy < creature1.traits.stamina * 0.5) {
      return `${creature1.name} needs more energy`;
    }
    
    if (creature2.energy < creature2.traits.stamina * 0.5) {
      return `${creature2.name} needs more energy`;
    }
    
    if (creature1.parentIds && creature1.parentIds.includes(creature2.id)) {
      return 'Cannot breed with parent';
    }
    
    if (creature2.parentIds && creature2.parentIds.includes(creature1.id)) {
      return 'Cannot breed with offspring';
    }
    
    return 'Ready to breed';
  }
}
