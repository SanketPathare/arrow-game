import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThreeDText } from './ThreeDText.js';

export function ThreeDEmblem({ size = 110, showTitle = true }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const arrowSpread = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle floating bob
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Glowing core pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    );

    // Subtle arrow outward breathing
    const spreadLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowSpread, {
          toValue: 3,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(arrowSpread, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();
    pulseLoop.start();
    spreadLoop.start();

    return () => {
      floatLoop.stop();
      pulseLoop.stop();
      spreadLoop.stop();
    };
  }, [floatAnim, pulseAnim, arrowSpread]);

  const cornerOffset = Math.round(size * 0.16);
  const arrowIconSize = Math.round(size * 0.28);
  const centerOrbSize = Math.round(size * 0.2);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ translateY: floatAnim }],
        },
      ]}
    >
      {/* 3D Shield Frame */}
      <View style={[styles.emblemShadow, { width: size, height: size, borderRadius: size * 0.32 }]}>
        {/* Outer Bronze/Wooden Bevel Rim */}
        <LinearGradient
          colors={['#5A4E46', '#2D2520', '#1A1512']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.outerRim, { width: size, height: size, borderRadius: size * 0.32 }]}
        >
          {/* Inner Dark Glossy Obsidian Core */}
          <LinearGradient
            colors={['#2A3548', '#161E2E', '#0D131F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.innerCore, { borderRadius: size * 0.28 }]}
          >
            {/* Top Gloss Sheen */}
            <View style={[styles.topSheen, { borderRadius: size * 0.28 }]} />

            {/* Glowing Center White Sphere */}
            <Animated.View
              style={[
                styles.centerOrb,
                {
                  width: centerOrbSize,
                  height: centerOrbSize,
                  borderRadius: centerOrbSize / 2,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <View style={styles.orbHighlight} />
            </Animated.View>

            {/* 4 Diagonal Glowing Arrows (Matching Reference Image 1) */}
            {/* Top-Left Arrow (Up-Left) */}
            <Animated.View
              style={[
                styles.arrowAbsolute,
                {
                  top: cornerOffset,
                  left: cornerOffset,
                  transform: [
                    { rotate: '-45deg' },
                    { translateX: Animated.multiply(arrowSpread, -1) },
                    { translateY: Animated.multiply(arrowSpread, -1) },
                  ],
                },
              ]}
            >
              <Ionicons name="arrow-up" size={arrowIconSize} color="#38D9F8" style={styles.arrowGlow} />
            </Animated.View>

            {/* Top-Right Arrow (Up-Right) */}
            <Animated.View
              style={[
                styles.arrowAbsolute,
                {
                  top: cornerOffset,
                  right: cornerOffset,
                  transform: [
                    { rotate: '45deg' },
                    { translateX: arrowSpread },
                    { translateY: Animated.multiply(arrowSpread, -1) },
                  ],
                },
              ]}
            >
              <Ionicons name="arrow-up" size={arrowIconSize} color="#38D9F8" style={styles.arrowGlow} />
            </Animated.View>

            {/* Bottom-Left Arrow (Down-Left) */}
            <Animated.View
              style={[
                styles.arrowAbsolute,
                {
                  bottom: cornerOffset,
                  left: cornerOffset,
                  transform: [
                    { rotate: '-135deg' },
                    { translateX: Animated.multiply(arrowSpread, -1) },
                    { translateY: arrowSpread },
                  ],
                },
              ]}
            >
              <Ionicons name="arrow-up" size={arrowIconSize} color="#818CF8" style={styles.arrowGlowPurple} />
            </Animated.View>

            {/* Bottom-Right Arrow (Down-Right) */}
            <Animated.View
              style={[
                styles.arrowAbsolute,
                {
                  bottom: cornerOffset,
                  right: cornerOffset,
                  transform: [
                    { rotate: '135deg' },
                    { translateX: arrowSpread },
                    { translateY: arrowSpread },
                  ],
                },
              ]}
            >
              <Ionicons name="arrow-up" size={arrowIconSize} color="#818CF8" style={styles.arrowGlowPurple} />
            </Animated.View>
          </LinearGradient>
        </LinearGradient>
      </View>

      {/* Main 3D Title: ARROW ESCAPE (Matching Reference Image 1) */}
      {showTitle && (
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <ThreeDText
              text="ARROW"
              size={34}
              color="#FFFFFF"
              depthColor="#0288D1"
              depth={4}
              strokeColor="#013A63"
              style={{ marginRight: 8 }}
            />
            <ThreeDText
              text="ESCAPE"
              size={34}
              color="#00F2FE"
              depthColor="#01579B"
              depth={4}
              strokeColor="#002B49"
            />
          </View>

          <Text style={styles.subtitleText}>STRATEGIC PUZZLE CHALLENGE</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  emblemShadow: {
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  outerRim: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  innerCore: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#00F2FE',
  },
  topSheen: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  centerOrb: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbHighlight: {
    width: '40%',
    height: '40%',
    borderRadius: 99,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: '15%',
    left: '20%',
  },
  arrowAbsolute: {
    position: 'absolute',
    zIndex: 3,
  },
  arrowGlow: {
    textShadowColor: 'rgba(0, 242, 254, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  arrowGlowPurple: {
    textShadowColor: 'rgba(129, 140, 248, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#E0F2FE',
    letterSpacing: 1.5,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
