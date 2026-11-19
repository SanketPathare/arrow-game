import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function TactilePill({
  type = 'tactical', // 'tactical' | 'difficulty'
  sizeText = '4X4',
  difficulty = 'BEGINNER',
}) {
  if (type === 'tactical') {
    return (
      <View style={styles.tacticalOuter}>
        <View style={styles.tacticalShadow} />
        <LinearGradient
          colors={['#4271A3', '#254A78', '#163359']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.tacticalFace}
        >
          <View style={styles.sheenHighlight} />
          <Text style={styles.tacticalLine1}>TACTICAL</Text>
          <Text style={styles.tacticalLine2}>PUZZLE</Text>
        </LinearGradient>
      </View>
    );
  }

  // Difficulty pill matching Image 2
  return (
    <View style={styles.difficultyOuter}>
      <LinearGradient
        colors={['#3B6EA8', '#254A78']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.difficultyFace}
      >
        <View style={styles.greenPulseDot} />
        <Text style={styles.difficultyText}>
          {sizeText} • {difficulty}
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  tacticalOuter: {
    position: 'relative',
    marginHorizontal: 8,
  },
  tacticalShadow: {
    position: 'absolute',
    top: 3,
    left: 2,
    right: 2,
    bottom: -3,
    borderRadius: 18,
    backgroundColor: '#0F223D',
  },
  tacticalFace: {
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#6BA5E0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  sheenHighlight: {
    position: 'absolute',
    top: 1,
    left: 4,
    right: 4,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 8,
  },
  tacticalLine1: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFE8A3',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
    lineHeight: 15,
  },
  tacticalLine2: {
    fontSize: 11,
    fontWeight: '900',
    color: '#00F2FE',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  difficultyOuter: {
    marginTop: 4,
  },
  difficultyFace: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#5D93CE',
  },
  greenPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#06D6A0',
    marginRight: 6,
    shadowColor: '#06D6A0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#E0F2FE',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
