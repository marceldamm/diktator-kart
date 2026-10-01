import { Color, Entity, StandardMaterial, Vec3 } from 'playcanvas';

import type { BotRaceManager } from './bots';

export type ItemId =
    | 'propaganda'
    | 'red-folder'
    | 'statue'
    | 'censor'
    | 'secret-police'
    | 'economic-plan'
    | 'duty-rocket'
    | 'immunity'
    | 'forged-election';

type ItemDefinition = Readonly<{ id: ItemId; name: string; icon: string; color: string }>;
type Pickup = { entity: Entity; cooldown: number };
type Projectile = {
    entity: Entity;
    velocity: Vec3;
    target: Entity | null;
    hostile: boolean;
    spinOnHit: boolean;
    life: number;
};
type Flyer = { entity: Entity; life: number; drift: number };
type BotInventory = { item: ItemDefinition | null; cursor: number; heldTimer: number };

export const ITEMS: readonly ItemDefinition[] = [
    { id: 'propaganda', name: 'Propaganda-Flut', icon: '📣', color: '#ed334b' },
    { id: 'red-folder', name: 'Rote Akte', icon: '📕', color: '#e83732' },
    { id: 'statue', name: 'Heldenstatue', icon: '🗿', color: '#b9b2a3' },
    { id: 'censor', name: 'Zensurbalken', icon: '▰', color: '#16191e' },
    { id: 'secret-police', name: 'Geheimpolizei', icon: '🕶️', color: '#6f66df' },
    { id: 'economic-plan', name: 'Fünfjahresplan', icon: '📈', color: '#e9c434' },
    { id: 'duty-rocket', name: 'Dienstweg-Rakete', icon: '🚀', color: '#f26b2c' },
    { id: 'immunity', name: 'Diplomatische Immunität', icon: '🛡️', color: '#45d9d0' },
    { id: 'forged-election', name: 'Gefälschtes Wahlergebnis', icon: '🗳️', color: '#f0c84b' }
] as const;

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));

const itemWeight = (item: ItemId, comeback: number): number => {
    const offensive = item === 'propaganda' || item === 'red-folder' || item === 'secret-police' || item === 'duty-rocket';
    return offensive ? 0.55 + comeback * 2.2 : 1.35 - comeback * 0.35;
};

export const selectItemForPosition = (position: number, racers: number, roll = Math.random()): ItemDefinition => {
    const comeback = clamp((position - 1) / Math.max(1, racers - 1), 0, 1);
    const totalWeight = ITEMS.reduce((total, item) => total + itemWeight(item.id, comeback), 0);
    let target = clamp(roll, 0, 0.999999) * totalWeight;
    for (const item of ITEMS) {
        target -= itemWeight(item.id, comeback);
        if (target <= 0) return item;
    }
    return ITEMS[ITEMS.length - 1];
};

const PICKUP_POSITIONS = [
    new Vec3(-122, 1.5, 66),
    new Vec3(28, 1.5, 66),
    new Vec3(214, 1.5, 40),
    new Vec3(218, 1.5, -70),
    new Vec3(54, 1.5, -66),
    new Vec3(-116, 1.5, -66),
    new Vec3(-240, 1.5, -36),
    new Vec3(-240, 1.5, 82)
] as const;

const material = (hex: string) => {
    const value = hex.replace('#', '');
    const color = new Color(
        Number.parseInt(value.slice(0, 2), 16) / 255,
        Number.parseInt(value.slice(2, 4), 16) / 255,
        Number.parseInt(value.slice(4, 6), 16) / 255
    );
    const result = new StandardMaterial();
    result.diffuse = color;
    result.emissive = color.clone().mulScalar(0.35);
    result.gloss = 0.75;
    result.update();
    return result;
};

export class ItemSystem {
    private readonly statues: { entity: Entity; life: number }[] = [];
    private readonly flyers: Flyer[] = [];
    private readonly root: Entity;
    private readonly bots: BotRaceManager;
    private readonly grantBoost: (duration?: number, strength?: number) => void;
    private readonly announce: (event: ItemId | 'pickup' | 'shielded' | 'hit') => void;
    private readonly pickups: Pickup[];
    private readonly projectiles: Projectile[] = [];
    private readonly botInventories: Map<Entity, BotInventory>;
    private readonly slot: HTMLElement;
    private readonly notice: HTMLElement;
    private readonly shield: HTMLElement;
    private readonly visionBlock: HTMLElement;
    private readonly flyerOverlay: HTMLElement;
    private inventory: ItemDefinition | null = null;
    private noticeTimer = 0;
    private shieldTimer = 0;
    private slowTimer = 0;
    private planBoostTimer = 0;
    private planPenaltyTimer = 0;
    private playerVisionTimer = 0;
    private playerFlyerTimer = 0;
    private playerSpinTimer = 0;
    private active = true;

