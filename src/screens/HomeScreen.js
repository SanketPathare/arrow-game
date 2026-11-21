import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameBackground } from '../components/GameBackground.js';
import { ThreeDButton } from '../components/ThreeDButton.js';
import { ThreeDEmblem } from '../components/ThreeDEmblem.js';
import { CampaignProgressCard } from '../components/CampaignProgressCard.js';
import { ThreeDModalPlaque } from '../components/ThreeDModalPlaque.js';
import { Confetti } from '../components/Confetti.js';
import {
  SvgArrowGraphic,
  SvgHand,
  SvgStar,
  SvgTrophy,
  SvgGift,
  SvgFlame,
  SvgGrid,
  SvgCrown,
  SvgFlash,
  SvgCheck,
} from '../components/SvgIcons.js';
import { getLevelData } from '../engine/levelData.js';
import { StorageService } from '../utils/storage.js';
import { PROFILE_AVATARS } from '../utils/constants.js';
import { soundManager } from '../utils/sound.js';

const CHAPTERS = [
  { minLevel: 1, maxLevel: 10, name: 'Whispering Woods', number: 1, color: '#38BDF8' },
  { minLevel: 11, maxLevel: 20, name: 'Sunken Ruins', number: 2, color: '#34D399' },
  { minLevel: 21, maxLevel: 30, name: 'Mystic Labyrinth', number: 3, color: '#FBBF24' },
  { minLevel: 31, maxLevel: 40, name: 'Sky Citadel', number: 4, color: '#FB923C' },
  { minLevel: 41, maxLevel: 50, name: 'Obsidian Spire', number: 5, color: '#F43F5E' },
];

function getPlayerRank(stars) {
  if (stars >= 120) return { title: 'Grandmaster', badge: 'Tier VI', color: '#FFD700' };
  if (stars >= 80) return { title: 'Master Navigator', badge: 'Tier V', color: '#F59E0B' };
  if (stars >= 50) return { title: 'Tactical Ranger', badge: 'Tier IV', color: '#00F2FE' };
  if (stars >= 25) return { title: 'Wayfarer', badge: 'Tier III', color: '#38BDF8' };
  if (stars >= 10) return { title: 'Pathfinder', badge: 'Tier II', color: '#A78BFA' };
  return { title: 'Novice Archer', badge: 'Tier I', color: '#94A3B8' };
}

const ACHIEVEMENTS_DEF = [
  {
    id: 'first_clear',
    title: 'First Flight',
    desc: 'Clear your first tactical puzzle',
    target: 1,
    icon: 'play',
    color: '#00F2FE',
    reward: 'Rank I Title',
    calcProgress: (stats) => Math.min(1, stats.completedLevels),
  },
  {
    id: 'star_collector',
    title: 'Star Collector',
    desc: 'Earn 15 stars across campaign levels',
    target: 15,
    icon: 'star',
    color: '#FFD13B',
    reward: '+2 Hints',
    calcProgress: (stats) => Math.min(15, stats.totalStars),
  },
  {
    id: 'flawless_five',
    title: 'Flawless Mind',
    desc: 'Earn 3 stars on 5 different levels',
    target: 5,
    icon: 'flash',
    color: '#38BDF8',
    reward: 'Gold Badge',
    calcProgress: (stats) => Math.min(5, stats.threeStarCount),
  },
  {
    id: 'daily_streak',
    title: 'Daily Voyager',
    desc: 'Maintain a 3-day daily quest streak',
    target: 3,
    icon: 'flame',
    color: '#FF6B00',
    reward: 'Streak Flame',
    calcProgress: (stats) => Math.min(3, stats.streak),
  },
  {
    id: 'blitz_master',
    title: 'Blitz Runner',
    desc: 'Score over 1,500 points in 60s Blitz Rush',
    target: 1500,
    icon: 'flash',
    color: '#F43F5E',
    reward: 'Neon Bolt',
    calcProgress: (stats) => Math.min(1500, stats.blitzHighScore || 0),
  },
  {
    id: 'combo_master',
    title: 'Chain Master',
    desc: 'Hit a 5x escape combo streak',
    target: 5,
    icon: 'star',
    color: '#A855F7',
    reward: 'Harmonic Ring',
    calcProgress: (stats) => Math.min(5, stats.blitzBestCombo || 0),
  },
  {
    id: 'sector_pro',
    title: 'Labyrinth Veteran',
    desc: 'Reach Level 20 in the campaign',
    target: 20,
    icon: 'grid',
    color: '#A855F7',
    reward: 'Master Badge',
    calcProgress: (stats) => Math.min(20, stats.unlockedLevel),
  },
  {
    id: 'grandmaster',
    title: 'Apex Grandmaster',
    desc: 'Conquer all 50 campaign levels',
    target: 50,
    icon: 'crown',
    color: '#EAB308',
    reward: 'Obsidian Crown',
    calcProgress: (stats) => Math.min(50, stats.completedLevels),
  },
];

