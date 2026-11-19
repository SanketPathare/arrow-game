import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Rect, G } from 'react-native-svg';
import { SvgShockwaveRing } from '../components/SvgIcons.js';

// Pre-allocated Particle Pool for optimal garbage collection performance
const MAX_PARTICLES = 60;
const MAX_SHOCKWAVES = 8;

export class EffectsManager {
  constructor() {
    this.particles = [];
    this.shockwaves = [];

    // Pre-allocate pool
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.particles.push({
        id: i,
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 4,
        color: '#00F2FE',
        alpha: 1,
        decay: 0.04,
        type: 'circle', // 'circle' | 'spark' | 'star'
        rotation: 0,
        vRot: 0,
      });
    }

    for (let i = 0; i < MAX_SHOCKWAVES; i++) {
      this.shockwaves.push({
        id: i,
        active: false,
        x: 0,
        y: 0,
        size: 50,
        progress: 0,
        speed: 0.05,
        color: '#FF0844',
      });
    }
  }

  // Spawn exhaust trail sparks for flying arrow
  spawnFlightSparks(x, y, dir) {
    const oppMap = {
      UP: { dx: 0, dy: 1 },
      DOWN: { dx: 0, dy: -1 },
      LEFT: { dx: 1, dy: 0 },
      RIGHT: { dx: -1, dy: 0 },
    };
    const opp = oppMap[dir] || { dx: 0, dy: 1 };
    const count = 3;

    for (let i = 0; i < count; i++) {
      const p = this.getAvailableParticle();
      if (!p) break;

      const spread = (Math.random() - 0.5) * 12;
      const speed = 2 + Math.random() * 4;

      p.active = true;
      p.x = x + (opp.dx === 0 ? spread : 0);
      p.y = y + (opp.dy === 0 ? spread : 0);
      p.vx = opp.dx * speed + (opp.dx === 0 ? (Math.random() - 0.5) * 2 : 0);
      p.vy = opp.dy * speed + (opp.dy === 0 ? (Math.random() - 0.5) * 2 : 0);
      p.size = 3 + Math.random() * 4;
      p.color = Math.random() > 0.4 ? '#00F2FE' : '#FFD13B';
      p.alpha = 1;
      p.decay = 0.045 + Math.random() * 0.03;
      p.type = 'circle';
    }
  }

  // Spawn collision sparks and expanding shockwave ring
  spawnCollisionImpact(x, y, isBlocked = true) {
    // 1. Shockwave ring
    const sw = this.getAvailableShockwave();
    if (sw) {
      sw.active = true;
      sw.x = x;
      sw.y = y;
      sw.size = 54;
      sw.progress = 0;
      sw.speed = 0.065;
      sw.color = isBlocked ? '#FF0844' : '#FFA000';
    }

    // 2. High-energy spark scatter
    const count = 10;
    const colors = isBlocked
      ? ['#FF0844', '#FF4E50', '#FFE066', '#FFFFFF']
      : ['#FFA000', '#FFD13B', '#FF6B00'];

    for (let i = 0; i < count; i++) {
      const p = this.getAvailableParticle();
      if (!p) break;

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2.5 + Math.random() * 5;

      p.active = true;
      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.size = 3 + Math.random() * 3.5;
      p.color = colors[Math.floor(Math.random() * colors.length)];
      p.alpha = 1;
      p.decay = 0.04 + Math.random() * 0.035;
      p.type = 'spark';
      p.rotation = Math.random() * 360;
      p.vRot = (Math.random() - 0.5) * 15;
    }
  }

  // Spawn victory confetti bursts across board
  spawnVictoryBurst(width, height) {
    const count = 25;
    const colors = ['#00F2FE', '#FFD13B', '#06D6A0', '#FF2A6D', '#7928CA', '#FFFFFF'];

    for (let i = 0; i < count; i++) {
      const p = this.getAvailableParticle();
      if (!p) break;

      p.active = true;
      p.x = width * 0.5 + (Math.random() - 0.5) * 60;
      p.y = height * 0.5 + (Math.random() - 0.5) * 60;
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 2; // slight upward pop
      p.size = 4 + Math.random() * 5;
      p.color = colors[Math.floor(Math.random() * colors.length)];
      p.alpha = 1;
      p.decay = 0.02 + Math.random() * 0.015;
      p.type = Math.random() > 0.5 ? 'spark' : 'circle';
      p.rotation = Math.random() * 360;
      p.vRot = (Math.random() - 0.5) * 20;
    }
  }

  // Update loop for 60fps game systems
  update(dtMs = 16.6) {
    const dt = Math.min(2, dtMs / 16.6); // normalize delta time around 1.0

    // Update Particles
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.94; // air resistance drag
      p.vy *= 0.94;
      p.rotation += p.vRot * dt;
      p.alpha -= p.decay * dt;

      if (p.alpha <= 0) {
        p.active = false;
      }
    }

    // Update Shockwaves
    for (let i = 0; i < MAX_SHOCKWAVES; i++) {
      const sw = this.shockwaves[i];
      if (!sw.active) continue;

      sw.progress += sw.speed * dt;
      if (sw.progress >= 1) {
        sw.active = false;
      }
    }
  }

  getAvailableParticle() {
    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (!this.particles[i].active) return this.particles[i];
    }
    return null;
  }

  getAvailableShockwave() {
    for (let i = 0; i < MAX_SHOCKWAVES; i++) {
      if (!this.shockwaves[i].active) return this.shockwaves[i];
    }
    return null;
  }

  hasActiveEffects() {
    return (
      this.particles.some((p) => p.active) ||
      this.shockwaves.some((sw) => sw.active)
    );
  }

  clear() {
    this.particles.forEach((p) => (p.active = false));
    this.shockwaves.forEach((sw) => (sw.active = false));
  }
}

/**
 * High-performance 2D SVG overlay that renders all active particles and shockwaves in a single batch.
 */
export function EffectsOverlayRenderer({ effects, width, height }) {
  if (!effects) return null;
  const { particles = [], shockwaves = [] } = effects;

  const activeParticles = particles.filter((p) => p.active);
  const activeShockwaves = shockwaves.filter((sw) => sw.active);

  if (activeParticles.length === 0 && activeShockwaves.length === 0) {
    return null;
  }

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {/* Shockwaves */}
      {activeShockwaves.map((sw) => (
        <G key={`sw_${sw.id}`} x={sw.x - sw.size / 2} y={sw.y - sw.size / 2}>
          <SvgShockwaveRing
            size={sw.size}
            color={sw.color}
            progress={sw.progress}
          />
        </G>
      ))}

      {/* Vector Particles */}
      {activeParticles.map((p) => {
        if (p.type === 'circle') {
          return (
            <Circle
              key={`p_${p.id}`}
              cx={p.x}
              cy={p.y}
              r={p.size}
              fill={p.color}
              opacity={p.alpha}
            />
          );
        }

        // Diamond / Spark polygon
        const half = p.size;
        return (
          <G
            key={`p_${p.id}`}
            transform={`translate(${p.x}, ${p.y}) rotate(${p.rotation})`}
          >
            <Rect
              x={-half / 2}
              y={-half / 2}
              width={half}
              height={half}
              fill={p.color}
              opacity={p.alpha}
              rx={1}
            />
          </G>
        );
      })}
    </Svg>
  );
}
