import { Vec3 } from 'playcanvas';
import type { AppBase, Entity, Vec2 } from 'playcanvas';

import type { KartInput } from './input';
import type { KartDebugSnapshot } from './kart';

type AmmoVector3 = {
    setValue(x: number, y: number, z: number): void;
    x(): number;
    y(): number;
    z(): number;
};

type AmmoQuaternion = {
    x(): number;
    y(): number;
    z(): number;
    w(): number;
};

type AmmoTransform = {
    getOrigin(): AmmoVector3;
    getRotation(): AmmoQuaternion;
};

type AmmoWheelInfo = {
    set_m_suspensionStiffness(value: number): void;
    set_m_wheelsDampingCompression(value: number): void;
    set_m_wheelsDampingRelaxation(value: number): void;
    set_m_frictionSlip(value: number): void;
    set_m_rollInfluence(value: number): void;
};

type AmmoVehicle = {
    setCoordinateSystem(rightAxis: number, upAxis: number, forwardAxis: number): void;
    addWheel(connectionPoint: AmmoVector3, direction: AmmoVector3, axle: AmmoVector3, restLength: number, radius: number, tuning: unknown, isFront: boolean): AmmoWheelInfo;
    setSteeringValue(value: number, wheelIndex: number): void;
    applyEngineForce(value: number, wheelIndex: number): void;
    setBrake(value: number, wheelIndex: number): void;
    updateWheelTransform(wheelIndex: number, interpolated: boolean): void;
    getWheelTransformWS(wheelIndex: number): AmmoTransform;
    resetSuspension?(): void;
};

type AmmoNamespace = {
    btVehicleTuning: new () => unknown;
    btDefaultVehicleRaycaster: new (world: unknown) => unknown;
    btRaycastVehicle: new (tuning: unknown, body: unknown, raycaster: unknown) => AmmoVehicle;
    btVector3: new (x?: number, y?: number, z?: number) => AmmoVector3;
    destroy(object: object): void;
};

declare const Ammo: AmmoNamespace;

export const RAYCAST_KART_TUNING = {
    maxEngineForce: 360,
    maxReverseForce: 150,
    maxBrakeForce: 120,
    maxSpeed: 16,
    reverseMaxSpeed: 6,
    maxSteering: 0.32,
    maxYawSpeed: 1.65,
    steeringResponse: 7,
    steeringReturn: 10,
    wheelRadius: 0.28,
    suspensionRestLength: 0.28,
    suspensionStiffness: 24,
    suspensionCompression: 4.4,
    suspensionDamping: 2.3,
    frictionSlip: 7,
    rollInfluence: 0.05
} as const;

const START_POSITION = new Vec3(-330, 0.65, 0);
const START_YAW = -90;

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

/**
 * Arcade wrapper around Ammo's btRaycastVehicle.
 * The chassis remains a normal PlayCanvas dynamic rigidbody; Ammo owns the
 * suspension/wheel forces while this class owns input, steering and limits.
 */
export class RaycastKartController {
    private readonly app: AppBase;
    private readonly kart: Entity;
    private readonly wheelEntities: Entity[];
    private readonly body: NonNullable<Entity['rigidbody']>['body'];
    private readonly vehicle: AmmoVehicle;
    private readonly dynamicsWorld: unknown;
    private active = false;
    private steering = 0;
    private targetYawSpeed = 0;

