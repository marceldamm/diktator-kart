import { BLEND_NORMAL, Color, Entity, StandardMaterial } from 'playcanvas';

type TireMarkPair = { left: Entity; right: Entity; life: number };

/** A fixed-size pool keeps drift feedback cheap and attached to the rear contact patches. */
export class DriftEffects {
    private readonly sparks: Entity[] = [];
    private readonly tireMarks: TireMarkPair[] = [];
    private readonly blue = new StandardMaterial();
    private readonly gold = new StandardMaterial();
    private readonly rubber = new StandardMaterial();
    private readonly kart: Entity;
    private time = 0;
    private markTimer = 0;
    private markCursor = 0;

    constructor(kart: Entity) {
        this.kart = kart;
        this.blue.diffuse = new Color(0.1, 0.65, 1);
        this.blue.emissive = new Color(0.2, 0.75, 1);
        this.blue.update();
        this.gold.diffuse = new Color(1, 0.6, 0.1);
        this.gold.emissive = new Color(1, 0.8, 0.15);
        this.gold.update();
        this.rubber.diffuse = new Color(0.035, 0.03, 0.025);
        this.rubber.opacity = 0.27;
        this.rubber.blendType = BLEND_NORMAL;
        this.rubber.depthWrite = false;
        this.rubber.update();
        for (const side of [-1, 1]) {
            for (let index = 0; index < 6; index += 1) {
                const spark = new Entity(`drift-spark-${side}-${index}`);
                spark.addComponent('render', { type: 'box', material: this.blue, castShadows: false });
                spark.enabled = false;
                kart.addChild(spark);
                this.sparks.push(spark);
            }
        }
        const root = kart.parent ?? kart;
        for (let index = 0; index < 14; index += 1) {
            const pair: TireMarkPair = {
                left: new Entity(`tire-mark-left-${index}`),
                right: new Entity(`tire-mark-right-${index}`),
                life: 0
            };
            for (const mark of [pair.left, pair.right]) {
                mark.setLocalScale(0.12, 0.014, 1.25);
                mark.addComponent('render', { type: 'box', material: this.rubber, castShadows: false });
                mark.enabled = false;
                root.addChild(mark);
            }
            this.tireMarks.push(pair);
        }
    }

    update(dt: number, stage: number, active: boolean, reduced: boolean): void {
        this.time += dt;
        this.markTimer = Math.max(0, this.markTimer - dt);
        this.sparks.forEach((spark, index) => {
            spark.enabled = active && stage > 0 && (!reduced || index % 6 === 0);
            if (!spark.enabled) return;
            const side = index < 6 ? -1 : 1;
            const phase = reduced ? 0.2 : (this.time * 3 + (index % 6) / 6) % 1;
            spark.setLocalPosition(side * (0.8 + phase * 0.45), -0.35 + phase * 0.3, 0.85 + phase * 1.4);
            spark.setLocalScale(0.055, 0.055, 0.18 * (1 - phase) + 0.02);
            spark.setLocalEulerAngles(-25, side * 30, phase * 90);
            for (const mesh of spark.render!.meshInstances) mesh.material = stage === 2 ? this.gold : this.blue;
        });
        for (const mark of this.tireMarks) {
            mark.life = Math.max(0, mark.life - dt);
            mark.left.enabled = mark.life > 0 && !reduced;
            mark.right.enabled = mark.life > 0 && !reduced;
        }
        const speed = this.kart.rigidbody?.linearVelocity.length() ?? 0;
        if (active && !reduced && speed > 6 && this.markTimer === 0) this.leaveTireMark();
    }

    reset(): void {
        this.time = 0;
        this.markTimer = 0;
        this.markCursor = 0;
        this.sparks.forEach((spark) => (spark.enabled = false));
        this.tireMarks.forEach((mark) => {
            mark.life = 0;
            mark.left.enabled = false;
            mark.right.enabled = false;
        });
    }

    private leaveTireMark(): void {
        const pair = this.tireMarks[this.markCursor];
        this.markCursor = (this.markCursor + 1) % this.tireMarks.length;
        this.markTimer = 0.12;
        pair.life = 5;
        const position = this.kart.getPosition().clone();
        position.y = 0.068;
        const forward = this.kart.forward.clone();
        forward.y = 0;
        forward.normalize();
        const right = this.kart.right.clone();
        right.y = 0;
        right.normalize();
        const rear = position.sub(forward.mulScalar(0.92));
        const yaw = this.kart.getEulerAngles().y;
        for (const [mark, side] of [
            [pair.left, -1],
            [pair.right, 1]
        ] as const) {
            mark.setPosition(rear.clone().add(right.clone().mulScalar(side * 0.48)));
            mark.setEulerAngles(0, yaw, 0);
            mark.enabled = true;
        }
    }
}
