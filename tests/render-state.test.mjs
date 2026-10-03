import test from 'node:test';
import assert from 'node:assert/strict';
import { initialKartState } from '../src/kart-model.ts';
import { interpolateKart } from '../src/render-state.ts';

test('fixed physics renders constant-speed motion smoothly at 30/60/90/144Hz and uneven frames', () => {
  for (const frames of [30,60,90,144,'uneven']) {
    const step=1/60,speed=18;
    let previous={...initialKartState(),speed},current=previous,accumulator=0,time=0,last;
    for(let i=0;i<120;i++) {
      const delta=frames==='uneven'?[.011,.024,.019,.037][i%4]:1/frames;
      time+=delta;accumulator+=delta;
      while(accumulator>=step) {previous=current;current={...current,z:current.z+speed*step};accumulator-=step;}
      const rendered=interpolateKart(previous,current,accumulator/step);
      if(time>step) assert.ok(Math.abs(rendered.z-speed*(time-step))<1e-9,`motion discontinuity at ${frames}Hz`);
      if(last && time-delta>step) assert.ok(Math.abs((rendered.z-last)/delta-speed)<1e-8);
      last=rendered.z;
    }
  }
});
test('visual interpolation preserves authoritative state, discrete hits and shortest-angle turns', () => {
  const previous={...initialKartState(),heading:Math.PI-.1,z:1};
  const current={...initialKartState(),heading:-Math.PI+.1,z:2,height:.2,impactRemaining:.15,impactKind:'kart'};
  const frozen=JSON.stringify([previous,current]);
  const rendered=interpolateKart(previous,current,.5);
  assert.equal(rendered.z,1.5);assert.equal(rendered.height,.1);
  assert.ok(Math.abs(rendered.heading-Math.PI)<1e-9);
  assert.equal(rendered.impactRemaining,.15);assert.equal(rendered.impactKind,'kart');
  assert.equal(JSON.stringify([previous,current]),frozen);
});
test('recovery snaps directly instead of smearing through course boundaries', () => {
  const previous=initialKartState(),current={...previous,x:30,z:10};
  assert.equal(interpolateKart(previous,current,.2),current);
});
