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

import { AbilitySystem } from './game/abilities';
import { Announcer } from './game/announcer';
import type { AnnouncerCue } from './game/announcer';
import { BotRaceManager } from './game/bots';
import { DebugHud } from './game/debug-hud';
import { DriftEffects } from './game/drift-effects';
import { DEFAULT_DRIVER } from './game/drivers';
import { DrivingAudio } from './game/driving-audio';
import { FollowCameraController } from './game/follow-camera';
import { GameUi } from './game/game-ui';
import type { GameMode } from './game/game-ui';
import { KeyboardInput } from './game/input';
import { ItemSystem } from './game/items';
import type { ItemId } from './game/items';
import { applyKartStyle, createKart, driveKart, KartController, resetKart } from './game/kart';
import { KartAnimator } from './game/kart-animation';
import { RaceController } from './game/race';
import { RaceHud } from './game/race-hud';
import { RaycastKartController } from './game/raycast-kart';
import { SettingsPanel } from './game/settings';
import { TelemetryLog } from './game/telemetry-log';
import { createRaceTrack } from './game/track';
import { WorldEvents } from './game/world-events';

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
    '<section class="telemetry-panel is-hidden" id="telemetry-panel"><div class="telemetry-title"><strong>Telemetrie und Log</strong><span id="telemetry-status">gestoppt</span></div><div class="controls"><button id="telemetry-start" type="button">Logging starten</button><button id="telemetry-stop" type="button">Logging stoppen</button><button id="telemetry-clear" type="button">Log l&ouml;schen</button><button id="telemetry-copy" type="button">Log kopieren</button></div><pre id="telemetry-log" class="telemetry-log">Noch keine Samples aufgezeichnet.</pre></section>'
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
app.scene.ambientLight = new Color(0.58, 0.61, 0.66);

createRaceTrack(app.root);
const worldEvents = new WorldEvents(app.root);
const kart = createKart(app.root);
const input = new KeyboardInput();
const controller = new KartController();
const race = new RaceController();
const kartAnimator = new KartAnimator(kart);
const driftEffects = new DriftEffects(kart);
race.reset(kart);
const raceHud = new RaceHud();
const driftHud = document.createElement('div');
driftHud.className = 'drift-charge is-hidden';
driftHud.setAttribute('role', 'status');
const driftLabel = document.createElement('span');
const driftMeter = document.createElement('progress');
driftMeter.max = 1;
driftMeter.setAttribute('aria-label', 'Driftladung');
driftHud.append(driftLabel, driftMeter);
document.body.append(driftHud);
const bots = new BotRaceManager(app.root, !new URLSearchParams(window.location.search).has('kartTest'));
(window as unknown as { __diktatorKartBots: () => ReturnType<BotRaceManager['snapshot']> }).__diktatorKartBots = () =>
    bots.snapshot();
