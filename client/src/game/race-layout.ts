import { Vec3 } from 'playcanvas';

export type RaceGate = Readonly<{
    id: string;
    position: Vec3;
    normal: Vec3;
    halfWidth: number;
}>;

/** Shared physical and race layout for the first playable circuit. */
export const RACE_LAYOUT = {
    startPosition: new Vec3(-222.5, 0.65, -14),
    startYaw: 180,
    lapsToWin: 3,
    checkpoints: [
        { id: 'north-straight', position: new Vec3(120, 0, 65), normal: new Vec3(1, 0, 0), halfWidth: 42 },
        { id: 'east-turn', position: new Vec3(220, 0, -62), normal: new Vec3(0, 0, -1), halfWidth: 48 },
        { id: 'south-straight', position: new Vec3(-120, 0, -65), normal: new Vec3(-1, 0, 0), halfWidth: 42 }
    ] satisfies RaceGate[],
    finish: {
        id: 'finish',
        position: new Vec3(-222.5, 0, 0),
        normal: new Vec3(0, 0, 1),
        halfWidth: 61.5
    } satisfies RaceGate
} as const;
