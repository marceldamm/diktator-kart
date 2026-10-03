// Writes the shared circuit centreline for the Blender world builder.
// Run: node art-source/export_track.mjs  (after editing src/track-layout.ts)
import { writeFileSync } from 'node:fs';
import { sampleTrack, TRACK_HALF_WIDTH, START_PROGRESS, LANDMARKS } from '../src/track-layout.ts';
const { samples, length } = sampleTrack();
const round = (v) => Math.round(v * 1000) / 1000;
writeFileSync(new URL('./track-layout.json', import.meta.url), JSON.stringify({
  note: 'Generated from src/track-layout.ts by art-source/export_track.mjs. Game x/z equals Blender X/Y.',
  length: round(length), halfWidth: TRACK_HALF_WIDTH, start: START_PROGRESS, landmarks: LANDMARKS,
  samples: samples.filter((_, i) => i % 2 === 0).map((p) => [round(p.x), round(p.z), round(p.heading), round(p.s)]),
}) + '\n');
console.log('track-layout.json', samples.length / 2, 'samples', length.toFixed(1), 'm');
