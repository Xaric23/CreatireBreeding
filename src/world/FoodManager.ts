/**
 * Food Manager
 * 
 * Manages food spawning and feeding mechanics.
 */

import * as THREE from 'three';
import { Creature } from '../creatures/Creature';

export interface Food {
  id: string;
  position: THREE.Vector3;
  mesh: THREE.Mesh;
  nutritionValue: number;
}

export class FoodManager {
  private foods: Food[] = [];
  private scene: THREE.Scene;
  private maxFood: number = 20;
  private spawnInterval: number = 5000; // 5 seconds
  private lastSpawnTime: number = 0;
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }
  
  /**
   * Update food system
   */
  update(_deltaTime: number, creatures: Creature[]): void {
    const now = Date.now();
    
    // Spawn new food periodically
    if (now - this.lastSpawnTime > this.spawnInterval && this.foods.length < this.maxFood) {
      this.spawnFood();
      this.lastSpawnTime = now;
    }
    
    // Check for creatures eating food
    this.checkFeeding(creatures);
  }
  
  /**
   * Spawn a new food item
   */
  private spawnFood(): void {
    const position = new THREE.Vector3(
      (Math.random() - 0.5) * 40,
      0.2,
      (Math.random() - 0.5) * 40
    );
    
    // Create food mesh (small sphere)
    const geometry = new THREE.SphereGeometry(0.3, 8, 8);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      emissive: 0x003300,
      shininess: 50
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.castShadow = true;
    
    this.scene.add(mesh);
    
    const food: Food = {
      id: 'food_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      position: position,
      mesh: mesh,
      nutritionValue: 20
    };
    
    this.foods.push(food);
  }
  
  /**
   * Check if creatures are near food and let them eat
   */
  private checkFeeding(creatures: Creature[]): void {
    const toRemove: Food[] = [];
    
    this.foods.forEach(food => {
      creatures.forEach(creature => {
        const distance = creature.position.distanceTo(food.position);
        
        // If creature is close to food, eat it
        if (distance < 1.5) {
          creature.energy = Math.min(
            creature.traits.stamina,
            creature.energy + food.nutritionValue
          );
          
          toRemove.push(food);
        }
      });
    });
    
    // Remove eaten food
    toRemove.forEach(food => this.removeFood(food));
  }
  
  /**
   * Remove a food item
   */
  private removeFood(food: Food): void {
    const index = this.foods.indexOf(food);
    if (index !== -1) {
      this.foods.splice(index, 1);
      this.scene.remove(food.mesh);
    }
  }
  
  /**
   * Get all foods
   */
  getFoods(): Food[] {
    return this.foods;
  }
  
  /**
   * Clear all food
   */
  clear(): void {
    this.foods.forEach(food => {
      this.scene.remove(food.mesh);
    });
    this.foods = [];
  }
}
