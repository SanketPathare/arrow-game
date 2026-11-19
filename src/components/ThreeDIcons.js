import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgStar, SvgFlame, SvgTrophy, SvgCheck, SvgPause } from './SvgIcons.js';

/**
 * 2D Rich Faceted Star with golden gradient, bevel shadow, and specular glow.
 */
export function ThreeDStar({ size = 32, empty = false }) {
  return (
    <View style={[styles.iconWrapper, { width: size + 6, height: size + 6 }]}>
      {/* Ambient Star Glow */}
      {!empty && (
        <View
          style={[
            styles.glowHalo,
            {
              width: size + 10,
              height: size + 10,
              borderRadius: (size + 10) / 2,
              backgroundColor: 'rgba(255, 209, 59, 0.28)',
            },
          ]}
        />
      )}

      {/* Main SVG Star */}
      <SvgStar size={size} empty={empty} color="#FFD13B" />
    </View>
  );
}

/**
 * 2D Cartoon Flame with vibrant coral/pink/yellow gradient and glow.
 */
export function ThreeDFlame({ size = 32 }) {
  return (
    <View style={[styles.iconWrapper, { width: size + 6, height: size + 6 }]}>
      {/* Ambient Flame Glow */}
      <View
        style={[
          styles.glowHalo,
          {
            width: size + 10,
            height: size + 10,
            borderRadius: (size + 10) / 2,
            backgroundColor: 'rgba(255, 51, 102, 0.28)',
          },
        ]}
      />

      {/* Main SVG Flame */}
      <SvgFlame size={size} color="#FF6B00" />
    </View>
  );
}

/**
 * 2D Cartoon Shield with cyan/teal gradient, metallic rim, and white checkmark.
 */
export function ThreeDShield({ size = 32 }) {
  return (
    <View style={[styles.iconWrapper, { width: size + 6, height: size + 6 }]}>
      {/* Ambient Shield Glow */}
      <View
        style={[
          styles.glowHalo,
          {
            width: size + 10,
            height: size + 10,
            borderRadius: (size + 10) / 2,
            backgroundColor: 'rgba(0, 242, 254, 0.28)',
          },
        ]}
      />

      {/* Beveled Circle with SVG check */}
      <LinearGradient
        colors={['#00F2FE', '#0288D1']}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SvgCheck size={size * 0.55} color="#FFFFFF" />
      </LinearGradient>
    </View>
  );
}

/**
 * 2D Cartoon Trophy with golden handles, star medal, and reflections.
 */
export function ThreeDTrophy({ size = 48 }) {
  return (
    <View style={[styles.iconWrapper, { width: size + 8, height: size + 8 }]}>
      {/* Golden Radiance */}
      <View
        style={[
          styles.glowHalo,
          {
            width: size + 14,
            height: size + 14,
            borderRadius: (size + 14) / 2,
            backgroundColor: 'rgba(255, 183, 3, 0.35)',
          },
        ]}
      />

      {/* Main SVG Trophy */}
      <SvgTrophy size={size} color="#FFD13B" />
    </View>
  );
}

/**
 * 2D Cartoon Pause Badge with circular cyan medallion and chunky white bars.
 */
export function ThreeDPauseBadge({ size = 52 }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer Glow */}
      <View
        style={[
          styles.glowHalo,
          {
            width: size + 8,
            height: size + 8,
            borderRadius: (size + 8) / 2,
            backgroundColor: 'rgba(0, 242, 254, 0.3)',
          },
        ]}
      />

      {/* 2D Extruded Bevel */}
      <View
        style={{
          position: 'absolute',
          top: 3,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#01456B',
        }}
      />

      {/* Main Medallion Face */}
      <LinearGradient
        colors={['#38D9F8', '#0FB7E8', '#0288D1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2.5,
          borderColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Curved Specular Sheen */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.65)', 'rgba(255, 255, 255, 0.05)']}
          style={{
            position: 'absolute',
            top: 2,
            left: 6,
            right: 6,
            height: '42%',
            borderRadius: size / 4,
          }}
        />

        {/* SVG Pause Bars */}
        <SvgPause size={size * 0.46} color="#FFFFFF" />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowHalo: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
});
