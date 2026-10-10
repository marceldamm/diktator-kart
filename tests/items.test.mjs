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
  assert.equal(next[1].speed,12*ITEM_RULES.hitSpeedFactor);assert.ok(next[2].speed>=12&&next[2].speed<=12+ITEM_RULES.nearMissBoost);assert.equal(next[2].spinRemaining??0,0);assert.equal(world.objects.length,0);assert.ok(world.immune[1]>0);
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

test('an item held behind as a shield blocks one projectile from behind, consuming the item', async () => {
  const { createItems: create, stepItems: step } = await import('../src/items.ts');
  const { initialKartState: init } = await import('../src/kart-model.ts');
  const world = create(2); world.boxes = [];
  const p = trackPoint(100, 0), back = trackPoint(98.8, 0), far = trackPoint(80, 0);
  const target = { ...init(), x: p.x, z: p.z, heading: p.heading }, shooter = { ...init(), x: far.x, z: far.z, heading: p.heading };
  world.slots[0] = 'trap'; world.shield = [true, false];
  world.objects.push({ id: 99, kind: 'direct', owner: 1, x: back.x, z: back.z, heading: back.heading, age: 1, remaining: 2, target: null });
  const after = step(world, [target, shooter], [false, false], [1, 2], 1 / 60);
  assert.ok(world.events.some((e) => e.kind === 'block' && e.kart === 0));
  assert.equal(world.slots[0], null); assert.equal(after[0].spinRemaining ?? 0, 0);
});

test('a second item box grants a distinct defensive slot that activates and blocks one projectile', () => {
  const world=createItems(2);const target={...gridKart(0),...trackPoint(100,0),speed:12},rival={...gridKart(1),...trackPoint(80,0)};
  world.slots[0]='trap';world.boxes=[{id:1,x:target.x,z:target.z,readyIn:0}];
  stepItems(world,[target,rival],[false,false],[1,2],1/60);
  assert.equal(world.slots[0],'trap','the occupied offensive item must not be overwritten');
  assert.equal(world.defenseSlots[0],true);assert.ok(world.events.some(e=>e.kind==='defense-pickup'&&e.kart===0));
  world.boxes=[];stepItems(world,[target,rival],[false,false],[1,2],1/60,[],[true,false]);
  assert.equal(world.defenseSlots[0],false);assert.ok(world.defenseRemaining[0]>0);
  world.objects.push({id:99,kind:'direct',owner:1,x:target.x,z:target.z,heading:target.heading,age:1,remaining:2,target:null});
  const after=stepItems(world,[target,rival],[false,false],[1,2],1/60);
  assert.ok(world.events.some(e=>e.kind==='block'&&e.kart===0&&e.item==='shield'));
  assert.equal(world.defenseRemaining[0],0);assert.equal(after[0].speed,target.speed);
});

test('near misses reward one close dodge once per projectile with a small cooldown-protected boost', () => {
  const world=createItems(2);world.boxes=[];const p=trackPoint(100,0),sideX=Math.cos(p.heading),sideZ=-Math.sin(p.heading);
  const target={...gridKart(0),x:p.x,z:p.z,heading:p.heading,speed:10,turboRemaining:0},rival=gridKart(1);
  world.objects.push({id:99,kind:'direct',owner:1,x:p.x+sideX*1.65-.2*Math.sin(p.heading),z:p.z+sideZ*1.65-.2*Math.cos(p.heading),heading:p.heading,age:1,remaining:2,target:null});
  const first=stepItems(world,[target,rival],[false,false],[1,2],1/60);
  assert.ok(world.events.some(e=>e.kind==='near-miss'&&e.kart===0));assert.ok(first[0].speed>target.speed);assert.ok(first[0].turboRemaining>0);
  const speed=first[0].speed;stepItems(world,first,[false,false],[1,2],1/60);
  assert.equal(world.events.some(e=>e.kind==='near-miss'&&e.kart===0),false,'one projectile cannot trigger repeated near-miss rewards');
  assert.ok(world.nearMissCooldown[0]>0);assert.ok(speed>target.speed);
});

