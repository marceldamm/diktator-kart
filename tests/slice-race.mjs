// Real elapsed-time race, with normal fixed-step simulation and six participants.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {send,delay,evaluate,tap,shot,load,errors,socket} from './cdp.mjs';
const samples=[];
const snapshot=()=>evaluate(`(()=>{const d=window.__DK,s=d.scene,e=s.getEngine();return {phase:d.phase,progress:d.progress.map(p=>({...p})),speed:d.kart.speed,meshes:s.meshes.length,fps:e.getFps(),drawCalls:s.metadata.timings.drawCallsCounter.current,cpuFrameMs:s.metadata.timings.frameTimeCounter.current,gpuFrameMs:s.metadata.gpuTimings.gpuFrameTimeCounter.count?s.metadata.gpuTimings.gpuFrameTimeCounter.current/1000000:null,activeTriangles:s.getActiveIndices()/3,particles:s.particleSystems.reduce((n,p)=>n+p.getActiveCount(),0),camera:document.querySelector('#camera-mode').textContent,heap:performance.memory?.usedJSHeapSize};})()`);
const frames=()=>evaluate(`(async()=>{let last=await new Promise(requestAnimationFrame);const v=[];for(let i=0;i<300;i++){const n=await new Promise(requestAnimationFrame);v.push(n-last);last=n;}v.sort((a,b)=>a-b);return {p50:v[149],p95:v[284],p99:v[296],max:v[299],over33:v.filter(n=>n>33).length};})()`);
try {
  await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:1600,height:1000,deviceScaleFactor:1,mobile:false});
  await load('?demo=1');await evaluate(`document.querySelector('#race-start').click()`);
  const start=Date.now();let finished=false;
  for(let i=0;i<24;i++) {
    await delay(10000);const data=await snapshot();samples.push({elapsed:(Date.now()-start)/1000,...data});
    console.log(JSON.stringify({elapsed:samples.at(-1).elapsed,phase:data.phase,metres:data.progress[0].distance,fps:data.fps}));
    if(i===2)await shot('slice-race-midway');
    if(i===4){await tap('c','KeyC',67);await shot('slice-race-far');}
    if(i===6){await tap('c','KeyC',67);await shot('slice-race-cockpit');}
    if(i===8)await tap('c','KeyC',67);
    if(data.phase==='finished'){finished=true;break;}
  }
  assert.ok(finished,'Real browser race did not finish in four minutes');
  assert.equal(samples.at(-1).progress.length,6);assert.ok(samples.at(-1).progress[0].distance>=3*(240+64*Math.PI));
  assert.equal(await evaluate(`document.querySelector('#finish-card').hidden`),false);await shot('slice-race-finish');
  assert.equal(await evaluate(`document.querySelectorAll('#finish-results li').length`),6);
  assert.match(await evaluate(`document.querySelector('#finish-detail').textContent`),/Runden \d+\.\d{2} \/ \d+\.\d{2} \/ \d+\.\d{2} s/);
  assert.match(await evaluate(`document.querySelector('#finish-best').textContent`),/Demonstrationsfahrt/);
  const meshCount=samples.at(-1).meshes;
  await tap('Enter','Enter',13);assert.equal((await snapshot()).phase,'countdown');await delay(5000);
  assert.equal((await snapshot()).phase,'race');assert.equal((await snapshot()).meshes,meshCount);assert.equal(await evaluate(`document.querySelector('#finish-card').hidden`),true);
  const endurance=[];
  for(let camera=0;camera<3;camera++) {
    if(camera)await tap('c','KeyC',67);await delay(2000);endurance.push({quality:'Standard',...await snapshot(),...await frames()});
  }
  await evaluate(`document.querySelector('#quality-toggle').click()`);await delay(2000);endurance.push({quality:'Basis',...await snapshot(),...await frames()});
  await evaluate(`document.querySelector('#quality-toggle').click()`);
  assert.deepEqual(errors,[]);const result={date:new Date().toISOString(),method:'Real-time headless Chrome, demo controller through normal kart input, 3 laps; 300 rAF intervals per camera at 1600x1000',samples,endurance,errors};
  await writeFile('docs/evidence/slice-final-race-rtx.json',JSON.stringify(result,null,2)+'\n');console.log('FULL_RACE_AND_REMATCH_PASS');
} finally {socket.close();}
