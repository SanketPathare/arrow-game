import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameEngine } from 'react-native-game-engine';
import { Arrow } from './Arrow.js';
import { ThreeDText } from './ThreeDText.js';
import { EffectsManager, EffectsOverlayRenderer } from '../engine/GameEffects.js';

export const GameBoard = React.memo(function GameBoard({
  boardSize = 4,
  activeArrows = [],
  exitingArrowIds = new Set(),
  blockedArrowId = null,
  blockingArrowId = null,
  hintArrowId = null,
  combo = 0,
  zone = 1,
  onArrowPress,
  theme,
}) {
  const { width, height } = useWindowDimensions();

  // Responsive board sizing: fits comfortably on small, medium, and large screens (phones, tablets, web)
  // Ensure the board slab (which adds 20px padding + borders) never exceeds viewport bounds minus safe UI areas
  const isNarrow = width < 360;
  const isShort = height < 700;
  const isLandscape = width > height;

  const horizontalBound = Math.min(width - (isNarrow ? 24 : 36), 520);
  const reservedHeight = isLandscape ? 120 : isShort ? 210 : 255;
  const verticalBound = Math.min(Math.max(160, height - reservedHeight), 520);
  const maxBoardDim = Math.max(160, Math.min(horizontalBound, verticalBound));
  const cellSize = Math.max(28, Math.floor((maxBoardDim - 20) / boardSize));
  const boardDimension = cellSize * boardSize;

  // Effects manager for 2D particles, shockwaves, and animations
  const effectsManagerRef = useRef(new EffectsManager());
  const engineRef = useRef(null);
  const [displayedCombo, setDisplayedCombo] = useState(0);
  const [isShowingCombo, setIsShowingCombo] = useState(false);
  const comboScaleAnim = useRef(new Animated.Value(0)).current;
  const comboFloatAnim = useRef(new Animated.Value(0)).current;
  const comboOpacityAnim = useRef(new Animated.Value(0)).current;
  const fadeTimeoutRef = useRef(null);

  // Elastic pop & upward floating motion effect when rapid succession combo triggers
  useEffect(() => {
    if (combo >= 2) {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      setDisplayedCombo(combo);
      setIsShowingCombo(true);
      comboScaleAnim.setValue(0.35);
      comboFloatAnim.setValue(0);
      comboOpacityAnim.setValue(1);

      Animated.parallel([
        // Energetic spring pop
        Animated.spring(comboScaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 140,
          useNativeDriver: true,
        }),
        // Upward floating glide motion
        Animated.timing(comboFloatAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ]).start();

      // Graceful dissipation fade after 1.4s (within the rapid succession window)
      fadeTimeoutRef.current = setTimeout(() => {
        Animated.timing(comboOpacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          setIsShowingCombo(false);
        });
      }, 1400);
    } else {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      // Smoothly dissolve out when combo drops below 2
      Animated.timing(comboOpacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsShowingCombo(false);
      });
    }

    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [combo, comboScaleAnim, comboFloatAnim, comboOpacityAnim]);

  // Generate grid background cells
  const gridCells = useMemo(() => {
    const cells = [];
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        cells.push({ row: r, col: c, key: `${r}_${c}` });
      }
    }
    return cells;
  }, [boardSize]);

  // Trigger shockwave & sparks on collision
  useEffect(() => {
    if (blockedArrowId && effectsManagerRef.current) {
      const blockedArrow = activeArrows.find((a) => a.id === blockedArrowId);
      if (blockedArrow) {
        const x = (blockedArrow.col + 0.5) * cellSize;
        const y = (blockedArrow.row + 0.5) * cellSize;
        effectsManagerRef.current.spawnCollisionImpact(x, y, true);
      }
    }
  }, [blockedArrowId, activeArrows, cellSize]);

  // Trigger flight thrust particles when arrow begins exiting
  useEffect(() => {
    if (exitingArrowIds.size > 0 && effectsManagerRef.current) {
      exitingArrowIds.forEach((id) => {
        const exiting = activeArrows.find((a) => a.id === id);
        if (exiting) {
          const x = (exiting.col + 0.5) * cellSize;
          const y = (exiting.row + 0.5) * cellSize;
          effectsManagerRef.current.spawnFlightSparks(x, y, exiting.dir);
        }
      });
    }
  }, [exitingArrowIds, activeArrows, cellSize]);

  // GameEngine ECS System: updates particles & visual effects every 60fps tick
  const EffectsSystem = (entities, { time }) => {
    if (effectsManagerRef.current) {
      effectsManagerRef.current.update(time.delta || 16.6);
    }
    return entities;
  };

  // GameEngine entities configuration
  const entities = useMemo(
    () => ({
      effects: {
        effects: effectsManagerRef.current,
        width: boardDimension,
        height: boardDimension,
        renderer: EffectsOverlayRenderer,
      },
    }),
    [boardDimension]
  );

  const isResolving = exitingArrowIds.size > 0;

  return (
    <View style={[styles.outerContainer, isShort && { marginVertical: 3 }]}>
      {/* Floating 3D Combo Streak Text (Only displays on rapid succession multi-clicks) */}
      {isShowingCombo && displayedCombo >= 2 && (
        <Animated.View
          style={[
            styles.comboFloater,
            {
              opacity: comboOpacityAnim,
              transform: [
                { scale: comboScaleAnim },
                {
                  translateY: comboFloatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, -26],
                  }),
                },
                {
                  rotate: comboFloatAnim.interpolate({
                    inputRange: [0, 0.45, 1],
                    outputRange: ['-5deg', '3deg', '0deg'],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <ThreeDText
            text={
              displayedCombo >= 5
                ? `🔥 ULTRA COMBO x${displayedCombo}!`
                : displayedCombo >= 4
                ? `⚡ MEGA COMBO x${displayedCombo}!`
                : displayedCombo === 3
                ? `✨ SUPER COMBO x${displayedCombo}!`
                : `COMBO x${displayedCombo}!`
            }
            size={isNarrow ? 19 : isShort ? 21 : 24}
            color={displayedCombo >= 5 ? '#FFF1F2' : displayedCombo >= 3 ? '#FFFBEB' : '#F0F9FF'}
            depthColor={displayedCombo >= 5 ? '#BE123C' : displayedCombo >= 3 ? '#D97706' : '#0284C7'}
            strokeColor={displayedCombo >= 5 ? '#4C0519' : displayedCombo >= 3 ? '#78350F' : '#082F49'}
            depth={3}
            textStyle={[
              styles.comboText,
              {
                textShadowColor:
                  displayedCombo >= 5
                    ? 'rgba(255, 42, 109, 0.85)'
                    : displayedCombo >= 3
                    ? 'rgba(245, 158, 11, 0.85)'
                    : 'rgba(56, 189, 248, 0.85)',
              },
            ]}
          />
        </Animated.View>
      )}

      {/* 2D Slab Drop Shadow */}
      <View
        style={[
          styles.shadowBase,
          {
            width: boardDimension + 22,
            height: boardDimension + 22,
            borderRadius: 26,
          },
        ]}
      />

      {/* Main 2D Beveled Stone Puzzle Slab */}
      <LinearGradient
        colors={['#1E293B', '#111B2E', '#0B1222']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.stoneBoard,
          {
            width: boardDimension + 20,
            height: boardDimension + 20,
            borderRadius: 24,
          },
        ]}
      >
        {/* Beveled Top Edge Highlight */}
        <View style={styles.topBevelHighlight} />

        {/* Central Circular Accent Ring */}
        <View
          style={[
            styles.centralRingAccent,
            {
              width: cellSize * 2 + 8,
              height: cellSize * 2 + 8,
              borderRadius: (cellSize * 2 + 8) / 2,
            },
          ]}
          pointerEvents="none"
        />

        {/* Recessed Socket Grid */}
        <View style={[styles.gridContainer, { width: boardDimension, height: boardDimension }]}>
          {gridCells.map((cell) => {
            const socketPadding = Math.max(2, Math.floor(cellSize * 0.05));
            const socketSize = cellSize - socketPadding * 2;
            const socketRadius = Math.max(8, Math.floor(socketSize * 0.24));
            const rivetSize = Math.max(3, Math.floor(socketSize * 0.1));

            return (
              <View
                key={cell.key}
                pointerEvents="none"
                style={[
                  styles.gridSlot,
                  {
                    position: 'absolute',
                    top: cell.row * cellSize,
                    left: cell.col * cellSize,
                    width: cellSize,
                    height: cellSize,
                    padding: socketPadding,
                  },
                ]}
              >
                {/* Recessed Socket Well */}
                <View
                  style={[
                    styles.socketWell,
                    {
                      width: socketSize,
                      height: socketSize,
                      borderRadius: socketRadius,
                    },
                  ]}
                >
                  {/* Concentric Concave Ring */}
                  <View
                    style={[
                      styles.concaveRing,
                      {
                        width: socketSize * 0.72,
                        height: socketSize * 0.72,
                        borderRadius: (socketSize * 0.72) / 2,
                      },
                    ]}
                  />

                  {/* Brass/Teal Center Rivet */}
                  <View
                    style={[
                      styles.rivetPin,
                      {
                        width: rivetSize,
                        height: rivetSize,
                        borderRadius: rivetSize / 2,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}

          {/* Active & Exiting 2D Graphical Arrows */}
          {activeArrows.map((arrow) => {
            const isExiting = exitingArrowIds.has(arrow.id);
            const isBlocked = blockedArrowId === arrow.id;
            const isBlocking = blockingArrowId === arrow.id;
            const isHinted = hintArrowId === arrow.id;

            return (
              <View
                key={arrow.id}
                style={[
                  styles.arrowPositioner,
                  {
                    top: arrow.row * cellSize,
                    left: arrow.col * cellSize,
                    width: cellSize,
                    height: cellSize,
                  },
                ]}
              >
                <Arrow
                  arrow={arrow}
                  cellSize={cellSize}
                  theme={theme}
                  isBlocked={isBlocked}
                  isBlocking={isBlocking}
                  isHinted={isHinted}
                  isExiting={isExiting}
                  isResolving={isResolving}
                  zone={zone}
                  onPress={onArrowPress}
                />
              </View>
            );
          })}

          {/* React Native Game Engine Overlay Wrapped in pointerEvents="none" so touches pass through to arrows */}
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.gameEngineOverlay]}>
            <GameEngine
              ref={engineRef}
              systems={[EffectsSystem]}
              entities={entities}
              style={StyleSheet.absoluteFill}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
});

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    position: 'relative',
  },
  shadowBase: {
    position: 'absolute',
    top: 6,
    backgroundColor: '#020617',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 10,
  },
  stoneBoard: {
    padding: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  topBevelHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '22%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  centralRingAccent: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.16)',
    zIndex: 1,
  },
  gridContainer: {
    position: 'relative',
    overflow: 'visible',
    zIndex: 2,
  },
  gridSlot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  socketWell: {
    backgroundColor: '#0B1222',
    borderWidth: 1,
    borderColor: '#060B15',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  concaveRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.08)',
    backgroundColor: '#0A1020',
  },
  rivetPin: {
    backgroundColor: '#38BDF8',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  arrowPositioner: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  gameEngineOverlay: {
    zIndex: 10,
  },
  comboFloater: {
    position: 'absolute',
    top: -46,
    zIndex: 60,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  comboText: {
    fontStyle: 'italic',
    letterSpacing: 2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
