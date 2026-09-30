import type { Entity } from 'playcanvas';
import { Vec3 } from 'playcanvas';

import { DRIVERS } from './drivers';
import type { DriverDefinition } from './drivers';
import type { KartInput } from './input';
import { applyKartStyle, createKart, driveKart, KartController, teleportKart } from './kart';
import { KartAnimator } from './kart-animation';
import { RaceController } from './race';
import { RACE_LAYOUT } from './race-layout';

export type BotPersonalityId = 'paraderacer' | 'groessenwahnsinnig' | 'buerokrat';

export type BotPersonality = Readonly<{
    id: BotPersonalityId;
    label: string;
    laneOffset: number;
    lookAhead: number;
    throttle: number;
    cornerCaution: number;
    shortcutRisk: number;
}>;

export const BOT_PERSONALITIES: Readonly<Record<BotPersonalityId, BotPersonality>> = {
    paraderacer: {
        id: 'paraderacer',
        label: 'Paraderacer',
        laneOffset: 11,
        lookAhead: 24,
        throttle: 1,
        cornerCaution: 0.42,
        shortcutRisk: 0.05
    },
    groessenwahnsinnig: {
        id: 'groessenwahnsinnig',
        label: 'Größenwahnsinniger',
        laneOffset: -8,
        lookAhead: 13,
        throttle: 1,
        cornerCaution: 0.16,
        shortcutRisk: 0.9
    },
    buerokrat: {
        id: 'buerokrat',
        label: 'Bürokrat',
        laneOffset: 1,
        lookAhead: 19,
        throttle: 1,
        cornerCaution: 0.28,
        shortcutRisk: 0.35
    }
};

type BotRacer = {
    entity: Entity;
    driver: DriverDefinition;
    personality: BotPersonality;
    race: RaceController;
    controller: KartController;
    animator: KartAnimator;
    routeIndex: number;
    laneOffset: number;
    startPosition: Vec3;
    slowTimer: number;
    visionTimer: number;
    boostTimer: number;
    shieldTimer: number;
    stuckTimer: number;
    recoveryCooldown: number;
};

const ROUTE = [
    new Vec3(-105, 0, 65),
    new Vec3(120, 0, 65),
    new Vec3(218, 0, 48),
    new Vec3(255, 0, 0),
    new Vec3(218, 0, -48),
    new Vec3(105, 0, -65),
    new Vec3(-120, 0, -65),
    new Vec3(-218, 0, -48),
    new Vec3(-255, 0, 0),
    new Vec3(-218, 0, 48)
] as const;

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));

export class BotRaceManager {
    readonly racers: BotRacer[];
    private active = true;

    constructor(root: Entity, enabled = true) {
        if (!enabled) {
            this.racers = [];
            return;
        }
        const personalities: BotPersonalityId[] = [
            'paraderacer',
            'groessenwahnsinnig',
            'buerokrat',
            'paraderacer',
            'groessenwahnsinnig'
        ];
        this.racers = DRIVERS.slice(1, 6).map((driver, index) => {
            const entity = createKart(root, driver);
            entity.name = `bot-${driver.id}`;
            entity.setLocalScale(0.96, 0.96, 0.96);
            const row = Math.floor(index / 2) + 1;
            const startPosition = RACE_LAYOUT.startPosition
                .clone()
                .add(new Vec3(-row * 4.4, 0, index % 2 ? 4.2 : -4.2));
            teleportKart(entity, startPosition, RACE_LAYOUT.startYaw);
            const race = new RaceController();
            race.reset(entity);
            return {
                entity,
                driver,
                personality: BOT_PERSONALITIES[personalities[index]],
                race,
                controller: new KartController(36, 1.8),
                animator: new KartAnimator(entity),
                routeIndex: 0,
                laneOffset:
                    (index % 2 === 0 ? -1 : 1) * (16 + Math.floor(index / 2) * 2) +
                    BOT_PERSONALITIES[personalities[index]].laneOffset * 0.1,
                startPosition,
                slowTimer: 0,
                visionTimer: 0,
                boostTimer: 0,
                shieldTimer: 0,
                stuckTimer: 0,
                recoveryCooldown: 0
            };
        });
    }

