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

const addVisualBox = (root: Entity, name: string, position: Vec3, size: Vec3, material: StandardMaterial) => {
    const marker = new Entity(name);
    marker.setPosition(position);
    marker.setLocalScale(size);
    marker.addComponent('render', { type: 'box', material });
    root.addChild(marker);
};

export const createTestTrack = (root: Entity) => {
    const track = new Entity('test-track');
    root.addChild(track);

    const asphalt = makeMaterial(new Color(0.13, 0.16, 0.19));
    const wall = makeMaterial(new Color(0.75, 0.16, 0.08));
    const curb = makeMaterial(new Color(0.95, 0.8, 0.22));
    const marking = makeMaterial(new Color(0.8, 0.88, 0.9), 0.5);
    const accent = makeMaterial(new Color(0.1, 0.8, 0.72), 0.5);
    const grid = makeMaterial(new Color(0.2, 0.27, 0.32), 0.25);

    addStaticBox(track, 'ground', new Vec3(0, -0.1, 0), new Vec3(700, 0.2, 260), asphalt);
    // Thick boundaries make contact reliable even at low-end browser frame rates.
    addStaticBox(track, 'north-wall', new Vec3(0, 0.55, -130), new Vec3(700, 1.1, 2), wall);
    addStaticBox(track, 'south-wall', new Vec3(0, 0.55, 130), new Vec3(700, 1.1, 2), wall);
    addStaticBox(track, 'west-wall', new Vec3(-350, 0.55, 0), new Vec3(2, 1.1, 260), wall);
    addStaticBox(track, 'east-wall', new Vec3(350, 0.55, 0), new Vec3(2, 1.1, 260), wall);

    // A few low visual curbs make the flat rectangle read as a simple race track.
    addStaticBox(track, 'north-curb', new Vec3(0, 0.08, -127.5), new Vec3(694, 0.16, 0.35), curb);
    addStaticBox(track, 'south-curb', new Vec3(0, 0.08, 127.5), new Vec3(694, 0.16, 0.35), curb);

    // Visual-only markings provide orientation without adding more collision shapes.
    addVisualBox(track, 'center-line', new Vec3(0, 0.025, 0), new Vec3(694, 0.05, 0.3), marking);
    addVisualBox(track, 'left-reference-line', new Vec3(0, 0.022, -8), new Vec3(694, 0.044, 0.14), accent);
    addVisualBox(track, 'right-reference-line', new Vec3(0, 0.022, 8), new Vec3(694, 0.044, 0.14), accent);
    addVisualBox(track, 'start-accent-left', new Vec3(-330, 0.025, -11), new Vec3(0.25, 0.05, 2), accent);
    addVisualBox(track, 'start-accent-right', new Vec3(-330, 0.025, 11), new Vec3(0.25, 0.05, 2), accent);

    // Subtle grid pattern for orientation across the large flat playground.
    for (let x = -344; x <= 344; x += 8) {
        addVisualBox(track, `grid-x-${x}`, new Vec3(x, 0.012, 0), new Vec3(0.035, 0.025, 255), grid);
    }
    for (let z = -128; z <= 128; z += 4) {
        addVisualBox(track, `grid-z-${z}`, new Vec3(0, 0.013, z), new Vec3(67, 0.025, 0.035), grid);
    }

    return track;
};
