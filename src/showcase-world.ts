import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Scene } from '@babylonjs/core/scene';

function surface(scene: Scene, name: string, color: Color3, shine = 0): StandardMaterial {
  const result = new StandardMaterial(name, scene);
  result.diffuseColor = color;
  result.specularColor = new Color3(shine, shine, shine);
  return result;
}

function box(scene: Scene, name: string, width: number, height: number, depth: number,
  x: number, y: number, z: number, material: StandardMaterial): void {
  const mesh = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
  mesh.position.set(x, y, z);
  mesh.material = material;
}

/** Decorative, non-colliding M2/M3 style study around the existing physics test area. */
export function addShowcaseWorld(scene: Scene): void {
  scene.clearColor = new Color4(0.53, 0.68, 0.78, 1);
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.006;
  scene.fogColor = new Color3(0.66, 0.69, 0.68);
  const sun = new DirectionalLight('late-sun', new Vector3(-0.45, -0.8, 0.35), scene);
  sun.diffuse = new Color3(1, 0.76, 0.52);
  sun.intensity = 1.15;

  const asphalt = surface(scene, 'boulevard-asphalt', new Color3(0.17, 0.19, 0.21), 0.12);
  const roadGrain = new DynamicTexture('road-grain', { width: 512, height: 512 }, scene, false);
  const paint = roadGrain.getContext();
  paint.fillStyle = '#35383a';
  paint.fillRect(0, 0, 512, 512);
  let seed = 1709;
  for (let index = 0; index < 12000; index++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const x = seed & 511;
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const y = seed & 511;
    paint.fillStyle = index % 3 === 0 ? '#4b4c49' : '#262d2e';
    paint.fillRect(x, y, 1 + index % 3, 1 + index % 2);
  }
  roadGrain.update();
  roadGrain.uScale = 4;
  roadGrain.vScale = 9;
  asphalt.diffuseColor = Color3.White();
  asphalt.diffuseTexture = roadGrain;
  const stone = surface(scene, 'plaza-stone', new Color3(0.52, 0.48, 0.42), 0.06);
  const pale = surface(scene, 'facade-limestone', new Color3(0.68, 0.62, 0.51), 0.08);
  const shadow = surface(scene, 'arch-shadow', new Color3(0.17, 0.2, 0.21), 0.03);
  const trim = surface(scene, 'warm-brass-trim', new Color3(0.76, 0.57, 0.25), 0.42);
  const red = surface(scene, 'civic-theatre-red', new Color3(0.42, 0.1, 0.11), 0.06);
  const glass = surface(scene, 'window-glass', new Color3(0.16, 0.25, 0.3), 0.35);
  const lampGlow = surface(scene, 'lamp-glow', new Color3(1, 0.8, 0.47), 0.05);
  lampGlow.emissiveColor = new Color3(0.85, 0.53, 0.19);

  const ground = MeshBuilder.CreateGround('city-ground', { width: 130, height: 130 }, scene);
  ground.material = stone;
  const road = MeshBuilder.CreateGround('boulevard-road', { width: 31, height: 80 }, scene);
  road.position.y = 0.014;
  road.material = asphalt;
  for (const side of [-1, 1]) {
    box(scene, `road-edge-${side}`, 0.16, 0.07, 80, side * 15.1, 0.055, 0, trim);
    box(scene, `walkway-${side}`, 8.5, 0.1, 80, side * 19.5, 0.05, 0, pale);
    box(scene, `walkway-rim-${side}`, 0.28, 0.19, 80, side * 15.75, 0.1, 0, stone);
    for (let z = -35; z <= 35; z += 7) {
      box(scene, `pavement-joint-${side}-${z}`, 8.5, 0.012, 0.055,
        side * 19.5, 0.108, z, stone);
    }
  }
  for (let z = -35; z <= 35; z += 5) {
    box(scene, `center-line-${z}`, 0.13, 0.016, 2.5, 0, 0.027, z, pale);
  }
  for (let x = -14; x <= 14; x += 2) {
    box(scene, `start-stripe-${x}`, 0.85, 0.016, 0.65, x, 0.028, -15, pale);
  }

  // A fictional civic theatre: repeated stone modules form a clear silhouette.
  box(scene, 'stadium-podium', 49, 2.4, 5, 0, 1.2, 48, stone);
  box(scene, 'stadium-upper-wall', 49, 4.2, 3.2, 0, 9.4, 49, pale);
  box(scene, 'stadium-roof', 53, 0.8, 6, 0, 12, 48.5, trim);
  box(scene, 'stadium-roof-cap', 55, 0.3, 6.5, 0, 12.55, 48.5, pale);
  for (let index = -5; index <= 5; index++) {
    const x = index * 4.1;
    box(scene, `stadium-bay-${index}`, 3.1, 6.2, 0.35, x, 5.1, 45.3, shadow);
    box(scene, `stadium-column-left-${index}`, 0.42, 7.2, 0.5, x - 1.65, 5.4, 45, pale);
    box(scene, `stadium-bay-head-${index}`, 3.55, 0.54, 0.65, x, 8.8, 45, pale);
    box(scene, `stadium-bay-sill-${index}`, 3.55, 0.35, 0.62, x, 1.65, 45, trim);
  }
  box(scene, 'stadium-last-column', 0.42, 7.2, 0.5, 5 * 4.1 + 1.65, 5.4, 45, pale);
  for (const side of [-1, 1]) {
    box(scene, `stadium-wing-${side}`, 11, 10, 7, side * 28.5, 5.2, 48, stone);
    box(scene, `stadium-wing-cornice-${side}`, 12, 0.65, 7.5, side * 28.5, 10.2, 48, trim);
    box(scene, `stadium-wing-banner-${side}`, 2.3, 4.6, 0.12, side * 27.5, 6.7, 44.35, red);
    box(scene, `stadium-wing-banner-hem-${side}`, 2.5, 0.16, 0.15, side * 27.5, 4.4, 44.24, trim);
  }

  // Low-detail side façades stay beyond the drivable boundary and use one palette.
  for (const side of [-1, 1]) {
    for (let index = 0; index < 5; index++) {
      const z = -29 + index * 13;
      const height = 8 + (index % 3) * 1.35;
      const x = side * 32.5;
      box(scene, `facade-${side}-${index}`, 10, height, 9, x, height / 2, z,
        index % 2 === 0 ? pale : stone);
      box(scene, `facade-cap-${side}-${index}`, 10.8, 0.45, 9.5, x, height + 0.2, z, trim);
      for (let floor = 0; floor < 2; floor++) {
        for (let bay = -1; bay <= 1; bay++) {
          box(scene, `window-${side}-${index}-${floor}-${bay}`, 0.16, 1.7, 1.6,
            side * 27.45, 3.2 + floor * 2.8, z + bay * 2.7, glass);
          box(scene, `window-sill-${side}-${index}-${floor}-${bay}`, 0.33, 0.18, 2,
            side * 27.35, 2.3 + floor * 2.8, z + bay * 2.7, trim);
        }
      }
    }
  }

  for (const side of [-1, 1]) {
    for (let z = -28; z <= 28; z += 14) {
      const x = side * 20.6;
      const post = MeshBuilder.CreateCylinder(`lamppost-${side}-${z}`,
        { diameterTop: 0.14, diameterBottom: 0.3, height: 5.2, tessellation: 8 }, scene);
      post.position.set(x, 2.65, z);
      post.material = shadow;
      box(scene, `lamp-cap-${side}-${z}`, 0.8, 0.18, 0.8, x, 5.68, z, trim);
      const glow = MeshBuilder.CreateSphere(`lamp-${side}-${z}`, { diameter: 0.54, segments: 8 }, scene);
      glow.position.set(x, 5.36, z);
      glow.material = lampGlow;
      box(scene, `banner-${side}-${z}`, 0.08, 2.8, 1.45,
        x + side * 0.12, 3.6, z + 1.1, red);
      box(scene, `banner-edge-${side}-${z}`, 0.1, 0.12, 1.55,
        x + side * 0.13, 2.18, z + 1.1, trim);
    }
  }

  // The architectural modules are static. One mesh per material keeps the
  // visual study measurable on ordinary PCs instead of issuing hundreds of draws.
  const groups = new Map<StandardMaterial, Mesh[]>();
  for (const mesh of [...scene.meshes]) {
    if (!(mesh instanceof Mesh) || !(mesh.material instanceof StandardMaterial)) continue;
    const group = groups.get(mesh.material) ?? [];
    group.push(mesh);
    groups.set(mesh.material, group);
  }
  for (const [sharedMaterial, meshes] of groups) {
    if (meshes.length < 2) continue;
    const merged = Mesh.MergeMeshes(meshes, true, true);
    if (!merged) throw new Error(`Kulissenmodule konnten nicht zusammengefügt werden: ${sharedMaterial.name}`);
    merged.name = `world-${sharedMaterial.name}`;
    merged.isPickable = false;
  }
}
