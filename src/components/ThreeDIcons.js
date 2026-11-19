import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * 3D Cartoon Star with golden gradient, bevel shadow, and specular glow.
 */
export function ThreeDStar({ size = 32, empty = false }) {
  if (empty) {
    return (
      <View style={[styles.iconWrapper, { width: size + 8, height: size + 8 }]}>
        <Ionicons name="star" size={size} color="#2A3950" />
      </View>
    );
  }

  return (
    <View style={[styles.iconWrapper, { width: size + 8, height: size + 8 }]}>
      {/* Ambient Star Glow */}
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

      {/* 3D Extrusion Shadow Layer */}
      <Ionicons
        name="star"
        size={size}
        color="#B86E00"
        style={[styles.shadowLayer, { top: 3 }]}
      />

      {/* Main Front Star */}
      <Ionicons
        name="star"
        size={size}
        color="#FFD13B"
        style={styles.frontLayer}
      />

      {/* Specular Glint */}
      <View
        style={[
          styles.specularDot,
          {
            top: size * 0.2,
            left: size * 0.35,
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: size * 0.11,
          },
        ]}
      />
    </View>
  );
}

/**
 * 3D Cartoon Flame with vibrant coral/pink/yellow gradient and glow.
 */
export function ThreeDFlame({ size = 32 }) {
  return (
    <View style={[styles.iconWrapper, { width: size + 8, height: size + 8 }]}>
      {/* Ambient Flame Glow */}
      <View
        style={[
          styles.glowHalo,
          {
            width: size + 12,
            height: size + 12,
            borderRadius: (size + 12) / 2,
            backgroundColor: 'rgba(255, 51, 102, 0.3)',
          },
        ]}
      />

      {/* 3D Extrusion Shadow Layer */}
      <Ionicons
        name="flame"
        size={size}
        color="#8B002B"
        style={[styles.shadowLayer, { top: 3 }]}
      />

      {/* Main Front Flame */}
      <Ionicons
        name="flame"
        size={size}
        color="#FF2A6D"
        style={styles.frontLayer}
      />

      {/* Inner Hot Yellow Core */}
      <View style={{ position: 'absolute', top: size * 0.38, zIndex: 4 }}>
        <Ionicons name="flame" size={size * 0.48} color="#FFE066" />
      </View>
    </View>
  );
}

/**
 * 3D Cartoon Shield with cyan/teal gradient, metallic rim, and white checkmark.
 */
export function ThreeDShield({ size = 32 }) {
  return (
    <View style={[styles.iconWrapper, { width: size + 8, height: size + 8 }]}>
      {/* Ambient Shield Glow */}
      <View
        style={[
          styles.glowHalo,
          {
            width: size + 12,
            height: size + 12,
            borderRadius: (size + 12) / 2,
            backgroundColor: 'rgba(0, 242, 254, 0.3)',
          },
        ]}
      />

      {/* 3D Extrusion Shadow Layer */}
      <Ionicons
        name="shield"
        size={size}
        color="#014D78"
        style={[styles.shadowLayer, { top: 3 }]}
      />

      {/* Main Front Shield */}
      <Ionicons
        name="shield"
        size={size}
        color="#00D2F2"
        style={styles.frontLayer}
      />

      {/* Inner Checkmark */}
      <View style={{ position: 'absolute', top: size * 0.22, zIndex: 4 }}>
        <Ionicons name="checkmark" size={size * 0.52} color="#FFFFFF" style={styles.checkShadow} />
      </View>
    </View>
  );
}

/**
 * 3D Cartoon Trophy with golden handles, star medal, and reflections.
 */
export function ThreeDTrophy({ size = 48 }) {
  return (
    <View style={[styles.iconWrapper, { width: size + 10, height: size + 10 }]}>
      {/* Golden Radiance */}
      <View
        style={[
          styles.glowHalo,
          {
            width: size + 16,
            height: size + 16,
            borderRadius: (size + 16) / 2,
            backgroundColor: 'rgba(255, 183, 3, 0.4)',
          },
        ]}
      />

      {/* 3D Shadow Base */}
      <Ionicons
        name="trophy"
        size={size}
        color="#945200"
        style={[styles.shadowLayer, { top: 3.5 }]}
      />

      {/* Front Golden Trophy */}
      <Ionicons
        name="trophy"
        size={size}
        color="#FFB703"
        style={styles.frontLayer}
      />

      {/* Center Star Glint */}
      <View style={{ position: 'absolute', top: size * 0.24, zIndex: 5 }}>
        <Ionicons name="star" size={size * 0.3} color="#FFFFFF" />
      </View>
    </View>
  );
}

/**
 * 3D Cartoon Pause Badge with circular cyan medallion and chunky white bars.
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
            backgroundColor: 'rgba(0, 242, 254, 0.35)',
          },
        ]}
      />

      {/* 3D Extruded Bevel */}
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
          colors={['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.05)']}
          style={{
            position: 'absolute',
            top: 2,
            left: 6,
            right: 6,
            height: '42%',
            borderRadius: size / 4,
          }}
        />

        {/* Two Chunky White 3D Pause Bars */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={[styles.pauseBar, { height: size * 0.44, width: size * 0.13, marginRight: size * 0.08 }]} />
          <View style={[styles.pauseBar, { height: size * 0.44, width: size * 0.13 }]} />
        </View>
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
  shadowLayer: {
    position: 'absolute',
    zIndex: 1,
  },
  frontLayer: {
    position: 'relative',
    zIndex: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  specularDot: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    zIndex: 5,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  checkShadow: {
    textShadowColor: '#014D78',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pauseBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    shadowColor: '#013A63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
});
