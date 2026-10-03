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
import { CAST, CAST_PARTS } from './cast';


/** Panorama-space angle of the sun in sky-afternoon (table_mountain_2), measured in-game. */
const SKY_SUN_OFFSET = Math.PI * .55;

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
      const cast = CAST[index % CAST.length];
      for(const kind of ['radio','spare','luggage','fin','parade']) {
        const node=nodes.find(n=>n.name===`kart${index}/variant-${kind}`) as TransformNode|undefined;node?.setEnabled(kind===cast.kit);
      }
      for (const part of CAST_PARTS) {
        const node = nodes.find((n) => n.name === `kart${index}/cast-${part}`) as TransformNode | undefined;
        node?.setEnabled(part === cast.hat || cast.face.includes(part));
      }
      const scarf = nodes.find((n) => n.name === `kart${index}/scarfFlap`) as TransformNode;
      const steering = nodes.find((n) => n.name === `kart${index}/steeringWheel`) as TransformNode;
      const arms = ['L', 'R'].map((side) => nodes.find((n) => n.name === `kart${index}/armPose-${side}`) as TransformNode | undefined);
      for (const arm of arms) if (arm) arm.rotationQuaternion = null;
      if (pivots.some((n) => !n) || spins.some((n) => !n) || !driver || !head || !steering) throw new Error('Kart articulation nodes are missing');
      for (const node of [...pivots, ...spins, driver, head, scarf, steering]) if (node) node.rotationQuaternion = null;
      for (const mesh of root.getChildMeshes()) {
        mesh.receiveShadows = true; mesh.isPickable = false;
        if(mesh instanceof Mesh && mesh.name.includes('Warm headlamp')) glow.addIncludedOnlyMesh(mesh);
        const recolour: [RegExp, string | null][] = [[/Petrol enamel/, cast.paint], [/Uniform racing suit/, cast.uniform], [/Cape cloth/, cast.cape], [/Hat cloth/, cast.hatColor]];
        for (const [pattern, colour] of recolour) if (mesh.material instanceof PBRMaterial && pattern.test(mesh.material.name)) {
          if (!colour) { mesh.setEnabled(false); continue; }
          const source=mesh.material;let material=paint.get(source);
          if(!material){
            material=source.clone(`Kart ${index} ${source.name}`)!;material.albedoColor=Color3.FromHexString(colour).toLinearSpace();
            if (/enamel/.test(source.name)) { material.metallic = .25; material.roughness = .38; material.clearCoat.isEnabled = true; material.clearCoat.intensity = .85; material.clearCoat.roughness = .08; }
            paint.set(source,material);
          }
          mesh.material=material;
        }
        if (mesh.material instanceof PBRMaterial && /racing suit|leather/.test(mesh.material.name)) {
          mesh.material.albedoTexture = fabricMaps.color; mesh.material.bumpTexture = fabricMaps.normal;
        }
      }
      const flames = [-.72, .72].map((x) => {
        const flame = MeshBuilder.CreateSphere(`Exhaust flame ${index}`, { diameter: .18, segments: 8 }, scene);
        flame.parent = root; flame.position.set(x * .72, .6, -1.72); flame.scaling.z = 4;
        flame.material = glowMaterial(scene, `Boost flame ${index}`, '#71dfff'); glow.addIncludedOnlyMesh(flame); flame.setEnabled(false); return flame;
      });
      // First person keeps only the gloves on the wheel; torso, cape and epaulettes would fill the view.
      const bodyMeshes=driver.getChildMeshes().filter(mesh=>!/White glove/.test(mesh.name)&&!mesh.isDescendantOf(head)&&mesh.isEnabled());
      // Only the big silhouettes cast kart shadows: body, tyres, uniform, cape and cap (fewer shadow draws).
      const shadowMeshes=root.getChildMeshes().filter(mesh=>mesh.isEnabled()&&/Petrol enamel|Tire rubber|driverPose \/ Uniform racing suit|Cape cloth|Hat cloth/.test(mesh.name));
      return { root, pivots, spins, driver,head, scarf, steering, arms, flames,shadowMeshes,bodyMeshes, rotation: 0, previousSpeed: 0, wasAirborne: false, spinning: false, cheer: 0, roll: 0, rollVel: 0, pitch: 0, pitchVel: 0 };
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
    return {
      scene,
      presentItems,
      attachCamera(camera) {
        pipeline?.dispose();
        pipeline = new DefaultRenderingPipeline('Presentation', engine.getCaps().textureHalfFloatRender, scene, [camera]);
        configurePipeline();
      },
      broadcast(kart, text) { following = kart; if (text !== captionText) { captionText = text; paintCaption(text); } },
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
        for (const mesh of visuals[0].bodyMeshes) mesh.isVisible = visible;
      },
      present(state, others) {
        const dt = Math.min(engine.getDeltaTime() / 1000, .05), time = performance.now() / 1000;
        sun.position.set(state.x - sunDirection.x * 110, -sunDirection.y * 110, state.z - sunDirection.z * 110);
        trackWorld.animate(time);
        // TV director: cut between three angles on the followed kart every few seconds.
        { const k = [state, ...others][following] ?? state; shotTimer += dt; if (shotTimer > 5.5) { shotTimer = 0; shot = (shot + 1) % 3; }
          const side = shot === 0 ? 1 : -1, ahead = shot === 2 ? 2 : 9, up = shot === 1 ? 7 : 1.6, out = shot === 1 ? 3 : 5.5;
          const want = new Vector3(k.x + Math.sin(k.heading) * ahead + Math.cos(k.heading) * out * side, up, k.z + Math.cos(k.heading) * ahead - Math.sin(k.heading) * out * side);
          tvCamera.position = Vector3.Lerp(tvCamera.position, want, shotTimer < .05 ? 1 : 1 - Math.exp(-4 * dt)); tvCamera.setTarget(new Vector3(k.x, 1 + k.height, k.z)); }
        skids.update([state, ...others]);
        [state, ...others].forEach((s, index) => {
          const v = visuals[index]; if (!v) return;
          contactShadows[index].position.x=s.x;contactShadows[index].position.z=s.z;contactShadows[index].rotation.y=s.heading;
          contactShadows[index].visibility=Math.max(.15,1-s.height*.9);
          v.root.position.set(s.x, s.height + s.suspensionOffset, s.z);
          // Item hit: one eased full turn of the body while the kart coasts on its path.
          const spin = s.spinRemaining > 0 ? 1 - (s.spinRemaining / .95) : 0;
          v.root.rotation.y = s.heading + (s.spinRemaining > 0 ? (1 - (1 - spin) ** 2) * Math.PI * 2 : 0);
          // Sprung body: rolls out of the turn, squats and dives, wobbles back; cobbles add a fine rumble.
          const lateral = s.speed * (s.yawRate ?? 0), longitudinal = (s.speed - v.previousSpeed) / Math.max(dt, 1e-3);
          const rollTarget = Math.max(-.11, Math.min(.11, -lateral * .011)), pitchTarget = Math.max(-.07, Math.min(.07, longitudinal * .006));
          v.rollVel += ((rollTarget - v.roll) * 95 - v.rollVel * 7.5) * dt; v.roll += v.rollVel * dt;
          v.pitchVel += ((pitchTarget - v.pitch) * 110 - v.pitchVel * 8.5) * dt; v.pitch += v.pitchVel * dt;
          const rumble = s.grounded ? Math.min(1, Math.abs(s.speed) / 16) : 0;
          v.root.rotation.x = -s.bodyPitch + s.impactVelocityZ * .035 + v.pitch + Math.sin(time * 47 + index) * .004 * rumble;
          v.root.position.y += Math.sin(time * 61 + index * 2) * .008 * rumble;
          const slip = Math.sin(s.heading - s.travelHeading);
          v.root.rotation.z = s.bodyRoll + (s.drifting ? -s.driftDirection * .055 : 0) + (s.grounded ? Math.max(-.07, Math.min(.07, slip * Math.abs(s.speed) * .012)) : 0) + v.roll + Math.sin(time * 53 + index) * .005 * rumble;
          // Visible weight: compress on landing and suspension dips, stretch slightly at the hop apex.
          const squash = Math.max(-.09, Math.min(.06, s.suspensionVelocity * .045 + (s.height > .05 ? .035 : 0)));
          v.root.scaling.set(1 - squash * .5, 1 + squash, 1 - squash * .5);
          v.rotation += s.speed * dt / .33;
          v.pivots.forEach((p, i) => { p.position.y = .34 + (s.grounded ? s.wheelGroundHeights[i] - s.suspensionOffset : 0); p.rotation.y = i < 2 ? -(s.steer ?? 0) * .42 + Math.sin(s.heading - s.travelHeading) * .35 : 0; });
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
          v.previousSpeed = s.speed;
          v.flames.forEach((f) => { f.setEnabled(s.turboRemaining > 0); f.scaling.z = 3 + Math.sin(time * 40); });
        });
        const map=shadow.getShadowMap();
        if(map)map.renderList=[...staticShadowMeshes,
          ...treeShadows.filter(t=>Math.hypot(t.root.position.x-state.x,t.root.position.z-state.z)<44).flatMap(t=>t.meshes),
          ...visuals.filter(v=>Math.hypot(v.root.position.x-state.x,v.root.position.z-state.z)<45).flatMap(v=>v.shadowMeshes),
          ...itemShadowMeshes.filter(mesh=>mesh.isEnabled())];
        const back = new Vector3(state.x - Math.sin(state.heading), .2 + state.height, state.z - Math.cos(state.heading));
        dust.emitter = back;
        boostFire.emitter = new Vector3(state.x - Math.sin(state.heading) * 1.75, .62 + state.height, state.z - Math.cos(state.heading) * 1.75);
        boostFire.direction1 = new Vector3(-Math.sin(state.heading) * 2 - .3, .2, -Math.cos(state.heading) * 2 - .3);
        boostFire.direction2 = new Vector3(-Math.sin(state.heading) * 3 + .3, .5, -Math.cos(state.heading) * 3 + .3);
        boostFire.emitRate = state.turboRemaining > 0 ? reducedEffects ? 40 : 150 : 0; dust.emitRate = state.grounded && Math.abs(state.speed) > 4 ? state.drifting ? reducedEffects ? 20 : 90 : reducedEffects ? 0 : 8 : 0;
        sparks.emitter = back.add(new Vector3(Math.cos(state.heading) * .85, 0, -Math.sin(state.heading) * .85));
        const scraping = state.scrapeRemaining > 0 && state.scrapeKind === 'wall' || state.impactRemaining > 0;
        sparks.emitRate = state.drifting || scraping ? reducedEffects ? 20 : scraping ? 120 : 70 : 0;
        sparks.color1 = scraping ? new Color4(1, .78, .35, 1) : state.driftCharge >= .7 ? new Color4(1, .6, .12, 1) : new Color4(.15, .8, 1, 1); sparks.color2 = sparks.color1;
      },
    };
  } catch (error) { scene.dispose(); throw error; }
}
