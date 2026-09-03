import type { KartDebugSnapshot } from './kart';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const format = (value: number) => (Math.abs(value) < 0.005 ? '0.000' : value.toFixed(3));

export class DebugHud {
    private readonly root: HTMLElement;
    private readonly values = new Map<string, HTMLElement>();
    private readonly bars = new Map<string, HTMLElement>();

    constructor() {
        document.body.insertAdjacentHTML(
            'beforeend',
            `<aside id="debug-hud" class="debug-hud" aria-label="Kart Controller Debug HUD">
                <div class="debug-title">Kart Debug <span>F3</span></div>
                <div class="debug-section">
                    <div class="debug-row"><span>Speed signed</span><output data-debug="forwardSpeed">0.000</output></div>
                    <div class="debug-row"><span>Speed total</span><output data-debug="totalSpeed">0.000</output></div>
                    <div class="debug-row"><span>Input gas/brake</span><output data-debug="inputY">0.000</output></div>
                    <div class="debug-row"><span>Input steering</span><output data-debug="inputX">0.000</output></div>
                    <div class="debug-row"><span>Hop / Drift</span><output data-debug="hopDrift">NEIN</output></div>
                    <div class="debug-row"><span>Steering smooth</span><output data-debug="steering">0.000</output></div>
                    <div class="debug-row"><span>Wheel steering</span><output data-debug="wheelSteering">0.000</output></div>
                    <div class="debug-row"><span>Engine force</span><output data-debug="engineForce">0.000</output></div>
                    <div class="debug-row"><span>Brake force</span><output data-debug="brakeForce">0.000</output></div>
                    <div class="debug-row"><span>Angular Y (raw)</span><output data-debug="yawSpeed">0.000</output></div>
                    <div class="debug-row"><span>Vehicle turn</span><output data-debug="vehicleTurn">0.000</output></div>
                    <div class="debug-row"><span>Forward velocity</span><output data-debug="forwardSpeedDetail">0.000</output></div>
                    <div class="debug-row"><span>Lateral velocity</span><output data-debug="lateralSpeed">0.000</output></div>
                    <div class="debug-row"><span>Drift status</span><output data-debug="driftStatus">NO</output></div>
                    <div class="debug-row"><span>Mini-Turbo</span><output data-debug="boostStatus">NO</output></div>
                    <div class="debug-row"><span>Drift amount</span><output data-debug="driftAmount">0.000</output></div>
                </div>
                <div class="debug-label">INPUT LENKUNG <small>Links &lt;----|----&gt; Rechts · 0 = neutral</small></div>
                <div class="debug-bar" data-bar="inputSteering"><i></i><b></b></div>
                <div class="debug-label">CONTROLLER LENKUNG <small>Links &lt;----|----&gt; Rechts · 0 = neutral</small></div>
                <div class="debug-bar" data-bar="controllerSteering"><i></i><b></b></div>
                <div class="debug-label">FAHRZEUGREAKTION <small>Links &lt;----|----&gt; Rechts · Marker = reale Yaw-Rate</small></div>
                <div class="debug-bar" data-bar="vehicleTurn"><i></i><b></b></div>
                <div class="debug-label">SEITENBEWEGUNG <small>Links &lt;----|----&gt; Rechts · 0 = keine Seitwärtsbewegung</small></div>
                <div class="debug-bar" data-bar="lateral"><i></i><b></b></div>
                <div class="debug-label">GAS / BREMSE (INPUT) <small>Rückwärts &nbsp; Neutral &nbsp; Vorwärts</small></div>
                <div class="debug-bar" data-bar="inputY"><i></i><b></b></div>
                <div class="debug-label">GESCHWINDIGKEIT (FAHRZEUG) <small>Rückwärts &nbsp; 0 &nbsp; Vorwärts</small></div>
                <div class="debug-bar" data-bar="speed"><i></i><b></b></div>
            </aside>`
        );
        this.root = document.getElementById('debug-hud')!;
        this.root.querySelectorAll<HTMLElement>('[data-debug]').forEach((element) => {
            this.values.set(element.dataset.debug!, element);
        });
        this.root.querySelectorAll<HTMLElement>('[data-bar]').forEach((element) => {
            this.bars.set(element.dataset.bar!, element);
        });
        window.addEventListener('keydown', (event) => {
            if (event.code === 'F3') {
                event.preventDefault();
                this.root.classList.toggle('is-hidden');
            }
        });
    }

    update(snapshot: KartDebugSnapshot) {
        this.setValue('forwardSpeed', snapshot.forwardSpeed);
        this.setValue('forwardSpeedDetail', snapshot.forwardSpeed);
        this.setValue('totalSpeed', snapshot.totalSpeed);
        this.setValue('inputY', snapshot.inputY);
        this.setValue('inputX', snapshot.inputX);
        this.setValue('steering', snapshot.steering);
        this.setValue('wheelSteering', snapshot.wheelSteering);
        this.setValue('engineForce', snapshot.engineForce);
        this.setValue('brakeForce', snapshot.brakeForce);
        this.values.get('hopDrift')!.textContent = snapshot.inputHop ? 'HOP' : snapshot.inputDrift ? 'DRIFT' : 'NEIN';
        this.setValue('yawSpeed', snapshot.yawSpeed);
        this.setValue('lateralSpeed', snapshot.lateralSpeed);
        this.values.get('driftStatus')!.textContent = snapshot.driftActive ? 'JA' : 'NEIN';
        this.values.get('boostStatus')!.textContent = snapshot.boostActive ? 'JA' : 'NEIN';
        this.setValue('driftAmount', snapshot.driftAmount);
        this.setCenteredBar('inputSteering', snapshot.inputX, 1);
        this.setCenteredBar('controllerSteering', snapshot.steering, 1);
        this.setCenteredBar('vehicleTurn', snapshot.vehicleTurn, 3, 3);
        this.setCenteredBar('lateral', snapshot.lateralSpeed, 5);
        this.setCenteredBar('inputY', snapshot.inputY, 1);
        this.setCenteredBar('speed', snapshot.forwardSpeed, 16, 6);
    }

    private setValue(key: string, value: number) {
        this.values.get(key)!.textContent = format(value);
    }

    private setCenteredBar(
        key: string,
        value: number,
        positiveMax: number,
        negativeMax = positiveMax,
        referenceValue = 0
    ) {
        const bar = this.bars.get(key)!;
        const marker = bar.querySelector<HTMLElement>('b')!;
        const neutralPosition = (negativeMax / (positiveMax + negativeMax)) * 100;
        const position = ((clamp(value, -negativeMax, positiveMax) + negativeMax) / (positiveMax + negativeMax)) * 100;
        const referencePosition =
            ((clamp(referenceValue, -negativeMax, positiveMax) + negativeMax) / (positiveMax + negativeMax)) * 100;
        marker.style.left = `${position}%`;
        bar.querySelector<HTMLElement>('i')!.style.left = `${neutralPosition}%`;
        const target = bar.querySelector<HTMLElement>('em');
        if (target) target.style.left = `${referencePosition}%`;
        bar.classList.toggle('is-positive', value > 0.005);
        bar.classList.toggle('is-negative', value < -0.005);
    }
}
