import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export function WoodenCampaignBoard({
  completedLevels = 2,
  totalLevels = 50,
  stars = 6,
  streak = 0,
  unlockedLevel = 3,
}) {
  const percent = Math.min(100, Math.round((completedLevels / totalLevels) * 100));

  return (
    <View style={styles.outerContainer}>
      {/* 3D Drop Shadow Base */}
      <View style={styles.shadowBase} />

      {/* Main Wooden Plank Frame */}
      <LinearGradient
        colors={['#8C6645', '#735133', '#5E4126']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.woodBoard}
      >
        {/* Subtle wood grain highlight */}
        <View style={styles.woodSheen} />

        {/* Silver Metal Corner Brackets with Rivets */}
        <View style={[styles.cornerBracket, styles.bracketTL]}>
          <View style={styles.rivetDot} />
        </View>
        <View style={[styles.cornerBracket, styles.bracketTR]}>
          <View style={styles.rivetDot} />
        </View>
        <View style={[styles.cornerBracket, styles.bracketBL]}>
          <View style={styles.rivetDot} />
        </View>
        <View style={[styles.cornerBracket, styles.bracketBR]}>
          <View style={styles.rivetDot} />
        </View>

        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>CAMPAIGN PROGRESS</Text>
          <Text style={styles.headerProgress}>
            <Text style={{ color: '#00F2FE' }}>{completedLevels}/{totalLevels}</Text>{' '}
            <Text style={{ color: '#FFD166' }}>({percent}%)</Text>
          </Text>
        </View>

        {/* Recessed Progress Bar Groove */}
        <View style={styles.progressGroove}>
          <View style={[styles.liquidBubble, { width: `${Math.max(6, percent)}%` }]}>
            <LinearGradient
              colors={['#38D9F8', '#0288D1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            >
              <View style={styles.bubbleHighlight} />
            </LinearGradient>
          </View>
        </View>

        {/* 3 Columns Section */}
        <View style={styles.statsRow}>
          {/* Column 1: Stars */}
          <View style={styles.statCol}>
            <View style={styles.iconCircleYellow}>
              <Ionicons name="star" size={24} color="#FFD13B" style={styles.iconGlowYellow} />
            </View>
            <Text style={styles.statValue}>{stars}</Text>
            <Text style={styles.statLabel}>STARS</Text>
          </View>

          {/* Vertical Divider */}
          <View style={styles.vertDivider} />

          {/* Column 2: Streak */}
          <View style={styles.statCol}>
            <View style={styles.iconCirclePink}>
              <Ionicons name="flame" size={24} color="#FF3366" style={styles.iconGlowPink} />
            </View>
            <Text style={styles.statValue}>{streak}d</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>

          {/* Vertical Divider */}
          <View style={styles.vertDivider} />

          {/* Column 3: Tier */}
          <View style={styles.statCol}>
            <View style={styles.iconCircleTeal}>
              <Ionicons name="shield-checkmark" size={24} color="#00F2FE" style={styles.iconGlowTeal} />
            </View>
            <Text style={styles.statValue}>Lvl {unlockedLevel}</Text>
            <Text style={styles.statLabel}>TIER</Text>
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
    marginVertical: 12,
  },
  shadowBase: {
    position: 'absolute',
    top: 6,
    left: 4,
    right: 4,
    bottom: -6,
    borderRadius: 22,
    backgroundColor: '#2A1A0E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  woodBoard: {
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: '#A67B54',
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  woodSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cornerBracket: {
    position: 'absolute',
    width: 14,
    height: 14,
    backgroundColor: '#9E9E9E',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  bracketTL: { top: 0, left: 0, borderBottomRightRadius: 6 },
  bracketTR: { top: 0, right: 0, borderBottomLeftRadius: 6 },
  bracketBL: { bottom: 0, left: 0, borderTopRightRadius: 6 },
  bracketBR: { bottom: 0, right: 0, borderTopLeftRadius: 6 },
  rivetDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#424242',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFE8A3',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  headerProgress: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  progressGroove: {
    height: 14,
    borderRadius: 7,
    backgroundColor: '#352416',
    borderWidth: 1.5,
    borderColor: '#26190E',
    overflow: 'hidden',
    padding: 1.5,
    marginBottom: 14,
  },
  liquidBubble: {
    height: '100%',
    borderRadius: 5,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleHighlight: {
    position: 'absolute',
    top: 1,
    left: 2,
    right: 2,
    height: '38%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 2,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  iconCircleYellow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 209, 59, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 209, 59, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconCirclePink: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 51, 102, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 102, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconCircleTeal: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 242, 254, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconGlowYellow: {
    textShadowColor: '#FFA800',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  iconGlowPink: {
    textShadowColor: '#FF0055',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  iconGlowTeal: {
    textShadowColor: '#00F2FE',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
    marginBottom: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D4B896',
    letterSpacing: 0.8,
  },
  vertDivider: {
    width: 1.5,
    height: 38,
    backgroundColor: '#4A3420',
  },
});
