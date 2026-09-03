import {
    AppBase,
    AppOptions,
    CameraComponentSystem,
    CollisionComponentSystem,
    Color,
    Entity,
    FILLMODE_FILL_WINDOW,
    LightComponentSystem,
    RenderComponentSystem,
    RESOLUTION_AUTO,
    RigidBodyComponentSystem,
    ScriptComponentSystem,
    WasmModule,
    createGraphicsDevice
} from 'playcanvas';

import { DebugHud } from './game/debug-hud';
import { FollowCameraController } from './game/follow-camera';
import { KeyboardInput } from './game/input';
import { createKart, driveKart, KartController, resetKart } from './game/kart';
import { RaceController } from './game/race';
import { RaceHud } from './game/race-hud';
import { RaycastKartController } from './game/raycast-kart';
import { TelemetryLog } from './game/telemetry-log';
import { createRaceTrack } from './game/track';

import './starter.css';

WasmModule.setConfig('Ammo', {
    glueUrl: '/ammo/ammo.wasm.js',
    wasmUrl: '/ammo/ammo.wasm.wasm',
    fallbackUrl: '/ammo/ammo.js'
});
await new Promise<void>((resolve) => {
    WasmModule.getInstance('Ammo', () => resolve());
});

document.body.insertAdjacentHTML(
    'beforeend',
    '<section class="telemetry-panel"><div class="telemetry-title"><strong>Telemetrie und Log</strong><span id="telemetry-status">gestoppt</span></div><div class="controls"><button id="telemetry-start" type="button">Logging starten</button><button id="telemetry-stop" type="button">Logging stoppen</button><button id="telemetry-clear" type="button">Log l&ouml;schen</button><button id="telemetry-copy" type="button">Log kopieren</button></div><pre id="telemetry-log" class="telemetry-log">Noch keine Samples aufgezeichnet.</pre></section>'
);

document.body.insertAdjacentHTML(
    'beforeend',
    '<div class="hud"><section class="panel"><h1>Diktator Kart</h1><p>WASD/Pfeiltasten zum Fahren &middot; Space = Hop / Drift</p><div class="controls"><button id="start-race" type="button">Start</button><button id="reset-kart" type="button">Kart zur&uuml;cksetzen</button></div></section></div>'
);

const canvas = document.getElementById('application-canvas') as HTMLCanvasElement;
const device = await createGraphicsDevice(canvas);
const options = new AppOptions();
options.graphicsDevice = device;
options.componentSystems = [
    RenderComponentSystem,
    CameraComponentSystem,
    LightComponentSystem,
    ScriptComponentSystem,
    CollisionComponentSystem,
    RigidBodyComponentSystem
];

const app = new AppBase(canvas);
app.init(options);
app.start();
app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
app.setCanvasResolution(RESOLUTION_AUTO);
app.systems.rigidbody!.gravity.set(0, -9.81, 0);

createRaceTrack(app.root);
const kart = createKart(app.root);
const input = new KeyboardInput();
const controller = new KartController();
const race = new RaceController();
race.reset(kart);
const raceHud = new RaceHud();
let raycastController: RaycastKartController | undefined;
const debugHud = new DebugHud();
const telemetry = new TelemetryLog();
const telemetryLog = document.getElementById('telemetry-log')!;
const telemetryStatus = document.getElementById('telemetry-status')!;
const refreshTelemetryView = () => {
    telemetryLog.textContent = telemetry.getText();
    telemetryLog.scrollTop = telemetryLog.scrollHeight;
    telemetryStatus.textContent = telemetry.isActive
        ? `läuft · ${telemetry.count} Samples`
        : `gestoppt · ${telemetry.count} Samples`;
};
const restartRace = () => {
    resetKart(kart);
    controller.reset();
    raycastController?.reset();
    race.reset(kart);
    telemetry.stop();
    telemetry.clear();
    refreshTelemetryView();
};
document.getElementById('reset-kart')!.addEventListener('click', restartRace);
document.getElementById('start-race')!.addEventListener('click', () => {
    restartRace();
    race.start(kart);
});
document.getElementById('telemetry-start')!.addEventListener('click', () => {
    telemetry.start(kart);
    refreshTelemetryView();
});
document.getElementById('telemetry-stop')!.addEventListener('click', () => {
    telemetry.stop();
    refreshTelemetryView();
});
document.getElementById('telemetry-clear')!.addEventListener('click', () => {
    telemetry.clear();
    refreshTelemetryView();
});
document.getElementById('telemetry-copy')!.addEventListener('click', async () => {
    await navigator.clipboard.writeText(telemetry.getText());
    telemetryStatus.textContent = 'kopiert';
});

const camera = new Entity('camera');
camera.setPosition(0, 4.5, 13);
camera.lookAt(kart.getPosition());
camera.addComponent('camera', { clearColor: new Color(0.05, 0.07, 0.11) });
app.root.addChild(camera);
const followCamera = new FollowCameraController();

const light = new Entity('light');
light.addComponent('light', {
    type: 'directional',
    intensity: 2.5,
    castShadows: true,
    shadowBias: 0.2,
    normalOffsetBias: 0.05
});
light.setEulerAngles(45, 35, 0);
app.root.addChild(light);

app.on('update', (dt: number) => {
    if (!raycastController) {
        try {
            raycastController = new RaycastKartController(kart, app);
            raycastController.setActive(true);
        } catch (error) {
            console.error('RaycastVehicle konnte nicht initialisiert werden.', error);
        }
    }
    const rawInput = input.read();
    const kartInput = race.canDrive ? rawInput : { steering: 0, throttle: 0, hop: false, drift: false };
    const activeController = raycastController ?? controller;
    if (raycastController) raycastController.update(kartInput, dt);
    else driveKart(controller, kart, kartInput, dt);
    debugHud.update(activeController.getDebugSnapshot(kart, kartInput));
    if (telemetry.update(dt, kart, activeController, kartInput)) refreshTelemetryView();
    followCamera.update(camera, kart, dt);
    race.update(kart, dt);
    raceHud.update(race.snapshot());
});
window.addEventListener('resize', () => app.resizeCanvas());
