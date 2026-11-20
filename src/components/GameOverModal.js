import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Animated,
  Pressable,
  Easing,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThreeDText } from './ThreeDText.js';
import { SvgRefresh, SvgGrid, SvgHome, SvgHeart, SvgClose } from './SvgIcons.js';
import { soundManager } from '../utils/sound.js';
import { formatTime } from '../engine/puzzleEngine.js';

/**
 * Tactile 3D Action Button matching the game's chunky wood/stone button system,
 * enhanced with smooth hover lift shift and glow highlight.
 */
function TactileGameOverButton({
  title,
  icon,
  colorScheme = 'yellow', // 'yellow' | 'cyan' | 'blue'
  onPress,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Animations: hover lift shift and click depression
  const hoverAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(0)).current;

  const isActive = isHovered || isPressed;

  useEffect(() => {
    Animated.spring(hoverAnim, {
      toValue: isHovered ? 1 : 0,
      speed: 25,
      bounciness: 8,
      useNativeDriver: true,
    }).start();
  }, [isHovered, hoverAnim]);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(pressAnim, {
      toValue: 3.5,
      speed: 40,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(pressAnim, {
      toValue: 0,
      speed: 30,
      bounciness: 6,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    soundManager.playClickSound();
    if (onPress) onPress();
  };

  // Color schemes matching the app's ThreeDButton palette
  const schemeConfig = {
    yellow: {
      faceGradient: isActive
        ? ['#FDE047', '#FBBF24', '#F59E0B']
        : ['#FBBF24', '#F59E0B', '#D97706'],
      bevelColor: '#92400E',
      shadowColor: '#F59E0B',
      borderColor: isActive ? '#FEF08A' : 'rgba(253, 224, 71, 0.45)',
      textShadow: '#92400E',
    },
    cyan: {
      faceGradient: isActive
        ? ['#67E8F9', '#38D9F8', '#0FB7E8']
        : ['#38D9F8', '#0FB7E8', '#0288D1'],
      bevelColor: '#0369A1',
      shadowColor: '#0288D1',
      borderColor: isActive ? '#BAE6FD' : 'rgba(56, 189, 248, 0.45)',
      textShadow: '#01579B',
    },
    blue: {
      faceGradient: isActive
        ? ['#5A7EAC', '#45638C', '#304968']
        : ['#45638C', '#304968', '#24374F'],
      bevelColor: '#17283D',
      shadowColor: '#304968',
      borderColor: isActive ? '#CBD5E1' : 'rgba(148, 163, 184, 0.35)',
      textShadow: '#172C5E',
    },
  }[colorScheme];

  // Combined translate: hover lifts by -3px; press depresses down into bevel by +3.5px
  const translateY = Animated.add(
    hoverAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -3],
    }),
    pressAnim
  );

  const scale = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  return (
    <Animated.View
      style={[
        styles.buttonOuter,
        {
          transform: [{ translateY }, { scale }],
          shadowColor: schemeConfig.shadowColor,
          shadowRadius: isActive ? 14 : 5,
          shadowOpacity: isActive ? 0.65 : 0.35,
        },
      ]}
    >
      {/* 3D Bottom Bevel Ledge */}
      <View
        style={[
          styles.buttonBevelBase,
          { backgroundColor: schemeConfig.bevelColor },
        ]}
      />

      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        // @ts-ignore - Web hover events
        onMouseEnter={() => setIsHovered(true)}
        // @ts-ignore - Web hover events
        onMouseLeave={() => setIsHovered(false)}
        style={[
          styles.buttonFaceContainer,
          {
            borderColor: schemeConfig.borderColor,
            // @ts-ignore - Web pointer
            cursor: 'pointer',
          },
        ]}
      >
        <LinearGradient
          colors={schemeConfig.faceGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.buttonFaceGradient}
        >
          {/* Top Specular Gloss Sheen */}
          <View
            style={[
              styles.buttonSheen,
              { opacity: isActive ? 0.45 : 0.22 },
            ]}
          />

          {/* Left Icon Badge */}
          <View style={styles.buttonIconSlot}>
            {icon}
          </View>

          {/* Centered Title */}
          <Text
            style={[
              styles.buttonLabel,
              { textShadowColor: schemeConfig.textShadow },
            ]}
          >
            {title}
          </Text>

          {/* Right Spacer for balance */}
          <View style={styles.buttonRightSpacer} />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Game Over modal styled with the game's signature 3D wood and stone plaque chassis,
 * golden/bronze defeat crest, pulsating 3D 'GAME OVER' title, carved stats plinth,
 * and chunky interactive 3D buttons.
 */
export function GameOverModal({
  visible,
  levelNumber,
  isDaily = false,
  isBlitz = false,
  moves = 0,
  time = 0,
  onRestart,
  onLevelSelect,
  onHome,
}) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 360;
  const plaqueWidth = Math.min(width - (isNarrow ? 20 : 36), 360);

  // Entrance spring animations
  const scaleAnim = useRef(new Animated.Value(0.75)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Title pulsating neon aura loop
  const pulseAnim = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.75);
      translateYAnim.setValue(30);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          speed: 15,
          bounciness: 10,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          speed: 15,
          bounciness: 9,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 850,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.45,
            duration: 850,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();

      return () => pulseLoop.stop();
    }
  }, [visible, scaleAnim, translateYAnim, opacityAnim, pulseAnim]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onRestart}
    >
      <View style={styles.backdrop}>
        {/* Animated 3D Plaque Chassis */}
        <Animated.View
          style={[
            styles.plaqueOuter,
            {
              width: plaqueWidth,
              transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Deep 3D Extrusion Shadow Rim matching ThreeDModalPlaque */}
          <View style={styles.plaqueShadowBase} />

          {/* Wooden/Stone Outer Frame */}
          <LinearGradient
            colors={['#17243B', '#0B1426']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.woodenFrame}
          >
            <View style={styles.frameTopSheen} />

            {/* Inner Dark Recessed Inlay */}
            <LinearGradient
              colors={['rgba(15, 23, 42, 0.96)', 'rgba(7, 13, 26, 0.98)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.innerInlay}
            >
              <View style={styles.innerGrooveBorder} />

              {/* Title Section */}
              <View style={styles.titleSection}>
                {/* Pulsating Neon Glow Aura */}
                <Animated.View
                  style={[
                    styles.titleGlowAura,
                    {
                      opacity: pulseAnim,
                      transform: [
                        {
                          scale: pulseAnim.interpolate({
                            inputRange: [0.45, 1],
                            outputRange: [0.94, 1.06],
                          }),
                        },
                      ],
                    },
                  ]}
                />

                {/* 3D Extruded GAME OVER Title matching app's ThreeDText typography */}
                <ThreeDText
                  text="GAME OVER"
                  size={isNarrow ? 24 : 27}
                  color="#FFE8A3"
                  depthColor="#9F1239"
                  depth={4}
                  strokeColor="#4C0519"
                />

                {/* Subtitle Pill matching TactilePill */}
                <View style={styles.statusPill}>
                  <View style={styles.rubyIndicatorDot} />
                  <Text style={styles.statusPillText}>
                    {isBlitz
                      ? 'TIME EXPIRED • RUSH OVER'
                      : isDaily
                      ? 'OUT OF LIVES • DAILY TRIAL'
                      : `OUT OF LIVES • LEVEL ${levelNumber}`}
                  </Text>
                </View>
              </View>

              {/* Carved Wooden Stats Plinth Tray matching LevelCompleteModal */}
              <View style={styles.statsTray}>
                {/* Col 1: Moves */}
                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>MOVES</Text>
                  <Text style={[styles.statValue, { color: '#38D9F8' }]}>{moves}</Text>
                  <Text style={styles.statSub}>Made</Text>
                </View>

                <View style={styles.statDivider} />

                {/* Col 2: Time */}
                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>TIME</Text>
                  <Text style={[styles.statValue, { color: '#FFD13B' }]}>
                    {formatTime(time)}
                  </Text>
                  <Text style={styles.statSub}>Elapsed</Text>
                </View>

                <View style={styles.statDivider} />

                {/* Col 3: Lives Remaining */}
                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>LIVES</Text>
                  <Text style={[styles.statValue, { color: '#F43F5E' }]}>0 / 3</Text>
                  <Text style={styles.statSub}>Depleted</Text>
                </View>
              </View>

              {/* 3D Action Buttons Stack */}
              <View style={styles.actionStack}>
                {/* 1. Primary: Restart / Try Again (Hero Warm Amber) */}
                <TactileGameOverButton
                  title="TRY AGAIN"
                  icon={<SvgRefresh size={20} color="#FFFFFF" />}
                  colorScheme="yellow"
                  onPress={onRestart}
                />

                {/* 2. Secondary: Level Select (Tactile Cyan) */}
                <TactileGameOverButton
                  title="LEVEL SELECT"
                  icon={<SvgGrid size={20} color="#FFFFFF" />}
                  colorScheme="cyan"
                  onPress={onLevelSelect}
                />

                {/* 3. Tertiary: Main Menu (Level Vault Blue) */}
                <TactileGameOverButton
                  title="MAIN MENU"
                  icon={<SvgHome size={20} color="#FFFFFF" />}
                  colorScheme="blue"
                  onPress={onHome}
                />
              </View>
            </LinearGradient>
          </LinearGradient>

          {/* Top Overlapping 3D Defeat Medallion Crest */}
          <View style={styles.topCrestWrapper} pointerEvents="box-none">
            <LinearGradient
              colors={['#FBBF24', '#F59E0B', '#B45309']}
              style={styles.crestOuterBezel}
            >
              <LinearGradient
                colors={['#FB7185', '#E11D48', '#BE123C']}
                style={styles.crestInnerCore}
              >
                <SvgHeart size={28} filled={false} />
              </LinearGradient>
            </LinearGradient>
          </View>

          {/* Tactile 3D Close Button ('X') matching ThreeDModalPlaque */}
          {onRestart && (
            <Pressable
              onPress={onRestart}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && styles.closeBtnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Restart game"
            >
              <LinearGradient
                colors={['#F43F5E', '#BE123C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.closeBtnGradient}
              >
                <View style={styles.closeBtnSheen} />
                <SvgClose size={18} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.80)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }
      : {}),
  },
  plaqueOuter: {
    position: 'relative',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.65,
    shadowRadius: 18,
    elevation: 24,
  },
  plaqueShadowBase: {
    position: 'absolute',
    top: 6,
    left: 4,
    right: 4,
    bottom: -6,
    borderRadius: 26,
    backgroundColor: '#040914',
  },
  woodenFrame: {
    width: '100%',
    borderRadius: 24,
    padding: 7,
    borderWidth: 1.5,
    borderColor: '#334E68',
    position: 'relative',
  },
  frameTopSheen: {
    position: 'absolute',
    top: 2,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 1,
  },
  innerInlay: {
    borderRadius: 20,
    paddingTop: 36,
    paddingBottom: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
  },
  innerGrooveBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  topCrestWrapper: {
    position: 'absolute',
    top: -26,
    alignSelf: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10,
  },
  crestOuterBezel: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: '#FFE8A3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  crestInnerCore: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 6,
  },
  closeBtnPressed: {
    transform: [{ scale: 0.92 }],
  },
  closeBtnGradient: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  closeBtnSheen: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 3,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    position: 'relative',
  },
  titleGlowAura: {
    position: 'absolute',
    width: '85%',
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(244, 63, 94, 0.22)',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    shadowOpacity: 0.8,
    elevation: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderWidth: 1.2,
    borderColor: 'rgba(244, 63, 94, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 12,
    marginTop: 8,
    gap: 6,
  },
  rubyIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F43F5E',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 1,
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#FFE4E6',
    textTransform: 'uppercase',
  },
  statsTray: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(7, 12, 22, 0.75)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
    marginBottom: 14,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statSub: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 1,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  actionStack: {
    width: '100%',
    gap: 10,
  },
  buttonOuter: {
    width: '100%',
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonBevelBase: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    bottom: -4,
    borderRadius: 16,
  },
  buttonFaceContainer: {
    borderRadius: 16,
    borderWidth: 1.2,
    overflow: 'hidden',
  },
  buttonFaceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  buttonSheen: {
    position: 'absolute',
    top: 2,
    left: 10,
    right: 10,
    height: 1.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  buttonIconSlot: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  buttonLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  buttonRightSpacer: {
    width: 24,
  },
});
