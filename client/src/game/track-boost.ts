import { Vec3 } from 'playcanvas';
import type { Entity } from 'playcanvas';

export type TrackBoostPad = Readonly<{
    position: Vec3;
    size: Vec3;
}>;

export const TRACK_BOOST_PADS: readonly TrackBoostPad[] = [
    { position: new Vec3(-34, 0.07, 66), size: new Vec3(14, 0.08, 24) },
    { position: new Vec3(54, 0.07, 66), size: new Vec3(14, 0.08, 24) },
    { position: new Vec3(34, 0.07, -66), size: new Vec3(14, 0.08, 24) },
    { position: new Vec3(-54, 0.07, -66), size: new Vec3(14, 0.08, 24) }
] as const;

export const TRACK_OBSTACLES: readonly Vec3[] = [
    new Vec3(-78, 0.5, 58),
    new Vec3(-4, 0.5, 58),
    new Vec3(78, 0.5, 58),
    new Vec3(-78, 0.5, -58),
    new Vec3(-4, 0.5, -58),
    new Vec3(78, 0.5, -58)
] as const;

const isOnPad = (position: Vec3, pad: TrackBoostPad): boolean =>
    Math.abs(position.x - pad.position.x) <= pad.size.x / 2 + 1.2 &&
    Math.abs(position.z - pad.position.z) <= pad.size.z / 2 + 1.2;

export class TrackBoostSystem {
    private readonly cooldowns = new Map<Entity, number>();
    private readonly grantBoost: (entity: Entity, duration: number) => void;

    constructor(grantBoost: (entity: Entity, duration: number) => void) {
        this.grantBoost = grantBoost;
    }

    reset(): void {
        this.cooldowns.clear();
    }

    update(entities: readonly Entity[], dt: number, active: boolean): void {
        if (!active) return;
        for (const [entity, cooldown] of this.cooldowns) {
            const remaining = Math.max(0, cooldown - dt);
            if (remaining === 0) this.cooldowns.delete(entity);
            else this.cooldowns.set(entity, remaining);
        }
        for (const entity of entities) {
            if (!entity.enabled || this.cooldowns.has(entity)) continue;
            const position = entity.getPosition();
            if (TRACK_BOOST_PADS.some((pad) => isOnPad(position, pad))) {
                this.cooldowns.set(entity, 1.15);
                this.grantBoost(entity, 4);
            }
        }
    }
}

export class TrackObstacleSystem {
    private readonly cooldowns = new Map<Entity, number>();

    reset(): void {
        this.cooldowns.clear();
    }

    update(entities: readonly Entity[], dt: number, active: boolean): void {
        if (!active) return;
        for (const [entity, cooldown] of this.cooldowns) {
            const remaining = Math.max(0, cooldown - dt);
            if (remaining === 0) this.cooldowns.delete(entity);
            else this.cooldowns.set(entity, remaining);
        }
        for (const entity of entities) {
            if (!entity.enabled || this.cooldowns.has(entity) || !entity.rigidbody) continue;
            const position = entity.getPosition();
            const obstacle = TRACK_OBSTACLES.find((candidate) => {
                const distance = position.clone().sub(candidate);
                distance.y = 0;
                return distance.length() < 2.15;
            });
            if (!obstacle) continue;
            const push = position.clone().sub(obstacle);
            push.y = 0;
            if (push.length() < 0.01) push.copy(entity.forward);
            push.normalize();
            const mass = entity.rigidbody.mass;
            entity.rigidbody.applyImpulse(push.x * mass * 9, 1.5 * mass, push.z * mass * 9);
            this.cooldowns.set(entity, 0.65);
        }
    }
}
