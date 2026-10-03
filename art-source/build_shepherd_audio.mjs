// Original deterministic comic bark: no archival recording or voice impersonation.
import {writeFileSync} from 'node:fs';
const rate=24000,duration=.68,samples=Math.round(rate*duration),data=Buffer.alloc(samples*2);let seed=319,noise=0;
for(let i=0;i<samples;i++){
 const t=i/rate;let value=0;
 for(const start of [.025,.30]){const u=t-start;if(u<0||u>.22)continue;
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;noise=noise*.73+((seed/4294967296)*2-1)*.27;
  const envelope=Math.min(1,u/.009)*Math.exp(-u*15),f=165-115*u;
  const voiced=Math.sin(2*Math.PI*f*u)+.5*Math.sin(2*Math.PI*f*2.08*u)+.25*Math.sin(2*Math.PI*f*3*u);
  value+=(voiced*.35+noise*.65)*envelope;
 }
 data.writeInt16LE(Math.round(Math.max(-.9,Math.min(.9,value))*.65*32767),i*2);
}
const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(36+data.length,4);header.write('WAVE',8);header.write('fmt ',12);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(1,22);header.writeUInt32LE(rate,24);header.writeUInt32LE(rate*2,28);header.writeUInt16LE(2,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(data.length,40);
writeFileSync('public/assets/audio/shepherd-bark.wav',Buffer.concat([header,data]));console.log('Original double bark WAV: 24 kHz mono PCM, .68 seconds.');
