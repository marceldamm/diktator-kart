/**
 * Circuit definitions. Game coordinates: x east, z north (Blender X / Y). Heading 0 drives toward +z;
 * positive lane offsets lie on the driver's right.
 *
 * Playable circuits (09.10.2026): Berlin's "Stadionring", Sarah's Rome/Havana/Pyongyang selections,
 * the Moscow "Genossen-Gerade" with broad parade straights and the Peking "Kulturrevolutions-Schleife".
 * The active circuit is chosen with `setTrackLayout` (called through `selectTrack` in track.ts); all layout
 * exports below are live ES-module bindings that switch with it, so the simulation, world builders, bots,
 * minimap and items always read the circuit that is currently loaded.
 */
/** Whole-map scale of the Stadionring (Marcel, 04.10.2026: much bigger map). Its base values are × MAP_SCALE. */
export const MAP_SCALE = 1.5;
const S = MAP_SCALE;

export type TrackId = 'stadionring' | 'duce-drom' | 'havanna' | 'pyongyang' | 'moscow' | 'beijing';
export type HazardKind = 'water' | 'lava' | 'cliff';
export interface Hazard { from: number; to: number; side: 1 | -1; basin: number; kind: HazardKind }
/** City district along the circuit: what lines each side between two progress values. */
export interface District { from: number; to: number; left: string; right: string }
/** A hero module placed relative to the centreline (lane > 0 = right) facing the road, or at fixed x/z. */
export interface HeroPlacement { m: string; s?: number; lane?: number; x?: number; z?: number; yaw?: number; spanRoad?: boolean }
/** Fixed roadside collision post, positioned in progress/lane space and rendered by the world builder. */
export interface TrackObstacle { s: number; lane: number; radius: number }

export interface TrackDefinition {
  id: TrackId; name: string; city: string; theme: 'berlin' | 'rome' | 'havana' | 'pyongyang' | 'moscow' | 'beijing';
  /** Short German line for the track card and the loading caption. */
  tagline: string;
  controlPoints: readonly (readonly [number, number])[];
  halfWidth: number; start: number; bump: number;
  shortcut: {
    from: number; to: number; halfWidth: number; speedCap: number; points: readonly (readonly [number, number])[];
    /** Normalised [shortcut progress, metres] profile, independent of the main-road elevation. */
    elevation: readonly (readonly [number, number])[];
    /** [normalised start progress, lane centre] for 6 m shortcut boost strips. */
    boostPads: readonly (readonly [number, number])[];
  };
  canal: { from: number; length: number };
  rampLips: readonly number[];
  boostPads: readonly (readonly [number, number])[];
  craters: readonly (readonly [number, number, number])[];
  grassVerges: readonly (readonly [number, number, number, number])[];
  /** Road elevation keyframes [progress, metres]; cosine eased, 0 outside the listed spans. */
  elevation: readonly (readonly [number, number])[];
  hazards: readonly Hazard[];
  obstacles?: readonly TrackObstacle[];
  itemBoxes: readonly number[];
  landmarks: {
    palace: readonly [number, number] | null; fountains: readonly (readonly [number, number])[]; trees: readonly (readonly [number, number])[];
    column: readonly [number, number]; gateProgress: number; lawns: [number, number, number, number][]; promenade: number;
  };
  river: { north: number; south: number; west: number; east: number; level: number };
  ground: { west: number; east: number; north: number; south: number };
  /** World dressing that only depends on progress values. */
  dressing: {
    boardRanges: [number, number][]; flagRange: [number, number]; pennants: number[]; screenProgress: number;
    districts: District[]; heroes: HeroPlacement[]; bridges: number[]; cathedral: { x: number; z: number; yaw: number } | null;
    petals: [number, number];
    /** Optional one-shot visual start fence, broken by the first kart in lap one. */
    breakableFence?: number;
  };
}

