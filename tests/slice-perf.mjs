// Real elapsed-time race, with normal fixed-step simulation and six participants.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {send,delay,evaluate,tap,shot,load,startGrandPrix,setQuality,errors,socket} from './cdp.mjs';
const samples=[];
const snapshot=()=>evaluate(`(()=>{const d=window.__DK,s=d.scene,e=s.getEngine();return {phase:d.phase,progress:d.progress.map(p=>({...p})),speed:d.kart.speed,meshes:s.meshes.length,fps:e.getFps(),drawCalls:s.metadata.timings.drawCallsCounter.current,cpuFrameMs:s.metadata.timings.frameTimeCounter.current,gpuFrameMs:s.metadata.gpuTimings.gpuFrameTimeCounter.count?s.metadata.gpuTimings.gpuFrameTimeCounter.current/1000000:null,activeTriangles:s.getActiveIndices()/3,particles:s.particleSystems.reduce((n,p)=>n+p.getActiveCount(),0),camera:document.querySelector('#camera-mode').textContent,heap:performance.memory?.usedJSHeapSize};})()`);
const frames=()=>evaluate(`(async()=>{let last=await new Promise(requestAnimationFrame);const v=[];for(let i=0;i<300;i++){const n=await new Promise(requestAnimationFrame);v.push(n-last);last=n;}v.sort((a,b)=>a-b);return {p50:v[149],p95:v[284],p99:v[296],max:v[299],over33:v.filter(n=>n>33).length};})()`);
try {
  await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:1600,height:1000,deviceScaleFactor:1,mobile:false});
  await load('?demo=1');await setQuality('Grafik Standard');await startGrandPrix();
  const endurance=[];
  for(let camera=0;camera<3;camera++) {
    if(camera)await tap('c','KeyC',67);await delay(2000);endurance.push({quality:'Standard',...await snapshot(),...await frames()});
  }
  await setQuality('Grafik Basis');await delay(2000);endurance.push({quality:'Basis',...await snapshot(),...await frames()});
  await setQuality('Grafik Standard');
  assert.deepEqual(errors,[]);const result={date:new Date().toISOString(),method:'Real-time visible Chrome, demo controller through normal kart input, 3 laps; 300 rAF intervals per camera at 1600x1000',samples,endurance,errors};
  await writeFile('docs/evidence/slice-optimized-rtx.json',JSON.stringify(result,null,2)+'\n');console.log('OPTIMIZED_CAMERA_PROBE_PASS');
} finally {socket.close();}
