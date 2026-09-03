import { Color, Entity, StandardMaterial, Vec3 } from 'playcanvas';

import type { KartInput } from './input';

const START_YAW = -90;

export const KART_TUNING = {
    forwardForce: 20,
    reverseForce: 8,
    brakeForce: 24,
    coastingDrag: 1.1,
    cornerGrip: 5.5,
    straightGrip: 11,
    maxSpeed: 16,
    reverseMaxSpeed: 6,
    maxYawSpeed: 1.65,
    steeringResponse: 5,
    steeringReturn: 8,
    lowSpeedSteering: 0.18,
    steeringSpeedReference: 6,
    highSpeedSteeringReduction: 0.45
} as const;

export type KartDebugSnapshot = {
    inputX: number;
    inputY: number;
    inputHandbrake: boolean;
    steering: number;
    wheelSteering: number;
    engineForce: number;
    brakeForce: number;
    forwardSpeed: number;
    lateralSpeed: number;
    planarSpeed: number;
    totalSpeed: number;
    yawSpeed: number;
    vehicleTurn: number;
    driftActive: boolean;
    driftAmount: number;
};

export const getDriftTelemetry = (forwardSpeed: number, lateralSpeed: number) => {
    const active = Math.abs(forwardSpeed) > 0.75 && Math.abs(lateralSpeed) > 0.2;
    const amount = Math.min(1, Math.abs(lateralSpeed) / Math.max(Math.abs(forwardSpeed), 1));
    return { active, amount };
};

const material = (color: Color) => {
    const result = new StandardMaterial();
    result.diffuse = color;
    result.gloss = 0.35;
    result.update();
    return result;
};

const addVisualBox = (root: Entity, name: string, position: Vec3, scale: Vec3, boxMaterial: StandardMaterial) => {
    const part = new Entity(name);
    part.setLocalPosition(position);
    part.setLocalScale(scale);
    part.addComponent('render', { type: 'box', material: boxMaterial });
    root.addChild(part);
};

export const createKart = (root: Entity) => {
    const kart = new Entity('player-kart');
    kart.setPosition(-330, 0.65, 0);
    kart.setEulerAngles(0, -90, 0);

    const body = material(new Color(0.12, 0.36, 0.82));
    const trim = material(new Color(0.95, 0.75, 0.12));
    const tire = material(new Color(0.03, 0.035, 0.045));
    addVisualBox(kart, 'body', new Vec3(0, 0, 0), new Vec3(1.45, 0.5, 2.2), body);
    addVisualBox(kart, 'nose', new Vec3(0, 0.25, -0.78), new Vec3(1.05, 0.2, 0.55), trim);
    addVisualBox(kart, 'seat', new Vec3(0, 0.4, 0.3), new Vec3(0.72, 0.45, 0.65), tire);
    for (const x of [-0.78, 0.78]) {
        for (const z of [-0.82, 0.82])
            addVisualBox(kart, `wheel-${x}-${z}`, new Vec3(x, -0.18, z), new Vec3(0.22, 0.4, 0.48), tire);
    }

    kart.addComponent('collision', { type: 'box', halfExtents: new Vec3(0.72, 0.25, 1.1) });
    kart.addComponent('rigidbody', { type: 'dynamic', mass: 1.2, friction: 0.9, restitution: 0.05 });
    // Ammo owns translation/collision only. The controller owns all rotation.
    kart.rigidbody!.angularFactor = new Vec3(0, 0, 0);
    kart.rigidbody!.linearDamping = 0.05;
    kart.rigidbody!.angularDamping = 0.8;
    root.addChild(kart);
    return kart;
};

export const resetKart = (kart: Entity) => {
    if (kart.rigidbody) {
        // Dynamic Ammo bodies must be teleported through the physics component;
        // otherwise the next simulation step can restore the old transform.
        kart.rigidbody.teleport(-330, 0.65, 0, 0, -90, 0);
        kart.rigidbody.linearVelocity = new Vec3(0, 0, 0);
        kart.rigidbody.angularVelocity = new Vec3(0, 0, 0);
    } else {
        kart.setPosition(-330, 0.65, 0);
        kart.setEulerAngles(0, -90, 0);
    }
};

export class KartController {
    private steering = 0;
    private heading = START_YAW;

    reset() {
        this.steering = 0;
        this.heading = START_YAW;
    }