const STADIONRING: TrackDefinition = {
  id: 'stadionring', name: 'Stadionring', city: 'Berlin', theme: 'berlin',
  tagline: 'Stadion, Spree-Kai, Prachtallee und Kanalsprung',
  controlPoints: ([
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
  ] as const).map(([x, z]) => [x * S, z * S] as const),
  halfWidth: 6, start: 30 * S, bump: 345 * S,
  /** Backyard shortcut through the fountain hairpin; narrow, rough cobbles cap the speed unless a mini-turbo is active. */
  shortcut: { from: 343 * S, to: 452 * S, halfWidth: 3, speedCap: 10.5, points: [[-46 * S, -44 * S], [-34 * S, -44.5 * S], [-22 * S, -47.5 * S]], elevation: [[0, 0], [1, 0]], boostPads: [] },
  /** Canal across the grandstand straight in front of the stands: jump it from the ramp, or fall in and get salvaged. */
  canal: { from: 85 * S, length: 9 },
  rampLips: [85 * S, 330 * S],
  boostPads: [[62 * S, -2], [176 * S, 2], [292 * S, 0], [85 * S - 22, 0], [1050, 0], [1192, 1.5]],
  craters: [[298 * S, -3, 1.7], [305 * S, 2.6, 1.9], [312 * S, -.6, 1.6]],
  grassVerges: [[345 * S, 362 * S, 4.8, 5.8]],
  /** Prachtallee crest (Redesign 06.10.2026): the avenue rises 2.4 m and hides the column until the top. */
  elevation: [[1010, 0], [1052, 2.4], [1094, 0]],
  hazards: [
    { from: 236 * S, to: 262 * S, side: 1, basin: 9, kind: 'water' },   // harbour quay, west bend
    { from: 893, to: 940, side: 1, basin: 10, kind: 'water' },          // Spree quay
    { from: 118 * S, to: 138 * S, side: 1, basin: 6, kind: 'lava' },    // satirical state furnace
    { from: 272 * S, to: 290 * S, side: 1, basin: 7, kind: 'cliff' },
  ],
  itemBoxes: [72, 330, 520].map((s) => s * S),
  landmarks: {
    palace: [0, 132 * S], fountains: [[-33 * S, -63 * S], [8 * S, 20 * S]],
    /** Large park trees (Poly Haven CC0 model), kept well clear of the promenades. */
    trees: ([[24, 40], [-14, 60], [28, 2], [-6, 40], [-20, 20], [30, -16]] as const).map(([x, z]) => [x * S, z * S] as const),
    column: [111 * S, -22 * S], gateProgress: 318 * S,
    lawns: ([[-14, -6, 34, 62], [-42, -76, -28, -50]] as const).map((r) => r.map((v) => v * S) as [number, number, number, number]),
    promenade: 5,
  },
  river: { north: -190, south: -262, west: -460, east: 580, level: -1.15 },
  ground: { west: -460, east: 580, north: 470, south: -660 },
  dressing: {
    boardRanges: [[2 * S, 92 * S], [282 * S, 372 * S]], flagRange: [112 * S, 205 * S], pennants: [12, 60, 300, 345, 515], screenProgress: 66 * S,
    districts: [
      { from: 2, to: 182, left: 'stands', right: 'stands' }, { from: 182, to: 300, left: 'park', right: 'city' },
      { from: 300, to: 445, left: 'park', right: 'park' }, { from: 445, to: 545, left: 'boulevard', right: 'boulevard' },
      { from: 545, to: 735, left: 'city', right: 'city' }, { from: 735, to: 842, left: 'city', right: 'city' },
      { from: 842, to: 990, left: 'riverfront', right: 'quay' }, { from: 990, to: 1112, left: 'avenue', right: 'avenue' },
      { from: 1112, to: 1188, left: 'plaza', right: 'corner' }, { from: 1188, to: 1302, left: 'park', right: 'park' },
      { from: 1302, to: 99999, left: 'stands', right: 'stands' },
    ],
    heroes: [], bridges: [-150, 330], cathedral: { x: 150, z: -262 - 70, yaw: Math.PI }, petals: [10, 170],
  },
};

