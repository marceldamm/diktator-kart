import { Engine } from '@babylonjs/core/Engines/engine';
import { MeshoptCompression } from '@babylonjs/core/Meshes/Compression/meshoptCompression';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { createSliceScene } from '../src/slice-scene';
import { initialKartState } from '../src/kart-model';
import { CAST } from '../src/cast';
import { TRACK, selectTrack, trackPoint, trackHeightAt, shortcutPoint, SHORTCUT_LENGTH } from '../src/track';
import { TRACKS, type TrackId } from '../src/track-layout';
import type { TestScene } from '../src/scene';
import { FreeFlight } from '../src/free-camera';
const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const EVENT_NAMES = { zeppelin: 'Berlin · Zeppelin', wave: 'Havanna · Welle', balcony: 'Rom · Balkonrede', loudspeaker: 'Peking · Pflichtjubel', parade: 'Moskau · Ehrenparade', column: 'Pjöngjang · Kolonne' } as const;
const EVENT_TRACKS = { zeppelin: 'stadionring', wave: 'havanna', balcony: 'duce-drom', loudspeaker: 'beijing', parade: 'moscow', column: 'pyongyang' } as const;
MeshoptCompression.Configuration = { decoder: { url: '/vendor/meshopt_decoder.js' } };
const driver = el<HTMLSelectElement>('driver'), track = el<HTMLSelectElement>('track'), view = el<HTMLSelectElement>('view');
driver.replaceChildren(...CAST.map((c, i) => new Option(c.name, String(i))));
track.replaceChildren(...Object.entries(TRACKS).map(([id, c]) => new Option(c.name, id)));
const engine = new Engine(el<HTMLCanvasElement>('canvas'), true);
let world: TestScene, camera: FreeCamera, paused = false, jump = 0, night = 0, health = 100, coursePosition = 0, triggeredEvent: keyof typeof EVENT_NAMES | null = null, focusZeppelin = false, focusSide = 1;
try {
  const saved = JSON.parse(sessionStorage.getItem('dk-feedback-view') ?? 'null');
  if (saved) {
    for (const id of ['driver', 'track', 'view', 'quality']) if (saved[id] !== undefined) el<HTMLSelectElement>(id).value = saved[id];
    for (const id of ['lamps', 'shortcut']) el<HTMLInputElement>(id).checked = saved[id] ?? true;
    for (const id of ['jump', 'night', 'health', 'position']) if (saved[id] !== undefined) el<HTMLInputElement>(id).value = String(saved[id]);
    jump = Number(el<HTMLInputElement>('jump').value); night = Number(el<HTMLInputElement>('night').value);
    health = Number(el<HTMLInputElement>('health').value); coursePosition = Number(el<HTMLInputElement>('position').value);
    paused = !!saved.paused; el('pause').textContent = paused ? 'Animation weiter' : 'Bild einfrieren';
  }
} catch { /* QA controls can always start from their default values. */ }
const currentPoint = () => el<HTMLInputElement>('shortcut').checked ? shortcutPoint(coursePosition * SHORTCUT_LENGTH) : trackPoint(TRACK.start + coursePosition * TRACK.length);
let state = initialKartState();
function frameCamera() {
  const p = currentPoint(), f = new Vector3(Math.sin(p.heading), 0, Math.cos(p.heading));
  const side = new Vector3(Math.cos(p.heading), 0, -Math.sin(p.heading));
  const ground = trackHeightAt(p.x, p.z), center = new Vector3(p.x, ground + (jump ? 1.4 : 0), p.z);
  const eye = view.value === 'Cockpit';
  const offset = view.value === 'Umgebung' ? f.scale(24).add(side.scale(18)).add(new Vector3(0, 12, 0)) : eye ? f.scale(-.42).add(new Vector3(0, 1.97, 0)) :
    view.value === 'Front' ? f.scale(4.5).add(new Vector3(0, 2.4, 0)) :
    view.value === 'Profil' ? side.scale(4.5).add(new Vector3(0, 2.1, 0)) :
    view.value === 'Hinten' ? f.scale(-5).add(new Vector3(0, 2.6, 0)) :
    f.scale(3.7).add(side.scale(3.7)).add(new Vector3(0, 2.7, 0));
  camera.position.copyFrom(center.add(offset)); camera.fov = eye ? 1.45 : .75;
  camera.setTarget(eye ? camera.position.add(f.scale(8)).add(new Vector3(0, -1.7, 0)) : center.add(new Vector3(0, 1.1, 0)));
  world.setPlayerVisible(!eye);
}
function render() {
  const p = currentPoint();
  state = { ...state, x: p.x, z: p.z, heading: p.heading, travelHeading: p.heading,
    height: trackHeightAt(p.x, p.z) + (jump ? 1.4 : 0), grounded: !jump, trick: !!jump, jumpDuration: 1, jumpRemaining: jump ? 1 - jump : 0 };
  world.setDamage?.([health], [health === 0 ? 1 : 0]); world.setTimeOfDay?.(night);
  world.present(state, []);
  if (free.active) free.update(Math.min(engine.getDeltaTime() / 1000, .1));
  else if (focusZeppelin) {
    const zeppelin = world.scene.getTransformNodeByName('Propaganda zeppelin');
    if (zeppelin?.isEnabled()) {
      const side = new Vector3(Math.cos(zeppelin.rotation.y), 0, -Math.sin(zeppelin.rotation.y));
      const target = zeppelin.getAbsolutePosition(); camera.position.copyFrom(target.add(side.scale(95 * focusSide)).add(new Vector3(0, 24, 0))); camera.setTarget(target);
    } else { focusZeppelin = false; frameCamera(); }
  } else frameCamera();
  for (const light of world.scene.lights) if (/Nearby street lantern|Kart headlight beam/.test(light.name)) {
    light.setEnabled(el<HTMLInputElement>('lamps').checked && (el<HTMLSelectElement>('quality').value !== '0' || light.name.endsWith(' 0')));
  }
  world.scene.render();
}
function status() {
  const event = el<HTMLSelectElement>('track-event').value as keyof typeof EVENT_NAMES;
  const zeppelinActive = !!world?.scene.getTransformNodeByName('Propaganda zeppelin')?.isEnabled();
  const zeppelinState = triggeredEvent === 'zeppelin' ? ` · Zeppelinmodell ${zeppelinActive ? 'aktiv' : 'inaktiv'}` : '';
  el<HTMLButtonElement>('focus-event').disabled = !zeppelinActive;
  el('status').textContent = `${CAST[Number(driver.value)].name} · ${TRACK.name} · ${view.value} · Ereignis ${EVENT_NAMES[event]} · Zuletzt ausgelöst ${triggeredEvent ? EVENT_NAMES[triggeredEvent] : 'keines'}${zeppelinState} · Sprung ${jump} · Nacht ${night} · Karosserie ${health} % · Position ${coursePosition}`;
  try { sessionStorage.setItem('dk-feedback-view', JSON.stringify({ driver: driver.value, track: track.value, view: view.value,
    quality: el<HTMLSelectElement>('quality').value, lamps: el<HTMLInputElement>('lamps').checked, shortcut: el<HTMLInputElement>('shortcut').checked,
    jump, night, health, position: coursePosition, paused })); } catch { /* Storage is optional in the QA page. */ }
}
async function load() {
  engine.stopRenderLoop(); world?.scene.dispose(); triggeredEvent = null; focusZeppelin = false; focusSide = 1; selectTrack(track.value as TrackId);
  el('status').textContent = 'Lädt tatsächliche Spielszene …';
  world = await createSliceScene(engine, 0, 1);
  world.scene.blockMaterialDirtyMechanism = false;
  camera = new FreeCamera('Prüfkamera', Vector3.Zero(), world.scene); camera.minZ = .05;
  world.attachCamera?.(camera); world.setWeather?.('sun'); world.setRoster?.([Number(driver.value)]); world.setQuality?.(Number(el<HTMLSelectElement>('quality').value), false);
  render(); await world.scene.whenReadyAsync(); render(); status(); if (!paused) engine.runRenderLoop(render);
}
driver.onchange = () => { world.setRoster?.([Number(driver.value)]); render(); status(); };
el('lamps').onchange = () => { render(); status(); };
el('shortcut').onchange = () => { render(); status(); };
el('quality').onchange = () => { world.setQuality?.(Number(el<HTMLSelectElement>('quality').value), false); render(); status(); };
el('wreck').onclick = () => {
  health = 0; el<HTMLInputElement>('health').value = '0'; world.wreck?.(0);
  if (paused) { paused = false; el('pause').textContent = 'Bild einfrieren'; engine.runRenderLoop(render); }
  render(); status();
};
track.onchange = () => {
  const selectedEvent = (Object.keys(EVENT_TRACKS) as (keyof typeof EVENT_TRACKS)[]).find(event => EVENT_TRACKS[event] === track.value);
  if (selectedEvent) el<HTMLSelectElement>('track-event').value = selectedEvent;
  void load();
};
el<HTMLSelectElement>('track-event').onchange = () => {
  const event = el<HTMLSelectElement>('track-event').value as keyof typeof EVENT_TRACKS;
  track.value = EVENT_TRACKS[event]; void load();
};
view.onchange = () => { focusZeppelin = false; world.setPlayerVisible(true); render(); status(); };
el('trigger-event').onclick = () => { const event = el<HTMLSelectElement>('track-event').value as keyof typeof EVENT_NAMES; triggeredEvent = event; world.trackEvent?.(event); if (paused) { paused = false; el('pause').textContent = 'Bild einfrieren'; engine.runRenderLoop(render); } render(); status(); };
el('focus-event').onclick = () => { if (!world.scene.getTransformNodeByName('Propaganda zeppelin')?.isEnabled()) return; if (focusZeppelin) focusSide *= -1; else focusZeppelin = true; world.setPlayerVisible(false); render(); status(); };
for (const kind of ['cheer', 'fist', 'angry'] as const) el(kind).onclick = () => { world.driverReaction?.(0, kind); if (paused) { paused = false; el('pause').textContent = 'Bild einfrieren'; engine.runRenderLoop(render); } };
el('pause').onclick = () => { paused = !paused; el('pause').textContent = paused ? 'Animation weiter' : 'Bild einfrieren'; if (paused) engine.stopRenderLoop(); else engine.runRenderLoop(render); status(); };
for (const id of ['jump', 'night', 'health', 'position']) el<HTMLInputElement>(id).oninput = () => {
  const value = Number(el<HTMLInputElement>(id).value); if (id === 'jump') jump = value; else if (id === 'night') night = value; else if (id === 'position') coursePosition = value; else health = value;
  render(); status();
};
// Freie Kamera (Marcel 11.10.2026): fly through the loaded course; Esc returns to the chosen view.
const free = new FreeFlight(() => world?.scene, el<HTMLCanvasElement>('canvas'));
el('freecam').onclick = () => {
  focusZeppelin = false; world.setPlayerVisible(true);
  free.start(() => { if (paused) engine.stopRenderLoop(); render(); });
  if (paused) engine.runRenderLoop(render);
};
window.addEventListener('resize', () => engine.resize());
window.addEventListener('pagehide', () => { engine.stopRenderLoop(); world?.scene.dispose(); engine.dispose(); });
void load();
