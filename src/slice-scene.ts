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
import { DefaultRenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline';
import { TRACK, trackPoint } from './track';
import { LANDMARKS } from './track-layout';
import { addTrackWorld } from './track-world';
import { SkidMarks, createConfetti, softParticleTexture } from './effects';
import type { TestScene } from './scene';
import { surfaceTextures } from './surface-textures';
import { SceneInstrumentation } from '@babylonjs/core/Instrumentation/sceneInstrumentation';
import { EngineInstrumentation } from '@babylonjs/core/Instrumentation/engineInstrumentation';
import '@babylonjs/core/Engines/Extensions/engine.query';
import '@babylonjs/core/Engines/AbstractEngine/abstractEngine.timeQuery';
import {addItems} from './item-scene';


/** Panorama-space angle of the sun in sky-afternoon (table_mountain_2), measured in-game. */
const SKY_SUN_OFFSET = 0;

function glowMaterial(scene: Scene, name: string, color: string): StandardMaterial {
  const m = new StandardMaterial(name, scene); m.diffuseColor = Color3.FromHexString(color);
  m.emissiveColor = m.diffuseColor; m.disableLighting = true; return m;
}

function particleTexture(scene: Scene): DynamicTexture { return softParticleTexture(scene); }

export async function createSliceScene(engine: Engine, loadKartCount: number, quality=1): Promise<TestScene> {
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
    const props=await ImportMeshAsync('/assets/models/stadium-props.glb',scene);
    props.meshes.filter(m=>!m.parent).forEach(m=>m.parent=worldOrientation);
    for(const mesh of props.meshes) {
      mesh.receiveShadows=true;mesh.isPickable=false;if(mesh.getTotalVertices()>0)shadow.addShadowCaster(mesh);
      if(mesh.material instanceof PBRMaterial) {
        if(mesh.material.name.includes('limestone')){mesh.material.albedoTexture=stoneMaps.color;mesh.material.bumpTexture=stoneMaps.normal;}
        if(/cloth|Spectator/.test(mesh.material.name)){mesh.material.albedoTexture=fabricMaps.color;mesh.material.bumpTexture=fabricMaps.normal;}
      }
    }
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
    for(const mesh of trackWorld.glowMeshes) glow.addIncludedOnlyMesh(mesh);
    const container = await LoadAssetContainerAsync('/assets/models/hero-kart.glb', scene);
    const colors = ['#125965', '#862e38', '#c1ae78', '#435940', '#384b74', '#5a365a'];
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
      const variants=['radio','spare','luggage','fin','parade','none'];
      for(const kind of ['radio','spare','luggage','fin','parade']) {
        const node=nodes.find(n=>n.name===`kart${index}/variant-${kind}`) as TransformNode|undefined;node?.setEnabled(kind===variants[index]);
      }
      const scarf = nodes.find((n) => n.name === `kart${index}/scarfFlap`) as TransformNode;
      const steering = nodes.find((n) => n.name === `kart${index}/steeringWheel`) as TransformNode;
      if (pivots.some((n) => !n) || spins.some((n) => !n) || !driver || !head || !steering) throw new Error('Kart articulation nodes are missing');
      for (const node of [...pivots, ...spins, driver, head, scarf, steering]) if (node) node.rotationQuaternion = null;
      for (const mesh of root.getChildMeshes()) {
        mesh.receiveShadows = true; mesh.isPickable = false;
        if(mesh instanceof Mesh && mesh.name.includes('Warm headlamp')) glow.addIncludedOnlyMesh(mesh);
        if (mesh.material instanceof PBRMaterial && mesh.material.name.includes('Petrol enamel')) {
          const source=mesh.material;let material=paint.get(source);
          if(!material){material=source.clone(`Kart ${index} enamel`)!;material.albedoColor=Color3.FromHexString(colors[index]);paint.set(source,material);}
          mesh.material=material;
        }
        if (mesh.material instanceof PBRMaterial && /racing suit|leather/.test(mesh.material.name)) {
          mesh.material.albedoTexture = fabricMaps.color; mesh.material.bumpTexture = fabricMaps.normal;
        }
      }
      const flames = [-.72, .72].map((x) => {
        const flame = MeshBuilder.CreateSphere(`Exhaust flame ${index}`, { diameter: .18, segments: 8 }, scene);
        flame.parent = root; flame.position.set(x, .62, -1.62); flame.scaling.z = 4;
        flame.material = glowMaterial(scene, `Boost flame ${index}`, '#71dfff'); glow.addIncludedOnlyMesh(flame); flame.setEnabled(false); return flame;
      });
      const shadowMeshes=root.getChildMeshes().filter(mesh=>/Petrol enamel|Tire rubber|racing suit|Warm skin|helmet|Dark leather/.test(mesh.name));
      return { root, pivots, spins, driver,head, scarf, steering, flames,shadowMeshes, rotation: 0, previousSpeed: 0 };
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
    dust.minSize = .1; dust.maxSize = .4; dust.minLifeTime = .25; dust.maxLifeTime = .6;
    dust.direction1 = new Vector3(-.3, .15, -.3); dust.direction2 = new Vector3(.3, .6, .3);
    dust.color1 = new Color4(.6, .56, .48, .28); dust.color2 = new Color4(.72, .71, .63, .22); dust.colorDead = new Color4(.6, .6, .5, 0); dust.start();
    const sparks = new ParticleSystem('Drift sparks', 100, scene); sparks.particleTexture = particleTexture(scene);
    sparks.minSize = .045; sparks.maxSize = .11; sparks.minLifeTime = .1; sparks.maxLifeTime = .36;
    sparks.direction1 = new Vector3(-1.5, .3, -1.5); sparks.direction2 = new Vector3(1.5, 1.5, 1.5);
    sparks.gravity = new Vector3(0, -4, 0); sparks.colorDead = new Color4(1, .4, .05, 0); sparks.start();
    let reducedEffects = false;
    const skids = new SkidMarks(scene, loadKartCount + 1);
    const confetti = createConfetti(scene);
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
    const presentItems=await addItems(scene,shadow,loadKartCount+1);
    const itemShadowMeshes=(shadow.getShadowMap()?.renderList??[]).filter(mesh=>!staticShadowMeshes.includes(mesh));
    for(const mesh of [...world.meshes,...props.meshes]){mesh.computeWorldMatrix(true);mesh.freezeWorldMatrix();}
    return {
      scene,
      presentItems,
      attachCamera(camera) {
        pipeline?.dispose();
        pipeline = new DefaultRenderingPipeline('Presentation', engine.getCaps().textureHalfFloatRender, scene, [camera]);
        configurePipeline();
      },
      celebrate(kind) {
        const p = trackPoint(TRACK.start, 0);
        confetti.burst(new Vector3(p.x, kind === 'start' ? 7.5 : 6, p.z), reducedEffects ? 80 : kind === 'start' ? 220 : 340);
      },
      resetEffects() { skids.clear(); },
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
      },
      present(state, others) {
        const dt = Math.min(engine.getDeltaTime() / 1000, .05), time = performance.now() / 1000;
        sun.position.set(state.x - sunDirection.x * 110, -sunDirection.y * 110, state.z - sunDirection.z * 110);
        trackWorld.animate(time);
        skids.update([state, ...others]);
        [state, ...others].forEach((s, index) => {
          const v = visuals[index]; if (!v) return;
          contactShadows[index].position.x=s.x;contactShadows[index].position.z=s.z;contactShadows[index].rotation.y=s.heading;
          contactShadows[index].visibility=Math.max(.15,1-s.height*.9);
          v.root.position.set(s.x, s.height + s.suspensionOffset, s.z); v.root.rotation.y = s.heading;
          v.root.rotation.x = -s.bodyPitch + s.impactVelocityZ * .035;
          v.root.rotation.z = s.bodyRoll + (s.drifting ? -s.driftDirection * .055 : 0);
          v.rotation += s.speed * dt / .33;
          v.pivots.forEach((p, i) => { p.position.y = .34 + (s.grounded ? s.wheelGroundHeights[i] - s.suspensionOffset : 0); p.rotation.y = i < 2 ? Math.sin(s.heading - s.travelHeading) * .6 : 0; });
          v.spins.forEach((p) => p.rotation.x = v.rotation);
          v.steering.rotation.z = -Math.sin(s.heading - s.travelHeading) * .7;
          v.driver.rotation.x = Math.max(-.09, Math.min(.09, (v.previousSpeed - s.speed) * .025));
          v.driver.rotation.z = s.drifting ? s.driftDirection * .08 : Math.sin(time * 5) * Math.abs(s.speed) * .0008;
          v.head.rotation.z=Math.sin(s.heading-s.travelHeading)*-.16;
          v.head.rotation.x=s.turboRemaining>0?-.06:s.impactRemaining>0?.09:0;
          if (v.scarf) v.scarf.rotation.z = Math.sin(time * 12) * Math.abs(s.speed) * .008;
          v.previousSpeed = s.speed;
          v.flames.forEach((f) => { f.setEnabled(s.turboRemaining > 0); f.scaling.z = 3 + Math.sin(time * 40); });
        });
        const map=shadow.getShadowMap();
        if(map)map.renderList=[...staticShadowMeshes,
          ...treeShadows.filter(t=>Math.hypot(t.root.position.x-state.x,t.root.position.z-state.z)<44).flatMap(t=>t.meshes),
          ...visuals.filter(v=>Math.hypot(v.root.position.x-state.x,v.root.position.z-state.z)<45).flatMap(v=>v.shadowMeshes),
          ...itemShadowMeshes.filter(mesh=>mesh.isEnabled())];
        const back = new Vector3(state.x - Math.sin(state.heading), .2 + state.height, state.z - Math.cos(state.heading));
        dust.emitter = back; dust.emitRate = state.grounded && Math.abs(state.speed) > 4 ? state.drifting ? reducedEffects ? 20 : 90 : reducedEffects ? 0 : 8 : 0;
        sparks.emitter = back.add(new Vector3(Math.cos(state.heading) * .85, 0, -Math.sin(state.heading) * .85));
        const scraping = state.scrapeRemaining > 0 || state.impactRemaining > 0;
        sparks.emitRate = state.drifting || scraping ? reducedEffects ? 20 : scraping ? 120 : 70 : 0;
        sparks.color1 = scraping ? new Color4(1, .78, .35, 1) : state.driftCharge >= .7 ? new Color4(1, .6, .12, 1) : new Color4(.15, .8, 1, 1); sparks.color2 = sparks.color1;
      },
    };
  } catch (error) { scene.dispose(); throw error; }
}
