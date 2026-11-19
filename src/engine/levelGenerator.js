import { DIRECTIONS } from '../utils/constants.js';
import { validatePuzzle } from './puzzleEngine.js';

// Mulberry32 deterministic PRNG
function createPRNG(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Checks if a ray from (row, col) in direction `dir` to the board edge is free of arrows.
 */
function isRayClear(row, col, dir, boardSize, arrows) {
  if (dir === DIRECTIONS.UP) {
    for (let r = row - 1; r >= 0; r--) {
      if (arrows.some((a) => a.row === r && a.col === col)) return false;
    }
  } else if (dir === DIRECTIONS.DOWN) {
    for (let r = row + 1; r < boardSize; r++) {
      if (arrows.some((a) => a.row === r && a.col === col)) return false;
    }
  } else if (dir === DIRECTIONS.LEFT) {
    for (let c = col - 1; c >= 0; c--) {
      if (arrows.some((a) => a.row === row && a.col === c)) return false;
    }
  } else if (dir === DIRECTIONS.RIGHT) {
    for (let c = col + 1; c < boardSize; c++) {
      if (arrows.some((a) => a.row === row && a.col === c)) return false;
    }
  }
  return true;
}

/**
 * Generates a guaranteed-solvable puzzle using reverse construction.
 * In reverse construction, we place arrows that have a clear path to the edge at the time of placement.
 * Then later arrows placed can block earlier arrows, creating rich, deep dependency chains!
 *
 * @param {number} boardSize - 4, 5, 6, 7, or 8
 * @param {number} targetArrowCount - Number of arrows to place
 * @param {number | string} seed - Seed for reproducibility
 * @returns {Object} { boardSize, arrows, arrowCount, solution }
 */
export function generatePuzzle(boardSize, targetArrowCount, seed = 12345) {
  const numericSeed =
    typeof seed === 'string'
      ? seed.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0)
      : seed;
  const rng = createPRNG(numericSeed);

  const maxAttempts = 10;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const arrows = [];
    const allDirs = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT];

    for (let count = 0; count < targetArrowCount; count++) {
      // Find all candidate empty cells and directions
      const candidates = [];

      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          // Check if cell is empty
          if (arrows.some((a) => a.row === r && a.col === c)) continue;

          for (const dir of allDirs) {
            if (isRayClear(r, c, dir, boardSize, arrows)) {
              candidates.push({ row: r, col: c, dir });
            }
          }
        }
      }

      if (candidates.length === 0) {
        // No more candidates, break early if we have enough arrows
        break;
      }

      // Pick a candidate with PRNG
      const chosenIndex = Math.floor(rng() * candidates.length);
      const chosen = candidates[chosenIndex];

      arrows.push({
        id: `arrow_${count + 1}`,
        row: chosen.row,
        col: chosen.col,
        dir: chosen.dir,
      });
    }

    // Validate the generated puzzle
    const validation = validatePuzzle(boardSize, arrows);
    if (validation.solvable && arrows.length >= Math.min(targetArrowCount - 2, boardSize * 2)) {
      return {
        boardSize,
        arrows,
        arrowCount: arrows.length,
        solution: validation.steps,
      };
    }
  }

  // Fallback simple guaranteed pattern if random search failed
  return generateFallbackPuzzle(boardSize);
}

function generateFallbackPuzzle(boardSize) {
  const arrows = [];
  let id = 1;
  // Edge arrows pointing outwards
  for (let i = 0; i < boardSize; i++) {
    arrows.push({ id: `arrow_${id++}`, row: 0, col: i, dir: DIRECTIONS.UP });
    arrows.push({ id: `arrow_${id++}`, row: boardSize - 1, col: i, dir: DIRECTIONS.DOWN });
  }
  for (let r = 1; r < boardSize - 1; r++) {
    arrows.push({ id: `arrow_${id++}`, row: r, col: 0, dir: DIRECTIONS.LEFT });
    arrows.push({ id: `arrow_${id++}`, row: r, col: boardSize - 1, dir: DIRECTIONS.RIGHT });
  }
  const validation = validatePuzzle(boardSize, arrows);
  return {
    boardSize,
    arrows,
    arrowCount: arrows.length,
    solution: validation.steps,
  };
}

/**
 * Returns parameters for level N (1-50):
 * Levels 1–10: Beginner, 4x4 board (4 to 10 arrows)
 * Levels 11–20: Easy, 5x5 board (10 to 18 arrows)
 * Levels 21–30: Medium, 6x6 board (16 to 26 arrows)
 * Levels 31–40: Hard, 7x7 board (24 to 36 arrows)
 * Levels 41–50: Expert, 8x8 board (32 to 48 arrows)
 */
export function getLevelParams(levelNumber) {
  if (levelNumber <= 10) {
    // 4x4: Arrow count grows from 5 to 11
    const size = 4;
    const arrowCount = 4 + Math.floor((levelNumber * 7) / 10);
    return { boardSize: size, arrowCount, difficulty: 'Beginner' };
  } else if (levelNumber <= 20) {
    // 5x5: Arrow count grows from 10 to 18
    const size = 5;
    const idx = levelNumber - 10;
    const arrowCount = 10 + Math.floor((idx * 8) / 10);
    return { boardSize: size, arrowCount, difficulty: 'Easy' };
  } else if (levelNumber <= 30) {
    // 6x6: Arrow count grows from 16 to 26
    const size = 6;
    const idx = levelNumber - 20;
    const arrowCount = 16 + Math.floor((idx * 10) / 10);
    return { boardSize: size, arrowCount, difficulty: 'Medium' };
  } else if (levelNumber <= 40) {
    // 7x7: Arrow count grows from 22 to 34
    const size = 7;
    const idx = levelNumber - 30;
    const arrowCount = 22 + Math.floor((idx * 12) / 10);
    return { boardSize: size, arrowCount, difficulty: 'Hard' };
  } else {
    // 8x8: Arrow count grows from 30 to 46
    const size = 8;
    const idx = levelNumber - 40;
    const arrowCount = 30 + Math.floor((idx * 16) / 10);
    return { boardSize: size, arrowCount, difficulty: 'Expert' };
  }
}

/**
 * Generate or retrieve level by number (1..50).
 */
export function getLevel(levelNumber) {
  const { boardSize, arrowCount, difficulty } = getLevelParams(levelNumber);
  // Use a well-distributed prime seed multiplier
  const seed = levelNumber * 104729 + 7919;
  const puzzle = generatePuzzle(boardSize, arrowCount, seed);
  return {
    levelNumber,
    difficulty,
    boardSize: puzzle.boardSize,
    arrows: puzzle.arrows,
    arrowCount: puzzle.arrowCount,
    optimalMoves: puzzle.arrowCount,
  };
}

/**
 * Generate a unique Daily Challenge puzzle based on date string (YYYY-MM-DD).
 */
export function getDailyPuzzle(dateString) {
  // Use date to determine difficulty (cycles through 5x5, 6x6, 7x7)
  const hash = dateString.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const size = 5 + (hash % 3); // 5, 6, or 7
  const arrowCount = size === 5 ? 14 : size === 6 ? 22 : 30;
  const puzzle = generatePuzzle(size, arrowCount, `daily_${dateString}`);
  return {
    date: dateString,
    levelNumber: 'Daily',
    difficulty: size === 5 ? 'Easy' : size === 6 ? 'Medium' : 'Hard',
    boardSize: puzzle.boardSize,
    arrows: puzzle.arrows,
    arrowCount: puzzle.arrowCount,
    optimalMoves: puzzle.arrowCount,
  };
}
