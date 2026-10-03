import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { LoadAssetContainerAsync, ImportMeshAsync } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import { TRACK, trackPoint } from './track';
import type { TestScene } from './scene';
import { surfaceTextures } from './surface-textures';

function pbr(scene: Scene, name: string, hex: string, metal = 0, roughness = .7): PBRMaterial {
  const m = new PBRMaterial(name, scene); m.albedoColor = Color3.FromHexString(hex);
  m.metallic = metal; m.roughness = roughness; return m;
}

function ribbon(scene: Scene, name: string, inner: number, outer: number, y: number, material: PBRMaterial): Mesh {
  const positions: number[] = [], indices: number[] = [], uvs: number[] = [];
  for (let i = 0; i <= 256; i++) {
    const s = i / 256 * TRACK.length;
    for (const lane of [inner, outer]) {
      const p = trackPoint(s, lane); positions.push(p.x, y, p.z); uvs.push(s / 6, (lane - inner) / 6);
    }
    if (i < 256) { const k = i * 2; indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const normals: number[] = []; VertexData.ComputeNormals(positions, indices, normals);
  const mesh = new Mesh(name, scene), data = new VertexData();
  data.positions = positions; data.indices = indices; data.normals = normals; data.uvs = uvs;
  data.applyToMesh(mesh); mesh.material = material; mesh.receiveShadows = true; return mesh;
}

function cobbles(scene: Scene): DynamicTexture {
  const t = new DynamicTexture('Original cobble atlas', 1024, scene, true);
  const c = t.getContext(); c.fillStyle = '#272c2c'; c.fillRect(0, 0, 1024, 1024);
  let seed = 913;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let row = 0; row < 32; row++) for (let column = -1; column < 17; column++) {
    const x = column * 64 + (row % 2 ? 32 : 0), y = row * 32, v = 65 + Math.floor(random() * 26);
    c.fillStyle = `rgb(${v},${v + 2},${v + 1})`; c.fillRect(x + 2, y + 2, 60, 28);
    c.fillStyle = `rgba(205,201,181,${.07 + random() * .12})`; c.fillRect(x + 3, y + 3, 58, 2);
    c.fillStyle = '#282d2d'; c.fillRect(x + 2, y + 28, 60, 2);
  }
  for (let i = 0; i < 80000; i++) {
    c.fillStyle = random() > .5 ? '#ffffff0a' : '#00000010'; c.fillRect(random() * 1024, random() * 1024, 1, 1);
  }
  t.update(); t.wrapU = Texture.WRAP_ADDRESSMODE; t.wrapV = Texture.WRAP_ADDRESSMODE; t.anisotropicFilteringLevel = 8; return t;
}

function glowMaterial(scene: Scene, name: string, color: string): StandardMaterial {
  const m = new StandardMaterial(name, scene); m.diffuseColor = Color3.FromHexString(color);
  m.emissiveColor = m.diffuseColor; m.disableLighting = true; return m;
}

function addTrackWorld(scene: Scene, shadow: ShadowGenerator): void {
  const road = pbr(scene, 'Cobblestone boulevard', '#ffffff', .08, .55); road.albedoTexture = cobbles(scene);
  ribbon(scene, '441 metre racing circuit', -7.5, 7.5, .018, road);
  const pavement = pbr(scene, 'Pale sidewalk', '#ac9a78', 0, .82);
  const grass = pbr(scene, 'Park lawn', '#42513a', 0, .93);
  const grassMaps = surfaceTextures(scene, 'Lawn', 'grass'); grass.albedoTexture = grassMaps.color; grass.bumpTexture = grassMaps.normal;
  grassMaps.color.uScale = grassMaps.color.vScale = 180; grassMaps.normal.uScale = grassMaps.normal.vScale = 180;
  const ground = MeshBuilder.CreateGround('Park and city terrain', { width: 600, height: 600 }, scene);
  ground.material = grass; ground.receiveShadows = true;
  for (const side of [-1, 1]) ribbon(scene, `Track sidewalk ${side}`, side < 0 ? -13 : 7.5, side < 0 ? -7.5 : 13, .026, pavement);
  const red = pbr(scene, 'Racing barrier burgundy', '#832d2d', .08, .65);
  const ivory = pbr(scene, 'Racing barrier ivory', '#d7c9a8', .04, .65);
  const metal = pbr(scene, 'Street iron', '#263637', .7, .4);
  const gold = pbr(scene, 'Street brass', '#b48b48', .68, .32);
  const lamp = glowMaterial(scene, 'Street lantern glow', '#ffca7e');
  const groups = new Map<string, Mesh[]>();
  const group = (mesh: Mesh, material: PBRMaterial | StandardMaterial) => {
    mesh.material = material; const a = groups.get(material.name) ?? []; a.push(mesh); groups.set(material.name, a);
  };
  for (let s = 0; s < TRACK.length; s += 2.3) for (const side of [-1, 1]) {
    const p = trackPoint(s, side * 7.65);
    const curb = MeshBuilder.CreateBox('Alternating safety barrier', { width: .38, height: .62, depth: 2.22 }, scene);
    curb.position.set(p.x, .32, p.z); curb.rotation.y = p.heading;
    group(curb, Math.floor(s / 2.3) % 2 ? ivory : red);
  }
  for (let s = 0; s < TRACK.length; s += 22) for (const side of [-1, 1]) {
    const p = trackPoint(s, side * 11);
    const post = MeshBuilder.CreateCylinder('Lantern post', { diameterBottom: .22, diameterTop: .09, height: 4.5, tessellation: 8 }, scene);
    post.position.set(p.x, 2.3, p.z); group(post, metal);
    const foot = MeshBuilder.CreateCylinder('Lantern base', { diameter: .45, height: .42, tessellation: 8 }, scene);
    foot.position.set(p.x, .22, p.z); group(foot, metal);
    const light = MeshBuilder.CreateBox('Lantern glass', { width: .33, height: .55, depth: .33 }, scene);
    light.position.set(p.x, 4.72, p.z); group(light, lamp);
    const cap = MeshBuilder.CreateCylinder('Lantern crown', { diameterBottom: .6, diameterTop: .05, height: .3, tessellation: 4 }, scene);
    cap.position.set(p.x, 5.13, p.z); group(cap, gold);
  }
  // Tangible track signage. Satire is fictional; no historic insignia are used.
  const signTexture = new DynamicTexture('Civic poster', { width: 512, height: 512 }, scene, true);
  const c = signTexture.getContext() as CanvasRenderingContext2D; c.fillStyle = '#731e29'; c.fillRect(0, 0, 512, 512);
  c.strokeStyle = '#d7b573'; c.lineWidth = 12; c.strokeRect(22, 22, 468, 468);
  c.fillStyle = '#efdfb6'; c.textAlign = 'center'; c.font = 'bold 48px Georgia';
  c.fillText('FREIE FAHRT', 256, 132); c.font = '30px Georgia'; c.fillText('NACH ANTRAG', 256, 190);
  c.font = 'bold 125px Georgia'; c.fillText('§', 256, 345); c.font = '22px Georgia'; c.fillText('FORMULAR 08 / 15', 256, 438);
  signTexture.update(); const sign = pbr(scene, 'Satirical racing poster', '#ffffff'); sign.albedoTexture = signTexture;
  for (const s of [47, 190, 295, 400]) {
    const p = trackPoint(s, 10);
    const poster = MeshBuilder.CreateBox('Race poster', { width: 2.6, height: 3, depth: .08 }, scene);
    poster.position.set(p.x, 2.1, p.z); poster.rotation.y = p.heading - Math.PI / 2; poster.material = sign;
  }
  const start = trackPoint(22);
  for (let row = 0; row < 2; row++) for (let i = 0; i < 20; i++) {
    const tile = MeshBuilder.CreateBox('Checkered start finish', { width: .72, height: .013, depth: .6 }, scene);
    tile.position.set(start.x - 7.1 + i * .74, .032, start.z + row * .62); group(tile, (row + i) % 2 ? ivory : metal);
  }
  for (const [name, meshes] of groups) {
    const merged = Mesh.MergeMeshes(meshes, true, true)!; merged.name = name + ' / batch';
    merged.receiveShadows = true; merged.isPickable = false;
    if (!name.includes('glow')) shadow.addShadowCaster(merged);
  }
  // Fountain surfaces and restrained spray; capped particle count.
  const water = pbr(scene, 'Fountain water', '#287e88', .28, .16);
  for (const z of [-40, 40]) {
    const disc = MeshBuilder.CreateDisc('Fountain pool', { radius: 4.97, tessellation: 48 }, scene);
    disc.rotation.x = Math.PI / 2; disc.position.set(0, .57, z); disc.material = water;
    const spray = new ParticleSystem('Fountain spray', 120, scene); spray.particleTexture = particleTexture(scene);
    spray.emitter = new Vector3(0, 2.8, z); spray.minEmitBox = new Vector3(-.1, 0, -.1); spray.maxEmitBox = new Vector3(.1, .1, .1);
    spray.direction1 = new Vector3(-.4, 1, -.4); spray.direction2 = new Vector3(.4, 1, .4);
    spray.minEmitPower = 2; spray.maxEmitPower = 3; spray.gravity = new Vector3(0, -5, 0);
    spray.minLifeTime = .8; spray.maxLifeTime = 1.4; spray.minSize = .04; spray.maxSize = .12; spray.emitRate = 65;
    spray.color1 = new Color4(.7, .86, .87, .6); spray.color2 = new Color4(.9, .92, .84, .5); spray.colorDead = new Color4(.7, .85, .9, 0); spray.start();
  }
}

function particleTexture(scene: Scene): DynamicTexture {
  const t = new DynamicTexture('Soft particle', 64, scene, false); const c = t.getContext();
  const gradient = c.createRadialGradient(32, 32, 1, 32, 32, 31);
  gradient.addColorStop(0, '#ffffffff'); gradient.addColorStop(.3, '#ffffffbb'); gradient.addColorStop(1, '#ffffff00');
  c.fillStyle = gradient; c.fillRect(0, 0, 64, 64); t.hasAlpha = true; t.update(); return t;
}

export async function createSliceScene(engine: Engine, loadKartCount: number): Promise<TestScene> {
  const scene = new Scene(engine);
  try {
    scene.clearColor = new Color4(.58, .69, .76, 1);
    scene.fogMode = Scene.FOGMODE_EXP2; scene.fogDensity = .0028; scene.fogColor = new Color3(.71, .73, .7);
    scene.environmentTexture = CubeTexture.CreateFromPrefilteredData('/assets/textures/studio.env', scene);
    scene.environmentIntensity = .65;
    scene.imageProcessingConfiguration.toneMappingEnabled = true;
    scene.imageProcessingConfiguration.toneMappingType = 1;
    scene.imageProcessingConfiguration.exposure = 1.15;
    scene.imageProcessingConfiguration.contrast = 1.12;
    const hemisphere = new HemisphericLight('Blue sky fill', new Vector3(0, 1, 0), scene);
    hemisphere.diffuse = new Color3(.71, .81, 1); hemisphere.groundColor = new Color3(.32, .25, .18); hemisphere.intensity = .45;
    const sun = new DirectionalLight('Late afternoon sun', new Vector3(-.65, -1, .45), scene);
    sun.position.set(45, 70, -35); sun.diffuse = new Color3(1, .82, .58); sun.intensity = 3.1;
    sun.orthoLeft = -48; sun.orthoRight = 48; sun.orthoTop = 60; sun.orthoBottom = -60;
    sun.shadowMinZ = 1; sun.shadowMaxZ = 200; sun.autoUpdateExtends = false; sun.shadowOrthoScale = 0;
    const shadow = new ShadowGenerator(engine.webGLVersion > 1 ? 2048 : 1024, sun);
    shadow.usePercentageCloserFiltering = engine.webGLVersion > 1; shadow.bias = .0001; shadow.normalBias = .008;
    shadow.darkness = .05;
    const sky = MeshBuilder.CreateSphere('Panoramic sky', { diameter: 900, segments: 32, sideOrientation: Mesh.BACKSIDE }, scene);
    const skyMaterial = new StandardMaterial('Golden sky', scene); skyMaterial.disableLighting = true;
    const skyTexture = new Texture('/assets/textures/golden-sky.png', scene);
    skyTexture.vScale = .95; skyTexture.vOffset = .48; skyTexture.wrapV = Texture.CLAMP_ADDRESSMODE;
    skyMaterial.emissiveTexture = skyTexture;
    skyMaterial.emissiveColor = Color3.Black(); skyMaterial.backFaceCulling = false; skyMaterial.fogEnabled = false; sky.material = skyMaterial; sky.infiniteDistance = true;
    const world = await ImportMeshAsync('/assets/models/stadium-world.glb', scene);
    const worldOrientation = new TransformNode('Blender world orientation', scene); worldOrientation.rotation.y = Math.PI;
    world.meshes.filter((m) => !m.parent).forEach((m) => m.parent = worldOrientation);
    const stoneMaps = surfaceTextures(scene, 'Limestone', 'stone'), leafMaps = surfaceTextures(scene, 'Cypress', 'leaf'), fabricMaps = surfaceTextures(scene, 'Cloth', 'fabric');
    for (const mesh of world.meshes) if (mesh.material instanceof PBRMaterial) {
      const m = mesh.material;
      if (/stone|limestone/.test(m.name)) { m.albedoTexture = stoneMaps.color; m.bumpTexture = stoneMaps.normal; }
      if (/foliage/.test(m.name)) { m.albedoTexture = leafMaps.color; m.bumpTexture = leafMaps.normal; }
      if (/cloth/.test(m.name)) { m.albedoTexture = fabricMaps.color; m.bumpTexture = fabricMaps.normal; }
    }
    for (const mesh of world.meshes) { mesh.receiveShadows = true; mesh.isPickable = false; if (mesh.getTotalVertices() > 0) shadow.addShadowCaster(mesh); }
    addTrackWorld(scene, shadow);
    const glow = new GlowLayer('Restrained lamp and exhaust glow', scene, { mainTextureRatio: .35 }); glow.intensity = .35;
    const container = await LoadAssetContainerAsync('/assets/models/hero-kart.glb', scene);
    const colors = ['#125965', '#862e38', '#c1ae78', '#435940', '#384b74', '#5a365a'];
    const visuals = Array.from({ length: loadKartCount + 1 }, (_, index) => {
      const instance = container.instantiateModelsToScene((name) => `kart${index}/${name}`, true, { doNotInstantiate: true });
      const root = new TransformNode(`raceKart-${index}`, scene);
      const orientation = new TransformNode(`modelOrientation-${index}`, scene); orientation.rotation.y = Math.PI; orientation.parent = root;
      instance.rootNodes.forEach((node) => node.parent = orientation);
      const nodes = root.getDescendants();
      const pivots = Array.from({ length: 4 }, (_, i) => nodes.find((n) => n.name === `kart${index}/wheelPivot-${i}`) as TransformNode);
      const spins = Array.from({ length: 4 }, (_, i) => nodes.find((n) => n.name === `kart${index}/wheelSpin-${i}`) as TransformNode);
      const driver = nodes.find((n) => n.name === `kart${index}/driverPose`) as TransformNode;
      const scarf = nodes.find((n) => n.name === `kart${index}/scarfFlap`) as TransformNode;
      const steering = nodes.find((n) => n.name === `kart${index}/steeringWheel`) as TransformNode;
      if (pivots.some((n) => !n) || spins.some((n) => !n) || !driver || !steering) throw new Error('Kart articulation nodes are missing');
      for (const node of [...pivots, ...spins, driver, scarf, steering]) if (node) node.rotationQuaternion = null;
      for (const mesh of root.getChildMeshes()) {
        shadow.addShadowCaster(mesh); mesh.receiveShadows = true; mesh.isPickable = false;
        if (mesh.material instanceof PBRMaterial && mesh.material.name.includes('Petrol enamel')) mesh.material.albedoColor = Color3.FromHexString(colors[index]);
        if (mesh.material instanceof PBRMaterial && /racing suit|leather/.test(mesh.material.name)) {
          mesh.material.albedoTexture = fabricMaps.color; mesh.material.bumpTexture = fabricMaps.normal;
        }
      }
      const flames = [-.72, .72].map((x) => {
        const flame = MeshBuilder.CreateSphere(`Exhaust flame ${index}`, { diameter: .18, segments: 8 }, scene);
        flame.parent = root; flame.position.set(x, .62, -1.62); flame.scaling.z = 4;
        flame.material = glowMaterial(scene, `Boost flame ${index}`, '#71dfff'); flame.setEnabled(false); return flame;
      });
      return { root, pivots, spins, driver, scarf, steering, flames, rotation: 0, previousSpeed: 0 };
    });
    // Container buffers stay shared by clones and are released with the scene.
    scene.onDisposeObservable.add(() => container.dispose());
    const dust = new ParticleSystem('Tire smoke and dust', 150, scene); dust.particleTexture = particleTexture(scene);
    dust.minSize = .12; dust.maxSize = .65; dust.minLifeTime = .25; dust.maxLifeTime = .75;
    dust.direction1 = new Vector3(-.3, .15, -.3); dust.direction2 = new Vector3(.3, .6, .3);
    dust.color1 = new Color4(.6, .56, .48, .28); dust.color2 = new Color4(.72, .71, .63, .22); dust.colorDead = new Color4(.6, .6, .5, 0); dust.start();
    const sparks = new ParticleSystem('Drift sparks', 100, scene); sparks.particleTexture = particleTexture(scene);
    sparks.minSize = .045; sparks.maxSize = .11; sparks.minLifeTime = .1; sparks.maxLifeTime = .36;
    sparks.direction1 = new Vector3(-1.5, .3, -1.5); sparks.direction2 = new Vector3(1.5, 1.5, 1.5);
    sparks.gravity = new Vector3(0, -4, 0); sparks.colorDead = new Color4(1, .4, .05, 0); sparks.start();
    return {
      scene,
      setPlayerVisible(visible) {
        // First person uses the real model; hide only the head/body, keep cockpit and wheels.
        visuals[0].driver.getChildMeshes().forEach((mesh) => {
          if (/Warm skin|Hair and leather|Smoked goggles|Brushed champagne/.test(mesh.name)) mesh.setEnabled(visible);
        });
      },
      present(state, others) {
        const dt = Math.min(engine.getDeltaTime() / 1000, .05), time = performance.now() / 1000;
        sun.position.set(state.x + 45, 70, state.z - 35);
        [state, ...others].forEach((s, index) => {
          const v = visuals[index]; if (!v) return;
          v.root.position.set(s.x, s.height + s.suspensionOffset, s.z); v.root.rotation.y = s.heading;
          v.root.rotation.x = -s.bodyPitch + s.impactVelocityZ * .035;
          v.root.rotation.z = s.bodyRoll + (s.drifting ? -s.driftDirection * .055 : 0);
          v.rotation += s.speed * dt / .33;
          v.pivots.forEach((p, i) => { p.position.y = .34 + (s.grounded ? s.wheelGroundHeights[i] - s.suspensionOffset : 0); p.rotation.y = i < 2 ? Math.sin(s.heading - s.travelHeading) * .6 : 0; });
          v.spins.forEach((p) => p.rotation.x = v.rotation);
          v.steering.rotation.z = -Math.sin(s.heading - s.travelHeading) * .7;
          v.driver.rotation.x = Math.max(-.09, Math.min(.09, (v.previousSpeed - s.speed) * .025));
          v.driver.rotation.z = s.drifting ? s.driftDirection * .08 : Math.sin(time * 5) * Math.abs(s.speed) * .0008;
          if (v.scarf) v.scarf.rotation.z = Math.sin(time * 12) * Math.abs(s.speed) * .008;
          v.previousSpeed = s.speed;
          v.flames.forEach((f) => { f.setEnabled(s.turboRemaining > 0); f.scaling.z = 3 + Math.sin(time * 40); });
        });
        const back = new Vector3(state.x - Math.sin(state.heading), .2 + state.height, state.z - Math.cos(state.heading));
        dust.emitter = back; dust.emitRate = state.grounded && Math.abs(state.speed) > 4 ? state.drifting ? 90 : 8 : 0;
        sparks.emitter = back.add(new Vector3(Math.cos(state.heading) * .85, 0, -Math.sin(state.heading) * .85));
        sparks.emitRate = state.drifting || state.impactRemaining > 0 ? 70 : 0;
        sparks.color1 = state.driftCharge >= .7 ? new Color4(1, .6, .12, 1) : new Color4(.15, .8, 1, 1); sparks.color2 = sparks.color1;
      },
    };
  } catch (error) { scene.dispose(); throw error; }
}
