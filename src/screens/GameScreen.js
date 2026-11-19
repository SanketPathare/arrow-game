import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameBackground } from '../components/GameBackground.js';
import { ThreeDButton } from '../components/ThreeDButton.js';
import { ThreeDText } from '../components/ThreeDText.js';
import { TactilePill } from '../components/TactilePill.js';
import { WoodenStatsHud } from '../components/WoodenStatsHud.js';
import { GameBoard } from '../components/GameBoard.js';
import { PauseModal } from '../components/PauseModal.js';
import { LevelCompleteModal } from '../components/LevelCompleteModal.js';

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
    canUndo,
    handleArrowPress,
    handleUndo,
    handleHint,
    handleRestart,
    togglePause,
    handleNextLevel,
  } = game;

  // Handle hardware Android back button
  useEffect(() => {
    const onBackPress = () => {
      if (isCompleted) {
        onNavigateLevelSelect();
        return true;
      }
      if (!isPaused) {
        togglePause();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [isCompleted, isPaused, togglePause, onNavigateLevelSelect]);

  if (!levelData) {
    return <View style={styles.emptyContainer} />;
  }

  const remainingCount = activeArrows.length;
  const totalCount = levelData.arrowCount;

  return (
    <GameBackground type="game">
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
              text={isDaily ? 'DAILY' : `LEVEL ${levelNumber}`}
              size={28}
              color="#FFE8A3"
              depthColor="#C77700"
              depth={5}
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
            iconSize={22}
            colorScheme="circle-blue"
            size="circle"
            onPress={togglePause}
          />
        </View>

        {/* Wooden Statistics HUD Panel (Matching Reference Image 2) */}
        <WoodenStatsHud
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
            onArrowPress={handleArrowPress}
            theme={theme}
          />
        </View>

        {/* Bottom 3D Action Buttons Deck (Matching Reference Image 2) */}
        <View style={styles.bottomButtonsRow}>
          {/* Undo Button (Glossy Dark Blue) */}
          <ThreeDButton
            title="Undo"
            icon="arrow-undo"
            iconSize={20}
            colorScheme="blue"
            size="md"
            disabled={!canUndo}
            onPress={handleUndo}
            style={styles.actionBtn}
          />

          {/* Hint Button (Glossy Warm Yellow/Orange) */}
          <ThreeDButton
            title="Hint"
            icon="bulb"
            iconSize={20}
            colorScheme="yellow"
            size="md"
            onPress={handleHint}
            style={styles.actionBtn}
          />

          {/* Reset Button (Glossy Dark Blue) */}
          <ThreeDButton
            title="Reset"
            icon="refresh"
            iconSize={20}
            colorScheme="blue"
            size="md"
            onPress={handleRestart}
            style={styles.actionBtn}
          />

          {/* Star Glint Sparkle */}
          <View style={styles.sparkle} pointerEvents="none">
            <Ionicons name="sparkles" size={22} color="rgba(255, 255, 255, 0.85)" />
          </View>
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
            togglePause();
            onNavigateLevelSelect();
          }}
          onHome={() => {
            togglePause();
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
    position: 'relative',
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
    position: 'relative',
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
  },
  sparkle: {
    position: 'absolute',
    right: 8,
    bottom: 2,
  },
});
