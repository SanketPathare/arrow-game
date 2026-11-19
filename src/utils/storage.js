import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants.js';

export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  hapticsEnabled: true,
  darkMode: true,
};

export const StorageService = {
  async getUnlockedLevel() {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVEL);
      if (val !== null) {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? 1 : Math.max(1, parsed);
      }
      return 1;
    } catch (e) {
      console.warn('Failed to load unlocked level from storage:', e);
      return 1;
    }
  },

  async setUnlockedLevel(level) {
    try {
      const current = await this.getUnlockedLevel();
      if (level > current) {
        await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVEL, level.toString());
      }
    } catch (e) {
      console.warn('Failed to save unlocked level:', e);
    }
  },

  async getLevelStats() {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEYS.LEVEL_STATS);
      if (val) {
        return JSON.parse(val);
      }
      return {};
    } catch (e) {
      console.warn('Failed to load level stats:', e);
      return {};
    }
  },

  async saveLevelResult(levelId, stars, moves, time) {
    try {
      const currentStats = await this.getLevelStats();
      const existing = currentStats[levelId] || { stars: 0, moves: Infinity, time: Infinity };

      currentStats[levelId] = {
        completed: true,
        stars: Math.max(existing.stars || 0, stars),
        moves: Math.min(existing.moves || Infinity, moves),
        time: Math.min(existing.time || Infinity, time),
        lastPlayed: Date.now(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.LEVEL_STATS, JSON.stringify(currentStats));
      
      // Automatically unlock the next level
      const nextLevel = levelId + 1;
      await this.setUnlockedLevel(nextLevel);

      return currentStats;
    } catch (e) {
      console.warn('Failed to save level result:', e);
      return {};
    }
  },

  async getSettings() {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (val) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(val) };
      }
      return DEFAULT_SETTINGS;
    } catch (e) {
      console.warn('Failed to get settings:', e);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  },

  async getDailyStats() {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_STATS);
      if (val) {
        return JSON.parse(val);
      }
      return { streak: 0, lastPlayedDate: null, totalCompleted: 0 };
    } catch (e) {
      return { streak: 0, lastPlayedDate: null, totalCompleted: 0 };
    }
  },

  async recordDailyCompletion(dateString) {
    try {
      const stats = await this.getDailyStats();
      if (stats.lastPlayedDate === dateString) {
        return stats; // Already completed today
      }

      // Check if yesterday was completed
      const today = new Date(dateString);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = 1;
      if (stats.lastPlayedDate === yesterdayStr) {
        newStreak = (stats.streak || 0) + 1;
      }

      const updated = {
        streak: newStreak,
        lastPlayedDate: dateString,
        totalCompleted: (stats.totalCompleted || 0) + 1,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Failed to record daily completion:', e);
      return { streak: 1, lastPlayedDate: dateString, totalCompleted: 1 };
    }
  },

  async resetAllProgress() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.UNLOCKED_LEVEL,
        STORAGE_KEYS.LEVEL_STATS,
        STORAGE_KEYS.DAILY_STATS,
      ]);
      return true;
    } catch (e) {
      console.warn('Failed to reset progress:', e);
      return false;
    }
  },
};
