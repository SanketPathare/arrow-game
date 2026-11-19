import { getLevel, getLevelParams, getDailyPuzzle } from './levelGenerator.js';

// Cache for levels so they only generate once per session
const levelCache = new Map();

export function getLevelData(levelNumber) {
  if (levelCache.has(levelNumber)) {
    return levelCache.get(levelNumber);
  }
  const level = getLevel(levelNumber);
  levelCache.set(levelNumber, level);
  return level;
}

export function getAllLevelsSummary() {
  const summaries = [];
  for (let i = 1; i <= 50; i++) {
    const params = getLevelParams(i);
    summaries.push({
      levelNumber: i,
      boardSize: params.boardSize,
      difficulty: params.difficulty,
      label: `${params.boardSize}x${params.boardSize}`,
    });
  }
  return summaries;
}

export { getDailyPuzzle };
