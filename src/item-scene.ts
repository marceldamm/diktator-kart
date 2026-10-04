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
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import type {Mesh} from '@babylonjs/core/Meshes/mesh';
import type {ProjectileStyle} from './cast';

/** Small runtime-built character projectiles (original simple geometry, no insignia). Forward is +Z. */
function buildProjectile(scene:Scene,style:Exclude<ProjectileStyle,'dog'>,name:string):TransformNode{
  const root=new TransformNode(name,scene);
  const mat=(id:string,hex:string,metal=0,rough=.6)=>{const key=`Projectile ${id}`;const found=scene.getMaterialByName(key);if(found)return found;const m=new PBRMaterial(key,scene);m.albedoColor=Color3.FromHexString(hex).toLinearSpace();m.metallic=metal;m.roughness=rough;return m;};
  const add=(mesh:Mesh,m:ReturnType<typeof mat>,x=0,y=0,z=0)=>{mesh.material=m;mesh.parent=root;mesh.position.set(x,y,z);return mesh;};
  if(style==='tractor'){ // Stalin: five-year-plan tractor
    add(MeshBuilder.CreateBox(name+' body',{width:.55,height:.4,depth:.9},scene),mat('tractor red','#8e2a22',.2,.45),0,.45,0);
    add(MeshBuilder.CreateBox(name+' cab',{width:.5,height:.42,depth:.38},scene),mat('tractor red','#8e2a22',.2,.45),0,.82,-.2);
    add(MeshBuilder.CreateCylinder(name+' stack',{diameter:.08,height:.4},scene),mat('steel','#3a3d40',.8,.35),.12,.85,.25);
    for(const [x,z,d] of [[-.36,-.28,.62],[.36,-.28,.62],[-.33,.32,.36],[.33,.32,.36]] as const){const w=add(MeshBuilder.CreateCylinder(name+' wheel',{diameter:d,height:.14,tessellation:14},scene),mat('tyre','#1b1c1e',0,.9),x,d/2,z);w.rotation.z=Math.PI/2;}
  } else if(style==='megaphone'){ // Mussolini: balcony megaphone
    const horn=add(MeshBuilder.CreateCylinder(name+' horn',{diameterTop:.62,diameterBottom:.14,height:.85,tessellation:20},scene),mat('brass','#b98a3e',.85,.3));horn.rotation.x=Math.PI/2;
    const grip=add(MeshBuilder.CreateBox(name+' grip',{width:.1,height:.32,depth:.12},scene),mat('black','#16181a',0,.5),0,-.2,-.25);grip.rotation.x=.2;
  } else if(style==='book'){ // Mao: little red rulebook, fluttering open
    add(MeshBuilder.CreateBox(name+' cover L',{width:.34,height:.04,depth:.48},scene),mat('book red','#b3231f',0,.55),-.18,0,0).rotation.z=.35;
    add(MeshBuilder.CreateBox(name+' cover R',{width:.34,height:.04,depth:.48},scene),mat('book red','#b3231f',0,.55),.18,0,0).rotation.z=-.35;
    add(MeshBuilder.CreateBox(name+' pages',{width:.6,height:.06,depth:.44},scene),mat('paper','#efe6cf',0,.8),0,.04,0);
  } else if(style==='rocket'){ // Kim Jong-un: small parade rocket
    const body=add(MeshBuilder.CreateCylinder(name+' body',{diameter:.26,height:.95,tessellation:16},scene),mat('rocket cream','#e9e1cd',.3,.4));body.rotation.x=Math.PI/2;
    const nose=add(MeshBuilder.CreateCylinder(name+' nose',{diameterTop:0,diameterBottom:.26,height:.32,tessellation:16},scene),mat('rocket blue','#263f70',.3,.4),0,0,.63);nose.rotation.x=Math.PI/2;
    for(let k=0;k<4;k++){const a=k*Math.PI/2;const fin=add(MeshBuilder.CreateBox(name+' fin',{width:.03,height:.26,depth:.26},scene),mat('rocket blue','#263f70',.3,.4),Math.cos(a)*.15,Math.sin(a)*.15,-.38);fin.rotation.z=a+Math.PI/2;}
    const glow=new StandardMaterial(name+' exhaust',scene);glow.emissiveColor=Color3.FromHexString('#ffb347');glow.disableLighting=true;
    const flame=MeshBuilder.CreateSphere(name+' flame',{diameter:.18,segments:6},scene);flame.material=glow;flame.parent=root;flame.position.z=-.55;flame.scaling.z=2.2;
  } else { // Castro: the catalogued 'aufklappender Aktenkoffer', flapping open in flight
    add(MeshBuilder.CreateBox(name+' case',{width:.62,height:.16,depth:.44},scene),mat('briefcase leather','#5a3a22',0,.55));
    const lid=add(MeshBuilder.CreateBox(name+' lid',{width:.62,height:.06,depth:.44},scene),mat('briefcase leather','#5a3a22',0,.55),0,.1,0);lid.setPivotPoint(new Vector3(0,0,-.22));
    add(MeshBuilder.CreateBox(name+' papers',{width:.56,height:.05,depth:.38},scene),mat('paper','#efe6cf',0,.8),0,.07,0);
    add(MeshBuilder.CreateTorus(name+' handle',{diameter:.16,thickness:.025,tessellation:12},scene),mat('briefcase brass','#c9a24a',.8,.3),0,.02,.25).rotation.x=Math.PI/2;
  }
  return root;
}

