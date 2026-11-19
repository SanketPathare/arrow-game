import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameBackground } from '../components/GameBackground.js';
import { ThreeDEmblem } from '../components/ThreeDEmblem.js';

const LOADING_STEPS = [
  { progress: 25, text: 'Initializing 3D puzzle engine...' },
  { progress: 55, text: 'Calibrating 50 escape stages...' },
  { progress: 85, text: 'Restoring player progress...' },
  { progress: 100, text: 'Escape routes ready!' },
];

export function LoadingScreen({ onLoaded }) {
  const { width } = useWindowDimensions();
  const [statusText, setStatusText] = useState('Initializing 3D puzzle engine...');
  const [percent, setPercent] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const barWidth = Math.min(width - 64, 300);

  useEffect(() => {
    // Listen to progress updates to update numeric percentage
    const id = progressAnim.addListener(({ value }) => {
      setPercent(Math.floor(value * 100));
    });

    // Animate progress through stages
    Animated.sequence([
      Animated.timing(progressAnim, {
        toValue: 0.35,
        duration: 380,
        useNativeDriver: false,
      }),
      Animated.timing(progressAnim, {
        toValue: 0.75,
        duration: 480,
        useNativeDriver: false,
      }),
      Animated.timing(progressAnim, {
        toValue: 1.0,
        duration: 380,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Short delay at 100% then fade out to home screen
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }).start(() => {
          if (onLoaded) onLoaded();
        });
      }, 250);
    });

    // Step text updates
    const t1 = setTimeout(() => setStatusText(LOADING_STEPS[1].text), 380);
    const t2 = setTimeout(() => setStatusText(LOADING_STEPS[2].text), 860);
    const t3 = setTimeout(() => setStatusText(LOADING_STEPS[3].text), 1240);

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
    <Animated.View style={[styles.outerFade, { opacity: fadeAnim }]}>
      <GameBackground type="home">
        <View style={styles.container}>
          {/* Main 3D Emblem & Title */}
          <View style={styles.logoSection}>
            <ThreeDEmblem size={130} showTitle={true} />
          </View>

          {/* Loading Progress Section */}
          <View style={styles.loadingSection}>
            <View style={[styles.progressTrack, { width: barWidth }]}>
              <Animated.View style={[styles.progressFill, { width: fillWidth }]}>
                <LinearGradient
                  colors={['#00F2FE', '#2563EB', '#818CF8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>

            <View style={[styles.statusRow, { width: barWidth }]}>
              <Text style={styles.statusText}>{statusText}</Text>
              <Text style={styles.percentText}>{percent}%</Text>
            </View>
          </View>

          {/* Footer credits */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              TACTICAL 3D PUZZLE • EXPO GO READY
            </Text>
          </View>
        </View>
      </GameBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerFade: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(22, 38, 66, 0.9)',
    borderWidth: 1.5,
    borderColor: '#4A6FA5',
    overflow: 'hidden',
    position: 'relative',
    padding: 1.5,
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
    fontWeight: '800',
    color: '#D4E6FA',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  percentText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#00F2FE',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8CAECF',
    letterSpacing: 1.5,
  },
});
