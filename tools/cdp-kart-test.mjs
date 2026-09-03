import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const repositoryPath = dirname(dirname(fileURLToPath(import.meta.url)));
const clientPath = join(repositoryPath, "client");
const debugPort = 9300 + Math.floor(Math.random() * 400);
const profilePath = mkdtempSync(join(tmpdir(), "diktator-kart-cdp-"));
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let devServer;

const serverIsReady = async () => {
  try {
    return (await fetch("http://127.0.0.1:5173/")).ok;
  } catch {
    return false;
  }
};

if (!(await serverIsReady())) {
  devServer = spawn(
    process.execPath,
    [
      join(clientPath, "node_modules/vite/bin/vite.js"),
      "--host",
      "127.0.0.1",
      "--port",
      "5173",
    ],
    { cwd: clientPath, stdio: "ignore" },
  );
  for (
    let attempt = 0;
    attempt < 80 && !(await serverIsReady());
    attempt += 1
  )
    await wait(100);
  if (!(await serverIsReady()))
    throw new Error("Vite development server did not start.");
}

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profilePath}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "about:blank",
  ],
  { stdio: "ignore" },
);

let socket;
let commandId = 0;
const pending = new Map();
const consoleMessages = [];

const connect = async () => {
  let target;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await fetch(
        `http://127.0.0.1:${debugPort}/json/list`,
      ).then((response) => response.json());
      target = targets.find((candidate) => candidate.type === "page");
      if (target) break;
    } catch {
      // Chrome is still starting.
    }
    await wait(100);
  }
  if (!target) throw new Error("Chrome CDP target was not available.");

  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    } else if (message.method === "Runtime.consoleAPICalled") {
      consoleMessages.push(
        message.params.args
          .map((arg) => arg.value ?? arg.description ?? "")
          .join(" "),
      );
    } else if (message.method === "Runtime.exceptionThrown") {
      consoleMessages.push(
        `EXCEPTION: ${message.params.exceptionDetails.text}`,
      );
    }
  });
};

const command = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++commandId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });

const evaluate = async (expression) => {
  const result = await command("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};

const key = async (code, down) => {
  const keyValue =
    code === "Space" ? " " : code.replace("Key", "").toLowerCase();
  const keyCode = code === "Space" ? 32 : code.charCodeAt(code.length - 1);
  await command("Input.dispatchKeyEvent", {
    type: down ? "keyDown" : "keyUp",
    code,
    key: keyValue,
    windowsVirtualKeyCode: keyCode,
    nativeVirtualKeyCode: keyCode,
  });
};

const parseNumber = (line, field) => {
  const match = line.match(new RegExp(`${field}=(-?\\d+(?:\\.\\d+)?)`));
  return match ? Number(match[1]) : 0;
};

const summarize = (name, text) => {
  const lines = text.split("\n").filter((line) => line.startsWith("#"));
  const samples = lines.map((line) => ({
    t: parseNumber(line, "t"),
    inputX: parseNumber(line, "inputX"),
    headingDelta: parseNumber(line, "headingDelta"),
    angularY: parseNumber(line, "angularY"),
    forwardSpeed: parseNumber(line, "forwardSpeed"),
    lateralSpeed: parseNumber(line, "lateralSpeed"),
    centerOffset: parseNumber(line, "centerOffset"),
  }));
  const maximum = (field) =>
    Math.max(0, ...samples.map((sample) => Math.abs(sample[field])));
  const lastSteeringSample = samples.findLastIndex(
    (sample) => Math.abs(sample.inputX) > 0.5,
  );
  const afterSteering =
    lastSteeringSample >= 0 ? samples.slice(lastSteeringSample + 4) : [];
  return {
    name,
    samples: samples.length,
    finalSpeed: samples.at(-1)?.forwardSpeed ?? 0,
    finalHeadingDelta: samples.at(-1)?.headingDelta ?? 0,
    finalAngularY: samples.at(-1)?.angularY ?? 0,
    maxSpeed: maximum("forwardSpeed"),
    timeTo90PercentSpeed:
      samples.find((sample) => Math.abs(sample.forwardSpeed) >= 14.4)?.t ??
      null,
    maxAngularY: maximum("angularY"),
    maxAngularAfterSteering: Math.max(
      0,
      ...afterSteering.map((sample) => Math.abs(sample.angularY)),
    ),
    maxLateralSpeed: maximum("lateralSpeed"),
    maxCenterOffset: maximum("centerOffset"),
  };
};

const runTest = async (name, actions) => {
  await evaluate("document.getElementById('reset-kart').click()");
  await wait(350);
  await evaluate("document.getElementById('telemetry-start').click()");
  for (const action of actions) {
    if (action.key) await key(action.key, action.down);
    if (action.wait) await wait(action.wait);
  }
  for (const code of ["KeyW", "KeyA", "KeyS", "KeyD", "Space"])
    await key(code, false);
  await wait(250);
  await evaluate("document.getElementById('telemetry-stop').click()");
  const text = await evaluate(
    "document.getElementById('telemetry-log').textContent",
  );
  return summarize(name, text);
};

try {
  await connect();
  await command("Runtime.enable");
  await command("Page.enable");
  await command("Page.navigate", { url: "http://127.0.0.1:5173/" });
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const ready = await evaluate(
      "Boolean(document.getElementById('reset-kart') && document.getElementById('application-canvas'))",
    );
    if (ready) break;
    await wait(100);
  }
  await wait(1200);

  const tests = [];
  tests.push(
    await runTest("straight", [{ key: "KeyW", down: true }, { wait: 3000 }]),
  );
  tests.push(
    await runTest("left-tap", [
      { key: "KeyW", down: true },
      { wait: 1500 },
      { key: "KeyA", down: true },
      { wait: 250 },
      { key: "KeyA", down: false },
      { wait: 1500 },
    ]),
  );
  tests.push(
    await runTest("left-hold", [
      { key: "KeyW", down: true },
      { wait: 1500 },
      { key: "KeyA", down: true },
      { wait: 2000 },
      { key: "KeyA", down: false },
      { wait: 1200 },
    ]),
  );
  tests.push(
    await runTest("right-hold", [
      { key: "KeyW", down: true },
      { wait: 1500 },
      { key: "KeyD", down: true },
      { wait: 2000 },
      { key: "KeyD", down: false },
      { wait: 1200 },
    ]),
  );
  tests.push(
    await runTest("brake", [
      { key: "KeyW", down: true },
      { wait: 2500 },
      { key: "KeyW", down: false },
      { key: "KeyS", down: true },
      { wait: 1500 },
    ]),
  );
  tests.push(
    await runTest("reverse", [{ key: "KeyS", down: true }, { wait: 2500 }]),
  );
  tests.push(
    await runTest("handbrake", [
      { key: "KeyW", down: true },
      { wait: 2500 },
      { key: "KeyW", down: false },
      { key: "Space", down: true },
      { wait: 2000 },
    ]),
  );
  tests.push(
    await runTest("throttle-handbrake", [
      { key: "KeyW", down: true },
      { key: "Space", down: true },
      { wait: 2000 },
    ]),
  );
  tests.push(
    await runTest("coast", [
      { key: "KeyW", down: true },
      { wait: 2500 },
      { key: "KeyW", down: false },
      { wait: 2500 },
    ]),
  );

  process.stdout.write(
    `${JSON.stringify({ tests, consoleMessages }, null, 2)}\n`,
  );
} finally {
  socket?.close();
  chrome.kill();
  devServer?.kill();
  await wait(200);
  rmSync(profilePath, { recursive: true, force: true });
}
