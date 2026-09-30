import type { KartDebugSnapshot } from './kart';

/** Local synthesis; no downloads or network requests during a race. */
export class DrivingAudio {
    private context: AudioContext | null = null;
    private bus: GainNode | null = null;
    private musicBus: GainNode | null = null;
    private engine: OscillatorNode | null = null;
    private engineHarmonic: OscillatorNode | null = null;
    private engineGain: GainNode | null = null;
    private harmonicGain: GainNode | null = null;
    private tireGain: GainNode | null = null;
    private windGain: GainNode | null = null;
    private tireFilter: BiquadFilterNode | null = null;
    private windFilter: BiquadFilterNode | null = null;
    private volume = 0.68;
    private stage = 0;
    private boosting = false;
    private musicVolume = 0.56;
    private musicStep = 0;
    private nextMusicTime = 0;
    private musicWasRacing = false;

    unlock(): void {
        if (!this.context) {
            const context = new AudioContext();
            this.context = context;
            this.bus = context.createGain();
            this.bus.gain.value = this.volume;
            this.bus.connect(context.destination);
            this.musicBus = context.createGain();
            this.musicBus.gain.value = 0;
            this.musicBus.connect(context.destination);
            this.engineGain = context.createGain();
            this.engineGain.gain.value = 0;
            this.engineGain.connect(this.bus);
            this.engine = context.createOscillator();
            this.engine.type = 'triangle';
            this.engine.connect(this.engineGain);
            this.engine.start();
            this.harmonicGain = context.createGain();
            this.harmonicGain.gain.value = 0.12;
            this.harmonicGain.connect(this.bus);
            this.engineHarmonic = context.createOscillator();
            this.engineHarmonic.type = 'sawtooth';
            this.engineHarmonic.connect(this.harmonicGain);
            this.engineHarmonic.start();

            const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
            const noise = noiseBuffer.getChannelData(0);
            for (let index = 0; index < noise.length; index += 1) noise[index] = Math.random() * 2 - 1;
            const noiseSource = context.createBufferSource();
            noiseSource.buffer = noiseBuffer;
            noiseSource.loop = true;
            this.tireFilter = context.createBiquadFilter();
            this.tireFilter.type = 'bandpass';
            this.tireFilter.frequency.value = 1100;
            this.tireFilter.Q.value = 0.7;
            this.tireGain = context.createGain();
            this.tireGain.gain.value = 0;
            noiseSource.connect(this.tireFilter);
            this.tireFilter.connect(this.tireGain);
            this.tireGain.connect(this.bus);
            noiseSource.start();

            const windSource = context.createBufferSource();
            windSource.buffer = noiseBuffer;
            windSource.loop = true;
            this.windFilter = context.createBiquadFilter();
            this.windFilter.type = 'lowpass';
            this.windFilter.frequency.value = 500;
            this.windGain = context.createGain();
            this.windGain.gain.value = 0;
            windSource.connect(this.windFilter);
            this.windFilter.connect(this.windGain);
            this.windGain.connect(this.bus);
            windSource.start();
        }
        void this.context.resume().catch(() => {
            // Muted or blocked audio must not prevent racing.
        });
    }

    setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.bus && this.context) this.bus.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.03);
    }

    setMusicVolume(volume: number): void {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicBus && this.context) {
            this.musicBus.gain.setTargetAtTime(
                this.musicWasRacing ? this.musicVolume : 0,
                this.context.currentTime,
                0.08
            );
        }
    }

    setPaused(paused: boolean): void {
        if (!this.context) return;
        void (paused ? this.context.suspend() : this.context.resume()).catch(() => {
            // Audio failures are nonfatal.
        });
    }

    playEvent(cue: string): void {
        const context = this.context;
        const bus = this.bus;
        if (!context || !bus || context.state !== 'running') return;
        const impact = cue === 'hit';
        const shield = cue === 'shielded' || cue === 'immunity';
        const pickup = cue === 'pickup';
        const startFrequency = impact ? 145 : shield ? 720 : pickup ? 620 : cue.includes('rocket') ? 250 : 430;
        const endFrequency = impact ? 62 : shield ? 1160 : pickup ? 1240 : cue.includes('rocket') ? 820 : 690;
        const duration = impact ? 0.24 : 0.18;
        const now = context.currentTime;
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        oscillator.type = impact ? 'triangle' : pickup || shield ? 'sine' : 'square';
        oscillator.frequency.setValueAtTime(startFrequency, now);
        oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
        envelope.gain.setValueAtTime(0.0001, now);
        envelope.gain.exponentialRampToValueAtTime(impact ? 0.19 : 0.09, now + 0.012);
        envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        oscillator.connect(envelope);
        envelope.connect(bus);
        oscillator.onended = () => {
            oscillator.disconnect();
            envelope.disconnect();
        };
        oscillator.start(now);
        oscillator.stop(now + duration);
        if (pickup || shield) this.chirp(endFrequency * 1.25, 0.12);
    }

    reset(): void {
        this.stage = 0;
        this.boosting = false;
        this.musicWasRacing = false;
        this.musicStep = 0;
        this.nextMusicTime = 0;
        if (this.context) {
            const now = this.context.currentTime;
            this.engineGain?.gain.setTargetAtTime(0, now, 0.02);
            this.harmonicGain?.gain.setTargetAtTime(0, now, 0.02);
            this.tireGain?.gain.setTargetAtTime(0, now, 0.02);
            this.windGain?.gain.setTargetAtTime(0, now, 0.02);
            this.musicBus?.gain.setTargetAtTime(0, now, 0.08);
        }
    }

    update(snapshot: KartDebugSnapshot, stage: number, racing: boolean, finalLap = false): void {
        if (!this.context || !this.engine || !this.engineGain || !this.engineHarmonic) return;
        const now = this.context.currentTime;
        this.updateMusic(racing, finalLap, now);
        const speedRatio = Math.min(1, snapshot.planarSpeed / 32);
        const throttle = Math.max(0, snapshot.inputY);
        const rpm = 38 + snapshot.planarSpeed * 5.3 + throttle * 28 + (snapshot.boostActive ? 24 : 0);
        this.engine.frequency.setTargetAtTime(rpm, now, 0.045);
        this.engineHarmonic.frequency.setTargetAtTime(rpm * 2.01, now, 0.055);
        this.engineGain.gain.setTargetAtTime(racing ? 0.035 + speedRatio * 0.045 + throttle * 0.018 : 0, now, 0.05);
        this.harmonicGain?.gain.setTargetAtTime(racing ? 0.012 + throttle * 0.02 : 0, now, 0.06);
        const skid = racing
            ? Math.min(0.055, Math.abs(snapshot.lateralSpeed) * 0.008) * (snapshot.driftActive ? 1.4 : 0.35)
            : 0;
        this.tireGain?.gain.setTargetAtTime(skid, now, 0.035);
        this.tireFilter?.frequency.setTargetAtTime(650 + Math.abs(snapshot.lateralSpeed) * 180, now, 0.06);
        this.windGain?.gain.setTargetAtTime(racing ? 0.004 + speedRatio * speedRatio * 0.035 : 0, now, 0.12);
        this.windFilter?.frequency.setTargetAtTime(250 + speedRatio * 1450, now, 0.12);
        if (racing && stage > this.stage) this.chirp(stage === 2 ? 880 : 580, 0.16);
        if (racing && snapshot.boostActive && !this.boosting) this.chirp(240, 0.35);
        this.stage = stage;
        this.boosting = snapshot.boostActive;
    }

    private chirp(frequency: number, duration: number): void {
        const context = this.context!;
        const voice = context.createOscillator();
        const envelope = context.createGain();
        voice.type = 'sine';
        voice.frequency.setValueAtTime(frequency, context.currentTime);
        voice.frequency.exponentialRampToValueAtTime(frequency * 1.7, context.currentTime + duration);
        envelope.gain.setValueAtTime(0.0001, context.currentTime);
        envelope.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.015);
        envelope.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
        voice.connect(envelope);
        envelope.connect(this.bus!);
        voice.onended = () => {
            voice.disconnect();
            envelope.disconnect();
        };
        voice.start();
        voice.stop(context.currentTime + duration);
    }

    private updateMusic(racing: boolean, finalLap: boolean, now: number): void {
        if (!this.musicBus || !this.context) return;
        if (!racing) {
            if (this.musicWasRacing) this.musicBus.gain.setTargetAtTime(0, now, 0.24);
            this.musicWasRacing = false;
            this.nextMusicTime = 0;
            this.musicStep = 0;
            return;
        }
        if (!this.musicWasRacing) {
            this.nextMusicTime = now + 0.05;
            this.musicBus.gain.setTargetAtTime(this.musicVolume, now, 0.3);
        }
        this.musicWasRacing = true;
        const beat = 60 / (finalLap ? 136 : 122);
        const stepDuration = beat / 2;
        const bass = finalLap ? [41, 48, 51, 53, 56, 53, 51, 48] : [36, 43, 46, 48, 51, 48, 46, 43];
        const melody = finalLap ? [65, 72, 75, 77, 80, 77, 75, 72] : [60, 67, 70, 72, 75, 72, 70, 67];
        while (this.nextMusicTime < now + 0.18) {
            const time = this.nextMusicTime;
            const index = this.musicStep % bass.length;
            this.playMusicNote(bass[index], time, stepDuration * 0.82, 0.055, 'triangle');
            if (this.musicStep % 2 === 0) {
                this.playMusicNote(melody[index], time, stepDuration * 0.72, finalLap ? 0.027 : 0.021, 'sine');
            }
            if (this.musicStep % 4 === 0) this.playMusicNote(24, time, 0.085, 0.035, 'sine');
            this.musicStep += 1;
            this.nextMusicTime += stepDuration;
        }
    }

    private playMusicNote(midi: number, time: number, duration: number, level: number, type: OscillatorType): void {
        const context = this.context!;
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        oscillator.type = type;
        oscillator.frequency.value = midi === 24 ? 55 : 440 * 2 ** ((midi - 69) / 12);
        envelope.gain.setValueAtTime(0.0001, time);
        envelope.gain.linearRampToValueAtTime(level, time + 0.018);
        envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
        oscillator.connect(envelope);
        envelope.connect(this.musicBus!);
        oscillator.onended = () => {
            oscillator.disconnect();
            envelope.disconnect();
        };
        oscillator.start(time);
        oscillator.stop(time + duration + 0.02);
    }
}
