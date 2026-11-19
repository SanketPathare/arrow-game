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
      toValue: 4, // depress by 4px into 3D bevel
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
  const height = isCircle ? 52 : size === 'lg' ? 62 : size === 'sm' ? 44 : 52;
  const width = isCircle ? 52 : undefined;
  const borderRadius = isCircle ? 26 : Math.round(height * 0.42);
  const bevelDepth = isCircle ? 5 : 6;

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
            {/* Top Glossy Specular Reflection Sheen */}
            <View style={[styles.specularSheen, { borderRadius }]} />
            {/* Bottom Inner Shadow Contour */}
            <View style={[styles.bottomInnerContour, { borderRadius }]} />
          </LinearGradient>

          {/* Button Content */}
          <View style={styles.contentRow}>
            {icon ? (
              <Ionicons
                name={icon}
                size={iconSize}
                color="#FFFFFF"
                style={[
                  styles.iconShadow,
                  title ? { marginRight: 10 } : {},
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
                    fontSize: size === 'lg' ? 20 : size === 'sm' ? 15 : 17,
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
    marginVertical: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  bevelBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonFace: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
    paddingHorizontal: 16,
  },
  specularSheen: {
    position: 'absolute',
    top: 2,
    left: 6,
    right: 6,
    height: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 20,
  },
  bottomInnerContour: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '25%',
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
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  iconShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  badgeWrapper: {
    position: 'absolute',
    top: -6,
    right: 6,
    zIndex: 10,
    shadowColor: '#D81136',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
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
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
