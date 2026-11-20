import { useState, useEffect, useRef, useCallback } from 'react';
import { getLevelData, getDailyPuzzle } from '../engine/levelData.js';
import { generatePuzzle } from '../engine/levelGenerator.js';
import { checkArrowMove, getBestHintArrow } from '../engine/collisionDetection.js';
import { calculateStars } from '../engine/puzzleEngine.js';
import { soundManager } from '../utils/sound.js';
import { StorageService } from '../utils/storage.js';

export function useGame() {
  const [levelNumber, setLevelNumber] = useState(1);
  const [isDaily, setIsDaily] = useState(false);
  const [dailyDate, setDailyDate] = useState('');
  const [levelData, setLevelData] = useState(null);

  // Blitz Rush mode state
  const [isBlitz, setIsBlitz] = useState(false);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzTimeRemaining, setBlitzTimeRemaining] = useState(60);
  const [blitzBoardsCleared, setBlitzBoardsCleared] = useState(0);

  // Tactical features: Combo
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  const [activeArrows, setActiveArrows] = useState([]);
  const [exitingArrowIds, setExitingArrowIds] = useState(new Set());
  const [undoStack, setUndoStack] = useState([]);

  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [stars, setStars] = useState(0);

  const [blockedArrowId, setBlockedArrowId] = useState(null);
  const [blockingArrowId, setBlockingArrowId] = useState(null);
  const [hintArrowId, setHintArrowId] = useState(null);

  // Lives system: 3 hearts per game, auto-restarts on 0 lives
  const [lives, setLives] = useState(3);
  const livesRef = useRef(3);

  // Hint limitation: maximum 2 hints per game
  const [hintsRemaining, setHintsRemaining] = useState(2);
  const hintsRemainingRef = useRef(2);

  const timerRef = useRef(null);
  const resolutionTimerRef = useRef(null);
  const blockedTimeoutRef = useRef(null);
  const hintTimeoutRef = useRef(null);
  const comboTimeoutRef = useRef(null);
  const autoRestartTimerRef = useRef(null);
  const comboRef = useRef(0);
  const resolvingRef = useRef(false);
  const gameSessionRef = useRef(0);

  // 1.6s rapid succession window - delay beyond this resets combo to 0
  const COMBO_WINDOW_MS = 1600;

  const blitzScoreRef = useRef(blitzScore);
  const blitzBoardsClearedRef = useRef(blitzBoardsCleared);
  const maxComboRef = useRef(maxCombo);

  useEffect(() => {
    blitzScoreRef.current = blitzScore;
    blitzBoardsClearedRef.current = blitzBoardsCleared;
    maxComboRef.current = maxCombo;
  }, [blitzScore, blitzBoardsCleared, maxCombo]);

  useEffect(() => () => {
    if (resolutionTimerRef.current) clearTimeout(resolutionTimerRef.current);
    if (blockedTimeoutRef.current) clearTimeout(blockedTimeoutRef.current);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
  }, []);

  // Standard timer interval (for Campaign & Daily)
  useEffect(() => {
    if (isPlaying && !isPaused && !isCompleted && !isGameOver && !isBlitz) {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPaused, isCompleted, isGameOver, isBlitz]);

  // Blitz countdown timer interval
  useEffect(() => {
    let blitzInterval = null;
    if (isPlaying && !isPaused && !isCompleted && isBlitz) {
      blitzInterval = setInterval(() => {
        setBlitzTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(blitzInterval);
            setIsPlaying(false);
            setIsCompleted(true);
            soundManager.playVictorySound();
            StorageService.saveBlitzResult(
              blitzScoreRef.current,
              blitzBoardsClearedRef.current,
              maxComboRef.current
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (blitzInterval) clearInterval(blitzInterval);
    };
  }, [isPlaying, isPaused, isCompleted, isBlitz]);

  // Load level (Campaign or Daily)
  const loadLevel = useCallback((lvl, isDailyChallenge = false, customDate = '') => {
    gameSessionRef.current += 1;
    if (resolutionTimerRef.current) clearTimeout(resolutionTimerRef.current);
    if (blockedTimeoutRef.current) clearTimeout(blockedTimeoutRef.current);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
      comboTimeoutRef.current = null;
    }
    comboRef.current = 0;
    resolvingRef.current = false;

    // Reset lives and hints
    livesRef.current = 3;
    setLives(3);
    hintsRemainingRef.current = 2;
    setHintsRemaining(2);

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

    setIsBlitz(false);
    setBlitzScore(0);
    setBlitzTimeRemaining(60);
    setBlitzBoardsCleared(0);

    setCombo(0);
    setMaxCombo(0);

    setLevelData(data);
    setActiveArrows([...data.arrows]);
    setExitingArrowIds(new Set());
    setUndoStack([]);
    setMoves(0);
    setTimer(0);
    setIsPlaying(true);
    setIsPaused(false);
    setIsCompleted(false);
    setIsGameOver(false);
    setStars(0);
    setBlockedArrowId(null);
    setBlockingArrowId(null);
    setHintArrowId(null);
  }, []);

  // Load 60-Second Blitz Rush Mode
  const loadBlitz = useCallback(() => {
    gameSessionRef.current += 1;
    if (resolutionTimerRef.current) clearTimeout(resolutionTimerRef.current);
    if (blockedTimeoutRef.current) clearTimeout(blockedTimeoutRef.current);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
      comboTimeoutRef.current = null;
    }
    comboRef.current = 0;
    resolvingRef.current = false;

    // Reset lives and hints
    livesRef.current = 3;
    setLives(3);
    hintsRemainingRef.current = 2;
    setHintsRemaining(2);

    // Initial 4x4 fast puzzle (all 16 cells filled)
    const puzzle = generatePuzzle(4, 16, Date.now());
    setIsBlitz(true);
    setIsDaily(false);
    setDailyDate('');
    setLevelNumber('Blitz');
    setBlitzScore(0);
    setBlitzTimeRemaining(60);
    setBlitzBoardsCleared(0);

    setCombo(0);
    setMaxCombo(0);

    setLevelData(puzzle);
    setActiveArrows([...puzzle.arrows]);
    setExitingArrowIds(new Set());
    setUndoStack([]);
    setMoves(0);
    setTimer(0);
    setIsPlaying(true);
    setIsPaused(false);
    setIsCompleted(false);
    setIsGameOver(false);
    setStars(0);
    setBlockedArrowId(null);
    setBlockingArrowId(null);
    setHintArrowId(null);
  }, []);

  // Restart level
  const handleRestart = useCallback(() => {
    soundManager.playClickSound();
    gameSessionRef.current += 1;
    if (resolutionTimerRef.current) clearTimeout(resolutionTimerRef.current);
    if (blockedTimeoutRef.current) clearTimeout(blockedTimeoutRef.current);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    if (autoRestartTimerRef.current) clearTimeout(autoRestartTimerRef.current);
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
      comboTimeoutRef.current = null;
    }
    comboRef.current = 0;
    resolvingRef.current = false;

    // Reset lives and hints
    livesRef.current = 3;
    setLives(3);
    hintsRemainingRef.current = 2;
    setHintsRemaining(2);

    if (isBlitz) {
      loadBlitz();
      return;
    }

    if (levelData) {
      setActiveArrows([...levelData.arrows]);
      setExitingArrowIds(new Set());
      setUndoStack([]);
      setMoves(0);
      setTimer(0);
      setCombo(0);
      setMaxCombo(0);
      setIsPlaying(true);
      setIsPaused(false);
      setIsCompleted(false);
      setIsGameOver(false);
      setStars(0);
      setBlockedArrowId(null);
      setBlockingArrowId(null);
      setHintArrowId(null);
    }
  }, [levelData, isBlitz, loadBlitz]);

  // Handle arrow tap
  const handleArrowPress = useCallback(
    (arrowId) => {
      if (isCompleted || isPaused || isGameOver || resolvingRef.current || exitingArrowIds.has(arrowId)) return;

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
        // Blocked! Reset combo streak immediately
        if (comboTimeoutRef.current) {
          clearTimeout(comboTimeoutRef.current);
          comboTimeoutRef.current = null;
        }
        comboRef.current = 0;
        setCombo(0);
        soundManager.playBlockedSound();
        setBlockedArrowId(arrow.id);
        if (blockingArrow) setBlockingArrowId(blockingArrow.id);

        // Blocked tap counts as a move / mistake, increasing challenge for 3-star mastery
        setMoves((m) => m + 1);

        // Decrement lives system (starts at 3 hearts)
        const nextLives = Math.max(0, livesRef.current - 1);
        livesRef.current = nextLives;
        setLives(nextLives);

        // If player makes three mistakes (0 lives), trigger cinematic Game Over screen
        if (nextLives === 0) {
          resolvingRef.current = false;
          setIsPlaying(false);
          setIsGameOver(true);
          soundManager.playDefeatSound();
          if (autoRestartTimerRef.current) {
            clearTimeout(autoRestartTimerRef.current);
            autoRestartTimerRef.current = null;
          }
          return;
        }

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

      // Clear any pending combo timeout
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
        comboTimeoutRef.current = null;
      }

      // Rapid succession streak: increment synchronous ref
      const nextCombo = comboRef.current + 1;
      comboRef.current = nextCombo;
      setCombo(nextCombo);
      setMaxCombo((prev) => Math.max(prev, nextCombo));
      soundManager.playEscapeSound(nextCombo);

      if (nextCombo >= 3) {
        soundManager.playComboSound();
      }

      // Rapid-succession delay timer:
      // If player pauses between clicks (> COMBO_WINDOW_MS), combo resets to 0.
      comboTimeoutRef.current = setTimeout(() => {
        comboRef.current = 0;
        setCombo(0);
        comboTimeoutRef.current = null;
      }, COMBO_WINDOW_MS);

      if (isBlitz) {
        setBlitzScore((s) => s + 100 + nextCombo * 25);
      }

      // Track undo (only in non-Blitz mode)
      if (!isBlitz) {
        setUndoStack((prev) => [
          ...prev,
          {
            arrow,
            prevActiveArrows: [...activeArrows],
            prevMoves: moves,
            prevCombo: combo,
          },
        ]);
      }

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
          if (comboTimeoutRef.current) {
            clearTimeout(comboTimeoutRef.current);
            comboTimeoutRef.current = null;
          }
          if (isBlitz) {
            // Blitz mode: Board Cleared! Add bonus time (+5s), bonus points, and immediately spawn next puzzle
            const nextCleared = blitzBoardsCleared + 1;
            setBlitzBoardsCleared(nextCleared);
            setBlitzScore((s) => s + 500 + nextCombo * 50);
            setBlitzTimeRemaining((prev) => Math.min(99, prev + 5));
            soundManager.playVictorySound();

            // Next procedural complete board
            const nextSize = nextCleared < 3 ? 4 : nextCleared < 6 ? 5 : 6;
            const nextArrowCount = nextSize * nextSize;
            const nextPuzzle = generatePuzzle(nextSize, nextArrowCount, Date.now() + nextCleared);

            setLevelData(nextPuzzle);
            setActiveArrows([...nextPuzzle.arrows]);
            setExitingArrowIds(new Set());
            resolvingRef.current = false;
            return;
          }

          // Standard Campaign / Daily Completion
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
      isGameOver,
      exitingArrowIds,
      hintArrowId,
      activeArrows,
      levelData,
      moves,
      timer,
      isDaily,
      dailyDate,
      levelNumber,
      combo,
      isBlitz,
      blitzBoardsCleared,
    ]
  );

  // Undo last move
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0 || isCompleted || isPaused || resolvingRef.current || isBlitz) return;

    soundManager.playClickSound();
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
      comboTimeoutRef.current = null;
    }
    comboRef.current = 0;
    setCombo(0);
    const lastEntry = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));

    // Restore arrows and state
    setActiveArrows(lastEntry.prevActiveArrows);
    setMoves(lastEntry.prevMoves);
    setExitingArrowIds(new Set());
    setBlockedArrowId(null);
    setBlockingArrowId(null);
    setHintArrowId(null);
  }, [undoStack, isCompleted, isPaused, isBlitz]);

  // Request a hint (limited to maximum 2 times per game)
  const handleHint = useCallback(() => {
    if (
      isCompleted ||
      isPaused ||
      resolvingRef.current ||
      activeArrows.length === 0 ||
      !levelData ||
      hintsRemainingRef.current <= 0
    ) {
      return;
    }

    soundManager.playClickSound();
    const nextHints = hintsRemainingRef.current - 1;
    hintsRemainingRef.current = nextHints;
    setHintsRemaining(nextHints);

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

  // Pause / Resume
  const togglePause = useCallback(() => {
    soundManager.playClickSound();
    setIsPaused((p) => {
      const nextPaused = !p;
      if (nextPaused) {
        if (comboTimeoutRef.current) {
          clearTimeout(comboTimeoutRef.current);
          comboTimeoutRef.current = null;
        }
        comboRef.current = 0;
        setCombo(0);
      }
      return nextPaused;
    });
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
    isGameOver,
    setIsGameOver,
    stars,
    blockedArrowId,
    blockingArrowId,
    hintArrowId,
    canUndo: undoStack.length > 0 && !isCompleted && exitingArrowIds.size === 0 && !isBlitz,
    combo,
    maxCombo,
    lives,
    hintsRemaining,
    isBlitz,
    blitzScore,
    blitzTimeRemaining,
    blitzBoardsCleared,
    loadBlitz,
    loadLevel,
    handleArrowPress,
    handleUndo,
    handleHint,
    handleRestart,
    togglePause,
    handleNextLevel,
  };
}
