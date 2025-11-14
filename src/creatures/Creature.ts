/**
 * Creature Class
 * 
 * Represents a single creature with genetics, 3D mesh, and AI behavior.
 */

import * as THREE from 'three';
import { GeneticTraits, GeneticsManager } from '../core/Genetics';

export interface CreatureData {
  id: string;
  name: string;
  traits: GeneticTraits;
  generation: number;
  parentIds: [string, string] | null;
  birthTime: number;
  energy: number;
}

export class Creature {
  public id: string;
  public name: string;
  public traits: GeneticTraits;
  public generation: number;
  public parentIds: [string, string] | null;
  public birthTime: number;
  public energy: number;
  
  public mesh: THREE.Group;
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  public targetPosition: THREE.Vector3 | null = null;
  
  private idleTime: number = 0;
  
  constructor(data: Partial<CreatureData> = {}) {
    this.id = data.id || this.generateId();
    this.name = data.name || this.generateName();
    this.traits = data.traits || GeneticsManager.generateRandomTraits();
    this.generation = data.generation || 1;
    this.parentIds = data.parentIds || null;
    this.birthTime = data.birthTime || Date.now();
    this.energy = data.energy || this.traits.stamina;
    
    this.position = new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      0,
      (Math.random() - 0.5) * 20
    );
    this.velocity = new THREE.Vector3();
    
