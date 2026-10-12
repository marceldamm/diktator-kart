import type { Scene } from '@babylonjs/core/scene';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexBuffer } from '@babylonjs/core/Buffers/buffer';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import type { KartState } from './kart-model';

export function softParticleTexture(scene: Scene, name = 'Soft particle'): DynamicTexture {
  const t = new DynamicTexture(name, 64, scene, false); const c = t.getContext();
  const gradient = c.createRadialGradient(32, 32, 1, 32, 32, 31);
  gradient.addColorStop(0, '#ffffffff'); gradient.addColorStop(.3, '#ffffffbb'); gradient.addColorStop(1, '#ffffff00');
  c.fillStyle = gradient; c.fillRect(0, 0, 64, 64); t.hasAlpha = true; t.update(); return t;
}

/**
 * Ring buffer of rubber marks left by drifting or scraping rear wheels.
 * One updatable mesh, fixed vertex count: no growth over a race or restart.
 */
export class SkidMarks {
  private readonly mesh: Mesh;
  private readonly positions: Float32Array;
  private readonly colors: Float32Array;
  private next = 0;
  private dirty = false;
  private readonly last: ({ x: number; z: number } | null)[][];
  constructor(scene: Scene, karts: number, private readonly capacity = 900) {
    this.positions = new Float32Array(capacity * 4 * 3);
    this.colors = new Float32Array(capacity * 4 * 4);
    const indices: number[] = [];
    for (let i = 0; i < capacity; i++) { const k = i * 4; indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    const data = new VertexData(); data.positions = this.positions; data.colors = this.colors; data.indices = indices;
    data.normals = new Float32Array(capacity * 4 * 3).map((_, i) => i % 3 === 1 ? 1 : 0);
    this.mesh = new Mesh('Tyre marks', scene); data.applyToMesh(this.mesh, true);
    const material = new StandardMaterial('Tyre rubber marks', scene);
    material.disableLighting = true; material.emissiveColor.set(1, 1, 1); material.diffuseColor.set(0, 0, 0);
    material.alpha = .999; material.zOffset = -2; material.backFaceCulling = false;
    this.mesh.material = material; this.mesh.hasVertexAlpha = true; this.mesh.isPickable = false; this.mesh.alwaysSelectAsActiveMesh = true;
    this.last = Array.from({ length: karts }, () => [null, null]);
  }
  update(karts: KartState[]): void {
    karts.forEach((k, index) => {
      const marking = k.grounded && Math.abs(k.speed) > 4 && (k.drifting || (k.scrapeRemaining ?? 0) > 0 || k.impactRemaining > 0);
      for (const [wheel, side] of [[0, -1], [1, 1]] as const) {
        if (!marking) { this.last[index][wheel] = null; continue; }
        const x = k.x + Math.cos(k.heading) * side * .78 - Math.sin(k.heading) * .7;
        const z = k.z - Math.sin(k.heading) * side * .78 - Math.cos(k.heading) * .7;
        const previous = this.last[index][wheel];
        if (!previous) { this.last[index][wheel] = { x, z }; continue; }
        const dx = x - previous.x, dz = z - previous.z, length = Math.hypot(dx, dz);
        if (length < .35) continue;
        const nx = -dz / length * .14, nz = dx / length * .14, strength = k.drifting ? .5 : .36;
        const quad = [[previous.x - nx, previous.z - nz], [previous.x + nx, previous.z + nz], [x - nx, z - nz], [x + nx, z + nz]];
        const base = this.next * 4;
        quad.forEach(([px, pz], v) => {
          this.positions.set([px, .045, pz], (base + v) * 3);
          this.colors.set([.035, .03, .028, strength], (base + v) * 4);
        });
        this.next = (this.next + 1) % this.capacity; this.dirty = true;
        this.last[index][wheel] = { x, z };
      }
    });
    if (!this.dirty) return;
    // Older marks fade linearly with their age in the ring.
    for (let i = 0; i < this.capacity; i++) {
      const age = (this.next - 1 - i + this.capacity) % this.capacity, alpha = Math.max(0, 1 - age / this.capacity);
      for (let v = 0; v < 4; v++) { const o = (i * 4 + v) * 4 + 3; if (this.colors[o] > 0) this.colors[o] = Math.min(this.colors[o], .5 * alpha + .02); }
    }
    this.mesh.updateVerticesData(VertexBuffer.PositionKind, this.positions);
    this.mesh.updateVerticesData(VertexBuffer.ColorKind, this.colors);
    this.dirty = false;
  }
  clear(): void { this.colors.fill(0); this.last.forEach((l) => l.fill(null)); this.mesh.updateVerticesData(VertexBuffer.ColorKind, this.colors); }
}

/** Small sheet of official paper with a red stamp mark, for item hits. */
export function createPaperTexture(scene: Scene): DynamicTexture {
  const t = new DynamicTexture('Official paper sheet', 64, scene, false); const c = t.getContext();
  c.fillStyle = '#f4efe2'; c.fillRect(8, 4, 48, 56); c.fillStyle = '#b8b0a0'; for (let y = 14; y < 52; y += 7) c.fillRect(14, y, 34, 2);
  c.strokeStyle = '#a3242a'; c.lineWidth = 4; c.beginPath(); c.arc(42, 44, 10, 0, Math.PI * 2); c.stroke();
  t.hasAlpha = true; t.update(); return t;
}

/** Short celebratory confetti bursts at the start gantry and the finish. Bounded particle count. */
export function createConfetti(scene: Scene): { burst(at: Vector3, amount?: number): void } {
  const t = new DynamicTexture('Confetti paper', 32, scene, false); const c = t.getContext();
  c.fillStyle = '#ffffff'; c.fillRect(4, 10, 24, 12); t.hasAlpha = true; t.update();
  const system = new ParticleSystem('Confetti', 420, scene); system.particleTexture = t;
  system.minSize = .09; system.maxSize = .18; system.minLifeTime = 2.2; system.maxLifeTime = 3.6;
  system.color1 = new Color4(.86, .17, .2, 1); system.color2 = new Color4(.95, .78, .35, 1); system.colorDead = new Color4(.95, .92, .85, 0);
  system.direction1 = new Vector3(-3, 6, -3); system.direction2 = new Vector3(3, 9, 3); system.gravity = new Vector3(0, -3.2, 0);
  system.minAngularSpeed = -6; system.maxAngularSpeed = 6; system.minEmitPower = .8; system.maxEmitPower = 1.6;
  system.minEmitBox = new Vector3(-6, 0, -1); system.maxEmitBox = new Vector3(6, .5, 1);
  system.emitRate = 0; system.manualEmitCount = 0; system.start();
  return { burst(at, amount = 260) { system.emitter = at.clone(); system.manualEmitCount = amount; } };
}

/** Larger, bounded paper pieces for course events that need to read from a racing camera. */
export function createCourseEventPaper(scene: Scene): { burst(at: Vector3, amount: number): void } {
  const texture = new DynamicTexture('Course event paper', 64, scene, false); const c = texture.getContext();
  c.clearRect(0, 0, 64, 64); c.fillStyle = '#f4efe2'; c.fillRect(8, 7, 48, 50);
  c.fillStyle = '#b3242b'; c.fillRect(12, 12, 40, 7); c.fillStyle = '#c9a54e'; c.fillRect(16, 27, 32, 5);
  c.strokeStyle = '#8c1821'; c.lineWidth = 4; c.beginPath(); c.arc(32, 43, 9, 0, Math.PI * 2); c.stroke();
  texture.hasAlpha = true; texture.update();
  const system = new ParticleSystem('Course event paper', 420, scene); system.particleTexture = texture;
  system.minSize = .28; system.maxSize = .46; system.minLifeTime = 1.4; system.maxLifeTime = 2.4;
  system.color1 = new Color4(1, 1, 1, 1); system.color2 = new Color4(1, .92, .72, 1); system.colorDead = new Color4(1, 1, 1, 0);
  system.direction1 = new Vector3(-3, -.8, -3); system.direction2 = new Vector3(3, .5, 3); system.gravity = new Vector3(0, -1, 0);
  system.minAngularSpeed = -6; system.maxAngularSpeed = 6; system.minEmitPower = .8; system.maxEmitPower = 1.6;
  system.minEmitBox = new Vector3(-6, 0, -1); system.maxEmitBox = new Vector3(6, .5, 1);
  system.emitRate = 0; system.manualEmitCount = 0; system.start();
  return { burst(at, amount) { system.emitter = at.clone(); system.manualEmitCount = Math.min(240, Math.max(0, Math.floor(amount))); } };
}
