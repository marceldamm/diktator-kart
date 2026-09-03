import { Color, Entity, StandardMaterial, Vec3 } from 'playcanvas';

import type { KartInput } from './input';

const FORWARD_FORCE = 18;
const REVERSE_FORCE = 8;
const STEERING_SPEED = 2.4;
const STEERING_RESPONSE = 5.5;
const STEERING_RETURN = 7;
const LATERAL_GRIP = 5;
const NEUTRAL_GRIP = 12;
const MAX_SPEED = 12;
const REVERSE_MAX_SPEED = 5;

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
    kart.setPosition(0, 0.65, 7);
    kart.setEulerAngles(0, 180, 0);

    const body = material(new Color(0.12, 0.36, 0.82));
    const trim = material(new Color(0.95, 0.75, 0.12));
    const tire = material(new Color(0.03, 0.035, 0.045));
    addVisualBox(kart, 'body', new Vec3(0, 0, 0), new Vec3(1.45, 0.5, 2.2), body);
    addVisualBox(kart, 'nose', new Vec3(0, 0.25, -0.78), new Vec3(1.05, 0.2, 0.55), trim);
    addVisualBox(kart, 'seat', new Vec3(0, 0.4, 0.3), new Vec3(0.72, 0.45, 0.65), tire);
    for (const x of [-0.78, 0.78]) {
        for (const z of [-0.62, 0.62])
            addVisualBox(kart, `wheel-${x}-${z}`, new Vec3(x, -0.18, z), new Vec3(0.22, 0.4, 0.48), tire);
    }

    kart.addComponent('collision', { type: 'box', halfExtents: new Vec3(0.72, 0.25, 1.1) });
    kart.addComponent('rigidbody', { type: 'dynamic', mass: 1.2, friction: 0.9, restitution: 0.05 });
    kart.rigidbody!.angularFactor = new Vec3(0, 1, 0);
    kart.rigidbody!.linearDamping = 0.35;
    kart.rigidbody!.angularDamping = 0.8;
    root.addChild(kart);
    return kart;
};

export const resetKart = (kart: Entity) => {
    kart.setPosition(0, 0.65, 7);
    kart.setEulerAngles(0, 180, 0);
    if (kart.rigidbody) {
        kart.rigidbody.linearVelocity = new Vec3(0, 0, 0);
        kart.rigidbody.angularVelocity = new Vec3(0, 0, 0);
    }
};

export class KartController {
    private steering = 0;

    update(kart: Entity, input: KartInput, dt: number) {
        const body = kart.rigidbody;
        if (!body) return;

        const forward = kart.forward.clone();
        const velocity = body.linearVelocity.clone();
        const forwardSpeed = velocity.dot(forward);
        const steeringResponse = input.x === 0 ? STEERING_RETURN : STEERING_RESPONSE;
        this.steering += (input.x - this.steering) * Math.min(1, steeringResponse * dt);
        const force = input.y >= 0 ? FORWARD_FORCE * input.y : REVERSE_FORCE * input.y;
        body.applyForce(forward.clone().mulScalar(force));

        // Arcade grip allows a little inertia in a curve but settles quickly in neutral.
        const lateral = velocity.clone().sub(forward.clone().mulScalar(forwardSpeed));
        const grip = Math.abs(this.steering) < 0.02 ? NEUTRAL_GRIP : LATERAL_GRIP;
        body.applyForce(lateral.mulScalar(-grip));

        // PlayCanvas forward is -Z. Reverse steering is mirrored so A/D remain intuitive.
        const movementDirection = forwardSpeed < -0.1 ? -1 : 1;
        const speedFactor = 1 / (1 + (Math.abs(forwardSpeed) / MAX_SPEED) * 0.65);
        const targetYawSpeed = this.steering * STEERING_SPEED * speedFactor * movementDirection;
        const yawSpeed = body.angularVelocity.y + (targetYawSpeed - body.angularVelocity.y) * Math.min(1, 10 * dt);
        body.angularVelocity = new Vec3(0, yawSpeed, 0);

        const planarVelocity = new Vec3(velocity.x, 0, velocity.z);
        const speedLimit = forwardSpeed < 0 ? REVERSE_MAX_SPEED : MAX_SPEED;
        if (planarVelocity.length() > speedLimit) {
            const limited = planarVelocity.normalize().mulScalar(speedLimit);
            body.linearVelocity = new Vec3(limited.x, velocity.y, limited.z);
        }
    }
}

export const driveKart = (controller: KartController, kart: Entity, input: KartInput, dt: number) => {
    controller.update(kart, input, dt);
};
