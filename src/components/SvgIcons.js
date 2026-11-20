import React from 'react';
import Svg, {
  Path,
  Circle,
  Rect,
  Polygon,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';

/**
 * 3D Aerodynamic Graphical Arrow for puzzle gameplay and emblems.
 * Features faceted supersonic wings, glowing energy core, zone-adaptive palettes, and multi-tone SVG styling.
 */
export function SvgArrowGraphic({
  size = 48,
  dir = 'UP', // 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'
  state = 'normal', // 'normal' | 'blocked' | 'blocking' | 'hinted'
  zone = 1,
}) {
  const rotationMap = {
    UP: 0,
    RIGHT: 90,
    DOWN: 180,
    LEFT: 270,
  };
  const rotation = rotationMap[dir] || 0;

  // Zone-specific normal palettes (changes every 10 levels)
  const zoneNormalPalettes = {
    1: {
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
    2: {
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
    3: {
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
    4: {
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
    5: {
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
  };

  const currentZoneNormal = zoneNormalPalettes[zone] || zoneNormalPalettes[1];

  // State-specific color palettes
  const colorMap = {
    normal: currentZoneNormal,
    blocked: {
      gradStart: '#FF4E50',
      gradMid: '#FF0844',
      gradEnd: '#99001D',
      leftFacet: 'rgba(255, 200, 200, 0.45)',
      rightFacet: 'rgba(60, 0, 10, 0.45)',
      core: '#FFF0F2',
      coreGlow: 'rgba(255, 8, 68, 0.85)',
      border: '#6B0014',
      dot: '#FFA3B0',
    },
    blocking: {
      gradStart: '#FFB347',
      gradMid: '#FF7E00',
      gradEnd: '#B84900',
      leftFacet: 'rgba(255, 230, 180, 0.4)',
      rightFacet: 'rgba(70, 25, 0, 0.4)',
      core: '#FFF8E7',
      coreGlow: 'rgba(255, 126, 0, 0.75)',
      border: '#7A3000',
      dot: '#FFD399',
    },
    hinted: {
      gradStart: '#FFF176',
      gradMid: '#FFD700',
      gradEnd: '#FF9100',
      leftFacet: 'rgba(255, 255, 255, 0.55)',
      rightFacet: 'rgba(100, 60, 0, 0.35)',
      core: '#FFFFF0',
      coreGlow: 'rgba(255, 215, 0, 0.85)',
      border: '#B36B00',
      dot: '#FFF9C4',
    },
  };

  const c = colorMap[state] || currentZoneNormal;
  const gradId = `arrow_grad_${state}_z${zone}`;
  const coreGlowId = `arrow_glow_${state}_z${zone}`;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        transform: [{ rotate: `${rotation}deg` }],
      }}
    >
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={c.gradStart} />
          <Stop offset="45%" stopColor={c.gradMid} />
          <Stop offset="100%" stopColor={c.gradEnd} />
        </LinearGradient>
        <RadialGradient id={coreGlowId} cx="50%" cy="38%" r="48%">
          <Stop offset="0%" stopColor={c.core} stopOpacity="1" />
          <Stop offset="55%" stopColor={c.coreGlow} stopOpacity="0.85" />
          <Stop offset="100%" stopColor={c.gradMid} stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Aerodynamic 3D Supersonic Arrow Body */}
      {/* Outer beveled silhouette with swept wing geometry */}
      <Path
        d="M 50,10 L 86,44 L 66,46 L 64,80 L 50,75 L 36,80 L 34,46 L 14,44 Z"
        fill={`url(#${gradId})`}
        stroke={c.border}
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Left Specular Facet (Highlights upper-left swept edge) */}
      <Path
        d="M 50,12 L 50,75 L 36,80 L 34,46 L 16,44 Z"
        fill={c.leftFacet}
      />

      {/* Right Shadow Facet (Deepens bottom-right edge & wing) */}
      <Path
        d="M 50,12 L 84,44 L 66,46 L 64,80 L 50,75 Z"
        fill={c.rightFacet}
      />

      {/* High-Tech Central Energy Core Spine Ridge */}
      <Path
        d="M 50,18 L 50,72"
        stroke={c.core}
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Swept Wing Leading Edge Highlights */}
      <Path
        d="M 48,14 L 18,43"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Path
        d="M 52,14 L 82,43"
        stroke="rgba(255, 255, 255, 0.25)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Glowing Energy Node in Aerodynamic Tip */}
      <Circle
        cx="50"
        cy="32"
        r="5.5"
        fill={`url(#${coreGlowId})`}
      />
      <Circle
        cx="50"
        cy="32"
        r="2.8"
        fill="#FFFFFF"
      />

      {/* Tail Booster Drive Dot */}
      <Circle
        cx="50"
        cy="68"
        r="3.8"
        fill={c.dot}
        stroke={c.border}
        strokeWidth="1.5"
      />
    </Svg>
  );
}

