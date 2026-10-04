import { initialKartState, KART_TUNING, type DriveInput, type KartState, type WorldProjection } from './kart-model.ts';
import { BUMP_PROGRESS, HARBOUR, SHORTCUT, START_PROGRESS, TRACK_HALF_WIDTH, sampleTrack } from './track-layout.ts';

const built = sampleTrack();
const SAMPLES = built.samples;
/** Inner face of the barrier wall (lane metres); karts may use the kerbs right up to it. */
export const TRACK = { halfWidth: TRACK_HALF_WIDTH, wall: TRACK_HALF_WIDTH + 1, length: built.length, start: START_PROGRESS, samples: SAMPLES };
/** Half the visual kart width (rear tyre outer edge). */
const KART_SIDE = 1.15;
export const wrap = (s: number) => ((s % TRACK.length) + TRACK.length) % TRACK.length;
const signedGap = (s: number) => { const d = wrap(s); return d > TRACK.length / 2 ? d - TRACK.length : d; };

// Uniform hash grid over centreline samples for nearest-segment lookup.
const CELL = 6;
const grid = new Map<string, number[]>();
SAMPLES.forEach((p, i) => {
  const key = `${Math.floor(p.x / CELL)},${Math.floor(p.z / CELL)}`;
  const list = grid.get(key) ?? []; list.push(i); grid.set(key, list);
});

function sampleIndexAt(s: number): number {
  const target = wrap(s);
  let lo = 0, hi = SAMPLES.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (SAMPLES[mid].s <= target) lo = mid; else hi = mid - 1; }
  return lo;
}

/** Centre point, heading and lane offset (positive = driver's right) at a progress distance. */
export function trackPoint(progress: number, lane = 0): { x: number; z: number; heading: number } {
  const s = wrap(progress), i = sampleIndexAt(s), a = SAMPLES[i], b = SAMPLES[(i + 1) % SAMPLES.length];
  const span = (i + 1 < SAMPLES.length ? b.s : TRACK.length) - a.s, f = span > 0 ? (s - a.s) / span : 0;
  const turn = Math.atan2(Math.sin(b.heading - a.heading), Math.cos(b.heading - a.heading));
  const heading = a.heading + turn * f;
  const x = a.x + (b.x - a.x) * f, z = a.z + (b.z - a.z) * f;
  return { x: x + Math.cos(heading) * lane, z: z - Math.sin(heading) * lane, heading };
}

/** Nearest centreline progress and signed lateral offset for any world position. */
export function trackLocate(x: number, z: number): { s: number; lane: number } {
  const cx = Math.floor(x / CELL), cz = Math.floor(z / CELL);
  let best = -1, bestDistance = Infinity;
  for (let ring = 1; ring <= 6 && best < 0; ring += 2) {
    for (let dx = -ring; dx <= ring; dx++) for (let dz = -ring; dz <= ring; dz++) {
      for (const i of grid.get(`${cx + dx},${cz + dz}`) ?? []) {
        const d = (SAMPLES[i].x - x) ** 2 + (SAMPLES[i].z - z) ** 2;
        if (d < bestDistance) { bestDistance = d; best = i; }
      }
    }
  }
  if (best < 0) SAMPLES.forEach((p, i) => { const d = (p.x - x) ** 2 + (p.z - z) ** 2; if (d < bestDistance) { bestDistance = d; best = i; } });
  let result = { s: SAMPLES[best].s, lane: 0 }; let closest = Infinity;
  for (const i of [(best - 1 + SAMPLES.length) % SAMPLES.length, best]) {
    const a = SAMPLES[i], b = SAMPLES[(i + 1) % SAMPLES.length];
    const ex = b.x - a.x, ez = b.z - a.z, len2 = ex * ex + ez * ez || 1;
    const t = Math.max(0, Math.min(1, ((x - a.x) * ex + (z - a.z) * ez) / len2));
    const px = a.x + ex * t, pz = a.z + ez * t, d = Math.hypot(x - px, z - pz);
    if (d < closest - 1e-12) {
      closest = d;
      const span = (i + 1 < SAMPLES.length ? b.s : TRACK.length) - a.s;
      const len = Math.sqrt(len2), side = ((x - px) * ez - (z - pz) * ex) / len;
      result = { s: wrap(a.s + span * t), lane: side };
    }
  }
  return result;
}

