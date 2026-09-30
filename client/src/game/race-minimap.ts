import type { Entity } from 'playcanvas';

import type { DriverDefinition } from './drivers';
import { RACE_LAYOUT } from './race-layout';

type BotMarker = Readonly<{ entity: Entity; driver: DriverDefinition }>;

export class RaceMinimap {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private readonly count: HTMLElement;
    private width = 0;
    private height = 0;
    private pixelRatio = 1;

    constructor() {
        const panel = document.createElement('aside');
        panel.className = 'race-minimap';
        panel.setAttribute('aria-label', 'Streckenkarte');
        panel.innerHTML =
            '<div class="race-minimap__header"><strong>STRECKE</strong><span><i aria-hidden="true"></i>DU</span><small></small></div><canvas class="race-minimap__canvas" width="440" height="220" role="img" aria-label="Streckenverlauf mit Karts"></canvas>';
        document.body.append(panel);
        this.canvas = panel.querySelector('canvas')!;
        this.context = this.canvas.getContext('2d')!;
        this.count = panel.querySelector('.race-minimap__header small')!;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    update(player: Entity, playerColor: string, bots: readonly BotMarker[]): void {
        if (!document.body.classList.contains('race-active')) return;
        this.count.textContent = `${bots.length + 1} KARTS`;
        this.canvas.parentElement?.style.setProperty('--map-player-color', playerColor);

        const context = this.context;
        context.clearRect(0, 0, this.width, this.height);
        this.drawCourse();
        for (const bot of bots) this.drawMarker(bot.entity, bot.driver.color, false);
        this.drawMarker(player, playerColor, true);
    }

    private resize(): void {
        const bounds = this.canvas.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        this.width = bounds.width;
        this.height = bounds.height;
        this.pixelRatio = Math.min(2, window.devicePixelRatio || 1);
        this.canvas.width = Math.round(this.width * this.pixelRatio);
        this.canvas.height = Math.round(this.height * this.pixelRatio);
        this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    }

    private point(x: number, z: number): { x: number; y: number } {
        const padding = 7;
        return {
            x: padding + ((x + 290) / 580) * (this.width - padding * 2),
            y: padding + ((135 - z) / 270) * (this.height - padding * 2)
        };
    }

    private drawCourse(): void {
        const context = this.context;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.beginPath();
        const start = this.point(-220, -66);
        context.moveTo(start.x, start.y);
        for (const [x, z] of [
            [220, -66],
            [220, 64],
            [-220, 64],
            [-220, -66]
        ]) {
            const point = this.point(x, z);
            context.lineTo(point.x, point.y);
        }
        context.strokeStyle = '#89928a';
        context.lineWidth = 18;
        context.stroke();
        context.strokeStyle = '#30383e';
        context.lineWidth = 14;
        context.stroke();

        const islandStart = this.point(-160, 0);
        const islandEnd = this.point(160, 0);
        context.beginPath();
        context.moveTo(islandStart.x, islandStart.y);
        context.lineTo(islandEnd.x, islandEnd.y);
        context.strokeStyle = '#65706e';
        context.lineWidth = 1.5;
        context.setLineDash([2, 3]);
        context.stroke();
        context.setLineDash([]);

        const shortcutStart = this.point(178, 52);
        const shortcutEnd = this.point(178, -52);
        context.beginPath();
        context.moveTo(shortcutStart.x, shortcutStart.y);
        context.lineTo(shortcutEnd.x, shortcutEnd.y);
        context.strokeStyle = '#c8c1a0';
        context.lineWidth = 1.5;
        context.setLineDash([3, 3]);
        context.stroke();
        context.setLineDash([]);

        for (const checkpoint of RACE_LAYOUT.checkpoints) this.drawGate(checkpoint, '#b1bbc0', 1.5);
        this.drawGate(RACE_LAYOUT.finish, '#e7c44e', 2.5);
    }

    private drawGate(gate: (typeof RACE_LAYOUT.checkpoints)[number], color: string, lineWidth: number): void {
        const tangentX = -gate.normal.z;
        const tangentZ = gate.normal.x;
        const start = this.point(
            gate.position.x - tangentX * gate.halfWidth,
            gate.position.z - tangentZ * gate.halfWidth
        );
        const end = this.point(
            gate.position.x + tangentX * gate.halfWidth,
            gate.position.z + tangentZ * gate.halfWidth
        );
        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.strokeStyle = color;
        this.context.lineWidth = lineWidth;
        this.context.stroke();
    }

    private drawMarker(entity: Entity, color: string, isPlayer: boolean): void {
        const position = entity.getPosition();
        const point = this.point(position.x, position.z);
        const context = this.context;
        if (isPlayer) {
            context.beginPath();
            context.arc(point.x, point.y, 6, 0, Math.PI * 2);
            context.strokeStyle = '#f5f4e9';
            context.lineWidth = 1.5;
            context.stroke();
        }
        context.beginPath();
        context.arc(point.x, point.y, isPlayer ? 4 : 3.5, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.strokeStyle = '#10161a';
        context.lineWidth = 1;
        context.stroke();
    }
}