    getDebugSnapshot(kart: Entity, input: KartInput): KartDebugSnapshot {
        const body = kart.rigidbody;
        const forward = kart.forward.clone();
        const forwardPlanar = new Vec3(forward.x, 0, forward.z).normalize();
        const right = kart.right.clone();
        const rightPlanar = new Vec3(right.x, 0, right.z).normalize();
        const velocity = body?.linearVelocity.clone() ?? new Vec3();
        const planarVelocity = new Vec3(velocity.x, 0, velocity.z);
        const forwardSpeed = planarVelocity.dot(forwardPlanar);
        const yawSpeed = body?.angularVelocity.y ?? 0;
        const vehicleTurn = new Vec3().cross(new Vec3(0, yawSpeed, 0), forwardPlanar).dot(rightPlanar);
        const drift = getDriftTelemetry(forwardSpeed, planarVelocity.dot(rightPlanar));
        return {
            inputX: input.steering,
            inputY: input.throttle,
            inputHandbrake: input.handbrake,
            steering: this.steering,
            wheelSteering: this.steering,
            engineForce: 0,
            brakeForce: 0,
            forwardSpeed,
            lateralSpeed: planarVelocity.dot(rightPlanar),
            planarSpeed: planarVelocity.length(),
            totalSpeed: velocity.length(),
            yawSpeed,
            vehicleTurn,
            driftActive: drift.active,
            driftAmount: drift.amount
        };
    }

    update(kart: Entity, input: KartInput, dt: number) {
        const body = kart.rigidbody;
        if (!body) return;

        // Synchronize the physics body to the controller-owned heading before
        // calculating forces, so Ammo cannot feed its own rotation back in.
        body.teleport(kart.getPosition(), new Vec3(0, this.heading, 0));
        const forward = kart.forward.clone();
        const forwardPlanar = new Vec3(forward.x, 0, forward.z).normalize();
        const velocity = body.linearVelocity.clone();
        const planarVelocity = new Vec3(velocity.x, 0, velocity.z);
        const forwardSpeed = planarVelocity.dot(forwardPlanar);
        const steeringResponse = input.steering === 0 ? KART_TUNING.steeringReturn : KART_TUNING.steeringResponse;
        this.steering += (input.steering - this.steering) * Math.min(1, steeringResponse * dt);
        if (Math.abs(this.steering) < 0.005) this.steering = 0;

        // Throttle, coasting and braking/reverse are deliberately separate.
        if (input.throttle > 0) {
            body.applyForce(forwardPlanar.clone().mulScalar(KART_TUNING.forwardForce * input.throttle));
        } else if (input.throttle < 0 && forwardSpeed > 0.08) {
            const brakeDirection = planarVelocity.length() > 0.01 ? planarVelocity.normalize() : forwardPlanar;
            const brakeScale = Math.min(1, forwardSpeed / 2);
            body.applyForce(brakeDirection.mulScalar(-KART_TUNING.brakeForce * brakeScale));
        } else if (input.throttle < 0) {
            body.applyForce(forwardPlanar.clone().mulScalar(KART_TUNING.reverseForce * input.throttle));
        }
        body.applyForce(planarVelocity.clone().mulScalar(-KART_TUNING.coastingDrag));

        // Keep all ground movement strictly planar. Y is gravity/bounce and must
        // never be treated as lateral drift.
        const lateral = planarVelocity.clone().sub(forwardPlanar.clone().mulScalar(forwardSpeed));
        if (input.steering === 0) {
            // Strong arcade rule: neutral steering means exactly forward/backward.
            const straightVelocity = forwardPlanar.clone().mulScalar(forwardSpeed);
            body.linearVelocity = new Vec3(straightVelocity.x, velocity.y, straightVelocity.z);
        } else {
            const grip = KART_TUNING.cornerGrip;
            body.applyForce(lateral.mulScalar(-grip));
        }

        // PlayCanvas forward is -Z. Curves require movement; there is no stationary spin.
        const movementDirection = forwardSpeed < -0.1 ? -1 : 1;
        const speedFactor = Math.min(1, Math.abs(forwardSpeed) / KART_TUNING.steeringSpeedReference);
        const lowSpeedFactor = KART_TUNING.lowSpeedSteering + (1 - KART_TUNING.lowSpeedSteering) * speedFactor;
        const highSpeedFactor =
            1 - KART_TUNING.highSpeedSteeringReduction * Math.min(1, Math.abs(forwardSpeed) / KART_TUNING.maxSpeed);
        const targetYawSpeed =
            this.steering * KART_TUNING.maxYawSpeed * lowSpeedFactor * highSpeedFactor * movementDirection;
        this.heading += targetYawSpeed * dt * (180 / Math.PI);
        // Keep angular velocity locked even while the controller changes heading.
        body.angularVelocity = new Vec3(0, 0, 0);

        const speedLimit = forwardSpeed < 0 ? KART_TUNING.reverseMaxSpeed : KART_TUNING.maxSpeed;
        if (planarVelocity.length() > speedLimit) {
            const limited = planarVelocity.normalize().mulScalar(speedLimit);
            body.linearVelocity = new Vec3(limited.x, velocity.y, limited.z);
        }

        body.teleport(kart.getPosition(), new Vec3(0, this.heading, 0));
    }
}

export const driveKart = (controller: KartController, kart: Entity, input: KartInput, dt: number) => {
    controller.update(kart, input, dt);
};
