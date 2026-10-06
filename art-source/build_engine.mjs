// Redesign 06.10.2026: original 1930s straight-eight racing engine loop (public/assets/audio/motor.wav).
// Pure synthesis, no samples: phase-locked firing pulses through two exhaust resonators, an uneven-firing
// sub-rumble, valve-train tick and intake hiss. Rendered over two passes so the resonator state is periodic and
// the 2 s loop joins without a click. src/audio.ts keeps driving pitch and gain from speed/gear as before.
import { writeFile } from 'node:fs/promises';
const rate = 22050, seconds = 2, count = rate * seconds, fire = 100; // 1500 rpm straight eight → 100 firings/s
const rng = (seed) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2147483648 - 1; };
const hissTable = Float32Array.from({ length: count }, rng(9));
const firings = fire * seconds;
const strength = Float32Array.from({ length: firings }, (_, k) => .82 + .18 * Math.sin(k * 2.39) * Math.sin(k * .61) + (k % 8 === 3 ? .12 : 0));
function resonator(freq, q) { // two-pole band-pass
  const w = 2 * Math.PI * freq / rate, r = Math.exp(-w / (2 * q)), a1 = -2 * r * Math.cos(w), a2 = r * r, g = 1 - r;
  let y1 = 0, y2 = 0; return (x) => { const y = g * x - a1 * y1 - a2 * y2; y2 = y1; y1 = y; return y; };
}
const pipeLow = resonator(132, 5), pipeMid = resonator(410, 3.5), tickBand = resonator(1650, 6);
let lp = 0, hp = 0;
const out = new Float32Array(count);
for (let pass = 0; pass < 2; pass++) for (let i = 0; i < count; i++) {
  const t = i / rate, phase = t * fire, k = Math.floor(phase) % firings, tau = (phase - Math.floor(phase)) / fire;
  const burstNoise = rng(1000 + k)(); // deterministic per firing → periodic over the loop
  const pop = strength[k] * Math.exp(-tau / .0032) * (.65 + .35 * burstNoise) + .35 * strength[k] * Math.exp(-tau / .011) * Math.sin(2 * Math.PI * 95 * tau);
  const exhaust = pipeLow(pop) * 3.2 + pipeMid(pop) * 1.6;
  const rumble = .05 * Math.sin(2 * Math.PI * fire / 2 * t) * (.7 + .3 * Math.sin(2 * Math.PI * fire / 8 * t)) + .03 * Math.sin(2 * Math.PI * fire * 2 * t + .4);
  const valve = tickBand(Math.exp(-((phase * 2) % 1) * 30) * hissTable[(i * 7) % count]) * .45;
  lp = lp * .55 + hissTable[i] * .45; hp = hissTable[i] - lp;
  const sample = exhaust + rumble + valve + hp * .045;
  if (pass === 1) out[i] = sample;
}
// Match the previous loop's loudness (RMS ≈ .27) so the existing mix in src/audio.ts stays balanced; soft-limit peaks.
let sum = 0; for (const v of out) sum += v * v;
const scale = .27 / Math.sqrt(sum / count);
for (let i = 0; i < count; i++) out[i] = Math.tanh(out[i] * scale * 1.25) / 1.25;
let peak = 0; for (const v of out) peak = Math.max(peak, Math.abs(v));
const data = Buffer.alloc(44 + count * 2);
data.write('RIFF'); data.writeUInt32LE(36 + count * 2, 4); data.write('WAVEfmt ', 8); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22);
data.writeUInt32LE(rate, 24); data.writeUInt32LE(rate * 2, 28); data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34); data.write('data', 36); data.writeUInt32LE(count * 2, 40);
for (let i = 0; i < count; i++) data.writeInt16LE(Math.round(out[i] * 32767), 44 + i * 2);
await writeFile(new URL('../public/assets/audio/motor.wav', import.meta.url), data);
console.log('motor.wav', { seconds, fire, peak: +peak.toFixed(3), seam: +(Math.abs(out[0] - out[count - 1]) / peak).toFixed(4) });
