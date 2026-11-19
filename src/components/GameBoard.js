import React from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Arrow } from './Arrow.js';

export const GameBoard = React.memo(function GameBoard({
  boardSize = 4,
  activeArrows = [],
  exitingArrowIds = new Set(),
  blockedArrowId = null,
  blockingArrowId = null,
  hintArrowId = null,
  onArrowPress,
  theme,
}) {
  const { width, height } = useWindowDimensions();

  // Responsive board sizing: fits comfortably on small and large screens
  const maxBoardDim = Math.min(width - 32, height * 0.52, 420);
  const cellSize = Math.floor(maxBoardDim / boardSize);
  const boardDimension = cellSize * boardSize;

  // Generate grid background cells
  const gridCells = [];
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      gridCells.push({ row: r, col: c, key: `${r}_${c}` });
    }
  }

  // Check if a cell is in the central 2x2 zone
  const midStart = Math.floor((boardSize - 2) / 2);
  const midEnd = midStart + 1;

  return (
    <View style={styles.outerContainer}>
      {/* 3D Slab Drop Shadow */}
      <View
        style={[
          styles.shadowBase,
          {
            width: boardDimension + 22,
            height: boardDimension + 22,
            borderRadius: 30,
          },
        ]}
      />

      {/* Main Chunky Stone Puzzle Slab (Matching Reference Image 2) */}
      <LinearGradient
        colors={['#6B5C52', '#52453C', '#3E342D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.stoneBoard,
          {
            width: boardDimension + 20,
            height: boardDimension + 20,
            borderRadius: 28,
          },
        ]}
      >
        {/* Beveled Top Edge Highlight */}
        <View style={styles.topBevelHighlight} />

        {/* Central Circular Golden Accent Ring for Center Cells */}
        <View
          style={[
            styles.centralRingAccent,
            {
              width: cellSize * 2 + 10,
              height: cellSize * 2 + 10,
              borderRadius: (cellSize * 2 + 10) / 2,
            },
          ]}
          pointerEvents="none"
        />

        {/* Recessed Socket Grid */}
        <View style={[styles.gridContainer, { width: boardDimension, height: boardDimension }]}>
          {gridCells.map((cell) => {
            const socketPadding = Math.max(2, Math.floor(cellSize * 0.06));
            const socketSize = cellSize - socketPadding * 2;
            const socketRadius = Math.max(8, Math.floor(socketSize * 0.26));
            const rivetSize = Math.max(4, Math.floor(socketSize * 0.12));

            return (
              <View
                key={cell.key}
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

                  {/* Copper/Brass Rivet Center Pin */}
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

          {/* Active & Exiting 3D Arrows */}
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
                  onPress={onArrowPress}
                />
              </View>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
});

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  shadowBase: {
    position: 'absolute',
    top: 8,
    backgroundColor: '#1C1510',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 12,
  },
  stoneBoard: {
    padding: 10,
    borderWidth: 2.5,
    borderColor: '#7F6E62',
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
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  centralRingAccent: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255, 209, 59, 0.45)',
    borderStyle: 'dashed',
    zIndex: 1,
  },
  gridContainer: {
    position: 'relative',
    overflow: 'visible', // Allow exit animations to fly smoothly outside bounds
    zIndex: 2,
  },
  gridSlot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  socketWell: {
    backgroundColor: '#271F1A',
    borderWidth: 1.5,
    borderColor: '#181310',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  concaveRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.45)',
    backgroundColor: '#201A16',
  },
  rivetPin: {
    backgroundColor: '#B8860B',
    borderWidth: 1,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 2,
  },
  arrowPositioner: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
