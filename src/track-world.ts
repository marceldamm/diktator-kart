import type { Scene } from '@babylonjs/core/scene';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Matrix, Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import type { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { TRACK, trackPoint, trackHeightAt, shortcutLocate, shortcutPoint, SHORTCUT_LENGTH } from './track';
import { BOOST_PADS, CANAL_FROM, CANAL_LENGTH, CRATERS, HAZARDS, LANDMARKS, MAP_SCALE, RAMP_HEIGHT, RAMP_LENGTH, RAMP_LIPS, SHORTCUT } from './track-layout';
import { surfaceTextures } from './surface-textures';
import {addPeriodDetails} from './period-details';

/** Track furniture generated from the shared centreline: one mesh per material wherever possible. */
export interface TrackWorld { animate(time: number): void; glowMeshes: Mesh[]; setWet(wet: boolean): void; setSnow(snow: boolean): void; puddles: { x: number; z: number; r: number }[] }

const W = TRACK.halfWidth;
/** Progress ranges dressed with slogan boards instead of plain striped barriers. */
const BOARD_RANGES: [number, number][] = [[2 * MAP_SCALE, 92 * MAP_SCALE], [282 * MAP_SCALE, 372 * MAP_SCALE]];
const HARBOUR_GAP: [number, number][] = HAZARDS.map((h) => [h.from, h.to] as [number, number]);

function pbr(scene: Scene, name: string, hex: string, metal = 0, roughness = .7): PBRMaterial {
  const m = new PBRMaterial(name, scene); m.albedoColor = Color3.FromHexString(hex);
  m.metallic = metal; m.roughness = roughness; return m;
}

function canvasTexture(scene: Scene, name: string, width: number, height: number, paint: (c: CanvasRenderingContext2D) => void, alpha = false): DynamicTexture {
  const t = new DynamicTexture(name, { width, height }, scene, true);
  const c = t.getContext() as CanvasRenderingContext2D;
  paint(c); t.hasAlpha = alpha; t.update(); t.wrapU = Texture.WRAP_ADDRESSMODE; t.anisotropicFilteringLevel = 8;
  return t;
}

/**
 * Sweeps a cross-section profile (lane offset, height) along the centreline.
 * u runs along the track in metres / uScale, v along the profile in metres / vScale.
 */
function sweep(scene: Scene, name: string, profile: [number, number][], material: PBRMaterial | StandardMaterial,
  options: { uScale: number; vScale?: number; step?: number; from?: number; to?: number; follow?: boolean; color?: (s: number, lane: number) => [number, number, number]; at?: (s: number, lane: number) => { x: number; z: number } }): Mesh {
  const { uScale, vScale = 1, step = 1, from = 0, to = TRACK.length, follow = false } = options;
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [], colors: number[] = [];
  const along: number[] = [0];
  for (let i = 1; i < profile.length; i++) along.push(along[i - 1] + Math.hypot(profile[i][0] - profile[i - 1][0], profile[i][1] - profile[i - 1][1]));
  const rings = Math.max(1, Math.round((to - from) / step));
  for (let r = 0; r <= rings; r++) {
    const s = from + (to - from) * r / rings;
    profile.forEach(([lane, height], j) => {
      const p = (options.at ?? trackPoint)(s, lane);
      positions.push(p.x, height + (follow ? trackHeightAt(p.x, p.z) : 0), p.z);
      uvs.push(s / uScale, along[j] / vScale);
      if (options.color) { const [cr, cg, cb] = options.color(s, lane); colors.push(cr, cg, cb, 1); }
    });
    if (r < rings) for (let j = 0; j < profile.length - 1; j++) {
      const a = r * profile.length + j, b = a + profile.length;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  const mesh = new Mesh(name, scene), data = new VertexData(), normals: number[] = [];
  VertexData.ComputeNormals(positions, indices, normals);
  data.positions = positions; data.indices = indices; data.normals = normals; data.uvs = uvs;
  if (options.color) data.colors = colors;
  data.applyToMesh(mesh); mesh.material = material; mesh.receiveShadows = true; mesh.isPickable = false;
  mesh.freezeWorldMatrix();
  return mesh;
}

/** Original fictional emblem: laurel wreath, crown and paragraph sign. No historical insignia. */
export function paintEmblem(c: CanvasRenderingContext2D, cx: number, cy: number, r: number, gold = '#e2b65c', shade = '#8d5f1f'): void {
  c.save(); c.translate(cx, cy);
  for (const side of [-1, 1]) for (let i = 0; i < 9; i++) {
    const a = Math.PI * (.62 + i * .085), x = Math.cos(a) * r * side * -1, y = Math.sin(a) * r * .95;
    c.save(); c.translate(x, y); c.rotate(side * (a - Math.PI / 2) + (side > 0 ? Math.PI : 0) * 0);
    c.fillStyle = i % 2 ? gold : shade; c.beginPath(); c.ellipse(0, 0, r * .2, r * .085, side * (a + .5), 0, Math.PI * 2); c.fill(); c.restore();
  }
  c.fillStyle = gold; c.beginPath();
  const w = r * .62, top = -r * .72;
  c.moveTo(-w, top + r * .42); c.lineTo(-w, top); c.lineTo(-w * .5, top + r * .2); c.lineTo(0, top - r * .1);
  c.lineTo(w * .5, top + r * .2); c.lineTo(w, top); c.lineTo(w, top + r * .42); c.closePath(); c.fill();
  for (const x of [-w, 0, w]) { c.beginPath(); c.arc(x, top - (x ? 0 : r * .1), r * .08, 0, Math.PI * 2); c.fill(); }
  c.font = `bold ${Math.round(r * 1.05)}px Georgia`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillStyle = shade; c.fillText('§', r * .03, r * .26 + r * .03); c.fillStyle = gold; c.fillText('§', 0, r * .26);
  c.restore();
}

/** Progress ranges on the inner (left) side where the backyard alley opens the circuit edge. */
function alleyGaps(lane: number): [number, number][] {
  const gaps: [number, number][] = []; let open: number | null = null;
  for (let s = SHORTCUT.from - 20; s <= SHORTCUT.to + 20; s += .5) {
    const p = trackPoint(s, lane), inside = Math.abs(shortcutLocate(p.x, p.z).lane) <= SHORTCUT.halfWidth + .9;
    if (inside && open === null) open = s; if (!inside && open !== null) { gaps.push([open - .5, s + .5]); open = null; }
  }
  return gaps;
}
/** Splits [from, to] around gap ranges. */
function without(from: number, to: number, gaps: [number, number][]): [number, number][] {
  let parts: [number, number][] = [[from, to]];
  for (const [a, b] of gaps) parts = parts.flatMap(([x, y]) => b <= x || a >= y ? [[x, y] as [number, number]] : [[x, a], [b, y]].filter(([p, q]) => q - p > .3) as [number, number][]);
  return parts;
}

export function addTrackWorld(scene: Scene, shadow: ShadowGenerator): TrackWorld {
  addPeriodDetails(scene,shadow);
  const wallGaps = alleyGaps(-(W + 1.2)), edgeGaps = alleyGaps(-(W + .5)), promenadeGaps = [...alleyGaps(-(W + 3)), ...alleyGaps(-(W + 5.5))];
  // Cobbles at their real 2 m tile scale; slow tonal variation hides tiling and marks a worn racing line.
  const road = pbr(scene, 'Cobblestone boulevard', '#d8d2c2', 0, 1);
  road.albedoTexture = new Texture('/assets/textures/cobble-color.jpg', scene);
  road.bumpTexture = new Texture('/assets/textures/cobble-normal.jpg', scene);
  road.metallicTexture = new Texture('/assets/textures/cobble-arm.jpg', scene);
  road.useRoughnessFromMetallicTextureAlpha = false; road.useRoughnessFromMetallicTextureGreen = true;
  road.useMetallnessFromMetallicTextureBlue = true; road.useAmbientOcclusionFromMetallicTextureRed = true;
  road.invertNormalMapX = true; road.bumpTexture.level = .8;
  for (const t of [road.albedoTexture, road.bumpTexture, road.metallicTexture]) { t.wrapU = t.wrapV = Texture.WRAP_ADDRESSMODE; t.anisotropicFilteringLevel = 8; }
  const waterRipple = canvasTexture(scene, 'Soft flowing water normals', 256, 128, (c) => {
    c.fillStyle = '#8080ff'; c.fillRect(0, 0, 256, 128);
    for (let row = 0; row < 13; row++) {
      c.strokeStyle = row % 2 ? 'rgba(112,128,232,.42)' : 'rgba(150,128,245,.35)'; c.lineWidth = 2;
      c.beginPath();
      for (let x = 0; x <= 256; x += 8) {
        const y = row * 10 + Math.sin(x * .045 + row * .9) * 2.5;
        if (x === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.stroke();
    }
  });
  waterRipple.uScale = 10; waterRipple.vScale = 1.8;
  const roadLanes: [number, number][] = [-W, -W * .6, -W * .25, 0, W * .25, W * .6, W].map((lane) => [lane, .02]);
  sweep(scene, 'Racing surface', roadLanes, road, { uScale: 2, vScale: 2, step: .75, follow: true, color: (s, lane) => {
    const wear = Math.exp(-((lane - Math.sin(s * .021) * 1.6) ** 2) / 5) * .16;
    const tone = .93 + Math.sin(s * .047) * .05 + Math.sin(s * .13 + lane) * .025 - wear;
    return [tone, tone * .985, tone * .96];
  } });

  // City ground: a paved square everywhere; lawn only on the bounded park islands.
  const square = pbr(scene, 'City square paving', '#b9ab8f', 0, 1);
  square.albedoTexture = new Texture('/assets/textures/herringbone-diff.jpg', scene);
  square.bumpTexture = new Texture('/assets/textures/herringbone-nor_gl.jpg', scene);
  for (const t of [square.albedoTexture, square.bumpTexture] as Texture[]) { t.uScale = t.vScale = 130; t.anisotropicFilteringLevel = 8; }
  const ground = MeshBuilder.CreateGround('Park and city terrain', { width: 520, height: 520 }, scene);
  ground.material = square; ground.receiveShadows = true; ground.isPickable = false; ground.freezeWorldMatrix();
  const lawn = pbr(scene, 'Park lawn', '#4d5f3a', 0, .95);
  const lawnMaps = surfaceTextures(scene, 'Lawn', 'grass'); lawn.albedoTexture = lawnMaps.color; lawn.bumpTexture = lawnMaps.normal;
  lawnMaps.color.uScale = lawnMaps.color.vScale = 18; lawnMaps.normal.uScale = lawnMaps.normal.vScale = 18;
  for (const [x0, z0, x1, z1] of LANDMARKS.lawns) {
    const island = MeshBuilder.CreateGround('Park lawn island', { width: x1 - x0, height: z1 - z0 }, scene);
    island.position.set((x0 + x1) / 2, .05, (z0 + z1) / 2); island.material = lawn; island.receiveShadows = true; island.isPickable = false; island.freezeWorldMatrix();
  }

  // Painted kerbs and the start line.
  const kerbTexture = canvasTexture(scene, 'Kerb stripes', 256, 32, (c) => {
    c.fillStyle = '#f1e7d2'; c.fillRect(0, 0, 256, 32); c.fillStyle = '#b3262b'; c.fillRect(0, 0, 128, 32);
    c.fillStyle = '#0003'; c.fillRect(0, 28, 256, 4);
  });
  const kerb = pbr(scene, 'Painted kerb', '#ffffff', 0, .55); kerb.albedoTexture = kerbTexture;
  for (const side of [-1, 1]) for (const [from, to] of side < 0 ? without(0, TRACK.length, edgeGaps) : [[0, TRACK.length]]) sweep(scene, `Kerb ${side}`, side < 0 ? [[-W - .95, .08], [-W - .1, .05], [-W, .025]] : [[W, .025], [W + .1, .05], [W + .95, .08]], kerb, { uScale: 2.4, step: .6, from, to });
  const checker = canvasTexture(scene, 'Start checker', 256, 64, (c) => {
    for (let x = 0; x < 16; x++) for (let y = 0; y < 4; y++) { c.fillStyle = (x + y) % 2 ? '#111618' : '#f3eee0'; c.fillRect(x * 16, y * 16, 16, 16); }
  });
  const startMaterial = pbr(scene, 'Start line paint', '#ffffff', 0, .6); startMaterial.albedoTexture = checker;
  const start = sweep(scene, 'Start finish line', [[-W, .031], [W, .031]], startMaterial, { uScale: 1, step: .5, from: TRACK.start - .5, to: TRACK.start + .5 });
  start.material = startMaterial;
  const lineUv = start.getVerticesData('uv')!; for (let i = 0; i < lineUv.length; i += 2) { const u = lineUv[i]; lineUv[i] = lineUv[i + 1] * 2.5; lineUv[i + 1] = u - (TRACK.start - .5); }
  start.setVerticesData('uv', lineUv);

  // Barrier walls: striped racing barrier, or slogan boards along the two long straights.
  const stripes = canvasTexture(scene, 'Barrier stripes', 512, 256, (c) => {
    c.fillStyle = '#efe4c8'; c.fillRect(0, 0, 512, 256); c.fillStyle = '#a3242a'; c.fillRect(0, 0, 256, 150);
    c.fillStyle = '#efe4c8'; c.fillRect(256, 0, 256, 150);
    c.fillStyle = '#c9a25a'; c.fillRect(0, 150, 512, 14); c.fillStyle = '#e9e0cc'; c.fillRect(0, 164, 512, 50);
    c.fillStyle = '#6b6355'; c.fillRect(0, 214, 512, 42); c.fillStyle = '#0002'; c.fillRect(0, 0, 512, 10);
  });
  const slogans = ['ANTRAG GENEHMIGT', 'JUBEL IST PFLICHT', 'FORMULAR 08/15', 'ÜBERHOLEN NUR MIT STEMPEL'];
  const boards = canvasTexture(scene, 'Slogan boards', 2048, 256, (c) => {
    c.fillStyle = '#e9e0cc'; c.fillRect(0, 0, 2048, 256);
    slogans.forEach((text, i) => {
      const x = i * 512; c.fillStyle = i % 2 ? '#123b3c' : '#6d1b23'; c.fillRect(x + 4, 6, 504, 140);
      c.strokeStyle = '#d7b46a'; c.lineWidth = 5; c.strokeRect(x + 14, 16, 484, 120);
      paintEmblem(c, x + 62, 76, 40);
      c.fillStyle = '#f2dfae'; c.font = `bold ${text.length > 18 ? 30 : 38}px Georgia`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, x + 290, 78);
    });
    c.fillStyle = '#c9a25a'; c.fillRect(0, 150, 2048, 14); c.fillStyle = '#6b6355'; c.fillRect(0, 214, 2048, 42);
  });
  const barrier = pbr(scene, 'Striped racing barrier', '#ffffff', .02, .62); barrier.albedoTexture = stripes;
  const board = pbr(scene, 'Slogan barrier boards', '#ffffff', .05, .5); board.albedoTexture = boards;
  const wall = (side: number): [number, number][] => {
    const a = W + 1, b = W + 1.45, s = side;
    return [[s * a, 0], [s * a, .78], [s * (a + .06), .9], [s * (b - .05), .9], [s * b, .78], [s * b, 0]];
  };
  const walls: Mesh[] = [];
  const ranges: { from: number; to: number; boards: boolean }[] = [];
  let cursor = 0;
  for (const [a, b] of BOARD_RANGES) { ranges.push({ from: cursor, to: a, boards: false }, { from: a, to: b, boards: true }); cursor = b; }
  ranges.push({ from: cursor, to: TRACK.length, boards: false });
  for (const range of ranges) for (const side of [-1, 1]) for (const [from, to] of side < 0 ? without(range.from, range.to, wallGaps) : without(range.from, range.to, HARBOUR_GAP)) {
    const profile = side < 0 ? wall(-1).reverse() : wall(1);
    // Only the face toward the road (first two profile points) carries the stripes; v is normalised.
    const mesh = sweep(scene, `Barrier ${side}`, profile, range.boards ? board : barrier, { uScale: range.boards ? 32 : 4.8, vScale: 2.4, step: .8, from, to });
    if (side < 0) { const uv = mesh.getVerticesData('uv')!; for (let i = 0; i < uv.length; i += 2) uv[i + 1] = 2.38 / 2.4 - uv[i + 1]; mesh.setVerticesData('uv', uv); }
    walls.push(mesh);
  }
  for (const mesh of walls) shadow.addShadowCaster(mesh);

  // Raised herringbone promenades behind the barriers.
  const paving = pbr(scene, 'Herringbone promenade', '#cbbda0', 0, 1);
  paving.albedoTexture = new Texture('/assets/textures/herringbone-diff.jpg', scene);
  paving.bumpTexture = new Texture('/assets/textures/herringbone-nor_gl.jpg', scene);
  paving.metallicTexture = new Texture('/assets/textures/herringbone-arm.jpg', scene);
  paving.useRoughnessFromMetallicTextureAlpha = false; paving.useRoughnessFromMetallicTextureGreen = true;
  paving.useMetallnessFromMetallicTextureBlue = true; paving.useAmbientOcclusionFromMetallicTextureRed = true;
  for (const t of [paving.albedoTexture, paving.bumpTexture, paving.metallicTexture]) { t.wrapU = t.wrapV = Texture.WRAP_ADDRESSMODE; t.anisotropicFilteringLevel = 8; }
  const kerbStone = pbr(scene, 'Granite edge', '#8e8676', 0, .8);
  for (const side of [-1, 1]) {
    const outer = W + 1.45 + LANDMARKS.promenade;
    const lanes: [number, number][] = side < 0 ? [[-outer, .14], [-W - 1.45, .14]] : [[W + 1.45, .14], [outer, .14]];
    for (const [from, to] of side < 0 ? without(0, TRACK.length, promenadeGaps) : without(0, TRACK.length, HARBOUR_GAP)) {
      sweep(scene, `Promenade ${side}`, lanes, paving, { uScale: 3, vScale: 3, step: 1.2, from, to });
      sweep(scene, `Promenade edge ${side}`, side < 0 ? [[-outer - .3, 0], [-outer, .14]] : [[outer, .14], [outer + .3, 0]], kerbStone, { uScale: 1, step: 2, from, to });
    }
  }
  const boostPads: Mesh[] = [], hazardGlow: Mesh[] = [];
  { // Canal across the road (in front of the grandstands) with a timber take-off ramp.
    const canalWater = pbr(scene, 'Canal water', '#1d3b44', .25, .08); canalWater.alpha = .95;
    canalWater.bumpTexture = waterRipple; waterRipple.level = .16;
    sweep(scene, 'Canal water', [[-W - 1.3, .04], [W + 1.3, .04]], canalWater, { uScale: 2, step: .5, from: CANAL_FROM, to: CANAL_FROM + CANAL_LENGTH });
    const edge = pbr(scene, 'Canal hazard edge', '#ffffff', 0, .6);
    edge.albedoTexture = canvasTexture(scene, 'Canal edge stripes', 128, 16, (c) => { c.fillStyle = '#1a1a1a'; c.fillRect(0, 0, 128, 16); c.fillStyle = '#e8b82a'; for (let x = -16; x < 128; x += 32) { c.beginPath(); c.moveTo(x, 16); c.lineTo(x + 16, 0); c.lineTo(x + 32, 0); c.lineTo(x + 16, 16); c.fill(); } });
    for (const at of [CANAL_FROM + CANAL_LENGTH - .4]) sweep(scene, 'Canal landing edge', [[-W - 1.3, .07], [W + 1.3, .07]], edge, { uScale: 4, step: .4, from: at, to: at + .4 });
    const planks = canvasTexture(scene, 'Ramp planks', 256, 256, (c) => { c.fillStyle = '#7a5532'; c.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 32) { c.fillStyle = y % 64 ? '#6b4a2b' : '#835c37'; c.fillRect(0, y + 2, 256, 28); }
      c.strokeStyle = '#e8b82a'; c.lineWidth = 14; for (let y = 40; y < 256; y += 90) { c.beginPath(); c.moveTo(40, y + 40); c.lineTo(128, y); c.lineTo(216, y + 40); c.stroke(); } });
    const rampMaterial = pbr(scene, 'Timber ramp', '#ffffff', 0, .8); rampMaterial.albedoTexture = planks; rampMaterial.backFaceCulling = false;
    for (const end of RAMP_LIPS) {
      const paths: Vector3[][] = [];
      // The road follows the same ramp profile; lift the timber by a thin plank thickness to avoid coplanar flicker.
      for (const lane of [-W - 1, W + 1]) { const path: Vector3[] = []; for (let k = 0; k <= 12; k++) { const s = end - RAMP_LENGTH + k / 12 * RAMP_LENGTH, p = trackPoint(s, lane); path.push(new Vector3(p.x, .07 + RAMP_HEIGHT * k / 12, p.z)); } paths.push(path); }
      const ramp = MeshBuilder.CreateRibbon('Take-off ramp', { pathArray: paths, sideOrientation: Mesh.DOUBLESIDE }, scene); ramp.material = rampMaterial; ramp.isPickable = false; ramp.receiveShadows = true; shadow.addShadowCaster(ramp);
      const lip = [-W - 1, W + 1].map((lane) => { const p = trackPoint(end, lane); return [new Vector3(p.x, RAMP_HEIGHT + .07, p.z), new Vector3(p.x, -.2, p.z)]; });
      const face = MeshBuilder.CreateRibbon('Ramp end face', { pathArray: [lip.map((l) => l[0]), lip.map((l) => l[1])], sideOrientation: Mesh.DOUBLESIDE }, scene); face.material = rampMaterial; face.isPickable = false;
    }
  }
  { // Shell craters: scorched dirt decals with a raised rim and a training-ground sign (abstract, no real place).
    const scorch = canvasTexture(scene, 'Crater scorch', 256, 256, (c) => { const g = c.createRadialGradient(128, 128, 10, 128, 128, 126); g.addColorStop(0, '#1b140e'); g.addColorStop(.55, '#3a2a1c'); g.addColorStop(.8, '#5b4630'); g.addColorStop(1, 'rgba(91,70,48,0)'); c.fillStyle = g; c.fillRect(0, 0, 256, 256); }, true);
    const scorchMaterial = new StandardMaterial('Crater scorch', scene); scorchMaterial.diffuseTexture = scorch; scorchMaterial.useAlphaFromDiffuseTexture = true; scorchMaterial.specularColor = Color3.Black(); scorchMaterial.zOffset = -2;
    const dirt = pbr(scene, 'Crater dirt rim', '#5b4630', 0, .95);
    for (const [s, lane, r] of CRATERS) { const p = trackPoint(s, lane);
      const decal = MeshBuilder.CreateGround('Crater decal', { width: r * 2.6, height: r * 2.6 }, scene); decal.position.set(p.x, .045, p.z); decal.material = scorchMaterial; decal.isPickable = false;
      const rim = MeshBuilder.CreateTorus('Crater rim', { diameter: r * 2, thickness: .32, tessellation: 20 }, scene); rim.position.set(p.x, .02, p.z); rim.scaling.y = .35; rim.material = dirt; rim.isPickable = false; }
    const sign = canvasTexture(scene, 'Training ground sign', 512, 256, (c) => { c.fillStyle = '#e8b82a'; c.fillRect(0, 0, 512, 256); c.fillStyle = '#141414'; c.fillRect(12, 12, 488, 232); c.fillStyle = '#e8b82a'; c.textAlign = 'center';
      c.font = 'bold 44px Georgia'; c.fillText('STAATLICHES', 256, 80); c.fillText('ÜBUNGSGELÄNDE', 256, 135); c.font = '26px Georgia'; c.fillText('Trichter bitte umfahren', 256, 195); });
    const signMaterial = pbr(scene, 'Training ground sign', '#ffffff', 0, .6); signMaterial.albedoTexture = sign;
    const at = trackPoint(CRATERS[0][0] - 8, -(W + 2.5)); const board = MeshBuilder.CreatePlane('Training ground sign', { width: 2.6, height: 1.3 }, scene);
    board.material = signMaterial; board.position.set(at.x, 2.3, at.z); board.rotation.y = at.heading + Math.PI; board.isPickable = false; }
  { // Boost pads: glowing chevrons painted on the cobbles.
    const chevrons = canvasTexture(scene, 'Boost chevrons', 128, 256, (c) => { c.fillStyle = '#3a1608'; c.fillRect(0, 0, 128, 256); c.strokeStyle = '#ffb21e'; c.lineWidth = 16; c.lineJoin = 'miter';
      for (let y = 30; y < 256; y += 64) { c.beginPath(); c.moveTo(14, y + 34); c.lineTo(64, y); c.lineTo(114, y + 34); c.stroke(); } });
    const padMaterial = new StandardMaterial('Boost pad', scene); padMaterial.diffuseTexture = chevrons; padMaterial.emissiveTexture = chevrons; padMaterial.emissiveColor = new Color3(1, .8, .4); padMaterial.specularColor = Color3.Black();
    for (const [from, centre] of BOOST_PADS) { const pad = sweep(scene, 'Boost pad', [[centre - 1.5, .05], [centre + 1.5, .05]], padMaterial, { uScale: 1, vScale: 1, step: .5, from, to: from + 6 }); boostPads.push(pad); }
  }
  for (const zone of HAZARDS) { // Open-edge hazard: water basin or furnace pit, quay walls, warning edge, signs and the salvage crane.
    const { from, to } = zone, inner = W + 1.2, outer = W + zone.basin, lava = zone.kind === 'lava', cliff = zone.kind === 'cliff';
    const water = pbr(scene, lava ? 'Furnace glow' : 'Harbour water', lava ? '#ff5a12' : '#1d3b44', lava ? 0 : .25, lava ? .9 : .08); if (!lava) water.alpha = .93;
    if (!lava && !cliff) { water.bumpTexture = waterRipple; waterRipple.level = .16; }
    if (cliff) { // painted abyss: rock strata fading into darkness
      const abyss = canvasTexture(scene, 'Abyss', 64, 256, (c) => { const g = c.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#5c5246'); g.addColorStop(.12, '#3a332b'); g.addColorStop(.35, '#120f0c'); g.addColorStop(1, '#000000'); c.fillStyle = g; c.fillRect(0, 0, 64, 256);
        c.fillStyle = 'rgba(120,105,85,.35)'; for (let y = 6; y < 70; y += 9) c.fillRect(0, y, 64, 2); });
      water.albedoTexture = abyss; water.albedoColor = Color3.White(); water.roughness = 1; water.metallic = 0; water.alpha = 1; }
    if (lava) { // dark crust plates with glowing cracks
      const crust = canvasTexture(scene, 'Furnace crust', 256, 256, (c) => { c.fillStyle = '#ff7a18'; c.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 26; i++) { const x = (i * 53) % 256, y = (i * 97) % 256, r = 18 + (i * 7) % 22; c.fillStyle = i % 3 ? '#2a1208' : '#4a1d0a'; c.beginPath();
          for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2, rr = r * (.7 + ((i + k) * 37 % 10) / 30); c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.fill(); } });
      water.albedoTexture = crust; water.emissiveTexture = crust; water.emissiveColor = new Color3(1, .55, .25); }
    const surface = sweep(scene, lava ? 'Furnace glow' : 'Harbour water', [[inner, .03], [outer, .03]], water, { uScale: 2, step: 1, from, to }); if (lava) hazardGlow.push(surface);
    sweep(scene, 'Harbour basin floor', [[inner, -1.6], [outer, -1.6]], kerbStone, { uScale: 2, step: 2, from, to });
    sweep(scene, 'Quay wall', [[inner, .14], [inner, -1.6]], kerbStone, { uScale: 1, step: 1, from, to });
    sweep(scene, 'Basin far wall', [[outer, -1.6], [outer, .5], [outer + .6, .5]], kerbStone, { uScale: 1, step: 1, from, to });
    for (const [a, b] of [[from - 1, from], [to, to + 1]]) sweep(scene, 'Basin end wall', [[inner, .5], [outer, .5]], kerbStone, { uScale: 1, step: .5, from: a, to: b });
    const hazard = pbr(scene, 'Quay hazard stripes', '#ffffff', 0, .6);
    hazard.albedoTexture = canvasTexture(scene, 'Hazard stripes', 128, 16, (c) => { c.fillStyle = '#1a1a1a'; c.fillRect(0, 0, 128, 16); c.fillStyle = '#e8b82a'; for (let x = -16; x < 128; x += 32) { c.beginPath(); c.moveTo(x, 16); c.lineTo(x + 16, 0); c.lineTo(x + 32, 0); c.lineTo(x + 16, 16); c.fill(); } });
    sweep(scene, 'Quay hazard edge', [[W + .7, .16], [inner, .16]], hazard, { uScale: 12, step: .5, from, to });
    const signTexture = canvasTexture(scene, 'Harbour warning', 512, 256, (c) => { c.fillStyle = '#e8b82a'; c.fillRect(0, 0, 512, 256); c.fillStyle = '#141414'; c.fillRect(12, 12, 488, 232); c.fillStyle = '#e8b82a';
      c.font = 'bold 54px Georgia'; c.textAlign = 'center'; c.fillText('ACHTUNG', 256, 80); c.fillText(cliff ? 'ABGRUND' : lava ? 'STAATSOFEN' : 'HAFENBECKEN', 256, 145); c.font = '26px Georgia'; c.fillText('Bergung nur durch das', 256, 195); c.fillText('Staatliche Bergungsamt', 256, 228); });
    const signMaterial = pbr(scene, 'Harbour warning sign', '#ffffff', 0, .6); signMaterial.albedoTexture = signTexture;
    for (const at of [from - 4, to + 4]) {
      const p = trackPoint(at, W + 3); const sign = MeshBuilder.CreatePlane('Harbour warning sign', { width: 2.6, height: 1.3 }, scene);
      sign.material = signMaterial; sign.position.set(p.x, 2.3, p.z); sign.rotation.y = p.heading + Math.PI; sign.isPickable = false;
      const post = MeshBuilder.CreateCylinder('Harbour sign post', { diameter: .12, height: 2 }, scene); post.position.set(p.x, 1, p.z); post.material = kerbStone; post.isPickable = false;
    }
    const craneSteel = pbr(scene, 'Salvage crane yellow', '#d9a21f', .5, .45);
    const mid = trackPoint((from + to) / 2, outer + 2), hookAt = trackPoint((from + to) / 2, W + 4);
    const mast = MeshBuilder.CreateBox('Salvage crane mast', { width: .7, height: 11, depth: .7 }, scene); mast.position.set(mid.x, 5.5, mid.z); mast.material = craneSteel;
    const dx = hookAt.x - mid.x, dz = hookAt.z - mid.z, len = Math.hypot(dx, dz) + 2;
    const boom = MeshBuilder.CreateBox('Salvage crane boom', { width: .45, height: .45, depth: len }, scene); boom.material = craneSteel;
    boom.position.set(mid.x + dx / 2, 10.8, mid.z + dz / 2); boom.rotation.y = Math.atan2(dx, dz);
    const plateTexture = canvasTexture(scene, 'Salvage office plate', 512, 128, (c) => { c.fillStyle = '#7a1820'; c.fillRect(0, 0, 512, 128); c.fillStyle = '#f3e3b8'; c.font = 'bold 40px Georgia'; c.textAlign = 'center'; c.fillText('STAATLICHES BERGUNGSAMT', 256, 80); });
    const plateMaterial = pbr(scene, 'Salvage office plate', '#ffffff', 0, .6); plateMaterial.albedoTexture = plateTexture;
    const plate = MeshBuilder.CreatePlane('Salvage office plate', { width: 4, height: 1 }, scene); plate.material = plateMaterial; plate.position.set(mid.x, 6, mid.z); plate.rotation.y = Math.atan2(dx, dz) + Math.PI; plate.isPickable = false;
    for (const m of [mast, boom]) { m.isPickable = false; shadow.addShadowCaster(m); }
  }
  // Backyard alley: darker, rougher cobbles between clipped hedges, opening onto both legs.
  const alleyAt = (u: number, lane: number) => shortcutPoint(u, lane);
  sweep(scene, 'Backyard alley', [[-SHORTCUT.halfWidth - .4, .035], [0, .04], [SHORTCUT.halfWidth + .4, .035]], road, { uScale: 2, vScale: 2, step: .5, to: SHORTCUT_LENGTH, at: alleyAt,
    color: (u) => { const t = .62 + Math.sin(u * .9) * .04; return [t, t * .93, t * .84]; } });
  const hedgeMaterial = pbr(scene, 'Clipped alley hedge', '#ffffff', 0, .95);
  const hedgeMaps = surfaceTextures(scene, 'Hedge', 'leaf'); hedgeMaps.color.hasAlpha = false; hedgeMaterial.albedoTexture = hedgeMaps.color; hedgeMaterial.bumpTexture = hedgeMaps.normal; hedgeMaterial.albedoColor = Color3.FromHexString('#5e8a4c');
  for (const side of [-1, 1]) {
    const a = SHORTCUT.halfWidth + .45, b = a + .7;
    const hedge = sweep(scene, `Alley hedge ${side}`, side < 0 ? [[-b, 0], [-b, 1.05], [-a, 1.05], [-a, 0]] : [[a, 0], [a, 1.05], [b, 1.05], [b, 0]], hedgeMaterial,
      { uScale: 1.5, vScale: 1.5, step: .8, from: 9, to: SHORTCUT_LENGTH - 9, at: alleyAt });
    shadow.addShadowCaster(hedge);
  }
  const signTexture = canvasTexture(scene, 'Shortcut sign', 512, 256, (c) => {
    c.fillStyle = '#efe4c8'; c.fillRect(0, 0, 512, 256); c.strokeStyle = '#6d1b23'; c.lineWidth = 14; c.strokeRect(10, 10, 492, 236);
    c.fillStyle = '#6d1b23'; c.font = 'bold 54px Georgia'; c.textAlign = 'center'; c.fillText('ABKÜRZUNG', 256, 96);
    c.font = '30px Georgia'; c.fillText('nur mit Sondergenehmigung', 256, 150); c.font = 'italic 24px Georgia'; c.fillText('Formular 08/15-B · Kopfsteinpflaster', 256, 200);
  });
  const signMaterial = pbr(scene, 'Shortcut sign board', '#ffffff', 0, .6); signMaterial.albedoTexture = signTexture;
  for (const [u, side] of [[5, 1], [SHORTCUT_LENGTH - 5, -1]] as const) {
    const p = shortcutPoint(u, side * (SHORTCUT.halfWidth + 1.2));
    const board = MeshBuilder.CreatePlane('Shortcut sign', { width: 2.2, height: 1.1, sideOrientation: Mesh.DOUBLESIDE }, scene);
    board.position.set(p.x, 2.2, p.z); board.rotation.y = p.heading + (u > 10 ? Math.PI : 0); board.material = signMaterial; board.isPickable = false;
    const pole = MeshBuilder.CreateCylinder('Shortcut sign pole', { diameter: .1, height: 2.2, tessellation: 6 }, scene);
    pole.position.set(p.x, 1.1, p.z); pole.material = kerbStone; pole.isPickable = false;
  }

  // Rain puddles on the racing line: glossy dark water discs (enabled only in rain).
  const puddleMaterial = pbr(scene, 'Rain puddle water', '#1c2226', 0, .04); puddleMaterial.alpha = .88;
  const puddles: { x: number; z: number; r: number }[] = [];
  const puddleMeshes: Mesh[] = [];
  for (const [s, lane, r] of [[40, -2.2, 1.6], [96, 1.8, 1.3], [150, -.6, 1.8], [205, 2.4, 1.2], [300, -1.5, 2], [326, 2, 1.4], [372, .5, 1.5], [470, -2, 1.4], [512, 1.2, 1.9], [560, -.8, 1.3]] as const) {
    const p = trackPoint(s, lane);
    const disc = MeshBuilder.CreateDisc('Rain puddle', { radius: r, tessellation: 28 }, scene);
    disc.rotation.x = Math.PI / 2; disc.scaling.y = 1.6; disc.rotation.y = p.heading; disc.position.set(p.x, .05, p.z);
    disc.material = puddleMaterial; disc.isPickable = false; disc.setEnabled(false); puddleMeshes.push(disc); puddles.push({ x: p.x, z: p.z, r: r * 1.2 });
  }

  // A small pool of soft ground decals suggests gaps in the rain clouds without
  // adding particle churn or another shadow-map pass. The sky panorama supplies the clouds.
  const cloudShadowTexture = canvasTexture(scene, 'Soft rain cloud shadow', 512, 512, (c) => {
    const puff = (x: number, y: number, radius: number, opacity: number) => {
      const g = c.createRadialGradient(x, y, radius * .08, x, y, radius);
      g.addColorStop(0, `rgba(10,14,20,${opacity})`); g.addColorStop(.55, `rgba(10,14,20,${opacity * .72})`); g.addColorStop(1, 'rgba(10,14,20,0)');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, radius, 0, Math.PI * 2); c.fill();
    };
    puff(250, 245, 242, .82); puff(150, 226, 154, .56); puff(356, 270, 174, .58);
    puff(257, 138, 128, .36); puff(286, 360, 142, .38);
  }, true);
  cloudShadowTexture.wrapU = cloudShadowTexture.wrapV = Texture.CLAMP_ADDRESSMODE;
  const cloudShadowMaterial = new StandardMaterial('Rain cloud shadow decal', scene);
  cloudShadowMaterial.diffuseTexture = cloudShadowTexture; cloudShadowMaterial.useAlphaFromDiffuseTexture = true;
  cloudShadowMaterial.diffuseColor = Color3.White(); cloudShadowMaterial.specularColor = Color3.Black();
  cloudShadowMaterial.disableLighting = true; cloudShadowMaterial.backFaceCulling = false;
  cloudShadowMaterial.transparencyMode = StandardMaterial.MATERIAL_ALPHABLEND; cloudShadowMaterial.alpha = 1;
  const cloudShadows = Array.from({ length: 5 }, (_, i) => {
    // Keep the first soft shadow beyond the start grid in the clear road corridor; the rest stay evenly spaced around the lap.
    const phase = (TRACK.start + 20 + TRACK.length * i / 5) % TRACK.length, p = trackPoint(phase);
    const mesh = MeshBuilder.CreateGround('Moving rain cloud shadow', { width: TRACK.halfWidth * 2, height: 22 }, scene);
    mesh.position.set(p.x, trackHeightAt(p.x, p.z) + .075, p.z); mesh.rotation.y = p.heading;
    mesh.material = cloudShadowMaterial; mesh.isPickable = false; mesh.setEnabled(false);
    return { mesh, phase, progress: phase };
  });

  const verge = pbr(scene, 'Gravel verge', '#6f6550', 0, .95);
  for (const side of [-1, 1]) sweep(scene, `Verge ${side}`, side < 0 ? [[-W - 1, .022], [-W - .95, .08]] : [[W + .95, .08], [W + 1, .022]], verge, { uScale: 2, step: 2 });

  // Lantern posts with hanging banners; thin instances keep this to a few draw calls.
  const iron = pbr(scene, 'Lantern cast iron', '#1b2427', .75, .38);
  const brass = pbr(scene, 'Lantern brass', '#c4974c', .85, .28);
  const glowMaterial = new StandardMaterial('Street lantern glow', scene);
  glowMaterial.emissiveColor = new Color3(1, .78, .45); glowMaterial.diffuseColor = Color3.Black(); glowMaterial.disableLighting = true;
  const postParts = [
    MeshBuilder.CreateCylinder('lantern base', { diameterBottom: .55, diameterTop: .32, height: .7, tessellation: 12 }, scene),
    MeshBuilder.CreateCylinder('lantern shaft', { diameterBottom: .2, diameterTop: .11, height: 5.2, tessellation: 10 }, scene),
    MeshBuilder.CreateCylinder('lantern arm', { diameter: .07, height: 1.25, tessellation: 6 }, scene),
  ];
  postParts[0].position.y = .35; postParts[1].position.y = 3; postParts[2].rotation.z = Math.PI / 2; postParts[2].position.set(-.6, 5.1, 0);
  const post = Mesh.MergeMeshes(postParts, true)!; post.name = 'Lantern post'; post.material = iron;
  const capParts = [
    MeshBuilder.CreateCylinder('lantern crown', { diameterBottom: .62, diameterTop: .08, height: .38, tessellation: 8 }, scene),
    MeshBuilder.CreateCylinder('lantern ring', { diameter: .5, height: .06, tessellation: 12 }, scene),
    MeshBuilder.CreateSphere('lantern finial', { diameter: .14, segments: 6 }, scene),
  ];
  capParts[0].position.y = 5.95; capParts[1].position.y = 5.25; capParts[2].position.y = 6.2;
  const cap = Mesh.MergeMeshes(capParts, true)!; cap.name = 'Lantern brass crown'; cap.material = brass;
  const globe = MeshBuilder.CreateCylinder('Street lantern glow', { diameterTop: .42, diameterBottom: .3, height: .55, tessellation: 8 }, scene);
  globe.position.y = 5.55; globe.material = glowMaterial; globe.bakeCurrentTransformIntoVertices();
  const bannerTexture = canvasTexture(scene, 'Parade banner', 256, 768, (c) => {
    const g = c.createLinearGradient(0, 0, 256, 0); g.addColorStop(0, '#5d1218'); g.addColorStop(.5, '#9a2129'); g.addColorStop(1, '#5d1218');
    c.fillStyle = g; c.fillRect(0, 0, 256, 700);
    c.fillStyle = '#d4a650'; c.fillRect(0, 0, 256, 22); c.fillRect(18, 40, 8, 600); c.fillRect(230, 40, 8, 600);
    paintEmblem(c, 128, 250, 78);
    c.font = 'bold 30px Georgia'; c.textAlign = 'center'; c.fillStyle = '#e9c77a'; c.fillText('ORDNUNG', 128, 430); c.fillText('UND', 128, 470); c.fillText('VORFAHRT', 128, 510);
    c.beginPath(); c.moveTo(0, 690); c.lineTo(128, 768); c.lineTo(256, 690); c.closePath(); c.fillStyle = '#8b1e26'; c.fill();
    c.fillStyle = '#d4a650'; c.fillRect(0, 682, 256, 10);
  }, true);
  const bannerMaterial = pbr(scene, 'Parade banner cloth', '#ffffff', 0, .85);
  bannerMaterial.albedoTexture = bannerTexture; bannerMaterial.useAlphaFromAlbedoTexture = false; bannerMaterial.backFaceCulling = false;
  bannerTexture.hasAlpha = false;
  const banner = MeshBuilder.CreatePlane('Parade banner', { width: .95, height: 2.85, sideOrientation: Mesh.DOUBLESIDE }, scene);
  banner.material = bannerMaterial;
  const lampMatrices: Matrix[] = [], bannerBase: { s: number; side: number; m: Matrix; phase: number }[] = [];
  const spacing = 24;
  for (let s = 8; s < TRACK.length - 6; s += spacing) for (const side of [-1, 1]) {
    if (side > 0 && HAZARDS.some((h) => s >= h.from - 1 && s <= h.to + 1)) continue; // no lamps standing in a basin or pit
    if (Math.abs(s - TRACK.start) < 6) continue;
    const at = s + (side > 0 ? spacing / 2 : 0), p = trackPoint(at, side * (W + 2.6));
    // Local -x arm reaches over the barrier toward the road.
    const m = Matrix.Compose(Vector3.One(), Quaternion.FromEulerAngles(0, p.heading + (side < 0 ? Math.PI : 0), 0), new Vector3(p.x, .14, p.z));
    lampMatrices.push(m);
    const hang = trackPoint(at, side * (W + 1.62));
    bannerBase.push({ s, side, m: Matrix.Compose(Vector3.One(), Quaternion.FromEulerAngles(0, p.heading, 0), new Vector3(hang.x, 3.62, hang.z)), phase: s * .37 + side });
  }
  for (const mesh of [post, cap, globe]) { mesh.thinInstanceSetBuffer('matrix', new Float32Array(lampMatrices.flatMap((m) => Array.from(m.asArray()))), 16, true); mesh.isPickable = false; mesh.receiveShadows = true; }
  shadow.addShadowCaster(post);
  const bannerMatrices = new Float32Array(bannerBase.length * 16);
  // Swing about the top hem: down, rotate, back up, then place.
  const down = Matrix.Translation(0, -1.42, 0), up = Matrix.Translation(0, 1.42, 0), swing = new Matrix(), result = new Matrix();
  const updateBanners = (time: number) => {
    bannerBase.forEach((b, i) => {
      Matrix.RotationYawPitchRollToRef(0, Math.sin(time * 1.7 + b.phase) * .07, Math.sin(time * 2.3 + b.phase) * .035, swing);
      down.multiplyToRef(swing, result); result.multiplyToRef(up, result); result.multiplyToRef(b.m, result); result.copyToArray(bannerMatrices, i * 16);
    });
    banner.thinInstanceBufferUpdated('matrix');
  };
  banner.thinInstanceSetBuffer('matrix', bannerMatrices, 16, false); updateBanners(0);
  banner.isPickable = false; banner.receiveShadows = true;

  // Tall parade flags along the palace sweeper (outside of the bend); thin-instanced, waving in place.
  const flagTexture = canvasTexture(scene, 'Parade flag', 512, 320, (c) => {
    const g = c.createLinearGradient(0, 0, 0, 320); g.addColorStop(0, '#a7242c'); g.addColorStop(1, '#6e141b');
    c.fillStyle = g; c.fillRect(0, 0, 512, 320); c.fillStyle = '#d6a855'; c.fillRect(0, 0, 512, 16); c.fillRect(0, 304, 512, 16);
    paintEmblem(c, 256, 166, 104);
  });
  const flagMaterial = pbr(scene, 'Parade flag cloth', '#ffffff', 0, .8); flagMaterial.albedoTexture = flagTexture; flagMaterial.backFaceCulling = false;
  const flag = MeshBuilder.CreateGround('Parade flag', { width: 3.2, height: 2, subdivisionsX: 8, subdivisionsY: 1, updatable: true }, scene);
  flag.rotation.x = -Math.PI / 2; flag.bakeCurrentTransformIntoVertices(); flag.material = flagMaterial; flag.isPickable = false;
  const flagPositions = flag.getVerticesData('position')!.slice();
  const mast = MeshBuilder.CreateCylinder('Flag mast', { diameterTop: .09, diameterBottom: .16, height: 9.5, tessellation: 8 }, scene);
  mast.material = brass; mast.isPickable = false;
  const mastMatrices: number[] = [], flagMatrices: number[] = [];
  for (let s = 112 * MAP_SCALE; s <= 205 * MAP_SCALE; s += 13) {
    const p = trackPoint(s, W + 4.2);
    mastMatrices.push(...Matrix.Translation(p.x, 4.75, p.z).asArray());
    flagMatrices.push(...Matrix.Compose(Vector3.One(), Quaternion.FromEulerAngles(0, p.heading, 0), new Vector3(p.x, 8.2, p.z)).asArray());
  }
  mast.thinInstanceSetBuffer('matrix', new Float32Array(mastMatrices), 16, true);
  flag.thinInstanceSetBuffer('matrix', new Float32Array(flagMatrices), 16, true);
  shadow.addShadowCaster(mast);
  const waveFlag = (time: number) => {
    // Shared cloth wave: amplitude grows toward the free end; one buffer update for all instances.
    const out = flag.getVerticesData('position')!;
    for (let i = 0; i < flagPositions.length; i += 3) {
      const u = (flagPositions[i] + 1.6) / 3.2;
      out[i] = flagPositions[i] + 1.6; out[i + 1] = flagPositions[i + 1] - Math.sin(time * 4 + u * 5) * u * .12;
      out[i + 2] = flagPositions[i + 2] + Math.sin(time * 5.2 + u * 6) * u * .32;
    }
    flag.updateVerticesData('position', out);
  };

  // Pennant strings across the straights: one vertex-coloured mesh, gently swaying.
  const pennantPositions: number[] = [], pennantColors: number[] = [], pennantIndices: number[] = [];
  const palette = [new Color4(.62, .1, .13, 1), new Color4(.86, .68, .34, 1), new Color4(.93, .89, .78, 1), new Color4(.08, .28, .28, 1)];
  for (const s of [12, 60, 300, 345, 515]) {
    const a = trackPoint(s, -W - 2.6), b = trackPoint(s, W + 2.6);
    const count = 22;
    for (let i = 0; i < count; i++) {
      const t0 = i / count, t1 = (i + .8) / count;
      const sag = (t: number) => 7.3 - Math.sin(Math.PI * t) * 1.3;
      const x0 = a.x + (b.x - a.x) * t0, z0 = a.z + (b.z - a.z) * t0, x1 = a.x + (b.x - a.x) * t1, z1 = a.z + (b.z - a.z) * t1;
      const k = pennantPositions.length / 3;
      pennantPositions.push(x0, sag(t0), z0, x1, sag(t1), z1, (x0 + x1) / 2, sag((t0 + t1) / 2) - .62, (z0 + z1) / 2);
      const c = palette[i % palette.length]; for (let v = 0; v < 3; v++) pennantColors.push(c.r, c.g, c.b, 1);
      pennantIndices.push(k, k + 1, k + 2);
    }
  }
  const pennants = new Mesh('Pennant strings', scene), pennantData = new VertexData(), pennantNormals: number[] = [];
  VertexData.ComputeNormals(pennantPositions, pennantIndices, pennantNormals);
  pennantData.positions = pennantPositions; pennantData.indices = pennantIndices; pennantData.colors = pennantColors; pennantData.normals = pennantNormals;
  pennantData.applyToMesh(pennants);
  const pennantMaterial = pbr(scene, 'Pennant cloth', '#ffffff', 0, .9); pennantMaterial.backFaceCulling = false; pennants.material = pennantMaterial;
  pennants.isPickable = false;

  return {
    glowMeshes: [globe, ...boostPads, ...hazardGlow],
    puddles,
    setWet(wet) {
      // Wet cobbles: darker, much smoother (rain film) and more reflective; puddles appear.
      road.albedoColor = Color3.FromHexString(wet ? '#8d897f' : '#d8d2c2'); road.roughness = wet ? .32 : 1;
      paving.albedoColor = Color3.FromHexString(wet ? '#8c8270' : '#cbbda0'); paving.roughness = wet ? .4 : 1;
      for (const m of puddleMeshes) m.setEnabled(wet);
      for (const shadow of cloudShadows) shadow.mesh.setEnabled(wet);
    },
    setSnow(snow) {
      // Light snow cover: pale, slightly glossy cobbles and paving (no grip change, rules stay identical).
      const cover = snow ? new Color3(.3, .31, .34) : Color3.Black(); road.emissiveColor = cover; paving.emissiveColor = cover;
      if (snow) { road.albedoColor = Color3.FromHexString('#f4f5f7'); road.roughness = .62; paving.albedoColor = Color3.FromHexString('#f6f7f9'); paving.roughness = .7; for (const m of puddleMeshes) m.setEnabled(false); }
      else this.setWet(false);
    },
    animate(time) {
      updateBanners(time); waveFlag(time); pennants.position.y = Math.sin(time * 1.3) * .04;
      waterRipple.uOffset = (time * .012) % 1; waterRipple.vOffset = (time * .003) % 1;
      for (const shadow of cloudShadows) {
        const progress = (shadow.phase + time * 1.6) % TRACK.length;
        if (Math.abs(progress - shadow.progress) < .4) continue;
        shadow.progress = progress;
        const p = trackPoint(progress); shadow.mesh.position.set(p.x, trackHeightAt(p.x, p.z) + .075, p.z); shadow.mesh.rotation.y = p.heading;
      }
    },
  };
}
