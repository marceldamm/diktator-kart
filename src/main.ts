import { Engine } from '@babylonjs/core/Engines/engine';
import { KartCamera } from './camera';
import { attachKeyboard, attachTouch, InputHub,type Action } from './input';
import { advanceKart, initialKartState, KART_TUNING, resolveKartContacts, type KartState } from './kart-model';
import { createTestScene, type TestScene } from './scene';
import './style.css';
import { TRACK, advanceRace, botInput, createRaceProgress, gridKart, projectTrack, recoverKart, trackPoint, trackHeightAt, rankRace,type RaceProgress } from './track';
import { KartAudio } from './audio';
import {createItems,stepItems,botUsesItem,ITEM_NAMES,type ItemWorld} from './items';

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
  private readonly detachTouch=attachTouch(this.input,document.querySelector<HTMLElement>('#touch-controls')!);
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
  private itemMessage='';
  private itemMessageUntil=0;
  private reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  private quality = 1;
  private reducedEffects = false;
  private menuWasPaused=false;
  private lapTimes:number[]=[];
  private lapNoticeUntil=0;
  private lapNotice='';

  constructor() {
    Object.defineProperty(window, '__DK', { get: () => ({ scene: this.testScene?.scene, kart: this.kart, bots: this.loadKarts, phase: this.racePhase, progress: this.progress,items:this.items,state:this.state,view:this.camera?.viewName,menu:this.camera?.introMode }) });
    try { this.quality = localStorage.getItem('dk-quality') === '0' ? 0 : 1; this.reducedEffects = localStorage.getItem('dk-reduced-effects') === '1'; } catch { /* Storage may be disabled by the browser. */ }
    try{const saved=localStorage.getItem('dk-reduced-motion');if(saved!==null)this.reducedMotion=saved==='1';}catch{}
    try{if(localStorage.getItem('dk-audio')==='0')this.audio.setEnabled(false);}catch{}
    document.querySelector('#sound-toggle')!.textContent=this.audio.enabled?'Ton an':'Ton aus';
    const musicVolume=document.querySelector<HTMLInputElement>('#music-volume')!;
    try{const saved=Number(localStorage.getItem('dk-music-volume')??'14');musicVolume.value=String(Math.max(0,Math.min(100,saved)));}catch{}
    this.audio.setMusicVolume(Number(musicVolume.value)/100);
    musicVolume.addEventListener('input',()=>{this.audio.setMusicVolume(Number(musicVolume.value)/100);try{localStorage.setItem('dk-music-volume',musicVolume.value);}catch{}});
    document.querySelector('#motion-toggle')?.addEventListener('click',()=>{this.reducedMotion=!this.reducedMotion;this.applyMotion();});
    document.querySelector('#quality-toggle')?.addEventListener('click', () => { this.quality = 1 - this.quality; this.applyQuality(); });
    document.querySelector('#effects-toggle')?.addEventListener('click', () => { this.reducedEffects = !this.reducedEffects; this.applyQuality(); });
    document.querySelector('#race-start')?.addEventListener('click', () => void this.startRace());
    document.querySelector('#menu-race')?.addEventListener('click',()=>void this.startRace());
    document.querySelector('#menu-practice')?.addEventListener('click',()=>this.closeMenu());
    document.querySelector('#menu-button')?.addEventListener('click',()=>this.openMenu());
    document.querySelector('#finish-retry')?.addEventListener('click',()=>void this.startRace());
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
    document.body.classList.toggle('is-loading',state==='loading');
    document.body.classList.toggle('start-error',state==='error');
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
    document.body.classList.remove('photo-mode');
    document.body.classList.remove('menu-open');
    this.racePhase = 'practice'; this.raceTime = 0; this.botStuck = [this.kart,...this.loadKarts].map(() => 0); this.recoveryRemaining=this.botStuck.slice();
    this.lapTimes=[];this.lapNoticeUntil=0;
    if (!LAB_WORLD && !DEMO) this.loadKarts = this.loadKarts.map((s) => ({ ...s, speed: 0 }));
    this.progress = [this.kart, ...this.loadKarts].map(createRaceProgress);
    this.items=createItems(LOAD_KART_COUNT+1);this.itemMessage='';
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
      const created = await createTestScene(this.engine, this.loadKarts.length, !LAB_WORLD,this.quality);
      if (generation !== this.generation) { created.scene.dispose(); return; }
      this.testScene = created;
      this.applyQuality();
      this.camera = new KartCamera(this.testScene.scene, this.kart, !LAB_WORLD);
      this.applyMotion();
      this.testScene.present(this.kart, this.loadKarts);
      this.testScene.presentItems?.(this.items,[this.kart,...this.loadKarts]);
      await this.testScene.scene.whenReadyAsync();
      if(generation!==this.generation)return;
      this.show('running', 'W/S fahren, A/D lenken; Space für Hop und Drift.');
      if(!LAB_WORLD&&!DEMO)this.openMenu();
    } catch (error) {
      if (generation === this.generation) this.show('error', error instanceof Error ? error.message : String(error));
    }
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

  private async startRace(): Promise<void> {
    if (LAB_WORLD || this.state === 'loading') return;
    const generation=this.generation;
    await this.audio.unlock();
    if(generation!==this.generation||!this.testScene)return;
    this.closeMenu();
    if (this.camera?.photoMode) this.camera.togglePhoto(); document.body.classList.remove('photo-mode');
    // Reuse assets; reset the simulation without reloading the entire scene.
    this.kart = gridKart(LOAD_KART_COUNT); this.loadKarts = initialLoadKarts();
    this.progress = [this.kart, ...this.loadKarts].map(createRaceProgress);
    this.items=createItems(LOAD_KART_COUNT+1);this.itemMessage='';
    this.botStuck = [this.kart,...this.loadKarts].map(() => 0); this.recoveryRemaining=this.botStuck.slice();
    this.racePhase = 'countdown'; this.countdown = 3.4; this.raceTime = 0;
    this.lapTimes=[];this.lapNoticeUntil=0;
    this.audio.cue('countdown');
    document.querySelector('#finish-card')?.setAttribute('hidden', '');
    this.camera?.update(this.kart, 0, true);
    this.accumulator = 0; this.queuedHopPress = false;
    if (this.state === 'paused') this.togglePause();
  }

  private updateRaceHud(): void {
    if (LAB_WORLD) return;
    const place=rankRace(this.progress).indexOf(0)+1;
    document.body.classList.toggle('race-finished',this.racePhase==='finished');
    document.querySelector('#place')!.textContent = `${place}`;
    document.querySelector('#lap')!.textContent = `${Math.min(3, 1 + Math.floor(Math.max(0, this.progress[0].distance) / TRACK.length))} / 3`;
    document.querySelector('#race-time')!.textContent = `${Math.floor(this.raceTime / 60)}:${(this.raceTime % 60).toFixed(2).padStart(5, '0')}`;
    document.querySelector('#race-label')!.textContent = this.racePhase === 'practice' ? 'FREIE FAHRT' : this.racePhase === 'finished' ? 'ZIEL ERREICHT' : 'STADION GRAND PRIX';
    const notice=document.querySelector<HTMLElement>('#lap-notice')!;notice.hidden=this.racePhase!=='race'||this.raceTime>=this.lapNoticeUntil;notice.textContent=this.lapNotice;
    const meter=document.querySelector<HTMLElement>('#drift-meter')!;meter.hidden=!this.kart.drifting&&this.kart.turboRemaining<=0;
    meter.classList.toggle('charged',this.kart.driftCharge>=KART_TUNING.driftChargeTime||this.kart.turboRemaining>0);
    document.querySelector<HTMLElement>('#drift-fill')!.style.width=`${100*(this.kart.turboRemaining>0?this.kart.turboRemaining/KART_TUNING.turboDuration:this.kart.driftCharge/KART_TUNING.driftChargeTime)}%`;
    const countdown = document.querySelector<HTMLElement>('#countdown')!;
    const item=this.items.slots[0];
    document.querySelector('#item-name')!.textContent=item?ITEM_NAMES[item]:'Sendung abholen';
    document.querySelector('#item-icon')!.textContent=item==='direct'?'➤':item==='homing'?'◎':item==='trap'?'§':'✉';
    const itemButton=document.querySelector<HTMLButtonElement>('#item-use')!;itemButton.disabled=!item||this.racePhase!=='race';
    document.querySelector('#item-info')!.textContent=this.items.time<this.itemMessageUntil?this.itemMessage:item?'E · einsetzen':this.racePhase==='practice'?'Im Rennen leuchtende Postkisten sammeln':'Leuchtende Postkisten auf der Strecke';
    const incoming=this.items.objects.some(o=>o.kind!=='trap'&&o.owner!==0&&Math.hypot(o.x-this.kart.x,o.z-this.kart.z)<15);
    const warning=document.querySelector<HTMLElement>('#item-warning')!;warning.hidden=!incoming;warning.textContent='⚠ Rohrpost im Anflug · ausweichen';
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
    if(frame.pressed.has('menu')){if(this.camera?.introMode)this.closeMenu();else this.openMenu();}
    if(this.camera?.introMode&&(['accelerate','brake','steerLeft','steerRight','camera','photo'] as Action[]).some(a=>frame.pressed.has(a)))this.closeMenu();
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
        this.lastAction = `Kamera: ${this.camera?.cycleView() ?? 'Verfolger nah'}`;
        cameraDisplay.textContent = this.camera?.viewName ?? 'Verfolger nah';
        this.camera?.update(this.kart,0,true,frame.steering);
        this.testScene.setPlayerVisible(this.camera?.viewName!=='Fahrerperspektive');
      }
    }
    if (this.state === 'running' && this.testScene) {
      if (frame.pressed.has('item')) this.lastAction = 'Item-Eingabe erkannt';
      if (frame.pressed.has('special')) this.lastAction = 'Fähigkeits-Eingabe erkannt';
      if (frame.pressed.has('hopDrift')) this.queuedHopPress = true;
      const delta = Math.min(this.engine!.getDeltaTime() / 1000, 0.1);
      this.accumulator += delta;
      while (this.accumulator >= FIXED_STEP) {
        const countdown = !LAB_WORLD && this.racePhase === 'countdown';
        if (countdown) {
          const before=Math.ceil(this.countdown-.4);this.countdown -= FIXED_STEP;
          if(this.countdown<=0){this.racePhase='race';this.audio.cue('start');}
          else if(this.countdown>.4&&Math.ceil(this.countdown-.4)!==before)this.audio.cue('countdown');
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
        const resolved = resolveKartContacts([this.kart, ...this.loadKarts], project);
        this.kart = resolved[0];
        this.loadKarts = resolved.slice(1);
        if (!LAB_WORLD && this.racePhase === 'race') {
          const all=[this.kart,...this.loadKarts];
          const ranks=this.progress.map(p=>1+this.progress.filter(other=>other.distance>p.distance).length);
          const use=all.map((_,i)=>i===0?frame.pressed.has('item')||(DEMO&&botUsesItem(this.items,i,all)):botUsesItem(this.items,i,all));
          const itemResult=stepItems(this.items,all,use,ranks,FIXED_STEP);this.kart=itemResult[0];this.loadKarts=itemResult.slice(1);
          for(const event of this.items.events) if(event.kart===0) {
            this.itemMessage=event.kind==='pickup'?`${ITEM_NAMES[event.item]} erhalten`:event.kind==='launch'?'Sendung zugestellt … unterwegs':'Treffer · kurzzeitig geschützt';
            this.itemMessageUntil=this.items.time+1.8;this.audio.itemEvent(event.kind);
          }
          this.raceTime += FIXED_STEP;
          const lapBefore=Math.floor(Math.max(0,this.progress[0].distance)/TRACK.length);
          [this.kart, ...this.loadKarts].forEach((s, i) => advanceRace(this.progress[i], s, this.raceTime));
          if(Math.floor(this.progress[0].distance/TRACK.length)>lapBefore){
            const elapsed=this.lapTimes.reduce((sum,t)=>sum+t,0);this.lapTimes.push(this.raceTime-elapsed);
            this.lapNotice=`${this.lapTimes.length===2?'LETZTE RUNDE':'RUNDE 2'} · ${this.lapTimes.at(-1)!.toFixed(2)} s`;
            this.lapNoticeUntil=this.raceTime+3;
            if(!this.progress[0].finished)this.audio.cue('lap');
          }
          if (this.progress[0].finished) {
            this.racePhase = 'finished';
            this.audio.cue('finish');
            const place=rankRace(this.progress).indexOf(0)+1;
            document.querySelector('#finish-title')!.textContent = `Platz ${place} · Genehmigung erteilt`;
            document.querySelector('#finish-detail')!.textContent = `Drei Runden · ${this.raceTime.toFixed(2)} s · Runden ${this.lapTimes.map(t=>t.toFixed(2)).join(' / ')} s`;
            const names=['Du · Funkwagen','Reservefahrer','Archivexpress','Werkstattwagen','Paradewagen','Kurierwagen'];
            const ranking=rankRace(this.progress).map(i=>({p:this.progress[i],i}));
            const list=document.querySelector('#finish-results')!;list.replaceChildren();
            for(const {p,i} of ranking){const row=document.createElement('li');row.classList.toggle('player-result',i===0);const label=document.createElement('strong');label.textContent=names[i];const time=document.createElement('small');time.textContent=p.finished?`${p.finishTime!.toFixed(2)} s`:`${Math.max(0,3*TRACK.length-p.distance).toFixed(0)} m Rest`;row.append(label,time);list.append(row);}
            let best:number|null=null;try{const value=Number(localStorage.getItem('dk-best-stadium-v1'));if(value>0&&Number.isFinite(value))best=value;if(!DEMO&&(best===null||this.raceTime<best)){best=this.raceTime;localStorage.setItem('dk-best-stadium-v1',String(best));}}catch{}
            document.querySelector('#finish-best')!.textContent=`Stand bei deiner Zielankunft${best!==null?` · Deine Bestzeit ${best.toFixed(2)} s`:''}${DEMO?' · Demonstrationsfahrt':''}`;
            document.querySelector('#finish-card')!.removeAttribute('hidden');
          }
        }
        }
        this.queuedHopPress = false;
        this.accumulator -= FIXED_STEP;
      }
      this.testScene.present(this.kart, this.loadKarts);
      this.testScene.presentItems?.(this.items,[this.kart,...this.loadKarts]);
      this.camera?.update(this.kart, delta, false, frame.steering);
      this.testScene.setPlayerVisible(this.camera?.viewName !== 'Fahrerperspektive');
      this.updateRaceHud();
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
    if(this.camera?.photoMode||this.camera?.introMode) this.camera.update(this.kart, Math.min((this.engine?.getDeltaTime()??16)/1000,.1));
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
    this.detachTouch();
    this.audio.dispose();
    this.testScene?.scene.dispose();
    this.engine?.stopRenderLoop();
    this.engine?.dispose();
  }
}

new App();
