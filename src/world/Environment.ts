/**
 * Environment Class
 * 
 * Manages the 3D world environment including terrain, lighting, and atmosphere.
 */

import * as THREE from 'three';

export class Environment {
  public scene: THREE.Scene;
  public ground: THREE.Mesh;
  private lights: THREE.Light[] = [];
  private timeOfDay: number = 0.5; // 0 = midnight, 0.5 = noon, 1 = midnight
  
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
    this.scene.fog = new THREE.Fog(0x87CEEB, 30, 100);
    
    this.ground = this.createGround();
    this.scene.add(this.ground);
    
    this.setupLighting();
    this.addAtmosphere();
  }
  
  /**
   * Create the ground terrain
   */
  private createGround(): THREE.Mesh {
    const groundGeometry = new THREE.PlaneGeometry(100, 100, 20, 20);
    
    // Add some terrain variation
    const positions = groundGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] = Math.random() * 0.5 - 0.25; // Small height variation
    }
    groundGeometry.attributes.position.needsUpdate = true;
    groundGeometry.computeVertexNormals();
    
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0x3a8a3a,
      side: THREE.DoubleSide
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    
    return ground;
  }
  
  /**
   * Set up scene lighting
   */
  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);
    
    // Directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    
    // Configure shadow properties
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -30;
    sunLight.shadow.camera.right = 30;
    sunLight.shadow.camera.top = 30;
    sunLight.shadow.camera.bottom = -30;
    
    this.scene.add(sunLight);
    this.lights.push(sunLight);
    
    // Hemisphere light for ambient sky/ground
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x3a8a3a, 0.3);
    this.scene.add(hemisphereLight);
    this.lights.push(hemisphereLight);
  }
  
  /**
   * Add atmospheric elements
   */
  private addAtmosphere(): void {
    // Add a subtle grid to help with depth perception
    const gridHelper = new THREE.GridHelper(100, 50, 0x444444, 0x222222);
    gridHelper.position.y = 0.01;
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);
    
    // Add some decorative elements
    this.addTrees();
    this.addRocks();
  }
  
  /**
   * Add simple trees to the environment
   */
  private addTrees(): void {
    const treePositions = [
      { x: -15, z: -15 },
      { x: -18, z: 12 },
      { x: 15, z: -18 },
      { x: 20, z: 15 },
      { x: -10, z: 20 },
      { x: 12, z: -12 }
    ];
    
    treePositions.forEach(pos => {
      const tree = this.createTree();
      tree.position.set(pos.x, 0, pos.z);
      this.scene.add(tree);
    });
  }
  
  /**
   * Create a simple tree model
   */
  private createTree(): THREE.Group {
    const tree = new THREE.Group();
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1.5;
    trunk.castShadow = true;
    tree.add(trunk);
    
    // Foliage
    const foliageGeometry = new THREE.SphereGeometry(1.5, 8, 8);
    const foliageMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 3.5;
    foliage.scale.set(1, 1.3, 1);
    foliage.castShadow = true;
    tree.add(foliage);
    
    return tree;
  }
  
  /**
   * Add decorative rocks
   */
  private addRocks(): void {
    const rockPositions = [
      { x: 8, z: 8 },
      { x: -12, z: 5 },
      { x: 5, z: -10 },
      { x: -8, z: -8 }
    ];
    
    rockPositions.forEach(pos => {
      const rock = this.createRock();
      rock.position.set(pos.x, 0, pos.z);
      this.scene.add(rock);
    });
  }
  
  /**
   * Create a simple rock model
   */
  private createRock(): THREE.Mesh {
    const rockGeometry = new THREE.DodecahedronGeometry(0.8 + Math.random() * 0.5, 0);
    const rockMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    rock.scale.set(1, 0.5 + Math.random() * 0.3, 1);
    rock.castShadow = true;
    rock.receiveShadow = true;
    return rock;
  }
  
  /**
   * Update environment (day/night cycle, etc.)
   */
  update(deltaTime: number): void {
    // Slowly cycle through time of day
    this.timeOfDay = (this.timeOfDay + deltaTime * 0.01) % 1.0;
    
    // Update lighting based on time of day
    this.updateLighting();
  }
  
  /**
   * Update lighting for day/night cycle
   */
  private updateLighting(): void {
    // Calculate sun position
    const sunAngle = this.timeOfDay * Math.PI * 2;
    const sunHeight = Math.sin(sunAngle);
    
    // Update directional light (sun)
    if (this.lights[1] instanceof THREE.DirectionalLight) {
      const sunLight = this.lights[1] as THREE.DirectionalLight;
      sunLight.position.set(
        Math.cos(sunAngle) * 20,
        Math.max(5, sunHeight * 20),
        Math.sin(sunAngle) * 20
      );
      
      // Adjust intensity based on sun height
      const intensity = Math.max(0.2, sunHeight * 0.8 + 0.2);
      sunLight.intensity = intensity;
    }
    
    // Update ambient light
    if (this.lights[0] instanceof THREE.AmbientLight) {
      const ambientIntensity = Math.max(0.2, sunHeight * 0.4 + 0.2);
      this.lights[0].intensity = ambientIntensity;
    }
    
    // Update background color for time of day
    const skyColor = this.getSkyColor();
    this.scene.background = new THREE.Color(skyColor);
    this.scene.fog = new THREE.Fog(skyColor, 30, 100);
  }
  
  /**
   * Get sky color based on time of day
   */
  private getSkyColor(): number {
    const angle = this.timeOfDay * Math.PI * 2;
    const dayness = (Math.sin(angle) + 1) / 2; // 0 = night, 1 = day
    
    // Interpolate between night and day colors
    const nightColor = { r: 0x10, g: 0x10, b: 0x30 };
    const dayColor = { r: 0x87, g: 0xCE, b: 0xEB };
    
    const r = Math.floor(nightColor.r + (dayColor.r - nightColor.r) * dayness);
    const g = Math.floor(nightColor.g + (dayColor.g - nightColor.g) * dayness);
    const b = Math.floor(nightColor.b + (dayColor.b - nightColor.b) * dayness);
    
    return (r << 16) | (g << 8) | b;
  }
}
