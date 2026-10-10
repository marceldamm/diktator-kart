import { Engine } from '@babylonjs/core/Engines/engine';
import { KartCamera } from './camera';
import { attachKeyboard, attachPointerHold, attachTouch, InputHub, REBINDABLE, exportBindings, importBindings, keyLabel, pollGamepads, primaryKey, rebind, resetBindings, type Action } from './input';
import { advanceKart, driftTier, initialKartState, KART_TUNING, resolveKartContacts, type KartState } from './kart-model';
import { createTestScene, type TestScene } from './scene';
import './style.css';
import { BOT_STYLES, botStyleOf, botDifficulty, setBotStyles, trackProgress as trackProgressAt, selectTrack, isTrackId, setBotSkill, atRampLip, boostPadAt, craterAt, shouldStartCraterFall, drivingSurfaceAt, hazardAt, overCanal, TRACK, advanceRace, applySurfaceDrag, botInput, createRaceProgress, gridKart, projectTrack, recoverKart, trackPoint, trackHeightAt, rankRace, shortcutPoint, SHORTCUT_LENGTH, type RaceProgress } from './track';
import { KartAudio } from './audio';
import { CAST, DEFAULT_TIRES, TIRE_SETS, rosterOrder } from './cast';
import {createItems,stepItems,botUsesItem,botItemDirection,ITEM_NAMES,ITEM_RULES,type ItemWorld} from './items';
import { ABILITY_NAME, ABILITY_RULES, abilityReady, botWantsAbility, createAbilities, stepAbilities, type AbilityEvent, type AbilityOwner, type AbilityWorld } from './abilities';
import { LoadingProgress, type LoadingPhase } from './loading-progress';
import { DAMAGE_RULES, createDamage, stepDamage, type DamageWorld } from './damage';
import { attachMouseCamera } from './mouse-camera';
import { interpolateKart } from './render-state';
import { RAMP_LENGTH, RAMP_LIPS, TRACKS, TRACK_INFO, sampleTrack, type TrackId } from './track-layout';
import { GP_TRACKS, awardPoints, createGrandPrix, standings, type GrandPrix } from './grand-prix';
import { RankingBoard } from './ranking-hud';
import { pickQuality } from './auto-quality';
import { MEDAL_RULES, createMedals, loseMedals, stepMedals, type MedalWorld } from './medals';
import { MeshoptCompression } from '@babylonjs/core/Meshes/Compression/meshoptCompression';

// Load time (10.10.2026): models are meshopt-compressed (art-source/optimize_assets.mjs); decode with the local copy
// of the meshoptimizer decoder instead of Babylon's CDN, so the game also starts offline.
MeshoptCompression.Configuration = { decoder: { url: '/vendor/meshopt_decoder.js' } };

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

