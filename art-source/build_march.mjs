// "Stadionmarsch der Eitelkeit": an original, strict Prussian-style parade march for this project.
// Spielmannszug intro (drum corps), fifes over snare drums, then heavy trombones/trumpets in octaves with
// tuba, a stern minor strain, a broad trio and a full 'Grandioso'. Own composition and synthesis, no sample,
// no existing composition. Run: node art-source/build_march.mjs -> public/assets/audio/march.wav
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RATE = 22050, BPM = 112, EIGHTH = 60 / BPM / 2;
let seed = 11; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

const CH = { Bb: [46, 41, [62, 65, 70]], F7: [41, 48, [63, 65, 69]], Eb: [39, 46, [63, 67, 70]], Gm: [43, 38, [62, 67, 70]],
  D7: [38, 45, [60, 66, 69]], Cm: [36, 43, [63, 67, 72]], Ab: [44, 39, [63, 68, 72]], Bb7: [46, 41, [62, 65, 68]] };
// [chord, [[midi (0 = rest), eighths], ...]], one 2/4 bar = 4 eighths.
const A = [
  ['Bb', [[65, 1.5], [65, .5], [70, 1], [74, 1]]], ['Bb', [[77, 3], [74, 1]]], ['F7', [[72, 1.5], [72, .5], [75, 1], [72, 1]]], ['Bb', [[74, 2], [70, 2]]],
  ['Eb', [[75, 1.5], [75, .5], [79, 1], [75, 1]]], ['Bb', [[74, 1.5], [74, .5], [77, 1], [74, 1]]], ['F7', [[72, 1], [69, 1], [72, 1], [75, 1]]], ['F7', [[77, 2], [72, 2]]],
  ['Bb', [[65, 1.5], [65, .5], [70, 1], [74, 1]]], ['Bb', [[77, 3], [74, 1]]], ['F7', [[72, 1.5], [72, .5], [75, 1], [72, 1]]], ['Bb', [[74, 2], [70, 2]]],
  ['Eb', [[79, 1.5], [79, .5], [77, 1], [75, 1]]], ['Bb', [[74, 1.5], [74, .5], [72, 1], [70, 1]]], ['F7', [[69, 1], [72, 1], [77, 1], [69, 1]]], ['Bb', [[70, 3], [65, 1]]],
];
const B = [
  ['Gm', [[67, 1.5], [67, .5], [67, 1], [70, 1]]], ['D7', [[69, 1.5], [66, .5], [62, 2]]], ['Gm', [[67, 1.5], [70, .5], [74, 1], [79, 1]]], ['D7', [[78, 2], [74, 2]]],
  ['Cm', [[72, 1.5], [72, .5], [75, 1], [72, 1]]], ['Gm', [[70, 1.5], [70, .5], [74, 1], [70, 1]]], ['D7', [[69, 1], [66, 1], [69, 1], [72, 1]]], ['Gm', [[67, 3], [62, 1]]],
  ['Gm', [[67, 1.5], [67, .5], [67, 1], [70, 1]]], ['D7', [[69, 1.5], [66, .5], [62, 2]]], ['Gm', [[67, 1.5], [70, .5], [74, 1], [79, 1]]], ['D7', [[78, 2], [74, 2]]],
  ['Cm', [[72, 1.5], [72, .5], [75, 1], [72, 1]]], ['Gm', [[70, 1.5], [70, .5], [74, 1], [70, 1]]], ['F7', [[72, 1], [75, 1], [77, 1], [72, 1]]], ['Bb', [[70, 4]]],
];
const TRIO = [
  ['Eb', [[70, 2], [67, 2]]], ['Eb', [[63, 4]]], ['Ab', [[72, 2], [68, 2]]], ['Eb', [[67, 4]]],
  ['Bb7', [[65, 1.5], [67, .5], [68, 1], [70, 1]]], ['Bb7', [[72, 2], [70, 2]]], ['Eb', [[67, 1.5], [70, .5], [75, 2]]], ['Bb7', [[74, 4]]],
  ['Eb', [[70, 2], [67, 2]]], ['Eb', [[63, 4]]], ['Ab', [[72, 2], [68, 2]]], ['Ab', [[77, 2], [72, 2]]],
  ['Eb', [[70, 1.5], [67, .5], [70, 1], [75, 1]]], ['Bb7', [[74, 2], [77, 2]]], ['Eb', [[75, 2], [70, 2]]], ['Eb', [[75, 4]]],
];
const DRUMS = Array.from({ length: 4 }, () => ['Bb', [[0, 4]]]);
// [bars, band: 'drums' | 'fifes' | 'brass' | 'trio' | 'grand', loudness]
const FORM = [[DRUMS, 'drums', 1], [A, 'fifes', .9], [A, 'brass', 1], [B, 'brass', 1], [TRIO, 'trio', .8], [TRIO, 'grand', 1.08], [A, 'grand', 1.05]];

