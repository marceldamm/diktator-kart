import type { KartState } from './kart-model.ts';

/**
 * Special abilities (Q). First restored ability: Sarah's archived 'Größenbefehl' parade tank
 * (archive e292070, client/src/game/abilities.ts and bots.ts:runOver). Durations are the archived
 * provisional values; distances and impulses are retuned for the Babylon world, not copied.
 */
export const ABILITY_RULES = {
  tankDuration: 8,
  /** Counted from activation, as in the archive. */
  cooldown: 18,
  /** Centre distance (m) at which the tank shoves a kart aside (tank half width ~1.6 m + kart ~1.2 m). */
  crushRadius: 3,
  /** Per target, so one tank cannot pin the same kart. */
  repeatProtection: 1.1,
  slowDuration: 2.4,
  push: 6.5,
  speedFactor: .55,
} as const;

export const ABILITY_NAME = 'Größenbefehl';

export interface AbilityEvent { kind: 'transform' | 'revert' | 'crush'; kart: number; target?: number }
export interface AbilityWorld { cooldown: number[]; active: boolean[]; repeat: number[][]; events: AbilityEvent[] }

export function createAbilities(count: number): AbilityWorld {
  return { cooldown: Array(count).fill(0), active: Array(count).fill(false), repeat: Array.from({ length: count }, () => Array(count).fill(0)), events: [] };
}

export const abilityReady = (world: AbilityWorld, kart: number, state: KartState) => world.cooldown[kart] <= 0 && (state.tankRemaining ?? 0) <= 0;

/**
 * Activation, expiry and tank contacts for all karts. `immune` is the shared item protection:
 * a protected kart is neither pushed nor slowed, exactly like item hits.
 */
export function stepAbilities(world: AbilityWorld, karts: KartState[], activations: boolean[], immune: number[], dt: number): KartState[] {
  world.events = [];
  const result = karts.map((k) => ({ ...k }));
  world.cooldown = world.cooldown.map((c) => Math.max(0, c - dt));
  world.repeat = world.repeat.map((row) => row.map((r) => Math.max(0, r - dt)));
  result.forEach((k, i) => {
    if (activations[i] && abilityReady(world, i, k)) {
      k.tankRemaining = ABILITY_RULES.tankDuration; world.cooldown[i] = ABILITY_RULES.cooldown;
      world.active[i] = true; world.events.push({ kind: 'transform', kart: i });
    } else if (world.active[i] && (k.tankRemaining ?? 0) <= 0) {
      world.active[i] = false; world.events.push({ kind: 'revert', kart: i });
    }
  });
  result.forEach((tank, i) => {
    if ((tank.tankRemaining ?? 0) <= 0) return;
    result.forEach((other, j) => {
      if (j === i || (other.tankRemaining ?? 0) > 0 || immune[j] > 0 || world.repeat[i][j] > 0) return;
      let dx = other.x - tank.x, dz = other.z - tank.z; const d = Math.hypot(dx, dz);
      if (d >= ABILITY_RULES.crushRadius) return;
      if (d < 1e-3) { dx = Math.sin(tank.heading); dz = Math.cos(tank.heading); } else { dx /= d; dz /= d; }
      Object.assign(other, {
        speed: other.speed * ABILITY_RULES.speedFactor, impactVelocityX: dx * ABILITY_RULES.push, impactVelocityZ: dz * ABILITY_RULES.push,
        impactRemaining: .3, impactKind: 'kart', slowRemaining: ABILITY_RULES.slowDuration, drifting: false, driftCharge: 0, driftDirection: 0, turboRemaining: 0,
      });
      world.repeat[i][j] = ABILITY_RULES.repeatProtection; world.events.push({ kind: 'crush', kart: i, target: j });
    });
  });
  return result;
}
