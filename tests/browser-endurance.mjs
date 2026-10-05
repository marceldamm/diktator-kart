// Longer local GPU probe. Requires Vite on 4173 and a visible isolated Chrome CDP tab on 9223.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const targets = await (await fetch('http://127.0.0.1:9223/json')).json();
const page = targets.find((target) => target.type === 'page' && target.url?.startsWith('http://127.0.0.1:4173/'));
assert.ok(page, 'Chrome test page is missing');
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
const pending = new Map();
const exceptions = [];
let nextId = 0;
socket.addEventListener('message', (event) => {
  const reply = JSON.parse(event.data);
  if (reply.method === 'Runtime.exceptionThrown') exceptions.push(reply.params.exceptionDetails.text);
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
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function key(type, keyName, code, virtualKeyCode) {
  await send('Input.dispatchKeyEvent', { type, key: keyName, code,
    windowsVirtualKeyCode: virtualKeyCode, nativeVirtualKeyCode: virtualKeyCode });
}
async function tap(keyName, code, virtualKeyCode) {
  await key('keyDown', keyName, code, virtualKeyCode);
  await key('keyUp', keyName, code, virtualKeyCode);
  await delay(80);
}
async function waitRunning() {
  for (let attempt = 0; attempt < 50; attempt++) {
    const status = await evaluate(`document.querySelector('#status')?.textContent`);
    if (status === 'Testszene läuft') return;
    if (status === 'Startfehler') throw new Error(await evaluate(`document.querySelector('#message')?.textContent`));
    await delay(100);
  }
  throw new Error('Test scene did not start');
}
async function readDiagnostics() {
  return evaluate(`(() => {
    const diagnostics = document.querySelector('#debug').textContent;
    const gl = document.querySelector('#render-canvas').getContext('webgl2');
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    return {
      meshes: Number(diagnostics.match(/Meshes: (\\d+)/)?.[1]),
      fps: Number(diagnostics.match(/FPS: (\\d+)/)?.[1]),
      webgl: diagnostics.match(/WebGL: (\\d+)/)?.[1],
      renderer: info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : 'unbekannt',
      camera: document.querySelector('#camera-mode').textContent,
      speed: document.querySelector('#speed').textContent,
    };
  })()`);
}
async function frameSample() {
  return evaluate(`(async () => {
    const intervals = [];
    let previous = await new Promise(requestAnimationFrame);
    for (let index = 0; index < 300; index++) {
      const next = await new Promise(requestAnimationFrame);
      intervals.push(next - previous);
      previous = next;
    }
    const sorted = [...intervals].sort((a, b) => a - b);
    const round = (value) => Number(value.toFixed(2));
    return {
      frames: intervals.length,
      medianMs: round(sorted[149]),
      p95Ms: round(sorted[284]),
      p99Ms: round(sorted[296]),
      longestMs: round(sorted[299]),
      over25Ms: intervals.filter((value) => value > 25).length,
      over33Ms: intervals.filter((value) => value > 33).length,
    };
  })()`);
}

try {
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  const world = process.argv[3] === 'showcase' ? 'showcase' : 'lab';
  const samples = [];
  for (const fleet of [1, 6]) {
    await send('Page.navigate', { url: `http://127.0.0.1:4173/?fleet=${fleet}${world === 'lab' ? '&world=lab' : ''}` });
    await delay(500);
    await waitRunning();
    await evaluate(`document.querySelector('#debug').hidden = false`);
    for (let view = 0; view < 3; view++) {
      if (view > 0) {
        await tap('c', 'KeyC', 67);
        await delay(500);
      }
      await key('keyDown', 'w', 'KeyW', 87);
      await key('keyDown', 'a', 'KeyA', 65);
      const frames = await frameSample();
      await key('keyUp', 'a', 'KeyA', 65);
      await key('keyUp', 'w', 'KeyW', 87);
      await delay(300);
      const diagnostics = await readDiagnostics();
      assert.equal(diagnostics.camera, ['Verfolger nah', 'Verfolger fern', 'Fahrerperspektive'][view]);
      assert.equal(diagnostics.webgl, '2');
      assert.ok(diagnostics.meshes > 0);
      samples.push({ fleet, ...diagnostics, ...frames });
      await tap('r', 'KeyR', 82);
      await waitRunning();
      await delay(300);
      const reset = await readDiagnostics();
      assert.equal(reset.meshes, diagnostics.meshes, 'Mesh count grew after restart');
      assert.equal(reset.speed, '0 km/h');
      // Restart returns to the near view; restore the next view below.
      for (let next = 0; next < view; next++) await tap('c', 'KeyC', 67);
    }
  }
  assert.equal(samples.length, 6);
  assert.ok(samples.every((sample) => sample.frames === 300));
  assert.equal(exceptions.length, 0, `Browser exceptions: ${exceptions.join('; ')}`);
  const result = { date: new Date().toISOString(), world, viewport: '1280x800', method: 'Visible Chrome CDP, 300 requestAnimationFrame intervals per view; W+A held', samples, exceptions };
  await writeFile(process.argv[2] ?? 'docs/evidence/m2f-rtx-endurance.json', `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result)}\n`);
} finally {
  socket.close();
}
