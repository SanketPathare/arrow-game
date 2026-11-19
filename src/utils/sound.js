import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

class SoundManager {
  constructor() {
    this.soundEnabled = true;
    this.hapticsEnabled = true;
  }

  updateSettings({ soundEnabled, hapticsEnabled }) {
    if (typeof soundEnabled === 'boolean') this.soundEnabled = soundEnabled;
    if (typeof hapticsEnabled === 'boolean') this.hapticsEnabled = hapticsEnabled;
  }

  // --- Haptics Feedback ---
  hapticTap() {
    if (!this.hapticsEnabled) return;
    try {
      Haptics.selectionAsync();
    } catch (e) {
      // Gracefully ignore if platform doesn't support
    }
  }

  hapticEscape() {
    if (!this.hapticsEnabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Gracefully ignore
    }
  }

  hapticBlocked() {
    if (!this.hapticsEnabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (e) {
      // Gracefully ignore
    }
  }

  hapticVictory() {
    if (!this.hapticsEnabled) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      // Gracefully ignore
    }
  }

  // --- Audio Feedback (Web Audio synthesizer fallback on web, haptics on native) ---
  playWebTone(freq, type = 'sine', duration = 0.1) {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + duration);
        }
      } catch (e) {
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