    setActive(active: boolean): void {
        this.active = active;
        for (const racer of this.racers) racer.entity.enabled = active;
    }

    setPlayerDriver(driver: DriverDefinition): void {
        const opponents = DRIVERS.filter((candidate) => candidate.id !== driver.id);
        this.racers.forEach((racer, index) => {
            racer.driver = opponents[index];
            racer.entity.name = `bot-${racer.driver.id}`;
            applyKartStyle(racer.entity, racer.driver);
            racer.animator.reset();
        });
    }

    start(): void {
        for (const racer of this.racers) {
            teleportKart(racer.entity, racer.startPosition, RACE_LAYOUT.startYaw);
            racer.controller.reset();
            racer.animator.reset();
            racer.race.start(racer.entity);
            racer.routeIndex = 0;
            racer.slowTimer = 0;
            racer.visionTimer = 0;
            racer.boostTimer = 0;
            racer.shieldTimer = 0;
            racer.stuckTimer = 0;
            racer.recoveryCooldown = 0;
            racer.boostTimer = 0;
            racer.shieldTimer = 0;
        }
    }

    reset(): void {
        for (const racer of this.racers) {
            teleportKart(racer.entity, racer.startPosition, RACE_LAYOUT.startYaw);
            racer.controller.reset();
            racer.animator.reset();
            racer.race.reset(racer.entity);
            racer.routeIndex = 0;
            racer.slowTimer = 0;
            racer.visionTimer = 0;
            racer.stuckTimer = 0;
            racer.recoveryCooldown = 0;
        }
    }

    update(dt: number, paused: boolean): void {
        if (!this.active) return;
        for (const racer of this.racers) {
            racer.slowTimer = Math.max(0, racer.slowTimer - dt);
            racer.visionTimer = Math.max(0, racer.visionTimer - dt);
            racer.boostTimer = Math.max(0, racer.boostTimer - dt);
            racer.shieldTimer = Math.max(0, racer.shieldTimer - dt);
            racer.recoveryCooldown = Math.max(0, racer.recoveryCooldown - dt);
            if (paused) {
                driveKart(racer.controller, racer.entity, { steering: 0, throttle: 0, hop: false, drift: false }, dt);
                continue;
            }
            const input = racer.race.canDrive
                ? this.createInput(racer)
                : { steering: 0, throttle: 0, hop: false, drift: false };
            driveKart(racer.controller, racer.entity, input, dt, racer.boostTimer > 0 ? 4 : 0);
            racer.animator.update(
                racer.controller.getDebugSnapshot(racer.entity, input),
                dt,
                document.documentElement.classList.contains('reduced-effects')
            );
            const position = racer.entity.getPosition();
            if (
                !Number.isFinite(position.x) ||
                !Number.isFinite(position.y) ||
                !Number.isFinite(position.z) ||
                Math.abs(position.x) > 450 ||
                Math.abs(position.z) > 200 ||
                position.y < -8 ||
                position.y > 30
            ) {
                this.recoverRacer(racer);
                continue;
            }
            racer.race.update(racer.entity, dt);
            const speed = racer.entity.rigidbody?.linearVelocity.length() ?? 0;
            racer.stuckTimer =
                racer.race.canDrive && racer.slowTimer === 0 && speed < 0.9
                    ? racer.stuckTimer + dt
                    : Math.max(0, racer.stuckTimer - dt * 2);
            if (racer.stuckTimer > 3 && racer.recoveryCooldown === 0) this.recoverRacer(racer);
        }
    }

    nearestTarget(position: Vec3): Entity | null {
        let nearest: BotRacer | undefined;
        let distance = Number.POSITIVE_INFINITY;
        for (const racer of this.racers) {
            const candidate = racer.entity.getPosition().distance(position);
            if (candidate < distance) {
                nearest = racer;
                distance = candidate;
            }
        }
        return nearest?.entity ?? null;
    }

    applyHit(entity: Entity, duration = 2.4): boolean {
        const racer = this.racers.find((candidate) => candidate.entity === entity);
        if (!racer || racer.shieldTimer > 0) return false;
        racer.slowTimer = Math.max(racer.slowTimer, duration);
        return true;
    }

