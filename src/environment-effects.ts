/** Particles that need to touch a surface are suppressed while airborne or stationary. */
export function canalSurfaceSprayRate(inCanal: boolean, speed: number, height: number, reducedEffects: boolean): number {
  if (!inCanal || Math.abs(speed) <= 6 || height > .35) return 0;
  // Seven particles/s left only a handful of droplets in a short canal pass.
  // Keep the reduced setting readable while the per-kart pool remains a hard cap.
  return reducedEffects ? 14 : 30;
}

/** Bounded loose-surface dust; no emission while parked, airborne or on the paved racing line. */
export function looseSurfaceDustRate(surface: 'cobble' | 'gravel' | 'grass', grounded: boolean, speed: number, reducedEffects: boolean): number {
  if (surface === 'cobble' || !grounded || Math.abs(speed) < 3) return 0;
  return surface === 'gravel' ? reducedEffects ? 8 : 22 : reducedEffects ? 4 : 11;
}

/** Narrow visual foam washes sit just inside the transverse canal surface. */
export function canalFoamBands(from: number, length: number): [number, number][] {
  const width = Math.min(.16, Math.max(0, length) / 2);
  const end = from + Math.max(0, length);
  return width > 0 ? [[from, from + width], [end - width, end]] : [];
}