/**
 * 2D SVG Jet Stream & Speed Trail for exiting arrows.
 */
export function SvgFlightTrail({
  width = 60,
  height = 80,
  dir = 'UP',
}) {
  const rotationMap = {
    UP: 0,
    RIGHT: 90,
    DOWN: 180,
    LEFT: 270,
  };
  const rotation = rotationMap[dir] || 0;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 60 80"
      style={{
        transform: [{ rotate: `${rotation}deg` }],
      }}
    >
      <Defs>
        <LinearGradient id="trail_grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#00F2FE" stopOpacity="0.85" />
          <Stop offset="40%" stopColor="#4FACFE" stopOpacity="0.5" />
          <Stop offset="100%" stopColor="#0072FF" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Tapered Energy Jet */}
      <Polygon
        points="22,0 38,0 48,70 30,80 12,70"
        fill="url(#trail_grad)"
      />

      {/* Speed Streaks */}
      <Path
        d="M 30,10 L 30,65 M 20,20 L 20,55 M 40,20 L 40,55"
        stroke="#E0F7FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 6"
      />
    </Svg>
  );
}

/**
 * 2D Shockwave Deflection Ring (used for blocked arrow impact effect).
 */
export function SvgShockwaveRing({
  size = 60,
  color = '#FF0844',
  progress = 0, // 0 to 1
}) {
  const radius = 6 + progress * 22;
  const strokeW = Math.max(1, (1 - progress) * 4);
  const opacity = Math.max(0, 1 - progress);

  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Circle
        cx="30"
        cy="30"
        r={radius}
        stroke={color}
        strokeWidth={strokeW}
        fill="none"
        opacity={opacity}
      />
      {progress < 0.6 && (
        <Circle
          cx="30"
          cy="30"
          r={radius * 0.5}
          stroke="#FFE066"
          strokeWidth={strokeW * 0.8}
          fill="none"
          opacity={opacity * 0.8}
        />
      )}
    </Svg>
  );
}

/**
 * 2D Faceted Star Graphic.
 */
export function SvgStar({
  size = 28,
  empty = false,
  color = '#FFD13B',
}) {
  if (empty) {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path
          d="M 50,8 L 63,35 L 94,38 L 71,59 L 77,89 L 50,74 L 23,89 L 29,59 L 6,38 L 37,35 Z"
          fill="#1E293B"
          stroke="#334155"
          strokeWidth="6"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="star_gold" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFF275" />
          <Stop offset="50%" stopColor="#FFD13B" />
          <Stop offset="100%" stopColor="#F59E0B" />
        </LinearGradient>
      </Defs>

      {/* Shadow Base */}
      <Path
        d="M 50,12 L 63,39 L 94,42 L 71,63 L 77,93 L 50,78 L 23,93 L 29,63 L 6,42 L 37,39 Z"
        fill="#92400E"
      />

      {/* Main Faceted Star Body */}
      <Path
        d="M 50,8 L 63,35 L 94,38 L 71,59 L 77,89 L 50,74 L 23,89 L 29,59 L 6,38 L 37,35 Z"
        fill="url(#star_gold)"
        stroke="#B45309"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Left-facet Light Highlight */}
      <Path
        d="M 50,11 L 50,72 L 25,86 L 31,58 L 9,39 L 38,36 Z"
        fill="rgba(255, 255, 255, 0.45)"
      />

      {/* Specular Center Glint */}
      <Circle cx="44" cy="40" r="5" fill="#FFFFFF" opacity="0.9" />
    </Svg>
  );
}

/**
 * 2D Padlock Icon.
 */