    grantBoost(entity: Entity, duration = 2): void {
        const racer = this.racers.find((candidate) => candidate.entity === entity);
        if (racer) racer.boostTimer = Math.max(racer.boostTimer, duration);
    }

    grantShield(entity: Entity, duration = 6): void {
        const racer = this.racers.find((candidate) => candidate.entity === entity);
        if (racer) racer.shieldTimer = Math.max(racer.shieldTimer, duration);
    }

    impairVision(duration = 3): void {
        for (const racer of this.racers) racer.visionTimer = Math.max(racer.visionTimer, duration);
    }

    playerPosition(player: Entity, playerRace: RaceController): number {
        if (!this.active) return 1;
        const entries = [playerRace.progress(player), ...this.racers.map((racer) => racer.race.progress(racer.entity))];
        return 1 + entries.slice(1).filter((progress) => progress > entries[0]).length;
    }

    snapshot() {
        if (!this.active) return [];
        return this.racers.map((racer) => {
            const position = racer.entity.getPosition();
            return {
                driver: racer.driver.id,
                personality: racer.personality.id,
                phase: racer.race.snapshot().phase,
                lap: racer.race.snapshot().lap,
                checkpoint: racer.race.snapshot().nextCheckpoint,
                routeIndex: racer.routeIndex,
                x: Number(position.x.toFixed(2)),
                z: Number(position.z.toFixed(2)),
                speed: Number((racer.entity.rigidbody?.linearVelocity.length() ?? 0).toFixed(2))
            };
        });
    }

    private createInput(racer: BotRacer): KartInput {
        const position = racer.entity.getPosition();
        let target = this.routeTarget(racer);
        if (position.distance(target) < racer.personality.lookAhead) {
            racer.routeIndex = (racer.routeIndex + 1) % ROUTE.length;
            target = this.routeTarget(racer);
        }
        const desired = target.clone().sub(position);
        desired.y = 0;
        desired.normalize();
        const forward = racer.entity.forward.clone();
        forward.y = 0;
        forward.normalize();
        const right = racer.entity.right.clone();
        right.y = 0;
        right.normalize();
        const steering = clamp(-desired.dot(right) * 2.8, -1, 1) * (racer.visionTimer > 0 ? 0.62 : 1);
        const alignment = clamp(forward.dot(desired), -1, 1);
        const cornerThrottle = 1 - Math.abs(steering) * racer.personality.cornerCaution * 0.4;
        return {
            steering,
            throttle:
                (alignment < -0.25 ? -0.45 : racer.personality.throttle * cornerThrottle) *
                (racer.slowTimer > 0 ? 0.38 : 1),
            hop: false,
            drift: Math.abs(steering) > 0.72 && alignment > 0.35 && racer.personality.shortcutRisk > 0.7
        };
    }

    private routeTarget(racer: BotRacer): Vec3 {
        const previous = ROUTE[(racer.routeIndex + ROUTE.length - 1) % ROUTE.length];
        const target = ROUTE[racer.routeIndex];
        const direction = target.clone().sub(previous);
        direction.y = 0;
        direction.normalize();
        return target.clone().add(new Vec3(-direction.z, 0, direction.x).mulScalar(racer.laneOffset));
    }

    private recoverRacer(racer: BotRacer): void {
        const previousIndex = (racer.routeIndex + ROUTE.length - 1) % ROUTE.length;
        const previous = ROUTE[previousIndex];
        const target = ROUTE[racer.routeIndex];
        const direction = target.clone().sub(previous).normalize();
        const lane = new Vec3(-direction.z, 0, direction.x).mulScalar(racer.laneOffset);
        const position = previous.clone().add(lane);
        position.y = 1.05;
        const yaw = (Math.atan2(-direction.x, -direction.z) * 180) / Math.PI;
        teleportKart(racer.entity, position, yaw);
        racer.controller.reset(yaw);
        racer.animator.reset();
        racer.race.resyncPosition(racer.entity);
        racer.stuckTimer = 0;
        racer.recoveryCooldown = 6;
    }
}
