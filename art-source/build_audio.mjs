// Original deterministic motor, tire, impact and boost sound effects. No music or voices.
import { writeFile } from 'node:fs/promises';
let seed=701;
const noise=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2147483648-1;};
async function wav(name,duration,sample){
  const rate=22050,count=Math.round(rate*duration),data=Buffer.alloc(44+count*2);
  data.write('RIFF');data.writeUInt32LE(36+count*2,4);data.write('WAVEfmt ',8);data.writeUInt32LE(16,16);data.writeUInt16LE(1,20);data.writeUInt16LE(1,22);data.writeUInt32LE(rate,24);data.writeUInt32LE(rate*2,28);data.writeUInt16LE(2,32);data.writeUInt16LE(16,34);data.write('data',36);data.writeUInt32LE(count*2,40);
  for(let i=0;i<count;i++)data.writeInt16LE(Math.round(Math.max(-1,Math.min(1,sample(i/rate,duration)))*27000),44+i*2);
  await writeFile(new URL(`../public/assets/audio/${name}.wav`,import.meta.url),data);
}
let filter=0;
await wav('motor',2,t=>{filter=filter*.83+noise()*.17;return .4*Math.sin(2*Math.PI*55*t)+.16*Math.sin(2*Math.PI*110*t)+.1*Math.sin(2*Math.PI*220*t)+filter*.5;});
await wav('tire',2,t=>{filter=filter*.3+noise()*.7;return filter*.4+.12*Math.sin(2*Math.PI*(620*t+4*Math.sin(t*31)));});
await wav('impact',.38,t=>noise()*.7*Math.exp(-t*19)+Math.sin(2*Math.PI*90*t)*.5*Math.exp(-t*24));
await wav('boost',1.2,(t,d)=>{filter=filter*.55+noise()*.45;return (filter*.6+Math.sin(2*Math.PI*(85*t+30*t*t))*.1)*Math.sin(Math.PI*t/d);});
console.log('Four original WAV effects written.');
await wav('pickup',.4,(t,d)=>Math.sin(2*Math.PI*(t<.13?440:t<.26?550:660)*t)*.3*Math.sin(Math.PI*t/d));
await wav('launch',.35,t=>(noise()*.4+Math.sin(2*Math.PI*(160*t+300*t*t))*.18)*Math.exp(-t*9));
const bell=(frequency,t)=>Math.sin(2*Math.PI*frequency*t)*Math.exp(-t*5)+.22*Math.sin(2*Math.PI*frequency*2.01*t)*Math.exp(-t*9);
await wav('countdown',.6,t=>bell(392,t)*.36);
await wav('start',.85,t=>bell(784,t)*.45);
await wav('lap',1.1,t=>bell(t<.25?523:t<.5?659:784,t)*.38);
await wav('finish',1.5,t=>bell(t<.25?523:t<.5?659:t<.75?784:1046,t)*.4);
await wav('hop',.2,t=>Math.sin(2*Math.PI*(180*t+150*t*t))*.3*Math.exp(-t*16));
await wav('land',.22,t=>noise()*.2*Math.exp(-t*30)+Math.sin(2*Math.PI*65*t)*.4*Math.exp(-t*22));
// Quality level 2: crowd bed (seamless 6 s loop) and metallic barrier scrape (loop).
{
  let lo=0,band=0,band2=0;
  await wav('crowd',6,t=>{
    const n=noise();lo=lo*.92+n*.08;band=band*.6+(n-lo)*.4;band2=band2*.85+band*.15;
    const murmur=.55+.25*Math.sin(2*Math.PI*t/3)+.15*Math.sin(2*Math.PI*t/1.5+1);
    const cheer=Math.max(0,Math.sin(2*Math.PI*t/6-1.2))**6*.9;
    return (band2*1.8+band*.5)*(murmur+cheer)*.55;
  });
  let r1=0,r1v=0,r2=0,r2v=0;
  await wav('scrape',1.5,t=>{
    const n=noise()*(.6+.4*Math.sin(2*Math.PI*t*13));
    const f1=2*Math.PI*2150/22050,f2=2*Math.PI*3420/22050;
    r1v+=(n-r1)*f1*.08-r1v*.02;r1+=r1v*f1;r2v+=(n-r2)*f2*.08-r2v*.03;r2+=r2v*f2;
    return (r1*.9+r2*.6+n*.08)*.7;
  });
  console.log('Crowd and scrape written.');
}

// Parade tank (Groessenbefehl): transform clank and hiss, heavy run-over thud, diesel and track rumble loop.
{
  let lo=0,hiss=0;
  await wav('tank-transform',1.1,t=>{const n=noise();hiss=hiss*.4+n*.6;lo=lo*.97+n*.03;
    const clank=[0,.12,.27,.4].reduce((a,s,k)=>a+(t>s?Math.sin(2*Math.PI*(310+k*95)*(t-s))*Math.exp(-(t-s)*18):0),0);
    return clank*.45+hiss*.22*Math.exp(-Math.abs(t-.65)*5)+lo*1.4*Math.min(1,t*3);});
  let body=0;
  await wav('tank-crush',.6,t=>{const n=noise();body=body*.9+n*.1;return Math.sin(2*Math.PI*48*t)*Math.exp(-t*7)*.8+body*2.2*Math.exp(-t*9)+n*.25*Math.exp(-t*20);});
  let rum=0;
  await wav('tank-engine',2,t=>{const n=noise();rum=rum*.94+n*.06;
    const firing=Math.sin(2*Math.PI*38*t)*.4+Math.sin(2*Math.PI*76*t)*.18;const links=Math.max(0,Math.sin(2*Math.PI*8*t))**8*.35*(n*.5+.5);
    return firing+rum*1.6+links;});
  console.log('Tank sounds written.');
}

// Weather: seamless rain bed and a rolling thunder clap.
{
  let a=0,c=0;
  await wav('rain',4,t=>{const n=noise();a=a*.55+n*.45;c=c*.97+n*.03;const drops=Math.random()<.004?noise()*.8:0;return (a-c)*.55+drops*.4;});
  let r1=0,r2=0;
  await wav('thunder',3.2,t=>{const n=noise();r1=r1*.985+n*.015;r2=r2*.9+n*.1;const env=Math.min(1,t*6)*Math.exp(-t*1.1)*(1+.6*Math.sin(t*9)*Math.exp(-t));return (r1*7+r2*.8)*env*.9;});
  console.log('Weather sounds written.');
}
