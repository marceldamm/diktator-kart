import type { Entity } from 'playcanvas';
import { Vec3 } from 'playcanvas';

const desiredPosition = new Vec3();
const lookTarget = new Vec3();

export class FollowCameraController {
    private distance = 8;

    constructor() {
        window.addEventListener(
            'wheel',
            (event) => {
                event.preventDefault();
                this.distance = Math.max(5, Math.min(40, this.distance + event.deltaY * 0.025));
            },
            { passive: false }
        );
    }

    update(camera: Entity, kart: Entity, dt: number) {
        desiredPosition.copy(kart.getPosition()).sub(kart.forward.clone().mulScalar(this.distance));
        desiredPosition.y += 2.5 + this.distance * 0.45;
        lookTarget.copy(kart.getPosition());
        lookTarget.y += 0.6;
        const blend = 1 - Math.pow(0.001, dt);
        const currentPosition = camera.getPosition().clone();
        camera.setPosition(currentPosition.lerp(currentPosition, desiredPosition, blend));
        camera.lookAt(lookTarget);
    }
}
