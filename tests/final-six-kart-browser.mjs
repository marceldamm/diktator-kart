// Actual current scene; bounded workload check, not a low-end or 60 FPS approval.
import assert from'node:assert/strict';import{writeFile}from'node:fs/promises';
import{send,delay,evaluate,load,tap,socket,errors}from'./cdp.mjs';
try{
 await send('Runtime.enable');await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});await send('Emulation.setDeviceMetricsOverride',{width:1600,height:1000,deviceScaleFactor:1,mobile:false});
 await load('?demo=1');await evaluate(`document.querySelector('#race-start').click()`);
 for(let i=0;i<100&&await evaluate(`window.__DK.phase`)!=='race';i++)await delay(100);
 assert.equal(await evaluate(`window.__DK.phase`),'race');
 const initial=await evaluate(`({meshes:window.__DK.scene.meshes.length,distance:window.__DK.progress[0].distance})`),windows=[];
 for(let i=0;i<3;i++){
  if(i)await tap('c','KeyC',67);await delay(1500);
  const row=await evaluate(`(async()=>{const d=window.__DK,s=d.scene,frames=[];let last=await new Promise(requestAnimationFrame);for(let i=0;i<300;i++){const now=await new Promise(requestAnimationFrame);frames.push(now-last);last=now;}frames.sort((a,b)=>a-b);return{view:d.view,phase:d.phase,meshes:s.meshes.length,activeMeshes:s.getActiveMeshes().length,karts:1+d.bots.length,distance:d.progress[0].distance,p50:frames[149],p95:frames[284],p99:frames[296],max:frames.at(-1),positions:[d.kart,...d.bots].map(k=>[k.x,k.z,k.speed])};})()`);
  assert.equal(row.meshes,initial.meshes);assert.equal(row.karts,6);assert.ok(row.positions.flat().every(Number.isFinite));assert.equal(row.phase,'race');windows.push(row);console.log(JSON.stringify(row));
 }
 const final=windows.at(-1);assert.ok(final.distance>initial.distance+80,'six-kart load must actually travel');assert.deepEqual(errors,[]);
 await writeFile('docs/evidence/final-six-kart-load.json',JSON.stringify({date:new Date().toISOString(),method:'Current dev checkout, visible isolated Chrome on local RTX machine; 1600x1000, six actual demo racers, 300 rAF intervals per view after 1.5s warmup. No screenshot/build during samples. Focus emulation keeps QA rendering if app occludes Chrome. No production/weak-PC/mobile/60-FPS approval.',initial,windows,errors},null,2));
 await tap('p','KeyP',80);console.log('PASS: six moving karts, all three camera windows, finite state and constant mesh pool.');
}finally{socket.close();}
