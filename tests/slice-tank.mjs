// 'Größenbefehl' parade tank in the running game: Q, six karts, all cameras, run-over, revert, cooldown, restart.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { send, delay, evaluate, key, tap, shot, load, errors, socket } from './cdp.mjs';
const dk = (expr) => evaluate(`(()=>{const d=window.__DK;return ${expr};})()`);
const result = {};
try {
  await send('Runtime.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });
  await load(); await evaluate(`document.querySelector('#menu-race').click()`); await delay(4300);
  assert.equal(await dk('d.bots.length + 1'), 6);
  await tap('q', 'KeyQ', 81); await delay(500);
  result.active = await dk('d.kart.tankRemaining'); assert.ok(result.active > 7, 'tank did not start');
  assert.equal(await evaluate(`document.querySelector('#ability-card').classList.contains('active')`), true);
  await key('keyDown', 'w', 'KeyW', 87); await delay(1300); await shot('slice-tank-near');
  await tap('c', 'KeyC', 67); await delay(700); await shot('slice-tank-far');
  await tap('c', 'KeyC', 67); await delay(700); await shot('slice-tank-cockpit'); await tap('c', 'KeyC', 67);
  await delay(2500); await key('keyUp', 'w', 'KeyW', 87);
  result.crushes = await dk('d.abilityStats.crush'); result.events = await dk('d.abilityStats');
  for (let i = 0; i < 80 && await dk('d.kart.tankRemaining') > 0; i++) await delay(100);
  await delay(600);
  result.reverted = await dk('d.kart.tankRemaining'); assert.equal(result.reverted, 0);
  result.kartVisible = await evaluate(`window.__DK.scene.getMeshByName('kart0/hero-kart / Petrol enamel')?.isVisible ?? null`);
  result.cooldownText = await evaluate(`document.querySelector('#ability-info').textContent`); assert.match(result.cooldownText, /bereit in \d+ s/);
  await tap('q', 'KeyQ', 81); await delay(300); assert.equal(await dk('d.kart.tankRemaining'), 0, 'cooldown must block a second tank');
  await shot('slice-tank-reverted');
  await evaluate(`document.querySelector('#restart').click()`);
  for (let i = 0; i < 120; i++) { await delay(250); if (await evaluate(`document.querySelector('#status').textContent`) === 'Testszene läuft') break; }
  result.afterRestart = await evaluate(`document.querySelector('#ability-info').textContent`); assert.match(result.afterRestart, /Panzer bereit/);
  assert.deepEqual(errors, []);
  await writeFile(`docs/evidence/slice-tank${process.env.EVIDENCE_SUFFIX ?? ''}.json`, JSON.stringify({ date: new Date().toISOString(), method: 'Real browser, six karts, keyboard Q/W/C, no injected state', result, errors }, null, 2) + '\n');
  console.log(JSON.stringify(result)); console.log('SLICE_TANK_PASS');
} finally { await key('keyUp', 'w', 'KeyW', 87); socket.close(); }
