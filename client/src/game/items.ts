import { Color, Entity, StandardMaterial, Vec3 } from 'playcanvas';

import type { BotRaceManager } from './bots';

export type ItemId =
    'propaganda' | 'red-folder' | 'statue' | 'censor' | 'secret-police' | 'economic-plan' | 'duty-rocket' | 'immunity';

type ItemDefinition = Readonly<{ id: ItemId; name: string; icon: string; color: string }>;
type Pickup = { entity: Entity; cooldown: number };
type Projectile = { entity: Entity; velocity: Vec3; target: Entity | null; hostile: boolean; life: number };
type BotInventory = { item: ItemDefinition | null; cursor: number; heldTimer: number };
type ImpactParticle = { entity: Entity; position: Vec3; velocity: Vec3; life: number };

export const ITEMS: readonly ItemDefinition[] = [
    { id: 'propaganda', name: 'Propaganda-Flut', icon: '📣', color: '#ed334b' },
    { id: 'red-folder', name: 'Rote Akte', icon: '📕', color: '#e83732' },
    { id: 'statue', name: 'Heldenstatue', icon: '🗿', color: '#b9b2a3' },
    { id: 'censor', name: 'Zensurbalken', icon: '▰', color: '#16191e' },
    { id: 'secret-police', name: 'Geheimpolizei', icon: '🕶️', color: '#6f66df' },
    { id: 'economic-plan', name: 'Fünfjahresplan', icon: '📈', color: '#e9c434' },
    { id: 'duty-rocket', name: 'Dienstweg-Rakete', icon: '🚀', color: '#f26b2c' },
    { id: 'immunity', name: 'Diplomatische Immunität', icon: '🛡️', color: '#45d9d0' }
] as const;