export function HomeScreen({
  unlockedLevel = 1,
  levelStats = {},
  dailyStats = {},
  profile = { name: 'Wayfinder', avatarId: 'fox' },
  onSaveProfile,
  onPlay,
  onPlayBlitz,
  onOpenLevelSelect,
  onOpenDaily,
  onOpenSettings,
  theme,
}) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(profile);
  const [profileError, setProfileError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [giftClaimedDate, setGiftClaimedDate] = useState(null);
  const [blitzStats, setBlitzStats] = useState({ highScore: 0, mostCleared: 0, bestCombo: 0 });

  const { width, height } = useWindowDimensions();
  const isNarrow = width < 360;
  const isShort = height < 700;
  const isTablet = width >= 768;

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const isDailyCompletedToday = dailyStats?.lastPlayedDate === todayStr;
  const isGiftClaimedToday = giftClaimedDate === todayStr;

  // Check daily gift claim & blitz stats on mount
  useEffect(() => {
    async function loadPersistentStats() {
      const [claimedDate, blitz] = await Promise.all([
        StorageService.getDailyGiftClaimedDate(),
        StorageService.getBlitzStats(),
      ]);
      setGiftClaimedDate(claimedDate);
      if (blitz) setBlitzStats(blitz);
    }
    loadPersistentStats();
  }, [todayStr]);

  // Compute game statistics
  const completedLevels = useMemo(
    () => Object.keys(levelStats).filter((k) => levelStats[k]?.completed).length,
    [levelStats]
  );
  const totalStars = useMemo(
    () => Object.values(levelStats).reduce((acc, curr) => acc + (curr?.stars || 0), 0),
    [levelStats]
  );
  const threeStarCount = useMemo(
    () => Object.values(levelStats).filter((s) => (s?.stars || 0) === 3).length,
    [levelStats]
  );
  const streak = dailyStats?.streak || 0;

  const rank = useMemo(() => getPlayerRank(totalStars), [totalStars]);
  const selectedAvatar = PROFILE_AVATARS.find((avatar) => avatar.id === profile.avatarId)
    || PROFILE_AVATARS[0];

  const openProfile = () => {
    setProfileDraft(profile);
    setProfileError('');
    setShowProfile(true);
  };

  const saveProfile = async () => {
    const name = profileDraft.name.trim();
    if (!name) {
      setProfileError('Enter a name before saving your profile.');
      return;
    }

    setIsSavingProfile(true);
    setProfileError('');
    try {
      const saved = await onSaveProfile({ name, avatarId: profileDraft.avatarId });
      if (saved) {
        setShowProfile(false);
      } else {
        setProfileError('Your profile could not be saved. Please try again.');
      }
    } catch (error) {
      console.warn('Failed to save player profile:', error);
      setProfileError('Your profile could not be saved. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const currentChapter = useMemo(() => {
    return (
      CHAPTERS.find((c) => unlockedLevel >= c.minLevel && unlockedLevel <= c.maxLevel) ||
      CHAPTERS[0]
    );
  }, [unlockedLevel]);

  const currentLevelData = useMemo(() => {
    return getLevelData(unlockedLevel) || { boardSize: 4, arrowCount: 16, difficulty: 'BEGINNER' };
  }, [unlockedLevel]);

  const currentLevelStats = levelStats[unlockedLevel] || {};

  // Claim Daily Supply Gift
  const handleClaimDailyGift = useCallback(async () => {
    if (isGiftClaimedToday) return;
    soundManager.playVictorySound();
    await StorageService.claimDailyGift(todayStr);
    setGiftClaimedDate(todayStr);
    setShowGiftModal(true);
  }, [isGiftClaimedToday, todayStr]);

  // Achievements calculation
  const achievementStats = useMemo(
    () => ({
      completedLevels,
      totalStars,
      threeStarCount,
      streak,
      unlockedLevel,
      blitzHighScore: blitzStats?.highScore || 0,
      blitzBestCombo: blitzStats?.bestCombo || 0,
    }),
    [completedLevels, totalStars, threeStarCount, streak, unlockedLevel, blitzStats]
  );

  const completedAchievementsCount = useMemo(() => {
    return ACHIEVEMENTS_DEF.filter(
      (a) => a.calcProgress(achievementStats) >= a.target
    ).length;
  }, [achievementStats]);

  return (
    <GameBackground type="home" theme={theme}>
      <ScrollView
        style={styles.scrollWrapper}
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && { maxWidth: 540 },
          isShort && { paddingBottom: 16, paddingTop: 2 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Action & Player Rank Header */}
        <View style={styles.topBar}>
          {/* Help Button */}
          <ThreeDButton
            icon="help"
            iconSize={isNarrow ? 20 : 24}
            colorScheme="circle-blue"
            size="circle"
            onPress={() => setShowHowToPlay(true)}
          />

          {/* Player Profile & Rank Pill */}
          <Pressable
            onPress={openProfile}
            style={[styles.rankPillWrapper, isNarrow && { maxWidth: 140, marginHorizontal: 4 }]}
            accessibilityRole="button"
            accessibilityLabel={`Edit player profile for ${profile.name}. Rank: ${rank.title}, ${totalStars} stars`}
          >
            <View style={styles.rankPillShadow} />
            <LinearGradient
              colors={['#1F2E4A', '#131F35', '#0B1424']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.rankPillFace}
            >
              <View style={styles.rankSheen} />
              <View style={[styles.profileAvatarBadge, { backgroundColor: selectedAvatar.color }]}>
                <Text style={styles.profileAvatarEmoji}>{selectedAvatar.emoji}</Text>
              </View>
              <View style={styles.rankTextCol}>
                <Text numberOfLines={1} style={styles.profileName}>
                  {profile.name}
                </Text>
                <View style={styles.starRow}>
                  <SvgCrown size={11} color={rank.color} />
                  <Text numberOfLines={1} style={styles.rankStarsText}>
                    {rank.title} · {totalStars} ★
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Right Action Cluster: Trophies & Settings */}
          <View style={styles.rightCluster}>
            <ThreeDButton
              icon="trophy"
              iconSize={isNarrow ? 18 : 22}
              colorScheme="yellow"
              size="circle"
              onPress={() => setShowAchievements(true)}
              badge={completedAchievementsCount > 0 ? `${completedAchievementsCount}` : null}
            />
            <View style={{ width: isNarrow ? 5 : 8 }} />
            <ThreeDButton
              icon="settings"
              iconSize={isNarrow ? 18 : 22}
              colorScheme="circle-orange"
              size="circle"
              onPress={onOpenSettings}
            />
          </View>
        </View>

        {/* Central 3D Shield Emblem & Game Title */}
        <View style={[styles.emblemSection, isShort && { marginVertical: 2 }]}>
          <ThreeDEmblem size={isNarrow ? 76 : isShort ? 84 : 94} showTitle={true} />

          {/* Chapter Zone Tag */}
          <View style={styles.chapterBadge}>
            <LinearGradient
              colors={['rgba(56, 189, 248, 0.2)', 'rgba(14, 165, 233, 0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.chapterGradient}
            >
              <Text style={styles.chapterText}>
                CHAPTER {currentChapter.number} • {currentChapter.name.toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* Hero Card: Current Campaign Mission */}
        <View style={styles.heroMissionCard}>
          <View style={styles.heroCardShadow} />
          <LinearGradient
            colors={['#1E2E4B', '#121D32', '#0A1222']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroCardFace}
          >
            <View style={styles.heroTopSheen} />

            {/* Mission Info Header */}
            <View style={styles.heroHeaderRow}>
              <View style={styles.heroTitleGroup}>
                <Text style={styles.missionSubLabel}>ACTIVE CAMPAIGN</Text>
                <Text style={styles.missionLevelTitle}>LEVEL {unlockedLevel}</Text>
              </View>

              <View style={styles.specsPill}>
                <Text style={styles.specsText}>
                  {currentLevelData.boardSize}x{currentLevelData.boardSize} • {currentLevelData.difficulty}
                </Text>
              </View>
            </View>

            {/* Level Stars Preview */}
            <View style={styles.starsPreviewRow}>
              {[1, 2, 3].map((starIdx) => (
                <View key={starIdx} style={styles.heroStarSlot}>
                  <SvgStar
                    size={16}
                    empty={(currentLevelStats?.stars || 0) < starIdx}
                    color="#FFD13B"
                  />
                </View>
              ))}
              <Text style={styles.bestRecordText}>
                {currentLevelStats?.completed
                  ? `Best: ${currentLevelStats.moves} moves`
                  : 'Ready to play'}
              </Text>
            </View>

            {/* Large Launch Button */}
            <ThreeDButton
              title={currentLevelStats?.completed ? `REPLAY LEVEL ${unlockedLevel}` : `LAUNCH LEVEL ${unlockedLevel}`}
              icon="play"
              iconSize={22}
              colorScheme="cyan"
              size="lg"
              onPress={() => onPlay(unlockedLevel)}
            />
          </LinearGradient>
        </View>

        {/* Blitz Rush 60s Time Attack Arcade Mode */}
        <View style={styles.blitzContainer}>
          <View style={styles.blitzCardShadow} />
          <LinearGradient
            colors={['#2D1322', '#1C0B15', '#10050C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.blitzCardFace}
          >
            <View style={styles.blitzSheen} />
            <View style={styles.blitzContentRow}>
              <View style={styles.blitzIconBox}>
                <SvgFlash size={22} color="#F43F5E" />
              </View>

              <View style={styles.blitzTextGroup}>
                <View style={styles.blitzBadgeRow}>
                  <Text style={styles.blitzTitle}>BLITZ RUSH</Text>
                  <View style={styles.blitzTimerTag}>
                    <Text style={styles.blitzTimerTagText}>60s ATTACK</Text>
                  </View>
                </View>
                <Text style={styles.blitzSubtitle}>
                  {blitzStats?.highScore > 0
                    ? `High Score: ${blitzStats.highScore} pts • Best: ${blitzStats.mostCleared} boards`
                    : 'Fast arcade time attack! Clear boards for +5s bonus time.'}
                </Text>
              </View>

              <ThreeDButton
                title="Rush"
                icon="bolt"
                iconSize={15}
                colorScheme="orange"
                size="sm"
                onPress={onPlayBlitz}
                style={{ minWidth: 80 }}
              />
            </View>
          </LinearGradient>
        </View>

        {/* 2-Column Game Modes Row */}
        <View style={styles.modesRow}>
          {/* Daily Quest Mode Card */}
          <Pressable
            onPress={onOpenDaily}
            style={styles.modeCard}
            accessibilityRole="button"
            accessibilityLabel="Play Daily Challenge"
          >
            <View style={styles.modeCardShadow} />
            <LinearGradient
              colors={['#302210', '#1F1406', '#140D04']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.modeCardFace, { borderColor: 'rgba(251, 191, 36, 0.4)' }]}
            >
              <View style={styles.modeTopSheen} />
              <View style={styles.modeHeader}>
                <View style={[styles.modeIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.18)' }]}>
                  <SvgFlame size={20} color="#F59E0B" />
                </View>
                {isDailyCompletedToday && (
                  <View style={styles.doneTag}>
                    <SvgCheck size={11} color="#06D6A0" />
                  </View>
                )}
              </View>

              <Text style={styles.modeTitle}>DAILY QUEST</Text>
              <Text style={styles.modeSubtitle}>
                {isDailyCompletedToday ? 'Completed today' : 'Today’s challenge'}
              </Text>

              <View style={styles.modeFooter}>
                <Text style={styles.modeHighlightOrange}>{streak}d streak 🔥</Text>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Level Vault Mode Card */}
          <Pressable
            onPress={onOpenLevelSelect}
            style={styles.modeCard}
            accessibilityRole="button"
            accessibilityLabel="Open Level Vault"
          >
            <View style={styles.modeCardShadow} />
            <LinearGradient
              colors={['#172640', '#0F1A2D', '#08101E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.modeCardFace, { borderColor: 'rgba(56, 189, 248, 0.4)' }]}
            >
              <View style={styles.modeTopSheen} />
              <View style={styles.modeHeader}>
                <View style={[styles.modeIconCircle, { backgroundColor: 'rgba(56, 189, 248, 0.18)' }]}>
                  <SvgGrid size={19} color="#38BDF8" />
                </View>
                <View style={styles.vaultProgressPill}>
                  <Text style={styles.vaultProgressText}>{completedLevels}/50</Text>
                </View>
              </View>

              <Text style={styles.modeTitle}>LEVEL VAULT</Text>
              <Text style={styles.modeSubtitle}>50 Handcrafted maps</Text>

              <View style={styles.modeFooter}>
                <Text style={styles.modeHighlightBlue}>Explore stages →</Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Daily Tactical Supply Crate (Daily Mystery Reward) */}
        <View style={styles.dailyGiftContainer}>
          <View style={styles.giftCardShadow} />
          <LinearGradient
            colors={isGiftClaimedToday
              ? ['#141D2D', '#0E1624']
              : ['#282216', '#1A150C', '#100C05']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              styles.giftCardFace,
              {
                borderColor: isGiftClaimedToday
                  ? 'rgba(148, 163, 184, 0.22)'
                  : 'rgba(251, 191, 36, 0.5)',
              },
            ]}
          >
            <View style={styles.giftSheen} />
            <View style={styles.giftContentRow}>
              <View
                style={[
                  styles.giftIconBox,
                  {
                    backgroundColor: isGiftClaimedToday
                      ? 'rgba(255, 255, 255, 0.06)'
                      : 'rgba(255, 209, 59, 0.2)',
                  },
                ]}
              >
                <SvgGift size={24} color={isGiftClaimedToday ? '#94A3B8' : '#FFD13B'} />
              </View>

              <View style={styles.giftTextGroup}>
                <Text style={styles.giftTitle}>DAILY SUPPLY CRATE</Text>
                <Text style={styles.giftSubtitle}>
                  {isGiftClaimedToday
                    ? 'Claimed for today • Supply arrives tomorrow'
                    : 'Tap to unlock your tactical bonus!'}
                </Text>
              </View>

              <ThreeDButton
                title={isGiftClaimedToday ? 'Claimed' : 'Open'}
                icon={isGiftClaimedToday ? 'checkmark' : 'gift'}
                iconSize={15}
                colorScheme={isGiftClaimedToday ? 'blue' : 'yellow'}
                size="sm"
                disabled={isGiftClaimedToday}
                onPress={handleClaimDailyGift}
                style={{ minWidth: 90 }}
              />
            </View>
          </LinearGradient>
        </View>

        {/* 3D Campaign Progress Card */}
        <CampaignProgressCard
          completedLevels={completedLevels}
          totalLevels={50}
          stars={totalStars}
          streak={streak}
          unlockedLevel={unlockedLevel}
        />
      </ScrollView>

      {/* ---------------------------------------------------- */}
      {/* Player Profile Plaque                                 */}
      {/* ---------------------------------------------------- */}
      <ThreeDModalPlaque
        visible={showProfile}
        onClose={() => setShowProfile(false)}
        crestType="rules"
        title="PLAYER PROFILE"
        subtitle="Choose your name and avatar"
        maxWidth={360}
        showClose={true}
      >
        <View style={styles.profileForm}>
          <Text style={styles.profileFieldLabel}>PLAYER NAME</Text>
          <TextInput
            value={profileDraft.name}
            onChangeText={(name) => {
              setProfileDraft((current) => ({ ...current, name }));
              if (profileError) setProfileError('');
            }}
            placeholder="Enter your name"
            placeholderTextColor="#64748B"
            maxLength={20}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            selectionColor="#38D9F8"
            underlineColorAndroid="transparent"
            style={styles.profileNameInput}
            accessibilityLabel="Player name"
          />

          <Text style={[styles.profileFieldLabel, styles.avatarFieldLabel]}>CHOOSE AN AVATAR</Text>
          <View style={styles.avatarGallery}>
            {PROFILE_AVATARS.map((avatar) => {
              const isSelected = profileDraft.avatarId === avatar.id;
              return (
                <Pressable
                  key={avatar.id}
                  onPress={() => {
                    soundManager.playClickSound();
                    setProfileDraft((current) => ({ ...current, avatarId: avatar.id }));
                  }}
                  style={[
                    styles.avatarOption,
                    { backgroundColor: `${avatar.color}24` },
                    isSelected && { borderColor: avatar.color, backgroundColor: `${avatar.color}42` },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${avatar.id} avatar`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={styles.avatarOptionEmoji}>{avatar.emoji}</Text>
                </Pressable>
              );
            })}
          </View>

          {profileError ? (
            <Text style={styles.profileError} accessibilityRole="alert">{profileError}</Text>
          ) : null}
          <ThreeDButton
            title={isSavingProfile ? 'Saving...' : 'Save Profile'}
            icon="checkmark"
            colorScheme="cyan"
            size="md"
            disabled={isSavingProfile}
            onPress={saveProfile}
            style={styles.profileSaveButton}
          />
        </View>
      </ThreeDModalPlaque>

      {/* ---------------------------------------------------- */}
      {/* Modal 1: How to Play Plaque                           */}
      {/* ---------------------------------------------------- */}
      <ThreeDModalPlaque
        visible={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
        crestType="rules"
        title="HOW TO PLAY"
        subtitle="Plan each move. Clear every arrow."
        maxWidth={360}
        showClose={true}
      >
        <View style={styles.rulesTray}>
          <View style={styles.ruleItem}>
            <LinearGradient
              colors={['#38D9F8', '#0FB7E8', '#0288D1']}
              style={styles.ruleIconBox}
            >
              <SvgArrowGraphic size={20} dir="UP" state="normal" />
            </LinearGradient>
            <View style={styles.ruleTextBox}>
              <Text style={styles.ruleHeader}>Follow the arrow</Text>
              <Text style={styles.ruleDesc}>
                Arrows escape in the direction they point.
              </Text>
            </View>
          </View>

          <View style={styles.trayDivider} />

          <View style={styles.ruleItem}>
            <LinearGradient
              colors={['#FF5E7E', '#E62E5C', '#BF123F']}
              style={styles.ruleIconBox}
            >
              <SvgHand size={20} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.ruleTextBox}>
              <Text style={styles.ruleHeader}>Clear the path</Text>
              <Text style={styles.ruleDesc}>
                Blocked paths cannot move. Free blocking arrows first!
              </Text>
            </View>
          </View>

          <View style={styles.trayDivider} />

          <View style={styles.ruleItem}>
            <LinearGradient
              colors={['#FFD13B', '#FFA800', '#F57C00']}
              style={styles.ruleIconBox}
            >
              <SvgStar size={20} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.ruleTextBox}>
              <Text style={styles.ruleHeader}>Earn your stars</Text>
              <Text style={styles.ruleDesc}>
                Clear the board in as few moves as possible to earn up to 3 stars.
              </Text>
            </View>
          </View>
        </View>

        <ThreeDButton
          title="Got it — let’s play"
          colorScheme="cyan"
          size="md"
          onPress={() => setShowHowToPlay(false)}
          style={styles.modalBtn}
        />
      </ThreeDModalPlaque>

      {/* ---------------------------------------------------- */}
      {/* Modal 3: Hall of Mastery / Achievements Plaque       */}
      {/* ---------------------------------------------------- */}
      <ThreeDModalPlaque
        visible={showAchievements}
        onClose={() => setShowAchievements(false)}
        crestType="trophy"
        title="HALL OF MASTERY"
        subtitle={`${completedAchievementsCount} of ${ACHIEVEMENTS_DEF.length} Badges Unlocked`}
        maxWidth={380}
        showClose={true}
      >
        <View style={styles.achievementsTray}>
          {ACHIEVEMENTS_DEF.map((ach) => {
            const current = ach.calcProgress(achievementStats);
            const isCompleted = current >= ach.target;
            const progressPercent = Math.min(100, Math.round((current / ach.target) * 100));

            return (
              <View key={ach.id} style={styles.achievementRow}>
                <LinearGradient
                  colors={isCompleted ? ['#FBBF24', '#D97706'] : ['#26334D', '#172033']}
                  style={styles.achIconBadge}
                >
                  {ach.icon === 'crown' ? (
                    <SvgCrown size={18} color={isCompleted ? '#FFFFFF' : '#64748B'} />
                  ) : ach.icon === 'flame' ? (
                    <SvgFlame size={18} color={isCompleted ? '#FFFFFF' : '#64748B'} />
                  ) : ach.icon === 'flash' ? (
                    <SvgFlash size={18} color={isCompleted ? '#FFFFFF' : '#64748B'} />
                  ) : ach.icon === 'star' ? (
                    <SvgStar size={18} color={isCompleted ? '#FFFFFF' : '#64748B'} />
                  ) : ach.icon === 'grid' ? (
                    <SvgGrid size={18} color={isCompleted ? '#FFFFFF' : '#64748B'} />
                  ) : (
                    <SvgTrophy size={18} color={isCompleted ? '#FFFFFF' : '#64748B'} />
                  )}
                </LinearGradient>

                <View style={styles.achInfoCol}>
                  <View style={styles.achHeaderRow}>
                    <Text style={styles.achTitle}>{ach.title}</Text>
                    {isCompleted ? (
                      <View style={styles.unlockedBadge}>
                        <SvgCheck size={10} color="#FFFFFF" />
                        <Text style={styles.unlockedText}>DONE</Text>
                      </View>
                    ) : (
                      <Text style={styles.achRatio}>
                        {current}/{ach.target}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.achDesc}>{ach.desc}</Text>

                  {/* Mini Progress Bar */}
                  <View style={styles.achProgressTrack}>
                    <View
                      style={[
                        styles.achProgressFill,
                        {
                          width: `${progressPercent}%`,
                          backgroundColor: isCompleted ? '#F59E0B' : '#00F2FE',
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <ThreeDButton
          title="Close Mastery"
          colorScheme="blue"
          size="md"
          onPress={() => setShowAchievements(false)}
          style={styles.modalBtn}
        />
      </ThreeDModalPlaque>

      {/* ---------------------------------------------------- */}
      {/* Modal 4: Daily Tactical Supply Claim Celebration      */}
      {/* ---------------------------------------------------- */}
      {showGiftModal && <Confetti count={40} />}
      <ThreeDModalPlaque
        visible={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        crestType="trophy"
        title="SUPPLY SECURED!"
        subtitle="Daily tactical supplies added to your vault"
        maxWidth={360}
        showClose={true}
      >
        <View style={styles.giftRewardBox}>
          <LinearGradient
            colors={['rgba(245, 158, 11, 0.2)', 'rgba(217, 119, 6, 0.08)']}
            style={styles.giftRewardPlaque}
          >
            <SvgGift size={48} color="#FFD13B" />
            <Text style={styles.giftRewardTitle}>+1 Tactical Hint & Daily Star Boost</Text>
            <Text style={styles.giftRewardSub}>
              Use your free hint whenever an arrow blocks your path!
            </Text>
          </LinearGradient>
        </View>

        <ThreeDButton
          title="Collect Reward"
          colorScheme="yellow"
          size="md"
          onPress={() => setShowGiftModal(false)}
          style={styles.modalBtn}
        />
      </ThreeDModalPlaque>
    </GameBackground>
  );
}

const styles = StyleSheet.create({
  scrollWrapper: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankPillWrapper: {
    position: 'relative',
    marginHorizontal: 8,
    flex: 1,
    maxWidth: 190,
  },
  rankPillShadow: {
    position: 'absolute',
    top: 3,
    left: 2,
    right: 2,
    bottom: -3,
    borderRadius: 16,
    backgroundColor: '#020617',
  },
  rankPillFace: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    overflow: 'hidden',
    position: 'relative',
  },
  rankSheen: {
    position: 'absolute',
    top: 1,
    left: 4,
    right: 4,
    height: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 8,
  },
  profileAvatarBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  profileAvatarEmoji: {
    fontSize: 19,
  },
  profileName: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  rankTextCol: {
    flex: 1,
  },
  rankTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FFE8A3',
    letterSpacing: 0.6,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  rankStarsText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F8FAFC',
    marginLeft: 3,
  },
  profileForm: {
    width: '100%',
    paddingTop: 2,
  },
  profileFieldLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 7,
  },
  profileNameInput: {
    width: '100%',
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.32)',
    backgroundColor: 'rgba(2, 6, 23, 0.68)',
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  avatarFieldLabel: {
    marginTop: 18,
  },
  avatarGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  avatarOption: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  avatarOptionEmoji: {
    fontSize: 30,
  },
  profileError: {
    color: '#FDA4AF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
  profileSaveButton: {
    marginTop: 16,
    marginBottom: 6,
  },
  emblemSection: {
    alignItems: 'center',
    marginVertical: 4,
    width: '100%',
  },
  chapterBadge: {
    marginTop: 6,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  chapterGradient: {
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  chapterText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  // Hero Mission Card
  heroMissionCard: {
    width: '100%',
    position: 'relative',
    marginVertical: 8,
  },
  heroCardShadow: {
    position: 'absolute',
    top: 6,
    left: 4,
    right: 4,
    bottom: -6,
    borderRadius: 22,
    backgroundColor: '#020617',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  heroCardFace: {
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    padding: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  heroTopSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  heroTitleGroup: {
    flex: 1,
  },
  missionSubLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#00F2FE',
    letterSpacing: 1,
    marginBottom: 1,
  },
  missionLevelTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  specsPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  specsText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A0BEDE',
    letterSpacing: 0.5,
  },
  starsPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroStarSlot: {
    marginRight: 4,
  },
  bestRecordText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginLeft: 6,
  },

  // Blitz Rush Mode Card
  blitzContainer: {
    width: '100%',
    position: 'relative',
    marginVertical: 4,
  },
  blitzCardShadow: {
    position: 'absolute',
    top: 4,
    left: 2,
    right: 2,
    bottom: -4,
    borderRadius: 18,
    backgroundColor: '#020617',
    elevation: 4,
  },
  blitzCardFace: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(244, 63, 94, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  blitzSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  blitzContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blitzIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  blitzTextGroup: {
    flex: 1,
    marginRight: 8,
  },
  blitzBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blitzTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FECDD3',
    letterSpacing: 0.8,
  },
  blitzTimerTag: {
    backgroundColor: 'rgba(244, 63, 94, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    marginLeft: 6,
    borderWidth: 0.8,
    borderColor: '#F43F5E',
  },
  blitzTimerTagText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FFE4E6',
    letterSpacing: 0.5,
  },
  blitzSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FDA4AF',
    marginTop: 2,
    lineHeight: 14,
  },

  // 2-Column Mode Tiles Row
  modesRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  modeCard: {
    flex: 1,
    marginHorizontal: 4,
    position: 'relative',
  },
  modeCardShadow: {
    position: 'absolute',
    top: 4,
    left: 2,
    right: 2,
    bottom: -4,
    borderRadius: 18,
    backgroundColor: '#020617',
    elevation: 4,
  },
  modeCardFace: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 12,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 112,
    justifyContent: 'space-between',
  },
  modeTopSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneTag: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(6, 214, 160, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#06D6A0',
  },
  vaultProgressPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  vaultProgressText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
  },
  modeTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.8,
  },
  modeSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  modeFooter: {
    marginTop: 6,
  },
  modeHighlightOrange: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#F59E0B',
  },
  modeHighlightBlue: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#38BDF8',
  },

  // Daily Supply Crate Card
  dailyGiftContainer: {
    width: '100%',
    position: 'relative',
    marginVertical: 6,
  },
  giftCardShadow: {
    position: 'absolute',
    top: 4,
    left: 2,
    right: 2,
    bottom: -4,
    borderRadius: 18,
    backgroundColor: '#020617',
    elevation: 4,
  },
  giftCardFace: {
    borderRadius: 18,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  giftSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  giftContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  giftIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  giftTextGroup: {
    flex: 1,
    marginRight: 8,
  },
  giftTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFE8A3',
    letterSpacing: 0.6,
  },
  giftSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 1,
  },

  // Modals styling
  modalBtn: {
    marginTop: 10,
    marginBottom: 12,
  },
  rulesTray: {
    backgroundColor: 'rgba(2, 6, 23, 0.58)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    width: '100%',
  },
  ruleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
  },
  trayDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.16)',
    marginVertical: 4,
  },
  ruleTextBox: {
    flex: 1,
  },
  ruleHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 1,
  },
  ruleDesc: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    lineHeight: 15,
  },

  // Achievements Modal Tray
  achievementsTray: {
    backgroundColor: 'rgba(2, 6, 23, 0.58)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 6,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  achIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  achInfoCol: {
    flex: 1,
  },
  achHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  achTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  achDesc: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  achRatio: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  unlockedText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    marginLeft: 3,
  },
  achProgressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
  },
  achProgressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Gift Reward Celebration Box
  giftRewardBox: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 6,
  },
  giftRewardPlaque: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    padding: 16,
    alignItems: 'center',
  },
  giftRewardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFE8A3',
    letterSpacing: 0.5,
    marginTop: 10,
    textAlign: 'center',
  },
  giftRewardSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D4B59D',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
});
