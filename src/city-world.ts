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
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import type { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { TRACK, trackPoint, trackLocate, shortcutLocate, shortcutPoint, trackCrossingsAtZ, SHORTCUT_LENGTH, elevationAt } from './track';
import { GROUND, HAZARDS, LANDMARKS, RIVER, SHORTCUT, TRACK_INFO } from './track-layout';
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
  // Roman modules (Duce-Drom, art-source/rome_kit_modules.py)
  'kit-insula-a': { u0: -7.4, u1: 7.4, v0: -1.6, v1: 14 }, 'kit-insula-b': { u0: -5.4, u1: 5.4, v0: -1.4, v1: 13 },
  'kit-insula-c': { u0: -9.4, u1: 9.4, v0: -1.6, v1: 16 }, 'kit-balcony-palace': { u0: -24, u1: 24, v0: -3, v1: 25 },
  'kit-obelisk': { u0: -3.4, u1: 3.4, v0: -3.4, v1: 3.4 }, 'kit-pine': { u0: -1.5, u1: 1.5, v0: -1.5, v1: 1.5 },
  'kit-pine-b': { u0: -1.5, u1: 1.5, v0: -1.5, v1: 1.5 }, 'kit-aqueduct': { u0: -12.3, u1: 12.3, v0: -1.6, v1: 1.6 },
  'kit-ruin': { u0: -6.6, u1: 6.6, v0: -5, v1: 4.4 },
  // Duce-Drom monuments (art-source/rome_monuments.py)
  'kit-athlete': { u0: -1.2, u1: 1.2, v0: -1.2, v1: 1.2 }, 'kit-marble-terrace': { u0: -11, u1: 11, v0: -.5, v1: 8.6 },
  'kit-quadrato': { u0: -20, u1: 20, v0: -4.5, v1: 34.5 }, 'kit-colossal-head': { u0: -11.2, u1: 11.2, v0: -6.5, v1: 12 },
  'kit-rational-a': { u0: -9.2, u1: 9.2, v0: -2.9, v1: 14 }, 'kit-rational-b': { u0: -13.2, u1: 13.2, v0: -2.9, v1: 15 },
  'kit-rational-c': { u0: -6.2, u1: 6.2, v0: -.3, v1: 12 }, 'kit-colonnade': { u0: -13.2, u1: 13.2, v0: -.7, v1: 3.6 },
  // Havanna-Revolutionsring (art-source/havana_modules.py)
  'kit-colonial-a': { u0: -6.2, u1: 6.2, v0: -2.8, v1: 12 }, 'kit-colonial-b': { u0: -8.2, u1: 8.2, v0: -2.8, v1: 12 }, 'kit-colonial-c': { u0: -4.7, u1: 4.7, v0: -2.8, v1: 12 },
  'kit-palm': { u0: -1, u1: 1, v0: -1, v1: 1 }, 'kit-palm-b': { u0: -1, u1: 1, v0: -1, v1: 1 },
  'kit-lighthouse': { u0: -17, u1: 17, v0: -11, v1: 11 }, 'kit-beard-ministry': { u0: -17.5, u1: 17.5, v0: -3, v1: 14 }, 'kit-tribune': { u0: -7.5, u1: 7.5, v0: -4, v1: 3.5 },
};
const BERLIN_TINTS = ['#dcb57f', '#e4cda4', '#d9a891', '#bcc3c1', '#ece1c6', '#c7c9a6', '#d49d7c', '#e8d3b0'];
/** Roman ochre, sienna, terracotta and pale travertine plasters. */
const ROME_TINTS = ['#e2a85e', '#cf7d4b', '#e8bd7c', '#bd6a42', '#ecd3a2', '#d9925c', '#cfa77c', '#f1dcb2', '#c9885c'];
/** Faded Caribbean pastels for Havana's colonial arcades. */
const HAVANA_TINTS = ['#86c9c1', '#e7a7b2', '#efd27e', '#a3c5e4', '#bfe0b2', '#f2b98e', '#ece3cf', '#c9abd9', '#9ed1d8'];
/** Cold granite, weathered concrete and restrained red accents for Pyongyang's monumental axis. */
const PYONGYANG_TINTS = ['#b9bfbc', '#a8b0ae', '#d0d0c8', '#929c9d', '#c4c3ba', '#a9ada6', '#d8d2c6'];

function rng(seed: number) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }

