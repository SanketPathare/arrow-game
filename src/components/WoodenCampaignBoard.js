import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThreeDStar, ThreeDFlame, ThreeDShield } from './ThreeDIcons.js';

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
        colors={['#966F4B', '#7A5738', '#5E4025']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.woodBoard}
      >
        {/* Subtle Horizontal Wood Plank Grooves */}
        <View style={styles.plankGroove1} />
        <View style={styles.plankGroove2} />

        {/* Top Wood Specular Bevel Highlight */}
        <View style={styles.topWoodBevel} />

        {/* Silver Metal Corner Brackets with Rivets & Vine Accents */}
        {/* Top-Left Bracket */}
        <View style={[styles.cornerBracket, styles.bracketTL]}>
          <View style={styles.rivetDot} />
          <View style={styles.vineLeafTL} />
        </View>

        {/* Top-Right Bracket */}
        <View style={[styles.cornerBracket, styles.bracketTR]}>
          <View style={styles.rivetDot} />
          <View style={styles.vineLeafTR} />
        </View>

        {/* Bottom-Left Bracket */}
        <View style={[styles.cornerBracket, styles.bracketBL]}>
          <View style={styles.rivetDot} />
          <View style={styles.vineLeafBL} />
        </View>

        {/* Bottom-Right Bracket */}
        <View style={[styles.cornerBracket, styles.bracketBR]}>
          <View style={styles.rivetDot} />
          <View style={styles.vineLeafBR} />
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

        {/* 3 Columns Section with 3D Cartoon Icons */}
        <View style={styles.statsRow}>
          {/* Column 1: 3D Star */}
          <View style={styles.statCol}>
            <View style={styles.iconSlot}>
              <ThreeDStar size={28} />
            </View>
            <Text style={styles.statValue}>{stars}</Text>
            <Text style={styles.statLabel}>STARS</Text>
          </View>

          {/* Vertical Wooden Carved Divider */}
          <View style={styles.vertDivider} />

          {/* Column 2: 3D Flame */}
          <View style={styles.statCol}>
            <View style={styles.iconSlot}>
              <ThreeDFlame size={28} />
            </View>
            <Text style={styles.statValue}>{streak}d</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>

          {/* Vertical Wooden Carved Divider */}
          <View style={styles.vertDivider} />

          {/* Column 3: 3D Shield */}
          <View style={styles.statCol}>
            <View style={styles.iconSlot}>
              <ThreeDShield size={28} />
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
    marginVertical: 8,
  },
  shadowBase: {
    position: 'absolute',
    top: 5,
    left: 4,
    right: 4,
    bottom: -5,
    borderRadius: 22,
    backgroundColor: '#1C120A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  woodBoard: {
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: '#B08860',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  topWoodBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  plankGroove1: {
    position: 'absolute',
    top: '36%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(40, 24, 12, 0.45)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  plankGroove2: {
    position: 'absolute',
    top: '72%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(40, 24, 12, 0.45)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  cornerBracket: {
    position: 'absolute',
    width: 18,
    height: 18,
    backgroundColor: '#C5D1DE',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  bracketTL: { top: 0, left: 0, borderBottomRightRadius: 8 },
  bracketTR: { top: 0, right: 0, borderBottomLeftRadius: 8 },
  bracketBL: { bottom: 0, left: 0, borderTopRightRadius: 8 },
  bracketBR: { bottom: 0, right: 0, borderTopLeftRadius: 8 },
  rivetDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#5A6675',
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
  },
  vineLeafTL: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4EBA36',
    borderWidth: 1,
    borderColor: '#82DC6A',
  },
  vineLeafTR: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4EBA36',
    borderWidth: 1,
    borderColor: '#82DC6A',
  },
  vineLeafBL: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4EBA36',
    borderWidth: 1,
    borderColor: '#82DC6A',
  },
  vineLeafBR: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4EBA36',
    borderWidth: 1,
    borderColor: '#82DC6A',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFEAA7',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  headerProgress: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  progressGroove: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#27170B',
    borderWidth: 1.5,
    borderColor: '#180E07',
    overflow: 'hidden',
    padding: 1.5,
    marginBottom: 8,
  },
  liquidBubble: {
    height: '100%',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleHighlight: {
    position: 'absolute',
    top: 1,
    left: 2,
    right: 2,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  iconSlot: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
    marginBottom: 1,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#E8D5BC',
    letterSpacing: 0.8,
  },
  vertDivider: {
    width: 2,
    height: 36,
    backgroundColor: 'rgba(40, 24, 12, 0.6)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
});
