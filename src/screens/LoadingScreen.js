import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { GameBackground } from '../components/GameBackground.js';
import { ThreeDText } from '../components/ThreeDText.js';

export function LoadingScreen({ onFinish, theme }) {
  // 1 = Minimalist LayerNLooms Studio (white background)
  // 2 = 3D App Theme Loading (Arrow Escape, Starting, 3D Spinner, 3D Loading Bar)
  const [frame, setFrame] = useState(1);

  // Animations for Frame 1
  const frame1Opacity = useRef(new Animated.Value(0)).current;

  // Animations for Frame 2
  const frame2Opacity = useRef(new Animated.Value(0)).current;
  const spinnerRotate = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Frame 1: Clean White LayerNLooms Studio
  useEffect(() => {
    if (frame !== 1) return;

    Animated.timing(frame1Opacity, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(frame1Opacity, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setFrame(2);
      });
    }, 1800);

    return () => clearTimeout(timer);
  }, [frame, frame1Opacity]);

  // Frame 2: 3D App Theme Loading (5.0 Seconds)
  useEffect(() => {
    if (frame !== 2) return;

    // Fade in Frame 2
    Animated.timing(frame2Opacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();

    // Pulse loop for the Starting dot
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.8, duration: 600, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();

    // Smooth continuous spinner rotation
    const spinLoop = Animated.loop(
      Animated.timing(spinnerRotate, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();

    // 5-second loading progression matching app theme
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false, // For width interpolation
    }).start(({ finished }) => {
      if (finished) {
        Animated.timing(frame2Opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          spinLoop.stop();
          pulseLoop.stop();
          if (onFinish) onFinish();
        });
      }
    });

    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [frame, frame2Opacity, spinnerRotate, progressAnim, pulseAnim, onFinish]);

  const spin = spinnerRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // ----------------------------------------------------
  // Frame 1: Clean, White Background with LayerNLooms Studio
  // ----------------------------------------------------
  if (frame === 1) {
    return (
      <View style={styles.whiteContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Animated.View style={{ opacity: frame1Opacity }}>
          <Text style={styles.studioText}>LayerNLooms Studio</Text>
        </Animated.View>
      </View>
    );
  }

  // ----------------------------------------------------
  // Frame 2: 3D App Theme Loading (Matched to Arrow Game Theme)
  // ----------------------------------------------------
  return (
    <GameBackground type="home" theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <Animated.View
        style={[
          styles.themeContainer,
          {
            opacity: frame2Opacity,
          },
        ]}
      >
        <View style={styles.contentStack}>
          {/* 3D Extruded Game Title */}
          <View style={styles.titleWrapper}>
            <ThreeDText
              text="Arrow Escape"
              size={34}
              color="#FFE8A3"
              depthColor="#C77700"
              depth={5}
              strokeColor="#6E3D00"
            />
          </View>

          {/* 3D Tactile 'Starting' Indicator Pill */}
          <View style={styles.startingPillWrapper}>
            <View style={styles.startingPillShadow} />
            <LinearGradient
              colors={['#1E293B', '#111B2E', '#0B1222']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.startingPillFace}
            >
              <View style={styles.pillTopSheen} />
              <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseAnim }] }]} />
              <Text style={styles.startingText}>Starting</Text>
            </LinearGradient>
          </View>

          {/* 3D Glowing Circular Spinner */}
          <View style={styles.spinnerContainer}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Svg width={46} height={46} viewBox="0 0 46 46">
                <Defs>
                  <SvgLinearGradient id="spinnerGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor="#00F2FE" />
                    <Stop offset="50%" stopColor="#38BDF8" />
                    <Stop offset="100%" stopColor="#0284C7" />
                  </SvgLinearGradient>
                </Defs>

                {/* Recessed socket well ring */}
                <Circle
                  cx="23"
                  cy="23"
                  r="18"
                  stroke="#080E1C"
                  strokeWidth="4"
                  fill="none"
                />
                <Circle
                  cx="23"
                  cy="23"
                  r="18"
                  stroke="rgba(56, 189, 248, 0.14)"
                  strokeWidth="3.5"
                  fill="none"
                />

                {/* Glowing cyan active rotation arc */}
                <Circle
                  cx="23"
                  cy="23"
                  r="18"
                  stroke="url(#spinnerGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="34 80"
                  fill="none"
                />
              </Svg>
            </Animated.View>

            {/* Tactile Loading Text */}
            <Text style={styles.loadingText}>Loading</Text>
          </View>

          {/* 3D Chunky Beveled Loading Progress Bar */}
          <View style={styles.progressBox}>
            {/* 3D Underlay Bevel */}
            <View style={styles.progressBevel} />

            {/* Recessed Socket Well */}
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={['#38D9F8', '#00F2FE', '#0284C7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                {/* Top Gloss Sheen */}
                <View style={styles.progressTopSheen} />
                {/* Leading Edge Spark */}
                <View style={styles.leadingSpark} />
              </Animated.View>
            </View>
          </View>
        </View>
      </Animated.View>
    </GameBackground>
  );
}

const styles = StyleSheet.create({
  // Frame 1: White Minimalist Studio Screen
  whiteContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  studioText: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: 3,
    textAlign: 'center',
  },

  // Frame 2: 3D App Theme Match
  themeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentStack: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  titleWrapper: {
    marginBottom: 16,
    alignItems: 'center',
  },

  // 3D Starting Pill
  startingPillWrapper: {
    position: 'relative',
    marginBottom: 44,
  },
  startingPillShadow: {
    position: 'absolute',
    top: 3,
    left: 0,
    right: 0,
    bottom: -3,
    borderRadius: 20,
    backgroundColor: '#020617',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  startingPillFace: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    overflow: 'hidden',
    position: 'relative',
  },
  pillTopSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#00F2FE',
    marginRight: 8,
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 3,
  },
  startingText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  // 3D Spinner & Loading text
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 16,
    textTransform: 'uppercase',
  },

  // 3D Chunky Loading Progress Bar
  progressBox: {
    position: 'relative',
    height: 14,
    width: '100%',
    maxWidth: 260,
  },
  progressBevel: {
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
    bottom: -2,
    borderRadius: 8,
    backgroundColor: '#020617',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  progressTrack: {
    width: '100%',
    height: '100%',
    backgroundColor: '#090F1C',
    borderRadius: 7,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    justifyContent: 'center',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    position: 'relative',
  },
  progressTopSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  leadingSpark: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
});
