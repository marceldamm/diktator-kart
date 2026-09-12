import { DEFAULT_DRIVER, DRIVERS } from './drivers';
import type { DriverDefinition } from './drivers';
import { RaceController } from './race';
import type { RaceSnapshot } from './race';

export type GameUiHandlers = Readonly<{
    onDriver: (driver: DriverDefinition) => void;
    onStart: () => void;
    onRestart: () => void;
    onMenu: () => void;
}>;

export class GameUi {
    private readonly menu: HTMLElement;
    private readonly pause: HTMLElement;
    private readonly result: HTMLElement;
    private readonly raceControls: HTMLElement;
    private selected = DEFAULT_DRIVER;
    private wasFinished = false;

    constructor(handlers: GameUiHandlers) {
        const cards = DRIVERS.map(
            (
                driver
            ) => `<button class="driver-card${driver === DEFAULT_DRIVER ? ' is-selected' : ''}" data-driver="${driver.id}" style="--driver:${driver.color};--accent:${driver.accent}">
                <span class="driver-portrait" aria-hidden="true"><i></i></span>
                <strong>${driver.name}</strong><small>${driver.kart}</small>
            </button>`
        ).join('');
        document.body.insertAdjacentHTML(
            'beforeend',
            `<section class="game-menu" id="game-menu" aria-label="Hauptmenü">
                <div class="menu-copy"><span class="eyebrow">MINISTERIUM FÜR RENNSIEGE PRÄSENTIERT</span><h1>DIKTATOR<br><em>KART</em></h1><p>Die Platzierung steht fest. Die Kurve leider nicht.</p></div>
                <div class="menu-panel"><span class="step">1 / 2 · FAHRER WÄHLEN</span><div class="driver-grid">${cards}</div>
                    <div class="selected-driver"><div><small id="driver-title">${DEFAULT_DRIVER.title}</small><strong id="driver-name">${DEFAULT_DRIVER.name} · ${DEFAULT_DRIVER.kart}</strong><span id="driver-detail">${DEFAULT_DRIVER.personality}<br>${DEFAULT_DRIVER.movingDetail}</span></div>
                    <button class="primary-button" id="start-race" type="button">GRAND PRIX STARTEN <b>→</b></button></div>
                </div>
            </section>
            <nav class="race-controls is-hidden" id="race-controls"><button id="reset-kart" type="button">Neu starten</button><button id="open-menu" type="button">Menü</button><span>ESC Pause · F3 Diagnose</span></nav>
            <section class="pause-screen is-hidden" id="pause-screen"><div><span class="eyebrow">SITZUNG UNTERBROCHEN</span><h2>PAUSE</h2><button id="resume-race">Weiterfahren</button><button id="pause-restart">Rennen neu starten</button><button id="pause-menu">Zum Hauptmenü</button></div></section>
            <section class="result-screen is-hidden" id="result-screen"><div><span class="eyebrow">AMTLICHES ENDERGEBNIS</span><h2>ZIEL ERREICHT</h2><p id="result-copy"></p><div class="result-actions"><button class="primary-button" id="result-restart">Revanche</button><button id="result-menu">Hauptmenü</button></div></div></section>`
        );
        this.menu = document.getElementById('game-menu')!;
        this.pause = document.getElementById('pause-screen')!;
        this.result = document.getElementById('result-screen')!;
        this.raceControls = document.getElementById('race-controls')!;

        document.querySelectorAll<HTMLButtonElement>('[data-driver]').forEach((button) => {
            button.addEventListener('click', () => {
                const driver = DRIVERS.find((candidate) => candidate.id === button.dataset.driver)!;
                this.selected = driver;
                document
                    .querySelectorAll('.driver-card')
                    .forEach((card) => card.classList.toggle('is-selected', card === button));
                document.getElementById('driver-title')!.textContent = driver.title;
                document.getElementById('driver-name')!.textContent = `${driver.name} · ${driver.kart}`;
                document.getElementById('driver-detail')!.innerHTML = `${driver.personality}<br>${driver.movingDetail}`;
                handlers.onDriver(driver);
            });
        });
        document.getElementById('start-race')!.addEventListener('click', () => {
            this.showRace();
            handlers.onStart();
        });
        document.getElementById('reset-kart')!.addEventListener('click', handlers.onRestart);
        document.getElementById('open-menu')!.addEventListener('click', () => {
            this.showMenu();
            handlers.onMenu();
        });
        document.getElementById('resume-race')!.addEventListener('click', () => this.setPaused(false));
        document.getElementById('pause-restart')!.addEventListener('click', () => {
            this.setPaused(false);
            handlers.onRestart();
        });
        document.getElementById('pause-menu')!.addEventListener('click', () => {
            this.setPaused(false);
            this.showMenu();
            handlers.onMenu();
        });
        document.getElementById('result-restart')!.addEventListener('click', () => {
            this.result.classList.add('is-hidden');
            this.wasFinished = false;
            handlers.onRestart();
        });
        document.getElementById('result-menu')!.addEventListener('click', () => {
            this.result.classList.add('is-hidden');
            this.showMenu();
            handlers.onMenu();
        });
        window.addEventListener('keydown', (event) => {
            if (
                event.code === 'Escape' &&
                this.menu.classList.contains('is-hidden') &&
                this.result.classList.contains('is-hidden')
            ) {
                event.preventDefault();
                this.setPaused(this.pause.classList.contains('is-hidden'));
            }
        });
    }

    get isPaused(): boolean {
        return !this.pause.classList.contains('is-hidden');
    }

    get selectedDriver(): DriverDefinition {
        return this.selected;
    }

    update(snapshot: RaceSnapshot): void {
        if (snapshot.phase !== 'finished' || this.wasFinished) return;
        this.wasFinished = true;
        const best =
            snapshot.bestLapTime === null
                ? 'ohne registrierte Runde'
                : `beste Runde ${RaceController.formatTime(snapshot.bestLapTime)}`;
        document.getElementById('result-copy')!.textContent =
            `${this.selected.name} erklärt das Rennen nach ${RaceController.formatTime(snapshot.raceTime)} und ${best} für planmäßig gewonnen.`;
        this.result.classList.remove('is-hidden');
    }

    private showRace(): void {
        this.menu.classList.add('is-hidden');
        this.result.classList.add('is-hidden');
        this.raceControls.classList.remove('is-hidden');
        this.wasFinished = false;
    }

    private showMenu(): void {
        this.menu.classList.remove('is-hidden');
        this.result.classList.add('is-hidden');
        this.raceControls.classList.add('is-hidden');
        this.wasFinished = false;
    }

    private setPaused(paused: boolean): void {
        this.pause.classList.toggle('is-hidden', !paused);
    }
}
