import { Vec3 } from 'playcanvas';
import type { AppBase, Entity } from 'playcanvas';

import type { KartInput } from './input';
import { getDriftTelemetry } from './kart';
import type { KartDebugSnapshot } from './kart';

type AmmoVector3 = { setValue(x: number, y: number, z: number): void; x(): number; y(): number; z(): number };
type AmmoQuaternion = { x(): number; y(): number; z(): number; w(): number };
type AmmoTransform = { getOrigin(): AmmoVector3; getRotation(): AmmoQuaternion };
type AmmoWheelInfo = {
    set_m_suspensionStiffness(value: number): void;
    set_m_wheelsDampingCompression(value: number): void;
    set_m_wheelsDampingRelaxation(value: number): void;
    set_m_frictionSlip(value: number): void;
    set_m_rollInfluence(value: number): void;
};
type AmmoVehicle = {
    setCoordinateSystem(rightAxis: number, upAxis: number, forwardAxis: number): void;
    addWheel(
        connectionPoint: AmmoVector3,
        direction: AmmoVector3,
        axle: AmmoVector3,
        restLength: number,
        radius: number,
        tuning: unknown,
        isFront: boolean
    ): AmmoWheelInfo;
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
    chassis: {
        mass: 120,
        legacyMass: 1.2,
        linearDamping: 0.08,
        legacyLinearDamping: 0.05,
        cornerAngularDamping: 0.35,
        straightAngularDamping: 0.72
    },
    engine: {
        forwardForce: 520,
        reverseForce: 210,
        forceRiseRate: 900,
        forceFallRate: 1800,
        maxSpeed: 16,
        reverseMaxSpeed: 6,
        powerFadeStart: 0.72
    },
    braking: {
        serviceForce: 900,
        handbrakeForce: 1800,
        overspeedForce: 300,
        directionChangeSpeed: 0.35
    },
    steering: {
        maxAngle: 0.22,
        response: 5,
        returnRate: 6,
        highSpeedReduction: 0.55
    },
    suspension: {
        wheelRadius: 0.28,
        restLength: 0.28,
        stiffness: 24,
        compression: 4.4,
        damping: 2.3
    },
    grip: { front: 12, rear: 15, rollInfluence: 0.05 },
    wheels: { connectionY: -0.15 }
} as const;

const START_POSITION = new Vec3(-330, 0.65, 0);
const START_YAW = -90;
const LEGACY_ANGULAR_DAMPING = 0.8;
const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
const lerp = (from: number, to: number, amount: number): number => from + (to - from) * clamp(amount, 0, 1);
const smoothStep = (edge0: number, edge1: number, value: number): number => {
    const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
};
const moveTowards = (current: number, target: number, maxDelta: number): number => {
    const delta = target - current;
    return Math.abs(delta) <= maxDelta ? target : current + Math.sign(delta) * maxDelta;
};

/** Ammo raycast chassis with a small continuous arcade-assist layer. */
export class RaycastKartController {
    private readonly app: AppBase;
    private readonly kart: Entity;
    private readonly wheelEntities: Entity[];
    private readonly body: NonNullable<Entity['rigidbody']>['body'];
    private readonly vehicle: AmmoVehicle;
    private active = false;
    private steering = 0;
    private wheelSteering = 0;
    private engineForce = 0;
    private brakeForce = 0;

    constructor(kart: Entity, app: AppBase) {
        this.kart = kart;
        this.app = app;
        if (!kart.rigidbody) throw new Error('RaycastKartController requires an active kart rigidbody.');
        this.body = kart.rigidbody.body;
        const rigidbodySystem = app.systems.rigidbody;
        if (!rigidbodySystem) throw new Error('RaycastKartController requires the rigidbody system.');
        this.wheelEntities = this.findWheelEntities();
        if (this.wheelEntities.length !== 4) throw new Error('RaycastKartController requires four wheels.');

        const tuning = new Ammo.btVehicleTuning();
        const rayCaster = new Ammo.btDefaultVehicleRaycaster(rigidbodySystem.dynamicsWorld);
        this.vehicle = new Ammo.btRaycastVehicle(tuning, this.body, rayCaster);
        this.vehicle.setCoordinateSystem(0, 1, 2);
        this.body.setActivationState(4);

        const direction = new Ammo.btVector3(0, -1, 0);
        const axle = new Ammo.btVector3(-1, 0, 0);
        const connection = new Ammo.btVector3();
        this.wheelEntities.forEach((wheel, index) => {
            const position = wheel.getLocalPosition();
            const isFront = index < 2;
            connection.setValue(position.x, RAYCAST_KART_TUNING.wheels.connectionY, position.z);
            const wheelInfo = this.vehicle.addWheel(
                connection,
                direction,
                axle,
                RAYCAST_KART_TUNING.suspension.restLength,
                RAYCAST_KART_TUNING.suspension.wheelRadius,
                tuning,
                isFront
            );
            wheelInfo.set_m_suspensionStiffness(RAYCAST_KART_TUNING.suspension.stiffness);
            wheelInfo.set_m_wheelsDampingCompression(RAYCAST_KART_TUNING.suspension.compression);
            wheelInfo.set_m_wheelsDampingRelaxation(RAYCAST_KART_TUNING.suspension.damping);
            wheelInfo.set_m_frictionSlip(isFront ? RAYCAST_KART_TUNING.grip.front : RAYCAST_KART_TUNING.grip.rear);
            wheelInfo.set_m_rollInfluence(RAYCAST_KART_TUNING.grip.rollInfluence);
        });
        Ammo.destroy(connection);
        Ammo.destroy(direction);
        Ammo.destroy(axle);
    }

