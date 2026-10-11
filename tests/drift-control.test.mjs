import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceKart,initialKartState,KART_TUNING} from '../src/kart-model.ts';
const dt=1/60,project=(x,z)=>({x,z,normalX:0,normalZ:0}),terrain=()=>0;
const step=(s,steering,held=true,throttle=1)=>advanceKart(s,{throttle,steering,hopDrift:held},dt,project,terrain);
const slip=s=>Math.abs(Math.atan2(Math.sin(s.heading-s.travelHeading),Math.cos(s.heading-s.travelHeading)));
const arc=(speed,steering)=>{let s={...initialKartState(),speed,drifting:true,driftDirection:1};for(let i=0;i<240;i++){s=step(s,steering,true,0);s.speed=speed;}return {state:s,radius:speed/Math.abs(s.yawRate)};};
test('Mario-Kart-style drift (11.10.2026): the side stays fixed while Space is held, release pays out',()=>{
  for(const direction of [-1,1]){
    let s={...initialKartState(),speed:12};s=step(s,direction);
    for(let i=0;i<60;i++)s=step(s,direction);
    assert.equal(s.drifting,true);assert.equal(s.driftDirection,direction);
    for(let i=0;i<60;i++)s=step(s,-direction);
    assert.equal(s.drifting,true,'the outside key opens the arc instead of ending or flipping the slide');assert.equal(s.driftDirection,direction);
    for(let i=0;i<60;i++)s=step(s,0);
    assert.equal(s.drifting,true,'no key keeps a medium slide');
    assert.ok(slip(s)<=KART_TUNING.driftMaxSlip+1e-9);
    s=step(s,0,false);assert.ok(s.turboRemaining>0);assert.equal(s.drifting,false);
    assert.ok(slip(s)<KART_TUNING.driftMaxSlip*.4,'releasing straightens the nose onto the travel line');
  }
});
test('drift arcs: inside ~18 m, neutral ~29 m, outside ~75 m at any speed; braking release gives no turbo',()=>{
  for(const speed of [10,16]){
    const inside=arc(speed,1).radius,neutral=arc(speed,0).radius,outside=arc(speed,-1).radius;
    assert.ok(inside>15&&inside<21,`inside ${inside}`);
    assert.ok(neutral>26&&neutral<33,`neutral ${neutral}`);
    assert.ok(outside>60&&outside<95,`outside ${outside}`);
  }
  const s=arc(12,1).state;
  assert.ok(slip(s)<=KART_TUNING.driftMaxSlip+1e-9,'drift slip stays bounded at full inside steering');
  const brake=step({...s,driftCharge:KART_TUNING.driftChargeTime},1,false,-1);assert.equal(brake.turboRemaining,0);
});
test('a hop on a hill stays on the road (Marcel 11.10.2026: the kart used to sink under a sloped road)', async () => {
  const T = await import('../src/track.ts');
  T.selectTrack('duce-drom');
  for (const s0 of [500, 530, 670, 700]) {
    const p = T.trackPoint(s0, 0), ground = T.trackHeightAt(p.x, p.z);
    let k = { ...initialKartState(), ...p, travelHeading: p.heading, speed: 12, suspensionOffset: ground, wheelGroundHeights: [ground, ground, ground, ground] };
    for (let i = 0; i < 30; i++) k = advanceKart(k, { throttle: 1, steering: 0 }, dt, T.projectTrack, T.trackHeightAt);
    k = advanceKart(k, { throttle: 1, steering: 0, hopPressed: true, hopDrift: true }, dt, T.projectTrack, T.trackHeightAt);
    let lowest = Infinity;
    for (let i = 0; i < 50; i++) { k = advanceKart(k, { throttle: 1, steering: 0, hopDrift: true }, dt, T.projectTrack, T.trackHeightAt); lowest = Math.min(lowest, k.height + k.suspensionOffset - T.trackHeightAt(k.x, k.z)); }
    assert.ok(ground > .5, `test point ${s0} lies on the hill`);
    assert.ok(lowest > -.12, `body sank ${lowest.toFixed(2)} m below the road at s=${s0}`);
  }
  T.selectTrack('stadionring');
});
