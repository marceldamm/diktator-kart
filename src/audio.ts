import type { KartState } from './kart-model';

/** Gear bands in m/s for the virtual gearbox that shapes the engine note. */
const GEARS = [0, 4.2, 8, 11.8, 15.2, 22];

/** Original pre-rendered WAVs and Piper voice lines. Browser gesture unlock and one shared audio graph. */
export class KartAudio {
  private context?: AudioContext;
  private engine?: AudioBufferSourceNode;
  private engineGain?: GainNode;
  private tireGain?: GainNode;
  private scrapeGain?: GainNode;
  private crowdGain?: GainNode;
  private master?: GainNode;
  private announcerBus?: AudioNode;
  private driverBus?: AudioNode;
  private impact?: AudioBuffer;
  private boost?: AudioBuffer;
  private pickup?:AudioBuffer;
  private launch?:AudioBuffer;
  private lastImpact = false;
  private lastBoost = false;
  private lastAirborne=false;
  private lastGear = 0;
  private shiftDip = 0;
  private crowdSwell = 0;
  private duck = 0;
  private readonly cues=new Map<string,AudioBuffer>();
  private readonly voices=new Map<string,AudioBuffer>();
  private readonly busyUntil = { announcer: 0, driver: 0 };
  /** Diagnostics: loaded voice lines and the ids actually played this session. */
  readonly spoken: string[] = [];
  get voiceCount(): number { return this.voices.size; }
  private loading = false;
  private readonly music = new Audio('/assets/audio/fig-leaf-rag.mp3');
  private musicVolume=.14;
  enabled = true;
  constructor() { this.music.loop = true; this.music.volume = .14; }

  async unlock(): Promise<void> {
    if(!this.enabled)return;
    if (this.enabled && this.music.paused) void this.music.play().catch(() => { /* A new browser gesture can retry. */ });
    if (this.context) { await this.context.resume(); return; }
    if (this.loading) return; this.loading = true;
    try {
      const context = new AudioContext(); this.context = context;
      const load = async (name: string) => context.decodeAudioData(await (await fetch(`/assets/audio/${name}.wav`)).arrayBuffer());
      const [motor, tire, impact, boost,pickup,launch,scrape,crowd] = await Promise.all(['motor', 'tire', 'impact', 'boost','pickup','launch','scrape','crowd'].map(load));
      this.pickup=pickup;this.launch=launch;
      const names=['countdown','start','lap','finish','hop','land'];
      const cues=await Promise.all(names.map(load));names.forEach((n,i)=>this.cues.set(n,cues[i]));
      this.impact = impact; this.boost = boost; this.master = context.createGain(); this.master.gain.value = this.enabled ? .35 : 0; this.master.connect(context.destination);
      this.buildBuses(context, this.master);
      for (const [buffer, kind] of [[motor, 'engine'], [tire, 'tire'], [scrape, 'scrape'], [crowd, 'crowd']] as const) {
        const source = context.createBufferSource(), gain = context.createGain(); source.buffer = buffer; source.loop = true; gain.gain.value = 0;
        source.connect(gain); gain.connect(this.master); source.start();
        if (kind === 'engine') { this.engine = source; this.engineGain = gain; } else if (kind === 'tire') this.tireGain = gain;
        else if (kind === 'scrape') this.scrapeGain = gain; else this.crowdGain = gain;
      }
      // Voice lines stream in after the effects; a missing line is simply skipped.
      void fetch('/assets/audio/voice/lines.json').then((r) => r.json()).then(async (lines: Record<string, unknown>) => {
        for (const id of Object.keys(lines)) {
          try { this.voices.set(id, await context.decodeAudioData(await (await fetch(`/assets/audio/voice/${id}.wav`)).arrayBuffer())); } catch { /* optional */ }
        }
      }).catch(() => { /* Voices are optional. */ });
    } catch (error) { console.warn('Audio unavailable', error); }
  }

