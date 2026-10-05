// Runtime instrumentation for the confirmed M7 moving-race rendering audit; run only in visible Chrome.
// This records work performed; it does not change quality, effects, or physics.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { send, delay, evaluate, load, startGrandPrix, tap, socket, errors } from './cdp.mjs';

try {
  await send('Runtime.enable');
  await send('Page.bringToFront');
  await send('Emulation.setFocusEmulationEnabled', { enabled: true });
  await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });
  await load('?demo=1');
  await startGrandPrix();

  const start = await evaluate(`({meshes:window.__DK.scene.meshes.length,distance:window.__DK.progress[0].distance})`);
  const views = [];
  for (let view = 0; view < 3; view++) {
    if (view) await tap('c', 'KeyC', 67);
    await delay(1500);
    const row = await evaluate(`(async()=>{
      const d=window.__DK,s=d.scene,frames=[];
      let last=await new Promise(requestAnimationFrame);
      for(let i=0;i<300;i++){const now=await new Promise(requestAnimationFrame);frames.push(now-last);last=now;}
      frames.sort((a,b)=>a-b);
      const active=s.getActiveMeshes().data.slice(0,s.getActiveMeshes().length);
      const counts=active.map(m=>({name:m.name,vertices:m.getTotalVertices(),indices:m.getTotalIndices(),subMeshes:m.subMeshes?.length??0}));
      const top=[...counts].sort((a,b)=>b.indices-a.indices).slice(0,15);
      const generators=s.lights.map(light=>{const g=light.getShadowGenerator?.();const map=g?.getShadowMap();const casters=map?.renderList??[];return g?{light:light.name,resolution:map?.getSize?.(),enabled:light.shadowEnabled,casters:casters.length,enabledCasters:casters.filter(m=>m.isEnabled()&&m.isVisible).length}:null}).filter(Boolean);
      const targets=s.customRenderTargets.map(t=>({name:t.name,refreshRate:t.refreshRate,renderList:t.renderList?.length??0,activeCamera:t.activeCamera?.name??null}));
      const timings=s.metadata?.timings??{},gpu=s.metadata?.gpuTimings?.gpuFrameTimeCounter;
      return{view:d.view,phase:d.phase,karts:1+d.bots.length,meshPool:s.meshes.length,activeMeshes:active.length,activeVertices:counts.reduce((n,m)=>n+m.vertices,0),activeMeshTriangles:counts.reduce((n,m)=>n+Math.floor(m.indices/3),0),activeTriangles:s.getActiveIndices()/3,estimatedSubmeshDraws:counts.reduce((n,m)=>n+m.subMeshes,0),lastFrame:{drawCalls:timings.drawCallsCounter?.current??null,cpuFrameMs:timings.frameTimeCounter?.current??null,gpuFrameMs:gpu?.count?gpu.current/1e6:null},activeNameGroups:{world:active.filter(m=>/Architecture|Boulevard house|Palace|Station|Park/.test(m.name)).length,track:active.filter(m=>/track|barrier|curb|ramp|canal|shortcut/i.test(m.name)).length,vehicle:active.filter(m=>/raceKart|Kart|wheel|driverPose/i.test(m.name)).length},shadowGenerators:generators,renderTargets:targets,frameMs:{p50:frames[149],p95:frames[284],p99:frames[296],max:frames.at(-1)},topTriangles:top.map(m=>({name:m.name,triangles:Math.floor(m.indices/3),subMeshes:m.subMeshes}))};
    })()`);
    assert.equal(row.phase, 'race');
    assert.equal(row.karts, 6);
    assert.equal(row.meshPool, start.meshes);
    views.push(row);
    console.log(JSON.stringify(row));
  }
  const end = await evaluate(`({distance:window.__DK.progress[0].distance,positions:[window.__DK.kart,...window.__DK.bots].map(k=>[k.x,k.z,k.speed])})`);
  assert.ok(end.distance > start.distance + 80, 'audit must measure actual race travel');
  assert.ok(end.positions.flat().every(Number.isFinite));
  assert.deepEqual(errors, []);
  await writeFile('docs/evidence/scene-render-audit.json', JSON.stringify({ date: new Date().toISOString(), method: 'Visible isolated Chrome CDP; local RTX machine; six actual moving Grand Prix karts; 1600x1000; 300 rAF intervals per camera after 1.5s warmup. Active meshes and submesh count sampled after each window. submesh draws are an estimate; engine counter recorded only if exposed.', start, end, views, errors, limits: ['One RTX development device; not a weak-PC/mobile or 60-FPS approval.', 'No rendering, shadow, image quality, or physics settings were changed.', 'Largest active meshes and per-camera work counts prioritize the next causal A/B test; they do not alone prove a bottleneck.'] }, null, 2));
  await tap('p', 'KeyP', 80);
  console.log('PASS: moving six-kart runtime instrumented in all cameras; no graphics or physics settings changed.');
} finally {
  socket.close();
}
