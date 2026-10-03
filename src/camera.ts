import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import type { Scene } from '@babylonjs/core/scene';
import type { KartState } from './kart-model';

const VIEWS = [
  { name: 'Verfolger nah', distance: 6.8, height: 3.15, fov: 0.85, follow: 8 },
  { name: 'Verfolger fern', distance: 12.5, height: 5.7, fov: 0.9, follow: 5 },
  { name: 'Fahrerperspektive', distance: 0, height: 0, fov: 1.05, follow: 14 },
] as const;

function cockpitMaterial(scene: Scene, name: string, color: Color3): StandardMaterial {
  const result = new StandardMaterial(name, scene);
  result.diffuseColor = color;
  result.emissiveColor = color.scale(0.25);
  return result;
}

export class KartCamera {
  private readonly camera: FreeCamera;
  private readonly cockpit: TransformNode;
  private readonly wheel: TransformNode;
  private view = 0;
  private readonly realCockpit: boolean;
  private photo = false;
  private photoAngle = .65;
  private reducedMotion=false;

  constructor(scene: Scene, state: KartState, realCockpit = false) {
    this.realCockpit = realCockpit;
    this.camera = new FreeCamera('kart-camera', Vector3.Zero(), scene);
    this.camera.minZ = 0.05;
    scene.activeCamera = this.camera;

    const shell = cockpitMaterial(scene, 'cockpit-shell-mat', new Color3(0.07, 0.12, 0.14));
    const rim = cockpitMaterial(scene, 'cockpit-rim-mat', new Color3(0.9, 0.61, 0.16));
    const hoodPaint = cockpitMaterial(scene, 'cockpit-hood-mat', new Color3(0.47, 0.06, 0.07));
    const hand = cockpitMaterial(scene, 'cockpit-hand-mat', new Color3(0.82, 0.59, 0.41));
    const tire = cockpitMaterial(scene, 'cockpit-tire-mat', new Color3(0.035, 0.045, 0.05));
    this.cockpit = new TransformNode('cockpit-view', scene);
    this.cockpit.parent = this.camera;
    const dashboard = MeshBuilder.CreateBox('cockpit-dashboard', { width: 1.3, height: 0.12, depth: 0.24 }, scene);
    dashboard.position.set(0, -0.48, 0.85);
    dashboard.material = shell;
    dashboard.parent = this.cockpit;
    const hood = MeshBuilder.CreateBox('cockpit-hood', { width: 1.55, height: 0.1, depth: 1.5 }, scene);
    hood.position.set(0, -0.73, 1.77);
    hood.material = hoodPaint;
    hood.parent = this.cockpit;
    for (const x of [-0.35, 0.35]) {
      const gauge = MeshBuilder.CreateCylinder(`cockpit-gauge-${x}`,
        { diameter: 0.12, height: 0.025, tessellation: 16 }, scene);
      gauge.rotation.x = Math.PI / 2;
      gauge.position.set(x * 0.72, -0.4, 0.93);
      gauge.material = rim;
      gauge.parent = this.cockpit;
      const frontTire = MeshBuilder.CreateCylinder(`cockpit-front-tire-${x}`,
        { diameter: 0.28, height: 0.13, tessellation: 14 }, scene);
      frontTire.rotation.z = Math.PI / 2;
      frontTire.position.set(x < 0 ? -1.1 : 1.1, -0.7, 2.35);
      frontTire.material = tire;
      frontTire.parent = this.cockpit;
    }
    this.wheel = new TransformNode('cockpit-steering', scene);
    this.wheel.position.set(0, -0.42, 0.95);
    this.wheel.parent = this.cockpit;
    const steeringRim = MeshBuilder.CreateTorus('cockpit-steering-rim', { diameter: 0.37, thickness: 0.04, tessellation: 20 }, scene);
    steeringRim.rotation.x = Math.PI / 2.8;
    steeringRim.material = shell;
    steeringRim.parent = this.wheel;
    for (const x of [-0.2, 0.2]) {
      const palm = MeshBuilder.CreateSphere(`cockpit-hand-${x}`, { diameter: 0.12, segments: 8 }, scene);
      palm.position.set(x, 0, 0.02);
      palm.material = hand;
      palm.parent = this.wheel;
    }
    this.cockpit.setEnabled(false);
    this.update(state, 0, true);
  }

  cycleView(): string {
    this.view = (this.view + 1) % VIEWS.length;
    this.cockpit.setEnabled(this.view === 2 && !this.realCockpit);
    return VIEWS[this.view].name;
  }

  get viewName(): string { return VIEWS[this.view].name; }
  get photoMode(): boolean { return this.photo; }
  setReducedMotion(reduced:boolean):void { this.reducedMotion=reduced; }
  togglePhoto(): boolean { this.photo = !this.photo; this.cockpit.setEnabled(!this.photo && this.view === 2 && !this.realCockpit); return this.photo; }

  update(state: KartState, dt: number, immediate = false, steering = 0): void {
    if (this.photo) {
      this.photoAngle += dt * .18;
      const a=state.heading+this.photoAngle;
      this.camera.position.set(state.x+Math.sin(a)*4.5,1.8+state.height,state.z+Math.cos(a)*4.5);
      this.camera.fov=.75;this.camera.setTarget(new Vector3(state.x,1.1+state.height,state.z));return;
    }
    const view = VIEWS[this.view];
    const forwardX = Math.sin(state.heading);
    const forwardZ = Math.cos(state.heading);
    const firstPerson = this.view === 2;
    const desired = firstPerson
      ? new Vector3(state.x - forwardX * (this.realCockpit ? .42 : .05),
        (this.realCockpit ? 1.89 : 1.55) + state.height * (this.reducedMotion?.1:.9) + state.suspensionOffset * (this.reducedMotion?0:.3),
        state.z - forwardZ * (this.realCockpit ? .42 : .05))
      : new Vector3(state.x - forwardX * view.distance,
        view.height + state.height * (this.reducedMotion?.05:.35),
        state.z - forwardZ * view.distance);
    const blend = immediate ? 1 : 1 - Math.exp(-(this.reducedMotion?14:view.follow) * dt);
    this.camera.position = Vector3.Lerp(this.camera.position, desired, blend);
    this.camera.fov = (firstPerson && this.realCockpit ? 1.45 : view.fov) + (!this.reducedMotion&&state.turboRemaining > 0 ? .075 : 0);
    this.camera.setTarget(firstPerson
      ? new Vector3(this.camera.position.x + forwardX * 8, this.camera.position.y - (this.realCockpit ? 1.7 : .14),
        this.camera.position.z + forwardZ * 8)
      : new Vector3(state.x + forwardX * 2, 0.85 + state.height * 0.5, state.z + forwardZ * 2));
    this.wheel.rotation.z = -steering * 0.45;
  }
}
