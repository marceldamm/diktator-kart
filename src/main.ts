import { Engine } from '@babylonjs/core/Engines/engine';
import { KartCamera } from './camera';
import { attachKeyboard, attachTouch, InputHub,type Action } from './input';
import { advanceKart, initialKartState, KART_TUNING, resolveKartContacts, type KartState } from './kart-model';
import { createTestScene, type TestScene } from './scene';
import './style.css';
import { TRACK, advanceRace, applySurfaceDrag, botInput, createRaceProgress, gridKart, projectTrack, recoverKart, trackPoint, trackHeightAt, rankRace, shortcutPoint, SHORTCUT_LENGTH, type RaceProgress } from './track';
import { KartAudio } from './audio';
import { CAST, rosterOrder } from './cast';
import {createItems,stepItems,botUsesItem,ITEM_NAMES,type ItemWorld} from './items';
import { ABILITY_NAME, ABILITY_RULES, abilityReady, botWantsAbility, createAbilities, stepAbilities, type AbilityWorld } from './abilities';
import { LoadingProgress, type LoadingPhase } from './loading-progress';
import { attachMouseCamera } from './mouse-camera';
import { interpolateKart } from './render-state';

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
  private previousKart = this.kart;
  private previousLoadKarts = this.loadKarts;
  private renderKart = this.kart;
  private renderSteps = 0;
  private accumulator = 0;
  private queuedHopPress = false;
  private readonly input = new InputHub();
  private readonly detachKeyboard = attachKeyboard(this.input);
  private readonly detachTouch=attachTouch(this.input,document.querySelector<HTMLElement>('#touch-controls')!);
  private readonly mouse = attachMouseCamera(canvas, {
    enabled: () => this.state === 'running' && !!this.camera && !this.camera.introMode && !this.camera.photoMode,
    look: (dx,dy) => this.camera?.look(dx,dy),
    dragging: active => this.camera?.setLooking(active),
    rear: active => this.input.setAction('mouse-rear','lookBack',active),
    zoom: delta => this.camera?.zoomBy(delta),
  });
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
  private recoveryRemaining: number[] = [];
  private photoWasPaused = false;
  private items:ItemWorld=createItems(LOAD_KART_COUNT+1);
  private abilities:AbilityWorld=createAbilities(LOAD_KART_COUNT+1);
  private queuedSpecial=false;
  private rain=false;
  /** Options choice; 'random' rolls sun, rain or snow every time the track loads. */
  private weatherChoice:'random'|'sun'|'rain'|'snow'='random';
  private weather:'sun'|'rain'|'snow'='sun';
  private abilityStats={transform:0,revert:0,crush:0};
  private itemMessage='';
  private itemMessageUntil=0;
  private reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  private quality = 1;
  private reducedEffects = false;
  private menuWasPaused=false;
  private lapTimes:number[]=[];
  private lapNoticeUntil=0;
  private lapNotice='';
  private welcomed=false;
  private lastRank=6;
  private voiceCooldown=0;
  private leadCooldown=0;
  private chosen=0;
  private order=rosterOrder(0);
  private selecting=false;
  private portraits: string[] | undefined;
  /** Roster member driving kart slot i (slot 0 = player). */
  private castOf(i: number) { return CAST[this.order[i] ?? i]; }

  constructor() {
    Object.defineProperty(window, '__DK', { get: () => ({ abilityStats: this.abilityStats, trackLength: TRACK.length, voices: this.audio.voiceCount, spoken: this.audio.spoken, scene: this.testScene?.scene, kart: this.kart, bots: this.loadKarts, phase: this.racePhase, progress: this.progress,items:this.items,state:this.state,view:this.camera?.viewName,menu:this.camera?.introMode,render:{kart:this.renderKart,alpha:this.accumulator/FIXED_STEP,steps:this.renderSteps} }) });
    try { this.quality = localStorage.getItem('dk-quality') === '0' ? 0 : 1; this.reducedEffects = localStorage.getItem('dk-reduced-effects') === '1'; } catch { /* Storage may be disabled by the browser. */ }
    try{const saved=localStorage.getItem('dk-reduced-motion');if(saved!==null)this.reducedMotion=saved==='1';}catch{}
    try{if(localStorage.getItem('dk-audio')==='0')this.audio.setEnabled(false);}catch{}
    try{const saved=Number(localStorage.getItem('dk-driver'));if(Number.isInteger(saved)&&saved>=0&&saved<CAST.length)this.chosen=saved;}catch{}
    this.order=rosterOrder(this.chosen);
    document.querySelector('#driver-back')?.addEventListener('click',()=>this.closeSelection());
    document.querySelector('#driver-go')?.addEventListener('click',()=>this.confirmSelection());
    document.querySelector('#driver-random')?.addEventListener('click',()=>this.pick((this.chosen+1+Math.floor(Math.random()*(CAST.length-1)))%CAST.length));
    window.addEventListener('keydown',(event)=>{
      if(!this.selecting)return;
      if(event.code==='ArrowLeft'||event.code==='ArrowRight'){event.preventDefault();event.stopImmediatePropagation();this.pick((this.chosen+(event.code==='ArrowLeft'?CAST.length-1:1))%CAST.length);}
      if(event.code==='Escape'){event.preventDefault();event.stopImmediatePropagation();this.closeSelection();}
      const digit=/^Digit([1-6])$/.exec(event.code);if(digit){event.preventDefault();event.stopImmediatePropagation();this.pick(Number(digit[1])-1);}
    },true);
    document.querySelector('#sound-toggle')!.textContent=this.audio.enabled?'Ton an':'Ton aus';
    const musicVolume=document.querySelector<HTMLInputElement>('#music-volume')!;
    try{const saved=Number(localStorage.getItem('dk-music-volume')??'14');musicVolume.value=String(Math.max(0,Math.min(100,saved)));}catch{}
    this.audio.setMusicVolume(Number(musicVolume.value)/100);
    musicVolume.addEventListener('input',()=>{this.audio.setMusicVolume(Number(musicVolume.value)/100);try{localStorage.setItem('dk-music-volume',musicVolume.value);}catch{}});
    document.querySelector('#motion-toggle')?.addEventListener('click',()=>{this.reducedMotion=!this.reducedMotion;this.applyMotion();});
    document.querySelector('#quality-toggle')?.addEventListener('click', () => { this.quality = 1 - this.quality; this.applyQuality(); });
    try { const asked = new URLSearchParams(location.search).get('weather') ?? localStorage.getItem('dk-weather-choice'); if (asked === 'sun' || asked === 'rain' || asked === 'snow' || asked === 'random') this.weatherChoice = asked; } catch { /* storage optional */ }
    document.querySelector('#weather-toggle')?.addEventListener('click', () => {
      const cycle = ['random', 'sun', 'rain', 'snow'] as const; this.weatherChoice = cycle[(cycle.indexOf(this.weatherChoice) + 1) % cycle.length];
      try { localStorage.setItem('dk-weather-choice', this.weatherChoice); } catch { /* storage optional */ }
      this.weather = this.weatherChoice === 'random' ? this.rollWeather() : this.weatherChoice; this.applyWeather();
    });
    document.querySelector('#effects-toggle')?.addEventListener('click', () => { this.reducedEffects = !this.reducedEffects; this.applyQuality(); });
    document.querySelector('#race-start')?.addEventListener('click', () => void this.startRace());
    document.querySelector('#menu-race')?.addEventListener('click',()=>void this.startRace());
    document.querySelector('#menu-practice')?.addEventListener('click',()=>{this.closeMenu();void this.audio.unlock().then(()=>setTimeout(()=>this.welcome(),400));});
    document.querySelector('#menu-button')?.addEventListener('click',()=>this.openMenu());
    document.querySelector('#finish-retry')?.addEventListener('click',()=>void this.beginRace());
    document.querySelector('#finish-menu')?.addEventListener('click',()=>this.openMenu());
    document.querySelector('#item-use')?.addEventListener('click',()=>{this.input.setAction('item-button','item',true);this.input.setAction('item-button','item',false);});
    document.querySelector('#sound-toggle')?.addEventListener('click', () => {
      this.audio.setEnabled(!this.audio.enabled); void this.audio.unlock();
      document.querySelector('#sound-toggle')!.textContent = this.audio.enabled ? 'Ton an' : 'Ton aus';
      try{localStorage.setItem('dk-audio',this.audio.enabled?'1':'0');}catch{}
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
    if (state !== 'running') this.mouse.release();
    document.body.classList.toggle('is-loading',state==='loading'||state==='error');
    document.body.classList.toggle('start-error',state==='error');
    if (state === 'error') window.dispatchEvent(new CustomEvent('dk:load-error', { detail }));
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
    this.mouse.release();
    const loading = new LoadingProgress(!LAB_WORLD);
    const notify = (detail: ReturnType<LoadingProgress['initial']>) => window.dispatchEvent(new CustomEvent('dk:load-progress', { detail }));
    const report = (phase: LoadingPhase) => { if (generation === this.generation) notify(loading.complete(phase)); };
    this.show('loading', 'Asset-Manifest und Szene werden geladen.');
    notify(loading.initial());
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
    document.body.classList.remove('photo-mode');
    document.body.classList.remove('menu-open');
    document.body.classList.remove('select-open');this.selecting=false;this.portraits=undefined;
    this.racePhase = 'practice'; this.raceTime = 0; this.botStuck = [this.kart,...this.loadKarts].map(() => 0); this.recoveryRemaining=this.botStuck.slice();
    this.lapTimes=[];this.lapNoticeUntil=0;
    if (!LAB_WORLD && !DEMO) this.loadKarts = this.loadKarts.map((s) => ({ ...s, speed: 0 }));
    this.resetRenderState();
    this.progress = [this.kart, ...this.loadKarts].map(createRaceProgress);
    this.items=createItems(LOAD_KART_COUNT+1);this.itemMessage='';this.abilities=createAbilities(LOAD_KART_COUNT+1);this.queuedSpecial=false;this.abilityStats={transform:0,revert:0,crush:0};
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
      report('engine');
      const created = await createTestScene(this.engine, this.loadKarts.length, !LAB_WORLD,this.quality,report);
      if (generation !== this.generation) { created.scene.dispose(); return; }
      this.testScene = created;
      this.testScene.setRoster?.(this.order);
      this.applyQuality();
      if (this.testScene) this.testScene.onLightning = () => this.audio.thunder();
      if (this.testScene) this.testScene.onFirework = () => this.audio.itemEvent('launch');
      this.weather = this.weatherChoice === 'random' ? this.rollWeather() : this.weatherChoice;
      this.applyWeather();
      this.camera = new KartCamera(this.testScene.scene, this.kart, !LAB_WORLD);
      this.testScene.attachCamera?.(this.camera.babylonCamera);
      this.drawMinimapTrack();
      this.applyMotion();
      this.testScene.present(this.kart, this.loadKarts);
      this.testScene.presentItems?.(this.items,[this.kart,...this.loadKarts]);
      await this.testScene.scene.whenReadyAsync();
      if(generation!==this.generation)return;
      this.testScene.scene.render();
      report('ready');
      this.show('running', 'W/S fahren, A/D lenken; Space für Hop und Drift.');
      if(!LAB_WORLD&&!DEMO)this.openMenu();
    } catch (error) {
      if (generation === this.generation) this.show('error', error instanceof Error ? error.message : String(error));
    }
  }

  /** Sunshine half of the time, otherwise rain or snow. */
  private rollWeather(): 'sun'|'rain'|'snow' { const r = Math.random(); return r < .5 ? 'sun' : r < .75 ? 'rain' : 'snow'; }
  private applyWeather(): void {
    if (LAB_WORLD) return;
    this.rain = this.weather === 'rain';
    if (this.testScene?.setWeather) this.testScene.setWeather(this.weather); else this.testScene?.setRain?.(this.rain);
    this.audio.setRain(this.rain);
    const label = { sun: 'Sonne', rain: 'Regen', snow: 'Schnee' }[this.weather];
    document.querySelector('#weather-toggle')!.textContent = this.weatherChoice === 'random' ? `Wetter Zufall (${label})` : `Wetter ${label}`;
  }
  private applyQuality(): void {
    if (LAB_WORLD) return;
    this.testScene?.setQuality?.(this.quality, this.reducedEffects);
    document.querySelector('#quality-toggle')!.textContent = this.quality ? 'Grafik Standard' : 'Grafik Basis';
    document.querySelector('#effects-toggle')!.textContent = this.reducedEffects ? 'Effekte reduziert' : 'Effekte voll';
    try { localStorage.setItem('dk-quality', String(this.quality)); localStorage.setItem('dk-reduced-effects', this.reducedEffects ? '1' : '0'); } catch { /* Session controls still work. */ }
  }
  private applyMotion():void {
    this.camera?.setReducedMotion(this.reducedMotion);
    document.querySelector('#motion-toggle')!.textContent=this.reducedMotion?'Kamera ruhig':'Kamera dynamisch';
    try{localStorage.setItem('dk-reduced-motion',this.reducedMotion?'1':'0');}catch{}
  }
  private openMenu():void {
    this.mouse.release();
    if(LAB_WORLD||this.state==='loading'||!this.camera)return;
    if(this.camera.introMode)return;
    if(this.camera.photoMode)this.camera.togglePhoto();document.body.classList.remove('photo-mode');
    this.menuWasPaused=this.state==='paused';this.input.reset();if(this.state==='running'&&this.racePhase!=='practice')this.togglePause();
    this.camera.setIntroMode(true);this.testScene?.setPlayerVisible(true);document.body.classList.add('menu-open');
    document.querySelector('#menu-options')!.append(document.querySelector('#options')!);
    document.querySelector('#menu-practice')!.textContent=this.racePhase==='practice'?'Strecke erkunden':'Weiterfahren';
    document.querySelector('#finish-card')?.setAttribute('hidden','');
  }
  private closeMenu():void {
    if(!this.camera?.introMode)return;this.camera.setIntroMode(false);document.body.classList.remove('menu-open');
    document.querySelector('#options-anchor')!.append(document.querySelector('#options')!);
    this.camera.update(this.kart,0,true);if(this.state==='paused'&&!this.menuWasPaused)this.togglePause();
    if(this.racePhase==='finished')document.querySelector('#finish-card')?.removeAttribute('hidden');
  }

  /** Every new Grand Prix starts with the driver selection; Revanche keeps the current driver. */
  private async startRace(): Promise<void> {
    if (LAB_WORLD || this.state === 'loading') return;
    if (this.selecting) { this.confirmSelection(); return; }
    this.openSelection();
  }
  private openSelection(): void {
    if (LAB_WORLD || this.state === 'loading' || !this.testScene) return;
    if (!this.camera?.introMode) this.openMenu();
    this.selecting = true; document.body.classList.add('select-open');
    this.renderSelection();
    if (!this.portraits && this.testScene.portraits) {
      const generation = this.generation;
      void this.testScene.portraits(this.order).then((shots) => { if (generation === this.generation) { this.portraits = shots; this.renderSelection(); } }).catch(() => undefined);
    }
  }
  private closeSelection(): void { this.selecting = false; document.body.classList.remove('select-open'); }
  private confirmSelection(): void {
    this.closeSelection();
    try { localStorage.setItem('dk-driver', String(this.chosen)); } catch { /* storage optional */ }
    void this.beginRace();
  }
  private pick(index: number): void {
    this.chosen = index; this.order = rosterOrder(index); this.testScene?.setRoster?.(this.order);
    this.renderSelection(); this.audio.voice(`${CAST[index].voice}-horn`, { channel: 'driver', rate: CAST[index].voiceRate, volume: .8 });
  }
  private renderSelection(): void {
    const grid = document.querySelector('#driver-grid')!; grid.replaceChildren();
    CAST.forEach((member, index) => {
      const card = document.createElement('button'); card.type = 'button'; card.className = 'driver-card'; card.setAttribute('role', 'option');
      card.classList.toggle('selected', index === this.chosen); card.setAttribute('aria-selected', String(index === this.chosen));
      const shot = this.portraits?.[index];
      const picture = shot ? Object.assign(document.createElement('img'), { src: shot, alt: `Karikatur ${member.name}` }) : Object.assign(document.createElement('span'), { className: 'portrait-wait', textContent: 'Porträt wird gerendert …' });
      const dot = document.createElement('i'); dot.style.background = member.paint;
      const name = document.createElement('strong'); name.textContent = member.name;
      const kart = document.createElement('small'); kart.textContent = member.kartName;
      card.append(picture, dot, name, kart);
      card.addEventListener('click', () => { if (index === this.chosen) this.confirmSelection(); else this.pick(index); });
      grid.append(card);
    });
    const m = CAST[this.chosen], detail = document.querySelector('#driver-detail')!; detail.replaceChildren();
    const title = document.createElement('b'); title.textContent = `${m.name} · ${m.kartName}`;
    const line = document.createElement('div'); line.textContent = `„${m.title}“ – ${m.flavour}`;
    const ability = document.createElement('div'); ability.innerHTML = '<em>Fähigkeit (Q):</em> '; ability.append(m.abilityIdea + ' · ');
    const item = document.createElement('em'); item.textContent = 'Wurfobjekt:'; ability.append(item, ` ${m.projectileIcon} ${m.projectileName}`);
    detail.append(title, line, ability);
  }

  private async beginRace(): Promise<void> {
    if (LAB_WORLD || this.state === 'loading') return;
    const generation=this.generation;
    await this.audio.unlock();
    if(generation!==this.generation||!this.testScene)return;
    this.closeMenu();
    this.mouse.release(); this.camera?.resetLook();
    if (this.camera?.photoMode) this.camera.togglePhoto(); document.body.classList.remove('photo-mode');
    // Reuse assets; reset the simulation without reloading the entire scene.
    this.kart = gridKart(LOAD_KART_COUNT); this.loadKarts = initialLoadKarts();
    this.resetRenderState();
    this.progress = [this.kart, ...this.loadKarts].map(createRaceProgress);
    this.items=createItems(LOAD_KART_COUNT+1);this.itemMessage='';
    this.botStuck = [this.kart,...this.loadKarts].map(() => 0); this.recoveryRemaining=this.botStuck.slice();
    this.racePhase = 'countdown'; this.countdown = 3.4; this.raceTime = 0; this.testScene.resetEffects?.();
    this.lapTimes=[];this.lapNoticeUntil=0;
    this.audio.cue('countdown');this.audio.voice('announcer-3',{force:true});this.lastRank=6;
    document.querySelector('#finish-card')?.setAttribute('hidden', '');
    this.camera?.update(this.kart, 0, true);
    this.accumulator = 0; this.queuedHopPress = false;
    if (this.state === 'paused') this.togglePause();
  }

  private resetRenderState(): void {
    this.previousKart = this.kart; this.previousLoadKarts = this.loadKarts;
    this.renderKart = this.kart; this.accumulator = 0; this.renderSteps = 0;
  }

  private updateRaceHud(): void {
    if (LAB_WORLD) return;
    const place=rankRace(this.progress).indexOf(0)+1;
    document.body.classList.toggle('race-finished',this.racePhase==='finished');
    document.body.classList.toggle('racing',this.racePhase==='countdown'||this.racePhase==='race');
    document.querySelector('#place')!.textContent = `${place}`;
    document.querySelector('#lap')!.textContent = `${Math.min(3, 1 + Math.floor(Math.max(0, this.progress[0].distance) / TRACK.length))} / 3`;
    document.querySelector('#race-time')!.textContent = `${Math.floor(this.raceTime / 60)}:${(this.raceTime % 60).toFixed(2).padStart(5, '0')}`;
    document.querySelector('#race-label')!.textContent = this.racePhase === 'practice' ? 'FREIE FAHRT' : this.racePhase === 'finished' ? 'ZIEL ERREICHT' : `STADION GRAND PRIX · ${this.castOf(0).name.toUpperCase()}`;
    const notice=document.querySelector<HTMLElement>('#lap-notice')!;notice.hidden=this.racePhase!=='race'||this.raceTime>=this.lapNoticeUntil;notice.textContent=this.lapNotice;
    const meter=document.querySelector<HTMLElement>('#drift-meter')!;meter.hidden=!this.kart.drifting&&this.kart.turboRemaining<=0;
    meter.classList.toggle('charged',this.kart.driftCharge>=KART_TUNING.driftChargeTime||this.kart.turboRemaining>0);
    document.querySelector<HTMLElement>('#drift-fill')!.style.width=`${100*(this.kart.turboRemaining>0?this.kart.turboRemaining/KART_TUNING.turboDuration:this.kart.driftCharge/KART_TUNING.driftChargeTime)}%`;
    const countdown = document.querySelector<HTMLElement>('#countdown')!;
    const item=this.items.slots[0];
    const own=this.castOf(0);
    document.querySelector('#item-name')!.textContent=item?(item==='trap'?ITEM_NAMES[item]:`${own.projectileName} · ${item==='homing'?'verfolgt':'voraus'}`):'Sendung abholen';
    document.querySelector('#item-icon')!.textContent=item==='direct'||item==='homing'?own.projectileIcon:item==='trap'?'§':'✉';
    const itemButton=document.querySelector<HTMLButtonElement>('#item-use')!;itemButton.disabled=!item||this.racePhase!=='race';
    document.querySelector('#item-info')!.textContent=this.items.time<this.itemMessageUntil?this.itemMessage:item?'E · einsetzen':this.racePhase==='practice'?'Im Rennen leuchtende Postkisten sammeln':'Leuchtende Postkisten auf der Strecke';
    const incoming=this.items.objects.some(o=>o.kind!=='trap'&&o.owner!==0&&Math.hypot(o.x-this.kart.x,o.z-this.kart.z)<15);
    const warning=document.querySelector<HTMLElement>('#item-warning')!;warning.hidden=!incoming;warning.textContent='⚠ Rohrpost im Anflug · ausweichen';
    { // Ability HUD: name, state and a cooldown/duration bar.
      const owns=this.order[0]===0,tank=this.kart.tankRemaining>0,ready=owns&&abilityReady(this.abilities,0,this.kart),cool=this.abilities.cooldown[0];
      const card=document.querySelector<HTMLElement>('#ability-card');
      if(card){card.classList.toggle('active',tank);card.classList.toggle('ready',ready);
        document.querySelector('#ability-name')!.textContent=owns?ABILITY_NAME:this.castOf(0).abilityIdea.split(' –')[0];
        document.querySelector('#ability-info')!.textContent=!owns?'Q · noch nicht gebaut':tank?`Panzer · ${this.kart.tankRemaining.toFixed(1)} s`:ready?'Q · Panzer bereit':`Q · bereit in ${Math.ceil(cool)} s`;
        document.querySelector<HTMLElement>('#ability-fill')!.style.width=`${100*(tank?this.kart.tankRemaining/ABILITY_RULES.tankDuration:1-cool/ABILITY_RULES.cooldown)}%`;}
    }
    countdown.hidden = this.racePhase !== 'countdown'; countdown.textContent = this.countdown > .4 ? `${Math.ceil(this.countdown - .4)}` : 'LOS!';
    document.querySelector('#race-start')!.textContent = this.racePhase === 'practice' ? 'Rennen starten ↵' : 'Neues Rennen ↵';
    const map = document.querySelector<HTMLCanvasElement>('#minimap')!, c = map.getContext('2d')!;
    c.clearRect(0, 0, map.width, map.height);
    if (this.minimapTrack) c.drawImage(this.minimapTrack, 0, 0);
    [...this.loadKarts, this.kart].forEach((s, i, all) => { const player = i === all.length - 1, [x, y] = this.minimapPoint(s.x, s.z); c.fillStyle = player ? '#ffe1a0' : this.castOf(i + 1).paint; c.strokeStyle = '#0b1a1e'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, player ? 5 : 3, 0, Math.PI * 2); c.fill(); c.stroke(); });
  }

  private minimapTrack: HTMLCanvasElement | undefined;
  private minimapPoint(x: number, z: number): [number, number] {
    const xs = TRACK.samples.map((p) => p.x), zs = TRACK.samples.map((p) => p.z);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs);
    const scale = Math.min(130 / (maxX - minX), 210 / (maxZ - minZ));
    return [75 + (x - (minX + maxX) / 2) * scale, 115 - (z - (minZ + maxZ) / 2) * scale];
  }
  private drawMinimapTrack(): void {
    const canvas = document.createElement('canvas'); canvas.width = 150; canvas.height = 230; const c = canvas.getContext('2d')!;
    c.lineJoin = 'round';
    for (const [width, color] of [[11, '#0b1a1e99'], [7, '#d3bd8b88']] as const) {
      c.strokeStyle = color; c.lineWidth = width; c.beginPath();
      for (let i = 0; i <= 160; i++) { const p = trackPoint(i / 160 * TRACK.length), [x, y] = this.minimapPoint(p.x, p.z); if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); }
      c.closePath(); c.stroke();
    }
    c.setLineDash([4, 3]); c.strokeStyle = '#d3bd8bbb'; c.lineWidth = 3; c.beginPath();
    for (let i = 0; i <= 20; i++) { const p = shortcutPoint(i / 20 * SHORTCUT_LENGTH), [x, y] = this.minimapPoint(p.x, p.z); if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); }
    c.stroke(); c.setLineDash([]);
    const a = trackPoint(TRACK.start, -6), b = trackPoint(TRACK.start, 6), [ax, ay] = this.minimapPoint(a.x, a.z), [bx, by] = this.minimapPoint(b.x, b.z);
    c.strokeStyle = '#f3eee0'; c.lineWidth = 3; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke();
    this.minimapTrack = canvas;
    document.querySelector('.map-card span')!.textContent = `${Math.round(TRACK.length)} m · STADIONRING`;
  }

  /** Welcome announcement once per page load, after the first gesture unlocked audio. */
  private welcome(): void { if (this.welcomed || LAB_WORLD) return; this.welcomed = this.audio.voice('announcer-welcome'); }
  /** A caricature's own line; the player's driver speaks louder than the field. */
  private say(kart: number, kind: 'hit' | 'pass' | 'win' | 'boost', volume = 1): void {
    const cast = this.castOf(kart);
    const id = kind === 'boost' && cast.voice !== 'general' ? `${cast.voice}-pass` : `${cast.voice}-${kind}`;
    this.audio.voice(id, { channel: 'driver', rate: cast.voiceRate, volume });
  }
  /** Rank changes drive the commentary: overtakes, a new leader, turbo shouts. */
  private commentary(): void {
    if (this.racePhase !== 'race') return;
    const rank = rankRace(this.progress).indexOf(0) + 1;
    if (rank < this.lastRank && this.raceTime > 4) {
      if (rank === 1 && this.leadCooldown === 0) { this.audio.voice('announcer-lead'); this.audio.cheer(1); this.leadCooldown = 20; }
      else if (this.voiceCooldown === 0) { this.say(0, 'pass'); this.voiceCooldown = 9; }
    }
    if (this.kart.turboRemaining > KART_TUNING.turboDuration - .05 && this.voiceCooldown === 0 && Math.random() < .35) { this.say(0, 'boost'); this.voiceCooldown = 12; }
    this.lastRank = rank;
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
    this.camera?.setLookBack(this.state === 'running' && !this.camera.introMode && this.input.isDown('lookBack'));
    if(frame.pressed.has('menu')&&!this.selecting&&!document.body.classList.contains('select-open')){if(this.camera?.introMode)this.closeMenu();else this.openMenu();}
    if(this.camera?.introMode&&!this.selecting&&(['accelerate','brake','steerLeft','steerRight','camera','photo'] as Action[]).some(a=>frame.pressed.has(a)))this.closeMenu();
    if (frame.pressed.has('restart')) void this.restart();
    if (frame.pressed.has('pause')) this.togglePause();
    if (frame.pressed.has('debug')) debug.hidden = !debug.hidden;
    if (!LAB_WORLD && frame.pressed.has('photo')) {
      const photo=this.camera?.togglePhoto(); document.body.classList.toggle('photo-mode',!!photo);
      if (photo) { this.photoWasPaused=this.state==='paused'; if(this.state==='running')this.togglePause(); }
      else if (!this.photoWasPaused && this.state==='paused') this.togglePause();
      this.testScene?.setPlayerVisible(true);
    }
    if ((this.state === 'running'||this.state==='paused')&&this.testScene) {
      if (frame.pressed.has('camera')) {
        this.mouse.release();
        this.lastAction = `Kamera: ${this.camera?.cycleView() ?? 'Verfolger nah'}`;
        cameraDisplay.textContent = this.camera?.viewName ?? 'Verfolger nah';
        this.camera?.update(this.renderKart,0,true,frame.steering);
        this.testScene.setPlayerVisible(this.camera?.viewName!=='Fahrerperspektive');
      }
    }
    if (this.state === 'running' && this.testScene) {
      if(frame.pressed.has('horn')&&!this.camera?.introMode&&!this.camera?.photoMode){
        if(this.audio.honk(this.castOf(0).voice,this.castOf(0).voiceRate))this.lastAction='Sprachhupe';
      }
      if (frame.pressed.has('item')) this.lastAction = 'Item-Eingabe erkannt';
      if (frame.pressed.has('special') && !this.camera?.introMode && !this.camera?.photoMode && this.racePhase !== 'countdown' && this.racePhase !== 'finished') {
        if (this.order[0] === 0) { this.queuedSpecial = true; this.lastAction = 'Größenbefehl (Q)'; }
        else { this.itemMessage = `${this.castOf(0).name}: eigene Fähigkeit folgt`; this.itemMessageUntil = this.items.time + 1.8; }
      }
      if (frame.pressed.has('hopDrift')) this.queuedHopPress = true;
      const delta = Math.min(this.engine!.getDeltaTime() / 1000, 0.1);
      this.accumulator += delta;
      this.renderSteps = 0;
      while (this.accumulator >= FIXED_STEP) {
        this.previousKart = this.kart; this.previousLoadKarts = this.loadKarts;
        this.renderSteps++;
        const countdown = !LAB_WORLD && this.racePhase === 'countdown';
        if (countdown) {
          const before=Math.ceil(this.countdown-.4);this.countdown -= FIXED_STEP;
          if(this.countdown<=0){this.racePhase='race';this.audio.cue('start');this.audio.voice('announcer-go',{force:true});this.audio.cheer(1);this.testScene?.celebrate?.('start');}
          else if(this.countdown>.4&&Math.ceil(this.countdown-.4)!==before){this.audio.cue('countdown');this.audio.voice(`announcer-${Math.ceil(this.countdown-.4)}`,{force:true});}
        }
        if (!countdown && this.racePhase !== 'finished') {
        const project = LAB_WORLD ? undefined : projectTrack;
        const traffic = [this.kart, ...this.loadKarts];
        const terrain = LAB_WORLD ? undefined : trackHeightAt;
        this.kart = advanceKart(this.kart, DEMO && !LAB_WORLD ? botInput(this.kart, 0, traffic) : { ...frame, hopPressed: this.queuedHopPress }, FIXED_STEP, project, terrain);
        this.loadKarts = this.loadKarts.map((other, index) => {
          if (!LAB_WORLD && this.racePhase === 'practice' && !DEMO) return other;
          let next = advanceKart(other, LAB_WORLD ? { throttle: 1, steering: CONTACT_SCENARIO ? 0 : .75 } : botInput(other, index + 1, traffic), FIXED_STEP, project, terrain);
          return next;
        });
        if(!LAB_WORLD) {
          const all=[this.kart,...this.loadKarts];
          const recovered=all.map((s,i)=>{
            if(this.recoveryRemaining[i]>0) { this.recoveryRemaining[i]=Math.max(0,this.recoveryRemaining[i]-FIXED_STEP);return {...s,speed:0}; }
            const intendsToDrive=i>0 ? this.racePhase!=='practice'||DEMO : DEMO||frame.throttle>0;
            this.botStuck[i]=intendsToDrive&&Math.abs(s.speed)<1 ? this.botStuck[i]+FIXED_STEP : 0;
            if(this.botStuck[i]>4||(i===0&&frame.pressed.has('recover')&&Math.abs(s.speed)<3)) {
              this.botStuck[i]=0;this.recoveryRemaining[i]=2;
              return recoverKart(s,all);
            }
            return s;
          });
          this.kart=recovered[0];this.loadKarts=recovered.slice(1);
        }
        if (!LAB_WORLD && this.rain) {
          // Rain puddles: water drag and a little lost grip while crossing.
          const puddles = this.testScene?.puddles?.() ?? [];
          const wade = (k: typeof this.kart) => puddles.some((p) => Math.hypot(p.x - k.x, p.z - k.z) < p.r) ? { ...k, speed: k.speed * (1 - 1.1 * FIXED_STEP), yawRate: k.yawRate * (1 - 2 * FIXED_STEP) } : k;
          this.kart = wade(this.kart); this.loadKarts = this.loadKarts.map(wade);
        }
        if (!LAB_WORLD) { this.kart = applySurfaceDrag(this.kart, FIXED_STEP); this.loadKarts = this.loadKarts.map((k) => applySurfaceDrag(k, FIXED_STEP)); }
        const resolved = resolveKartContacts([this.kart, ...this.loadKarts], project);
        this.kart = resolved[0];
        this.loadKarts = resolved.slice(1);
        if (!LAB_WORLD && (this.racePhase === 'race' || this.racePhase === 'practice')) {
          // Q: Sarah's 'Größenbefehl' parade tank for the player's driver; shared protection from items.
          const all=[this.kart,...this.loadKarts];
          // Only Hitler owns the 'Größenbefehl'; as a bot he uses it when rivals are close.
          const tankOwner=this.order.indexOf(0),botsActive=this.racePhase==='race';
          const changed=stepAbilities(this.abilities,all,all.map((_,i)=>i===tankOwner&&(i===0?this.queuedSpecial:botsActive&&botWantsAbility(this.abilities,i,all))),this.items.immune,FIXED_STEP);
          this.queuedSpecial=false;this.kart=changed[0];this.loadKarts=changed.slice(1);
          for(const event of this.abilities.events){
            this.abilityStats[event.kind]++;this.testScene?.abilityEvent?.(event.kind,event.kart,event.target);
            const source=all[event.kart];if(event.kart===0||event.target===0||Math.hypot(source.x-this.kart.x,source.z-this.kart.z)<35)this.audio.ability(event.kind);
            if(event.kind==='transform'&&event.kart!==0&&Math.hypot(source.x-this.kart.x,source.z-this.kart.z)<35){this.itemMessage='Achtung · Hitler wird zum Panzer';this.itemMessageUntil=this.items.time+2;}
            if(event.kind==='transform'&&event.kart===0){this.itemMessage='Größenbefehl · Panzer für 8 s';this.itemMessageUntil=this.items.time+2.2;this.audio.cheer(.8);}
            if(event.kind==='crush'&&event.kart===0){this.itemMessage='Überrollt · Gegner weggedrängt';this.itemMessageUntil=this.items.time+1.6;}
          }
        }
        if (!LAB_WORLD && this.racePhase === 'race') {
          const all=[this.kart,...this.loadKarts];
          const ranks=this.progress.map(p=>1+this.progress.filter(other=>other.distance>p.distance).length);
          const use=all.map((_,i)=>i===0?frame.pressed.has('item')||(DEMO&&botUsesItem(this.items,i,all)):botUsesItem(this.items,i,all));
          const itemResult=stepItems(this.items,all,use,ranks,FIXED_STEP);this.kart=itemResult[0];this.loadKarts=itemResult.slice(1);
          for(const event of this.items.events) if(event.kart===0) {
            const projectile=this.castOf(0).projectileName;
            this.itemMessage=event.kind==='pickup'?`${event.item==='trap'?ITEM_NAMES[event.item]:projectile} erhalten`:event.kind==='launch'?(event.item==='trap'?'Falle abgelegt':`${projectile} unterwegs`):'Treffer · kurzzeitig geschützt';
            this.itemMessageUntil=this.items.time+1.8;
            if(event.kind==='launch'&&event.item!=='trap'&&this.castOf(0).projectile==='dog')this.audio.dogBark();else this.audio.itemEvent(event.kind);
            // Everyone else shouts their own line while throwing their character projectile.
            if(event.kind==='launch'&&event.item!=='trap'&&this.castOf(0).projectile!=='dog'&&this.voiceCooldown===0){this.audio.voice(`${this.castOf(0).voice}-horn`,{channel:'driver',rate:this.castOf(0).voiceRate,volume:.8});this.voiceCooldown=6;}
            if(event.kind==='hit')this.say(0,'hit');
          }
          for(const event of this.items.events) if(event.kind==='hit'&&event.owner===0&&event.kart!==0) {
            this.audio.voice(event.item==='trap'?'announcer-stamp':'announcer-delivery');this.audio.cheer(.5);
            window.setTimeout(()=>this.say(event.kart,'hit',.75),900);
          }
          this.raceTime += FIXED_STEP;this.voiceCooldown=Math.max(0,this.voiceCooldown-FIXED_STEP);this.leadCooldown=Math.max(0,this.leadCooldown-FIXED_STEP);
          const lapBefore=Math.floor(Math.max(0,this.progress[0].distance)/TRACK.length);
          [this.kart, ...this.loadKarts].forEach((s, i) => advanceRace(this.progress[i], s, this.raceTime));
          if(Math.floor(this.progress[0].distance/TRACK.length)>lapBefore){
            const elapsed=this.lapTimes.reduce((sum,t)=>sum+t,0);this.lapTimes.push(this.raceTime-elapsed);
            this.lapNotice=`${this.lapTimes.length===2?'LETZTE RUNDE':'RUNDE 2'} · ${this.lapTimes.at(-1)!.toFixed(2)} s`;
            this.lapNoticeUntil=this.raceTime+3;
            if(!this.progress[0].finished){this.audio.cue('lap');this.audio.voice(this.lapTimes.length===2?'announcer-final':'announcer-lap2',{force:true});this.audio.cheer(.6);}
          }
          if (this.progress[0].finished) {
            this.racePhase = 'finished';
            this.audio.cue('finish');this.testScene?.celebrate?.('finish');this.audio.cheer(1.4);
            {const won=rankRace(this.progress).indexOf(0)===0;this.audio.voice(won?'announcer-win':'announcer-finish',{force:true});const champion=rankRace(this.progress)[0];window.setTimeout(()=>this.say(won?0:champion,'win',won?1:.85),3200);}
            const place=rankRace(this.progress).indexOf(0)+1;
            document.querySelector('#finish-title')!.textContent = `Platz ${place} · Genehmigung erteilt`;
            document.querySelector('#finish-detail')!.textContent = `Drei Runden · ${this.raceTime.toFixed(2)} s · Runden ${this.lapTimes.map(t=>t.toFixed(2)).join(' / ')} s`;
            const names=this.order.map((_,i)=>i===0?`Du · ${this.castOf(0).name}`:this.castOf(i).name);
            const ranking=rankRace(this.progress).map(i=>({p:this.progress[i],i}));
            const list=document.querySelector('#finish-results')!;list.replaceChildren();
            for(const {p,i} of ranking){const row=document.createElement('li');row.classList.toggle('player-result',i===0);const label=document.createElement('strong');label.textContent=names[i];const time=document.createElement('small');time.textContent=p.finished?`${p.finishTime!.toFixed(2)} s`:`${Math.max(0,3*TRACK.length-p.distance).toFixed(0)} m Rest`;
              const shot=this.portraits?.[this.order[i]];if(shot)row.append(Object.assign(document.createElement('img'),{src:shot,alt:''}));row.append(label,time);list.append(row);}
            // Winner's portrait on the podium card.
            const winner=ranking[0]?.i??0,podium=document.querySelector<HTMLImageElement>('#finish-portrait');
            if(podium){const shot=this.portraits?.[this.order[winner]];podium.hidden=!shot;if(shot){podium.src=shot;podium.alt=`Sieger ${this.castOf(winner).name}`;}}
            let best:number|null=null;try{const value=Number(localStorage.getItem('dk-best-stadium-v1'));if(value>0&&Number.isFinite(value))best=value;if(!DEMO&&(best===null||this.raceTime<best)){best=this.raceTime;localStorage.setItem('dk-best-stadium-v1',String(best));}}catch{}
            document.querySelector('#finish-best')!.textContent=`Stand bei deiner Zielankunft${best!==null?` · Deine Bestzeit ${best.toFixed(2)} s`:''}${DEMO?' · Demonstrationsfahrt':''}`;
            document.querySelector('#finish-card')!.removeAttribute('hidden');
          }
        }
        }
        this.queuedHopPress = false;
        this.accumulator -= FIXED_STEP;
      }
      const alpha = this.accumulator / FIXED_STEP;
      this.renderKart = interpolateKart(this.previousKart, this.kart, alpha);
      const renderBots = this.loadKarts.map((kart,i) => interpolateKart(this.previousLoadKarts[i] ?? kart, kart, alpha));
      this.testScene.present(this.renderKart, renderBots);
      this.testScene.presentItems?.(this.items,[this.renderKart,...renderBots]);
      this.camera?.update(this.renderKart, delta, false, frame.steering);
      this.testScene.setPlayerVisible(this.camera?.viewName !== 'Fahrerperspektive');
      this.updateRaceHud();
      this.commentary();
      if (!LAB_WORLD) { const leader = rankRace(this.progress)[0]; this.testScene.broadcast?.(leader, this.racePhase === 'practice' ? `STAATSFERNSEHEN · Freies Training · ${{ sun: 'Sonnenschein genehmigt', rain: 'Regen angeordnet', snow: 'Schneefall verordnet' }[this.weather]}` : `FÜHRUNG: ${this.castOf(leader).name.toUpperCase()} · RUNDE ${Math.min(3, 1 + Math.floor(Math.max(0, this.progress[leader].distance) / TRACK.length))}/3`); }
      speedDisplay.textContent = `${Math.round(Math.abs(this.kart.speed) * 3.6)} km/h${this.kart.speed < 0 ? ' rückwärts' : ''}`;
      modeDisplay.textContent = this.recoveryRemaining[0]>0 ? `Rücksetzung · ${this.recoveryRemaining[0].toFixed(1)} s`
        : this.kart.impactRemaining > 0
        ? this.kart.impactKind === 'item' ? 'Posttreffer – Kart fängt sich' : this.kart.impactKind === 'kart' ? 'Fahrzeugkontakt – Kart fängt sich'
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
    if(this.camera?.photoMode||this.camera?.introMode) this.camera.update(this.renderKart, Math.min((this.engine?.getDeltaTime()??16)/1000,.1));
    if (!LAB_WORLD) {
      const stand = trackPoint(TRACK.start + 20), nearness = Math.max(0, 1 - Math.hypot(this.kart.x - stand.x, this.kart.z - stand.z) / 70);
      this.audio.update(this.kart, this.state === 'running' && this.racePhase !== 'countdown' && this.racePhase !== 'finished', nearness);
    }
    this.testScene?.scene.render();
    if (!debug.hidden && performance.now() - this.lastDebugUpdate > 250) {
      this.lastDebugUpdate = performance.now();
      debug.textContent = `Status: ${this.state}\nEngine: Babylon ${Engine.Version}\nWebGL: ${this.engine?.webGLVersion ?? '–'}\nGrafik: ${this.rendererName}\nAuflösung: ${canvas.width} × ${canvas.height} Pixel · DPR ${window.devicePixelRatio.toFixed(2)}\nFPS: ${this.engine?.getFps().toFixed(0) ?? '–'}\n${this.frameSummary()}\nMeshes: ${this.testScene?.scene.meshes.length ?? 0}\nFahrzeuge: ${this.loadKarts.length + 1}\nAssetgruppe: ${this.manifestName}\nTempo: ${this.kart.speed.toFixed(2)} m/s\nPosition: ${this.kart.x.toFixed(2)}, ${this.kart.z.toFixed(2)} m\nRichtung: ${this.kart.heading.toFixed(2)} rad\nHop: ${this.kart.height.toFixed(2)} m\nFederung: ${this.kart.suspensionOffset.toFixed(3)} m / ${this.kart.suspensionVelocity.toFixed(2)} m/s\nRadkontakte: ${this.kart.wheelGroundHeights.map((value) => value.toFixed(2)).join(', ')} m\nKarosserieneigung: ${this.kart.bodyPitch.toFixed(3)} / ${this.kart.bodyRoll.toFixed(3)} rad\nRandstoß: ${this.kart.impactRemaining.toFixed(2)} s\nDrift: ${this.kart.drifting ? `${this.kart.driftCharge.toFixed(2)} s` : 'aus'}\nTurbo: ${this.kart.turboRemaining.toFixed(2)} s\nGas/Bremse: ${frame.throttle}\nLenkung: ${frame.steering}\nHop/Drift-Taste: ${frame.hopDrift}\nLetzte Aktion: ${this.lastAction}`;
    }
  }

  private dispose(): void {
    this.mouse.dispose();
    ++this.generation;
    this.detachKeyboard();
    this.detachTouch();
    this.audio.dispose();
    this.testScene?.scene.dispose();
    this.engine?.stopRenderLoop();
    this.engine?.dispose();
  }
}

new App();
