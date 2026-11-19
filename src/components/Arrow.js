import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  Pressable,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DIRECTIONS, DIRECTION_CONFIG } from '../utils/constants.js';
import { SvgArrowGraphic, SvgFlightTrail } from './SvgIcons.js';

export const Arrow = React.memo(function Arrow({
  arrow,
  cellSize,
  theme,
  isBlocked,
  isBlocking,
  isHinted,
  isExiting,
  isResolving = false,
  onPress,
}) {
  const { dir, id } = arrow;

  // Animation values
  const exitAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const hintPulseAnim = useRef(new Animated.Value(1)).current;
  const pressDepthAnim = useRef(new Animated.Value(0)).current;

  // Blocked shake effect with snappy rebound
  useEffect(() => {
    if (isBlocked) {
      shakeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 7, duration: 35, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -7, duration: 35, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 3, duration: 30, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 30, useNativeDriver: true }),
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
            duration: 340,
            useNativeDriver: true,
          }),
          Animated.timing(hintPulseAnim, {
            toValue: 0.94,
            duration: 340,
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
        duration: 290,
        useNativeDriver: true,
      }).start();
    }
  }, [isExiting, exitAnim]);

  // Calculate translation vectors based on direction
  const exitDistance = cellSize * 7.5;
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

  // Determine state for 2D styling
  let arrowState = 'normal';
  let faceGradient = ['#38BDF8', '#0284C7', '#0369A1'];
  let bevelColor = '#075985';
  let shadowColor = '#082F49';

  if (isBlocked) {
    arrowState = 'blocked';
    faceGradient = ['#FF4E50', '#E11D48', '#9F1239'];
    bevelColor = '#881337';
    shadowColor = '#4C0519';
  } else if (isBlocking) {
    arrowState = 'blocking';
    faceGradient = ['#FB923C', '#EA580C', '#C2410C'];
    bevelColor = '#9A3412';
    shadowColor = '#431407';
  } else if (isHinted) {
    arrowState = 'hinted';
    faceGradient = ['#FDE047', '#EAB308', '#CA8A04'];
    bevelColor = '#A16207';
    shadowColor = '#422006';
  }

  const padding = Math.max(2, Math.floor(cellSize * 0.05));
  const tileSize = cellSize - padding * 2;
  const borderRadius = Math.max(8, Math.floor(tileSize * 0.26));
  const graphicSize = Math.max(22, Math.floor(tileSize * 0.72));

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
            inputRange: [0, 0.75, 1],
            outputRange: [1, 0.5, 0],
          }),
        },
      ]}
    >
      {/* Dynamic 2D SVG Jet Flight Trail */}
      {isExiting && (
        <View
          style={[
            styles.trailContainer,
            dir === DIRECTIONS.UP && { bottom: -tileSize * 0.4 },
            dir === DIRECTIONS.DOWN && { top: -tileSize * 0.4 },
            dir === DIRECTIONS.LEFT && { right: -tileSize * 0.4 },
            dir === DIRECTIONS.RIGHT && { left: -tileSize * 0.4 },
          ]}
          pointerEvents="none"
        >
          <SvgFlightTrail
            width={tileSize * 0.9}
            height={tileSize * 1.1}
            dir={dir}
          />
        </View>
      )}

      <Pressable
        onPress={() => onPress(id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isResolving || isExiting}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel={`${DIRECTION_CONFIG[dir].name} arrow`}
        accessibilityHint="Tap to clear the arrow if its path to the edge is open."
        accessibilityState={{ disabled: isResolving || isExiting }}
        style={[styles.pressable, (isResolving || isExiting) && styles.disabled]}
      >
        {/* 2D Bevel Underlay */}
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

        {/* Depressable 2D Tile Face */}
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
            <View style={[styles.topSpecularSheen, { borderRadius: borderRadius * 0.85 }]} />

            {/* Custom 2D SVG Arrow Graphic */}
            <View style={styles.arrowGraphicContainer}>
              <SvgArrowGraphic
                size={graphicSize}
                dir={dir}
                state={arrowState}
              />
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
  disabled: {
    opacity: 0.75,
  },
  bevelUnderlay: {
    position: 'absolute',
    top: 3.5,
    shadowOffset: { width: 0, height: 3.5 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  tileFaceWrapper: {
    position: 'relative',
  },
  tileFace: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    position: 'relative',
    overflow: 'hidden',
  },
  topSpecularSheen: {
    position: 'absolute',
    top: 1.5,
    left: 3,
    right: 3,
    height: '38%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  arrowGraphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  trailContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
