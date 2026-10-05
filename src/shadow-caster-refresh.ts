/** Dynamic shadow membership changes much more slowly than the render loop. */
export const SHADOW_CASTER_REFRESH_SECONDS = 0.1;

export function shouldRefreshShadowCasters(
  nowSeconds: number,
  lastRefreshSeconds: number,
  intervalSeconds = SHADOW_CASTER_REFRESH_SECONDS,
): boolean {
  if (!Number.isFinite(nowSeconds) || !Number.isFinite(intervalSeconds) || intervalSeconds <= 0) return false;
  return !Number.isFinite(lastRefreshSeconds) || nowSeconds - lastRefreshSeconds >= intervalSeconds;
}
