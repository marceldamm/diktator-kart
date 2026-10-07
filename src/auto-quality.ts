/**
 * Automatic graphics start value (Marcel's questionnaire, 07.10.2026): only when the player has never chosen a
 * quality level. The median frame time of the first menu seconds picks Basis / Standard / Hoch; the manual
 * toggle stays in the options and any manual choice is kept from then on.
 */
export function pickQuality(frameTimes: readonly number[]): 0 | 1 | 2 | null {
  if (frameTimes.length < 90) return null;
  const sorted = [...frameTimes].sort((a, b) => a - b), median = sorted[Math.floor(sorted.length / 2)];
  return median > 26 ? 0 : median < 13 ? 2 : 1;
}
