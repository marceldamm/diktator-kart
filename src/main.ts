import { Engine } from '@babylonjs/core/Engines/engine';
import { KartCamera } from './camera';
import { attachKeyboard, InputHub } from './input';
import { advanceKart, initialKartState, KART_TUNING, resolveKartContacts, type KartState } from './kart-model';
import { createTestScene, type TestScene } from './scene';
import './style.css';
import { TRACK, advanceRace, botInput, createRaceProgress, gridKart, projectTrack, trackPoint, trackProgress, type RaceProgress } from './track';
import { KartAudio } from './audio';

type AppState = 'loading' | 'running' | 'paused' | 'error';
interface AssetManifest { schemaVersion: number; name: string; files: string[] }

const canvas = document.querySelector<HTMLCanvasElement>('#render-canvas')!;
const status = document.querySelector<HTMLElement>('#status')!;
const message = document.querySelector<HTMLElement>('#message')!;
const debug = document.querySelector<HTMLElement>('#debug')!;
const pauseButton = document.querySelector<HTMLButtonElement>('#pause')!;
const restartButton = document.querySelector<HTMLButtonElement>('#restart')!;
const debugButton = document.querySelector<HTMLButtonElement>('#debug-toggle')!;
const speedDisplay = document.querySelector<HTMLElement>('#speed')!;
const modeDisplay = document.querySelector<HTMLElement>('#drive-mode')!;
const surfaceDisplay = document.querySelector<HTMLElement>('#surface')!;
const cameraDisplay = document.querySelector<HTMLElement>('#camera-mode')!;
const fleetDisplay = document.querySelector<HTMLElement>('#fleet-count')!;

const FIXED_STEP = 1 / 60;
const LOAD_KART_COUNT = new URLSearchParams(location.search).get('fleet') === '1' ? 0 : 5;
const CONTACT_SCENARIO = new URLSearchParams(location.search).get('scenario') === 'contact';
const FORCE_WEBGL1 = new URLSearchParams(location.search).get('webgl') === '1';
const LAB_WORLD = new URLSearchParams(location.search).get('world') === 'lab';
const DEMO = new URLSearchParams(location.search).get('demo') === '1';
document.body.classList.toggle('showcase', !LAB_WORLD);

function initialLoadKarts(): KartState[] {
  if (CONTACT_SCENARIO) return [{ ...initialKartState(), z: 10, heading: Math.PI,
    travelHeading: Math.PI, speed: 8 }];
  if (!LAB_WORLD) return Array.from({ length: LOAD_KART_COUNT }, (_, i) => gridKart(i));
  return Array.from({ length: LOAD_KART_COUNT }, (_, index) => {
    const angle = index * 2 * Math.PI / LOAD_KART_COUNT;
    const heading = angle + Math.PI / 2;
    return { ...initialKartState(), x: 10.5 * Math.sin(angle), z: 10.5 * Math.cos(angle),
      heading, travelHeading: heading, speed: 8 };
  });
}

class App {
  private engine: Engine | undefined;
  private testScene: TestScene | undefined;
  private camera: KartCamera | undefined;
  private kart: KartState = initialKartState();
  private loadKarts: KartState[] = initialLoadKarts();
  private accumulator = 0;
  private queuedHopPress = false;
  private readonly input = new InputHub();
  private readonly detachKeyboard = attachKeyboard(this.input);
  private state: AppState = 'loading';
  private lastAction = 'Keine';
  private manifestName = '–';
  private lastDebugUpdate = 0;
  private lastFrameAt = 0;
  private frameTimes: number[] = [];
  private rendererName = 'nicht verfügbar';
  private generation = 0;
  private racePhase: 'practice' | 'countdown' | 'race' | 'finished' = 'practice';
  private countdown = 3;
  private raceTime = 0;
  private progress: RaceProgress[] = [];
  private readonly audio = new KartAudio();
  private botStuck: number[] = [];

