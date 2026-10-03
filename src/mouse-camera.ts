/** Cursor is locked only for the duration of a deliberate mouse gesture. */
export function attachMouseCamera(canvas: HTMLCanvasElement, callbacks: {
  enabled(): boolean;
  look(dx: number, dy: number): void;
  dragging(active: boolean): void;
  rear(active: boolean): void;
  zoom(delta: number): void;
}): { release(): void; dispose(): void } {
  let pointer: number | undefined;
  let gesture: 'look' | 'rear' | undefined;
  let locked = false;
  const release = () => {
    const previous = pointer;
    pointer = undefined;
    gesture = undefined;
    locked = false;
    canvas.classList.remove('camera-dragging');
    callbacks.dragging(false);
    callbacks.rear(false);
    if (document.pointerLockElement === canvas) document.exitPointerLock();
    if (previous !== undefined && canvas.hasPointerCapture(previous)) canvas.releasePointerCapture(previous);
  };
  const down = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !callbacks.enabled()) return;
    if (event.button !== 0 && event.button !== 2) return;
    event.preventDefault();
    pointer = event.pointerId;
    gesture = event.button === 0 ? 'look' : 'rear';
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add('camera-dragging');
    callbacks.dragging(gesture === 'look');
    callbacks.rear(gesture === 'rear');
    // Native Pointer Lock restores the OS cursor to its original position on release.
    try { const pending = canvas.requestPointerLock(); pending?.catch(() => release()); }
    catch { release(); }
  };
  const move = (event: MouseEvent) => {
    if (document.pointerLockElement !== canvas || !gesture) return;
    const held = gesture === 'look' ? 1 : 2;
    if (!(event.buttons & held) || !callbacks.enabled()) { release(); return; }
    if (gesture !== 'look') return;
    callbacks.look(event.movementX, event.movementY);
  };
  const up = (event: PointerEvent) => { if (pointer === event.pointerId && !(event.buttons & (gesture === 'look' ? 1 : 2))) release(); };
  const cancel = (event: PointerEvent) => { if (pointer === event.pointerId) release(); };
  // Acquiring Pointer Lock deliberately releases Pointer Capture (W3C Pointer Events).
  // That transition is not the user releasing their held camera gesture.
  const captureLost = (event: PointerEvent) => { if (document.pointerLockElement !== canvas) cancel(event); };
  const lockChanged = () => {
    if (document.pointerLockElement === canvas) {
      if (!gesture) document.exitPointerLock(); else locked = true;
    } else if (locked) release(); // Escape/browser release must not leave held actions behind.
  };
  const hidden = () => { if (document.hidden) release(); };
  const context = (event: MouseEvent) => event.preventDefault();
  const wheel = (event: WheelEvent) => { if (callbacks.enabled()) { event.preventDefault(); callbacks.zoom(event.deltaY); } };
  canvas.addEventListener('pointerdown', down);
  document.addEventListener('mousemove', move);
  document.addEventListener('pointerlockchange', lockChanged);
  document.addEventListener('pointerlockerror', release);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', cancel);
  canvas.addEventListener('lostpointercapture', captureLost);
  canvas.addEventListener('contextmenu', context);
  canvas.addEventListener('wheel', wheel, { passive: false });
  window.addEventListener('pointerup', up);
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', hidden);
  return { release, dispose() {
    release();
    canvas.removeEventListener('pointerdown', down);
    document.removeEventListener('mousemove', move);
    document.removeEventListener('pointerlockchange', lockChanged);
    document.removeEventListener('pointerlockerror', release);
    canvas.removeEventListener('pointerup', up);
    canvas.removeEventListener('pointercancel', cancel);
    canvas.removeEventListener('lostpointercapture', captureLost);
    canvas.removeEventListener('contextmenu', context);
    canvas.removeEventListener('wheel', wheel);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('blur', release);
    document.removeEventListener('visibilitychange', hidden);
  } };
}
