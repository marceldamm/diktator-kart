import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {Color3,Color4} from '@babylonjs/core/Maths/math.color';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {ParticleSystem} from '@babylonjs/core/Particles/particleSystem';
import type {Scene} from '@babylonjs/core/scene';
import type {ShadowGenerator} from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import type {ItemWorld,ItemKind} from './items';
import type {KartState} from './kart-model';
import {softParticleTexture} from './effects';

/** Fixed pools: no mesh allocation during racing, all resources belong to the scene. */
export async function addItems(scene:Scene,shadow:ShadowGenerator,count:number) {
  const container=await LoadAssetContainerAsync('/assets/models/items.glb',scene);
  const dogs=await LoadAssetContainerAsync('/assets/models/shepherd.glb',scene);
  const copy=(kind:ItemKind|'pickup',name:string)=>{
    const source=container.transformNodes.find(n=>n.name===kind);if(!source)throw Error(`Missing item model: ${kind}`);
    const root=new TransformNode(name,scene),orientation=new TransformNode(name+'/orientation',scene);orientation.parent=root;orientation.scaling.z=-1;
    const clone=source.clone(name+'/model',orientation);if(!clone)throw Error('Item clone failed');
    for(const mesh of root.getChildMeshes()){mesh.isPickable=false;mesh.receiveShadows=true;shadow.addShadowCaster(mesh);}
    root.setEnabled(false);return root;
  };
  const kinds:ItemKind[]=['direct','homing','trap'];
  const pools=kinds.flatMap(kind=>Array.from({length:6},(_,i)=>({kind,id:-1,dog:false,root:copy(kind,`item ${kind} ${i}`),legs:[] as TransformNode[],tail:undefined as TransformNode|undefined})));
  for(const kind of ['direct','homing'] as const)for(let i=0;i<6;i++){
    const root=new TransformNode(`shepherd ${kind} ${i}`,scene),orientation=new TransformNode(`shepherd orientation ${kind} ${i}`,scene);
    orientation.parent=root;orientation.scaling.z=-1;
    const source=dogs.transformNodes.find(n=>n.name==='shepherd');if(!source)throw Error('Missing shepherd model');
    const clone=source.clone(`shepherd model ${kind} ${i}`,orientation);if(!clone)throw Error('Shepherd clone failed');
    const descendants=root.getDescendants(),legs=Array.from({length:4},(_,n)=>descendants.find(p=>p.name.endsWith('dogLeg-'+n)) as TransformNode);
    const tail=descendants.find(p=>p.name.endsWith('dogTail')) as TransformNode;
    if(legs.some(p=>!p)||!tail)throw Error('Shepherd articulation missing');
    for(const part of [...legs,tail])part.rotationQuaternion=null;
    for(const mesh of root.getChildMeshes()){mesh.isPickable=false;mesh.receiveShadows=true;shadow.addShadowCaster(mesh);}
    root.setEnabled(false);pools.push({kind,id:-1,dog:true,root,legs,tail});
  }
  const boxes=Array.from({length:9},(_,i)=>copy('pickup',`dispatch box ${i}`));
  const ringMaterial=new StandardMaterial('Brief hit protection',scene);ringMaterial.diffuseColor=Color3.FromHexString('#e2c88f');ringMaterial.emissiveColor=Color3.FromHexString('#a18a50');ringMaterial.disableLighting=true;
  const rings=Array.from({length:count},(_,i)=>{const m=MeshBuilder.CreateTorus(`Hit protection ${i}`,{diameter:3.2,thickness:.045,tessellation:32},scene);m.material=ringMaterial;m.setEnabled(false);return m;});
  const paper=new ParticleSystem('Postal paper and stamp dust',100,scene);paper.particleTexture=scene.particleSystems[0]?.particleTexture;
  paper.minSize=.07;paper.maxSize=.18;paper.minLifeTime=.2;paper.maxLifeTime=.65;paper.gravity=new Vector3(0,-3,0);
  paper.direction1=new Vector3(-1,1,-1);paper.direction2=new Vector3(1,2,1);paper.minEmitPower=1;paper.maxEmitPower=3;
  paper.color1=new Color4(.94,.85,.64,.9);paper.color2=new Color4(.85,.69,.45,.8);paper.colorDead=new Color4(.94,.85,.64,0);paper.emitRate=0;paper.start();
  const dogPuff=new ParticleSystem('Shepherd comic impact cloud',80,scene);dogPuff.particleTexture=softParticleTexture(scene,'Shepherd puff');
  dogPuff.blendMode=ParticleSystem.BLENDMODE_STANDARD;dogPuff.minSize=.35;dogPuff.maxSize=.95;dogPuff.minLifeTime=.3;dogPuff.maxLifeTime=.7;
  dogPuff.direction1=new Vector3(-2,.2,-2);dogPuff.direction2=new Vector3(2,2,2);dogPuff.minEmitPower=1;dogPuff.maxEmitPower=2;
  dogPuff.color1=new Color4(.81,.71,.5,.65);dogPuff.color2=new Color4(.94,.85,.65,.45);dogPuff.colorDead=new Color4(.9,.8,.6,0);dogPuff.emitRate=0;dogPuff.start();
  scene.onDisposeObservable.add(()=>{container.dispose();dogs.dispose();});
  return (world:ItemWorld,karts:KartState[])=>{
    for(const p of pools) if(!world.objects.some(o=>o.id===p.id)){p.id=-1;p.root.setEnabled(false);}
    for(const o of world.objects) {
      const dog=o.owner===0&&o.kind!=='trap';
      const p=pools.find(p=>p.id===o.id)??pools.find(p=>p.id===-1&&p.kind===o.kind&&p.dog===dog);if(!p)continue;
      p.id=o.id;p.root.setEnabled(true);p.root.position.set(o.x,p.dog?.045+Math.abs(Math.sin(world.time*15+o.id))*.07:o.kind==='trap'?.03:.95+Math.sin(world.time*13+o.id)*.06,o.z);p.root.rotation.y=o.heading;
      if(p.dog){p.legs.forEach((leg,i)=>leg.rotation.x=Math.sin(world.time*15+o.id+(i===0||i===3?0:Math.PI))*.58);if(p.tail)p.tail.rotation.y=Math.sin(world.time*9)*.22;}
      p.root.scaling.setAll(o.remaining<.5?Math.max(.05,o.remaining*2):Math.min(1,.6+o.age*5));
    }
    world.boxes.forEach((box,i)=>{const root=boxes[i];root.setEnabled(box.readyIn===0);root.position.set(box.x,1.08+Math.sin(world.time*2+i)*.16,box.z);root.rotation.y=world.time*.7+i;});
    rings.forEach((ring,i)=>{ring.setEnabled(world.immune[i]>0);ring.position.set(karts[i].x,.12+karts[i].height,karts[i].z);ring.visibility=.5+.5*Math.sin(world.time*20);});
    for(const event of world.events)if(event.kart===0){paper.emitter=new Vector3(karts[0].x,1,karts[0].z);paper.manualEmitCount=event.kind==='hit'?35:12;}
    for(const event of world.events)if(event.kind==='hit'&&event.owner===0&&event.item!=='trap'){
      const kart=karts[event.kart];dogPuff.emitter=new Vector3(kart.x,.5+kart.height,kart.z);dogPuff.manualEmitCount=32;
    }
  };
}
