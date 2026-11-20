import React from 'react';
import { StyleSheet, View, ImageBackground, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnvironmentalParticles } from './EnvironmentalParticles.js';
import { getZoneById } from '../utils/zones.js';

export function GameBackground({
  type = 'home', // 'home' | 'game' | 'levelSelect'
  zone = 1,
  children,
  theme,
}) {
  const insets = useSafeAreaInsets();
  const zoneConfig = getZoneById(zone);

  // Background image selection based on type & zone
  let bgSource;
  if (type === 'game' || type === 'zone' || type === 'levelSelect') {
    bgSource = zoneConfig.bgSource;
  } else {
    // Default home screen background
    bgSource = require('../../assets/home_bg.jpg');
  }

  // Ensure comfortable top clearance on all devices (notches, punch-holes, dynamic island)
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? 24 : 12);
  const bottomInset = insets.bottom > 0 ? insets.bottom : 10;

  // Zone atmospheric gradient overlays
  const zoneGradientMap = {
    1: ['rgba(4, 24, 18, 0.42)', 'rgba(6, 32, 24, 0.62)', 'rgba(3, 16, 12, 0.88)'], // Whispering Woods
    2: ['rgba(30, 18, 6, 0.40)', 'rgba(42, 24, 8, 0.60)', 'rgba(20, 10, 4, 0.88)'],  // Sunken Oasis
    3: ['rgba(24, 6, 36, 0.45)', 'rgba(34, 8, 52, 0.64)', 'rgba(16, 4, 26, 0.88)'],  // Mystic Cavern
    4: ['rgba(6, 22, 38, 0.42)', 'rgba(8, 30, 52, 0.62)', 'rgba(4, 16, 30, 0.88)'],  // Sky Citadel
    5: ['rgba(34, 8, 12, 0.45)', 'rgba(48, 10, 18, 0.65)', 'rgba(24, 4, 8, 0.88)'],   // Obsidian Spire
  };

  const overlayColors = type === 'home'
    ? ['rgba(4, 8, 22, 0.52)', 'rgba(8, 15, 34, 0.66)', 'rgba(4, 8, 22, 0.88)']
    : (zoneGradientMap[zone] || zoneGradientMap[1]);

  return (
    <ImageBackground
      source={bgSource}
      style={styles.fullScreenBackground}
      resizeMode="cover"
    >
      {/* Dynamic Zone Atmospheric Ambient Gradient */}
      <LinearGradient
        colors={overlayColors}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Atmospheric Element Particles */}
      <EnvironmentalParticles
        count={type === 'home' ? 8 : 6}
        color={type === 'home' ? '#7DD3FC' : zoneConfig.particleColor}
      />

      {/* Edge-to-Edge Safe Inset Responsive Container */}
      <View
        style={[
          styles.safeContentContainer,
          {
            paddingTop: topInset,
            paddingBottom: bottomInset,
            paddingLeft: Math.max(insets.left, 0),
            paddingRight: Math.max(insets.right, 0),
          },
        ]}
      >
        <View style={styles.responsiveMaxConstraint}>
          {children}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fullScreenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#060814',
  },
  safeContentContainer: {
    flex: 1,
    width: '100%',
  },
  responsiveMaxConstraint: {
    flex: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
});