/** Duce-Drom (Rom): Sarah's track name and place; route, landmarks and satire are Claude's elaboration (07.10.2026). */
const R = 1.15;
const DUCE_DROM: TrackDefinition = {
  id: 'duce-drom', name: 'Duce-Drom', city: 'Rom', theme: 'rome',
  tagline: 'Circus-Gerade, Meta-Kehre, Belvedere-Sprung, Tiber-Kai und Triumphbogen',
  controlPoints: ([
    [-140, -112], [-80, -113], [-20, -113], [40, -112], [90, -110],   // Circus straight, east (stands both sides)
    [125, -118], [158, -108], [175, -80], [168, -50], [146, -34],      // Meta-Kehre around the obelisk
    [122, -22], [112, 0], [124, 22], [128, 46],                       // Aventin serpentine, climbing
    [114, 66], [96, 82],                                               // Belvedere plateau and jump
    [76, 102], [50, 122], [20, 134],                                   // descent toward the Tiber
    [-20, 140], [-60, 140],                                            // Tiber quay, open water on the right
    [-100, 136], [-138, 124], [-168, 100], [-182, 68],                // forum sweep
    [-185, 30], [-186, -10], [-185, -50],                              // Prunkstraße through the triumphal arch
    [-180, -82], [-166, -104],                                         // Kolosseumskehre into the Circus
  ] as const).map(([x, z]) => [x * R, z * R] as const),
  halfWidth: 6, start: 52, bump: 1120,
  /** Stallgasse: gravel lane of the old circus stables, straight through the Meta-Kehre. */
  shortcut: { from: 270, to: 452, halfWidth: 3, speedCap: 10.5, points: [[118 * R, -92 * R], [131 * R, -64 * R]], elevation: [[0, 0], [1, 0]], boostPads: [] },
  canal: { from: -1000, length: 0 },
  rampLips: [646],
  boostPads: [[112, 0], [612, 0], [860, -2.5], [1092, 0]],
  craters: [], grassVerges: [],
  elevation: [[455, 0], [600, 6], [652, 6], [737, 0]],
  hazards: [{ from: 748, to: 830, side: 1, basin: 10, kind: 'water' }],
  itemBoxes: [150, 705, 1005],
  landmarks: {
    palace: null, fountains: [], trees: [],
    column: [150 * R, -78 * R], gateProgress: 1050,
    lawns: [[-172, -100, 95, 60], [-160, 60, 40, 124]], promenade: 5,
  },
  river: { north: 262, south: 186, west: -460, east: 520, level: -1.15 },
  ground: { west: -460, east: 520, north: 470, south: -420 },
  dressing: {
    boardRanges: [[6, 250], [1060, 1150]], flagRange: [282, 392], pennants: [20, 120, 205, 1075, 1125], screenProgress: 99,
    districts: [
      { from: 0, to: 262, left: 'stands', right: 'stands' }, { from: 262, to: 455, left: 'ruins', right: 'stands' },
      { from: 455, to: 600, left: 'pines', right: 'pines' }, { from: 600, to: 748, left: 'insula', right: 'pines' },
      { from: 748, to: 838, left: 'insula', right: 'quay' }, { from: 838, to: 1000, left: 'ruins', right: 'insula' },
      { from: 1000, to: 1180, left: 'avenue', right: 'avenue' }, { from: 1180, to: 99999, left: 'stands', right: 'stands' },
    ],
    heroes: [
      { m: 'kit-balcony-palace', s: 985, lane: 22 },
      { m: 'kit-quadrato', x: 175, z: -235 }, { m: 'kit-colossal-head', s: 1112, lane: -25 },
      // A parade of identical athletes on the infield lawn, all facing the Circus straight.
      ...[-120, -75, -30, 15, 60].map((x) => ({ m: 'kit-athlete', x, z: -86, yaw: Math.PI })),
      { m: 'kit-aqueduct', x: -20, z: 30, yaw: .5 }, { m: 'kit-aqueduct', x: 2, z: 42, yaw: .5 }, { m: 'kit-aqueduct', x: 24, z: 54, yaw: .5 },
      { m: 'kit-fountain', x: -120, z: 70 }, { m: 'kit-ruin', x: -120, z: 20, yaw: 1.2 }, { m: 'kit-ruin', x: -60, z: -60, yaw: -.4 },
    ],
    bridges: [-260, 300], cathedral: { x: 60, z: 262 + 62, yaw: 0 }, petals: [10, 230],
  },
};