export async function addCityWorld(scene: Scene, shadow: ShadowGenerator): Promise<CityWorld> {
  const rome = TRACK_INFO.theme === 'rome', havana = TRACK_INFO.theme === 'havana', pyongyang = TRACK_INFO.theme === 'pyongyang';
  const PLASTER_TINTS = (havana ? HAVANA_TINTS : rome ? ROME_TINTS : pyongyang ? PYONGYANG_TINTS : BERLIN_TINTS).map((h) => Color3.FromHexString(h).toLinearSpace());
  /** Pale travertine tones for the rationalist blocks of the Duce-Drom. */
  const TRAVERTINE = ['#f1ebdd', '#e8dfcc', '#f5f1e6', '#e2d8c2'].map((h) => Color3.FromHexString(h).toLinearSpace());
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
  // Shop lettering atlas: eight original, satirical trade names (rows match art-source/build_city_kit.py).
  const signs = new DynamicTexture('Kit shop sign atlas', { width: 512, height: 512 }, scene, true);
  {
    const c = signs.getContext() as CanvasRenderingContext2D;
    const names = havana ? ['ZIGARREN VOLKSEIGEN', 'RUM & REDE', 'ERSATZTEILE (1958)', 'BÄRTE NACH NORM', 'REDEZEIT-VERLÄNGERUNG', 'EIS DER REVOLUTION', 'MIKROFON-REPARATUR', 'ZUCKERQUOTE 104 %']
      : rome ? ['CAFFÈ DEL BALCONE', 'MARMOR & PATHOS', 'GELATO GENEHMIGT', 'BÜSTEN NACH MASS', 'TRIUMPHBOGEN-VERLEIH', 'APPLAUS-AGENTUR', 'SCHÄRPEN & ORDEN', 'TOGA-REINIGUNG']
      : pyongyang ? ['PLANERFÜLLUNG (FAST)', 'APPLAUS IM TAKT', 'JUBELBEDARF OST', 'PARADENORM 08/15', 'LAUTSPRECHER & PLAN', 'EWIGER BAUBEDARF', 'SIEG MELDEPFLICHTIG', 'STATISTIK NACH MASS']
      : ['KAFFEEHAUS EITELKEIT', 'ORDENSMANUFAKTUR', 'JUBELBEDARF', 'STEMPEL & FORMULARE', 'HOFBÄCKEREI', 'UNIFORMSCHNEIDEREI', 'BALKON-APOTHEKE', 'FAHNEN & BANNER'];
    names.forEach((name, k) => {
      const y = k * 64;
      c.fillStyle = ['#1f3b30', '#5c1a22', '#1d2a3c', '#2b2b26'][k % 4]; c.fillRect(0, y, 512, 64);
      c.strokeStyle = '#d9b25e'; c.lineWidth = 3; c.strokeRect(5, y + 5, 502, 54);
      c.fillStyle = '#ecd08a'; c.font = `bold ${name.length > 16 ? 30 : 36}px Georgia`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(name, 256, y + 34);
    });
    signs.update();
  }
  // Arch attic inscription (Roman theme): an original satirical dedication, not a historical text.
  const inscription = new DynamicTexture('Kit inscription', { width: 1024, height: 512 }, scene, true);
  {
    const c = inscription.getContext() as CanvasRenderingContext2D;
    c.fillStyle = '#e6dcc4'; c.fillRect(0, 0, 1024, 256); c.fillStyle = '#9a7a3e'; c.textAlign = 'center'; c.textBaseline = 'middle';
    // Every inscription is an original satirical pastiche, never a historical slogan.
    c.font = 'bold 50px Georgia'; c.fillText(pyongyang ? 'PLANMÄSSIGER FORTSCHRITT' : 'SENATVS POPVLVSQVE', 512, 52); c.fillText(pyongyang ? 'NACH MELDUNG' : 'APPLAUDENS', 512, 112);
    c.font = 'italic 18px Georgia'; c.fillText(pyongyang ? 'Abweichung entdeckt · bitte statistisch ausgleichen' : 'Beifall amtlich angeordnet · Vorfahrt dem Sieger von morgen', 512, 150);
    c.fillStyle = '#efe6d2'; c.fillRect(0, 256, 1024, 256); c.fillStyle = '#7d6a4a';
    c.font = 'bold 34px Georgia'; c.fillText(pyongyang ? 'EWIGER PLAN · EWIGE BAUSTELLE' : 'EIN VOLK VON POSEUREN · BALKONREDNERN', 512, 330); c.fillText(pyongyang ? 'APPLAUS BITTE GLEICHMÄSSIG' : 'BAUHERREN · BEIFALLSPFLICHTIGEN', 512, 380);
    c.font = 'italic 20px Georgia'; c.fillText(pyongyang ? 'Erfolg wird nachgereicht' : 'Gestiftet vom Stifter persönlich', 512, 440);
    inscription.update();
  }
  const glowMeshes: Mesh[] = [];
  for (const m of kit.materials) {
    if (!(m instanceof PBRMaterial)) continue;
    if (/stone|roof/.test(m.name)) { m.albedoTexture = stone.color; m.bumpTexture = stone.normal; }
    if (/plaster/.test(m.name)) { m.bumpTexture = plaster.normal; }
    if (/Kit cloth|crowd$/.test(m.name)) { m.bumpTexture = cloth.normal; }
    if (/banner/.test(m.name)) { m.albedoTexture = banner; m.bumpTexture = cloth.normal; }
    // glTF stores V flipped and DynamicTexture inverts Y again: flip V so the lettering stands upright (rows map k → 7-k).
    if (/shop sign/.test(m.name)) { m.albedoTexture = signs; signs.wrapV = 1 /* WRAP */; signs.vScale = -1; m.metallic = .1; m.roughness = .45; }
    if (/inscription/.test(m.name)) { m.albedoTexture = inscription; inscription.wrapV = 1; inscription.vScale = -1; m.metallic = 0; m.roughness = .7; }
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
  const tv = trackPoint(TRACK_INFO.dressing.screenProgress, -(W + 11)); reserved.push({ x: tv.x, z: tv.z, r: 13 });
  const inLawn = (x: number, z: number) => LANDMARKS.lawns.some(([x0, z0, x1, z1]) => x >= x0 - 2 && x <= x1 + 2 && z >= z0 - 2 && z <= z1 + 2);
  const inRiver = (_x: number, z: number) => z < RIVER.north + 1 && z > RIVER.south - 1;
  /** Lateral room the circuit needs at progress s on one side (corridor, promenade, open hazard basins, video wall, gate). */
  const need = (s: number, side: number) => {
    let n = PROMENADE + .6;
    for (const h of HAZARDS) if (side === h.side && s >= h.from - 5 && s <= h.to + 5) n = Math.max(n, W + 1.45 + h.basin + 3);
    if (Math.abs(s - LANDMARKS.gateProgress) < 14) n = Math.max(n, 18.5);
    return n;
  };
  const clearOfCircuit = (x: number, z: number, extra = 0, skipMainRoute = false) => {
    const { s, lane } = trackLocate(x, z);
    if (!skipMainRoute && Math.abs(lane) < need(s, Math.sign(lane) || 1) + extra) return false;
    const a = shortcutLocate(x, z);
    if (a.u > -4 && a.u < SHORTCUT_LENGTH + 4 && Math.abs(a.lane) < SHORTCUT.halfWidth + 6 + extra) return false;
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
      if (!clearOfCircuit(x, z, opts.extra ?? 0, opts.skipCircuit)) return false;
    }
    for (const [x, z] of corners(p, f, 1.4)) { const cell = cellOf(x, z); if (cell >= 0) occupied[cell] = 1; }
    placements.push(p); return true;
  };
  const facing = (x: number, z: number) => { const c = trackLocate(x, z), t = trackPoint(c.s, 0); return Math.atan2(-(t.x - x), -(t.z - z)); };
  const random = rng(1936);
  const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)];

  // --- Hero buildings and fixed civic pieces ---------------------------------------------------------
  const gateAt = trackPoint(LANDMARKS.gateProgress, 0), finishAt = trackPoint(TRACK.start, 0);
  if (pyongyang) placements.push({ m: 'kit-finish', x: finishAt.x, z: finishAt.z, y: elevationAt(TRACK.start), yaw: finishAt.heading });
  else {
    placements.push({ m: rome ? 'kit-arch' : 'kit-gate', x: gateAt.x, z: gateAt.z, y: elevationAt(LANDMARKS.gateProgress), yaw: gateAt.heading });
    placements.push({ m: 'kit-finish', x: finishAt.x, z: finishAt.z, y: elevationAt(TRACK.start), yaw: finishAt.heading });
  }
  if (LANDMARKS.palace) tryPlace({ m: 'kit-palace', x: LANDMARKS.palace[0], z: LANDMARKS.palace[1], yaw: 0 }, { lawnOk: true });
  tryPlace({ m: rome ? 'kit-obelisk' : 'kit-column', x: LANDMARKS.column[0], z: LANDMARKS.column[1], yaw: 0 }, { lawnOk: true });
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; tryPlace({ m: rome ? 'kit-cypress' : 'kit-urn', x: LANDMARKS.column[0] + Math.cos(a) * 12.5, z: LANDMARKS.column[1] + Math.sin(a) * 12.5, yaw: -a }, { lawnOk: true }); }
  const heroFailures: string[] = [];
  for (const h of TRACK_INFO.dressing.heroes) {
    let ok: boolean;
    if (h.s !== undefined) { const p = trackPoint(h.s, h.lane ?? 0); ok = tryPlace({ m: h.m, x: p.x, z: p.z, yaw: h.yaw ?? facing(p.x, p.z) }, { lawnOk: true }); }
    else ok = tryPlace({ m: h.m, x: h.x ?? 0, z: h.z ?? 0, yaw: h.yaw ?? facing(h.x ?? 0, h.z ?? 0) }, { lawnOk: true, riverOk: h.m === 'kit-lighthouse' });
    if (!ok) heroFailures.push(h.m);
  }
  // Diagnostics only: lets browser checks confirm that every hero landmark found a free plot.
  (globalThis as { __DK_CITY?: unknown }).__DK_CITY = { heroFailures };
  const cathedral = TRACK_INFO.dressing.cathedral;
  if (cathedral) tryPlace({ m: 'kit-cathedral', x: cathedral.x, z: cathedral.z, yaw: cathedral.yaw }, { riverOk: false });
  for (const x of TRACK_INFO.dressing.bridges) placements.push({ m: 'kit-bridge', x, z: (RIVER.north + RIVER.south) / 2, yaw: Math.PI / 2, sx: 1.16 * Math.abs(RIVER.north - RIVER.south) / 72 });
  // Quay railings stop on both sides of road crossings; the parallel south-bank rail stays continuous.
  const northBank = Math.max(RIVER.north, RIVER.south), southBank = Math.min(RIVER.north, RIVER.south);
  const northBankGaps = pyongyang ? trackCrossingsAtZ(northBank, 4) : [];
  const crossesGap = (x: number, gaps: [number, number][]) => gaps.some(([left, right]) => x + 5 > left && x - 5 < right);
  const northBankPylonStops: { left: number; x: number }[] = [];
  if (pyongyang) for (const [left] of northBankGaps) {
    let stopX = -Infinity;
    for (const [from, to] of [[12, SHORTCUT_LENGTH * .2 - 8], [SHORTCUT_LENGTH * .8 + 8, SHORTCUT_LENGTH - 12]]) {
      for (let u = from; u <= to; u += 12) for (const side of [-1, 1]) {
        const p = shortcutPoint(u, side * (SHORTCUT.halfWidth + .75));
        if (Math.abs(p.z - northBank) < 6 && p.x < left) stopX = Math.max(stopX, p.x);
      }
    }
    if (Number.isFinite(stopX)) northBankPylonStops.push({ left, x: stopX });
  }
  for (let x = RIVER.west + 5; x < RIVER.east; x += 10) {
    const extendsPastPylon = northBankPylonStops.some((stop) => x < stop.left && x + 5.05 > stop.x);
    if (!crossesGap(x, northBankGaps) && !extendsPastPylon) placements.push({ m: 'kit-quay', x, z: northBank, yaw: 0 });
    placements.push({ m: 'kit-quay', x, z: southBank, yaw: Math.PI });
  }
  for (let x = RIVER.west; x < RIVER.east; x += 2) {
    if (!crossesGap(x, northBankGaps)) { const c = cellOf(x, northBank); if (c >= 0) occupied[c] = 1; }
    const c = cellOf(x, southBank); if (c >= 0) occupied[c] = 1;
  }

  // --- Districts along the circuit -------------------------------------------------------------------
  type District = { from: number; to: number; left: string; right: string };
  const districts: District[] = TRACK_INFO.dressing.districts.map((d) => ({ ...d, to: Math.min(d.to, TRACK.length - 1) }));
  const families: Record<string, string[]> = havana ? {
    colonial: ['kit-colonial-a', 'kit-colonial-b', 'kit-colonial-c', 'kit-colonial-a', 'kit-colonial-b'],
    avenue: ['kit-colonial-b', 'kit-colonial-a'],
  } : rome ? {
    insula: ['kit-rational-a', 'kit-insula-a', 'kit-rational-b', 'kit-insula-c', 'kit-rational-c', 'kit-insula-b'],
    avenue: ['kit-rational-b', 'kit-colonnade', 'kit-rational-a', 'kit-colonnade'],
  } : pyongyang ? {
    city: ['kit-sky-a', 'kit-sky-b', 'kit-sky-c', 'kit-house-d'],
    riverfront: ['kit-sky-a', 'kit-house-d', 'kit-sky-b'],
    avenue: ['kit-sky-b', 'kit-sky-a', 'kit-sky-c', 'kit-sky-b'],
  } : {
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
        if (tryPlace({ m: rome ? 'kit-marble-terrace' : 'kit-grandstand', x: p.x, z: p.z, yaw, s }, { lawnOk: true })) {
          // Duce-Drom: identical oversized athletes on every other terrace parapet (same bald head, same pose).
          if (rome && Math.round(s) % 2 === 0) { const q = trackPoint(s, side * (PROMENADE + 2.4 + 8.2)); placements.push({ m: 'kit-athlete', x: q.x, z: q.z, y: 6.42, yaw }); }
          s += rome ? 21 : 23;
        }
      }
    } else if (families[kind]) {
      for (let s = d.from; s < d.to; s += 1.5) {
        const m = pick(families[kind]);
        const lane = side * (PROMENADE + 2.6 + (kind === 'avenue' ? 3 : random() * .8));
        const p = trackPoint(s, lane);
        if (tryPlace({ m, x: p.x, z: p.z, yaw: facing(p.x, p.z), tint: m.startsWith('kit-rational') ? pick(TRAVERTINE) : tint(), s })) s += (DIMS[m].u1 - DIMS[m].u0) * .55;
      }
    }
    // Roman hill gardens and forum ruins: umbrella pines, cypresses, columns and statues.
    if (kind === 'pines' || kind === 'ruins') {
      for (let s = d.from; s < d.to; s += kind === 'pines' ? 7 : 12) {
        const rows = [PROMENADE + 3 + random() * 3, PROMENADE + 11 + random() * 8];
        for (const lane of rows) {
          const p = trackPoint(s + random() * 3, side * lane);
          const m = random() < .3 ? 'kit-cypress' : random() < .5 ? 'kit-pine' : 'kit-pine-b';
          tryPlace({ m, x: p.x, z: p.z, yaw: random() * 6.28, sc: .85 + random() * .35 }, { lawnOk: true });
        }
      }
      for (let s = d.from + 10; s < d.to - 6; s += kind === 'ruins' ? 26 : 40) {
        const p = trackPoint(s, side * (PROMENADE + 8 + random() * 4));
        const m = kind === 'ruins' ? (random() < .55 ? 'kit-ruin' : 'kit-statue') : 'kit-statue';
        tryPlace({ m, x: p.x, z: p.z, yaw: facing(p.x, p.z) }, { lawnOk: true });
      }
    }
    // Trees: avenue lindens, park groves and the quay promenade.
    if (kind === 'park' || kind === 'avenue' || kind === 'quay' || (kind === 'plaza' && !pyongyang)) {
      for (let s = d.from; s < d.to; s += kind === 'park' ? 4.5 : 11) {
        const rows = kind === 'park' ? [PROMENADE + 3 + random() * 4, PROMENADE + 9 + random() * 8, PROMENADE + 18 + random() * 12] : [PROMENADE + 2.6];
        for (const lane of rows) {
          const p = trackPoint(s + random() * 3, side * lane);
          const m = havana ? (random() < .5 ? 'kit-palm' : 'kit-palm-b') : rome ? (random() < .35 ? 'kit-cypress' : 'kit-pine') : kind === 'park' && random() < .28 ? 'kit-cypress' : 'kit-linden';
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
  const grove = rome ? 17 : 9;
  for (const [x0, z0, x1, z1] of LANDMARKS.lawns) for (let x = x0 + 5; x < x1 - 4; x += grove) for (let z = z0 + 5; z < z1 - 4; z += grove) {
    const m = havana ? (random() < .5 ? 'kit-palm' : 'kit-palm-b') : rome ? (random() < .25 ? 'kit-cypress' : random() < .5 ? 'kit-pine' : 'kit-pine-b') : random() < .3 ? 'kit-cypress' : 'kit-linden';
    tryPlace({ m, x: x + random() * (rome ? 9 : 4), z: z + random() * (rome ? 9 : 4), yaw: random() * 6.28, sc: .9 + random() * .4 }, { lawnOk: true });
  }
  // Promenade furniture between the existing lamps (lamps every 24 m at lane W+2.6).
  // Havana: the cruisers of 1958 are parked along the kerb for good (no spare parts).
  const furniture = havana ? ['kit-oldtimer-a', 'kit-bench', 'kit-oldtimer-b', 'kit-kiosk', 'kit-oldtimer-c', 'kit-bench'] : pyongyang ? ['kit-flag', 'kit-kiosk', 'kit-flag', 'kit-bench', 'kit-flag'] : ['kit-bench', 'kit-bench', 'kit-litfass', 'kit-flag', 'kit-bench', 'kit-kiosk', 'kit-flag'];
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
    placements.push({ m, x: p.x, z: p.z, y: elevationAt(s) + .14, yaw: facing(p.x, p.z) + (m === 'kit-flag' || m.startsWith('kit-oldtimer') ? Math.PI / 2 : 0) });
  }
  // Second line and distant city: taller blocks fill every free plot so no street ends in a void.
  for (let x = GROUND.west + 30; x < GROUND.east - 30; x += 30) for (let z = GROUND.south + 30; z < GROUND.north - 30; z += 30) {
    const px = x + (random() - .5) * 10, pz = z + (random() - .5) * 10;
    const { lane } = trackLocate(px, pz);
    if (Math.abs(lane) < 34) continue;
    const m = pick(havana ? ['kit-colonial-b', 'kit-colonial-a', 'kit-colonial-b', 'kit-colonial-c'] : rome ? ['kit-rational-a', 'kit-rational-c', 'kit-insula-c', 'kit-rational-b'] : pyongyang ? ['kit-sky-a', 'kit-sky-b', 'kit-sky-c', 'kit-house-d'] : ['kit-sky-a', 'kit-sky-b', 'kit-sky-c', 'kit-sky-a']);
    const towardCentre = Math.atan2(-(60 - px), -(-20 - pz));
    const yaw = Math.abs(lane) < 70 ? facing(px, pz) : Math.round(towardCentre / (Math.PI / 2)) * Math.PI / 2;
    tryPlace({ m, x: px, z: pz, yaw, tint: m.startsWith('kit-rational') ? pick(TRAVERTINE) : tint() }, { extra: 18, skipCircuit: Math.abs(lane) > 70 });
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

  if (pyongyang) {
    const stone = new PBRMaterial('Pyongyang monument granite', scene); stone.albedoColor = Color3.FromHexString('#aeb2ad').toLinearSpace(); stone.roughness = .88;
    const statueMetal = new PBRMaterial('Weathered leader statue bronze', scene); statueMetal.albedoColor = Color3.FromHexString('#7b7566').toLinearSpace(); statueMetal.metallic = .48; statueMetal.roughness = .56;
    const paradeOlive = new PBRMaterial('Parade vehicle olive enamel', scene); paradeOlive.albedoColor = Color3.FromHexString('#656b5b').toLinearSpace(); paradeOlive.metallic = .22; paradeOlive.roughness = .62;
    const red = new PBRMaterial('Propaganda panel red', scene); red.albedoColor = Color3.FromHexString('#8d202b').toLinearSpace(); red.roughness = .72;
    const gold = new PBRMaterial('Parade lettering brass', scene); gold.albedoColor = Color3.FromHexString('#d0ae6a').toLinearSpace(); gold.metallic = .42; gold.roughness = .45;
    const decorate = (mesh: Mesh, casts = true) => { mesh.isPickable = false; mesh.receiveShadows = true; meshes.push(mesh); if (casts) shadow.addShadowCaster(mesh); return mesh; };
    const centre = shortcutPoint(SHORTCUT_LENGTH * .5), along = (side: number, forward: number) => ({
      x: centre.x + Math.cos(centre.heading) * side + Math.sin(centre.heading) * forward,
      z: centre.z - Math.sin(centre.heading) * side + Math.cos(centre.heading) * forward,
    });
    const localBox = (name: string, width: number, height: number, depth: number, side: number, y: number, forward: number, material: PBRMaterial, yaw = centre.heading) => {
      const p = along(side, forward), mesh = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
      mesh.position.set(p.x, y, p.z); mesh.rotation.y = yaw; mesh.material = material; return decorate(mesh);
    };
    const gatePosition = (lane: number, forward = 0) => ({
      x: gateAt.x + Math.cos(gateAt.heading) * lane + Math.sin(gateAt.heading) * forward,
      z: gateAt.z - Math.sin(gateAt.heading) * lane + Math.cos(gateAt.heading) * forward,
    });
    for (const lane of [-13.55, 13.55]) {
      const p = gatePosition(lane), pier = MeshBuilder.CreateBox('Monument gate limestone pier', { width: 7.9, height: 15.5, depth: 8 }, scene);
      pier.position.set(p.x, 7.75, p.z); pier.rotation.y = gateAt.heading; pier.material = stone; decorate(pier);
    }
    const gateLintel = MeshBuilder.CreateBox('Monument gate continuous gray lintel', { width: 35.6, height: 4.2, depth: 8.8 }, scene);
    gateLintel.position.set(gateAt.x, 17.6, gateAt.z); gateLintel.rotation.y = gateAt.heading; gateLintel.material = stone; decorate(gateLintel);
    const gateAttic = MeshBuilder.CreateBox('Monument gate upper crown', { width: 30, height: 1.1, depth: 6 }, scene);
    gateAttic.position.set(gateAt.x, 20.25, gateAt.z); gateAttic.rotation.y = gateAt.heading; gateAttic.material = stone; decorate(gateAttic);
    const leaderBase = MeshBuilder.CreateBox('Ewiger Führer statue pedestal', { width: 5.6, height: 1.2, depth: 5.6 }, scene);
    leaderBase.position.set(gateAt.x, 21.4, gateAt.z); leaderBase.rotation.y = gateAt.heading; leaderBase.material = stone; decorate(leaderBase);
    const leaderCoat = MeshBuilder.CreateCylinder('Ewiger Führer monument statue coat', { diameterTop: 3.3, diameterBottom: 4.6, height: 4.4, tessellation: 10 }, scene);
    leaderCoat.position.set(gateAt.x, 24.2, gateAt.z); leaderCoat.material = statueMetal; decorate(leaderCoat);
    const leaderHead = MeshBuilder.CreateSphere('Ewiger Führer monument statue head', { diameterX: 2.3, diameterY: 2.2, diameterZ: 2.3, segments: 8 }, scene);
    leaderHead.position.set(gateAt.x, 27.5, gateAt.z); leaderHead.material = statueMetal; decorate(leaderHead);
    const leaderHair = MeshBuilder.CreateSphere('Ewiger Führer monument statue hair', { diameterX: 2.35, diameterY: .9, diameterZ: 2.35, segments: 8 }, scene);
    leaderHair.position.set(gateAt.x, 28.3, gateAt.z); leaderHair.material = statueMetal; decorate(leaderHair);
    for (const side of [-1, 1]) {
      const p = gatePosition(side * 2.25), arm = MeshBuilder.CreateCylinder('Ewiger Führer monument statue arm', { diameter: .9, height: 3.8, tessellation: 8 }, scene);
      arm.position.set(p.x, 24.45, p.z); arm.rotation.y = gateAt.heading; arm.material = statueMetal; decorate(arm);
    }
    const titleTexture = new DynamicTexture('Ewiger Führer monument title', { width: 512, height: 128 }, scene, false);
    { const c = titleTexture.getContext() as CanvasRenderingContext2D; c.fillStyle = '#8d202b'; c.fillRect(0, 0, 512, 128); c.strokeStyle = '#d0ae6a'; c.lineWidth = 8; c.strokeRect(8, 8, 496, 112); c.fillStyle = '#f1e4c6'; c.font = 'bold 40px Georgia'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('EWIGER FÜHRER', 256, 64); titleTexture.update(); }
    const titleMaterial = new StandardMaterial('Ewiger Führer monument title material', scene); titleMaterial.diffuseTexture = titleTexture; titleMaterial.emissiveColor = new Color3(.08, .025, .02); titleMaterial.specularColor = Color3.Black();
    const titleAt = gatePosition(0, -4.45), title = MeshBuilder.CreatePlane('Ewiger Führer monument title plaque', { width: 6.2, height: 1.55, sideOrientation: Mesh.DOUBLESIDE }, scene);
    title.position.set(titleAt.x, 17.6, titleAt.z); title.rotation.y = gateAt.heading; title.material = titleMaterial; title.isPickable = false; meshes.push(title);
    for (const progress of [...new Set((TRACK_INFO.obstacles ?? []).map((obstacle) => obstacle.s))]) {
      const bridge = trackPoint(progress), height = elevationAt(progress);
      for (const obstacle of TRACK_INFO.obstacles ?? []) {
        if (obstacle.s !== progress) continue;
        const postAt = trackPoint(obstacle.s, obstacle.lane), foot = MeshBuilder.CreateCylinder('Collidable parade bridge pier', { diameter: 1, height: 5.8, tessellation: 10 }, scene);
        foot.position.set(postAt.x, height + 2.9, postAt.z); foot.material = stone; decorate(foot);
        const cap = MeshBuilder.CreateBox('Parade bridge pier brass cap', { width: 1.18, height: .28, depth: 1.18 }, scene);
        cap.position.set(postAt.x, height + 5.75, postAt.z); cap.material = gold; decorate(cap);
      }
      for (const side of [-1, 1]) {
        const wing = trackPoint(progress, side * 4.2);
        const span = MeshBuilder.CreateBox('Parade bridge decorative side wing', { width: 4.2, height: 1.4, depth: 1.5 }, scene);
        span.position.set(wing.x, height + 7, wing.z); span.rotation.y = bridge.heading; span.material = stone; decorate(span);
        const fascia = MeshBuilder.CreateBox('Parade bridge red fascia wing', { width: 4.2, height: .42, depth: .18 }, scene);
        fascia.position.set(wing.x, height + 6.55, wing.z); fascia.rotation.y = bridge.heading; fascia.material = red; decorate(fascia);
      }
      const centreSpan = trackPoint(progress), lintel = MeshBuilder.CreateBox('Parade bridge continuous center lintel', { width: 4.2, height: 1.4, depth: 1.5 }, scene);
      lintel.position.set(centreSpan.x, height + 7, centreSpan.z); lintel.rotation.y = bridge.heading; lintel.material = stone; decorate(lintel);
      const lintelFascia = MeshBuilder.CreateBox('Parade bridge continuous center fascia', { width: 4.2, height: .42, depth: .18 }, scene);
      lintelFascia.position.set(centreSpan.x, height + 6.55, centreSpan.z); lintelFascia.rotation.y = bridge.heading; lintelFascia.material = red; decorate(lintelFascia);
    }
    const plaqueTexture = new DynamicTexture('Leader monument satirical plaques', { width: 512, height: 128 }, scene, false);
    {
      const c = plaqueTexture.getContext() as CanvasRenderingContext2D; c.fillStyle = '#76202a'; c.fillRect(0, 0, 512, 128);
      c.strokeStyle = '#d3b36d'; c.lineWidth = 7; c.strokeRect(8, 8, 496, 112); c.fillStyle = '#f0dfb4'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = 'bold 32px Georgia';
      c.fillText('EWIGER FÜHRER · GARANTIE OHNE ENDE', 256, 64); plaqueTexture.update();
    }
    const plaque = new StandardMaterial('Leader monument plaque', scene); plaque.diffuseTexture = plaqueTexture; plaque.emissiveColor = new Color3(.12, .08, .06); plaque.specularColor = Color3.Black();
    const statue = (side: number, forward: number, label: number) => {
      const p = along(side, forward), prefix = `Leader statue ${label}`;
      const base = MeshBuilder.CreateCylinder(`${prefix} base`, { diameter: 15, height: 1.2, tessellation: 12 }, scene); base.position.set(p.x, .6, p.z); base.material = stone; decorate(base);
      const pedestal = MeshBuilder.CreateBox(`${prefix} pedestal`, { width: 8.5, height: 4.4, depth: 8.5 }, scene); pedestal.position.set(p.x, 3.4, p.z); pedestal.material = stone; decorate(pedestal);
      const robe = MeshBuilder.CreateCylinder(`${prefix} coat`, { diameterTop: 3.6, diameterBottom: 5.4, height: 6.5, tessellation: 10 }, scene); robe.position.set(p.x, 8.85, p.z); robe.material = statueMetal; decorate(robe);
      const head = MeshBuilder.CreateSphere(`${prefix} head`, { diameterX: 2.8, diameterY: 3.2, diameterZ: 2.8, segments: 8 }, scene); head.position.set(p.x, 13.7, p.z); head.material = statueMetal; decorate(head);
      for (const armSide of [-1, 1]) {
        const arm = MeshBuilder.CreateCylinder(`${prefix} arm`, { diameterTop: .8, diameterBottom: 1.05, height: 5.6, tessellation: 8 }, scene);
        arm.position.set(p.x + armSide * 2.5, 9.2, p.z); arm.rotation.z = armSide * -.12; arm.material = statueMetal; decorate(arm);
      }
      const sign = MeshBuilder.CreatePlane(`${prefix} plaque`, { width: 7, height: 1.35, sideOrientation: Mesh.DOUBLESIDE }, scene);
      sign.position.set(p.x, 4.2, p.z - 4.31); sign.material = plaque; sign.isPickable = false; meshes.push(sign);
    };
    // The oversized paired monuments face the parade axis; the joke is their endless warranty plaque.
    statue(-23, -18, 1); statue(23, 18, 2);

    const deck = MeshBuilder.CreateBox('Parade platform over underpass', { width: 21, height: .7, depth: 100 }, scene);
    deck.position.set(centre.x, .05, centre.z); deck.rotation.y = centre.heading; deck.material = stone; decorate(deck);
    for (const side of [-1, 1]) {
      localBox('Parade platform red fascia', 1.1, .9, 100, side * 10.5, -.05, 0, red);
      for (let forward = -42; forward <= 42; forward += 14) localBox('Parade platform brass panel', .12, .36, 6, side * 10.5, .2, forward, gold);
    }
    const tank = (forward: number) => {
      localBox('Display tank lower hull', 3.5, 1.05, 5.8, 0, 1.0, forward, paradeOlive);
      for (const side of [-1, 1]) localBox('Display tank track', .72, 1.15, 6.3, side * 1.72, .72, forward, statueMetal);
      localBox('Display tank upper hull', 2.75, .9, 3.7, 0, 1.9, forward - .2, paradeOlive);
      const position = along(0, forward + .45), turret = MeshBuilder.CreateCylinder('Display tank turret', { diameterTop: 2.2, diameterBottom: 2.65, height: .78, tessellation: 10 }, scene);
      turret.position.set(position.x, 2.68, position.z); turret.rotation.y = centre.heading; turret.material = paradeOlive; decorate(turret);
      const barrelAt = along(0, forward + 2.35), barrel = MeshBuilder.CreateCylinder('Display tank inert barrel', { diameter: .34, height: 3.1, tessellation: 8 }, scene);
      barrel.position.set(barrelAt.x, 2.7, barrelAt.z); barrel.rotation.set(Math.PI / 2, centre.heading, 0); barrel.material = statueMetal; decorate(barrel);
    };
    tank(-29); tank(-8); tank(13);
    localBox('Display transporter cab', 3.4, 2.2, 3.7, 0, 1.55, 34, paradeOlive);
    localBox('Display transporter trailer', 4, 1.35, 11.5, 0, 1.0, 41, statueMetal);
    const rocketBase = along(0, 40), rocket = MeshBuilder.CreateCylinder('Inert parade rocket display', { diameterTop: .72, diameterBottom: 1.25, height: 9.4, tessellation: 10 }, scene);
    rocket.position.set(rocketBase.x, 6.0, rocketBase.z); rocket.rotation.z = -.08; rocket.material = paradeOlive; decorate(rocket);
    const rocketNose = MeshBuilder.CreateCylinder('Inert display rocket nose', { diameterTop: 0, diameterBottom: .74, height: 2.4, tessellation: 10 }, scene);
    rocketNose.position.set(rocketBase.x, 11.7, rocketBase.z); rocketNose.rotation.z = -.08; rocketNose.material = red; decorate(rocketNose);

    const slogan = new DynamicTexture('Pyongyang parade satirical banner', { width: 1024, height: 256 }, scene, true);
    {
      const c = slogan.getContext() as CanvasRenderingContext2D; c.fillStyle = '#7e1b26'; c.fillRect(0, 0, 1024, 256);
      c.strokeStyle = '#d8bc77'; c.lineWidth = 10; c.strokeRect(12, 12, 1000, 232); c.fillStyle = '#f1e4c6'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = 'bold 48px Georgia'; c.fillText('PARADENACHWEIS: 100 %', 512, 85); c.font = 'italic 30px Georgia'; c.fillText('Abweichungen werden feierlich nachgemeldet', 512, 166); slogan.update();
    }
    const banner = new StandardMaterial('Pyongyang parade satire sign', scene); banner.diffuseTexture = slogan; banner.emissiveColor = new Color3(.08, .025, .02); banner.specularColor = Color3.Black();
    const board = MeshBuilder.CreatePlane('Parade satire sign', { width: 25, height: 6, sideOrientation: Mesh.DOUBLESIDE }, scene);
    const boardAt = along(0, -49); board.position.set(boardAt.x, 7.4, boardAt.z); board.rotation.y = centre.heading; board.material = banner; board.isPickable = false; meshes.push(board);

    // A simplified torch tower and stepped hotel silhouette anchor the distant skyline.
    const towerAt = along(76, 18), tower = MeshBuilder.CreateCylinder('Juche torch tower stylized', { diameterTop: 1.8, diameterBottom: 5.2, height: 44, tessellation: 10 }, scene);
    tower.position.set(towerAt.x, 22, towerAt.z); tower.material = stone; decorate(tower);
    const towerTorch = MeshBuilder.CreateSphere('Juche torch abstract flame', { diameter: 7, segments: 8 }, scene); towerTorch.position.set(towerAt.x, 45, towerAt.z); towerTorch.material = red; decorate(towerTorch);
    const hotelAt = along(-82, 30), hotel = MeshBuilder.CreateCylinder('Triangular hotel silhouette', { diameterTop: 0, diameterBottom: 42, height: 52, tessellation: 4 }, scene);
    hotel.position.set(hotelAt.x, 26, hotelAt.z); hotel.rotation.y = Math.PI / 4; hotel.material = stone; decorate(hotel);
  }

  // --- River Spree --------------------------------------------------------------------------------------
  const ripple = new DynamicTexture('River ripples', { width: 256, height: 256 }, scene, true);
  {
    const c = ripple.getContext() as CanvasRenderingContext2D; c.fillStyle = '#8080ff'; c.fillRect(0, 0, 256, 256);
    const r = rng(77);
    for (let k = 0; k < 380; k++) { const x = r() * 256, y = r() * 256, w = 6 + r() * 26; c.strokeStyle = r() < .5 ? 'rgba(104,128,240,.5)' : 'rgba(156,128,250,.45)'; c.lineWidth = 1 + r() * 2; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + w / 2, y + 3 * (r() - .5), x + w, y); c.stroke(); }
    ripple.update();
  }
  ripple.uScale = 60; ripple.vScale = 6;
  const water = new PBRMaterial(pyongyang ? 'Taedong water' : 'River Spree water', scene);
  water.albedoColor = Color3.FromHexString(pyongyang ? '#29454a' : '#2d4f55').toLinearSpace();
  water.metallic = pyongyang ? 0 : .05; water.roughness = pyongyang ? .42 : .07; water.bumpTexture = ripple; ripple.level = pyongyang ? .18 : .45;
  water.environmentIntensity = pyongyang ? .4 : 1.3; water.alpha = pyongyang ? 1 : .94;
  const river = MeshBuilder.CreateGround('River Spree', { width: RIVER.east - RIVER.west, height: RIVER.north - RIVER.south }, scene);
  river.position.set((RIVER.east + RIVER.west) / 2, RIVER.level, (RIVER.north + RIVER.south) / 2); river.material = water; river.isPickable = false; river.receiveShadows = true;
  const bedMaterial = new PBRMaterial('River bed', scene); bedMaterial.albedoColor = Color3.FromHexString('#1d2a26').toLinearSpace(); bedMaterial.roughness = 1;
  const quayWallMaterial = new PBRMaterial('Taedong retaining granite', scene); quayWallMaterial.albedoColor = Color3.FromHexString('#78817e').toLinearSpace(); quayWallMaterial.roughness = .92;
  const quayCopingMaterial = new PBRMaterial('Taedong granite coping', scene); quayCopingMaterial.albedoColor = Color3.FromHexString('#a8afaa').toLinearSpace(); quayCopingMaterial.roughness = .88;
  const quayWaterlineMaterial = new PBRMaterial('Taedong waterline stone', scene); quayWaterlineMaterial.albedoColor = Color3.FromHexString('#59625f').toLinearSpace(); quayWaterlineMaterial.roughness = .95;
  const bed = MeshBuilder.CreateGround('River bed', { width: RIVER.east - RIVER.west, height: RIVER.north - RIVER.south }, scene);
  bed.position.set(river.position.x, -3, river.position.z); bed.material = bedMaterial; bed.isPickable = false;
  for (const z of [RIVER.north, RIVER.south]) {
    const bankDirection = z === northBank ? 1 : -1;
    const gaps = pyongyang && z === northBank ? trackCrossingsAtZ(z, 4) : [];
    let from = GROUND.west;
    for (const [left, right] of [...gaps, [GROUND.east, GROUND.east]]) {
      const to = Math.max(from, Math.min(GROUND.east, left));
      if (to - from > .2) {
        const bank = MeshBuilder.CreateBox('River embankment wall', { width: to - from, height: pyongyang ? 2.8 : 2.6, depth: .6 }, scene);
        bank.position.set((from + to) / 2, pyongyang ? -1.4 : -1.5, z + bankDirection * .3); bank.material = pyongyang ? quayWallMaterial : bedMaterial; bank.isPickable = false;
        if (pyongyang) {
          const coping = MeshBuilder.CreateBox('Taedong quay coping', { width: to - from, height: .14, depth: 1.3 }, scene);
          coping.position.set((from + to) / 2, 0, z + bankDirection * .65); coping.material = quayCopingMaterial; coping.isPickable = false;
          const waterline = MeshBuilder.CreateBox('Taedong waterline ledge', { width: to - from, height: .12, depth: .32 }, scene);
          waterline.position.set((from + to) / 2, RIVER.level + .03, z - bankDirection * .16); waterline.material = quayWaterlineMaterial; waterline.isPickable = false;
        }
      }
      from = Math.max(from, Math.min(GROUND.east, right));
    }
  }
  if (pyongyang) for (const [left, right] of northBankGaps) {
    const crossing = trackLocate((left + right) / 2, northBank), point = trackPoint(crossing.s);
    const deck = MeshBuilder.CreateBox('Taedong road crossing apron', { width: TRACK.halfWidth * 2 + 2, height: 1.2, depth: 10 }, scene);
    deck.position.set(point.x, -.595, point.z); deck.rotation.y = point.heading; deck.material = quayWallMaterial; deck.isPickable = false; deck.receiveShadows = true;
  }
  meshes.push(river, bed);
  // Red and gold paper petals drifting over the grandstand straight (loading-art mood), hard-capped and cheap.
  const petalTexture = new DynamicTexture('Petal sprite', { width: 32, height: 32 }, scene, false);
  { const c = petalTexture.getContext() as CanvasRenderingContext2D; c.fillStyle = '#fff'; c.beginPath(); c.ellipse(16, 16, 13, 7, .6, 0, Math.PI * 2); c.fill(); petalTexture.hasAlpha = true; petalTexture.update(); }
  const straightA = trackPoint(TRACK_INFO.dressing.petals[0], 0), straightB = trackPoint(TRACK_INFO.dressing.petals[1], 0);
  const petals = new ParticleSystem('Stadium petals', 260, scene); petals.particleTexture = petalTexture;
  petals.emitter = new Vector3((straightA.x + straightB.x) / 2, 14, (straightA.z + straightB.z) / 2);
  const halfX = Math.max(26, Math.abs(straightB.x - straightA.x) / 2), halfZ = Math.max(26, Math.abs(straightB.z - straightA.z) / 2);
  petals.minEmitBox = new Vector3(-halfX, 0, -halfZ); petals.maxEmitBox = new Vector3(halfX, 6, halfZ);
  petals.direction1 = new Vector3(-.6, -.4, -.3); petals.direction2 = new Vector3(.6, -.2, .4); petals.gravity = new Vector3(.25, -.55, .1);
  petals.minEmitPower = .2; petals.maxEmitPower = .6; petals.minLifeTime = 9; petals.maxLifeTime = 14; petals.emitRate = 22;
  petals.minSize = .09; petals.maxSize = .17; petals.minAngularSpeed = -3; petals.maxAngularSpeed = 3;
  petals.color1 = new Color4(.72, .08, .1, 1); petals.color2 = new Color4(.9, .7, .3, 1); petals.colorDead = new Color4(.7, .1, .1, 0);
  petals.blendMode = ParticleSystem.BLENDMODE_STANDARD; petals.preWarmCycles = 60; petals.start();
  return {
    glowMeshes, meshes,
    animate(time: number) { ripple.uOffset = time * .012; ripple.vOffset = time * .004; },
  };
}