// Shortcut centreline: Catmull-Rom through the inside lanes of both legs and the backyard points.
const SHORTCUT_PATH = (() => {
  const raw = [trackPoint(SHORTCUT.from, -3), ...SHORTCUT.points.map(([x, z]) => ({ x, z })), trackPoint(SHORTCUT.to, -3)];
  const pts: { x: number; z: number }[] = [];
  for (let i = 0; i < raw.length - 1; i++) {
    const p0 = raw[Math.max(0, i - 1)], p1 = raw[i], p2 = raw[i + 1], p3 = raw[Math.min(raw.length - 1, i + 2)];
    for (let k = 0; k < 16; k++) {
      const t = k / 16, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => .5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3);
      pts.push({ x: f(p0.x, p1.x, p2.x, p3.x), z: f(p0.z, p1.z, p2.z, p3.z) });
    }
  }
  pts.push(raw[raw.length - 1]);
  const u = [0]; for (let i = 1; i < pts.length; i++) u.push(u[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z));
  return { pts, u, length: u[u.length - 1] };
})();
export const SHORTCUT_LENGTH = SHORTCUT_PATH.length;

/** Point and heading on the shortcut at distance u (0..length) with a lateral offset (positive = right). */
export function shortcutPoint(u: number, lane = 0): { x: number; z: number; heading: number } {
  const { pts, u: cum } = SHORTCUT_PATH; const d = Math.max(0, Math.min(SHORTCUT_PATH.length, u));
  let i = 0; while (i < pts.length - 2 && cum[i + 1] < d) i++;
  const a = pts[i], b = pts[i + 1], f = (d - cum[i]) / (cum[i + 1] - cum[i] || 1), heading = Math.atan2(b.x - a.x, b.z - a.z);
  const x = a.x + (b.x - a.x) * f, z = a.z + (b.z - a.z) * f;
  return { x: x + Math.cos(heading) * lane, z: z - Math.sin(heading) * lane, heading };
}

/** Nearest shortcut position: distance along it, signed lateral offset and mapped race progress. */
export function shortcutLocate(x: number, z: number): { u: number; lane: number; s: number } {
  const { pts, u: cum } = SHORTCUT_PATH; let best = { u: 0, lane: Infinity, d: Infinity };
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], ex = b.x - a.x, ez = b.z - a.z, len2 = ex * ex + ez * ez || 1;
    const t = Math.max(0, Math.min(1, ((x - a.x) * ex + (z - a.z) * ez) / len2));
    const px = a.x + ex * t, pz = a.z + ez * t, d = Math.hypot(x - px, z - pz);
    if (d < best.d) best = { u: cum[i] + Math.sqrt(len2) * t, lane: ((x - px) * ez - (z - pz) * ex) / Math.sqrt(len2), d };
  }
  return { u: best.u, lane: best.lane, s: wrap(SHORTCUT.from + (SHORTCUT.to - SHORTCUT.from) * best.u / SHORTCUT_PATH.length) };
}

/** True while a kart is in the backyard alley rather than on the circuit itself. */
export function inShortcut(x: number, z: number): boolean {
  if (Math.abs(trackLocate(x, z).lane) <= TRACK.halfWidth + .3) return false;
  return Math.abs(shortcutLocate(x, z).lane) <= SHORTCUT.halfWidth + .3;
}

export function trackProgress(x: number, z: number): number {
  const main = trackLocate(x, z);
  if (Math.abs(main.lane) <= TRACK.halfWidth + .3) return main.s;
  const alley = shortcutLocate(x, z);
  return Math.abs(alley.lane) <= SHORTCUT.halfWidth + .3 ? alley.s : main.s;
}

/** Rough alley cobbles: speed above the cap bleeds away unless a mini-turbo is running. */
export function applySurfaceDrag(state: KartState, dt: number): KartState {
  if (state.turboRemaining > 0 || state.speed <= SHORTCUT.speedCap || !inShortcut(state.x, state.z)) return state;
  return { ...state, speed: Math.max(SHORTCUT.speedCap, state.speed - 14 * dt) };
}

/** Largest absolute centreline curvature in [from, from + distance]. */
export function curvatureAhead(from: number, distance: number): { curvature: number; sign: number } {
  let best = 0, sign = 0;
  for (let d = 0; d <= distance; d += 1.5) {
    const k = SAMPLES[sampleIndexAt(from + d)].curvature;
    if (Math.abs(k) > best) { best = Math.abs(k); sign = Math.sign(k); }
  }
  return { curvature: best, sign };
}

