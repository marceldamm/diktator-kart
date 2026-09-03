import { Color, Entity, StandardMaterial, Vec3 } from 'playcanvas';

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
    // Keep collision dimensions explicit; render scaling is isolated on the visual child.
    entity.addComponent('collision', { type: 'box', halfExtents: size.clone().mulScalar(0.5) });
    entity.addComponent('rigidbody', { type: 'static' });
    root.addChild(entity);
};

export const createTestTrack = (root: Entity) => {
    const track = new Entity('test-track');
    root.addChild(track);

    const asphalt = makeMaterial(new Color(0.13, 0.16, 0.19));
    const wall = makeMaterial(new Color(0.75, 0.16, 0.08));
    const curb = makeMaterial(new Color(0.95, 0.8, 0.22));

    addStaticBox(track, 'ground', new Vec3(0, -0.1, 0), new Vec3(36, 0.2, 26), asphalt);
    // Thick boundaries make contact reliable even at low-end browser frame rates.
    addStaticBox(track, 'north-wall', new Vec3(0, 0.55, -13), new Vec3(36, 1.1, 2), wall);
    addStaticBox(track, 'south-wall', new Vec3(0, 0.55, 13), new Vec3(36, 1.1, 2), wall);
    addStaticBox(track, 'west-wall', new Vec3(-18, 0.55, 0), new Vec3(2, 1.1, 26), wall);
    addStaticBox(track, 'east-wall', new Vec3(18, 0.55, 0), new Vec3(2, 1.1, 26), wall);

    // A few low visual curbs make the flat rectangle read as a simple race track.
    addStaticBox(track, 'north-curb', new Vec3(0, 0.08, -10.5), new Vec3(30, 0.16, 0.35), curb);
    addStaticBox(track, 'south-curb', new Vec3(0, 0.08, 10.5), new Vec3(30, 0.16, 0.35), curb);

    return track;
};