  /** Stadium PA for the announcer (band-limited, light drive, hall and slapback); a small room for drivers. */
  private buildBuses(context: AudioContext, master: GainNode): void {
    const hall = context.createConvolver(), length = Math.round(context.sampleRate * 2.4);
    const impulse = context.createBuffer(2, length, context.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3.2) * (i < 240 ? i / 240 : 1);
    }
    hall.buffer = impulse;
    const hallReturn = context.createGain(); hallReturn.gain.value = .32; hall.connect(hallReturn); hallReturn.connect(master);
    const high = context.createBiquadFilter(); high.type = 'highpass'; high.frequency.value = 320;
    const low = context.createBiquadFilter(); low.type = 'lowpass'; low.frequency.value = 3800;
    const drive = context.createWaveShaper(); const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) { const x = i / 127.5 - 1; curve[i] = Math.tanh(x * 1.8) / Math.tanh(1.8); }
    drive.curve = curve;
    const pa = context.createGain(); pa.gain.value = 1.35;
    const slap = context.createDelay(); slap.delayTime.value = .17; const slapGain = context.createGain(); slapGain.gain.value = .22;
    high.connect(low); low.connect(drive); drive.connect(pa); pa.connect(master); pa.connect(hall); pa.connect(slap); slap.connect(slapGain); slapGain.connect(master);
    this.announcerBus = high;
    const room = context.createGain(); room.gain.value = 1.15; const roomSend = context.createGain(); roomSend.gain.value = .12;
    room.connect(master); room.connect(roomSend); roomSend.connect(hall);
    this.driverBus = room;
  }

  /** Plays a voice line unless its channel is busy (or forced). Rate gives each caricature its own register. */
  voice(id: string, options: { channel?: 'announcer' | 'driver'; rate?: number; volume?: number; force?: boolean } = {}): boolean {
    const buffer = this.voices.get(id), channel = options.channel ?? 'announcer';
    if (!buffer || !this.context || !this.enabled) return false;
    const now = this.context.currentTime;
    if (!options.force && now < this.busyUntil[channel]) return false;
    const source = this.context.createBufferSource(), gain = this.context.createGain();
    source.buffer = buffer; source.playbackRate.value = options.rate ?? 1; gain.gain.value = options.volume ?? 1;
    source.connect(gain); gain.connect(channel === 'announcer' ? this.announcerBus! : this.driverBus!);
    source.onended = () => { source.disconnect(); gain.disconnect(); }; source.start();
    if (this.spoken.length < 200) this.spoken.push(id);
    const duration = buffer.duration / (options.rate ?? 1);
    this.busyUntil[channel] = now + duration + .25;
    if (channel === 'announcer') this.duck = Math.max(this.duck, duration);
    return true;
  }
  /** Lifts the crowd bed for a moment (lead change, finish, big hits). */
  cheer(amount = 1): void { this.crowdSwell = Math.max(this.crowdSwell, amount); }

  setEnabled(enabled: boolean): void { this.enabled = enabled; this.music.muted = !enabled; if (this.master) this.master.gain.value = enabled ? .35 : 0; }
  setMusicVolume(volume:number):void {this.musicVolume=Math.max(0,Math.min(1,volume));this.music.volume=this.musicVolume;}
  itemEvent(kind:'pickup'|'launch'|'hit'):void { this.play(kind==='pickup'?this.pickup:kind==='launch'?this.launch:this.impact,.65); }
  cue(kind:'countdown'|'start'|'lap'|'finish'):void { this.play(this.cues.get(kind),.65); }
  dispose():void {this.music.pause();this.music.src='';void this.context?.close();this.context=undefined;}
  /** crowdNearness 0..1: how close the player is to the grandstands. */
  update(state: KartState, running: boolean, crowdNearness = 0): void {
    const dt = 1 / 60;
    this.duck = Math.max(0, this.duck - dt); this.crowdSwell = Math.max(0, this.crowdSwell - dt * .45);
    this.music.volume = (running ? this.musicVolume : this.musicVolume*.46) * (this.duck > 0 ? .45 : 1);
    if (!this.context || !this.engine || !this.engineGain || !this.tireGain) return;
    const t = this.context.currentTime, speed = Math.abs(state.speed);
    // Virtual gearbox: revs climb through each band and drop briefly on every upshift.
    let gear = 0; while (gear < GEARS.length - 2 && speed > GEARS[gear + 1]) gear++;
    const band = (speed - GEARS[gear]) / (GEARS[gear + 1] - GEARS[gear]);
    if (gear > this.lastGear) this.shiftDip = .16;
    this.lastGear = gear; this.shiftDip = Math.max(0, this.shiftDip - dt);
    const turbo = state.turboRemaining > 0 ? .12 : 0;
    const rate = .62 + Math.min(1, band) * .58 + gear * .05 + turbo - this.shiftDip * 1.6;
    this.engine.playbackRate.setTargetAtTime(Math.max(.5, rate), t, this.shiftDip > 0 ? .02 : .06);
    this.engineGain.gain.setTargetAtTime(running ? (.13 + Math.min(1, band) * .07 + gear * .012) * (this.shiftDip > 0 ? .7 : 1) : 0, t, .08);
    this.tireGain.gain.setTargetAtTime(running && state.drifting ? .28 : 0, t, .08);
    this.scrapeGain?.gain.setTargetAtTime(running && state.scrapeRemaining > 0 && speed > 2 ? .2 + Math.min(.25, speed * .015) : 0, t, .04);
    this.crowdGain?.gain.setTargetAtTime(running ? (.035 + crowdNearness * .16 + this.crowdSwell * .22) * (this.duck > 0 ? .7 : 1) : .02, t, .3);
    const impact = state.impactRemaining > 0, boost = state.turboRemaining > 0;
    if (running && impact && !this.lastImpact) this.play(this.impact, .65);
    if (running && boost && !this.lastBoost) this.play(this.boost, .45);
    const airborne=state.height>.03;
    if(running&&airborne&&!this.lastAirborne)this.play(this.cues.get('hop'),.6);
    if(running&&!airborne&&this.lastAirborne)this.play(this.cues.get('land'),.6);
    this.lastAirborne=airborne;
    this.lastImpact = impact; this.lastBoost = boost;
  }
  private play(buffer: AudioBuffer | undefined, volume: number): void {
    if (!buffer || !this.context || !this.master) return;
    const source = this.context.createBufferSource(), gain = this.context.createGain(); source.buffer = buffer; gain.gain.value = volume;
    source.connect(gain); gain.connect(this.master); source.onended = () => { source.disconnect(); gain.disconnect(); }; source.start();
  }
}