  constructor() {
    Object.defineProperty(window, '__DK', { get: () => ({ scene: this.testScene?.scene, kart: this.kart, bots: this.loadKarts, phase: this.racePhase, progress: this.progress }) });
    document.querySelector('#race-start')?.addEventListener('click', () => void this.startRace());
    document.querySelector('#sound-toggle')?.addEventListener('click', () => {
      this.audio.setEnabled(!this.audio.enabled); void this.audio.unlock();
      document.querySelector('#sound-toggle')!.textContent = this.audio.enabled ? 'Ton an' : 'Ton aus';
    });
    window.addEventListener('keydown', (event) => {
      if (!LAB_WORLD) void this.audio.unlock();
      if (event.code === 'Enter' && this.racePhase !== 'countdown') void this.startRace();
    });
    pauseButton.addEventListener('click', () => this.togglePause());
    restartButton.addEventListener('click', () => void this.restart());
    debugButton.addEventListener('click', () => { debug.hidden = !debug.hidden; });
    window.addEventListener('resize', () => this.engine?.resize());
    window.addEventListener('pagehide', () => this.dispose());
    void this.restart();
  }

  private show(state: AppState, detail: string): void {
    this.state = state;
    status.textContent = { loading: 'Lädt …', running: 'Testszene läuft', paused: 'Pausiert', error: 'Startfehler' }[state];
    message.textContent = detail;
    pauseButton.disabled = state === 'loading' || state === 'error';
    pauseButton.textContent = state === 'paused' ? 'Fortsetzen' : 'Pause';
    restartButton.disabled = state === 'loading';
    restartButton.textContent = state === 'error' ? 'Erneut versuchen' : 'Neustart';
    debugButton.disabled = state === 'loading';
  }