    constructor(kart: Entity, app: AppBase) {
        this.kart = kart;
        this.app = app;
        if (!kart.rigidbody) {
            throw new Error('RaycastKartController requires an active kart rigidbody.');
        }

        this.body = kart.rigidbody.body;
        const rigidbodySystem = this.app.systems.rigidbody;
        if (!rigidbodySystem) throw new Error('RaycastKartController requires the rigidbody system.');
        this.dynamicsWorld = rigidbodySystem.dynamicsWorld;
        this.wheelEntities = this.findWheelEntities();
        if (this.wheelEntities.length !== 4) {
            throw new Error('RaycastKartController requires four wheel visual entities.');
        }

        const tuning = new Ammo.btVehicleTuning();
        const rayCaster = new Ammo.btDefaultVehicleRaycaster(this.dynamicsWorld);
        this.vehicle = new Ammo.btRaycastVehicle(tuning, this.body, rayCaster);
        this.vehicle.setCoordinateSystem(0, 1, 2);
        this.body.setActivationState(4);

        const direction = new Ammo.btVector3(0, -1, 0);
        const axle = new Ammo.btVector3(-1, 0, 0);
        const connection = new Ammo.btVector3();

        this.wheelEntities.forEach((wheel, index) => {
            const position = wheel.getLocalPosition();
            const isFront = index < 2;
            connection.setValue(position.x, -0.15, position.z);
            const wheelInfo = this.vehicle.addWheel(
                connection,
                direction,
                axle,
                RAYCAST_KART_TUNING.suspensionRestLength,
                RAYCAST_KART_TUNING.wheelRadius,
                tuning,
                isFront
            );
            wheelInfo.set_m_suspensionStiffness(RAYCAST_KART_TUNING.suspensionStiffness);
            wheelInfo.set_m_wheelsDampingCompression(RAYCAST_KART_TUNING.suspensionCompression);
            wheelInfo.set_m_wheelsDampingRelaxation(RAYCAST_KART_TUNING.suspensionDamping);
            wheelInfo.set_m_frictionSlip(RAYCAST_KART_TUNING.frictionSlip);
            wheelInfo.set_m_rollInfluence(RAYCAST_KART_TUNING.rollInfluence);
        });

        Ammo.destroy(connection);
        Ammo.destroy(direction);
        Ammo.destroy(axle);
        // Keep tuning/rayCaster alive for the vehicle lifetime. The official
        // PlayCanvas example releases them together with the vehicle.
    }

    setActive(active: boolean): void {
        if (this.active === active) return;

        this.active = active;
        const angularFactor = new Vec3(0, active ? 1 : 0, 0);
        this.kart.rigidbody?.angularFactor.copy(angularFactor);

        if (active) {
            (this.app.systems.rigidbody!.dynamicsWorld as { addAction(action: AmmoVehicle): void }).addAction(this.vehicle);
            this.body.setActivationState(4);
        } else {
            (this.app.systems.rigidbody!.dynamicsWorld as { removeAction(action: AmmoVehicle): void }).removeAction(this.vehicle);
            this.steering = 0;
            this.targetYawSpeed = 0;
            this.body.setAngularVelocity(new Ammo.btVector3(0, 0, 0));
        }
    }

    reset(): void {
        this.steering = 0;
        this.targetYawSpeed = 0;
        this.vehicle.resetSuspension?.();
        this.body.setLinearVelocity(new Ammo.btVector3(0, 0, 0));
        this.body.setAngularVelocity(new Ammo.btVector3(0, 0, 0));
        this.kart.rigidbody?.teleport(START_POSITION, new Vec3(0, START_YAW, 0));
    }

