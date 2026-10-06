// Redesign 06.10.2026: original surface rolling loops and a water splash (no samples). Writes
// public/assets/audio/roll-cobble.wav, roll-gravel.wav, roll-grass.wav (seamless 2 s loops) and splash.wav.
// src/audio.ts crossfades the loops by the driving surface and scales pitch/gain with speed.
import { writeFile } from 'node:fs/promises';
const rate = 22050;
const rng = (seed) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2147483648 - 1; };
function bandpass(freq, q) { const w = 2 * Math.PI * freq / rate, r = Math.exp(-w / (2 * q)), a1 = -2 * r * Math.cos(w), a2 = r * r, g = 1 - r; let y1 = 0, y2 = 0; return (x) => { const y = g * x - a1 * y1 - a2 * y2; y2 = y1; y1 = y; return y; }; }
async function save(name, data, rms = .2) {
  let sum = 0; for (const v of data) sum += v * v; const scale = rms / Math.sqrt(sum / data.length);
  const out = Buffer.alloc(44 + data.length * 2);
  out.write('RIFF'); out.writeUInt32LE(36 + data.length * 2, 4); out.write('WAVEfmt ', 8); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(1, 22);
  out.writeUInt32LE(rate, 24); out.writeUInt32LE(rate * 2, 28); out.writeUInt16LE(2, 32); out.writeUInt16LE(16, 34); out.write('data', 36); out.writeUInt32LE(data.length * 2, 40);
  data.forEach((v, i) => out.writeInt16LE(Math.round(Math.tanh(v * scale * 1.2) / 1.2 * 32767), 44 + i * 2));
  await writeFile(new URL(`../public/assets/audio/${name}.wav`, import.meta.url), out);
  console.log(name, { seconds: +(data.length / rate).toFixed(2) });
}
// Loops are rendered twice with periodic excitation; the second pass is stored, so filters join seamlessly.
function loop(seconds, sample) { const n = Math.round(rate * seconds), out = new Float32Array(n); for (let pass = 0; pass < 2; pass++) for (let i = 0; i < n; i++) { const v = sample(i, n); if (pass) out[i] = v; } return out; }
{ // Cobbles: irregular joint thumps (~22/s at reference speed) with a body rattle.
  const r = rng(31), hits = Array.from({ length: 44 }, (_, k) => ({ at: Math.round((k + .5 + r() * .35) * rate * 2 / 44), amp: .55 + .45 * Math.abs(r()), pitch: 70 + 40 * Math.abs(r()) }));
  const noise = rng(32), noiseTable = Float32Array.from({ length: rate * 2 }, noise), rattle = bandpass(2100, 4), body = bandpass(140, 3);
  await save('roll-cobble', loop(2, (i, n) => {
    let thump = 0, exc = 0;
    for (const h of hits) { const d = (i - h.at + n) % n; if (d < rate * .05) { const t = d / rate; thump += h.amp * Math.exp(-t / .012) * Math.sin(2 * Math.PI * h.pitch * t); exc += h.amp * Math.exp(-t / .004); } }
    return body(thump) * 2.5 + thump * .6 + rattle(exc * noiseTable[i]) * .9 + noiseTable[(i * 3) % n] * .02;
  }), .19);
}
{ // Gravel: dense crunchy grains over a low rumble.
  const r = rng(41), grains = Array.from({ length: 360 }, () => ({ at: Math.floor((r() * .5 + .5) * rate * 2), amp: Math.abs(r()), f: 1800 + 2600 * Math.abs(r()) }));
  const noiseTable = Float32Array.from({ length: rate * 2 }, rng(42)), crunch = bandpass(3200, 1.6), low = bandpass(90, 2);
  await save('roll-gravel', loop(2, (i, n) => {
    let e = 0; for (const g of grains) { const d = (i - g.at + n) % n; if (d < rate * .008) e += g.amp * Math.exp(-d / rate / .0018); }
    return crunch(e * noiseTable[i]) * 3 + low(noiseTable[(i * 5) % n]) * .9;
  }), .2);
}
{ // Grass: soft swish with slow blade-flutter modulation.
  const noiseTable = Float32Array.from({ length: rate * 2 }, rng(51)), swish = bandpass(900, .9);
  await save('roll-grass', loop(2, (i, n) => { const t = i / rate; const mod = .6 + .25 * Math.sin(2 * Math.PI * 7 * t) + .15 * Math.sin(2 * Math.PI * 13 * t + 1); return swish(noiseTable[i]) * mod; }), .14);
}
{ // Splash: broadband hit sweeping down, then bubbling droplets.
  const n = Math.round(rate * 1.1), out = new Float32Array(n), noise = rng(61), r = rng(62);
  const drops = Array.from({ length: 26 }, () => ({ at: Math.floor((.12 + Math.abs(r()) * .8) * rate), f: 500 + 900 * Math.abs(r()), amp: .2 + .3 * Math.abs(r()) }));
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / rate, sweep = .18 + .8 * Math.exp(-t / .12); lp += (noise() - lp) * sweep;
    let v = lp * Math.exp(-t / .22) * 1.4;
    for (const d of drops) { const dt = (i - d.at) / rate; if (dt > 0 && dt < .06) v += d.amp * Math.exp(-dt / .015) * Math.sin(2 * Math.PI * d.f * (1 + dt * 6) * dt); }
    out[i] = v;
  }
  await save('splash', out, .22);
}
