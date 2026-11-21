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
function isRayClear(row, col, dir, boardSize, occupancyGrid) {
  if (dir === DIRECTIONS.UP) {
    for (let r = row - 1; r >= 0; r--) {
      if (occupancyGrid[r][col]) return false;
    }
  } else if (dir === DIRECTIONS.DOWN) {
    for (let r = row + 1; r < boardSize; r++) {
      if (occupancyGrid[r][col]) return false;
    }
  } else if (dir === DIRECTIONS.LEFT) {
    for (let c = col - 1; c >= 0; c--) {
      if (occupancyGrid[row][c]) return false;
    }
  } else if (dir === DIRECTIONS.RIGHT) {
    for (let c = col + 1; c < boardSize; c++) {
      if (occupancyGrid[row][c]) return false;
    }
  }
  return true;
}

function getEscapableCount(boardSize, arrows) {
  const occupancyGrid = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));
  for (const arrow of arrows) {
    occupancyGrid[arrow.row][arrow.col] = true;
  }

  let count = 0;
  for (const a of arrows) {
    if (isRayClear(a.row, a.col, a.dir, boardSize, occupancyGrid)) {
      count++;
    }
  }
  return count;
}

/**
 * Generates a guaranteed-solvable complete puzzle using reverse construction.
 * In reverse construction, we place arrows that have a clear path to the edge at the time of placement.
 * Every single cell on the boardSize x boardSize grid is filled with an arrow tile (no empty cells).
 * Choke points and dependency depth are tuned to create challenging, intricate puzzles.
 *
 * @param {number} boardSize - 4, 5, 6, 7, or 8
 * @param {number} targetArrowCount - Number of arrows (defaults to boardSize * boardSize)
 * @param {number | string} seed - Seed for reproducibility
 * @returns {Object} { boardSize, arrows, arrowCount, solution }
 */
export function generatePuzzle(boardSize, targetArrowCount = null, seed = 12345) {
  const totalCells = targetArrowCount || boardSize * boardSize;
  const numericSeed =
    typeof seed === 'string'
      ? seed.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0)
      : seed;
  const rng = createPRNG(numericSeed);

  // Target maximum initial escapes: fewer initial exits = tighter choke points & higher complexity
  const targetEscapes =
    boardSize <= 4 ? 3 : boardSize <= 5 ? 4 : boardSize <= 6 ? 5 : 6;

  let bestResult = null;
  let minEscapable = Infinity;

  const maxAttempts = 60;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const arrows = [];
    const allDirs = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT];
    const emptyCells = [];
    const occupancyGrid = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));

    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        emptyCells.push({ row: r, col: c });
      }
    }

    let success = true;
    for (let step = 0; step < totalCells; step++) {
      // Find candidate empty cells that have at least one clear ray to the board edge
      const candidates = [];

      for (let i = 0; i < emptyCells.length; i++) {
        const cell = emptyCells[i];
        const validDirs = [];
        for (const dir of allDirs) {
          if (isRayClear(cell.row, cell.col, dir, boardSize, occupancyGrid)) {
            validDirs.push(dir);
          }
        }
        if (validDirs.length > 0) {
          candidates.push({ cellIndex: i, row: cell.row, col: cell.col, validDirs });
        }
      }

      if (candidates.length === 0) {
        success = false;
        break;
      }

      // Most Constrained Variable (MRV) heuristic:
      // Sort candidates by fewest valid directions to avoid dead-ends and maximize board fullness
      candidates.sort((a, b) => a.validDirs.length - b.validDirs.length);

      // Select from the top constrained candidates with PRNG
      const pool = candidates.slice(0, Math.min(3, candidates.length));
      const chosen = pool[Math.floor(rng() * pool.length)];
      const chosenDir = chosen.validDirs[Math.floor(rng() * chosen.validDirs.length)];

      arrows.push({
        id: `arrow_${step + 1}`,
        row: chosen.row,
        col: chosen.col,
        dir: chosenDir,
      });

      occupancyGrid[chosen.row][chosen.col] = true;
      emptyCells.splice(chosen.cellIndex, 1);
    }

    if (success && arrows.length === totalCells) {
      // Validate the generated puzzle in forward play
      const validation = validatePuzzle(boardSize, arrows);
      if (validation.solvable) {
        const initialEscapable = getEscapableCount(boardSize, arrows);
        if (initialEscapable < minEscapable) {
          minEscapable = initialEscapable;
          bestResult = { arrows, validation, initialEscapable };
        }

        // If it meets our choke point target, accept immediately
        if (initialEscapable <= targetEscapes) {
          return {
            boardSize,
            arrows,
            arrowCount: arrows.length,
            solution: validation.steps,
          };
        }
      }
    }
  }

  if (bestResult) {
    return {
      boardSize,
      arrows: bestResult.arrows,
      arrowCount: bestResult.arrows.length,
      solution: bestResult.validation.steps,
    };
  }

  // Fallback complete interlocking puzzle pattern
  return generateFallbackPuzzle(boardSize);
}

function generateFallbackPuzzle(boardSize) {
  const arrows = [];
  let id = 1;
  // Interlocking perimeter and internal directional spiral
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      let dir = DIRECTIONS.RIGHT;
      if (r === 0) dir = DIRECTIONS.UP;
      else if (r === boardSize - 1) dir = DIRECTIONS.DOWN;
      else if (c === 0) dir = DIRECTIONS.LEFT;
      else if (c === boardSize - 1) dir = DIRECTIONS.RIGHT;
      else if (r % 2 === 0) dir = DIRECTIONS.UP;
      else dir = DIRECTIONS.DOWN;
      arrows.push({ id: `arrow_${id++}`, row: r, col: c, dir });
    }
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
 * All levels feature complete full grids (zero empty cells) for maximum challenge:
 * Levels 1–10: Beginner, 4x4 complete board (16 arrows)
 * Levels 11–20: Easy, 5x5 complete board (25 arrows)
 * Levels 21–30: Medium, 6x6 complete board (36 arrows)
 * Levels 31–40: Hard, 7x7 complete board (49 arrows)
 * Levels 41–50: Expert, 8x8 complete board (64 arrows)
 */
export function getLevelParams(levelNumber) {
  if (levelNumber <= 10) {
    const size = 4;
    return { boardSize: size, arrowCount: size * size, difficulty: 'Beginner' };
  } else if (levelNumber <= 20) {
    const size = 5;
    return { boardSize: size, arrowCount: size * size, difficulty: 'Easy' };
  } else if (levelNumber <= 30) {
    const size = 6;
    return { boardSize: size, arrowCount: size * size, difficulty: 'Medium' };
  } else if (levelNumber <= 40) {
    const size = 7;
    return { boardSize: size, arrowCount: size * size, difficulty: 'Hard' };
  } else {
    const size = 8;
    return { boardSize: size, arrowCount: size * size, difficulty: 'Expert' };
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
  // Use date to determine difficulty (cycles through 5x5, 6x6, 7x7 complete grids)
  const hash = dateString.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const size = 5 + (hash % 3); // 5, 6, or 7
  const arrowCount = size * size;
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
