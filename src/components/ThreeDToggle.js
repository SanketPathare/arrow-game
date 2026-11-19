import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Pressable,
  Animated,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { soundManager } from '../utils/sound.js';

/**
 * 3D Cartoon Toggle Switch with animated sliding pill knob,
 * recessed track bevel, and tactile spring physics.
 */
export function ThreeDToggle({
  value = false,
  onValueChange,
  colorScheme = 'cyan', // 'cyan' | 'yellow'
  disabled = false,
}) {
  const slideAnim = useRef(new Animated.Value(value ? 24 : 0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: value ? 24 : 0,
      speed: 28,
      bounciness: 8,
      useNativeDriver: true,
    }).start();
  }, [value, slideAnim]);

  const handleToggle = () => {
    if (disabled) return;
    soundManager.playClickSound();
    if (onValueChange) {
      onValueChange(!value);
    }
  };

  const activeColors =
    colorScheme === 'yellow'
      ? ['#FFD13B', '#FFA800', '#F57C00']
      : ['#38D9F8', '#0FB7E8', '#0288D1'];

  const inactiveColors = ['#1E2638', '#141A28', '#0B0F18'];

  return (
    <Pressable
      onPress={handleToggle}
      disabled={disabled}
      style={styles.toggleWrapper}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      {/* 3D Recessed Track Frame */}
      <View style={styles.trackBevel}>
        <LinearGradient
          colors={value ? activeColors : inactiveColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.trackFace}
        >
          {/* Inner Groove Shadow */}
          <View style={styles.trackInnerShadow} />

          {/* Animated 3D Sliding Knob */}
          <Animated.View
            style={[
              styles.knobContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {/* Knob 3D Bevel Shadow */}
            <View style={styles.knobBevel} />

            {/* Knob Face */}
            <LinearGradient
              colors={['#FFFFFF', '#F0F4F8', '#D8E2EC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.knobFace}
            >
              {/* Glossy Specular Sheen */}
              <View style={styles.knobSheen} />
            </LinearGradient>
          </Animated.View>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toggleWrapper: {
    padding: 3,
  },
  trackBevel: {
    width: 58,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#070A12',
    paddingBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
  },
  trackFace: {
    flex: 1,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    paddingHorizontal: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  trackInnerShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  knobContainer: {
    width: 24,
    height: 24,
    position: 'absolute',
    left: 3,
  },
  knobBevel: {
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
    bottom: -2,
    backgroundColor: '#9AA7B5',
    borderRadius: 12,
  },
  knobFace: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  knobSheen: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 6,
  },
});
