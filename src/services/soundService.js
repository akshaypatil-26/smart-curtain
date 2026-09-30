/**
 * Lightweight Web Audio API Synthesizer for tactile IoT feedback
 * Works without any external mp3 files.
 */
class SoundService {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  playBeep(freq = 600, type = 'sine', duration = 0.08) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked before user gesture
    }
  }

  playOpen() {
    this.playBeep(523.25, 'sine', 0.1); // C5
    setTimeout(() => this.playBeep(659.25, 'sine', 0.12), 100); // E5
  }

  playClose() {
    this.playBeep(659.25, 'sine', 0.1); // E5
    setTimeout(() => this.playBeep(523.25, 'sine', 0.12), 100); // C5
  }

  playStop() {
    this.playBeep(330, 'square', 0.09);
  }

  playConnected() {
    this.playBeep(440, 'triangle', 0.08);
    setTimeout(() => this.playBeep(587.33, 'triangle', 0.08), 80);
    setTimeout(() => this.playBeep(880, 'triangle', 0.14), 160);
  }

  playDisconnected() {
    this.playBeep(600, 'triangle', 0.08);
    setTimeout(() => this.playBeep(400, 'triangle', 0.15), 100);
  }
}

export const soundService = new SoundService();
export default soundService;
