/**
 * Biome Manager
 * 
 * Manages multiple biomes with different environments.
 */

import * as THREE from 'three';

export enum BiomeType {
  GRASSLAND = 'grassland',
  DESERT = 'desert',
  FOREST = 'forest',
  SNOW = 'snow'
}

export interface BiomeConfig {
  type: BiomeType;
  groundColor: number;
  fogColor: number;
  ambientColor: number;
  treeCount: number;
  rockCount: number;
}

export class BiomeManager {
  private currentBiome: BiomeType = BiomeType.GRASSLAND;
  private scene: THREE.Scene;
  private decorations: THREE.Object3D[] = [];
  
  private biomeConfigs: Record<BiomeType, BiomeConfig> = {
    [BiomeType.GRASSLAND]: {
      type: BiomeType.GRASSLAND,
      groundColor: 0x4a7c2c,
      fogColor: 0x87ceeb,
      ambientColor: 0x404040,
      treeCount: 15,
      rockCount: 8
    },
    [BiomeType.DESERT]: {
      type: BiomeType.DESERT,
      groundColor: 0xdaa520,
      fogColor: 0xffd700,
      ambientColor: 0x606060,
      treeCount: 3,
      rockCount: 12
    },
    [BiomeType.FOREST]: {
      type: BiomeType.FOREST,
      groundColor: 0x2d5016,
      fogColor: 0x6b8e23,
      ambientColor: 0x303030,
      treeCount: 30,
      rockCount: 5
    },
    [BiomeType.SNOW]: {
      type: BiomeType.SNOW,
      groundColor: 0xffffff,
      fogColor: 0xe0ffff,
      ambientColor: 0x606070,
      treeCount: 10,
      rockCount: 10
    }
  };
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }
  
  /**
   * Switch to a different biome
   */
  switchBiome(biomeType: BiomeType, ground: THREE.Mesh, ambientLight: THREE.AmbientLight): void {
    this.currentBiome = biomeType;
    const config = this.biomeConfigs[biomeType];
    
    // Update ground color
    if (ground.material instanceof THREE.MeshPhongMaterial) {
      ground.material.color.setHex(config.groundColor);
    }
    
    // Update fog
    this.scene.fog = new THREE.Fog(config.fogColor, 30, 80);
    
    // Update ambient light
    ambientLight.color.setHex(config.ambientColor);
    
    // Clear old decorations
    this.clearDecorations();
    
    // Add new decorations
    this.addDecorations(config);
  }
  
  /**
   * Add decorations based on biome
   */
  private addDecorations(config: BiomeConfig): void {
    // Add trees
    for (let i = 0; i < config.treeCount; i++) {
      const tree = this.createTree(config.type);
      tree.position.set(
        (Math.random() - 0.5) * 40,
        0,
        (Math.random() - 0.5) * 40
      );
      this.scene.add(tree);
      this.decorations.push(tree);
    }
    
    // Add rocks
    for (let i = 0; i < config.rockCount; i++) {
      const rock = this.createRock(config.type);
      rock.position.set(
        (Math.random() - 0.5) * 40,
        0,
        (Math.random() - 0.5) * 40
      );
      this.scene.add(rock);
      this.decorations.push(rock);
    }
  }
  
  /**
   * Create a tree appropriate for the biome
   */
  private createTree(biomeType: BiomeType): THREE.Group {
    const tree = new THREE.Group();
    
    let trunkColor = 0x8b4513;
    let foliageColor = 0x228b22;
    
    switch (biomeType) {
      case BiomeType.DESERT:
        trunkColor = 0x6b4423;
        foliageColor = 0x556b2f;
        break;
      case BiomeType.FOREST:
        trunkColor = 0x654321;
        foliageColor = 0x006400;
        break;
      case BiomeType.SNOW:
        trunkColor = 0x696969;
        foliageColor = 0xe0ffff;
        break;
    }
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: trunkColor });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1.5;
    trunk.castShadow = true;
    tree.add(trunk);
    
    // Foliage
    const foliageGeometry = new THREE.ConeGeometry(1.5, 3, 8);
    const foliageMaterial = new THREE.MeshPhongMaterial({ color: foliageColor });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 4;
    foliage.castShadow = true;
    tree.add(foliage);
    
    return tree;
  }
  
  /**
   * Create a rock appropriate for the biome
   */
  private createRock(biomeType: BiomeType): THREE.Mesh {
    let rockColor = 0x808080;
    
    switch (biomeType) {
      case BiomeType.DESERT:
        rockColor = 0xcd853f;
        break;
      case BiomeType.SNOW:
        rockColor = 0xdcdcdc;
        break;
    }
    
    const geometry = new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.5);
    const material = new THREE.MeshPhongMaterial({ color: rockColor });
    const rock = new THREE.Mesh(geometry, material);
    rock.castShadow = true;
    rock.receiveShadow = true;
    rock.scale.set(1, 0.6, 1);
    rock.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    
    return rock;
  }
  
  /**
   * Clear all decorations
   */
  private clearDecorations(): void {
    this.decorations.forEach(decoration => {
      this.scene.remove(decoration);
    });
    this.decorations = [];
  }
  
  /**
   * Get current biome
   */
  getCurrentBiome(): BiomeType {
    return this.currentBiome;
  }
  
  /**
   * Get all available biomes
   */
  getAvailableBiomes(): BiomeType[] {
    return Object.values(BiomeType);
  }
}
