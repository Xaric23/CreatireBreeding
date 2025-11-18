/**
 * Genetics System
 * 
 * Manages genetic traits and inheritance for creatures.
 * Traits include physical characteristics and behavioral attributes.
 */

export interface GeneticTraits {
  // Physical traits
  size: number;           // 0.5 - 2.0 (multiplier for body size)
  speed: number;          // 0.5 - 2.0 (movement speed multiplier)
  stamina: number;        // 0.5 - 2.0 (energy capacity)
  
  // Visual traits
  bodyColor: string;      // Hex color
  accentColor: string;    // Secondary hex color
  pattern: number;        // 0-3 (pattern type)
  
  // Body proportions
  headSize: number;       // 0.5 - 1.5
  bodyLength: number;     // 0.7 - 1.5
  limbLength: number;     // 0.6 - 1.4
  
  // Behavioral traits
  aggression: number;     // 0.0 - 1.0
  curiosity: number;      // 0.0 - 1.0
  social: number;         // 0.0 - 1.0
}

export class GeneticsManager {
  /**
   * Generate completely random traits for a new creature
   */
  static generateRandomTraits(): GeneticTraits {
    return {
      size: this.randomInRange(0.5, 2.0),
      speed: this.randomInRange(0.5, 2.0),
      stamina: this.randomInRange(0.5, 2.0),
      
      bodyColor: this.randomColor(),
      accentColor: this.randomColor(),
      pattern: Math.floor(Math.random() * 4),
      
      headSize: this.randomInRange(0.5, 1.5),
      bodyLength: this.randomInRange(0.7, 1.5),
      limbLength: this.randomInRange(0.6, 1.4),
      
      aggression: Math.random(),
      curiosity: Math.random(),
      social: Math.random()
    };
  }
  
  /**
   * Breed two creatures to create offspring with inherited traits
   * 
   * @param parent1Traits - Genetic traits of first parent
   * @param parent2Traits - Genetic traits of second parent
   * @returns New genetic traits for offspring
   */
  static breedTraits(parent1Traits: GeneticTraits, parent2Traits: GeneticTraits): GeneticTraits {
    return {
      // Physical traits - average with small mutation
      size: this.inheritNumericTrait(parent1Traits.size, parent2Traits.size, 0.1),
      speed: this.inheritNumericTrait(parent1Traits.speed, parent2Traits.speed, 0.1),
      stamina: this.inheritNumericTrait(parent1Traits.stamina, parent2Traits.stamina, 0.1),
      
      // Visual traits - blend colors or choose one
      bodyColor: this.blendColors(parent1Traits.bodyColor, parent2Traits.bodyColor),
      accentColor: this.blendColors(parent1Traits.accentColor, parent2Traits.accentColor),
      pattern: Math.random() < 0.5 ? parent1Traits.pattern : parent2Traits.pattern,
      
      // Body proportions - average with mutation
      headSize: this.inheritNumericTrait(parent1Traits.headSize, parent2Traits.headSize, 0.1),
      bodyLength: this.inheritNumericTrait(parent1Traits.bodyLength, parent2Traits.bodyLength, 0.1),
      limbLength: this.inheritNumericTrait(parent1Traits.limbLength, parent2Traits.limbLength, 0.1),
      
      // Behavioral traits - average with small variation
      aggression: this.inheritNumericTrait(parent1Traits.aggression, parent2Traits.aggression, 0.15),
      curiosity: this.inheritNumericTrait(parent1Traits.curiosity, parent2Traits.curiosity, 0.15),
      social: this.inheritNumericTrait(parent1Traits.social, parent2Traits.social, 0.15)
    };
  }
  
  /**
   * Inherit a numeric trait from parents with mutation
   */
  private static inheritNumericTrait(value1: number, value2: number, mutationRate: number): number {
    const average = (value1 + value2) / 2;
    const mutation = (Math.random() - 0.5) * mutationRate * 2;
    return Math.max(0, average + mutation);
  }
  
  /**
   * Generate a random color in hex format
   */
  private static randomColor(): string {
    const hue = Math.random() * 360;
    const saturation = 50 + Math.random() * 50; // 50-100%
    const lightness = 40 + Math.random() * 40;  // 40-80%
    return this.hslToHex(hue, saturation, lightness);
  }
  
  /**
   * Blend two colors with possible mutation
   */
  private static blendColors(color1: string, color2: string): string {
    // 70% chance to blend, 30% chance to choose one parent's color
    if (Math.random() < 0.3) {
      return Math.random() < 0.5 ? color1 : color2;
    }
    
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    const blendedR = Math.floor((rgb1.r + rgb2.r) / 2);
    const blendedG = Math.floor((rgb1.g + rgb2.g) / 2);
    const blendedB = Math.floor((rgb1.b + rgb2.b) / 2);
    
    return this.rgbToHex(blendedR, blendedG, blendedB);
  }
  
  /**
   * Utility: Convert HSL to Hex
   */
  private static hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
  
  /**
   * Utility: Convert Hex to RGB
   */
  private static hexToRgb(hex: string): { r: number, g: number, b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 128, g: 128, b: 128 };
  }
  
  /**
   * Utility: Convert RGB to Hex
   */
  private static rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  
  /**
   * Utility: Random number in range
   */
  private static randomInRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }
  
  /**
   * Calculate fitness score for a creature (used in evolution simulation)
   */
  static calculateFitness(traits: GeneticTraits): number {
    // Simple fitness based on balanced stats
    const physicalBalance = 1 - Math.abs(traits.speed - traits.stamina) / 2;
    const proportionBalance = 1 - Math.abs(traits.headSize - traits.bodyLength) / 2;
    return (physicalBalance + proportionBalance) / 2;
  }
}
