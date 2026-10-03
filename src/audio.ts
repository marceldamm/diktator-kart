import type { KartState } from './kart-model';

/** Original pre-rendered WAVs. Browser gesture unlock and one shared audio graph. */
export class KartAudio {
  private context?: AudioContext;
  private engine?: AudioBufferSourceNode;
  private engineGain?: GainNode;
  private tireGain?: GainNode;
  private master?: GainNode;
  private impact?: AudioBuffer;
  private boost?: AudioBuffer;
  private lastImpact = false;
  private lastBoost = false;
  private loading = false;
  private readonly music = new Audio('/assets/audio/fig-leaf-rag.mp3');
  enabled = true;
  constructor() { this.music.loop = true; this.music.volume = .14; }

  async unlock(): Promise<void> {
    if (this.enabled && this.music.paused) void this.music.play().catch(() => { /* A new browser gesture can retry. */ });
    if (this.context) { await this.context.resume(); return; }
    if (this.loading) return; this.loading = true;
    try {
      const context = new AudioContext(); this.context = context;
      const load = async (name: string) => context.decodeAudioData(await (await fetch(`/assets/audio/${name}.wav`)).arrayBuffer());
      const [motor, tire, impact, boost] = await Promise.all(['motor', 'tire', 'impact', 'boost'].map(load));
      this.impact = impact; this.boost = boost; this.master = context.createGain(); this.master.gain.value = this.enabled ? .35 : 0; this.master.connect(context.destination);
      for (const [buffer, kind] of [[motor, 'engine'], [tire, 'tire']] as const) {
        const source = context.createBufferSource(), gain = context.createGain(); source.buffer = buffer; source.loop = true; gain.gain.value = 0;
        source.connect(gain); gain.connect(this.master); source.start();
        if (kind === 'engine') { this.engine = source; this.engineGain = gain; } else { this.tireGain = gain; }
      }
    } catch (error) { console.warn('Audio unavailable', error); }
  }
  setEnabled(enabled: boolean): void { this.enabled = enabled; this.music.muted = !enabled; if (this.master) this.master.gain.value = enabled ? .35 : 0; }
  update(state: KartState, running: boolean): void {
    this.music.volume = running ? .14 : .065;
    if (!this.context || !this.engine || !this.engineGain || !this.tireGain) return;
    const t = this.context.currentTime;
    this.engine.playbackRate.setTargetAtTime(.7 + Math.abs(state.speed) * .055, t, .08);
    this.engineGain.gain.setTargetAtTime(running ? .14 + Math.abs(state.speed) * .018 : 0, t, .1);
    this.tireGain.gain.setTargetAtTime(running && state.drifting ? .28 : 0, t, .08);
    const impact = state.impactRemaining > 0, boost = state.turboRemaining > 0;
    if (running && impact && !this.lastImpact) this.play(this.impact, .65);
    if (running && boost && !this.lastBoost) this.play(this.boost, .45);
    this.lastImpact = impact; this.lastBoost = boost;
  }
  private play(buffer: AudioBuffer | undefined, volume: number): void {
    if (!buffer || !this.context || !this.master) return;
    const source = this.context.createBufferSource(), gain = this.context.createGain(); source.buffer = buffer; gain.gain.value = volume;
    source.connect(gain); gain.connect(this.master); source.onended = () => { source.disconnect(); gain.disconnect(); }; source.start();
  }
}
