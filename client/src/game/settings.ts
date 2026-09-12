export type GameSettings = Readonly<{
    masterVolume: number;
    musicVolume: number;
    effectsVolume: number;
    voiceVolume: number;
    reducedCamera: boolean;
    reducedEffects: boolean;
}>;

const DEFAULTS: GameSettings = {
    masterVolume: 0.8,
    musicVolume: 0.7,
    effectsVolume: 0.85,
    voiceVolume: 0.82,
    reducedCamera: false,
    reducedEffects: false
};

export class SettingsPanel {
    private readonly panel: HTMLElement;
    private readonly onChange: (settings: GameSettings) => void;
    private settings: GameSettings;

    constructor(onChange: (settings: GameSettings) => void, onOpenChange: (open: boolean) => void) {
        this.onChange = onChange;
        this.settings = this.load();
        document.body.insertAdjacentHTML(
            'beforeend',
            `<button class="settings-open" id="settings-open" type="button" aria-label="Einstellungen">⚙ Einstellungen</button>
            <section class="settings-panel is-hidden" id="settings-panel" aria-label="Einstellungen"><div><span class="eyebrow">AMT FÜR ZULÄSSIGE ABWEICHUNGEN</span><h2>EINSTELLUNGEN</h2>
            ${this.slider('masterVolume', 'Gesamtlautstärke')}${this.slider('musicVolume', 'Musik')}${this.slider('effectsVolume', 'Effekte')}${this.slider('voiceVolume', 'Stimmen')}
            ${this.toggle('reducedCamera', 'Reduzierte Kamerabewegung')}${this.toggle('reducedEffects', 'Reduzierte Effekte')}
            <p class="control-help"><b>Steuerung</b><br>WASD/Pfeile: Fahren · Leertaste: Hop/Drift · E: Item · ESC: Pause</p><button class="primary-button" id="settings-close" type="button">ÜBERNEHMEN</button></div></section>`
        );
        this.panel = document.getElementById('settings-panel')!;
        document.getElementById('settings-open')!.addEventListener('click', () => {
            this.panel.classList.remove('is-hidden');
            onOpenChange(true);
        });
        document.getElementById('settings-close')!.addEventListener('click', () => {
            this.panel.classList.add('is-hidden');
            onOpenChange(false);
            (document.activeElement as HTMLElement | null)?.blur();
        });
        this.panel.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
            input.addEventListener('input', () => this.readForm());
        });
        this.onChange(this.settings);
    }

    get current(): GameSettings {
        return this.settings;
    }

    private slider(key: keyof GameSettings, label: string): string {
        return `<label>${label}<input data-setting="${key}" type="range" min="0" max="1" step="0.05" value="${this.settings[key]}"></label>`;
    }

    private toggle(key: keyof GameSettings, label: string): string {
        return `<label class="setting-toggle"><input data-setting="${key}" type="checkbox" ${this.settings[key] ? 'checked' : ''}><span>${label}</span></label>`;
    }

    private readForm(): void {
        const value = (key: keyof GameSettings) =>
            this.panel.querySelector<HTMLInputElement>(`[data-setting="${key}"]`)!;
        this.settings = {
            masterVolume: Number(value('masterVolume').value),
            musicVolume: Number(value('musicVolume').value),
            effectsVolume: Number(value('effectsVolume').value),
            voiceVolume: Number(value('voiceVolume').value),
            reducedCamera: value('reducedCamera').checked,
            reducedEffects: value('reducedEffects').checked
        };
        localStorage.setItem('diktator-kart-settings-v1', JSON.stringify(this.settings));
        this.onChange(this.settings);
    }

    private load(): GameSettings {
        try {
            return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('diktator-kart-settings-v1') ?? '{}') };
        } catch {
            return DEFAULTS;
        }
    }
}
