import type { KartDebugSnapshot } from './kart';

/** Local synthesis; no downloads or network requests during a race. */
export class DrivingAudio {
    private context: AudioContext | null = null;
    private bus: GainNode | null = null;
    private engine: OscillatorNode | null = null;
    private engineGain: GainNode | null = null;
    private volume = 0.68;
    private stage = 0;
    private boosting = false;

    unlock(): void {
        if (!this.context) {
            const context = new AudioContext();
            this.context = context;
            this.bus = context.createGain();
            this.bus.gain.value = this.volume;
            this.bus.connect(context.destination);
            this.engineGain = context.createGain();
            this.engineGain.gain.value = 0;
            this.engineGain.connect(this.bus);
            this.engine = context.createOscillator();
            this.engine.type = 'triangle';
            this.engine.connect(this.engineGain);
            this.engine.start();
        }
        void this.context.resume().catch(() => {
            // Muted or blocked audio must not prevent racing.
        });
    }

    setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.bus && this.context) this.bus.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.03);
    }

    setPaused(paused: boolean): void {
        if (!this.context) return;
        void (paused ? this.context.suspend() : this.context.resume()).catch(() => {
            // Audio failures are nonfatal.
        });
    }

    reset(): void {
        this.stage = 0;
        this.boosting = false;
        if (this.context && this.engineGain) this.engineGain.gain.setTargetAtTime(0, this.context.currentTime, 0.02);
    }

    update(snapshot: KartDebugSnapshot, stage: number, racing: boolean): void {
        if (!this.context || !this.engine || !this.engineGain) return;
        const now = this.context.currentTime;
        this.engine.frequency.setTargetAtTime(
            42 + snapshot.planarSpeed * 4 + Math.max(0, snapshot.inputY) * 12,
            now,
            0.07
        );
        this.engineGain.gain.setTargetAtTime(
            racing ? 0.04 + Math.min(0.06, snapshot.planarSpeed * 0.003) : 0,
            now,
            0.05
        );
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
}
