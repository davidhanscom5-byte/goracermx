// Web Audio API sound synthesizer for Motocross Track Signals

class TrackAudioController {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Lazy initialize to comply with browser autoplay policies
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Green flag track hot horn (two short high bursts)
   */
  public playGreenFlag() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [0, 0.15, 0.3].forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(idx === 2 ? 880 : 587.33, now + delay); // D5 then A5
      gain.gain.setValueAtTime(0.2, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.12);
    });
  }

  /**
   * Caution / Yellow Flag beep
   */
  public playYellowFlag() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [0, 0.2].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, now + delay); // E5
      gain.gain.setValueAtTime(0.25, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.15);
    });
  }

  /**
   * Red Flag Track Stop Horn (loud low klaxon)
   */
  public playRedFlag() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [0, 0.25, 0.5].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(329.63, now + delay); // E4
      gain.gain.setValueAtTime(0.3, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.2);
    });
  }

  /**
   * Checkered Flag Finish Horn (Heat Finished)
   */
  public playCheckeredFlag() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Ascending arpeggio fanfare
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.18, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.25);
    });
  }

  /**
   * 1-Minute Warning Chime (White Flag)
   */
  public playOneMinuteWarning() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  /**
   * Staging alert chime (call to gate)
   */
  public playStagingCall() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.frequency.setValueAtTime(440, now);
    osc2.frequency.setValueAtTime(554.37, now); // A4 + C#5 chord
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  /**
   * 10-Minute Pre-Staging Machine Pickup Alert (Pit Crew Dispatch Chime)
   */
  public playMachinePickupAlert() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Crisp three-tone ascending chime (523Hz C5 -> 659Hz E5 -> 783Hz G5 -> 1046Hz C6)
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.18, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.35);
    });
  }
}

export const trackAudio = new TrackAudioController();
