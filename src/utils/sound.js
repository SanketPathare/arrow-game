import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

class SoundManager {
  constructor() {
    this.soundEnabled = true;
    this.hapticsEnabled = true;
    this.audioContext = null;
  }

  updateSettings({ soundEnabled, hapticsEnabled }) {
    if (typeof soundEnabled === 'boolean') this.soundEnabled = soundEnabled;
    if (typeof hapticsEnabled === 'boolean') this.hapticsEnabled = hapticsEnabled;
  }

  runHaptic(action) {
    if (!this.hapticsEnabled) return;
    try {
      action().catch(() => {});
    } catch {
      // Some platforms may not expose haptics.
    }
  }

  // --- Haptics Feedback ---
  hapticTap() {
    this.runHaptic(() => Haptics.selectionAsync());
  }

  hapticEscape() {
    this.runHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
  }

  hapticBlocked() {
    this.runHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
  }

  hapticVictory() {
    this.runHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  }

  // --- Audio Feedback (Web Audio synthesizer fallback on web, haptics on native) ---
  playWebTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!this.audioContext) this.audioContext = new AudioContext();

        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Safe fail
      }
    }
  }

  /**
   * Harmonically tuned escape chimes based on active combo streak.
   * Plays a joyful pentatonic climbing melody: C5 -> D5 -> E5 -> G5 -> A5 -> C6!
   */
  playEscapeSound(combo = 1) {
    if (this.soundEnabled) {
      const pentatonicScale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
      const noteIdx = Math.min(pentatonicScale.length - 1, Math.max(0, (combo || 1) - 1));
      const freq = pentatonicScale[noteIdx];
      this.playWebTone(freq, 'sine', 0.18, 0.16);

      // Add a shimmering harmonic overtone on high combos
      if (combo >= 3) {
        setTimeout(() => {
          this.playWebTone(freq * 1.5, 'sine', 0.12, 0.08);
        }, 40);
      }
    }
    this.hapticEscape();
  }

  playRotateSound() {
    if (this.soundEnabled) {
      this.playWebTone(740, 'triangle', 0.12, 0.12);
    }
    this.hapticTap();
  }

  playComboSound(combo = 2) {
    if (this.soundEnabled) {
      this.playWebTone(880 + combo * 80, 'sine', 0.22, 0.2);
    }
    this.hapticTap();
  }

  playBlockedSound() {
    if (this.soundEnabled) {
      this.playWebTone(220, 'triangle', 0.2);
    }
    this.hapticBlocked();
  }

  playVictorySound() {
    if (this.soundEnabled) {
      this.playWebTone(880, 'sine', 0.3);
    }
    this.hapticVictory();
  }

  playClickSound() {
    if (this.soundEnabled) {
      this.playWebTone(440, 'sine', 0.08);
    }
    this.hapticTap();
  }
}

export const soundManager = new SoundManager();