export function trackHeightAt(x: number, z: number): number {
  const { s, lane } = trackLocate(x, z), delta = Math.abs(signedGap(s - BUMP_PROGRESS));
  // Painted kerbs are real rumble strips: a ridged 5 cm profile between the road edge and the wall.
  const kerb = Math.abs(lane) > TRACK.halfWidth && Math.abs(lane) < TRACK.wall ? .035 + .02 * Math.abs(Math.sin(s * Math.PI / 1.2)) : 0;
  return Math.max(kerb, delta < 4 && Math.abs(lane) < TRACK.halfWidth + 1 ? .24 * (.5 + .5 * Math.cos(delta / 4 * Math.PI)) : 0);
}

const inHarbourRange = (s: number, lane: number) => s >= HARBOUR.from && s <= HARBOUR.to && Math.sign(lane) === HARBOUR.side;
/** A kart beyond the open quay edge drops into the harbour basin. */
export function inHarbour(x: number, z: number): boolean {
  const { s, lane } = trackLocate(x, z);
  return inHarbourRange(s, lane) && Math.abs(lane) > TRACK.halfWidth + 1.3;
}

export const projectTrack: WorldProjection = (x, z) => {
  const { s, lane } = trackLocate(x, z);
  const safe = TRACK.wall - KART_SIDE;
  if (Math.abs(lane) <= safe + 1e-7) return { x, z, normalX: 0, normalZ: 0, kind: null };
  // No barrier along the quay: the kart rolls on until the basin's far wall.
  if (inHarbourRange(s, lane) && Math.abs(lane) <= TRACK.halfWidth + HARBOUR.basin - KART_SIDE) return { x, z, normalX: 0, normalZ: 0, kind: null };
  // The alley corridor is open ground too; outside both corridors, push back to the nearer wall.
  const alley = shortcutLocate(x, z), alleySafe = SHORTCUT.halfWidth - KART_TUNING.collisionRadius * .8;
  if (Math.abs(alley.lane) <= alleySafe + 1e-6) return { x, z, normalX: 0, normalZ: 0, kind: null };
  const alleyExcess = Math.abs(alley.lane) - alleySafe, mainExcess = Math.abs(lane) - safe;
  if (alleyExcess < mainExcess && alley.u > .5 && alley.u < SHORTCUT_PATH.length - .5) {
    const sign = Math.sign(alley.lane), p = shortcutPoint(alley.u, sign * alleySafe);
    return { x: p.x, z: p.z, normalX: -sign * Math.cos(p.heading), normalZ: sign * Math.sin(p.heading), kind: 'boundary' };
  }
  const sign = Math.sign(lane), p = trackPoint(s, sign * safe);
  // Normal points back toward the centreline.
  return { x: p.x, z: p.z, normalX: -sign * Math.cos(p.heading), normalZ: sign * Math.sin(p.heading), kind: 'boundary' };
};

export function gridKart(index: number): KartState {
  const p = trackPoint(START_PROGRESS - 3.5 - Math.floor(index / 2) * 4.6, index % 2 ? 1.9 : -1.9);
  return { ...initialKartState(), ...p, travelHeading: p.heading };
}

// Everyone recovers at their current track progress; no free metres or laps.
export function recoverKart(state: KartState, others: KartState[]): KartState {
  const s = trackProgress(state.x,state.z);
  const lanes = [-3,0,3].map(lane=>({lane,p:trackPoint(s,lane)}));
  lanes.sort((a,b)=> {
    const clearance=(p:{x:number;z:number})=>Math.min(20,...others.filter(o=>o!==state).map(o=>Math.hypot(p.x-o.x,p.z-o.z)));
    return clearance(b.p)-clearance(a.p);
  });
  const p=lanes[0].p;
  return {...initialKartState(),...p,travelHeading:p.heading};
}

