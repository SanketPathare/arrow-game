import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  Animated,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { soundManager } from '../utils/sound.js';

/**
 * 3D Cartoon Game Button with realistic bevel, glossy specular highlight,
 * extruded bottom depth, and spring press depression.
 */
export function ThreeDButton({
  title,
  icon,
  iconSize = 22,
  colorScheme = 'cyan', // 'cyan' | 'blue' | 'yellow' | 'circle-blue' | 'circle-orange' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg' | 'circle'
  badge = null,
  disabled = false,
  onPress,
  style,
}) {
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(pressAnim, {
      toValue: 3.5, // depress by 3.5px into 3D bevel
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(pressAnim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    soundManager.playClickSound();
    if (onPress) onPress();
  };

  const isCircle = size === 'circle';
  const height = isCircle ? 48 : size === 'lg' ? 56 : size === 'sm' ? 42 : 48;
  const width = isCircle ? 48 : undefined;
  const borderRadius = isCircle ? 24 : Math.round(height * 0.42);
  const bevelDepth = isCircle ? 4 : 5;

  // Color schemes matching the 3D reference images
  let faceGradient = ['#38D9F8', '#0FB7E8', '#0288D1'];
  let bevelColor = '#01579B'; // dark blue extrusion
  let shadowColor = '#013A63';
  let textColor = '#FFFFFF';
  let textShadowColor = '#01579B';

  if (colorScheme === 'blue') {
    // Level Vault deep glossy blue
    faceGradient = ['#4A7BD0', '#345EB5', '#24458F'];
    bevelColor = '#172C5E';
    shadowColor = '#0E1C3D';
    textShadowColor = '#172C5E';
  } else if (colorScheme === 'yellow' || colorScheme === 'orange') {
    // Daily Protocol / Hint glowing warm orange/yellow
    faceGradient = ['#FFD13B', '#FFA800', '#F57C00'];
    bevelColor = '#B25000';
    shadowColor = '#662D00';
    textShadowColor = '#B25000';
  } else if (colorScheme === 'circle-blue') {
    // Help / Back / Pause circular blue button
    faceGradient = ['#4FA8E8', '#2B87D1', '#186BB0'];
    bevelColor = '#104C80';
    shadowColor = '#0A3254';
  } else if (colorScheme === 'circle-orange') {
    // Settings circular orange button
    faceGradient = ['#FFA347', '#F57216', '#D84E07'];
    bevelColor = '#9A3300';
    shadowColor = '#591D00';
  } else if (colorScheme === 'danger') {
    faceGradient = ['#FF5E7E', '#E62E5C', '#BF123F'];
    bevelColor = '#7A0A27';
    shadowColor = '#4A0517';
    textShadowColor = '#7A0A27';
  }

  // Ensure clean solid icon glyphs
  let effectiveIcon = icon;
  if (icon === 'settings') {
    effectiveIcon = 'settings-sharp';
  }

  return (
    <View style={[styles.outerWrapper, style, disabled && styles.disabled]}>
      {/* 3D Extrusion Bevel Shadow Base */}
      <View
        style={[
          styles.bevelBase,
          {
            height,
            width,
            borderRadius,
            backgroundColor: bevelColor,
            top: bevelDepth,
            shadowColor,
          },
        ]}
      />

      {/* Depressable Button Face */}
      <Animated.View
        style={{
          transform: [{ translateY: pressAnim }],
        }}
      >
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          style={[
            styles.buttonFace,
            {
              height,
              width,
              borderRadius,
              borderColor: 'rgba(255, 255, 255, 0.45)',
            },
          ]}
        >
          <LinearGradient
            colors={faceGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius }]}
          >
            {/* Top Glossy Specular Reflection Sheen with Smooth Gradient Fade */}
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 0.02)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              pointerEvents="none"
              style={[
                styles.specularSheen,
                isCircle
                  ? { top: 2, left: 6, right: 6, height: '40%', borderRadius: 16 }
                  : { top: 2, left: 8, right: 8, height: '44%', borderRadius: 16 },
              ]}
            />
            {/* Bottom Inner Shadow Contour */}
            <View style={[styles.bottomInnerContour, { borderRadius }]} pointerEvents="none" />
          </LinearGradient>

          {/* Button Content */}
          <View style={styles.contentRow}>
            {effectiveIcon ? (
              <Ionicons
                name={effectiveIcon}
                size={isCircle ? 24 : iconSize}
                color="#FFFFFF"
                style={[
                  styles.iconShadow,
                  title ? { marginRight: 8 } : {},
                ]}
              />
            ) : null}

            {title ? (
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: textColor,
                    textShadowColor,
                    fontSize: size === 'lg' ? 18 : size === 'sm' ? 14 : 16,
                  },
                ]}
              >
                {title}
              </Text>
            ) : null}
          </View>
        </Pressable>
      </Animated.View>

      {/* Red Bubble Badge (e.g. for "NEW") */}
      {badge && (
        <View style={styles.badgeWrapper}>
          <LinearGradient
            colors={['#FF4E6B', '#D81136']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.badgePill}
          >
            <View style={styles.badgeSheen} />
            <Text style={styles.badgeText}>{badge}</Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'relative',
    marginVertical: 3,
  },
  disabled: {
    opacity: 0.5,
  },
  bevelBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonFace: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
    paddingHorizontal: 14,
  },
  specularSheen: {
    position: 'absolute',
  },
  bottomInnerContour: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '24%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  buttonText: {
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  iconShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  badgeWrapper: {
    position: 'absolute',
    top: -5,
    right: 8,
    zIndex: 10,
    shadowColor: '#D81136',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6,
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badgeSheen: {
    position: 'absolute',
    top: 1,
    left: 2,
    right: 2,
    height: '38%',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
