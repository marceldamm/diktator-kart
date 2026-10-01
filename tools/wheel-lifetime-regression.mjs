import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

registerHooks({
    resolve(specifier, context, nextResolve) {
        if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier)) return nextResolve(`${specifier}.ts`, context);
        return nextResolve(specifier, context);
    }
});

// Model Bullet's relocating wheel array. Every insertion invalidates previous handles.
let generation = 0;
let writes = 0;
const wheelHandle = () => {
    const createdAt = generation;
    return new Proxy({}, {
        get: () => () => {
            assert.equal(createdAt, generation, 'A grip write used a stale wheel handle');
            writes += 1;
        }
    });
};
globalThis.Ammo = {
    btVehicleTuning: class {},
    btDefaultVehicleRaycaster: class {},
    btVector3: class { setValue() {} },
    btRaycastVehicle: class {
        setCoordinateSystem() {}
        addWheel() { generation += 1; return wheelHandle(); }
        getWheelInfo() { return wheelHandle(); }
    },
    destroy() {}
};
const { RaycastKartController } = await import('../client/src/game/raycast-kart.ts');
const kart = {
    rigidbody: { body: { setActivationState() {} } },
    children: [-1, 1].flatMap(x => [-1, 1].map(z => ({
        name: `wheel-${x}-${z}`,
        getLocalPosition: () => ({ x, y: 0, z })
    })))
};
const controller = new RaycastKartController(kart, { systems: { rigidbody: { dynamicsWorld: {} } } });
writes = 0;
controller.updateWheelGrip();
assert.equal(writes, 4, 'Every wheel must receive its grip update');
console.log('PASS: all four grip updates use handles acquired after the final wheel insertion');
