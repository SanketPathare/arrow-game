import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
} from 'react-native';
import { ThreeDModalPlaque } from './ThreeDModalPlaque.js';
import { ThreeDButton } from './ThreeDButton.js';
import { ThreeDStar } from './ThreeDIcons.js';
import { Confetti } from './Confetti.js';
import { formatTime } from '../engine/puzzleEngine.js';

/**
 * Level-complete celebration with sequential star animations and a compact result recap.
 */
export function LevelCompleteModal({
  visible,
  levelNumber,
  isDaily = false,
  isBlitz = false,
  blitzScore = 0,
  blitzBoardsCleared = 0,
  maxCombo = 0,
  stars = 3,
  moves = 0,
  optimalMoves = 0,
  time = 0,
  hasNextLevel = true,
  onNextLevel,
  onReplay,
  onLevelSelect,
  onHome,
}) {
  // Staggered star animation scales
  const star1Anim = useRef(new Animated.Value(0)).current;
  const star2Anim = useRef(new Animated.Value(0)).current;
  const star3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      star1Anim.setValue(0);
      star2Anim.setValue(0);
      star3Anim.setValue(0);

      const anims = [];
      if (stars >= 1) {
        anims.push(
          Animated.spring(star1Anim, { toValue: 1, speed: 22, bounciness: 14, useNativeDriver: true })
        );
      }
      if (stars >= 2) {
        anims.push(
          Animated.spring(star2Anim, { toValue: 1, speed: 22, bounciness: 14, useNativeDriver: true })
        );
      }
      if (stars >= 3) {
        anims.push(
          Animated.spring(star3Anim, { toValue: 1, speed: 22, bounciness: 14, useNativeDriver: true })
        );
      }

      const timer = setTimeout(() => {
        Animated.stagger(130, anims).start();
      }, 160);

      return () => clearTimeout(timer);
    }
  }, [visible, stars, star1Anim, star2Anim, star3Anim]);

  const ratingTitle = isBlitz
    ? 'TIME EXPIRED!'
    : stars === 3
    ? 'PERFECT RUN!'
    : stars === 2
    ? 'WELL PLAYED!'
    : 'LEVEL COMPLETE';

  const ratingSubtitle = isBlitz
    ? `Cleared ${blitzBoardsCleared} boards in 60s`
    : isDaily
    ? 'Today’s challenge is complete'
    : `You cleared level ${levelNumber}`;

  const rankTier = stars === 3 ? (moves <= optimalMoves ? 'S-RANK' : 'A-RANK') : stars === 2 ? 'A-RANK' : 'B-RANK';
  const rankColor = rankTier === 'S-RANK' ? '#FFD700' : rankTier === 'A-RANK' ? '#38BDF8' : '#34D399';

  return (
    <>
      {visible && <Confetti count={40} />}

      <ThreeDModalPlaque
        visible={visible}
        onClose={onNextLevel || onLevelSelect}
        crestType="trophy"
        title={ratingTitle}
        subtitle={ratingSubtitle}
        maxWidth={360}
        showClose={false}
      >
        {isBlitz ? (
          /* Blitz Rush Score Plaque */
          <View style={styles.blitzScoreStage}>
            <Text style={styles.blitzScoreLabel}>FINAL BLITZ SCORE</Text>
            <Text style={styles.blitzScoreValue}>{blitzScore}</Text>
          </View>
        ) : (
          /* 3D Animated Stars Stage */
          <View style={styles.starsStage}>
            {/* Star 1 */}
            <Animated.View style={{ transform: [{ scale: star1Anim }] }}>
              <ThreeDStar size={42} empty={stars < 1} />
            </Animated.View>

            {/* Star 2 (Middle - Elevated Hero Star) */}
            <Animated.View style={[{ transform: [{ scale: star2Anim }], marginTop: -14, marginHorizontal: 12 }]}>
              <ThreeDStar size={54} empty={stars < 2} />
            </Animated.View>

            {/* Star 3 */}
            <Animated.View style={{ transform: [{ scale: star3Anim }] }}>
              <ThreeDStar size={42} empty={stars < 3} />
            </Animated.View>
          </View>
        )}

        {/* Rank & Tactical Performance Tag (Campaign) */}
        {!isBlitz && (
          <View style={styles.rankBadgeRow}>
            <View style={[styles.rankBadgePill, { borderColor: rankColor }]}>
              <Text style={[styles.rankBadgeText, { color: rankColor }]}>{rankTier}</Text>
            </View>
            {maxCombo >= 2 && (
              <View style={styles.comboBadgePill}>
                <Text style={styles.comboBadgeText}>⚡ MAX COMBO x{maxCombo}</Text>
              </View>
            )}
          </View>
        )}

        {/* Carved Wooden Stats Plinth Tray */}
        <View style={styles.statsTray}>
          {isBlitz ? (
            <>
              {/* Col 1: Boards Cleared */}
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>BOARDS</Text>
                <Text style={[styles.statValue, { color: '#38D9F8' }]}>{blitzBoardsCleared}</Text>
                <Text style={styles.statSub}>Solved</Text>
              </View>

              <View style={styles.statDivider} />

              {/* Col 2: Time */}
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>TIME</Text>
                <Text style={[styles.statValue, { color: '#FFD13B' }]}>60s</Text>
                <Text style={styles.statSub}>Full Run</Text>
              </View>

              <View style={styles.statDivider} />

              {/* Col 3: Max Combo */}
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>COMBO</Text>
                <Text style={[styles.statValue, { color: '#FF8A00' }]}>x{maxCombo || 1}</Text>
                <Text style={styles.statSub}>Peak</Text>
              </View>
            </>
          ) : (
            <>
              {/* Col 1: Moves */}
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>MOVES</Text>
                <Text style={[styles.statValue, { color: '#38D9F8' }]}>{moves}</Text>
                <Text style={styles.statSub}>Par: {optimalMoves || moves}</Text>
              </View>

              <View style={styles.statDivider} />

              {/* Col 2: Time */}
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>TIME</Text>
                <Text style={[styles.statValue, { color: '#FFD13B' }]}>{formatTime(time)}</Text>
                <Text style={styles.statSub}>Elapsed</Text>
              </View>

              <View style={styles.statDivider} />

              {/* Col 3: Stars */}
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>RATING</Text>
                <Text style={[styles.statValue, { color: '#FF8A00' }]}>{stars}/3</Text>
                <Text style={styles.statSub}>Stars</Text>
              </View>
            </>
          )}
        </View>

        {/* 3D Action Buttons Stack */}
        <View style={styles.actionStack}>
          {isBlitz ? (
            <>
              <ThreeDButton
                title="PLAY AGAIN"
                icon="refresh"
                iconSize={22}
                colorScheme="cyan"
                size="lg"
                onPress={onReplay}
                style={styles.btnSpacing}
              />
              <ThreeDButton
                title="HOME"
                icon="home"
                iconSize={18}
                colorScheme="blue"
                size="md"
                onPress={onHome}
              />
            </>
          ) : (
            <>
              {/* Hero Button: Next Level (or Vault if completed level 50) */}
              {hasNextLevel ? (
                <ThreeDButton
                  title="NEXT LEVEL"
                  icon="play"
                  iconSize={22}
                  colorScheme="cyan"
                  size="lg"
                  onPress={onNextLevel}
                  style={styles.btnSpacing}
                />
              ) : (
                <ThreeDButton
                  title="LEVEL VAULT"
                  icon="grid"
                  iconSize={22}
                  colorScheme="cyan"
                  size="lg"
                  onPress={onLevelSelect}
                  style={styles.btnSpacing}
                />
              )}

              {/* Secondary: Replay Stage */}
              <ThreeDButton
                title="PLAY AGAIN"
                icon="refresh"
                iconSize={20}
                colorScheme="yellow"
                size="md"
                onPress={onReplay}
                style={styles.btnSpacing}
              />

              {/* Bottom Row: Level Vault & Home */}
              <View style={styles.bottomRow}>
                <ThreeDButton
                  title="Levels"
                  icon="grid"
                  iconSize={18}
                  colorScheme="blue"
                  size="md"
                  onPress={onLevelSelect}
                  style={{ flex: 1, marginRight: 8 }}
                />

                <ThreeDButton
                  title="Home"
                  icon="home"
                  iconSize={18}
                  colorScheme="blue"
                  size="md"
                  onPress={onHome}
                  style={{ flex: 1 }}
                />
              </View>
            </>
          )}
        </View>
      </ThreeDModalPlaque>
    </>
  );
}

const styles = StyleSheet.create({
  starsStage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 8,
  },
  blitzScoreStage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginBottom: 8,
  },
  blitzScoreLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#00F2FE',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  blitzScoreValue: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFD13B',
    textShadowColor: 'rgba(255, 209, 59, 0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  rankBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  rankBadgePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1.5,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    marginHorizontal: 4,
  },
  rankBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  comboBadgePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.5)',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    marginHorizontal: 4,
  },
  comboBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FBBF24',
    letterSpacing: 0.5,
  },
  statsTray: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.58)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    marginVertical: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statSub: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(148, 163, 184, 0.16)',
  },
  actionStack: {
    width: '100%',
  },
  btnSpacing: {
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