    setActive(active: boolean): void {
        if (this.active === active) return;
        this.active = active;
        const rigidbody = this.kart.rigidbody;
        if (!rigidbody) return;
        const world = this.app.systems.rigidbody!.dynamicsWorld as {
            addAction(action: AmmoVehicle): void;
            removeAction(action: AmmoVehicle): void;
        };
        if (!active) world.removeAction(this.vehicle);
        rigidbody.angularFactor = new Vec3(0, active ? 1 : 0, 0);
        rigidbody.mass = active ? RAYCAST_KART_TUNING.chassis.mass : RAYCAST_KART_TUNING.chassis.legacyMass;
        rigidbody.linearDamping = active
            ? RAYCAST_KART_TUNING.chassis.linearDamping
            : RAYCAST_KART_TUNING.chassis.legacyLinearDamping;
        rigidbody.angularDamping = active ? RAYCAST_KART_TUNING.chassis.straightAngularDamping : LEGACY_ANGULAR_DAMPING;
        if (active) world.addAction(this.vehicle);
        this.resetControlState();
        this.body.setActivationState(4);
    }

    reset(): void {
        this.resetControlState();
        this.vehicle.resetSuspension?.();
        this.kart.rigidbody?.teleport(START_POSITION, new Vec3(0, START_YAW, 0));
        if (this.kart.rigidbody) {
            this.kart.rigidbody.linearVelocity = Vec3.ZERO;
            this.kart.rigidbody.angularVelocity = Vec3.ZERO;
        }
    }

    update(input: KartInput, dt: number): void {
        if (!this.active) return;
        this.body.setActivationState(4);
        const velocity = this.body.getLinearVelocity();
        const forward = this.kart.forward;
        const forwardSpeed = velocity.x() * forward.x + velocity.z() * forward.z;
        const planarSpeed = Math.sqrt(velocity.x() ** 2 + velocity.z() ** 2);
        const speedRatio = clamp(Math.abs(forwardSpeed) / RAYCAST_KART_TUNING.engine.maxSpeed, 0, 1);
        this.updateSteering(input.steering, speedRatio, dt);
        this.updateAngularDamping(speedRatio);
        this.updateDrive(input, forwardSpeed, planarSpeed, dt);
        this.applyVehicleForces();
        this.updateWheelVisuals();
    }

    getDebugSnapshot(kart: Entity, input: KartInput): KartDebugSnapshot {
        const body = kart.rigidbody!.body;
        const velocity = body.getLinearVelocity();
        const forward = kart.forward.clone();
        forward.y = 0;
        forward.normalize();
        const right = new Vec3(forward.z, 0, -forward.x);
        const forwardSpeed = velocity.x() * forward.x + velocity.z() * forward.z;
        const lateralSpeed = velocity.x() * right.x + velocity.z() * right.z;
        const planarSpeed = Math.sqrt(velocity.x() ** 2 + velocity.z() ** 2);
        const angularY = body.getAngularVelocity().y();
        const drift = getDriftTelemetry(forwardSpeed, lateralSpeed);
        return {
            totalSpeed: Math.sqrt(planarSpeed ** 2 + velocity.y() ** 2),
            planarSpeed,
            inputY: input.throttle,
            inputX: input.steering,
            inputHandbrake: input.handbrake,
            steering: this.steering,
            wheelSteering: this.wheelSteering,
            engineForce: this.engineForce,
            brakeForce: this.brakeForce,
            yawSpeed: angularY,
            vehicleTurn: angularY,
            forwardSpeed,
            lateralSpeed,
            driftActive: drift.active,
            driftAmount: drift.amount
        };
    }

    private updateSteering(inputSteering: number, speedRatio: number, dt: number): void {
        const target = clamp(inputSteering, -1, 1) * RAYCAST_KART_TUNING.steering.maxAngle;
        const rate =
            inputSteering === 0 ? RAYCAST_KART_TUNING.steering.returnRate : RAYCAST_KART_TUNING.steering.response;
        this.steering += (target - this.steering) * (1 - Math.exp(-rate * dt));
        if (Math.abs(this.steering) < 0.0001) this.steering = 0;
        const speedScale = 1 - RAYCAST_KART_TUNING.steering.highSpeedReduction * smoothStep(0.2, 1, speedRatio);
        this.wheelSteering = this.steering * speedScale;
    }