const PICKUP_POSITIONS = [
    new Vec3(-122, 1.5, 65),
    new Vec3(28, 1.5, 65),
    new Vec3(235, 1.5, 46),
    new Vec3(235, 1.5, -46),
    new Vec3(54, 1.5, -65),
    new Vec3(-116, 1.5, -65),
    new Vec3(-240, 1.5, -46),
    new Vec3(-240, 1.5, 46)
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
    private readonly root: Entity;
    private readonly bots: BotRaceManager;
    private readonly grantBoost: () => void;
    private readonly announce: (event: ItemId | 'pickup' | 'shielded' | 'hit') => void;
    private readonly pickups: Pickup[];
    private readonly projectiles: Projectile[] = [];
    private readonly impactParticles: ImpactParticle[] = [];
    private readonly impactMaterials: Record<'gold' | 'red' | 'shield', StandardMaterial>;
    private impactCursor = 0;
    private readonly botInventories: Map<Entity, BotInventory>;
    private readonly slot: HTMLElement;
    private readonly notice: HTMLElement;
    private readonly shield: HTMLElement;
    private inventory: ItemDefinition | null = null;
    private nextItem = 0;
    private itemsUsed = 0;
    private noticeTimer = 0;
    private shieldTimer = 0;
    private slowTimer = 0;
    private planBoostTimer = 0;
    private planPenaltyTimer = 0;
    private active = true;

    constructor(
        root: Entity,
        bots: BotRaceManager,
        grantBoost: () => void,
        announce: (event: ItemId | 'pickup' | 'shielded' | 'hit') => void
    ) {
        this.root = root;
        this.bots = bots;
        this.grantBoost = grantBoost;
        this.announce = announce;
        this.impactMaterials = {
            gold: material('#ffd45a'),
            red: material('#ff4059'),
            shield: material('#45d9d0')
        };
        for (let index = 0; index < 18; index += 1) {
            const entity = new Entity(`impact-spark-${index}`);
            entity.addComponent('render', { type: 'sphere', material: this.impactMaterials.gold, castShadows: false });
            entity.enabled = false;
            root.addChild(entity);
            this.impactParticles.push({ entity, position: new Vec3(), velocity: new Vec3(), life: 0 });
        }
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
            '<aside class="item-hud"><div class="item-slot" id="item-slot"><b>—</b><span>KEIN ITEM</span><small>E einsetzen</small></div><div class="item-shield" id="item-shield">DIPLOMATISCH GESCHÜTZT</div></aside><div class="item-notice" id="item-notice"></div>'
        );
        this.slot = document.getElementById('item-slot')!;
        this.notice = document.getElementById('item-notice')!;
        this.shield = document.getElementById('item-shield')!;
        this.renderHud();
    }

    get playerPowerScale(): number {
        if (this.slowTimer > 0) return 0.42;
        if (this.planPenaltyTimer > 0) return 0.65;
        return 1;
    }

    get playerItemsUsed(): number {
        return this.itemsUsed;
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
        this.inventory = null;
        this.nextItem = 0;
        this.itemsUsed = 0;
        this.noticeTimer = 0;
        this.shieldTimer = 0;
        this.slowTimer = 0;
        this.planBoostTimer = 0;
        this.planPenaltyTimer = 0;
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
        this.impactCursor = 0;
        for (const particle of this.impactParticles) {
            particle.life = 0;
            particle.entity.enabled = false;
        }
        this.renderHud();
    }

    update(player: Entity, dt: number, active: boolean, reducedEffects = false): void {
        if (!active || !this.active) return;
        this.updateImpactParticles(dt, reducedEffects);
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
        const boostWasActive = this.planBoostTimer > 0;
        this.planBoostTimer = Math.max(0, this.planBoostTimer - dt);
        if (boostWasActive && this.planBoostTimer === 0) this.planPenaltyTimer = 3.8;
        this.planPenaltyTimer = Math.max(0, this.planPenaltyTimer - dt);
        this.notice.classList.toggle('is-visible', this.noticeTimer > 0);
        this.shield.classList.toggle('is-visible', this.shieldTimer > 0);
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
                this.inventory = ITEMS[this.nextItem % ITEMS.length];
                this.nextItem += 1;
                pickup.cooldown = 7;
                pickup.entity.enabled = false;
                this.burst(pickup.entity.getPosition(), 'gold', reducedEffects);
                this.say(`${this.inventory.icon} ${this.inventory.name} eingesammelt`);
                this.announce('pickup');
                this.renderHud();
            }
        }

        this.updateBotItems(player, dt, reducedEffects);
        this.updateProjectiles(player, dt, reducedEffects);
    }

    use(player: Entity): void {
        if (!this.inventory) {
            this.say('Erst eine Versorgungskiste einsammeln.');
            return;
        }
        const item = this.inventory;
        this.inventory = null;
        this.itemsUsed += 1;
        this.announce(item.id);
        switch (item.id) {
            case 'propaganda':
            case 'censor':
                this.bots.impairVision(item.id === 'censor' ? 4.5 : 3.2);
                this.say(
                    item.id === 'censor' ? '▰ Faktenlage erfolgreich geschwärzt' : '📣 Sicht der Gegner überflutet'
                );
                break;
            case 'red-folder': {
                const target = this.bots.nearestTarget(player.getPosition());
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
                    true
                );
                this.say('🕶️ Zielperson wird diskret verfolgt');
                break;
            case 'economic-plan':
                this.grantBoost();
                this.planBoostTimer = 0.8;
                this.say('📈 Soll erfüllt! Realität folgt später.');
                break;
            case 'duty-rocket':
                this.spawnProjectile(
                    player
                        .getPosition()
                        .clone()
                        .add(new Vec3(0, 1, 0)),
                    null,
                    false,
                    false,
                    player.forward
                );
                this.say('🚀 Dienstweg eröffnet');
                break;
            case 'immunity':
                this.shieldTimer = 8;
                this.say('🛡️ Diplomatische Immunität aktiv');
                break;
        }
        this.renderHud();
    }

    private updateBotItems(player: Entity, dt: number, reducedEffects: boolean): void {
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
                    this.hitPlayer(3.2, reducedEffects);
                    break;
                case 'red-folder':
                    this.hitPlayer(3.2, reducedEffects);
                    break;
                case 'censor':
                    this.hitPlayer(4.5, reducedEffects);
                    break;
                case 'statue':
                    this.dropStatue(racer.entity);
                    break;
                case 'secret-police':
                    this.spawnProjectile(botPosition.clone().add(new Vec3(0, 1, 0)), player, true, true);
                    break;
                case 'economic-plan':
                    this.bots.grantBoost(racer.entity, 0.8);
                    break;
                case 'duty-rocket':
                    this.spawnProjectile(
                        botPosition.clone().add(racer.entity.forward.clone().add(new Vec3(0, 1, 0))),
                        player,
                        true,
                        false,
                        racer.entity.forward
                    );
                    break;
                case 'immunity':
                    this.bots.grantShield(racer.entity, 8);
                    break;
            }
        }
    }

    private spawnProjectile(origin: Vec3, target: Entity | null, hostile: boolean, homing: boolean, direction?: Vec3) {
        const entity = new Entity(hostile ? 'incoming-rocket' : 'item-projectile');
        entity.setPosition(origin);
        entity.setLocalScale(0.65, 0.65, 1.5);
        entity.addComponent('render', { type: 'cone', material: material(hostile ? '#ff334f' : '#f6c83f') });
        this.root.addChild(entity);
        const velocity = direction?.clone().normalize().mulScalar(46) ?? new Vec3();
        this.projectiles.push({ entity, velocity, target: homing ? target : null, hostile, life: 5 });
    }

    private updateProjectiles(player: Entity, dt: number, reducedEffects: boolean): void {
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
                this.burst(target.getPosition(), shot.hostile ? 'red' : 'gold', reducedEffects);
                if (shot.hostile) this.hitPlayer(3, reducedEffects);
                else this.bots.applyHit(target, 2.8);
                shot.life = 0;
            }
            if (shot.life <= 0) {
                shot.entity.destroy();
                this.projectiles.splice(index, 1);
            }
        }
    }

    private hitPlayer(duration = 3, reducedEffects = false): void {
        const kartPosition = this.root.findByName('player-kart')?.getPosition() ?? new Vec3();
        if (this.shieldTimer > 0) {
            this.burst(kartPosition, 'shield', reducedEffects);
            this.shieldTimer = 0;
            this.say('🛡️ Angriff diplomatisch zurückgewiesen');
            this.announce('shielded');
        } else {
            this.burst(kartPosition, 'red', reducedEffects);
            this.slowTimer = duration;
            this.say('💥 Verwaltungsakt zugestellt');
            this.announce('hit');
        }
    }

    private burst(position: Vec3, color: 'gold' | 'red' | 'shield', reducedEffects = false): void {
        if (reducedEffects) return;
        for (let index = 0; index < 9; index += 1) {
            const particle = this.impactParticles[this.impactCursor];
            this.impactCursor = (this.impactCursor + 1) % this.impactParticles.length;
            const angle = (Math.PI * 2 * index) / 9;
            const speed = 3.5 + (index % 3) * 1.15;
            particle.position.copy(position).add(new Vec3(0, 0.9 + (index % 2) * 0.25, 0));
            particle.velocity.set(Math.cos(angle) * speed, 2.1 + (index % 3) * 0.45, Math.sin(angle) * speed);
            particle.life = 0.46;
            particle.entity.render!.material = this.impactMaterials[color];
            particle.entity.setPosition(particle.position);
            particle.entity.setLocalScale(0.19, 0.19, 0.19);
            particle.entity.enabled = true;
        }
    }

    private updateImpactParticles(dt: number, reducedEffects: boolean): void {
        if (reducedEffects) {
            for (const particle of this.impactParticles) {
                particle.life = 0;
                particle.entity.enabled = false;
            }
            return;
        }
        for (const particle of this.impactParticles) {
            if (particle.life <= 0) continue;
            particle.life = Math.max(0, particle.life - dt);
            particle.velocity.y -= 8.5 * dt;
            particle.position.x += particle.velocity.x * dt;
            particle.position.y += particle.velocity.y * dt;
            particle.position.z += particle.velocity.z * dt;
            particle.entity.setPosition(particle.position);
            const scale = 0.07 + particle.life * 0.28;
            particle.entity.setLocalScale(scale, scale, scale);
            particle.entity.enabled = particle.life > 0;
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
        statue.addComponent('render', { type: 'cylinder', material: material('#a9a89e') });
        statue.addComponent('collision', { type: 'cylinder', radius: 0.9, height: 2.8 });
        statue.addComponent('rigidbody', { type: 'static' });
        this.root.addChild(statue);
        this.statues.push({ entity: statue, life: 9 });
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
