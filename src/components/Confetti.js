import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, useWindowDimensions } from 'react-native';

const COLORS = ['#38BDF8', '#818CF8', '#A855F7', '#FBBF24', '#10B981', '#F43F5E', '#EC4899'];

export function Confetti({ count = 35 }) {
  const { width, height } = useWindowDimensions();

  const particles = useRef(
    Array.from({ length: count }).map(() => ({
      animY: new Animated.Value(0),
      animX: new Animated.Value(0),
      animRotate: new Animated.Value(0),
      startX: Math.random() * width,
      size: Math.random() * 8 + 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      drift: (Math.random() - 0.5) * 80,
      duration: Math.random() * 1200 + 1500,
      delay: Math.random() * 400,
    }))
  ).current;

  useEffect(() => {
    particles.forEach((p) => {
      Animated.parallel([
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.timing(p.animY, {
            toValue: height + 50,
            duration: p.duration,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.timing(p.animX, {
            toValue: p.drift,
            duration: p.duration,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.timing(p.animRotate, {
            toValue: 4,
            duration: p.duration,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  }, [height, particles]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => {
        const rotate = p.animRotate.interpolate({
          inputRange: [0, 4],
          outputRange: ['0deg', '720deg'],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: p.startX,
                top: -20,
                width: p.size,
                height: p.size * 1.4,
                backgroundColor: p.color,
                borderRadius: p.size * 0.2,
                transform: [
                  { translateY: p.animY },
                  { translateX: p.animX },
                  { rotate },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    zIndex: 999,
  },
});
