import React from 'react';
import { StyleSheet, View, ImageBackground, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnvironmentalParticles } from './EnvironmentalParticles.js';

export function GameBackground({ type = 'home', children, theme }) {
  const insets = useSafeAreaInsets();

  const isDark = !theme || theme.name === 'dark';
  const bgSource = isDark
    ? require('../../assets/home_bg.jpg')
    : require('../../assets/game_bg.jpg');

  // Ensure comfortable top clearance on all devices (notches, punch-holes, dynamic island)
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? 24 : 12);
  const bottomInset = insets.bottom > 0 ? insets.bottom : 10;

  return (
    <ImageBackground
      source={bgSource}
      style={styles.fullScreenBackground}
      resizeMode="cover"
    >
      {/* Floating magical firefly particles */}
      <LinearGradient
        colors={isDark
          ? ['rgba(4, 8, 22, 0.56)', 'rgba(8, 15, 34, 0.68)', 'rgba(4, 8, 22, 0.88)']
          : ['rgba(248, 250, 252, 0.38)', 'rgba(239, 246, 255, 0.52)', 'rgba(248, 250, 252, 0.78)']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <EnvironmentalParticles
        count={type === 'home' ? 8 : 4}
        color={isDark ? '#7DD3FC' : '#F59E0B'}
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
  },
  safeContentContainer: {
    flex: 1,
  },
  responsiveMaxConstraint: {
    flex: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
});
