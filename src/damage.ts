import type { KartState } from './kart-model';

/**
 * Cumulative kart damage (Marcel, 04.10.2026): hard wall hits, kart crashes and item hits wear a kart down;
 * at zero the kart is wrecked in a comic explosion, the driver is thrown out and the 'Staatliche Werkstatt'
 * puts it back after a short repair. Same rules for player and bots. Values are provisional until a drive test.
 */
export const DAMAGE_RULES = {
  /** Damage per m/s of speed lost in a fresh hard impact. */
  impactFactor: 2.6,
  /** Glancing wall scrapes wear much less. */
  scrapeFactor: .9,
  itemHit: 14,
  /** One hit can never wreck a healthy kart: at least three heavy hits are needed. */
  maxPerHit: 35,
  /** Ignore tiny bumps. */
  minimumLoss: 2.5,
  wreckDuration: 3,
  /** Damage immunity after a repair, against hit chains. */
  repairProtection: 4,
} as const;

export interface DamageEvent { kind: 'damage' | 'wreck' | 'repaired'; kart: number; amount?: number }
export interface DamageWorld { health: number[]; wrecked: number[]; protected: number[]; events: DamageEvent[] }

export function createDamage(count: number): DamageWorld {
  return { health: Array(count).fill(100), wrecked: Array(count).fill(0), protected: Array(count).fill(0), events: [] };
}

/** Damage from one simulation step, comparing each kart before and after contacts/items. */
export function stepDamage(world: DamageWorld, before: KartState[], after: KartState[], dt: number): void {
  world.events = [];
  after.forEach((now, i) => {
    const was = before[i]; if (!was) return;
    if (world.wrecked[i] > 0) {
      world.wrecked[i] = Math.max(0, world.wrecked[i] - dt);
      if (world.wrecked[i] === 0) { world.health[i] = 100; world.protected[i] = DAMAGE_RULES.repairProtection; world.events.push({ kind: 'repaired', kart: i }); }
      return;
    }
    world.protected[i] = Math.max(0, world.protected[i] - dt);
    if (world.protected[i] > 0) return;
    const loss = Math.max(0, Math.abs(was.speed) - Math.abs(now.speed));
    const freshImpact = now.impactRemaining > (was.impactRemaining ?? 0) + 1e-6 && now.impactKind !== 'item';
    const freshScrape = (now.scrapeRemaining ?? 0) > (was.scrapeRemaining ?? 0) + 1e-6 && now.scrapeKind === 'wall';
    // Normal item hits spin the kart; the transformed tank instead receives a
    // short, non-spinning impact. Count either fresh state transition once.
    const freshItem = (now.spinRemaining ?? 0) > (was.spinRemaining ?? 0) + 1e-6
      || (now.impactKind === 'item' && now.impactRemaining > (was.impactRemaining ?? 0) + 1e-6);
    let amount = 0;
    if (freshImpact && loss >= DAMAGE_RULES.minimumLoss) amount += loss * DAMAGE_RULES.impactFactor;
    else if (freshScrape && loss >= DAMAGE_RULES.minimumLoss) amount += loss * DAMAGE_RULES.scrapeFactor;
    if (freshItem) amount += DAMAGE_RULES.itemHit;
    if (amount <= 0) return;
    amount = Math.min(DAMAGE_RULES.maxPerHit, amount);
    world.health[i] = Math.max(0, world.health[i] - amount);
    world.events.push({ kind: 'damage', kart: i, amount });
    if (world.health[i] === 0) { world.wrecked[i] = DAMAGE_RULES.wreckDuration; world.events.push({ kind: 'wreck', kart: i }); }
  });
}
