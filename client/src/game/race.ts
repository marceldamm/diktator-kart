import { Vec3 } from 'playcanvas';
import type { Entity } from 'playcanvas';

import { RACE_LAYOUT } from './race-layout';

export type RaceSnapshot = Readonly<{
    phase: 'idle' | 'countdown' | 'racing' | 'finished';
    countdownText: string;
    lap: number;
    lapsToWin: number;
    raceTime: number;
    lapTime: number;
    bestLapTime: number | null;
    lapTimes: readonly number[];
    nextCheckpoint: number;
}>;

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(3).padStart(6, '0')}`;

/** Position-triggered ordered checkpoint race flow, kept independent from rendering and input. */
export class RaceController {
    private phase: RaceSnapshot['phase'] = 'idle';
    private countdown = 3;
    private lap = 1;
    private raceTime = 0;
    private lapTime = 0;
    private bestLapTime: number | null = null;
    private lapTimes: number[] = [];
    private nextCheckpoint = 0;
    private previousPosition = new Vec3();
    private recoveryPosition = RACE_LAYOUT.startPosition.clone();
    private recoveryYaw: number = RACE_LAYOUT.startYaw;

    reset(kart: Entity): void {
        this.phase = 'idle';
        this.countdown = 3;
        this.lap = 1;
        this.raceTime = 0;
        this.lapTime = 0;
        this.bestLapTime = null;
        this.lapTimes = [];
        this.nextCheckpoint = 0;
        this.previousPosition.copy(kart.getPosition());
        this.recoveryPosition.copy(kart.getPosition());
        this.recoveryYaw = RACE_LAYOUT.startYaw;
    }

    /** Keep checkpoint crossing continuous after a non-progressing recovery teleport. */
    resyncPosition(kart: Entity): void {
        this.previousPosition.copy(kart.getPosition());
    }

    start(kart: Entity): void {
        this.reset(kart);
        this.phase = 'countdown';
    }

    get canDrive(): boolean {
        return this.phase === 'racing';
    }

    getRecoveryPose(): Readonly<{ position: Vec3; yaw: number }> {
        return { position: this.recoveryPosition.clone(), yaw: this.recoveryYaw };
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
            this.updateRecoveryPose(expected.position, expected.normal);
            this.nextCheckpoint += 1;
        } else if (
            this.nextCheckpoint === RACE_LAYOUT.checkpoints.length &&
            this.crossed(RACE_LAYOUT.finish, current)
        ) {
            this.updateRecoveryPose(RACE_LAYOUT.finish.position, RACE_LAYOUT.finish.normal);
            this.completeLap();
        }
        this.previousPosition.copy(current);
    }

    snapshot(): RaceSnapshot {
        const countdownText =
            this.phase === 'idle'
                ? ''
                : this.phase === 'finished'
                  ? 'ZIEL!'
                  : this.phase === 'racing'
                    ? this.raceTime < 1.2
                        ? 'LOS!'
                        : ''
                    : String(Math.max(1, Math.ceil(this.countdown)));
        return {
            phase: this.phase,
            countdownText,
            lap: Math.min(this.lap, RACE_LAYOUT.lapsToWin),
            lapsToWin: RACE_LAYOUT.lapsToWin,
            raceTime: this.raceTime,
            lapTime: this.lapTime,
            bestLapTime: this.bestLapTime,
            lapTimes: [...this.lapTimes],
            nextCheckpoint: this.nextCheckpoint
        };
    }

    static formatTime = formatTime;

    progress(kart: Entity): number {
        // Earlier finishers must stay ahead after other racers cross the line.
        if (this.phase === 'finished')
            return RACE_LAYOUT.lapsToWin * (RACE_LAYOUT.checkpoints.length + 1) + 1 / (1 + this.raceTime);
        const segment = (this.lap - 1) * (RACE_LAYOUT.checkpoints.length + 1) + this.nextCheckpoint;
        const target = RACE_LAYOUT.checkpoints[this.nextCheckpoint]?.position ?? RACE_LAYOUT.finish.position;
        return segment - Math.min(0.99, kart.getPosition().distance(target) / 1000);
    }

    private crossed(
        gate: (typeof RACE_LAYOUT.checkpoints)[number] | typeof RACE_LAYOUT.finish,
        current: Vec3
    ): boolean {
        const before = this.previousPosition.clone().sub(gate.position);
        const after = current.clone().sub(gate.position);
        const beforeDistance = before.dot(gate.normal);
        const afterDistance = after.dot(gate.normal);
        // Treat a kart that starts exactly on the gate plane as having started
        // from the near side; otherwise a frame that lands on the plane can
        // make the next frame's crossing impossible to detect.
        if (beforeDistance > 0 || afterDistance < 0 || beforeDistance === afterDistance) return false;
        const fraction = -beforeDistance / (afterDistance - beforeDistance);
        const crossing = before.clone().lerp(before, after, fraction);
        const tangent = new Vec3(-gate.normal.z, 0, gate.normal.x);
        return Math.abs(crossing.dot(tangent)) <= gate.halfWidth;
    }

    private completeLap(): void {
        this.lapTimes.push(this.lapTime);
        this.bestLapTime = this.bestLapTime === null ? this.lapTime : Math.min(this.bestLapTime, this.lapTime);
        if (this.lap >= RACE_LAYOUT.lapsToWin) {
            this.phase = 'finished';
            return;
        }
        this.lap += 1;
        this.lapTime = 0;
        this.nextCheckpoint = 0;
    }

    private updateRecoveryPose(position: Vec3, forward: Vec3): void {
        this.recoveryPosition.copy(position).add(forward.clone().mulScalar(8));
        this.recoveryPosition.y = RACE_LAYOUT.startPosition.y;
        this.recoveryYaw = (Math.atan2(-forward.x, -forward.z) * 180) / Math.PI;
    }
}
