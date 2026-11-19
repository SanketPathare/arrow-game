import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameBackground } from '../components/GameBackground.js';
import { ThreeDButton } from '../components/ThreeDButton.js';
import { TactilePill } from '../components/TactilePill.js';
import { ThreeDEmblem } from '../components/ThreeDEmblem.js';
import { WoodenCampaignBoard } from '../components/WoodenCampaignBoard.js';
import { ThreeDModalPlaque } from '../components/ThreeDModalPlaque.js';
import { LinearGradient } from 'expo-linear-gradient';

export function HomeScreen({
  unlockedLevel = 1,
  levelStats = {},
  dailyStats = {},
  onPlay,
  onOpenLevelSelect,
  onOpenDaily,
  onOpenSettings,
  theme,
}) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Compute stats
  const completedLevels = Object.keys(levelStats).filter((k) => levelStats[k]?.completed).length;
  const totalStars = Object.values(levelStats).reduce((acc, curr) => acc + (curr?.stars || 0), 0);
  const streak = dailyStats?.streak || 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const isDailyCompletedToday = dailyStats?.lastPlayedDate === todayStr;

  return (
    <GameBackground type="home">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Action Row (Matching Reference Image 1) */}
        <View style={styles.topBar}>
          {/* Circular Blue 3D Help Button */}
          <ThreeDButton
            icon="help"
            iconSize={26}
            colorScheme="circle-blue"
            size="circle"
            onPress={() => setShowHowToPlay(true)}
          />

          {/* Central 3D Tactical Puzzle Pill */}
          <TactilePill type="tactical" />

          {/* Circular Orange 3D Settings Button with Clean Crisp Cog */}
          <ThreeDButton
            icon="settings"
            iconSize={24}
            colorScheme="circle-orange"
            size="circle"
            onPress={onOpenSettings}
          />
        </View>

        {/* Central 3D Shield Emblem & Title */}
        <ThreeDEmblem size={96} showTitle={true} />

        {/* 3D Wooden Campaign Progress Board */}
        <WoodenCampaignBoard
          completedLevels={completedLevels}
          totalLevels={50}
          stars={totalStars}
          streak={streak}
          unlockedLevel={unlockedLevel}
        />

        {/* 3 Main 3D Buttons Stack */}
        <View style={styles.buttonStack}>
          {/* Button 1: Continue Level */}
          <ThreeDButton
            title={`Continue Level ${unlockedLevel}`}
            icon="play"
            iconSize={20}
            colorScheme="cyan"
            size="lg"
            onPress={() => onPlay(unlockedLevel)}
            style={styles.btnSpacing}
          />

          {/* Button 2: Level Vault */}
          <ThreeDButton
            title="Level Vault (50 Stages)"
            icon="grid"
            iconSize={20}
            colorScheme="blue"
            size="lg"
            onPress={onOpenLevelSelect}
            style={styles.btnSpacing}
          />

          {/* Button 3: Daily Protocol */}
          <View style={styles.dailyButtonWrapper}>
            <ThreeDButton
              title={isDailyCompletedToday ? 'Daily Protocol (Done ✓)' : 'Daily Protocol'}
              icon="calendar"
              iconSize={20}
              colorScheme="yellow"
              size="lg"
              badge={isDailyCompletedToday ? null : 'NEW'}
              onPress={onOpenDaily}
              style={{ width: '100%' }}
            />

            {/* Star Glint Sparkle at Bottom Right of Daily Protocol (Matching Reference Image 1) */}
            <View style={styles.sparkleDecor} pointerEvents="none">
              <Ionicons name="sparkles" size={24} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 3D How to Play Modal Plaque */}
      <ThreeDModalPlaque
        visible={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
        crestType="rules"
        title="HOW TO PLAY"
        subtitle="Master the tactical clearance"
        maxWidth={360}
      >
        <View style={styles.rulesTray}>
          <View style={styles.ruleItem}>
            <LinearGradient
              colors={['#38D9F8', '#0FB7E8', '#0288D1']}
              style={styles.ruleIconBox}
            >
              <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.ruleTextBox}>
              <Text style={styles.ruleHeader}>Direction Vector</Text>
              <Text style={styles.ruleDesc}>
                Arrows escape in the direction they point.
              </Text>
            </View>
          </View>

          <View style={styles.trayDivider} />

          <View style={styles.ruleItem}>
            <LinearGradient
              colors={['#FF5E7E', '#E62E5C', '#BF123F']}
              style={styles.ruleIconBox}
            >
              <Ionicons name="hand-left" size={20} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.ruleTextBox}>
              <Text style={styles.ruleHeader}>Avoid Blockers</Text>
              <Text style={styles.ruleDesc}>
                Blocked paths cannot move. Free blocking arrows first!
              </Text>
            </View>
          </View>

          <View style={styles.trayDivider} />

          <View style={styles.ruleItem}>
            <LinearGradient
              colors={['#FFD13B', '#FFA800', '#F57C00']}
              style={styles.ruleIconBox}
            >
              <Ionicons name="star" size={20} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.ruleTextBox}>
              <Text style={styles.ruleHeader}>Clear the Board</Text>
              <Text style={styles.ruleDesc}>
                Evacuate all arrows to achieve 3 stars and unlock the next level!
              </Text>
            </View>
          </View>
        </View>

        <ThreeDButton
          title="GOT IT, LET'S PLAY!"
          colorScheme="cyan"
          size="md"
          onPress={() => setShowHowToPlay(false)}
          style={{ width: '100%', marginTop: 4 }}
        />
      </ThreeDModalPlaque>
    </GameBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  buttonStack: {
    width: '100%',
    marginTop: 2,
  },
  btnSpacing: {
    marginBottom: 6,
  },
  dailyButtonWrapper: {
    position: 'relative',
    width: '100%',
  },
  sparkleDecor: {
    position: 'absolute',
    bottom: -6,
    right: 4,
    zIndex: 20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  rulesTray: {
    backgroundColor: 'rgba(12, 6, 2, 0.65)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    width: '100%',
  },
  ruleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
  },
  trayDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    marginVertical: 4,
  },
  ruleTextBox: {
    flex: 1,
  },
  ruleHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF2C6',
    marginBottom: 1,
  },
  ruleDesc: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D4B59D',
    lineHeight: 15,
  },
});
