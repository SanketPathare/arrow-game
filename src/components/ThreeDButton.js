import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  Animated,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { soundManager } from '../utils/sound.js';
import { GameSvgIcon } from './SvgIcons.js';

/**
 * Glassy gradient button with a restrained depth effect and spring feedback.
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
  const minHeight = isCircle ? 48 : size === 'lg' ? 52 : size === 'sm' ? 38 : 46;
  const paddingVertical = isCircle ? 0 : size === 'lg' ? 12 : size === 'sm' ? 8 : 10;
  const borderRadius = isCircle ? 24 : 18;
  const bevelDepth = isCircle ? 3 : 4;

  // Color schemes matching the 3D reference images
  let faceGradient = ['#38D9F8', '#0FB7E8', '#0288D1'];
  let bevelColor = '#0369A1';
  let shadowColor = '#082F49';
  let textColor = '#FFFFFF';
  let textShadowColor = '#01579B';

  if (colorScheme === 'blue') {
    // Level Vault deep glossy blue
    faceGradient = ['#45638C', '#304968', '#24374F'];
    bevelColor = '#17283D';
    shadowColor = '#071523';
    textShadowColor = '#172C5E';
  } else if (colorScheme === 'yellow' || colorScheme === 'orange') {
    // Warm accent used for daily challenges and hints.
    faceGradient = ['#FBBF24', '#F59E0B', '#D97706'];
    bevelColor = '#92400E';
    shadowColor = '#451A03';
    textShadowColor = '#92400E';
  } else if (colorScheme === 'circle-blue') {
    // Help / Back / Pause circular blue button
    faceGradient = ['#38BDF8', '#0284C7', '#0369A1'];
    bevelColor = '#075985';
    shadowColor = '#082F49';
  } else if (colorScheme === 'circle-orange') {
    // Settings circular orange button
    faceGradient = ['#FB923C', '#F97316', '#C2410C'];
    bevelColor = '#7C2D12';
    shadowColor = '#431407';
  } else if (colorScheme === 'danger') {
    faceGradient = ['#FB7185', '#E11D48', '#BE123C'];
    bevelColor = '#881337';
    shadowColor = '#4C0519';
    textShadowColor = '#881337';
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
            borderRadius,
            backgroundColor: bevelColor,
            top: bevelDepth,
            bottom: -bevelDepth,
            shadowColor,
            ...(isCircle ? { width: 48, height: 48 } : { left: 0, right: 0 }),
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
          accessibilityRole="button"
          accessibilityLabel={title || icon}
          accessibilityState={{ disabled }}
          style={[
            styles.buttonFace,
            {
              borderRadius,
              borderColor: 'rgba(255, 255, 255, 0.45)',
              minHeight,
              paddingVertical,
              ...(isCircle ? { width: 48, height: 48 } : { alignSelf: 'stretch' }),
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
              <View style={[styles.svgIconWrapper, title ? { marginRight: 8 } : null]}>
                <GameSvgIcon
                  name={effectiveIcon}
                  size={iconSize || (isCircle ? 24 : 20)}
                  color="#FFFFFF"
                />
              </View>
            ) : null}

            {title ? (
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.75}
                style={[
                  styles.buttonText,
                  {
                    color: textColor,
                    textShadowColor,
                    fontSize: size === 'lg' ? 18 : size === 'sm' ? 13 : 15,
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
    paddingHorizontal: 10,
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
  svgIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
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
