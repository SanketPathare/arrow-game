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
import { TactilePill } from '../components/TactilePill.js';
import { GameStatsHud } from '../components/GameStatsHud.js';
import { GameBoard } from '../components/GameBoard.js';
import { PauseModal } from '../components/PauseModal.js';
import { LevelCompleteModal } from '../components/LevelCompleteModal.js';
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
    stars,
    blockedArrowId,
    blockingArrowId,
    hintArrowId,
    handleArrowPress,
    handleHint,
    handleRestart,
    togglePause,
    handleNextLevel,
  } = game;

  const { width } = useWindowDimensions();
  const isNarrow = width < 360;
  const titleSize = isNarrow ? (isDaily ? 16 : 22) : (isDaily ? 19 : 28);

  // Handle hardware Android back button
  useEffect(() => {
    const onBackPress = () => {
      if (isCompleted) {
        onNavigateLevelSelect();
        return true;
      }
      togglePause();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [isCompleted, togglePause, onNavigateLevelSelect]);

  if (!levelData) {
    return <View style={styles.emptyContainer} />;
  }

  const zoneConfig = getZoneByLevel(levelNumber);
  const remainingCount = activeArrows.length;
  const totalCount = levelData.arrowCount;

  return (
    <GameBackground type="game" zone={zoneConfig.id} theme={theme}>
      <View style={styles.container}>
        {/* Top Header Section (Matching Reference Image 2) */}
        <View style={styles.header}>
          {/* Circular 3D Back Button */}
          <ThreeDButton
            icon="arrow-back"
            iconSize={24}
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

          {/* Center Title & Difficulty Badge */}
          <View style={styles.titleColumn}>
            <ThreeDText
              text={isDaily ? 'DAILY CHALLENGE' : `LEVEL ${levelNumber}`}
              size={titleSize}
              color="#FFE8A3"
              depthColor="#C77700"
              depth={isNarrow ? 4 : 5}
              strokeColor="#6E3D00"
            />
            <TactilePill
              type="difficulty"
              sizeText={`${levelData.boardSize}X${levelData.boardSize}`}
              difficulty={levelData.difficulty}
            />
          </View>

          {/* Circular 3D Pause Button */}
          <ThreeDButton
            icon="pause"
            iconSize={isNarrow ? 20 : 22}
            colorScheme="circle-blue"
            size="circle"
            onPress={togglePause}
          />
        </View>

        {/* Wooden Statistics HUD Panel (Matching Reference Image 2) */}
        <GameStatsHud
          moves={moves}
          timer={timer}
          remaining={remainingCount}
          total={totalCount}
        />

        {/* Centered 3D Stone Puzzle Board */}
        <View style={styles.boardContainer}>
          <GameBoard
            boardSize={levelData.boardSize}
            activeArrows={activeArrows}
            exitingArrowIds={exitingArrowIds}
            blockedArrowId={blockedArrowId}
            blockingArrowId={blockingArrowId}
            hintArrowId={hintArrowId}
            zone={zoneConfig.id}
            onArrowPress={handleArrowPress}
            theme={theme}
          />
        </View>

        {/* Bottom 3D Action Buttons Deck (Hint & Reset) */}
        <View style={styles.bottomButtonsRow}>
          {/* Hint Button (Glossy Warm Yellow/Orange) */}
          <ThreeDButton
            title="Hint"
            icon="bulb"
            iconSize={isNarrow ? 18 : 22}
            colorScheme="yellow"
            size="md"
            onPress={handleHint}
            style={styles.actionBtn}
          />

          {/* Reset Button (Glossy Dark Blue) */}
          <ThreeDButton
            title="Reset"
            icon="refresh"
            iconSize={isNarrow ? 18 : 22}
            colorScheme="blue"
            size="md"
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
          stars={stars}
          moves={moves}
          optimalMoves={levelData.optimalMoves}
          time={timer}
          hasNextLevel={typeof levelNumber === 'number' && levelNumber < 50}
          onNextLevel={handleNextLevel}
          onReplay={handleRestart}
          onLevelSelect={onNavigateLevelSelect}
          onHome={onNavigateHome}
          theme={theme}
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
