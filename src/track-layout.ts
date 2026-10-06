/**
 * Shared circuit definition for the neutral "Stadion der Eitelkeit" slice.
 * Game coordinates: x east, z north (Blender X / Y). Heading 0 drives toward +z;
 * positive lane offsets lie on the driver's right. The same control points are
 * exported to art-source/track-layout.json for the Blender world builders.
 */
/** Whole-map scale (Marcel, 04.10.2026: much bigger map). All positions below are base values × MAP_SCALE. */
export const MAP_SCALE = 1.5;
const S = MAP_SCALE;
const BASE_CONTROL_POINTS: readonly (readonly [number, number])[] = [
  [59, -64], [56, -20], [54, 28], [51, 56],           // grandstand straight, north
  [40, 76], [20, 87], [-4, 88],                       // palace sweeper
  [-24, 82], [-37, 66], [-34, 50], [-40, 35], [-51, 21], // park esses
  [-56, 0], [-57, -24], [-56, -48],                   // western boulevard, through the gate
  [-52, -68], [-42, -82], [-26, -84], [-15, -72],     // fountain hairpin
  [-13, -52], [-9, -37], [1, -28], [14, -29],         // ministry turn
  [22, -42], [26, -62], [33, -80],                    // archive dip
  // East extension (Redesign 06.10.2026): Spree quay, avenue, column hairpin, Tiergarten esses, finish bend.
  [44, -96], [62, -108], [88, -114], [114, -108],     // Spree-Kai sweep, open river on the right
  [132, -92], [140, -66], [138, -36],                 // river bend into the Prachtallee
  [128, -12], [110, -2], [94, -10],                   // hairpin around the Säule der Eitelkeit
  [90, -30], [100, -48], [92, -66],                   // Tiergarten esses
  [78, -84], [64, -88], [57, -78],                    // finish bend onto the grandstand straight
];
export const TRACK_CONTROL_POINTS: readonly (readonly [number, number])[] = BASE_CONTROL_POINTS.map(([x, z]) => [x * S, z * S] as const);

export const TRACK_HALF_WIDTH = 6;
/** Start / finish line in progress metres. */
export const START_PROGRESS = 30 * S;
/** Raised cobble hump: progress metres of its crest. */
export const BUMP_PROGRESS = 345 * S;

export interface TrackSample { x: number; z: number; heading: number; s: number; curvature: number }

/** Centripetal Catmull-Rom through closed control points, resampled to near-constant spacing. */
export function sampleTrack(points = TRACK_CONTROL_POINTS, spacing = .5): { samples: TrackSample[]; length: number } {
  const dense: { x: number; z: number }[] = [];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n], p1 = points[i], p2 = points[(i + 1) % n], p3 = points[(i + 2) % n];
    const t0 = 0, t1 = t0 + Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) ** .5;
    const t2 = t1 + Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) ** .5, t3 = t2 + Math.hypot(p3[0] - p2[0], p3[1] - p2[1]) ** .5;
    for (let k = 0; k < 64; k++) {
      const t = t1 + (t2 - t1) * k / 64;
      const lerp = (a: readonly number[], b: readonly number[], ta: number, tb: number) =>
        [0, 1].map((j) => (tb - t) / (tb - ta) * a[j] + (t - ta) / (tb - ta) * b[j]);
      const a1 = lerp(p0, p1, t0, t1), a2 = lerp(p1, p2, t1, t2), a3 = lerp(p2, p3, t2, t3);
      const b1 = lerp(a1, a2, t0, t2), b2 = lerp(a2, a3, t1, t3), c = lerp(b1, b2, t1, t2);
      dense.push({ x: c[0], z: c[1] });
    }
  }
  const cumulative = [0];
  for (let i = 1; i <= dense.length; i++) {
    const a = dense[i - 1], b = dense[i % dense.length];
    cumulative.push(cumulative[i - 1] + Math.hypot(b.x - a.x, b.z - a.z));
  }
  const length = cumulative[dense.length];
  const count = Math.round(length / spacing), samples: TrackSample[] = [];
  let j = 0;
  for (let i = 0; i < count; i++) {
    const s = i * length / count;
    while (cumulative[j + 1] < s) j++;
    const a = dense[j], b = dense[(j + 1) % dense.length], f = (s - cumulative[j]) / (cumulative[j + 1] - cumulative[j] || 1);
    samples.push({ x: a.x + (b.x - a.x) * f, z: a.z + (b.z - a.z) * f, heading: 0, s, curvature: 0 });
  }
  // Light Laplacian smoothing removes curvature spikes at unevenly spaced control points.
  for (let pass = 0; pass < 24; pass++) {
    const copy = samples.map((p) => ({ x: p.x, z: p.z }));
    for (let i = 0; i < count; i++) {
      const prev = copy[(i - 1 + count) % count], next = copy[(i + 1) % count];
      samples[i].x = copy[i].x * .5 + (prev.x + next.x) * .25; samples[i].z = copy[i].z * .5 + (prev.z + next.z) * .25;
    }
  }
  let smoothLength = 0;
  for (let i = 0; i < count; i++) {
    samples[i].s = smoothLength;
    const next = samples[(i + 1) % count]; smoothLength += Math.hypot(next.x - samples[i].x, next.z - samples[i].z);
  }
  for (let i = 0; i < count; i++) {
    const next = samples[(i + 1) % count], prev = samples[(i - 1 + count) % count];
    samples[i].heading = Math.atan2(next.x - prev.x, next.z - prev.z);
  }
  const window = 4;
  for (let i = 0; i < count; i++) {
    const next = samples[(i + window) % count], prev = samples[(i - window + count) % count];
    const turn = Math.atan2(Math.sin(next.heading - prev.heading), Math.cos(next.heading - prev.heading));
    samples[i].curvature = turn / (2 * window * smoothLength / count);
  }
  return { samples, length: smoothLength };
}

