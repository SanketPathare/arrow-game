import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  Pressable,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DIRECTIONS } from '../utils/constants.js';

export const Arrow = React.memo(function Arrow({
  arrow,
  cellSize,
  theme,
  isBlocked,
  isBlocking,
  isHinted,
  isExiting,
  onPress,
}) {
  const { dir, id } = arrow;

  // Animation values
  const exitAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const hintPulseAnim = useRef(new Animated.Value(1)).current;
  const pressDepthAnim = useRef(new Animated.Value(0)).current;

  // Blocked shake effect
  useEffect(() => {
    if (isBlocked) {
      shakeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 12, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -12, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 4, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]).start();
    }
  }, [isBlocked, shakeAnim]);

  // Hint pulsing effect
  useEffect(() => {
    if (isHinted) {
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(hintPulseAnim, {
            toValue: 1.12,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(hintPulseAnim, {
            toValue: 0.96,
            duration: 350,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();
      return () => pulseLoop.stop();
    } else {
      hintPulseAnim.setValue(1);
    }
  }, [isHinted, hintPulseAnim]);

  // Exit flight animation
  useEffect(() => {
    if (isExiting) {
      exitAnim.setValue(0);
      Animated.timing(exitAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }
  }, [isExiting, exitAnim]);

  // Calculate translation vectors based on direction
  const exitDistance = cellSize * 8;
  let exitTranslateX = 0;
  let exitTranslateY = 0;

  if (dir === DIRECTIONS.UP) {
    exitTranslateY = exitAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -exitDistance],
    });
  } else if (dir === DIRECTIONS.DOWN) {
    exitTranslateY = exitAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, exitDistance],
    });
  } else if (dir === DIRECTIONS.LEFT) {
    exitTranslateX = exitAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -exitDistance],
    });
  } else if (dir === DIRECTIONS.RIGHT) {
    exitTranslateX = exitAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, exitDistance],
    });
  }

  // Shake translation: perpendicular shake
  const shakeTranslateX =
    dir === DIRECTIONS.UP || dir === DIRECTIONS.DOWN ? shakeAnim : 0;
  const shakeTranslateY =
    dir === DIRECTIONS.LEFT || dir === DIRECTIONS.RIGHT ? shakeAnim : 0;

  // Press depression
  const handlePressIn = () => {
    Animated.spring(pressDepthAnim, {
      toValue: 3,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressDepthAnim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  // Determine colors based on state
  let faceGradient = ['#53C3F8', '#2AA7EC', '#1080D0'];
  let bevelColor = '#0B5994';
  let shadowColor = '#063459';

  if (isBlocked) {
    faceGradient = ['#FF4E6B', '#E5173F', '#B30B2D'];
    bevelColor = '#6A0217';
    shadowColor = '#3D000C';
  } else if (isBlocking) {
    faceGradient = ['#FFA347', '#E8660B', '#B84900'];
    bevelColor = '#6E2B00';
    shadowColor = '#3B1700';
  } else if (isHinted) {
    faceGradient = ['#FFE066', '#FFB703', '#FB8500'];
    bevelColor = '#B25000';
    shadowColor = '#592500';
  }

  const padding = Math.max(2, Math.floor(cellSize * 0.06));
  const tileSize = cellSize - padding * 2;
  const borderRadius = Math.max(10, Math.floor(tileSize * 0.28));
  const iconSize = Math.max(16, Math.floor(tileSize * 0.46));
  const dotSize = Math.max(4, Math.floor(tileSize * 0.12));

  // Arrow icon configuration matching Image 2
  let iconName = 'arrow-up';
  let isRow = false;
  let dotFirst = false;

  if (dir === DIRECTIONS.DOWN) {
    iconName = 'arrow-down';
    isRow = false;
    dotFirst = true; // dot at top
  } else if (dir === DIRECTIONS.UP) {
    iconName = 'arrow-up';
    isRow = false;
    dotFirst = false; // dot at bottom
  } else if (dir === DIRECTIONS.LEFT) {
    iconName = 'arrow-back';
    isRow = true;
    dotFirst = true; // dot at right (or left based on icon orientation)
  } else if (dir === DIRECTIONS.RIGHT) {
    iconName = 'arrow-forward';
    isRow = true;
    dotFirst = false; // dot at left
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: cellSize,
          height: cellSize,
          padding,
          transform: [
            { translateX: exitTranslateX },
            { translateY: exitTranslateY },
            { translateX: shakeTranslateX },
            { translateY: shakeTranslateY },
            { scale: isHinted ? hintPulseAnim : 1 },
          ],
          opacity: exitAnim.interpolate({
            inputRange: [0, 0.7, 1],
            outputRange: [1, 0.4, 0],
          }),
        },
      ]}
    >
      <Pressable
        onPress={() => onPress(id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        {/* 3D Bottom Extrusion Bevel */}
        <View
          style={[
            styles.bevelUnderlay,
            {
              width: tileSize,
              height: tileSize,
              borderRadius,
              backgroundColor: bevelColor,
              shadowColor,
            },
          ]}
        />

        {/* Depressable 3D Tile Face */}
        <Animated.View
          style={[
            styles.tileFaceWrapper,
            {
              width: tileSize,
              height: tileSize,
              borderRadius,
              transform: [{ translateY: pressDepthAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={faceGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.tileFace, { borderRadius }]}
          >
            {/* Top Gloss Specular Highlight Sheen */}
            <View style={[styles.topSpecularSheen, { borderRadius: borderRadius * 0.9 }]} />

            {/* Custom 3D Arrow Graphic with Distinctive Dot (Matching Image 2) */}
            <View
              style={[
                styles.arrowGroup,
                isRow ? styles.arrowRow : styles.arrowCol,
              ]}
            >
              {/* If Left arrow, dot is on left/tail */}
              {dir === DIRECTIONS.LEFT && (
                <View
                  style={[
                    styles.characterDot,
                    {
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                      marginRight: 2,
                    },
                  ]}
                />
              )}

              {/* Arrow Icon */}
              <Ionicons
                name={iconName}
                size={iconSize}
                color="#FFFFFF"
                style={styles.icon3dShadow}
              />

              {/* If Right arrow, dot is on right */}
              {dir === DIRECTIONS.RIGHT && (
                <View
                  style={[
                    styles.characterDot,
                    {
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                      marginLeft: 2,
                    },
                  ]}
                />
              )}

              {/* If Down arrow, dot is at bottom */}
              {dir === DIRECTIONS.DOWN && (
                <View
                  style={[
                    styles.characterDot,
                    {
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                      marginTop: 2,
                    },
                  ]}
                />
              )}

              {/* If Up arrow, dot is at bottom */}
              {dir === DIRECTIONS.UP && (
                <View
                  style={[
                    styles.characterDot,
                    {
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                      marginTop: 2,
                    },
                  ]}
                />
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pressable: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bevelUnderlay: {
    position: 'absolute',
    top: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 6,
  },
  tileFaceWrapper: {
    position: 'relative',
  },
  tileFace: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    position: 'relative',
    overflow: 'hidden',
  },
  topSpecularSheen: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  arrowGroup: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  arrowRow: {
    flexDirection: 'row',
  },
  arrowCol: {
    flexDirection: 'column',
  },
  characterDot: {
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  icon3dShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});
