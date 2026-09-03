import { Vec3 } from 'playcanvas';
import type { Entity } from 'playcanvas';

import type { KartInput } from './input';
import type { KartDebugSnapshot } from './kart';

export type KartDebugProvider = {
    getDebugSnapshot(kart: Entity, input: KartInput): KartDebugSnapshot;
};

type TelemetrySample = {
    t: number;
    sample: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    heading: number;
    headingDelta: number;
    inputX: number;
    inputY: number;
    steering: number;
    targetYaw: number;
    angularY: number;
    velocityX: number;
    velocityY: number;
    velocityZ: number;
    forwardSpeed: number;
    lateralSpeed: number;
    totalSpeed: number;
    movementAngle: number;
    headingVsMovement: number;
    distanceFromCenterLine: number;
    driftActive: boolean;
    driftAmount: number;
};

const degrees = 180 / Math.PI;
const wrapDegrees = (angle: number) => ((((angle + 180) % 360) + 360) % 360) - 180;
const number = (value: number) => value.toFixed(5);
const headingFromForward = (forward: Vec3) => Math.atan2(-forward.x, -forward.z) * degrees;

export class TelemetryLog {
    private readonly sampleInterval = 0.1;
    private readonly samples: TelemetrySample[] = [];
    private elapsed = 0;
    private accumulator = 0;
    private sampleNumber = 0;
    private active = false;
    private startPosition = new Vec3();
    private startRight = new Vec3(1, 0, 0);
    private startHeading = 0;

    get isActive() {
        return this.active;
    }

    get count() {
        return this.samples.length;
    }

    start(kart: Entity) {
        this.beginSession(kart, true);
        this.active = true;
    }

    stop() {
        this.active = false;
    }

    clear() {
        this.samples.length = 0;
        this.sampleNumber = 0;
        this.elapsed = 0;
        this.accumulator = 0;
    }

    resetSession(kart: Entity) {
        this.beginSession(kart, true);
    }

    update(dt: number, kart: Entity, controller: KartDebugProvider, input: KartInput) {
        if (!this.active) return false;
        this.elapsed += dt;
        this.accumulator += dt;
        if (this.accumulator < this.sampleInterval) return false;
        this.accumulator -= this.sampleInterval;
        this.record(kart, controller, input);
        return true;
    }

    getText() {
        const lines = this.samples.map((sample) => this.formatSample(sample));
        return lines.length > 0 ? lines.join('\n') + `\n\n${this.getSummary()}` : 'Noch keine Samples aufgezeichnet.';
    }

    getSummary() {
        if (this.samples.length === 0) return 'Zusammenfassung: noch keine Samples.';
        const maxCenter = Math.max(...this.samples.map((sample) => Math.abs(sample.distanceFromCenterLine)));
        const maxHeading = Math.max(...this.samples.map((sample) => Math.abs(sample.headingDelta)));
        const maxAngular = Math.max(...this.samples.map((sample) => Math.abs(sample.angularY)));
        const maxLateral = Math.max(...this.samples.map((sample) => Math.abs(sample.lateralSpeed)));
        const averageLateral =
            this.samples.reduce((sum, sample) => sum + Math.abs(sample.distanceFromCenterLine), 0) /
            this.samples.length;
        return [
            'Zusammenfassung:',
            `max center offset = ${number(maxCenter)}`,
            `max heading delta = ${number(maxHeading)} deg`,
            `max |angularY| = ${number(maxAngular)}`,
            `max |lateralSpeed| = ${number(maxLateral)}`,
            `average |center offset| = ${number(averageLateral)}`
        ].join('\n');
    }

    private beginSession(kart: Entity, clear: boolean) {
        if (clear) this.clear();
        this.startPosition.copy(kart.getPosition());
        const right = kart.right;
        this.startRight.set(right.x, 0, right.z).normalize();
        this.startHeading = headingFromForward(kart.forward);
    }

    private record(kart: Entity, controller: KartDebugProvider, input: KartInput) {
        const body = kart.rigidbody;
        if (!body) return;
        const snapshot = controller.getDebugSnapshot(kart, input);
        const position = kart.getPosition();
        const velocity = body.linearVelocity;
        const heading = headingFromForward(kart.forward);
        const movementAngle = snapshot.totalSpeed > 0.001 ? Math.atan2(-velocity.x, -velocity.z) * degrees : heading;
        const displacement = position.clone().sub(this.startPosition);
        this.samples.push({
            t: this.elapsed,
            sample: this.sampleNumber++,
            positionX: position.x,
            positionY: position.y,
            positionZ: position.z,
            heading,
            headingDelta: wrapDegrees(heading - this.startHeading),
            inputX: input.x,
            inputY: input.y,
            steering: snapshot.steering,
            targetYaw: snapshot.targetYawSpeed,
            angularY: body.angularVelocity.y,
            velocityX: velocity.x,
            velocityY: velocity.y,
            velocityZ: velocity.z,
            forwardSpeed: snapshot.forwardSpeed,
            lateralSpeed: snapshot.lateralSpeed,
            totalSpeed: snapshot.totalSpeed,
            movementAngle,
            headingVsMovement: wrapDegrees(movementAngle - heading),
            distanceFromCenterLine: displacement.dot(this.startRight),
            driftActive: snapshot.driftActive,
            driftAmount: snapshot.driftAmount
        });
    }

    private formatSample(sample: TelemetrySample) {
        return [
            `#${sample.sample}`,
            `t=${number(sample.t)}`,
            `pos=(${number(sample.positionX)},${number(sample.positionZ)})`,
            `heading=${number(sample.heading)}`,
            `headingDelta=${number(sample.headingDelta)}`,
            `inputX=${number(sample.inputX)}`,
            `inputY=${number(sample.inputY)}`,
            `steering=${number(sample.steering)}`,
            `targetYaw=${number(sample.targetYaw)}`,
            `angularY=${number(sample.angularY)}`,
            `vel=(${number(sample.velocityX)},${number(sample.velocityZ)})`,
            `forwardSpeed=${number(sample.forwardSpeed)}`,
            `lateralSpeed=${number(sample.lateralSpeed)}`,
            `totalSpeed=${number(sample.totalSpeed)}`,
            `movementAngle=${number(sample.movementAngle)}`,
            `headingVsMovement=${number(sample.headingVsMovement)}`,
            `centerOffset=${number(sample.distanceFromCenterLine)}`,
            `drift=${sample.driftActive ? 'YES' : 'NO'}`,
            `driftAmount=${number(sample.driftAmount)}`
        ].join(' | ');
    }
}
