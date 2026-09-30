import type { Entity } from 'playcanvas';

import type { RaceSnapshot } from './race';
import { RaceController } from './race';

/** Separate player-facing HUD; the technical debug widgets remain untouched. */
export class RaceHud {
    private readonly lap: HTMLElement;
    private readonly time: HTMLElement;
    private readonly best: HTMLElement;
    private readonly position: HTMLElement;
    private readonly countdown: HTMLElement;
    private readonly speed: HTMLElement;
    private readonly map: HTMLCanvasElement;
    private readonly mapContext: CanvasRenderingContext2D;
    private readonly container: HTMLElement;
    private lastMapDraw = -1;

    constructor() {
        document.body.insertAdjacentHTML(
            'beforeend',
            '<section class="race-hud"><div class="race-hud-primary"><strong data-race="position">PLATZ 1 / 6</strong><strong data-race="lap">RUNDE 1 / 3</strong><span data-race="time">ZEIT 0:00.000</span><span data-race="best">BESTE --:--.---</span><span class="final-lap-callout" aria-live="polite">FINALRUNDE · ALLES AUF SIEG</span></div><aside class="race-map-wrap"><canvas data-race="map" width="180" height="120" aria-label="Minikarte der Rennstrecke"></canvas><small>HAUPTSTADTKURS</small></aside><div class="speedometer"><b data-race="speed">000</b><small>KM/H</small><i data-race="speed-bar"></i></div><b data-race="countdown">3</b></section>'
        );
        this.container = document.querySelector('.race-hud')!;
        this.position = document.querySelector('[data-race="position"]')!;
        this.lap = document.querySelector('[data-race="lap"]')!;
        this.time = document.querySelector('[data-race="time"]')!;
        this.best = document.querySelector('[data-race="best"]')!;
        this.countdown = document.querySelector('[data-race="countdown"]')!;
        this.speed = document.querySelector('[data-race="speed"]')!;
        this.map = document.querySelector<HTMLCanvasElement>('[data-race="map"]')!;
        this.mapContext = this.map.getContext('2d')!;
    }

    update(
        snapshot: RaceSnapshot,
        position = 1,
        racers = 1,
        speed = 0,
        player: Entity | null = null,
        bots: Entity[] = []
    ): void {
        this.container.classList.toggle(
            'is-final-lap',
            snapshot.phase === 'racing' && snapshot.lap === snapshot.lapsToWin
        );
        this.lap.parentElement!.classList.toggle('is-hidden', snapshot.phase === 'idle');
        this.lap.textContent =
            snapshot.phase === 'finished' ? 'RENNEN BEENDET' : `RUNDE ${snapshot.lap} / ${snapshot.lapsToWin}`;
        this.time.textContent = `ZEIT ${RaceController.formatTime(snapshot.raceTime)}`;
        this.position.textContent = `PLATZ ${position} / ${racers}`;
        this.best.textContent = `BESTE ${snapshot.bestLapTime === null ? '--:--.---' : RaceController.formatTime(snapshot.bestLapTime)}`;
        this.countdown.textContent = snapshot.countdownText;
        this.countdown.classList.toggle('race-go', snapshot.phase === 'racing');
        const displaySpeed = Math.round(Math.abs(speed) * 3.6);
        this.speed.textContent = String(displaySpeed).padStart(3, '0');
        this.speed.parentElement!.style.setProperty('--speed', `${Math.min(100, displaySpeed / 1.5)}%`);
        if (snapshot.raceTime < this.lastMapDraw) this.lastMapDraw = -1;
        if (snapshot.raceTime - this.lastMapDraw >= 0.1 || this.lastMapDraw < 0) {
            this.lastMapDraw = snapshot.raceTime;
            this.drawMap(player, bots);
        }
    }

    private drawMap(player: Entity | null, bots: Entity[]): void {
        const context = this.mapContext;
        context.clearRect(0, 0, this.map.width, this.map.height);
        context.fillStyle = '#10141dcc';
        context.fillRect(0, 0, this.map.width, this.map.height);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = '#d4bd75';
        context.lineWidth = 11;
        context.beginPath();
        context.moveTo(41, 44);
        context.lineTo(139, 44);
        context.bezierCurveTo(163, 44, 163, 76, 139, 76);
        context.lineTo(41, 76);
        context.bezierCurveTo(17, 76, 17, 44, 41, 44);
        context.stroke();
        context.strokeStyle = '#34373a';
        context.lineWidth = 7;
        context.stroke();
        const drawRacer = (entity: Entity, color: string, size: number) => {
            const position = entity.getPosition();
            const x = 16 + ((position.x + 290) / 580) * 148;
            const y = 36 + ((100 - position.z) / 200) * 48;
            context.fillStyle = color;
            context.beginPath();
            context.arc(x, y, size, 0, Math.PI * 2);
            context.fill();
            if (size > 4) {
                context.strokeStyle = '#fff6d0';
                context.lineWidth = 1.5;
                context.stroke();
            }
        };
        for (const bot of bots) if (bot.enabled) drawRacer(bot, '#ef776b', 3.2);
        if (player) drawRacer(player, '#63f4cf', 5);
    }
}
