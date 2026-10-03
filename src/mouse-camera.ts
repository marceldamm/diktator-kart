/** Deliberate drag-to-look; menu movement never becomes camera input. */
export function attachMouseCamera(canvas: HTMLCanvasElement, callbacks: {
  enabled(): boolean;
  look(dx: number, dy: number): void;
  dragging(active: boolean): void;
  item(): void;
  zoom(delta: number): void;
}): { release(): void; dispose(): void } {
  let pointer: number | undefined;
  const release = () => {
    const previous = pointer;
    pointer = undefined;
    canvas.classList.remove('camera-dragging');
    callbacks.dragging(false);
    if (previous !== undefined && canvas.hasPointerCapture(previous)) canvas.releasePointerCapture(previous);
  };
  const down = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !callbacks.enabled()) return;
    if (event.button === 0) { callbacks.item(); return; }
    if (event.button !== 2) return;
    event.preventDefault();
    pointer = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add('camera-dragging');
    callbacks.dragging(true);
  };
  const move = (event: PointerEvent) => {
    if (pointer !== event.pointerId || event.pointerType !== 'mouse') return;
    if (!(event.buttons & 2) || !callbacks.enabled()) { release(); return; }
    callbacks.look(event.movementX, event.movementY);
  };
  const up = (event: PointerEvent) => { if (pointer === event.pointerId && !(event.buttons & 2)) release(); };
  const cancel = (event: PointerEvent) => { if (pointer === event.pointerId) release(); };
  const hidden = () => { if (document.hidden) release(); };
  const context = (event: MouseEvent) => event.preventDefault();
  const wheel = (event: WheelEvent) => { if (callbacks.enabled()) { event.preventDefault(); callbacks.zoom(event.deltaY); } };
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', cancel);
  canvas.addEventListener('lostpointercapture', cancel);
  canvas.addEventListener('contextmenu', context);
  canvas.addEventListener('wheel', wheel, { passive: false });
  window.addEventListener('pointerup', up);
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', hidden);
  return { release, dispose() {
    release();
    canvas.removeEventListener('pointerdown', down);
    canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('pointerup', up);
    canvas.removeEventListener('pointercancel', cancel);
    canvas.removeEventListener('lostpointercapture', cancel);
    canvas.removeEventListener('contextmenu', context);
    canvas.removeEventListener('wheel', wheel);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('blur', release);
    document.removeEventListener('visibilitychange', hidden);
  } };
}