    constructor(
        root: Entity,
        bots: BotRaceManager,
        grantBoost: (duration?: number, strength?: number) => void,
        announce: (event: ItemId | 'pickup' | 'shielded' | 'hit') => void
    ) {
        this.root = root;
        this.bots = bots;
        this.grantBoost = grantBoost;
        this.announce = announce;
        this.pickups = PICKUP_POSITIONS.map((position, index) => {
            const entity = new Entity(`item-box-${index}`);
            entity.setPosition(position);
            entity.setLocalScale(1.25, 1.25, 1.25);
            entity.addComponent('render', { type: 'box', material: material(index % 2 ? '#e9c434' : '#45d9d0') });
            root.addChild(entity);
            return { entity, cooldown: 0 };
        });
        this.botInventories = new Map(
            bots.racers.map((racer) => [racer.entity, { item: null, cursor: 0, heldTimer: 0 }])
        );
        document.body.insertAdjacentHTML(
            'beforeend',
            '<aside class="item-hud"><div class="item-slot" id="item-slot"><b>—</b><span>KEIN ITEM</span><small>E einsetzen</small></div><div class="item-shield" id="item-shield">DIPLOMATISCH GESCHÜTZT</div></aside><div class="item-notice" id="item-notice"></div><div class="item-vision-block" id="item-vision-block" aria-hidden="true"><strong>ACHTUNG, SICHT EINGESCHRÄNKT.</strong><span>Der Diktator sieht sich selbst schon genug.</span></div><div class="item-flyer-overlay" id="item-flyer-overlay" aria-hidden="true"><span>VOLKSEIGENE WAHRHEIT</span><span>WÄHLEN SIE DIE RICHTIGE SICHT</span><span>OFFIZIELLE MITTEILUNG</span><span>KEINE FRAGEN</span></div>'
        );
        this.slot = document.getElementById('item-slot')!;
        this.notice = document.getElementById('item-notice')!;
        this.shield = document.getElementById('item-shield')!;
        this.visionBlock = document.getElementById('item-vision-block')!;
        this.flyerOverlay = document.getElementById('item-flyer-overlay')!;
        this.renderHud();
    }

    get playerPowerScale(): number {
        if (this.slowTimer > 0) return 0.42;
        if (this.planPenaltyTimer > 0) return 0.65;
        return 1;
    }

    setActive(active: boolean): void {
        this.active = active;
        document.querySelector('.item-hud')?.classList.toggle('is-hidden', !active);
        for (const pickup of this.pickups) pickup.entity.enabled = active && pickup.cooldown === 0;
    }

    grantShield(duration = 5): void {
        this.shieldTimer = Math.max(this.shieldTimer, duration);
        this.say('🛡️ Sonderimmunität aktiv');
    }

    reset(): void {
        for (const statue of this.statues) statue.entity.destroy();
        this.statues.length = 0;
        for (const flyer of this.flyers) flyer.entity.destroy();
        this.flyers.length = 0;
        this.inventory = null;
        this.noticeTimer = 0;
        this.shieldTimer = 0;
        this.slowTimer = 0;
        this.planBoostTimer = 0;
        this.planPenaltyTimer = 0;
            this.playerVisionTimer = 0;
            this.playerFlyerTimer = 0;
            this.playerSpinTimer = 0;
            this.visionBlock.classList.remove('is-visible');
            this.flyerOverlay.classList.remove('is-visible');
        for (const inventory of this.botInventories.values()) {
            inventory.item = null;
            inventory.cursor = 0;
            inventory.heldTimer = 0;
        }
        for (const pickup of this.pickups) {
            pickup.cooldown = 0;
            pickup.entity.enabled = this.active;
        }
        for (const projectile of this.projectiles) projectile.entity.destroy();
        this.projectiles.length = 0;
        this.renderHud();
    }

