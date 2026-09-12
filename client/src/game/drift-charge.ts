/** Shared thresholds for physics and the player-facing charge indicator. */
export const DRIFT_CHARGE = {
    first: 0.7,
    second: 1.8,
    firstBoost: 0.55,
    secondBoost: 1.1
} as const;

export const driftStage = (seconds: number): 0 | 1 | 2 =>
    seconds >= DRIFT_CHARGE.second ? 2 : seconds >= DRIFT_CHARGE.first ? 1 : 0;
