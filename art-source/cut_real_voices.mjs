// Cuts real historical voice-horn clips from public-domain recordings (no TTS, no re-recording).
// Source files are downloaded to .tools/voice-sources/ (not in Git); provenance in public/assets/CREDITS.md.
// Rule: only the opening phrase of a speech (start of speech up to the first pause, max 3.2 s), whose wording is
// documented; no slogans. Run: node art-source/cut_real_voices.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CLIPS = [
  // Mussolini, 'bivacco' address to the Chamber, 16 Nov 1922; opens with "Signori deputati!". Wikimedia Commons, public domain.
  { source: '.tools/voice-sources/mussolini-1922.wav', out: '.tools/voice-sources/imperator-horn-real.wav' },
];

function readWav(path) {
  const b = readFileSync(path); let o = 12, fmt = {}, data = 0, size = 0;
  while (o < b.length - 8) { const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'fmt ') fmt = { ch: b.readUInt16LE(o + 10), rate: b.readUInt32LE(o + 12), bits: b.readUInt16LE(o + 22) };
    if (id === 'data') { data = o + 8; size = sz; break; } o += 8 + sz + (sz % 2); }
  if (fmt.bits !== 16) throw new Error('16-bit PCM expected');
  const frames = Math.floor(size / (2 * fmt.ch)), mono = new Float32Array(frames);
  for (let i = 0; i < frames; i++) { let v = 0; for (let c = 0; c < fmt.ch; c++) v += b.readInt16LE(data + (i * fmt.ch + c) * 2); mono[i] = v / fmt.ch / 32768; }
  return { rate: fmt.rate, mono };
}

for (const clip of CLIPS) {
  const { rate, mono } = readWav(join(root, clip.source));
  const win = Math.round(rate * .02), env = [];
  for (let i = 0; i + win < mono.length; i += win) { let e = 0; for (let k = 0; k < win; k++) e += mono[i + k] ** 2; env.push(Math.sqrt(e / win)); }
  const loud = [...env].sort((a, b) => a - b)[Math.floor(env.length * .9)];
  const on = env.findIndex((e) => e > loud * .35);
  let end = on, quiet = 0;
  for (let i = on; i < env.length && (i - on) * .02 < 3.2; i++) {
    quiet = env[i] < loud * .12 ? quiet + 1 : 0; end = i;
    if (quiet * .02 >= .22 && (i - on) * .02 > .9) { end = i - quiet; break; }
  }
  const a = Math.max(0, on * win - Math.round(rate * .05)), z = Math.min(mono.length, (end + 2) * win);
  const outRate = 22050, step = rate / outRate, n = Math.floor((z - a) / step), pcm = new Float32Array(n); let peak = 0;
  for (let i = 0; i < n; i++) { const s = mono[a + Math.floor(i * step)]; const fade = Math.min(1, i / (outRate * .015), (n - i) / (outRate * .04)); pcm[i] = s * fade; peak = Math.max(peak, Math.abs(pcm[i])); }
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(outRate, 24); buf.writeUInt32LE(outRate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(pcm[i] / peak * .89 * 32767), 44 + i * 2);
  writeFileSync(join(root, clip.out), buf);
  console.log(`${clip.out}: ${(a / rate).toFixed(2)}–${(z / rate).toFixed(2)} s of source (${(n / outRate).toFixed(2)} s)`);
}