    update(player: Entity, dt: number, active: boolean, playerPosition = 1, racers = 1): void {
        if (!active || !this.active) return;
        for (let index = this.statues.length - 1; index >= 0; index -= 1) {
            const statue = this.statues[index];
            statue.life -= dt;
            if (statue.life <= 0) {
                statue.entity.destroy();
                this.statues.splice(index, 1);
            }
        }
        this.noticeTimer = Math.max(0, this.noticeTimer - dt);
        this.shieldTimer = Math.max(0, this.shieldTimer - dt);
        this.slowTimer = Math.max(0, this.slowTimer - dt);
            this.playerVisionTimer = Math.max(0, this.playerVisionTimer - dt);
            this.playerFlyerTimer = Math.max(0, this.playerFlyerTimer - dt);
            this.playerSpinTimer = Math.max(0, this.playerSpinTimer - dt);
            if (this.playerSpinTimer > 0) player.rotate(0, 720 * dt, 0);
        const boostWasActive = this.planBoostTimer > 0;
        this.planBoostTimer = Math.max(0, this.planBoostTimer - dt);
        if (boostWasActive && this.planBoostTimer === 0) this.planPenaltyTimer = 3.8;
        this.planPenaltyTimer = Math.max(0, this.planPenaltyTimer - dt);
        this.notice.classList.toggle('is-visible', this.noticeTimer > 0);
        this.shield.classList.toggle('is-visible', this.shieldTimer > 0);
                this.visionBlock.classList.toggle('is-visible', this.playerVisionTimer > 0);
                this.flyerOverlay.classList.toggle('is-visible', this.playerFlyerTimer > 0);
                for (let index = this.flyers.length - 1; index >= 0; index -= 1) {
                    const flyer = this.flyers[index];
                    flyer.life -= dt;
                    flyer.entity.rotate(0, 180 * dt, flyer.drift * dt);
                    flyer.entity.translate(0, -dt * 0.7, 0);
                    if (flyer.life <= 0) {
                        flyer.entity.destroy();
                        this.flyers.splice(index, 1);
                    }
                }
        if (!active || !this.active) return;

        for (const pickup of this.pickups) {
            pickup.entity.rotate(0, 90 * dt, 45 * dt);
            pickup.cooldown = Math.max(0, pickup.cooldown - dt);
            if (pickup.cooldown === 0) pickup.entity.enabled = true;
            if (
                !this.inventory &&
                pickup.entity.enabled &&
                pickup.entity.getPosition().distance(player.getPosition()) < 4
            ) {
                this.inventory = selectItemForPosition(playerPosition, racers);
                pickup.cooldown = 7;
                pickup.entity.enabled = false;
                this.say(`${this.inventory.icon} ${this.inventory.name} eingesammelt`);
                this.announce('pickup');
                this.renderHud();
            }
        }

        this.updateBotItems(player, dt);
        this.updateProjectiles(player, dt);
    }

    use(player: Entity): void {
        if (!this.inventory) {
            this.say('Erst eine Versorgungskiste einsammeln.');
            return;
        }
        const item = this.inventory;
        this.inventory = null;
        this.announce(item.id);
        switch (item.id) {
            case 'propaganda':
            case 'censor':
                this.bots.impairVision(item.id === 'censor' ? 4.5 : 3.2);
                if (item.id === 'propaganda') this.spawnFlyers(player);
                this.say(
                    item.id === 'censor' ? '▰ Faktenlage erfolgreich geschwärzt' : '📣 Sicht der Gegner überflutet'
                );
                break;
            case 'red-folder': {
                const target = this.bots.randomTarget();
                if (target) this.bots.applyHit(target, 3.2);
                this.say('📕 Sonderprüfung angeordnet');
                break;
            }
            case 'statue':
                this.dropStatue(player);
                this.say('🗿 Denkmal spontan genehmigt');
                break;
            case 'secret-police':
                this.spawnProjectile(
                    player
                        .getPosition()
                        .clone()
                        .add(new Vec3(0, 1, 0)),
                    this.bots.nearestTarget(player.getPosition()),
                    false,
                    true,
                    undefined,
                    true
                );
                this.say('🕶️ Zielperson wird diskret verfolgt');
                break;
            case 'economic-plan':
                this.grantBoost(3.8, 1.25);
                this.planBoostTimer = 3.8;
                this.say('📈 Soll erfüllt! Realität folgt später.');
                break;
            case 'duty-rocket':
                this.spawnProjectile(
                    player
                        .getPosition()
                        .clone()
                        .add(new Vec3(0, 1, 0)),
                    this.bots.leaderTarget(),
                    false,
                    true,
                    player.forward
                );
                this.say('🚀 Dienstweg eröffnet');
                break;
            case 'immunity':
                this.shieldTimer = 8;
                this.say('🛡️ Diplomatische Immunität aktiv');
                break;
            case 'forged-election':
                this.grantBoost(8, 1.8);
                this.shieldTimer = 8;
                this.say('🗳️ Wahlergebnis bestätigt: acht Sekunden Unantastbarkeit');
                break;
        }
        this.renderHud();
    }

