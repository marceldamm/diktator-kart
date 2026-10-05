// Purpose-built local Chrome checks and real in-game evidence. Connect only to a visible Chrome window (no headless/minimized game tests).
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
const tap=async(k,c,v)=>{await key('keyDown',k,c,v);await key('keyUp',k,c,v);await delay(150);};
const shot=async name=>{await delay(600);const r=await send('Page.captureScreenshot',{format:'png'});const version=process.env.EVIDENCE_SUFFIX??'-v2';await writeFile(`docs/evidence/${name}${version}.png`,Buffer.from(r.data,'base64'));};
const load=async(query='')=>{await send('Page.navigate',{url:`${base}${query}`});for(let i=0;i<120;i++){await delay(250);const status=await evaluate(`document.querySelector('#status').textContent`);if(status==='Testszene läuft')return;if(status==='Startfehler')throw Error(await evaluate(`document.querySelector('#message').textContent`));}throw Error('Start timeout');};
const startGrandPrix=async()=>{await evaluate(`document.querySelector('#menu-race').click()`);for(let i=0;i<80;i++){if(await evaluate(`document.body.classList.contains('select-open')`))break;await delay(100);}if(!await evaluate(`document.body.classList.contains('select-open')`))throw Error('Grand Prix did not open driver selection');await evaluate(`document.querySelector('#driver-go').click()`);for(let i=0;i<100;i++){if(await evaluate(`window.__DK.phase==='race'`))return;await delay(100);}throw Error(`Grand Prix did not start (phase: ${await evaluate(`window.__DK.phase`)})`);};
const setQuality=async(label)=>{for(let i=0;i<3;i++){const current=await evaluate(`document.querySelector('#quality-toggle').textContent`);if(current===label)return;await evaluate(`document.querySelector('#quality-toggle').click()`);await delay(250);}throw Error(`Could not select ${label}; current setting: ${await evaluate(`document.querySelector('#quality-toggle').textContent`)}`);};

export {send,delay,evaluate,key,tap,shot,load,startGrandPrix,setQuality,errors,socket};
