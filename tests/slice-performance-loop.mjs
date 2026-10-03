// Moving six-kart performance evidence, without screenshots or background asset builds.
import {writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';
import {send,delay,evaluate,tap,load,errors,socket} from './cdp.mjs';
const sample=()=>evaluate(`(async()=>{const s=window.__DK.scene,values=[];let last=await new Promise(requestAnimationFrame);for(let i=0;i<300;i++){const now=await new Promise(requestAnimationFrame);if(window.__DK.phase!=='race')break;values.push(now-last);last=now;}values.sort((a,b)=>a-b);const p=f=>values.length?values[Math.ceil(values.length*f)-1]:null;return {count:values.length,p50:p(.5),p95:p(.95),p99:p(.99),max:values.at(-1),over33:values.filter(v=>v>33).length,phase:window.__DK.phase,camera:window.__DK.view,progress:window.__DK.progress[0].distance,drawCalls:s.metadata.timings.drawCallsCounter.current,cpuFrameMs:s.metadata.timings.frameTimeCounter.current,gpuFrameMs:s.metadata.gpuTimings.gpuFrameTimeCounter.count?s.metadata.gpuTimings.gpuFrameTimeCounter.current/1e6:null,meshes:s.meshes.length,activeTriangles:s.getActiveIndices()/3};})()`);
try{
  await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:1600,height:1000,deviceScaleFactor:1,mobile:false});
  await load('?demo=1');await evaluate(`if(localStorage.getItem('dk-quality')==='0')document.querySelector('#quality-toggle').click()`);await evaluate(`document.querySelector('#race-start').click()`);await delay(6500);
  const standard=[];for(let i=0;i<24;i++){
    if(i)await tap('c','KeyC',67);await delay(1500);const row=await sample();standard.push(row);console.log(JSON.stringify({quality:'Standard',camera:row.camera,p95:row.p95,count:row.count,progress:row.progress}));if(row.phase==='finished')break;
  }
  assert.equal(await evaluate(`window.__DK.phase`),'finished');assert.ok(standard.length>=6);
  await evaluate(`document.querySelector('#quality-toggle').click();document.querySelector('#race-start').click()`);await delay(6500);
  const basis=[];for(let i=0;i<3;i++){if(i)await tap('c','KeyC',67);await delay(1500);basis.push(await sample());}
  await evaluate(`document.querySelector('#quality-toggle').click()`);assert.deepEqual(errors,[]);
  await writeFile('docs/evidence/slice-controlled-pacing.json',JSON.stringify({date:new Date().toISOString(),method:'Production preview at 1600x1000, RTX 3070 Laptop, six-kart normal three-lap demo race; 300 rAF intervals per window, camera rotates with 1.5s warmup; no screenshots/asset builds during measurement. GPU/CPU are final-frame snapshots, not full-window medians. Basis windows on rematch. No weak-PC/mobile approval.',standard,basis,errors},null,2)+'\n');console.log('CONTROLLED_SIX_KART_PACING_PASS');
}finally{socket.close();}
