import { Quat, Vec3 } from 'playcanvas';
import type { Entity } from 'playcanvas';

const WORLD_UP = new Vec3(0, 1, 0);
const CAMERA_LOCAL_FORWARD = new Vec3(0, 0, -1);
const desiredPosition = new Vec3();
const desiredLookTarget = new Vec3();
const behindDirection = new Vec3();
const kartEuler = new Vec3();
const currentPosition = new Vec3();
const cameraOffset = new Vec3();
const baseRotation = new Quat();
const rollRotation = new Quat();

const shortestAngle = (from: number, to: number): number => ((((to - from + 540) % 360) + 360) % 360) - 180;

export class FollowCameraController {
    // Keep a little more track in view so the long stadium straights read before
    // the next landmark arrives, without turning the kart into a distant speck.
    private distance = 13;
    private readonly lookTarget = new Vec3();
    private readonly lastKartPosition = new Vec3();
    private initialized = false;
    private reducedMotion = false;
    private speedFov = 62;
    private followedYaw = 0;

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

    setReducedMotion(reduced: boolean): void {
        this.reducedMotion = reduced;
    }

    /** Rebase camera history after an intentional race restart. */
    reset(camera: Entity, kart: Entity): void {
        const position = kart.getPosition();
        this.followedYaw = kart.getRotation().getEulerAngles(kartEuler).y;
        this.calculateDesiredPose(kart, 0, false);
        this.lookTarget.copy(desiredLookTarget);
        this.lastKartPosition.copy(position);
        camera.setPosition(desiredPosition);
        camera.lookAt(this.lookTarget, WORLD_UP);
        this.speedFov = 62;
        if (camera.camera) camera.camera.fov = this.speedFov;
        this.initialized = true;
    }

    update(camera: Entity, kart: Entity, dt: number, speed = 0, steering = 0, boost = false): void {
        const kartPosition = kart.getPosition();
        if (!this.initialized) {
            this.reset(camera, kart);
            return;
        }
        if (this.lastKartPosition.distance(kartPosition) > 30) this.rebaseAfterTeleport(camera, kart);

        const targetYaw = kart.getRotation().getEulerAngles(kartEuler).y;
        const yawBlend = 1 - Math.exp(-dt / (this.reducedMotion ? 0.08 : 0.2));
        this.followedYaw += shortestAngle(this.followedYaw, targetYaw) * yawBlend;

        const speedRatio = Math.min(1, Math.abs(speed) / 32);
        this.calculateDesiredPose(kart, speedRatio, boost);
        const positionBlend = 1 - Math.exp(-dt / (this.reducedMotion ? 0.11 : 0.2));
        const lookBlend = 1 - Math.exp(-dt / (this.reducedMotion ? 0.07 : 0.12));
        currentPosition.copy(camera.getPosition()).lerp(currentPosition, desiredPosition, positionBlend);
        camera.setPosition(currentPosition);
        this.lookTarget.lerp(this.lookTarget, desiredLookTarget, lookBlend);

        // lookAt always uses world-up. Banking is composed about camera-local forward,
        // rather than rewriting Euler angles (which becomes ambiguous near 180 degrees).
        camera.lookAt(this.lookTarget, WORLD_UP);
        baseRotation.copy(camera.getRotation());
        rollRotation.setFromAxisAngle(CAMERA_LOCAL_FORWARD, -steering * (this.reducedMotion ? 0.8 : 2.2));
        camera.setRotation(baseRotation.mul(rollRotation));

        const targetFov = 62 + speedRatio * 7 + (boost ? 2 : 0);
        this.speedFov += (targetFov - this.speedFov) * (1 - Math.exp(-3.5 * dt));
        if (camera.camera) camera.camera.fov = this.speedFov;
        this.lastKartPosition.copy(kartPosition);
    }

    private calculateDesiredPose(kart: Entity, speedRatio: number, boost: boolean): void {
        const targetDistance = this.distance + speedRatio * 1.4 + (boost ? 1.1 : 0);
        const yawRadians = (this.followedYaw * Math.PI) / 180;
        behindDirection.set(-Math.sin(yawRadians), 0, -Math.cos(yawRadians));
        desiredPosition.copy(kart.getPosition()).sub(behindDirection.mulScalar(targetDistance));
        desiredPosition.y += 4.35;
        desiredLookTarget.copy(kart.getPosition());
        desiredLookTarget.y += 1.05;
    }

    /** Translate camera history with the kart so a recovery teleport cannot snap its view. */
    rebaseAfterTeleport(camera: Entity, kart: Entity): void {
        const position = kart.getPosition();
        cameraOffset.copy(camera.getPosition()).sub(this.lastKartPosition);
        desiredPosition.copy(position).add(cameraOffset);
        desiredLookTarget.copy(position);
        desiredLookTarget.y += 1.05;
        this.lookTarget.copy(desiredLookTarget);
        camera.setPosition(desiredPosition);
        camera.lookAt(this.lookTarget, WORLD_UP);
        this.lastKartPosition.copy(position);
    }
}
