import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThreeDStar, ThreeDFlame, ThreeDShield } from './ThreeDIcons.js';

export function CampaignProgressCard({
  completedLevels = 2,
  totalLevels = 50,
  stars = 6,
  streak = 0,
  unlockedLevel = 3,
}) {
  const percent = Math.min(100, Math.round((completedLevels / totalLevels) * 100));

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={['rgba(20, 32, 57, 0.96)', 'rgba(11, 19, 38, 0.96)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.progressCard}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>YOUR JOURNEY</Text>
            <Text style={styles.headerSubtitle}>Campaign progress</Text>
          </View>
          <Text style={styles.headerProgress}>
            <Text style={{ color: '#00F2FE' }}>{completedLevels}/{totalLevels}</Text>{' '}
            <Text style={{ color: '#94A3B8' }}>levels</Text>
          </Text>
        </View>

        <View style={styles.progressGroove}>
          <View style={[styles.liquidBubble, { width: `${percent}%` }]}>
            <LinearGradient
              colors={['#67E8F9', '#38BDF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <View style={styles.iconSlot}>
              <ThreeDStar size={28} />
            </View>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statValue}>{stars}</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statLabel}>STARS EARNED</Text>
          </View>

          <View style={styles.vertDivider} />

          <View style={styles.statCol}>
            <View style={styles.iconSlot}>
              <ThreeDFlame size={28} />
            </View>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statValue}>{streak}d</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statLabel}>DAILY STREAK</Text>
          </View>

          <View style={styles.vertDivider} />

          <View style={styles.statCol}>
            <View style={styles.iconSlot}>
              <ThreeDShield size={28} />
            </View>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statValue}>Level {unlockedLevel}</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statLabel}>UP NEXT</Text>
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
    marginVertical: 10,
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.34,
    shadowRadius: 14,
    elevation: 7,
  },
  progressCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.24)',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  headerProgress: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressGroove: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(2, 6, 23, 0.72)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  liquidBubble: {
    height: '100%',
    borderRadius: 4,
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
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  vertDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(148, 163, 184, 0.22)',
  },
});
