import { DIRECTIONS } from '../utils/constants.js';

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

  const { row, col, dir, id } = arrow;
  const pathCells = [];
  let blockingArrow = null;

  // Find all other arrows on the board
  const otherArrows = activeArrows.filter((a) => a.id !== id);

  if (dir === DIRECTIONS.UP) {
    // Moves row - 1 down to 0
    for (let r = row - 1; r >= 0; r--) {
      pathCells.push({ row: r, col });
      const blocker = otherArrows.find((a) => a.row === r && a.col === col);
      if (blocker) {
        blockingArrow = blocker;
        break; // Stop at first obstacle
      }
    }
  } else if (dir === DIRECTIONS.DOWN) {
    // Moves row + 1 up to boardSize - 1
    for (let r = row + 1; r < boardSize; r++) {
      pathCells.push({ row: r, col });
      const blocker = otherArrows.find((a) => a.row === r && a.col === col);
      if (blocker) {
        blockingArrow = blocker;
        break;
      }
    }
  } else if (dir === DIRECTIONS.LEFT) {
    // Moves col - 1 down to 0
    for (let c = col - 1; c >= 0; c--) {
      pathCells.push({ row, col: c });
      const blocker = otherArrows.find((a) => a.row === row && a.col === c);
      if (blocker) {
        blockingArrow = blocker;
        break;
      }
    }
  } else if (dir === DIRECTIONS.RIGHT) {
    // Moves col + 1 up to boardSize - 1
    for (let c = col + 1; c < boardSize; c++) {
      pathCells.push({ row, col: c });
      const blocker = otherArrows.find((a) => a.row === row && a.col === c);
      if (blocker) {
        blockingArrow = blocker;
        break;
      }
    }
  }

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
  return activeArrows.filter((arrow) => {
    const { canEscape } = checkArrowMove(arrow, activeArrows, boardSize);
    return canEscape;
  });
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
    const remainingAfter = activeArrows.filter((a) => a.id !== arrow.id);
    const escapableAfter = getEscapableArrows(remainingAfter, boardSize);
    const freedCount = escapableAfter.length;

    if (freedCount > maxFreed) {
      maxFreed = freedCount;
      bestArrow = arrow;
    }
  }

  return bestArrow;
}
