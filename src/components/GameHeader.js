import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameButton } from './GameButton.js';
import { formatTime } from '../engine/puzzleEngine.js';

export function GameHeader({
  levelNumber,
  boardSize,
  difficulty,
  isDaily = false,
  moves = 0,
  timer = 0,
  remainingArrows = 0,
  totalArrows = 0,
  onBack,
  onPause,
  theme,
}) {
  const isExpert = difficulty === 'Expert';
  const isHard = difficulty === 'Hard';
  const badgeColor = isExpert ? '#FF2A6D' : isHard ? '#FB8500' : theme.accent;

  return (
    <View style={styles.container}>
      {/* Top action row */}
      <View style={styles.topRow}>
        <GameButton
          icon="chevron-back"
          variant="icon"
          size="sm"
          onPress={onBack}
          theme={theme}
        />

        <View style={styles.titleContainer}>
          <Text style={[styles.levelTitle, { color: theme.text }]}>
            {isDaily ? 'DAILY PROTOCOL' : `LEVEL ${levelNumber}`}
          </Text>
          <View style={[styles.badge, { backgroundColor: theme.surfaceLight, borderColor: theme.borderLight || theme.border }]}>
            <View style={[styles.pulseDot, { backgroundColor: badgeColor }]} />
            <Text style={[styles.badgeText, { color: badgeColor }]}>
              {boardSize}x{boardSize} • {difficulty}
            </Text>
          </View>
        </View>

        <GameButton
          icon="pause"
          variant="icon"
          size="sm"
          onPress={onPause}
          theme={theme}
        />
      </View>

      {/* Cyber HUD Stats Bar */}
      <View
        style={[
          styles.statsBar,
          {
            backgroundColor: theme.surfaceGlass || theme.surface,
            borderColor: theme.borderLight || theme.border,
          },
        ]}
      >
        {/* Moves */}
        <View style={styles.statItem}>
          <View style={[styles.statIconBox, { backgroundColor: 'rgba(0, 242, 254, 0.12)' }]}>
            <Ionicons name="flash-outline" size={15} color={theme.accent} />
          </View>
          <View style={styles.statInfo}>
            <Text style={[styles.statValue, { color: theme.text }]}>{moves}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Moves</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Timer */}
        <View style={styles.statItem}>
          <View style={[styles.statIconBox, { backgroundColor: 'rgba(255, 183, 3, 0.12)' }]}>
            <Ionicons name="time-outline" size={15} color="#FFB703" />
          </View>
          <View style={styles.statInfo}>
            <Text style={[styles.statValue, { color: theme.text }]}>{formatTime(timer)}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Time</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Remaining Arrows */}
        <View style={styles.statItem}>
          <View style={[styles.statIconBox, { backgroundColor: 'rgba(6, 214, 160, 0.12)' }]}>
            <Ionicons name="radio-outline" size={15} color={theme.success} />
          </View>
          <View style={styles.statInfo}>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {remainingArrows} <Text style={{ fontSize: 11, color: theme.textDim }}>/ {totalArrows}</Text>
            </Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Remaining</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  badge: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statIconBox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statInfo: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 18,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 26,
    opacity: 0.7,
  },
});