let raycastController: RaycastKartController | undefined;
const announcer = new Announcer();
const drivingAudio = new DrivingAudio();
let menuPaused = false;
let settingsOpen = false;
const synchronizePause = () => {
    app.timeScale = menuPaused || settingsOpen ? 0 : 1;
    input.reset();
    announcer.setPaused(app.timeScale === 0);
    drivingAudio.setPaused(app.timeScale === 0);
};
const itemCue: Partial<Record<ItemId | 'pickup' | 'shielded' | 'hit', AnnouncerCue>> = {
    pickup: 'pickup',
    'duty-rocket': 'rocket',
    immunity: 'immunity',
    shielded: 'shielded',
    hit: 'hit',
    'economic-plan': 'plan',
    propaganda: 'propaganda',
    censor: 'censor',
    statue: 'statue',
    'secret-police': 'police'
};
const items = new ItemSystem(
    app.root,
    bots,
    () => raycastController?.grantBoost(),
    (event) => {
        const cue = itemCue[event];
        if (cue) announcer.say(cue, event === 'hit' || event === 'shielded');
    }
);
const abilities = new AbilitySystem(
    DEFAULT_DRIVER,
    bots,
    (duration) => raycastController?.grantBoost(duration),
    (duration) => items.grantShield(duration)
);
let announcedLap = 1;
let previousPosition = 1;
let announcedFinish = false;
let gameMode: GameMode = 'grand-prix';
let savedTimeTrialBest: number | null = null;
let newTimeTrialRecord = false;
let botSnapshotTimer = 0;
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
    drivingAudio.reset();
    input.reset();
    resetKart(kart);
    controller.reset();
    kartAnimator.reset();
    raycastController?.reset();
    race.reset(kart);
    bots.reset();
    items.reset();
    bots.setActive(gameMode === 'grand-prix');
    items.setActive(gameMode === 'grand-prix');
    worldEvents.reset();
    announcer.reset();
    announcedLap = 1;
    previousPosition = 1;
    announcedFinish = false;
    abilities.reset();
    newTimeTrialRecord = false;
    const storedBest = Number(localStorage.getItem(`diktator-kart-best-v1-${gameUi?.selectedDriver.id}`));
    savedTimeTrialBest = Number.isFinite(storedBest) && storedBest > 0 ? storedBest : null;
    telemetry.stop();
    telemetry.clear();
    refreshTelemetryView();
};
const startRace = () => {
    drivingAudio.unlock();
    (document.activeElement as HTMLElement | null)?.blur();
    restartRace();
    race.start(kart);
    bots.start();
    announcer.say('start', true);
};
const gameUi = new GameUi({
    onDriver: (driver) => {
        applyKartStyle(kart, driver);
        abilities.setDriver(driver);
        bots.setPlayerDriver(driver);
    },
    onStart: startRace,
    onRestart: startRace,
    onMenu: restartRace,
    onPause: (paused) => {
        menuPaused = paused;
        synchronizePause();
    },
    onMode: (mode) => {
        gameMode = mode;
        bots.setActive(mode === 'grand-prix');
        items.setActive(mode === 'grand-prix');
    }
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
window.addEventListener('keydown', (event) => {
    if (event.code === 'F4') {
        event.preventDefault();
        document.getElementById('telemetry-panel')!.classList.toggle('is-hidden');
    }
});

const camera = new Entity('camera');
camera.setPosition(0, 4.5, 13);
camera.lookAt(kart.getPosition());
camera.addComponent('camera', { clearColor: new Color(0.22, 0.34, 0.5), farClip: 900, fov: 62 });
app.root.addChild(camera);
const followCamera = new FollowCameraController();
new SettingsPanel(
    (settings) => {
        announcer.setVolume(settings.masterVolume * settings.voiceVolume);
        drivingAudio.setVolume(settings.masterVolume * settings.effectsVolume);
        followCamera.setReducedMotion(settings.reducedCamera);
        document.documentElement.classList.toggle('reduced-effects', settings.reducedEffects);
    },
    (open) => {
        settingsOpen = open;
        synchronizePause();
    }
);

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
    if (app.timeScale === 0) {
        input.reset();
        return;
    }
    if (!raycastController) {
        try {
            raycastController = new RaycastKartController(kart, app);
            raycastController.setActive(true);
        } catch (error) {
            console.error('RaycastVehicle konnte nicht initialisiert werden.', error);
        }
    }
    const rawInput = input.read();
    if (input.consumeItem() && race.canDrive && !gameUi.isPaused) items.use(kart);
    if (input.consumeAbility() && race.canDrive && !gameUi.isPaused) abilities.use(kart);
    const kartInput =
        race.canDrive && !gameUi.isPaused
            ? {
                  ...rawInput,
                  throttle:
                      rawInput.throttle *
                      items.playerPowerScale *
                      worldEvents.playerPowerScale *
                      abilities.playerPowerScale
              }
            : { steering: 0, throttle: 0, hop: false, drift: false };
    const activeController = raycastController ?? controller;
    if (raycastController) raycastController.update(kartInput, dt);
    else driveKart(controller, kart, kartInput, dt);
    const kartSnapshot = activeController.getDebugSnapshot(kart, kartInput);
    const charge = raycastController?.getDriftCharge();
    drivingAudio.update(kartSnapshot, charge?.stage ?? 0, race.canDrive);
    driftEffects.update(
        dt,
        charge?.stage ?? 0,
        Boolean(charge?.active && race.canDrive),
        document.documentElement.classList.contains('reduced-effects')
    );
    driftHud.classList.toggle('is-hidden', !charge?.active || !race.canDrive);
    if (charge) {
        driftMeter.value = charge.fraction;
        driftHud.dataset.stage = String(charge.stage);
        driftLabel.textContent =
            charge.stage === 2
                ? 'TURBO II BEREIT · DRIFT LOSLASSEN'
                : charge.stage === 1
                  ? 'TURBO I BEREIT · WEITERLADEN'
                  : 'DRIFT LÄDT';
    }
    debugHud.update(kartSnapshot);
    kartAnimator.update(kartSnapshot, dt, document.documentElement.classList.contains('reduced-effects'));
    if (telemetry.update(dt, kart, activeController, kartInput)) refreshTelemetryView();
    followCamera.update(camera, kart, dt);
    if (!gameUi.isPaused) race.update(kart, dt);
    bots.update(dt, gameUi.isPaused);
    items.update(kart, dt, race.canDrive && !gameUi.isPaused);
    if (!gameUi.isPaused) abilities.update(dt);
    const leaderLap = Math.max(race.snapshot().lap, ...bots.snapshot().map((bot) => bot.lap));
    if (!gameUi.isPaused && race.canDrive) worldEvents.update(dt, gameMode === 'time-trial' ? 1 : leaderLap, kart);
    botSnapshotTimer += dt;
    if (botSnapshotTimer >= 1) {
        botSnapshotTimer = 0;
        document.documentElement.dataset.botState = JSON.stringify(bots.snapshot());
    }
    const raceSnapshot = race.snapshot();
    const racePosition = bots.playerPosition(kart, race);
    if (raceSnapshot.lap > announcedLap) {
        announcedLap = raceSnapshot.lap;
        announcer.say(raceSnapshot.lap === raceSnapshot.lapsToWin ? 'finalLap' : 'lap2', true);
    }
    if (racePosition > previousPosition) announcer.say(racePosition === 6 ? 'lastPlace' : 'losePlace');
    else if (racePosition < previousPosition) announcer.say(racePosition === 1 ? 'lead' : 'comeback');
    previousPosition = racePosition;
    if (raceSnapshot.phase === 'finished' && !announcedFinish) {
        announcedFinish = true;
        if (gameMode === 'time-trial' && (savedTimeTrialBest === null || raceSnapshot.raceTime < savedTimeTrialBest)) {
            savedTimeTrialBest = raceSnapshot.raceTime;
            newTimeTrialRecord = true;
            localStorage.setItem(`diktator-kart-best-v1-${gameUi.selectedDriver.id}`, String(savedTimeTrialBest));
        }
        announcer.say('finish', true);
    }
    raceHud.update(raceSnapshot, racePosition, gameMode === 'time-trial' ? 1 : bots.racers.length + 1);
    gameUi.update(raceSnapshot, savedTimeTrialBest, newTimeTrialRecord, racePosition);
});
window.addEventListener('resize', () => app.resizeCanvas());
