import type { RaceSnapshot } from './race';
import { RaceController } from './race';

/** Separate player-facing HUD; the technical debug widgets remain untouched. */
export class RaceHud {
    private readonly lap: HTMLElement;
    private readonly time: HTMLElement;
    private readonly best: HTMLElement;
    private readonly position: HTMLElement;
    private readonly countdown: HTMLElement;

    constructor() {
        document.body.insertAdjacentHTML(
            'beforeend',
            '<section class="race-hud"><strong data-race="position">PLATZ 1 / 6</strong><strong data-race="lap">RUNDE 1 / 3</strong><span data-race="time">ZEIT 0:00.000</span><span data-race="best">BESTE --:--.---</span><b data-race="countdown">3</b></section>'
        );
        this.position = document.querySelector('[data-race="position"]')!;
        this.lap = document.querySelector('[data-race="lap"]')!;
        this.time = document.querySelector('[data-race="time"]')!;
        this.best = document.querySelector('[data-race="best"]')!;
        this.countdown = document.querySelector('[data-race="countdown"]')!;
    }

    update(snapshot: RaceSnapshot, position = 1, racers = 1): void {
        this.lap.parentElement!.classList.toggle('is-hidden', snapshot.phase === 'idle');
        this.lap.textContent =
            snapshot.phase === 'finished' ? 'RENNEN BEENDET' : `RUNDE ${snapshot.lap} / ${snapshot.lapsToWin}`;
        this.time.textContent = `ZEIT ${RaceController.formatTime(snapshot.raceTime)}`;
        this.position.textContent = `PLATZ ${position} / ${racers}`;
        this.best.textContent = `BESTE ${snapshot.bestLapTime === null ? '--:--.---' : RaceController.formatTime(snapshot.bestLapTime)}`;
        this.countdown.textContent = snapshot.countdownText;
        this.countdown.classList.toggle('race-go', snapshot.phase === 'racing');
    }
}
