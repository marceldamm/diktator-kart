import type { Entity } from 'playcanvas';
import { Vec3 } from 'playcanvas';

const desiredPosition = new Vec3();
const lookTarget = new Vec3();

export const followKart = (camera: Entity, kart: Entity, dt: number) => {
    desiredPosition.copy(kart.getPosition()).sub(kart.forward.clone().mulScalar(6));
    desiredPosition.y += 3.8;
    lookTarget.copy(kart.getPosition());
    lookTarget.y += 0.6;
    const blend = 1 - Math.pow(0.001, dt);
    const currentPosition = camera.getPosition().clone();
    camera.setPosition(currentPosition.lerp(currentPosition, desiredPosition, blend));
    camera.lookAt(lookTarget);
};
