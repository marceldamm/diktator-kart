import type { Entity } from 'playcanvas';
import { Vec3 } from 'playcanvas';

import { DRIVERS } from './drivers';
import type { DriverDefinition } from './drivers';
import type { KartInput } from './input';
import { createKart, driveKart, KartController, teleportKart } from './kart';
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
        throttle: 0.82,
        cornerCaution: 0.72,
        shortcutRisk: 0.05
    },
    groessenwahnsinnig: {
        id: 'groessenwahnsinnig',
        label: 'Größenwahnsinniger',
        laneOffset: -8,
        lookAhead: 13,
        throttle: 1,
        cornerCaution: 0.28,
        shortcutRisk: 0.9
    },
    buerokrat: {
        id: 'buerokrat',
        label: 'Bürokrat',
        laneOffset: 1,
        lookAhead: 19,
        throttle: 0.9,
        cornerCaution: 0.5,
        shortcutRisk: 0.35
    }
};

type BotRacer = {
    entity: Entity;
    driver: DriverDefinition;
    personality: BotPersonality;
    race: RaceController;
    controller: KartController;
    routeIndex: number;
    startPosition: Vec3;
};

const ROUTE = [
    new Vec3(-110, 0, 64),
    new Vec3(120, 0, 64),
    new Vec3(218, 0, 58),
    new Vec3(220, 0, -88),
    new Vec3(110, 0, -66),
    new Vec3(-120, 0, -66),
    new Vec3(-242, 0, -58),
    new Vec3(-242, 0, 64)
] as const;

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));

export class BotRaceManager {
    readonly racers: BotRacer[];

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
                controller: new KartController(),
                routeIndex: 0,
                startPosition
            };
        });
    }

    start(): void {
        for (const racer of this.racers) {
            teleportKart(racer.entity, racer.startPosition, RACE_LAYOUT.startYaw);
            racer.controller.reset();
            racer.race.start(racer.entity);
            racer.routeIndex = 0;
        }
    }

    reset(): void {
        for (const racer of this.racers) {
            teleportKart(racer.entity, racer.startPosition, RACE_LAYOUT.startYaw);
            racer.controller.reset();
            racer.race.reset(racer.entity);
            racer.routeIndex = 0;
        }
    }

    update(dt: number, paused: boolean): void {
        for (const racer of this.racers) {
            if (paused) {
                driveKart(racer.controller, racer.entity, { steering: 0, throttle: 0, hop: false, drift: false }, dt);
                continue;
            }
            const input = racer.race.canDrive
                ? this.createInput(racer)
                : { steering: 0, throttle: 0, hop: false, drift: false };
            driveKart(racer.controller, racer.entity, input, dt);
            racer.race.update(racer.entity, dt);
        }
    }

    playerPosition(player: Entity, playerRace: RaceController): number {
        const entries = [playerRace.progress(player), ...this.racers.map((racer) => racer.race.progress(racer.entity))];
        return 1 + entries.slice(1).filter((progress) => progress > entries[0]).length;
    }

    snapshot() {
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
        let target = ROUTE[racer.routeIndex];
        if (position.distance(target) < racer.personality.lookAhead) {
            racer.routeIndex = (racer.routeIndex + 1) % ROUTE.length;
            target = ROUTE[racer.routeIndex];
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
        const steering = clamp(-desired.dot(right) * 2.8, -1, 1);
        const alignment = clamp(forward.dot(desired), -1, 1);
        const cornerThrottle = 1 - Math.abs(steering) * racer.personality.cornerCaution * 0.4;
        return {
            steering,
            throttle: alignment < -0.25 ? -0.45 : racer.personality.throttle * cornerThrottle,
            hop: false,
            drift: Math.abs(steering) > 0.72 && alignment > 0.35 && racer.personality.shortcutRisk > 0.7
        };
    }
}
