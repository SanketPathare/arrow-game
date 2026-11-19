import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameButton } from './GameButton.js';
import { Confetti } from './Confetti.js';
import { formatTime } from '../engine/puzzleEngine.js';

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
  theme,
}) {
  const cardScale = useRef(new Animated.Value(0.7)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // Star animations
  const star1Anim = useRef(new Animated.Value(0)).current;
  const star2Anim = useRef(new Animated.Value(0)).current;
  const star3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      cardScale.setValue(0.7);
      cardOpacity.setValue(0);
      star1Anim.setValue(0);
      star2Anim.setValue(0);
      star3Anim.setValue(0);

      Animated.parallel([
        Animated.spring(cardScale, {
          toValue: 1,
          speed: 16,
          bounciness: 9,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Pop in stars sequentially
        const starAnims = [];
        if (stars >= 1) {
          starAnims.push(
            Animated.spring(star1Anim, { toValue: 1, speed: 20, bounciness: 14, useNativeDriver: true })
          );
        }
        if (stars >= 2) {
          starAnims.push(
            Animated.spring(star2Anim, { toValue: 1, speed: 20, bounciness: 14, useNativeDriver: true })
          );
        }
        if (stars >= 3) {
          starAnims.push(
            Animated.spring(star3Anim, { toValue: 1, speed: 20, bounciness: 14, useNativeDriver: true })
          );
        }
        Animated.stagger(140, starAnims).start();
      });
    }
  }, [visible, stars, cardScale, cardOpacity, star1Anim, star2Anim, star3Anim]);

  const ratingTitle =
    stars === 3 ? 'FLAWLESS EXTRACTION!' : stars === 2 ? 'TACTICAL ESCAPE!' : 'SECTOR CLEARED!';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        {visible && <Confetti count={45} />}

        <Animated.View
          style={[
            styles.modalCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.borderLight || theme.border,
              transform: [{ scale: cardScale }],
              opacity: cardOpacity,
            },
          ]}
        >
          {/* Header Trophy Badge */}
          <View style={styles.trophyBadge}>
            <Ionicons name="trophy" size={28} color="#FFB703" />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>{ratingTitle}</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            {isDaily ? 'DAILY PROTOCOL SOLVED' : `SECTOR LEVEL ${levelNumber} SECURED`}
          </Text>

          {/* Glowing Stars Display */}
          <View style={styles.starsRow}>
            {/* Star 1 */}
            <Animated.View style={{ transform: [{ scale: star1Anim }] }}>
              <Ionicons
                name="star"
                size={44}
                color={stars >= 1 ? '#FFB703' : theme.starEmpty}
                style={styles.starIcon}
              />
            </Animated.View>

            {/* Star 2 (Center) */}
            <Animated.View style={[{ transform: [{ scale: star2Anim }], marginTop: -12 }]}>
              <Ionicons
                name="star"
                size={56}
                color={stars >= 2 ? '#FFB703' : theme.starEmpty}
                style={styles.starIcon}
              />
            </Animated.View>

            {/* Star 3 */}
            <Animated.View style={{ transform: [{ scale: star3Anim }] }}>
              <Ionicons
                name="star"
                size={44}
                color={stars >= 3 ? '#FFB703' : theme.starEmpty}
                style={styles.starIcon}
              />
            </Animated.View>
          </View>

          {/* Stats Breakdown Box */}
          <View
            style={[
              styles.statsBox,
              {
                backgroundColor: theme.surfaceLight,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.statCol}>
              <Text style={[styles.statValue, { color: theme.accent }]}>{moves}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Moves</Text>
            </View>

            <View style={[styles.vertDivider, { backgroundColor: theme.border }]} />

            <View style={styles.statCol}>
              <Text style={[styles.statValue, { color: '#FFB703' }]}>{formatTime(time)}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Time</Text>
            </View>

            <View style={[styles.vertDivider, { backgroundColor: theme.border }]} />

            <View style={styles.statCol}>
              <Text style={[styles.statValue, { color: theme.success }]}>{optimalMoves}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Par</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            {hasNextLevel && !isDaily ? (
              <GameButton
                title="Next Level"
                icon="arrow-forward"
                variant="primary"
                size="lg"
                onPress={onNextLevel}
                theme={theme}
                style={styles.actionBtn}
              />
            ) : null}

            <GameButton
              title="Replay Level"
              icon="refresh"
              variant="secondary"
              size="md"
              onPress={onReplay}
              theme={theme}
              style={styles.actionBtn}
            />

            <View style={styles.bottomRow}>
              <GameButton
                title="Level Vault"
                icon="grid"
                variant="secondary"
                size="md"
                onPress={onLevelSelect}
                theme={theme}
                style={{ flex: 1, marginRight: 8 }}
              />

              <GameButton
                title="Home Base"
                icon="home"
                variant="secondary"
                size="md"
                onPress={onHome}
                theme={theme}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 5, 12, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 30,
    borderWidth: 1.5,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
  },
  trophyBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 183, 3, 0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 183, 3, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 18,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  starIcon: {
    marginHorizontal: 8,
    textShadowColor: 'rgba(255, 183, 3, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  statsBox: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 12,
    marginBottom: 20,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  vertDivider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
  },
  actions: {
    width: '100%',
  },
  actionBtn: {
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    width: '100%',
  },
});
