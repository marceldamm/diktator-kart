import test from 'node:test';
import assert from 'node:assert/strict';
import {footprintPoints} from '../src/world-placement.ts';
import {selectTrack, shortcutPoint, shortcutLocate, shortcutEdgeGaps, SHORTCUT_LENGTH, inShortcut, trackLocate, TRACK} from '../src/track.ts';

test('placement clearance includes scaled depth and exact rotated far edges',()=>{
 const points=footprintPoints({x:10,z:20,yaw:Math.PI/2,sc:2,sx:1.5},{u0:-2,u1:3,v0:-1,v1:4},2.2);
 for(const [x,z] of [[8,26],[18,26],[8,11],[18,11]])assert.ok(points.some(p=>Math.hypot(p[0]-x,p[1]-z)<1e-8));
 assert.ok(points.every(([x,z])=>x>=8-1e-8&&x<=18+1e-8&&z>=11-1e-8&&z<=26+1e-8));
});

test('shortcut endpoint extension is not a phantom drivable corridor',()=>{
 for(const id of ['stadionring','duce-drom','havanna','pyongyang','moscow','beijing']){
  selectTrack(id); const end=shortcutPoint(SHORTCUT_LENGTH),far={x:end.x+Math.sin(end.heading)*2000,z:end.z+Math.cos(end.heading)*2000};
  assert.ok(shortcutLocate(far.x,far.z).distance>1000,id);
  assert.ok(Math.abs(trackLocate(far.x,far.z).lane)>TRACK.halfWidth,id);
  assert.equal(inShortcut(far.x,far.z),false,id);
  assert.ok(shortcutLocate(shortcutPoint(SHORTCUT_LENGTH*.5).x,shortcutPoint(SHORTCUT_LENGTH*.5).z).distance<1e-8,id);
 }
 selectTrack('stadionring');
});

test('Beijing shortcut exit opens the outer barrier it crosses',()=>{
 selectTrack('beijing');
 const p=shortcutPoint(SHORTCUT_LENGTH*.8),s=trackLocate(p.x,p.z).s;
 assert.ok(shortcutEdgeGaps(TRACK.halfWidth+1.2).some(([a,b])=>s>=a&&s<=b));
 assert.ok(!shortcutEdgeGaps(TRACK.halfWidth+1.2).some(([a,b])=>95>=a&&95<=b),'start straight barrier remains');
 selectTrack('stadionring');
});
