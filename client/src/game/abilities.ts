import { Color, Entity, StandardMaterial } from 'playcanvas';

import type { BotRaceManager } from './bots';
import type { DriverDefinition } from './drivers';

const ABILITIES: Record<string, Readonly<{ name: string; icon: string }>> = {
    groefaz: { name: 'Größenbefehl', icon: '⚡' },
    stalin: { name: 'Planbereinigung', icon: '📋' },
    mussolini: { name: 'Balkonrede', icon: '📢' },
    mao: { name: 'Großer Sprung', icon: '↥' },
    kim: { name: 'Perfekte Statistik', icon: '💯' },
    castro: { name: 'Revolutionsreserve', icon: '✊' }
};

const tankMaterial = (color: Color) => {
    const material = new StandardMaterial();
    material.diffuse = color;
    material.gloss = 0.3;
    material.update();
    return material;
};

export class AbilitySystem {
    private readonly bots: BotRaceManager;
    private readonly shield: (duration?: number) => void;
    private readonly jumpAhead: (kart: Entity) => void;
    private readonly hud: HTMLElement;
    private readonly notice: HTMLElement;
    private driver: DriverDefinition;
    private cooldown = 0;
    private noticeTimer = 0;
    private tankTimer = 0;
    private perfectStatisticTimer = 0;
    private tankVisual: Entity | null = null;
    private tankKart: Entity | null = null;
    private tankBaseScale: { x: number; y: number; z: number } | null = null;
    private readonly tankHitCooldowns = new Map<Entity, number>();

    constructor(
        driver: DriverDefinition,
        bots: BotRaceManager,
        shield: (duration?: number) => void,
        jumpAhead: (kart: Entity) => void
    ) {
        this.driver = driver;
        this.bots = bots;
        this.shield = shield;
        this.jumpAhead = jumpAhead;
        document.body.insertAdjacentHTML(
            'beforeend',
            '<aside class="ability-hud" id="ability-hud"></aside><div class="ability-notice" id="ability-notice"></div>'
        );
        this.hud = document.getElementById('ability-hud')!;
        this.notice = document.getElementById('ability-notice')!;
        this.render();
    }

    readonly playerPowerScale = 1;

    setDriver(driver: DriverDefinition): void {
        this.driver = driver;
        this.cooldown = 0;
        this.render();
    }

    reset(): void {
        this.cooldown = 0;
        this.noticeTimer = 0;
        this.tankTimer = 0;
        this.perfectStatisticTimer = 0;
        this.tankHitCooldowns.clear();
        this.setTankMode(null, false);
        this.notice.classList.remove('is-visible');
        this.render();
    }

    update(dt: number, kart: Entity): void {
        const previousSecond = Math.ceil(this.cooldown);
        this.cooldown = Math.max(0, this.cooldown - dt);
        const previousPerfectStatistic = this.perfectStatisticTimer;
        this.perfectStatisticTimer = Math.max(0, this.perfectStatisticTimer - dt);
        this.tankTimer = Math.max(0, this.tankTimer - dt);
        for (const [entity, cooldown] of this.tankHitCooldowns) {
            const remaining = Math.max(0, cooldown - dt);
            if (remaining === 0) this.tankHitCooldowns.delete(entity);
            else this.tankHitCooldowns.set(entity, remaining);
        }
        this.setTankMode(kart, this.tankTimer > 0);
        if (this.tankTimer > 0) {
            for (const racer of this.bots.racers) {
                if (
                    racer.entity.getPosition().distance(kart.getPosition()) < 4.2 &&
                    !this.tankHitCooldowns.has(racer.entity)
                ) {
                    this.bots.runOver(racer.entity, kart.getPosition());
                    this.tankHitCooldowns.set(racer.entity, 1.1);
                }
            }
        }
        if (previousPerfectStatistic > 0 && this.perfectStatisticTimer === 0)
            this.say('Ein perfekter Sieg mit 8 Runden Vorsprung!', 3.5);
        this.noticeTimer = Math.max(0, this.noticeTimer - dt);
        this.notice.classList.toggle('is-visible', this.noticeTimer > 0);
        if (Math.ceil(this.cooldown) !== previousSecond) this.render();
    }

