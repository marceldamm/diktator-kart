import { KART_TUNING, type KartState } from './kart-model.ts';
import type { DriverAbility } from './cast.ts';

/**
 * Special abilities (Q): each driver has one profile ability. Home-track bonuses are deliberately modest
 * and shared across durations/strength so the same ability remains readable away from its home circuit.
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
  homeDurationMultiplier: 1.25,
  homeStrengthMultiplier: 1.15,
  stalinPlanDuration: 1.0,
  stalinPlanThrottle: .3,
  stalinBoostDuration: 1.1,
  stalinSpeedKick: 1.6,
  maoBoostDuration: .65,
  maoBoostPerNearbyKart: .15,
  maoSpeedKick: 1.2,
  maoKickPerNearbyKart: .35,
  maoNearbyRadius: 16,
  maoNearbyKartCap: 4,
} as const;

export const ABILITY_NAME = 'Größenbefehl';
export type AbilityOwner = DriverAbility | 'none';

export interface AbilityEvent { kind: 'transform' | 'revert' | 'crush' | 'kim-surge' | 'kim-audit' | 'pose' | 'pose-applause' | 'blockade' | 'stalin-plan' | 'stalin-approved' | 'mao-surge'; kart: number; target?: number; nearby?: number }
export interface AbilityWorld { poseRemaining: number[]; cooldown: number[]; active: boolean[]; repeat: number[][]; kimPolishRemaining: number[]; kimBoostRemaining: number[]; kimPenaltyRemaining: number[]; stalinPlanRemaining: number[]; stalinBoostRemaining: number[]; maoBoostRemaining: number[]; events: AbilityEvent[] }

const duration = (value: number, homeTrack: boolean) => value * (homeTrack ? ABILITY_RULES.homeDurationMultiplier : 1);
const strength = (value: number, homeTrack: boolean) => value * (homeTrack ? ABILITY_RULES.homeStrengthMultiplier : 1);

export function createAbilities(count: number): AbilityWorld {
  return { poseRemaining: Array(count).fill(0), cooldown: Array(count).fill(0), active: Array(count).fill(false), repeat: Array.from({ length: count }, () => Array(count).fill(0)), kimPolishRemaining: Array(count).fill(0), kimBoostRemaining: Array(count).fill(0), kimPenaltyRemaining: Array(count).fill(0), stalinPlanRemaining: Array(count).fill(0), stalinBoostRemaining: Array(count).fill(0), maoBoostRemaining: Array(count).fill(0), events: [] };
}

/** Bot use: the tank's owner transforms when it is ready and a rival is close enough to be shoved; a blockade needs a rival right behind. */
export function botWantsAbility(world: AbilityWorld, kart: number, karts: KartState[], owner: AbilityOwner = 'tank'): boolean {
  const self = karts[kart];
  if (owner === 'blockade') return abilityReady(world, kart, self) && karts.some((other, j) => {
    if (j === kart) return false; const dx = other.x - self.x, dz = other.z - self.z, ahead = dx * Math.sin(self.heading) + dz * Math.cos(self.heading);
    return ahead < -3 && ahead > -16 && Math.hypot(dx, dz) < 17;
  });
  return abilityReady(world, kart, self) && karts.some((other, j) => j !== kart && Math.hypot(other.x - self.x, other.z - self.z) < 9);
}

export const abilityReady = (world: AbilityWorld, kart: number, state: KartState) => world.cooldown[kart] <= 0 && (state.tankRemaining ?? 0) <= 0 && world.kimPolishRemaining[kart] <= 0 && (world.poseRemaining?.[kart] ?? 0) <= 0 && world.stalinPlanRemaining[kart] <= 0 && world.stalinBoostRemaining[kart] <= 0 && world.maoBoostRemaining[kart] <= 0;

/**
 * Activation, expiry and tank contacts for all karts. `immune` is the shared item protection:
 * a protected kart is neither pushed nor slowed, exactly like item hits.
 */
