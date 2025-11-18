/**
 * Audio Manager
 * 
 * Manages sound effects and background music.
 */

export interface AudioConfig {
  enabled: boolean;
  volume: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

export class AudioManager {
  private config: AudioConfig = {
    enabled: true,
    volume: 0.5,
    musicEnabled: true,
    sfxEnabled: true
  };
  
  private audioContext: AudioContext | null = null;
  private currentMusicSource: AudioBufferSourceNode | null = null;
  private musicGainNode: GainNode | null = null;
  
  constructor() {
    this.loadConfig();
  }
  
  /**
   * Initialize audio context (must be called after user interaction)
   */
  initialize(): void {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.musicGainNode = this.audioContext.createGain();
      this.musicGainNode.connect(this.audioContext.destination);
      this.musicGainNode.gain.value = this.config.volume;
    }
  }
  
  /**
   * Play a simple tone as a sound effect
   */
  playSoundEffect(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.config.enabled || !this.config.sfxEnabled || !this.audioContext) {
      return;
    }
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      
      gainNode.gain.value = this.config.volume * 0.3;
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + duration
      );
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.error('Error playing sound effect:', error);
    }
  }
  
  /**
   * Play creation sound
   */
  playCreationSound(): void {
    this.playSoundEffect(440, 0.2, 'sine');
    setTimeout(() => this.playSoundEffect(554, 0.2, 'sine'), 100);
  }
  
  /**
   * Play breeding sound
   */
  playBreedingSound(): void {
    this.playSoundEffect(330, 0.15, 'triangle');
    setTimeout(() => this.playSoundEffect(440, 0.15, 'triangle'), 100);
    setTimeout(() => this.playSoundEffect(550, 0.2, 'triangle'), 200);
  }
  
  /**
   * Play achievement sound
   */
  playAchievementSound(): void {
    this.playSoundEffect(523, 0.15, 'square');
    setTimeout(() => this.playSoundEffect(659, 0.15, 'square'), 150);
    setTimeout(() => this.playSoundEffect(784, 0.3, 'square'), 300);
  }
  
  /**
   * Play error sound
   */
  playErrorSound(): void {
    this.playSoundEffect(200, 0.3, 'sawtooth');
  }
  
  /**
   * Play simple background music loop
   */
  playBackgroundMusic(): void {
    if (!this.config.enabled || !this.config.musicEnabled || !this.audioContext || !this.musicGainNode) {
      return;
    }
    
    // Stop existing music
    this.stopBackgroundMusic();
    
    try {
      // Create a simple ambient melody
      const notes = [
        { freq: 220, duration: 2 },
        { freq: 247, duration: 2 },
        { freq: 277, duration: 2 },
        { freq: 247, duration: 2 }
      ];
      
      let startTime = this.audioContext.currentTime;
      
      notes.forEach(note => {
        const oscillator = this.audioContext!.createOscillator();
        const noteGain = this.audioContext!.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = note.freq;
        
        noteGain.gain.value = 0;
        noteGain.gain.linearRampToValueAtTime(0.05, startTime + 0.1);
        noteGain.gain.linearRampToValueAtTime(0, startTime + note.duration - 0.1);
        
        oscillator.connect(noteGain);
        noteGain.connect(this.musicGainNode!);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + note.duration);
        
        startTime += note.duration;
      });
      
      // Loop music
      const totalDuration = notes.reduce((sum, note) => sum + note.duration, 0);
      setTimeout(() => {
        if (this.config.musicEnabled) {
          this.playBackgroundMusic();
        }
      }, totalDuration * 1000);
      
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  }
  
  /**
   * Stop background music
   */
  stopBackgroundMusic(): void {
    if (this.currentMusicSource) {
      try {
        this.currentMusicSource.stop();
      } catch (e) {
        // Already stopped
      }
      this.currentMusicSource = null;
    }
  }
  
  /**
   * Set volume
   */
  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.config.volume;
    }
    this.saveConfig();
  }
  
  /**
   * Toggle audio
   */
  toggleAudio(): void {
    this.config.enabled = !this.config.enabled;
    if (!this.config.enabled) {
      this.stopBackgroundMusic();
    } else if (this.config.musicEnabled) {
      this.playBackgroundMusic();
    }
    this.saveConfig();
  }
  
  /**
   * Toggle music
   */
  toggleMusic(): void {
    this.config.musicEnabled = !this.config.musicEnabled;
    if (this.config.musicEnabled && this.config.enabled) {
      this.playBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
    this.saveConfig();
  }
  
  /**
   * Toggle sound effects
   */
  toggleSfx(): void {
    this.config.sfxEnabled = !this.config.sfxEnabled;
    this.saveConfig();
  }
  
  /**
   * Get configuration
   */
  getConfig(): AudioConfig {
    return { ...this.config };
  }
  
  /**
   * Save configuration
   */
  private saveConfig(): void {
    localStorage.setItem('audioConfig', JSON.stringify(this.config));
  }
  
  /**
   * Load configuration
   */
  private loadConfig(): void {
    const saved = localStorage.getItem('audioConfig');
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Failed to load audio config:', error);
      }
    }
  }
}
