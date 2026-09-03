import { Vec3 } from 'playcanvas';
import type { Entity } from 'playcanvas';

import { RACE_LAYOUT } from './race-layout';

export type RaceSnapshot = Readonly<{
    phase: 'countdown' | 'racing' | 'finished';
    countdownText: string;
    lap: number;
    lapsToWin: number;
    raceTime: number;
    lapTime: number;
    bestLapTime: number | null;
    nextCheckpoint: number;
}>;

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(3).padStart(6, '0')}`;

/** Position-triggered ordered checkpoint race flow, kept independent from rendering and input. */
export class RaceController {
    private phase: RaceSnapshot['phase'] = 'countdown';
    private countdown = 3.5;
    private lap = 1;
    private raceTime = 0;
    private lapTime = 0;
    private bestLapTime: number | null = null;
    private nextCheckpoint = 0;
    private previousPosition = new Vec3();

    reset(kart: Entity): void {
        this.phase = 'countdown';
        this.countdown = 3.5;
        this.lap = 1;
        this.raceTime = 0;
        this.lapTime = 0;
        this.nextCheckpoint = 0;
        this.previousPosition.copy(kart.getPosition());
    }

    get canDrive(): boolean {
        return this.phase === 'racing';
    }

    update(kart: Entity, dt: number): void {
        if (this.phase === 'countdown') {
            this.countdown -= dt;
            if (this.countdown <= 0) this.phase = 'racing';
            this.previousPosition.copy(kart.getPosition());
            return;
        }
        if (this.phase !== 'racing') return;
        this.raceTime += dt;
        this.lapTime += dt;
        const current = kart.getPosition();
        const expected = RACE_LAYOUT.checkpoints[this.nextCheckpoint];
        if (expected && this.crossed(expected, current)) {
            this.nextCheckpoint += 1;
        } else if (
            this.nextCheckpoint === RACE_LAYOUT.checkpoints.length &&
            this.crossed(RACE_LAYOUT.finish, current)
        ) {
            this.completeLap();
        }
        this.previousPosition.copy(current);
    }

    snapshot(): RaceSnapshot {
        const countdownText =
            this.phase === 'finished'
                ? 'ZIEL!'
                : this.phase === 'racing'
                  ? 'LOS!'
                  : String(Math.max(1, Math.ceil(this.countdown)));
        return {
            phase: this.phase,
            countdownText,
            lap: Math.min(this.lap, RACE_LAYOUT.lapsToWin),
            lapsToWin: RACE_LAYOUT.lapsToWin,
            raceTime: this.raceTime,
            lapTime: this.lapTime,
            bestLapTime: this.bestLapTime,
            nextCheckpoint: this.nextCheckpoint
        };
    }

    static formatTime = formatTime;

    private crossed(
        gate: (typeof RACE_LAYOUT.checkpoints)[number] | typeof RACE_LAYOUT.finish,
        current: Vec3
    ): boolean {
        const before = this.previousPosition.clone().sub(gate.position);
        const after = current.clone().sub(gate.position);
        const beforeDistance = before.dot(gate.normal);
        const afterDistance = after.dot(gate.normal);
        if (beforeDistance > 0 || afterDistance < 0) return false;
        const tangent = new Vec3(-gate.normal.z, 0, gate.normal.x);
        return Math.abs(after.dot(tangent)) <= gate.halfWidth;
    }

    private completeLap(): void {
        this.bestLapTime = this.bestLapTime === null ? this.lapTime : Math.min(this.bestLapTime, this.lapTime);
        if (this.lap >= RACE_LAYOUT.lapsToWin) {
            this.phase = 'finished';
            return;
        }
        this.lap += 1;
        this.lapTime = 0;
        this.nextCheckpoint = 0;
    }
}
