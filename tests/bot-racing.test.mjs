import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceKart,resolveKartContacts} from '../src/kart-model.ts';
import {TRACK,selectTrack,setBotSkill,setBotStyles,BOT_STYLES,botInput,gridKart,createRaceProgress,advanceRace,projectTrack,trackHeightAt,applySurfaceDrag,trackPoint} from '../src/track.ts';
import {createItems,botUsesItem,botItemDirection,stepItems} from '../src/items.ts';

test('all difficulty levels complete six courses and produce distinct real race times',()=>{
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
