// "Stadionmarsch der Eitelkeit": an original, strict German-style parade march (118 bpm, dotted 'Prussian' rhythms (2/4, oom-pah tuba and horns, trumpets,
// glockenspiel lyre, snare, bass drum with cymbal), composed and synthesised for this project. No sample, no
// existing composition. Old style, newly made. Run: node art-source/build_march.mjs -> public/assets/audio/march.wav
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RATE = 22050, BPM = 118, EIGHTH = 60 / BPM / 2;
let seed = 7; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const midiHz = (m) => 440 * 2 ** ((m - 69) / 12);

// Chords: bass root and afterbeat triad (MIDI).
const CH = {
  Bb: [46, 53, [62, 65, 70]], F7: [41, 48, [63, 65, 69]], Eb: [39, 46, [63, 67, 70]], Gm: [43, 50, [62, 67, 70]],
  D7: [38, 45, [60, 66, 69]], Cm: [48, 43, [63, 67, 72]], Ab: [44, 51, [63, 68, 72]], Bb7: [46, 53, [62, 65, 68]],
};
// Melody bars: [chord, [[midi, eighths], ...]] (one bar = 4 eighths).
const INTRO = [['Bb', [[65, 1], [65, 1], [70, 2]]], ['Bb', [[65, 1], [70, 1], [74, 2]]], ['Bb', [[77, 3], [74, 1]]], ['F7', [[77, 4]]]];
const A = [
  ['Bb', [[77, 1], [77, 1], [74, 1], [70, 1]]], ['F7', [[72, 2], [69, 1], [65, 1]]], ['F7', [[72, 1], [75, 1], [74, 1], [72, 1]]], ['Bb', [[74, 2], [70, 2]]],
  ['Bb', [[77, 1], [77, 1], [79, 1], [77, 1]]], ['Eb', [[75, 2], [79, 2]]], ['F7', [[77, 1], [75, 1], [74, 1], [72, 1]]], ['F7', [[72, 4]]],
  ['Bb', [[77, 1], [77, 1], [74, 1], [70, 1]]], ['F7', [[72, 2], [69, 1], [65, 1]]], ['Gm', [[67, 1], [70, 1], [74, 1], [79, 1]]], ['Eb', [[79, 2], [75, 2]]],
  ['Bb', [[77, 3], [74, 1]]], ['F7', [[72, 1], [74, 1], [75, 1], [69, 1]]], ['Bb', [[70, 2], [65, 2]]], ['Bb', [[70, 4]]],
];
const B = [
  ['Gm', [[67, 1], [70, 1], [74, 1], [70, 1]]], ['D7', [[66, 2], [69, 2]]], ['Gm', [[67, 1], [70, 1], [74, 1], [79, 1]]], ['D7', [[78, 2], [74, 2]]],
  ['Cm', [[72, 1], [75, 1], [79, 1], [75, 1]]], ['F7', [[77, 2], [72, 2]]], ['Bb', [[74, 1], [77, 1], [82, 1], [77, 1]]], ['F7', [[77, 4]]],
  ['Gm', [[67, 1], [70, 1], [74, 1], [70, 1]]], ['D7', [[66, 2], [69, 2]]], ['Gm', [[67, 1], [70, 1], [74, 1], [79, 1]]], ['D7', [[78, 2], [74, 2]]],
  ['Cm', [[72, 1], [75, 1], [79, 1], [75, 1]]], ['F7', [[77, 2], [72, 2]]], ['F7', [[72, 1], [74, 1], [75, 1], [72, 1]]], ['Bb', [[70, 4]]],
];
const TRIO = [
  ['Eb', [[70, 2], [67, 2]]], ['Eb', [[63, 4]]], ['Ab', [[72, 2], [68, 2]]], ['Eb', [[67, 4]]],
  ['Bb7', [[65, 1], [67, 1], [68, 1], [70, 1]]], ['Bb7', [[72, 2], [70, 2]]], ['Eb', [[67, 1], [70, 1], [75, 2]]], ['Bb7', [[74, 4]]],
  ['Eb', [[70, 2], [67, 2]]], ['Eb', [[63, 4]]], ['Ab', [[72, 2], [68, 2]]], ['Ab', [[77, 2], [72, 2]]],
  ['Eb', [[70, 1], [67, 1], [70, 1], [75, 1]]], ['Bb7', [[74, 2], [77, 2]]], ['Eb', [[75, 2], [70, 2]]], ['Eb', [[75, 4]]],
];
/** Prussian snap: even eighth pairs on the beat become dotted eighth + sixteenth. */
const dotted = (section) => section.map(([chord, notes]) => {
  const out = []; let pos = 0;
  for (let i = 0; i < notes.length; i++) {
    const [m, len] = notes[i], next = notes[i + 1];
    if (len === 1 && next && next[1] === 1 && pos % 2 === 0) { out.push([m, 1.5], [next[0], .5]); pos += 2; i++; continue; }
    out.push([m, len]); pos += len;
  }
  return [chord, out];
});
// [bars, loudness, lyre, soft trio voicing]: full band forte, a soft trio, then the trio again as 'Grandioso'.
const FORM = [[dotted(INTRO), 1, false, false], [dotted(A), .95, false, false], [dotted(A), 1, false, false], [dotted(B), 1, false, false], [TRIO, .72, true, true], [dotted(TRIO), 1.05, false, false], [dotted(B), 1, false, false]];

