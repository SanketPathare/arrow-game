import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameBackground } from '../components/GameBackground.js';
import { ThreeDButton } from '../components/ThreeDButton.js';
import { ThreeDModalPlaque } from '../components/ThreeDModalPlaque.js';
import { soundManager } from '../utils/sound.js';

export function SettingsScreen({
  settings,
  onUpdateSettings,
  onResetProgress,
  onBack,
  theme,
}) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const toggleSound = (val) => {
    soundManager.playClickSound();
    onUpdateSettings({ soundEnabled: val });
  };

  const toggleHaptics = (val) => {
    soundManager.playClickSound();
    onUpdateSettings({ hapticsEnabled: val });
  };

  const toggleDarkMode = (val) => {
    soundManager.playClickSound();
    onUpdateSettings({ darkMode: val });
  };

  const confirmReset = async () => {
    soundManager.playClickSound();
    await onResetProgress();
    setShowResetConfirm(false);
  };

  return (
    <GameBackground type="home">
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <ThreeDButton
            icon="arrow-back"
            iconSize={24}
            colorScheme="circle-blue"
            size="circle"
            onPress={onBack}
          />
          <Text style={styles.title}>SETTINGS</Text>
          <View style={{ width: 52 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Audio & Feedback Section */}
          <Text style={styles.sectionHeader}>SYSTEM AUDIO & HAPTICS</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 242, 254, 0.16)' }]}>
                  <Ionicons name="volume-high" size={20} color="#00F2FE" />
                </View>
                <View>
                  <Text style={styles.rowTitle}>Sound Effects</Text>
                  <Text style={styles.rowSubtitle}>Audio feedback on moves and extraction</Text>
                </View>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={toggleSound}
                trackColor={{ false: '#314A70', true: '#00F2FE' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 209, 59, 0.16)' }]}>
                  <Ionicons name="hardware-chip" size={20} color="#FFD13B" />
                </View>
                <View>
                  <Text style={styles.rowTitle}>Haptic Tactile</Text>
                  <Text style={styles.rowSubtitle}>Vibrate on escape or blocked collision</Text>
                </View>
              </View>
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={toggleHaptics}
                trackColor={{ false: '#314A70', true: '#FFD13B' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Theme Section */}
          <Text style={styles.sectionHeader}>INTERFACE THEME</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(129, 140, 248, 0.16)' }]}>
                  <Ionicons
                    name={settings.darkMode ? 'moon' : 'sunny'}
                    size={20}
                    color={settings.darkMode ? '#818CF8' : '#FFD13B'}
                  />
                </View>
                <View>
                  <Text style={styles.rowTitle}>Dark Fantasy Atmosphere</Text>
                  <Text style={styles.rowSubtitle}>Magical night forest aesthetic</Text>
                </View>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#314A70', true: '#818CF8' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Data Section */}
          <Text style={styles.sectionHeader}>DATA MANAGEMENT</Text>
          <View style={[styles.card, styles.dangerCard]}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 42, 109, 0.16)' }]}>
                  <Ionicons name="trash-outline" size={20} color="#FF2A6D" />
                </View>
                <View>
                  <Text style={styles.rowTitle}>Reset Progress</Text>
                  <Text style={styles.rowSubtitle}>Erase campaign stars and unlocked levels</Text>
                </View>
              </View>
            </View>

            <ThreeDButton
              title="Reset Campaign Progress"
              colorScheme="danger"
              size="md"
              onPress={() => setShowResetConfirm(true)}
              style={{ marginTop: 12 }}
            />
          </View>

          {/* Footer Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ARROW ESCAPE • 3D CARTOON EDITION</Text>
            <Text style={styles.infoSubtitle}>Pure Native React Native & Expo SDK 58</Text>
          </View>
        </ScrollView>

        {/* 3D Confirmation Modal Plaque */}
        <ThreeDModalPlaque
          visible={showResetConfirm}
          onClose={() => setShowResetConfirm(false)}
          crestType="warning"
          title="RESET CAMPAIGN?"
          subtitle="Irreversible action warning"
          maxWidth={360}
        >
          <View style={styles.confirmBox}>
            <Text style={styles.confirmDesc}>
              This will irreversibly reset all 50 unlocked levels, stars, and campaign progress back to Level 1.
            </Text>
          </View>

          <View style={styles.modalActionRow}>
            <ThreeDButton
              title="Cancel"
              colorScheme="blue"
              size="md"
              onPress={() => setShowResetConfirm(false)}
              style={{ flex: 1, marginRight: 8 }}
            />

            <ThreeDButton
              title="Yes, Reset"
              colorScheme="danger"
              size="md"
              onPress={confirmReset}
              style={{ flex: 1 }}
            />
          </View>
        </ThreeDModalPlaque>
      </View>
    </GameBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 4,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFE8A3',
    letterSpacing: 1.2,
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#4A6FA5',
    backgroundColor: 'rgba(22, 38, 66, 0.85)',
    padding: 16,
  },
  dangerCard: {
    borderColor: 'rgba(255, 42, 109, 0.5)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#B0C8E8',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(74, 111, 165, 0.4)',
    marginVertical: 10,
  },
  infoBox: {
    alignItems: 'center',
    marginTop: 32,
    paddingVertical: 12,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E0F2FE',
    letterSpacing: 1,
    marginBottom: 3,
  },
  infoSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  confirmBox: {
    backgroundColor: 'rgba(12, 6, 2, 0.65)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  confirmDesc: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#D4B59D',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalActionRow: {
    flexDirection: 'row',
    width: '100%',
  },
});