export function SvgLock({ size = 20, color = '#94A3B8' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Shackle */}
      <Path
        d="M 7,10 L 7,7 C 7,4.2 9.2,2 12,2 C 14.8,2 17,4.2 17,7 L 17,10"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Padlock Body */}
      <Rect
        x="4"
        y="10"
        width="16"
        height="12"
        rx="3"
        fill={color}
      />
      {/* Keyhole */}
      <Circle cx="12" cy="15" r="1.5" fill="#0F172A" />
      <Path d="M 11.5,15.5 L 12.5,15.5 L 13,19 L 11,19 Z" fill="#0F172A" />
    </Svg>
  );
}

/**
 * 2D Lightning / Flash Icon (Moves / Power).
 */
export function SvgFlash({ size = 20, color = '#00F2FE' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id="flash_grad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#7DF9FF" />
          <Stop offset="100%" stopColor={color} />
        </LinearGradient>
      </Defs>
      <Path
        d="M 13,2 L 4,14 L 11,14 L 9,22 L 20,10 L 13,10 Z"
        fill="url(#flash_grad)"
        stroke="#005299"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * 2D Stopwatch / Timer Icon.
 */
export function SvgTimer({ size = 20, color = '#FFD13B' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Top Push Pin */}
      <Rect x="10.5" y="1.5" width="3" height="3" rx="1" fill={color} />
      {/* Clock Outer Body */}
      <Circle
        cx="12"
        cy="13.5"
        r="8.5"
        stroke={color}
        strokeWidth="2.4"
        fill="#1E293B"
      />
      {/* Dial Center */}
      <Circle cx="12" cy="13.5" r="1.5" fill={color} />
      {/* Hands */}
      <Path
        d="M 12,13.5 L 12,8.5 M 12,13.5 L 16,13.5"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * 2D Target / Radar Icon (Arrows remaining).
 */
export function SvgTarget({ size = 20, color = '#06D6A0' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="2.2"
        fill="none"
      />
      <Circle
        cx="12"
        cy="12"
        r="5.5"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        opacity="0.8"
      />
      <Circle cx="12" cy="12" r="2.5" fill={color} />
    </Svg>
  );
}

/**
 * 2D Back Chevron Icon.
 */
export function SvgArrowBack({ size = 22, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M 15,19 L 8,12 L 15,5"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/**
 * 2D Pause Bars Icon.
 */
export function SvgPause({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="6" y="5" width="4" height="14" rx="2" fill={color} />
      <Rect x="14" y="5" width="4" height="14" rx="2" fill={color} />
    </Svg>
  );
}

/**
 * 2D Play Triangle Icon.
 */
export function SvgPlay({ size = 22, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M 7,4.5 L 19,12 L 7,19.5 Z"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * 2D Undo / Curved Return Arrow Icon.
 */
export function SvgUndo({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M 9,6 L 4,11 L 9,16"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M 5,11 L 14,11 C 17.5,11 20,13.5 20,17 C 20,17.5 19.8,18 19.5,18.5"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

/**
 * 2D Hint / Lightbulb Icon.
 */
export function SvgHint({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M 12,2 C 7.6,2 4,5.6 4,10 C 4,12.8 5.4,15.2 7.7,16.6 L 8.5,19 L 15.5,19 L 16.3,16.6 C 18.6,15.2 20,12.8 20,10 C 20,5.6 16.4,2 12,2 Z"
        fill={color}
      />
      <Rect x="9" y="20" width="6" height="2" rx="1" fill="#D97706" />
      {/* Inner glowing filament */}
      <Path
        d="M 10,10 C 10,7.8 14,7.8 14,10 C 14,12 10,12 10,14"
        stroke="#92400E"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

/**
 * 2D Refresh / Reload Loop Icon.
 */
export function SvgRefresh({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M 20,4 L 20,9 L 15,9"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M 4,20 L 4,15 L 9,15"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M 18.4,14 C 17.5,17 14.8,19.2 11.5,19.5 C 7.3,19.9 3.6,16.9 3.1,12.7"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M 5.6,10 C 6.5,7 9.2,4.8 12.5,4.5 C 16.7,4.1 20.4,7.1 20.9,11.3"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

/**
 * 2D Home House Icon.
 */
export function SvgHome({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Roof */}
      <Path
        d="M 3,11 L 12,3 L 21,11"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* House Body */}
      <Path
        d="M 5,9.5 L 5,20 C 5,20.6 5.4,21 6,21 L 18,21 C 18.6,21 19,20.6 19,20 L 19,9.5"
        stroke={color}
        strokeWidth="2.4"
        fill="none"
      />
      {/* Doorway */}
      <Rect x="9.5" y="13" width="5" height="8" rx="1.5" fill={color} />
    </Svg>
  );
}

/**
 * 2D Grid / Levels Map Icon.
 */
export function SvgGrid({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="3.5" y="3.5" width="6.5" height="6.5" rx="2" fill={color} />
      <Rect x="14" y="3.5" width="6.5" height="6.5" rx="2" fill={color} />
      <Rect x="3.5" y="14" width="6.5" height="6.5" rx="2" fill={color} />
      <Rect x="14" y="14" width="6.5" height="6.5" rx="2" fill={color} />
    </Svg>
  );
}

/**
 * 2D Audio Speaker Icon (On / Off).
 */
export function SvgSound({ size = 20, color = '#00F2FE', muted = false }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Speaker Cone */}
      <Path
        d="M 4,9 L 7.5,9 L 12,5 L 12,19 L 7.5,15 L 4,15 Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {!muted ? (
        <>
          {/* Wave 1 */}
          <Path
            d="M 15.5,8.5 C 16.8,9.8 17.5,11.6 17.5,12 C 17.5,12.4 16.8,14.2 15.5,15.5"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Wave 2 */}
          <Path
            d="M 18.5,5.5 C 20.5,7.5 21.5,10.2 21.5,12 C 21.5,13.8 20.5,16.5 18.5,18.5"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        /* Mute Diagonal Slash */
        <Path
          d="M 15,9 L 21,15 M 21,9 L 15,15"
          stroke="#FF4E50"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
}

/**
 * 2D Haptic Vibration Icon.
 */
export function SvgHaptic({ size = 20, color = '#FFD13B', enabled = true }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Phone Silhouette */}
      <Rect
        x="7.5"
        y="4"
        width="9"
        height="16"
        rx="2"
        stroke={color}
        strokeWidth="2"
        fill="#1E293B"
      />
      <Circle cx="12" cy="17" r="1" fill={color} />
      {enabled ? (
        <>
          {/* Vibration waves Left */}
          <Path
            d="M 4,7 C 2.8,8.5 2.8,11 2.8,12 C 2.8,13 2.8,15.5 4,17"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Vibration waves Right */}
          <Path
            d="M 20,7 C 21.2,8.5 21.2,11 21.2,12 C 21.2,13 21.2,15.5 20,17"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        <Path
          d="M 3,3 L 21,21"
          stroke="#FF4E50"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
}

/**
 * 2D Flame Icon (Streak / Daily Challenge).
 */
export function SvgFlame({ size = 24, color = '#FF6B00' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="flame_outer" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0%" stopColor="#D90429" />
          <Stop offset="50%" stopColor="#F72585" />
          <Stop offset="100%" stopColor="#FF7B00" />
        </LinearGradient>
        <LinearGradient id="flame_inner" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0%" stopColor="#FF9E00" />
          <Stop offset="100%" stopColor="#FFEA00" />
        </LinearGradient>
      </Defs>
      {/* Outer Flame */}
      <Path
        d="M 50,5 C 55,25 75,35 80,55 C 85,75 70,95 50,95 C 30,95 15,75 20,55 C 25,40 38,30 40,15 C 44,22 47,24 50,5 Z"
        fill="url(#flame_outer)"
      />
      {/* Inner Heart of Fire */}
      <Path
        d="M 50,45 C 53,55 64,62 65,72 C 67,82 60,92 50,92 C 40,92 33,82 35,72 C 37,65 44,58 45,52 C 47,56 48,57 50,45 Z"
        fill="url(#flame_inner)"
      />
    </Svg>
  );
}

/**
 * 2D Trophy / Award Cup Icon.
 */
export function SvgTrophy({ size = 32, color = '#FFD13B' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="trophy_gold" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FFF176" />
          <Stop offset="50%" stopColor="#FFD13B" />
          <Stop offset="100%" stopColor="#D97706" />
        </LinearGradient>
      </Defs>
      {/* Left Handle */}
      <Path
        d="M 30,22 C 14,22 14,50 30,50"
        stroke="#D97706"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right Handle */}
      <Path
        d="M 70,22 C 86,22 86,50 70,50"
        stroke="#D97706"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cup Bowl */}
      <Path
        d="M 28,15 L 72,15 L 68,54 C 66,66 58,72 50,72 C 42,72 34,66 32,54 Z"
        fill="url(#trophy_gold)"
        stroke="#B45309"
        strokeWidth="3"
      />
      {/* Cup Rim */}
      <Rect x="26" y="11" width="48" height="6" rx="3" fill="#FFF59D" />
      {/* Pedestal Stem */}
      <Rect x="46" y="72" width="8" height="12" fill="#D97706" />
      {/* Base */}
      <Rect x="34" y="84" width="32" height="8" rx="2" fill="#92400E" />
    </Svg>
  );
}

/**
 * 2D Checkmark Icon.
 */
export function SvgCheck({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M 4,12 L 9.5,17.5 L 20,6.5"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/**
 * 2D Close / Dismiss Cross Icon.
 */
export function SvgClose({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M 6,6 L 18,18 M 18,6 L 6,18"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * 2D Trash Can Icon.
 */
export function SvgTrash({ size = 20, color = '#FF2A6D' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Can Body */}
      <Path
        d="M 5.5,7.5 L 6.5,20 C 6.6,20.8 7.3,21.5 8.2,21.5 L 15.8,21.5 C 16.7,21.5 17.4,20.8 17.5,20 L 18.5,7.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lid & Handle */}
      <Path
        d="M 3.5,6.5 L 20.5,6.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <Path
        d="M 9.5,6.5 L 9.5,4 C 9.5,3.4 9.9,3 10.5,3 L 13.5,3 C 14.1,3 14.5,3.4 14.5,4 L 14.5,6.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner Stripe Ribs */}
      <Path
        d="M 9.5,11 L 9.5,17 M 14.5,11 L 14.5,17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * 2D Hand / Tap Tutorial Gesture Icon.
 */
export function SvgHand({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M 12,2 L 12,12 M 12,12 L 10,9.5 C 9.2,8.7 8,8.7 7.2,9.5 C 6.4,10.3 6.4,11.5 7.2,12.3 L 10.5,15.6 C 11.8,17 13.6,17.8 15.5,17.8 L 17.5,17.8 C 19.4,17.8 21,16.2 21,14.3 L 21,9.5 C 21,8.4 20.1,7.5 19,7.5 C 17.9,7.5 17,8.4 17,9.5 L 17,7.5 C 17,6.4 16.1,5.5 15,5.5 C 13.9,5.5 13,6.4 13,7.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Ripple ring at finger tip */}
      <Circle cx="12" cy="2" r="2" stroke={color} strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

/**
 * 2D Theme Icon (Moon for dark, Sun for light).
 */
export function SvgTheme({ size = 20, color = '#818CF8', darkMode = true }) {
  if (darkMode) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M 21,12.79 A 9,9 0 1 1 11.21,3 A 7,7 0 0 0 21,12.79 Z"
          fill={color}
        />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="5" fill={color} />
      <Path
        d="M 12,1 L 12,4 M 12,20 L 12,23 M 4.22,4.22 L 6.34,6.34 M 17.66,17.66 L 19.78,19.78 M 1,12 L 4,12 M 20,12 L 23,12 M 4.22,19.78 L 6.34,17.66 M 17.66,6.34 L 19.78,4.22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * 2D Tactile Help / Question Mark Icon.
 */
export function SvgHelp({ size = 22, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Shadow Base */}
      <Path
        d="M 9,8.5 C 9.2,6.6 10.4,5 12,5 C 13.8,5 15.2,6.4 15.2,8.2 C 15.2,9.8 13.9,10.9 12.8,11.9 C 12.2,12.5 12,13.2 12,14"
        stroke="rgba(0, 0, 0, 0.28)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx="12" cy="18.8" r="1.8" fill="rgba(0, 0, 0, 0.28)" />

      {/* Front Question Mark */}
      <Path
        d="M 9,8 C 9.2,6.1 10.4,4.5 12,4.5 C 13.8,4.5 15.2,5.9 15.2,7.7 C 15.2,9.3 13.9,10.4 12.8,11.4 C 12.2,12 12,12.7 12,13.5"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx="12" cy="18" r="1.8" fill={color} />
    </Svg>
  );
}

/**
 * 2D Precision Mechanical Cog / Settings Gear Icon.
 */
export function SvgSettings({ size = 22, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Shadow Base */}
      <Path
        d="M 19.14,13.44 C 19.18,13.13 19.2,12.82 19.2,12.5 C 19.2,12.18 19.18,11.87 19.14,11.56 L 21.16,9.98 C 21.34,9.84 21.39,9.58 21.28,9.38 L 19.36,6.05 C 19.24,5.85 19,5.77 18.78,5.85 L 16.4,6.81 C 15.91,6.43 15.37,6.12 14.78,5.88 L 14.42,3.35 C 14.39,3.12 14.19,2.95 13.95,2.95 L 10.05,2.95 C 9.81,2.95 9.61,3.12 9.58,3.35 L 9.22,5.88 C 8.63,6.12 8.09,6.44 7.6,6.81 L 5.22,5.85 C 5,5.77 4.76,5.85 4.64,6.05 L 2.72,9.38 C 2.61,9.58 2.66,9.84 2.84,9.98 L 4.86,11.56 C 4.82,11.87 4.8,12.18 4.8,12.5 C 4.8,12.82 4.82,13.13 4.86,13.44 L 2.84,15.02 C 2.66,15.16 2.61,15.42 2.72,15.62 L 4.64,18.95 C 4.76,19.15 5,19.23 5.22,19.15 L 7.6,18.19 C 8.09,18.57 8.63,18.88 9.22,19.12 L 9.58,21.65 C 9.61,21.88 9.81,22.05 10.05,22.05 L 13.95,22.05 C 14.19,22.05 14.39,21.88 14.42,21.65 L 14.78,19.12 C 15.37,18.88 15.91,18.56 16.4,18.19 L 18.78,19.15 C 19,19.23 19.24,19.15 19.36,18.95 L 21.28,15.62 C 21.39,15.42 21.34,15.16 21.16,15.02 Z M 12,16 C 10.07,16 8.5,14.43 8.5,12.5 C 8.5,10.57 10.07,9 12,9 C 13.93,9 15.5,10.57 15.5,12.5 C 15.5,14.43 13.93,16 12,16 Z"
        fill="rgba(0, 0, 0, 0.28)"
      />
      {/* Front Gear Face */}
      <Path
        d="M 19.14,12.94 C 19.18,12.63 19.2,12.32 19.2,12 C 19.2,11.68 19.18,11.37 19.14,11.06 L 21.16,9.48 C 21.34,9.34 21.39,9.08 21.28,8.88 L 19.36,5.55 C 19.24,5.35 19,5.27 18.78,5.35 L 16.4,6.31 C 15.91,5.93 15.37,5.62 14.78,5.38 L 14.42,2.85 C 14.39,2.62 14.19,2.45 13.95,2.45 L 10.05,2.45 C 9.81,2.45 9.61,2.62 9.58,2.85 L 9.22,5.38 C 8.63,5.62 8.09,5.94 7.6,6.31 L 5.22,5.35 C 5,5.27 4.76,5.35 4.64,5.55 L 2.72,8.88 C 2.61,9.08 2.66,9.34 2.84,9.48 L 4.86,11.06 C 4.82,11.37 4.8,11.68 4.8,12 C 4.8,12.32 4.82,12.63 4.86,12.94 L 2.84,14.52 C 2.66,14.66 2.61,14.92 2.72,15.12 L 4.64,18.45 C 4.76,18.65 5,18.73 5.22,18.65 L 7.6,17.69 C 8.09,18.07 8.63,18.38 9.22,18.62 L 9.58,21.15 C 9.61,21.38 9.81,21.55 10.05,21.55 L 13.95,21.55 C 14.19,21.55 14.39,21.38 14.42,21.15 L 14.78,18.62 C 15.37,18.38 15.91,18.06 16.4,17.69 L 18.78,18.65 C 19,18.73 19.24,18.65 19.36,18.45 L 21.28,15.12 C 21.39,14.92 21.34,14.66 21.16,14.52 Z M 12,15.5 C 10.07,15.5 8.5,13.93 8.5,12 C 8.5,10.07 10.07,8.5 12,8.5 C 13.93,8.5 15.5,10.07 15.5,12 C 15.5,13.93 13.93,15.5 12,15.5 Z"
        fill={color}
      />
    </Svg>
  );
}

/**
 * 2D Tactile Mystery Gift Crate Icon with Ribbon.
 */
export function SvgGift({ size = 22, color = '#FFD13B' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Box shadow */}
      <Rect x="4" y="11" width="16" height="10" rx="2" fill="rgba(0, 0, 0, 0.3)" />
      {/* Box body */}
      <Rect x="4" y="10" width="16" height="10" rx="2" fill={color} />
      {/* Box lid */}
      <Rect x="3" y="6.5" width="18" height="4" rx="1.5" fill="#FFF275" />
      {/* Vertical Ribbon */}
      <Rect x="10.5" y="6.5" width="3" height="13.5" fill="#E11D48" />
      {/* Horizontal Ribbon on Lid */}
      <Rect x="3" y="7.5" width="18" height="2" fill="#E11D48" />
      {/* Ribbon Bow Loops */}
      <Circle cx="9" cy="5" r="2.2" fill="none" stroke="#E11D48" strokeWidth="1.6" />
      <Circle cx="15" cy="5" r="2.2" fill="none" stroke="#E11D48" strokeWidth="1.6" />
      <Circle cx="12" cy="5.8" r="1.4" fill="#BE123C" />
    </Svg>
  );
}

/**
 * 2D Tactile Rotate / Pivot Power-Up Icon.
 */
export function SvgRotate({ size = 22, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Curved Arrow Arc */}
      <Path
        d="M 20.5,12 A 8.5,8.5 0 1,1 17.5,5.5 L 21,2 L 21,8.5 L 14.5,8.5 L 18,5 A 9.5,9.5 0 1,0 21.5,12 Z"
        fill={color}
      />
    </Svg>
  );
}

/**
 * 2D Golden Royal Crown Icon for Player Rank.
 */
export function SvgCrown({ size = 22, color = '#FFD13B' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M 3,18 L 21,18 L 20,9 L 15,13 L 12,6 L 9,13 L 4,9 Z"
        fill={color}
      />
      <Rect x="3" y="18" width="18" height="2.5" rx="1" fill="#D97706" />
      <Circle cx="12" cy="6" r="1.8" fill="#38BDF8" />
      <Circle cx="4" cy="9" r="1.5" fill="#FF4E6B" />
      <Circle cx="20" cy="9" r="1.5" fill="#FF4E6B" />
    </Svg>
  );
}

/**
 * 3D Faceted Ruby Heart Icon for Lives Display.
 * Supports filled (full glowing life) and depleted (broken socket) states.
 */
export function SvgHeart({
  size = 22,
  filled = true,
  color = '#FF2A6D',
  ...props
}) {
  const heartPath =
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

  if (!filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        {/* Depleted Socket Silhouette */}
        <Path
          d={heartPath}
          fill="rgba(15, 23, 42, 0.75)"
          stroke="rgba(148, 163, 184, 0.35)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Subtle crack accent */}
        <Path
          d="M12 4.5 L11 8.5 L13 12.5 L11.5 16.5 L12 20"
          stroke="rgba(148, 163, 184, 0.45)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  const gradId = `heart_grad_${Math.floor(size)}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FF4D6D" />
          <Stop offset="45%" stopColor="#E11D48" />
          <Stop offset="100%" stopColor="#9F1239" />
        </LinearGradient>
      </Defs>

      {/* Outer Ruby Drop Glow */}
      <Path
        d={heartPath}
        fill={color}
        opacity={0.35}
        transform="scale(1.08) translate(-0.96, -0.96)"
      />

      {/* Main 3D Ruby Body */}
      <Path
        d={heartPath}
        fill={`url(#${gradId})`}
        stroke="#FFE4E6"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Top Left Specular Gloss Sheen */}
      <Circle cx="7.2" cy="6.8" r="2.2" fill="rgba(255, 255, 255, 0.65)" />
      <Path
        d="M5.5 6.5 C6 4.8, 8.8 4.8, 9.5 6.5"
        stroke="rgba(255, 255, 255, 0.85)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Universal SVG Icon Resolver: maps icon string names to our clean 2D SVG components.
 */
export function GameSvgIcon({
  name,
  size = 20,
  color = '#FFFFFF',
  style,
  ...props
}) {
  switch (name) {
    case 'arrow-back':
    case 'chevron-back':
    case 'back':
      return <SvgArrowBack size={size} color={color} {...props} />;
    case 'pause':
      return <SvgPause size={size} color={color} {...props} />;
    case 'play':
      return <SvgPlay size={size} color={color} {...props} />;
    case 'arrow-undo':
    case 'undo':
      return <SvgUndo size={size} color={color} {...props} />;
    case 'bulb':
    case 'hint':
      return <SvgHint size={size} color={color} {...props} />;
    case 'refresh':
    case 'restart':
      return <SvgRefresh size={size} color={color} {...props} />;
    case 'home':
      return <SvgHome size={size} color={color} {...props} />;
    case 'apps':
    case 'grid':
    case 'levels':
      return <SvgGrid size={size} color={color} {...props} />;
    case 'star':
      return <SvgStar size={size} color={color} {...props} />;
    case 'lock-closed':
    case 'lock':
      return <SvgLock size={size} color={color} {...props} />;
    case 'flash':
    case 'flash-outline':
    case 'moves':
      return <SvgFlash size={size} color={color} {...props} />;
    case 'time':
    case 'time-outline':
    case 'timer':
      return <SvgTimer size={size} color={color} {...props} />;
    case 'radio':
    case 'radio-outline':
    case 'target':
      return <SvgTarget size={size} color={color} {...props} />;
    case 'volume-high':
    case 'sound':
      return <SvgSound size={size} color={color} muted={false} {...props} />;
    case 'volume-mute':
    case 'sound-off':
      return <SvgSound size={size} color={color} muted={true} {...props} />;
    case 'hardware-chip':
    case 'haptic':
      return <SvgHaptic size={size} color={color} enabled={true} {...props} />;
    case 'close':
      return <SvgClose size={size} color={color} {...props} />;
    case 'flame':
      return <SvgFlame size={size} color={color} {...props} />;
    case 'heart':
    case 'hearts':
      return <SvgHeart size={size} color={color} {...props} />;
    case 'trophy':
    case 'navigate-circle':
      return <SvgTrophy size={size} color={color} {...props} />;
    case 'gift':
    case 'present':
    case 'crate':
      return <SvgGift size={size} color={color} {...props} />;
    case 'crown':
    case 'rank':
      return <SvgCrown size={size} color={color} {...props} />;
    case 'checkmark':
      return <SvgCheck size={size} color={color} {...props} />;
    case 'trash':
    case 'trash-outline':
      return <SvgTrash size={size} color={color} {...props} />;
    case 'hand-left':
      return <SvgHand size={size} color={color} {...props} />;
    case 'help':
    case 'help-circle':
    case 'help-outline':
    case 'help-sharp':
    case 'question':
      return <SvgHelp size={size} color={color} {...props} />;
    case 'rotate':
    case 'pivot':
      return <SvgRotate size={size} color={color} {...props} />;
    case 'bolt':
    case 'blitz':
      return <SvgFlash size={size} color={color} {...props} />;
    case 'settings':
    case 'settings-sharp':
    case 'settings-outline':
    case 'gear':
    case 'cog':
      return <SvgSettings size={size} color={color} {...props} />;
    case 'moon':
      return <SvgTheme size={size} color={color} darkMode={true} {...props} />;
    case 'sunny':
      return <SvgTheme size={size} color={color} darkMode={false} {...props} />;
    case 'arrow-up':
      return <SvgArrowGraphic size={size} dir="UP" state="normal" {...props} />;
    case 'arrow-down':
      return <SvgArrowGraphic size={size} dir="DOWN" state="normal" {...props} />;
    case 'arrow-forward':
      return <SvgArrowGraphic size={size} dir="RIGHT" state="normal" {...props} />;
    default:
      return null;
  }
}
