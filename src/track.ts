import { initialKartState, KART_TUNING, type DriveInput, type KartState, type WorldProjection } from './kart-model.ts';

export const TRACK = { radius: 32, straight: 120, halfWidth: 7.5, length: 240 + 64 * Math.PI };
export const wrap = (s: number) => ((s % TRACK.length) + TRACK.length) % TRACK.length;

/** Clockwise in progress space: north on the eastern straight, west at the stadium. */
export function trackPoint(progress: number, lane = 0): { x: number; z: number; heading: number } {
  const s = wrap(progress), r = TRACK.radius + lane, half = TRACK.straight / 2;
  if (s < 120) return { x: r, z: -half + s, heading: 0 };
  if (s < 120 + Math.PI * 32) {
    const a = (s - 120) / 32;
    return { x: r * Math.cos(a), z: half + r * Math.sin(a), heading: -a };
  }
  if (s < 240 + Math.PI * 32) return { x: -r, z: half - (s - 120 - Math.PI * 32), heading: -Math.PI };
  const a = (s - 240 - Math.PI * 32) / 32;
  return { x: -r * Math.cos(a), z: -half - r * Math.sin(a), heading: -Math.PI - a };
}

export function trackProgress(x: number, z: number): number {
  if (z > 60) return 120 + Math.atan2(z - 60, x) * 32;
  if (z < -60) return wrap(240 + Math.PI * 32 + Math.atan2(-z - 60, -x) * 32);
  return x >= 0 ? z + 60 : 120 + Math.PI * 32 + 60 - z;
}

export function trackHeightAt(x: number, z: number): number {
  const s = trackProgress(x, z), delta = Math.abs(s - 65);
  return delta < 4 ? .24 * (.5 + .5 * Math.cos(delta / 4 * Math.PI)) : 0;
}

export const projectTrack: WorldProjection = (x, z) => {
  const cy = Math.max(-60, Math.min(60, z));
  const dx = x, dz = z - cy;
  const distance = Math.hypot(dx, dz);
  const safe = TRACK.halfWidth - KART_TUNING.collisionRadius;
  const target = Math.max(TRACK.radius - safe, Math.min(TRACK.radius + safe, distance));
  if (Math.abs(distance - target) < .00001) return { x, z, normalX: 0, normalZ: 0, kind: null };
  const nx = distance > .001 ? dx / distance : 1, nz = distance > .001 ? dz / distance : 0;
  const sign = target > distance ? 1 : -1;
  return { x: nx * target, z: cy + nz * target, normalX: nx * sign, normalZ: nz * sign, kind: 'boundary' };
};

export function gridKart(index: number): KartState {
  const p = trackPoint(22 - Math.floor(index / 2) * 4.3, index % 2 ? 1.65 : -1.65);
  return { ...initialKartState(), ...p, travelHeading: p.heading };
}

// Everyone recovers at their current track progress; no free metres or laps.
export function recoverKart(state: KartState, others: KartState[]): KartState {
  const s = trackProgress(state.x,state.z);
  const lanes = [-3.5,0,3.5].map(lane=>({lane,p:trackPoint(s,lane)}));
  lanes.sort((a,b)=> {
    const clearance=(p:{x:number;z:number})=>Math.min(20,...others.filter(o=>o!==state).map(o=>Math.hypot(p.x-o.x,p.z-o.z)));
    return clearance(b.p)-clearance(a.p);
  });
  const p=lanes[0].p;
  return {...initialKartState(),...p,travelHeading:p.heading};
}

export function botInput(state: KartState, index: number, others: KartState[] = []): DriveInput {
  const s = trackProgress(state.x, state.z);
  const currentLane = Math.hypot(state.x, state.z - Math.max(-60, Math.min(60, state.z))) - 32;
  const lanes = [-3.5, 0, 3.5];
  const traffic = others.filter((other) => other !== state).map((other) => ({
    ahead: wrap(trackProgress(other.x, other.z) - s),
    lane: Math.hypot(other.x, other.z - Math.max(-60, Math.min(60, other.z))) - 32,
    speed: other.speed,
  })).filter((other) => other.ahead > .05 && other.ahead < 14);
  const score = (lane: number) => Math.abs(lane - currentLane) * .35 + Math.abs(lane - lanes[index % 3]) * .12 +
    traffic.reduce((sum, t) => sum + (Math.abs(t.lane - lane) < 2.7 ? (14 - t.ahead) * 2 : 0), 0);
  const lane = [...lanes].sort((a, b) => score(a) - score(b))[0];
  const target = trackPoint(s + 8 + Math.abs(state.speed) * .4, lane);
  const desired = Math.atan2(target.x - state.x, target.z - state.z);
  const error = Math.atan2(Math.sin(desired - state.heading), Math.cos(desired - state.heading));
  const steering = Math.max(-1, Math.min(1, error * 2.1));
  let desiredSpeed = 13.2 + (index % 3) * .55 - Math.abs(error) * 3;
  for (const t of traffic) if (t.ahead < 5 && Math.abs(t.lane - currentLane) < 2.5) desiredSpeed = Math.min(desiredSpeed, Math.max(1, t.speed - 1));
  return { throttle: state.speed > desiredSpeed + .5 ? -.12 : .9, steering };
}

export interface RaceProgress { last: number; distance: number; finished: boolean; finishTime: number | null }
export function createRaceProgress(state: KartState): RaceProgress {
  const last = trackProgress(state.x, state.z);
  return { last, distance: last - 22, finished: false, finishTime: null };
}
export function advanceRace(race: RaceProgress, state: KartState, time: number): void {
  if (race.finished) return;
  const next = trackProgress(state.x, state.z);
  let delta = next - race.last;
  if (delta < -TRACK.length / 2) delta += TRACK.length;
  if (delta > TRACK.length / 2) delta -= TRACK.length;
  // Never award teleport progress or a jump between the two straights.
  if (Math.abs(delta) < 3) race.distance = Math.max(-TRACK.length, race.distance + delta);
  race.last = next;
  if (race.distance >= TRACK.length * 3) { race.finished = true; race.finishTime = time; }
}
