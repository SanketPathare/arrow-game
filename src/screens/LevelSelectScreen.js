import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { GameBackground } from '../components/GameBackground.js';
import { ThreeDButton } from '../components/ThreeDButton.js';
import { SvgStar, SvgLock } from '../components/SvgIcons.js';
import { soundManager } from '../utils/sound.js';
import { ZONES, getZoneById } from '../utils/zones.js';

const NODE_SIZE = 64;
const LEVEL_STEP_Y = 100;
const GATEWAY_HEIGHT = 114;
const GATEWAY_MARGIN = 26;

export function LevelSelectScreen({
  unlockedLevel = 1,
  levelStats = {},
  onSelectLevel,
  onBack,
  theme,
}) {
  const { width } = useWindowDimensions();
  const scrollViewRef = useRef(null);

  // Compute player's active zone
  const activeUserZone = useMemo(() => {
    return Math.min(5, Math.max(1, Math.ceil(unlockedLevel / 10)));
  }, [unlockedLevel]);

  const [selectedZone, setSelectedZone] = useState(activeUserZone);

  // Pulsing animation for current unlocked level beacon
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.22,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -6,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    bounceLoop.start();

    return () => {
      pulseLoop.stop();
      bounceLoop.stop();
    };
  }, [pulseAnim, bounceAnim]);

  // Compute total stars
  const totalStars = useMemo(() => {
    return Object.values(levelStats).reduce(
      (acc, curr) => acc + (curr?.stars || 0),
      0
    );
  }, [levelStats]);

  // Road geometry calculation
  const contentWidth = Math.min(width, 680);
  const roadCenterX = contentWidth / 2;
  const roadAmplitude = Math.min((contentWidth - 120) * 0.38, 95);

  // Pre-calculate positions of all gateways and level nodes
  const roadLayout = useMemo(() => {
    const gateways = [];
    const levelPositions = [];
    let currentY = 16;

    for (let z = 1; z <= 5; z++) {
      const gatewayY = currentY;
      gateways.push({
        zoneId: z,
        y: gatewayY,
      });

      currentY += GATEWAY_HEIGHT + GATEWAY_MARGIN;

      // 10 levels per zone
      for (let i = 1; i <= 10; i++) {
        const levelNum = (z - 1) * 10 + i;
        const xOffset = Math.sin((levelNum - 1) * 0.76) * roadAmplitude;
        const x = roadCenterX + xOffset;
        const y = currentY + NODE_SIZE / 2;

        levelPositions.push({
          levelNumber: levelNum,
          zoneId: z,
          x,
          y,
        });

        currentY += LEVEL_STEP_Y;
      }

      currentY += GATEWAY_MARGIN;
    }

    const totalHeight = currentY + 40;
    return { gateways, levelPositions, totalHeight };
  }, [roadCenterX, roadAmplitude]);

  // Generate SVG Bezier Road Path segments connecting levels 1 through 50
  const roadPathD = useMemo(() => {
    const pts = roadLayout.levelPositions;
    if (pts.length < 2) return '';

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];

      // Smooth vertical cubic S-curve connection
      const dy = p2.y - p1.y;
      const cy1 = p1.y + dy * 0.5;
      const cy2 = p1.y + dy * 0.5;

      d += ` C ${p1.x} ${cy1}, ${p2.x} ${cy2}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [roadLayout]);

  // Auto-scroll to player's current unlocked level on screen load
  useEffect(() => {
    const timer = setTimeout(() => {
      const targetPos = roadLayout.levelPositions.find(
        (p) => p.levelNumber === unlockedLevel
      );
      if (targetPos && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: Math.max(0, targetPos.y - 260),
          animated: true,
        });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [unlockedLevel, roadLayout]);

  // Scroll to a specific zone when tapping the zone tabs
  const handleJumpToZone = (zoneId) => {
    soundManager.playClickSound();
    setSelectedZone(zoneId);

    const gateway = roadLayout.gateways.find((g) => g.zoneId === zoneId);
    if (gateway && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: Math.max(0, gateway.y - 12),
        animated: true,
      });
    }
  };

  // Detect which zone is in viewport during scrolling to update background art
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    // Find closest gateway or level
    for (let z = 5; z >= 1; z--) {
      const gateway = roadLayout.gateways.find((g) => g.zoneId === z);
      if (gateway && scrollY >= gateway.y - 140) {
        if (selectedZone !== z) {
          setSelectedZone(z);
        }
        break;
      }
    }
  };

  return (
    <GameBackground type="levelSelect" zone={selectedZone} theme={theme}>
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <ThreeDButton
            icon="arrow-back"
            iconSize={24}
            colorScheme="circle-blue"
            size="circle"
            onPress={onBack}
          />

          <View style={styles.titleContainer}>
            <Text style={styles.title}>CHOOSE A LEVEL</Text>
            <View style={styles.starBadge}>
              <View style={{ marginRight: 4 }}>
                <SvgStar size={14} color="#FFD13B" />
              </View>
              <Text style={styles.starBadgeText}>
                {totalStars} / 150 <Text style={{ color: '#D4B896' }}>stars</Text>
              </Text>
            </View>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* Zone Selector Horizontal Chips (Quick-Jump to Zone 1 - 5) */}
        <View style={styles.zoneTabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.zoneTabsScroll}
          >
            {ZONES.map((zone) => {
              const isSelected = selectedZone === zone.id;
              const isZoneUnlocked = unlockedLevel >= zone.levels[0];

              return (
                <Pressable
                  key={zone.id}
                  onPress={() => handleJumpToZone(zone.id)}
                  style={[
                    styles.zoneChip,
                    isSelected
                      ? {
                          backgroundColor: zone.primaryColor,
                          borderColor: zone.glowColor,
                          shadowColor: zone.accentColor,
                          shadowOpacity: 0.8,
                          shadowRadius: 8,
                          elevation: 6,
                        }
                      : styles.zoneChipInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.zoneChipTitle,
                      { color: isSelected ? '#FFFFFF' : '#A0BEDE' },
                    ]}
                  >
                    {`Z${zone.id}: ${zone.name.split(' ')[0]}`}
                  </Text>
                  <View
                    style={[
                      styles.zoneChipBadge,
                      {
                        backgroundColor: isSelected
                          ? 'rgba(0, 0, 0, 0.28)'
                          : 'rgba(255, 255, 255, 0.08)',
                      },
                    ]}
                  >
                    {!isZoneUnlocked ? (
                      <SvgLock size={9} color={isSelected ? '#FFFFFF' : '#93B4D8'} />
                    ) : (
                      <Text
                        style={[
                          styles.zoneChipBadgeText,
                          { color: isSelected ? '#FFFFFF' : '#93B4D8' },
                        ]}
                      >
                        {`${zone.levels[0]}-${zone.levels[1]}`}
                      </Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Winding Road / Saga Map Scroll View */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.roadScrollView}
          contentContainerStyle={[
            styles.roadContent,
            { height: roadLayout.totalHeight },
          ]}
          onScroll={handleScroll}
          scrollEventThrottle={100}
          showsVerticalScrollIndicator={false}
        >
          {/* Continuous SVG Winding Road Path Layer */}
          <Svg
            style={StyleSheet.absoluteFill}
            width={contentWidth}
            height={roadLayout.totalHeight}
            pointerEvents="none"
          >
            <Defs>
              <SvgLinearGradient id="roadGlow" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#34D399" stopOpacity="0.6" />
                <Stop offset="25%" stopColor="#FBBF24" stopOpacity="0.6" />
                <Stop offset="50%" stopColor="#C084FC" stopOpacity="0.6" />
                <Stop offset="75%" stopColor="#38BDF8" stopOpacity="0.6" />
                <Stop offset="100%" stopColor="#FB7185" stopOpacity="0.6" />
              </SvgLinearGradient>
            </Defs>

            {/* Base Dark Road Underlay */}
            <Path
              d={roadPathD}
              stroke="rgba(8, 14, 28, 0.85)"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glowing Road Surface */}
            <Path
              d={roadPathD}
              stroke="url(#roadGlow)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dashed Center Stepping Line */}
            <Path
              d={roadPathD}
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeDasharray="6, 10"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />

            {/* Stepping stone waypoint dots along the path */}
            {roadLayout.levelPositions.map((pos) => (
              <Circle
                key={`dot_${pos.levelNumber}`}
                cx={pos.x}
                cy={pos.y}
                r="36"
                fill="rgba(8, 14, 28, 0.45)"
              />
            ))}
          </Svg>

          {/* Chapter Gateway Arches (Inserted every 10 levels) */}
          {roadLayout.gateways.map((gw) => {
            const zone = getZoneById(gw.zoneId);
            const isZoneUnlocked = unlockedLevel >= zone.levels[0];
            // Calculate stars earned in this zone
            let zoneStars = 0;
            for (let l = zone.levels[0]; l <= zone.levels[1]; l++) {
              zoneStars += levelStats[l]?.stars || 0;
            }

            return (
              <View
                key={`gateway_${gw.zoneId}`}
                style={[
                  styles.gatewayCard,
                  {
                    top: gw.y,
                    borderColor: zone.borderColor,
                  },
                ]}
              >
                <LinearGradient
                  colors={[
                    zone.badgeBg,
                    'rgba(10, 18, 36, 0.95)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gatewayInner}
                >
                  <View style={styles.gatewayHeaderRow}>
                    <View style={styles.gatewayBadgePill}>
                      <Text style={[styles.gatewayBadgeText, { color: zone.accentColor }]}>
                        {`ZONE ${zone.id}`}
                      </Text>
                    </View>
                    {!isZoneUnlocked ? (
                      <View style={styles.gatewayLockedPill}>
                        <SvgLock size={12} color="#94A3B8" />
                        <Text style={styles.gatewayLockedText}>LOCKED</Text>
                      </View>
                    ) : (
                      <View style={styles.gatewayStarsPill}>
                        <SvgStar size={12} color="#FFD13B" />
                        <Text style={styles.gatewayStarsText}>
                          {`${zoneStars} / 30 ★`}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.gatewayTitle}>{zone.name.toUpperCase()}</Text>
                  <Text style={styles.gatewaySubtitle}>
                    {`Levels ${zone.levels[0]}–${zone.levels[1]} • ${zone.subtitle}`}
                  </Text>
                </LinearGradient>
              </View>
            );
          })}

          {/* Stepping Stone Level Nodes (1 through 50) */}
          {roadLayout.levelPositions.map((pos) => {
            const { levelNumber, zoneId, x, y } = pos;
            const zone = getZoneById(zoneId);
            const stats = levelStats[levelNumber] || {};
            const isUnlocked = levelNumber <= unlockedLevel;
            const isCurrent = levelNumber === unlockedLevel;
            const isCompleted = !!stats.completed;
            const starsEarned = stats.stars || 0;

            return (
              <View
                key={`node_${levelNumber}`}
                style={[
                  styles.nodePositioner,
                  {
                    left: x - NODE_SIZE / 2,
                    top: y - NODE_SIZE / 2,
                  },
                ]}
              >
                {/* Active Beacon Glowing Aura (Only on current unlocked level) */}
                {isCurrent && (
                  <Animated.View
                    style={[
                      styles.currentPulseRing,
                      {
                        borderColor: zone.accentColor,
                        transform: [{ scale: pulseAnim }],
                      },
                    ]}
                    pointerEvents="none"
                  />
                )}

                {/* Bouncing "PLAY" Tag Banner over Current Level */}
                {isCurrent && (
                  <Animated.View
                    style={[
                      styles.playBanner,
                      {
                        backgroundColor: zone.primaryColor,
                        borderColor: zone.glowColor,
                        transform: [{ translateY: bounceAnim }],
                      },
                    ]}
                    pointerEvents="none"
                  >
                    <Text style={styles.playBannerText}>PLAY</Text>
                  </Animated.View>
                )}

                {/* 3D Circular Level Stone Button */}
                <Pressable
                  onPress={() => {
                    if (isUnlocked) {
                      soundManager.playClickSound();
                      onSelectLevel(levelNumber);
                    } else {
                      soundManager.playBlockedSound();
                    }
                  }}
                  style={({ pressed }) => [
                    styles.nodeStone,
                    isUnlocked
                      ? {
                          borderColor: isCurrent ? zone.glowColor : zone.borderColor,
                          shadowColor: zone.accentColor,
                        }
                      : styles.nodeStoneLocked,
                    pressed && isUnlocked && { transform: [{ scale: 0.94 }] },
                  ]}
                >
                  <LinearGradient
                    colors={
                      isCompleted
                        ? zone.tileGradient
                        : isCurrent
                        ? [zone.accentColor, zone.primaryColor, zone.tileBevel]
                        : ['#334155', '#1E293B', '#0F172A']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.nodeFace}
                  >
                    {/* Top Gloss Highlight */}
                    <View style={styles.nodeSpecularGloss} />

                    {isUnlocked ? (
                      <View style={styles.nodeContent}>
                        <Text style={styles.nodeNumberText}>{levelNumber}</Text>
                      </View>
                    ) : (
                      <View style={styles.nodeLockedContent}>
                        <SvgLock size={20} color="#94A3B8" />
                        <Text style={styles.nodeLockedText}>{levelNumber}</Text>
                      </View>
                    )}
                  </LinearGradient>
                </Pressable>

                {/* 3-Star Rating Cluster Under Completed Nodes */}
                {isCompleted && (
                  <View style={styles.starsCluster}>
                    <SvgStar size={13} color={starsEarned >= 1 ? '#FFD13B' : '#475569'} />
                    <View style={{ marginTop: -4 }}>
                      <SvgStar size={15} color={starsEarned >= 2 ? '#FFD13B' : '#475569'} />
                    </View>
                    <SvgStar size={13} color={starsEarned >= 3 ? '#FFD13B' : '#475569'} />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </GameBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 4,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  headerSpacer: {
    width: 48,
    height: 48,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#4A6FA5',
    backgroundColor: 'rgba(22, 38, 66, 0.88)',
    marginTop: 4,
  },
  starBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  zoneTabsContainer: {
    marginVertical: 6,
  },
  zoneTabsScroll: {
    paddingHorizontal: 16,
  },
  zoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1.8,
    marginRight: 8,
  },
  zoneChipInactive: {
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    borderColor: '#334155',
  },
  zoneChipTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  zoneChipBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  zoneChipBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  roadScrollView: {
    flex: 1,
    width: '100%',
  },
  roadContent: {
    position: 'relative',
    width: '100%',
  },
  gatewayCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: GATEWAY_HEIGHT,
    borderRadius: 18,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  gatewayInner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  gatewayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  gatewayBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  gatewayBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  gatewayStarsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    gap: 4,
  },
  gatewayStarsText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFE8A3',
  },
  gatewayLockedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    gap: 4,
  },
  gatewayLockedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  gatewayTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  gatewaySubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E1',
    marginTop: 2,
  },
  nodePositioner: {
    position: 'absolute',
    width: NODE_SIZE,
    height: NODE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  currentPulseRing: {
    position: 'absolute',
    width: NODE_SIZE + 24,
    height: NODE_SIZE + 24,
    borderRadius: (NODE_SIZE + 24) / 2,
    borderWidth: 2.5,
  },
  playBanner: {
    position: 'absolute',
    top: -26,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 30,
  },
  playBannerText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  nodeStone: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    borderWidth: 3,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.65,
    shadowRadius: 6,
    elevation: 6,
  },
  nodeStoneLocked: {
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOpacity: 0.4,
  },
  nodeFace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  nodeSpecularGloss: {
    position: 'absolute',
    top: 3,
    left: 8,
    right: 8,
    height: NODE_SIZE * 0.35,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  nodeContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeNumberText: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 3,
  },
  nodeLockedContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLockedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 1,
  },
  starsCluster: {
    position: 'absolute',
    bottom: -16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 15, 30, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 2,
  },
});
