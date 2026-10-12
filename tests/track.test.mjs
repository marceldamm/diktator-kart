import { BOOST_PADS, HAZARDS, RAMP_HEIGHTS, RAMP_LIPS, SHORTCUT, TRACKS } from '../src/track-layout.ts';
import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKart, resolveKartContacts } from '../src/kart-model.ts';
import { BUMP_PROGRESS, CANAL_FROM, CANAL_LENGTH, CRATERS, GRASS_VERGES } from '../src/track-layout.ts';
import { TRACK, selectTrack, atRampLip, rampHeightAt, rampFlightProfile, atSecondLapTrackEvent, playerAtSecondLapTrackEvent, berlinZeppelinWindAt, maleconWavePatchAt, policyJubelPatchAt, eventBelongsToTrackTheme, trackEventLap, trackPoint, trackLocate, trackProgress, projectTrack, gridKart, botInput, createRaceProgress, advanceRace, trackHeightAt, elevationAt, rankRace, inShortcut, shortcutPoint, shortcutSurfaceEffectAt, SHORTCUT_LENGTH, applySurfaceDrag, drivingSurfaceAt, craterAt, craterPitAt, shouldStartCraterFall, overCanal, hazardAt, recoverKart, boostPadAt, PARADE_COLUMN, MOVING_TROLLEY, movingTrolley, paradeActive, paradeVehicles, setParadeClock, startParade, stopParade } from '../src/track.ts';
import { BOT_STYLES, setBotSkill, setBotStyles } from '../src/track.ts';
import { airTrickRoll } from '../src/kart-visuals.ts';