/** Havanna-Revolutionsring (Havanna): Sarah's track name and place; route, Malecón wave, beard ministry and details are Claude's elaboration (07.10.2026). */
const HV = .85;
const HAVANNA: TrackDefinition = {
  id: 'havanna', name: 'Havanna-Revolutionsring', city: 'Havanna', theme: 'havana',
  tagline: 'Malecón am offenen Meer, Prado, Kapitol-Kreisel, Altstadtgassen und Redner-Hügel',
  controlPoints: ([
    [300, 205], [200, 214], [100, 210], [0, 200], [-100, 206], [-180, 196],   // Malecón, open sea on the right
    [-232, 172], [-252, 135], [-256, 85], [-258, 30],                          // into the Prado, palms
    [-274, -10], [-270, -55], [-240, -80], [-205, -68], [-195, -35], [-172, -12], // Kapitol-Kreisel around the column
    [-130, -22], [-100, -46], [-62, -62], [-40, -92], [-2, -94], [28, -66], [70, -52], // old-town lanes, cigar-factory shortcut
    [118, -46], [160, -20], [190, 20], [214, 62],                              // Redner-Hügel with the beard ministry
    [262, 90], [318, 112], [350, 150], [342, 190],                             // back down to the seafront
  ] as const).map(([x, z]) => [x * HV, z * HV] as const),
  halfWidth: 6, start: 40, bump: 1240,
  /** Zigarrenfabrik: gravel passage through the factory yard, straight across the old-town dip. */
  shortcut: { from: 860, to: 985, halfWidth: 3, speedCap: 10.5, points: [[-60 * HV, -52 * HV], [-5 * HV, -55 * HV]], elevation: [[0, 0], [1, 0]], boostPads: [] },
  canal: { from: -1000, length: 0 },
  rampLips: [1146],
  boostPads: [[100, 0], [500, 0], [800, 0], [1120, 0], [1300, 1.5]],
  craters: [], grassVerges: [],
  elevation: [[1060, 0], [1105, 4], [1150, 4], [1195, 0]],
  hazards: [{ from: 150, to: 215, side: 1, basin: 8, kind: 'water' }],
  itemBoxes: [140, 545, 1030],
  landmarks: {
    palace: null, fountains: [], trees: [],
    column: [-200, -36], gateProgress: 520,
    lawns: [[-210, -46, -190, -26]], promenade: 5,
  },
  river: { north: 515, south: 197, west: -460, east: 520, level: -1.15 },
  ground: { west: -460, east: 520, north: 520, south: -420 },
  dressing: {
    boardRanges: [[20, 140], [420, 560]], flagRange: [600, 700], pennants: [30, 90, 450, 520, 1090], screenProgress: 70,
    districts: [
      { from: 0, to: 95, left: 'stands', right: 'quay' }, { from: 95, to: 410, left: 'colonial', right: 'quay' },
      { from: 410, to: 585, left: 'avenue', right: 'avenue' }, { from: 585, to: 790, left: 'park', right: 'colonial' },
      { from: 790, to: 1040, left: 'colonial', right: 'colonial' }, { from: 1040, to: 1200, left: 'plaza', right: 'plaza' },
      { from: 1200, to: 99999, left: 'colonial', right: 'colonial' },
    ],
    heroes: [
      { m: 'kit-cathedral', x: -330, z: -45 }, { m: 'kit-beard-ministry', s: 1120, lane: -34 }, { m: 'kit-tribune', s: 1090, lane: 22 },
      { m: 'kit-lighthouse', x: -120, z: 300, yaw: Math.PI },
    ],
    bridges: [], cathedral: null, petals: [10, 120],
  },
};

