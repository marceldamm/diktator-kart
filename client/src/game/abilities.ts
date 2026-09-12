import type { Entity } from 'playcanvas';

import type { BotRaceManager } from './bots';
import type { DriverDefinition } from './drivers';

const ABILITIES: Record<string, Readonly<{ name: string; icon: string }>> = {
    hitler: { name: 'Größenbefehl', icon: '⚡' },
    stalin: { name: 'Planbereinigung', icon: '📋' },
    mussolini: { name: 'Balkonrede', icon: '📢' },
    mao: { name: 'Großer Sprung', icon: '↥' },
    kim: { name: 'Perfekte Statistik', icon: '💯' },
    castro: { name: 'Revolutionsreserve', icon: '✊' }
};

export class AbilitySystem {
    private readonly bots: BotRaceManager;
    private readonly boost: (duration?: number) => void;
    private readonly shield: (duration?: number) => void;
    private readonly hud: HTMLElement;
    private readonly notice: HTMLElement;
    private driver: DriverDefinition;
    private cooldown = 0;
    private noticeTimer = 0;
    private powerTimer = 0;

    constructor(
        driver: DriverDefinition,
        bots: BotRaceManager,
        boost: (duration?: number) => void,
        shield: (duration?: number) => void
    ) {
        this.driver = driver;
        this.bots = bots;
        this.boost = boost;
        this.shield = shield;
        document.body.insertAdjacentHTML(
            'beforeend',
            '<aside class="ability-hud" id="ability-hud"></aside><div class="ability-notice" id="ability-notice"></div>'
        );
        this.hud = document.getElementById('ability-hud')!;
        this.notice = document.getElementById('ability-notice')!;
        this.render();
    }

    get playerPowerScale(): number {
        return this.powerTimer > 0 ? 1.18 : 1;
    }

    setDriver(driver: DriverDefinition): void {
        this.driver = driver;
        this.cooldown = 0;
        this.render();
    }

    reset(): void {
        this.cooldown = 0;
        this.noticeTimer = 0;
        this.powerTimer = 0;
        this.notice.classList.remove('is-visible');
        this.render();
    }

    update(dt: number): void {
        const previousSecond = Math.ceil(this.cooldown);
        this.cooldown = Math.max(0, this.cooldown - dt);
        this.powerTimer = Math.max(0, this.powerTimer - dt);
        this.noticeTimer = Math.max(0, this.noticeTimer - dt);
        this.notice.classList.toggle('is-visible', this.noticeTimer > 0);
        if (Math.ceil(this.cooldown) !== previousSecond) this.render();
    }

    use(kart: Entity): void {
        if (this.cooldown > 0) {
            this.say(`NOCH ${Math.ceil(this.cooldown)} SEKUNDEN BIS ZUR GENEHMIGUNG`);
            return;
        }
        const ability = ABILITIES[this.driver.id] ?? ABILITIES.hitler;
        switch (this.driver.id) {
            case 'stalin':
                for (const racer of this.bots.racers) this.bots.applyHit(racer.entity, 1.8);
                break;
            case 'mussolini':
                this.bots.impairVision(4);
                break;
            case 'mao':
                kart.rigidbody?.applyImpulse(0, 310, 0);
                this.boost(0.7);
                break;
            case 'kim':
                this.boost(1.15);
                this.powerTimer = 1.15;
                break;
            case 'castro':
                this.shield(5);
                break;
            default:
                this.boost(0.95);
                break;
        }
        this.cooldown = 18;
        this.say(`${ability.icon} ${ability.name.toUpperCase()}`);
        this.render();
    }

    private say(text: string): void {
        this.notice.textContent = text;
        this.noticeTimer = 2.2;
        this.notice.classList.add('is-visible');
    }

    private render(): void {
        const ability = ABILITIES[this.driver.id] ?? ABILITIES.hitler;
        const ready = this.cooldown === 0;
        this.hud.innerHTML = `<b>${ability.icon}</b><span>${ability.name}</span><small>${ready ? 'Q einsetzen' : `${Math.ceil(this.cooldown)} s`}</small>`;
        this.hud.classList.toggle('is-ready', ready);
    }
}