test('track progress is continuous around the complete course; inner and outer barriers contain karts',()=>{
  for(let s=0;s<TRACK.length;s+=.5){
    const p=trackPoint(s),actual=trackProgress(p.x,p.z);
    assert.ok(Math.abs(actual-s)<.001,`s=${s} actual=${actual}`);
    for(const lane of [-10,10]){
      const outside=trackPoint(s,lane);if(inShortcut(outside.x,outside.z)||(lane>0&&HAZARDS.some(h=>s>=h.from-6&&s<=h.to+6)))continue; /* open harbour quay */ const safe=projectTrack(outside.x,outside.z);
      assert.equal(safe.kind,'boundary');
      assert.equal(projectTrack(safe.x,safe.z).kind,null);
    }
  }
});
test('second-lap track events need both lap progress and the announced location',()=>{
  const zones = [['stadionring', 45, 182], ['duce-drom', 970, 1125], ['havanna', 105, 330], ['moscow', 95, 520], ['pyongyang', 1372, 1400], ['beijing', 880, 1040]];
  for (const [id, from, to] of zones) {
    selectTrack(id); const lapTwoEntry = TRACK.length + from - TRACK.start;
    assert.equal(atSecondLapTrackEvent(lapTwoEntry - .01, from, from, to), false, `${id}: first-lap progress cannot trigger`);
    assert.equal(atSecondLapTrackEvent(lapTwoEntry, from - .01, from, to), false, `${id}: wrong course location cannot trigger`);
    assert.equal(atSecondLapTrackEvent(lapTwoEntry, from, from, to), true, `${id}: lap-two entry triggers at its location`);
    assert.equal(atSecondLapTrackEvent(lapTwoEntry + 1, to, from, to), false, `${id}: event stops at the end of its district`);
  }
  selectTrack('stadionring');
});
test('shared line events start at the lap-two course marker even when the player uses the counterline',()=>{
  try {
    for (const {id,from,to} of [{id:'havanna',from:105,to:330},{id:'beijing',from:880,to:1040}]) {
      selectTrack(id);
      const lapTwoEntry=TRACK.length+from-TRACK.start;
      assert.equal(playerAtSecondLapTrackEvent(lapTwoEntry,from,from,to),true,`${id}: course progress starts the shared event`);
    }
    selectTrack('havanna');
    assert.equal(maleconWavePatchAt(200,-1.8),false,'the inland counterline stays clear after the event activates');
    assert.equal(maleconWavePatchAt(200,1.85),true,'the sea-side line still receives the wave effect');
    selectTrack('beijing');
    assert.equal(policyJubelPatchAt(900,3.4),false,'the outer counterline stays clear after the broadcast starts');
    assert.equal(policyJubelPatchAt(900,0),true,'the middle line still receives the broadcast effect');
  } finally { selectTrack('stadionring'); }
});
test('small crowd reactions trigger once at their landmark in each of the three laps',()=>{
  selectTrack('stadionring'); const from=295,to=325, s=from+1;
  const lapDistance=(lap)=>lap*TRACK.length+from-TRACK.start;
  assert.equal(trackEventLap(lapDistance(0),s,from,to),0);
  assert.equal(trackEventLap(lapDistance(0),s,from,to,0),null,'same lap cannot trigger twice');
  assert.equal(trackEventLap(lapDistance(1),s,from,to,0),1);
  assert.equal(trackEventLap(lapDistance(2),s,from,to,1),2);
  assert.equal(trackEventLap(lapDistance(3),s,from,to,2),null,'no extra lap after the finish');
  assert.equal(trackEventLap(lapDistance(1),from-1,from,to,0),null,'off-landmark progress cannot trigger');
  assert.equal(trackEventLap(lapDistance(1),to,from,to,0),null,'end of the landmark is exclusive');
  selectTrack('stadionring');
});
test('Berlin Zeppelin tailwind rewards the outer grandstand line and leaves a counterline',()=>{
  assert.equal(berlinZeppelinWindAt(45,2.5),true);
  assert.equal(berlinZeppelinWindAt(181.99,4),true);
  assert.equal(berlinZeppelinWindAt(182,4),false,'wind stops at the end of the stadium straight');
  assert.equal(berlinZeppelinWindAt(100,2.4),false,'inner line stays free');
  assert.equal(berlinZeppelinWindAt(44.99,4),false,'wind has a fixed start');
});
test('fixed boosts are reachable on all six routes and each authored shortcut pad',()=>{
  const routeCounts = [];
  try {
    for (const id of Object.keys(TRACKS)) {
      selectTrack(id);
      assert.ok(BOOST_PADS.length >= 4, `${id}: enough main-route boost choices to shape its rhythm`);
      routeCounts.push(BOOST_PADS.length);
      for (const [index, [from, lane]] of BOOST_PADS.entries()) {
        assert.ok(from >= 0 && from + 6 <= TRACK.length, `${id}: pad ${index} sits within the authored course`);
        const point = trackPoint(from + 3, lane);
        assert.equal(boostPadAt(point.x, point.z), index, `${id}: main-route pad ${index} is physically reachable`);
        assert.equal(hazardAt(point.x, point.z), null, `${id}: boost pad ${index} does not sit in a fall zone`);
      }
      for (const [index, [start, lane]] of SHORTCUT.boostPads.entries()) {
        const point = shortcutPoint(start * SHORTCUT_LENGTH + 3, lane);
        assert.ok(inShortcut(point.x, point.z), `${id}: shortcut pad ${index} stays inside its alternate route`);
        assert.ok(boostPadAt(point.x, point.z) >= BOOST_PADS.length, `${id}: shortcut pad ${index} is reachable and classified separately`);
      }
    }
    assert.ok(new Set(routeCounts).size > 1, 'courses retain distinct fixed boost counts instead of a copied pattern');
  } finally {
    selectTrack('stadionring');
  }
});
test('every course ramp lip remains drivable and clear of fall volumes',()=>{
  for (const id of Object.keys(TRACKS)) {
    selectTrack(id);
    assert.ok(RAMP_LIPS.length >= 1, `${id}: at least one authored ramp`);
    for (const lip of RAMP_LIPS) {
      const point = trackPoint(lip);
      assert.equal(atRampLip(point.x, point.z), true, `${id}: take-off detector covers lip ${lip}`);
      assert.equal(projectTrack(point.x, point.z).kind, null, `${id}: ramp lip ${lip} is drivable`);
      assert.equal(hazardAt(point.x, point.z), null, `${id}: ramp lip ${lip} does not force a fall`);
    }
  }
  selectTrack('stadionring');
});
test('course ramps use authored small and large heights that match their road and launch profiles',()=>{
  try {
    for (const id of Object.keys(TRACKS)) {
      selectTrack(id);
      assert.equal(RAMP_HEIGHTS.length, RAMP_LIPS.length, `${id}: each lip has an authored height`);
      assert.ok(RAMP_HEIGHTS.every((height) => height >= .5 && height <= 2.5), `${id}: ramp heights stay within the readable 0.5–2.5 m range`);
      for (const [index, lip] of RAMP_LIPS.entries()) {
        const point = trackPoint(lip);
        assert.equal(rampHeightAt(point.x, point.z), RAMP_HEIGHTS[index], `${id}: lip ${lip} selects its own take-off height`);
        assert.ok(Math.abs(trackHeightAt(point.x, point.z) - elevationAt(lip) - RAMP_HEIGHTS[index]) < .02, `${id}: road and ramp surface meet at lip ${lip}`);
      }
      if (RAMP_HEIGHTS.length > 1) assert.ok(Math.max(...RAMP_HEIGHTS) - Math.min(...RAMP_HEIGHTS) >= .6, `${id}: small and large ramps create a meaningful choice`);
    }
  } finally {
    selectTrack('stadionring');
  }
});
test('Berlin outer-line kicker jumps through the shortcut entrance and lands inside its return route',()=>{
  selectTrack('stadionring');
  const takeoff = trackPoint(RAMP_LIPS[1], -5.8), height = rampHeightAt(takeoff.x, takeoff.z);
  assert.equal(height, RAMP_HEIGHTS[1]);
  assert.equal(projectTrack(takeoff.x, takeoff.z).kind, null, 'the authored outer launch line is reachable while grounded');
  const unrelatedWall = trackPoint(850, -12);
  assert.equal(projectTrack(unrelatedWall.x, unrelatedWall.z, true).kind, 'boundary', 'other airborne shortcuts remain blocked');
  const flight = rampFlightProfile(19, height);
  let state = { ...gridKart(0), x: takeoff.x, z: takeoff.z, heading: takeoff.heading, travelHeading: takeoff.heading,
    speed: 19, height: trackHeightAt(takeoff.x, takeoff.z), grounded: false, jumpRemaining: flight.duration,
    jumpDuration: flight.duration, jumpStart: 1, jumpPeak: flight.peak };
  let enteredShortcut = false;
  for (let step = 0; step < Math.ceil(flight.duration * 60); step++) {
    state = advanceKart(state, { throttle: 0, steering: -.1 }, 1 / 60, projectTrack, trackHeightAt);
    state = resolveKartContacts([state], projectTrack)[0];
    enteredShortcut ||= inShortcut(state.x, state.z);
  }
  assert.equal(enteredShortcut, true, 'the jump clears the outer barrier into the alley');
  assert.equal(state.grounded, true, 'the landing completes before the shortcut exit');
  assert.equal(inShortcut(state.x, state.z), true, 'the kart lands on the authored alternate route');
  assert.equal(projectTrack(state.x, state.z).kind, null, 'the shortcut catches and supports the landing');
  assert.equal(hazardAt(state.x, state.z), null, 'the landing avoids the water/fall zone');
  const entry = trackProgress(state.x, state.z), exit = shortcutPoint(SHORTCUT_LENGTH);
  assert.ok(entry > SHORTCUT.from && entry < SHORTCUT.to);
  assert.equal(projectTrack(exit.x, exit.z).kind, null, 'the existing route merges back into the circuit');
  assert.ok(Math.abs(trackLocate(exit.x, exit.z).s - SHORTCUT.to) < 2, 'shortcut exit returns at the intended lap progress');
});
test('Berlin risk-taking bot follows the authored ramp approach and lands safely in the shortcut',()=>{
  selectTrack('stadionring');setBotSkill(1);setBotStyles([undefined,BOT_STYLES[4]]);
  try {
    const approach=trackPoint(470,0);let state={...gridKart(1),...approach,travelHeading:approach.heading,speed:19};
    let launched=false,enteredFromRamp=false,landed=false;
    for(let tick=0;tick<240;tick++) {
      if((state.jumpRemaining??0)===0&&state.speed>3&&atRampLip(state.x,state.z)&&state.height<rampHeightAt(state.x,state.z)+.25) {
        const flight=rampFlightProfile(state.speed,rampHeightAt(state.x,state.z));
        state={...state,hopRemaining:0,jumpRemaining:flight.duration,jumpDuration:flight.duration,jumpStart:1,jumpPeak:flight.peak};launched=true;
      }
      state=advanceKart(state,botInput(state,1,[state]),1/60,projectTrack,trackHeightAt);
      state=resolveKartContacts([state],projectTrack)[0];
      if(launched&&inShortcut(state.x,state.z))enteredFromRamp=true;
      if(enteredFromRamp&&state.grounded&&(state.jumpRemaining??0)===0){landed=true;break;}
    }
    assert.equal(launched,true,'the authored bot reaches and launches from the ramp lip');
    assert.equal(enteredFromRamp,true,'the airborne bot clears the designated shortcut-entry wall');
    assert.equal(landed,true,'the bot lands before the shortcut exit');
    assert.equal(inShortcut(state.x,state.z),true,'the bot keeps the shortcut route at touchdown');
    assert.equal(projectTrack(state.x,state.z).kind,null,'the landing is on a supported race surface');
    assert.equal(hazardAt(state.x,state.z),null,'the shortcut landing avoids fall zones');
  } finally {
    setBotStyles([]);setBotSkill(1);selectTrack('stadionring');
  }
});
test('course events belong only to their named course across every circuit theme',()=>{
  const routes={zeppelin:'berlin',wave:'havana',balcony:'rome',jubel:'beijing',parade:'moscow',column:'pyongyang'};
  const themes=Object.values(routes);
  for(const [event,home] of Object.entries(routes))for(const theme of themes)
    assert.equal(eventBelongsToTrackTheme(theme,event),theme===home,`${event} must stay on ${home}, not ${theme}`);
});
test('A76 Moscow trolley moves across lines and uses the shared obstacle projection',()=>{
  selectTrack('moscow');stopParade();
  try {
    setParadeClock(0);const start=movingTrolley();assert.ok(start);assert.equal(start.s,MOVING_TROLLEY.s);assert.ok(Math.abs(start.lane)<1e-9);
    const centre=trackPoint(start.s,start.lane);assert.equal(projectTrack(centre.x,centre.z).kind,'obstacle','the moving prop has real shared collision');
    const clear=trackPoint(start.s,TRACK.halfWidth-2);assert.equal(projectTrack(clear.x,clear.z).kind,null,'a broad outer passing lane remains open');
    setParadeClock(MOVING_TROLLEY.period/4);const crossing=movingTrolley();assert.ok(crossing);assert.ok(Math.abs(crossing.lane-MOVING_TROLLEY.laneAmplitude)<1e-8,'the trolley reaches the opposite line on its period');
    const moved=trackPoint(crossing.s,crossing.lane);assert.equal(projectTrack(moved.x,moved.z).kind,'obstacle');
    setParadeClock(0);const approach=trackPoint(MOVING_TROLLEY.s-20,0),bot={...gridKart(1),...approach,travelHeading:approach.heading,speed:15};
    assert.ok(Math.abs(botInput(bot,1,[bot]).steering)>.1,'the standard bot controller begins choosing a passing line before contact');
    selectTrack('stadionring');assert.equal(movingTrolley(),null,'the pilot belongs only to its authored course');
  } finally { setParadeClock(0);stopParade();selectTrack('stadionring'); }
});
test('Moscow shortcut has a fixed broken centre line with faster dry edges and a shared mild penalty',()=>{
  selectTrack('moscow');
  try {
    const centre=shortcutPoint(100,0), edge=shortcutPoint(100,2.5), main=trackPoint(100,0);
    assert.equal(shortcutSurfaceEffectAt(centre.x,centre.z),'broken-parade');
    assert.equal(shortcutSurfaceEffectAt(edge.x,edge.z),null,'the narrow outside line stays intact');
    assert.equal(shortcutSurfaceEffectAt(main.x,main.z),null,'the patch remains shortcut-only');
    const kart=gridKart(0),dt=1/60,speed=8;
    const onCentre=applySurfaceDrag({...kart,x:centre.x,z:centre.z,speed,grounded:true,turboRemaining:0},dt);
    const onEdge=applySurfaceDrag({...kart,x:edge.x,z:edge.z,speed,grounded:true,turboRemaining:0},dt);
    assert.ok(onEdge.speed-onCentre.speed>.007,'the broken centre has a small, measurable fixed cost');
    const boostedCentre=applySurfaceDrag({...kart,x:centre.x,z:centre.z,speed,turboRemaining:1},dt);
    const boostedEdge=applySurfaceDrag({...kart,x:edge.x,z:edge.z,speed,turboRemaining:1},dt);
    assert.ok(Math.abs(boostedCentre.speed-boostedEdge.speed)<1e-9,'turbo carries every kart through the broken surface at the same speed');
  } finally { selectTrack('stadionring'); }
});
test('Pyongyang parade starts clear of the kart that naturally triggers the lap-two event',()=>{
  selectTrack('pyongyang');
  try {
    const approach=trackPoint(1368.96,1.68);
    assert.equal(projectTrack(approach.x,approach.z).kind,null,'the sampled player line is clear before the event');
    startParade(100);setParadeClock(100);
    assert.equal(projectTrack(approach.x,approach.z).kind,null,'spawning the parade must not hit the triggering kart');
    const vehicles=paradeVehicles();
    assert.equal(vehicles.length,4,'the full parade is staged ahead at event start');
    assert.ok(Math.min(...vehicles.map(v=>v.s))-1368.96>=30,'the rear vehicle starts at least 30 m ahead of the trigger position');
    for(const lane of [-1.8,0,1.68,3.4]) {
      const kart=trackPoint(1368.96,lane);
      assert.equal(projectTrack(kart.x,kart.z).kind,null,`triggering line ${lane} must stay clear`);
    }
    const field=[
      trackPoint(1368.96,1.68), trackPoint(1429.8,3.4), trackPoint(1494.6,-2),
      trackPoint(1720,-15), trackPoint(1815,-.1), trackPoint(1325,-2.3),
    ];
    stopParade();startParade(100,field);setParadeClock(100);
    assert.ok(paradeVehicles().length>=2,'the parade still stages several vehicles in its boulevard');
    const triggerS=trackLocate(field[0].x,field[0].z).s,rearGap=Math.min(...paradeVehicles().map(v=>v.s))-triggerS;
    assert.ok(rearGap>=30,'the rear of the column keeps 30 m clearance ahead of the triggering kart');
    assert.ok(rearGap<120,`the column uses the closest safe gap instead of starting far ahead (${rearGap.toFixed(1)} m)`);
    for(const kart of field) assert.equal(projectTrack(kart.x,kart.z).kind,null,'deployment checks every current racer before choosing its starting gap');
    setParadeClock(114.99);assert.ok(paradeVehicles().length>=2,'the convoy remains present until its 15-second window ends');
    setParadeClock(115);assert.equal(paradeActive(),false,'the physical event ends at 15 seconds');assert.equal(paradeVehicles().length,0,'no parade collision objects remain after expiry');
  } finally {
    stopParade();selectTrack('stadionring');
  }
});
test('a bot leader cannot consume the course event before the player enters lap two',()=>{
  const s=100;
  const playerBeforeLapTwo=TRACK.length+45-TRACK.start-1;
  const playerAtLapTwo=TRACK.length+45-TRACK.start;
  assert.equal(playerAtSecondLapTrackEvent(playerBeforeLapTwo,s,45,182),false);
  assert.equal(playerAtSecondLapTrackEvent(playerAtLapTwo,s,45,182),true);
});
test('canal rescue places a fallen kart beyond the water without awarding progress',()=>{
  const fallen={...gridKart(0),...trackPoint(CANAL_FROM+CANAL_LENGTH/2)};
  assert.equal(overCanal(fallen.x,fallen.z),true);
  const rescued=recoverKart(fallen,[fallen]);
  const progress=trackProgress(rescued.x,rescued.z);
  assert.equal(overCanal(rescued.x,rescued.z),false);
  assert.ok(progress>=CANAL_FROM+CANAL_LENGTH+2,`rescued progress ${progress} should be clear of the landing edge`);
  assert.ok(Math.abs(progress-trackProgress(fallen.x,fallen.z))>=3,`rescue gap ${progress-trackProgress(fallen.x,fallen.z)} must not be awarded as race progress`);
});
test('practice craters have an outer jolt zone and a deep fall bowl with a safe same-progress recovery',()=>{
  const [s,lane,r]=CRATERS[0],center=trackPoint(s,lane),rim=trackPoint(s,lane+r*.72);
  assert.equal(craterAt(center.x,center.z),0); assert.equal(craterPitAt(center.x,center.z),0);
  assert.equal(craterAt(rim.x,rim.z),0); assert.equal(craterPitAt(rim.x,rim.z),-1);
  assert.equal(shouldStartCraterFall(center.x,center.z,true,0),true);
  assert.equal(shouldStartCraterFall(center.x,center.z,false,0),false);
  assert.equal(shouldStartCraterFall(center.x,center.z,true,1),false);
  assert.equal(shouldStartCraterFall(rim.x,rim.z,true,0),false);
  const fallen={...gridKart(0),...center,speed:12};
  const rescued=recoverKart(fallen,[fallen]);
  assert.equal(craterPitAt(rescued.x,rescued.z),-1); assert.equal(projectTrack(rescued.x,rescued.z).kind,null);
  assert.ok(Math.abs(trackProgress(rescued.x,rescued.z)-trackProgress(fallen.x,fallen.z))<.02,'recovery changes lane but awards no progress');
});
test('loose surfaces have distinct shared speed/grip response and grass is reachable on marked verge',()=>{
  const gravel=shortcutPoint(SHORTCUT_LENGTH/2),fast={...gridKart(0),...gravel,speed:14,yawRate:1};
  const gravelResult=applySurfaceDrag(fast,1/60); assert.equal(drivingSurfaceAt(fast.x,fast.z),'gravel');
  assert.ok(gravelResult.speed<fast.speed); assert.ok(gravelResult.yawRate<fast.yawRate);
  const [from,to,minLane,maxLane]=GRASS_VERGES[0],grass=trackPoint((from+to)/2,(minLane+maxLane)/2),onGrass={...fast,...grass};
  const grassResult=applySurfaceDrag(onGrass,1/60); assert.equal(drivingSurfaceAt(onGrass.x,onGrass.z),'grass');
  assert.ok(grassResult.speed<onGrass.speed); assert.ok(grassResult.yawRate<onGrass.yawRate);
  assert.equal(applySurfaceDrag({...onGrass,grounded:false},1/60).speed,onGrass.speed);
});
test('air trick supplies one shared body and wheel roll over the jump duration',()=>{
  assert.equal(airTrickRoll(false,.5,1),0);
  assert.equal(airTrickRoll(true,1,1),0);
  assert.ok(Math.abs(airTrickRoll(true,.5,1)-Math.PI)<1e-10);
  assert.equal(airTrickRoll(true,0,1),0); // the completed full turn resets to the same forward pose.
  assert.equal(airTrickRoll(true,.5,0),0);
});
test('slow: five bots complete three laps using the shared kart controller without teleportation',()=>{
  let states=Array.from({length:5},(_,i)=>gridKart(i+1));
  const races=states.map(createRaceProgress);
  for(let step=0;step<60*270*TRACK.length/891;step++){ // time budget scales with lap length (891 m base)
    states=states.map((s,i)=>advanceKart(s,botInput(s,i+1,states),1/60,projectTrack));
    states=resolveKartContacts(states,projectTrack);
    states.forEach((s,i)=>{advanceRace(races[i],s,step/60);assert.ok(Number.isFinite(s.x+s.z+s.speed));});
  }
  assert.ok(races.every(r=>r.finished),JSON.stringify(races));
});
test('bot drifters release before cutting into the inside barrier on three curves',()=>{
  const curves=[{s:1210,sign:-1},{s:333.52,sign:-1},{s:679.78,sign:1}];
  for(const curve of curves)for(const speed of [9,12,15]){
    const p=trackPoint(curve.s-10,0);let state={...gridKart(0),...p,travelHeading:p.heading,speed};
    let maxInside=-Infinity,driftSeconds=0;
    for(let frame=0;frame<300;frame++){
      const lane=trackLocate(state.x,state.z).lane;maxInside=Math.max(maxInside,lane*curve.sign);
      state=advanceKart(state,botInput(state,0,[state]),1/60,projectTrack,trackHeightAt);
      if(state.drifting)driftSeconds+=1/60;
    }
    assert.ok(driftSeconds>.35,`drift remains available at s=${curve.s}, speed=${speed}: ${driftSeconds}`);
    assert.ok(maxInside<5.8,`bot should release before the inside barrier at s=${curve.s}, speed=${speed}: lane=${maxInside}`);
    assert.notEqual(state.impactKind,'boundary');
  }
});
test('designated bot takes the backyard alley and finishes without losing mapped progress',()=>{
  let state=gridKart(3),sawAlley=false;const race=createRaceProgress(state);
  for(let step=0;step<60*270*TRACK.length/891;step++){
    state=advanceKart(state,botInput(state,3,[state]),1/60,projectTrack);
    sawAlley ||= inShortcut(state.x,state.z);
    advanceRace(race,state,step/60);
    assert.ok(Number.isFinite(state.x+state.z+state.speed));
  }
  assert.ok(sawAlley,'designated bot should use the backyard alley');
  assert.ok(race.finished,'shortcut progress should still complete three laps');
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