const PY = 1.05;
const EWIGE_FUEHRER_ALLEE: TrackDefinition = {
  id: 'pyongyang', name: 'Ewige-Führer-Allee', city: 'Pjöngjang', theme: 'pyongyang',
  tagline: 'Taedong-Ufer, Monumentalplatz, Parade und Unterführungs-Abkürzung',
  controlPoints: ([
    [-230, -90], [-215, -145], [-165, -190], [-90, -215], [0, -222], [90, -218],
    [165, -190], [215, -145], [238, -88], [245, -20], [238, 55], [212, 120],
    [165, 170], [95, 205], [15, 218], [-65, 210], [-135, 178], [-190, 132],
    [-225, 75], [-240, 10], [-235, -50],
  ] as const).map(([x, z]) => [x * PY, z * PY] as const),
  halfWidth: 6, start: 30, bump: -1,
  /** Underpass through the parade plaza: a lower concrete cut with two painted boost strips. */
  shortcut: {
    from: 460, to: 1320, halfWidth: 6, speedCap: 10.5,
    points: [[178 * PY, -177 * PY], [205 * PY, -128 * PY], [190 * PY, -74 * PY], [142 * PY, -25 * PY], [78 * PY, 31 * PY], [0, 87 * PY], [-78 * PY, 136 * PY], [-145 * PY, 159 * PY], [-178 * PY, 140 * PY]],
    elevation: [[0, 0], [.18, 0], [.28, -3.6], [.72, -3.6], [.82, 0], [1, 0]], boostPads: [[.32, 0], [.65, 0]],
  },
  canal: { from: -1000, length: 0 },
  rampLips: [],
  boostPads: [[70, 0], [262, 0], [906, 0], [1148, 1.5]],
  craters: [], grassVerges: [],
  elevation: [],
  hazards: [{ from: 34, to: 205, side: 1, basin: 18, kind: 'water' }],
  itemBoxes: [130, 310, 905, 1190],
  landmarks: {
    palace: null, fountains: [], trees: [[-75, 36], [82, 92], [-118, -35]].map(([x, z]) => [x * PY, z * PY]),
    column: [0, 48 * PY], gateProgress: 965, lawns: [], promenade: 5,
  },
  river: { north: -151, south: -240, west: -470, east: 480, level: -1.15 },
  ground: { west: -470, east: 480, north: 310, south: -310 },
  dressing: {
    boardRanges: [[16, 124], [270, 360], [930, 1020]], flagRange: [900, 1080], pennants: [24, 105, 300, 925, 1070], screenProgress: 348,
    districts: [
      { from: 0, to: 225, left: 'avenue', right: 'quay' }, { from: 225, to: 380, left: 'avenue', right: 'plaza' },
      { from: 380, to: 720, left: 'plaza', right: 'stands' }, { from: 720, to: 920, left: 'city', right: 'park' },
      { from: 920, to: 1110, left: 'stands', right: 'stands' }, { from: 1110, to: 99999, left: 'riverfront', right: 'avenue' },
    ],
    heroes: [], bridges: [-360, 360], cathedral: null, petals: [900, 1070], breakableFence: 88,
  },
  obstacles: [
    { s: 640, lane: -5.65, radius: .35 }, { s: 640, lane: 5.65, radius: .35 },
    { s: 760, lane: -5.65, radius: .35 }, { s: 760, lane: 5.65, radius: .35 },
  ],
};

