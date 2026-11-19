import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameLogo } from '../components/GameLogo.js';

const LOADING_STEPS = [
  { progress: 25, text: 'Initializing puzzle matrix...' },
  { progress: 55, text: 'Calibrating 50 escape levels...' },
  { progress: 85, text: 'Restoring player achievements...' },
  { progress: 100, text: 'Escape routes ready!' },
];

export function LoadingScreen({ onLoaded, theme }) {
  const { width } = useWindowDimensions();
  const [statusText, setStatusText] = useState('Initializing puzzle matrix...');
  const [percent, setPercent] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const barWidth = Math.min(width - 64, 280);

  useEffect(() => {
    // Listen to progress updates to update numeric percentage
    const id = progressAnim.addListener(({ value }) => {
      setPercent(Math.floor(value * 100));
    });

    // Animate progress through stages
    Animated.sequence([
      Animated.timing(progressAnim, {
        toValue: 0.35,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(progressAnim, {
        toValue: 0.75,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(progressAnim, {
        toValue: 1.0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Short delay at 100% then fade out to home screen
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }).start(() => {
          if (onLoaded) onLoaded();
        });
      }, 300);
    });

    // Step text updates
    const t1 = setTimeout(() => setStatusText(LOADING_STEPS[1].text), 400);
    const t2 = setTimeout(() => setStatusText(LOADING_STEPS[2].text), 900);
    const t3 = setTimeout(() => setStatusText(LOADING_STEPS[3].text), 1300);

    return () => {
      progressAnim.removeListener(id);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [progressAnim, fadeAnim, onLoaded]);

  const fillWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, barWidth],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme ? theme.background : '#090D16',
          opacity: fadeAnim,
        },
      ]}
    >
      {/* Background ambient lighting */}
      <View style={styles.ambientTopGlow} />

      {/* Main Logo & Title */}
      <View style={styles.logoSection}>
        <GameLogo size="lg" showSubtitle={true} animated={true} theme={theme} />
      </View>

      {/* Loading Progress Section */}
      <View style={styles.loadingSection}>
        <View style={[styles.progressTrack, { width: barWidth }]}>
          <Animated.View style={[styles.progressFill, { width: fillWidth }]}>
            <LinearGradient
              colors={['#38BDF8', '#2563EB', '#818CF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>

        <View style={[styles.statusRow, { width: barWidth }]}>
          <Text style={[styles.statusText, { color: theme ? theme.textMuted : '#94A3B8' }]}>
            {statusText}
          </Text>
          <Text style={[styles.percentText, { color: '#38BDF8' }]}>
            {percent}%
          </Text>
        </View>
      </View>

      {/* Footer credits */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme ? theme.textDim : '#475569' }]}>
          PURE NATIVE PUZZLE ENGINE • EXPO SDK 58
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  ambientTopGlow: {
    position: 'absolute',
    top: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
