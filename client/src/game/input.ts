import { Vec2 } from 'playcanvas';

export type KartInput = Readonly<Vec2>;

/** Keyboard input kept separate so bots and network input can replace it later. */
export class KeyboardInput {
    private readonly keys = new Set<string>();

    constructor() {
        window.addEventListener('keydown', (event) => {
            if (
                ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(event.code)
            ) {
                event.preventDefault();
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
            Number(this.keys.has('KeyD') || this.keys.has('ArrowRight')) -
            Number(this.keys.has('KeyA') || this.keys.has('ArrowLeft'));
        return new Vec2(steering, throttle);
    }
}
