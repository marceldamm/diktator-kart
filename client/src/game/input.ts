export type KartInput = Readonly<{
    steering: number;
    throttle: number;
    /** One-frame press event. A controller decides whether a hop is possible. */
    hop: boolean;
    /** Held while Space is down; used to hold an already initiated drift. */
    drift: boolean;
}>;

/** Keyboard input kept separate so bots and network input can replace it later. */
export class KeyboardInput {
    private readonly keys = new Set<string>();
    private hopQueued = false;

    constructor() {
        window.addEventListener('keydown', (event) => {
            if (
                ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space'].includes(
                    event.code
                )
            ) {
                event.preventDefault();
                if (event.code === 'Space' && !event.repeat) this.hopQueued = true;
                this.keys.add(event.code);
            }
        });
        window.addEventListener('keyup', (event) => this.keys.delete(event.code));
        window.addEventListener('blur', () => this.keys.clear());
    }

    read(): KartInput {
        const throttle =
            Number(this.keys.has('KeyW') || this.keys.has('ArrowUp')) -
            Number(this.keys.has('KeyS') || this.keys.has('ArrowDown'));
        const steering =
            Number(this.keys.has('KeyA') || this.keys.has('ArrowLeft')) -
            Number(this.keys.has('KeyD') || this.keys.has('ArrowRight'));
        const hop = this.hopQueued;
        this.hopQueued = false;
        return {
            steering,
            throttle,
            hop,
            drift: this.keys.has('Space')
        };
    }
}
