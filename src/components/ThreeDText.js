import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * 3D Extruded Cartoon Typography with multiple shadow layers and specular stroke.
 */
export function ThreeDText({
  text,
  size = 28,
  color = '#FFFFFF',
  depthColor = '#01579B',
  depth = 4,
  strokeColor = '#002B49',
  style,
  textStyle,
}) {
  // Generate layered shadow stack for genuine 3D extrusion effect
  const layers = [];
  for (let i = depth; i >= 1; i--) {
    layers.push(
      <Text
        key={i}
        style={[
          styles.textBase,
          {
            fontSize: size,
            color: depthColor,
            top: i,
            left: 0,
            position: 'absolute',
            textShadowColor: strokeColor,
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          },
          textStyle,
        ]}
      >
        {text}
      </Text>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* 3D Extruded Depth Layers */}
      {layers}

      {/* Front Face Text */}
      <Text
        style={[
          styles.textBase,
          {
            fontSize: size,
            color,
            textShadowColor: strokeColor,
            textShadowOffset: { width: 0, height: 1.5 },
            textShadowRadius: 3,
          },
          textStyle,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBase: {
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
});
