import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart, resolveKartContacts } from '../src/kart-model.ts';
import { TRACK, trackPoint, trackProgress, projectTrack, gridKart, botInput, createRaceProgress, advanceRace } from '../src/track.ts';

test('track progress is continuous around the complete course; inner and outer barriers contain karts',()=>{
  for(let s=0;s<TRACK.length;s+=.5){
    const p=trackPoint(s),actual=trackProgress(p.x,p.z);
    assert.ok(Math.abs(actual-s)<.001,`s=${s} actual=${actual}`);
    for(const lane of [-10,10]){
      const outside=trackPoint(s,lane),safe=projectTrack(outside.x,outside.z);
      assert.equal(safe.kind,'boundary');
      assert.equal(projectTrack(safe.x,safe.z).kind,null);
    }
  }
});
test('five bots complete three laps using the shared kart controller without teleportation',()=>{
  let states=Array.from({length:5},(_,i)=>gridKart(i+1));
  const races=states.map(createRaceProgress);
  for(let step=0;step<60*180;step++){
    states=states.map((s,i)=>advanceKart(s,botInput(s,i+1,states),1/60,projectTrack));
    states=resolveKartContacts(states,projectTrack);
    states.forEach((s,i)=>{advanceRace(races[i],s,step/60);assert.ok(Number.isFinite(s.x+s.z+s.speed));});
  }
  assert.ok(races.every(r=>r.finished),JSON.stringify(races));
});
test('reverse and teleporting across the park cannot grant a completed lap',()=>{
  const state=gridKart(0),race=createRaceProgress(state);
  for(let s=22;s>-30;s-=.2)advanceRace(race,{...state,...trackPoint(s)},1);
  assert.ok(race.distance<=0);
  advanceRace(race,{...state,...trackPoint(250)},2);
  assert.ok(race.distance<=0);assert.equal(race.finished,false);
});
