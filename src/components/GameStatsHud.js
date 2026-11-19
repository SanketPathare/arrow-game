import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatTime } from '../engine/puzzleEngine.js';
import { SvgFlash, SvgTimer, SvgTarget } from './SvgIcons.js';

export function GameStatsHud({
  moves = 0,
  timer = 0,
  remaining = 6,
  total = 6,
  isBlitz = false,
  blitzScore = 0,
  blitzTimeRemaining = 60,
}) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 360;
  const iconSize = isNarrow ? 15 : 18;
  const circleSize = isNarrow ? 26 : 32;

  return (
    <View style={[styles.outerContainer, isNarrow && { paddingHorizontal: 8, marginVertical: 4 }]}>
      <View style={styles.shadowBase} />

      <LinearGradient
        colors={['rgba(20, 32, 57, 0.98)', 'rgba(11, 19, 38, 0.98)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.statsCard}
      >
        <View style={styles.cardSheen} />

        <View style={[styles.statsContent, isNarrow && { paddingVertical: 6, paddingHorizontal: 4 }]}>
          {/* Moves or Blitz Score */}
          <View style={styles.statItem}>
            <View
              style={[
                styles.iconCircleBlue,
                {
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  marginRight: isNarrow ? 5 : 8,
                },
              ]}
            >
              <SvgFlash size={iconSize} color="#00F2FE" />
            </View>
            <View style={styles.statTextGroup}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.statValue, isNarrow && { fontSize: 14 }]}
              >
                {isBlitz ? blitzScore : moves}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.statLabel, isNarrow && { fontSize: 8 }]}
              >
                {isBlitz ? 'SCORE' : 'MOVES'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Time or Blitz Countdown Timer */}
          <View style={styles.statItem}>
            <View
              style={[
                styles.iconCircleYellow,
                {
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  marginRight: isNarrow ? 5 : 8,
                },
              ]}
            >
              <SvgTimer size={iconSize} color={isBlitz && blitzTimeRemaining <= 10 ? '#EF4444' : '#FFD13B'} />
            </View>
            <View style={styles.statTextGroup}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[
                  styles.statValue,
                  isNarrow && { fontSize: 14 },
                  isBlitz && blitzTimeRemaining <= 10 && { color: '#EF4444' },
                ]}
              >
                {isBlitz ? `${blitzTimeRemaining}s` : formatTime(timer)}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.statLabel, isNarrow && { fontSize: 8 }]}
              >
                {isBlitz ? 'TIME LEFT' : 'TIME'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Remaining */}
          <View style={styles.statItem}>
            <View
              style={[
                styles.iconCircleGreen,
                {
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  marginRight: isNarrow ? 5 : 8,
                },
              ]}
            >
              <SvgTarget size={iconSize} color="#06D6A0" />
            </View>
            <View style={styles.statTextGroup}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.statValue, isNarrow && { fontSize: 14 }]}
              >
                {remaining}{' '}
                <Text style={{ fontSize: isNarrow ? 9.5 : 11, color: '#94A3B8' }}>
                  / {total}
                </Text>
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.statLabel, isNarrow && { fontSize: 8 }]}
              >
                REMAINING
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    position: 'relative',
    marginVertical: 8,
    paddingHorizontal: 14,
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 5,
  },
  shadowBase: {
    position: 'absolute',
    top: 4,
    left: 18,
    right: 18,
    bottom: -4,
    borderRadius: 18,
    backgroundColor: '#020617',
  },
  statsCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.28)',
    overflow: 'hidden',
    position: 'relative',
  },
  cardSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconCircleBlue: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  iconCircleYellow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 209, 59, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 209, 59, 0.3)',
  },
  iconCircleGreen: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(6, 214, 160, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(6, 214, 160, 0.3)',
  },
  statTextGroup: {
    justifyContent: 'center',
  },
  statValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
