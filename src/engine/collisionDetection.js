import { DIRECTIONS } from '../utils/constants.js';

const DIRECTION_STEPS = {
  [DIRECTIONS.UP]: [-1, 0],
  [DIRECTIONS.DOWN]: [1, 0],
  [DIRECTIONS.LEFT]: [0, -1],
  [DIRECTIONS.RIGHT]: [0, 1],
};

function createOccupancyGrid(activeArrows, boardSize, excludedId) {
  const grid = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
  for (const arrow of activeArrows) {
    if (
      arrow.id !== excludedId &&
      arrow.row >= 0 &&
      arrow.row < boardSize &&
      arrow.col >= 0 &&
      arrow.col < boardSize &&
      grid[arrow.row][arrow.col] === null
    ) {
      grid[arrow.row][arrow.col] = arrow;
    }
  }
  return grid;
}

function findBlockingArrow(arrow, occupancyGrid, boardSize, pathCells) {
  const step = DIRECTION_STEPS[arrow.dir];
  if (!step) return null;

  let row = arrow.row + step[0];
  let col = arrow.col + step[1];
  while (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
    if (pathCells) pathCells.push({ row, col });
    const blocker = occupancyGrid[row][col];
    if (blocker && blocker.id !== arrow.id) return blocker;
    row += step[0];
    col += step[1];
  }
  return null;
}

/**
 * Checks if a specific arrow has a clear path to exit the board in its pointing direction.
 * @param {Object} arrow - { id, row, col, dir }
 * @param {Array} activeArrows - Array of all currently active/un-exited arrows
 * @param {number} boardSize - Size of grid (e.g., 4, 5, 6, 7, 8)
 * @returns {Object} - { canEscape: boolean, blockingArrow: Object | null, pathCells: Array }
 */
export function checkArrowMove(arrow, activeArrows, boardSize) {
  if (!arrow) {
    return { canEscape: false, blockingArrow: null, pathCells: [] };
  }

  const { id } = arrow;
  const pathCells = [];
  const occupancyGrid = createOccupancyGrid(activeArrows, boardSize, id);
  const blockingArrow = findBlockingArrow(arrow, occupancyGrid, boardSize, pathCells);

  return {
    canEscape: blockingArrow === null,
    blockingArrow,
    pathCells,
  };
}

/**
 * Returns an array of all arrows that currently have a clear path to escape.
 * @param {Array} activeArrows
 * @param {number} boardSize
 * @returns {Array} Array of escapable arrow objects
 */
export function getEscapableArrows(activeArrows, boardSize) {
  if (!activeArrows || activeArrows.length === 0) return [];
  const occupancyGrid = createOccupancyGrid(activeArrows, boardSize);
  return activeArrows.filter(
    (arrow) => !findBlockingArrow(arrow, occupancyGrid, boardSize)
  );
}

/**
 * Finds the optimal hint: an escapable arrow, optionally preferring
 * one that unlocks the most other blocked arrows!
 * @param {Array} activeArrows
 * @param {number} boardSize
 * @returns {Object | null}
 */
export function getBestHintArrow(activeArrows, boardSize) {
  const escapable = getEscapableArrows(activeArrows, boardSize);
  if (escapable.length === 0) return null;

  // Rate each escapable arrow by how many new arrows it frees up
  let bestArrow = escapable[0];
  let maxFreed = -1;

  for (const arrow of escapable) {
    const remainingGrid = createOccupancyGrid(activeArrows, boardSize, arrow.id);
    let freedCount = 0;
    for (const remainingArrow of activeArrows) {
      if (
        remainingArrow.id !== arrow.id &&
        !findBlockingArrow(remainingArrow, remainingGrid, boardSize)
      ) {
        freedCount += 1;
      }
    }

    if (freedCount > maxFreed) {
      maxFreed = freedCount;
      bestArrow = arrow;
    }
  }

  return bestArrow;
}
