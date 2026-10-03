import type {Scene} from '@babylonjs/core/scene';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {DynamicTexture} from '@babylonjs/core/Materials/Textures/dynamicTexture';
import type {ShadowGenerator} from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import {trackPoint,TRACK} from './track';

/** Original period-inspired street furniture; bird is independent, no regime insignia. */
export function addPeriodDetails(scene:Scene,shadow:ShadowGenerator):void{
 const stone=new PBRMaterial('Period pale weathered stone',scene);stone.albedoColor=Color3.FromHexString('#b6aa91');stone.roughness=.93;
 const metal=new PBRMaterial('Period dark painted iron',scene);metal.albedoColor=Color3.FromHexString('#273d37');metal.metallic=.4;metal.roughness=.68;
 const brass=new PBRMaterial('Period tarnished brass',scene);brass.albedoColor=Color3.FromHexString('#ad8b49');brass.metallic=.68;brass.roughness=.52;
 const wood=new PBRMaterial('Period oiled wooden bench slats',scene);wood.albedoColor=Color3.FromHexString('#765332');wood.roughness=.84;
 const bodies:Mesh[]=[],trim:Mesh[]=[],iron:Mesh[]=[],posters:Mesh[]=[],slats:Mesh[]=[];
 const take=(m:Mesh,parent:TransformNode,group:Mesh[],material:PBRMaterial)=>{m.parent=parent;m.material=material;m.isPickable=false;group.push(m);return m;};
 const cylinder=(name:string,x:number,y:number,z:number,r:number,height:number,parent:TransformNode,group:Mesh[],material:PBRMaterial,r2=r)=>{const m=take(MeshBuilder.CreateCylinder(name,{diameterBottom:r*2,diameterTop:r2*2,height,tessellation:20},scene),parent,group,material);m.position.set(x,y,z);return m;};
 const texture=new DynamicTexture('Period satirical bill posters',{width:1024,height:512},scene,false),c=texture.getContext() as CanvasRenderingContext2D;
 c.fillStyle='#ddd1af';c.fillRect(0,0,1024,512);
 const panels=[['BERLINER','ABENDBLATT','GRÖSSTER FAHRER?','Laut eigener Statistik.'],['STADION','DER EITELKEIT','GROSSE WORTE.','Kleiner Wendekreis.'],['AMT FÜR','VORFAHRT','WIDERSPRUCH','Heute wieder geschlossen.'],['SONDER','AUSGABE','PLATZ EINS','Wird nicht per Dekret vergeben.']];
 panels.forEach((p,i)=>{const x=i*256;c.fillStyle=['#183d39','#75262b','#3d392f','#263949'][i];c.fillRect(x+9,12,238,12);c.textAlign='center';c.fillStyle='#302c25';c.font='bold 27px Georgia';c.fillText(p[0],x+128,70);c.fillText(p[1],x+128,104);c.strokeStyle='#857758';c.strokeRect(x+18,132,220,178);c.font='bold 20px Georgia';c.fillText(p[2],x+128,360);c.font='15px Georgia';c.fillText(p[3],x+128,394);c.font='italic 17px Georgia';c.fillText('Nicht alles glauben.',x+128,449);});
 // Original printed vignettes: a racing wheel and a bureaucratic stamp, not regime emblems.
 panels.forEach((_,i)=>{const x=i*256+128;c.strokeStyle=['#183d39','#75262b','#3d392f','#263949'][i];c.lineWidth=5;c.beginPath();c.arc(x,220,61,0,Math.PI*2);c.stroke();c.lineWidth=2;c.beginPath();c.arc(x,220,48,0,Math.PI*2);c.stroke();c.font='bold 31px Georgia';c.fillStyle=c.strokeStyle;c.fillText(i===2?'AMT':i===3?'1.':'DK',x,231);c.font='11px Georgia';c.fillText(i===0?'SELBST ERNANNT':'NUR MIT STEMPEL',x,293);});
 texture.uScale=-1;texture.uOffset=1;texture.update();const paper=new PBRMaterial('Period satirical printed paper',scene);paper.albedoTexture=texture;paper.roughness=.96;
 for(const [progress,lane] of [[68,-TRACK.halfWidth-3.2],[265,TRACK.halfWidth+3.5],[330,-TRACK.halfWidth-4],[475,TRACK.halfWidth+4]]){
  const p=trackPoint(progress,lane),root=new TransformNode('Period advertising column '+progress,scene);root.position.set(p.x,0,p.z);root.rotation.y=p.heading;
  cylinder('Column plinth',0,.14,0,.79,.28,root,bodies,stone);cylinder('Column drum',0,1.57,0,.58,2.64,root,bodies,stone);
  cylinder('Column base rim',0,.32,0,.66,.16,root,iron,metal);cylinder('Column cornice',0,2.9,0,.76,.14,root,iron,metal);
  cylinder('Column domed roof',0,3.12,0,.76,.34,root,iron,metal,.39);cylinder('Column finial',0,3.4,0,.055,.26,root,trim,brass);
  const wrap=take(MeshBuilder.CreateCylinder('Period poster sleeve',{diameter:1.17,height:2.28,tessellation:32,hasRings:false},scene),root,posters,paper);wrap.position.y=1.57;
 }
 // Small boulevard traffic islands: enamel tram-stop signs and wrought-iron benches.
 for(const [progress,lane] of [[95,-9.8],[295,9.7]]){
  const p=trackPoint(progress,lane),root=new TransformNode('Period tram stop '+progress,scene);root.position.set(p.x,0,p.z);root.rotation.y=p.heading;
  cylinder('Stop sign post',0,1.7,0,.045,3.4,root,iron,metal);
  const badge=take(MeshBuilder.CreateCylinder('Tram stop enamel disc',{diameter:.68,height:.04,tessellation:32},scene),root,trim,brass);badge.position.y=3.05;badge.rotation.x=Math.PI/2;
  for(const y of [.35,.58])for(const x of [-1.2,1.2]){const leg=take(MeshBuilder.CreateBox('Bench iron leg',{width:.08,height:.5,depth:.48},scene),root,iron,metal);leg.position.set(x,y/2,-1.05);}
  for(let i=0;i<4;i++){const seat=take(MeshBuilder.CreateBox('Bench seat slat',{width:2.8,height:.06,depth:.095},scene),root,slats,wood);seat.position.set(0,.56,-1.22+i*.11);}
  for(let i=0;i<3;i++){const back=take(MeshBuilder.CreateBox('Bench back slat',{width:2.8,height:.09,depth:.06},scene),root,slats,wood);back.position.set(0,.76+i*.13,-1.28);}
 }
 // An original architectural eagle watches over a satirical civilian administrative entrance.
 const p=trackPoint(310,TRACK.halfWidth+1.3),eagle=new TransformNode('Independent architectural eagle',scene);eagle.position.set(p.x,3.25,p.z);eagle.rotation.y=p.heading;
 cylinder('Bird supporting stone column',0,-1.875,0,.4,2.75,eagle,bodies,stone);
 cylinder('Bird stone pedestal',0,-.3,0,.74,.6,eagle,bodies,stone);
 const body=take(MeshBuilder.CreateSphere('Eagle body',{diameter:1,segments:16},scene),eagle,trim,brass);body.scaling.set(.26,.53,.25);
 const head=take(MeshBuilder.CreateSphere('Eagle head',{diameter:.45,segments:12},scene),eagle,trim,brass);head.position.set(0,.59,.06);
 const beak=take(MeshBuilder.CreateCylinder('Eagle hooked beak',{diameterBottom:.17,diameterTop:0,height:.28,tessellation:8},scene),eagle,trim,brass);beak.rotation.x=-Math.PI/2;beak.position.set(0,.54,-.2);
 for(const side of [-1,1]){
  for(let i=0;i<7;i++){
   const feather=take(MeshBuilder.CreateCapsule('Eagle individual feather',{radius:.065,height:1.12-i*.065,tessellation:8,subdivisions:1},scene),eagle,trim,brass);
   feather.rotation.z=side*(.9+i*.11);feather.position.set(side*(.35+i*.13),.23+i*.095,0);
  }
  const foot=take(MeshBuilder.CreateBox('Eagle talon',{width:.15,height:.08,depth:.27},scene),eagle,trim,brass);foot.position.set(side*.15,-.47,-.045);
 }
 for(const [group,label,material] of [[bodies,'Period stone furniture',stone],[iron,'Period painted iron furniture',metal],[trim,'Period brass details and independent eagle',brass],[posters,'Period satirical posters',paper],[slats,'Period wooden benches',wood]] as const){
  for(const mesh of group)mesh.computeWorldMatrix(true);
  const merged=Mesh.MergeMeshes([...group],true,true,undefined,false,false);if(merged){merged.name=label;merged.material=material;merged.receiveShadows=true;merged.isPickable=false;merged.freezeWorldMatrix();if(group!==posters)shadow.addShadowCaster(merged);}
 }
}
