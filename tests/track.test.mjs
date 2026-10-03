import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart, resolveKartContacts } from '../src/kart-model.ts';
import { BUMP_PROGRESS } from '../src/track-layout.ts';
import { TRACK, trackPoint, trackProgress, projectTrack, gridKart, botInput, createRaceProgress, advanceRace, trackHeightAt,rankRace } from '../src/track.ts';

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
test('finish order uses crossing time even if a later kart overshoots farther',()=>{
  const p=(distance,finished,finishTime)=>({last:0,distance,finished,finishTime});
  const progress=[p(1323.5,true,103),p(1323.2,true,98),p(1323.4,true,100),p(1310,false,null)];
  assert.deepEqual(rankRace(progress),[1,2,0,3]);
  assert.deepEqual(rankRace([p(2,false,null),p(2,false,null)]),[0,1]);
});
test('circuit ground profile lifts individual wheels and settles the chassis',()=>{
  const p=trackPoint(BUMP_PROGRESS-6);let s={...gridKart(0),...p,travelHeading:p.heading,speed:8};let highest=0,tilt=0;
  for(let i=0;i<180;i++){s=advanceKart(s,{throttle:1,steering:0},1/60,projectTrack,trackHeightAt);highest=Math.max(highest,...s.wheelGroundHeights);tilt=Math.max(tilt,Math.abs(s.bodyPitch));}
  assert.ok(highest>.2);assert.ok(tilt>.025);assert.ok(Math.abs(s.suspensionOffset)<.01);
});
