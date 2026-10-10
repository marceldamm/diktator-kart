import { MaterialPluginBase } from '@babylonjs/core/Materials/materialPluginBase';
import type { Material } from '@babylonjs/core/Materials/material';
import type { UniformBuffer } from '@babylonjs/core/Materials/uniformBuffer';

/**
 * Crowd reactions (Marcel, 10.10.2026): the spectators in every grandstand are batched static meshes, so they react in
 * the vertex shader. `excite` makes them bounce, `wave` sends a La-Ola along the stands. Main/slice-scene set the
 * shared state; it decays on its own. Purely visual, identical for every kart.
 */
export const crowdState = { wave: 0, excite: 0 };

/** Wave = La-Ola for the next seconds; cheer = short excited bouncing. */
export function crowdReact(kind: 'wave' | 'cheer'): void {
  if (kind === 'wave') crowdState.wave = Math.max(crowdState.wave, 8);
  crowdState.excite = Math.max(crowdState.excite, kind === 'wave' ? 3 : 2.5);
}

/** Called once per frame: both reactions fade out over their duration. */
export function stepCrowd(dt: number): void {
  crowdState.wave = Math.max(0, crowdState.wave - dt);
  crowdState.excite = Math.max(0, crowdState.excite - dt);
}

export class CrowdWavePlugin extends MaterialPluginBase {
  constructor(material: Material) {
    super(material, 'CrowdWave', 200, { CROWDWAVE: false });
    this._enable(true);
  }
  override prepareDefines(defines: Record<string, unknown>): void { defines.CROWDWAVE = true; }
  override getClassName(): string { return 'CrowdWavePlugin'; }
  override getUniforms() {
    return { ubo: [{ name: 'crowdWave', size: 4, type: 'vec4' }], vertex: 'uniform vec4 crowdWave;' };
  }
  override bindForSubMesh(uniformBuffer: UniformBuffer): void {
    // x: time, y: wave strength (fades in/out), z: bounce strength
    const wave = Math.min(1, crowdState.wave / 1.5, (8 - crowdState.wave) / 1), excite = Math.min(1, crowdState.excite);
    uniformBuffer.updateFloat4('crowdWave', performance.now() / 1000 % 600, Math.max(0, wave), excite, 0);
  }
  override getCustomCode(shaderType: string): Record<string, string> | null {
    if (shaderType !== 'vertex') return null;
    return {
      CUSTOM_VERTEX_UPDATE_POSITION: `
#ifdef CROWDWAVE
  // City meshes are baked in world space: position.xz is the seat's place along the stand.
  float crowdJump = crowdWave.z * 0.2 * max(0.0, sin(crowdWave.x * 11.0 + position.x * 2.3 + position.z * 1.7));
  float crowdOla = crowdWave.y * 0.85 * pow(max(0.0, sin(position.x * 0.09 + position.z * 0.09 - crowdWave.x * 3.0)), 4.0);
  positionUpdated.y += crowdJump + crowdOla;
#endif
`,
    };
  }
}
