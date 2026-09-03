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

import { FollowCameraController } from './game/follow-camera';
import { KeyboardInput } from './game/input';
import { createKart, driveKart, KartController, resetKart } from './game/kart';
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
document.getElementById('reset-kart')!.addEventListener('click', () => {
    resetKart(kart);
    controller.reset();
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
    driveKart(controller, kart, input.read(), dt);
    followCamera.update(camera, kart, dt);
});
window.addEventListener('resize', () => app.resizeCanvas());
