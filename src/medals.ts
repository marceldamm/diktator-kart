import type { KartState } from './kart-model.ts';
import { BOOST_PADS, HAZARDS, ITEM_BOX_PROGRESS, RAMP_LIPS, SHORTCUT } from './track-layout.ts';
import { TRACK, trackPoint } from './track.ts';

/**
 * Orden ("medals", 07.10.2026): the vanity version of kart-racer coins. Shiny decorations line the circuit;
 * every kart – player and bots alike – pins them on, up to ten. Each medal lifts the kart's own top speed
 * a little, an item hit makes three fall off. Same rule for everyone, visible on the HUD and the track.
 */
export const MEDAL_RULES = { max: 10, radius: 1.35, respawn: 9, topSpeedPerMedal: .13, lossOnHit: 3, lossOnFall: 3, lossOnWreck: 5, spacing: 72 } as const;

export interface Medal { x: number; z: number; s: number; lane: number; readyIn: number }
export interface MedalWorld { medals: Medal[]; counts: number[]; events: { kind: 'pickup' | 'lost'; kart: number; amount: number }[] }

/** Rows of three medals every ~72 m, kept clear of item boxes, ramps, boost pads, open hazards and the start. */
export function createMedals(kartCount: number): MedalWorld {
  const medals: Medal[] = [];
  const blocked = (s: number) => ITEM_BOX_PROGRESS.some((b) => Math.abs(b - s) < 14) || RAMP_LIPS.some((r) => s > r - 16 && s < r + 22)
    || BOOST_PADS.some(([from]) => s > from - 6 && s < from + 10) || HAZARDS.some((h) => s > h.from - 4 && s < h.to + 4)
    || Math.abs(s - TRACK.start) < 30 || (s > SHORTCUT.from - 6 && s < SHORTCUT.from + 6);
  let row = 0;
  for (let s = TRACK.start + 40; s < TRACK.start + TRACK.length - 20; s += MEDAL_RULES.spacing) {
    const at = s % TRACK.length; if (blocked(at)) continue;
    const lanes = row++ % 2 ? [-2.6, 0, 2.6] : [-1.3, 1.3, 3.9];
    lanes.forEach((lane, k) => { const ss = at + k * 2.2, p = trackPoint(ss, lane); medals.push({ x: p.x, z: p.z, s: ss, lane, readyIn: 0 }); });
  }
  return { medals, counts: Array(kartCount).fill(0), events: [] };
}

/** Pickups, respawns and each kart's medal top-speed bonus (read by advanceKart's normal speed cap). */
export function stepMedals(world: MedalWorld, karts: KartState[], dt: number): KartState[] {
  world.events = [];
  for (const m of world.medals) m.readyIn = Math.max(0, m.readyIn - dt);
  return karts.map((k, i) => {
    for (const m of world.medals) {
      if (m.readyIn > 0 || Math.hypot(m.x - k.x, m.z - k.z) > MEDAL_RULES.radius || (k.height ?? 0) > 1.2) continue;
      m.readyIn = MEDAL_RULES.respawn;
      if (world.counts[i] < MEDAL_RULES.max) { world.counts[i]++; world.events.push({ kind: 'pickup', kart: i, amount: 1 }); }
    }
    const bonus = world.counts[i] * MEDAL_RULES.topSpeedPerMedal;
    return (k.topSpeedBonus ?? 0) === bonus ? k : { ...k, topSpeedBonus: bonus };
  });
}

/** An item hit (default), a fall into water/pits or a wreck knocks medals off. */
export function loseMedals(world: MedalWorld, kart: number, amount: number = MEDAL_RULES.lossOnHit): void {
  const lost = Math.min(world.counts[kart], amount);
  if (lost > 0) { world.counts[kart] -= lost; world.events.push({ kind: 'lost', kart, amount: lost }); }
}
