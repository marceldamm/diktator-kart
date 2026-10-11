import type { Scene } from '@babylonjs/core/scene';
import type { Camera } from '@babylonjs/core/Cameras/camera';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

/**
 * Freie Kamera (Marcel 11.10.2026): fly through the loaded world to look at things. W/A/S/D or arrows fly,
 * Q/E (or C/Space) go down/up, Shift is four times faster, mouse wheel changes the base speed, dragging with the
 * left mouse button looks around, Esc returns. The game's own input is ignored while it is active (main.ts).
 */
export class FreeFlight {
  active = false;
  private camera: FreeCamera | null = null;
  private previous: Camera | null = null;
  private keys = new Set<string>();
  private yaw = 0;
  private pitch = 0;
  private speed = 14;
  private dragging = false;
  private hint: HTMLElement;
  private onExit: (() => void) | null = null;

  constructor(private readonly sceneOf: () => Scene | undefined, canvas: HTMLCanvasElement) {
    this.hint = document.createElement('div');
    this.hint.id = 'free-camera-hint'; this.hint.hidden = true;
    this.hint.style.cssText = 'position:fixed;z-index:200;left:50%;bottom:18px;transform:translateX(-50%);max-width:92vw;padding:8px 14px;background:#0c242ee8;border-top:2px solid #d2ac57;color:#f5e5bb;font:13px/1.4 system-ui,sans-serif;text-align:center;pointer-events:none';
    this.hint.innerHTML = '<b>Freie Kamera</b> · W/A/S/D fliegen · Q/E runter/hoch · <b>Umschalt</b> schneller · Mausrad Tempo · linke Maustaste ziehen: umsehen · <b>Esc</b> zurück';
    document.body.append(this.hint);
    window.addEventListener('keydown', (event) => {
      if (!this.active) return;
      if (event.code === 'Escape') { this.stop(); }
      else this.keys.add(event.code);
      // The game must not see these keys (no menu toggles, no driving).
      event.preventDefault(); event.stopImmediatePropagation();
    }, true);
    window.addEventListener('keyup', (event) => { if (!this.active) return; this.keys.delete(event.code); event.preventDefault(); event.stopImmediatePropagation(); }, true);
    window.addEventListener('blur', () => this.keys.clear());
    canvas.addEventListener('pointerdown', (event) => { if (this.active && event.button === 0) { this.dragging = true; canvas.setPointerCapture(event.pointerId); event.stopImmediatePropagation(); } }, true);
    canvas.addEventListener('pointerup', (event) => { if (this.active) { this.dragging = false; event.stopImmediatePropagation(); } }, true);
    canvas.addEventListener('pointermove', (event) => {
      if (!this.active || !this.dragging) return;
      this.yaw += event.movementX * .0042; this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch + event.movementY * .0042));
      event.stopImmediatePropagation();
    }, true);
    canvas.addEventListener('wheel', (event) => {
      if (!this.active) return;
      this.speed = Math.max(2, Math.min(120, this.speed * (event.deltaY > 0 ? .85 : 1.18)));
      event.preventDefault(); event.stopImmediatePropagation();
    }, { capture: true, passive: false });
  }

  /** Takes over from the current view; `onExit` runs when Esc ends the flight. */
  start(onExit?: () => void): void {
    const scene = this.sceneOf();
    if (this.active || !scene) return;
    if (this.camera && this.camera.getScene() !== scene) { this.camera.dispose(); this.camera = null; }
    const from = scene.activeCamera;
    this.previous = from; this.onExit = onExit ?? null;
    const position = from ? from.globalPosition.clone() : new Vector3(0, 12, 0);
    const forward = from ? from.getDirection(new Vector3(0, 0, 1)) : new Vector3(0, -.3, 1);
    this.yaw = Math.atan2(forward.x, forward.z); this.pitch = -Math.asin(Math.max(-1, Math.min(1, forward.y)));
    this.camera ??= new FreeCamera('Freie Kamera', position, scene);
    this.camera.position.copyFrom(position); this.camera.minZ = .1; this.camera.maxZ = from?.maxZ ?? 3000; this.camera.fov = from?.fov ?? .8;
    this.camera.inputs.clear();
    scene.activeCamera = this.camera;
    (document.activeElement as HTMLElement | null)?.blur?.();
    this.active = true; this.keys.clear(); this.hint.hidden = false; document.body.classList.add('free-camera');
  }

  stop(): void {
    if (!this.active) return;
    this.active = false; this.keys.clear(); this.dragging = false; this.hint.hidden = true; document.body.classList.remove('free-camera');
    const scene = this.sceneOf();
    if (this.previous && scene && this.previous.getScene() === scene) scene.activeCamera = this.previous;
    const exit = this.onExit; this.onExit = null; exit?.();
  }

  update(dt: number): void {
    if (!this.active || !this.camera) return;
    const k = (code: string) => this.keys.has(code) ? 1 : 0;
    const fast = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') ? 4 : 1;
    const ahead = k('KeyW') + k('ArrowUp') - k('KeyS') - k('ArrowDown');
    const side = k('KeyD') + k('ArrowRight') - k('KeyA') - k('ArrowLeft');
    const rise = k('KeyE') + k('Space') - k('KeyQ') - k('KeyC');
    const cp = Math.cos(this.pitch), forward = new Vector3(Math.sin(this.yaw) * cp, -Math.sin(this.pitch), Math.cos(this.yaw) * cp);
    const right = new Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const step = this.speed * fast * dt;
    this.camera.position.addInPlace(forward.scale(ahead * step)).addInPlace(right.scale(side * step)).addInPlace(new Vector3(0, rise * step, 0));
    this.camera.setTarget(this.camera.position.add(forward));
  }
}
