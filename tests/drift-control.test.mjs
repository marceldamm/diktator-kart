import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceKart,initialKartState,KART_TUNING} from '../src/kart-model.ts';
const dt=1/60,project=(x,z)=>({x,z,normalX:0,normalZ:0}),terrain=()=>0;
const step=(s,steering,held=true,throttle=1)=>advanceKart(s,{throttle,steering,hopDrift:held},dt,project,terrain);
test('drift follows the steering: full opposite steering switches sides, the charge carries over and release pays out (Marcel 07.10.)',()=>{
  for(const direction of [-1,1]){
    let s={...initialKartState(),speed:12};s=step(s,direction);
    for(let i=0;i<60;i++)s=step(s,direction);
    assert.equal(s.drifting,true);assert.equal(s.driftDirection,direction);
    const before=s.driftCharge;
    for(let i=0;i<20;i++)s=step(s,-direction);
    assert.equal(s.drifting,true);assert.equal(s.driftDirection,-direction,'snake line: the slide swaps to the new side');
    assert.ok(s.driftCharge>0&&s.driftCharge<before+.4);
    for(let i=0;i<200;i++)s=step(s,-direction);
    assert.ok(Math.abs(Math.atan2(Math.sin(s.heading-s.travelHeading),Math.cos(s.heading-s.travelHeading)))<=KART_TUNING.driftMaxSlip+1e-9);
    s=step(s,-direction,false);assert.ok(s.turboRemaining>0);assert.equal(s.drifting,false);
  }
});
test('inside steering tightens the arc, light countersteer widens it; straight ends the slide and braking release gives no turbo',()=>{
  const base={...initialKartState(),speed:12,drifting:true,driftDirection:1};
  let inside=base,outside=base,neutral=base;
  for(let i=0;i<80;i++){inside=step(inside,1);outside=step(outside,-.4);neutral=step(neutral,0);}
  assert.ok(inside.heading>outside.heading*2);assert.ok(outside.heading>0);
  const slip=s=>Math.abs(Math.atan2(Math.sin(s.heading-s.travelHeading),Math.cos(s.heading-s.travelHeading)));
  assert.ok(slip(inside)<=.141,'drift slip stays controlled at full inside steering');
  assert.ok(slip(outside)<slip(inside),'countersteer reduces side slip');
  assert.equal(neutral.drifting,false,'driving straight leaves the slide while Space stays armed');
  assert.equal(neutral.turboRemaining,0);
  const brake=step(inside,1,false,-1);assert.equal(brake.turboRemaining,0);
});