const bars = FORM.reduce((n, [b]) => n + b.length, 0);
const length = Math.ceil((bars * 4 * EIGHTH + 1.2) * RATE);
const dry = new Float32Array(length);

/** Brass-like tone: band-limited saw with a bright attack, slow vibrato and two slightly detuned players. */
function brass(m, start, dur, gain, bright = 1, players = 2) {
  const f0 = midiHz(m), n0 = Math.floor(start * RATE), n = Math.floor((dur + .08) * RATE);
  const harmonics = Math.max(1, Math.min(14, Math.floor(5500 / f0)));
  for (let p = 0; p < players; p++) {
    const det = 1 + (p ? .0022 : -.0018), phase0 = rand() * 6.28;
    for (let i = 0; i < n && n0 + i < length; i++) {
      const t = i / RATE, att = Math.min(1, t / .028), rel = t > dur ? Math.max(0, 1 - (t - dur) / .08) : 1;
      const vib = 1 + .0035 * Math.sin(2 * Math.PI * 5.2 * t) * Math.min(1, Math.max(0, (t - .16) / .2));
      const b = bright * (.55 + .45 * Math.exp(-t * 7));
      let v = 0;
      for (let h = 1; h <= harmonics; h++) v += Math.sin(phase0 + 2 * Math.PI * f0 * det * vib * h * t) * Math.exp(-(h - 1) / (2.2 + 4 * b)) / h ** .6;
      dry[n0 + i] += v * gain * att * rel * (.92 + .08 * Math.exp(-t * 3)) / players;
    }
  }
}
function lyre(m, start, gain) {
  const f = midiHz(m + 12), n0 = Math.floor(start * RATE), n = Math.floor(1.1 * RATE);
  for (let i = 0; i < n && n0 + i < length; i++) {
    const t = i / RATE;
    dry[n0 + i] += gain * (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 4) + .35 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 9) + .15 * Math.sin(2 * Math.PI * f * 5.4 * t) * Math.exp(-t * 16));
  }
}
function noiseHit(start, dur, gain, tone, decay, body = 0, bodyHz = 180) {
  const n0 = Math.floor(start * RATE), n = Math.floor(dur * RATE); let lp = 0, prev = 0;
  for (let i = 0; i < n && n0 + i < length; i++) {
    const t = i / RATE, w = rand() * 2 - 1; lp += (w - lp) * tone; const hp = lp - prev * .6; prev = lp;
    dry[n0 + i] += gain * Math.exp(-t * decay) * hp + body * Math.sin(2 * Math.PI * bodyHz * t) * Math.exp(-t * 30);
  }
}
const snare = (s, g = 1) => noiseHit(s, .22, .32 * g, .75, 22, .12 * g, 190);
const bassDrum = (s, g = 1) => { const n0 = Math.floor(s * RATE); for (let i = 0; i < .45 * RATE && n0 + i < length; i++) { const t = i / RATE; dry[n0 + i] += .55 * g * Math.sin(2 * Math.PI * (52 + 40 * Math.exp(-t * 25)) * t) * Math.exp(-t * 7); } };
const cymbal = (s, g = 1) => noiseHit(s, 1.2, .1 * g, .98, 3.2);