    update(input: KartInput, dt: number): void {
        if (!this.active) return;

        this.body.setActivationState(4);
        const steeringTarget = input.x * RAYCAST_KART_TUNING.maxSteering;
        const steeringRate = Math.abs(steeringTarget) > Math.abs(this.steering)
            ? RAYCAST_KART_TUNING.steeringResponse
            : RAYCAST_KART_TUNING.steeringReturn;
        this.steering += (steeringTarget - this.steering) * Math.min(1, steeringRate * dt);
        if (Math.abs(this.steering) < 0.0001) this.steering = 0;

        const velocity = this.body.getLinearVelocity();
        const forward = this.kart.forward;
        const forwardSpeed = velocity.x() * forward.x + velocity.y() * forward.y + velocity.z() * forward.z;
        const throttle = clamp(input.y, -1, 1);
        let engineForce = 0;
        let brakeForce = 0;

        // btRaycastVehicle uses the configured local +Z as its forward axis.
        // This kart's visual forward is PlayCanvas -Z, so engine force needs
        // the opposite sign to make positive input move along kart.forward.
        if (throttle > 0) {
            engineForce = -throttle * RAYCAST_KART_TUNING.maxEngineForce;
        } else if (throttle < 0 && forwardSpeed > 0.25) {
            brakeForce = -throttle * RAYCAST_KART_TUNING.maxBrakeForce;
        } else if (throttle < 0) {
            engineForce = -throttle * RAYCAST_KART_TUNING.maxReverseForce;
        }

        this.vehicle.setSteeringValue(this.steering, 0);
        this.vehicle.setSteeringValue(this.steering, 1);
        this.vehicle.applyEngineForce(engineForce, 2);
        this.vehicle.applyEngineForce(engineForce, 3);
        for (let index = 0; index < 4; index += 1) {
            this.vehicle.setBrake(brakeForce, index);
        }

        const speedFactor = clamp(Math.abs(forwardSpeed) / RAYCAST_KART_TUNING.maxSpeed, 0, 1);
        this.targetYawSpeed = this.steering === 0 ? 0 : this.steering / RAYCAST_KART_TUNING.maxSteering * RAYCAST_KART_TUNING.maxYawSpeed * (0.35 + speedFactor * 0.65);

        for (let index = 0; index < 4; index += 1) {
            this.vehicle.updateWheelTransform(index, true);
            const transform = this.vehicle.getWheelTransformWS(index);
            const position = transform.getOrigin();
            const rotation = transform.getRotation();
            this.wheelEntities[index].setPosition(position.x(), position.y(), position.z());
            this.wheelEntities[index].setRotation(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        }

        this.limitPlanarSpeed(forwardSpeed);
    }

    getDebugSnapshot(kart: Entity, input: Vec2): KartDebugSnapshot {
        const body = kart.rigidbody!.body;
        const velocity = body.getLinearVelocity();
        const forward = kart.forward.clone();
        forward.y = 0;
        forward.normalize();
        const right = new Vec3(forward.z, 0, -forward.x);
        const forwardSpeed = velocity.x() * forward.x + velocity.z() * forward.z;
        const lateralSpeed = velocity.x() * right.x + velocity.z() * right.z;
        const totalSpeed = Math.sqrt(velocity.x() ** 2 + velocity.y() ** 2 + velocity.z() ** 2);
        const angularY = body.getAngularVelocity().y();

        return {
            totalSpeed,
            inputY: input.y,
            inputX: input.x,
            steering: this.steering,
            yawSpeed: angularY,
            vehicleTurn: angularY,
            targetYawSpeed: this.targetYawSpeed,
            forwardSpeed,
            lateralSpeed
        };
    }

    private findWheelEntities(): Entity[] {
        const wheels = this.kart.children
            .filter((child) => child.name.startsWith('wheel-'))
            .sort((a, b) => a.getLocalPosition().z - b.getLocalPosition().z) as Entity[];
        const front = wheels.filter((wheel) => wheel.getLocalPosition().z < 0).sort((a, b) => a.getLocalPosition().x - b.getLocalPosition().x);
        const rear = wheels.filter((wheel) => wheel.getLocalPosition().z >= 0).sort((a, b) => a.getLocalPosition().x - b.getLocalPosition().x);
        return [...front, ...rear];
    }

    private limitPlanarSpeed(forwardSpeed: number): void {
        const limit = forwardSpeed >= 0 ? RAYCAST_KART_TUNING.maxSpeed : RAYCAST_KART_TUNING.reverseMaxSpeed;
        const velocity = this.body.getLinearVelocity();
        const planarSpeed = Math.sqrt(velocity.x() ** 2 + velocity.z() ** 2);
        if (planarSpeed <= limit || planarSpeed < 0.0001) return;

        const scale = limit / planarSpeed;
        const cappedVelocity = new Ammo.btVector3(velocity.x() * scale, velocity.y(), velocity.z() * scale);
        this.body.setLinearVelocity(cappedVelocity);
    }
}