export function stepAbilities(world: AbilityWorld, karts: KartState[], activations: boolean[], immune: number[], dt: number, owners: AbilityOwner[] = [], homeTracks: boolean[] = []): KartState[] {
  world.events = [];
  const result = karts.map((k) => ({ ...k }));
  world.poseRemaining ??= Array(karts.length).fill(0);
  world.stalinPlanRemaining ??= Array(karts.length).fill(0);
  world.stalinBoostRemaining ??= Array(karts.length).fill(0);
  world.maoBoostRemaining ??= Array(karts.length).fill(0);
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
  world.stalinBoostRemaining = world.stalinBoostRemaining.map((remaining) => Math.max(0, remaining - dt));
  world.maoBoostRemaining = world.maoBoostRemaining.map((remaining) => Math.max(0, remaining - dt));
  world.stalinPlanRemaining = world.stalinPlanRemaining.map((remaining, i) => {
    const next = Math.max(0, remaining - dt);
    if (remaining > 0 && next === 0) {
      const homeTrack = homeTracks[i] ?? false;
      const boostDuration = duration(ABILITY_RULES.stalinBoostDuration, homeTrack);
      world.stalinBoostRemaining[i] = boostDuration;
      result[i].turboRemaining = Math.max(result[i].turboRemaining, boostDuration);
      result[i].speed = Math.min(KART_TUNING.maxTurboSpeed, result[i].speed + strength(ABILITY_RULES.stalinSpeedKick, homeTrack));
      world.events.push({ kind: 'stalin-approved', kart: i });
    }
    return next;
  });
  world.poseRemaining = world.poseRemaining.map((remaining, i) => {
    const next = Math.max(0, remaining - dt);
    if (remaining > 0 && next === 0) {  // the pose ends: the obligatory applause pushes the kart on
      const k = result[i];
      const homeTrack = homeTracks[i] ?? false;
      k.turboRemaining = Math.max(k.turboRemaining, duration(ABILITY_RULES.poseBoost, homeTrack));
      k.speed = Math.min(KART_TUNING.maxTurboSpeed, Math.max(0, k.speed) + strength(ABILITY_RULES.poseSpeedKick, homeTrack));
      immune[i] = Math.max(immune[i] ?? 0, duration(ABILITY_RULES.poseImmunity, homeTrack));
      world.events.push({ kind: 'pose-applause', kart: i });
    }
    return next;
  });
  result.forEach((k, i) => {
    if (activations[i] && abilityReady(world, i, k)) {
      const owner = owners[i] ?? 'tank';
      const homeTrack = homeTracks[i] ?? false;
      if (owner === 'blockade') {  // the caller drops two paragraph barriers behind the kart (same trap rules as the item)
        world.cooldown[i] = ABILITY_RULES.cooldown; world.events.push({ kind: 'blockade', kart: i });
      } else if (owner === 'pose') {
        world.poseRemaining[i] = duration(ABILITY_RULES.poseDuration, homeTrack); world.cooldown[i] = ABILITY_RULES.cooldown;
        world.events.push({ kind: 'pose', kart: i });
      } else if (owner === 'kim') {
        world.kimPolishRemaining[i] = duration(ABILITY_RULES.kimPolishDuration, homeTrack);
        world.kimBoostRemaining[i] = duration(ABILITY_RULES.kimBoostDuration, homeTrack);
        k.turboRemaining = Math.max(k.turboRemaining, duration(ABILITY_RULES.kimBoostDuration, homeTrack));
        k.speed = Math.min(KART_TUNING.maxTurboSpeed, k.speed + strength(ABILITY_RULES.kimSpeedKick, homeTrack));
        world.cooldown[i] = ABILITY_RULES.cooldown;
        world.events.push({ kind: 'kim-surge', kart: i });
      } else if (owner === 'stalin') {
        world.stalinPlanRemaining[i] = ABILITY_RULES.stalinPlanDuration;
        world.cooldown[i] = ABILITY_RULES.cooldown;
        world.events.push({ kind: 'stalin-plan', kart: i });
      } else if (owner === 'mao') {
        const nearby = karts.filter((other, j) => j !== i && Math.hypot(other.x - k.x, other.z - k.z) <= ABILITY_RULES.maoNearbyRadius).length;
        const pack = Math.min(nearby, ABILITY_RULES.maoNearbyKartCap);
        const boostDuration = duration(ABILITY_RULES.maoBoostDuration + pack * ABILITY_RULES.maoBoostPerNearbyKart, homeTrack);
        world.maoBoostRemaining[i] = boostDuration;
        k.turboRemaining = Math.max(k.turboRemaining, boostDuration);
        k.speed = Math.min(KART_TUNING.maxTurboSpeed, k.speed + strength(ABILITY_RULES.maoSpeedKick + pack * ABILITY_RULES.maoKickPerNearbyKart, homeTrack));
        world.cooldown[i] = ABILITY_RULES.cooldown;
        world.events.push({ kind: 'mao-surge', kart: i, nearby: pack });
      } else if (owner === 'tank') {
        k.tankRemaining = duration(ABILITY_RULES.tankDuration, homeTrack); world.cooldown[i] = ABILITY_RULES.cooldown;
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
      const homeTrack = homeTracks[i] ?? false;
      if (d >= strength(ABILITY_RULES.crushRadius, homeTrack)) return;
      if (d < 1e-3) { dx = Math.sin(tank.heading); dz = Math.cos(tank.heading); } else { dx /= d; dz /= d; }
      Object.assign(other, {
        speed: other.speed * Math.max(.35, 1 - (1 - ABILITY_RULES.speedFactor) * (homeTrack ? ABILITY_RULES.homeStrengthMultiplier : 1)), impactVelocityX: dx * strength(ABILITY_RULES.push, homeTrack), impactVelocityZ: dz * strength(ABILITY_RULES.push, homeTrack),
        impactRemaining: .3, impactKind: 'kart', slowRemaining: strength(ABILITY_RULES.slowDuration, homeTrack), drifting: false, driftCharge: 0, driftDirection: 0, turboRemaining: 0,
      });
      world.repeat[i][j] = ABILITY_RULES.repeatProtection; world.events.push({ kind: 'crush', kart: i, target: j });
    });
  });
  return result;
}