    private updateBotItems(player: Entity, dt: number): void {
        for (const [botIndex, racer] of this.bots.racers.entries()) {
            const inventory = this.botInventories.get(racer.entity);
            if (!inventory || !racer.race.canDrive) continue;

            const botPosition = racer.entity.getPosition();
            if (!inventory.item) {
                const pickup = this.pickups.find(
                    (candidate) => candidate.entity.enabled && candidate.entity.getPosition().distance(botPosition) < 24
                );
                if (pickup) {
                    inventory.item = ITEMS[(botIndex + inventory.cursor) % ITEMS.length];
                    inventory.cursor += 1;
                    inventory.heldTimer = 0;
                    pickup.cooldown = 7;
                    pickup.entity.enabled = false;
                }
            }
            if (!inventory.item) continue;
            inventory.heldTimer += dt;

            const toPlayer = player.getPosition().clone().sub(botPosition);
            const distance = toPlayer.length();
            if (distance > 0) toPlayer.normalize();
            const facing = racer.entity.forward.dot(toPlayer);
            const item = inventory.item;
            const canAttack = distance < 95;
            const shouldUse = (() => {
                switch (item.id) {
                    case 'economic-plan':
                        return true;
                    case 'immunity':
                        return distance < 45 || inventory.heldTimer > 8;
                    case 'statue':
                        return (facing < -0.25 && distance < 30) || (inventory.heldTimer > 12 && distance < 80);
                    case 'duty-rocket':
                        return (
                            (facing > 0.72 && distance < 65) ||
                            (inventory.heldTimer > 10 && facing > 0.25 && distance < 150)
                        );
                    case 'secret-police':
                        return canAttack || (inventory.heldTimer > 10 && distance < 170);
                    case 'propaganda':
                    case 'red-folder':
                    case 'censor':
                        return distance < 70 || (inventory.heldTimer > 8 && canAttack);
                }
            })();
            if (!shouldUse) continue;

            inventory.item = null;
            inventory.heldTimer = 0;
            this.announce(item.id);
            switch (item.id) {
                case 'propaganda':
                    this.hitPlayer(3.2);
                    this.playerFlyerTimer = 3.2;
                    break;
                case 'red-folder':
                    this.hitPlayer(3.2);
                    break;
                case 'censor':
                    this.hitPlayer(4.5);
                    this.playerVisionTimer = 4.5;
                    break;
                case 'statue':
                    this.dropStatue(racer.entity);
                    break;
                case 'secret-police':
                    this.spawnProjectile(
                        botPosition.clone().add(new Vec3(0, 1, 0)),
                        player,
                        true,
                        true,
                        undefined,
                        true
                    );
                    break;
                case 'economic-plan':
                    this.bots.grantBoost(racer.entity, 3.8);
                    break;
                case 'duty-rocket':
                    this.spawnProjectile(
                        botPosition.clone().add(racer.entity.forward.clone().add(new Vec3(0, 1, 0))),
                        player,
                        true,
                        true,
                        racer.entity.forward,
                        false
                    );
                    break;
                case 'immunity':
                    this.bots.grantShield(racer.entity, 8);
                    break;
                case 'forged-election':
                    this.bots.grantBoost(racer.entity, 8);
                    this.bots.grantShield(racer.entity, 8);
                    break;
            }
        }
    }

    private spawnProjectile(
        origin: Vec3,
        target: Entity | null,
        hostile: boolean,
        homing: boolean,
        direction?: Vec3,
        spinOnHit = false
    ) {
        const entity = new Entity(hostile ? 'incoming-rocket' : 'item-projectile');
        entity.setPosition(origin);
        entity.setLocalScale(0.65, 0.65, 1.5);
        entity.addComponent('render', { type: 'cone', material: material(hostile ? '#ff334f' : '#f6c83f') });
        this.root.addChild(entity);
        const velocity = direction?.clone().normalize().mulScalar(46) ?? new Vec3();
        this.projectiles.push({ entity, velocity, target: homing ? target : null, hostile, spinOnHit, life: 5 });
    }

