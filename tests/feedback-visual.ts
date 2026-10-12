import { Engine } from '@babylonjs/core/Engines/engine';
import { MeshoptCompression } from '@babylonjs/core/Meshes/Compression/meshoptCompression';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { createSliceScene } from '../src/slice-scene';
import { initialKartState } from '../src/kart-model';
import { CAST } from '../src/cast';
import { TRACK, selectTrack, trackPoint, elevationAt, shortcutPoint, shortcutElevationAt, SHORTCUT_LENGTH, startParade, setParadeClock } from '../src/track';
import { RAMP_SHORTCUT_ENTRY, TRACKS, type TrackId } from '../src/track-layout';
import type { TestScene } from '../src/scene';
import { FreeFlight } from '../src/free-camera';
const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const EVENT_NAMES = { zeppelin: 'Berlin · Zeppelin', wave: 'Havanna · Welle', balcony: 'Rom · Balkonrede', loudspeaker: 'Peking · Pflichtjubel', parade: 'Moskau · Ehrenparade', column: 'Pjöngjang · Kolonne' } as const;
const EVENT_TRACKS = { zeppelin: 'stadionring', wave: 'havanna', balcony: 'duce-drom', loudspeaker: 'beijing', parade: 'moscow', column: 'pyongyang' } as const;
const EVENT_PROGRESS = { zeppelin: 110, wave: 218, balcony: 1048, loudspeaker: 960, parade: 308, column: 1386 } as const;
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
const currentElevation = () => el<HTMLInputElement>('shortcut').checked ? shortcutElevationAt(coursePosition * SHORTCUT_LENGTH) : elevationAt(TRACK.start + coursePosition * TRACK.length);
let state = initialKartState();
let previewRaceTime = 0;
const activeEventNode = () => {
  if (triggeredEvent === 'zeppelin') return world?.scene.getTransformNodeByName('Propaganda zeppelin');
  if (triggeredEvent === 'column') return [0, 1, 2, 3].map(i => world?.scene.getTransformNodeByName(`Parade column vehicle ${i}`)).find(node => node?.isEnabled());
  return undefined;
};
function frameCamera() {
  const p = currentPoint(), f = new Vector3(Math.sin(p.heading), 0, Math.cos(p.heading));
  const side = new Vector3(Math.cos(p.heading), 0, -Math.sin(p.heading));
  const ground = currentElevation(), center = new Vector3(p.x, ground + (jump ? 1.4 : 0), p.z);
  if (view.value === 'Rampensprung' && RAMP_SHORTCUT_ENTRY && TRACK.id === 'stadionring') {
    const entry = RAMP_SHORTCUT_ENTRY, before = trackPoint(entry.lip - 55, Math.abs(entry.lane) + 6), target = trackPoint(entry.lip - 15, entry.lane + 3);
    camera.position.set(before.x, elevationAt(entry.lip - 55) + 20, before.z);
    camera.setTarget(new Vector3(target.x, elevationAt(entry.lip - 15) + 2, target.z)); camera.fov = .96; world.setPlayerVisible(true); return;
  }
  if (view.value === 'Windspur') {
    camera.position.copyFrom(center.add(f.scale(-10)).add(side.scale(7)).add(new Vector3(0, 6, 0)));
    camera.setTarget(center.add(f.scale(18)).add(side.scale(3.4)));
    camera.fov = .9; world.setPlayerVisible(true); return;
  }
  if (view.value === 'Ereignisblick') {
    const event = el<HTMLSelectElement>('track-event').value as keyof typeof EVENT_PROGRESS;
    const s = EVENT_PROGRESS[event], lane = event === 'loudspeaker' ? 5.5 : event === 'parade' ? -5.5 : event === 'wave' ? 5.2 : 0;
    const eventPoint = trackPoint(s, lane), eventForward = new Vector3(Math.sin(eventPoint.heading), 0, Math.cos(eventPoint.heading));
    const eventSide = new Vector3(Math.cos(eventPoint.heading), 0, -Math.sin(eventPoint.heading));
    const eventHeight = event === 'loudspeaker' || event === 'parade' ? 7 + elevationAt(s) : event === 'wave' ? .6 : event === 'balcony' ? 11 : elevationAt(s) + 5;
    const target = new Vector3(eventPoint.x, eventHeight + (event === 'loudspeaker' || event === 'parade' ? 1 : 0), eventPoint.z);
    camera.position.copyFrom(target.add(eventSide.scale(18)).add(eventForward.scale(-8)).add(new Vector3(0, 9, 0)));
    camera.setTarget(target); camera.fov = 1.08; world.setPlayerVisible(true); return;
  }
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
  previewRaceTime = performance.now() / 1000;
  setParadeClock(previewRaceTime);
  const p = currentPoint();
  state = { ...state, x: p.x, z: p.z, heading: p.heading, travelHeading: p.heading,
    height: currentElevation() + (jump ? 1.4 : 0), grounded: !jump, trick: !!jump, jumpDuration: 1, jumpRemaining: jump ? 1 - jump : 0 };
  world.setDamage?.([health], [health === 0 ? 1 : 0]); world.setTimeOfDay?.(night);
  world.present(state, []);
  if (free.active) free.update(Math.min(engine.getDeltaTime() / 1000, .1));
  else if (focusZeppelin) {
    const eventNode = activeEventNode();
    if (eventNode?.isEnabled()) {
      const side = new Vector3(Math.cos(eventNode.rotation.y), 0, -Math.sin(eventNode.rotation.y));
      const target = eventNode.getAbsolutePosition();
      const range = triggeredEvent === 'zeppelin' ? 95 : 22, height = triggeredEvent === 'zeppelin' ? 24 : 8;
      camera.position.copyFrom(target.add(side.scale(range * focusSide)).add(new Vector3(0, height, 0))); camera.setTarget(target);
    } else { focusZeppelin = false; frameCamera(); }
  } else frameCamera();
  for (const light of world.scene.lights) if (/Nearby street lantern|Kart headlight beam/.test(light.name)) {
    light.setEnabled(el<HTMLInputElement>('lamps').checked && (el<HTMLSelectElement>('quality').value !== '0' || light.name.endsWith(' 0')));
  }
  world.scene.render();
}
function status() {
  const event = el<HTMLSelectElement>('track-event').value as keyof typeof EVENT_NAMES;
  const eventNode = activeEventNode();
  const eventNodeState = triggeredEvent === 'zeppelin' || triggeredEvent === 'column' ? ` · Ereignismodell ${eventNode ? 'aktiv' : 'inaktiv'}` : '';
  el<HTMLButtonElement>('focus-event').disabled = !eventNode;
  el('status').textContent = `${CAST[Number(driver.value)].name} · ${TRACK.name} · ${view.value} · Ereignis ${EVENT_NAMES[event]} · Zuletzt ausgelöst ${triggeredEvent ? EVENT_NAMES[triggeredEvent] : 'keines'}${eventNodeState} · Sprung ${jump} · Nacht ${night} · Karosserie ${health} % · Position ${coursePosition}`;
  try { sessionStorage.setItem('dk-feedback-view', JSON.stringify({ driver: driver.value, track: track.value, view: view.value,
    quality: el<HTMLSelectElement>('quality').value, lamps: el<HTMLInputElement>('lamps').checked, shortcut: el<HTMLInputElement>('shortcut').checked,
    jump, night, health, position: coursePosition, paused })); } catch { /* Storage is optional in the QA page. */ }
}
async function load() {
  engine.stopRenderLoop(); el<HTMLButtonElement>('trigger-event').disabled = true; world?.scene.dispose(); triggeredEvent = null; focusZeppelin = false; focusSide = 1; selectTrack(track.value as TrackId);
  el('status').textContent = 'Lädt tatsächliche Spielszene …';
  world = await createSliceScene(engine, 0, 1);
  Object.assign(window, { __feedbackWorld: world });
  world.scene.blockMaterialDirtyMechanism = false;
  camera = new FreeCamera('Prüfkamera', Vector3.Zero(), world.scene); camera.minZ = .05;
  world.attachCamera?.(camera); world.setWeather?.('sun'); world.setRoster?.([Number(driver.value)]); world.setQuality?.(Number(el<HTMLSelectElement>('quality').value), false);
  render(); await world.scene.whenReadyAsync(); render(); status(); el<HTMLButtonElement>('trigger-event').disabled = false; if (!paused) engine.runRenderLoop(render);
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
el('trigger-event').onclick = () => {
  const event = el<HTMLSelectElement>('track-event').value as keyof typeof EVENT_NAMES;
  // Put the free preview camera on the event section so visual checks inspect the same road segment as the effect.
  coursePosition = ((EVENT_PROGRESS[event] - TRACK.start + TRACK.length) % TRACK.length) / TRACK.length;
  el<HTMLInputElement>('position').value = String(coursePosition);
  triggeredEvent = event;
  // The live race starts this timed traffic before asking the scene to display it.
  // Mirror that setup here so the event preview shows the actual moving column.
  if (event === 'column') startParade(previewRaceTime);
  world.trackEvent?.(event);
  if (paused) { paused = false; el('pause').textContent = 'Bild einfrieren'; engine.runRenderLoop(render); }
  render(); status();
};
el('focus-event').onclick = () => { if (!activeEventNode()?.isEnabled()) return; if (focusZeppelin) focusSide *= -1; else focusZeppelin = true; world.setPlayerVisible(false); render(); status(); };
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
