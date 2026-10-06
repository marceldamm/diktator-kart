import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import type { Scene } from '@babylonjs/core/scene';
import type { KartState } from './kart-model';
import { elevationAt, trackLocate } from './track';

const VIEWS = [
  { name: 'Verfolger nah', distance: 5.5, height: 2.1, fov: 0.9, follow: 9, look: 3.4, lookHeight: 1.05 },
  { name: 'Verfolger fern', distance: 9.2, height: 3.5, fov: 0.88, follow: 6, look: 4.5, lookHeight: 1.0 },
  { name: 'Fahrerperspektive', distance: 0, height: 0, fov: 1.05, follow: 14, look: 0, lookHeight: 0 },
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
  private intro=false;
  private introAngle=.68;
  /** Chase yaw lags the kart so corners and drifts show its flank. */
  private chaseHeading=0;
  private fovKick=0;
  private shake=0;
  private tankBlend=0;
  /** Mouse look: orbit offsets, rear view and zoom (chase views); recentres after a short idle. */
  private lookYaw=0;
  private lookPitch=0;
  private lookIdle=0;
  private lookBack=false;
  private looking=false;
  private zoom=1;
  private lastImpact=0;

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
    this.resetLook();
    this.view = (this.view + 1) % VIEWS.length;
    this.cockpit.setEnabled(this.view === 2 && !this.realCockpit);
    return VIEWS[this.view].name;
  }

  get viewName(): string { return VIEWS[this.view].name; }
  get babylonCamera(): FreeCamera { return this.camera; }
  get photoMode(): boolean { return this.photo; }
  get introMode():boolean {return this.intro;}
  setIntroMode(intro:boolean):void {this.resetLook();this.intro=intro;this.cockpit.setEnabled(!intro&&this.view===2&&!this.realCockpit);}
  setReducedMotion(reduced:boolean):void { this.reducedMotion=reduced; }
  look(dx:number,dy:number):void { this.lookYaw+=dx*.0045; this.lookPitch=Math.max(-.6,Math.min(.8,this.lookPitch+dy*.0035)); this.lookIdle=0; }
  setLookBack(back:boolean):void { this.lookBack=back; }
  setLooking(active:boolean):void { this.looking=active; if(!active)this.lookYaw=Math.atan2(Math.sin(this.lookYaw),Math.cos(this.lookYaw)); this.lookIdle=0; }
  resetLook():void { this.lookYaw=0; this.lookPitch=0; this.lookIdle=0; this.looking=false; this.lookBack=false; }
  zoomBy(delta:number):void { this.zoom=Math.max(.6,Math.min(1.9,this.zoom*(delta>0?1.08:1/1.08))); }
  togglePhoto(): boolean { this.photo = !this.photo; this.cockpit.setEnabled(!this.photo && this.view === 2 && !this.realCockpit); return this.photo; }

  update(state: KartState, dt: number, immediate = false, steering = 0): void {
    // Smooth road elevation (Prachtallee crest) lifts every camera with the kart; small bumps stay in suspensionOffset.
    const ground = elevationAt(trackLocate(state.x, state.z).s);
    if (this.photo||this.intro) {
      if(this.photo)this.photoAngle+=dt*.18;else this.introAngle=.68+Math.sin(performance.now()/14000)*.12;
      const a=state.heading+(this.photo?this.photoAngle:this.introAngle),distance=this.intro?5.7:4.5;
      this.camera.position.set(state.x+Math.sin(a)*distance,(this.intro?2.2:1.8)+state.height+ground,state.z+Math.cos(a)*distance);
      this.camera.fov=this.intro?.73:.75;this.camera.setTarget(new Vector3(state.x,1.1+state.height+ground,state.z));this.chaseHeading=state.heading;return;
    }
    const view = VIEWS[this.view];
    const forwardX = Math.sin(state.heading);
    const forwardZ = Math.cos(state.heading);
    const firstPerson = this.view === 2;
    // The parade tank is bigger: pull the chase camera back and lift the cockpit eye into the hatch.
    this.tankBlend += (((state.tankRemaining ?? 0) > 0 ? 1 : 0) - this.tankBlend) * (immediate ? 1 : 1 - Math.exp(-3 * dt));
    // Lagging chase yaw: between body heading and travel direction while drifting.
    const aim = state.drifting ? state.heading + Math.atan2(Math.sin(state.travelHeading - state.heading), Math.cos(state.travelHeading - state.heading)) * .55 : state.heading;
    const yawRate = this.reducedMotion ? 14 : 4.2;
    if (immediate) this.chaseHeading = aim;
    else this.chaseHeading += Math.atan2(Math.sin(aim - this.chaseHeading), Math.cos(aim - this.chaseHeading)) * (1 - Math.exp(-yawRate * dt));
    this.lookIdle += dt; if ((!this.looking && this.lookIdle > .08) || this.lookBack) { const back = 1 - Math.exp(-(this.lookBack ? 30 : 5.5) * dt); this.lookYaw -= this.lookYaw * back; this.lookPitch -= this.lookPitch * back; }
    const orbit = this.lookBack ? state.heading + Math.PI : this.chaseHeading + this.lookYaw;
    const chaseX = Math.sin(orbit), chaseZ = Math.cos(orbit);
    const speed = Math.abs(state.speed);
    const desired = firstPerson
      ? new Vector3(state.x - forwardX * (this.realCockpit ? .42 : .05),
        (this.realCockpit ? 1.97 : 1.55) + this.tankBlend * .95 + state.height * (this.reducedMotion?.1:.9) + state.suspensionOffset * (this.reducedMotion?0:.3) + ground,
        state.z - forwardZ * (this.realCockpit ? .42 : .05))
      : new Vector3(state.x - chaseX * (view.distance + speed * .035) * this.zoom * (1 + this.tankBlend * .35),
        (view.height + this.lookPitch * 3) * Math.sqrt(this.zoom) + state.height * (this.reducedMotion?.05:.4) + state.suspensionOffset * (this.reducedMotion?0:.25) + ground,
        state.z - chaseZ * (view.distance + speed * .035) * this.zoom * (1 + this.tankBlend * .35));
    // Short camera jolt on hard impacts and item hits; calm camera keeps it still.
    if (state.impactRemaining > this.lastImpact + .05 && !this.reducedMotion) this.shake = Math.min(.22, .08 + Math.abs(state.impactVelocityX) * .02 + Math.abs(state.impactVelocityZ) * .02 + (state.impactKind === 'item' ? .1 : 0));
    this.lastImpact = state.impactRemaining; this.shake = Math.max(0, this.shake - dt * .6);
    if (this.shake > 0) { const t = performance.now() / 1000; desired.x += Math.sin(t * 61) * this.shake; desired.y += Math.sin(t * 47 + 1) * this.shake * .7; }
    const blend = immediate || this.lookBack ? 1 : 1 - Math.exp(-(this.reducedMotion?14:view.follow) * dt);
    if (firstPerson) {
      // The eye is fixed to the seat: no positional lag at speed, only a softened vertical bob.
      const y = this.camera.position.y + (desired.y - this.camera.position.y) * (immediate ? 1 : 1 - Math.exp(-18 * dt));
      this.camera.position.set(desired.x, y, desired.z);
    } else this.camera.position = Vector3.Lerp(this.camera.position, desired, blend);
    // Speed widens the view slightly; mini-turbo adds a brief kick. Calm camera keeps a fixed angle.
    const kickTarget = this.reducedMotion ? 0 : Math.min(.1, speed / 20 * .1) + (state.turboRemaining > 0 ? .085 : 0);
    this.fovKick += (kickTarget - this.fovKick) * (immediate ? 1 : 1 - Math.exp(-6 * dt));
    this.camera.fov = (firstPerson && this.realCockpit ? 1.45 : view.fov) + this.fovKick;
    this.camera.setTarget(firstPerson
      ? new Vector3(this.camera.position.x + forwardX * 8, this.camera.position.y - (this.realCockpit ? 1.7 : .14),
        this.camera.position.z + forwardZ * 8)
      : new Vector3(state.x + chaseX * view.look, view.lookHeight + state.height * 0.5 + ground, state.z + chaseZ * view.look));
    if (firstPerson && (this.lookBack || Math.abs(this.lookYaw) > .01 || Math.abs(this.lookPitch) > .01)) {
      const yaw = this.lookBack ? state.heading + Math.PI : state.heading + this.lookYaw;
      this.camera.setTarget(new Vector3(this.camera.position.x + Math.sin(yaw) * 8, this.camera.position.y + Math.tan(-.15-this.lookPitch) * 8, this.camera.position.z + Math.cos(yaw) * 8));
    }
    this.wheel.rotation.z = -steering * 0.45;
  }
}
