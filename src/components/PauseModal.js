import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameButton } from './GameButton.js';

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
  theme,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onResume}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.borderLight || theme.border,
            },
          ]}
        >
          {/* Pause Icon Glow Badge */}
          <View style={styles.pauseBadge}>
            <Ionicons name="pause" size={26} color="#00F2FE" />
          </View>

          <Text style={[styles.title, { color: theme.text }]}>PAUSE PROTOCOL</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Current operations suspended
          </Text>

          {/* Quick settings toggles */}
          <View
            style={[
              styles.settingsBox,
              {
                backgroundColor: theme.surfaceLight,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelGroup}>
                <Ionicons name="volume-high" size={18} color={theme.accent} style={{ marginRight: 10 }} />
                <Text style={[styles.toggleLabel, { color: theme.text }]}>Audio Effects</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={onToggleSound}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelGroup}>
                <Ionicons name="hardware-chip" size={18} color="#FFB703" style={{ marginRight: 10 }} />
                <Text style={[styles.toggleLabel, { color: theme.text }]}>Haptic Tactile</Text>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={onToggleHaptics}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionButtons}>
            <GameButton
              title="Resume Game"
              icon="play"
              variant="primary"
              size="lg"
              onPress={onResume}
              theme={theme}
              style={styles.btnSpacing}
            />

            <GameButton
              title="Restart Level"
              icon="refresh"
              variant="secondary"
              size="md"
              onPress={onRestart}
              theme={theme}
              style={styles.btnSpacing}
            />

            <View style={styles.rowButtons}>
              <GameButton
                title="Level Vault"
                icon="grid"
                variant="secondary"
                size="md"
                onPress={onLevelSelect}
                theme={theme}
                style={{ flex: 1, marginRight: 8 }}
              />

              <GameButton
                title="Home Base"
                icon="home"
                variant="secondary"
                size="md"
                onPress={onHome}
                theme={theme}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 5, 12, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 28,
    borderWidth: 1.5,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  pauseBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  settingsBox: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 22,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  actionButtons: {
    width: '100%',
  },
  btnSpacing: {
    marginBottom: 10,
  },
  rowButtons: {
    flexDirection: 'row',
    width: '100%',
  },
});