const bars = FORM.reduce((n, [b]) => n + b.length, 0);
const length = Math.ceil((bars * 4 * EIGHTH + 1.5) * RATE);
const dry = new Float32Array(length);
const put = (i, v) => { if (i >= 0 && i < length) dry[i] += v; };

/** Brass section: band-limited saw, lip blip at the attack, breath noise, players slightly apart. */
function brass(m, start, dur, gain, bright = 1, players = 3) {
  const f0 = hz(m), n0 = Math.floor(start * RATE), n = Math.floor((dur + .07) * RATE);
  const harmonics = Math.max(1, Math.min(18, Math.floor(6000 / f0)));
  for (let p = 0; p < players; p++) {
    const det = 1 + (p - (players - 1) / 2) * .0028, lag = Math.floor(rand() * .012 * RATE), ph = rand() * 6.28;
    for (let i = 0; i < n; i++) {
      const t = i / RATE, att = Math.min(1, t / .022), rel = t > dur ? Math.max(0, 1 - (t - dur) / .07) : 1;
      const blip = 1 - .012 * Math.exp(-t * 40), vib = 1 + .0025 * Math.sin(2 * Math.PI * 5 * t) * Math.min(1, Math.max(0, (t - .2) / .2));
      const b = bright * (.6 + .5 * Math.exp(-t * 6));
      let v = 0; for (let h = 1; h <= harmonics; h++) v += Math.sin(ph + 2 * Math.PI * f0 * det * blip * vib * h * t) * Math.exp(-(h - 1) / (1.6 + 5 * b)) / h ** .45;
      put(n0 + lag + i, (v + (rand() - .5) * .25 * Math.exp(-t * 30)) * gain * att * rel / players);
    }
  }
}
/** Fife: bright, breathy and high, as in a Prussian Spielmannszug. */
function fife(m, start, dur, gain) {
  const f = hz(m + 12), n0 = Math.floor(start * RATE), n = Math.floor((dur + .03) * RATE); let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE, env = Math.min(1, t / .015) * (t > dur ? Math.max(0, 1 - (t - dur) / .03) : 1), vib = 1 + .004 * Math.sin(2 * Math.PI * 6 * t);
    lp += ((rand() - .5) - lp) * .3;
    put(n0 + i, gain * env * (Math.sin(2 * Math.PI * f * vib * t) + .18 * Math.sin(4 * Math.PI * f * vib * t) + .9 * lp * Math.exp(-t * 12) + .12 * lp));
  }
}
function noise(start, dur, gain, tone, decay, body = 0, bodyHz = 190) {
  const n0 = Math.floor(start * RATE), n = Math.floor(dur * RATE); let lp = 0, prev = 0;
  for (let i = 0; i < n; i++) { const t = i / RATE, w = rand() * 2 - 1; lp += (w - lp) * tone; const hp = lp - prev * .7; prev = lp;
    put(n0 + i, gain * Math.exp(-t * decay) * hp + body * Math.sin(2 * Math.PI * bodyHz * t) * Math.exp(-t * 35)); }
}
// Drum corps: three snares a few ms apart, deep bass drum, cymbal.
const snare = (s, g) => { for (let k = 0; k < 3; k++) noise(s + k * .004 + rand() * .003, .2, .2 * g, .8, 24, .08 * g, 180 + k * 15); };
const bassDrum = (s, g) => { const n0 = Math.floor(s * RATE); for (let i = 0; i < .5 * RATE; i++) { const t = i / RATE; put(n0 + i, .7 * g * Math.sin(2 * Math.PI * (46 + 38 * Math.exp(-t * 22)) * t) * Math.exp(-t * 6)); } };
const cymbal = (s, g) => noise(s, 1.3, .09 * g, .985, 3);
/** Prussian marching cadence per bar (sixteenth grid), with a roll every fourth bar. */
function drumBar(t, bar, g, rollEvery = 4) {
  const S = EIGHTH / 2, accents = [1, 0, .5, .5, .9, 0, .5, .6];
  accents.forEach((a, k) => { if (a) snare(t + k * S, a * g); });
  if (bar % rollEvery === rollEvery - 1) for (let k = 0; k < 12; k++) snare(t + 4 * S + k * S / 3, (.35 + k * .05) * g);
}