/** Genossen-Gerade (Sarah's Moscow selection; Marcel 09.10.2026): long parade straights around a broad civic square. */
const MOSCOW: TrackDefinition = {
  ...EWIGE_FUEHRER_ALLEE,
  id: 'moscow', name: 'Genossen-Gerade', city: 'Moskau', theme: 'moscow',
  tagline: 'Breite Parade-Geraden, Roter Platz und riskante Platzquerung',
  controlPoints: [
    [-300,-240],[-150,-240],[0,-240],[150,-240],[285,-240],[335,-205],[350,-130],[350,0],[350,130],[335,205],[285,240],
    [150,240],[0,240],[-150,240],[-285,240],[-335,205],[-350,130],[-350,0],[-350,-130],[-335,-205],
  ],
  halfWidth: 8, start: 95, bump: -1,
  shortcut: { from: 650, to: 1900, halfWidth: 4.2, speedCap: 11.2,
    points: [[318,-178],[270,-132],[200,-88],[110,-32],[10,28],[-105,78],[-235,92],[-322,73]],
    elevation: [[0,0],[1,0]], boostPads: [] },
  canal: { from: -1000, length: 0 }, rampLips: [1050],
  boostPads: [[230,0],[1210,0],[2340,0]], craters: [[850,-5,1.8],[860,4,1.8]],
  grassVerges: [], elevation: [], hazards: [],
  itemBoxes: [150,590,1070,1680,2280],
  landmarks: { palace: null, fountains: [[0,0]], trees: [[-60,60],[60,-60]], column: [0,0], gateProgress: 2240, lawns: [], promenade: 7 },
  river: { north: 365, south: 325, west: -480, east: 480, level: -1.15 },
  ground: { west: -500, east: 500, north: 420, south: -340 },
  dressing: {
    boardRanges: [[0,260],[980,1320],[2130,2470]], flagRange: [620,980], pennants: [45,220,1160,2240,2460], screenProgress: 310,
    districts: [
      { from:0,to:300,left:'stands',right:'avenue' }, { from:300,to:520,left:'avenue',right:'avenue' }, { from:520,to:990,left:'plaza',right:'plaza' },
      { from:990,to:1500,left:'plaza',right:'avenue' }, { from:1500,to:2050,left:'avenue',right:'plaza' },
      { from:2050,to:99999,left:'avenue',right:'avenue' },
    ],
    // 10.10.2026: Kremlin-like wall with towers along the north side of the square and the onion-domed cathedral.
    heroes: [{ m:'kit-palace',s:760,lane:24 },{ m:'kit-obelisk',s:1200,lane:-24 },{ m:'kit-stand-moscow',s:2200,lane:19 },
      { m:'kit-kremlin-tower', x:-200, z:200 }, { m:'kit-kremlin-tower', x:0, z:200 }, { m:'kit-kremlin-tower', x:200, z:200 },
      ...[20,46,72,98,124,150,175].flatMap((x) => [{ m:'kit-kremlin-wall', x, z:205 }, { m:'kit-kremlin-wall', x:-x, z:205 }]),
      { m:'kit-onion-church', x:-150, z:150 }],
    bridges: [320,2240], cathedral: null, petals: [650,850],
  },
  obstacles: [{ s:1050,lane:-7.5,radius:.38 },{ s:1050,lane:7.5,radius:.38 }],
};

/**
 * Kulturrevolutions-Schleife (Peking): name and place from the planned circuit list; route and world are Claude's
 * elaboration (10.10.2026). Clockwise around a walled palace: Platz der Planerfüllung (start), hutong quarter with the
 * Tor des ewigen Fortschritts, a narrow hutong-alley shortcut through the north-west corner, the Regelheft serpentine,
 * a plateau jump on the east avenue and the palace moat. Satire of dogma and plan statistics, never of victims.
 */