let time = .15;
for (const [section, loud, withLyre, trio] of FORM) {
  section.forEach(([chord, notes], barIndex) => {
    const [root, fifth, triad] = CH[chord];
    // Oom (tuba) on both beats, pah (horns) on the off-beats.
    brass(root, time, EIGHTH * .9, .34 * loud, .5, 1);
    brass(barIndex % 2 ? fifth - 12 : fifth - 12 + (fifth - 12 < 34 ? 12 : 0), time + 2 * EIGHTH, EIGHTH * .9, .3 * loud, .5, 1);
    for (const off of [1, 3]) for (const m of triad) brass(m - 12, time + off * EIGHTH, EIGHTH * .45, (trio ? .05 : .1) * loud, .9, 1);
    // Melody: trumpets, or warm low brass in the trio.
    let at = time;
    for (const [m, len] of notes) {
      brass(trio ? m - 12 : m, at, len * EIGHTH * (len > 1 ? .9 : .72), .21 * loud, trio ? .55 : 1.45, 2);
      if (!trio) { brass(m - 12, at, len * EIGHTH * .78, .12 * loud, 1.1, 2); brass(m - 24, at, len * EIGHTH * .7, .06 * loud, .8, 1); }
      if (withLyre) lyre(m, at, (trio ? .1 : .07) * loud);
      at += len * EIGHTH;
    }
    // Percussion: bass drum and cymbal together on the downbeat, snare on the off-beats, a roll into each phrase.
    // Strict parade drums: bass drum on every beat, cymbal on each downbeat, snare 'ta - tat-ta' cadence.
    bassDrum(time, 1.1 * loud); bassDrum(time + 2 * EIGHTH, .95 * loud); cymbal(time, trio ? .45 : 1);
    for (const beat of [0, 2]) { snare(time + beat * EIGHTH, .45 * loud); snare(time + (beat + 1) * EIGHTH, .85 * loud); snare(time + (beat + 1.5) * EIGHTH, .5 * loud); }
    if (barIndex % 4 === 3 && !trio) for (let k = 0; k < 8; k++) snare(time + 2 * EIGHTH + k * EIGHTH / 4, (.3 + k * .08) * loud);
    time += 4 * EIGHTH;
  });
}

// Small hall: four combs and two all-passes (Schroeder), mixed lightly.
const wet = new Float32Array(length);
for (const [d, g] of [[1116, .8], [1188, .79], [1277, .78], [1356, .77]]) {
  const delay = Math.round(d * RATE / 44100), buf = new Float32Array(delay); let idx = 0, lp = 0;
  for (let i = 0; i < length; i++) { const out = buf[idx]; lp = out * .8 + lp * .2; buf[idx] = dry[i] + lp * g; idx = (idx + 1) % delay; wet[i] += out * .25; }
}
for (const d of [556, 441]) {
  const delay = Math.round(d * RATE / 44100), buf = new Float32Array(delay); let idx = 0;
  for (let i = 0; i < length; i++) { const b = buf[idx], v = wet[i]; buf[idx] = v + b * .5; wet[i] = b - v * .5; idx = (idx + 1) % delay; }
}
const mix = new Float32Array(length); let peak = 0;
for (let i = 0; i < length; i++) { mix[i] = Math.tanh((dry[i] * .85 + wet[i] * .16) * 1.6); peak = Math.max(peak, Math.abs(mix[i])); }
const pcm = Buffer.alloc(44 + length * 2);
pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + length * 2, 4); pcm.write('WAVEfmt ', 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
pcm.writeUInt32LE(RATE, 24); pcm.writeUInt32LE(RATE * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write('data', 36); pcm.writeUInt32LE(length * 2, 40);
for (let i = 0; i < length; i++) pcm.writeInt16LE(Math.round(mix[i] / peak * .89 * 32767), 44 + i * 2);
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'audio', 'march.wav');
writeFileSync(out, pcm);
console.log(`march.wav: ${bars} bars, ${(length / RATE).toFixed(1)} s, ${(pcm.length / 1e6).toFixed(1)} MB`);
