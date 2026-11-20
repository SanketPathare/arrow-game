import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  useWindowDimensions,
} from 'react-native';
import { GameBackground } from '../components/GameBackground.js';
import { ThreeDButton } from '../components/ThreeDButton.js';
import { ThreeDText } from '../components/ThreeDText.js';
import { SvgHeart } from '../components/SvgIcons.js';
import { GameBoard } from '../components/GameBoard.js';
import { PauseModal } from '../components/PauseModal.js';
import { LevelCompleteModal } from '../components/LevelCompleteModal.js';
import { GameOverModal } from '../components/GameOverModal.js';
import { getZoneByLevel } from '../utils/zones.js';

export function GameScreen({
  game,
  soundEnabled,
  hapticsEnabled,
  onToggleSound,
  onToggleHaptics,
  onNavigateHome,
  onNavigateLevelSelect,
  theme,
}) {
  const {
    levelNumber,
    isDaily,
    levelData,
    activeArrows,
    exitingArrowIds,
    moves,
    timer,
    isPaused,
    isCompleted,
    isGameOver,
    stars,
    blockedArrowId,
    blockingArrowId,
    hintArrowId,
    combo,
    maxCombo,
    lives = 3,
    hintsRemaining = 2,
    isBlitz,
    blitzScore,
    blitzBoardsCleared,
    handleArrowPress,
    handleHint,
    handleRestart,
    togglePause,
    handleNextLevel,
  } = game;

  const { width, height } = useWindowDimensions();
  const isNarrow = width < 360;
  const isShort = height < 700;
  const titleSize = isNarrow
    ? (isBlitz ? 18 : isDaily ? 15 : 20)
    : isShort
    ? (isBlitz ? 21 : isDaily ? 17 : 24)
    : (isBlitz ? 24 : isDaily ? 19 : 28);

  // Handle hardware Android back button
  useEffect(() => {
    const onBackPress = () => {
      if (isGameOver || isCompleted) {
        onNavigateLevelSelect();
        return true;
      }
      togglePause();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [isGameOver, isCompleted, togglePause, onNavigateLevelSelect]);

  if (!levelData) {
    return <View style={styles.emptyContainer} />;
  }

  const zoneConfig = getZoneByLevel(levelNumber);

  return (
    <GameBackground type="game" zone={zoneConfig.id} theme={theme}>
      <View
        style={[
          styles.container,
          isShort && { paddingVertical: 2 },
        ]}
      >
        {/* Top Header Section */}
        <View style={[styles.header, isNarrow && { paddingHorizontal: 10, paddingTop: 2 }]}>
          {/* Circular 3D Back Button */}
          <ThreeDButton
            icon="arrow-back"
            iconSize={isNarrow ? 20 : 24}
            colorScheme="circle-blue"
            size="circle"
            onPress={() => {
              if (isCompleted) {
                onNavigateLevelSelect();
              } else {
                togglePause();
              }
            }}
          />

          {/* Center Title & 3-Heart Lives Display */}
          <View style={styles.titleColumn}>
            <ThreeDText
              text={isBlitz ? 'BLITZ RUSH' : isDaily ? 'DAILY CHALLENGE' : `LEVEL ${levelNumber}`}
              size={titleSize}
              color={isBlitz ? '#FFD13B' : '#FFE8A3'}
              depthColor={isBlitz ? '#B45309' : '#C77700'}
              depth={isNarrow ? 4 : 5}
              strokeColor="#6E3D00"
            />

            {/* 3-Heart Lives Indicator at top of screen */}
            <View style={styles.livesPill}>
              {[1, 2, 3].map((heartIndex) => (
                <View
                  key={heartIndex}
                  style={[
                    styles.heartSlot,
                    lives < heartIndex && styles.heartDepleted,
                  ]}
                >
                  <SvgHeart
                    size={isNarrow ? 15 : 18}
                    filled={lives >= heartIndex}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Circular 3D Pause Button */}
          <ThreeDButton
            icon="pause"
            iconSize={isNarrow ? 18 : 22}
            colorScheme="circle-blue"
            size="circle"
            onPress={togglePause}
          />
        </View>

        {/* Centered 3D Stone Puzzle Board */}
        <View style={styles.boardContainer}>
          <GameBoard
            boardSize={levelData.boardSize}
            activeArrows={activeArrows}
            exitingArrowIds={exitingArrowIds}
            blockedArrowId={blockedArrowId}
            blockingArrowId={blockingArrowId}
            hintArrowId={hintArrowId}
            combo={combo}
            zone={zoneConfig.id}
            onArrowPress={handleArrowPress}
            theme={theme}
          />
        </View>

        {/* Bottom 3D Action Buttons Deck (Hint & Reset) */}
        <View
          style={[
            styles.bottomButtonsRow,
            isShort && { paddingBottom: 6 },
            isNarrow && { paddingHorizontal: 10 },
          ]}
        >
          {/* Hint Button (Glossy Warm Yellow/Orange, max 2 uses per game) */}
          <ThreeDButton
            title={hintsRemaining > 0 ? `Hint (${hintsRemaining})` : 'Hint (0)'}
            icon="bulb"
            iconSize={isNarrow ? 18 : 22}
            colorScheme="yellow"
            size={isShort ? 'sm' : 'md'}
            onPress={handleHint}
            disabled={hintsRemaining <= 0}
            style={styles.actionBtn}
          />

          {/* Reset Button (Glossy Dark Blue) */}
          <ThreeDButton
            title="Reset"
            icon="refresh"
            iconSize={isNarrow ? 18 : 22}
            colorScheme="blue"
            size={isShort ? 'sm' : 'md'}
            onPress={handleRestart}
            style={styles.actionBtn}
          />
        </View>

        {/* Pause Modal */}
        <PauseModal
          visible={isPaused}
          onResume={togglePause}
          onRestart={() => {
            togglePause();
            handleRestart();
          }}
          onLevelSelect={() => {
            onNavigateLevelSelect();
          }}
          onHome={() => {
            onNavigateHome();
          }}
          soundEnabled={soundEnabled}
          hapticsEnabled={hapticsEnabled}
          onToggleSound={onToggleSound}
          onToggleHaptics={onToggleHaptics}
          theme={theme}
        />

        {/* Level Complete Celebration Modal */}
        <LevelCompleteModal
          visible={isCompleted}
          levelNumber={levelNumber}
          isDaily={isDaily}
          isBlitz={isBlitz}
          blitzScore={blitzScore}
          blitzBoardsCleared={blitzBoardsCleared}
          maxCombo={maxCombo}
          stars={stars}
          moves={moves}
          optimalMoves={levelData.optimalMoves}
          time={timer}
          hasNextLevel={!isBlitz && typeof levelNumber === 'number' && levelNumber < 50}
          onNextLevel={handleNextLevel}
          onReplay={handleRestart}
          onLevelSelect={onNavigateLevelSelect}
          onHome={onNavigateHome}
          theme={theme}
        />

        {/* Sleek, Cinematic Game Over Modal */}
        <GameOverModal
          visible={isGameOver}
          levelNumber={levelNumber}
          isDaily={isDaily}
          isBlitz={isBlitz}
          moves={moves}
          time={timer}
          onRestart={handleRestart}
          onLevelSelect={onNavigateLevelSelect}
          onHome={onNavigateHome}
        />
      </View>
    </GameBackground>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: '#3B6EA8',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 6,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  titleColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  livesPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 77, 109, 0.35)',
    gap: 5,
    marginTop: 5,
    shadowColor: '#FF2A6D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  heartSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartDepleted: {
    opacity: 0.38,
    transform: [{ scale: 0.88 }],
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
  },
});