    use(kart: Entity): void {
        if (this.cooldown > 0) {
            this.say(`NOCH ${Math.ceil(this.cooldown)} SEKUNDEN BIS ZUR GENEHMIGUNG`);
            return;
        }
        const ability = ABILITIES[this.driver.id] ?? ABILITIES.groefaz;
        let activationText = `${ability.icon} ${ability.name.toUpperCase()}`;
        let activationDuration = 2.2;
        switch (this.driver.id) {
            case 'groefaz':
                this.tankTimer = 8;
                activationText = '⚡ PANZERSTATUS AKTIV · 8 SEKUNDEN';
                this.setTankMode(kart, true);
                break;
            case 'stalin':
                for (const racer of this.bots.racers) this.bots.applyHit(racer.entity, 1.8);
                break;
            case 'mussolini':
                this.bots.impairVision(4);
                activationText = '📢 ACHTUNG SICHT WEG! REDE AN!';
                break;
            case 'mao':
                kart.rigidbody?.applyImpulse(0, 310, 0);
                this.jumpAhead(kart);
                break;
            case 'kim':
                this.perfectStatisticTimer = 20;
                activationText = '💯 KIM STEHT AUF PLATZ 1';
                activationDuration = 20;
                break;
            case 'castro':
                this.shield(5);
                break;
            default:
                break;
        }
        this.cooldown = 18;
        this.say(activationText, activationDuration);
        this.render();
    }

    private say(text: string, duration = 2.2): void {
        this.notice.textContent = text;
        this.noticeTimer = duration;
        this.notice.classList.add('is-visible');
    }

    private setTankMode(kart: Entity | null, active: boolean): void {
        if (!active) {
            if (this.tankKart && this.tankBaseScale) {
                this.tankKart.setLocalScale(this.tankBaseScale.x, this.tankBaseScale.y, this.tankBaseScale.z);
            }
            this.tankVisual?.destroy();
            this.tankVisual = null;
            this.tankKart = null;
            this.tankBaseScale = null;
            return;
        }
        if (!kart || this.tankVisual) return;
        const baseScale = kart.getLocalScale();
        this.tankKart = kart;
        this.tankBaseScale = { x: baseScale.x, y: baseScale.y, z: baseScale.z };
        kart.setLocalScale(baseScale.x * 1.72, baseScale.y * 1.34, baseScale.z * 1.72);
        const turret = new Entity('tank-turret');
        turret.setLocalPosition(0, 0.62, 0.05);
        turret.setLocalScale(1.2, 0.48, 1.2);
        turret.addComponent('render', { type: 'box', material: tankMaterial(new Color(0.24, 0.28, 0.25)) });
        const frontPlate = new Entity('tank-front-plate');
        frontPlate.setLocalPosition(0, -0.18, -0.95);
        frontPlate.setLocalScale(1.7, 0.65, 0.3);
        frontPlate.addComponent('render', { type: 'box', material: tankMaterial(new Color(0.18, 0.22, 0.2)) });
        turret.addChild(frontPlate);
        const leftTrack = new Entity('tank-left-track');
        leftTrack.setLocalPosition(-0.9, -0.22, 0);
        leftTrack.setLocalScale(0.42, 0.72, 2.4);
        leftTrack.addComponent('render', { type: 'box', material: tankMaterial(new Color(0.08, 0.1, 0.09)) });
        turret.addChild(leftTrack);
        const rightTrack = new Entity('tank-right-track');
        rightTrack.setLocalPosition(0.9, -0.22, 0);
        rightTrack.setLocalScale(0.42, 0.72, 2.4);
        rightTrack.addComponent('render', { type: 'box', material: tankMaterial(new Color(0.08, 0.1, 0.09)) });
        turret.addChild(rightTrack);
        const barrel = new Entity('tank-barrel');
        barrel.setLocalPosition(0, 0, -0.75);
        barrel.setLocalScale(0.28, 0.28, 1.8);
        barrel.addComponent('render', { type: 'box', material: tankMaterial(new Color(0.12, 0.14, 0.13)) });
        turret.addChild(barrel);
        kart.addChild(turret);
        this.tankVisual = turret;
    }

    private render(): void {
        const ability = ABILITIES[this.driver.id] ?? ABILITIES.groefaz;
        const ready = this.cooldown === 0;
        this.hud.innerHTML = `<b>${ability.icon}</b><span>${ability.name}</span><small>${ready ? 'Q einsetzen' : `${Math.ceil(this.cooldown)} s`}</small>`;
        this.hud.classList.toggle('is-ready', ready);
    }
}
