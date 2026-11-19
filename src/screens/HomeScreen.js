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
import { soundManager } from '../utils/sound.js';

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
      >
        {/* Top Section Matching Reference Image 1 */}
        <View style={styles.topBar}>
          {/* Help Button (Circular Blue 3D) */}
          <ThreeDButton
            icon="help"
            iconSize={26}
            colorScheme="circle-blue"
            size="circle"
            onPress={() => setShowHowToPlay(true)}
          />

          {/* Central Tactical Puzzle Pill */}
          <TactilePill type="tactical" />

          {/* Settings Button (Circular Orange 3D) */}
          <ThreeDButton
            icon="settings"
            iconSize={24}
            colorScheme="circle-orange"
            size="circle"
            onPress={onOpenSettings}
          />
        </View>

        {/* Central 3D Emblem & Title (Matching Reference Image 1) */}
        <ThreeDEmblem size={120} showTitle={true} />

        {/* Wooden Campaign Progress Board (Matching Reference Image 1) */}
        <WoodenCampaignBoard
          completedLevels={completedLevels}
          totalLevels={50}
          stars={totalStars}
          streak={streak}
          unlockedLevel={unlockedLevel}
        />

        {/* 3 Main 3D Buttons (Matching Reference Image 1) */}
        <View style={styles.buttonStack}>
          {/* Button 1: Continue Level */}
          <ThreeDButton
            title={`Continue Level ${unlockedLevel}`}
            icon="play"
            iconSize={22}
            colorScheme="cyan"
            size="lg"
            onPress={() => onPlay(unlockedLevel)}
            style={styles.btnSpacing}
          />

          {/* Button 2: Level Vault */}
          <ThreeDButton
            title="Level Vault (50 Stages)"
            icon="grid"
            iconSize={22}
            colorScheme="blue"
            size="lg"
            onPress={onOpenLevelSelect}
            style={styles.btnSpacing}
          />

          {/* Button 3: Daily Protocol */}
          <ThreeDButton
            title={isDailyCompletedToday ? 'Daily Protocol (Done ✓)' : 'Daily Protocol'}
            icon="calendar"
            iconSize={22}
            colorScheme="yellow"
            size="lg"
            badge={isDailyCompletedToday ? null : 'NEW'}
            onPress={onOpenDaily}
            style={styles.btnSpacing}
          />
        </View>

        {/* Star Glint Sparkle Decor */}
        <View style={styles.sparkleDecor} pointerEvents="none">
          <Ionicons name="sparkles" size={26} color="rgba(255, 255, 255, 0.85)" />
        </View>
      </ScrollView>

      {/* 3D How to Play Modal */}
      <Modal
        visible={showHowToPlay}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHowToPlay(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.rulesCard}>
            <View style={styles.rulesTitleBar}>
              <Ionicons name="navigate-circle" size={28} color="#00F2FE" style={{ marginRight: 8 }} />
              <Text style={styles.rulesTitle}>RULES OF ESCAPE</Text>
            </View>

            <View style={styles.ruleItem}>
              <View style={styles.ruleIconBoxCyan}>
                <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.ruleTextBox}>
                <Text style={styles.ruleHeader}>Direction Vector</Text>
                <Text style={styles.ruleDesc}>
                  Arrows can only exit straight out of the board in their pointing direction.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <View style={styles.ruleIconBoxRed}>
                <Ionicons name="hand-left" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.ruleTextBox}>
                <Text style={styles.ruleHeader}>Avoid Blockers</Text>
                <Text style={styles.ruleDesc}>
                  If any arrow blocks its path, it cannot move. Free the blocking arrows first!
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <View style={styles.ruleIconBoxYellow}>
                <Ionicons name="star" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.ruleTextBox}>
                <Text style={styles.ruleHeader}>Clear the Board</Text>
                <Text style={styles.ruleDesc}>
                  Remove all arrows with strategic precision to achieve a perfect 3-star score!
                </Text>
              </View>
            </View>

            <ThreeDButton
              title="Understood!"
              colorScheme="cyan"
              size="md"
              onPress={() => setShowHowToPlay(false)}
              style={{ width: '100%', marginTop: 8 }}
            />
          </View>
        </View>
      </Modal>
    </GameBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: 'center',
    position: 'relative',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonStack: {
    width: '100%',
    marginTop: 4,
  },
  btnSpacing: {
    marginBottom: 8,
  },
  sparkleDecor: {
    position: 'absolute',
    bottom: 25,
    right: 15,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 5, 14, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  rulesCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: '#6BA5E0',
    backgroundColor: '#1E2C44',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  rulesTitleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    width: '100%',
  },
  ruleIconBoxCyan: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#0288D1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ruleIconBoxRed: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#D81136',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ruleIconBoxYellow: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFA800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ruleTextBox: {
    flex: 1,
  },
  ruleHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  ruleDesc: {
    fontSize: 12,
    color: '#B0C8E8',
    lineHeight: 16,
  },
});
