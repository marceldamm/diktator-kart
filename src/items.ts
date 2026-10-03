import { TRACK, trackLocate, trackPoint, trackProgress, wrap } from './track.ts';
import type { KartState } from './kart-model.ts';

export type ItemKind = 'direct' | 'homing' | 'trap';
export const ITEM_NAMES:Record<ItemKind,string>={direct:'Rohrpost',homing:'Suchauftrag',trap:'Stempelfalle'};
export interface ItemBox { id:number; x:number; z:number; readyIn:number }
export interface ItemObject { id:number; kind:ItemKind; owner:number; x:number; z:number; heading:number; age:number; remaining:number; target:number|null; bounces?:number }
export interface ItemEvent { kind:'pickup'|'launch'|'hit'; kart:number; item:ItemKind; owner?:number }
export interface ItemWorld {
  slots:(ItemKind|null)[];heldFor:number[];immune:number[];objects:ItemObject[];boxes:ItemBox[];
  events:ItemEvent[];random:number;nextId:number;time:number;
  stats:Record<ItemKind,{collected:number;launched:number;hits:number}>;
}
export const ITEM_RULES={maxPerKind:6,speed:24,lifetime:5,trapLifetime:12,boxRespawn:6,immunity:1.8,hitSpeedFactor:.6,hitRadius:1.35,homingTurnRate:2.4,maxBounces:3};
/** Dispatch box rows: end of the grandstand straight, the boulevard and the archive leg. */
export const ITEM_BOX_PROGRESS=[72,330,520];
export function createItems(count:number,seed=921):ItemWorld {
  return {slots:Array(count).fill(null),heldFor:Array(count).fill(0),immune:Array(count).fill(0),objects:[],
    boxes:ITEM_BOX_PROGRESS.flatMap((s,row)=>[-3,0,3].map((lane,col)=>({id:row*3+col,...trackPoint(s,lane),readyIn:0}))),events:[],random:seed,nextId:1,time:0,
    stats:{direct:{collected:0,launched:0,hits:0},homing:{collected:0,launched:0,hits:0},trap:{collected:0,launched:0,hits:0}}};
}
function roll(world:ItemWorld,rank:number,count:number):ItemKind {
  world.random=(Math.imul(world.random,1664525)+1013904223)>>>0;
  const n=world.random/4294967296;
  const homing=.25+.2*(rank-1)/Math.max(1,count-1);
  return n<homing?'homing':n<homing+.4?'direct':'trap';
}
function launch(world:ItemWorld,kind:ItemKind,owner:number,karts:KartState[]):boolean {
  if(world.objects.filter(o=>o.kind===kind).length>=ITEM_RULES.maxPerKind)return false;
  const kart=karts[owner],forward=kind==='trap'?-3:3;
  let target:number|null=null;
  if(kind==='homing') {
    const s=trackProgress(kart.x,kart.z);
    const ahead=karts.map((k,i)=>({i,d:wrap(trackProgress(k.x,k.z)-s)})).filter(t=>t.i!==owner&&t.d>1&&t.d<75).sort((a,b)=>a.d-b.d);
    target=ahead[0]?.i??null;
  }
  world.objects.push({id:world.nextId++,kind,owner,x:kart.x+Math.sin(kart.heading)*forward,z:kart.z+Math.cos(kart.heading)*forward,heading:kart.heading,age:0,remaining:kind==='trap'?ITEM_RULES.trapLifetime:ITEM_RULES.lifetime,target});
  world.events.push({kind:'launch',kart:owner,item:kind});world.stats[kind].launched++;return true;
}
const clampTurn=(v:number,limit:number)=>Math.max(-limit,Math.min(limit,v));
const sweptDistance=(x:number,z:number,ax:number,az:number,bx:number,bz:number)=>{
  const dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz||1)));
  return Math.hypot(x-ax-t*dx,z-az-t*dz);
};
/** Identical collection, allocation, launch, collision and immunity for all participants. */
export function stepItems(world:ItemWorld,karts:KartState[],activations:boolean[],ranks:number[],dt:number):KartState[] {
  world.events=[];world.time+=dt;world.immune=world.immune.map(n=>Math.max(0,n-dt));
  world.heldFor=world.heldFor.map((n,i)=>world.slots[i]?n+dt:0);
  const result=karts.slice();
  for(const box of world.boxes) {
    box.readyIn=Math.max(0,box.readyIn-dt);if(box.readyIn>0)continue;
    for(let i=0;i<karts.length;i++)if(!world.slots[i]&&Math.hypot(karts[i].x-box.x,karts[i].z-box.z)<1.65) {
      const kind=roll(world,ranks[i],karts.length);world.slots[i]=kind;world.heldFor[i]=0;box.readyIn=ITEM_RULES.boxRespawn;world.events.push({kind:'pickup',kart:i,item:kind});world.stats[kind].collected++;break;
    }
  }
  for(let i=0;i<karts.length;i++)if(activations[i]&&world.slots[i]&&launch(world,world.slots[i]!,i,karts))world.slots[i]=null;
  for(const o of world.objects) {
    const ax=o.x,az=o.z;o.age+=dt;o.remaining-=dt;
    if(o.kind!=='trap') {
      if(o.target!==null) {
        const target=karts[o.target];
        // Follow the course until close, then close in directly: no shortcuts through the park.
        const here=trackLocate(o.x,o.z),there=trackLocate(target.x,target.z);
        const aim=wrap(there.s-here.s)>11?trackPoint(here.s+7,Math.max(-3.5,Math.min(3.5,there.lane))):target;
        const desired=Math.atan2(aim.x-o.x,aim.z-o.z);
        const turn=Math.atan2(Math.sin(desired-o.heading),Math.cos(desired-o.heading));
        o.heading+=clampTurn(turn,ITEM_RULES.homingTurnRate*dt);
      }
      o.x+=Math.sin(o.heading)*ITEM_RULES.speed*dt;o.z+=Math.cos(o.heading)*ITEM_RULES.speed*dt;
      // Barriers reflect the pneumatic capsule a few times; nothing crosses the closed park.
      const at=trackLocate(o.x,o.z),limit=TRACK.wall-.35;
      if(Math.abs(at.lane)>limit) {
        o.bounces=(o.bounces??0)+1;
        if(o.bounces>ITEM_RULES.maxBounces||Math.abs(at.lane)>TRACK.halfWidth+2)o.remaining=0;
        const wall=trackPoint(at.s,Math.sign(at.lane)*limit);o.x=wall.x;o.z=wall.z;o.heading=2*wall.heading-o.heading;
      }
    }
    if(o.remaining<=0)continue;
    for(let i=0;i<karts.length;i++) {
      if((i===o.owner&&o.age<.8)||world.immune[i]>0||karts[i].height>.7)continue;
      if(sweptDistance(karts[i].x,karts[i].z,ax,az,o.x,o.z)>ITEM_RULES.hitRadius)continue;
      const k=result[i];result[i]={...k,speed:k.speed*ITEM_RULES.hitSpeedFactor,drifting:false,driftCharge:0,turboRemaining:0,impactRemaining:.45,impactKind:'item',spinRemaining:.95};
      world.immune[i]=ITEM_RULES.immunity;world.events.push({kind:'hit',kart:i,item:o.kind,owner:o.owner});world.stats[o.kind].hits++;o.remaining=0;break;
    }
  }
  world.objects=world.objects.filter(o=>o.remaining>0);return result;
}

export function botUsesItem(world:ItemWorld,index:number,karts:KartState[]):boolean {
  const kind=world.slots[index];if(!kind||world.heldFor[index]<1.2)return false;
  const k=karts[index];
  if(kind==='trap')return world.heldFor[index]>2;
  if(kind==='direct')return karts.some((other,i)=>{
    if(i===index||Math.hypot(other.x-k.x,other.z-k.z)>38)return false;
    const desired=Math.atan2(other.x-k.x,other.z-k.z),angle=Math.atan2(Math.sin(desired-k.heading),Math.cos(desired-k.heading));
    return Math.abs(angle)<.2&&wrap(trackProgress(other.x,other.z)-trackProgress(k.x,k.z))<34;
  });
  return karts.some((other,i)=>i!==index&&Math.hypot(other.x-k.x,other.z-k.z)<45&&wrap(trackProgress(other.x,other.z)-trackProgress(k.x,k.z))<50)||world.heldFor[index]>6;
}
