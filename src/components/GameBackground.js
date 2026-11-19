import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { EnvironmentalParticles } from './EnvironmentalParticles.js';

export function GameBackground({ type = 'home', children }) {
  const bgSource =
    type === 'home'
      ? require('../../assets/home_bg.jpg')
      : require('../../assets/game_bg.jpg');

  return (
    <ImageBackground
      source={bgSource}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Floating magical firefly particles */}
      <EnvironmentalParticles
        count={type === 'home' ? 18 : 12}
        color={type === 'home' ? '#FFE8A3' : '#FFD13B'}
      />

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
  },
});
