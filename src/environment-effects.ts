/** Particles that need to touch a surface are suppressed while airborne or stationary. */
export function canalSurfaceSprayRate(inCanal: boolean, speed: number, height: number, reducedEffects: boolean): number {
  if (!inCanal || Math.abs(speed) <= 6 || height > .35) return 0;
  return reducedEffects ? 7 : 18;
}

/** Narrow visual foam washes sit just inside the transverse canal surface. */
export function canalFoamBands(from: number, length: number): [number, number][] {
  const width = Math.min(.16, Math.max(0, length) / 2);
  const end = from + Math.max(0, length);
  return width > 0 ? [[from, from + width], [end - width, end]] : [];
}
