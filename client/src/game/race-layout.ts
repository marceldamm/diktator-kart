import { Vec3 } from 'playcanvas';

export type RaceGate = Readonly<{
    id: string;
    position: Vec3;
    normal: Vec3;
    halfWidth: number;
}>;

/** Shared physical and race layout for the first playable circuit. */
export const RACE_LAYOUT = {
    startPosition: new Vec3(-220, 0.65, 65),
    startYaw: -90,
    lapsToWin: 3,
    checkpoints: [
        { id: 'north-straight', position: new Vec3(120, 0, 65), normal: new Vec3(1, 0, 0), halfWidth: 42 },
        { id: 'east-turn', position: new Vec3(220, 0, -62), normal: new Vec3(0, 0, -1), halfWidth: 48 },
        { id: 'south-straight', position: new Vec3(-120, 0, -65), normal: new Vec3(-1, 0, 0), halfWidth: 42 }
    ] satisfies RaceGate[],
    finish: {
        id: 'finish',
        position: new Vec3(-220, 0, 42),
        normal: new Vec3(0, 0, 1),
        halfWidth: 44
    } satisfies RaceGate
} as const;
