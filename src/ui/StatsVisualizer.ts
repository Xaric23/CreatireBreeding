/**
 * Stats Visualizer
 * 
 * Creates charts and graphs for creature statistics.
 */

import { Creature } from '../creatures/Creature';

export class StatsVisualizer {
  /**
   * Create a bar chart for trait distribution
   */
  static createTraitChart(creatures: Creature[], trait: keyof typeof creatures[0]['traits']): string {
    if (creatures.length === 0) return '';
    
    const values = creatures.map(c => {
      const value = c.traits[trait];
      return typeof value === 'number' ? value : 0;
    });
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    
    // Create simple text-based chart
    const bars: string[] = [];
    const buckets = 5;
    const bucketSize = (max - min) / buckets || 1;
    const counts = new Array(buckets).fill(0);
    
    values.forEach(value => {
      const bucket = Math.min(Math.floor((value - min) / bucketSize), buckets - 1);
      counts[bucket]++;
    });
    
    const maxCount = Math.max(...counts);
    
    for (let i = 0; i < buckets; i++) {
      const rangeStart = (min + i * bucketSize).toFixed(2);
      const rangeEnd = (min + (i + 1) * bucketSize).toFixed(2);
      const barLength = Math.round((counts[i] / maxCount) * 20);
      const bar = '█'.repeat(barLength);
      bars.push(`${rangeStart}-${rangeEnd}: ${bar} (${counts[i]})`);
    }
    
    return `
      <div class="chart">
        <strong>${trait.toUpperCase()}</strong>
        <div>Min: ${min.toFixed(2)} | Max: ${max.toFixed(2)} | Avg: ${avg.toFixed(2)}</div>
        <pre>${bars.join('\n')}</pre>
      </div>
    `;
  }
  
  /**
   * Create generation distribution chart
   */
  static createGenerationChart(creatures: Creature[]): string {
    if (creatures.length === 0) return '';
    
    const generations = new Map<number, number>();
    creatures.forEach(c => {
      generations.set(c.generation, (generations.get(c.generation) || 0) + 1);
    });
    
    const maxGen = Math.max(...Array.from(generations.keys()));
    const maxCount = Math.max(...Array.from(generations.values()));
    
    const bars: string[] = [];
    for (let gen = 1; gen <= maxGen; gen++) {
      const count = generations.get(gen) || 0;
      const barLength = Math.round((count / maxCount) * 20);
      const bar = '█'.repeat(barLength);
      bars.push(`Gen ${gen}: ${bar} (${count})`);
    }
    
    return `
      <div class="chart">
        <strong>GENERATION DISTRIBUTION</strong>
        <pre>${bars.join('\n')}</pre>
      </div>
    `;
  }
  
  /**
   * Create population timeline (last 10 snapshots)
   */
  static createPopulationTimeline(history: number[]): string {
    if (history.length === 0) return '';
    
    const max = Math.max(...history);
    const bars: string[] = [];
    
    history.forEach((count, index) => {
      const barLength = Math.round((count / max) * 20);
      const bar = '█'.repeat(barLength);
      bars.push(`T${index + 1}: ${bar} (${count})`);
    });
    
    return `
      <div class="chart">
        <strong>POPULATION TIMELINE</strong>
        <pre>${bars.join('\n')}</pre>
      </div>
    `;
  }
  
  /**
   * Get comprehensive stats summary
   */
  static getStatsSummary(creatures: Creature[]): string {
    if (creatures.length === 0) return '<p>No creatures yet</p>';
    
    const avgSize = creatures.reduce((a, c) => a + c.traits.size, 0) / creatures.length;
    const avgSpeed = creatures.reduce((a, c) => a + c.traits.speed, 0) / creatures.length;
    const avgStamina = creatures.reduce((a, c) => a + c.traits.stamina, 0) / creatures.length;
    const maxGen = Math.max(...creatures.map(c => c.generation));
    const avgEnergy = creatures.reduce((a, c) => a + c.energy, 0) / creatures.length;
    
    return `
      <div class="stats-summary">
        <h4>Population Statistics</h4>
        <div class="stat">Total: ${creatures.length}</div>
        <div class="stat">Max Generation: ${maxGen}</div>
        <div class="stat">Avg Size: ${avgSize.toFixed(2)}</div>
        <div class="stat">Avg Speed: ${avgSpeed.toFixed(2)}</div>
        <div class="stat">Avg Stamina: ${avgStamina.toFixed(2)}</div>
        <div class="stat">Avg Energy: ${avgEnergy.toFixed(1)}%</div>
      </div>
    `;
  }
}
