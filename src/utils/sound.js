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
  playWebTone(freq, type = 'sine', duration = 0.1) {
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
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
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

  playEscapeSound() {
    if (this.soundEnabled) {
      this.playWebTone(600, 'sine', 0.15);
    }
    this.hapticEscape();
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
