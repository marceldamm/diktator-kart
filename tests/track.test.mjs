import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart, resolveKartContacts } from '../src/kart-model.ts';
import { BUMP_PROGRESS } from '../src/track-layout.ts';
import { TRACK, trackPoint, trackProgress, projectTrack, gridKart, botInput, createRaceProgress, advanceRace, trackHeightAt,rankRace, inShortcut, shortcutPoint, SHORTCUT_LENGTH, applySurfaceDrag } from '../src/track.ts';
import { SHORTCUT } from '../src/track-layout.ts';

test('track progress is continuous around the complete course; inner and outer barriers contain karts',()=>{
  for(let s=0;s<TRACK.length;s+=.5){
    const p=trackPoint(s),actual=trackProgress(p.x,p.z);
    assert.ok(Math.abs(actual-s)<.001,`s=${s} actual=${actual}`);
    for(const lane of [-10,10]){
      const outside=trackPoint(s,lane);if(inShortcut(outside.x,outside.z))continue;const safe=projectTrack(outside.x,outside.z);
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
  for(let i=0;i<110;i++){s=advanceKart(s,{throttle:1,steering:0},1/60,projectTrack,trackHeightAt);highest=Math.max(highest,...s.wheelGroundHeights);tilt=Math.max(tilt,Math.abs(s.bodyPitch));}
  assert.ok(highest>.2);assert.ok(tilt>.025);assert.ok(Math.abs(s.suspensionOffset)<.01);
});

test('backyard shortcut is open, maps progress monotonically and caps speed without turbo',()=>{
  let last=-Infinity;
  for(let u=0;u<=SHORTCUT_LENGTH;u+=.5){
    const p=shortcutPoint(u);assert.equal(projectTrack(p.x,p.z).kind,null,`blocked at ${u}`);
    const s=trackProgress(p.x,p.z);assert.ok(s>=last-.5,`progress went back at ${u}`);last=s;
  }
  assert.ok(SHORTCUT_LENGTH<SHORTCUT.to-SHORTCUT.from,'shortcut must be shorter than the circuit section');
  const mid=shortcutPoint(SHORTCUT_LENGTH/2),k={...gridKart(0),...mid,speed:15};
  assert.ok(inShortcut(k.x,k.z));assert.ok(applySurfaceDrag(k,1/60).speed<15);
  assert.equal(applySurfaceDrag({...k,turboRemaining:1},1/60).speed,15);
});
