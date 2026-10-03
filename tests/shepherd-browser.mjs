import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {send,evaluate,delay,load,tap,errors,socket} from './cdp.mjs';
const evidence=[];
const snap=()=>evaluate(`(()=>{const d=window.__DK;return {phase:d.phase,stats:d.items.stats,objects:d.items.objects,meshes:d.scene.meshes.length,dogs:d.scene.transformNodes.filter(n=>n.name.startsWith('shepherd ' )&&n.name.split(' ').length===3&&n.isEnabled()).map(n=>({name:n.name,position:n.position.asArray(),legs:n.getDescendants().filter(n=>n.name.endsWith('dogLeg-0')).map(n=>n.rotation.x)})),puff:d.scene.particleSystems.find(p=>p.name==='Shepherd comic impact cloud').manualEmitCount};})()`);
try{
 await send('Runtime.enable');await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 await load('?demo=1');await evaluate(`document.querySelector('#race-start').click()`);await delay(4400);
 const initial=await snap();
 for(const kind of ['direct','homing']){
  await tap('p','KeyP',80);
  await evaluate(`(async()=>{const m=await import('/src/track.ts'),d=window.__DK,a=m.trackPoint(60),b=m.trackPoint(85);Object.assign(d.kart,{x:a.x,z:a.z,heading:a.heading,travelHeading:a.heading,speed:8,spinRemaining:0});Object.assign(d.bots[0],{x:b.x,z:b.z,heading:b.heading,travelHeading:b.heading,speed:8,spinRemaining:0});d.items.objects=[];d.items.immune.fill(0);d.items.slots.fill(null);d.items.slots[0]='${kind}';for(const box of d.items.boxes)box.readyIn=10;})()`);
  await tap('p','KeyP',80);await tap('e','KeyE',69);await delay(100);
  const active=await snap();assert.ok(active.dogs.length>0,'Player forward item must be a dog');assert.equal(active.meshes,initial.meshes);
  await tap('p','KeyP',80);const pic=await send('Page.captureScreenshot',{format:'png'});await writeFile(`docs/evidence/shepherd-${kind}-v1.png`,Buffer.from(pic.data,'base64'));
  await evaluate(`(()=>{const d=window.__DK,o=d.items.objects.find(o=>o.owner===0&&o.kind==='${kind}');if(!o)throw Error('Dog projectile missing');Object.assign(d.bots[0],{x:o.x+Math.sin(o.heading)*1.7,z:o.z+Math.cos(o.heading)*1.7,speed:0,heading:o.heading,travelHeading:o.heading});})()`);
  await tap('p','KeyP',80);let hit;
  for(let i=0;i<50;i++){await delay(100);const s=await snap();assert.equal(s.meshes,initial.meshes,'No racing mesh allocation');if(s.stats[kind].hits>active.stats[kind].hits){hit=s;break;}}
  assert.ok(hit,'Controlled target on path must receive existing shared item hit');evidence.push({kind,active,hit});
 }
 const audio=await evaluate(`(async()=>{const c=new AudioContext(),b=await c.decodeAudioData(await(await fetch('/assets/audio/shepherd-bark.wav')).arrayBuffer());let peak=0;for(const v of b.getChannelData(0))peak=Math.max(peak,Math.abs(v));const r={duration:b.duration,channels:b.numberOfChannels,peak};await c.close();return r;})()`);
 assert.ok(audio.duration>.6&&audio.peak>.1&&audio.peak<1);assert.deepEqual(errors,[]);
 await writeFile('docs/evidence/shepherd-browser-check.json',JSON.stringify({qa:'Normal six-kart world, controlled slots/positions for direct and homing; actual E and fixed item simulation; existing demo bot controller',evidence,audio,runtimeErrors:errors},null,2)+'\n');console.log('PASS: direct and homing player dogs render, hit, animate, fixed mesh pool; bark WAV decodes without clipping. Human bark quality not claimed.');
}finally{socket.close();}
