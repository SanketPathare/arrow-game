import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThreeDModalPlaque } from './ThreeDModalPlaque.js';
import { ThreeDButton } from './ThreeDButton.js';
import { ThreeDToggle } from './ThreeDToggle.js';
import { SvgSound, SvgHaptic } from './SvgIcons.js';

/**
 * Pause menu with quick feedback controls and game actions.
 */
export function PauseModal({
  visible,
  onResume,
  onRestart,
  onLevelSelect,
  onHome,
  soundEnabled,
  hapticsEnabled,
  onToggleSound,
  onToggleHaptics,
}) {
  return (
    <ThreeDModalPlaque
      visible={visible}
      onClose={onResume}
      crestType="pause"
      title="GAME PAUSED"
      subtitle="Take a breath. Your board is waiting."
      maxWidth={360}
      showClose={false}
    >
      {/* Recessed Settings Inlay Tray */}
      <View style={styles.settingsTray}>
        {/* Toggle 1: Sound Effects */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            {/* 3D Cyan Icon Badge */}
            <LinearGradient
              colors={['#38D9F8', '#0FB7E8', '#0288D1']}
              style={styles.iconBadge}
            >
              <SvgSound size={18} color="#FFFFFF" muted={!soundEnabled} />
            </LinearGradient>

            <View style={styles.labelCol}>
              <Text style={styles.rowTitle}>Sound Effects</Text>
              <Text style={styles.rowSubtitle}>Move, blocked, and victory cues</Text>
            </View>
          </View>

          <ThreeDToggle
            value={soundEnabled}
            onValueChange={onToggleSound}
            colorScheme="cyan"
          />
        </View>

        {/* Inlay Divider */}
        <View style={styles.trayDivider} />

        {/* Toggle 2: Haptic Tactile */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            {/* 3D Yellow/Orange Icon Badge */}
            <LinearGradient
              colors={['#FFD13B', '#FFA800', '#F57C00']}
              style={styles.iconBadge}
            >
              <SvgHaptic size={18} color="#FFFFFF" enabled={hapticsEnabled} />
            </LinearGradient>

            <View style={styles.labelCol}>
              <Text style={styles.rowTitle}>Haptic feedback</Text>
              <Text style={styles.rowSubtitle}>A light response to each move</Text>
            </View>
          </View>

          <ThreeDToggle
            value={hapticsEnabled}
            onValueChange={onToggleHaptics}
            colorScheme="yellow"
          />
        </View>
      </View>

      {/* 3D Action Buttons Stack */}
      <View style={styles.actionStack}>
        {/* Hero Button: Resume Game */}
        <ThreeDButton
          title="RESUME"
          icon="play"
          iconSize={22}
          colorScheme="cyan"
          size="lg"
          onPress={onResume}
          style={styles.btnSpacing}
        />

        {/* Secondary: Restart Level */}
        <ThreeDButton
          title="RESTART LEVEL"
          icon="refresh"
          iconSize={20}
          colorScheme="yellow"
          size="md"
          onPress={onRestart}
          style={styles.btnSpacing}
        />

        {/* Bottom Row: Level Vault & Home Base */}
        <View style={styles.bottomRow}>
          <ThreeDButton
            title="Levels"
            icon="grid"
            iconSize={18}
            colorScheme="blue"
            size="md"
            onPress={onLevelSelect}
            style={{ flex: 1, marginRight: 8 }}
          />

          <ThreeDButton
            title="Home"
            icon="home"
            iconSize={18}
            colorScheme="blue"
            size="md"
            onPress={onHome}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </ThreeDModalPlaque>
  );
}

const styles = StyleSheet.create({
  settingsTray: {
    backgroundColor: 'rgba(2, 6, 23, 0.58)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
  },
  labelCol: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  rowSubtitle: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 1,
  },
  trayDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.16)',
    marginVertical: 4,
  },
  actionStack: {
    width: '100%',
  },
  btnSpacing: {
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
