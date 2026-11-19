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

export function GameButton({
  title,
  icon,
  iconSize = 22,
  variant = 'secondary', // 'primary' | 'secondary' | 'icon' | 'danger' | 'gold'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  badge = null,
  onPress,
  theme,
  style,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 35,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
      bounciness: 6,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    soundManager.playClickSound();
    if (onPress) onPress();
  };

  const isPrimary = variant === 'primary';
  const isGold = variant === 'gold';
  const isDanger = variant === 'danger';
  const isIconOnly = variant === 'icon';

  // Sizing
  const height = size === 'sm' ? 42 : size === 'lg' ? 58 : 50;
  const paddingHorizontal = isIconOnly ? 0 : size === 'sm' ? 14 : size === 'lg' ? 24 : 18;
  const width = isIconOnly ? height : undefined;
  const borderRadius = isIconOnly ? height / 2 : Math.round(height * 0.36);

  let gradientColors = null;
  let backgroundColor = theme.surfaceGlass || theme.surfaceLight;
  let textColor = theme.text;
  let borderColor = theme.border;

  if (isPrimary) {
    gradientColors = theme.primaryButtonGradient || ['#00F2FE', '#2563EB'];
    textColor = '#FFFFFF';
    borderColor = 'transparent';
  } else if (isGold) {
    gradientColors = theme.hintGradient || ['#FFD166', '#FB8500'];
    textColor = '#FFFFFF';
    borderColor = 'transparent';
  } else if (isDanger) {
    backgroundColor = 'rgba(255, 42, 109, 0.12)';
    borderColor = 'rgba(255, 42, 109, 0.5)';
    textColor = '#FF2A6D';
  }

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        disabled && { opacity: 0.45 },
        style,
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.buttonBase,
          {
            height,
            width,
            paddingHorizontal,
            borderRadius,
            backgroundColor: gradientColors ? 'transparent' : backgroundColor,
            borderColor,
            borderWidth: gradientColors ? 0 : 1.5,
          },
          isPrimary && styles.primaryShadow,
          isGold && styles.goldShadow,
        ]}
      >
        {gradientColors ? (
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius }]}
          >
            {/* Top glass reflection highlight */}
            <View style={[styles.topHighlight, { borderRadius }]} />
          </LinearGradient>
        ) : null}

        <View style={styles.contentRow}>
          {icon ? (
            <View style={title ? { marginRight: 8 } : null}>
              <GameSvgIcon
                name={icon}
                size={iconSize}
                color={textColor}
              />
            </View>
          ) : null}
          {title ? (
            <Text
              style={[
                styles.buttonText,
                {
                  color: textColor,
                  fontSize: size === 'sm' ? 14 : size === 'lg' ? 17 : 15,
                  fontWeight: size === 'lg' ? '800' : '700',
                  letterSpacing: 0.5,
                },
              ]}
            >
              {title}
            </Text>
          ) : null}
        </View>

        {badge !== null && (
          <View style={[styles.badgeContainer, { backgroundColor: '#FF2A6D' }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  buttonText: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  primaryShadow: {
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  goldShadow: {
    shadowColor: '#FFB703',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  badgeContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    minWidth: 20,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#FF2A6D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
