import type { Entity, GraphNode } from 'playcanvas';

export const CROWD_LAP_MOTION = [
    { frequency: 3.4, amplitude: 24 },
    { frequency: 4.2, amplitude: 28 },
    { frequency: 5.2, amplitude: 32 }
] as const;

/** Cheap deterministic set dressing: visual state changes never alter the drivable collision layout. */
export class WorldEvents {
    private time = 0;
    private lapState = 1;
    private shortcutPenalty = 0;
    private shortcutHitLock = 0;
    private readonly shortcutNotice: HTMLElement;
    private readonly arms: GraphNode[];
    private readonly shortcutStamps: GraphNode[];
    private readonly palaceBanner: GraphNode | null;
    private readonly statueScaffold: GraphNode | null;

    constructor(root: Entity) {
        this.arms = Array.from({ length: 12 }, (_, index) => root.findByName(`spectator-arm-${index}`)).filter(
            (entity): entity is GraphNode => entity !== null
        );
        this.shortcutStamps = Array.from({ length: 3 }, (_, index) =>
            root.findByName(`shortcut-stamp-head-${index}`)
        ).filter((entity): entity is GraphNode => entity !== null);
        this.palaceBanner = root.findByName('palace-banner');
        this.statueScaffold = root.findByName('statue-scaffold-cross');
        document.body.insertAdjacentHTML(
            'beforeend',
            '<div class="shortcut-notice" id="shortcut-notice">ANTRAG ABGELEHNT · STEMPELTREFFER</div>'
        );
        this.shortcutNotice = document.getElementById('shortcut-notice')!;
    }

    get playerPowerScale(): number {
        return this.shortcutPenalty > 0 ? 0.35 : 1;
    }

    reset(): void {
        this.time = 0;
        this.lapState = 1;
        this.shortcutPenalty = 0;
        this.shortcutHitLock = 0;
        this.shortcutNotice.classList.remove('is-visible');
        this.applyLapState();
    }

    update(dt: number, leaderLap: number, player: Entity): void {
        this.time += dt;
        this.shortcutPenalty = Math.max(0, this.shortcutPenalty - dt);
        this.shortcutHitLock = Math.max(0, this.shortcutHitLock - dt);
        this.shortcutNotice.classList.toggle('is-visible', this.shortcutPenalty > 0);
        if (leaderLap !== this.lapState) {
            this.lapState = leaderLap;
            this.applyLapState();
        }
        if (!document.documentElement.classList.contains('reduced-effects')) {
            const motion = CROWD_LAP_MOTION[Math.min(CROWD_LAP_MOTION.length - 1, Math.max(0, this.lapState - 1))];
            this.arms.forEach((arm, index) => {
                const frequency = motion.frequency + (index % 4) * 0.13;
                arm.setLocalEulerAngles(0, 0, Math.sin(this.time * frequency + index * 0.83) * motion.amplitude);
            });
        }
        this.shortcutStamps.forEach((stamp, index) => {
            // Three fixed, staggered cycles telegraph their motion long before the kart arrives.
            const cycle = (this.time + index * 1.15) % 4.2;
            const y =
                cycle < 2.6
                    ? 6.2
                    : cycle < 3
                      ? 6.2 - ((cycle - 2.6) / 0.4) * 4
                      : cycle < 3.45
                        ? 2.2
                        : 2.2 + ((cycle - 3.45) / 0.75) * 4;
            stamp.setPosition(190, y, -25 + index * 25);
            const playerPosition = player.getPosition();
            if (
                this.shortcutHitLock === 0 &&
                y < 3.1 &&
                Math.abs(playerPosition.x - 190) < 10 &&
                Math.abs(playerPosition.z - (-25 + index * 25)) < 5
            ) {
                this.shortcutPenalty = 2.1;
                this.shortcutHitLock = 2.5;
            }
        });
    }

    private applyLapState(): void {
        if (this.palaceBanner) {
            this.palaceBanner.setLocalScale(this.lapState >= 3 ? 60 : this.lapState >= 2 ? 52 : 48, 12, 0.8);
            this.palaceBanner.setLocalEulerAngles(0, 0, this.lapState >= 3 ? 4 : 0);
        }
        if (this.statueScaffold) {
            this.statueScaffold.setLocalEulerAngles(0, 0, this.lapState >= 2 ? -12 : 0);
            this.statueScaffold.setLocalScale(22, this.lapState >= 3 ? 2.4 : 1.1, 1.1);
        }
    }
}
