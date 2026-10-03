// Real early paint, interrupted modules/assets and retry, then real scene/restart.
// Run against a built preview with an isolated Chrome: CDP_PORT=9226 SLICE_URL=...
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { send, evaluate, delay, socket } from './cdp.mjs';
const base = process.env.SLICE_URL ?? 'http://127.0.0.1:4173/';
let mode = 'hold-module', held;
const evidence = [];
socket.addEventListener('message', async event => {
  const response = JSON.parse(event.data);
  if (response.method !== 'Fetch.requestPaused') return;
  const { requestId, request } = response.params;
  const main = /\/src\/main\.ts|\/assets\/index-[^/]+\.js/.test(request.url);
  if (mode === 'hold-module' && main) held = requestId;
  else if (mode === 'fail-kart' && request.url.includes('/hero-kart.glb')) held = requestId;
  else if (mode === 'fail-kart-retries' && request.url.includes('/hero-kart.glb')) await send('Fetch.failRequest', { requestId, errorReason: 'Failed' });
  else await send('Fetch.continueRequest', { requestId });
});
const wait = async (expression, description) => {
  for (let i = 0; i < 240; i++) { if (await evaluate(expression)) return; await delay(250); }
  throw Error(`Timeout: ${description}`);
};
const shot = async name => {
  const result = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(`docs/evidence/${name}.png`, Buffer.from(result.data, 'base64'));
};
const snapshot = () => evaluate(`({loading:document.body.classList.contains('is-loading'),message:document.querySelector('#loading-message').textContent,count:document.querySelector('#loading-count').textContent,value:document.querySelector('#loading-progress').value,total:document.querySelector('#loading-progress').max,retry:!document.querySelector('#loading-retry').hidden,events:window.__loadEvents,scene:!!window.__DK?.scene,vehicles:(window.__DK?.bots?.length??0)+1})`);
try {
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__loadEvents=[];window.addEventListener('dk:load-progress',e=>window.__loadEvents.push(e.detail.completed));` });
  await send('Fetch.enable', { patterns: [{ urlPattern: '*src/main.ts*' }, { urlPattern: '*/assets/index-*.js*' }] });
  await send('Page.navigate', { url: base });
  await wait(`document.querySelector('.loading-art')?.complete && document.querySelector('.loading-art').naturalWidth>0`, 'concept image');
  assert.ok(held, 'Game module must actually be paused');
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.start-menu')).visibility`), 'hidden');
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.loading-screen')).display`), 'flex');
  assert.equal(await evaluate(`document.querySelector('#loading-progress').hasAttribute('value')`), false);
  await shot('loading-early-desktop'); evidence.push({ check: 'Styled first paint before game module; other HTML hidden', ...await snapshot() });
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('#loading-progress')).animationName`), 'none');
  assert.ok(await evaluate(`document.querySelector('.loading-content').getBoundingClientRect().right<=innerWidth && document.documentElement.scrollWidth<=innerWidth`));
  await shot('loading-early-mobile');
  await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setEmulatedMedia', { features: [] });
  await send('Fetch.failRequest', { requestId: held, errorReason: 'Failed' }); held = undefined;
  await wait(`!document.querySelector('#loading-retry').hidden`, 'module failure notice');
  assert.equal((await snapshot()).count, 'Startfehler');
  await shot('loading-module-error'); evidence.push({ check: 'Module download error stays styled and offers retry', ...await snapshot() });
  await send('Fetch.disable'); mode = 'normal';
  await evaluate(`document.querySelector('#loading-retry').click()`);
  await wait(`window.__DK?.state==='running' && !document.body.classList.contains('is-loading')`, 'first real scene');
  let ready = await snapshot();
  assert.equal(ready.value, 6); assert.equal(ready.vehicles, 6); assert.deepEqual(ready.events, [0,1,2,3,4,5,6]);
  await shot('loading-to-real-menu'); evidence.push({ check: 'Retry loads all real sections; overlay yields to Babylon menu', ...ready });
  mode = 'fail-kart';
  await send('Fetch.enable', { patterns: [{ urlPattern: '*hero-kart.glb*' }] });
  await send('Page.reload', { ignoreCache: true });
  await wait(`document.querySelector('#loading-progress').value===3`, 'three real completed sections');
  assert.ok(held, 'Hero asset must actually be paused');
  await shot('loading-real-progress'); evidence.push({ check: 'Actual three completed sections before hero asset; no timer progress', ...await snapshot() });
  mode = 'fail-kart-retries';
  await send('Fetch.failRequest', { requestId: held, errorReason: 'Failed' }); held = undefined;
  await wait(`window.__DK?.state==='error' && !document.querySelector('#loading-retry').hidden`, 'kart failure');
  const failed = await snapshot(); assert.equal(failed.loading, true); assert.ok(failed.value < 6);
  await shot('loading-asset-error'); evidence.push({ check: 'Interrupted hero asset stops real progress and offers retry', ...failed });
  await send('Fetch.disable'); mode = 'normal';
  await evaluate(`document.querySelector('#loading-retry').click()`);
  await wait(`window.__DK?.state==='running' && !document.body.classList.contains('is-loading')`, 'asset retry scene');
  await evaluate(`document.querySelector('#restart').click()`);
  await wait(`window.__DK?.state==='running' && window.__loadEvents.filter(n=>n===6).length===2`, 'scene restart');
  evidence.push({ check: 'Scene restart resets sections and completes again', ...await snapshot() });
  await send('Page.navigate', { url: base + '?world=lab' });
  await wait(`window.__DK?.state==='running' && !document.body.classList.contains('is-loading')`, 'lab scene');
  const lab = await snapshot(); assert.equal(lab.value, 2); assert.equal(lab.total, 2);
  evidence.push({ check: 'Lab has only its two actual sections', ...lab });
  await send('Page.navigate', { url: base });
  await wait(`window.__DK?.state==='running' && !document.body.classList.contains('is-loading')`, 'final menu');
  await writeFile('docs/evidence/loading-browser-check.json', JSON.stringify({ url: base, viewport: '1600x900; 390x844 CSS/mobile emulation', evidence }, null, 2) + '\n');
  console.log('PASS: early desktop/mobile paint, reduced motion, module failure/retry, actual six-section scene, hero failure/retry, scene restart and lab.');
} finally { await send('Fetch.disable').catch(() => {}); socket.close(); }