  private async loadManifest(): Promise<AssetManifest> {
    const response = await fetch('/assets/manifest.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Asset-Manifest: HTTP ${response.status}`);
    const manifest: unknown = await response.json();
    if (typeof manifest !== 'object' || manifest === null || !('schemaVersion' in manifest) || manifest.schemaVersion !== 1 || !('files' in manifest) || !Array.isArray(manifest.files) || !('name' in manifest) || typeof manifest.name !== 'string') {
      throw new Error('Asset-Manifest hat ein unbekanntes Format.');
    }
    return manifest as AssetManifest;
  }

  private createEngine(): Engine {
    if (FORCE_WEBGL1) return new Engine(canvas, true, { disableWebGL2Support: true });
    try {
      return new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    } catch (firstError) {
      try {
        return new Engine(canvas, true, { disableWebGL2Support: true });
      } catch (fallbackError) {
        throw new Error(`WebGL-Start fehlgeschlagen: ${String(firstError)} / WebGL1: ${String(fallbackError)}`);
      }
    }
  }

  private readRendererName(): string {
    const gl = this.engine?.webGLVersion === 2 ? canvas.getContext('webgl2') : canvas.getContext('webgl');
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    return gl && info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : 'nicht verfügbar';
  }

  private frameSummary(): string {
    if (this.frameTimes.length < 60) return `Framefenster: ${this.frameTimes.length}/300 · sammelt Daten`;
    const values = [...this.frameTimes].sort((a, b) => a - b);
    const at = (fraction: number) => values[Math.ceil(values.length * fraction) - 1].toFixed(1);
    return `Framefenster: ${values.length}/300 · P50 ${at(0.5)} ms · P95 ${at(0.95)} ms · P99 ${at(0.99)} ms\n>25 ms: ${values.filter((value) => value > 25).length} · >33 ms: ${values.filter((value) => value > 33).length}`;
  }

  private async restart(): Promise<void> {
    const generation = ++this.generation;
    this.show('loading', 'Asset-Manifest und Szene werden geladen.');
    this.input.reset();
    this.testScene?.scene.dispose();
    this.testScene = undefined;
    this.camera = undefined;
    this.kart = LAB_WORLD ? initialKartState() : gridKart(LOAD_KART_COUNT);
    this.loadKarts = initialLoadKarts();
    this.accumulator = 0;
    this.frameTimes = [];
    this.lastFrameAt = 0;
    this.queuedHopPress = false;
    this.racePhase = 'practice'; this.raceTime = 0; this.botStuck = this.loadKarts.map(() => 0);
    if (!LAB_WORLD && !DEMO) this.loadKarts = this.loadKarts.map((s) => ({ ...s, speed: 0 }));
    this.progress = [this.kart, ...this.loadKarts].map(createRaceProgress);
    document.querySelector('#finish-card')?.setAttribute('hidden', '');
    speedDisplay.textContent = '0 km/h';
    modeDisplay.textContent = 'Bereit';
    surfaceDisplay.textContent = 'Ebener Boden';
    cameraDisplay.textContent = 'Verfolger nah';
    fleetDisplay.textContent = `${this.loadKarts.length + 1} ${this.loadKarts.length ? 'Fahrzeuge' : 'Fahrzeug'} im Techniktest`;
    this.lastAction = 'Keine';
    try {
      const manifest = await this.loadManifest();
      if (generation !== this.generation) return;
      this.manifestName = manifest.name;
      if (!this.engine) {
        this.engine = this.createEngine();
        this.rendererName = this.readRendererName();
        this.engine.runRenderLoop(() => this.frame());
      }
      const created = await createTestScene(this.engine, this.loadKarts.length, !LAB_WORLD);
      if (generation !== this.generation) { created.scene.dispose(); return; }
      this.testScene = created;
      this.camera = new KartCamera(this.testScene.scene, this.kart, !LAB_WORLD);
      this.testScene.present(this.kart, this.loadKarts);
      this.show('running', 'W/S fahren, A/D lenken; Space für Hop und Drift.');
    } catch (error) {
      if (generation === this.generation) this.show('error', error instanceof Error ? error.message : String(error));
    }
  }

  private async startRace(): Promise<void> {
    if (LAB_WORLD || this.state === 'loading') return;
    await this.audio.unlock();
    // Reuse assets; reset the simulation without reloading the entire scene.
    this.kart = gridKart(LOAD_KART_COUNT); this.loadKarts = initialLoadKarts();
    this.progress = [this.kart, ...this.loadKarts].map(createRaceProgress);
    this.botStuck = this.loadKarts.map(() => 0);
    this.racePhase = 'countdown'; this.countdown = 3.4; this.raceTime = 0;
    document.querySelector('#finish-card')?.setAttribute('hidden', '');
    this.camera?.update(this.kart, 0, true);
    this.accumulator = 0; this.queuedHopPress = false;
    if (this.state === 'paused') this.togglePause();
  }

  private updateRaceHud(): void {
    if (LAB_WORLD) return;
    const place = 1 + this.progress.slice(1).filter((p) => p.distance >= this.progress[0].distance).length;
    document.querySelector('#place')!.textContent = `${place}`;
    document.querySelector('#lap')!.textContent = `${Math.min(3, 1 + Math.floor(Math.max(0, this.progress[0].distance) / TRACK.length))} / 3`;
    document.querySelector('#race-time')!.textContent = `${Math.floor(this.raceTime / 60)}:${(this.raceTime % 60).toFixed(2).padStart(5, '0')}`;
    document.querySelector('#race-label')!.textContent = this.racePhase === 'practice' ? 'FREIE FAHRT' : this.racePhase === 'finished' ? 'ZIEL ERREICHT' : 'STADION GRAND PRIX';
    const countdown = document.querySelector<HTMLElement>('#countdown')!;
    countdown.hidden = this.racePhase !== 'countdown'; countdown.textContent = this.countdown > .4 ? `${Math.ceil(this.countdown - .4)}` : 'LOS!';
    document.querySelector('#race-start')!.textContent = this.racePhase === 'practice' ? 'Rennen starten ↵' : 'Neues Rennen ↵';
    const map = document.querySelector<HTMLCanvasElement>('#minimap')!, c = map.getContext('2d')!;
    c.clearRect(0, 0, 150, 230); c.strokeStyle = '#d3bd8b66'; c.lineWidth = 9; c.beginPath();
    for (let i = 0; i <= 100; i++) { const p = trackPoint(i / 100 * TRACK.length); const x = 75 + p.x * .75, y = 115 - p.z * .95; if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke();
    [this.kart, ...this.loadKarts].forEach((s, i) => { c.fillStyle = i === 0 ? '#ffe1a0' : '#95b8b8'; c.beginPath(); c.arc(75 + s.x * .75, 115 - s.z * .95, i ? 2.5 : 4.5, 0, Math.PI * 2); c.fill(); });
  }

  private togglePause(): void {
    if (this.state === 'running') {
      this.queuedHopPress = false;
      this.accumulator = 0;
      this.frameTimes = [];
      this.show('paused', 'Szene angehalten. P setzt fort.');
    }
    else if (this.state === 'paused') this.show('running', 'Szene läuft wieder.');
  }

  private frame(): void {
    const now = performance.now();
    if (this.state === 'running' && !document.hidden && this.lastFrameAt > 0) {
      const elapsed = now - this.lastFrameAt;
      if (elapsed > 0 && elapsed < 500) {
        this.frameTimes.push(elapsed);
        if (this.frameTimes.length > 300) this.frameTimes.shift();
      } else this.frameTimes = [];
    } else if (this.state !== 'running' || document.hidden) this.frameTimes = [];
    this.lastFrameAt = now;
    const frame = this.input.read();
    if (frame.pressed.has('restart')) void this.restart();
    if (frame.pressed.has('pause')) this.togglePause();
    if (frame.pressed.has('debug')) debug.hidden = !debug.hidden;
    if (this.state === 'running' && this.testScene) {
      if (frame.pressed.has('camera')) {
        this.lastAction = `Kamera: ${this.camera?.cycleView() ?? 'Verfolger nah'}`;
        cameraDisplay.textContent = this.camera?.viewName ?? 'Verfolger nah';
      }
      if (frame.pressed.has('item')) this.lastAction = 'Item-Eingabe erkannt';
      if (frame.pressed.has('special')) this.lastAction = 'Fähigkeits-Eingabe erkannt';
      if (frame.pressed.has('hopDrift')) this.queuedHopPress = true;
      const delta = Math.min(this.engine!.getDeltaTime() / 1000, 0.1);
      this.accumulator += delta;
      while (this.accumulator >= FIXED_STEP) {
        const countdown = !LAB_WORLD && this.racePhase === 'countdown';
        if (countdown) { this.countdown -= FIXED_STEP; if (this.countdown <= 0) this.racePhase = 'race'; }
        if (!countdown && this.racePhase !== 'finished') {
        const project = LAB_WORLD ? undefined : projectTrack;
        const traffic = [this.kart, ...this.loadKarts];
        this.kart = advanceKart(this.kart, DEMO && !LAB_WORLD ? botInput(this.kart, 0, traffic) : { ...frame, hopPressed: this.queuedHopPress }, FIXED_STEP, project);
        this.loadKarts = this.loadKarts.map((other, index) => {
          if (!LAB_WORLD && this.racePhase === 'practice' && !DEMO) return other;
          let next = advanceKart(other, LAB_WORLD ? { throttle: 1, steering: CONTACT_SCENARIO ? 0 : .75 } : botInput(other, index + 1, traffic), FIXED_STEP, project);
          if (!LAB_WORLD) {
            this.botStuck[index] = Math.abs(next.speed) < 1 ? this.botStuck[index] + FIXED_STEP : 0;
            if (this.botStuck[index] > 4) {
              const p = trackPoint(trackProgress(next.x, next.z), (index % 2 ? 1 : -1) * 1.8);
              next = { ...initialKartState(), ...p, travelHeading: p.heading }; this.botStuck[index] = 0;
              this.progress[index + 1].last = trackProgress(p.x, p.z);
            }
          }
          return next;
        });
        const resolved = resolveKartContacts([this.kart, ...this.loadKarts], project);
        this.kart = resolved[0];
        this.loadKarts = resolved.slice(1);
        if (!LAB_WORLD && this.racePhase === 'race') {
          this.raceTime += FIXED_STEP;
          [this.kart, ...this.loadKarts].forEach((s, i) => advanceRace(this.progress[i], s, this.raceTime));
          if (this.progress[0].finished) {
            this.racePhase = 'finished';
            const place = 1 + this.progress.slice(1).filter((p) => p.finished).length;
            document.querySelector('#finish-title')!.textContent = `Platz ${place} · Genehmigung erteilt`;
            document.querySelector('#finish-detail')!.textContent = `Drei Runden in ${this.raceTime.toFixed(2)} Sekunden. Enter startet die Revanche.`;
            document.querySelector('#finish-card')!.removeAttribute('hidden');
          }
        }
        }
        this.queuedHopPress = false;
        this.accumulator -= FIXED_STEP;
      }
      this.testScene.present(this.kart, this.loadKarts);
      this.camera?.update(this.kart, delta, false, frame.steering);
      this.testScene.setPlayerVisible(this.camera?.viewName !== 'Fahrerperspektive');
      this.updateRaceHud();
      speedDisplay.textContent = `${Math.round(Math.abs(this.kart.speed) * 3.6)} km/h${this.kart.speed < 0 ? ' rückwärts' : ''}`;
      modeDisplay.textContent = this.kart.impactRemaining > 0
        ? this.kart.impactKind === 'kart' ? 'Fahrzeugkontakt – Kart fängt sich'
          : this.kart.impactKind === 'obstacle' ? 'Hinderniskontakt – Kart fängt sich' : 'Randkontakt – Kart fängt sich'
        : this.kart.turboRemaining > 0
        ? `Mini-Turbo ${this.kart.turboRemaining.toFixed(1)} s`
        : this.kart.drifting
          ? this.kart.driftCharge >= KART_TUNING.driftChargeTime
            ? 'Drift geladen – Space loslassen'
            : `Drift lädt ${Math.round(this.kart.driftCharge / KART_TUNING.driftChargeTime * 100)} %`
          : this.kart.height > 0 ? 'Hop' : 'Bereit';
      const maximumContact = Math.max(...this.kart.wheelGroundHeights);
      surfaceDisplay.textContent = this.kart.grounded && maximumContact > 0.02
        ? `Bodenwelle · Radkontakt ${Math.round(maximumContact * 100)} cm`
        : this.kart.grounded && Math.abs(this.kart.suspensionOffset) > 0.012
          ? 'Federung schwingt aus' : 'Ebener Boden';
    }
    if (!LAB_WORLD) this.audio.update(this.kart, this.state === 'running' && this.racePhase !== 'countdown' && this.racePhase !== 'finished');
    this.testScene?.scene.render();
    if (!debug.hidden && performance.now() - this.lastDebugUpdate > 250) {
      this.lastDebugUpdate = performance.now();
      debug.textContent = `Status: ${this.state}\nEngine: Babylon ${Engine.Version}\nWebGL: ${this.engine?.webGLVersion ?? '–'}\nGrafik: ${this.rendererName}\nAuflösung: ${canvas.width} × ${canvas.height} Pixel · DPR ${window.devicePixelRatio.toFixed(2)}\nFPS: ${this.engine?.getFps().toFixed(0) ?? '–'}\n${this.frameSummary()}\nMeshes: ${this.testScene?.scene.meshes.length ?? 0}\nFahrzeuge: ${this.loadKarts.length + 1}\nAssetgruppe: ${this.manifestName}\nTempo: ${this.kart.speed.toFixed(2)} m/s\nPosition: ${this.kart.x.toFixed(2)}, ${this.kart.z.toFixed(2)} m\nRichtung: ${this.kart.heading.toFixed(2)} rad\nHop: ${this.kart.height.toFixed(2)} m\nFederung: ${this.kart.suspensionOffset.toFixed(3)} m / ${this.kart.suspensionVelocity.toFixed(2)} m/s\nRadkontakte: ${this.kart.wheelGroundHeights.map((value) => value.toFixed(2)).join(', ')} m\nKarosserieneigung: ${this.kart.bodyPitch.toFixed(3)} / ${this.kart.bodyRoll.toFixed(3)} rad\nRandstoß: ${this.kart.impactRemaining.toFixed(2)} s\nDrift: ${this.kart.drifting ? `${this.kart.driftCharge.toFixed(2)} s` : 'aus'}\nTurbo: ${this.kart.turboRemaining.toFixed(2)} s\nGas/Bremse: ${frame.throttle}\nLenkung: ${frame.steering}\nHop/Drift-Taste: ${frame.hopDrift}\nLetzte Aktion: ${this.lastAction}`;
    }
  }

  private dispose(): void {
    ++this.generation;
    this.detachKeyboard();
    this.testScene?.scene.dispose();
    this.engine?.stopRenderLoop();
    this.engine?.dispose();
  }
}

new App();
