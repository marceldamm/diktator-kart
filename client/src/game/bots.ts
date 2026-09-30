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
        lookAhead: 18,
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
        lookAhead: 16,
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
    previousPosition: Vec3;
    stuckTimer: number;
    recoveryTimer: number;
    recoveryDirection: number;
};

const ROUTE = [
    new Vec3(-110, 0, 64),
    new Vec3(120, 0, 64),
    new Vec3(176, 0, 78),
    new Vec3(218, 0, 78),
    new Vec3(260, 0, 44),
    new Vec3(260, 0, -26),
    new Vec3(220, 0, -66),
    new Vec3(220, 0, -88),
    new Vec3(110, 0, -66),
    new Vec3(-120, 0, -66),
    new Vec3(-242, 0, -58),
    new Vec3(-242, 0, 64)
] as const;

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));
const PAPER_RAMP_SAFE_NORTH_Z = 78;
const CATCH_UP_GAP_DEADZONE = 0.02;
const MAX_CATCH_UP_SPEED_BONUS = 50;

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
                .add(new Vec3(-row * 7.5, 0, index % 2 ? 6.2 : -6.2));
            teleportKart(entity, startPosition, RACE_LAYOUT.startYaw);
            const race = new RaceController();
            race.reset(entity);
            return {
                entity,
                driver,
                personality: BOT_PERSONALITIES[personalities[index]],
                race,
                controller: new KartController(140, 6, 4.2),
                animator: new KartAnimator(entity),
                routeIndex: 0,
                laneOffset:
                    (index % 2 === 0 ? -1 : 1) * (5 + Math.floor(index / 2) * 1.5) +
                    BOT_PERSONALITIES[personalities[index]].laneOffset * 0.15,
                startPosition,
                slowTimer: 0,
                visionTimer: 0,
                boostTimer: 0,
                shieldTimer: 0,
                previousPosition: startPosition.clone(),
                stuckTimer: 0,
                recoveryTimer: 0,
                recoveryDirection: index % 2 === 0 ? 1 : -1
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
            racer.previousPosition.copy(racer.startPosition);
            racer.stuckTimer = 0;
            racer.recoveryTimer = 0;
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
            racer.boostTimer = 0;
            racer.shieldTimer = 0;
            racer.previousPosition.copy(racer.startPosition);
            racer.stuckTimer = 0;
            racer.recoveryTimer = 0;
        }
    }

    update(dt: number, paused: boolean, player: Entity, playerRace: RaceController): void {
        if (!this.active) return;
        for (const racer of this.racers) {
            racer.slowTimer = Math.max(0, racer.slowTimer - dt);
            racer.visionTimer = Math.max(0, racer.visionTimer - dt);
            racer.boostTimer = Math.max(0, racer.boostTimer - dt);
            racer.shieldTimer = Math.max(0, racer.shieldTimer - dt);
            if (paused) {
                racer.previousPosition.copy(racer.entity.getPosition());
                driveKart(racer.controller, racer.entity, { steering: 0, throttle: 0, hop: false, drift: false }, dt);
                continue;
            }
            const position = racer.entity.getPosition();
            if (racer.race.canDrive) {
                const movement = position.distance(racer.previousPosition);
                racer.stuckTimer = movement < dt * 3.5 ? racer.stuckTimer + dt : 0;
                if (racer.stuckTimer >= 1 && racer.recoveryTimer === 0) {
                    racer.stuckTimer = 0;
                    racer.recoveryTimer = 1.6;
                    racer.recoveryDirection *= -1;
                }
            } else {
                racer.stuckTimer = 0;
            }
            racer.previousPosition.copy(position);
            racer.recoveryTimer = Math.max(0, racer.recoveryTimer - dt);
            const input = !racer.race.canDrive
                ? { steering: 0, throttle: 0, hop: false, drift: false }
                : racer.recoveryTimer > 0
                  ? { steering: racer.recoveryDirection * 0.8, throttle: -1, hop: false, drift: false }
                                    : this.createInput(racer, player, playerRace);
            const itemBoost = racer.boostTimer > 0 ? 4 : 0;
            const catchUpBoost = racer.race.canDrive ? this.catchUpSpeedBonus(racer, player, playerRace) : 0;
            driveKart(racer.controller, racer.entity, input, dt, Math.max(itemBoost, catchUpBoost));
            racer.animator.update(
                racer.controller.getDebugSnapshot(racer.entity, input),
                dt,
                document.documentElement.classList.contains('reduced-effects')
            );
            racer.race.update(racer.entity, dt);
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
                speed: Number((racer.entity.rigidbody?.linearVelocity.length() ?? 0).toFixed(2)),
                slowed: racer.slowTimer > 0,
                stuckFor: Number(racer.stuckTimer.toFixed(2)),
                recovering: racer.recoveryTimer > 0
            };
        });
    }

    private createInput(racer: BotRacer, player: Entity, playerRace: RaceController): KartInput {
        const position = racer.entity.getPosition();
        const velocity = racer.entity.rigidbody?.linearVelocity;
        const lookAhead = Math.max(
            racer.personality.lookAhead,
            (velocity ? Math.hypot(velocity.x, velocity.z) : 0) * 0.16
        );
        let routeTarget = this.routeTarget(racer);
        const routeDirection = routeTarget.clone().sub(ROUTE[(racer.routeIndex + ROUTE.length - 1) % ROUTE.length]);
        routeDirection.y = 0;
        routeDirection.normalize();
        const passedTarget = routeTarget.clone().sub(position).dot(routeDirection) < 0;
        if (position.distance(routeTarget) < lookAhead || passedTarget) {
            racer.routeIndex = (racer.routeIndex + 1) % ROUTE.length;
            routeTarget = this.routeTarget(racer);
        }
        const overtakeTarget = this.overtakeTarget(racer, player, playerRace);
        const target = overtakeTarget ?? routeTarget;
        const desired = target.clone().sub(position);
        desired.y = 0;
        desired.normalize();
        for (const other of this.racers) {
            if (other === racer) continue;
            const separation = position.clone().sub(other.entity.getPosition());
            separation.y = 0;
            const distance = separation.length();
            if (distance > 0.1 && distance < 9) {
                desired.add(separation.normalize().mulScalar((9 - distance) / 9));
            }
        }
        if (!overtakeTarget) {
            const separation = position.clone().sub(player.getPosition());
            separation.y = 0;
            const distance = separation.length();
            if (distance > 0.1 && distance < 10) {
                desired.add(separation.normalize().mulScalar((10 - distance) / 10));
            }
        }
        desired.normalize();
        const forward = racer.entity.forward.clone();
        forward.y = 0;
        forward.normalize();
        const right = racer.entity.right.clone();
        right.y = 0;
        right.normalize();
        const alignment = clamp(forward.dot(desired), -1, 1);
        const angle = Math.atan2(desired.dot(right), alignment);
        const steering = clamp((-angle / 0.82) * 1.35, -1, 1) * (racer.visionTimer > 0 ? 0.72 : 1);
        const cornerThrottle = clamp(1 - Math.abs(angle) * racer.personality.cornerCaution * 0.45, 0.58, 1);
        return {
            steering,
            throttle: racer.personality.throttle * cornerThrottle * (racer.slowTimer > 0 ? 0.38 : 1),
            hop: false,
            drift: Math.abs(steering) > 0.72 && alignment > 0.35 && racer.personality.shortcutRisk > 0.7
        };
    }

    private overtakeTarget(racer: BotRacer, player: Entity, playerRace: RaceController): Vec3 | null {
        const progressGap = playerRace.progress(player) - racer.race.progress(racer.entity);
        if (progressGap <= 0.02) return null;

        const playerPosition = player.getPosition().clone();
        const toPlayer = playerPosition.clone().sub(racer.entity.getPosition());
        toPlayer.y = 0;
        const distance = toPlayer.length();
        if (distance > 45) return null;

        const forward = player.forward.clone();
        forward.y = 0;
        forward.normalize();
        const right = player.right.clone();
        right.y = 0;
        right.normalize();
        const ahead = toPlayer.dot(forward);
        const sideDistance = Math.abs(toPlayer.dot(right));
        if (ahead < 0.5 || ahead > 40 || sideDistance > 17) return null;

        const passingSide = racer.laneOffset < 0 ? -1 : 1;
        return playerPosition.add(forward.mulScalar(14)).add(right.mulScalar(passingSide * 8));
    }

    private routeTarget(racer: BotRacer): Vec3 {
        const previous = ROUTE[(racer.routeIndex + ROUTE.length - 1) % ROUTE.length];
        const target = ROUTE[racer.routeIndex];
        const direction = target.clone().sub(previous);
        direction.y = 0;
        direction.normalize();
        const laneTarget = target.clone().add(new Vec3(-direction.z, 0, direction.x).mulScalar(racer.laneOffset));
        if (racer.routeIndex >= 1 && racer.routeIndex <= 3 && laneTarget.x >= 120 && laneTarget.x <= 218) {
            laneTarget.z = Math.max(laneTarget.z, PAPER_RAMP_SAFE_NORTH_Z);
        }
        return laneTarget;
    }

    private catchUpSpeedBonus(racer: BotRacer, player: Entity, playerRace: RaceController): number {
        const progressGap = playerRace.progress(player) - racer.race.progress(racer.entity);
        return clamp((progressGap - CATCH_UP_GAP_DEADZONE) * 42, 0, MAX_CATCH_UP_SPEED_BONUS);
    }
}