/** Shared bot driver: racing lane choice, corner braking, traffic and drift-boost through tight bends. */
export function botInput(state: KartState, index: number, others: KartState[] = []): DriveInput {
  const { s, lane: currentLane } = trackLocate(state.x, state.z);
  const speed = Math.abs(state.speed);
  const corner = curvatureAhead(s + 2, 10 + speed * 1.1);
  const radius = 1 / Math.max(corner.curvature, 1e-3);
  const lanes = [-2.8, 0, 2.8];
  const traffic = others.filter((other) => other !== state).map((other) => {
    const p = trackLocate(other.x, other.z);
    return { ahead: wrap(p.s - s), lane: p.lane, speed: other.speed };
  }).filter((other) => other.ahead > .05 && other.ahead < 14);
  // Inside lane through bends (positive curvature turns right), personal lane on straights.
  const preferred = radius < 30 ? corner.sign * 2.8 : lanes[index % 3];
  const score = (lane: number) => Math.abs(lane - currentLane) * .35 + Math.abs(lane - preferred) * .14 +
    traffic.reduce((sum, t) => sum + (Math.abs(t.lane - lane) < 2.7 ? (14 - t.ahead) * 2 : 0), 0);
  const lane = [...lanes].sort((a, b) => score(a) - score(b))[0];
  const target = trackPoint(s + 6.5 + speed * .38, lane);
  const desired = Math.atan2(target.x - state.x, target.z - state.z);
  const error = Math.atan2(Math.sin(desired - state.heading), Math.cos(desired - state.heading));
  const steering = Math.max(-1, Math.min(1, error * 2.3));
  const pace = 13.4 + (index % 3) * .5;
  const cornerSpeed = radius >= 11 ? pace : Math.max(8.5, radius * 1.05 + 2.5);
  let desiredSpeed = Math.min(pace, cornerSpeed) - Math.abs(error) * 2.5;
  for (const t of traffic) if (t.ahead < 5 && Math.abs(t.lane - currentLane) < 2.5) desiredSpeed = Math.min(desiredSpeed, Math.max(1, t.speed - 1));
  const throttle = speed > desiredSpeed + .5 ? -.12 : .9;
  // Facing a barrier at walking pace: back out with reversed steering instead of pushing into it.
  const centre = trackPoint(s), towardWall = Math.sin(state.heading - centre.heading) * Math.sign(currentLane);
  if (towardWall > .4 && speed < 4 && Math.abs(currentLane) > 3.2 && !state.drifting)
    return { throttle: -.8, steering: Math.sign(currentLane) };
  // Drift-boost: hop into a committed tight bend, hold while charging, release once the bend opens.
  const tight = radius < 17 && speed > 9 && Math.abs(currentLane) < 4.2;
  if (state.drifting) {
    const near = curvatureAhead(s + 1, 7), outward = -currentLane * state.driftDirection;
    const opening = near.curvature < 1 / 24 || near.sign !== state.driftDirection;
    const against = error * state.driftDirection < -.3;
    const release = against || outward > 3.4 || state.driftCharge >= KART_TUNING.driftChargeTime && (opening || outward > 2.6);
    const driftSteer = Math.max(-1, Math.min(1, state.driftDirection * (.45 + Math.max(0, outward - .8) * .35) + error * 1.6));
    return { throttle: .9, steering: release ? steering : driftSteer, hopDrift: !release };
  }
  if (state.hopRemaining > 0) {
    const committed = tight && Math.sign(steering) === corner.sign;
    return { throttle: .9, steering: committed ? corner.sign * Math.max(.5, Math.abs(steering)) : steering, hopDrift: committed };
  }
  // Two of three bots are drifters; the third keeps grip, so the field races with different lines.
  if (tight && index % 3 !== 1 && Math.abs(steering) > .35 && Math.sign(steering) === corner.sign)
    return { throttle: .9, steering, hopDrift: true, hopPressed: true };
  return { throttle, steering };
}

export interface RaceProgress { last: number; distance: number; finished: boolean; finishTime: number | null }
// Finished participants are ordered by crossing time, never by overshoot distance.
export function rankRace(progress:RaceProgress[]):number[] {
  return progress.map((_,i)=>i).sort((a,b)=>{
    const pa=progress[a],pb=progress[b];
    if(pa.finished!==pb.finished)return pa.finished?-1:1;
    if(pa.finished)return (pa.finishTime??Infinity)-(pb.finishTime??Infinity)||a-b;
    return pb.distance-pa.distance||a-b;
  });
}
export function createRaceProgress(state: KartState): RaceProgress {
  const last = trackProgress(state.x, state.z);
  return { last, distance: signedGap(last - START_PROGRESS), finished: false, finishTime: null };
}
export function advanceRace(race: RaceProgress, state: KartState, time: number): void {
  if (race.finished) return;
  const next = trackProgress(state.x, state.z);
  const delta = signedGap(next - race.last);
  // Never award teleport progress or a jump between neighbouring track sections.
  if (Math.abs(delta) < 3) race.distance = Math.max(-TRACK.length, race.distance + delta);
  race.last = next;
  if (race.distance >= TRACK.length * 3) { race.finished = true; race.finishTime = time; }
}
