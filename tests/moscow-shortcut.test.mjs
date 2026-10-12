import assert from 'node:assert/strict';
import test from 'node:test';
import { BOOST_PADS, SHORTCUT, TRACKS } from '../src/track-layout.ts';
import { BOT_STYLES, SHORTCUT_LENGTH, advanceRace, applySurfaceDrag, boostPadAt, botInput, createRaceProgress, gridKart, hazardAt, inShortcut, projectTrack, selectTrack, setBotStyles, shortcutLocate, shortcutPoint, TRACK } from '../src/track.ts';
import { KART_TUNING, advanceKart } from '../src/kart-model.ts';

test('Moscow rough shortcut offers one reachable mid-route boost without removing its speed-risk tradeoff', () => {
  selectTrack('moscow');
  try {
    const layout = TRACKS.moscow;
    assert.equal(layout.shortcut.speedCap, 15);
    assert.ok(layout.shortcut.to - layout.shortcut.from - SHORTCUT_LENGTH > 50, 'the fixed cut still saves a meaningful distance');
    assert.deepEqual(layout.shortcut.boostPads, [[.52, 0]], 'one authored boost sits around the middle of the gravel cut');
    const [start, lane] = SHORTCUT.boostPads[0];
    const point = shortcutPoint(start * SHORTCUT_LENGTH + 3, lane);
    assert.ok(inShortcut(point.x, point.z), 'the boost is inside the shortcut rather than on the adjacent main road');
    assert.equal(boostPadAt(point.x, point.z), BOOST_PADS.length, 'the runtime classifies it as the first shortcut boost');
    assert.equal(hazardAt(point.x, point.z), null, 'the boost is not placed in a fall volume');
  } finally {
    selectTrack('stadionring');
  }
});

test('slow: Moscow shortcut edge line offers a fair choice against the broken centre and pays back its risk', () => {
  selectTrack('moscow');
  const dt=1/60;
  const run=(takesShortcut,shortcutBoost,shortcutLane=0)=>{
    setBotStyles([undefined,{...BOT_STYLES[1],shortcut:takesShortcut,shortcutLane}]);
    let state=gridKart(1),cooldown=0,shortcutHits=0,sawShortcut=false,sawDryEdge=false;
    const race=createRaceProgress(state);
    for(let step=0;step<60*300*TRACK.length/891&&!race.finished;step++){
      state=advanceKart(state,botInput(state,1,[state]),dt,projectTrack);
      state=applySurfaceDrag(state,dt);
      sawShortcut ||= inShortcut(state.x,state.z);
      if(inShortcut(state.x,state.z)){const lane=shortcutLocate(state.x,state.z).lane;sawDryEdge ||= Math.abs(lane)>2.15&&shortcutLocate(state.x,state.z).u>=45&&shortcutLocate(state.x,state.z).u<=180;}
      cooldown=Math.max(0,cooldown-dt);
      const pad=boostPadAt(state.x,state.z);
      if(cooldown===0&&state.grounded&&pad>=0&&(shortcutBoost||pad<BOOST_PADS.length)){
        state={...state,turboRemaining:Math.max(state.turboRemaining,KART_TUNING.turboDuration),speed:Math.min(KART_TUNING.maxTurboSpeed,Math.max(state.speed,0)+KART_TUNING.turboSpeedBonus)};
        cooldown=1.2;
        if(pad>=BOOST_PADS.length)shortcutHits++;
      }
      advanceRace(race,state,step*dt);
    }
    return {finished:race.finished,time:race.finishTime,shortcutHits,sawShortcut,sawDryEdge};
  };
  try{
    const main=run(false,true),shortcutWithoutPad=run(true,false),shortcutWithPad=run(true,true),shortcutEdge=run(true,true,2.4);
    assert.equal(main.finished,true);assert.equal(shortcutWithoutPad.finished,true);assert.equal(shortcutWithPad.finished,true);assert.equal(shortcutEdge.finished,true);
    assert.equal(shortcutWithoutPad.shortcutHits,0);assert.equal(shortcutWithPad.shortcutHits,3,'the authored pad triggers once on each lap');
    assert.equal(shortcutWithoutPad.sawShortcut,true);assert.equal(shortcutWithPad.sawShortcut,true);
    assert.equal(shortcutEdge.sawDryEdge,true,'the alternate bot profile follows the intact side line across the patch');
    assert.ok(shortcutWithPad.time<shortcutWithoutPad.time-.1,`pad benefit ${(shortcutWithoutPad.time-shortcutWithPad.time).toFixed(2)} s`);
    assert.ok(shortcutWithPad.time<main.time-.5,`shortcut advantage ${(main.time-shortcutWithPad.time).toFixed(2)} s over three laps`);
    assert.ok(Math.abs(shortcutEdge.time-shortcutWithPad.time)<=1,`dry edge line stays within ${(Math.abs(shortcutWithPad.time-shortcutEdge.time)).toFixed(2)} s of the boosted centre over three laps`);
  }finally{setBotStyles([]);selectTrack('stadionring')}
});