const BEIJING: TrackDefinition = {
  id: 'beijing', name: 'Kulturrevolutions-Schleife', city: 'Peking', theme: 'beijing',
  tagline: 'Platz der Planerfüllung, Hutong-Gasse, Regelheft-Serpentine und Palastgraben',
  controlPoints: [
    [100, -204], [0, -208], [-100, -208], [-200, -205], [-232, -185], [-250, -145],    // Platz der Planerfüllung, westbound
    [-254, -80], [-255, -10], [-254, 60], [-250, 125], [-222, 160],                    // hutong avenue through the gate
    [-165, 170], [-110, 168], [-60, 148], [-10, 170], [40, 150], [95, 168],            // Regelheft serpentine
    [150, 160], [195, 135], [220, 90], [228, 30], [228, -40], [224, -100],             // east avenue with the plateau jump
    [208, -152], [165, -190],                                                          // along the palace moat, back to the square
  ],
  halfWidth: 6, start: 70, bump: -1,
  /** Hutong-Gasse: narrow gravel alley across the north-west corner, past washing lines and tea houses. */
  shortcut: { from: 590, to: 790, halfWidth: 3, speedCap: 10.5, points: [[-232, 95], [-208, 128], [-178, 152]], elevation: [[0, 0], [1, 0]], boostPads: [] },
  canal: { from: -1000, length: 0 },
  rampLips: [1296],
  boostPads: [[120, 0], [470, 0], [1000, 0], [1235, 0], [1505, 1.5]],
  craters: [], grassVerges: [],
  /** Plateau on the east avenue: climb, a short flat top and a jump off its lip. */
  elevation: [[1225, 0], [1262, 3.8], [1300, 3.8], [1340, 0]],
  hazards: [{ from: 1348, to: 1430, side: 1, basin: 9, kind: 'water' }],
  itemBoxes: [150, 480, 905, 1190, 1470],
  landmarks: {
    palace: null, fountains: [], trees: [[-40, 60], [40, -20], [-150, 40]],
    column: [-150, -120], gateProgress: 520, lawns: [[-200, -40, -90, 110]], promenade: 5,
  },
  river: { north: 278, south: 228, west: -360, east: 340, level: -1.15 },
  ground: { west: -360, east: 340, north: 340, south: -300 },
  dressing: {
    boardRanges: [[10, 150], [1230, 1330]], flagRange: [880, 1000], pennants: [30, 230, 470, 1010, 1500], screenProgress: 240,
    districts: [
      { from: 0, to: 300, left: 'stands', right: 'plaza' }, { from: 300, to: 420, left: 'hutong', right: 'hutong' },
      { from: 420, to: 650, left: 'hutong', right: 'avenue' }, { from: 650, to: 780, left: 'park', right: 'hutong' },
      { from: 780, to: 1060, left: 'hutong', right: 'park' }, { from: 1060, to: 1220, left: 'park', right: 'hutong' },
      { from: 1220, to: 1340, left: 'avenue', right: 'plaza' }, { from: 1340, to: 1450, left: 'hutong', right: 'plaza' },
      { from: 1450, to: 99999, left: 'stands', right: 'plaza' },
    ],
    heroes: [
      { m: 'kit-cn-hall', x: 95, z: -55 }, { m: 'kit-pagoda', x: -60, z: 30 }, { m: 'kit-rulebook', s: 190, lane: 22 },
      ...[1352, 1390, 1428].map((s) => ({ m: 'kit-cn-wall', s, lane: 22.5 })),
      { m: 'kit-pagoda', x: -300, z: -250 },
    ],
    bridges: [-140, 80], cathedral: null, petals: [10, 260],
  },
};

