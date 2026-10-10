export type Action =
  | 'accelerate' | 'brake' | 'steerLeft' | 'steerRight' | 'hopDrift'
  | 'camera' | 'item' | 'defend' | 'itemForward' | 'itemBackward' | 'special' | 'pause' | 'restart' | 'debug' | 'photo' | 'recover' | 'menu' | 'lookBack' | 'horn';

export interface InputFrame {
  throttle: number;
  steering: number;
  hopDrift: boolean;
  pressed: ReadonlySet<Action>;
}

export const DEFAULT_BINDINGS: Readonly<Record<string, Action>> = {
  ArrowUp: 'accelerate', KeyW: 'accelerate',
  ArrowDown: 'brake', KeyS: 'brake',
  ArrowLeft: 'steerLeft', KeyA: 'steerLeft',
  ArrowRight: 'steerRight', KeyD: 'steerRight',
  Space: 'hopDrift', KeyC: 'camera', KeyE: 'item', KeyZ: 'defend', KeyQ: 'special',
  KeyP: 'pause', KeyR: 'restart', F3: 'debug', KeyF: 'photo', KeyV: 'itemForward', KeyH: 'itemBackward', KeyB: 'recover',Escape:'menu',
  KeyX: 'lookBack',
};
const bindings: Record<string, Action> = { ...DEFAULT_BINDINGS };
/** Driving actions the options menu lets players rebind (07.10.2026; arrow keys stay as a second layout). */
export const REBINDABLE: readonly { action: Action; label: string }[] = [
  { action: 'accelerate', label: 'Gas' }, { action: 'brake', label: 'Bremse' }, { action: 'steerLeft', label: 'Links' }, { action: 'steerRight', label: 'Rechts' },
  { action: 'hopDrift', label: 'Hop/Drift' }, { action: 'item', label: 'Item' }, { action: 'defend', label: 'Abwehrschild' }, { action: 'special', label: 'Fähigkeit' }, { action: 'camera', label: 'Kamera' },
  { action: 'lookBack', label: 'Rückblick' }, { action: 'recover', label: 'Rücksetzen' },
];
const PROTECTED = new Set(['Escape', 'F3', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Tab']);
/** Primary (non-arrow) key of an action. */
export function primaryKey(action: Action): string | undefined {
  return Object.keys(bindings).find((code) => bindings[code] === action && !code.startsWith('Arrow'));
}
/** Binds `code` as the action's primary key; the key leaves any action it served before. Returns false for reserved keys. */
export function rebind(action: Action, code: string): boolean {
  if (PROTECTED.has(code)) return false;
  const old = primaryKey(action);
  if (old) delete bindings[old];
  bindings[code] = action;
  return true;
}
export function resetBindings(): void { for (const k of Object.keys(bindings)) delete bindings[k]; Object.assign(bindings, DEFAULT_BINDINGS); }
export function exportBindings(): Record<string, Action> { return { ...bindings }; }
export function importBindings(saved: unknown): void {
  if (!saved || typeof saved !== 'object') return;
  const entries = Object.entries(saved as Record<string, unknown>).filter(([, a]) => typeof a === 'string' && Object.values(DEFAULT_BINDINGS).includes(a as Action));
  if (!entries.length) return;
  for (const k of Object.keys(bindings)) delete bindings[k];
  Object.assign(bindings, Object.fromEntries(entries));
  for (const code of ['Escape', 'F3', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']) bindings[code] = DEFAULT_BINDINGS[code];
}
/** Short readable key name for menus. */
export const keyLabel = (code: string | undefined) => !code ? '–' : code.replace(/^Key/, '').replace(/^Digit/, '').replace('Space', 'Leertaste').replace('ShiftLeft', 'Shift').replace('ControlLeft', 'Strg');

// All devices write through this interface. A later touch adapter can use its own source ID.
export class InputHub {
  private readonly sources = new Map<string, Set<Action>>();
  private readonly pending = new Set<Action>();
  /** Analog axes (gamepad): stick steering and trigger throttle override digital input when stronger. */
  private analog = { throttle: 0, steering: 0 };
  setAnalog(throttle: number, steering: number): void { this.analog = { throttle, steering }; }

  setAction(source: string, action: Action, down: boolean): void {
    let state = this.sources.get(source);
    if (!state) {
      state = new Set<Action>();
      this.sources.set(source, state);
    }
    const wasDown = this.isDown(action);
    if (down) state.add(action);
    else state.delete(action);
    if (down && !wasDown) this.pending.add(action);
  }

  releaseSource(source: string): void {
    this.sources.delete(source);
  }

  reset(): void {
    this.sources.clear();
    this.pending.clear();
    this.analog = { throttle: 0, steering: 0 };
  }

  isDown(action: Action): boolean {
    return [...this.sources.values()].some((state) => state.has(action));
  }

  read(): InputFrame {
    const pressed = new Set(this.pending);
    this.pending.clear();
    // A quick tap that begins and ends between render frames still counts for one frame.
    const active = (action: Action) => this.isDown(action) || pressed.has(action);
    const digitalThrottle = Number(active('accelerate')) - Number(active('brake'));
    const digitalSteering = Number(active('steerRight')) - Number(active('steerLeft'));
    return {
      throttle: Math.abs(this.analog.throttle) > Math.abs(digitalThrottle) ? this.analog.throttle : digitalThrottle,
      steering: Math.abs(this.analog.steering) > Math.abs(digitalSteering) ? this.analog.steering : digitalSteering,
      hopDrift: active('hopDrift'),
      pressed,
    };
  }
}

export function attachKeyboard(input: InputHub): () => void {
  let forwardModifierUsedForItem = false;
  const onKeyDown = (event: KeyboardEvent) => {
    const action = bindings[event.code];
    if (!action) return;
    event.preventDefault();
    if (event.code === 'KeyV' && input.isDown('item')) forwardModifierUsedForItem = true;
    if (event.code === 'KeyE' && input.isDown('itemForward')) forwardModifierUsedForItem = true;
    input.setAction(`keyboard:${event.code}`, action, true);
  };
  const onKeyUp = (event: KeyboardEvent) => {
    const action = bindings[event.code];
    if (!action) return;
    event.preventDefault();
    input.setAction(`keyboard:${event.code}`, action, false);
    if (event.code === 'KeyV') {
      if (!forwardModifierUsedForItem) {
        input.setAction('keyboard:KeyV:horn', 'horn', true);
        input.setAction('keyboard:KeyV:horn', 'horn', false);
      }
      if (!input.isDown('item')) forwardModifierUsedForItem = false;
    } else if (event.code === 'KeyE' && !input.isDown('itemForward')) {
      forwardModifierUsedForItem = false;
    }
  };
  const onBlur = () => { input.reset(); forwardModifierUsedForItem = false; };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', onBlur);
    input.reset();
  };
}

/** A held button/pen/touch action that shares keyboard hold/release semantics. */
export function attachPointerHold(input: InputHub, element: HTMLElement, action: Action, sourceName: string): () => void {
  const sources = new Map<number, string>();
  const down = (event: PointerEvent) => {
    if (event.button !== 0 || (element as HTMLButtonElement).disabled) return;
    const source = `pointer:${sourceName}:${event.pointerId}`;
    sources.set(event.pointerId, source);
    input.setAction(source, action, true);
    try { element.setPointerCapture(event.pointerId); } catch { /* Synthetic events and older browsers may not support capture. */ }
  };
  const up = (event: PointerEvent) => {
    const source = sources.get(event.pointerId);
    if (!source) return;
    input.releaseSource(source); sources.delete(event.pointerId);
  };
  const release = () => { for (const source of sources.values()) input.releaseSource(source); sources.clear(); };
  const blurTarget = typeof window === 'undefined' ? undefined : window;
  element.addEventListener('pointerdown', down);
  element.addEventListener('pointerup', up);
  element.addEventListener('pointercancel', up);
  element.addEventListener('lostpointercapture', up);
  blurTarget?.addEventListener('blur', release);
  return () => {
    release();
    element.removeEventListener('pointerdown', down);
    element.removeEventListener('pointerup', up);
    element.removeEventListener('pointercancel', up);
    element.removeEventListener('lostpointercapture', up);
    blurTarget?.removeEventListener('blur', release);
  };
}

/** Pointer IDs keep simultaneous touch steering, gas and drift independent. */
export function attachTouch(input:InputHub,root:HTMLElement):()=>void {
  const sources=new Map<number,string>();
  const down=(event:PointerEvent)=>{
    const button=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-drive-action]');if(!button)return;
    event.preventDefault();const source=`touch:${event.pointerId}`;sources.set(event.pointerId,source);
    input.setAction(source,button.dataset.driveAction as Action,true);button.setPointerCapture(event.pointerId);
  };
  const up=(event:PointerEvent)=>{const source=sources.get(event.pointerId);if(source){input.releaseSource(source);sources.delete(event.pointerId);}};
  const release=()=>{for(const source of sources.values())input.releaseSource(source);sources.clear();};
  root.addEventListener('pointerdown',down);root.addEventListener('pointerup',up);root.addEventListener('pointercancel',up);root.addEventListener('lostpointercapture',up);window.addEventListener('blur',release);
  return ()=>{release();root.removeEventListener('pointerdown',down);root.removeEventListener('pointerup',up);root.removeEventListener('pointercancel',up);root.removeEventListener('lostpointercapture',up);window.removeEventListener('blur',release);};
}

/**
 * Standard-mapping gamepads (07.10.2026): left stick steers (dead zone 0.15), RT/LT are gas/brake, A hop/drift,
 * X item, Y camera, B look back, RB ability, LB recover, D-pad up/down throw forward/back, Start menu, Back pause.
 * In menus A/B/D-pad act as Enter/Escape/arrows through `menuKey`.
 */
export function pollGamepads(input: InputHub, menuOpen: boolean, menuKey: (code: string) => void, previous: Map<string, boolean>): boolean {
  const pads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : [];
  let any = false, throttle = 0, steering = 0;
  const map: [number, Action][] = [[0, 'hopDrift'], [2, 'item'], [3, 'camera'], [1, 'lookBack'], [5, 'special'], [4, 'recover'], [12, 'itemForward'], [13, 'itemBackward'], [14, 'defend'], [9, 'menu'], [8, 'pause'], [11, 'horn']];
  for (const pad of pads) {
    if (!pad || !pad.connected) continue;
    any = true;
    const x = pad.axes[0] ?? 0, dead = .15;
    const stick = Math.abs(x) < dead ? 0 : Math.sign(x) * (Math.abs(x) - dead) / (1 - dead);
    if (Math.abs(stick) > Math.abs(steering)) steering = stick;
    const gas = pad.buttons[7]?.value ?? 0, brake = pad.buttons[6]?.value ?? 0;
    const pedal = gas > .08 || brake > .08 ? gas - brake : 0;
    if (Math.abs(pedal) > Math.abs(throttle)) throttle = pedal;
    for (const [index, action] of map) {
      const down = !!pad.buttons[index]?.pressed, key = `${pad.index}:${index}`, was = previous.get(key) ?? false;
      previous.set(key, down);
      if (menuOpen) {
        if (down && !was) { const code = index === 0 ? 'Enter' : index === 1 ? 'Escape' : index === 9 ? 'Escape' : ''; if (code) menuKey(code); }
        input.setAction(`gamepad:${pad.index}:${index}`, action, false);
        continue;
      }
      input.setAction(`gamepad:${pad.index}:${index}`, action, down);
    }
    if (menuOpen) for (const [index, code] of [[14, 'ArrowLeft'], [15, 'ArrowRight']] as const) {
      const down = !!pad.buttons[index]?.pressed, key = `${pad.index}:${index}`, was = previous.get(key) ?? false;
      previous.set(key, down); if (down && !was) menuKey(code);
    }
  }
  input.setAnalog(menuOpen ? 0 : throttle, menuOpen ? 0 : steering);
  return any;
}
