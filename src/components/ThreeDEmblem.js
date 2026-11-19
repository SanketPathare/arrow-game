import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgArrowGraphic } from './SvgIcons.js';
import { ThreeDText } from './ThreeDText.js';

export function ThreeDEmblem({ size = 96, showTitle = true }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const arrowSpread = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle floating bob
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
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
          toValue: 1.12,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.96,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    );

    // Subtle arrow outward breathing
    const spreadLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowSpread, {
          toValue: 2.5,
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

  const cornerOffset = Math.round(size * 0.15);
  const arrowIconSize = Math.round(size * 0.28);
  const centerOrbSize = Math.round(size * 0.22);

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
          colors={['#6A5C52', '#3D332B', '#241D17']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.outerRim, { width: size, height: size, borderRadius: size * 0.32 }]}
        >
          {/* Inner Glossy Obsidian Core */}
          <LinearGradient
            colors={['#2A364E', '#182236', '#0E1524']}
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
              <SvgArrowGraphic size={arrowIconSize} dir="UP" state="normal" />
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
              <SvgArrowGraphic size={arrowIconSize} dir="UP" state="normal" />
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
              <SvgArrowGraphic size={arrowIconSize} dir="UP" state="hinted" />
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
              <SvgArrowGraphic size={arrowIconSize} dir="UP" state="hinted" />
            </Animated.View>
          </LinearGradient>
        </LinearGradient>
      </View>

      {/* Main 3D Title: ARROW ESCAPE */}
      {showTitle && (
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <ThreeDText
              text="ARROW"
              size={30}
              color="#FFFFFF"
              depthColor="#0288D1"
              depth={4}
              strokeColor="#013A63"
              style={{ marginRight: 8 }}
            />
            <ThreeDText
              text="ESCAPE"
              size={30}
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
    marginVertical: 4,
  },
  emblemShadow: {
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  outerRim: {
    padding: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
    height: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  centerOrb: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbHighlight: {
    width: '45%',
    height: '45%',
    borderRadius: 99,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: '12%',
    left: '18%',
  },
  arrowAbsolute: {
    position: 'absolute',
    zIndex: 3,
  },
  arrowGlow: {
    textShadowColor: 'rgba(0, 242, 254, 0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  arrowGlowPurple: {
    textShadowColor: 'rgba(157, 114, 255, 0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#E0F2FE',
    letterSpacing: 1.2,
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 3,
  },
});
