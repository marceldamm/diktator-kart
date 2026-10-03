import type { Camera } from '@babylonjs/core/Cameras/camera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { Scene } from '@babylonjs/core/scene';
import { TERRAIN_BUMPS, TEST_AREA_HALF_SIZE, TEST_OBSTACLES, WHEEL_POSITIONS, type KartState } from './kart-model';
import { addShowcaseWorld } from './showcase-world';
import { createSliceScene } from './slice-scene';
import type {ItemWorld} from './items';
import type { LoadingReporter } from './loading-progress';

export interface TestScene {
  scene: Scene;
  present(state: KartState, loadKarts: KartState[]): void;
  setPlayerVisible(visible: boolean): void;
  setQuality?(level: number, reducedEffects: boolean): void;
  presentItems?(world:ItemWorld,karts:KartState[]):void;
  /** Builds the post-processing chain for the active gameplay camera. */
  attachCamera?(camera: Camera): void;
  celebrate?(kind: 'start' | 'finish'): void;
  resetEffects?(): void;
  /** State TV wall: which kart the live camera follows and the caption under the picture. */
  broadcast?(kart: number, caption: string): void;
  /** Ability feedback: transformation burst, revert burst, run-over dust. */
  abilityEvent?(kind: 'transform' | 'revert' | 'crush', kart: number, target?: number): void;
  /** Weather: false = late-afternoon sun, true = rain with wet road, puddles and lightning. */
  setRain?(rain: boolean): void;
  /** Puddle discs for splash/drag rules in rain (empty in sunshine). */
  puddles?(): { x: number; z: number; r: number }[];
  /** Dresses the six karts; order[kart] is the CAST index (kart 0 = player). */
  setRoster?(order: number[]): void;
  /** Portrait images (data URLs) of every CAST member, rendered from the race models. */
  portraits?(order: number[]): Promise<string[]>;
  /** Called on a lightning flash so the audio can thunder. */
  onLightning?: () => void;
}

function material(scene: Scene, name: string, color: Color3): StandardMaterial {
  const result = new StandardMaterial(name, scene);
  result.diffuseColor = color;
  return result;
}

