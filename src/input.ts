export type Action =
  | 'accelerate' | 'brake' | 'steerLeft' | 'steerRight' | 'hopDrift'
  | 'camera' | 'item' | 'special' | 'pause' | 'restart' | 'debug' | 'photo' | 'recover' | 'menu';

export interface InputFrame {
  throttle: number;
  steering: number;
  hopDrift: boolean;
  pressed: ReadonlySet<Action>;
}

const bindings: Record<string, Action> = {
  ArrowUp: 'accelerate', KeyW: 'accelerate',
  ArrowDown: 'brake', KeyS: 'brake',
  ArrowLeft: 'steerLeft', KeyA: 'steerLeft',
  ArrowRight: 'steerRight', KeyD: 'steerRight',
  Space: 'hopDrift', KeyC: 'camera', KeyE: 'item', KeyQ: 'special',
  KeyP: 'pause', KeyR: 'restart', F3: 'debug', KeyV: 'photo', KeyB: 'recover',Escape:'menu',
};

// All devices write through this interface. A later touch adapter can use its own source ID.
export class InputHub {
  private readonly sources = new Map<string, Set<Action>>();
  private readonly pending = new Set<Action>();

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
  }

  isDown(action: Action): boolean {
    return [...this.sources.values()].some((state) => state.has(action));
  }

  read(): InputFrame {
    const pressed = new Set(this.pending);
    this.pending.clear();
    // A quick tap that begins and ends between render frames still counts for one frame.
    const active = (action: Action) => this.isDown(action) || pressed.has(action);
    return {
      throttle: Number(active('accelerate')) - Number(active('brake')),
      steering: Number(active('steerRight')) - Number(active('steerLeft')),
      hopDrift: active('hopDrift'),
      pressed,
    };
  }
}

export function attachKeyboard(input: InputHub): () => void {
  const onKeyDown = (event: KeyboardEvent) => {
    const action = bindings[event.code];
    if (!action) return;
    event.preventDefault();
    input.setAction(`keyboard:${event.code}`, action, true);
  };
  const onKeyUp = (event: KeyboardEvent) => {
    const action = bindings[event.code];
    if (!action) return;
    event.preventDefault();
    input.setAction(`keyboard:${event.code}`, action, false);
  };
  const onBlur = () => input.reset();
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