let time = .1;
for (const [section, band, loud] of FORM) {
  section.forEach(([chord, notes], bar) => {
    const [root, fifth, triad] = CH[chord];
    const full = band === 'brass' || band === 'grand', soft = band === 'trio';
    if (band !== 'drums' && band !== 'fifes') {
      // Tuba on the beats, horns short on the off-beats.
      brass(root - 12 >= 30 ? root - 12 : root, time, EIGHTH * .85, .32 * loud, .6, 2);
      brass(fifth - 12 >= 30 ? fifth - 12 : fifth, time + 2 * EIGHTH, EIGHTH * .85, .28 * loud, .6, 2);
      for (const off of [1, 3]) for (const m of triad) brass(m - 12, time + off * EIGHTH, EIGHTH * .4, (soft ? .045 : .085) * loud, .9, 1);
    }
    let at = time;
    for (const [m, len] of notes) {
      if (m) {
        const d = len * EIGHTH * (len >= 2 ? .92 : len < 1 ? .8 : .78);
        if (band === 'fifes' || band === 'grand') fife(m, at, d, (band === 'grand' ? .05 : .09) * loud);
        if (full) { brass(m, at, d, .17 * loud, 1.5, 3); brass(m - 12, at, d, .16 * loud, 1.2, 3); }
        if (soft) brass(m - 12, at, d, .2 * loud, .7, 3);
        if (band === 'grand') brass(m - 24, at, d, .07 * loud, .9, 2);
      }
      at += len * EIGHTH;
    }
    bassDrum(time, 1.1 * loud); bassDrum(time + 2 * EIGHTH, (band === 'drums' ? .8 : 1) * loud);
    if (band !== 'drums' || bar % 2 === 0) cymbal(time, soft ? .4 : band === 'fifes' ? .6 : 1);
    drumBar(time, bar, (soft ? .55 : 1) * loud, band === 'drums' ? 2 : 4);
    time += 4 * EIGHTH;
  });
}

// Open-air parade ground: short, light early reflections only.
const wet = new Float32Array(length);
for (const [ms, g] of [[23, .3], [41, .22], [67, .15], [97, .1]]) { const d = Math.round(ms / 1000 * RATE); for (let i = d; i < length; i++) wet[i] += dry[i - d] * g; }
const mix = new Float32Array(length); let peak = 0;
for (let i = 0; i < length; i++) { mix[i] = Math.tanh((dry[i] + wet[i] * .5) * 1.5); peak = Math.max(peak, Math.abs(mix[i])); }
const pcm = Buffer.alloc(44 + length * 2);
pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + length * 2, 4); pcm.write('WAVEfmt ', 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
pcm.writeUInt32LE(RATE, 24); pcm.writeUInt32LE(RATE * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write('data', 36); pcm.writeUInt32LE(length * 2, 40);
for (let i = 0; i < length; i++) pcm.writeInt16LE(Math.round(mix[i] / peak * .89 * 32767), 44 + i * 2);
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'audio', 'march.wav'), pcm);
console.log(`march.wav: ${bars} bars, ${(length / RATE).toFixed(1)} s, ${(pcm.length / 1e6).toFixed(1)} MB`);
