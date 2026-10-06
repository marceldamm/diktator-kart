import { KART_TUNING, type KartState } from './kart-model.ts';

/**
 * Special abilities (Q): Sarah's archived 'Größenbefehl' parade tank and Kim's 'Propaganda-Sieg'.
 * Archive timings are provisional; distances and impulses are retuned for the Babylon world.
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
  kimPolishDuration: 10,
  kimBoostDuration: .9,
  kimSpeedKick: 1.8,
  kimPenaltyDuration: .7,
  /** Mussolini's 'Große Pose': 1.3 s of chin-up posing at reduced throttle, then an applause push and item protection. */
  poseDuration: 1.3,
  poseThrottle: .45,
  poseBoost: 1.0,
  poseSpeedKick: 1.6,
  poseImmunity: 2.2,
} as const;

export const ABILITY_NAME = 'Größenbefehl';
export type AbilityOwner = 'tank' | 'kim' | 'pose' | 'none';

export interface AbilityEvent { kind: 'transform' | 'revert' | 'crush' | 'kim-surge' | 'kim-audit' | 'pose' | 'pose-applause'; kart: number; target?: number }
export interface AbilityWorld { /** Mussolini's pose seconds left (reduced throttle, see main.ts). */ poseRemaining: number[]; cooldown: number[]; active: boolean[]; repeat: number[][]; kimPolishRemaining: number[]; kimBoostRemaining: number[]; kimPenaltyRemaining: number[]; events: AbilityEvent[] }

export function createAbilities(count: number): AbilityWorld {
  return { poseRemaining: Array(count).fill(0), cooldown: Array(count).fill(0), active: Array(count).fill(false), repeat: Array.from({ length: count }, () => Array(count).fill(0)), kimPolishRemaining: Array(count).fill(0), kimBoostRemaining: Array(count).fill(0), kimPenaltyRemaining: Array(count).fill(0), events: [] };
}

/** Bot use: the tank's owner transforms when it is ready and a rival is close enough to be shoved. */
export function botWantsAbility(world: AbilityWorld, kart: number, karts: KartState[]): boolean {
  const self = karts[kart];
  return abilityReady(world, kart, self) && karts.some((other, j) => j !== kart && Math.hypot(other.x - self.x, other.z - self.z) < 9);
}

export const abilityReady = (world: AbilityWorld, kart: number, state: KartState) => world.cooldown[kart] <= 0 && (state.tankRemaining ?? 0) <= 0 && world.kimPolishRemaining[kart] <= 0 && (world.poseRemaining?.[kart] ?? 0) <= 0;

/**
 * Activation, expiry and tank contacts for all karts. `immune` is the shared item protection:
 * a protected kart is neither pushed nor slowed, exactly like item hits.
 */
export function stepAbilities(world: AbilityWorld, karts: KartState[], activations: boolean[], immune: number[], dt: number, owners: AbilityOwner[] = []): KartState[] {
  world.events = [];
  const result = karts.map((k) => ({ ...k }));
  world.cooldown = world.cooldown.map((c) => Math.max(0, c - dt));
  world.repeat = world.repeat.map((row) => row.map((r) => Math.max(0, r - dt)));
  world.kimPolishRemaining = world.kimPolishRemaining.map((remaining) => Math.max(0, remaining - dt));
  world.kimPenaltyRemaining = world.kimPenaltyRemaining.map((remaining) => Math.max(0, remaining - dt));
  world.kimBoostRemaining = world.kimBoostRemaining.map((remaining, i) => {
    const next = Math.max(0, remaining - dt);
    if (remaining > 0 && next === 0) {
      world.kimPenaltyRemaining[i] = ABILITY_RULES.kimPenaltyDuration;
      world.events.push({ kind: 'kim-audit', kart: i });
    }
    return next;
  });
  world.poseRemaining ??= Array(karts.length).fill(0);
  world.poseRemaining = world.poseRemaining.map((remaining, i) => {
    const next = Math.max(0, remaining - dt);
    if (remaining > 0 && next === 0) {  // the pose ends: the obligatory applause pushes the kart on
      const k = result[i];
      k.turboRemaining = Math.max(k.turboRemaining, ABILITY_RULES.poseBoost);
      k.speed = Math.min(KART_TUNING.maxTurboSpeed, Math.max(0, k.speed) + ABILITY_RULES.poseSpeedKick);
      immune[i] = Math.max(immune[i] ?? 0, ABILITY_RULES.poseImmunity);
      world.events.push({ kind: 'pose-applause', kart: i });
    }
    return next;
  });
  result.forEach((k, i) => {
    if (activations[i] && abilityReady(world, i, k)) {
      const owner = owners[i] ?? 'tank';
      if (owner === 'pose') {
        world.poseRemaining[i] = ABILITY_RULES.poseDuration; world.cooldown[i] = ABILITY_RULES.cooldown;
        world.events.push({ kind: 'pose', kart: i });
      } else if (owner === 'kim') {
        world.kimPolishRemaining[i] = ABILITY_RULES.kimPolishDuration;
        world.kimBoostRemaining[i] = ABILITY_RULES.kimBoostDuration;
        k.turboRemaining = Math.max(k.turboRemaining, ABILITY_RULES.kimBoostDuration);
        k.speed = Math.min(KART_TUNING.maxTurboSpeed, k.speed + ABILITY_RULES.kimSpeedKick);
        world.cooldown[i] = ABILITY_RULES.cooldown;
        world.events.push({ kind: 'kim-surge', kart: i });
      } else if (owner === 'tank') {
        k.tankRemaining = ABILITY_RULES.tankDuration; world.cooldown[i] = ABILITY_RULES.cooldown;
        world.active[i] = true; world.events.push({ kind: 'transform', kart: i });
      }
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