    private updateAngularDamping(speedRatio: number): void {
        if (!this.kart.rigidbody) return;
        const steeringActivity = clamp(Math.abs(this.wheelSteering) / RAYCAST_KART_TUNING.steering.maxAngle, 0, 1);
        const straightDamping = lerp(
            RAYCAST_KART_TUNING.chassis.cornerAngularDamping,
            RAYCAST_KART_TUNING.chassis.straightAngularDamping,
            smoothStep(0.25, 1, speedRatio)
        );
        this.kart.rigidbody.angularDamping = lerp(
            straightDamping,
            RAYCAST_KART_TUNING.chassis.cornerAngularDamping,
            steeringActivity
        );
    }

    private updateDrive(input: KartInput, forwardSpeed: number, planarSpeed: number, dt: number): void {
        const throttle = clamp(input.throttle, -1, 1);
        const directionThreshold = RAYCAST_KART_TUNING.braking.directionChangeSpeed;
        let targetEngineForce = 0;
        let targetBrakeForce = 0;
        if (input.handbrake) {
            targetBrakeForce = RAYCAST_KART_TUNING.braking.handbrakeForce;
        } else if (throttle > 0 && forwardSpeed < -directionThreshold) {
            targetBrakeForce = RAYCAST_KART_TUNING.braking.serviceForce * throttle;
        } else if (throttle < 0 && forwardSpeed > directionThreshold) {
            targetBrakeForce = RAYCAST_KART_TUNING.braking.serviceForce * -throttle;
        } else if (throttle > 0) {
            const power =
                1 -
                smoothStep(
                    RAYCAST_KART_TUNING.engine.powerFadeStart,
                    1,
                    Math.max(0, forwardSpeed) / RAYCAST_KART_TUNING.engine.maxSpeed
                );
            targetEngineForce = -RAYCAST_KART_TUNING.engine.forwardForce * throttle * power;
        } else if (throttle < 0) {
            const power =
                1 -
                smoothStep(
                    RAYCAST_KART_TUNING.engine.powerFadeStart,
                    1,
                    Math.max(0, -forwardSpeed) / RAYCAST_KART_TUNING.engine.reverseMaxSpeed
                );
            targetEngineForce = RAYCAST_KART_TUNING.engine.reverseForce * -throttle * power;
        }
        if (!input.handbrake && planarSpeed > RAYCAST_KART_TUNING.engine.maxSpeed * 1.03) {
            targetBrakeForce = Math.max(targetBrakeForce, RAYCAST_KART_TUNING.braking.overspeedForce);
        }
        const forceRate =
            Math.abs(targetEngineForce) > Math.abs(this.engineForce)
                ? RAYCAST_KART_TUNING.engine.forceRiseRate
                : RAYCAST_KART_TUNING.engine.forceFallRate;
        this.engineForce = moveTowards(this.engineForce, targetEngineForce, forceRate * dt);
        this.brakeForce = targetBrakeForce;
    }

    private applyVehicleForces(): void {
        this.vehicle.setSteeringValue(this.wheelSteering, 0);
        this.vehicle.setSteeringValue(this.wheelSteering, 1);
        this.vehicle.applyEngineForce(this.engineForce, 2);
        this.vehicle.applyEngineForce(this.engineForce, 3);
        for (let index = 0; index < 4; index += 1) this.vehicle.setBrake(this.brakeForce, index);
    }

    private updateWheelVisuals(): void {
        for (let index = 0; index < 4; index += 1) {
            this.vehicle.updateWheelTransform(index, true);
            const transform = this.vehicle.getWheelTransformWS(index);
            const position = transform.getOrigin();
            const rotation = transform.getRotation();
            this.wheelEntities[index].setPosition(position.x(), position.y(), position.z());
            this.wheelEntities[index].setRotation(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        }
    }

    private resetControlState(): void {
        this.steering = 0;
        this.wheelSteering = 0;
        this.engineForce = 0;
        this.brakeForce = 0;
        if (this.kart.rigidbody) {
            this.kart.rigidbody.linearVelocity = Vec3.ZERO;
            this.kart.rigidbody.angularVelocity = Vec3.ZERO;
        }
    }

    private findWheelEntities(): Entity[] {
        const wheels = this.kart.children.filter((child) => child.name.startsWith('wheel-')) as Entity[];
        const front = wheels
            .filter((wheel) => wheel.getLocalPosition().z < 0)
            .sort((a, b) => a.getLocalPosition().x - b.getLocalPosition().x);
        const rear = wheels
            .filter((wheel) => wheel.getLocalPosition().z >= 0)
            .sort((a, b) => a.getLocalPosition().x - b.getLocalPosition().x);
        return [...front, ...rear];
    }
}
