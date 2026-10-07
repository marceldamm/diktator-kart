import { initialKartState, KART_TUNING, type DriveInput, type KartState, type WorldProjection } from './kart-model.ts';
import { BOOST_PADS, BUMP_PROGRESS, CANAL_FROM, CANAL_LENGTH, CRATERS, ELEVATION, GRASS_VERGES, HAZARDS, LANDMARKS, RAMP_HEIGHT, RAMP_LENGTH, RAMP_LIPS, SHORTCUT, START_PROGRESS, TRACK_HALF_WIDTH, TRACK_INFO, isTrackId, sampleTrack, setTrackLayout, type TrackId, type TrackSample } from './track-layout.ts';

let SAMPLES: TrackSample[] = [];
/** Inner face of the barrier wall (lane metres); karts may use the kerbs right up to it. Mutated in place by `selectTrack`. */
export const TRACK = { halfWidth: TRACK_HALF_WIDTH, wall: TRACK_HALF_WIDTH + 1, length: 0, start: START_PROGRESS, samples: SAMPLES, id: TRACK_INFO.id as TrackId, name: TRACK_INFO.name };
/** Half the visual kart width (rear tyre outer edge). */
const KART_SIDE = 1.15;
export const wrap = (s: number) => ((s % TRACK.length) + TRACK.length) % TRACK.length;
const signedGap = (s: number) => { const d = wrap(s); return d > TRACK.length / 2 ? d - TRACK.length : d; };

// Uniform hash grid over centreline samples for nearest-segment lookup.
const CELL = 6;
const grid = new Map<string, number[]>();

/** Builds the centreline, lookup grid and shortcut path of the active layout. */
function rebuild(): void {
  const built = sampleTrack();
  SAMPLES = built.samples;
  Object.assign(TRACK, { halfWidth: TRACK_HALF_WIDTH, wall: TRACK_HALF_WIDTH + 1, length: built.length, start: START_PROGRESS, samples: SAMPLES, id: TRACK_INFO.id, name: TRACK_INFO.name });
  grid.clear();
  SAMPLES.forEach((p, i) => {
    const key = `${Math.floor(p.x / CELL)},${Math.floor(p.z / CELL)}`;
    const list = grid.get(key) ?? []; list.push(i); grid.set(key, list);
  });
  SHORTCUT_PATH = buildShortcutPath(); SHORTCUT_LENGTH = SHORTCUT_PATH.length;
}

/** Switches the whole simulation to another circuit (layout bindings, centreline, shortcut). */
export function selectTrack(id: TrackId): void {
  if (TRACK.length > 0 && TRACK.id === id) return;
  setTrackLayout(id); rebuild();
}
export { isTrackId };

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

/** X intervals where the main road crosses a world-space horizontal boundary at z. */
export function trackCrossingsAtZ(z: number, clearance = 2): [number, number][] {
  const crossings: [number, number][] = [];
  for (let i = 0; i < SAMPLES.length; i++) {
    const a = SAMPLES[i], b = SAMPLES[(i + 1) % SAMPLES.length], dz = b.z - a.z;
    if (Math.abs(dz) < 1e-5 || (a.z - z) * (b.z - z) > 0) continue;
    const t = (z - a.z) / dz;
    if (t < 0 || t > 1) continue;
    const x = a.x + (b.x - a.x) * t, turn = Math.atan2(Math.sin(b.heading - a.heading), Math.cos(b.heading - a.heading));
    const heading = a.heading + turn * t, halfGap = TRACK_HALF_WIDTH * Math.abs(Math.cos(heading)) + clearance;
    crossings.push([x - halfGap, x + halfGap]);
  }
  crossings.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const gap of crossings) {
    const previous = merged.at(-1);
    if (previous && gap[0] <= previous[1] + .1) previous[1] = Math.max(previous[1], gap[1]);
    else merged.push([...gap]);
  }
  return merged;
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
function buildShortcutPath() {
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
}
let SHORTCUT_PATH: { pts: { x: number; z: number }[]; u: number[]; length: number } = { pts: [], u: [], length: 0 };
export let SHORTCUT_LENGTH = 0;
rebuild();

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

export type DrivingSurface = 'cobble' | 'gravel' | 'grass';

