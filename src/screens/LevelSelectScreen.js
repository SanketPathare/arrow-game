import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { GameBackground } from '../components/GameBackground.js';
import { ThreeDButton } from '../components/ThreeDButton.js';
import { LevelCard } from '../components/LevelCard.js';
import { getAllLevelsSummary } from '../engine/levelData.js';
import { DIFFICULTY_TIERS } from '../utils/constants.js';
import { soundManager } from '../utils/sound.js';
import { SvgStar } from '../components/SvgIcons.js';

export function LevelSelectScreen({
  unlockedLevel = 1,
  levelStats = {},
  onSelectLevel,
  onBack,
  theme,
}) {
  const [selectedTier, setSelectedTier] = useState('all');
  const { width } = useWindowDimensions();
  const numColumns = width >= 800 ? 6 : width >= 540 ? 5 : width < 340 ? 3 : 4;

  const allLevels = useMemo(() => getAllLevelsSummary(), []);

  // Filter levels by selected difficulty tier
  const filteredLevels = useMemo(() => {
    if (selectedTier === 'all') return allLevels;
    const tier = DIFFICULTY_TIERS.find((t) => t.id === selectedTier);
    if (!tier) return allLevels;
    return allLevels.filter(
      (lvl) => lvl.levelNumber >= tier.range[0] && lvl.levelNumber <= tier.range[1]
    );
  }, [allLevels, selectedTier]);

  // Compute total stars
  const totalStars = Object.values(levelStats).reduce((acc, curr) => acc + (curr?.stars || 0), 0);

  return (
    <GameBackground type="home" theme={theme}>
      <View style={styles.container}>
        {/* Top Header */}
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

          {/* Symmetry placeholder */}
          <View style={styles.headerSpacer} />
        </View>

        {/* Difficulty Sector Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {DIFFICULTY_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.id;
              return (
                <Pressable
                  key={tier.id}
                  onPress={() => {
                    soundManager.playClickSound();
                    setSelectedTier(tier.id);
                  }}
                  style={[
                    styles.tabChip,
                    isSelected ? styles.tabChipActive : styles.tabChipInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabChipText,
                      { color: isSelected ? '#FFFFFF' : '#A0BEDE' },
                    ]}
                  >
                    {tier.title}
                  </Text>
                  {tier.badge && (
                    <View
                      style={[
                        styles.tierMiniBadge,
                        {
                          backgroundColor: isSelected
                            ? 'rgba(0, 0, 0, 0.25)'
                            : 'rgba(255, 255, 255, 0.1)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tierMiniBadgeText,
                          { color: isSelected ? '#FFFFFF' : '#D0E2F5' },
                        ]}
                      >
                        {tier.badge}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Level Cards Grid */}
        <FlatList
          key={numColumns}
          data={filteredLevels}
          keyExtractor={(item) => item.levelNumber.toString()}
          numColumns={numColumns}
          style={styles.gridList}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const stats = levelStats[item.levelNumber] || {};
            const isUnlocked = item.levelNumber <= unlockedLevel;

            return (
              <LevelCard
                levelNumber={item.levelNumber}
                boardSize={item.boardSize}
                isUnlocked={isUnlocked}
                isCompleted={!!stats.completed}
                stars={stats.stars || 0}
                onPress={onSelectLevel}
                theme={theme}
              />
            );
          }}
        />
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
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#4A6FA5',
    backgroundColor: 'rgba(22, 38, 66, 0.85)',
    marginTop: 4,
  },
  starBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  tabsContainer: {
    marginVertical: 8,
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
  },
  tabChipActive: {
    backgroundColor: '#0288D1',
    borderColor: '#38D9F8',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  tabChipInactive: {
    backgroundColor: 'rgba(22, 38, 66, 0.75)',
    borderColor: '#314A70',
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  tierMiniBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tierMiniBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  gridList: {
    flex: 1,
    width: '100%',
  },
  gridContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 36,
  },
});