    private updateProjectiles(player: Entity, dt: number): void {
        for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
            const shot = this.projectiles[index];
            shot.life -= dt;
            if (shot.target) {
                const desired = shot.target
                    .getPosition()
                    .clone()
                    .sub(shot.entity.getPosition())
                    .normalize()
                    .mulScalar(34);
                shot.velocity.lerp(shot.velocity, desired, Math.min(1, dt * 3.5));
            }
            shot.entity.setPosition(shot.entity.getPosition().add(shot.velocity.clone().mulScalar(dt)));
            shot.entity.lookAt(shot.entity.getPosition().clone().add(shot.velocity));
            let target = shot.hostile ? player : shot.target;
            if (!shot.hostile && !target) {
                target =
                    this.bots.racers.find(
                        (racer) => shot.entity.getPosition().distance(racer.entity.getPosition()) < 3.2
                    )?.entity ?? null;
            }
            if (target && shot.entity.getPosition().distance(target.getPosition()) < 3.2) {
                if (shot.hostile) this.hitPlayer(shot.spinOnHit ? 4 : 3, shot.spinOnHit);
                else this.bots.applyHit(target, shot.spinOnHit ? 4 : 2.8, shot.spinOnHit);
                shot.life = 0;
            }
            if (shot.life <= 0) {
                shot.entity.destroy();
                this.projectiles.splice(index, 1);
            }
        }
    }

    private hitPlayer(duration = 3, spin = false): void {
        if (this.shieldTimer > 0) {
            this.shieldTimer = 0;
            this.say('🛡️ Angriff diplomatisch zurückgewiesen');
            this.announce('shielded');
        } else {
            this.slowTimer = duration;
            if (spin) this.playerSpinTimer = 0.8;
            this.say('💥 Verwaltungsakt zugestellt');
            this.announce('hit');
        }
    }

    private dropStatue(player: Entity): void {
        const statue = new Entity('temporary-statue');
        statue.setPosition(
            player
                .getPosition()
                .clone()
                .sub(player.forward.clone().mulScalar(5))
                .add(new Vec3(0, 1.4, 0))
        );
        statue.setLocalScale(1.8, 2.8, 1.8);
        statue.addComponent('collision', { type: 'cylinder', radius: 0.9, height: 2.8 });
        statue.addComponent('rigidbody', { type: 'static' });
        const addPart = (
            name: string,
            type: 'box' | 'cylinder' | 'sphere',
            position: Vec3,
            scale: Vec3,
            color: string
        ) => {
            const part = new Entity(name);
            part.setLocalPosition(position);
            part.setLocalScale(scale);
            part.addComponent('render', { type, material: material(color) });
            statue.addChild(part);
        };
        addPart('statue-uniform', 'cylinder', new Vec3(0, 0.7, 0), new Vec3(0.9, 1.4, 0.9), '#6e7471');
        addPart('statue-head', 'sphere', new Vec3(0, 1.85, 0), new Vec3(0.65, 0.65, 0.65), '#a9a89e');
        addPart('statue-hat', 'box', new Vec3(0, 2.25, 0), new Vec3(0.9, 0.18, 0.75), '#242a2b');
        addPart('statue-brim', 'box', new Vec3(0, 2.12, -0.04), new Vec3(1.1, 0.1, 0.8), '#242a2b');
        addPart('statue-sash', 'box', new Vec3(0, 0.95, -0.45), new Vec3(0.16, 1.35, 0.08), '#a1262b');
        addPart('statue-moustache', 'box', new Vec3(0, 1.78, -0.56), new Vec3(0.38, 0.1, 0.08), '#28231f');
        this.root.addChild(statue);
        this.statues.push({ entity: statue, life: 9 });
    }

    private spawnFlyers(player: Entity): void {
        for (let index = 0; index < 8; index += 1) {
            const flyer = new Entity(`propaganda-flyer-${index}`);
            flyer.setPosition(
                player.getPosition().clone().add(new Vec3((Math.random() - 0.5) * 8, 1.5 + Math.random() * 2, (Math.random() - 0.5) * 8))
            );
            flyer.setLocalScale(0.55, 0.04, 0.75);
            flyer.addComponent('render', { type: 'box', material: material(index % 2 ? '#f2d58b' : '#ed334b') });
            this.root.addChild(flyer);
            this.flyers.push({ entity: flyer, life: 3.2, drift: (Math.random() - 0.5) * 120 });
        }
    }

    private say(message: string): void {
        this.notice.textContent = message;
        this.noticeTimer = 2.6;
        this.notice.classList.add('is-visible');
    }

    private renderHud(): void {
        const item = this.inventory;
        this.slot.innerHTML = item
            ? `<b style="color:${item.color}">${item.icon}</b><span>${item.name}</span><small>E einsetzen</small>`
            : '<b>—</b><span>KEIN ITEM</span><small>Kiste einsammeln</small>';
    }
}
