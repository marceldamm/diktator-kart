/** Avoid rendering the off-screen stadium broadcast when the player is far away. */
export function shouldRefreshBroadcastFeed(
  kartX: number,
  kartZ: number,
  screenX: number,
  screenZ: number,
  radius = 130,
): boolean {
  if (![kartX, kartZ, screenX, screenZ, radius].every(Number.isFinite) || radius <= 0) return false;
  const dx = kartX - screenX;
  const dz = kartZ - screenZ;
  return dx * dx + dz * dz <= radius * radius;
}
