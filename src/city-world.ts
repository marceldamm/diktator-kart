import type { Scene } from '@babylonjs/core/scene';
import { LoadAssetContainerAsync } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Matrix, Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { VertexBuffer } from '@babylonjs/core/Buffers/buffer';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import type { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { TRACK, trackPoint, trackLocate, shortcutLocate, SHORTCUT_LENGTH } from './track';
import { GROUND, HAZARDS, LANDMARKS, RIVER } from './track-layout';
import { surfaceTextures } from './surface-textures';
import { paintEmblem } from './track-world';

/**
 * Redesigned city (06.10.2026): modules from art-source/build_city_kit.py placed along the shared centreline as
 * chunked thin instances. Districts follow the circuit: stadium straight, palace sweeper, park esses, western
 * boulevard with the gate, ministry quarter, Spree quay with the river, Prachtallee, column hairpin, Tiergarten
 * and the finish bend. All placement is deterministic and checked against the driving corridor, hazards,
 * the backyard alley and already placed footprints.
 */
export interface CityWorld { glowMeshes: Mesh[]; meshes: Mesh[]; animate(time: number): void }


type Placement = { m: string; x: number; z: number; yaw: number; tint?: Color3; s?: number; y?: number; sx?: number; sc?: number };
interface Footprint { u0: number; u1: number; v0: number; v1: number }
/** Local footprints: u along the street (x), v away from the street (front at v=0, body toward +v). */
const DIMS: Record<string, Footprint> = {
  'kit-house-a': { u0: -7.5, u1: 7.5, v0: -1.7, v1: 13 }, 'kit-house-b': { u0: -7, u1: 7, v0: -1.8, v1: 13 },
  'kit-house-c': { u0: -5.5, u1: 5.5, v0: -1.7, v1: 13 }, 'kit-house-d': { u0: -9.5, u1: 9.5, v0: -1.7, v1: 15 },
  'kit-corner': { u0: -11.2, u1: 8, v0: -3.2, v1: 13 }, 'kit-grandstand': { u0: -12, u1: 12, v0: -1.6, v1: 10.6 },
  'kit-palace': { u0: -49, u1: 49, v0: -13, v1: 35 }, 'kit-cathedral': { u0: -34, u1: 34, v0: -3, v1: 51 },
  'kit-column': { u0: -9, u1: 9, v0: -9, v1: 9 }, 'kit-sky-a': { u0: -11, u1: 11, v0: 0, v1: 14 },
  'kit-sky-b': { u0: -15, u1: 15, v0: 0, v1: 16 }, 'kit-sky-c': { u0: -9, u1: 9, v0: 0, v1: 12 },
  'kit-linden': { u0: -2.4, u1: 2.4, v0: -2.4, v1: 2.4 }, 'kit-cypress': { u0: -1.1, u1: 1.1, v0: -1.1, v1: 1.1 },
  'kit-statue': { u0: -2.4, u1: 2.4, v0: -1.5, v1: 1.5 }, 'kit-fountain': { u0: -6.6, u1: 6.6, v0: -6.6, v1: 6.6 },
  'kit-kiosk': { u0: -2, u1: 2, v0: -2, v1: 2 }, 'kit-urn': { u0: -.8, u1: .8, v0: -.8, v1: .8 },
  'kit-hedge': { u0: -2, u1: 2, v0: -.5, v1: .5 },
};
const PLASTER_TINTS = ['#dcb57f', '#e4cda4', '#d9a891', '#bcc3c1', '#ece1c6', '#c7c9a6', '#d49d7c', '#e8d3b0'].map((h) => Color3.FromHexString(h).toLinearSpace());

function rng(seed: number) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }

export async function addCityWorld(scene: Scene, shadow: ShadowGenerator): Promise<CityWorld> {
  const kit = await LoadAssetContainerAsync('/assets/models/city-kit.glb', scene);
  kit.addAllToScene();
  scene.onDisposeObservable.add(() => kit.dispose());
  // Bake every module mesh into game orientation (Blender X/Y = game x/z, as the previous world).
  const flip = Matrix.RotationY(Math.PI);
  const parts = new Map<string, Mesh[]>();
  for (const mesh of kit.meshes) {
    if (!(mesh instanceof Mesh) || mesh.getTotalVertices() === 0) continue;
    const world = mesh.computeWorldMatrix(true).clone();
    mesh.parent = null; mesh.position.setAll(0); mesh.rotationQuaternion = null; mesh.rotation.setAll(0); mesh.scaling.setAll(1);
    mesh.bakeTransformIntoVertices(world.multiply(flip));
    mesh.hasVertexAlpha = false; mesh.isPickable = false; mesh.setEnabled(false);
    const module = mesh.name.split('|')[0];
    if (!parts.has(module)) parts.set(module, []);
    parts.get(module)!.push(mesh);
  }
  for (const node of kit.transformNodes) node.setEnabled(false);

  // Shared material finish: grain textures on top of the authored vertex tones.
  const stone = surfaceTextures(scene, 'Kit stone', 'stone'), plaster = surfaceTextures(scene, 'Kit plaster', 'stone');
  const cloth = surfaceTextures(scene, 'Kit cloth', 'fabric'), leaf = surfaceTextures(scene, 'Kit leaves', 'leaf');
  plaster.normal.level = .35;
  // Ashlar reads at ~70 cm blocks instead of brick scale on the 2 m UV grid.
  for (const t of [stone.color, stone.normal]) { t.uScale = .45; t.vScale = .45; }
  const banner = new DynamicTexture('Kit banner emblem', { width: 256, height: 512 }, scene, true);
  {
    const c = banner.getContext() as CanvasRenderingContext2D;
    c.fillStyle = '#7e1b26'; c.fillRect(0, 0, 256, 512);
    c.fillStyle = '#e6c56f'; c.fillRect(0, 0, 256, 18); c.fillRect(0, 494, 256, 18); c.fillRect(0, 0, 14, 512); c.fillRect(242, 0, 14, 512);
    c.fillStyle = '#efe1bf'; c.fillRect(28, 60, 200, 10); c.fillRect(28, 440, 200, 10);
    paintEmblem(c, 128, 255, 86);
    banner.update();
  }
  const glowMeshes: Mesh[] = [];
  for (const m of kit.materials) {
    if (!(m instanceof PBRMaterial)) continue;
    if (/stone|roof/.test(m.name)) { m.albedoTexture = stone.color; m.bumpTexture = stone.normal; }
    if (/plaster/.test(m.name)) { m.bumpTexture = plaster.normal; }
    if (/Kit cloth|crowd$/.test(m.name)) { m.bumpTexture = cloth.normal; }
    if (/banner/.test(m.name)) { m.albedoTexture = banner; m.bumpTexture = cloth.normal; }
    if (/foliage/.test(m.name)) { m.albedoTexture = leaf.color; m.bumpTexture = leaf.normal; m.backFaceCulling = false; }
    if (/glass/.test(m.name) && !/lamp/.test(m.name)) { m.roughness = .08; m.metallic = .35; m.environmentIntensity = 1.4; }
    if (/gilded/.test(m.name)) { m.clearCoat.isEnabled = true; m.clearCoat.intensity = .4; }
    if (/fountain water/.test(m.name)) { m.alpha = .85; }
  }

  // --- Placement checks -----------------------------------------------------------------------------
  const W = TRACK.halfWidth, PROMENADE = W + 1.45 + LANDMARKS.promenade;
  const CELL = 2, GX0 = GROUND.west, GZ0 = GROUND.south, NX = Math.ceil((GROUND.east - GROUND.west) / CELL), NZ = Math.ceil((GROUND.north - GROUND.south) / CELL);
  const occupied = new Uint8Array(NX * NZ);
  const cellOf = (x: number, z: number) => { const i = Math.floor((x - GX0) / CELL), j = Math.floor((z - GZ0) / CELL); return i < 0 || j < 0 || i >= NX || j >= NZ ? -1 : j * NX + i; };
  const reserved: { x: number; z: number; r: number }[] = [
    ...LANDMARKS.fountains.map(([x, z]) => ({ x, z, r: 10 })), ...LANDMARKS.trees.map(([x, z]) => ({ x, z, r: 6 })),
  ];
  const tv = trackPoint(66 * 1.5, -(W + 11)); reserved.push({ x: tv.x, z: tv.z, r: 13 });
  const inLawn = (x: number, z: number) => LANDMARKS.lawns.some(([x0, z0, x1, z1]) => x >= x0 - 2 && x <= x1 + 2 && z >= z0 - 2 && z <= z1 + 2);
  const inRiver = (_x: number, z: number) => z < RIVER.north + 1 && z > RIVER.south - 1;
  /** Lateral room the circuit needs at progress s on one side (corridor, promenade, open hazard basins, video wall, gate). */
  const need = (s: number, side: number) => {
    let n = PROMENADE + .6;
    for (const h of HAZARDS) if (side === h.side && s >= h.from - 5 && s <= h.to + 5) n = Math.max(n, W + 1.45 + h.basin + 3);
    if (Math.abs(s - LANDMARKS.gateProgress) < 14) n = Math.max(n, 18.5);
    return n;
  };
  const clearOfCircuit = (x: number, z: number, extra = 0) => {
    const { s, lane } = trackLocate(x, z);
    if (Math.abs(lane) < need(s, Math.sign(lane) || 1) + extra) return false;
    const a = shortcutLocate(x, z);
    if (a.u > -4 && a.u < SHORTCUT_LENGTH + 4 && Math.abs(a.lane) < 3 + 6 + extra) return false;
    return true;
  };
  const corners = (p: Placement, f: Footprint, step = 2.2) => {
    const out: [number, number][] = []; const c = Math.cos(p.yaw), sn = Math.sin(p.yaw), sx = (p.sx ?? 1) * (p.sc ?? 1);
    for (let u = f.u0 * sx; u <= f.u1 * sx + .01; u += Math.min(step, (f.u1 - f.u0) * sx)) for (let v = f.v0; v <= f.v1 + .01; v += Math.min(step, f.v1 - f.v0)) out.push([p.x + u * c + v * sn, p.z - u * sn + v * c]);
    return out;
  };
  const placements: Placement[] = [];
  const tryPlace = (p: Placement, opts: { lawnOk?: boolean; riverOk?: boolean; extra?: number; skipCircuit?: boolean } = {}) => {
    const f = DIMS[p.m] ?? { u0: -1, u1: 1, v0: -1, v1: 1 };
    const pts = corners(p, f);
    for (const [x, z] of pts) {
      const cell = cellOf(x, z);
      if (cell < 0 || occupied[cell]) return false;
      if (!opts.riverOk && inRiver(x, z)) return false;
      if (!opts.lawnOk && inLawn(x, z)) return false;
      if (reserved.some((r) => Math.hypot(r.x - x, r.z - z) < r.r)) return false;
      if (!opts.skipCircuit && !clearOfCircuit(x, z, opts.extra ?? 0)) return false;
    }
    for (const [x, z] of corners(p, f, 1.4)) { const cell = cellOf(x, z); if (cell >= 0) occupied[cell] = 1; }
    placements.push(p); return true;
  };
  const facing = (x: number, z: number) => { const c = trackLocate(x, z), t = trackPoint(c.s, 0); return Math.atan2(-(t.x - x), -(t.z - z)); };
  const random = rng(1936);
  const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)];

  // --- Hero buildings and fixed civic pieces ---------------------------------------------------------
  const gateAt = trackPoint(LANDMARKS.gateProgress, 0), finishAt = trackPoint(TRACK.start, 0);
  placements.push({ m: 'kit-gate', x: gateAt.x, z: gateAt.z, yaw: gateAt.heading });
  placements.push({ m: 'kit-finish', x: finishAt.x, z: finishAt.z, yaw: finishAt.heading });
    tryPlace({ m: 'kit-palace', x: LANDMARKS.palace[0], z: LANDMARKS.palace[1], yaw: 0 }, { lawnOk: true });
  tryPlace({ m: 'kit-column', x: LANDMARKS.column[0], z: LANDMARKS.column[1], yaw: 0 });
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; tryPlace({ m: 'kit-urn', x: LANDMARKS.column[0] + Math.cos(a) * 12.5, z: LANDMARKS.column[1] + Math.sin(a) * 12.5, yaw: -a }); }
  tryPlace({ m: 'kit-cathedral', x: 150, z: RIVER.south - 70, yaw: Math.PI }, { riverOk: false });
  for (const x of [-150, 330]) placements.push({ m: 'kit-bridge', x, z: (RIVER.north + RIVER.south) / 2, yaw: Math.PI / 2, sx: 1.16 });
  // Quay walls along both banks (front toward the water).
  for (let x = RIVER.west + 5; x < RIVER.east; x += 10) {
    placements.push({ m: 'kit-quay', x, z: RIVER.north, yaw: 0 }, { m: 'kit-quay', x, z: RIVER.south, yaw: Math.PI });
  }
  for (let x = RIVER.west; x < RIVER.east; x += 2) { for (const z of [RIVER.north, RIVER.south]) { const c = cellOf(x, z); if (c >= 0) occupied[c] = 1; } }

  // --- Districts along the circuit -------------------------------------------------------------------
  type District = { from: number; to: number; left: string; right: string };
  const districts: District[] = [
    { from: 2, to: 182, left: 'stands', right: 'stands' },
    { from: 182, to: 300, left: 'park', right: 'city' },
    { from: 300, to: 445, left: 'park', right: 'park' },
    { from: 445, to: 545, left: 'boulevard', right: 'boulevard' },
    { from: 545, to: 735, left: 'city', right: 'city' },
    { from: 735, to: 842, left: 'city', right: 'city' },
    { from: 842, to: 990, left: 'riverfront', right: 'quay' },
    { from: 990, to: 1112, left: 'avenue', right: 'avenue' },
    { from: 1112, to: 1188, left: 'plaza', right: 'corner' },
    { from: 1188, to: 1302, left: 'park', right: 'park' },
    { from: 1302, to: TRACK.length - 1, left: 'stands', right: 'stands' },
  ];
  const families: Record<string, string[]> = {
    city: ['kit-house-a', 'kit-house-b', 'kit-house-c', 'kit-house-a', 'kit-house-d', 'kit-house-b'],
    boulevard: ['kit-house-d', 'kit-house-a', 'kit-house-d', 'kit-house-b'],
    riverfront: ['kit-house-a', 'kit-house-d', 'kit-house-c', 'kit-house-b'],
    avenue: ['kit-house-d', 'kit-house-d', 'kit-house-a'],
    corner: ['kit-corner', 'kit-house-d', 'kit-house-a'],
  };
  const lastTint: Color3[] = [];
  const tint = () => { let t = pick(PLASTER_TINTS); for (let i = 0; i < 3 && lastTint.includes(t); i++) t = pick(PLASTER_TINTS); lastTint.unshift(t); lastTint.length = 2; return t; };
  for (const d of districts) for (const side of [-1, 1] as const) {
    const kind = side < 0 ? d.left : d.right;
    if (kind === 'stands') {
      for (let s = d.from; s < d.to; s += 1) {
        const p = trackPoint(s, side * (PROMENADE + 2.4)), yaw = facing(p.x, p.z);
        if (tryPlace({ m: 'kit-grandstand', x: p.x, z: p.z, yaw, s }, { lawnOk: true })) s += 23;
      }
    } else if (families[kind]) {
      for (let s = d.from; s < d.to; s += 1.5) {
        const m = pick(families[kind]);
        const lane = side * (PROMENADE + 2.6 + (kind === 'avenue' ? 3 : random() * .8));
        const p = trackPoint(s, lane);
        if (tryPlace({ m, x: p.x, z: p.z, yaw: facing(p.x, p.z), tint: tint(), s })) s += (DIMS[m].u1 - DIMS[m].u0) * .55;
      }
    }
    // Trees: avenue lindens, park groves and the quay promenade.
    if (kind === 'park' || kind === 'avenue' || kind === 'quay' || kind === 'plaza') {
      for (let s = d.from; s < d.to; s += kind === 'park' ? 4.5 : 11) {
        const rows = kind === 'park' ? [PROMENADE + 3 + random() * 4, PROMENADE + 9 + random() * 8, PROMENADE + 18 + random() * 12] : [PROMENADE + 2.6];
        for (const lane of rows) {
          const p = trackPoint(s + random() * 3, side * lane);
          const m = kind === 'park' && random() < .28 ? 'kit-cypress' : 'kit-linden';
          tryPlace({ m, x: p.x, z: p.z, yaw: random() * 6.28, sc: .85 + random() * .4 }, { lawnOk: true });
        }
      }
      if (kind === 'park') for (let s = d.from + 8; s < d.to; s += 34) {
        const p = trackPoint(s, side * (PROMENADE + 9));
        tryPlace({ m: random() < .5 ? 'kit-statue' : 'kit-fountain', x: p.x, z: p.z, yaw: facing(p.x, p.z) }, { lawnOk: true });
      }
    }
  }
  // Infield park lawns get groves as well.
  for (const [x0, z0, x1, z1] of LANDMARKS.lawns) for (let x = x0 + 5; x < x1 - 4; x += 9) for (let z = z0 + 5; z < z1 - 4; z += 9) {
    tryPlace({ m: random() < .3 ? 'kit-cypress' : 'kit-linden', x: x + random() * 4, z: z + random() * 4, yaw: random() * 6.28, sc: .9 + random() * .4 }, { lawnOk: true });
  }
  // Promenade furniture between the existing lamps (lamps every 24 m at lane W+2.6).
  const furniture = ['kit-bench', 'kit-bench', 'kit-litfass', 'kit-flag', 'kit-bench', 'kit-kiosk', 'kit-flag'];
  let fk = 0;
  for (let s = 14; s < TRACK.length - 8; s += 12) for (const side of [-1, 1]) {
    if (HAZARDS.some((h) => side === h.side && s >= h.from - 6 && s <= h.to + 6)) continue;
    if (Math.abs(s - TRACK.start) < 10 || Math.abs(s - LANDMARKS.gateProgress) < 16) continue;
    const district = districts.find((d) => s >= d.from && s < d.to);
    if (!district || (side < 0 ? district.left : district.right) === 'stands') continue;
    const m = furniture[fk++ % furniture.length];
    const p = trackPoint(s, side * (W + 4.6));
    const a = shortcutLocate(p.x, p.z); if (a.u > -6 && a.u < SHORTCUT_LENGTH + 6 && Math.abs(a.lane) < 8) continue;
    if (reserved.some((r) => Math.hypot(r.x - p.x, r.z - p.z) < r.r)) continue;
    placements.push({ m, x: p.x, z: p.z, yaw: facing(p.x, p.z) + (m === 'kit-flag' ? Math.PI / 2 : 0) });
  }
  // Second line and distant city: taller blocks fill every free plot so no street ends in a void.
  for (let x = GROUND.west + 30; x < GROUND.east - 30; x += 30) for (let z = GROUND.south + 30; z < GROUND.north - 30; z += 30) {
    const px = x + (random() - .5) * 10, pz = z + (random() - .5) * 10;
    const { lane } = trackLocate(px, pz);
    if (Math.abs(lane) < 34) continue;
    const m = pick(['kit-sky-a', 'kit-sky-b', 'kit-sky-c', 'kit-sky-a']);
    const towardCentre = Math.atan2(-(60 - px), -(-20 - pz));
    const yaw = Math.abs(lane) < 70 ? facing(px, pz) : Math.round(towardCentre / (Math.PI / 2)) * Math.PI / 2;
    tryPlace({ m, x: px, z: pz, yaw, tint: tint() }, { extra: 18, skipCircuit: Math.abs(lane) > 70 });
  }

  // --- Static batching ---------------------------------------------------------------------------------
  // All placements are merged per material and per 260 m tile at load time: a few hundred draw calls in total,
  // tile-level frustum culling, and the plaster tint baked into the vertex colour.
  const CHUNK = 260, meshes: Mesh[] = [];
  type Source = { pos: Float32Array; nor: Float32Array; uv: Float32Array | null; col: Float32Array | null; idx: Uint32Array; material: string };
  const sourceData = new Map<Mesh, Source>();
  const sourceOf = (mesh: Mesh) => {
    let d = sourceData.get(mesh);
    if (!d) {
      const pos = Float32Array.from(mesh.getVerticesData(VertexBuffer.PositionKind)!), nor = Float32Array.from(mesh.getVerticesData(VertexBuffer.NormalKind)!);
      const uv = mesh.getVerticesData(VertexBuffer.UVKind), col = mesh.getVerticesData(VertexBuffer.ColorKind);
      const stride = col ? col.length / (pos.length / 3) : 4;
      let colours: Float32Array | null = null;
      if (col) { colours = new Float32Array(pos.length / 3 * 4); for (let i = 0; i < pos.length / 3; i++) { colours[i * 4] = col[i * stride]; colours[i * 4 + 1] = col[i * stride + 1]; colours[i * 4 + 2] = col[i * stride + 2]; colours[i * 4 + 3] = 1; } }
      d = { pos, nor, uv: uv ? Float32Array.from(uv) : null, col: colours, idx: Uint32Array.from(mesh.getIndices()!), material: mesh.material?.name ?? '' };
      sourceData.set(mesh, d);
    }
    return d;
  };
  const buckets = new Map<string, { material: Mesh['material']; items: { d: Source; m: Matrix; tint: Color3 | null }[]; module: string }>();
  for (const p of placements) {
    const sources = parts.get(p.m); if (!sources) continue;
    const m = Matrix.Compose(new Vector3((p.sx ?? 1) * (p.sc ?? 1), p.sc ?? 1, p.sc ?? 1), Quaternion.RotationYawPitchRoll(p.yaw, 0, 0), new Vector3(p.x, p.y ?? 0, p.z));
    const tile = `${Math.floor(p.x / CHUNK)},${Math.floor(p.z / CHUNK)}`;
    for (const source of sources) {
      const d = sourceOf(source), key = `${tile}|${d.material}`;
      if (!buckets.has(key)) buckets.set(key, { material: source.material, items: [], module: p.m });
      buckets.get(key)!.items.push({ d, m, tint: /plaster/.test(d.material) ? p.tint ?? null : null });
    }
  }
  const v = new Vector3(), out = new Vector3();
  for (const [key, bucket] of buckets) {
    let vertices = 0, indices = 0;
    for (const it of bucket.items) { vertices += it.d.pos.length / 3; indices += it.d.idx.length; }
    const pos = new Float32Array(vertices * 3), nor = new Float32Array(vertices * 3), uv = new Float32Array(vertices * 2), col = new Float32Array(vertices * 4), idx = new Uint32Array(indices);
    let vo = 0, io = 0;
    for (const { d, m, tint } of bucket.items) {
      const n = d.pos.length / 3;
      for (let i = 0; i < n; i++) {
        Vector3.TransformCoordinatesFromFloatsToRef(d.pos[i * 3], d.pos[i * 3 + 1], d.pos[i * 3 + 2], m, out); pos.set([out.x, out.y, out.z], (vo + i) * 3);
        v.set(d.nor[i * 3], d.nor[i * 3 + 1], d.nor[i * 3 + 2]); Vector3.TransformNormalToRef(v, m, out); out.normalize(); nor.set([out.x, out.y, out.z], (vo + i) * 3);
        if (d.uv) { uv[(vo + i) * 2] = d.uv[i * 2]; uv[(vo + i) * 2 + 1] = d.uv[i * 2 + 1]; }
        const r = d.col ? d.col[i * 4] : 1, g = d.col ? d.col[i * 4 + 1] : 1, b = d.col ? d.col[i * 4 + 2] : 1;
        col.set(tint ? [r * tint.r, g * tint.g, b * tint.b, 1] : [r, g, b, 1], (vo + i) * 4);
      }
      for (let k = 0; k < d.idx.length; k++) idx[io + k] = d.idx[k] + vo;
      vo += n; io += d.idx.length;
    }
    const mesh = new Mesh(`City ${key}`, scene);
    const data = new VertexData(); data.positions = pos; data.normals = nor; data.uvs = uv; data.colors = col; data.indices = idx; data.applyToMesh(mesh, false);
    mesh.material = bucket.material; mesh.hasVertexAlpha = false; mesh.isPickable = false; mesh.receiveShadows = true;
    const name = bucket.material?.name ?? '';
    if (!/glass|lamp|water|crowd skin/.test(name)) shadow.addShadowCaster(mesh);
    if (/lamp glass/.test(name)) glowMeshes.push(mesh);
    mesh.freezeWorldMatrix(); mesh.doNotSyncBoundingInfo = true;
    meshes.push(mesh);
  }
  for (const list of parts.values()) for (const mesh of list) mesh.dispose(false, false);

  // --- River Spree --------------------------------------------------------------------------------------
  const ripple = new DynamicTexture('River ripples', { width: 256, height: 256 }, scene, true);
  {
    const c = ripple.getContext() as CanvasRenderingContext2D; c.fillStyle = '#8080ff'; c.fillRect(0, 0, 256, 256);
    const r = rng(77);
    for (let k = 0; k < 380; k++) { const x = r() * 256, y = r() * 256, w = 6 + r() * 26; c.strokeStyle = r() < .5 ? 'rgba(104,128,240,.5)' : 'rgba(156,128,250,.45)'; c.lineWidth = 1 + r() * 2; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + w / 2, y + 3 * (r() - .5), x + w, y); c.stroke(); }
    ripple.update();
  }
  ripple.uScale = 60; ripple.vScale = 6;
  const water = new PBRMaterial('River Spree water', scene);
  water.albedoColor = Color3.FromHexString('#2d4f55').toLinearSpace(); water.metallic = .05; water.roughness = .07; water.bumpTexture = ripple; ripple.level = .45;
  water.environmentIntensity = 1.3; water.alpha = .94;
  const river = MeshBuilder.CreateGround('River Spree', { width: RIVER.east - RIVER.west, height: RIVER.north - RIVER.south }, scene);
  river.position.set((RIVER.east + RIVER.west) / 2, RIVER.level, (RIVER.north + RIVER.south) / 2); river.material = water; river.isPickable = false; river.receiveShadows = true;
  const bedMaterial = new PBRMaterial('River bed', scene); bedMaterial.albedoColor = Color3.FromHexString('#1d2a26').toLinearSpace(); bedMaterial.roughness = 1;
  const bed = MeshBuilder.CreateGround('River bed', { width: RIVER.east - RIVER.west, height: RIVER.north - RIVER.south }, scene);
  bed.position.set(river.position.x, -3, river.position.z); bed.material = bedMaterial; bed.isPickable = false;
  for (const z of [RIVER.north, RIVER.south]) {
    const bank = MeshBuilder.CreateBox('River embankment wall', { width: RIVER.east - RIVER.west, height: 2.6, depth: .6 }, scene);
    bank.position.set(river.position.x, -1.5, z + (z === RIVER.north ? .3 : -.3)); bank.material = bedMaterial; bank.isPickable = false;
  }
  meshes.push(river, bed);
  return {
    glowMeshes, meshes,
    animate(time: number) { ripple.uOffset = time * .012; ripple.vOffset = time * .004; },
  };
}
