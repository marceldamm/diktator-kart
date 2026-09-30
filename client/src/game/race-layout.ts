import { Vec3 } from 'playcanvas';

export type RaceGate = Readonly<{
    id: string;
    position: Vec3;
    normal: Vec3;
    halfWidth: number;
}>;

/** Shared physical and race layout for the first playable circuit. */
export const RACE_LAYOUT = {
    startPosition: new Vec3(-190, 0.65, 65),
    startYaw: -90,
    lapsToWin: 3,
    checkpoints: [
        { id: 'north-straight', position: new Vec3(95, 0, 65), normal: new Vec3(1, 0, 0), halfWidth: 35 },
        { id: 'east-turn', position: new Vec3(255, 0, 0), normal: new Vec3(0, 0, -1), halfWidth: 35 },
        { id: 'south-straight', position: new Vec3(-95, 0, -65), normal: new Vec3(-1, 0, 0), halfWidth: 35 }
    ] satisfies RaceGate[],
    finish: {
        id: 'finish',
        position: new Vec3(-190, 0, 65),
        normal: new Vec3(1, 0, 0),
        halfWidth: 35
    } satisfies RaceGate
} as const;