/**
 * Backyard shortcut through the fountain hairpin: leaves the boulevard on the inside at `from`,
 * rejoins the return leg at `to`. Narrow, rough cobbles cap the speed unless a mini-turbo is active.
 */
export const SHORTCUT = { from: 343 * S, to: 452 * S, halfWidth: 3, speedCap: 10.5, points: [[-46 * S, -44 * S], [-34 * S, -44.5 * S], [-22 * S, -47.5 * S]] as const };

/** World anchors shared with the Blender builders (game x / z). */
/** Canal across the grandstand straight in front of the stands: jump it from the ramp, or fall in and get salvaged. */
export const CANAL_FROM = 85 * S, CANAL_LENGTH = 9, RAMP_LENGTH = 9, RAMP_HEIGHT = 1;
/** Take-off ramps: lip progress (the canal ramp plus a free jump on the boulevard after the gate). */
export const RAMP_LIPS = [CANAL_FROM, 330 * S] as const;

/** Glowing boost pads [progress start, lane centre]; 6 m long, 3 m wide, same effect for everyone. */
export const BOOST_PADS: readonly (readonly [number, number])[] = [[62 * S, -2], [176 * S, 2], [292 * S, 0], [CANAL_FROM - 22, 0], [1050, 0], [1192, 1.5]];

/** Abstract 'Staatliches Übungsgelände': marked shell craters [progress, lane, radius] on the straight before the gate; avoidable. */
export const CRATERS: readonly (readonly [number, number, number])[] = [[298 * S, -3, 1.7], [305 * S, 2.6, 1.9], [312 * S, -.6, 1.6]];

/** Short park-side turf verges on the raceable edge; [from, to, lane start, lane end]. */
export const GRASS_VERGES: readonly (readonly [number, number, number, number])[] = [[345 * S, 362 * S, 4.8, 5.8]];

/** Open quay on the outside of the west bend: no barrier, a harbour basin behind it (falling in costs a salvage). */
export const HARBOUR = { from: 236 * S, to: 262 * S, side: 1, basin: 9 } as const;
/** Open-edge hazards: harbour water (west bend) and a surreal satirical furnace pit (north-east bend). */
/** Spree quay on the outside of the east-extension sweep (absolute progress metres, layout 06.10.2026). */
export const SPREE_QUAY = { from: 893, to: 940, side: 1, basin: 10 } as const;
export const HAZARDS = [{ ...HARBOUR, kind: 'water' }, { ...SPREE_QUAY, kind: 'water' }, { from: 118 * S, to: 138 * S, side: 1, basin: 6, kind: 'lava' }, { from: 272 * S, to: 290 * S, side: 1, basin: 7, kind: 'cliff' }] as const;

export const LANDMARKS = {
  palace: [0, 132 * S] as const,
  fountains: [[-33 * S, -63 * S], [8 * S, 20 * S]] as const,
  /** Large park trees (Poly Haven CC0 model), kept well clear of the promenades. */
  trees: ([[24, 40], [-14, 60], [28, 2], [-6, 40], [-20, 20], [30, -16]] as const).map(([x, z]) => [x * S, z * S] as const),
  /** Säule der Eitelkeit: gilded column inside the east hairpin; a far landmark from the Prachtallee. */
  column: [111 * S, -22 * S] as const,
  /** Progress of the boulevard gate the circuit drives through. */
  gateProgress: 318 * S,
  /** Lawn islands [x0, z0, x1, z1] inside the circuit; the rest of the city floor is paved. */
  lawns: ([[-14, -6, 34, 62], [-42, -76, -28, -50]] as const).map((r) => r.map((v) => v * S) as [number, number, number, number]),
  /** Width of the promenade strip behind each barrier, in metres. */
  promenade: 5,
};

/** River Spree south of the east sweep: north/south bank z and the x extent (game units). */
export const RIVER = { north: -190, south: -262, west: -460, east: 580, level: -1.15 } as const;
export const GROUND = { west: -460, east: 580, north: 470, south: -660 } as const;