const trackProgressOf = (k: { x: number; z: number }) => trackProgressAt(k.x, k.z);

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
  private readonly detachItemButton=attachPointerHold(this.input,document.querySelector<HTMLElement>('#item-use')!,'item','item-use');
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
  private damage:DamageWorld=createDamage(LOAD_KART_COUNT+1);
  /** Seconds left in a harbour salvage per kart (Staatliches Bergungsamt). */
  private salvage:number[]=[];
  private padCooldown:number[]=[];
  /** Seconds spent in a rival's slipstream per kart. */
  private draft:number[]=[];
  private autoGas=false;
  private botLevel:0|1|2=1;
  private itemHeld=false;
  private queuedItemUse=false;
  private queuedDefenseUse=false;
  private itemDirection:'forward'|'backward'='forward';
  /** 'gp' = championship over every playable circuit with five bots; 'single' = one chosen track; 'timetrial' = solo three laps against your saved ghost. */
  private mode:'gp'|'single'|'timetrial'='gp';
  /** Running championship (null outside a Grand Prix). */
  private gp:GrandPrix|null=null;
  private finishAction:()=>void=()=>void this.beginRace();
  private ranking=new RankingBoard(document.querySelector<HTMLOListElement>('#ranking')!);
  private gpIntroUntil=0;
  /** True while the player has finished but rivals are still racing (results and points become final afterwards). */
  private afterRace=false;
  private afterRaceTime=0;
  /** Ramp trick (Marcel, 07.10.): Space held near the ramp and released on it or in the air queues the trick. */
  private rampHold=false;
  private rampTrickQueued=false;
  /** Set once the player picked the opening track of the current Grand Prix. */
  private gpTrackChosen=false;
  /** Player's tyre set: 'auto' = the driver's own design, otherwise any set id from TIRE_SETS. */
  private tireChoice:string='auto';
  /** Malecón wave (Havanna, lap 2): the flooded seafront stretch slows everyone alike until this race time. */
  private waveUntil=0;
  /** Moscow lap-2 event: tailwind on the first parade straight until this race time. */
  private paradeUntil=0;
  /** Driver reactions: last ranks (overtakes), per-kart cooldown and finish reactions already shown. */
  private lastRanks:number[]=[];
  private reactUntil:number[]=[];
  private finishReacted:boolean[]=[];
  /** The lap-2 track event is announced once late in lap 1, so everyone can prepare. */
  private eventAnnounced=false;
  private medals:MedalWorld={medals:[],counts:[],events:[]};
  /** True until the automatic start value for the graphics level has been chosen (no saved choice yet). */
  private autoQuality=false;
  private lastRenderAt=0;
  /** Another window of the game is active; this one draws nothing until the player resumes it here. */
  private parked=false;
  private padButtons=new Map<string,boolean>();
  private gamepadSeen=false;
  /** Action waiting for its new key in the options (null = not listening). */
  private rebinding:Action|null=null;
  /** Best lap of the current run; reset on every start, saved per track on a complete run only. */
  private ghostDelta:number|null=null;
  private ghostRun:{time:number;driver:number;samples:number[][];track?:string}|null=null;
  private ghostRecord:number[][]=[];
  private steerAssist=false;
  private inCrater:boolean[]=[];
  /** Countdown value when the player first pressed throttle (start boost timing); null = not yet. */
  private startPress:number|null=null;
  private startFenceBroken=false;
  private queuedSpecial=false;
  private rain=false;
  /** Options choice; 'random' rolls sun, rain or snow every time the track loads. */
  private weatherChoice:'random'|'sun'|'rain'|'snow'='random';
  private weather:'sun'|'rain'|'snow'='sun';
  /** Rolled per Grand Prix: half the races run from day through dusk into night over the three laps. */
  private dayToNight=false;
  private abilityStats:Record<AbilityEvent['kind'],number>={transform:0,revert:0,crush:0,'kim-surge':0,'kim-audit':0,pose:0,'pose-applause':0,blockade:0};
  private itemMessage='';
  private itemMessageUntil=0;
  /** UI-only reveal animation; the item itself is allocated immediately by deterministic race logic. */
  private itemRouletteUntil=0;
  private abilityAnnouncementUntil=0;
  private abilityAnnouncementTitle='Rennergebnis NICHT manipuliert.';
  private abilityAnnouncementDetail='Kim Jong-Un freut sich über seine demokratische Bestzeit.';
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
  private selectedTrackId:TrackId='stadionring';
  private selectingTrack=false;
  private selecting=false;
  /** Head portraits, rendered once in Blender (art-source/export_driver_stand.py) instead of live in the browser. */
  private portraits: string[] = CAST.map((member) => `/assets/portraits/${member.faceStyle}.webp`);
  /** Roster member driving kart slot i (slot 0 = player). */
  private castOf(i: number) { return CAST[this.order[i] ?? i]; }

  constructor() {
    Object.defineProperty(window, '__DK', { get: () => ({ react: (kart: number, kind: 'cheer'|'fist'|'angry') => this.testScene?.driverReaction?.(kart, kind), crowd: (kind: 'wave'|'cheer', kart?: number) => this.testScene?.crowdReact?.(kind, kart), startPress: this.startPress, startFenceBroken: this.startFenceBroken, damage: this.damage, abilityStats: this.abilityStats, trackLength: TRACK.length, selectedTrack: this.selectedTrackId, voices: this.audio.voiceCount, spoken: this.audio.spoken, scene: this.testScene?.scene, kart: this.kart, bots: this.loadKarts, phase: this.racePhase, progress: this.progress,items:this.items,state:this.state,view:this.camera?.viewName,menu:this.camera?.introMode,render:{kart:this.renderKart,alpha:this.accumulator/FIXED_STEP,steps:this.renderSteps} }) });
    // Performance 10.10.2026: every start of the game batch opens another Chrome window and older windows kept drawing
    // the full 3D scene (and playing sound). The newest window takes over; older ones park until "Hier weiterspielen".
    try {
      const channel = new BroadcastChannel('diktator-kart-window'), id = `${Date.now()}-${Math.random()}`;
      channel.onmessage = (event: MessageEvent<{ type?: string; id?: string }>) => { if (event.data?.type === 'active' && event.data.id !== id) this.park(true); };
      const claim = () => { channel.postMessage({ type: 'active', id }); this.park(false); };
      document.querySelector('#parked-resume')?.addEventListener('click', claim);
      claim();
    } catch { /* BroadcastChannel unavailable: single window only */ }
    try { this.autoQuality = localStorage.getItem('dk-quality') === null && !LAB_WORLD && !new URLSearchParams(location.search).has('demo'); } catch { /* storage optional */ }
    try { { const q = Number(localStorage.getItem('dk-quality') ?? '1'); this.quality = q === 0 || q === 2 ? q : 1; } this.reducedEffects = localStorage.getItem('dk-reduced-effects') === '1'; } catch { /* Storage may be disabled by the browser. */ }
    try{const saved=localStorage.getItem('dk-reduced-motion');if(saved!==null)this.reducedMotion=saved==='1';}catch{}
    try{if(localStorage.getItem('dk-audio')==='0')this.audio.setEnabled(false);}catch{}
    { // Last chosen circuit (or ?track=duce-drom) is loaded first.
      let wanted:unknown=new URLSearchParams(location.search).get('track');
      try{if(!isTrackId(wanted))wanted=localStorage.getItem('dk-track');}catch{}
      if(isTrackId(wanted))selectTrack(wanted);
      this.selectedTrackId=TRACK.id;
      this.audio.setTrackMusic(TRACK.id);
      this.drawTrackCards();
    }
    try{const t=localStorage.getItem('dk-tires');if(t&&(t==='auto'||TIRE_SETS.some(s=>s.id===t)))this.tireChoice=t;}catch{}
    try{const saved=Number(localStorage.getItem('dk-driver'));if(Number.isInteger(saved)&&saved>=0&&saved<CAST.length)this.chosen=saved;}catch{}
    this.order=rosterOrder(this.chosen);
    try{this.autoGas=localStorage.getItem('dk-auto-gas')==='1';this.steerAssist=localStorage.getItem('dk-steer-assist')==='1';}catch{}
    const assistLabels=()=>{document.querySelector('#autogas-toggle')!.textContent=this.autoGas?'Auto-Gas an':'Auto-Gas aus';document.querySelector('#assist-toggle')!.textContent=this.steerAssist?'Lenkhilfe an':'Lenkhilfe aus';};
    document.querySelector('#autogas-toggle')?.addEventListener('click',()=>{this.autoGas=!this.autoGas;try{localStorage.setItem('dk-auto-gas',this.autoGas?'1':'0');}catch{}assistLabels();});
    document.querySelector('#assist-toggle')?.addEventListener('click',()=>{this.steerAssist=!this.steerAssist;try{localStorage.setItem('dk-steer-assist',this.steerAssist?'1':'0');}catch{}assistLabels();});
    assistLabels();
    try{const b=Number(localStorage.getItem('dk-bot-level')??'1');if(b===0||b===1||b===2)this.botLevel=b;}catch{}
    const botLabel=()=>{setBotSkill(this.botLevel);document.querySelector('#bots-toggle')!.textContent=`Gegner ${['leicht','mittel','schwer'][this.botLevel]}`;};
    document.querySelector('#bots-toggle')?.addEventListener('click',()=>{this.botLevel=((this.botLevel+1)%3) as 0|1|2;try{localStorage.setItem('dk-bot-level',String(this.botLevel));}catch{}botLabel();});
    botLabel();
    try{importBindings(JSON.parse(localStorage.getItem('dk-keys-v1')??'null'));}catch{}
    this.renderKeymap();
    window.addEventListener('keydown',(event)=>{
      if(!this.rebinding)return;
      event.preventDefault();event.stopImmediatePropagation();
      if(event.code!=='Escape'&&!rebind(this.rebinding,event.code)){this.lastAction='Taste reserviert';}
      this.rebinding=null;try{localStorage.setItem('dk-keys-v1',JSON.stringify(exportBindings()));}catch{}
      this.renderKeymap();
    },true);
    document.querySelector('#track-back')?.addEventListener('click',()=>this.closeTrackSelection());
    document.querySelector('#track-go')?.addEventListener('click',()=>this.confirmTrackSelection());
    document.querySelectorAll<HTMLButtonElement>('#track-grid .track-card.playable').forEach((card)=>card.addEventListener('click',()=>{
      const id=card.dataset.trackId;if(isTrackId(id)){if(id===this.selectedTrackId)this.confirmTrackSelection();else{this.selectedTrackId=id;this.renderTrackSelection();}}
    }));
    document.querySelector('#driver-back')?.addEventListener('click',()=>this.closeSelection());
    document.querySelector('#driver-go')?.addEventListener('click',()=>this.confirmSelection());
    document.querySelector('#driver-random')?.addEventListener('click',()=>this.pick((this.chosen+1+Math.floor(Math.random()*(CAST.length-1)))%CAST.length));
    window.addEventListener('keydown',(event)=>{
      if(this.selectingTrack){
        if(event.code==='Escape'){event.preventDefault();event.stopImmediatePropagation();this.closeTrackSelection();}
        if(event.code==='Enter'){event.preventDefault();event.stopImmediatePropagation();this.confirmTrackSelection();}
        return;
      }
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
    document.querySelector('#quality-toggle')?.addEventListener('click', () => { this.autoQuality = false; this.quality = (this.quality + 1) % 3; this.applyQuality(); });
    try { const asked = new URLSearchParams(location.search).get('weather') ?? localStorage.getItem('dk-weather-choice'); if (asked === 'sun' || asked === 'rain' || asked === 'snow' || asked === 'random') this.weatherChoice = asked; } catch { /* storage optional */ }
    document.querySelector('#weather-toggle')?.addEventListener('click', () => {
      const cycle = ['random', 'sun', 'rain', 'snow'] as const; this.weatherChoice = cycle[(cycle.indexOf(this.weatherChoice) + 1) % cycle.length];
      try { localStorage.setItem('dk-weather-choice', this.weatherChoice); } catch { /* storage optional */ }
      this.weather = this.weatherChoice === 'random' ? this.rollWeather() : this.weatherChoice; this.applyWeather();
    });
    document.querySelector('#effects-toggle')?.addEventListener('click', () => { this.reducedEffects = !this.reducedEffects; this.applyQuality(); });
    document.querySelector('#race-start')?.addEventListener('click', () => void this.startRace());
    document.querySelector('#menu-race')?.addEventListener('click',()=>this.startGrandPrix());
    document.querySelector('#menu-single')?.addEventListener('click',()=>{this.mode='single';this.gp=null;this.openTrackSelection();});
    document.querySelector('#menu-timetrial')?.addEventListener('click',()=>{this.mode='timetrial';this.gp=null;this.openTrackSelection();});
    document.querySelector('#menu-practice')?.addEventListener('click',()=>{if(this.mode==='timetrial'){this.mode='gp';void this.restart();return;}this.closeMenu();void this.audio.unlock().then(()=>setTimeout(()=>this.welcome(),400));});
    document.querySelector('#menu-button')?.addEventListener('click',()=>this.openMenu());
    document.querySelector('#finish-retry')?.addEventListener('click',()=>this.finishAction());
    document.querySelector('#finish-menu')?.addEventListener('click',()=>this.openMenu());
    document.querySelector<HTMLButtonElement>('#item-use')?.addEventListener('click',(event)=>{if(event.detail===0)this.queuedItemUse=true;});
    document.querySelector<HTMLButtonElement>('#defense-use')?.addEventListener('click',()=>{this.queuedDefenseUse=true;});
    document.querySelector('#sound-toggle')?.addEventListener('click', () => {
      this.audio.setEnabled(!this.audio.enabled); void this.audio.unlock();
      document.querySelector('#sound-toggle')!.textContent = this.audio.enabled ? 'Ton an' : 'Ton aus';
      try{localStorage.setItem('dk-audio',this.audio.enabled?'1':'0');}catch{}
    });
    window.addEventListener('keydown', (event) => {
      if (!LAB_WORLD) void this.audio.unlock();
      // T: instant race restart with the same driver (no selection, no scene reload).
      if (event.code === 'KeyT' && !this.selecting && this.state !== 'loading' && this.racePhase !== 'practice') { void this.beginRace(); return; }
      if (event.code === 'Enter' && this.racePhase === 'finished' && !this.selecting && !this.selectingTrack && !document.body.classList.contains('menu-open')) { event.preventDefault(); this.finishAction(); return; }
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

  private async restart(after?: () => void): Promise<void> {
    const generation = ++this.generation;
    this.mouse.release();
    const loading = new LoadingProgress(!LAB_WORLD);
    const loadingText = { heading: `${TRACK_INFO.name} wird vorbereitet`, footnote: `${TRACK_INFO.city} · ${TRACK_INFO.name} · ${this.gp ? `Grand Prix · Rennen ${this.gp.round + 1}/${this.gp.tracks.length}` : 'Diktator Kart'}` };
    const notify = (detail: ReturnType<LoadingProgress['initial']>) => window.dispatchEvent(new CustomEvent('dk:load-progress', { detail: { ...detail, ...loadingText } }));
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
    // Driver portraits do not depend on the circuit: keep them across track loads.
    document.body.classList.remove('select-open');this.selecting=false;
    this.racePhase = 'practice'; this.raceTime = 0; this.botStuck = [this.kart,...this.loadKarts].map(() => 0); this.recoveryRemaining=this.botStuck.slice();
    this.lapTimes=[];this.lapNoticeUntil=0;
    if (!LAB_WORLD && !DEMO) this.loadKarts = this.loadKarts.map((s) => ({ ...s, speed: 0 }));
    this.resetRenderState();
    this.progress = [this.kart, ...this.loadKarts].map(createRaceProgress);
    this.items=createItems(LOAD_KART_COUNT+1);this.itemMessage='';this.itemMessageUntil=0;this.abilityAnnouncementUntil=0;this.abilities=createAbilities(LOAD_KART_COUNT+1);this.damage=createDamage(LOAD_KART_COUNT+1);this.salvage=[];this.queuedSpecial=false;this.abilityStats={transform:0,revert:0,crush:0,'kim-surge':0,'kim-audit':0,pose:0,'pose-applause':0,blockade:0};
    this.queuedItemUse=false;this.queuedDefenseUse=false;this.itemDirection='forward';this.medals=createMedals(LOAD_KART_COUNT+1);
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
      this.applyTires();
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
      this.testScene.scene.blockMaterialDirtyMechanism = false;
      await this.testScene.scene.whenReadyAsync();
      if(generation!==this.generation)return;
      this.testScene.scene.render();
      report('ready');
      this.show('running', 'W/S fahren, A/D lenken; Space für Hop und Drift.');
      if(after)after();else if(!LAB_WORLD&&!DEMO)this.openMenu();
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
    document.querySelector('#quality-toggle')!.textContent = ['Grafik Basis', 'Grafik Standard', 'Grafik Hoch'][this.quality];
    document.querySelector('#effects-toggle')!.textContent = this.reducedEffects ? 'Effekte reduziert' : 'Effekte voll';
    try { localStorage.setItem('dk-quality', String(this.quality)); localStorage.setItem('dk-reduced-effects', this.reducedEffects ? '1' : '0'); } catch { /* Session controls still work. */ }
  }
  private applyMotion():void {
    this.camera?.setReducedMotion(this.reducedMotion);
    document.querySelector('#motion-toggle')!.textContent=this.reducedMotion?'Kamera ruhig':'Kamera dynamisch';
    try{localStorage.setItem('dk-reduced-motion',this.reducedMotion?'1':'0');}catch{}
  }
  private openMenu():void {
    this.mouse.release();this.endCeremony();
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

  /** Enter / the panel button: confirm the open selection, or start the current mode's selection flow. */
  private async startRace(): Promise<void> {
    if (LAB_WORLD || this.state === 'loading') return;
    if (this.selectingTrack) { this.confirmTrackSelection(); return; }
    if (this.selecting) { this.confirmSelection(); return; }
    if (this.mode === 'gp') this.startGrandPrix(); else this.openTrackSelection();
  }
  /** A new Grand Prix: all playable circuits in a fixed order, points per finish, driver chosen once. */
  private startGrandPrix(): void {
    if (LAB_WORLD || this.state === 'loading') return;
    this.mode = 'gp'; this.gp = createGrandPrix(GP_TRACKS); this.gpTrackChosen = false;
    // Test aid: ?gp-round=N starts at round N (earlier rounds score nothing); used to check the final ceremony quickly.
    { const round = Number(new URLSearchParams(location.search).get('gp-round')); if (Number.isInteger(round) && round > 1 && round <= this.gp.tracks.length) { for (let r = 0; r < round - 1; r++) this.gp.results.push({ track: this.gp.tracks[r], order: [], points: [], time: 0 }); this.gp.round = round - 1; } }
    this.closeTrackSelection(); this.openSelection();
  }
  /** Loads the GP round's circuit if needed, then starts the race. */
  private startGpRound(): void {
    if (!this.gp) return;
    const id = this.gp.tracks[this.gp.round];
    if (TRACK.id !== id) void this.loadTrack(id, () => void this.beginRace());
    else void this.beginRace();
  }
  /** Rebuilds the scene for another circuit and continues with `then` once it renders. */
  private async loadTrack(id: TrackId, then: () => void): Promise<void> {
    selectTrack(id); this.selectedTrackId = id;
    this.audio.setTrackMusic(id);
    try { localStorage.setItem('dk-track', id); } catch { /* storage optional */ }
    this.drawTrackCards();
    await this.restart(then);
  }
  /** Small route outlines on the playable track cards (same centreline data as the race). */
  private drawTrackCards(): void {
    document.querySelectorAll<HTMLButtonElement>('#track-grid .track-card.playable').forEach((card) => {
      const id = card.dataset.trackId; if (!isTrackId(id)) return;
      const holder = card.querySelector<HTMLElement>('.track-map'); if (!holder || holder.querySelector('canvas')) return;
      const canvas = document.createElement('canvas'); canvas.width = 260; canvas.height = 120; const c = canvas.getContext('2d'); if (!c) return;
      const route = sampleTrack(TRACKS[id].controlPoints);
      const length = document.createElement('span'); length.className = 'track-length';
      length.textContent = `${Math.round(route.length).toLocaleString('de-DE')} m pro Runde`;
      card.append(length);
      const pts = route.samples.filter((_, i) => i % 8 === 0), xs = pts.map((p) => p.x), zs = pts.map((p) => p.z);
      const minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs), k = Math.min(220 / (maxX - minX), 92 / (maxZ - minZ));
      const at = (p: { x: number; z: number }) => [130 + (p.x - (minX + maxX) / 2) * k, 58 - (p.z - (minZ + maxZ) / 2) * k] as const;
      c.lineJoin = 'round';
      for (const [w, col] of [[9, '#0b1a1ecc'], [4, '#e2c27f']] as const) { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); pts.forEach((p, i) => { const [x, y] = at(p); if (i) c.lineTo(x, y); else c.moveTo(x, y); }); c.closePath(); c.stroke(); }
      const start = route.samples.reduce((best, p) => Math.abs(p.s - TRACKS[id].start) < Math.abs(best.s - TRACKS[id].start) ? p : best); const [sx, sy] = at(start); c.fillStyle = '#f3eee0'; c.beginPath(); c.arc(sx, sy, 4, 0, Math.PI * 2); c.fill();
      canvas.style.cssText = 'width:100%;height:100%;object-fit:contain;opacity:.92';
      holder.append(canvas);
    });
  }
  private openTrackSelection(): void {
    if (LAB_WORLD || this.state === 'loading' || !this.testScene) return;
    if (!this.camera?.introMode) this.openMenu();
    this.selectingTrack = true; document.body.classList.add('track-select-open');
    const go = document.querySelector('#track-go'); if (go) go.innerHTML = this.mode === 'gp' && this.gp && !this.gpTrackChosen ? 'Grand Prix starten <span>↵</span>' : 'Fahrer wählen <span>↵</span>';
    this.renderTrackSelection();
  }
  private closeTrackSelection(): void {
    this.selectingTrack = false; document.body.classList.remove('track-select-open');
  }
  private confirmTrackSelection(): void {
    if (!isTrackId(this.selectedTrackId)) return;
    this.closeTrackSelection();
    if (this.mode === 'gp' && this.gp && !this.gpTrackChosen) {
      const first = this.selectedTrackId;
      this.gp.tracks = [first, ...GP_TRACKS.filter((t) => t !== first)]; this.gpTrackChosen = true;
      this.closeMenu(); this.startGpRound(); return;
    }
    if (TRACK.id !== this.selectedTrackId) void this.loadTrack(this.selectedTrackId, () => this.openSelection());
    else this.openSelection();
  }
  private renderTrackSelection(): void {
    document.querySelectorAll<HTMLButtonElement>('#track-grid .track-card.playable').forEach((card)=>{
      const selected=card.dataset.trackId===this.selectedTrackId;
      card.classList.toggle('selected',selected);card.setAttribute('aria-pressed',String(selected));
    });
  }
  private openSelection(): void {
    if (LAB_WORLD || this.state === 'loading' || !this.testScene) return;
    if (!this.camera?.introMode) this.openMenu();
    this.selecting = true; document.body.classList.add('select-open');
    document.querySelector('#driver-kicker')!.textContent = this.mode === 'gp' && this.gp ? `FAHRERWAHL · GRAND PRIX · ${this.gp.tracks.map((t) => TRACKS[t].name).join(' → ')}` : `FAHRERWAHL · ${this.mode === 'timetrial' ? 'ZEITFAHREN' : 'EINZELRENNEN'} · ${TRACK.name.toUpperCase()}`;
    this.renderSelection();
    this.testScene.presentDriver?.(this.chosen);
  }
  private closeSelection(): void { this.selecting = false; document.body.classList.remove('select-open'); this.testScene?.presentDriver?.(null); }
  private confirmSelection(): void {
    this.closeSelection();
    try { localStorage.setItem('dk-driver', String(this.chosen)); } catch { /* storage optional */ }
    // Grand Prix (Marcel, 07.10.): after the driver comes Sarah's track selection; the chosen track opens the cup.
    if (this.mode === 'gp' && this.gp && this.gp.round === 0 && !this.gp.results.length && !this.gpTrackChosen) { this.openTrackSelection(); return; }
    if (this.mode === 'gp' && this.gp) this.startGpRound(); else void this.beginRace();
  }
  private pick(index: number): void {
    this.chosen = index; this.order = rosterOrder(index); this.testScene?.setRoster?.(this.order); this.applyTires();
    this.renderSelection(); if (this.selecting) this.testScene?.presentDriver?.(index); this.audio.voice(`${CAST[index].voice}-horn`, { channel: 'driver', rate: CAST[index].voiceRate, volume: .8 });
  }
  private renderSelection(): void {
    const grid = document.querySelector('#driver-grid')!; grid.replaceChildren();
    CAST.forEach((member, index) => {
      const card = document.createElement('button'); card.type = 'button'; card.className = 'driver-card'; card.setAttribute('role', 'option');
      card.classList.toggle('selected', index === this.chosen); card.setAttribute('aria-selected', String(index === this.chosen));
      const picture = Object.assign(document.createElement('img'), { src: this.portraits[index], alt: `Karikatur ${member.name}`, decoding: 'async' });
      const dot = document.createElement('i'); dot.style.background = member.paint;
      const name = document.createElement('strong'); name.textContent = member.name;
      card.title = `${member.name} · ${member.kartName}`;
      card.append(picture, dot, name);
      card.addEventListener('click', () => { if (index === this.chosen) this.confirmSelection(); else this.pick(index); });
      grid.append(card);
    });
    const m = CAST[this.chosen], detail = document.querySelector('#driver-detail')!; detail.replaceChildren();
    const title = document.createElement('b'); title.textContent = m.name;
    const kartLine = document.createElement('div'); kartLine.className = 'driver-kart'; kartLine.textContent = `${m.kartName} · „${m.title}“`;
    const line = document.createElement('div'); line.textContent = m.flavour;
    const ability = document.createElement('div'); ability.innerHTML = '<em>Fähigkeit (Q):</em> '; ability.append(m.abilityIdea + ' · ');
    const item = document.createElement('em'); item.textContent = 'Wurfobjekt:'; ability.append(item, ` ${m.projectileIcon} ${m.projectileName}`);
    const rival = document.createElement('div'); rival.innerHTML = '<em>Als Rivale:</em> '; rival.append(BOT_STYLES[this.chosen]?.label ?? '');
    const tires = document.createElement('div'); tires.className = 'tire-choice';
    const set = TIRE_SETS.find((t) => t.id === this.playerTires())!;
    const prev = document.createElement('button'); prev.type = 'button'; prev.textContent = '◀'; prev.addEventListener('click', () => this.cycleTires(-1));
    const next = document.createElement('button'); next.type = 'button'; next.textContent = '▶'; next.addEventListener('click', () => this.cycleTires(1));
    const label = document.createElement('span'); label.innerHTML = '<em>Reifen:</em> '; label.append(`${set.name} (${set.owner})${this.tireChoice === 'auto' ? ' · eigene' : ''}`);
    tires.append(prev, label, next);
    detail.append(title, kartLine, line, ability, rival, tires);
  }

  private async beginRace(): Promise<void> {
    if (LAB_WORLD || this.state === 'loading') return;
    const generation=this.generation;
    // A suspended AudioContext can wait for a fresh gesture: never let sound hold back the start.
    await Promise.race([this.audio.unlock(), new Promise((resolve) => setTimeout(resolve, 400))]);
    if(generation!==this.generation||!this.testScene)return;
    setBotStyles(this.order.map((driver, slot) => slot === 0 ? undefined : BOT_STYLES[driver]));
    this.closeMenu();
    this.mouse.release(); this.camera?.resetLook();
    if (this.camera?.photoMode) this.camera.togglePhoto(); document.body.classList.remove('photo-mode');
    // Reuse assets; reset the simulation without reloading the entire scene.
    this.kart = gridKart(LOAD_KART_COUNT); this.loadKarts = this.mode === 'timetrial' ? [] : initialLoadKarts();
    this.testScene.setBotsVisible?.(this.mode !== 'timetrial');
    this.ghostRecord = []; this.ghostRun = null;
    if (this.mode === 'timetrial') { try { const saved = JSON.parse(localStorage.getItem(this.storageKey('ghost')) ?? 'null'); if (saved && Array.isArray(saved.samples) && (saved.track ?? 'stadionring') === TRACK.id) this.ghostRun = saved; } catch { /* no ghost yet */ } }
    this.ghostDelta = null;
    this.testScene.setGhost?.(null);
    this.resetRenderState();
    this.progress = [this.kart, ...this.loadKarts].map(createRaceProgress);
    this.items=createItems(LOAD_KART_COUNT+1);this.itemMessage='';this.itemMessageUntil=0;this.abilityAnnouncementUntil=0;this.abilities=createAbilities(LOAD_KART_COUNT+1);this.queuedSpecial=false;this.testScene.setKimPolish?.([]);this.damage=createDamage(LOAD_KART_COUNT+1);this.salvage=[];
    this.queuedItemUse=false;this.queuedDefenseUse=false;this.itemHeld=false;this.itemDirection='forward';this.medals=createMedals(LOAD_KART_COUNT+1);
    this.botStuck = [this.kart,...this.loadKarts].map(() => 0); this.recoveryRemaining=this.botStuck.slice();
    this.startPress = null; this.padCooldown = [];
    this.racePhase = 'countdown'; this.countdown = 3.4; this.raceTime = 0; this.startFenceBroken = false; this.testScene.resetEffects?.();
    this.dayToNight = new URLSearchParams(location.search).get('night') === '1' || Math.random() < .5;
    this.lapTimes=[];this.lapNoticeUntil=0;
    this.audio.cue('countdown');this.audio.voice('announcer-3',{force:true});this.lastRank=6;
    this.ranking.reset();this.audio.setMusicTempo(1);this.waveUntil=0;this.paradeUntil=0;this.eventAnnounced=false;this.lastRanks=[];this.reactUntil=[];this.finishReacted=[];this.endCeremony();this.afterRace=false;
    this.showGpIntro();
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
    document.querySelector('#race-label')!.textContent = this.racePhase === 'practice' ? `FREIE FAHRT · ${TRACK.name.toUpperCase()}` : this.racePhase === 'finished' ? 'ZIEL ERREICHT' : `${this.mode==='timetrial'?'ZEITFAHREN':this.mode==='gp'&&this.gp?`GRAND PRIX ${this.gp.round+1}/${this.gp.tracks.length}`:'EINZELRENNEN'} · ${TRACK.name.toUpperCase()} · ${this.castOf(0).name.toUpperCase()}${this.mode==='timetrial'&&this.ghostDelta!==null?` · GEIST ${this.ghostDelta>=0?'+':'−'}${Math.abs(this.ghostDelta).toFixed(1)} s`:''}`;
    document.querySelector<HTMLElement>('#gp-intro')!.hidden = !(this.racePhase === 'countdown' || this.racePhase === 'race' && this.raceTime < this.gpIntroUntil);
    if (this.racePhase !== 'practice') this.ranking.update(rankRace(this.progress), (i) => ({ name: i === 0 ? `${this.castOf(0).name}` : this.castOf(i).name, paint: this.castOf(i).paint, portrait: this.portraits?.[this.order[i] ?? i], finished: this.progress[i]?.finished ?? false }), this.racePhase === 'finished', performance.now());
    document.body.classList.toggle('ranking-on', this.racePhase !== 'practice' && this.mode !== 'timetrial');
    const notice=document.querySelector<HTMLElement>('#lap-notice')!;notice.hidden=this.racePhase!=='race'||this.raceTime>=this.lapNoticeUntil;notice.textContent=this.lapNotice;
    const meter=document.querySelector<HTMLElement>('#drift-meter')!;meter.hidden=!this.kart.drifting&&this.kart.turboRemaining<=0;
    meter.classList.toggle('charged',driftTier(this.kart.driftCharge)>0||this.kart.turboRemaining>0);meter.dataset.tier=String(driftTier(this.kart.driftCharge));
    document.querySelector<HTMLElement>('#drift-fill')!.style.width=`${100*(this.kart.turboRemaining>0?this.kart.turboRemaining/KART_TUNING.turboDuration:this.kart.driftCharge/KART_TUNING.driftChargeTime)}%`;
    const countdown = document.querySelector<HTMLElement>('#countdown')!;
    const item=this.items.slots[0];
    const own=this.castOf(0);
    const itemName=item?(item==='direct'||item==='homing'?`${own.projectileName} · ${item==='homing'?'verfolgt':'voraus'}`:ITEM_NAMES[item]):'';
    const roulette=this.items.time<this.itemRouletteUntil;
    const rouletteIcons=['✉','§','▰','📜','↗','↻'];
    document.querySelector('#item-name')!.textContent=roulette?'Zuteilung läuft …':item?itemName:'Sendung abholen';
    document.querySelector('#item-icon')!.textContent=roulette?rouletteIcons[Math.floor(this.items.time*24)%rouletteIcons.length]:item==='direct'||item==='homing'?own.projectileIcon:item==='trap'?'§':item==='censor'?'▰':item==='boost'?'📜':'✉';
    const itemCard=document.querySelector<HTMLElement>('#item-card')!,itemSlot=document.querySelector<HTMLElement>('#item-slot')!;
    itemCard.classList.toggle('roulette',roulette);
    itemCard.dataset.state=item?'ready':'empty';itemSlot.dataset.state=item?'ready':'empty';
    itemSlot.setAttribute('aria-label',item?`Item im Slot: ${itemName}`:'Item-Slot leer');
    document.querySelector('#item-slot-state')!.textContent=item?'IM SLOT':'LEER';
    const itemButton=document.querySelector<HTMLButtonElement>('#item-use')!;
    itemButton.disabled=!item||this.racePhase!=='race';itemButton.textContent=item?'WERFEN':'E';
    itemButton.setAttribute('aria-label',item?`${itemName} werfen`:'Kein Item verfügbar');
    document.querySelector('#item-info')!.textContent=this.items.time<this.itemMessageUntil?this.itemMessage:item?(this.items.shield?.[0]?'Schild hinten · loslassen = werfen':'E/Touch halten: Schild · loslassen oder antippen: werfen'):this.racePhase==='practice'?'Im Rennen leuchtende Postkisten sammeln':'Leuchtende Postkisten auf der Strecke';
    const defenseReady=!!this.items.defenseSlots[0],defenseActive=(this.items.defenseRemaining[0]??0)>0;
    const defenseCard=document.querySelector<HTMLElement>('#defense-card')!,defenseButton=document.querySelector<HTMLButtonElement>('#defense-use')!;
    defenseCard.dataset.state=defenseReady||defenseActive?'ready':'empty';defenseCard.classList.toggle('active',defenseActive);
    document.querySelector('#defense-info')!.textContent=defenseActive?`Aktiv · ${(this.items.defenseRemaining[0]??0).toFixed(1)} s`:defenseReady?'Z / Taste · Schild zünden':'Zweite Itemkiste bei belegtem Itemplatz';
    defenseButton.disabled=!defenseReady||this.racePhase!=='race';defenseButton.setAttribute('aria-label',defenseReady?'Abwehrschild aktivieren':'Kein Abwehrschild verfügbar');
    const abilityAnnouncement=document.querySelector<HTMLElement>('#ability-announcement')!;
    abilityAnnouncement.hidden=this.racePhase!=='race'||this.items.time>=this.abilityAnnouncementUntil;
    document.querySelector('#ability-announcement-title')!.textContent=this.abilityAnnouncementTitle;
    document.querySelector('#ability-announcement-detail')!.textContent=this.abilityAnnouncementDetail;
    document.querySelector<HTMLElement>('#censor-banner')!.hidden=this.racePhase!=='race'||this.items.censorBannerRemaining[0]<=0;
    const incoming=this.items.objects.some(o=>o.kind!=='trap'&&o.owner!==0&&Math.hypot(o.x-this.kart.x,o.z-this.kart.z)<15);
    const warning=document.querySelector<HTMLElement>('#item-warning')!;warning.hidden=!incoming;document.body.classList.toggle('incoming-item',incoming);warning.textContent=this.items.objects.some(o=>o.kind==='censor'&&o.owner!==0&&Math.hypot(o.x-this.kart.x,o.z-this.kart.z)<15)?'⚠ Zensurbalken im Anflug · ausweichen':'⚠ Rohrpost im Anflug · ausweichen';
    { // Ability HUD: name, state and a cooldown/duration bar.
      const driver=this.order[0]??0,ownsTank=driver===0,ownsKim=driver===4,ownsPose=driver===2,ownsBlockade=driver===5,tank=ownsTank&&this.kart.tankRemaining>0,kim=this.abilities.kimPolishRemaining[0]>0,pose=(this.abilities.poseRemaining?.[0]??0)>0;
      const implemented=ownsTank||ownsKim||ownsPose||ownsBlockade,ready=implemented&&abilityReady(this.abilities,0,this.kart),cool=this.abilities.cooldown[0];
      const card=document.querySelector<HTMLElement>('#ability-card');
      if(card){card.classList.toggle('active',tank||kim||pose);card.classList.toggle('ready',ready);
        document.querySelector('#ability-name')!.textContent=ownsTank?ABILITY_NAME:ownsKim?'Propaganda-Sieg':ownsPose?'Große Pose':ownsBlockade?'Blockade':this.castOf(0).abilityIdea.split(' –')[0];
        document.querySelector('#ability-info')!.textContent=!implemented?'Q · noch nicht gebaut':pose?'Pose · Kinn hoch':tank?`Panzer · ${this.kart.tankRemaining.toFixed(1)} s`:kim?`Triumphmeldung · ${this.abilities.kimPolishRemaining[0].toFixed(1)} s`:ready?(ownsKim?'Q · Erfolg genehmigt':ownsPose?'Q · Pose bereit':ownsBlockade?'Q · Schranken bereit':'Q · Panzer bereit'):`Q · bereit in ${Math.ceil(cool)} s`;
        document.querySelector<HTMLElement>('#ability-fill')!.style.width=`${100*(tank?this.kart.tankRemaining/ABILITY_RULES.tankDuration:kim?this.abilities.kimPolishRemaining[0]/ABILITY_RULES.kimPolishDuration:1-cool/ABILITY_RULES.cooldown)}%`;}
    }
    countdown.hidden = this.racePhase !== 'countdown'; countdown.textContent = this.countdown > .4 ? `${Math.ceil(this.countdown - .4)}` : 'LOS!';
    document.querySelector('#race-start')!.textContent = this.racePhase === 'practice' ? 'Rennen starten ↵' : 'Neues Rennen ↵';
    const map = document.querySelector<HTMLCanvasElement>('#minimap')!, c = map.getContext('2d')!;
    c.clearRect(0, 0, map.width, map.height);
    if (this.minimapTrack) c.drawImage(this.minimapTrack, 0, 0);
    [...this.loadKarts, this.kart].forEach((s, i, all) => { const player = i === all.length - 1, [x, y] = this.minimapPoint(s.x, s.z); c.fillStyle = player ? '#ffe1a0' : this.castOf(i + 1).paint; c.strokeStyle = '#0b1a1e'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, player ? 5 : 3, 0, Math.PI * 2); c.fill(); c.stroke(); });
  }

  private minimapTrack: HTMLCanvasElement | undefined;
  // Track bounds per course: recomputing them for every dot cost ~2 % of a frame (CPU profile 08.10.2026).
  private minimapFrame: { samples: unknown; cx: number; cz: number; scale: number } | undefined;
  private minimapPoint(x: number, z: number): [number, number] {
    if (this.minimapFrame?.samples !== TRACK.samples) {
      const xs = TRACK.samples.map((p) => p.x), zs = TRACK.samples.map((p) => p.z);
      const minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs);
      this.minimapFrame = { samples: TRACK.samples, cx: (minX + maxX) / 2, cz: (minZ + maxZ) / 2, scale: Math.min(130 / (maxX - minX), 210 / (maxZ - minZ)) };
    }
    const f = this.minimapFrame;
    return [75 + (x - f.cx) * f.scale, 115 - (z - f.cz) * f.scale];
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
    document.querySelector('.map-card span')!.textContent = `${Math.round(TRACK.length)} m · ${TRACK.name.toUpperCase()}`;
  }

  /** Welcome announcement once per page load, after the first gesture unlocked audio. */
  private welcome(): void { if (this.welcomed || LAB_WORLD) return; this.welcomed = this.audio.voice('announcer-welcome'); }
  /** A caricature's own line; the player's driver speaks louder than the field. */
  /** Shows a driver gesture at most every 3.5 s per kart unless forced (hits, finish). */
  private react(kart:number,kind:'cheer'|'fist'|'angry',force=false):void{
    if(!force&&(this.reactUntil[kart]??0)>this.raceTime)return;
    this.reactUntil[kart]=this.raceTime+3.5;this.testScene?.driverReaction?.(kart,kind);
  }
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
      if (rank === 1 && this.leadCooldown === 0) { this.audio.voice('announcer-lead'); this.audio.cheer(1); this.leadCooldown = 20; this.testScene?.crowdReact?.('cheer', 0); }
      else if (this.voiceCooldown === 0) { this.say(0, 'pass'); this.voiceCooldown = 9; }
    }
    if (this.kart.turboRemaining > KART_TUNING.turboDuration - .05 && this.voiceCooldown === 0 && Math.random() < .35) { this.say(0, 'boost'); this.voiceCooldown = 12; }
    this.lastRank = rank;
  }

  /** Player tyre set (driver's own or any other); bots keep their own designs. */
  private playerTires(): string { return this.tireChoice === 'auto' ? DEFAULT_TIRES[this.chosen] : this.tireChoice; }
  private applyTires(): void { this.testScene?.setTires?.(0, this.playerTires()); }
  private cycleTires(step: number): void {
    const ids = ['auto', ...TIRE_SETS.map((s) => s.id)];
    this.tireChoice = ids[(ids.indexOf(this.tireChoice) + step + ids.length) % ids.length];
    try { localStorage.setItem('dk-tires', this.tireChoice); } catch { /* optional */ }
    this.applyTires(); this.renderSelection();
  }
  /** Options: rebinding list for the main driving actions (keys saved locally). */
  private renderKeymap(): void {
    const root = document.querySelector<HTMLElement>('#keymap'); if (!root) return;
    root.replaceChildren();
    for (const { action, label } of REBINDABLE) {
      const button = document.createElement('button'); button.type = 'button';
      button.textContent = this.rebinding === action ? `${label}: Taste drücken …` : `${label}: ${keyLabel(primaryKey(action))}`;
      button.addEventListener('click', () => { this.rebinding = action; this.renderKeymap(); });
      root.append(button);
    }
    const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = 'Standardtasten';
    reset.addEventListener('click', () => { resetBindings(); try { localStorage.removeItem('dk-keys-v1'); } catch { /* optional */ } this.renderKeymap(); });
    root.append(reset);
  }
  /** Result list and winner portrait from the live race ranking (updated while rivals are still finishing). */
  private renderFinishResults(): void {
    const names=this.order.map((_,i)=>i===0?`Du · ${this.castOf(0).name}`:this.castOf(i).name);
    const ranking=rankRace(this.progress).map(i=>({p:this.progress[i],i}));
    const list=document.querySelector('#finish-results')!;list.replaceChildren();
    for(const {p,i} of ranking){const row=document.createElement('li');row.classList.toggle('player-result',i===0);const label=document.createElement('strong');label.textContent=names[i];const time=document.createElement('small');time.textContent=p.finished?`${p.finishTime!.toFixed(2)} s`:`${Math.max(0,3*TRACK.length-p.distance).toFixed(0)} m Rest`;
      const shot=this.portraits?.[this.order[i]];if(shot)row.append(Object.assign(document.createElement('img'),{src:shot,alt:''}));row.append(label,time);list.append(row);}
    // Winner's portrait on the podium card.
    const winner=ranking[0]?.i??0,podium=document.querySelector<HTMLImageElement>('#finish-portrait');
    if(podium){const shot=this.portraits?.[this.order[winner]];podium.hidden=!shot;if(shot){podium.src=shot;podium.alt=`Sieger ${this.castOf(winner).name}`;}}
  }
  /** Player is home, rivals still racing: points and times become final when everyone has crossed the line. */
  private presentPendingFinish(): void {
    const retry = document.querySelector<HTMLButtonElement>('#finish-retry')!, table = document.querySelector<HTMLElement>('#gp-standings')!;
    table.hidden = false; table.replaceChildren(Object.assign(document.createElement('b'), { textContent: 'ZIELEINLAUF LÄUFT · DIE WERTUNG FOLGT, SOBALD ALLE IM ZIEL SIND' }));
    retry.innerHTML = 'Rest überspringen <span>↵</span>';
    this.finishAction = () => { if (!this.afterRace) return; this.afterRace = false; this.renderFinishResults(); this.presentFinishActions(rankRace(this.progress)); };
  }
  /** localStorage keys per circuit; the Stadionring keeps its earlier keys so existing records survive. */
  private storageKey(kind: 'race' | 'timetrial' | 'ghost' | 'lap'): string {
    if (TRACK.id === 'stadionring') return { race: 'dk-best-stadium-v2', timetrial: 'dk-best-timetrial-v2', ghost: 'dk-ghost-v2', lap: 'dk-best-lap-stadionring-v1' }[kind];
    return `dk-${kind === 'ghost' ? 'ghost' : kind === 'lap' ? 'best-lap' : `best-${kind}`}-${TRACK.id}-v1`;
  }
  /** Seconds ahead (−) or behind (+) the saved ghost at the player's current race distance. */
  private ghostGap(): number | null {
    const samples = this.ghostRun?.samples; if (!samples?.length || samples[0].length < 5) return null;
    const d = Math.max(0, this.progress[0].distance);
    let i = samples.findIndex((p) => p[4] >= d); if (i < 0) i = samples.length - 1;
    return this.raceTime - i / 20;
  }
  /** Driver selection: frame the player kart and the driver standing beside it, eased so a new driver does not jump. */
  private presentationAim: { x: number; z: number } | undefined;
  private presentationFocus(): KartState {
    const k = this.renderKart, at = this.testScene?.presentedAt?.();
    const goal = at ? { x: (k.x + at.x) / 2, z: (k.z + at.z) / 2 } : { x: k.x, z: k.z };
    const aim = this.presentationAim ??= goal;
    aim.x += (goal.x - aim.x) * .08; aim.z += (goal.z - aim.z) * .08;
    return { ...k, x: aim.x, z: aim.z };
  }
  /** Start menu backdrop (Marcel, 07.10.): the camera glides from driver to driver every few seconds, random start. */
  private menuCycle={from:-1,to:Math.floor(Math.random()*6),since:0};
  private menuFocus(): KartState {
    const all=[this.kart,...this.loadKarts], now=performance.now()/1000, hold=6.5, glide=2.6;
    if(this.menuCycle.from<0){this.menuCycle={from:this.menuCycle.to%all.length,to:this.menuCycle.to%all.length,since:now};}
    if(now-this.menuCycle.since>hold+glide){this.menuCycle={from:this.menuCycle.to,to:(this.menuCycle.to+1+Math.floor(Math.random()*(all.length-1)))%all.length,since:now};}
    const a=all[this.menuCycle.from]??this.kart,b=all[this.menuCycle.to]??this.kart;
    const t=Math.max(0,Math.min(1,(now-this.menuCycle.since-hold)/glide)),u=t*t*(3-2*t);
    const turn=Math.atan2(Math.sin(b.heading-a.heading),Math.cos(b.heading-a.heading));
    return {...a,x:a.x+(b.x-a.x)*u,z:a.z+(b.z-a.z)*u,heading:a.heading+turn*u,height:a.height+(b.height-a.height)*u};
  }
  /** Podium after the final Grand-Prix race: top three karts on the blocks, slow camera orbit, confetti. */
  private startCeremony(slots: number[]): void {
    const at = trackPoint(TRACK.start + 22, 0), y = trackHeightAt(at.x, at.z);
    const spot = { x: at.x, y, z: at.z, heading: at.heading + Math.PI };
    this.testScene?.ceremony?.(spot);
    const offsets = [[0, 1.5], [-3, 1.0], [3, .7]] as const;
    const all = [this.kart, ...this.loadKarts];
    slots.forEach((slot, place) => {
      if (slot < 0 || !all[slot]) return;
      const [lane, h] = offsets[place], c = Math.cos(spot.heading), s = Math.sin(spot.heading);
      all[slot] = { ...all[slot], x: spot.x + c * lane, z: spot.z - s * lane, heading: spot.heading + Math.PI, travelHeading: spot.heading + Math.PI, speed: 0, height: h, grounded: true };
    });
    // Everyone else lines up behind the podium so the three steps stay clear.
    all.forEach((k, slot) => { if (!slots.includes(slot)) { const p = trackPoint(TRACK.start - 6 - slot * 3.5, slot % 2 ? 4 : -4); all[slot] = { ...k, x: p.x, z: p.z, heading: p.heading, speed: 0 }; } });
    this.kart = all[0]; this.loadKarts = all.slice(1); this.resetRenderState();
    this.camera?.setCeremony(spot); document.body.classList.add('ceremony');
    this.testScene?.celebrate?.('finish');this.testScene?.crowdReact?.('wave');this.testScene?.crowdReact?.('cheer',0); this.audio.cheer(1.4);
  }
  private endCeremony(): void { this.testScene?.ceremony?.(null); this.camera?.setCeremony(null); document.body.classList.remove('ceremony'); }
  private showGpIntro(): void {
    const intro = document.querySelector<HTMLElement>('#gp-intro')!;
    const lines: Record<TrackId, [string, string]> = {
      stadionring: ['Das Komitee hat den Sieger bereits beglückwünscht.', 'Gefahren wird trotzdem – aus Gründen der Tradition.'],
      'duce-drom': ['Der Balkon erwartet Applaus in alphabetischer Reihenfolge.', 'Die Züge sind pünktlich. Behauptet zumindest das Programmheft.'],
      havanna: ['Die Eröffnungsrede läuft seit gestern. Bitte leise starten.', 'Ersatzteile sind bestellt – seit 1958.'],
      pyongyang: ['Die Parade fährt im Gleichschritt. Die Stoppuhr widerspricht.', 'Hundert Prozent Zustimmung – laut Lautsprecher.'],
      moscow: ['Die Parade ist breit genug für sechs Karts. Die Vorschrift verlangt trotzdem eine Spur.', 'Der Rote Platz ist geöffnet. Der Antrag auf Abkürzung wird während der Fahrt geprüft.'],
      beijing: ['Jede Kurve steht im Regelheft. Welche, wird nach dem Rennen festgelegt.', 'Die Planerfüllung liegt bei 400 Prozent. Die Ziellinie bleibt vorerst bei einer.'],
    };
    const [title, detail] = lines[TRACK.id];
    document.querySelector('#gp-intro-kicker')!.textContent = this.mode === 'gp' && this.gp ? `GROSSER PREIS DER EITELKEIT · RENNEN ${this.gp.round + 1}/${this.gp.tracks.length} · ${TRACK_INFO.city.toUpperCase()}` : this.mode === 'timetrial' ? `ZEITFAHREN · ${TRACK.name.toUpperCase()}` : `EINZELRENNEN · ${TRACK.name.toUpperCase()} · ${TRACK_INFO.city.toUpperCase()}`;
    document.querySelector('#gp-intro-title')!.textContent = this.mode === 'timetrial' ? (this.ghostRun ? `Dein Geist fährt ${this.ghostRun.time.toFixed(2)} s vor.` : 'Noch kein Geist gespeichert.') : title;
    document.querySelector('#gp-intro-detail')!.textContent = this.mode === 'timetrial' ? 'Nur vollständige Läufe zählen als Bestzeit.' : detail;
    intro.hidden = false; this.gpIntroUntil = 3.5;
  }
  /** Finish card buttons and Grand Prix standings: points are awarded once, from the race system's own ranking. */
  private presentFinishActions(order: number[]): void {
    const retry = document.querySelector<HTMLButtonElement>('#finish-retry')!, table = document.querySelector<HTMLElement>('#gp-standings')!;
    table.hidden = true; table.replaceChildren();
    if (this.mode !== 'gp' || !this.gp) {
      retry.innerHTML = 'Revanche <span>↵</span>'; this.finishAction = () => void this.beginRace(); return;
    }
    const gp = this.gp;
    awardPoints(gp, TRACK.id, order.map((slot) => this.order[slot] ?? slot), this.raceTime);
    window.setTimeout(() => this.audio.voice(gp.round >= gp.tracks.length - 1 ? 'announcer-gp-champion' : 'announcer-gp-standings', { force: true }), 6500);
    const rows = standings(gp), last = gp.round >= gp.tracks.length - 1, me = this.chosen;
    const head = document.createElement('b'); head.textContent = last ? 'GESAMTWERTUNG · SIEGEREHRUNG' : `ZWISCHENWERTUNG NACH RENNEN ${gp.round + 1}/${gp.tracks.length}`; table.append(head);
    const list = document.createElement('ol');
    rows.forEach((row, place) => {
      const li = document.createElement('li'); li.classList.toggle('player-result', row.driver === me);
      const gained = gp.results.at(-1)?.points[row.driver] ?? 0;
      li.innerHTML = `<span></span><strong></strong><small></small>`;
      li.querySelector('span')!.textContent = `${place + 1}.`; li.querySelector('strong')!.textContent = row.driver === me ? `Du · ${CAST[row.driver].name}` : CAST[row.driver].name;
      li.querySelector('small')!.textContent = `${row.points} P${gained ? ` (+${gained})` : ''}`;
      list.append(li);
    });
    table.append(list); table.hidden = false;
    if (last) {
      const champion = rows[0].driver, won = champion === me;
      document.querySelector('#finish-title')!.textContent = won ? 'Grand-Prix-Sieg · amtlich bestätigt' : `Grand Prix an ${CAST[champion].name}`;
      document.querySelector('#finish-detail')!.textContent = `${won ? 'Ergebnis ausnahmsweise korrekt gezählt.' : 'Der Pokal wurde bereits graviert. Diesmal stimmt sogar der Name.'} · Rennen: ${gp.results.filter((r) => r.order.length).map((r) => `${TRACKS[r.track].name} P${r.order.indexOf(me) + 1}`).join(' · ')}`;
      const podium = document.querySelector<HTMLImageElement>('#finish-portrait');
      if (podium) { const shot = this.portraits?.[champion]; podium.hidden = !shot; if (shot) { podium.src = shot; podium.alt = `Grand-Prix-Sieger ${CAST[champion].name}`; } }
      this.startCeremony(rows.slice(0, 3).map((row) => this.order.indexOf(row.driver)));
      retry.innerHTML = 'Neuer Grand Prix <span>↵</span>';
      this.finishAction = () => { this.gp = createGrandPrix(GP_TRACKS); this.startGpRound(); };
    } else {
      const next = TRACKS[gp.tracks[gp.round + 1]];
      retry.innerHTML = `Nächstes Rennen: ${next.name} <span>↵</span>`;
      this.finishAction = () => { if (!this.gp) return; this.gp.round++; this.startGpRound(); };
    }
  }

  private park(on: boolean): void {
    if (this.parked === on) return;
    this.parked = on;
    document.body.classList.toggle('parked', on);
    if (on && this.state === 'running' && this.racePhase !== 'practice') this.togglePause();
    this.input.reset();
    this.audio.park(on);
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
    if (this.parked) return;
    if (this.state === 'running' && !document.hidden && this.lastFrameAt > 0) {
      const elapsed = now - this.lastFrameAt;
      if (elapsed > 0 && elapsed < 500) {
        this.frameTimes.push(elapsed);
        if (this.frameTimes.length > 300) this.frameTimes.shift();
      } else this.frameTimes = [];
    } else if (this.state !== 'running' || document.hidden) this.frameTimes = [];
    this.lastFrameAt = now;
    { // Gamepads: polled once per rendered frame; in menus A/B/D-pad behave like Enter/Escape/arrows.
      const menu=!!this.camera?.introMode||this.selecting||this.selectingTrack||this.racePhase==='finished';
      const found=pollGamepads(this.input,menu,(code)=>{window.dispatchEvent(new KeyboardEvent('keydown',{code,key:code,bubbles:true}));window.dispatchEvent(new KeyboardEvent('keyup',{code,key:code,bubbles:true}));},this.padButtons);
      if(found&&!this.gamepadSeen){this.gamepadSeen=true;this.itemMessage='Gamepad erkannt · Stick lenkt, RT Gas, A Drift, X Item';this.itemMessageUntil=this.items.time+3;}
    }
    if (this.autoQuality && this.state === 'running' && this.camera?.introMode) {
      const level = pickQuality(this.frameTimes);
      if (level !== null) {
        this.autoQuality = false;
        const median = [...this.frameTimes].sort((a, b) => a - b)[Math.floor(this.frameTimes.length / 2)];
        if (level !== this.quality) { this.quality = level; this.applyQuality(); } else this.applyQuality();
        this.lastAction = `Grafik automatisch: ${['Basis', 'Standard', 'Hoch'][level]} (Median ${median.toFixed(1)} ms)`;
        const hint = document.querySelector<HTMLElement>('.menu-flavor'); if (hint) hint.dataset.autoQuality = this.lastAction;
        console.info(`[Diktator Kart] ${this.lastAction} – in den Optionen änderbar`);
      }
    }
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
        if (this.order[0] === 0 || this.order[0] === 4 || this.order[0] === 2 || this.order[0] === 5) { this.queuedSpecial = true; this.lastAction = this.order[0] === 0 ? 'Größenbefehl (Q)' : this.order[0] === 2 ? 'Große Pose (Q)' : this.order[0] === 5 ? 'Blockade (Q)' : 'Propaganda-Sieg (Q)'; }
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
          if(this.startPress===null&&frame.throttle>0)this.startPress=this.countdown;
          const before=Math.ceil(this.countdown-.4);this.countdown -= FIXED_STEP;
          if(this.countdown<=0){
            // Start boost: throttle pressed in the last ~0.5 s before 'LOS!' (shown at 0.4); earlier presses get nothing.
            const t=this.startPress,good=t!==null&&t<=.9;
            if(good){this.kart={...this.kart,turboRemaining:KART_TUNING.turboDuration,speed:KART_TUNING.turboSpeedBonus+2};this.itemMessage='Perfekter Start · Startschub!';this.itemMessageUntil=this.items.time+1.8;}
            else if(t!==null){this.itemMessage='Zu früh Gas gegeben · kein Startschub';this.itemMessageUntil=this.items.time+1.8;}
            this.loadKarts=this.loadKarts.map((k,i)=>(i*7+Math.floor(this.raceTime*13))%3===0?{...k,turboRemaining:KART_TUNING.turboDuration*.8,speed:KART_TUNING.turboSpeedBonus}:k);
            this.racePhase='race';this.audio.cue('start');this.audio.voice('announcer-go',{force:true});this.audio.cheer(1);this.testScene?.celebrate?.('start');this.testScene?.crowdReact?.('wave');}
          else if(this.countdown>.4&&Math.ceil(this.countdown-.4)!==before){this.audio.cue('countdown');this.audio.voice(`announcer-${Math.ceil(this.countdown-.4)}`,{force:true});}
        }
        if (!countdown && (this.racePhase !== 'finished' || this.afterRace)) {
        const project = LAB_WORLD ? undefined : projectTrack;
        const traffic = [this.kart, ...this.loadKarts];
        const terrain = LAB_WORLD ? undefined : trackHeightAt;
        // Accessibility assists (options): automatic throttle and a gentle steering help near the walls.
        const assisted = { ...frame, hopPressed: this.queuedHopPress && !((this.kart.jumpRemaining ?? 0) > 0) };
        if (this.autoGas && frame.throttle >= 0 && this.racePhase !== 'practice' || this.autoGas && frame.throttle > 0) assisted.throttle = frame.throttle < 0 ? frame.throttle : 1;
        if (this.steerAssist && !LAB_WORLD) { const help = botInput(this.kart, 0, traffic).steering; assisted.steering = Math.max(-1, Math.min(1, frame.steering + help * (frame.steering === 0 ? .55 : .25))); }
        if(this.items.censorRemaining[0]>0)assisted.steering*=.72;
        if(this.abilities.kimPenaltyRemaining[0]>0)assisted.throttle*=.55;
        if((this.abilities.poseRemaining?.[0]??0)>0)assisted.throttle=Math.min(assisted.throttle,ABILITY_RULES.poseThrottle);
        // After the player's finish the state chauffeur (bot controller) drives on while the rivals complete their laps.
        this.kart = advanceKart(this.kart, (DEMO || this.racePhase === 'finished') && !LAB_WORLD ? botInput(this.kart, 0, traffic) : assisted, FIXED_STEP, project, terrain);
        this.loadKarts = this.loadKarts.map((other, index) => {
          if (!LAB_WORLD && this.racePhase === 'practice' && !DEMO) return other;
          let botDrive=LAB_WORLD?{throttle:1,steering:CONTACT_SCENARIO?0:.75}:botInput(other,index+1,traffic);
          if(!LAB_WORLD&&this.items.censorRemaining[index+1]>0)botDrive={...botDrive,steering:botDrive.steering*.72};
          if(!LAB_WORLD&&this.abilities.kimPenaltyRemaining[index+1]>0)botDrive={...botDrive,throttle:botDrive.throttle*.55};
          if(!LAB_WORLD&&(this.abilities.poseRemaining?.[index+1]??0)>0)botDrive={...botDrive,throttle:Math.min(botDrive.throttle,ABILITY_RULES.poseThrottle)};
          let next = advanceKart(other, botDrive, FIXED_STEP, project, terrain);
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
        if (!LAB_WORLD && this.raceTime < this.paradeUntil) {
          // Moscow honour parade: a gentle tailwind on the first parade straight, up to 6 % above normal top speed, for every kart.
          const tailwind = (k: typeof this.kart) => { const s = trackProgressOf(k); return s > 95 && s < 520 && k.grounded && k.speed > 4 ? { ...k, speed: Math.max(k.speed, Math.min(k.speed + 1.6 * FIXED_STEP, 17)) } : k; };
          this.kart = tailwind(this.kart); this.loadKarts = this.loadKarts.map(tailwind);
        }
        if (!LAB_WORLD && this.raceTime < this.waveUntil) {
          // Malecón wave: water on the seafront stretch costs speed and a little grip, identical for every kart.
          const soak = (k: typeof this.kart) => { const s = trackProgressOf(k); return s > 95 && s < 330 && k.grounded ? { ...k, speed: k.speed * (1 - .9 * FIXED_STEP), yawRate: k.yawRate * (1 - 1.5 * FIXED_STEP) } : k; };
          this.kart = soak(this.kart); this.loadKarts = this.loadKarts.map(soak);
        }
        const resolved = resolveKartContacts([this.kart, ...this.loadKarts], project);
        this.kart = resolved[0];
        this.loadKarts = resolved.slice(1);
        if (!LAB_WORLD && (this.racePhase === 'race' || this.racePhase === 'practice' || this.afterRace)) {
          const all=[this.kart,...this.loadKarts];
          const botsActive=this.racePhase==='race';
          const owners:AbilityOwner[]=this.order.map(driver=>driver===0?'tank':driver===4?'kim':driver===2?'pose':driver===5?'blockade':'none');
          const activations=all.map((_,i)=>i===0?this.queuedSpecial:botsActive&&owners[i]!=='none'&&botWantsAbility(this.abilities,i,all,owners[i]));
          const changed=stepAbilities(this.abilities,all,activations,this.items.immune,FIXED_STEP,owners);
          this.queuedSpecial=false;this.kart=changed[0];this.loadKarts=changed.slice(1);
          this.testScene?.setKimPolish?.(this.abilities.kimPolishRemaining);
          for(const event of this.abilities.events){
            this.abilityStats[event.kind]++;this.testScene?.abilityEvent?.(event.kind,event.kart,event.target);
            const source=all[event.kart],near=event.kart===0||event.target===0||Math.hypot(source.x-this.kart.x,source.z-this.kart.z)<35;
            if(near&&(event.kind==='transform'||event.kind==='revert'||event.kind==='crush'))this.audio.ability(event.kind);
            else if(event.kind==='kim-surge'&&near)this.audio.itemEvent('launch');
            else if(event.kind==='kim-audit'&&event.kart===0)this.audio.itemEvent('hit');
            if(event.kind==='transform'&&event.kart!==0&&Math.hypot(source.x-this.kart.x,source.z-this.kart.z)<35){this.itemMessage='Achtung · Hitler wird zum Panzer';this.itemMessageUntil=this.items.time+2;}
            if(event.kind==='transform'&&event.kart===0){this.itemMessage='Größenbefehl · Panzer für 8 s';this.itemMessageUntil=this.items.time+2.2;this.audio.cheer(.8);}
            if(event.kind==='pose'&&(event.kart===0||Math.hypot(source.x-this.kart.x,source.z-this.kart.z)<35)){
              this.abilityAnnouncementTitle='GROSSE POSE · KINN 40 GRAD';
              this.abilityAnnouncementDetail=event.kart===0?'Das Volk applaudiert. Pflichtgemäß.':`${this.castOf(event.kart).name} posiert. Bitte nicht überholen, er schaut gerade.`;
              this.abilityAnnouncementUntil=this.items.time+ABILITY_RULES.poseDuration+.6;this.audio.cheer(event.kart===0?.9:.4);
            }
            if(event.kind==='blockade'){
              const k=all[event.kart];
              for(const lane of [-1.7,1.7]){const back=4.2,x=k.x-Math.sin(k.heading)*back+Math.cos(k.heading)*lane,z=k.z-Math.cos(k.heading)*back-Math.sin(k.heading)*lane;
                this.items.objects.push({id:this.items.nextId++,kind:'trap',owner:event.kart,x,z,heading:k.heading,age:0,remaining:ITEM_RULES.trapLifetime,target:null});}
              if(event.kart===0||Math.hypot(k.x-this.kart.x,k.z-this.kart.z)<35){
                this.abilityAnnouncementTitle='BLOCKADE · DURCHFAHRT NUR MIT VISUM';
                this.abilityAnnouncementDetail=event.kart===0?'Zwei Paragraphenschranken hinter dir.':`${this.castOf(event.kart).name} sperrt die Straße. Antrag auf Durchfahrt läuft.`;
                this.abilityAnnouncementUntil=this.items.time+2.2;this.audio.itemEvent('launch');}
            }
            if(event.kind==='pose-applause'&&event.kart===0){this.itemMessage='Pflichtapplaus · Schub und kurz geschützt';this.itemMessageUntil=this.items.time+1.8;this.audio.cue('start');}
            if(event.kind==='crush'&&event.target!==undefined){this.damage.health[event.target]=Math.max(0,this.damage.health[event.target]-22);if(event.target===0){this.itemMessage='Plattgewalzt · Karosserie beschädigt';this.itemMessageUntil=this.items.time+1.6;}}
            if(event.kind==='crush'&&event.kart===0){this.itemMessage='Überrollt · Gegner weggedrängt';this.itemMessageUntil=this.items.time+1.6;}
            if(event.kind==='kim-surge'&&(event.kart===0||Math.hypot(source.x-this.kart.x,source.z-this.kart.z)<35)){
              this.abilityAnnouncementTitle='Rennergebnis NICHT manipuliert.';
              this.abilityAnnouncementDetail='Kim Jong-Un freut sich über seine demokratische Bestzeit.';
              this.abilityAnnouncementUntil=this.items.time+ABILITY_RULES.kimBoostDuration;
              this.audio.cheer(event.kart===0?.8:.35);
            }
            if(event.kind==='kim-audit'&&event.kart===0){
              this.abilityAnnouncementTitle='NACHPRÜFUNG: RENNERGEBNIS UNVERÄNDERT.';
              this.abilityAnnouncementDetail='Der Motor stottert. Die demokratische Bestzeit muss kurz warten.';
              this.abilityAnnouncementUntil=this.items.time+2.6;
              this.itemMessage='Motor stottert · Nachprüfung läuft';this.itemMessageUntil=this.items.time+1.8;
            }
          }
        }
        if (!LAB_WORLD && (this.racePhase === 'race' || this.afterRace)) {
          const all=[this.kart,...this.loadKarts];
          const ranks=this.progress.map(p=>1+this.progress.filter(other=>other.distance>p.distance).length);
          // Driver reactions (10.10.2026): fist after an overtake, cheer or head shake at the finish (purely visual).
          if(this.racePhase==='race'&&this.raceTime>4&&this.lastRanks.length===ranks.length) ranks.forEach((rank,i)=>{ if(rank<this.lastRanks[i]&&!this.progress[i].finished) this.react(i,'fist'); });
          this.progress.forEach((p,i)=>{ if(p.finished&&!this.finishReacted[i]){ this.finishReacted[i]=true; this.react(i,ranks[i]<=3?'cheer':'angry',true); } });
          this.lastRanks=ranks;
          // Hold E: the item trails behind as a shield; release E: throw it. Bots shield while they wait to use theirs.
          const actionPressed=frame.pressed.has('item'),down=this.input.isDown('item'),release=this.itemHeld&&!down,tap=actionPressed&&!down;this.itemHeld=down;
          const buttonUse=this.queuedItemUse;this.queuedItemUse=false;
          if(down&&(this.input.isDown('itemBackward')||frame.pressed.has('itemBackward')))this.itemDirection='backward';
          else if(down&&(this.input.isDown('itemForward')||frame.pressed.has('itemForward')))this.itemDirection='forward';
          this.items.shield=all.map((_,i)=>i===0?down&&!!this.items.slots[0]:!!this.items.slots[i]&&this.items.heldFor[i]>.5);
          const use=all.map((_,i)=>i===0?release||tap||buttonUse||(DEMO&&botUsesItem(this.items,i,all)):botUsesItem(this.items,i,all,(botStyleOf(i)?.itemPatience??1)*botDifficulty().patience));
          const directions=all.map((_,i)=>i===0?this.itemDirection:botItemDirection(this.items,i,all));
          const defensePressed=this.queuedDefenseUse||frame.pressed.has('defend');this.queuedDefenseUse=false;
          const defenseActivations=all.map((kart,i)=>i===0?defensePressed:!!this.items.defenseSlots[i]&&this.items.objects.some(o=>o.kind!=='trap'&&Math.hypot(o.x-kart.x,o.z-kart.z)<10));
          this.items.seekers=all.map((_,i)=>this.castOf(i).projectile==='dog');
          const itemResult=stepItems(this.items,all,use,ranks,FIXED_STEP,directions,defenseActivations);
          if(this.items.events.some((event)=>event.kind==='pickup'&&event.kart===0))this.itemRouletteUntil=this.items.time+.62;
          for(const event of this.items.events) if(event.kind==='hit'&&event.item==='direct'&&event.owner!==undefined&&this.castOf(event.owner).projectile==='dog'){
            // The shepherd explodes on impact: extra body damage and a burst at the victim.
            this.damage.health[event.kart]=Math.max(0,this.damage.health[event.kart]-12);this.testScene?.abilityEvent?.('crush',event.owner,event.kart);
            if(event.kart===0||Math.hypot(all[event.kart].x-this.kart.x,all[event.kart].z-this.kart.z)<35)this.audio.thunder();
          }this.kart=itemResult[0];this.loadKarts=itemResult.slice(1);
          if(release)this.itemDirection='forward';
          for(const event of this.items.events) if(event.kind==='hit') { if(event.owner===0&&event.kart!==0)this.testScene?.crowdReact?.('cheer',event.kart); loseMedals(this.medals,event.kart); this.react(event.kart,'angry',true); if(event.owner!==undefined&&event.owner!==event.kart) this.react(event.owner,'cheer'); }
          { const medalled=stepMedals(this.medals,[this.kart,...this.loadKarts],FIXED_STEP);this.kart=medalled[0];this.loadKarts=medalled.slice(1);
            for(const event of this.medals.events) if(event.kart===0){
              if(event.kind==='pickup'){this.audio.itemEvent('pickup');this.testScene?.abilityEvent?.('pose-applause',0);if(this.medals.counts[0]===MEDAL_RULES.max){this.itemMessage='Brust voller Orden · Höchsttempo';this.itemMessageUntil=this.items.time+1.6;}}
              else{this.itemMessage=`${event.amount} Orden verloren · Ansehen beschädigt`;this.itemMessageUntil=this.items.time+1.6;}
            } }
          for(const event of this.items.events) if(event.kart===0) {
            const projectile=this.castOf(0).projectileName;
            if(event.kind==='defense-pickup'){this.itemMessage='Abwehrschild erhalten · Z zum Zünden';this.itemMessageUntil=this.items.time+1.6;this.audio.itemEvent('pickup');continue;}
            if(event.kind==='defense-use'){this.itemMessage='Abwehrschild aktiv · ein Treffer wird abgefangen';this.itemMessageUntil=this.items.time+1.6;this.audio.itemEvent('launch');continue;}
            if(event.kind==='near-miss'){this.itemMessage='Knapp vorbei · Präzisionsschub';this.itemMessageUntil=this.items.time+1.2;this.audio.cheer(.22);continue;}
            if(event.kind==='block'){this.itemMessage=event.item==='shield'?'Abwehrschild hat den Treffer abgefangen':'Abgewehrt · Item als Schild verbraucht';this.itemMessageUntil=this.items.time+1.6;this.audio.itemEvent('hit');continue;}
            if(event.item==='boost'){this.itemMessage=event.kind==='pickup'?'Eilerlass erhalten · E = Vorfahrt per Dekret':'Eilerlass · Vorfahrt per Dekret!';this.itemMessageUntil=this.items.time+1.6;if(event.kind==='launch')this.audio.cue('start');else this.audio.itemEvent('pickup');continue;}
            this.itemMessage=event.item==='censor'?(event.kind==='hit'?'Faktenlage amtlich geschwärzt':'FAKTENLAGE ERFOLGREICH GESCHWÄRZT'):event.kind==='pickup'?`${event.item==='trap'?ITEM_NAMES[event.item]:projectile} erhalten`:event.kind==='launch'?(event.item==='trap'?'Falle abgelegt':`${projectile} unterwegs`):'Treffer · kurzzeitig geschützt';
            this.itemMessageUntil=this.items.time+(event.item==='censor'?2.6:1.8);
            if(event.kind==='launch'&&event.item!=='trap'&&event.item!=='censor'&&this.castOf(0).projectile==='dog')this.audio.dogBark();else this.audio.itemEvent(event.kind);
            // Everyone else shouts their own line while throwing their character projectile.
            if(event.kind==='launch'&&event.item!=='trap'&&event.item!=='censor'&&this.castOf(0).projectile!=='dog'&&this.voiceCooldown===0){this.audio.voice(`${this.castOf(0).voice}-horn`,{channel:'driver',rate:this.castOf(0).voiceRate,volume:.8});this.voiceCooldown=6;}
            if(event.kind==='hit')this.say(0,'hit');
          }
          // A nearby rival's dog barks too (Hitler as a bot).
          for(const event of this.items.events) if(event.kind==='launch'&&event.kart!==0&&event.item!=='trap'&&event.item!=='boost'&&event.item!=='censor'&&this.castOf(event.kart).projectile==='dog'&&Math.hypot(all[event.kart].x-this.kart.x,all[event.kart].z-this.kart.z)<30)this.audio.dogBark();
          for(const event of this.items.events) if(event.kind==='hit'&&event.owner===0&&event.kart!==0) {
            this.audio.voice(event.item==='trap'||event.item==='censor'?'announcer-stamp':'announcer-delivery');this.audio.cheer(.5);
            window.setTimeout(()=>this.say(event.kart,'hit',.75),900);
          }
          if(this.mode==='timetrial'){
            if(Math.round(this.raceTime*60)%3===0)this.ghostRecord.push([+this.kart.x.toFixed(2),+this.kart.z.toFixed(2),+this.kart.heading.toFixed(3),+this.kart.height.toFixed(2),+Math.max(0,this.progress[0].distance).toFixed(1)]);
            if(this.ghostRun&&Math.round(this.raceTime*60)%15===0)this.ghostDelta=this.ghostGap();
          }
          if(this.raceTime<5&&this.raceTime+FIXED_STEP>=5&&this.mode!=='timetrial'){
            if(this.mode==='gp'&&this.gp&&this.gp.round===0)this.audio.voice('announcer-gp-intro',{force:true});
            else if(TRACK.id==='duce-drom')this.audio.voice('announcer-rome',{force:true});
            else if(TRACK.id==='havanna')this.audio.voice('announcer-havana',{force:true});
            else if(TRACK.id==='moscow')this.audio.voice('announcer-moscow',{force:true});
            else if(TRACK.id==='beijing')this.audio.voice('announcer-beijing',{force:true});
          }
          this.raceTime += FIXED_STEP;this.voiceCooldown=Math.max(0,this.voiceCooldown-FIXED_STEP);this.leadCooldown=Math.max(0,this.leadCooldown-FIXED_STEP);
          const lapBefore=Math.floor(Math.max(0,this.progress[0].distance)/TRACK.length);
          [this.kart, ...this.loadKarts].forEach((s, i) => advanceRace(this.progress[i], s, this.raceTime));
          const fenceProgress = TRACK_INFO.dressing.breakableFence;
          if (!this.startFenceBroken && this.racePhase === 'race' && fenceProgress !== undefined && [this.kart, ...this.loadKarts].some((kart, i) => this.progress[i].distance < TRACK.length && trackProgressAt(kart.x, kart.z) >= fenceProgress)) {
            this.startFenceBroken = true; this.testScene?.breakStartFence?.();
            this.itemMessage = 'Startzaun durchbrochen · Trümmer am Straßenrand'; this.itemMessageUntil = this.items.time + 3;
          }
          // Early notice (worklist 10.10.2026): the lap-2 event is announced in the last quarter of lap 1.
          if(!this.eventAnnounced&&this.racePhase==='race'&&this.lapTimes.length===0&&this.progress[0].distance>TRACK.length*.75){
            this.eventAnnounced=true;
            const notice:Record<string,string>={havana:'Vorankündigung: Nächste Runde rollt die Malecón-Welle über die Uferstraße',rome:'Vorankündigung: Nächste Runde spricht der Balkon',moscow:'Vorankündigung: Nächste Runde Ehrenparade mit Rückenwind',beijing:'Vorankündigung: Nächste Runde Pflichtjubel-Durchsage',pyongyang:'Vorankündigung: Nächste Runde überfliegt der Propaganda-Zeppelin die Strecke',berlin:'Vorankündigung: Nächste Runde überfliegt der Propaganda-Zeppelin das Stadion'};
            this.itemMessage=notice[TRACK_INFO.theme]??notice.berlin;this.itemMessageUntil=this.items.time+4;this.audio.cue('lap');
          }
          if(Math.floor(this.progress[0].distance/TRACK.length)>lapBefore){
            const elapsed=this.lapTimes.reduce((sum,t)=>sum+t,0);this.lapTimes.push(this.raceTime-elapsed);
            this.lapNotice=`${this.lapTimes.length===2?'LETZTE RUNDE':'RUNDE 2'} · ${this.lapTimes.at(-1)!.toFixed(2)} s`;
            this.lapNoticeUntil=this.raceTime+3;
            if(!this.progress[0].finished){this.testScene?.crowdReact?.('wave');this.audio.cue('lap');this.audio.voice(this.lapTimes.length===2?'announcer-final':'announcer-lap2',{force:true});this.audio.cheer(.6);if(this.lapTimes.length===2)this.audio.setMusicTempo(1.07);}
            if(this.lapTimes.length===1){
              if(TRACK_INFO.theme==='havana'){this.testScene?.trackEvent?.('wave');this.itemMessage='Achtung: Malecón-Welle! Gischt über der Uferstraße';this.audio.cheer(.7);this.waveUntil=this.raceTime+14;window.setTimeout(()=>this.audio.voice('announcer-wave',{force:true}),900);}
              else if(TRACK_INFO.theme==='rome'){this.testScene?.trackEvent?.('balcony');this.itemMessage='Achtung: Balkonrede! Rosenregen über der Prunkstraße';this.audio.cheer(1.1);window.setTimeout(()=>this.audio.voice('announcer-balcony',{force:true}),1400);}
              else if(TRACK_INFO.theme==='moscow'){this.testScene?.trackEvent?.('parade');this.itemMessage='Ehrenparade! Rückenwind auf der Parade-Geraden für alle';this.audio.cheer(1);this.paradeUntil=this.raceTime+15;window.setTimeout(()=>this.audio.voice('announcer-parade',{force:true}),900);}
              else if(TRACK_INFO.theme==='beijing'){this.testScene?.trackEvent?.('loudspeaker');this.itemMessage='Durchsage: Planerfüllung 400 %! Pflichtjubel über der Serpentine';this.audio.cheer(1.2);window.setTimeout(()=>this.audio.voice('announcer-loudspeaker',{force:true}),900);}
              else{this.testScene?.trackEvent?.('zeppelin');this.itemMessage='Achtung: Propaganda-Zeppelin über dem Stadion!';}
              this.itemMessageUntil=this.items.time+3;}
          }
          if (this.afterRace) {
            this.afterRaceTime += FIXED_STEP;
            const allIn = this.progress.every((p) => p.finished);
            if (allIn || this.afterRaceTime > 60) { this.afterRace = false; this.renderFinishResults(); this.presentFinishActions(rankRace(this.progress)); }
            else if (Math.round(this.afterRaceTime * 60) % 30 === 0) this.renderFinishResults();
          }
          if (this.progress[0].finished && this.racePhase !== 'finished') {
            this.racePhase = 'finished'; this.afterRace = this.mode !== 'timetrial'; this.afterRaceTime = 0;
            if(this.lapTimes.length<3)this.lapTimes.push(this.raceTime-this.lapTimes.reduce((sum,t)=>sum+t,0));
            this.audio.cue('finish');this.testScene?.celebrate?.('finish');this.testScene?.crowdReact?.('wave');this.testScene?.crowdReact?.('cheer',0);this.audio.cheer(1.4);
            {const won=rankRace(this.progress).indexOf(0)===0;this.audio.voice(won?'announcer-win':'announcer-finish',{force:true});const champion=rankRace(this.progress)[0];window.setTimeout(()=>this.say(won?0:champion,'win',won?1:.85),1400);}
            const place=rankRace(this.progress).indexOf(0)+1;
            document.querySelector('#finish-kicker')!.textContent=this.mode==='gp'&&this.gp?`GRAND PRIX · RENNEN ${this.gp.round+1}/${this.gp.tracks.length} · ${TRACK.name.toUpperCase()}`:this.mode==='timetrial'?`ZEITFAHREN · ${TRACK.name.toUpperCase()}`:`EINZELRENNEN · ${TRACK.name.toUpperCase()}`;
            document.querySelector('#finish-title')!.textContent = `Platz ${place} · Genehmigung erteilt`;
            document.querySelector('#finish-detail')!.textContent = `Drei Runden · ${this.raceTime.toFixed(2)} s · Runden ${this.lapTimes.map(t=>t.toFixed(2)).join(' / ')} s`;
            this.renderFinishResults();
            const bestKey=this.storageKey(this.mode==='timetrial'?'timetrial':'race');let improved=false;
            let best:number|null=null;try{const value=Number(localStorage.getItem(bestKey));if(value>0&&Number.isFinite(value))best=value;if(!DEMO&&(best===null||this.raceTime<best)){best=this.raceTime;improved=true;localStorage.setItem(bestKey,String(best));}}catch{}
            if(this.mode==='timetrial'&&improved&&!DEMO){try{localStorage.setItem(this.storageKey('ghost'),JSON.stringify({time:this.raceTime,driver:this.chosen,samples:this.ghostRecord,track:TRACK.id,laps:this.lapTimes}));}catch{}}
            let bestLap:number|null=null;
            try{const lap=Math.min(...this.lapTimes);const stored=Number(localStorage.getItem(this.storageKey('lap')));bestLap=stored>0&&Number.isFinite(stored)?stored:null;if(!DEMO&&Number.isFinite(lap)&&(bestLap===null||lap<bestLap)){bestLap=lap;localStorage.setItem(this.storageKey('lap'),String(lap));}}catch{}
            // Time-trial medals by total time on the course (average 15.8 / 14.5 / 13 m/s; hard bots win in ~164 s).
            if(this.mode==='timetrial'){const medal=([[3*TRACK.length/15.8,'Gold'],[3*TRACK.length/14.5,'Silber'],[3*TRACK.length/13,'Bronze']] as [number,string][]).find(([t])=>this.raceTime<=t);
              document.querySelector('#finish-detail')!.textContent+=` · ${medal?`Medaille ${medal[1]}`:`Bronze ab ${(3*TRACK.length/13).toFixed(0)} s`}`;}
            if(this.mode==='timetrial')document.querySelector('#finish-title')!.textContent=improved?'Neue Bestzeit · Geist gespeichert':`Zeitfahren · ${this.ghostRun?`Geist ${this.ghostRun.time.toFixed(2)} s`:'beendet'}`;
            document.querySelector('#finish-best')!.textContent=`Stand bei deiner Zielankunft${best!==null?` · Bestzeit ${TRACK.name} ${best.toFixed(2)} s`:''}${bestLap!==null?` · Beste Runde ${bestLap.toFixed(2)} s`:''}${DEMO?' · Demonstrationsfahrt':''}`;
            if (!this.afterRace) this.presentFinishActions(rankRace(this.progress)); else this.presentPendingFinish();
            document.querySelector('#finish-card')!.removeAttribute('hidden');
          }
        }
        }
        if (!LAB_WORLD && (this.racePhase !== 'finished' || this.afterRace)) {
          // Boost pads: a short turbo for whoever drives over the glowing chevrons.
          { const allKarts=[this.kart,...this.loadKarts];
            allKarts.forEach((k,i)=>{this.padCooldown[i]=Math.max(0,(this.padCooldown[i]??0)-FIXED_STEP);
              if(this.padCooldown[i]===0&&k.grounded&&boostPadAt(k.x,k.z)>=0){allKarts[i]={...k,turboRemaining:Math.max(k.turboRemaining,KART_TUNING.turboDuration),speed:Math.min(KART_TUNING.maxTurboSpeed,Math.max(k.speed,0)+KART_TUNING.turboSpeedBonus)};this.padCooldown[i]=1.2;if(i===0)this.audio.cue('start');}});
            this.kart=allKarts[0];this.loadKarts=allKarts.slice(1); }
          // Slipstream: close behind a rival for 1 s at speed earns a short pull (same rule for bots).
          { const allKarts=[this.kart,...this.loadKarts];
            allKarts.forEach((k,i)=>{ if(k.speed<10||!k.grounded){this.draft[i]=0;return;}
              const fx=Math.sin(k.heading),fz=Math.cos(k.heading);
              const behind=allKarts.some((o,j)=>{if(j===i)return false;const dx=o.x-k.x,dz=o.z-k.z,ahead=dx*fx+dz*fz,side=Math.abs(dx*fz-dz*fx);return ahead>2.5&&ahead<13&&side<1.7;});
              this.draft[i]=behind?(this.draft[i]??0)+FIXED_STEP:0;
              if(this.draft[i]>=1){this.draft[i]=-1.5;allKarts[i]={...k,turboRemaining:Math.max(k.turboRemaining,.55),speed:Math.min(KART_TUNING.maxTurboSpeed,k.speed+2)};if(i===0){this.itemMessage='Windschatten · Schub!';this.itemMessageUntil=this.items.time+1.2;}}
            });
            this.kart=allKarts[0];this.loadKarts=allKarts.slice(1); }
          // Ramp: launch from the lip into a flight that scales with speed; a clean landing earns a short boost.
          { const allKarts=[this.kart,...this.loadKarts];
            { const s=trackProgressOf(this.kart),inZone=RAMP_LIPS.some((lip)=>s>lip-RAMP_LENGTH-12&&s<lip+1.5),jumping=(this.kart.jumpRemaining??0)>0,space=this.input.isDown('hopDrift');
              if(space&&(inZone||jumping))this.rampHold=true;
              else if(this.rampHold&&!space){this.rampHold=false;if(inZone||jumping)this.rampTrickQueued=true;}
              if(!inZone&&!jumping&&!space){this.rampHold=false;this.rampTrickQueued=false;} }
            allKarts.forEach((k,i)=>{
              // A hop on the ramp no longer cancels the launch: the lip always takes the kart into the air.
              if((k.jumpRemaining??0)===0&&k.speed>3&&atRampLip(k.x,k.z)&&k.height<1.2){const v=k.speed;allKarts[i]={...k,hopRemaining:0,jumpRemaining:.45+v*.034,jumpDuration:.45+v*.034,jumpStart:1,jumpPeak:.7+v*.05,drifting:false,driftCharge:0};if(i===0)this.audio.cue('start');}
              // Trick: Space in the air (player) or a confident bot spins the kart for a bigger landing boost.
              if(i===0&&this.rampTrickQueued&&(allKarts[0].jumpRemaining??0)>.05&&!allKarts[0].trick){allKarts[0]={...allKarts[0],trick:true};this.rampTrickQueued=false;}
              if((k.jumpRemaining??0)>.15&&!k.trick&&((i===0&&frame.pressed.has('hopDrift'))||(i>0&&(k.jumpRemaining??0)<(k.jumpDuration??1)-.2&&i%2===1)))allKarts[i]={...allKarts[i],trick:true};
              if(k.landedClean){const trick=!!k.trick;allKarts[i]={...k,trick:false,landedClean:false,turboRemaining:Math.max(k.turboRemaining,trick?1.1:.7),speed:Math.min(KART_TUNING.maxTurboSpeed,k.speed+(trick?3.6:2.5))};if(i===0){this.itemMessage=trick?'Trick gestanden · Großer Schub!':'Saubere Landung · Schub!';this.itemMessageUntil=this.items.time+1.4;this.audio.cheer(trick?1:.6);}}
              else if(k.trick&&(k.jumpRemaining??0)===0)allKarts[i]={...allKarts[i],trick:false};
            });
            this.kart=allKarts[0];this.loadKarts=allKarts.slice(1); }
          // Shell craters: a jolt on entry and loose-dirt drag while crossing (same for everyone).
          { const allKarts=[this.kart,...this.loadKarts];
            allKarts.forEach((k,i)=>{ if(!k.grounded||craterAt(k.x,k.z)<0){this.inCrater[i]=false;return;}
              allKarts[i]={...k,speed:k.speed*(1-1.5*FIXED_STEP),suspensionVelocity:this.inCrater[i]?k.suspensionVelocity:k.suspensionVelocity-1.4,drifting:false,driftCharge:0};
              if(!this.inCrater[i]){this.testScene?.craterHit?.(i);if(i===0)this.audio.itemEvent('hit');} this.inCrater[i]=true;
              if(shouldStartCraterFall(k.x,k.z,k.grounded,this.salvage[i]??0)){this.salvage[i]=3.2;this.testScene?.splash?.(i,'crater');loseMedals(this.medals,i,MEDAL_RULES.lossOnFall);
                if(i===0){this.itemMessage='Granattrichter · Das Staatliche Bergungsamt zieht dich heraus';this.itemMessageUntil=this.items.time+3.2;this.audio.itemEvent('hit');}}
            });
            this.kart=allKarts[0];this.loadKarts=allKarts.slice(1); }
          // Harbour: a kart past the open quay sinks, the state salvage crane lifts it back at the same progress.
          const all=[this.kart,...this.loadKarts];
          all.forEach((k,i)=>{
            if((this.salvage[i]??0)>0){
              this.salvage[i]=Math.max(0,this.salvage[i]-FIXED_STEP);this.recoveryRemaining[i]=Math.max(this.recoveryRemaining[i],FIXED_STEP*2);
              if(this.salvage[i]===0){all[i]=recoverKart(k,all);this.recoveryRemaining[i]=0;this.testScene?.salvaged?.(i);}
            } else if(hazardAt(k.x,k.z)||(overCanal(k.x,k.z)&&(k.jumpRemaining??0)===0&&k.height<.05)){
              const kind=hazardAt(k.x,k.z)??'water';this.salvage[i]=3.2;this.testScene?.splash?.(i,kind);loseMedals(this.medals,i,MEDAL_RULES.lossOnFall);
              if(i===0||Math.hypot(k.x-this.kart.x,k.z-this.kart.z)<40){this.audio.itemEvent('hit');this.audio.cheer(.7);}
              if(i===0){this.itemMessage=kind==='cliff'?'Absturz! Das Staatliche Bergungsamt seilt sich ab':kind==='lava'?'In den Staatsofen! Das Staatliche Bergungsamt rückt an':'Ins Hafenbecken! Das Staatliche Bergungsamt rückt an';this.itemMessageUntil=this.items.time+3;}
            }
          });
          this.kart=all[0];this.loadKarts=all.slice(1);this.testScene?.setSalvage?.(this.salvage);
        }
        if (!LAB_WORLD && (this.racePhase === 'race' || this.racePhase === 'practice' || this.afterRace)) {
          // Cumulative damage from this step's contacts, crashes and item hits; a wreck waits for the state workshop.
          stepDamage(this.damage,[this.previousKart,...this.previousLoadKarts],[this.kart,...this.loadKarts],FIXED_STEP);
          for(const event of this.damage.events){
            if(event.kind==='repaired'){if(event.kart===0){this.itemMessage='Repariert · Staatliche Werkstatt stempelt ab';this.itemMessageUntil=this.items.time+2;}continue;}
            if(event.kind!=='wreck')continue;
            this.recoveryRemaining[event.kart]=DAMAGE_RULES.wreckDuration;this.testScene?.wreck?.(event.kart);this.react(event.kart,'angry',true);loseMedals(this.medals,event.kart,MEDAL_RULES.lossOnWreck);
            const at=[this.kart,...this.loadKarts][event.kart],near=Math.hypot(at.x-this.kart.x,at.z-this.kart.z)<40;
            if(event.kart===0||near){this.audio.itemEvent('hit');this.audio.thunder();this.audio.cheer(.9);}
            if(event.kart===0){this.itemMessage='Totalschaden! Die Staatliche Werkstatt rückt an';this.itemMessageUntil=this.items.time+3;}
            else if(near){this.itemMessage=`${this.castOf(event.kart).name}: Totalschaden!`;this.itemMessageUntil=this.items.time+2;}
          }
        }
        this.queuedHopPress = false;
        this.accumulator -= FIXED_STEP;
      }
      const alpha = this.accumulator / FIXED_STEP;
      this.renderKart = interpolateKart(this.previousKart, this.kart, alpha);
      const renderBots = this.loadKarts.map((kart,i) => interpolateKart(this.previousLoadKarts[i] ?? kart, kart, alpha));
      if (!LAB_WORLD) { const progress = Math.max(0, this.progress[0]?.distance ?? 0) / (3 * TRACK.length);
        this.testScene.setTimeOfDay?.(this.racePhase === 'practice' ? (new URLSearchParams(location.search).get('night') === '1' ? 1 : 0) : this.dayToNight ? Math.max(0, Math.min(1, (progress - .2) / .65)) : 0); }
      this.testScene.setKimPolish?.(this.racePhase==='finished'?[]:this.abilities.kimPolishRemaining);
      this.testScene.present(this.renderKart, renderBots);
      if (this.mode === 'timetrial' && this.ghostRun && this.racePhase !== 'practice') {
        const f = Math.min(this.ghostRun.samples.length - 1, Math.max(0, this.raceTime * 20)), a = this.ghostRun.samples[Math.floor(f)], b = this.ghostRun.samples[Math.min(this.ghostRun.samples.length - 1, Math.floor(f) + 1)], u = f - Math.floor(f);
        if (a && b) this.testScene.setGhost?.({ x: a[0] + (b[0] - a[0]) * u, z: a[1] + (b[1] - a[1]) * u, heading: a[2] + Math.atan2(Math.sin(b[2] - a[2]), Math.cos(b[2] - a[2])) * u, height: a[3] });
      }
      this.testScene.presentItems?.(this.items,[this.renderKart,...renderBots]);
      this.testScene.presentMedals?.(this.racePhase==='practice'?[]:this.medals.medals);
      this.camera?.update(this.renderKart, delta, false, frame.steering);
      this.testScene.setPlayerVisible(this.camera?.viewName !== 'Fahrerperspektive');
      this.updateRaceHud();
      this.commentary();
      if (!LAB_WORLD) { const leader = rankRace(this.progress)[0]; this.testScene.broadcast?.(leader, this.racePhase === 'practice' ? `STAATSFERNSEHEN · Freies Training · ${{ sun: 'Sonnenschein genehmigt', rain: 'Regen angeordnet', snow: 'Schneefall verordnet' }[this.weather]}` : `FÜHRUNG: ${this.castOf(leader).name.toUpperCase()} · RUNDE ${Math.min(3, 1 + Math.floor(Math.max(0, this.progress[leader].distance) / TRACK.length))}/3`); }
      speedDisplay.textContent = `${Math.round(Math.abs(this.kart.speed) * 3.6)} km/h${this.kart.speed < 0 ? ' rückwärts' : ''}`;
      { const el=document.querySelector<HTMLElement>('#medal-count'); if(el){const n=this.medals.counts[0]??0;el.querySelector('.medal-total')!.textContent=`${'✪'.repeat(n)}${'·'.repeat(MEDAL_RULES.max-n)} ${n}/${MEDAL_RULES.max} Orden`;el.querySelector('.medal-bonus')!.textContent=n?`+${Math.round(n*MEDAL_RULES.topSpeedPerMedal*3.6)} km/h Spitze`:'Sammeln erhöht dein Spitzentempo';el.hidden=this.racePhase==='practice';el.classList.toggle('full',n===MEDAL_RULES.max);} }
      { const health=Math.round(this.damage.health[0]),meter=document.querySelector<HTMLElement>('#health')!;
        meter.classList.toggle('worn',health<66);meter.classList.toggle('critical',health<33);meter.classList.toggle('wrecked',this.damage.wrecked[0]>0);meter.classList.toggle('shown',this.racePhase==='practice');
        meter.setAttribute('aria-valuenow',String(health));meter.setAttribute('aria-valuetext',health===0?'Totalschaden':`${health} Prozent Fahrzeugzustand`);
        document.querySelector<HTMLElement>('#health-fill')!.style.width=`${health}%`;document.querySelector('#health-value')!.textContent=`${health} %`;
        this.testScene.setDamage?.(this.damage.health,this.damage.wrecked); }
      modeDisplay.textContent = this.damage.wrecked[0]>0 ? `Totalschaden · Staatliche Werkstatt ${this.damage.wrecked[0].toFixed(1)} s` : this.recoveryRemaining[0]>0 ? `Rücksetzung · ${this.recoveryRemaining[0].toFixed(1)} s`
        : this.kart.impactRemaining > 0
        ? this.kart.impactKind === 'item' ? 'Posttreffer – Kart fängt sich' : this.kart.impactKind === 'kart' ? 'Fahrzeugkontakt – Kart fängt sich'
          : this.kart.impactKind === 'obstacle' ? 'Hinderniskontakt – Kart fängt sich' : 'Randkontakt – Kart fängt sich'
        : this.kart.turboRemaining > 0
        ? `Mini-Turbo ${this.kart.turboRemaining.toFixed(1)} s`
        : this.kart.drifting
          ? driftTier(this.kart.driftCharge) > 0
            ? `Drift Stufe ${driftTier(this.kart.driftCharge)}${driftTier(this.kart.driftCharge) === 3 ? ' (voll)' : ''} – Space loslassen`
            : `Drift lädt ${Math.round(this.kart.driftCharge / KART_TUNING.driftTiers[0] * 100)} %`
          : this.kart.height > 0 ? 'Hop' : 'Bereit';
      const maximumContact = Math.max(...this.kart.wheelGroundHeights);
      // The lab test area has no circuit surfaces; only the main track maps gravel and grass.
      const surface = LAB_WORLD ? 'cobble' : drivingSurfaceAt(this.kart.x,this.kart.z);
      surfaceDisplay.textContent = surface === 'gravel' ? 'Schotter · loser Untergrund' : surface === 'grass' ? 'Gras · weniger Grip' : this.kart.grounded && maximumContact > 0.02
        ? `Bodenwelle · Radkontakt ${Math.round(maximumContact * 100)} cm`
        : this.kart.grounded && Math.abs(this.kart.suspensionOffset) > 0.012
          ? 'Federung schwingt aus' : 'Ebener Boden';
    }
    if(this.camera?.photoMode||this.camera?.introMode) this.camera.update(this.camera.introMode&&!this.selecting&&!this.selectingTrack&&this.racePhase!=='finished'?this.menuFocus():this.selecting?this.presentationFocus():this.renderKart, Math.min((this.engine?.getDeltaTime()??16)/1000,.1));
    if (!LAB_WORLD) {
      const stand = trackPoint(TRACK.start + 20), nearness = Math.max(0, 1 - Math.hypot(this.kart.x - stand.x, this.kart.z - stand.z) / 70);
      const rollSurface = LAB_WORLD ? 'cobble' : overCanal(this.kart.x, this.kart.z) || hazardAt(this.kart.x, this.kart.z) === 'water' ? 'water' : drivingSurfaceAt(this.kart.x, this.kart.z);
      this.audio.update(this.kart, this.state === 'running' && this.racePhase !== 'countdown' && this.racePhase !== 'finished', nearness, rollSurface);
    }
    // Performance 10.10.2026: menus, driver/track selection and the pause screen only need ~30/15 frames per second;
    // the race itself always renders every frame. Skipped frames hand their time to the next render, so particles,
    // crowd and animations keep their real speed.
    // While the automatic quality choice still samples frame times, every frame renders.
    // Behind other windows (no keyboard focus) menus and pause drop to 10 frames per second.
    const idle = (this.camera?.introMode || this.selecting || this.selectingTrack) ? 32 : this.state === 'paused' && !this.camera?.photoMode ? 66 : 0;
    const calm = this.autoQuality || !idle ? 0 : document.hasFocus() ? idle : 100;
    const sinceRender = now - this.lastRenderAt;
    if (this.testScene && calm && sinceRender < calm - 4) return;
    if (this.engine && this.lastRenderAt > 0 && sinceRender < 200 && sinceRender > this.engine.getDeltaTime() + 1) (this.engine as unknown as { _deltaTime: number })._deltaTime = sinceRender;
    this.lastRenderAt = now;
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
    this.detachItemButton();
    this.audio.dispose();
    this.testScene?.scene.dispose();
    this.engine?.stopRenderLoop();
    this.engine?.dispose();
  }
}

new App();
