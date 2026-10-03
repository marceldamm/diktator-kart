import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceKart,initialKartState,KART_TUNING} from '../src/kart-model.ts';
const dt=1/60,project=(x,z)=>({x,z,normalX:0,normalZ:0}),terrain=()=>0;
const step=(s,steering,held=true,throttle=1)=>advanceKart(s,{throttle,steering,hopDrift:held},dt,project,terrain);
test('both drift directions charge while countersteering and release mini turbo',()=>{
  for(const direction of [-1,1]){
    let s={...initialKartState(),speed:12};s=step(s,direction);
    for(let i=0;i<80;i++)s=step(s,-direction);
    assert.equal(s.drifting,true);assert.equal(s.driftDirection,direction);
    assert.equal(s.driftCharge,KART_TUNING.driftChargeTime);
    assert.ok(s.yawRate*direction>0,'Countersteering must widen original arc, not reverse it');
    assert.ok(Math.abs(Math.atan2(Math.sin(s.heading-s.travelHeading),Math.cos(s.heading-s.travelHeading)))<=KART_TUNING.driftMaxSlip+1e-9);
    s=step(s,-direction,false);assert.ok(s.turboRemaining>0);assert.equal(s.drifting,false);
  }
});
test('inside steering tightens the arc, outside widens it; neutral charges and braking release gives no turbo',()=>{
  const base={...initialKartState(),speed:12,drifting:true,driftDirection:1};
  let inside=base,outside=base,neutral=base;
  for(let i=0;i<80;i++){inside=step(inside,1);outside=step(outside,-1);neutral=step(neutral,0);}
  assert.ok(inside.heading>outside.heading*2);assert.ok(outside.heading>0);
  assert.ok(neutral.driftCharge>0);
  const brake=step(inside,1,false,-1);assert.equal(brake.turboRemaining,0);
});