/** Fixed pools: no mesh allocation during racing, all resources belong to the scene. */
export async function addItems(scene:Scene,shadow:ShadowGenerator,count:number,styleOf:(owner:number)=>ProjectileStyle) {
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
  type Look=ProjectileStyle|'neutral';
  const pools=kinds.flatMap(kind=>Array.from({length:6},(_,i)=>({kind,id:-1,look:'neutral' as Look,dog:false,root:copy(kind,`item ${kind} ${i}`),legs:[] as TransformNode[],tail:undefined as TransformNode|undefined})));
  for(const look of ['tractor','megaphone','book','rocket','briefcase'] as const)for(const kind of ['direct','homing'] as const)for(let i=0;i<4;i++){
    const root=buildProjectile(scene,look,`${look} ${kind} ${i}`);
    for(const mesh of root.getChildMeshes()){mesh.isPickable=false;mesh.receiveShadows=true;shadow.addShadowCaster(mesh);}
    root.setEnabled(false);pools.push({kind,id:-1,look,dog:false,root,legs:[],tail:undefined});
  }
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
    root.setEnabled(false);pools.push({kind,id:-1,look:'dog',dog:true,root,legs,tail});
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
    // Shields: the held item trails 1.7 m behind its kart (pseudo objects with stable negative ids).
    const shields=(world.shield??[]).flatMap((on,i)=>on&&world.slots[i]&&karts[i]?[{id:-100-i,kind:world.slots[i]!,owner:i,x:karts[i].x-Math.sin(karts[i].heading)*1.7,z:karts[i].z-Math.cos(karts[i].heading)*1.7,heading:karts[i].heading,age:1,remaining:1,target:null}]:[]);
    const visible=[...world.objects,...shields];
    for(const p of pools) if(!visible.some(o=>o.id===p.id)){p.id=-1;p.root.setEnabled(false);}
    for(const o of visible) {
      // Each driver throws their own character projectile; traps stay the shared neutral stamp.
      const look:Look=o.kind==='trap'?'neutral':styleOf(o.owner);
      const p=pools.find(p=>p.id===o.id)??pools.find(p=>p.id===-1&&p.kind===o.kind&&p.look===look)??pools.find(p=>p.id===-1&&p.kind===o.kind&&p.look==='neutral');if(!p)continue;
      const grounded=p.dog||p.look==='tractor';
      p.id=o.id;p.root.setEnabled(true);p.root.position.set(o.x,grounded?.045+Math.abs(Math.sin(world.time*15+o.id))*(p.dog?.07:.035):o.kind==='trap'?.03:.95+Math.sin(world.time*13+o.id)*.06,o.z);p.root.rotation.y=o.heading;
      p.root.rotation.z=p.look==='rocket'?world.time*6:p.look==='megaphone'?Math.sin(world.time*9+o.id)*.2:0;
      if(p.look==='briefcase'){const lid=p.root.getChildMeshes()[1];if(lid)lid.rotation.x=-.2-.9*Math.abs(Math.sin(world.time*7+o.id));}
      if(p.look==='book')p.root.getChildMeshes().forEach((m,k)=>{if(k<2)m.rotation.z=(k?-1:1)*(.25+.35*Math.abs(Math.sin(world.time*11+o.id)));});
      if(p.dog){p.legs.forEach((leg,i)=>leg.rotation.x=Math.sin(world.time*15+o.id+(i===0||i===3?0:Math.PI))*.58);if(p.tail)p.tail.rotation.y=Math.sin(world.time*9)*.22;}
      p.root.scaling.setAll(o.remaining<.5?Math.max(.05,o.remaining*2):Math.min(1,.6+o.age*5));
    }
    world.boxes.forEach((box,i)=>{const root=boxes[i];root.setEnabled(box.readyIn===0);root.position.set(box.x,1.08+Math.sin(world.time*2+i)*.16,box.z);root.rotation.y=world.time*.7+i;});
    rings.forEach((ring,i)=>{if(!karts[i]){ring.setEnabled(false);return;}ring.setEnabled(world.immune[i]>0);ring.position.set(karts[i].x,.12+karts[i].height,karts[i].z);ring.visibility=.5+.5*Math.sin(world.time*20);});
    for(const event of world.events)if(event.kart===0){paper.emitter=new Vector3(karts[0].x,1,karts[0].z);paper.manualEmitCount=event.kind==='hit'?35:12;}
    for(const event of world.events)if(event.kind==='hit'&&event.item!=='trap'&&(event.owner===0||event.kart===0)){
      const kart=karts[event.kart];dogPuff.emitter=new Vector3(kart.x,.5+kart.height,kart.z);dogPuff.manualEmitCount=32;
    }
  };
}