export const TRACKS: Record<TrackId, TrackDefinition> = { stadionring: STADIONRING, 'duce-drom': DUCE_DROM, havanna: HAVANNA, pyongyang: EWIGE_FUEHRER_ALLEE, moscow: MOSCOW, beijing: BEIJING };
export const isTrackId = (id: unknown): id is TrackId => id === 'stadionring' || id === 'duce-drom' || id === 'havanna' || id === 'pyongyang' || id === 'moscow' || id === 'beijing';

export interface TrackSample { x: number; z: number; heading: number; s: number; curvature: number }

/** Centripetal Catmull-Rom through closed control points, resampled to near-constant spacing. */
export function sampleTrack(points: readonly (readonly [number, number])[] = TRACK_CONTROL_POINTS, spacing = .5): { samples: TrackSample[]; length: number } {
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

// --- Live bindings of the active circuit ---------------------------------------------------------------
export let TRACK_INFO: TrackDefinition = STADIONRING;
export let TRACK_CONTROL_POINTS = STADIONRING.controlPoints;
export let TRACK_HALF_WIDTH = STADIONRING.halfWidth;
/** Start / finish line in progress metres. */
export let START_PROGRESS = STADIONRING.start;
/** Raised cobble hump: progress metres of its crest. */
export let BUMP_PROGRESS = STADIONRING.bump;
export let SHORTCUT = STADIONRING.shortcut;
export let CANAL_FROM = STADIONRING.canal.from, CANAL_LENGTH = STADIONRING.canal.length;
export const RAMP_LENGTH = 9, RAMP_HEIGHT = 1;
/** Take-off ramps: lip progress. */
export let RAMP_LIPS = STADIONRING.rampLips;
/** Glowing boost pads [progress start, lane centre]; 6 m long, 3 m wide, same effect for everyone. */
export let BOOST_PADS = STADIONRING.boostPads;
/** Marked shell craters [progress, lane, radius]; avoidable. */
export let CRATERS = STADIONRING.craters;
/** Short turf verges on the raceable edge; [from, to, lane start, lane end]. */
export let GRASS_VERGES = STADIONRING.grassVerges;
export let ELEVATION = STADIONRING.elevation;
/** Open-edge hazards (water basins, furnace, cliff). */
export let HAZARDS = STADIONRING.hazards;
export let ITEM_BOX_PROGRESS = STADIONRING.itemBoxes;
export let LANDMARKS = STADIONRING.landmarks;
export let RIVER = STADIONRING.river;
export let GROUND = STADIONRING.ground;

/** Switches every layout binding to another circuit. Call `selectTrack` (track.ts) to also rebuild the centreline. */
export function setTrackLayout(id: TrackId): TrackDefinition {
  const t = TRACKS[id];
  TRACK_INFO = t; TRACK_CONTROL_POINTS = t.controlPoints; TRACK_HALF_WIDTH = t.halfWidth; START_PROGRESS = t.start; BUMP_PROGRESS = t.bump;
  SHORTCUT = t.shortcut; CANAL_FROM = t.canal.from; CANAL_LENGTH = t.canal.length; RAMP_LIPS = t.rampLips; BOOST_PADS = t.boostPads;
  CRATERS = t.craters; GRASS_VERGES = t.grassVerges; ELEVATION = t.elevation; HAZARDS = t.hazards; ITEM_BOX_PROGRESS = t.itemBoxes;
  LANDMARKS = t.landmarks; RIVER = t.river; GROUND = t.ground;
  return t;
}

/** Raised road spans [from, to] where the elevation profile lifts the road (for retaining walls and parapets). */
export function raisedSpans(): [number, number][] {
  const spans: [number, number][] = [];
  for (let i = 0; i < ELEVATION.length - 1; i++) {
    const [a, ha] = ELEVATION[i], [b, hb] = ELEVATION[i + 1];
    if (ha <= 0 && hb <= 0) continue;
    const last = spans.at(-1);
    if (last && Math.abs(last[1] - a) < 1e-6) last[1] = b; else spans.push([a, b]);
  }
  return spans;
}
