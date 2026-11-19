/**
 * Zone definitions and progression configuration for Arrow Escape.
 * Total 50 levels divided into 5 thematic worlds (10 levels per zone).
 */

export const ZONES = [
  {
    id: 1,
    name: 'Whispering Woods',
    subtitle: 'Enchanted Canopy',
    levels: [1, 10],
    bgSource: require('../../assets/zone1_forest.jpg'),
    particleColor: '#34D399',
    particleType: 'firefly',
    primaryColor: '#10B981',
    accentColor: '#34D399',
    glowColor: '#6EE7B7',
    badgeBg: 'rgba(6, 78, 59, 0.85)',
    borderColor: '#059669',
    tileGradient: ['#10B981', '#059669', '#047857'],
    tileBevel: '#065F46',
    tileShadow: '#022C22',
    arrowNormal: {
      gradStart: '#6EE7B7',
      gradMid: '#10B981',
      gradEnd: '#047857',
      leftFacet: 'rgba(255, 255, 255, 0.45)',
      rightFacet: 'rgba(2, 44, 34, 0.45)',
      core: '#ECFDF5',
      coreGlow: 'rgba(110, 231, 183, 0.85)',
      border: '#065F46',
      dot: '#A7F3D0',
    },
  },
  {
    id: 2,
    name: 'Sunken Oasis',
    subtitle: 'Ancient Sandstone',
    levels: [11, 20],
    bgSource: require('../../assets/zone2_desert.jpg'),
    particleColor: '#FBBF24',
    particleType: 'dust',
    primaryColor: '#F59E0B',
    accentColor: '#FBBF24',
    glowColor: '#FDE68A',
    badgeBg: 'rgba(120, 53, 15, 0.85)',
    borderColor: '#D97706',
    tileGradient: ['#F59E0B', '#D97706', '#B45309'],
    tileBevel: '#92400E',
    tileShadow: '#451A03',
    arrowNormal: {
      gradStart: '#FDE68A',
      gradMid: '#F59E0B',
      gradEnd: '#B45309',
      leftFacet: 'rgba(255, 255, 255, 0.45)',
      rightFacet: 'rgba(69, 26, 3, 0.45)',
      core: '#FFFBEB',
      coreGlow: 'rgba(253, 230, 138, 0.85)',
      border: '#92400E',
      dot: '#FEF08A',
    },
  },
  {
    id: 3,
    name: 'Mystic Cavern',
    subtitle: 'Amethyst Labyrinth',
    levels: [21, 30],
    bgSource: require('../../assets/zone3_crystal.jpg'),
    particleColor: '#C084FC',
    particleType: 'crystal',
    primaryColor: '#A855F7',
    accentColor: '#C084FC',
    glowColor: '#E9D5FF',
    badgeBg: 'rgba(88, 28, 135, 0.85)',
    borderColor: '#9333EA',
    tileGradient: ['#A855F7', '#9333EA', '#7E22CE'],
    tileBevel: '#6B21A8',
    tileShadow: '#3B0764',
    arrowNormal: {
      gradStart: '#E9D5FF',
      gradMid: '#A855F7',
      gradEnd: '#6B21A8',
      leftFacet: 'rgba(255, 255, 255, 0.45)',
      rightFacet: 'rgba(59, 7, 100, 0.45)',
      core: '#FAF5FF',
      coreGlow: 'rgba(233, 213, 255, 0.85)',
      border: '#6B21A8',
      dot: '#F3E8FF',
    },
  },
  {
    id: 4,
    name: 'Sky Citadel',
    subtitle: 'Celestial Islands',
    levels: [31, 40],
    bgSource: require('../../assets/zone4_sky.jpg'),
    particleColor: '#38BDF8',
    particleType: 'sparkle',
    primaryColor: '#0EA5E9',
    accentColor: '#38BDF8',
    glowColor: '#BAE6FD',
    badgeBg: 'rgba(12, 74, 110, 0.85)',
    borderColor: '#0284C7',
    tileGradient: ['#38BDF8', '#0284C7', '#0369A1'],
    tileBevel: '#075985',
    tileShadow: '#082F49',
    arrowNormal: {
      gradStart: '#BAE6FD',
      gradMid: '#0EA5E9',
      gradEnd: '#0369A1',
      leftFacet: 'rgba(255, 255, 255, 0.45)',
      rightFacet: 'rgba(8, 47, 73, 0.45)',
      core: '#F0F9FF',
      coreGlow: 'rgba(186, 230, 253, 0.85)',
      border: '#075985',
      dot: '#7DD3FC',
    },
  },
  {
    id: 5,
    name: 'Obsidian Spire',
    subtitle: 'Molten Volcano',
    levels: [41, 50],
    bgSource: require('../../assets/zone5_volcano.jpg'),
    particleColor: '#FB7185',
    particleType: 'ember',
    primaryColor: '#F43F5E',
    accentColor: '#FB7185',
    glowColor: '#FECDD3',
    badgeBg: 'rgba(136, 19, 55, 0.85)',
    borderColor: '#E11D48',
    tileGradient: ['#FB7185', '#E11D48', '#BE123C'],
    tileBevel: '#9F1239',
    tileShadow: '#4C0519',
    arrowNormal: {
      gradStart: '#FECDD3',
      gradMid: '#F43F5E',
      gradEnd: '#9F1239',
      leftFacet: 'rgba(255, 255, 255, 0.45)',
      rightFacet: 'rgba(76, 5, 25, 0.45)',
      core: '#FFF1F2',
      coreGlow: 'rgba(254, 205, 211, 0.85)',
      border: '#9F1239',
      dot: '#FDA4AF',
    },
  },
];

/**
 * Get Zone configuration object for any given level number.
 * Defaults to Zone 1 if invalid.
 */
export function getZoneByLevel(levelNumber = 1) {
  if (typeof levelNumber !== 'number' || isNaN(levelNumber) || levelNumber < 1) {
    return ZONES[0];
  }
  const zoneIndex = Math.min(ZONES.length, Math.max(1, Math.ceil(levelNumber / 10))) - 1;
  return ZONES[zoneIndex] || ZONES[0];
}

/**
 * Get Zone configuration by zone ID (1 to 5).
 */
export function getZoneById(zoneId = 1) {
  const index = Math.min(ZONES.length, Math.max(1, zoneId)) - 1;
  return ZONES[index] || ZONES[0];
}
