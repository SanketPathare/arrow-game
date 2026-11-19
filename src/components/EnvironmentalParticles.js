import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Animated, useWindowDimensions } from 'react-native';

export function EnvironmentalParticles({ count = 16, color = '#FFE066' }) {
  const { width, height } = useWindowDimensions();

  const particles = useMemo(
    () => Array.from({ length: count }).map((_, index) => {
      const seed = index + 1;
      return {
      x: ((seed * 73) % 97) / 97 * Math.max(width - 20, 1) + 10,
      initialY: ((seed * 47) % 89) / 89 * (height * 0.7) + height * 0.15,
      size: ((seed * 13) % 5) + 3,
      animY: new Animated.Value(0),
      animX: new Animated.Value(0),
      animOpacity: new Animated.Value(0.2),
      duration: ((seed * 709) % 2500) + 3000,
      driftY: (((seed * 17) % 101) / 100 - 0.5) * 45,
      driftX: (((seed * 29) % 101) / 100 - 0.5) * 35,
    };
    }),
    [count, width, height]
  );

  useEffect(() => {
    const loops = [];

    particles.forEach((p) => {
      const floatLoop = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(p.animY, {
              toValue: p.driftY,
              duration: p.duration,
              useNativeDriver: true,
            }),
            Animated.timing(p.animX, {
              toValue: p.driftX,
              duration: p.duration,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(p.animOpacity, {
                toValue: 0.9,
                duration: p.duration * 0.4,
                useNativeDriver: true,
              }),
              Animated.timing(p.animOpacity, {
                toValue: 0.15,
                duration: p.duration * 0.6,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.parallel([
            Animated.timing(p.animY, {
              toValue: 0,
              duration: p.duration,
              useNativeDriver: true,
            }),
            Animated.timing(p.animX, {
              toValue: 0,
              duration: p.duration,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(p.animOpacity, {
                toValue: 0.8,
                duration: p.duration * 0.5,
                useNativeDriver: true,
              }),
              Animated.timing(p.animOpacity, {
                toValue: 0.2,
                duration: p.duration * 0.5,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ])
      );
      floatLoop.start();
      loops.push(floatLoop);
    });

    return () => loops.forEach((loop) => loop.stop());
  }, [particles]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.firefly,
            {
              left: p.x,
              top: p.initialY,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: color,
              shadowColor: color,
              opacity: p.animOpacity,
              transform: [
                { translateY: p.animY },
                { translateX: p.animX },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  firefly: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
});
