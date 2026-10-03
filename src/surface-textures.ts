import type { Scene } from '@babylonjs/core/scene';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';

/** Small original material atlases with deterministic pores, joints and fibre. */
export function surfaceTextures(scene: Scene, name: string, kind: 'stone' | 'fabric' | 'leaf' | 'grass') {
  const color = new DynamicTexture(`${name} color`, 512, scene, true);
  const normal = new DynamicTexture(`${name} normal`, 512, scene, true);
  const c = color.getContext(), n = normal.getContext();
  c.fillStyle = '#dad6c8'; c.fillRect(0, 0, 512, 512); n.fillStyle = '#8080ff'; n.fillRect(0, 0, 512, 512);
  let seed = 193; const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  if (kind === 'stone') {
    for (let row = 0; row < 8; row++) for (let col = -1; col < 5; col++) {
      const x = col * 128 + (row % 2 ? 64 : 0), y = row * 64;
      const v = 190 + Math.floor(random() * 35); c.fillStyle = `rgb(${v},${v - 2},${v - 9})`; c.fillRect(x + 1, y + 1, 126, 62);
      c.fillStyle = '#777466'; c.fillRect(x, y, 128, 1); c.fillRect(x, y, 1, 64);
      n.fillStyle = '#80adf0'; n.fillRect(x, y + 1, 127, 2); n.fillStyle = '#8053f0'; n.fillRect(x, y + 61, 127, 2);
      n.fillStyle = '#ad80f0'; n.fillRect(x + 1, y, 2, 64); n.fillStyle = '#5380f0'; n.fillRect(x + 125, y, 2, 64);
    }
  }
  if (kind === 'fabric') for (let i = 0; i < 512; i += 3) {
    c.fillStyle = '#99978d35'; c.fillRect(0, i, 512, 1); c.fillRect(i, 0, 1, 512);
    n.fillStyle = '#8492fc'; n.fillRect(0, i, 512, 1);
  }
  for (let i = 0; i < (kind === 'stone' ? 45000 : 60000); i++) {
    const x = random() * 512, y = random() * 512;
    c.fillStyle = random() > .5 ? '#ffffff25' : '#16191125'; c.fillRect(x, y, kind === 'leaf' ? 3 : 1, kind === 'grass' ? 5 : 1);
    if (kind === 'grass' || kind === 'leaf') { n.fillStyle = random() > .5 ? '#739af3' : '#9769f3'; n.fillRect(x, y, 2, 3); }
  }
  for (const t of [color, normal]) { t.update(); t.wrapU = t.wrapV = Texture.WRAP_ADDRESSMODE; t.anisotropicFilteringLevel = 4; }
  return { color, normal };
}