export async function createTestScene(engine: Engine, loadKartCount = 0, showcase = true, quality=1, report?: LoadingReporter): Promise<TestScene> {
  if (showcase) return createSliceScene(engine, loadKartCount,quality,report);
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.53, 0.68, 0.78, 1);
  const sky = new HemisphericLight('sky-light', new Vector3(0.2, 1, 0.4), scene);
  sky.intensity = 0.78;
  if (showcase) addShowcaseWorld(scene);
  else {
    scene.clearColor = new Color4(0.035, 0.075, 0.12, 1);
    const ground = MeshBuilder.CreateGround('test-ground', { width: 48, height: 48 }, scene);
    ground.material = material(scene, 'ground-mat', new Color3(0.12, 0.2, 0.21));
    const gridMaterial = material(scene, 'grid-mat', new Color3(0.2, 0.31, 0.32));
    for (let coordinate = -20; coordinate <= 20; coordinate += 5) {
      const horizontal = MeshBuilder.CreateBox(`grid-x-${coordinate}`,
        { width: 46, height: 0.012, depth: 0.025 }, scene);
      horizontal.position.set(0, 0.012, coordinate);
      horizontal.material = gridMaterial;
      const vertical = MeshBuilder.CreateBox(`grid-z-${coordinate}`,
        { width: 0.025, height: 0.012, depth: 46 }, scene);
      vertical.position.set(coordinate, 0.012, 0);
      vertical.material = gridMaterial;
    }
  }

  TERRAIN_BUMPS.forEach((bump, index) => {
    const x = bump.halfWidth;
    const z0 = bump.z - bump.halfLength;
    const z1 = bump.z + bump.halfLength;
    const positions = [-x, 0.012, z0, x, 0.012, z0,
      -x, bump.height, bump.z, x, bump.height, bump.z,
      -x, 0.012, z1, x, 0.012, z1];
    const indices = [0, 2, 1, 1, 2, 3, 2, 4, 3, 3, 4, 5];
    const normals: number[] = [];
    VertexData.ComputeNormals(positions, indices, normals);
    const surface = new Mesh(`marked-bump-${index + 1}`, scene);
    const data = new VertexData();
    data.positions = positions;
    data.indices = indices;
    data.normals = normals;
    data.applyToMesh(surface);
    const bumpMaterial = material(scene, `bump-${index + 1}-mat`, index === 0
      ? new Color3(0.17, 0.69, 0.71) : new Color3(0.95, 0.56, 0.13));
    bumpMaterial.backFaceCulling = false;
    bumpMaterial.emissiveColor = index === 0
      ? new Color3(0.1, 0.35, 0.36) : new Color3(0.45, 0.23, 0.04);
    surface.material = bumpMaterial;
  });
  const obstacleMaterial = material(scene, 'obstacle-mat', new Color3(0.78, 0.14, 0.17));
  obstacleMaterial.emissiveColor = new Color3(0.22, 0.03, 0.04);
  const obstacleTopMaterial = material(scene, 'obstacle-top-mat', new Color3(0.98, 0.78, 0.22));
  TEST_OBSTACLES.forEach((obstacle, index) => {
    const block = MeshBuilder.CreateBox(`test-obstacle-${index}`, {
      width: obstacle.halfWidth * 2, height: obstacle.height, depth: obstacle.halfDepth * 2,
    }, scene);
    block.position.set(obstacle.x, obstacle.height / 2, obstacle.z);
    block.material = obstacleMaterial;
    const marker = MeshBuilder.CreateBox(`test-obstacle-marker-${index}`, {
      width: obstacle.halfWidth * 2 + 0.06, height: 0.05, depth: obstacle.halfDepth * 2 + 0.06,
    }, scene);
    marker.position.set(obstacle.x, obstacle.height + 0.025, obstacle.z);
    marker.material = obstacleTopMaterial;
  });

  const borderMaterial = material(scene, 'border-mat', showcase
    ? new Color3(0.71, 0.63, 0.49) : new Color3(0.93, 0.65, 0.16));
  for (const side of [-1, 1]) {
    const alongX = MeshBuilder.CreateBox(`boundary-x-${side}`, { width: 48, height: 0.35, depth: 0.18 }, scene);
    alongX.position.set(0, 0.18, side * 23.9);
    alongX.material = borderMaterial;
    const alongZ = MeshBuilder.CreateBox(`boundary-z-${side}`, { width: 0.18, height: 0.35, depth: 48 }, scene);
    alongZ.position.set(side * 23.9, 0.18, 0);
    alongZ.material = borderMaterial;
  }

  const root = new TransformNode('test-kart-root', scene);
  const bodyMaterial = material(scene, 'kart-body-mat', new Color3(0.56, 0.055, 0.065));
  bodyMaterial.specularColor = new Color3(0.58, 0.36, 0.25);
  const noseMaterial = material(scene, 'kart-nose-mat', new Color3(0.88, 0.66, 0.23));
  noseMaterial.specularColor = new Color3(0.65, 0.52, 0.28);
  const wheelMaterial = material(scene, 'kart-wheel-mat', new Color3(0.04, 0.06, 0.07));
  const body = MeshBuilder.CreateBox('kart-body', { width: 1.4, height: 0.45, depth: 2.1 }, scene);
  body.position.y = 0.65;
  body.material = bodyMaterial;
  body.parent = root;
  const nose = MeshBuilder.CreateBox('kart-front', { width: 1.2, height: 0.12, depth: 0.42 }, scene);
  nose.position.set(0, 0.89, 0.72);
  nose.material = noseMaterial;
  nose.parent = root;
  const seat = MeshBuilder.CreateBox('kart-seat', { width: 0.68, height: 0.45, depth: 0.45 }, scene);
  seat.position.set(0, 1.05, -0.45);
  seat.material = wheelMaterial;
  seat.parent = root;
  const grille = MeshBuilder.CreateBox('kart-grille', { width: 0.82, height: 0.29, depth: 0.08 }, scene);
  grille.position.set(0, 0.57, 1.08);
  grille.material = wheelMaterial;
  grille.parent = root;
  for (const side of [-1, 1]) {
    const skirt = MeshBuilder.CreateBox(`kart-skirt-${side}`, { width: 0.16, height: 0.23, depth: 1.55 }, scene);
    skirt.position.set(side * 0.75, 0.46, 0);
    skirt.material = noseMaterial;
    skirt.parent = root;
    const headlamp = MeshBuilder.CreateSphere(`kart-headlamp-${side}`, { diameter: 0.22, segments: 10 }, scene);
    headlamp.position.set(side * 0.49, 0.82, 1.02);
    headlamp.material = noseMaterial;
    headlamp.parent = root;
    const exhaust = MeshBuilder.CreateCylinder(`kart-exhaust-${side}`,
      { diameter: 0.13, height: 0.56, tessellation: 12 }, scene);
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(side * 0.52, 0.57, -1.18);
    exhaust.material = noseMaterial;
    exhaust.parent = root;
  }
  // Neutral test driver; character identity and historical details require joint selection.
  const coatMaterial = material(scene, 'test-driver-coat', new Color3(0.1, 0.14, 0.2));
  const skinMaterial = material(scene, 'test-driver-face', new Color3(0.7, 0.48, 0.34));
  const capMaterial = material(scene, 'test-driver-cap', new Color3(0.1, 0.12, 0.15));
  const torso = MeshBuilder.CreateSphere('test-driver-torso', { diameter: 0.76, segments: 12 }, scene);
  torso.scaling.set(1, 0.9, 0.7);
  torso.position.set(0, 1.27, -0.42);
  torso.material = coatMaterial;
  torso.parent = root;
  const head = MeshBuilder.CreateSphere('test-driver-head', { diameter: 0.48, segments: 12 }, scene);
  head.position.set(0, 1.81, -0.42);
  head.material = skinMaterial;
  head.parent = root;
  const cap = MeshBuilder.CreateSphere('test-driver-helmet', { diameter: 0.52, segments: 12 }, scene);
  cap.scaling.y = 0.46;
  cap.position.set(0, 2.03, -0.43);
  cap.material = capMaterial;
  cap.parent = root;
  const cockpitRim = MeshBuilder.CreateTorus('kart-steering-wheel',
    { diameter: 0.41, thickness: 0.045, tessellation: 18 }, scene);
  cockpitRim.rotation.x = Math.PI / 2.8;
  cockpitRim.position.set(0, 1.17, 0.12);
  cockpitRim.material = wheelMaterial;
  cockpitRim.parent = root;
  const feedbackMaterial = material(scene, 'drive-feedback-mat', new Color3(0.02, 0.2, 0.25));
  const driftGlow = new Color3(0.06, 0.7, 1);
  const turboGlow = new Color3(1, 0.4, 0.02);
  const turboBodyGlow = new Color3(0.25, 0.09, 0.01);
  const idleBodyGlow = Color3.Black();
  feedbackMaterial.emissiveColor = driftGlow;
  const feedbackLights = [-0.42, 0.42].map((x) => {
    const light = MeshBuilder.CreateSphere(`drive-feedback-${x}`, { diameter: 0.28, segments: 8 }, scene);
    light.position.set(x, 0.55, -1.25);
    light.material = feedbackMaterial;
    light.parent = root;
    light.setEnabled(false);
    return light;
  });
  const wheels = WHEEL_POSITIONS.map(({ x, z }, index) => {
    const wheel = MeshBuilder.CreateCylinder(`wheel-${index}`, { diameter: 0.52, height: 0.24, tessellation: 16 }, scene);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.34, z);
    wheel.material = wheelMaterial;
    wheel.parent = root;
    const hub = MeshBuilder.CreateCylinder(`wheel-hub-${index}`,
      { diameter: 0.23, height: 0.26, tessellation: 14 }, scene);
    hub.position.set(0, 0, 0);
    hub.material = noseMaterial;
    hub.parent = wheel;
    return wheel;
  });
  const loadVisuals = Array.from({ length: loadKartCount }, (_, index) => {
    const clone = root.clone(`load-kart-${index + 1}`, null);
    if (!clone) throw new Error('Test-Kart konnte nicht für die Lastprobe kopiert werden.');
    clone.getChildMeshes().filter((mesh) => mesh.name.includes('drive-feedback')).forEach((mesh) => mesh.setEnabled(false));
    const clonedWheels = WHEEL_POSITIONS.map((_, wheelIndex) =>
      clone.getChildMeshes().find((mesh) => mesh.name.includes(`wheel-${wheelIndex}`)));
    if (clonedWheels.some((wheel) => !wheel)) throw new Error('Radkopien für die Lastprobe fehlen.');
    return { root: clone, wheels: clonedWheels };
  });
  const shadowMaterial = material(scene, 'kart-contact-shadow', new Color3(0.015, 0.02, 0.025));
  shadowMaterial.alpha = 0.36;
  shadowMaterial.disableLighting = true;
  shadowMaterial.backFaceCulling = false;
  const contactShadows = Array.from({ length: loadKartCount + 1 }, (_, index) => {
    const shadow = MeshBuilder.CreateDisc(`kart-contact-shadow-${index}`, { radius: 1, tessellation: 24 }, scene);
    shadow.rotation.x = Math.PI / 2;
    shadow.scaling.y = 1.42;
    shadow.position.y = 0.04;
    shadow.material = shadowMaterial;
    return shadow;
  });

  // The state boundary lies inside the visual rail, so the kart never disappears.
  if (TEST_AREA_HALF_SIZE >= 23.9) throw new Error('Testbereich muss innerhalb des sichtbaren Randes liegen.');

  return {
    scene,
    setPlayerVisible(visible: boolean) { root.setEnabled(visible); },
    present(state: KartState, loadKarts: KartState[]) {
      contactShadows[0].position.x = state.x;
      contactShadows[0].position.z = state.z;
      root.position.set(state.x, state.height + state.suspensionOffset, state.z);
      root.rotation.y = state.heading;
      root.rotation.x = -state.bodyPitch + state.impactVelocityZ * 0.05;
      root.rotation.z = state.bodyRoll + state.impactVelocityX * 0.06 + (state.drifting ? -state.driftDirection * 0.12 : 0);
      wheels.forEach((wheel, index) => {
        wheel.position.y = 0.34 + (state.grounded ? state.wheelGroundHeights[index] - state.suspensionOffset : 0);
      });
      loadVisuals.forEach((visual, index) => {
        const other = loadKarts[index];
        if (!other) return;
        contactShadows[index + 1].position.x = other.x;
        contactShadows[index + 1].position.z = other.z;
        visual.root.position.set(other.x, other.height + other.suspensionOffset, other.z);
        visual.root.rotation.set(-other.bodyPitch + other.impactVelocityZ * 0.05, other.heading,
          other.bodyRoll + other.impactVelocityX * 0.06 + (other.drifting ? -other.driftDirection * 0.12 : 0));
        visual.wheels.forEach((wheel, wheelIndex) => {
          if (wheel) wheel.position.y = 0.34 + (other.grounded ? other.wheelGroundHeights[wheelIndex] - other.suspensionOffset : 0);
        });
      });
      const turbo = state.turboRemaining > 0;
      feedbackMaterial.emissiveColor = turbo ? turboGlow : driftGlow;
      feedbackLights.forEach((light) => light.setEnabled(state.drifting || turbo));
      bodyMaterial.emissiveColor = turbo ? turboBodyGlow : idleBodyGlow;
    },
  };
}
