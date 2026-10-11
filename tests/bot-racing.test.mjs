import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceKart,resolveKartContacts} from '../src/kart-model.ts';
import {TRACK,selectTrack,setBotSkill,setBotStyles,BOT_STYLES,botInput,gridKart,createRaceProgress,advanceRace,projectTrack,trackHeightAt,applySurfaceDrag,trackPoint} from '../src/track.ts';
import {createItems,botUsesItem,botItemDirection,botShouldUseDefense,stepItems} from '../src/items.ts';

test('slow: all difficulty levels complete six courses and produce distinct real race times',()=>{
 const result=[];
 try{
  for(const id of ['stadionring','duce-drom','havanna','pyongyang','moscow','beijing']){
   selectTrack(id);setBotStyles([undefined,BOT_STYLES[0],BOT_STYLES[1],BOT_STYLES[5]]);const medians=[];
   for(const level of [0,1,2]){
    setBotSkill(level);let states=[1,2,3].map(gridKart),races=states.map(createRaceProgress);
    for(let tick=0;tick<60*650&&!races.every(r=>r.finished);tick++){
     states=states.map((s,i)=>races[i].finished?{...s,speed:0}:applySurfaceDrag(advanceKart(s,botInput(s,i+1,states),1/60,projectTrack,trackHeightAt),1/60));
     states=resolveKartContacts(states,projectTrack);states.forEach((s,i)=>advanceRace(races[i],s,tick/60));
    }
    assert.ok(races.every(r=>r.finished),`${id}, level ${level}: all finish without teleporting`);
    medians.push(races.map(r=>r.finishTime).sort((a,b)=>a-b)[1]);
   }
   assert.ok(medians[1]<medians[0]*.97,`${id}: medium beats easy ${medians}`);
   assert.ok(medians[2]<medians[1]*.99,`${id}: hard beats medium ${medians}`);
   result.push({track:id,seconds:medians.map(t=>+t.toFixed(2))});
  }
  console.log('Three-lap median seconds, easy/medium/hard:',JSON.stringify(result));
 }finally{selectTrack('stadionring');setBotSkill(1);setBotStyles([]);}
});

test('a rival fires backward at an aligned pursuer using the shared projectile rules',()=>{
 selectTrack('stadionring');const k=gridKart(0),front=trackPoint(110),rear=trackPoint(100);
 const karts=[{...k,...front,travelHeading:front.heading},{...k,...rear,travelHeading:rear.heading}];
 const world=createItems(2);world.slots[0]='direct';world.heldFor[0]=3;
 assert.equal(botItemDirection(world,0,karts),'backward');assert.equal(botUsesItem(world,0,karts),true);
 stepItems(world,karts,[true,false],[1,2],1/60,['backward','forward']);
 assert.equal(world.objects[0].direction,'backward');
 assert.ok(Math.cos(world.objects[0].heading-karts[0].heading)<-.9);
 const sideways=[karts[0],{...karts[1],x:karts[1].x+20}];world.slots[0]='direct';
 assert.equal(botItemDirection(world,0,sideways),'forward','no blind backward shot');
});

test('bots save the defensive slot for predicted projectile hits, not traps or fly-bys',()=>{
 selectTrack('stadionring');const world=createItems(2),owner=gridKart(0),defender={...gridKart(1),x:0,z:0,heading:0,travelHeading:0,speed:0};
 world.defenseSlots[1]=true;
 world.objects=[{id:1,kind:'direct',owner:0,x:0,z:-6,heading:0,age:.1,remaining:2,target:null}];
 assert.equal(botShouldUseDefense(world,1,[owner,defender]),true,'straight incoming shot crosses the kart');
 world.objects[0]={...world.objects[0],x:4};
 assert.equal(botShouldUseDefense(world,1,[owner,defender]),false,'nearby shot passes outside the collision radius');
 world.objects[0]={...world.objects[0],kind:'trap',x:0};
 assert.equal(botShouldUseDefense(world,1,[owner,defender]),false,'stationary trap cannot spend the projectile shield');
 world.objects[0]={...world.objects[0],kind:'homing',x:-12,z:0,target:1};
 assert.equal(botShouldUseDefense(world,1,[owner,defender]),true,'a locked homing projectile may turn into the kart');
 world.objects[0]={...world.objects[0],kind:'direct',owner:1,x:0,z:-6};
 assert.equal(botShouldUseDefense(world,1,[owner,defender]),false,'a bot does not defend against its own projectile');
 world.defenseSlots[1]=false;world.objects[0]={...world.objects[0],kind:'direct'};
 assert.equal(botShouldUseDefense(world,1,[owner,defender]),false,'empty reserve slot cannot activate');
});

test('bots use offensive items for a target, a pursuer or a moving kart, with different patience',()=>{
 selectTrack('stadionring');const world=createItems(2),p=trackPoint(100),front={...gridKart(0),...p,speed:10};
 const forward={x:front.x+Math.sin(p.heading)*24,z:front.z+Math.cos(p.heading)*24};
 let rival={...front,...forward,speed:9};world.slots[0]='direct';world.heldFor[0]=1.3;
 assert.equal(botUsesItem(world,0,[front,rival],1.4),false,'easy bot waits for its longer aim window');
 assert.equal(botUsesItem(world,0,[front,rival],.72),true,'hard bot fires when the rival is aligned');
 rival={...rival,x:rival.x+Math.cos(p.heading)*8,z:rival.z-Math.sin(p.heading)*8};
 assert.equal(botUsesItem(world,0,[front,rival],.72),false,'an unaligned rival is not a blind shot');
 world.slots[0]='trap';world.heldFor[0]=1.3;rival={...front,...trackPoint(90)};
 assert.equal(botUsesItem(world,0,[front,rival]),true,'a close pursuer justifies a trap');
 rival={...front,...trackPoint(60)};
 assert.equal(botUsesItem(world,0,[front,rival]),false,'a distant pursuer does not justify an early trap');
 world.slots[0]='boost';world.heldFor[0]=2;
 assert.equal(botUsesItem(world,0,[{...front,speed:5},rival]),false,'boost waits while nearly stopped');
 assert.equal(botUsesItem(world,0,[{...front,speed:8},rival]),true,'boost is spent during a moving race');
});
