import type { TrackId } from './track-layout';

/**
 * "Großer Preis der Eitelkeit": a lean championship over every playable circuit (07.10.2026).
 * Points come only from the race system's own finishing order (rankRace at the player's finish);
 * the satirical announcements may comment on it but never change it.
 */
export const GP_TRACKS: readonly TrackId[] = ['stadionring', 'duce-drom', 'havanna', 'pyongyang', 'moscow', 'beijing'];
/** Points for places 1–6. */
export const GP_POINTS = [10, 7, 5, 3, 2, 1] as const;

export interface GrandPrixResult { track: TrackId; /** Roster (CAST) indices in finishing order. */ order: number[]; points: number[]; time: number }
export interface GrandPrix { tracks: TrackId[]; round: number; results: GrandPrixResult[]; /** Counts this cup once in the Ehrenregister. */ id: string }

export function createGrandPrix(tracks: readonly TrackId[] = GP_TRACKS): GrandPrix {
  return { tracks: [...tracks], round: 0, results: [], id: `gp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}` };
}

/** Records the finish of the current round once; a repeated call for the same round is ignored. */
export function awardPoints(gp: GrandPrix, track: TrackId, order: number[], time: number): boolean {
  if (gp.results.length !== gp.round || gp.tracks[gp.round] !== track) return false;
  const points = Array(Math.max(6, ...order.map((d) => d + 1))).fill(0);
  order.forEach((driver, place) => { points[driver] = GP_POINTS[place] ?? 0; });
  gp.results.push({ track, order: [...order], points, time });
  return true;
}

export interface Standing { driver: number; points: number; wins: number; best: number; last: number }

/** Totals; ties break on more wins, then the better best finish, then the better place in the latest race. */
export function standings(gp: GrandPrix): Standing[] {
  const drivers = new Set(gp.results.flatMap((r) => r.order));
  const rows = [...drivers].map((driver) => {
    const places = gp.results.map((r) => r.order.indexOf(driver)).filter((p) => p >= 0);
    return {
      driver, points: gp.results.reduce((sum, r) => sum + (r.points[driver] ?? 0), 0),
      wins: places.filter((p) => p === 0).length, best: Math.min(...places), last: gp.results.at(-1)?.order.indexOf(driver) ?? 99,
    };
  });
  return rows.sort((a, b) => b.points - a.points || b.wins - a.wins || a.best - b.best || a.last - b.last || a.driver - b.driver);
}
