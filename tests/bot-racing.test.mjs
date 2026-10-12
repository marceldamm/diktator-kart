import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceKart,resolveKartContacts} from '../src/kart-model.ts';
import {TRACK,selectTrack,setBotSkill,setBotStyles,BOT_STYLES,botInput,gridKart,createRaceProgress,advanceRace,projectTrack,trackHeightAt,applySurfaceDrag,trackPoint} from '../src/track.ts';
import {createItems,botUsesItem,botItemDirection,botShouldHoldItemAsShield,stepItems} from '../src/items.ts';
import {createDamage,stepDamage} from '../src/damage.ts';

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

test('bots hold their current item only for an incoming projectile from behind',()=>{
 selectTrack('stadionring');const world=createItems(2),owner=gridKart(0),defender={...gridKart(1),x:0,z:0,heading:0,travelHeading:0,speed:0};
 world.slots[1]='direct';
 world.objects=[{id:1,kind:'direct',owner:0,x:0,z:-6,heading:0,age:.1,remaining:2,target:null}];
 assert.equal(botShouldHoldItemAsShield(world,1,[owner,defender]),true,'straight incoming shot crosses the kart from behind');
 world.objects[0]={...world.objects[0],x:4};
 assert.equal(botShouldHoldItemAsShield(world,1,[owner,defender]),false,'nearby side shot passes outside the rear zone');
 world.objects[0]={...world.objects[0],kind:'trap',x:0};
 assert.equal(botShouldHoldItemAsShield(world,1,[owner,defender]),false,'stationary trap cannot consume the held item');
 world.objects[0]={...world.objects[0],kind:'homing',x:-12,z:0,target:1};
 assert.equal(botShouldHoldItemAsShield(world,1,[owner,defender]),false,'a homing projectile from the side is not a rear threat');
 world.objects[0]={...world.objects[0],kind:'direct',x:0,z:-6};
 assert.equal(botShouldHoldItemAsShield(world,1,[owner,{...defender,heading:Math.PI,travelHeading:Math.PI}]),false,'a shot in front is not a rear threat');
 world.objects[0]={...world.objects[0],owner:1,x:0,z:-6,heading:0};
 assert.equal(botShouldHoldItemAsShield(world,1,[owner,defender]),false,'a bot does not defend against its own projectile');
 world.slots[1]=null;world.objects[0]={...world.objects[0],owner:0};
 assert.equal(botShouldHoldItemAsShield(world,1,[owner,defender]),false,'empty item slot cannot protect');
});

test('a threatened bot keeps its offensive item and consumes it to block the rear shot',()=>{
 selectTrack('stadionring');const world=createItems(2),owner=gridKart(0),point=trackPoint(100),defender={...gridKart(1),...point,travelHeading:point.heading,speed:0};
 world.slots[1]='direct';world.heldFor[1]=2;
 world.objects=[{id:1,kind:'direct',owner:0,x:defender.x-Math.sin(point.heading)*6,z:defender.z-Math.cos(point.heading)*6,heading:point.heading,age:.1,remaining:2,target:null}];
 let karts=[owner,defender];const events=[];
 for(let tick=0;tick<20;tick++){
   const threatened=botShouldHoldItemAsShield(world,1,karts);
   assert.equal(botUsesItem(world,1,karts),false,'bot does not throw the item into an imminent rear hit');
   world.shield=[false,threatened];
   karts=stepItems(world,karts,[false,false],[1,2],1/60);
   events.push(...world.events);
 }
 assert.ok(events.some(event=>event.kind==='block'&&event.kart===1&&event.item==='direct'&&event.owner===0),'the held item catches the rear projectile');
 assert.equal(world.slots[1],null,'the held item is consumed as the shield');
 assert.equal(world.objects.length,0);
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

test('an NPC naturally picks up an item, fires through the normal item loop, and blocks a rear shot',()=>{
 selectTrack('stadionring');
 const ownerPoint=trackPoint(90,0),defenderPoint=trackPoint(100,0),owner={...gridKart(0),...ownerPoint,speed:12,travelHeading:ownerPoint.heading},defender={...gridKart(1),...defenderPoint,speed:12,travelHeading:defenderPoint.heading};
 let karts=[owner,defender];
 const world=createItems(2,516),damage=createDamage(2),dt=1/60;
 world.boxes=[{id:0,x:owner.x,z:owner.z,readyIn:0},{id:1,x:defender.x,z:defender.z,readyIn:.5}];
 const events=[];
 for(let tick=0;tick<240&&!events.some(event=>event.kind==='block');tick++){
   world.shield=karts.map((_,index)=>botShouldHoldItemAsShield(world,index,karts));
   const uses=karts.map((_,index)=>botUsesItem(world,index,karts));
   const directions=karts.map((_,index)=>botItemDirection(world,index,karts));
   const before=karts;
   karts=stepItems(world,karts,uses,[1,2],dt,directions);
   stepDamage(damage,before,karts,dt);
   events.push(...world.events);
 }
 assert.deepEqual(events.filter(event=>event.kind==='pickup').map(event=>event.item),['direct','direct'],'both NPCs obtain their item from normal box pickups');
 assert.ok(events.some(event=>event.kind==='launch'&&event.kart===0&&event.item==='direct'),'the pursuing NPC launches through normal bot item policy');
 assert.ok(events.some(event=>event.kind==='block'&&event.kart===1&&event.owner===0&&event.objectId===1),'the defending NPC consumes its held item against the rear projectile');
 assert.equal(events.some(event=>event.kind==='hit'&&event.kart===1),false,'the blocked shot never hits the defending kart');
 assert.equal(world.slots[1],null,'the held item is consumed once');
 assert.equal(damage.health[1],100,'the defended NPC takes no isolated damage');
 assert.deepEqual(damage.events,[]);
});
