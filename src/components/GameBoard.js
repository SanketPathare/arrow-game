import React, { useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameEngine } from 'react-native-game-engine';
import { Arrow } from './Arrow.js';
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
  const comboAnim = useRef(new Animated.Value(0)).current;

  // Animate combo banner popup when combo increases
  useEffect(() => {
    if (combo >= 2) {
      comboAnim.setValue(0);
      Animated.spring(comboAnim, {
        toValue: 1,
        speed: 28,
        bounciness: 14,
        useNativeDriver: true,
      }).start();
    }
  }, [combo, comboAnim]);

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
      {/* Dynamic Floating Combo Streak Banner */}
      {combo >= 2 && (
        <Animated.View
          style={[
            styles.comboFloater,
            {
              transform: [
                { scale: comboAnim },
                {
                  translateY: comboAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [6, -14],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={
              combo >= 5
                ? ['#F43F5E', '#BE123C']
                : combo >= 3
                ? ['#F59E0B', '#D97706']
                : ['#06B6D4', '#0891B2']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.comboFloaterGradient}
          >
            <Text style={styles.comboFloaterText}>
              {combo >= 5 ? '🔥 ULTRA ' : combo >= 3 ? '⚡ SUPER ' : '✨ '}COMBO x{combo}!
            </Text>
          </LinearGradient>
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
    top: -12,
    zIndex: 50,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  comboFloaterGradient: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  comboFloaterText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