/** Surface under the kart: the racing ribbon stays cobble, the alley is gravel, park edges are grass. */
export function drivingSurfaceAt(x: number, z: number): DrivingSurface {
  if (inShortcut(x, z)) return TRACK_INFO.theme === 'pyongyang' ? 'cobble' : 'gravel';
  const { s, lane } = trackLocate(x, z);
  if (GRASS_VERGES.some(([from,to,minLane,maxLane]) => s >= from && s <= to && lane >= minLane && lane <= maxLane)) return 'grass';
  if (Math.abs(lane) > TRACK.halfWidth + .65 && LANDMARKS.lawns.some(([x0, z0, x1, z1]) => x >= x0 && x <= x1 && z >= z0 && z <= z1)) return 'grass';
  return 'cobble';
}

/** Loose gravel and turf slow and soften steering; turbo keeps the existing shortcut speed exception. */
export function applySurfaceDrag(state: KartState, dt: number): KartState {
  if (!state.grounded || Math.abs(state.speed) < .01) return state;
  const surface = drivingSurfaceAt(state.x, state.z);
  if (surface === 'cobble') return state;
  if (surface === 'gravel') {
    const capDrag = state.turboRemaining > 0 || state.speed <= SHORTCUT.speedCap ? 0 : 14;
    const rollingDrag = state.turboRemaining > 0 ? 0 : 2.5;
    const loss = Math.max(capDrag, rollingDrag) * dt;
    return { ...state, speed: Math.sign(state.speed) * Math.max(0, Math.abs(state.speed) - loss), yawRate: state.yawRate * .82 };
  }
  const speed = Math.sign(state.speed) * Math.max(0, Math.abs(state.speed) - 6 * dt);
  return { ...state, speed, yawRate: state.yawRate * .62 };
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

function shortcutCurvatureAhead(from: number, distance: number): { curvature: number; sign: number } {
  let best = 0, sign = 0;
  for (let d = 0; d <= distance; d += 1.5) {
    const a = shortcutPoint(from + d).heading, b = shortcutPoint(from + d + 1.5).heading;
    const turn = Math.atan2(Math.sin(b - a), Math.cos(b - a)), curvature = Math.abs(turn / 1.5);
    if (curvature > best) { best = curvature; sign = Math.sign(turn); }
  }
  return { curvature: best, sign };
}

/** Smooth road elevation along the circuit: cosine-eased between the layout's keyframes; 0 elsewhere. */
export function elevationAt(s: number): number {
  const p = wrap(s);
  for (let i = 0; i < ELEVATION.length - 1; i++) {
    const [a, ha] = ELEVATION[i], [b, hb] = ELEVATION[i + 1];
    if (p >= a && p <= b) { const t = (p - a) / (b - a || 1); return ha + (hb - ha) * (.5 - .5 * Math.cos(t * Math.PI)); }
  }
  return 0;
}

export function trackHeightAt(x: number, z: number): number {
  if (inShortcut(x, z)) return shortcutElevationAt(shortcutLocate(x, z).u);
  const { s, lane } = trackLocate(x, z);
  return (Math.abs(lane) <= TRACK.halfWidth + 7 ? elevationAt(s) : 0) + localHeightAt(s, lane);
}

/** Ground height along the shortcut's own normalised profile; enables a genuinely lower underpass. */
export function shortcutElevationAt(u: number): number {
  const profile = SHORTCUT.elevation, t = SHORTCUT_LENGTH > 0 ? Math.max(0, Math.min(1, u / SHORTCUT_LENGTH)) : 0;
  for (let i = 0; i < profile.length - 1; i++) {
    const [a, ha] = profile[i], [b, hb] = profile[i + 1];
    if (t >= a && t <= b) { const f = (t - a) / (b - a || 1); return ha + (hb - ha) * (.5 - .5 * Math.cos(f * Math.PI)); }
  }
  return profile.at(-1)?.[1] ?? 0;
}

function localHeightAt(s: number, lane: number): number {
  const delta = BUMP_PROGRESS < 0 ? Infinity : Math.abs(signedGap(s - BUMP_PROGRESS));
  // Take-off ramp across the whole road before the canal.
  for (const lip of RAMP_LIPS) if (s >= lip - RAMP_LENGTH && s <= lip && Math.abs(lane) <= TRACK.halfWidth + 1) return RAMP_HEIGHT * (s - (lip - RAMP_LENGTH)) / RAMP_LENGTH;
  // Painted kerbs are real rumble strips: a ridged 5 cm profile between the road edge and the wall.
  const kerb = Math.abs(lane) > TRACK.halfWidth && Math.abs(lane) < TRACK.wall ? .035 + .02 * Math.abs(Math.sin(s * Math.PI / 1.2)) : 0;
  return Math.max(kerb, BUMP_PROGRESS >= 0 && delta < 4 && Math.abs(lane) < TRACK.halfWidth + 1 ? .24 * (.5 + .5 * Math.cos(delta / 4 * Math.PI)) : 0);
}

const hazardRange = (s: number, lane: number) => HAZARDS.find((h) => s >= h.from && s <= h.to && Math.sign(lane) === h.side);
/** On the canal water (across the whole road). */
export function overCanal(x: number, z: number): boolean {
  const { s, lane } = trackLocate(x, z);
  return s > CANAL_FROM && s < CANAL_FROM + CANAL_LENGTH && Math.abs(lane) <= TRACK.halfWidth + 1.2;
}
/** On the last metre of the take-off ramp. */
export function atRampLip(x: number, z: number): boolean {
  const { s, lane } = trackLocate(x, z);
  return RAMP_LIPS.some((lip) => s >= lip - 1.4 && s <= lip + .2) && Math.abs(lane) <= TRACK.halfWidth + 1;
}

/** Index of the crater under a kart, or -1. */
export function craterAt(x: number, z: number): number {
  return CRATERS.findIndex(([s, lane, r]) => { const p = trackPoint(s, lane); return Math.hypot(p.x - x, p.z - z) < r; });
}

/** Deep centre of a marked practice-shell crater; rim crossings only jolt, the bowl causes recovery. */
export function craterPitAt(x: number, z: number): number {
  return CRATERS.findIndex(([s, lane, r]) => { const p = trackPoint(s, lane); return Math.hypot(p.x - x, p.z - z) < r * .48; });
}

/** A grounded kart entering a bowl falls once; an existing salvage timer suppresses retriggering. */
export function shouldStartCraterFall(x: number, z: number, grounded: boolean, salvageRemaining: number): boolean {
  return grounded && salvageRemaining <= 0 && craterPitAt(x,z) >= 0;
}

/** Index of the boost pad under a kart, or -1. */
export function boostPadAt(x: number, z: number): number {
  if (inShortcut(x, z)) {
    const { u, lane } = shortcutLocate(x, z);
    const pad = SHORTCUT.boostPads.findIndex(([start, centre]) => {
      const from = start * SHORTCUT_LENGTH;
      return u >= from && u <= from + 6 && Math.abs(lane - centre) <= 1.5;
    });
    return pad >= 0 ? BOOST_PADS.length + pad : -1;
  }
  const { s, lane } = trackLocate(x, z);
  return BOOST_PADS.findIndex(([from, centre]) => s >= from && s <= from + 6 && Math.abs(lane - centre) <= 1.5);
}

/** A kart beyond the open quay edge drops into the harbour basin. */
export function hazardAt(x: number, z: number): 'water' | 'lava' | 'cliff' | null {
  const { s, lane } = trackLocate(x, z), h = hazardRange(s, lane);
  return h && Math.abs(lane) > TRACK.halfWidth + 1.3 ? h.kind : null;
}
export const inHarbour = (x: number, z: number) => hazardAt(x, z) !== null;

export const projectTrack: WorldProjection = (x, z) => {
  const { s, lane } = trackLocate(x, z);
  for (const obstacle of TRACK_INFO.obstacles ?? []) {
    const centre = trackPoint(obstacle.s, obstacle.lane), dx = x - centre.x, dz = z - centre.z, distance = Math.hypot(dx, dz);
    const clearance = obstacle.radius + KART_TUNING.collisionRadius;
    if (distance >= clearance) continue;
    const sign = Math.sign(obstacle.lane) || 1, normalX = distance > 1e-6 ? dx / distance : sign * Math.cos(centre.heading);
    const normalZ = distance > 1e-6 ? dz / distance : -sign * Math.sin(centre.heading);
    return { x: centre.x + normalX * clearance, z: centre.z + normalZ * clearance, normalX, normalZ, kind: 'obstacle' };
  }
  const safe = TRACK.wall - KART_SIDE;
  if (Math.abs(lane) <= safe + 1e-7) return { x, z, normalX: 0, normalZ: 0, kind: null };
  // No barrier along the quay: the kart rolls on until the basin's far wall.
  const hazard = hazardRange(s, lane);
  if (hazard && Math.abs(lane) <= TRACK.halfWidth + hazard.basin - KART_SIDE) return { x, z, normalX: 0, normalZ: 0, kind: null };
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
  const fellIntoCanal = overCanal(state.x, state.z);
  // The canal spans the whole road, so the usual same-progress respawn would
  // place the kart back over water. Put it just beyond the landing edge. The
  // gap is larger than advanceRace's teleport allowance, so rescue grants no lap progress.
  const fellIntoCrater = craterPitAt(state.x, state.z) >= 0;
  const s = fellIntoCanal
    ? CANAL_FROM + CANAL_LENGTH + KART_TUNING.collisionRadius + 1
    : trackProgress(state.x,state.z);
  // A same-progress crater respawn must leave the bowl or it would trigger an endless fall loop.
  let lanes = (fellIntoCrater ? [-4.8, 4.8, -3.5, 3.5, 0] : [-3,0,3]).map(lane=>({lane,p:trackPoint(s,lane)}))
    .filter(({p}) => !fellIntoCrater || craterPitAt(p.x,p.z) < 0)
    .filter(({p}) => !hazardAt(p.x,p.z) && projectTrack(p.x,p.z).kind === null);
  if (!lanes.length) lanes = [-4.8,4.8].map(lane=>({lane,p:trackPoint(s,lane)}));
  lanes.sort((a,b)=> {
    const clearance=(p:{x:number;z:number})=>Math.min(20,...others.filter(o=>o!==state).map(o=>Math.hypot(p.x-o.x,p.z-o.z)));
    return clearance(b.p)-clearance(a.p);
  });
  const p=lanes[0].p;
  return {...initialKartState(),...p,travelHeading:p.heading};
}

/**
 * Rival styles (07.10.2026, Paket 5): each caricature makes recognisable, fair choices – preferred line on the
 * straights, drift or grip through tight bends, whether it risks the shortcut, how eagerly it commits to a
 * passing line and how long it saves an item. No style changes speed, grip or the shared kart physics.
 */
export interface BotStyle { label: string; lane: number; drift: boolean; shortcut: boolean; pass: number; itemPatience: number }
/** Indexed like CAST: Hitler, Stalin, Mussolini, Mao, Kim Jong-un, Castro. */
export const BOT_STYLES: readonly BotStyle[] = [
  { label: 'beansprucht die Mitte, drängelt beim Überholen', lane: 0, drift: true, shortcut: false, pass: 1.45, itemPatience: .7 },
  { label: 'schwer und geduldig auf der Innenlinie, kein Drift', lane: -2.8, drift: false, shortcut: false, pass: .65, itemPatience: 1.6 },
  { label: 'Außenlinie mit Pose, nimmt jede Abkürzung', lane: 2.8, drift: true, shortcut: true, pass: 1.2, itemPatience: 1 },
  { label: 'gleichmäßig innen, Haftung statt Drift', lane: -2.8, drift: false, shortcut: false, pass: .9, itemPatience: 1.3 },
  { label: 'sprunghaft, riskiert die Abkürzung, wirft früh', lane: 0, drift: true, shortcut: true, pass: 1.3, itemPatience: .55 },
  { label: 'Langstreckenlinie außen, driftet sauber', lane: 2.8, drift: true, shortcut: false, pass: 1, itemPatience: 1.1 },
];
let botStyles: (BotStyle | undefined)[] = [];
/** Style per kart slot (slot 0 = player, ignored); without styles the earlier slot-based defaults apply. */
export function setBotStyles(styles: (BotStyle | undefined)[]): void { botStyles = styles; }
export const botStyleOf = (index: number): BotStyle | undefined => botStyles[index];

/** Shared bot driver: racing lane choice, corner braking, traffic and drift-boost through tight bends. */
/** Bot pace offset per difficulty (m/s on the base pace; never above the shared kart top speed). */
let botSkill = 0;
export function setBotSkill(level: 0 | 1 | 2): void { botSkill = [-1.3, 0, 1.2][level]; }

export function botInput(state: KartState, index: number, others: KartState[] = []): DriveInput {
  const main = trackLocate(state.x, state.z);
  const style = botStyles[index];
  const takesAlley = style ? style.shortcut : index === 3;
  const alley = inShortcut(state.x, state.z) || (takesAlley && main.s >= SHORTCUT.from - 14 && main.s < SHORTCUT.to);
  const shortcut = alley ? shortcutLocate(state.x, state.z) : null;
  const { s, lane: currentLane } = shortcut ?? main;
  const speed = Math.abs(state.speed);
  const corner = alley ? shortcutCurvatureAhead(shortcut!.u + 2, 10 + speed * 1.1) : curvatureAhead(s + 2, 10 + speed * 1.1);
  const radius = 1 / Math.max(corner.curvature, 1e-3);
  // Five racing lanes give room to pick a real passing line.
  const lanes = alley ? [0] : [-3.6, -1.8, 0, 1.8, 3.6];
  const traffic = others.filter((other) => other !== state).map((other) => {
    const otherAlley = inShortcut(other.x, other.z), p = otherAlley ? shortcutLocate(other.x, other.z) : trackLocate(other.x, other.z);
    return { ahead: wrap(p.s - s), lane: p.lane, speed: other.speed, sameRoute: otherAlley === alley };
  }).filter((other) => other.sameRoute && other.ahead > .05 && other.ahead < 14);
  // Inside lane through bends (positive curvature turns right), personal lane on straights.
  const preferred = radius < 30 ? corner.sign * 2.8 : style ? style.lane : [-2.8, 0, 2.8][index % 3];
  const eagerness = style?.pass ?? 1;
  // Overtaking: lanes holding a slower kart ahead are strongly avoided, so a faster bot commits to a passing line.
  const slower = traffic.filter((t) => t.speed < speed + .5);
  const score = (lane: number) => Math.abs(lane - currentLane) * .3 + Math.abs(lane - preferred) * (slower.length ? .05 : .14) +
    traffic.reduce((sum, t) => sum + (Math.abs(t.lane - lane) < 2.2 ? (14 - t.ahead) * (t.speed < speed + .5 ? 3.2 * eagerness : 1.2) : 0), 0);
  const lane = [...lanes].sort((a, b) => score(a) - score(b))[0];
  const target = alley
    ? shortcutPoint(shortcut!.u + 6.5 + speed * .38, 0)
    : trackPoint(s + 6.5 + speed * .38, lane);
  const desired = Math.atan2(target.x - state.x, target.z - state.z);
  const error = Math.atan2(Math.sin(desired - state.heading), Math.cos(desired - state.heading));
  const steering = Math.max(-1, Math.min(1, error * 2.3));
  // Same base pace for every rival (07.10.2026): differences come only from visible style choices, not hidden speed.
  const pace = 13.9 + botSkill;
  const cornerSpeed = radius >= 11 ? pace : Math.max(8.5, radius * 1.05 + 2.5 + botSkill * .5);
  let desiredSpeed = Math.min(pace, cornerSpeed) - Math.abs(error) * 2.5;
  // Only lift when the chosen passing line itself is blocked right ahead.
  for (const t of traffic) if (t.ahead < 5 && Math.abs(t.lane - currentLane) < 2 && Math.abs(t.lane - lane) < 2) desiredSpeed = Math.min(desiredSpeed, Math.max(1, t.speed - 1));
  const throttle = speed > desiredSpeed + .5 ? -.12 : .9;
  // Facing a barrier at walking pace: back out with reversed steering instead of pushing into it.
  const centre = trackPoint(s), towardWall = Math.sin(state.heading - centre.heading) * Math.sign(currentLane);
  if (towardWall > .4 && speed < 4 && Math.abs(currentLane) > 3.2 && !state.drifting)
    return { throttle: -.8, steering: Math.sign(currentLane) };
  // Drift-boost: hop into a committed tight bend, hold while charging, release once the bend opens.
  const tight = radius < 17 && speed > 9 && Math.abs(currentLane) < 4.2;
  if (state.drifting) {
    const near = curvatureAhead(s + 1, 7), outward = -currentLane * state.driftDirection;
    const inside = currentLane * state.driftDirection;
    const opening = near.curvature < 1 / 24 || near.sign !== state.driftDirection;
    const against = error * state.driftDirection < -.3;
    const release = against || outward > 3.4 || inside > 3.8 || state.driftCharge >= KART_TUNING.driftChargeTime && (opening || outward > 2.6);
    const driftSteer = Math.max(-1, Math.min(1, state.driftDirection * (.45 + Math.max(0, outward - .8) * .35) + error * 1.6));
    return { throttle: .9, steering: release ? steering : driftSteer, hopDrift: !release };
  }
  if (state.hopRemaining > 0) {
    const committed = tight && Math.sign(steering) === corner.sign;
    return { throttle: .9, steering: committed ? corner.sign * Math.max(.5, Math.abs(steering)) : steering, hopDrift: committed };
  }
  // Two of three bots are drifters; the third keeps grip, so the field races with different lines.
  if (tight && (style ? style.drift : index % 3 !== 1) && Math.abs(steering) > .35 && Math.sign(steering) === corner.sign)
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
  // The kart's nose (about 1.6 m ahead of its centre) decides the crossing, for every participant alike.
  if (race.distance >= TRACK.length * 3 - 1.6) { race.finished = true; race.finishTime = time; }
}
