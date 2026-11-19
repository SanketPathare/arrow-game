import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen.js';
import { GameScreen } from './src/screens/GameScreen.js';
import { LevelSelectScreen } from './src/screens/LevelSelectScreen.js';
import { SettingsScreen } from './src/screens/SettingsScreen.js';
import { LoadingScreen } from './src/screens/LoadingScreen.js';
import { useGame } from './src/hooks/useGame.js';
import { StorageService, DEFAULT_SETTINGS } from './src/utils/storage.js';
import { THEMES } from './src/utils/constants.js';
import { soundManager } from './src/utils/sound.js';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'game' | 'levelSelect' | 'settings'
  const [dataLoaded, setDataLoaded] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);

  // Persistent user state
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [levelStats, setLevelStats] = useState({});
  const [dailyStats, setDailyStats] = useState({});
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Main game hook
  const game = useGame();

  // Active theme based on settings
  const theme = settings.darkMode ? THEMES.dark : THEMES.light;

  // Sync sound manager with settings
  useEffect(() => {
    soundManager.updateSettings({
      soundEnabled: settings.soundEnabled,
      hapticsEnabled: settings.hapticsEnabled,
    });
  }, [settings.soundEnabled, settings.hapticsEnabled]);

  // Load saved data on startup
  useEffect(() => {
    async function loadData() {
      try {
        const [savedUnlocked, savedStats, savedDaily, savedSettings] = await Promise.all([
          StorageService.getUnlockedLevel(),
          StorageService.getLevelStats(),
          StorageService.getDailyStats(),
          StorageService.getSettings(),
        ]);

        setUnlockedLevel(savedUnlocked);
        setLevelStats(savedStats);
        setDailyStats(savedDaily);
        setSettings(savedSettings);
      } catch (e) {
        console.warn('Initialization error:', e);
      } finally {
        setDataLoaded(true);
      }
    }
    loadData();
  }, []);

  // Refresh saved stats when game is completed
  useEffect(() => {
    if (game.isCompleted) {
      // Reload stats in background
      Promise.all([
        StorageService.getUnlockedLevel(),
        StorageService.getLevelStats(),
        StorageService.getDailyStats(),
      ]).then(([ul, ls, ds]) => {
        setUnlockedLevel(ul);
        setLevelStats(ls);
        setDailyStats(ds);
      });
    }
  }, [game.isCompleted]);

  // Navigation handlers
  const handlePlayLevel = useCallback(
    (lvl) => {
      game.loadLevel(lvl, false);
      setCurrentScreen('game');
    },
    [game]
  );

  const handlePlayDaily = useCallback(() => {
    game.loadLevel(null, true);
    setCurrentScreen('game');
  }, [game]);

  const handleUpdateSettings = useCallback(async (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      StorageService.saveSettings(updated);
      return updated;
    });
  }, []);

  const handleResetProgress = useCallback(async () => {
    await StorageService.resetAllProgress();
    setUnlockedLevel(1);
    setLevelStats({});
    setDailyStats({});
  }, []);

  // Hardware Back Button handling for top-level navigation
  useEffect(() => {
    const onBackPress = () => {
      if (currentScreen === 'levelSelect' || currentScreen === 'settings') {
        setCurrentScreen('home');
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [currentScreen]);

  const isReady = dataLoaded && splashFinished;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#060814' }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <SafeAreaView style={styles.safeArea}>

        {!isReady ? (
          <LoadingScreen
            onLoaded={() => setSplashFinished(true)}
            theme={theme}
          />
        ) : (
          <>
            {currentScreen === 'home' && (
              <HomeScreen
                unlockedLevel={unlockedLevel}
                levelStats={levelStats}
                dailyStats={dailyStats}
                onPlay={handlePlayLevel}
                onOpenLevelSelect={() => setCurrentScreen('levelSelect')}
                onOpenDaily={handlePlayDaily}
                onOpenSettings={() => setCurrentScreen('settings')}
                theme={theme}
              />
            )}

            {currentScreen === 'game' && (
              <GameScreen
                game={game}
                soundEnabled={settings.soundEnabled}
                hapticsEnabled={settings.hapticsEnabled}
                onToggleSound={(val) => handleUpdateSettings({ soundEnabled: val })}
                onToggleHaptics={(val) => handleUpdateSettings({ hapticsEnabled: val })}
                onNavigateHome={() => setCurrentScreen('home')}
                onNavigateLevelSelect={() => setCurrentScreen('levelSelect')}
                theme={theme}
              />
            )}

            {currentScreen === 'levelSelect' && (
              <LevelSelectScreen
                unlockedLevel={unlockedLevel}
                levelStats={levelStats}
                onSelectLevel={handlePlayLevel}
                onBack={() => setCurrentScreen('home')}
                theme={theme}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsScreen
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetProgress={handleResetProgress}
                onBack={() => setCurrentScreen('home')}
                theme={theme}
              />
            )}
          </>
        )}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
