import { useState, useEffect, useRef, useCallback } from 'react';
import { getLevelData, getDailyPuzzle } from '../engine/levelData.js';
import { checkArrowMove, getBestHintArrow } from '../engine/collisionDetection.js';
import { calculateStars } from '../engine/puzzleEngine.js';
import { soundManager } from '../utils/sound.js';
import { StorageService } from '../utils/storage.js';

export function useGame() {
  const [levelNumber, setLevelNumber] = useState(1);
  const [isDaily, setIsDaily] = useState(false);
  const [dailyDate, setDailyDate] = useState('');
  const [levelData, setLevelData] = useState(null);

  const [activeArrows, setActiveArrows] = useState([]);
  const [exitingArrowIds, setExitingArrowIds] = useState(new Set());
  const [undoStack, setUndoStack] = useState([]);

  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stars, setStars] = useState(0);

  const [blockedArrowId, setBlockedArrowId] = useState(null);
  const [blockingArrowId, setBlockingArrowId] = useState(null);
  const [hintArrowId, setHintArrowId] = useState(null);

  const timerRef = useRef(null);
  const resolutionTimerRef = useRef(null);
  const blockedTimeoutRef = useRef(null);
  const hintTimeoutRef = useRef(null);
  const resolvingRef = useRef(false);
  const gameSessionRef = useRef(0);

  useEffect(() => () => {
    if (resolutionTimerRef.current) clearTimeout(resolutionTimerRef.current);
    if (blockedTimeoutRef.current) clearTimeout(blockedTimeoutRef.current);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
  }, []);

  // Timer interval
  useEffect(() => {
    if (isPlaying && !isPaused && !isCompleted) {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPaused, isCompleted]);

  // Load level
  const loadLevel = useCallback((lvl, isDailyChallenge = false, customDate = '') => {
    gameSessionRef.current += 1;
    if (resolutionTimerRef.current) clearTimeout(resolutionTimerRef.current);
    if (blockedTimeoutRef.current) clearTimeout(blockedTimeoutRef.current);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    resolvingRef.current = false;

    let data;
    if (isDailyChallenge) {
      const today = customDate || new Date().toISOString().split('T')[0];
      data = getDailyPuzzle(today);
      setIsDaily(true);
      setDailyDate(today);
      setLevelNumber('Daily');
    } else {
      const safeLvl = Math.max(1, Math.min(50, Number(lvl) || 1));
      data = getLevelData(safeLvl);
      setIsDaily(false);
      setDailyDate('');
      setLevelNumber(safeLvl);
    }

    setLevelData(data);
    setActiveArrows([...data.arrows]);
    setExitingArrowIds(new Set());
    setUndoStack([]);
    setMoves(0);
    setTimer(0);
    setIsPlaying(true);
    setIsPaused(false);
    setIsCompleted(false);
    setStars(0);
    setBlockedArrowId(null);
    setBlockingArrowId(null);
    setHintArrowId(null);
  }, []);

  // Handle arrow tap
  const handleArrowPress = useCallback(
    (arrowId) => {
      if (isCompleted || isPaused || resolvingRef.current || exitingArrowIds.has(arrowId)) return;

      // Clear any active hint
      if (hintArrowId) setHintArrowId(null);

      const arrow = activeArrows.find((a) => a.id === arrowId);
      if (!arrow || !levelData) return;

      const { canEscape, blockingArrow } = checkArrowMove(
        arrow,
        activeArrows,
        levelData.boardSize
      );

      if (!canEscape) {
        // Blocked! Provide sensory feedback and shake
        soundManager.playBlockedSound();
        setBlockedArrowId(arrow.id);
        if (blockingArrow) setBlockingArrowId(blockingArrow.id);

        // Reset shake after animation duration
        if (blockedTimeoutRef.current) clearTimeout(blockedTimeoutRef.current);
        blockedTimeoutRef.current = setTimeout(() => {
          setBlockedArrowId(null);
          setBlockingArrowId(null);
          blockedTimeoutRef.current = null;
        }, 500);
        return;
      }

      // Can escape!
      resolvingRef.current = true;
      soundManager.playEscapeSound();

      // Track undo
      setUndoStack((prev) => [
        ...prev,
        {
          arrow,
          prevActiveArrows: [...activeArrows],
          prevMoves: moves,
        },
      ]);

      // Mark arrow as exiting (triggers exit flight animation)
      setExitingArrowIds((prev) => new Set([...prev, arrow.id]));
      setMoves((m) => m + 1);
      const sessionId = gameSessionRef.current;

      // Remove from active after brief exit flight
      resolutionTimerRef.current = setTimeout(async () => {
        resolutionTimerRef.current = null;
        if (sessionId !== gameSessionRef.current) return;
        const updated = activeArrows.filter((a) => a.id !== arrow.id);
        setActiveArrows(updated);

        if (updated.length === 0) {
          const finalMoves = moves + 1;
          const earnedStars = calculateStars(finalMoves, levelData.arrowCount, timer);
          setIsPlaying(false);
          setStars(earnedStars);

          if (!isDaily && typeof levelNumber === 'number') {
            await StorageService.saveLevelResult(levelNumber, earnedStars, finalMoves, timer);
          } else if (isDaily && dailyDate) {
            await StorageService.recordDailyCompletion(dailyDate);
          }

          if (sessionId !== gameSessionRef.current) return;
          setIsCompleted(true);
          soundManager.playVictorySound();
        }

        setExitingArrowIds((prev) => {
          const next = new Set(prev);
          next.delete(arrow.id);
          return next;
        });
        resolvingRef.current = false;
      }, 350);
    },
    [
      isCompleted,
      isPaused,
      exitingArrowIds,
      hintArrowId,
      activeArrows,
      levelData,
      moves,
      timer,
      isDaily,
      dailyDate,
      levelNumber,
    ]
  );

  // Undo last move
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0 || isCompleted || isPaused || resolvingRef.current) return;

    soundManager.playClickSound();
    const lastEntry = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));

    // Restore arrows and state
    setActiveArrows(lastEntry.prevActiveArrows);
    setMoves(lastEntry.prevMoves);
    setExitingArrowIds(new Set());
    setBlockedArrowId(null);
    setBlockingArrowId(null);
    setHintArrowId(null);
  }, [undoStack, isCompleted, isPaused]);

  // Request a hint
  const handleHint = useCallback(() => {
    if (isCompleted || isPaused || resolvingRef.current || activeArrows.length === 0 || !levelData) return;

    soundManager.playClickSound();
    const best = getBestHintArrow(activeArrows, levelData.boardSize);
    if (best) {
      setHintArrowId(best.id);
      // Automatically clear hint after 3.5s
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = setTimeout(() => {
        setHintArrowId((curr) => (curr === best.id ? null : curr));
        hintTimeoutRef.current = null;
      }, 3500);
    }
  }, [isCompleted, isPaused, activeArrows, levelData]);

  // Restart level
  const handleRestart = useCallback(() => {
    soundManager.playClickSound();
    gameSessionRef.current += 1;
    if (resolutionTimerRef.current) clearTimeout(resolutionTimerRef.current);
    if (blockedTimeoutRef.current) clearTimeout(blockedTimeoutRef.current);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    resolvingRef.current = false;
    if (levelData) {
      setActiveArrows([...levelData.arrows]);
      setExitingArrowIds(new Set());
      setUndoStack([]);
      setMoves(0);
      setTimer(0);
      setIsPlaying(true);
      setIsPaused(false);
      setIsCompleted(false);
      setStars(0);
      setBlockedArrowId(null);
      setBlockingArrowId(null);
      setHintArrowId(null);
    }
  }, [levelData]);

  // Pause / Resume
  const togglePause = useCallback(() => {
    soundManager.playClickSound();
    setIsPaused((p) => !p);
  }, []);

  // Advance to next level
  const handleNextLevel = useCallback(() => {
    soundManager.playClickSound();
    if (typeof levelNumber === 'number' && levelNumber < 50) {
      loadLevel(levelNumber + 1);
    } else {
      loadLevel(1);
    }
  }, [levelNumber, loadLevel]);

  return {
    levelNumber,
    isDaily,
    dailyDate,
    levelData,
    activeArrows,
    exitingArrowIds,
    moves,
    timer,
    isPlaying,
    isPaused,
    isCompleted,
    stars,
    blockedArrowId,
    blockingArrowId,
    hintArrowId,
    canUndo: undoStack.length > 0 && !isCompleted && exitingArrowIds.size === 0,
    loadLevel,
    handleArrowPress,
    handleUndo,
    handleHint,
    handleRestart,
    togglePause,
    handleNextLevel,
  };
}
