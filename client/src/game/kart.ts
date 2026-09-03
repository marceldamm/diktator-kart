import { Color, Entity, StandardMaterial, Vec3 } from 'playcanvas';

import type { KartInput } from './input';

const FORWARD_FORCE = 10;
const REVERSE_FORCE = 7;
const STEERING_SPEED = 2.2;
const LATERAL_GRIP = 8;
const MAX_SPEED = 9;

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

export const driveKart = (kart: Entity, input: KartInput) => {
    const body = kart.rigidbody;
    if (!body) return;

    const forward = kart.forward.clone();
    const velocity = body.linearVelocity.clone();
    const forwardSpeed = velocity.dot(forward);
    const force = input.y >= 0 ? FORWARD_FORCE * input.y : REVERSE_FORCE * input.y;
    body.applyForce(forward.clone().mulScalar(force));

    // Arcade grip: remove sideways sliding without simulating wheels or suspension.
    const lateral = velocity.clone().sub(forward.clone().mulScalar(forwardSpeed));
    body.applyForce(lateral.mulScalar(-LATERAL_GRIP));
    // Direct arcade yaw keeps A/D effective at low speed and prevents
    // physics contacts from creating a residual turn in the neutral state.
    const steeringFactor = Math.max(0.65, Math.min(1, Math.abs(forwardSpeed) / 2));
    body.angularVelocity = new Vec3(0, input.x * STEERING_SPEED * steeringFactor, 0);

    if (velocity.length() > MAX_SPEED) body.linearVelocity = velocity.normalize().mulScalar(MAX_SPEED);
};
