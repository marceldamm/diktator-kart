import type { Entity, GraphNode } from 'playcanvas';

import type { KartDebugSnapshot } from './kart';

/** Visual-only reactions. All transforms are children of the physical chassis. */
export class KartAnimator {
    private readonly kart: Entity;
    private time = 0;
    private readonly body: GraphNode | null;
    private readonly head: GraphNode | null;
    private readonly hat: GraphNode | null;
    private readonly detail: GraphNode | null;

    constructor(kart: Entity) {
        this.kart = kart;
        this.body = kart.findByName('driver-body');
        this.head = kart.findByName('driver-head');
        this.hat = kart.findByName('driver-hat');
        this.detail = kart.findByName('moving-detail');
    }

    update(snapshot: KartDebugSnapshot, dt: number, reducedEffects: boolean): void {
        this.time += dt;
        const strength = reducedEffects ? 0.4 : 1;
        const brakeLean = snapshot.inputY < 0 && snapshot.forwardSpeed > 1 ? -13 : 0;
        const boostLean = snapshot.boostActive ? 10 : 0;
        const driftLean = snapshot.driftActive ? snapshot.inputX * 15 : snapshot.inputX * 4;
        const pitch = (brakeLean + boostLean) * strength;
        this.body?.setLocalEulerAngles(pitch, 0, -driftLean * strength);
        this.head?.setLocalEulerAngles(pitch * 0.45, 0, -driftLean * 0.55 * strength);
        this.hat?.setLocalEulerAngles(pitch * 0.25, 0, -driftLean * 0.75 * strength);

        if (!this.detail) return;
        const pulse = Math.sin(this.time * (5 + snapshot.planarSpeed * 0.35));
        const driver = this.kart.tags.list().find((tag) => tag.startsWith('driver-')) ?? 'driver-hitler';
        switch (driver) {
            case 'driver-stalin':
                this.detail.setLocalPosition(0, 1.03 + Math.abs(pulse) * 0.1 * strength, -0.08);
                this.detail.setLocalEulerAngles(0, 0, pulse * 8 * strength);
                break;
            case 'driver-mussolini':
                this.detail.setLocalPosition(pulse * 0.08 * strength, 1.03, -0.08);
                this.detail.setLocalEulerAngles(0, pulse * 18 * strength, 0);
                break;
            case 'driver-mao':
                this.detail.setLocalPosition(0, 1.03, -0.08 + pulse * 0.08 * strength);
                this.detail.setLocalEulerAngles(pulse * 12 * strength, 0, 0);
                break;
            case 'driver-kim':
                this.detail.setLocalScale(0.46, 0.12 + Math.abs(pulse) * 0.08 * strength, 0.08);
                this.detail.setLocalEulerAngles(0, 0, pulse * 5 * strength);
                break;
            case 'driver-castro':
                this.detail.setLocalPosition(0, 1.03 + pulse * 0.06 * strength, -0.08);
                this.detail.setLocalEulerAngles(pulse * 16 * strength, 0, pulse * 6 * strength);
                break;
            default:
                this.detail.setLocalPosition(pulse * 0.05 * strength, 1.03, -0.08);
                this.detail.setLocalEulerAngles(0, 0, pulse * 22 * strength);
        }
    }

    reset(): void {
        this.time = 0;
        this.body?.setLocalEulerAngles(0, 0, 0);
        this.head?.setLocalEulerAngles(0, 0, 0);
        this.hat?.setLocalEulerAngles(0, 0, 0);
        if (this.detail) {
            this.detail.setLocalPosition(0, 1.03, -0.08);
            this.detail.setLocalEulerAngles(0, 0, 0);
            this.detail.setLocalScale(0.46, 0.12, 0.08);
        }
    }
}
