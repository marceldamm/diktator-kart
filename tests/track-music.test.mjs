import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';import {MUSIC_THEMES} from '../src/music-themes.ts';import {TRACKS} from '../src/track-layout.ts';
test('every playable course has a distinct original loop with bounded level and a clean splice',async()=>{
 assert.deepEqual(Object.keys(MUSIC_THEMES).sort(),Object.keys(TRACKS).sort());const hashes=new Set();
 for(const [id,m]of Object.entries(MUSIC_THEMES)){
  const data=await readFile(`public/assets/audio/${m.file}`);assert.equal(data.toString('ascii',0,4),'RIFF');
  assert.equal(data.readUInt16LE(20),1);assert.equal(data.readUInt16LE(22),1);assert.equal(data.readUInt16LE(34),16);
  const rate=data.readUInt32LE(24),n=data.readUInt32LE(40)/2,samples=Array.from({length:n},(_,i)=>data.readInt16LE(44+i*2)/32768);
  assert.ok(Math.abs(n/rate-32*120/m.bpm)<1/rate,`${id}: complete 32-bar 2/4 form`);
  let sum=0,peak=0,maxDiff=0;
  for(let i=0;i<n;i++){sum+=samples[i]**2;peak=Math.max(peak,Math.abs(samples[i]));if(i)maxDiff=Math.max(maxDiff,Math.abs(samples[i]-samples[i-1]));}
  const rms=Math.sqrt(sum/n),splice=Math.abs(samples[0]-samples[n-1]);
  assert.ok(peak<.9&&rms>.08&&rms<.5,`${id}: usable, unclipped level ${peak}/${rms}`);
  assert.ok(splice<Math.min(.08,maxDiff),`${id}: no isolated loop click ${splice}`);
  assert.ok(samples.slice(-rate/4).some(s=>Math.abs(s)>.03),`${id}: audible tail at the loop boundary`);
  hashes.add(createHash('sha256').update(data).digest('hex'));
  console.log(`${id}: RMS ${rms.toFixed(3)}, peak ${peak.toFixed(3)}, splice ${splice.toFixed(5)}`);
 }
 assert.equal(hashes.size,6,'six different course pieces');
});

test('course switches preserve user audio controls and only resume existing playback',async()=>{
 const previous=globalThis.Audio;let music;
 globalThis.Audio=class{constructor(src){music=this;this.src=src;this.paused=true;this.playbackRate=1;this.playCount=0;}pause(){this.paused=true;}play(){this.paused=false;this.playCount++;return Promise.resolve();}};
 try{
  const {KartAudio}=await import('../src/audio.ts');const audio=new KartAudio();
  audio.setMusicVolume(.27);audio.setMusicTempo(1.07);audio.setTrackMusic('stadionring');
  assert.equal(music.playCount,0,'selecting a course does not bypass the browser gesture');
  await music.play();audio.setTrackMusic('havanna');assert.equal(music.playCount,2);
  assert.equal(music.src,'/assets/audio/music-havana.wav');assert.equal(music.volume,.27);
  assert.equal(music.playbackRate,1.07);assert.equal(music.loop,true);
  audio.setTrackMusic('havanna');assert.equal(music.playCount,2,'same course does not restart');
  audio.setEnabled(false);audio.setTrackMusic('beijing');assert.equal(music.playCount,2);assert.equal(music.muted,true);
  audio.setEnabled(true);assert.equal(music.muted,false);audio.dispose();assert.equal(music.paused,true);
 }finally{globalThis.Audio=previous;}
});
