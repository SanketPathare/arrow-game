import React, { useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
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
  zone = 1,
  onArrowPress,
  theme,
}) {
  const { width, height } = useWindowDimensions();

  // Responsive board sizing: fits comfortably on small, medium, and large screens (phones, tablets, web)
  // Ensure the board slab (which adds 20-22px border & shadow) never exceeds viewport bounds minus safe margins
  const horizontalBound = Math.min(width - 36, 520);
  const verticalBound = Math.min(height * 0.48, 520);
  const maxBoardDim = Math.max(160, Math.min(horizontalBound, verticalBound));
  const cellSize = Math.floor(maxBoardDim / boardSize);
  const boardDimension = cellSize * boardSize;

  // Effects manager for 2D particles, shockwaves, and animations
  const effectsManagerRef = useRef(new EffectsManager());
  const engineRef = useRef(null);

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
    <View style={styles.outerContainer}>
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
});
