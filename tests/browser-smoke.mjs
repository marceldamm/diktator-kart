// Run against a local Vite server and Chrome with CDP on 127.0.0.1:9223.
// Example: npm run dev; chrome --headless=new --remote-debugging-port=9223 http://127.0.0.1:4173/
import assert from 'node:assert/strict';
import { access, writeFile as saveFile } from 'node:fs/promises';

// Preserve historical evidence on routine reruns; UPDATE_EVIDENCE=1 refreshes it deliberately.
async function writeFile(path, data) {
  try {
    await access(path);
    if (process.env.UPDATE_EVIDENCE !== '1') return;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await saveFile(path, data);
}

const targets = await (await fetch('http://127.0.0.1:9223/json')).json();
const page = targets.find((item) => item.type === 'page' && item.url?.startsWith('http://127.0.0.1:4173/'));
assert.ok(page, 'Chrome test page is missing');

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
let nextId = 0;
const pending = new Map();
socket.addEventListener('message', (event) => {
  const reply = JSON.parse(event.data);
  if (!reply.id) return;
  const request = pending.get(reply.id);
  pending.delete(reply.id);
  if (reply.error) request.reject(new Error(reply.error.message));
  else request.resolve(reply.result);
});

function send(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function read() {
  const result = await send('Runtime.evaluate', {
    expression: `JSON.stringify({status: document.querySelector('#status')?.textContent, message: document.querySelector('#message')?.textContent, speed: document.querySelector('#speed')?.textContent, mode: document.querySelector('#drive-mode')?.textContent, surface: document.querySelector('#surface')?.textContent, camera: document.querySelector('#camera-mode')?.textContent})`,
    returnByValue: true,
  });
  return JSON.parse(result.result.value);
}
async function key(type, key, code, virtualKeyCode) {
  await send('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: virtualKeyCode, nativeVirtualKeyCode: virtualKeyCode });
}
async function tap(keyName, code, virtualKeyCode) {
  await key('keyDown', keyName, code, virtualKeyCode);
  await key('keyUp', keyName, code, virtualKeyCode);
}
async function loadSample(fleet) {
  await send('Page.navigate', { url: `http://127.0.0.1:4173/?fleet=${fleet}` });
  await delay(500);
  for (let attempt = 0; attempt < 30 && (await read()).status !== 'Testszene läuft'; attempt++) await delay(200);
  assert.equal((await read()).status, 'Testszene läuft', JSON.stringify(await read()));
  const result = await send('Runtime.evaluate', {
    expression: `(async () => {
      const frames = [];
      let previous = await new Promise(requestAnimationFrame);
      for (let i = 0; i < 120; i++) {
        const next = await new Promise(requestAnimationFrame);
        frames.push(next - previous);
        previous = next;
      }
      frames.sort((a, b) => a - b);
      document.querySelector('#debug-toggle').click();
      await new Promise((resolve) => setTimeout(resolve, 350));
      const diagnostics = document.querySelector('#debug').textContent;
      const gl = document.querySelector('#render-canvas').getContext('webgl2');
      const rendererInfo = gl?.getExtension('WEBGL_debug_renderer_info');
      return { fleet: document.querySelector('#fleet-count').textContent,
        meshes: Number(diagnostics.match(/Meshes: (\\d+)/)?.[1]),
        medianFrameMs: Number(frames[60].toFixed(2)),
        p95FrameMs: Number(frames[114].toFixed(2)),
        debugFps: Number(diagnostics.match(/FPS: (\\d+)/)?.[1]),
        renderer: rendererInfo ? gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL) : 'unbekannt' };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  return result.result.value;
}

try {
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/?fleet=1' });
  await delay(500);
  for (let attempt = 0; attempt < 30 && (await read()).status !== 'Testszene läuft'; attempt++) await delay(200);
  assert.equal((await read()).status, 'Testszene läuft', JSON.stringify(await read()));
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await send('Runtime.evaluate', { expression: `document.querySelector('#debug').hidden = true` });

  await key('keyDown', 'w', 'KeyW', 87);
  let contact;
  for (let attempt = 0; attempt < 60; attempt++) {
    await delay(50);
    contact = await read();
    if (contact.surface?.startsWith('Bodenwelle')) break;
  }
  assert.match(contact.surface, /Bodenwelle/, `Expected wheel contact: ${JSON.stringify(contact)}`);
  const contactScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/evidence/m2c-bodenkontakt-chrome.png', Buffer.from(contactScreenshot.data, 'base64'));
  await key('keyUp', 'w', 'KeyW', 87);
  await tap('r', 'KeyR', 82);
  await delay(300);
  assert.equal((await read()).surface, 'Ebener Boden');

  await key('keyDown', 'w', 'KeyW', 87);
  await delay(900);
  const driving = await read();
  assert.ok(Number.parseInt(driving.speed, 10) > 0, `Expected movement: ${JSON.stringify(driving)}`);

  await key('keyDown', 'a', 'KeyA', 65);
  await key('keyDown', ' ', 'Space', 32);
  await delay(200);
  const hopping = await read();
  assert.equal(hopping.mode, 'Hop');
  const hopScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/evidence/m2b-hop-chrome.png', Buffer.from(hopScreenshot.data, 'base64'));
  await delay(1200);
  const charged = await read();
  assert.match(charged.mode, /Drift geladen/);
  const driftScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/evidence/m2b-drift-chrome.png', Buffer.from(driftScreenshot.data, 'base64'));

  await key('keyUp', ' ', 'Space', 32);
  await delay(120);
  const boosted = await read();
  assert.match(boosted.mode, /Mini-Turbo/);
  const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/evidence/m2b-turbo-chrome.png', Buffer.from(screenshot.data, 'base64'));

  await key('keyUp', 'a', 'KeyA', 65);
  await key('keyUp', 'w', 'KeyW', 87);
  await tap('p', 'KeyP', 80);
  await delay(100);
  const paused = await read();
  assert.equal(paused.status, 'Pausiert');
  await delay(300);
  assert.deepEqual(await read(), paused, 'Pause should freeze speed and turbo timer');

  await tap('r', 'KeyR', 82);
  await delay(300);
  const restarted = await read();
  assert.equal(restarted.status, 'Testszene läuft');
  assert.equal(restarted.speed, '0 km/h');
  assert.equal(restarted.mode, 'Bereit');
  assert.equal(restarted.camera, 'Verfolger nah');
  await tap('c', 'KeyC', 67);
  await delay(700);
  const farView = await read();
  assert.equal(farView.camera, 'Verfolger fern');
  const farScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/evidence/m2d-kamera-fern-chrome.png', Buffer.from(farScreenshot.data, 'base64'));
  await key('keyDown', 'w', 'KeyW', 87);
  await delay(800);
  const farMoving = await read();
  assert.equal(farMoving.camera, 'Verfolger fern');
  assert.ok(Number.parseInt(farMoving.speed, 10) > 0);
  const farMovingScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/evidence/m2d-kamera-fern-fahrt-chrome.png', Buffer.from(farMovingScreenshot.data, 'base64'));
  await key('keyUp', 'w', 'KeyW', 87);
  await tap('r', 'KeyR', 82);
  await delay(300);
  await tap('c', 'KeyC', 67);
  await delay(80);
  await tap('c', 'KeyC', 67);
  await key('keyDown', 'a', 'KeyA', 65);
  await delay(500);
  const driverView = await read();
  assert.equal(driverView.camera, 'Fahrerperspektive');
  const driverScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/evidence/m2d-fahrerperspektive-chrome.png', Buffer.from(driverScreenshot.data, 'base64'));
  await key('keyDown', 'w', 'KeyW', 87);
  await delay(800);
  await key('keyDown', ' ', 'Space', 32);
  await delay(1400);
  const driverDrift = await read();
  assert.equal(driverDrift.camera, 'Fahrerperspektive');
  assert.match(driverDrift.mode, /Drift geladen/);
  const driverDriftScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/evidence/m2d-fahrerperspektive-drift-chrome.png', Buffer.from(driverDriftScreenshot.data, 'base64'));
  await key('keyUp', ' ', 'Space', 32);
  await key('keyUp', 'w', 'KeyW', 87);
  await key('keyUp', 'a', 'KeyA', 65);
  await tap('c', 'KeyC', 67);
  await delay(100);
  assert.equal((await read()).camera, 'Verfolger nah');
  const oneKart = await loadSample(1);
  const sixKarts = await loadSample(6);
  assert.equal(oneKart.fleet, '1 Fahrzeug im Techniktest');
  assert.equal(sixKarts.fleet, '6 Fahrzeuge im Techniktest');
  assert.ok(sixKarts.meshes >= oneKart.meshes + 35, `Expected five cloned karts: ${JSON.stringify({ oneKart, sixKarts })}`);
  const fleetScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/evidence/m2e-sechs-fahrzeuge-chrome.png', Buffer.from(fleetScreenshot.data, 'base64'));
  await tap('r', 'KeyR', 82);
  await delay(300);
  await send('Runtime.evaluate', { expression: `document.querySelector('#debug').hidden = false` });
  await delay(300);
  const restartMetrics = await send('Runtime.evaluate', {
    expression: `Number(document.querySelector('#debug').textContent.match(/Meshes: (\\d+)/)?.[1])`,
    returnByValue: true,
  });
  assert.equal(restartMetrics.result.value, sixKarts.meshes, 'Restart should not grow scene meshes');
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/?fleet=1' });
  await delay(500);
  assert.equal((await read()).status, 'Testszene läuft');
  await send('Runtime.evaluate', { expression: `document.querySelector('#debug').hidden = true` });
  await key('keyDown', 'w', 'KeyW', 87);
  let boundary;
  for (let attempt = 0; attempt < 100; attempt++) {
    await delay(50);
    boundary = await read();
    if (boundary.mode?.startsWith('Randkontakt')) break;
  }
  assert.match(boundary.mode, /Randkontakt/, `Expected boundary reaction: ${JSON.stringify(boundary)}`);
  const boundaryScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/evidence/m2f-randkontakt-chrome.png', Buffer.from(boundaryScreenshot.data, 'base64'));
  await key('keyUp', 'w', 'KeyW', 87);
  await tap('r', 'KeyR', 82);
  await delay(300);
  assert.equal((await read()).speed, '0 km/h');
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/?fleet=1' });
  await delay(500);
  assert.equal((await read()).status, 'Testszene läuft');
  await send('Runtime.evaluate', { expression: `document.querySelector('#debug').hidden = true` });
  await key('keyDown', 'w', 'KeyW', 87);
  await delay(800);
  await key('keyDown', 'd', 'KeyD', 68);
  let obstacle;
  for (let attempt = 0; attempt < 60; attempt++) {
    await delay(50);
    obstacle = await read();
    if (obstacle.mode?.startsWith('Hinderniskontakt')) break;
  }
  assert.match(obstacle.mode, /Hinderniskontakt/, `Expected obstacle contact: ${JSON.stringify(obstacle)}`);
  const obstacleScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/evidence/m2g-hindernis-chrome.png', Buffer.from(obstacleScreenshot.data, 'base64'));
  await key('keyUp', 'd', 'KeyD', 68);
  await key('keyUp', 'w', 'KeyW', 87);
  await tap('r', 'KeyR', 82);
  await delay(300);
  assert.equal((await read()).speed, '0 km/h');
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/?scenario=contact' });
  await delay(500);
  assert.equal((await read()).status, 'Testszene läuft');
  await key('keyDown', 'w', 'KeyW', 87);
  let vehicleContact;
  for (let attempt = 0; attempt < 60; attempt++) {
    await delay(50);
    vehicleContact = await read();
    if (vehicleContact.mode?.startsWith('Fahrzeugkontakt')) break;
  }
  assert.match(vehicleContact.mode, /Fahrzeugkontakt/, `Expected vehicle contact: ${JSON.stringify(vehicleContact)}`);
  const vehicleScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/evidence/m2h-fahrzeugkontakt-chrome.png', Buffer.from(vehicleScreenshot.data, 'base64'));
  await key('keyUp', 'w', 'KeyW', 87);
  await tap('r', 'KeyR', 82);
  await delay(300);
  assert.equal((await read()).mode, 'Bereit');
  const contactViews = [];
  for (const [presses, label, file] of [
    [1, 'Verfolger fern', 'm2k-fahrzeugkontakt-fern-chrome.png'],
    [2, 'Fahrerperspektive', 'm2k-fahrzeugkontakt-fahrer-chrome.png'],
  ]) {
    await send('Page.navigate', { url: 'http://127.0.0.1:4173/?scenario=contact' });
    await delay(500);
    assert.equal((await read()).status, 'Testszene läuft');
    for (let index = 0; index < presses; index++) {
      await tap('c', 'KeyC', 67);
      await delay(80);
    }
    assert.equal((await read()).camera, label);
    await key('keyDown', 'w', 'KeyW', 87);
    let viewContact;
    for (let attempt = 0; attempt < 60; attempt++) {
      await delay(50);
      viewContact = await read();
      if (viewContact.mode?.startsWith('Fahrzeugkontakt')) break;
    }
    assert.match(viewContact.mode, /Fahrzeugkontakt/, `Expected ${label} contact: ${JSON.stringify(viewContact)}`);
    const viewScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(`docs/evidence/${file}`, Buffer.from(viewScreenshot.data, 'base64'));
    await key('keyUp', 'w', 'KeyW', 87);
    contactViews.push(viewContact);
  }
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/?fleet=1&webgl=1' });
  await delay(500);
  assert.equal((await read()).status, 'Testszene läuft');
  await send('Runtime.evaluate', { expression: `document.querySelector('#debug').hidden = false` });
  await delay(300);
  const webgl1 = await send('Runtime.evaluate', {
    expression: `document.querySelector('#debug').textContent.match(/WebGL: (\\d+)/)?.[1]`,
    returnByValue: true,
  });
  assert.equal(webgl1.result.value, '1', 'Forced WebGL1 path should start the scene');
  await key('keyDown', 'w', 'KeyW', 87);
  await delay(500);
  const fallbackDriving = await read();
  assert.ok(Number.parseInt(fallbackDriving.speed, 10) > 0);
  const fallbackScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile('docs/evidence/m2i-webgl1-chrome.png', Buffer.from(fallbackScreenshot.data, 'base64'));
  await key('keyUp', 'w', 'KeyW', 87);
  process.stdout.write(JSON.stringify({ contact, driving, hopping, charged, boosted, paused, restarted, farView, farMoving, driverView, driverDrift, oneKart, sixKarts, boundary, obstacle, vehicleContact, contactViews, webgl1: webgl1.result.value, fallbackDriving }) + '\n');
} finally {
  socket.close();
}
