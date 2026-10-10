// Purpose-built local Chrome checks and real in-game evidence.
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const targets=await(await fetch(`http://127.0.0.1:${process.env.CDP_PORT??9223}/json`)).json();
const base=process.env.SLICE_URL??'http://127.0.0.1:4173/';
const target=targets.find(t=>t.type==='page'&&(t.url?.startsWith('http://127.0.0.1:')||t.url==='about:blank'));
assert.ok(target,'Isolated Chrome is missing');
const socket=new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
let id=0;const pending=new Map(),errors=[];
socket.addEventListener('message',event=>{const r=JSON.parse(event.data);if(r.method==='Runtime.exceptionThrown')errors.push(r.params.exceptionDetails.text);if(!r.id)return;const p=pending.get(r.id);pending.delete(r.id);if(r.error)p.reject(Error(r.error.message));else p.resolve(r.result);});
const send=(method,params={})=>new Promise((resolve,reject)=>{const i=++id;pending.set(i,{resolve,reject});socket.send(JSON.stringify({id:i,method,params}));});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const key=async(type,key,code,virtual)=>send('Input.dispatchKeyEvent',{type,key,code,windowsVirtualKeyCode:virtual});
const tap=async(k,c,v)=>{await key('keyDown',k,c,v);await key('keyUp',k,c,v);await delay(400);};
const photoMode=async expected=>{for(let i=0;i<20;i++){if(await evaluate(`document.body.classList.contains('photo-mode')`)===expected)return;await delay(150);}assert.equal(await evaluate(`document.body.classList.contains('photo-mode')`),expected,'Photo-mode key transition completes');};
const cameraMode=async expected=>{for(let i=0;i<30;i++){if(await evaluate(`document.querySelector('#camera-mode').textContent`)===expected)return;await delay(150);}assert.equal(await evaluate(`document.querySelector('#camera-mode').textContent`),expected,'Camera-mode key transition completes');};
const racePhase=async expected=>{for(let i=0;i<80;i++){if(await evaluate(`window.__DK.phase`)===expected)return;await delay(500);}const state=await evaluate(`JSON.stringify({phase:window.__DK.phase,state:window.__DK.state,countdown:document.querySelector('#countdown').textContent,menu:window.__DK.menu,selecting:document.body.classList.contains('select-open')})`);assert.equal(JSON.parse(state).phase,expected,`Race phase transition completes: ${state}`);};
const shot=async name=>{await delay(600);const r=await send('Page.captureScreenshot',{format:'png'});const version=process.env.EVIDENCE_SUFFIX??'-v2';await writeFile(`docs/evidence/${name}${version}.png`,Buffer.from(r.data,'base64'));};
const load=async(query='')=>{await send('Page.navigate',{url:`${base}${query}`});for(let i=0;i<120;i++){await delay(250);const status=await evaluate(`document.querySelector('#status').textContent`);if(status==='Testszene läuft')return;if(status==='Startfehler')throw Error(await evaluate(`document.querySelector('#message').textContent`));}throw Error('Start timeout');};
await send('Runtime.enable');
await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});
await send('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});
try{
  const mode=process.argv[2]||'capture';
  if(mode==='inspect-driver'){
    await load();await delay(1400);await shot('slice-main-menu');
    await evaluate(`document.querySelector('#race-start').click()`);await delay(300);
    assert.equal(await evaluate(`document.body.classList.contains('track-select-open')`),true,'Race start opens track selection');
    await evaluate(`document.querySelector('#track-go').click()`);await delay(300);
    assert.equal(await evaluate(`document.body.classList.contains('select-open')`),true,'Track selection continues to driver selection');
    assert.equal(await evaluate(`document.querySelector('#driver-go').disabled`),false,'Pre-rendered portraits: race start is ready at once');
    await evaluate(`document.querySelectorAll('.driver-card')[1].click()`);await delay(350);
    for(let i=0;i<60;i++){if(await evaluate(`document.querySelectorAll('.driver-card img').length===6`))break;await delay(500);}
    assert.equal(await evaluate(`document.querySelectorAll('.driver-card img').length`),6,'All six pre-rendered head portraits are shown');
    const selected=await evaluate(`JSON.stringify({name:document.querySelector('#driver-detail h3')?.textContent,card:document.querySelector('.driver-card.selected strong')?.textContent})`);
    assert.ok(JSON.parse(selected).card?.includes('Stalin'),`Stalin portrait selected: ${selected}`);
    await shot('slice-stalin-driver-selection');console.log(`STALIN_DRIVER_SELECTION ${selected}`);
  }else if(mode==='inspect'){
    console.log(await evaluate(`JSON.stringify(window.__DK.scene?.lights.map(l=>({name:l.name,intensity:l.intensity,enabled:l.isEnabled(),shadow:l.getShadowGenerator()?.getShadowMap()?.renderList?.length,min:l.shadowMinZ,max:l.shadowMaxZ,left:l.orthoLeft,right:l.orthoRight,shadowMatrix:l.getShadowGenerator()?.getTransformMatrix()?.asArray()})))`));
    console.log(await evaluate(`JSON.stringify({status:document.querySelector('#status').textContent,message:document.querySelector('#message').textContent,debug:document.querySelector('#debug').textContent})`));
    console.log(await evaluate(`JSON.stringify({kart:window.__DK.kart,camera:window.__DK.scene?.activeCamera?.position,handed:window.__DK.scene?.useRightHandedSystem,meshes:window.__DK.scene?.meshes.filter(m=>/441|Panoramic|Park and|Sculpted|Petrol|__root/.test(m.name)).map(m=>({name:m.name,enabled:m.isEnabled(),pos:m.position,scale:m.scaling,quat:m.rotationQuaternion,normal:m.getVerticesData('normal')?.slice(0,6),texture:m.material?.emissiveTexture?.isReady(),bounds:m.getBoundingInfo().boundingBox.minimumWorld.toString()+' / '+m.getBoundingInfo().boundingBox.maximumWorld.toString()}))})`));
    await shot('slice-first-inspection');
  }else{
    await load();await delay(2000);
    await shot('slice-main-menu');await evaluate(`document.querySelector('#menu-practice').click()`);await delay(300);
    await shot('slice-stadium-near');
    if(!await evaluate(`document.body.classList.contains('photo-mode')`)){await tap('v','KeyV',86);await photoMode(true);}
    await shot('slice-hero-photo');await tap('v','KeyV',86);await photoMode(false);
    await tap('c','KeyC',67);await cameraMode('Verfolger fern');await shot('slice-stadium-far');
    await tap('c','KeyC',67);await cameraMode('Fahrerperspektive');await shot('slice-stadium-cockpit');
    await tap('c','KeyC',67);
    await evaluate(`document.querySelector('#race-start').click()`);await delay(300);
    assert.equal(await evaluate(`document.body.classList.contains('track-select-open')`),true,'Race start opens track selection');
    await evaluate(`document.querySelector('#track-go').click()`);await delay(300);
    assert.equal(await evaluate(`document.body.classList.contains('select-open')`),true,'Track selection continues to driver selection');
    for(let i=0;i<120&&await evaluate(`document.querySelector('#driver-go').disabled`);i++)await delay(100);
    assert.equal(await evaluate(`document.querySelector('#driver-go').disabled`),false,'Race start enables after driver portraits');
    await evaluate(`document.querySelector('#driver-go').click()`);await racePhase('race');
    await evaluate(`(async()=>{const {trackPoint,TRACK}=await import('/src/track.ts');const p=trackPoint(TRACK.start+24,0);Object.assign(window.__DK.kart,{x:p.x,z:p.z,heading:p.heading,travelHeading:p.heading,speed:0,yawRate:0,steer:0});})()`);
    await key('keyDown','w','KeyW',87);await delay(1800);await key('keyUp','w','KeyW',87);await delay(400);
    const driven=await evaluate(`JSON.stringify({speed:window.__DK.kart.speed,phase:window.__DK.phase,debug:document.querySelector('#debug').textContent})`);
    console.log(`Driven state: ${driven}`);assert.ok(JSON.parse(driven).speed>3,'Driving failed');
    await evaluate(`document.querySelector('#pause').click()`);assert.equal(await evaluate(`document.querySelector('#status').textContent`),'Pausiert');
    await evaluate(`document.querySelector('#pause').click()`);
    await key('keyDown','t','KeyT',84);await key('keyUp','t','KeyT',84);await delay(500);
    await racePhase('countdown');
    assert.match(await evaluate(`document.querySelector('#countdown').textContent`),/[123]/);
    await shot('slice-race-countdown');
    await delay(3500);assert.equal(await evaluate(`document.querySelector('#countdown').hidden`),true);
    await evaluate(`document.querySelector('#restart').click()`);
    for(let i=0;i<120;i++){await delay(250);if(await evaluate(`document.querySelector('#status').textContent`)!=='Lädt …')break;}
    assert.equal(await evaluate(`document.querySelector('#status').textContent`),'Testszene läuft');
    await load('?demo=1');await delay(14000);await shot('slice-boulevard-driving');
    await tap('F3','F3',114);await delay(1000);
    console.log(await evaluate(`document.querySelector('#debug').textContent`));
    await shot('slice-six-kart-diagnostics');
    assert.deepEqual(errors,[],'Browser exception');
    console.log('SLICE_BROWSER_PASS');
  }
}finally{socket.close();}
