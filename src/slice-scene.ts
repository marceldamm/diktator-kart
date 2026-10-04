import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { LoadAssetContainerAsync, ImportMeshAsync } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
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
import { RenderTargetTexture } from '@babylonjs/core/Materials/Textures/renderTargetTexture';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { DefaultRenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline';
import { TRACK, trackPoint } from './track';
import { LANDMARKS } from './track-layout';
import { addTrackWorld } from './track-world';
import { SkidMarks, createConfetti, createPaperTexture, softParticleTexture } from './effects';
import type { KartState } from './kart-model';
import type { TestScene } from './scene';
import { surfaceTextures } from './surface-textures';
import { SceneInstrumentation } from '@babylonjs/core/Instrumentation/sceneInstrumentation';
import { EngineInstrumentation } from '@babylonjs/core/Instrumentation/engineInstrumentation';
import '@babylonjs/core/Engines/Extensions/engine.query';
import '@babylonjs/core/Engines/AbstractEngine/abstractEngine.timeQuery';
import {addItems} from './item-scene';
import { CAST, CAST_PARTS, type CastMember } from './cast';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { CreateScreenshotUsingRenderTargetAsync } from '@babylonjs/core/Misc/screenshotTools';
import type { LoadingReporter } from './loading-progress';


/** Panorama-space angle of the sun in sky-afternoon (table_mountain_2), measured in-game. */
const SKY_SUN_OFFSET = Math.PI * .55;

function glowMaterial(scene: Scene, name: string, color: string): StandardMaterial {
  const m = new StandardMaterial(name, scene); m.diffuseColor = Color3.FromHexString(color);
  m.emissiveColor = m.diffuseColor; m.disableLighting = true; return m;
}

function particleTexture(scene: Scene): DynamicTexture { return softParticleTexture(scene); }

export async function createSliceScene(engine: Engine, loadKartCount: number, quality=1, report?: LoadingReporter): Promise<TestScene> {
  const scene = new Scene(engine);
  scene.skipPointerMovePicking=true;
  try {
    // Warm late-afternoon look (G/J): low sun from the south-west, cool sky fill, light aerial haze.
    scene.clearColor = new Color4(.62, .72, .84, 1);
    scene.fogMode = Scene.FOGMODE_EXP2; scene.fogDensity = .0032; scene.fogColor = new Color3(.80, .78, .74);
    scene.environmentTexture = CubeTexture.CreateFromPrefilteredData('/assets/textures/studio.env', scene);
    scene.environmentIntensity = .55;
    scene.imageProcessingConfiguration.toneMappingEnabled = true;
    scene.imageProcessingConfiguration.toneMappingType = 1;
    scene.imageProcessingConfiguration.exposure = 1.12;
    scene.imageProcessingConfiguration.contrast = 1.22;
    const hemisphere = new HemisphericLight('Blue sky fill', new Vector3(0, 1, 0), scene);
    hemisphere.diffuse = new Color3(.66, .76, 1); hemisphere.groundColor = new Color3(.42, .32, .22); hemisphere.intensity = .42;
    const sunDirection = new Vector3(.42, -.52, .74).normalize();
    const sun = new DirectionalLight('Late afternoon sun', sunDirection, scene);
    sun.diffuse = new Color3(1, .8, .58); sun.intensity = 3.6;
    sun.orthoLeft = -46; sun.orthoRight = 46; sun.orthoTop = 56; sun.orthoBottom = -56;
    sun.shadowMinZ = 1; sun.shadowMaxZ = 220; sun.autoUpdateExtends = false; sun.shadowOrthoScale = 0;
    const shadow = new ShadowGenerator(engine.webGLVersion > 1 ? 2048 : 1024, sun);
    shadow.usePercentageCloserFiltering = engine.webGLVersion > 1; shadow.bias = .0007; shadow.normalBias = .035;
    shadow.filteringQuality=ShadowGenerator.QUALITY_MEDIUM;
    shadow.darkness = .12;
    const sky = MeshBuilder.CreateSphere('Panoramic sky', { diameter: 900, segments: 32, sideOrientation: Mesh.BACKSIDE }, scene);
    // Turn the panorama so its low sun glows where the light actually comes from.
    sky.rotation.y = Math.atan2(-sunDirection.x, -sunDirection.z) + SKY_SUN_OFFSET;
    const skyMaterial = new StandardMaterial('Cloud sky', scene); skyMaterial.disableLighting = true;
    let skyQuality=quality;
    let skyTexture = new Texture(`/assets/textures/sky-afternoon-${quality?'4k':'2k'}.jpg`, scene, false, false);
    skyTexture.wrapV = Texture.CLAMP_ADDRESSMODE;
    skyMaterial.emissiveTexture = skyTexture;
    skyMaterial.emissiveColor = Color3.Black(); skyMaterial.backFaceCulling = false; skyMaterial.fogEnabled = false; sky.material = skyMaterial; sky.infiniteDistance = true;
    const world = await ImportMeshAsync('/assets/models/stadium-world.glb', scene);
    report?.('world');
    const worldOrientation = new TransformNode('Blender world orientation', scene); worldOrientation.rotation.y = Math.PI;
    world.meshes.filter((m) => !m.parent).forEach((m) => m.parent = worldOrientation);
    const stoneMaps = surfaceTextures(scene, 'Limestone', 'stone'), leafMaps = surfaceTextures(scene, 'Cypress', 'leaf'), fabricMaps = surfaceTextures(scene, 'Cloth', 'fabric');
    for (const mesh of world.meshes) if (mesh.material instanceof PBRMaterial) {
      const m = mesh.material;
      if (/stone|limestone|render/.test(m.name)) { m.albedoTexture = stoneMaps.color; m.bumpTexture = stoneMaps.normal; }
      if (/foliage/.test(m.name)) { m.albedoTexture = leafMaps.color; m.bumpTexture = leafMaps.normal; }
      if (/cloth|Spectator/.test(m.name)) { m.albedoTexture = fabricMaps.color; m.bumpTexture = fabricMaps.normal; }
    }
    for (const mesh of world.meshes) { mesh.receiveShadows = true; mesh.isPickable = false; if (mesh.getTotalVertices() > 0) shadow.addShadowCaster(mesh); }
    const trackWorld = addTrackWorld(scene, shadow);
    // Fountain spray with a hard particle cap.
    for (const [fx, fz] of LANDMARKS.fountains) {
      const spray = new ParticleSystem('Fountain spray', 120, scene); spray.particleTexture = particleTexture(scene);
      spray.emitter = new Vector3(fx, 2.8, fz); spray.minEmitBox = new Vector3(-.1, 0, -.1); spray.maxEmitBox = new Vector3(.1, .1, .1);
      spray.direction1 = new Vector3(-.4, 1, -.4); spray.direction2 = new Vector3(.4, 1, .4);
      spray.minEmitPower = 2; spray.maxEmitPower = 3; spray.gravity = new Vector3(0, -5, 0);
      spray.minLifeTime = .8; spray.maxLifeTime = 1.4; spray.minSize = .04; spray.maxSize = .12; spray.emitRate = 65;
      spray.color1 = new Color4(.7, .86, .87, .6); spray.color2 = new Color4(.9, .92, .84, .5); spray.colorDead = new Color4(.7, .85, .9, 0); spray.start();
    }
    const staticShadowMeshes=[...(shadow.getShadowMap()?.renderList??[])];
    const treeShadows: {root:TransformNode;meshes:Mesh[]}[]=[];
    const treeContainer = await LoadAssetContainerAsync('/assets/models/park-tree.glb', scene);
    report?.('trees');
    for(const material of treeContainer.materials) if(material instanceof PBRMaterial && material.name.includes('leaves')) {
      material.transparencyMode=PBRMaterial.PBRMATERIAL_OPAQUE;
      material.backFaceCulling=false;
    }
    for (const [x, z] of LANDMARKS.trees) {
      const instance = treeContainer.instantiateModelsToScene((name) => `park ${x} ${z}/${name}`, false);
      const root = new TransformNode(`Park tree ${x} ${z}`, scene); instance.rootNodes.forEach((n) => n.parent = root);
      const bounds = root.getHierarchyBoundingVectors(); const height = bounds.max.y - bounds.min.y;
      root.scaling.setAll((9 + (x * 7 + z) % 3) / Math.max(1, height)); root.position.set(x, -bounds.min.y * root.scaling.y, z); root.rotation.y = z * .19;
      const meshes=root.getChildMeshes().filter((m):m is Mesh=>m instanceof Mesh);
      for (const mesh of meshes) { mesh.receiveShadows = true; mesh.isPickable = false; }
      treeShadows.push({root,meshes});
    }
    scene.onDisposeObservable.add(() => treeContainer.dispose());
    const timings=new SceneInstrumentation(scene);timings.captureFrameTime=true;timings.captureRenderTime=true;
    const gpuTimings=new EngineInstrumentation(engine);gpuTimings.captureGPUFrameTime=true;
    scene.metadata={timings,gpuTimings};
    scene.onDisposeObservable.add(()=>{timings.dispose();gpuTimings.dispose();});
    const glow = new GlowLayer('Restrained lamp and exhaust glow', scene, { mainTextureRatio: .35 }); glow.intensity = .45;
    // Every mesh draws into the glow map so drivers, karts and buildings hide lamps behind them; only marked
    // lamp/flame meshes contribute colour, all others render black as occluders (no glow through bodies).
    const glowing = new Set<object>();
    const markGlow = (mesh: object) => { glowing.add(mesh); };
    glow.customEmissiveColorSelector = (mesh, _subMesh, material, result) => {
      const emissive = (material as { emissiveColor?: Color3 } | null)?.emissiveColor;
      if (glowing.has(mesh) && emissive) result.set(emissive.r, emissive.g, emissive.b, 1); else result.set(0, 0, 0, 1);
    };
    glow.addExcludedMesh(sky);
    for(const mesh of trackWorld.glowMeshes) markGlow(mesh);
    const container = await LoadAssetContainerAsync('/assets/models/hero-kart.glb', scene);
    report?.('karts');
    const visuals = Array.from({ length: loadKartCount + 1 }, (_, index) => {
      const instance = container.instantiateModelsToScene((name) => `kart${index}/${name}`, false, { doNotInstantiate: true });
      const paint=new Map<PBRMaterial,PBRMaterial>();
      const root = new TransformNode(`raceKart-${index}`, scene);
      const orientation = new TransformNode(`modelOrientation-${index}`, scene); orientation.rotation.y = Math.PI; orientation.parent = root;
      instance.rootNodes.forEach((node) => node.parent = orientation);
      const nodes = root.getDescendants();
      const pivots = Array.from({ length: 4 }, (_, i) => nodes.find((n) => n.name === `kart${index}/wheelPivot-${i}`) as TransformNode);
      const spins = Array.from({ length: 4 }, (_, i) => nodes.find((n) => n.name === `kart${index}/wheelSpin-${i}`) as TransformNode);
      const driver = nodes.find((n) => n.name === `kart${index}/driverPose`) as TransformNode;
      const head=nodes.find(n=>n.name===`kart${index}/headPose`) as TransformNode;
      const kits = ['radio','spare','luggage','fin','parade'].map(kind=>[kind,nodes.find(n=>n.name===`kart${index}/variant-${kind}`)] as const);
      const parts = CAST_PARTS.map(part=>[part,nodes.find((n) => n.name === `kart${index}/cast-${part}`)] as const);
      const recolourable: {mesh:Mesh;kind:'paint'|'uniform'|'cape'|'hatColor'|'hair';material:PBRMaterial}[] = [];
      const scarf = nodes.find((n) => n.name === `kart${index}/scarfFlap`) as TransformNode;
      const pedals = ['gas', 'brake'].map((p) => nodes.find((n) => n.name === `kart${index}/pedal-${p}`) as TransformNode | undefined);
      for (const p of pedals) if (p) p.rotationQuaternion = null;
      const steering = nodes.find((n) => n.name === `kart${index}/steeringWheel`) as TransformNode;
      const arms = ['L', 'R'].map((side) => nodes.find((n) => n.name === `kart${index}/armPose-${side}`) as TransformNode | undefined);
      for (const arm of arms) if (arm) arm.rotationQuaternion = null;
      if (pivots.some((n) => !n) || spins.some((n) => !n) || !driver || !head || !steering) throw new Error('Kart articulation nodes are missing');
      for (const node of [...pivots, ...spins, driver, head, scarf, steering]) if (node) node.rotationQuaternion = null;
      // Wheel assemblies have an unsprung parent; body squat/roll must never lift grounded tyres.
      const wheelFrame = new TransformNode(`wheelFrame-${index}`, scene);
      wheelFrame.rotation.y = Math.PI; wheelFrame.parent = root;
      for (const pivot of pivots) pivot.setParent(wheelFrame);
      for (const mesh of root.getChildMeshes()) {
        mesh.receiveShadows = true; mesh.isPickable = false;
        if(mesh instanceof Mesh && mesh.name.includes('Warm headlamp')) markGlow(mesh);
        const recolour: [RegExp, 'paint'|'uniform'|'cape'|'hatColor'|'hair'][] = [[/Petrol enamel/, 'paint'], [/Uniform racing suit/, 'uniform'], [/Cape cloth/, 'cape'], [/Hat cloth/, 'hatColor'], [/Hair and leather helmet/, 'hair']];
        for (const [pattern, kind] of recolour) if (mesh instanceof Mesh && mesh.material instanceof PBRMaterial && pattern.test(mesh.material.name)) {
          const source=mesh.material;let material=paint.get(source);
          if(!material){
            material=source.clone(`Kart ${index} ${source.name}`)!;
            if (/enamel/.test(source.name)) { material.metallic = .25; material.roughness = .38; material.clearCoat.isEnabled = true; material.clearCoat.intensity = .85; material.clearCoat.roughness = .08; }
            // Pomaded hair catches a soft highlight so it never reads as a felt cap.
            if (/Hair and leather/.test(source.name)) { material.metallic = 0; material.roughness = .36; material.clearCoat.isEnabled = true; material.clearCoat.intensity = .35; material.clearCoat.roughness = .3; }
            paint.set(source,material);
          }
          mesh.material=material;recolourable.push({mesh,kind,material});
        }
        if (mesh.material instanceof PBRMaterial && /racing suit|leather/.test(mesh.material.name)) {
          mesh.material.albedoTexture = fabricMaps.color; mesh.material.bumpTexture = fabricMaps.normal;
        }
      }
      const flames = [-.72, .72].map((x) => {
        const flame = MeshBuilder.CreateSphere(`Exhaust flame ${index}`, { diameter: .18, segments: 8 }, scene);
        flame.parent = root; flame.position.set(x * .72, .6, -1.72); flame.scaling.z = 4;
        flame.material = glowMaterial(scene, `Boost flame ${index}`, '#71dfff'); markGlow(flame); flame.setEnabled(false); return flame;
      });
      const v = { root, orientation, pivots, spins, driver,head, scarf, steering, arms, flames, pedals, gas: 0, brake: 0,shadowMeshes:[] as AbstractMesh[],bodyMeshes:[] as AbstractMesh[], rotation: 0, previousSpeed: 0, wasAirborne: false, spinning: false, cheer: 0, roll: 0, pitch: 0,
        paintColour: Color3.Black(), soot: -1, wreckAge: -1,
        paints: () => recolourable.filter((r) => r.kind === 'paint').map((r) => r.material),
        /** Dresses this kart as one roster member: kit, caricature parts and colours. */
        dress(cast: CastMember) {
          for (const [kind,node] of kits) node?.setEnabled(kind===cast.kit);
          for (const [part,node] of parts) node?.setEnabled(part === cast.hat || cast.face.includes(part));
          for (const r of recolourable) { const colour=cast[r.kind]; r.mesh.setEnabled(!!colour); if (colour) r.material.albedoColor=Color3.FromHexString(colour).toLinearSpace(); }
          v.paintColour = Color3.FromHexString(cast.paint).toLinearSpace(); v.soot = -1;
          // First person keeps only the gloves on the wheel; torso, cape and epaulettes would fill the view.
          v.bodyMeshes=driver.getChildMeshes().filter(mesh=>!/White glove/.test(mesh.name)&&!mesh.isDescendantOf(head)&&mesh.isEnabled());
          // Only the big silhouettes cast kart shadows: body, tyres, uniform, cape and cap (fewer shadow draws).
          v.shadowMeshes=root.getChildMeshes().filter(mesh=>mesh.isEnabled()&&/Petrol enamel|Tire rubber|driverPose \/ Uniform racing suit|Cape cloth|Hat cloth/.test(mesh.name));
        } };
      v.dress(CAST[index % CAST.length]);
      return v;
    });
    const contactTexture = new DynamicTexture('Soft grounded contact', 128, scene, false);
    const contactCanvas = contactTexture.getContext();
    const gradient = contactCanvas.createRadialGradient(64,64,10,64,64,63); gradient.addColorStop(0,'#050c10a0'); gradient.addColorStop(.6,'#050c1050'); gradient.addColorStop(1,'#050c1000');
    contactCanvas.fillStyle=gradient; contactCanvas.fillRect(0,0,128,128);contactTexture.hasAlpha=true;contactTexture.update();
    const contactMaterial = new StandardMaterial('Contact shadow',scene);contactMaterial.diffuseTexture=contactTexture;contactMaterial.useAlphaFromDiffuseTexture=true;contactMaterial.disableLighting=true;contactMaterial.emissiveColor=Color3.White();contactMaterial.backFaceCulling=false;
    const contactShadows=visuals.map((_,i)=>{const mesh=MeshBuilder.CreateGround(`Soft contact shadow ${i}`,{width:2.4,height:3.2},scene);mesh.position.y=.039;mesh.material=contactMaterial;return mesh;});
    // Container buffers stay shared by clones and are released with the scene.
    scene.onDisposeObservable.add(() => container.dispose());
    const dust = new ParticleSystem('Tire smoke and dust', 150, scene); dust.particleTexture = particleTexture(scene);
    dust.blendMode=ParticleSystem.BLENDMODE_STANDARD;
    dust.minSize = .22; dust.maxSize = .72; dust.minLifeTime = .35; dust.maxLifeTime = .85;
    dust.minEmitBox = new Vector3(-.7, 0, -.08); dust.maxEmitBox = new Vector3(.7, .05, .08);
    dust.direction1 = new Vector3(-.3, .2, -.3); dust.direction2 = new Vector3(.3, .65, .3);
    dust.color1 = new Color4(.65, .58, .47, .38); dust.color2 = new Color4(.77, .71, .60, .3); dust.colorDead = new Color4(.7, .64, .53, 0); dust.start();
    const sparks = new ParticleSystem('Drift sparks', 140, scene); sparks.particleTexture = particleTexture(scene);
    sparks.billboardMode = ParticleSystem.BILLBOARDMODE_STRETCHED; sparks.minEmitPower = 2.5; sparks.maxEmitPower = 5;
    sparks.minSize = .025; sparks.maxSize = .055; sparks.minScaleY = 2.5; sparks.maxScaleY = 4; sparks.minLifeTime = .08; sparks.maxLifeTime = .24;
    sparks.direction1 = new Vector3(-1.5, .3, -1.5); sparks.direction2 = new Vector3(1.5, 1.5, 1.5);
    sparks.gravity = new Vector3(0, -4, 0); sparks.colorDead = new Color4(1, .4, .05, 0); sparks.start();
    let reducedEffects = false;
    const boostFire = new ParticleSystem('Turbo exhaust fire', 160, scene); boostFire.particleTexture = particleTexture(scene);
    boostFire.blendMode = ParticleSystem.BLENDMODE_ADD; boostFire.minSize = .12; boostFire.maxSize = .32; boostFire.minLifeTime = .08; boostFire.maxLifeTime = .2;
    boostFire.color1 = new Color4(1, .72, .28, 1); boostFire.color2 = new Color4(.45, .8, 1, 1); boostFire.colorDead = new Color4(1, .3, .05, 0);
    boostFire.minEmitPower = 1.5; boostFire.maxEmitPower = 3; boostFire.emitRate = 0; boostFire.start();
    const skids = new SkidMarks(scene, loadKartCount + 1);
    const paper = new ParticleSystem('Item hit paperwork', 160, scene); paper.particleTexture = createPaperTexture(scene);
    paper.minSize = .14; paper.maxSize = .3; paper.minLifeTime = .7; paper.maxLifeTime = 1.4; paper.emitRate = 0;
    paper.direction1 = new Vector3(-3, 4, -3); paper.direction2 = new Vector3(3, 7, 3); paper.gravity = new Vector3(0, -6, 0);
    paper.minAngularSpeed = -8; paper.maxAngularSpeed = 8; paper.color1 = new Color4(1, .98, .92, 1); paper.color2 = new Color4(.86, .2, .22, 1); paper.colorDead = new Color4(1, 1, 1, 0); paper.start();
    const puff = new ParticleSystem('Landing dust', 90, scene); puff.particleTexture = particleTexture(scene);
    puff.minSize = .35; puff.maxSize = .9; puff.minLifeTime = .35; puff.maxLifeTime = .7; puff.emitRate = 0; puff.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    puff.direction1 = new Vector3(-2.2, .2, -2.2); puff.direction2 = new Vector3(2.2, .9, 2.2); puff.minEmitPower = 1; puff.maxEmitPower = 1.8;
    puff.color1 = new Color4(.62, .57, .48, .35); puff.color2 = new Color4(.72, .69, .6, .28); puff.colorDead = new Color4(.7, .66, .58, 0); puff.start();
    const burst = (system: ParticleSystem, s: KartState, count: number) => { system.emitter = new Vector3(s.x, .5 + s.height, s.z); system.manualEmitCount = count; };
    const confetti = createConfetti(scene);
    // Finish fireworks over the main stand: additive bursts in gold, red, white and green (capped pool).
    const fireworks = new ParticleSystem('Finish fireworks', 1200, scene); fireworks.particleTexture = particleTexture(scene);
    fireworks.blendMode = ParticleSystem.BLENDMODE_ADD; fireworks.minSize = .7; fireworks.maxSize = 1.25; fireworks.minLifeTime = 1.1; fireworks.maxLifeTime = 1.9;
    fireworks.createSphereEmitter(.4); fireworks.minEmitPower = 7; fireworks.maxEmitPower = 11; fireworks.gravity = new Vector3(0, -3.2, 0); fireworks.emitRate = 0; fireworks.start();
    const fireworkColours = [[1, .82, .35], [1, .3, .22], [1, .97, .9], [.45, 1, .55], [.5, .75, 1]];
    let fireworkTime = 0, nextBurst = 0;
    let pipeline: DefaultRenderingPipeline | undefined, pipelineLevel = quality;
    const configurePipeline = () => {
      if (!pipeline) return;
      const full = pipelineLevel > 0;
      pipeline.samples = full && engine.webGLVersion > 1 ? 4 : 1;
      pipeline.fxaaEnabled = true;
      pipeline.bloomEnabled = full && !reducedEffects; pipeline.bloomThreshold = .82; pipeline.bloomWeight = .32; pipeline.bloomKernel = 48; pipeline.bloomScale = .5;
      pipeline.imageProcessingEnabled = true;
      const ip = pipeline.imageProcessing;
      ip.toneMappingEnabled = true; ip.toneMappingType = 1; ip.exposure = 1.12; ip.contrast = 1.22;
      ip.vignetteEnabled = full; ip.vignetteWeight = 1.6; ip.vignetteStretch = .35; ip.vignetteCameraFov = .9; ip.vignetteColor = new Color4(.12, .07, .04, 0);
      ip.colorCurvesEnabled = full;
      if (ip.colorCurves) { ip.colorCurves.globalSaturation = 18; ip.colorCurves.highlightsHue = 40; ip.colorCurves.highlightsDensity = 18; ip.colorCurves.highlightsSaturation = 20; ip.colorCurves.shadowsHue = 210; ip.colorCurves.shadowsDensity = 12; ip.colorCurves.shadowsSaturation = 15; }
      pipeline.sharpenEnabled = full; pipeline.sharpen.edgeAmount = .18;
    };
    let roster=CAST.map((_,i)=>i);
    const presentItems=await addItems(scene,shadow,loadKartCount+1,owner=>CAST[roster[owner]??owner].projectile);
    // 'Größenbefehl' parade tank for the player's driver (art-source/build_tank.py).
    const tankContainer = await LoadAssetContainerAsync('/assets/models/parade-tank.glb', scene);
    scene.onDisposeObservable.add(() => tankContainer.dispose());
    const tankInstance = tankContainer.instantiateModelsToScene((name) => `tank0/${name}`, false, { doNotInstantiate: true });
    const tankRoot = new TransformNode('Parade tank', scene); tankRoot.parent = visuals[0].root;
    const tankOrientation = new TransformNode('Parade tank orientation', scene); tankOrientation.rotation.y = Math.PI; tankOrientation.parent = tankRoot;
    tankInstance.rootNodes.forEach((n) => n.parent = tankOrientation);
    const tankNodes = tankRoot.getDescendants();
    const tankNode = (name: string) => tankNodes.find((n) => n.name === `tank0/${name}`) as TransformNode | undefined;
    // Only the spin empties: the joined wheel meshes are named 'tankWheel-L-0 / material' and keep their axle rotation.
    const tankWheels = tankNodes.filter((n) => /tankWheel-[LR]-\d+$/.test(n.name)) as TransformNode[];
    const tankTurret = tankNode('tankTurret');
    for (const n of [...tankWheels, tankTurret]) if (n) n.rotationQuaternion = null;
    const trackTexture = new DynamicTexture('Tank track link texture', { width: 128, height: 64 }, scene, true);
    { const c = trackTexture.getContext() as CanvasRenderingContext2D; c.fillStyle = '#16181a'; c.fillRect(0, 0, 128, 64);
      for (let i = 0; i < 4; i++) { c.fillStyle = '#3b3f43'; c.fillRect(i * 32 + 2, 4, 22, 56); c.fillStyle = '#5c6066'; c.fillRect(i * 32 + 4, 8, 6, 48); c.fillStyle = '#0c0d0e'; c.fillRect(i * 32 + 26, 0, 4, 64); }
      trackTexture.wrapU = Texture.WRAP_ADDRESSMODE; trackTexture.update(); }
    const tankMeshes = tankRoot.getChildMeshes(); const tankPaint: PBRMaterial[] = [];
    for (const mesh of tankMeshes) {
      mesh.isPickable = false; mesh.receiveShadows = true;
      if (mesh.material instanceof PBRMaterial && /Tank parade enamel/.test(mesh.material.name)) {
        const m = mesh.material.clone('Tank parade enamel player')!; m.albedoColor = Color3.FromHexString(CAST[0].paint).toLinearSpace(); tankPaint.push(m);
        m.clearCoat.isEnabled = true; m.clearCoat.intensity = .6; mesh.material = m;
      }
      if (mesh.material instanceof PBRMaterial && /Tank track links/.test(mesh.material.name)) { mesh.material.albedoTexture = trackTexture; mesh.material.albedoColor = Color3.White(); }
      if (mesh.material instanceof PBRMaterial && mesh.material.name.includes('Warm headlamp')) markGlow(mesh);
    }
    tankRoot.setEnabled(false);
    // The tank belongs to whichever kart Hitler drives (player or bot); setRoster moves it.
    let tankOwner = 0;
    const kartMeshesOf = (i: number) => visuals[i].root.getChildMeshes().filter((m) => !tankMeshes.includes(m) && !m.isDescendantOf(visuals[i].driver));
    let kartOnlyMeshes = kartMeshesOf(0);
    let tankBlend = 0, trackScroll = 0;
    const smoke = new ParticleSystem('Tank transformation smoke', 220, scene); smoke.particleTexture = particleTexture(scene);
    smoke.minSize = .8; smoke.maxSize = 2.2; smoke.minLifeTime = .5; smoke.maxLifeTime = 1.2; smoke.emitRate = 0; smoke.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    smoke.direction1 = new Vector3(-3, 1, -3); smoke.direction2 = new Vector3(3, 3.5, 3); smoke.minEmitPower = 1.5; smoke.maxEmitPower = 3; smoke.minEmitBox = new Vector3(-1.2, 0, -1.6); smoke.maxEmitBox = new Vector3(1.2, 1.2, 1.6);
    smoke.color1 = new Color4(.82, .78, .72, .55); smoke.color2 = new Color4(.62, .6, .56, .45); smoke.colorDead = new Color4(.6, .58, .55, 0); smoke.start();
    const trackDust = new ParticleSystem('Tank track dust', 160, scene); trackDust.particleTexture = particleTexture(scene);
    trackDust.minSize = .35; trackDust.maxSize = 1; trackDust.minLifeTime = .4; trackDust.maxLifeTime = .9; trackDust.emitRate = 0; trackDust.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    trackDust.direction1 = new Vector3(-1, .3, -1); trackDust.direction2 = new Vector3(1, 1.2, 1);
    trackDust.color1 = new Color4(.6, .55, .46, .35); trackDust.color2 = new Color4(.7, .66, .58, .28); trackDust.colorDead = new Color4(.65, .6, .5, 0); trackDust.start();
    let lastStates: KartState[] = [];
    // Damage: engine smoke per kart (grey when worn, black when critical), comic explosion on a wreck.
    let healthNow: number[] = [], wreckedNow: number[] = [];
    const engineSmoke = visuals.map((_, i) => {
      const s = new ParticleSystem(`Damage smoke ${i}`, 70, scene); s.particleTexture = particleTexture(scene); s.blendMode = ParticleSystem.BLENDMODE_STANDARD;
      s.minSize = .3; s.maxSize = .8; s.minLifeTime = .6; s.maxLifeTime = 1.3; s.emitRate = 0; s.minEmitBox = new Vector3(-.2, 0, -.2); s.maxEmitBox = new Vector3(.2, .1, .2);
      s.direction1 = new Vector3(-.3, 1.2, -.3); s.direction2 = new Vector3(.3, 2, .3); s.minEmitPower = .6; s.maxEmitPower = 1.2; s.start(); return s;
    });
    const fireball = new ParticleSystem('Wreck fireball', 260, scene); fireball.particleTexture = particleTexture(scene); fireball.blendMode = ParticleSystem.BLENDMODE_ADD;
    fireball.minSize = .7; fireball.maxSize = 1.8; fireball.minLifeTime = .25; fireball.maxLifeTime = .6; fireball.emitRate = 0; fireball.createSphereEmitter(.6);
    fireball.minEmitPower = 3; fireball.maxEmitPower = 7; fireball.color1 = new Color4(1, .78, .3, 1); fireball.color2 = new Color4(1, .4, .1, 1); fireball.colorDead = new Color4(.4, .1, 0, 0); fireball.start();
    const wreckSmoke = new ParticleSystem('Wreck smoke', 200, scene); wreckSmoke.particleTexture = particleTexture(scene); wreckSmoke.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    wreckSmoke.minSize = 1; wreckSmoke.maxSize = 2.6; wreckSmoke.minLifeTime = .9; wreckSmoke.maxLifeTime = 1.8; wreckSmoke.emitRate = 0; wreckSmoke.createSphereEmitter(.8);
    wreckSmoke.minEmitPower = 1.5; wreckSmoke.maxEmitPower = 3.5; wreckSmoke.gravity = new Vector3(0, 1.2, 0);
    wreckSmoke.color1 = new Color4(.16, .15, .14, .7); wreckSmoke.color2 = new Color4(.3, .28, .26, .55); wreckSmoke.colorDead = new Color4(.3, .3, .3, 0); wreckSmoke.start();
    const SOOT = new Color3(.02, .018, .016);
    // Rain: streak particles around the camera, puddle splashes, lightning flashes.
    let raining = false, lightningTimer = 9, flash = 0;
    const rain = new ParticleSystem('Rain streaks', 2600, scene); rain.particleTexture = particleTexture(scene);
    rain.billboardMode = ParticleSystem.BILLBOARDMODE_STRETCHED; rain.minSize = .015; rain.maxSize = .03; rain.minScaleY = 14; rain.maxScaleY = 22;
    rain.minLifeTime = .5; rain.maxLifeTime = .8; rain.emitRate = 0; rain.minEmitBox = new Vector3(-22, 12, -22); rain.maxEmitBox = new Vector3(22, 14, 22);
    rain.direction1 = new Vector3(-1.5, -24, -.5); rain.direction2 = new Vector3(-.5, -28, .5); rain.minEmitPower = 1; rain.maxEmitPower = 1;
    rain.color1 = new Color4(.75, .8, .88, .45); rain.color2 = new Color4(.65, .72, .82, .35); rain.colorDead = new Color4(.6, .7, .8, 0); rain.start();
    const splash = new ParticleSystem('Puddle splash', 260, scene); splash.particleTexture = particleTexture(scene);
    splash.minSize = .08; splash.maxSize = .22; splash.minLifeTime = .3; splash.maxLifeTime = .6; splash.emitRate = 0;
    splash.direction1 = new Vector3(-2.5, 3, -2.5); splash.direction2 = new Vector3(2.5, 5, 2.5); splash.gravity = new Vector3(0, -9, 0);
    splash.color1 = new Color4(.75, .82, .9, .7); splash.color2 = new Color4(.9, .93, .96, .6); splash.colorDead = new Color4(.8, .85, .9, 0); splash.start();
    // Snow: soft drifting flakes around the camera, cold light and white haze.
    let snowing = false;
    const snow = new ParticleSystem('Snowflakes', 2200, scene); snow.particleTexture = particleTexture(scene);
    snow.minSize = .05; snow.maxSize = .14; snow.minLifeTime = 3; snow.maxLifeTime = 5; snow.emitRate = 0;
    snow.minEmitBox = new Vector3(-26, 9, -26); snow.maxEmitBox = new Vector3(26, 13, 26);
    snow.direction1 = new Vector3(-.8, -2.2, -.5); snow.direction2 = new Vector3(.6, -3, .6); snow.minEmitPower = 1; snow.maxEmitPower = 1.2;
    snow.minAngularSpeed = -2; snow.maxAngularSpeed = 2;
    snow.color1 = new Color4(1, 1, 1, .95); snow.color2 = new Color4(.9, .94, 1, .85); snow.colorDead = new Color4(1, 1, 1, 0); snow.start();

    // Time of day (0 day → .5 dusk → 1 night): sky overlay, stars, moon, moonlight shadows, birds by day and bats by night.
    let timeOfDay = 0, weatherBase = { sun: sun.intensity, sunColor: sun.diffuse.clone(), hemi: hemisphere.intensity, fogDensity: scene.fogDensity, fogColor: scene.fogColor.clone(), sky: 1 };
    const snapshotWeather = () => { weatherBase = { sun: sun.intensity, sunColor: sun.diffuse.clone(), hemi: hemisphere.intensity, fogDensity: scene.fogDensity, fogColor: scene.fogColor.clone(), sky: skyMaterial.emissiveTexture!.level }; };
    const skyTint = MeshBuilder.CreateSphere('Sky time-of-day tint', { diameter: 860, segments: 16, sideOrientation: Mesh.BACKSIDE }, scene);
    const tintMaterial = new StandardMaterial('Sky tint', scene); tintMaterial.disableLighting = true; tintMaterial.fogEnabled = false; tintMaterial.backFaceCulling = false;
    tintMaterial.emissiveColor = new Color3(1, .5, .2); tintMaterial.alpha = 0; skyTint.material = tintMaterial; skyTint.infiniteDistance = true; skyTint.isPickable = false; skyTint.alphaIndex = 1;
    const starTexture = new DynamicTexture('Star field', { width: 1024, height: 512 }, scene, true);
    { const c = starTexture.getContext() as CanvasRenderingContext2D; c.fillStyle = '#000'; c.fillRect(0, 0, 1024, 512);
      for (let i = 0; i < 900; i++) { const y = Math.random() * 300, b = Math.random(); c.fillStyle = `rgba(255,255,${220 + Math.floor(b * 35)},${.35 + b * .65})`; c.fillRect(Math.random() * 1024, y, b > .92 ? 2 : 1, b > .92 ? 2 : 1); }
      starTexture.update(); }
    const stars = MeshBuilder.CreateSphere('Night stars', { diameter: 840, segments: 16, sideOrientation: Mesh.BACKSIDE }, scene);
    const starMaterial = new StandardMaterial('Stars', scene); starMaterial.disableLighting = true; starMaterial.fogEnabled = false; starMaterial.backFaceCulling = false;
    starMaterial.emissiveTexture = starTexture; starMaterial.diffuseColor = Color3.Black(); starMaterial.alphaMode = Engine.ALPHA_ADD; starMaterial.alpha = 0;
    stars.material = starMaterial; stars.infiniteDistance = true; stars.isPickable = false; stars.alphaIndex = 2;
    const moonTexture = new DynamicTexture('Moon disc', 128, scene, true);
    { const c = moonTexture.getContext() as CanvasRenderingContext2D; const g = c.createRadialGradient(64, 64, 20, 64, 64, 62); g.addColorStop(0, '#fffbe8'); g.addColorStop(.62, '#f2ecd2'); g.addColorStop(.7, 'rgba(240,235,210,.35)'); g.addColorStop(1, 'rgba(240,235,210,0)');
      c.fillStyle = g; c.fillRect(0, 0, 128, 128); c.fillStyle = 'rgba(180,175,160,.35)'; for (const [x, y, r] of [[50, 52, 9], [76, 70, 7], [60, 82, 5]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); } moonTexture.hasAlpha = true; moonTexture.update(); }
    const moon = MeshBuilder.CreatePlane('Moon', { size: 34 }, scene); moon.billboardMode = Mesh.BILLBOARDMODE_ALL; moon.infiniteDistance = true; moon.isPickable = false; moon.alphaIndex = 3;
    const moonMaterial = new StandardMaterial('Moon', scene); moonMaterial.disableLighting = true; moonMaterial.fogEnabled = false; moonMaterial.emissiveTexture = moonTexture; moonMaterial.opacityTexture = moonTexture; moonMaterial.alpha = 0; moon.material = moonMaterial;
    moon.position = new Vector3(-sunDirection.x * -300, 160, -sunDirection.z * -300);
    const flyerMaterial = new StandardMaterial('Birds and bats', scene); flyerMaterial.disableLighting = true; flyerMaterial.emissiveColor = new Color3(.08, .07, .07); flyerMaterial.backFaceCulling = false;
    const flyers = Array.from({ length: 14 }, (_, i) => {
      const m = MeshBuilder.CreateDisc(`Flyer ${i}`, { radius: .55, tessellation: 3 }, scene); m.material = flyerMaterial; m.isPickable = false; m.scaling.set(1.6, .35, 1);
      return { mesh: m, phase: i * 1.7, radius: 30 + (i % 5) * 9, height: 22 + (i % 4) * 4, speed: .18 + (i % 3) * .05 };
    });
    // Newspapers blowing across the road near the player.
    const paperMaterial = new StandardMaterial('Blowing newspaper', scene); paperMaterial.diffuseTexture = createPaperTexture(scene); paperMaterial.backFaceCulling = false; paperMaterial.specularColor = Color3.Black();
    const papers = Array.from({ length: 5 }, (_, i) => { const m = MeshBuilder.CreatePlane(`Newspaper ${i}`, { width: .6, height: .42 }, scene); m.material = paperMaterial; m.isPickable = false; m.setEnabled(false); return { mesh: m, life: 0, vx: 0, vz: 0, spin: 0 }; });
    // Loose parts after a wreck: lie on the road for a while, then shrink away.
    const debrisMaterial = new StandardMaterial('Wreck debris', scene); debrisMaterial.diffuseColor = new Color3(.12, .11, .1); debrisMaterial.specularColor = new Color3(.2, .2, .2);
    const debris = Array.from({ length: 12 }, (_, i) => { const m = i % 3 === 0 ? MeshBuilder.CreateCylinder(`Debris hubcap ${i}`, { diameter: .32, height: .06, tessellation: 12 }, scene) : MeshBuilder.CreateBox(`Debris plate ${i}`, { width: .4, height: .05, depth: .28 }, scene);
      m.material = debrisMaterial; m.isPickable = false; m.setEnabled(false); return { mesh: m, life: 0, vx: 0, vy: 0, vz: 0 }; });
    let nextDebris = 0;
    let salvageNow: number[] = [];
    const cableMaterial = new StandardMaterial('Salvage cable', scene); cableMaterial.diffuseColor = new Color3(.1, .1, .1);
    const cables = visuals.map((_, i) => { const c = MeshBuilder.CreateCylinder(`Salvage cable ${i}`, { diameter: .06, height: 1 }, scene); c.material = cableMaterial; c.isPickable = false; c.setEnabled(false);
      const hook = MeshBuilder.CreateTorus(`Salvage hook ${i}`, { diameter: .5, thickness: .08, tessellation: 12 }, scene); hook.material = cableMaterial; hook.parent = c; hook.position.y = -.5; return c; });
    const baseLight = { sun: sun.intensity, hemi: hemisphere.intensity, fog: scene.fogDensity, fogColor: scene.fogColor.clone(), env: scene.environmentIntensity };
    report?.('items');
    // 'Staatsfernsehen LIVE': a giant wall beside the grandstand straight shows a live feed of the race leader.
    const tvCamera = new FreeCamera('Staatsfernsehen camera', new Vector3(0, 5, 0), scene); tvCamera.fov = .5; tvCamera.minZ = .1;
    const feed = new RenderTargetTexture('Staatsfernsehen feed', { width: 768, height: 432 }, scene, false);
    feed.activeCamera = tvCamera; feed.renderList = null; feed.refreshRate = 2; scene.customRenderTargets.push(feed);
    const wallAt = trackPoint(66, -(TRACK.halfWidth + 11));
    const tv = new TransformNode('Staatsfernsehen wall', scene); tv.position.set(wallAt.x, 0, wallAt.z); tv.rotation.y = wallAt.heading - .45;
    const screenMaterial = new StandardMaterial('Staatsfernsehen screen', scene); screenMaterial.emissiveTexture = feed; screenMaterial.disableLighting = true; screenMaterial.diffuseColor = Color3.Black();
    const screen = MeshBuilder.CreatePlane('Staatsfernsehen picture', { width: 9.6, height: 5.4 }, scene); screen.parent = tv; screen.position.y = 9.2; screen.material = screenMaterial;
    const frameMaterial = new PBRMaterial('Staatsfernsehen gilded frame', scene); frameMaterial.albedoColor = Color3.FromHexString('#b98a3e'); frameMaterial.metallic = .9; frameMaterial.roughness = .3;
    const frame = MeshBuilder.CreateBox('Staatsfernsehen frame', { width: 10.6, height: 7.6, depth: .5 }, scene); frame.parent = tv; frame.position.set(0, 8.6, .3); frame.material = frameMaterial;
    for (const x of [-3.6, 3.6]) { const leg = MeshBuilder.CreateBox('Staatsfernsehen pylon', { width: .7, height: 5, depth: .7 }, scene); leg.parent = tv; leg.position.set(x, 2.5, .3); leg.material = frameMaterial; shadow.addShadowCaster(leg); }
    const captionTexture = new DynamicTexture('Staatsfernsehen caption', { width: 1024, height: 128 }, scene, true);
    const captionMaterial = new StandardMaterial('Staatsfernsehen caption', scene); captionMaterial.emissiveTexture = captionTexture; captionMaterial.disableLighting = true;
    const caption = MeshBuilder.CreatePlane('Staatsfernsehen caption', { width: 9.6, height: 1.2 }, scene); caption.parent = tv; caption.position.set(0, 5.75, -.01); caption.material = captionMaterial;
    let following = 0, captionText = '', shotTimer = 0, shot = 0;
    const paintCaption = (text: string) => {
      const c = captionTexture.getContext() as CanvasRenderingContext2D;
      c.fillStyle = '#7a1820'; c.fillRect(0, 0, 1024, 128); c.fillStyle = '#d7b46a'; c.fillRect(0, 0, 210, 128);
      c.fillStyle = '#7a1820'; c.font = 'bold 44px Georgia'; c.textAlign = 'center'; c.fillText('● LIVE', 105, 80);
      c.fillStyle = '#f3e3b8'; c.font = 'bold 40px Georgia'; c.textAlign = 'left'; c.fillText(text, 240, 80); captionTexture.update();
    };
    paintCaption('STAATSFERNSEHEN · Übertragung genehmigt');
    const itemShadowMeshes=(shadow.getShadowMap()?.renderList??[]).filter(mesh=>!staticShadowMeshes.includes(mesh));
    for(const mesh of world.meshes){mesh.computeWorldMatrix(true);mesh.freezeWorldMatrix();}
    const api: TestScene = {
      scene,
      presentItems,
      attachCamera(camera) {
        pipeline?.dispose();
        pipeline = new DefaultRenderingPipeline('Presentation', engine.getCaps().textureHalfFloatRender, scene, [camera]);
        configurePipeline();
      },
      broadcast(kart, text) { following = kart; if (text !== captionText) { captionText = text; paintCaption(text); } },
      abilityEvent(kind, kart, target) {
        const at = lastStates[kind === 'crush' ? target ?? kart : kart]; if (!at) return;
        if (kind === 'crush') { burst(puff, at, reducedEffects ? 10 : 40); burst(paper, at, reducedEffects ? 8 : 25); return; }
        smoke.emitter = new Vector3(at.x, .4, at.z); smoke.manualEmitCount = reducedEffects ? 40 : 160;
      },
      setRain(on) {
        raining = on; trackWorld.setWet(on);
        sun.intensity = on ? baseLight.sun * .28 : baseLight.sun; hemisphere.intensity = on ? .62 : baseLight.hemi;
        hemisphere.diffuse = on ? new Color3(.62, .68, .78) : new Color3(.66, .76, 1);
        scene.fogDensity = on ? .0105 : baseLight.fog; scene.fogColor = on ? new Color3(.46, .5, .55) : baseLight.fogColor;
        scene.environmentIntensity = on ? .85 : baseLight.env; skyMaterial.emissiveColor = Color3.Black();
        skyMaterial.emissiveTexture!.level = on ? .42 : 1; rain.emitRate = on ? (reducedEffects ? 900 : 3600) : 0; snapshotWeather();
      },
      setWeather(kind) {
        snowing = kind === 'snow'; api.setRain?.(kind === 'rain'); trackWorld.setSnow(snowing);
        if (snowing) {
          sun.intensity = baseLight.sun * .45; sun.diffuse = new Color3(.92, .95, 1); hemisphere.intensity = .78; hemisphere.diffuse = new Color3(.86, .9, 1);
          scene.fogDensity = .0085; scene.fogColor = new Color3(.86, .88, .92); scene.environmentIntensity = .8; skyMaterial.emissiveTexture!.level = .78;
        } else if (kind === 'sun') sun.diffuse = new Color3(1, .8, .58);
        snow.emitRate = snowing ? (reducedEffects ? 500 : 1700) : 0; snapshotWeather();
        // Tyres throw white powder in snow instead of brown dust.
        const powder = snowing ? [new Color4(.94, .95, .98, .5), new Color4(.86, .89, .95, .4), new Color4(.9, .92, .96, 0)] : [new Color4(.65, .58, .47, .38), new Color4(.77, .71, .60, .3), new Color4(.7, .64, .53, 0)];
        for (const system of [dust, puff]) { system.color1 = powder[0]; system.color2 = powder[1]; system.colorDead = powder[2]; }
      },
      puddles() { return raining ? trackWorld.puddles : []; },
      setDamage(health, wrecked) { healthNow = health; wreckedNow = wrecked; },
      setTimeOfDay(t) { timeOfDay = Math.max(0, Math.min(1, t)); },
      splash(kart) { const at = lastStates[kart]; if (!at) return; splash.emitter = new Vector3(at.x, 0, at.z); splash.manualEmitCount = reducedEffects ? 40 : 160; },
      setSalvage(timers) { salvageNow = timers; },
      salvaged(kart) { const at = lastStates[kart]; if (at) burst(puff, at, reducedEffects ? 8 : 24); },
      wreck(kart) {
        const at = lastStates[kart]; const v = visuals[kart]; if (!at || !v) return;
        fireball.emitter = new Vector3(at.x, .9, at.z); fireball.manualEmitCount = reducedEffects ? 60 : 200;
        wreckSmoke.emitter = new Vector3(at.x, 1, at.z); wreckSmoke.manualEmitCount = reducedEffects ? 40 : 140;
        burst(paper, at, reducedEffects ? 15 : 50); v.wreckAge = 0;
        for (let n = 0; n < (reducedEffects ? 2 : 4); n++) { const d = debris[nextDebris++ % debris.length], a = Math.random() * 6.28, p = 2 + Math.random() * 3;
          d.mesh.setEnabled(true); d.mesh.position.set(at.x, 1, at.z); d.mesh.scaling.setAll(1); d.vx = Math.sin(a) * p; d.vz = Math.cos(a) * p; d.vy = 3 + Math.random() * 2; d.life = 9; }
      },
      setRoster(order) {
        roster = order.slice(); visuals.forEach((v, i) => v.dress(CAST[order[i] ?? i]));
        const owner = Math.max(0, order.indexOf(0));
        if (owner !== tankOwner) {
          for (const mesh of kartOnlyMeshes) mesh.isVisible = true; visuals[tankOwner].driver.position.y = 0;
          tankOwner = owner; tankRoot.parent = visuals[owner].root; kartOnlyMeshes = kartMeshesOf(owner); tankBlend = 0; tankRoot.setEnabled(false);
        }
        for (const m of tankPaint) m.albedoColor = Color3.FromHexString(CAST[0].paint).toLinearSpace();
      },
      async portraits(order) {
        // Head-and-shoulders shots straight from the race models, one per roster member.
        const camera = new FreeCamera('Portrait camera', Vector3.Zero(), scene); camera.fov = .5; camera.minZ = .05;
        // Studio light for the selection cards: soft frontal fill, no hard sun shadows across the faces.
        const fill = new HemisphericLight('Portrait fill', Vector3.Up(), scene); fill.intensity = 1.35; fill.diffuse = new Color3(1, .95, .88); fill.groundColor = new Color3(.55, .5, .46);
        const sunWasShadowing = sun.shadowEnabled; sun.shadowEnabled = false; const sunLevel = sun.intensity; sun.intensity = sunLevel * .55;
        const shots: string[] = [];
        try {
          for (let castIndex = 0; castIndex < CAST.length; castIndex++) {
            const v = visuals[Math.max(0, order.indexOf(castIndex))];
            const head = v.head.getAbsolutePosition(), h = v.root.rotation.y;
            camera.position.set(head.x + Math.sin(h) * 2.35 + Math.cos(h) * .45, head.y + .12, head.z + Math.cos(h) * 2.35 - Math.sin(h) * .45);
            camera.setTarget(new Vector3(head.x, head.y - .22, head.z));
            shots.push(await CreateScreenshotUsingRenderTargetAsync(engine, camera, { width: 320, height: 360 }, 'image/jpeg', 4));
          }
        } finally { camera.dispose(); fill.dispose(); sun.shadowEnabled = sunWasShadowing; sun.intensity = sunLevel; }
        return shots;
      },
      celebrate(kind) {
        const p = trackPoint(TRACK.start, 0);
        confetti.burst(new Vector3(p.x, kind === 'start' ? 7.5 : 6, p.z), reducedEffects ? 80 : kind === 'start' ? 220 : 340);
        if (kind === 'finish') { fireworkTime = reducedEffects ? 4 : 9; nextBurst = 0; }
      },
      resetEffects() { skids.clear(); fireworkTime = 0; },
      setQuality(level, reduced) {
        pipelineLevel = level;
        if(level!==skyQuality) {
          const old=skyTexture;skyTexture=new Texture(`/assets/textures/sky-afternoon-${level?'4k':'2k'}.jpg`,scene,false,false);skyTexture.wrapV=Texture.CLAMP_ADDRESSMODE;
          skyMaterial.emissiveTexture=skyTexture;old.dispose();skyQuality=level;
        }
        reducedEffects = reduced; sun.shadowEnabled = level > 0; glow.isEnabled = level > 0 && !reduced;
        engine.setHardwareScalingLevel(level === 0 ? Math.max(1, window.devicePixelRatio * 1.35) : 1);
        for (const system of scene.particleSystems) if (system.name === 'Fountain spray') system.emitRate = reduced ? 15 : level === 0 ? 30 : 65;
        configurePipeline();
      },
      setPlayerVisible(visible) {
        // First person uses the real model; hide only the head/body, keep cockpit and wheels.
        visuals[0].head.setEnabled(visible);
        for (const mesh of visuals[0].bodyMeshes) mesh.isVisible = visible;
      },
      present(state, others) {
        const dt = Math.min(engine.getDeltaTime() / 1000, .05), time = performance.now() / 1000;
        sun.position.set(state.x - sunDirection.x * 110, -sunDirection.y * 110, state.z - sunDirection.z * 110);
        trackWorld.animate(time);
        { // Time of day on top of the weather: dusk warms and dims, night turns to moonlight.
          const night = Math.max(0, (timeOfDay - .45) / .55), dusk = Math.max(0, 1 - Math.abs(timeOfDay - .5) / .35);
          if (flash <= 0) {
            sun.intensity = weatherBase.sun * (1 - .88 * night) * (1 - .3 * dusk);
            sun.diffuse = Color3.Lerp(Color3.Lerp(weatherBase.sunColor, new Color3(1, .55, .3), dusk * .8), new Color3(.55, .65, 1), night);
            hemisphere.intensity = weatherBase.hemi * (1 - .72 * night); skyMaterial.emissiveTexture!.level = weatherBase.sky * (1 - .85 * night) * (1 - .2 * dusk);
          }
          scene.fogColor = Color3.Lerp(Color3.Lerp(weatherBase.fogColor, new Color3(.75, .5, .38), dusk * .5), new Color3(.06, .08, .14), night);
          tintMaterial.emissiveColor = Color3.Lerp(new Color3(1, .45, .2), new Color3(.02, .04, .12), night); tintMaterial.alpha = Math.min(.82, dusk * .38 + night * .78);
          starMaterial.alpha = night * (raining || snowing ? .25 : 1); moonMaterial.alpha = night * (raining ? .35 : 1);
          glow.intensity = .45 + night * 1.1;
          flyerMaterial.emissiveColor = night > .5 ? new Color3(.02, .02, .03) : new Color3(.1, .09, .08);
          for (const f of flyers) { const a = time * f.speed * (night > .5 ? 2.2 : 1) + f.phase, wob = night > .5 ? Math.sin(time * 7 + f.phase) * 3 : 0;
            f.mesh.position.set(state.x + Math.cos(a) * f.radius + wob, f.height + Math.sin(time * 1.3 + f.phase) * 1.5 - night * 8, state.z + Math.sin(a) * f.radius);
            f.mesh.rotation.y = -a; f.mesh.scaling.y = .35 + Math.abs(Math.sin(time * (night > .5 ? 22 : 9) + f.phase)) * .5; f.mesh.setEnabled(!raining && dusk < .9); }
        }
        { // Blowing newspapers and lingering wreck parts.
          for (const p of papers) {
            if (p.life <= 0 && Math.random() < dt * .25) { const side = Math.random() < .5 ? -1 : 1, ahead = 12 + Math.random() * 20;
              p.mesh.setEnabled(true); p.mesh.position.set(state.x + Math.sin(state.heading) * ahead + Math.cos(state.heading) * 8 * side, .3, state.z + Math.cos(state.heading) * ahead - Math.sin(state.heading) * 8 * side);
              p.vx = -Math.cos(state.heading) * side * (2 + Math.random() * 2); p.vz = Math.sin(state.heading) * side * (2 + Math.random() * 2); p.spin = 3 + Math.random() * 4; p.life = 6; }
            if (p.life > 0) { p.life -= dt; p.mesh.position.x += p.vx * dt; p.mesh.position.z += p.vz * dt; p.mesh.position.y = .25 + Math.abs(Math.sin(p.life * 2.3)) * .9;
              p.mesh.rotation.x += p.spin * dt; p.mesh.rotation.y += p.spin * .6 * dt; if (p.life <= 0) p.mesh.setEnabled(false); }
          }
          for (const d of debris) if (d.life > 0) {
            d.life -= dt; d.vy -= 12 * dt; d.mesh.position.x += d.vx * dt; d.mesh.position.z += d.vz * dt; d.mesh.position.y = Math.max(.03, d.mesh.position.y + d.vy * dt);
            if (d.mesh.position.y <= .03) { d.vx *= .9; d.vz *= .9; d.vy = 0; } else { d.mesh.rotation.x += dt * 8; d.mesh.rotation.z += dt * 5; }
            if (d.life < 1) d.mesh.scaling.setAll(Math.max(.01, d.life)); if (d.life <= 0) d.mesh.setEnabled(false);
          }
        }
        if (fireworkTime > 0) {
          fireworkTime -= dt; nextBurst -= dt;
          if (nextBurst <= 0) {
            nextBurst = .35 + Math.random() * .45;
            // In front of the player's view so every camera sees the show.
            const ahead = 22 + Math.random() * 18, side = (Math.random() - .5) * 30, [r, g, b] = fireworkColours[Math.floor(Math.random() * fireworkColours.length)];
            fireworks.emitter = new Vector3(state.x + Math.sin(state.heading) * ahead + Math.cos(state.heading) * side, 8 + Math.random() * 5, state.z + Math.cos(state.heading) * ahead - Math.sin(state.heading) * side);
            fireworks.color1 = new Color4(r, g, b, 1); fireworks.color2 = new Color4(Math.min(1, r + .2), Math.min(1, g + .2), Math.min(1, b + .2), 1); fireworks.colorDead = new Color4(r * .6, g * .3, b * .2, 0);
            fireworks.manualEmitCount = reducedEffects ? 80 : 220; api.onFirework?.();
          }
        }
        // TV director: cut between three angles on the followed kart every few seconds.
        { const k = [state, ...others][following] ?? state; shotTimer += dt; if (shotTimer > 5.5) { shotTimer = 0; shot = (shot + 1) % 3; }
          const side = shot === 0 ? 1 : -1, ahead = shot === 2 ? 2 : 9, up = shot === 1 ? 7 : 1.6, out = shot === 1 ? 3 : 5.5;
          const want = new Vector3(k.x + Math.sin(k.heading) * ahead + Math.cos(k.heading) * out * side, up, k.z + Math.cos(k.heading) * ahead - Math.sin(k.heading) * out * side);
          tvCamera.position = Vector3.Lerp(tvCamera.position, want, shotTimer < .05 ? 1 : 1 - Math.exp(-4 * dt)); tvCamera.setTarget(new Vector3(k.x, 1 + k.height, k.z)); }
        skids.update([state, ...others]);
        lastStates = [state, ...others];
        if (snowing) snow.emitter = new Vector3(state.x + Math.sin(state.heading) * 10, 0, state.z + Math.cos(state.heading) * 10);
        if (raining) {
          rain.emitter = new Vector3(state.x + Math.sin(state.heading) * 8, 0, state.z + Math.cos(state.heading) * 8);
          for (const k of lastStates) if (Math.abs(k.speed) > 4 && trackWorld.puddles.some((p) => Math.hypot(p.x - k.x, p.z - k.z) < p.r)) { splash.emitter = new Vector3(k.x, .1, k.z); splash.manualEmitCount = reducedEffects ? 6 : 24; }
          lightningTimer -= dt;
          if (lightningTimer <= 0) { lightningTimer = 9 + Math.random() * 14; flash = 1; api.onLightning?.(); }
        }
        if (flash > 0) { flash = Math.max(0, flash - dt * 3.2); const f = flash > .7 || (flash > .3 && flash < .45) ? 1 : 0; hemisphere.intensity = .62 + f * 2.4; skyMaterial.emissiveTexture!.level = .42 + f * .9; }
        // Parade tank: springy pop-in, kart hidden, driver rises into the hatch, tracks and road wheels roll.
        { const owner = [state, ...others][tankOwner] ?? state;
          const want = owner.tankRemaining > 0 ? 1 : 0; tankBlend += (want - tankBlend) * Math.min(1, dt * 7);
          const shown = tankBlend > .02; tankRoot.setEnabled(shown);
          for (const mesh of kartOnlyMeshes) mesh.isVisible = tankBlend < .45;
          if (shown) {
            const pop = tankBlend < 1 ? 1 + Math.sin(tankBlend * Math.PI) * .18 : 1; tankRoot.scaling.setAll(Math.max(.05, tankBlend) * pop * 1.15);
            trackScroll += owner.speed * dt; for (const w of tankWheels) w.rotation.x = trackScroll / .3;
            trackTexture.uOffset = -trackScroll / .9 * 4;
            if (tankTurret) tankTurret.rotation.y = -(owner.steer ?? 0) * .3 + Math.sin(time * .7) * .05;
            trackDust.emitter = new Vector3(owner.x - Math.sin(owner.heading) * 1.7, .2, owner.z - Math.cos(owner.heading) * 1.7);
          }
          trackDust.emitRate = shown && Math.abs(owner.speed) > 2 ? reducedEffects ? 20 : 70 : 0;
          visuals[tankOwner].driver.position.y = tankBlend * .85; }
        [state, ...others].forEach((s, index) => {
          const v = visuals[index]; if (!v) return;
          contactShadows[index].position.x=s.x;contactShadows[index].position.z=s.z;contactShadows[index].rotation.y=s.heading;
          contactShadows[index].visibility=Math.max(.15,1-s.height*.9);
          v.root.position.set(s.x, s.height + s.suspensionOffset, s.z);
          // Item hit: one eased full turn of the body while the kart coasts on its path.
          const spin = s.spinRemaining > 0 ? 1 - (s.spinRemaining / .95) : 0;
          v.root.rotation.y = s.heading + (s.spinRemaining > 0 ? (1 - (1 - spin) ** 2) * Math.PI * 2 : 0);
          // Calm sprung body. Exponential response stays stable across uneven render frames.
          const lateral = s.speed * (s.yawRate ?? 0), longitudinal = (s.speed - v.previousSpeed) / Math.max(dt, 1e-3);
          const rollTarget = Math.max(-.045, Math.min(.045, -lateral * .004));
          const pitchTarget = Math.max(-.035, Math.min(.048, longitudinal * .0025 + Math.max(0, s.speed / 20) ** 2 * .016));
          const response = 1 - Math.exp(-7 * dt);
          v.roll += (rollTarget - v.roll) * response; v.pitch += (pitchTarget - v.pitch) * response;
          const rumble = s.grounded ? Math.min(1, Math.abs(s.speed) / 16) : 0;
          v.root.rotation.x = 0; v.root.rotation.z = 0;
          // The imported body's forward axis is -Z: positive local pitch lifts the bonnet.
          v.orientation.rotation.x = -s.bodyPitch + s.impactVelocityZ * .018 + v.pitch + Math.sin(time * 47 + index) * .001 * rumble;
          v.orientation.position.y = Math.sin(time * 61 + index * 2) * .0015 * rumble;
          const slip = Math.sin(s.heading - s.travelHeading);
          v.orientation.rotation.z = -s.bodyRoll + (s.drifting ? s.driftDirection * .025 : 0) + (s.grounded ? Math.max(-.025, Math.min(.025, -slip * Math.abs(s.speed) * .004)) : 0) - v.roll + Math.sin(time * 53 + index) * .001 * rumble;
          // Visible weight: compress on landing and suspension dips, stretch slightly at the hop apex.
          const squash = Math.max(-.09, Math.min(.06, s.suspensionVelocity * .045 + (s.height > .05 ? .035 : 0)));
          v.orientation.scaling.set(1 - squash * .25, 1 + squash * .5, 1 - squash * .25);
          v.rotation += s.speed * dt / .33;
          v.pivots.forEach((p, i) => { p.position.y = .34 + (s.grounded ? s.wheelGroundHeights[i] - s.suspensionOffset : 0); p.rotation.y = i < 2 ? (s.steer ?? 0) * .42 - Math.sin(s.heading - s.travelHeading) * .35 : 0; });
          v.spins.forEach((p) => p.rotation.x = v.rotation);
          v.steering.rotation.z = -(s.steer ?? 0) * 1.15 - Math.sin(s.heading - s.travelHeading) * .4;
          // Arms follow the wheel; a fresh mini-turbo earns a vertical, pumping fist (sports gesture, never a forward-raised arm).
          const wheelTurn = (s.steer ?? 0) * .9 + Math.sin(s.heading - s.travelHeading) * .3;
          v.cheer += ((s.turboRemaining > .75 ? 1 : 0) - v.cheer) * Math.min(1, dt * 9);
          if (v.arms[0]) { v.arms[0].rotation.z = wheelTurn * .3; v.arms[0].rotation.x = wheelTurn * .12; }
          if (v.arms[1]) { v.arms[1].rotation.z = wheelTurn * .3 + v.cheer * .35; v.arms[1].rotation.x = -wheelTurn * .12 + v.cheer * (2.15 + Math.sin(time * 14) * .18); }
          // Paper burst on an item hit, dust puff on landing.
          if (s.spinRemaining > 0 && !v.spinning) burst(paper, s, reducedEffects ? 20 : 70);
          if (s.height <= .02 && v.wasAirborne) burst(puff, s, reducedEffects ? 6 : 22);
          v.spinning = s.spinRemaining > 0; v.wasAirborne = s.height > .05;
          v.driver.rotation.x = Math.max(-.09, Math.min(.09, (v.previousSpeed - s.speed) * .025));
          // The driver leans into the bend against the body roll.
          v.driver.rotation.z = (s.drifting ? s.driftDirection * .1 : 0) + Math.max(-.14, Math.min(.14, lateral * .013));
          v.head.rotation.z=Math.sin(s.heading-s.travelHeading)*-.16;
          v.head.rotation.x=s.turboRemaining>0?-.06:s.impactRemaining>0?.09:0;
          if (v.scarf) { v.scarf.rotation.x = -Math.min(.2, Math.abs(s.speed) * .012) - Math.sin(time * 9 + index) * Math.abs(s.speed) * .0035; v.scarf.rotation.z = Math.sin(time * 6.5 + index) * .04; }
          // Pedals follow what the driver is doing: gas while gaining speed, brake while slowing hard.
          v.gas += ((longitudinal > .4 && s.speed > 0 ? 1 : 0) - v.gas) * Math.min(1, dt * 14); v.brake += ((longitudinal < -3 ? 1 : 0) - v.brake) * Math.min(1, dt * 14);
          if (v.pedals[0]) v.pedals[0].rotation.x = -v.gas * .45; if (v.pedals[1]) v.pedals[1].rotation.x = -v.brake * .45;
          v.previousSpeed = s.speed;
          v.flames.forEach((f) => { f.setEnabled(s.turboRemaining > 0); f.scaling.z = 3 + Math.sin(time * 40); });
          // Harbour salvage: sink, then the crane hook lifts the kart out of the water.
          { const left = salvageNow[index] ?? 0, cable = cables[index];
            if (left > 0) { const t = 3.2 - left, y = t < 1 ? -.9 * t : -.9 + Math.min(1, (t - 1) / 1.4) * 4.1;
              v.root.position.y = y + Math.sin(time * 3) * (t > 2.4 ? .08 : 0); v.root.rotation.z = t > 1 ? Math.sin(time * 2.4) * .12 : 0;
              cable.setEnabled(t > .7); const top = 11, bottom = y + 1.6; cable.scaling.y = Math.max(.1, top - bottom); cable.position.set(s.x, (top + bottom) / 2, s.z);
            } else { cable.setEnabled(false); v.root.rotation.z = 0; } }
          // Damage look: soot on the paint, engine smoke, and the comic driver ejection during a wreck.
          const health = healthNow[index] ?? 100, wrecked = (wreckedNow[index] ?? 0) > 0;
          const soot = wrecked ? .85 : health < 66 ? (66 - health) / 66 * .65 : 0;
          if (Math.abs(soot - v.soot) > .02) { v.soot = soot; const c = Color3.Lerp(v.paintColour, SOOT, soot); for (const m of v.paints()) m.albedoColor = c; }
          const smoke = engineSmoke[index]; smoke.emitter = new Vector3(s.x - Math.sin(s.heading) * 1.2, .9 + s.height, s.z - Math.cos(s.heading) * 1.2);
          smoke.emitRate = wrecked ? (reducedEffects ? 12 : 40) : health < 33 ? (reducedEffects ? 6 : 22) : health < 66 ? (reducedEffects ? 3 : 9) : 0;
          const dark = wrecked || health < 33; smoke.color1 = dark ? new Color4(.1, .09, .08, .65) : new Color4(.55, .54, .52, .45); smoke.color2 = smoke.color1; smoke.colorDead = new Color4(.3, .3, .3, 0);
          if (wrecked && v.wreckAge >= 0) {
            v.wreckAge += dt; const t = v.wreckAge;
            v.driver.position.y = Math.max(0, 7 * t - 5 * t * t); v.driver.rotation.x = t < 1.4 ? t * 9 : 0;
            v.orientation.rotation.z += Math.sin(Math.min(1, t * 2) * Math.PI) * .35;
          } else if (v.wreckAge >= 0 && !wrecked) { v.wreckAge = -1; v.driver.position.y = 0; burst(puff, s, reducedEffects ? 8 : 26); }
        });
        const map=shadow.getShadowMap();
        if(map)map.renderList=[...staticShadowMeshes,
          ...treeShadows.filter(t=>Math.hypot(t.root.position.x-state.x,t.root.position.z-state.z)<44).flatMap(t=>t.meshes),
          ...visuals.filter(v=>Math.hypot(v.root.position.x-state.x,v.root.position.z-state.z)<45).flatMap(v=>v.shadowMeshes),
          ...itemShadowMeshes.filter(mesh=>mesh.isEnabled())];
        const back = new Vector3(state.x - Math.sin(state.heading) * 1.15, .12 + state.height, state.z - Math.cos(state.heading) * 1.15);
        dust.emitter = back;
        boostFire.emitter = new Vector3(state.x - Math.sin(state.heading) * 1.75, .62 + state.height, state.z - Math.cos(state.heading) * 1.75);
        boostFire.direction1 = new Vector3(-Math.sin(state.heading) * 2 - .3, .2, -Math.cos(state.heading) * 2 - .3);
        boostFire.direction2 = new Vector3(-Math.sin(state.heading) * 3 + .3, .5, -Math.cos(state.heading) * 3 + .3);
        boostFire.emitRate = state.turboRemaining > 0 ? reducedEffects ? 40 : 150 : 0; dust.emitRate = state.grounded && Math.abs(state.speed) > 4 ? state.drifting ? reducedEffects ? 12 : 65 : reducedEffects ? 0 : Math.min(24, Math.abs(state.speed) * 1.5) : 0;
        sparks.emitter = back.add(new Vector3(Math.cos(state.heading) * .85, 0, -Math.sin(state.heading) * .85));
        const scraping = state.scrapeRemaining > 0 && state.scrapeKind === 'wall' || state.impactRemaining > 0;
        sparks.emitRate = state.drifting || scraping ? reducedEffects ? 20 : scraping ? 120 : 70 : 0;
        sparks.color1 = scraping ? new Color4(1, .78, .35, 1) : state.driftCharge >= .7 ? new Color4(1, .6, .12, 1) : new Color4(.15, .8, 1, 1); sparks.color2 = sparks.color1;
      },
    };
    return api;
  } catch (error) { scene.dispose(); throw error; }
}
