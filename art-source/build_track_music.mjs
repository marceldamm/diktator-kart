// Six original fictional 32-bar course pieces, composed and synthesized for Diktator Kart.
// Brass/fife/snare family follows build_march.mjs; new melodies, harmony and course instrumentation.
// No recordings, external samples, anthems or quotations. Circular tails/reflections make full musical loops.
// Run: node art-source/build_track_music.mjs
import {writeFileSync} from 'node:fs';
import {MUSIC_THEMES} from '../src/music-themes.ts';
const RATE=22050,hz=m=>440*2**((m-69)/12);
const SCORES={
 stadionring:{root:58,scale:[0,2,4,5,7,9,11],lead:'fife',chords:[0,0,3,4,5,3,4,0],a:[[0,2,4,2],[1,3,5,4],[3,4,5,3],[2,1,4,1],[5,4,2,0],[3,2,1,3],[4,6,5,1],[2,1,0,4]],b:[[7,5,4,3],[2,4,6,4],[5,3,2,1],[0,2,4,2],[3,5,7,5],[6,4,2,1],[3,2,1,4],[2,1,0,4]]},
 'duce-drom':{root:62,scale:[0,2,4,5,7,9,11],lead:'strings',chords:[0,3,0,4,5,3,4,0],a:[[4,2,0,2],[3,5,4,3],[2,4,6,4],[5,4,1,2],[7,6,5,4],[3,5,7,5],[6,4,2,1],[2,1,0,4]],b:[[7,7,5,4],[6,5,3,2],[4,6,7,4],[5,3,1,2],[3,4,5,7],[6,4,3,5],[4,2,1,4],[2,1,0,4]]},
 havanna:{root:60,scale:[0,2,4,5,7,9,10],lead:'wood',chords:[0,3,0,4,5,3,4,0],a:[[0,4,2,5],[3,1,5,4],[2,4,6,5],[4,1,3,2],[5,7,4,2],[3,5,1,4],[6,4,1,2],[0,2,4,4]],b:[[7,5,4,2],[3,6,5,3],[2,4,7,6],[5,4,2,1],[0,2,5,7],[5,3,1,4],[6,4,2,1],[2,1,0,4]]},
 pyongyang:{root:65,scale:[0,2,3,5,7,8,10],lead:'brass',chords:[0,0,5,4,3,0,4,0],a:[[0,0,4,2],[1,3,1,4],[5,3,2,0],[4,2,1,1],[3,3,5,4],[2,4,2,0],[4,6,5,1],[2,1,0,4]],b:[[7,4,5,3],[2,0,2,4],[5,7,5,3],[4,1,2,1],[3,5,7,5],[4,2,0,3],[6,4,2,1],[2,1,0,4]]},
 moscow:{root:62,scale:[0,2,3,5,7,8,11],lead:'bell',chords:[0,5,3,4,0,3,4,0],a:[[0,4,2,0],[5,3,1,2],[3,5,7,5],[4,2,1,4],[2,4,7,5],[3,2,0,3],[6,4,2,1],[2,1,0,4]],b:[[7,5,3,2],[5,7,5,3],[4,2,0,2],[1,4,6,4],[3,5,7,5],[4,2,3,0],[6,4,2,1],[2,1,0,4]]},
 beijing:{root:67,scale:[0,2,4,7,9],lead:'metal',chords:[0,2,0,3,4,2,3,0],a:[[0,2,3,1],[2,4,3,2],[1,3,4,2],[3,1,0,1],[4,3,2,0],[2,4,1,3],[3,2,1,4],[2,1,0,3]],b:[[5,3,4,2],[1,3,5,4],[2,4,3,1],[0,2,3,2],[4,5,3,2],[1,4,2,3],[4,3,1,2],[2,1,0,3]]},
};
for(const [id,score] of Object.entries(SCORES)){
 const meta=MUSIC_THEMES[id],eighth=30/meta.bpm,barLength=eighth*4,length=Math.round(32*barLength*RATE),dry=new Float32Array(length);
 let seed=733+score.root;const rand=()=>((seed=seed*16807%2147483647)/2147483647-.5);
 const put=(i,v)=>{dry[((i%length)+length)%length]+=v;};
 const note=(degree,octave=0)=>score.root+score.scale[((degree%score.scale.length)+score.scale.length)%score.scale.length]+12*(Math.floor(degree/score.scale.length)+octave);
 function tone(m,start,duration,gain,kind='brass'){
  const f=hz(kind==='fife'?m+12:m),startSample=Math.round(start*RATE),tail=kind==='bell'||kind==='metal'?.55:kind==='strings'||kind==='wood'?.18:.07;
  const total=Math.round((duration+tail)*RATE),harmonics=Math.min(14,Math.floor(6200/f));
  for(let i=0;i<total;i++){
   const t=i/RATE,attack=Math.min(1,t/(kind==='brass'?.025:.012)),release=t>duration?Math.max(0,1-(t-duration)/tail):1;
   const phase=2*Math.PI*f*t;let v=0;
   if(kind==='fife')v=Math.sin(phase+.004*Math.sin(t*37))+.16*Math.sin(phase*2)+rand()*.035;
   else if(kind==='bell'||kind==='metal')v=(Math.sin(phase)+.35*Math.sin(phase*2.01)+.14*Math.sin(phase*3.94))*Math.exp(-t*(kind==='bell'?2.3:5));
   else if(kind==='wood'||kind==='strings')v=(Math.sin(phase)+.3*Math.sin(phase*2)+.12*Math.sin(phase*3))*Math.exp(-t*(kind==='wood'?8:5));
   else for(let h=1;h<=harmonics;h++)v+=(Math.sin(phase*h)+.45*Math.sin(phase*h*1.0022))*Math.exp(-(h-1)/4)/h**.55;
   put(startSample+i,v*gain*attack*release);
  }
 }
 function percussion(start,gain,kind){
  const startSample=Math.round(start*RATE),duration=kind==='gong'?1.3:.32;let lo=0;
  for(let i=0;i<duration*RATE;i++){
   const t=i/RATE,n=rand()*2;lo+=(n-lo)*.72;
   const v=kind==='kick'?Math.sin(2*Math.PI*(48+32*Math.exp(-t*25))*t)*Math.exp(-t*9):
    kind==='wood'?Math.sin(2*Math.PI*740*t)*Math.exp(-t*70):
    kind==='gong'?(Math.sin(t*2*Math.PI*91)+.4*Math.sin(t*2*Math.PI*139))*Math.exp(-t*3):
    (lo+.3*Math.sin(t*2*Math.PI*185))*Math.exp(-t*24);
   put(startSample+i,v*gain*Math.min(1,t/.003));
  }
 }
 for(let bar=0;bar<32;bar++){
  const t=bar*barLength,chord=score.chords[bar%8],melody=(bar>=16&&bar<24?score.b:score.a)[bar%8],trio=bar>=16&&bar<24;
  for(const beat of [0,2]){
   tone(note(chord+beat/2*4,-2),t+beat*eighth,eighth*.83,.2,'brass');
   percussion(t+beat*eighth,.3,'kick');
  }
  for(const off of [1,3])for(const degree of [chord,chord+2,chord+4])tone(note(degree,-1),t+off*eighth,eighth*.42,trio?.045:.065,'brass');
  const rhythm=id==='havanna'?[1.5,.5,1.5,.5]:bar%4===3?[1,1,1,1]:[1.5,.5,1,1];
  let at=t;
  melody.forEach((degree,i)=>{
   const duration=rhythm[i]*eighth*.82;
   tone(note(degree),at,duration,trio?.18:.15,score.lead);
   if(score.lead!=='brass')tone(note(degree,-1),at,duration,trio?.07:.1,'brass');
   if(bar>=24&&id!=='beijing')tone(note(degree,1),at,duration,.035,'fife');
   at+=rhythm[i]*eighth;
  });
  const cadence=id==='havanna'?[1,0,.35,.7,0,.7,0,.5]:[1,0,.4,.5,.9,0,.4,.6];
  cadence.forEach((g,i)=>{if(g)percussion(t+i*eighth/2,g*(trio?.1:.16),'snare');});
  if(id==='havanna')for(const sixteenth of (bar%2?[2,5]:[0,3,6]))percussion(t+sixteenth*eighth/2,.13,'wood');
  if(id==='beijing'&&bar%8===0)percussion(t,.12,'gong');
  if(id==='moscow'&&bar%4===0)tone(note(chord,-1),t,eighth*2,.13,'bell');
 }
 const mix=new Float32Array(length);let peak=0;
 for(let i=0;i<length;i++){
  let wet=0;for(const [ms,g]of [[23,.22],[41,.16],[67,.1]])wet+=dry[(i-Math.round(ms*RATE/1000)+length)%length]*g;
  mix[i]=Math.tanh((dry[i]+wet)*1.25);peak=Math.max(peak,Math.abs(mix[i]));
 }
 const pcm=Buffer.alloc(44+length*2);pcm.write('RIFF');pcm.writeUInt32LE(36+length*2,4);pcm.write('WAVEfmt ',8);
 pcm.writeUInt32LE(16,16);pcm.writeUInt16LE(1,20);pcm.writeUInt16LE(1,22);pcm.writeUInt32LE(RATE,24);pcm.writeUInt32LE(RATE*2,28);pcm.writeUInt16LE(2,32);pcm.writeUInt16LE(16,34);pcm.write('data',36);pcm.writeUInt32LE(length*2,40);
 for(let i=0;i<length;i++)pcm.writeInt16LE(Math.round(mix[i]/peak*.84*32767),44+i*2);
 writeFileSync(new URL(`../public/assets/audio/${meta.file}`,import.meta.url),pcm);
 console.log(`${id}: ${meta.title}, ${meta.bpm} BPM, ${(length/RATE).toFixed(2)} s, ${pcm.length} bytes`);
}
