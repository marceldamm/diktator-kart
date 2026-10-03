// Purpose-built local Chrome checks and real in-game evidence.
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const targets=await(await fetch('http://127.0.0.1:9223/json')).json();
const target=targets.find(t=>t.type==='page'&&t.url?.startsWith('http://127.0.0.1:4173/'));
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
const shot=async name=>{await delay(600);const r=await send('Page.captureScreenshot',{format:'png'});const version=process.env.EVIDENCE_SUFFIX??'-v2';await writeFile(`docs/evidence/${name}${version}.png`,Buffer.from(r.data,'base64'));};
const load=async(query='')=>{await send('Page.navigate',{url:`http://127.0.0.1:4173/${query}`});for(let i=0;i<120;i++){await delay(250);const status=await evaluate(`document.querySelector('#status').textContent`);if(status==='Testszene läuft')return;if(status==='Startfehler')throw Error(await evaluate(`document.querySelector('#message').textContent`));}throw Error('Start timeout');};
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride',{width:1600,height:1000,deviceScaleFactor:1,mobile:false});
try{
  const mode=process.argv[2]||'capture';
  if(mode==='inspect'){
    console.log(await evaluate(`JSON.stringify(window.__DK.scene?.lights.map(l=>({name:l.name,intensity:l.intensity,enabled:l.isEnabled(),shadow:l.getShadowGenerator()?.getShadowMap()?.renderList?.length,min:l.shadowMinZ,max:l.shadowMaxZ,left:l.orthoLeft,right:l.orthoRight,shadowMatrix:l.getShadowGenerator()?.getTransformMatrix()?.asArray()})))`));
    console.log(await evaluate(`JSON.stringify({status:document.querySelector('#status').textContent,message:document.querySelector('#message').textContent,debug:document.querySelector('#debug').textContent})`));
    console.log(await evaluate(`JSON.stringify({kart:window.__DK.kart,camera:window.__DK.scene?.activeCamera?.position,handed:window.__DK.scene?.useRightHandedSystem,meshes:window.__DK.scene?.meshes.filter(m=>/441|Panoramic|Park and|Sculpted|Petrol|__root/.test(m.name)).map(m=>({name:m.name,enabled:m.isEnabled(),pos:m.position,scale:m.scaling,quat:m.rotationQuaternion,normal:m.getVerticesData('normal')?.slice(0,6),texture:m.material?.emissiveTexture?.isReady(),bounds:m.getBoundingInfo().boundingBox.minimumWorld.toString()+' / '+m.getBoundingInfo().boundingBox.maximumWorld.toString()}))})`));
    await shot('slice-first-inspection');
  }else{
    await load();await delay(2000);
    await shot('slice-main-menu');await evaluate(`document.querySelector('#menu-practice').click()`);await delay(300);
    await shot('slice-stadium-near');
    await tap('v','KeyV',86);assert.equal(await evaluate(`document.body.classList.contains('photo-mode')`),true);await shot('slice-hero-photo');await tap('v','KeyV',86);
    await tap('c','KeyC',67);assert.equal(await evaluate(`document.querySelector('#camera-mode').textContent`),'Verfolger fern');await shot('slice-stadium-far');
    await tap('c','KeyC',67);assert.equal(await evaluate(`document.querySelector('#camera-mode').textContent`),'Fahrerperspektive');await shot('slice-stadium-cockpit');
    await tap('c','KeyC',67);
    await evaluate(`document.querySelector('#race-start').click()`);await delay(4200);
    await key('keyDown','w','KeyW',87);await delay(1200);await key('keyUp','w','KeyW',87);
    assert.ok(parseInt(await evaluate(`document.querySelector('#speed').textContent`))>10,'Driving failed');
    await evaluate(`document.querySelector('#pause').click()`);assert.equal(await evaluate(`document.querySelector('#status').textContent`),'Pausiert');
    await evaluate(`document.querySelector('#pause').click()`);
    await evaluate(`document.querySelector('#race-start').click()`);await delay(500);
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
