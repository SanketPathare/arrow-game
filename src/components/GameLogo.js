import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgArrowGraphic } from './SvgIcons.js';

export function GameLogo({ size = 'md', showSubtitle = true, animated = true, theme }) {
  // Sizing variants
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  const containerSize = isLg ? 130 : isSm ? 54 : 96;
  const iconSize = isLg ? 42 : isSm ? 18 : 30;
  const titleFontSize = isLg ? 32 : isSm ? 18 : 26;
  const subtitleFontSize = isLg ? 14 : isSm ? 10 : 12;

  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const arrowSpreadAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    // Continuous subtle slow rotation
    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Heartbeat / breath pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.98,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Glow oscillation
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.85,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.35,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    );

    // Arrows pulsating outward
    const spreadLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowSpreadAnim, {
          toValue: 4,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(arrowSpreadAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    rotateLoop.start();
    pulseLoop.start();
    glowLoop.start();
    spreadLoop.start();

    return () => {
      rotateLoop.stop();
      pulseLoop.stop();
      glowLoop.stop();
      spreadLoop.stop();
    };
  }, [animated, rotateAnim, pulseAnim, glowAnim, arrowSpreadAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const arrowUpY = arrowSpreadAnim.interpolate({
    inputRange: [0, 4],
    outputRange: [0, -3],
  });
  const arrowDownY = arrowSpreadAnim.interpolate({
    inputRange: [0, 4],
    outputRange: [0, 3],
  });
  const arrowLeftX = arrowSpreadAnim.interpolate({
    inputRange: [0, 4],
    outputRange: [0, -3],
  });
  const arrowRightX = arrowSpreadAnim.interpolate({
    inputRange: [0, 4],
    outputRange: [0, 3],
  });

  return (
    <View style={styles.wrapper}>
      {/* Emblem Frame with layered neon aura */}
      <View style={{ width: containerSize, height: containerSize, alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer ambient glow */}
        <Animated.View
          style={[
            styles.ambientGlow,
            {
              width: containerSize * 1.25,
              height: containerSize * 1.25,
              borderRadius: (containerSize * 1.25) / 2,
              opacity: glowAnim,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.emblemContainer,
            {
              width: containerSize,
              height: containerSize,
              borderRadius: Math.round(containerSize * 0.32),
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#38BDF8', '#2563EB', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.emblemBorder, { borderRadius: Math.round(containerSize * 0.32) }]}
          >
            <View
              style={[
                styles.emblemInner,
                {
                  borderRadius: Math.round(containerSize * 0.3),
                  backgroundColor: theme ? theme.surface : '#0F172A',
                },
              ]}
            >
              {/* Subtle grid pattern background */}
              <View style={styles.gridOverlay} />

              {/* Spinning / breathing directional arrow cross */}
              <Animated.View
                style={[
                  styles.arrowCross,
                  {
                    transform: [{ rotate: spin }],
                  },
                ]}
              >
                {/* Arrow UP */}
                <Animated.View style={{ transform: [{ translateY: arrowUpY }] }}>
                  <SvgArrowGraphic size={iconSize} dir="UP" state="normal" />
                </Animated.View>

                {/* Arrow LEFT & RIGHT Row */}
                <View style={styles.horizontalRow}>
                  <Animated.View style={{ transform: [{ translateX: arrowLeftX }] }}>
                    <SvgArrowGraphic size={iconSize} dir="LEFT" state="normal" />
                  </Animated.View>

                  <View
                    style={[
                      styles.coreCenter,
                      {
                        width: Math.max(6, Math.floor(containerSize * 0.12)),
                        height: Math.max(6, Math.floor(containerSize * 0.12)),
                        borderRadius: Math.max(3, Math.floor(containerSize * 0.06)),
                      },
                    ]}
                  />

                  <Animated.View style={{ transform: [{ translateX: arrowRightX }] }}>
                    <SvgArrowGraphic size={iconSize} dir="RIGHT" state="normal" />
                  </Animated.View>
                </View>

                {/* Arrow DOWN */}
                <Animated.View style={{ transform: [{ translateY: arrowDownY }] }}>
                  <SvgArrowGraphic size={iconSize} dir="DOWN" state="normal" />
                </Animated.View>
              </Animated.View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Typography */}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.titleText,
            {
              fontSize: titleFontSize,
              color: theme ? theme.text : '#F8FAFC',
              letterSpacing: isLg ? 3 : 2,
            },
          ]}
        >
          ARROW <Text style={{ color: '#38BDF8' }}>ESCAPE</Text>
        </Text>

        {showSubtitle && (
          <Text
            style={[
              styles.subtitleText,
              {
                fontSize: subtitleFontSize,
                color: theme ? theme.textMuted : '#94A3B8',
              },
            ]}
          >
            STRATEGIC PUZZLE CHALLENGE
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambientGlow: {
    position: 'absolute',
    backgroundColor: '#38BDF8',
    opacity: 0.35,
    filter: 'blur(20px)',
  },
  emblemContainer: {
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 12,
  },
  emblemBorder: {
    width: '100%',
    height: '100%',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emblemInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.05,
    backgroundColor: '#FFFFFF',
  },
  arrowCross: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -2,
  },
  coreCenter: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 3,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 14,
  },
  titleText: {
    fontWeight: '900',
  },
  subtitleText: {
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 4,
  },
});
