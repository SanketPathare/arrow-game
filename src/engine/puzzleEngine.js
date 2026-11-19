import { checkArrowMove, getEscapableArrows } from './collisionDetection.js';

/**
 * Validates whether a puzzle configuration is 100% solvable.
 * Simulates clearing the board step-by-step.
 * @param {number} boardSize
 * @param {Array} arrows
 * @returns {Object} { solvable: boolean, steps: Array, remaining: Array }
 */
export function validatePuzzle(boardSize, arrows) {
  let currentArrows = [...arrows];
  const solutionOrder = [];

  while (currentArrows.length > 0) {
    const escapable = getEscapableArrows(currentArrows, boardSize);
    if (escapable.length === 0) {
      // Deadlock reached! The puzzle is NOT solvable.
      return {
        solvable: false,
        steps: solutionOrder,
        remaining: currentArrows,
      };
    }

    // Greedily remove the first escapable arrow
    const toRemove = escapable[0];
    solutionOrder.push(toRemove.id);
    currentArrows = currentArrows.filter((a) => a.id !== toRemove.id);
  }

  return {
    solvable: true,
    steps: solutionOrder,
    remaining: [],
  };
}

/**
 * Calculates star rating for a completed level.
 * @param {number} moves - Total moves taken (including blocked taps if counted)
 * @param {number} arrowCount - Total number of arrows (minimum possible moves)
 * @param {number} timeSeconds - Total elapsed seconds
 * @returns {number} 1, 2, or 3 stars
 */
export function calculateStars(moves, arrowCount, timeSeconds) {
  if (moves <= arrowCount) {
    return 3;
  }
  if (moves <= arrowCount + 2) {
    return 2;
  }
  return 1;
}

/**
 * Formats time in seconds to mm:ss
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
