/**
 * Ehrenregister (Paket 5, erste Stufe, 10.10.2026): dauerhaft gespeicherter Grand-Prix-Fortschritt je Fahrer.
 * Every finished Grand Prix is recorded once under its id; a podium earns a gold, silver or bronze trophy.
 * Nothing is locked: all drivers and circuits stay free, the register only remembers what was won.
 */
export interface DriverRecord { cups: number; gold: number; silver: number; bronze: number; best: number }
export interface CupProgress { version: 1; drivers: Record<number, DriverRecord>; recorded: string[] }

const KEY = 'dk-cup-progress';
const RECORDED_LIMIT = 50;

export function emptyProgress(): CupProgress { return { version: 1, drivers: {}, recorded: [] }; }

/** Unreadable, missing or foreign data falls back to an empty register instead of breaking the menu. */
export function parseProgress(text: string | null): CupProgress {
  try {
    const data = JSON.parse(text ?? 'null') as Partial<CupProgress> | null;
    if (!data || data.version !== 1 || typeof data.drivers !== 'object' || !Array.isArray(data.recorded)) return emptyProgress();
    const drivers: Record<number, DriverRecord> = {};
    for (const [key, value] of Object.entries(data.drivers ?? {})) {
      const id = Number(key), v = value as Partial<DriverRecord>;
      if (!Number.isInteger(id) || id < 0) continue;
      const count = (n: unknown) => (Number.isInteger(n) && (n as number) >= 0 ? n as number : 0);
      drivers[id] = { cups: count(v.cups), gold: count(v.gold), silver: count(v.silver), bronze: count(v.bronze), best: Number.isInteger(v.best) && (v.best as number) >= 1 ? v.best as number : 0 };
    }
    return { version: 1, drivers, recorded: data.recorded.filter((id): id is string => typeof id === 'string').slice(-RECORDED_LIMIT) };
  } catch { return emptyProgress(); }
}

/** Records a finished Grand Prix (final place 1-based). Returns the trophy, or null if this cup was already counted. */
export function recordCup(progress: CupProgress, cupId: string, driver: number, place: number): 'gold' | 'silver' | 'bronze' | 'none' | null {
  if (progress.recorded.includes(cupId)) return null;
  const r = progress.drivers[driver] ?? { cups: 0, gold: 0, silver: 0, bronze: 0, best: 0 };
  r.cups++; r.best = r.best ? Math.min(r.best, place) : place;
  const trophy = place === 1 ? 'gold' : place === 2 ? 'silver' : place === 3 ? 'bronze' : 'none';
  if (trophy !== 'none') r[trophy]++;
  progress.drivers[driver] = r;
  progress.recorded = [...progress.recorded, cupId].slice(-RECORDED_LIMIT);
  return trophy;
}

export function describeRecord(record: DriverRecord | undefined): string {
  if (!record?.cups) return 'Ehrenregister: noch kein Grand Prix beendet';
  const trophies = [record.gold && `${record.gold}× Gold`, record.silver && `${record.silver}× Silber`, record.bronze && `${record.bronze}× Bronze`].filter(Boolean).join(' · ');
  return `Ehrenregister: ${record.cups} Grand Prix · bester Platz ${record.best}${trophies ? ` · ${trophies}` : ''}`;
}

export function loadProgress(): CupProgress { try { return parseProgress(localStorage.getItem(KEY)); } catch { return emptyProgress(); } }
export function saveProgress(progress: CupProgress): boolean { try { localStorage.setItem(KEY, JSON.stringify(progress)); return true; } catch { return false; } }
export function resetProgress(): CupProgress { try { localStorage.removeItem(KEY); } catch { /* storage optional */ } return emptyProgress(); }
