// Controlled diagnostics for a concrete standard-quality frame-time regression.
import {writeFile} from 'node:fs/promises';
import {send,delay,evaluate,load,errors,socket} from './cdp.mjs';
import assert from 'node:assert/strict';
const frames=()=>evaluate(`(async()=>{const s=window.__DK.scene;let last=await new Promise(requestAnimationFrame),times=[];for(let i=0;i<180;i++){const now=await new Promise(requestAnimationFrame);times.push(now-last);last=now;}times.sort((a,b)=>a-b);return {p50:times[89],p95:times[170],p99:times[177],gpu:s.metadata.gpuTimings.gpuFrameTimeCounter.current/1e6,cpu:s.metadata.timings.frameTimeCounter.current,draw:s.metadata.timings.drawCallsCounter.current,tri:s.getActiveIndices()/3};})()`);
try{
  await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:1600,height:1000,deviceScaleFactor:1,mobile:false});
  await load('?demo=1');await delay(6000);await evaluate(`document.querySelector('#pause').click()`);
  const rows=[];
  for(const [name,shadow,glow] of [['standard',true,true],['without shadows',false,true],['without glow',true,false],['without both',false,false]]) {
    await evaluate(`(()=>{const s=window.__DK.scene;s.lights.find(l=>l.name==='Late afternoon sun').shadowEnabled=${shadow};s.effectLayers.find(l=>l.name==='Restrained lamp and exhaust glow').isEnabled=${glow};})()`);
    await delay(1800);rows.push({name,...await frames()});
  }
  await evaluate(`(()=>{const s=window.__DK.scene;s.lights.find(l=>l.name==='Late afternoon sun').shadowEnabled=true;s.effectLayers[0].isEnabled=true;})()`);
  assert.deepEqual(errors,[]);await writeFile('docs/evidence/slice-render-cost.json',JSON.stringify({date:new Date().toISOString(),method:'Controlled same stationary six-kart scene at 1600x1000; only shadow/glow toggled, 180 rAF intervals after warmup; no device approval',rows,errors},null,2)+'\n');console.log(rows);
}finally{socket.close();}
