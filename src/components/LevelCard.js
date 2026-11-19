import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { soundManager } from '../utils/sound.js';
import { SvgStar, SvgLock } from './SvgIcons.js';

export const LevelCard = React.memo(function LevelCard({
  levelNumber,
  boardSize,
  isUnlocked,
  isCompleted,
  stars = 0,
  onPress,
  theme,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!isUnlocked) return;
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 35,
    }).start();
  };

  const handlePressOut = () => {
    if (!isUnlocked) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
      bounciness: 6,
    }).start();
  };

  const handlePress = () => {
    if (!isUnlocked) {
      soundManager.playBlockedSound();
      return;
    }
    soundManager.playClickSound();
    onPress(levelNumber);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] },
        !isUnlocked && styles.lockedContainer,
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={isUnlocked
          ? `Level ${levelNumber}, ${boardSize} by ${boardSize}${isCompleted ? `, completed with ${stars} stars` : ''}`
          : `Level ${levelNumber}, locked`}
        style={[
          styles.card,
          {
            backgroundColor: isCompleted
              ? theme.surfaceActive || theme.surfaceLight
              : theme.surfaceGlass || theme.surface,
            borderColor: isCompleted
              ? theme.accent
              : isUnlocked
              ? theme.borderLight || theme.border
              : 'rgba(255, 255, 255, 0.05)',
          },
          isCompleted && styles.completedGlow,
        ]}
      >
        {isCompleted && (
          <LinearGradient
            colors={['rgba(0, 242, 254, 0.12)', 'rgba(37, 99, 235, 0.06)']}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Top glass sheen */}
        {isUnlocked && <View style={styles.cardSheen} />}

        {isUnlocked ? (
          <>
            <Text style={[styles.levelNum, { color: theme.text }]}>
              {levelNumber}
            </Text>

            <View style={[styles.sizePill, { backgroundColor: theme.surfaceLight }]}>
              <Text style={[styles.sizeText, { color: theme.accent }]}>
                {boardSize}x{boardSize}
              </Text>
            </View>

            {/* Stars row */}
            <View style={styles.starsRow}>
              {[1, 2, 3].map((starIdx) => (
                <View key={starIdx} style={styles.starIcon}>
                  <SvgStar
                    size={13}
                    empty={stars < starIdx}
                    color="#FFD13B"
                  />
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.lockedContent}>
            <View style={styles.lockCircle}>
              <SvgLock size={16} color={theme.textDim} />
            </View>
            <Text style={[styles.lockedText, { color: theme.textDim }]}>
              {levelNumber}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 4,
    aspectRatio: 0.95,
    maxWidth: 120,
    minHeight: 68,
  },
  lockedContainer: {
    opacity: 0.45,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  cardSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  completedGlow: {
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  levelNum: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sizePill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    marginBottom: 6,
  },
  sizeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    marginHorizontal: 1,
  },
  lockedContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  lockedText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
