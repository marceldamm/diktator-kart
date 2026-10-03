/**
 * Cursor is locked only for the duration of a deliberate mouse gesture. When a browser refuses Pointer Lock
 * (embedded app browsers, Chrome's cooldown after Esc), the held gesture keeps working through Pointer Capture.
 */
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
    // Native Pointer Lock restores the OS cursor to its original position on release. A refused lock is not
    // a released button: the gesture continues with captured pointer movement.
    try { const pending = canvas.requestPointerLock(); pending?.catch(() => { locked = false; }); }
    catch { locked = false; }
  };
  const move = (event: MouseEvent) => {
    if (document.pointerLockElement !== canvas || !gesture) return;
    follow(event);
  };
  // Fallback without Pointer Lock: the captured pointer still reports relative movement.
  const captured = (event: PointerEvent) => {
    if (document.pointerLockElement === canvas || !gesture || event.pointerId !== pointer) return;
    follow(event);
  };
  const follow = (event: MouseEvent) => {
    if (!gesture) return;
    const held = gesture === 'look' ? 1 : 2;
    if (!(event.buttons & held) || !callbacks.enabled()) { release(); return; }
    if (gesture !== 'look') return;
    callbacks.look(event.movementX, event.movementY);
  };
  const up = (event: PointerEvent) => { if (pointer === event.pointerId && !(event.buttons & (gesture === 'look' ? 1 : 2))) release(); };
  const cancel = (event: PointerEvent) => { if (pointer === event.pointerId) release(); };
  // Acquiring Pointer Lock deliberately releases Pointer Capture (W3C Pointer Events).
  // That transition is not the user releasing their held camera gesture.
  const captureLost = (event: PointerEvent) => {
    if (document.pointerLockElement === canvas || pointer !== event.pointerId) return;
    // Chrome drops capture just before the lock is granted; only a released button ends the gesture.
    window.setTimeout(() => { if (pointer === event.pointerId && document.pointerLockElement !== canvas && !lastButtons(gesture)) release(); }, 120);
  };
  let buttons = 0;
  const track = (event: PointerEvent) => { buttons = event.buttons; };
  const lastButtons = (g: typeof gesture) => buttons & (g === 'look' ? 1 : 2);
  const lockChanged = () => {
    if (document.pointerLockElement === canvas) {
      if (!gesture) document.exitPointerLock(); else locked = true;
    } else if (locked) release(); // Escape/browser release must not leave held actions behind.
  };
  const lockRefused = () => { locked = false; };
  const hidden = () => { if (document.hidden) release(); };
  const context = (event: MouseEvent) => event.preventDefault();
  const wheel = (event: WheelEvent) => { if (callbacks.enabled()) { event.preventDefault(); callbacks.zoom(event.deltaY); } };
  canvas.addEventListener('pointerdown', down);
  document.addEventListener('mousemove', move);
  document.addEventListener('pointerlockchange', lockChanged);
  document.addEventListener('pointerlockerror', lockRefused);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', cancel);
  canvas.addEventListener('pointermove', captured);
  window.addEventListener('pointermove', track, true);
  window.addEventListener('pointerdown', track, true);
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
    document.removeEventListener('pointerlockerror', lockRefused);
    canvas.removeEventListener('pointerup', up);
    canvas.removeEventListener('pointercancel', cancel);
    canvas.removeEventListener('pointermove', captured);
    window.removeEventListener('pointermove', track, true);
    window.removeEventListener('pointerdown', track, true);
    canvas.removeEventListener('lostpointercapture', captureLost);
    canvas.removeEventListener('contextmenu', context);
    canvas.removeEventListener('wheel', wheel);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('blur', release);
    document.removeEventListener('visibilitychange', hidden);
  } };
}
