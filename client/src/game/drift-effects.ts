import { Color, Entity, StandardMaterial } from 'playcanvas';

/** A fixed-size pool keeps drift feedback cheap and attached to the rear contact patches. */
export class DriftEffects {
    private readonly sparks: Entity[] = [];
    private readonly blue = new StandardMaterial();
    private readonly gold = new StandardMaterial();
    private time = 0;

    constructor(kart: Entity) {
        this.blue.diffuse = new Color(0.1, 0.65, 1);
        this.blue.emissive = new Color(0.2, 0.75, 1);
        this.blue.update();
        this.gold.diffuse = new Color(1, 0.6, 0.1);
        this.gold.emissive = new Color(1, 0.8, 0.15);
        this.gold.update();
        for (const side of [-1, 1]) {
            for (let index = 0; index < 6; index += 1) {
                const spark = new Entity(`drift-spark-${side}-${index}`);
                spark.addComponent('render', { type: 'box', material: this.blue, castShadows: false });
                spark.enabled = false;
                kart.addChild(spark);
                this.sparks.push(spark);
            }
        }
    }

    update(dt: number, stage: number, active: boolean, reduced: boolean): void {
        this.time += dt;
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
    }
}