test('backward projectiles launch behind and homing selects a rival behind the owner', () => {
  const player = { ...gridKart(0), ...trackPoint(100, 0) };
  const behind = { ...gridKart(1), ...trackPoint(85, 0) };
  const ahead = { ...gridKart(2), ...trackPoint(115, 0) };
  const world = createItems(3); world.boxes = []; world.slots[0] = 'direct';
  stepItems(world, [player, behind, ahead], [true, false, false], [1, 2, 3], 1 / 60, ['backward']);
  const projectile = world.objects[0];
  const backwardDistance = (projectile.x - player.x) * Math.sin(player.heading) + (projectile.z - player.z) * Math.cos(player.heading);
  assert.ok(backwardDistance < 0);
  assert.ok(Math.abs(Math.abs(projectile.heading - player.heading) - Math.PI) < 1e-9);

  const homing = createItems(3); homing.boxes = []; homing.slots[0] = 'homing';
  const distantBehind = { ...gridKart(1), ...trackPoint(60, 0) };
  stepItems(homing, [player, distantBehind, ahead], [true, false, false], [1, 2, 3], 1 / 60, ['backward']);
  assert.equal(homing.objects[0].target, 1);
  assert.equal(homing.objects[0].direction, 'backward');
  for (let i = 0; i < 30; i++) stepItems(homing, [player, distantBehind, ahead], [false, false, false], [1, 2, 3], 1 / 60);
  const backwardHeading = player.heading + Math.PI;
  assert.ok(Math.cos(homing.objects[0].heading - backwardHeading) > .85);
});

test('censor bar briefly impairs opponents, shows its sender a short banner, and respects immunity', () => {
  const world = createItems(3); world.boxes = []; world.slots[0] = 'censor'; world.immune[2] = .5;
  const karts = [gridKart(0), gridKart(1), gridKart(2)];
  stepItems(world, karts, [true, false, false], [1, 2, 3], 1 / 60);
  assert.equal(world.slots[0], null);
  assert.equal(world.censorRemaining[0], 0, 'sender is not impaired by their own item');
  assert.ok(world.censorBannerRemaining[0] > 0 && world.censorBannerRemaining[0] < 1);
  assert.ok(world.censorRemaining[1] > 2.5);
  assert.equal(world.censorRemaining[2], 0, 'immunity protects against the censorship effect');
  assert.equal(world.stats.censor.launched, 1);
  assert.equal(world.stats.censor.hits, 1);
  assert.equal(world.events.filter((event) => event.kind === 'hit' && event.item === 'censor').length, 0, 'bot targets do not create duplicate local announcements');

  const incoming = createItems(3); incoming.boxes = []; incoming.slots[1] = 'censor';
  stepItems(incoming, karts, [false, true, false], [1, 2, 3], 1 / 60);
  assert.ok(incoming.censorRemaining[0] > 2.5);
  assert.ok(incoming.events.some((event) => event.kind === 'hit' && event.kart === 0 && event.owner === 1));

  for (let i = 0; i < 180; i++) stepItems(world, karts, [false, false, false], [1, 2, 3], 1 / 60);
  assert.equal(world.censorBannerRemaining[0], 0, 'sender banner expires quickly');
  assert.equal(world.censorRemaining[1], 0, 'opponent steering effect expires');
});

test('Eilerlass boost item: rank-weighted, self-applied turbo, never a projectile', async () => {
  const { createItems, stepItems, ITEM_RULES } = await import('../src/items.ts');
  const { gridKart } = await import('../src/track.ts');
  const world = createItems(2);
  world.slots[0] = 'boost';
  const karts = [{ ...gridKart(0), speed: 10, turboRemaining: 0 }, gridKart(1)];
  const out = stepItems(world, karts, [true, false], [1, 2], 1 / 60);
  assert.equal(world.slots[0], null);
  assert.equal(world.objects.length, 0);
  assert.ok(out[0].turboRemaining >= ITEM_RULES.boostDuration - 1e-9 && out[0].speed > 13);
  let boosts = 0; const w = createItems(6, 7);
  for (let k = 0; k < 400; k++) { w.slots[5] = null; w.boxes.forEach(b => b.readyIn = 0); const box = w.boxes[0]; stepItems(w, Array.from({ length: 6 }, (_, i) => i === 5 ? { ...gridKart(5), x: box.x, z: box.z } : { ...gridKart(i), x: 9999, z: 9999 }), Array(6).fill(false), [1, 2, 3, 4, 5, 6], 1 / 60); if (w.slots[5] === 'boost') boosts++; }
  assert.ok(boosts > 60, `last place should draw boosts often (${boosts}/400)`);
});
