import React from 'react';
import { StyleSheet, View, ImageBackground, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnvironmentalParticles } from './EnvironmentalParticles.js';

export function GameBackground({ type = 'home', children }) {
  const insets = useSafeAreaInsets();

  const bgSource =
    type === 'home'
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
      <EnvironmentalParticles
        count={type === 'home' ? 18 : 12}
        color={type === 'home' ? '#FFE8A3' : '#FFD13B'}
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
  },
  safeContentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  responsiveMaxConstraint: {
    flex: 1,
    width: '100%',
    maxWidth: 500, // Perfect scaling for tablets and large foldables
    alignSelf: 'center',
  },
});
