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
import { RaycastKartController } from './game/raycast-kart';
import { TelemetryLog } from './game/telemetry-log';
import { createTestTrack } from './game/track';

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
    '<section class="telemetry-panel"><div class="telemetry-title"><strong>Geradeaus-Telemetrie</strong><span id="telemetry-status">gestoppt</span></div><div class="controls"><button id="telemetry-start" type="button">Logging starten</button><button id="telemetry-stop" type="button">Logging stoppen</button><button id="telemetry-clear" type="button">Log l&ouml;schen</button><button id="telemetry-copy" type="button">Log kopieren</button></div><pre id="telemetry-log" class="telemetry-log">Noch keine Samples aufgezeichnet.</pre></section>'
);

document.body.insertAdjacentHTML(
    'beforeend',
    '<div class="hud"><section class="panel"><h1>Diktator Kart</h1><p>WASD oder Pfeiltasten zum Fahren</p><button id="reset-kart" type="button">Kart zurücksetzen</button></section></div>'
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

createTestTrack(app.root);
const kart = createKart(app.root);
const input = new KeyboardInput();
const controller = new KartController();
let raycastController: RaycastKartController | undefined;
type DriveMode = 'legacy' | 'raycast';
let driveMode: DriveMode = 'raycast';
const debugHud = new DebugHud();
const telemetry = new TelemetryLog();
const telemetryLog = document.getElementById('telemetry-log')!;
const telemetryStatus = document.getElementById('telemetry-status')!;
const vehicleModeStatus = document.createElement('span');
vehicleModeStatus.id = 'vehicle-mode-status';
vehicleModeStatus.textContent = 'Eigenbau';
const raycastButton = document.createElement('button');
raycastButton.type = 'button';
raycastButton.textContent = 'RaycastVehicle';
raycastButton.addEventListener('click', () => setDriveMode('raycast'));
const legacyButton = document.createElement('button');
legacyButton.type = 'button';
legacyButton.textContent = 'Alter Controller';
legacyButton.addEventListener('click', () => setDriveMode('legacy'));
document.querySelector('.hud .panel')?.append(vehicleModeStatus, legacyButton, raycastButton);
const refreshTelemetryView = () => {
    telemetryLog.textContent = telemetry.getText();
    telemetryLog.scrollTop = telemetryLog.scrollHeight;
    telemetryStatus.textContent = telemetry.isActive
        ? `läuft · ${telemetry.count} Samples`
        : `gestoppt · ${telemetry.count} Samples`;
};
document.getElementById('reset-kart')!.addEventListener('click', () => {
    resetKart(kart);
    controller.reset();
    raycastController?.reset();
    telemetry.stop();
    telemetry.clear();
    refreshTelemetryView();
});
function setDriveMode(mode: DriveMode) {
    driveMode = mode;
    if (!raycastController) return;
    raycastController.setActive(mode === 'raycast');
    resetKart(kart);
    controller.reset();
    raycastController.reset();
    telemetry.stop();
    telemetry.clear();
    vehicleModeStatus.textContent = mode === 'raycast' ? 'RaycastVehicle' : 'Eigenbau';
    refreshTelemetryView();
}
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
            raycastController.setActive(driveMode === 'raycast');
        } catch (error) {
            console.error('RaycastVehicle konnte nicht initialisiert werden.', error);
            raycastButton.disabled = true;
            vehicleModeStatus.textContent = 'RaycastVehicle nicht verfügbar';
        }
    }
    const kartInput = input.read();
    const activeController = driveMode === 'raycast' && raycastController ? raycastController : controller;
    if (driveMode === 'raycast' && raycastController) raycastController.update(kartInput, dt);
    else driveKart(controller, kart, kartInput, dt);
    debugHud.update(activeController.getDebugSnapshot(kart, kartInput));
    if (telemetry.update(dt, kart, activeController, kartInput)) refreshTelemetryView();
    followCamera.update(camera, kart, dt);
});
window.addEventListener('resize', () => app.resizeCanvas());
