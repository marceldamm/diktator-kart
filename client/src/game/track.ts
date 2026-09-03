import { Color, Entity, StandardMaterial, Vec3 } from 'playcanvas';

import { RACE_LAYOUT } from './race-layout';

const makeMaterial = (color: Color, gloss = 0.2) => {
    const material = new StandardMaterial();
    material.diffuse = color;
    material.gloss = gloss;
    material.update();
    return material;
};

const addStaticBox = (root: Entity, name: string, position: Vec3, size: Vec3, material: StandardMaterial) => {
    const entity = new Entity(name);
    entity.setPosition(position);
    const visual = new Entity(`${name}-visual`);
    visual.setLocalScale(size);
    visual.addComponent('render', { type: 'box', material });
    entity.addChild(visual);
    entity.addComponent('collision', { type: 'box', halfExtents: size.clone().mulScalar(0.5) });
    entity.addComponent('rigidbody', { type: 'static' });
    root.addChild(entity);
};

const addVisualBox = (root: Entity, name: string, position: Vec3, size: Vec3, material: StandardMaterial) => {
    const entity = new Entity(name);
    entity.setPosition(position);
    entity.setLocalScale(size);
    entity.addComponent('render', { type: 'box', material });
    root.addChild(entity);
};

const addTree = (root: Entity, index: number, position: Vec3, trunk: StandardMaterial, leaves: StandardMaterial) => {
    addVisualBox(
        root,
        `tree-trunk-${index}`,
        position.clone().add(new Vec3(0, 1.2, 0)),
        new Vec3(0.45, 2.4, 0.45),
        trunk
    );
    const crown = new Entity(`tree-crown-${index}`);
    crown.setPosition(position.clone().add(new Vec3(0, 3.25, 0)));
    crown.setLocalScale(2.8, 3.1, 2.8);
    crown.addComponent('render', { type: 'cone', material: leaves });
    root.addChild(crown);
};

const addFinishLine = (root: Entity, black: StandardMaterial, white: StandardMaterial) => {
    for (let row = 0; row < 2; row += 1) {
        for (let column = 0; column < 10; column += 1) {
            addVisualBox(
                root,
                `finish-${row}-${column}`,
                new Vec3(-220 + row * 2.2 - 1.1, 0.025, 65 + column * 8.8 - 39.6),
                new Vec3(2.2, 0.05, 8.8),
                (row + column) % 2 === 0 ? white : black
            );
        }
    }
};

/** The broad first loop: deliberately simple, with forgiving square-radius turns. */
export const createRaceTrack = (root: Entity) => {
    const track = new Entity('race-track');
    root.addChild(track);
    const grass = makeMaterial(new Color(0.13, 0.37, 0.16));
    const asphalt = makeMaterial(new Color(0.105, 0.12, 0.15), 0.38);
    const barrier = makeMaterial(new Color(0.86, 0.12, 0.08));
    const white = makeMaterial(new Color(0.92, 0.94, 0.86), 0.55);
    const black = makeMaterial(new Color(0.03, 0.035, 0.045));
    const yellow = makeMaterial(new Color(1, 0.72, 0.12), 0.45);
    const teal = makeMaterial(new Color(0.08, 0.78, 0.68), 0.4);
    const trunk = makeMaterial(new Color(0.27, 0.13, 0.06));
    const leaves = makeMaterial(new Color(0.07, 0.45, 0.18));

    // One collision ground keeps the RaycastVehicle contact surface completely stable.
    addStaticBox(track, 'grass-ground', new Vec3(0, -0.1, 0), new Vec3(700, 0.2, 260), grass);
    addVisualBox(track, 'north-asphalt', new Vec3(0, 0.012, 66), new Vec3(560, 0.04, 124), asphalt);
    addVisualBox(track, 'south-asphalt', new Vec3(0, 0.012, -66), new Vec3(560, 0.04, 124), asphalt);
    addVisualBox(track, 'west-link', new Vec3(-220, 0.014, 0), new Vec3(120, 0.045, 130), asphalt);
    addVisualBox(track, 'east-link', new Vec3(220, 0.014, 0), new Vec3(120, 0.045, 130), asphalt);

    // Outer boundary and central island form a broad, forgiving rectangular loop.
    addStaticBox(track, 'outer-north', new Vec3(0, 0.7, 130), new Vec3(570, 1.4, 2), barrier);
    addStaticBox(track, 'outer-south', new Vec3(0, 0.7, -130), new Vec3(570, 1.4, 2), barrier);
    addStaticBox(track, 'outer-west', new Vec3(-285, 0.7, 0), new Vec3(2, 1.4, 260), barrier);
    addStaticBox(track, 'outer-east', new Vec3(285, 0.7, 0), new Vec3(2, 1.4, 260), barrier);
    addStaticBox(track, 'island-north', new Vec3(0, 0.55, 5), new Vec3(320, 1.1, 2), barrier);
    addStaticBox(track, 'island-south', new Vec3(0, 0.55, -5), new Vec3(320, 1.1, 2), barrier);
    addStaticBox(track, 'island-west', new Vec3(-160, 0.55, 0), new Vec3(2, 1.1, 10), barrier);
    addStaticBox(track, 'island-east', new Vec3(160, 0.55, 0), new Vec3(2, 1.1, 10), barrier);

    addVisualBox(track, 'north-curb', new Vec3(0, 0.045, 125), new Vec3(554, 0.08, 1.2), yellow);
    addVisualBox(track, 'south-curb', new Vec3(0, 0.045, -125), new Vec3(554, 0.08, 1.2), yellow);
    addVisualBox(track, 'island-grass', new Vec3(0, 0.02, 0), new Vec3(316, 0.05, 8), teal);
    addFinishLine(track, black, white);
    addVisualBox(track, 'start-arch-left', new Vec3(-220, 2.1, 20), new Vec3(0.7, 4.2, 0.7), yellow);
    addVisualBox(track, 'start-arch-right', new Vec3(-220, 2.1, 110), new Vec3(0.7, 4.2, 0.7), yellow);
    addVisualBox(track, 'start-arch-top', new Vec3(-220, 4, 65), new Vec3(0.7, 0.7, 90), yellow);
    RACE_LAYOUT.checkpoints.forEach((checkpoint, index) => {
        addVisualBox(
            track,
            `checkpoint-${index}`,
            checkpoint.position.clone().add(new Vec3(0, 0.035, 0)),
            new Vec3(1.5, 0.06, checkpoint.halfWidth * 2),
            teal
        );
    });
    for (let index = 0; index < 18; index += 1) {
        const x = -330 + (index % 9) * 82;
        const z = index < 9 ? 148 : -148;
        addTree(track, index, new Vec3(x, 0, z), trunk, leaves);
    }
    return track;
};

/** Retained physics playground for future focused controller experiments. */
export const createPhysicsTestTrack = (root: Entity) => {
    const track = new Entity('physics-test-track');
    root.addChild(track);
    addStaticBox(
        track,
        'test-ground',
        new Vec3(0, -0.1, 0),
        new Vec3(700, 0.2, 260),
        makeMaterial(new Color(0.13, 0.16, 0.19))
    );
    return track;
};
