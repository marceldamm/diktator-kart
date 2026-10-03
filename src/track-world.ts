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
import { TRACK, trackPoint, trackHeightAt } from './track';
import { LANDMARKS } from './track-layout';
import { surfaceTextures } from './surface-textures';

/** Track furniture generated from the shared centreline: one mesh per material wherever possible. */
export interface TrackWorld { animate(time: number): void; glowMeshes: Mesh[] }

const W = TRACK.halfWidth;
/** Progress ranges dressed with slogan boards instead of plain striped barriers. */
const BOARD_RANGES: [number, number][] = [[2, 92], [282, 372]];

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
  options: { uScale: number; vScale?: number; step?: number; from?: number; to?: number; follow?: boolean; color?: (s: number, lane: number) => [number, number, number] }): Mesh {
  const { uScale, vScale = 1, step = 1, from = 0, to = TRACK.length, follow = false } = options;
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [], colors: number[] = [];
  const along: number[] = [0];
  for (let i = 1; i < profile.length; i++) along.push(along[i - 1] + Math.hypot(profile[i][0] - profile[i - 1][0], profile[i][1] - profile[i - 1][1]));
  const rings = Math.max(1, Math.round((to - from) / step));
  for (let r = 0; r <= rings; r++) {
    const s = from + (to - from) * r / rings;
    profile.forEach(([lane, height], j) => {
      const p = trackPoint(s, lane);
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

export function addTrackWorld(scene: Scene, shadow: ShadowGenerator): TrackWorld {
  // Cobbles at their real 2 m tile scale; slow tonal variation hides tiling and marks a worn racing line.
  const road = pbr(scene, 'Cobblestone boulevard', '#d8d2c2', 0, 1);
  road.albedoTexture = new Texture('/assets/textures/cobble-color.jpg', scene);
  road.bumpTexture = new Texture('/assets/textures/cobble-normal.jpg', scene);
  road.metallicTexture = new Texture('/assets/textures/cobble-arm.jpg', scene);
  road.useRoughnessFromMetallicTextureAlpha = false; road.useRoughnessFromMetallicTextureGreen = true;
  road.useMetallnessFromMetallicTextureBlue = true; road.useAmbientOcclusionFromMetallicTextureRed = true;
  road.invertNormalMapX = true; road.bumpTexture.level = .8;
  for (const t of [road.albedoTexture, road.bumpTexture, road.metallicTexture]) { t.wrapU = t.wrapV = Texture.WRAP_ADDRESSMODE; t.anisotropicFilteringLevel = 8; }
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
  for (const side of [-1, 1]) sweep(scene, `Kerb ${side}`, side < 0 ? [[-W - .95, .08], [-W - .1, .05], [-W, .025]] : [[W, .025], [W + .1, .05], [W + .95, .08]], kerb, { uScale: 2.4, step: .6 });
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
  for (const range of ranges) for (const side of [-1, 1]) {
    const profile = side < 0 ? wall(-1).reverse() : wall(1);
    // Only the face toward the road (first two profile points) carries the stripes; v is normalised.
    const mesh = sweep(scene, `Barrier ${side}`, profile, range.boards ? board : barrier, { uScale: range.boards ? 32 : 4.8, vScale: 2.4, step: .8, from: range.from, to: range.to });
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
    sweep(scene, `Promenade ${side}`, lanes, paving, { uScale: 3, vScale: 3, step: 1.2 });
    sweep(scene, `Promenade edge ${side}`, side < 0 ? [[-outer - .3, 0], [-outer, .14]] : [[outer, .14], [outer + .3, 0]], kerbStone, { uScale: 1, step: 2 });
  }
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
    glowMeshes: [globe],
    animate(time) { updateBanners(time); pennants.position.y = Math.sin(time * 1.3) * .04; },
  };
}