    this.mesh = this.createMesh();
    this.mesh.position.copy(this.position);
  }
  
  /**
   * Create procedural 3D mesh for the creature based on genetic traits
   */
  private createMesh(): THREE.Group {
    const group = new THREE.Group();
    
    const bodyColor = new THREE.Color(this.traits.bodyColor);
    const accentColor = new THREE.Color(this.traits.accentColor);
    
    // Body
    const bodyGeometry = new THREE.SphereGeometry(
      0.5 * this.traits.size,
      16,
      16
    );
    bodyGeometry.scale(1, 0.8, this.traits.bodyLength);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: bodyColor,
      shininess: 30
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    
    // Head
    const headSize = 0.4 * this.traits.headSize * this.traits.size;
    const headGeometry = new THREE.SphereGeometry(headSize, 12, 12);
    const headMaterial = new THREE.MeshPhongMaterial({ 
      color: bodyColor,
      shininess: 30
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.1, 0.5 * this.traits.bodyLength * this.traits.size);
    head.castShadow = true;
    group.add(head);
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.08 * this.traits.size, 8, 8);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: accentColor });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15 * this.traits.size, 0.15, 0.6 * this.traits.bodyLength * this.traits.size);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15 * this.traits.size, 0.15, 0.6 * this.traits.bodyLength * this.traits.size);
    group.add(rightEye);
    
    // Limbs
    const limbRadius = 0.1 * this.traits.size;
    const limbLength = 0.5 * this.traits.limbLength * this.traits.size;
    const limbGeometry = new THREE.CylinderGeometry(limbRadius, limbRadius * 0.7, limbLength, 8);
    const limbMaterial = new THREE.MeshPhongMaterial({ color: accentColor });
    
    // Position limbs
    const limbPositions = [
      { x: -0.3, z: 0.2 },  // Front left
      { x: 0.3, z: 0.2 },   // Front right
      { x: -0.3, z: -0.2 }, // Back left
      { x: 0.3, z: -0.2 }   // Back right
    ];
    
    limbPositions.forEach(pos => {
      const limb = new THREE.Mesh(limbGeometry, limbMaterial.clone());
      limb.position.set(
        pos.x * this.traits.size,
        -limbLength / 2,
        pos.z * this.traits.size
      );
      limb.castShadow = true;
      group.add(limb);
    });
    
    // Pattern decorations based on pattern trait
    if (this.traits.pattern > 0) {
      this.addPattern(group, accentColor);
    }
    
    return group;
  }
  
  /**
   * Add visual patterns to the creature based on pattern trait
   */
  private addPattern(group: THREE.Group, accentColor: THREE.Color): void {
    const patternMaterial = new THREE.MeshPhongMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0.6
    });
    
    switch (this.traits.pattern) {
      case 1: // Spots
        for (let i = 0; i < 6; i++) {
          const spot = new THREE.Mesh(
            new THREE.SphereGeometry(0.1 * this.traits.size, 8, 8),
            patternMaterial
          );
          const angle = (i / 6) * Math.PI * 2;
          spot.position.set(
            Math.cos(angle) * 0.4 * this.traits.size,
            Math.sin(angle * 2) * 0.2 * this.traits.size,
            Math.sin(angle) * 0.3 * this.traits.size
          );
          group.add(spot);
        }
        break;
        
      case 2: // Stripes
        for (let i = 0; i < 3; i++) {
          const stripe = new THREE.Mesh(
            new THREE.BoxGeometry(
              0.8 * this.traits.size,
              0.05 * this.traits.size,
              0.1 * this.traits.size
            ),
            patternMaterial
          );
          stripe.position.z = (i - 1) * 0.3 * this.traits.size;
          group.add(stripe);
        }
        break;
        
      case 3: // Spikes
        for (let i = 0; i < 5; i++) {
          const spike = new THREE.Mesh(
            new THREE.ConeGeometry(0.08 * this.traits.size, 0.3 * this.traits.size, 6),
            patternMaterial
          );
          spike.position.set(
            0,
            0.4 * this.traits.size,
            (i - 2) * 0.2 * this.traits.size
          );
          spike.rotation.z = Math.PI;
          group.add(spike);
        }
        break;
    }
  }
  
  /**
   * Update creature AI and movement
   */
  update(deltaTime: number): void {
    // Decrease energy over time
    this.energy = Math.max(0, this.energy - deltaTime * 0.1);
    
    // If low energy, rest
    if (this.energy < 0.3 * this.traits.stamina) {
      this.idleTime += deltaTime;
      if (this.idleTime > 2) {
        this.energy = Math.min(this.traits.stamina, this.energy + deltaTime * 0.5);
      }
      return;
    }
    
    this.idleTime = 0;
    
    // Choose new target based on behavior
    if (!this.targetPosition || this.position.distanceTo(this.targetPosition) < 1) {
      this.chooseNewTarget();
    }
    
    // Move towards target
    if (this.targetPosition) {
      const direction = new THREE.Vector3()
        .subVectors(this.targetPosition, this.position)
        .normalize();
      
      const speed = this.traits.speed * 2 * deltaTime;
      this.velocity.lerp(direction.multiplyScalar(speed), 0.1);
      
      this.position.add(this.velocity);
      
      // Keep within bounds
      this.position.x = Math.max(-25, Math.min(25, this.position.x));
      this.position.z = Math.max(-25, Math.min(25, this.position.z));
      
      this.mesh.position.copy(this.position);
      
      // Face movement direction
      if (this.velocity.lengthSq() > 0.01) {
        const angle = Math.atan2(this.velocity.x, this.velocity.z);
        this.mesh.rotation.y = angle;
      }
    }
  }
  
  /**
   * Choose a new target position based on behavioral traits
   */
  private chooseNewTarget(): void {
    const range = this.traits.curiosity * 20 + 5;
    this.targetPosition = new THREE.Vector3(
      this.position.x + (Math.random() - 0.5) * range,
      0,
      this.position.z + (Math.random() - 0.5) * range
    );
  }
  
  /**
   * Generate a unique ID for the creature
   */
  private generateId(): string {
    return 'creature_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  /**
   * Generate a random name for the creature
   */
  private generateName(): string {
    const prefixes = ['Aero', 'Blaze', 'Cryo', 'Drake', 'Echo', 'Flux', 'Glim', 'Hydro'];
    const suffixes = ['ion', 'yx', 'or', 'is', 'us', 'ix', 'ax', 'en'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return prefix + suffix;
  }
  
  /**
   * Export creature data for saving
   */
  toData(): CreatureData {
    return {
      id: this.id,
      name: this.name,
      traits: this.traits,
      generation: this.generation,
      parentIds: this.parentIds,
      birthTime: this.birthTime,
      energy: this.energy
    };
  }
}
