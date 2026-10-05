import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {send,delay,evaluate,tap,shot,load,startGrandPrix,errors,socket} from './cdp.mjs';
const samples=[];
try {
  await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:1600,height:1000,deviceScaleFactor:1,mobile:false});
  await load('?demo=1');await startGrandPrix();await delay(4500);
  const meshes=await evaluate(`window.__DK.scene.meshes.length`);let captured=false,paused=false;
  for(let i=0;i<90;i++) {
    await delay(1500);
    const sample=await evaluate(`(()=>{const d=window.__DK;return {phase:d.phase,stats:d.items.stats,objects:d.items.objects.length,immune:d.items.immune,progress:d.progress[0].distance,meshes:d.scene.meshes.length,slot:d.items.slots[0],time:d.items.time};})()`);samples.push(sample);
    assert.equal(sample.meshes,meshes,'Item pool allocated new meshes');assert.ok(sample.objects<=18);
    if(!captured&&sample.objects>0){captured=true;await shot('slice-items-in-race');}
    if(!paused&&sample.time>18) {
      paused=true;await tap('p','KeyP',80);const before=await evaluate(`JSON.stringify(window.__DK.items)`);await delay(1000);
      assert.equal(await evaluate(`JSON.stringify(window.__DK.items)`),before,'Items advance during pause');await tap('p','KeyP',80);
    }
    if(i%10===0)console.log(JSON.stringify(sample));
    if(sample.phase==='finished')break;
  }
  const last=samples.at(-1);for(const kind of ['direct','homing','trap'])assert.ok(last.stats[kind].launched>0,`${kind} never launched in a real race`);
  assert.ok(Object.values(last.stats).some(s=>s.hits>0),'No actual racing item hit');assert.equal(last.phase,'finished');
  await shot('slice-item-race-result');await tap('Enter','Enter',13);await delay(1000);
  assert.equal(await evaluate(`window.__DK.items.objects.length`),0);assert.equal(await evaluate(`window.__DK.scene.meshes.length`),meshes);
  assert.deepEqual(errors,[]);await writeFile(`docs/evidence/slice-item-race${process.env.EVIDENCE_SUFFIX??''}.json`,JSON.stringify({date:new Date().toISOString(),method:'Normal six-kart real-time race, shared item rules and unmodified demo controller',samples,errors},null,2)+'\n');console.log('ITEM_RACE_PAUSE_POOL_REMATCH_PASS');
}finally{socket.close();}
