// User input on the actual slice; no injected kart positions or physics state.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {send,delay,evaluate,key,tap,shot,load,errors,socket} from './cdp.mjs';
const samples={};
const kart=()=>evaluate(`({...window.__DK.kart})`);
try{
  await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:1600,height:1000,deviceScaleFactor:1,mobile:false});
  await load('?fleet=1');await evaluate(`document.querySelector('#menu-practice').click()`);await delay(1000);
  await key('keyDown','w','KeyW',87);await delay(850);await key('keyUp','w','KeyW',87);
  await key('keyDown','d','KeyD',68);await key('keyDown',' ','Space',32);await delay(180);
  samples.hop=await kart();assert.ok(samples.hop.height>.2);await tap('p','KeyP',80);await shot('slice-hop-feedback');await tap('p','KeyP',80);
  for(let i=0;i<36;i++){if(i%3===0)await key('keyDown','w','KeyW',87);if(i%3===1)await key('keyUp','w','KeyW',87);await delay(50);const s=await kart();if(s.driftCharge>=.7){samples.drift=s;break;}if(s.impactRemaining>0)throw Error('Boundary before charged drift');if(i===35)console.log('Drift diagnostic',s);}
  await key('keyUp','w','KeyW',87);
  assert.ok(samples.drift,'Charged drift failed');await tap('p','KeyP',80);await shot('slice-drift-feedback');await tap('c','KeyC',67);await tap('c','KeyC',67);assert.equal(await evaluate(`window.__DK.view`),'Fahrerperspektive');await shot('slice-drift-cockpit');await tap('p','KeyP',80);
  await key('keyUp',' ','Space',32);await key('keyUp','d','KeyD',68);await delay(70);
  samples.boost=await kart();assert.ok(samples.boost.turboRemaining>0);await tap('p','KeyP',80);await shot('slice-turbo-feedback');await tap('p','KeyP',80);
  await key('keyDown','w','KeyW',87);await key('keyDown','d','KeyD',68);
  for(let i=0;i<80;i++){await delay(25);const s=await kart();if(s.impactRemaining>0){samples.contact=s;break;}}
  assert.equal(samples.contact?.impactKind,'boundary');await key('keyUp','d','KeyD',68);await key('keyUp','w','KeyW',87);await tap('p','KeyP',80);await shot('slice-boundary-feedback');
  assert.deepEqual(errors,[]);await writeFile('docs/evidence/slice-feedback.json',JSON.stringify({date:new Date().toISOString(),method:'Actual keyboard inputs on one-kart stadium scene; freezes only for readable game screenshots; no injected physics state',samples,errors},null,2)+'\n');console.log('SLICE_HOP_DRIFT_TURBO_BOUNDARY_PASS');
}finally{await key('keyUp','w','KeyW',87);await key('keyUp','d','KeyD',68);await key('keyUp',' ','Space',32);socket.close();}
