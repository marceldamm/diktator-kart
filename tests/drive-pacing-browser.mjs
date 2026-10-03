// Sample real simulated and rendered positions on a straight. No FPS acceptance.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {send,evaluate,load,key,delay,socket} from './cdp.mjs';
const label=process.argv[2]??'before';
try {
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});
  await load();
  await evaluate(`document.querySelector('#menu-practice').click()`);
  await delay(1300);
  // QA only: place ahead of the grid on the existing real course, preserving its heading.
  await evaluate(`(async()=>{const {trackPoint,TRACK}=await import('/src/track.ts');const p=trackPoint(TRACK.start+10,-3);Object.assign(window.__DK.kart,{x:p.x,z:p.z,heading:p.heading,travelHeading:p.heading,speed:16});window.__driveSamples=[];const scene=window.__DK.scene;const root=scene.getTransformNodeByName('raceKart-0');window.__driveObserver=scene.onAfterRenderObservable.add(()=>{const k=window.__DK.kart,c=scene.activeCamera;window.__driveSamples.push({t:performance.now(),dt:scene.getEngine().getDeltaTime(),x:k.x,z:k.z,speed:k.speed,impact:k.impactRemaining,renderX:root.position.x,renderZ:root.position.z,cameraX:c.position.x,cameraZ:c.position.z,alpha:window.__DK.render?.alpha,steps:window.__DK.render?.steps});});})()`);
  await key('keyDown','w','KeyW',87); await delay(1400); await key('keyUp','w','KeyW',87);
  const samples=await evaluate(`window.__DK.scene.onAfterRenderObservable.remove(window.__driveObserver);window.__driveSamples`);
  const moving=samples.filter(s=>s.speed>12&&s.impact===0);
  const intervals=moving.slice(1).map((s,i)=>{const p=moving[i],dt=(s.t-p.t)/1000;return {ms:dt*1000,simVelocity:Math.hypot(s.x-p.x,s.z-p.z)/dt,renderVelocity:Math.hypot(s.renderX-p.renderX,s.renderZ-p.renderZ)/dt,cameraVelocity:Math.hypot(s.cameraX-p.cameraX,s.cameraZ-p.cameraZ)/dt,steps:s.steps,alpha:s.alpha};}).filter(s=>s.ms>0&&s.ms<100);
  assert.ok(intervals.length>20,'Need actual straight-drive samples');
  const summary={count:intervals.length,frameMs:intervals.map(s=>s.ms).sort((a,b)=>a-b)[Math.floor(intervals.length*.95)],simVelocityRange:[Math.min(...intervals.map(s=>s.simVelocity)),Math.max(...intervals.map(s=>s.simVelocity))],renderVelocityRange:[Math.min(...intervals.map(s=>s.renderVelocity)),Math.max(...intervals.map(s=>s.renderVelocity))],stationaryRenderedFrames:intervals.filter(s=>s.renderVelocity<.01).length};
  await writeFile(`docs/evidence/drive-pacing-${label}.json`,JSON.stringify({label,viewport:'1280x800, RTX, six karts; short local sample, other user browser may be open',summary,samples,intervals},null,2)+'\n');
  console.log(JSON.stringify(summary));
} finally {socket.close();}
