export type AnnouncerCue =
    | 'start'
    | 'lap2'
    | 'finalLap'
    | 'finish'
    | 'lead'
    | 'losePlace'
    | 'lastPlace'
    | 'comeback'
    | 'pickup'
    | 'rocket'
    | 'immunity'
    | 'shielded'
    | 'hit'
    | 'plan'
    | 'planPenalty'
    | 'shortcut'
    | 'propaganda'
    | 'censor'
    | 'statue'
    | 'police'
    | 'closeFinish'
    | 'collision'
    | 'drift'
    | 'reverse';

const TEXT: Record<AnnouncerCue, string> = {
    start: 'Das Ergebnis steht fest. Das Rennen darf beginnen.',
    lap2: 'Runde zwei. Die erste Runde wurde erfolgreich wiederholt.',
    finalLap: 'Letzte Runde. Ab jetzt zählen nur noch bestätigte Tatsachen.',
    finish: 'Zieleinlauf. Die Auswertung wird passend gemacht.',
    lead: 'Die Führung entspricht endlich der amtlichen Planung.',
    losePlace: 'Ein strategischer Rückzug an die Spitze von hinten.',
    lastPlace: 'Erster Platz in der rückwärtigen Führungsgruppe.',
    comeback: 'Der Aufschwung ist sichtbar. Bitte nicht nachmessen.',
    pickup: 'Versorgungsgut wurde ordnungsgemäß angeeignet.',
    rocket: 'Der Dienstweg wurde überraschend beschleunigt.',
    immunity: 'Diplomatie ist Physik mit besserem Stempel.',
    shielded: 'Der Angriff war formell nicht zuständig.',
    hit: 'Die Maßnahme wirkt. Leider auch hier.',
    plan: 'Die Planvorgabe wurde überholt.',
    planPenalty: 'Vorübergehender Überschuss an Stillstand.',
    shortcut: 'Ihr Antrag auf Zeitgewinn wurde abgelehnt.',
    propaganda: 'Die Sicht ist ausgezeichnet. Laut Bericht.',
    censor: 'Was nicht sichtbar ist, war nie auf der Strecke.',
    statue: 'Ein Denkmal behindert nur unangemeldete Verkehrsteilnehmer.',
    police: 'Eine freiwillige Begleitung wurde angeordnet.',
    closeFinish: 'Das Ergebnis stand fest. Bis gerade eben.',
    collision: 'Kontakt mit der Realität wurde erfolgreich begrenzt.',
    drift: 'Kontrollverlust ist jetzt eine offizielle Fahrtechnik.',
    reverse: 'Die Zukunft liegt heute bemerkenswert weit hinten.'
};

export class Announcer {
    private readonly subtitle: HTMLElement;
    private current: HTMLAudioElement | null = null;
    private lastCue = '';
    private lastSpokenAt = -20;
    private volume = 0.82;
    private lastVoice: 'male' | 'female' = 'female';

    constructor() {
        document.body.insertAdjacentHTML('beforeend', '<div class="announcer-subtitle" id="announcer-subtitle"></div>');
        this.subtitle = document.getElementById('announcer-subtitle')!;
    }

    say(cue: AnnouncerCue, priority = false): void {
        const now = performance.now() / 1000;
        if (!priority && (now - this.lastSpokenAt < 12 || cue === this.lastCue)) return;
        this.current?.pause();
        const voice: 'male' | 'female' = this.lastVoice === 'female' ? 'male' : 'female';
        this.lastVoice = voice;
        const primary = voice === 'female' ? 'announcer-female' : 'announcer-neural';
        const audio = new Audio(`/audio/${primary}/${cue}.wav`);
        audio.addEventListener(
            'error',
            () => {
                if (audio.dataset.fallback) return;
                audio.dataset.fallback = 'true';
                audio.src = voice === 'female' ? `/audio/announcer-neural/${cue}.wav` : `/audio/announcer/${cue}.wav`;
                void audio.play().catch(() => this.subtitle.classList.remove('is-visible'));
            },
            { once: true }
        );
        audio.volume = this.volume;
        audio.addEventListener('ended', () => this.subtitle.classList.remove('is-visible'), { once: true });
        void audio.play().catch(() => {
            if (!audio.dataset.fallback) this.subtitle.classList.remove('is-visible');
        });
        this.current = audio;
        this.lastCue = cue;
        this.lastSpokenAt = now;
        this.subtitle.textContent = TEXT[cue];
        this.subtitle.classList.add('is-visible');
    }

    reset(): void {
        this.current?.pause();
        this.current = null;
        this.lastCue = '';
        this.lastSpokenAt = -20;
        this.subtitle.classList.remove('is-visible');
    }

    setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.current) this.current.volume = this.volume;
    }

    setPaused(paused: boolean): void {
        if (paused) this.current?.pause();
        else if (this.current && !this.current.ended)
            void this.current.play().catch(() => {
                // Keep the subtitle available when the browser blocks audio resumption.
            });
    }
}
