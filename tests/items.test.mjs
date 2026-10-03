import assert from 'node:assert/strict';
import test from 'node:test';
import {createItems,stepItems,ITEM_RULES} from '../src/items.ts';
import {gridKart,trackPoint,recoverKart,trackProgress,TRACK} from '../src/track.ts';

test('item boxes allocate the same slot for a human or a bot, with bounded shared respawn',()=>{
  for(const index of [0,1]) {
    const world=createItems(2);const karts=[gridKart(0),gridKart(1)];Object.assign(karts[index],{x:world.boxes[0].x,z:world.boxes[0].z});
    stepItems(world,karts,[false,false],[1,2],1/60);
    assert.ok(world.slots[index]);assert.equal(world.boxes[0].readyIn,ITEM_RULES.boxRespawn);
    assert.equal(world.events[0].kart,index);
  }
});
test('swept projectiles hit one target, consume the object and protect from chained hits',()=>{
  const world=createItems(3);world.slots[0]='direct';
  const karts=[gridKart(0),gridKart(1),gridKart(2)];karts[1]={...karts[0],z:karts[0].z+7,speed:12};karts[2]={...karts[1],z:karts[1].z+4,speed:12};
  let next=karts;
  for(let i=0;i<20;i++)next=stepItems(world,next,[i===0,false,false],[1,2,3],1/60);
  assert.equal(next[1].speed,12*ITEM_RULES.hitSpeedFactor);assert.equal(next[2].speed,12);assert.equal(world.objects.length,0);assert.ok(world.immune[1]>0);
  world.objects.push({id:99,kind:'trap',owner:0,x:next[1].x,z:next[1].z,heading:0,age:1,remaining:2,target:null});
  next=stepItems(world,next,[false,false,false],[1,2,3],1/60);assert.equal(next[1].speed,12*ITEM_RULES.hitSpeedFactor);
});
test('homing uses a limited target and turn rate; traps expire and object counts are bounded',()=>{
  const world=createItems(2);const k=[gridKart(0),{...gridKart(0),...trackPoint(TRACK.start+20,1)}];world.slots[0]='homing';
  stepItems(world,k,[true,false],[2,1],1/60);assert.equal(world.objects[0].target,1);assert.ok(Math.abs(world.objects[0].heading-k[0].heading)<=ITEM_RULES.homingTurnRate/60+1e-9);
  for(let i=0;i<1500;i++){world.slots[0]='trap';stepItems(world,k,[true,false],[2,1],1/60);assert.ok(world.objects.filter(o=>o.kind==='trap').length<=ITEM_RULES.maxPerKind);}
  for(let i=0;i<800;i++)stepItems(world,k,[false,false],[2,1],1/60);assert.equal(world.objects.length,0);
});
test('recovery preserves track progress and supplies no forward speed',()=>{
  const k={...gridKart(0),...trackPoint(275,5),heading:2};const r=recoverKart(k,[k]);
  assert.ok(Math.abs(trackProgress(k.x,k.z)-trackProgress(r.x,r.z))<.05);assert.equal(r.speed,0);assert.equal(r.height,0);
});
