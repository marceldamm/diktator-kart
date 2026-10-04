/** Particles that need to touch a surface are suppressed while airborne or stationary. */
export function canalSurfaceSprayRate(inCanal: boolean, speed: number, height: number, reducedEffects: boolean): number {
  if (!inCanal || Math.abs(speed) <= 6 || height > .35) return 0;
  return reducedEffects ? 7 : 18;
}
