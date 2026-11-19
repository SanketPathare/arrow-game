import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formatTime } from '../engine/puzzleEngine.js';

export function WoodenStatsHud({
  moves = 0,
  timer = 0,
  remaining = 6,
  total = 6,
}) {
  return (
    <View style={styles.outerContainer}>
      {/* 3D Drop Shadow Base */}
      <View style={styles.shadowBase} />

      {/* Main Wooden Plank */}
      <LinearGradient
        colors={['#8C6645', '#735133', '#5E4126']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.woodPlank}
      >
        <View style={styles.woodSheen} />

        <View style={styles.innerGroove}>
          {/* Moves */}
          <View style={styles.statItem}>
            <View style={styles.iconCircleBlue}>
              <Ionicons name="flash" size={16} color="#00F2FE" />
            </View>
            <View style={styles.statTextGroup}>
              <Text style={styles.statValue}>{moves}</Text>
              <Text style={styles.statLabel}>MOVES</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Time */}
          <View style={styles.statItem}>
            <View style={styles.iconCircleYellow}>
              <Ionicons name="time" size={16} color="#FFD13B" />
            </View>
            <View style={styles.statTextGroup}>
              <Text style={styles.statValue}>{formatTime(timer)}</Text>
              <Text style={styles.statLabel}>TIME</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Remaining */}
          <View style={styles.statItem}>
            <View style={styles.iconCircleGreen}>
              <Ionicons name="radio" size={16} color="#06D6A0" />
            </View>
            <View style={styles.statTextGroup}>
              <Text style={styles.statValue}>{remaining} <Text style={{ fontSize: 11, color: '#C4A882' }}>/ {total}</Text></Text>
              <Text style={styles.statLabel}>REMAINING</Text>
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
    marginVertical: 6,
    paddingHorizontal: 14,
  },
  shadowBase: {
    position: 'absolute',
    top: 4,
    left: 18,
    right: 18,
    bottom: -4,
    borderRadius: 18,
    backgroundColor: '#2A1A0E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  woodPlank: {
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#A67B54',
    padding: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  woodSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  innerGroove: {
    backgroundColor: 'rgba(38, 25, 14, 0.4)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#4A3420',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconCircleBlue: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 242, 254, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  iconCircleYellow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 209, 59, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 209, 59, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  iconCircleGreen: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(6, 214, 160, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(6, 214, 160, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  statTextGroup: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    lineHeight: 16,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D4B896',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1.5,
    height: 24,
    backgroundColor: '#5A3F28',
  },
});
