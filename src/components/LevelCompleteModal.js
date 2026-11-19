import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThreeDModalPlaque } from './ThreeDModalPlaque.js';
import { ThreeDButton } from './ThreeDButton.js';
import { ThreeDStar } from './ThreeDIcons.js';
import { Confetti } from './Confetti.js';
import { formatTime } from '../engine/puzzleEngine.js';

/**
 * 3D Cartoon Level Complete Popup Plaque matching Reference Images 1 & 2.
 * Features 3D Golden Trophy, bouncy 3D stars, carved stats plinths, and celebration buttons.
 */
export function LevelCompleteModal({
  visible,
  levelNumber,
  isDaily = false,
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

  const ratingTitle =
    stars === 3 ? 'FLAWLESS EXTRACTION!' : stars === 2 ? 'TACTICAL ESCAPE!' : 'SECTOR CLEARED!';

  const ratingSubtitle = isDaily
    ? 'Daily Protocol Decrypted'
    : `Sector Level ${levelNumber} Secured`;

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
        {/* 3D Animated Stars Stage */}
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

        {/* Carved Wooden Stats Plinth Tray */}
        <View style={styles.statsTray}>
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
        </View>

        {/* 3D Action Buttons Stack */}
        <View style={styles.actionStack}>
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
            title="REPLAY STAGE"
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
  statsTray: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 6, 2, 0.65)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    color: '#D4B59D',
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
    color: '#A08068',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
