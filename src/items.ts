import { TRACK, trackLocate, trackPoint, trackProgress, wrap } from './track.ts';
import { ITEM_BOX_PROGRESS } from './track-layout.ts';
export { ITEM_BOX_PROGRESS };
import type { KartState } from './kart-model.ts';

export type ItemKind = 'direct' | 'homing' | 'trap' | 'censor';
export type ItemDirection = 'forward' | 'backward';
export const ITEM_NAMES:Record<ItemKind,string>={direct:'Rohrpost',homing:'Suchauftrag',trap:'Stempelfalle',censor:'Zensurbalken'};
export interface ItemBox { id:number; x:number; z:number; readyIn:number }
export interface ItemObject { id:number; kind:ItemKind; owner:number; x:number; z:number; heading:number; age:number; remaining:number; target:number|null; direction?:ItemDirection; bounces?:number }
export interface ItemEvent { kind:'pickup'|'launch'|'hit'|'block'; kart:number; item:ItemKind; owner?:number }
export interface ItemWorld { /** Karts holding their item behind them as a shield this step (set by the caller). */ shield?:boolean[];
  slots:(ItemKind|null)[];heldFor:number[];immune:number[];censorRemaining:number[];censorBannerRemaining:number[];objects:ItemObject[];boxes:ItemBox[];
  events:ItemEvent[];random:number;nextId:number;time:number;
  stats:Record<ItemKind,{collected:number;launched:number;hits:number}>;
}
export const ITEM_RULES={maxPerKind:6,speed:24,lifetime:5,trapLifetime:12,boxRespawn:6,immunity:1.8,hitSpeedFactor:.6,hitRadius:1.35,homingTurnRate:2.4,maxBounces:3,censorDuration:2.6,censorSpeedFactor:.72,censorBannerDuration:.9};
/** Dispatch box rows come from the active circuit (track-layout.ts). */
export function createItems(count:number,seed=921):ItemWorld {
  return {slots:Array(count).fill(null),heldFor:Array(count).fill(0),immune:Array(count).fill(0),censorRemaining:Array(count).fill(0),censorBannerRemaining:Array(count).fill(0),objects:[],
    boxes:ITEM_BOX_PROGRESS.flatMap((s,row)=>[-3,0,3].map((lane,col)=>({id:row*3+col,...trackPoint(s,lane),readyIn:0}))),events:[],random:seed,nextId:1,time:0,
    stats:{direct:{collected:0,launched:0,hits:0},homing:{collected:0,launched:0,hits:0},trap:{collected:0,launched:0,hits:0},censor:{collected:0,launched:0,hits:0}}};
}
function roll(world:ItemWorld,rank:number,count:number):ItemKind {
  world.random=(Math.imul(world.random,1664525)+1013904223)>>>0;
  const n=world.random/4294967296;
  if(n<.1)return 'censor';
  const regular=(n-.1)/.9;
  const homing=.25+.2*(rank-1)/Math.max(1,count-1);
  return regular<homing?'homing':regular<homing+.4?'direct':'trap';
}
function launch(world:ItemWorld,kind:ItemKind,owner:number,karts:KartState[],direction:ItemDirection='forward'):boolean {
  if(world.objects.filter(o=>o.kind===kind).length>=ITEM_RULES.maxPerKind)return false;
  const kart=karts[owner],backward=(kind==='direct'||kind==='homing')&&direction==='backward',forward=kind==='trap'?-3:backward?-3:3;
  let target:number|null=null;
  if(kind==='homing') {
    const s=trackProgress(kart.x,kart.z);
    const ahead=karts.map((k,i)=>({i,d:wrap(backward?s-trackProgress(k.x,k.z):trackProgress(k.x,k.z)-s)})).filter(t=>t.i!==owner&&t.d>1&&t.d<75).sort((a,b)=>a.d-b.d);
    target=ahead[0]?.i??null;
  }
  const heading=kart.heading+(backward?Math.PI:0);
  world.objects.push({id:world.nextId++,kind,owner,x:kart.x+Math.sin(kart.heading)*forward,z:kart.z+Math.cos(kart.heading)*forward,heading,age:0,remaining:kind==='trap'?ITEM_RULES.trapLifetime:ITEM_RULES.lifetime,target,...(kind==='trap'?{}:{direction:backward?'backward':'forward'})});
  world.events.push({kind:'launch',kart:owner,item:kind});world.stats[kind].launched++;return true;
}
const clampTurn=(v:number,limit:number)=>Math.max(-limit,Math.min(limit,v));
const sweptDistance=(x:number,z:number,ax:number,az:number,bx:number,bz:number)=>{
  const dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz||1)));
  return Math.hypot(x-ax-t*dx,z-az-t*dz);
};
/** Identical collection, allocation, launch, collision and immunity for all participants. */
export function stepItems(world:ItemWorld,karts:KartState[],activations:boolean[],ranks:number[],dt:number,directions:ItemDirection[]=[]):KartState[] {
  world.events=[];world.time+=dt;world.immune=world.immune.map(n=>Math.max(0,n-dt));world.censorRemaining=world.censorRemaining.map(n=>Math.max(0,n-dt));world.censorBannerRemaining=world.censorBannerRemaining.map(n=>Math.max(0,n-dt));
  world.heldFor=world.heldFor.map((n,i)=>world.slots[i]?n+dt:0);
  const result=karts.slice();
  for(const box of world.boxes) {
    box.readyIn=Math.max(0,box.readyIn-dt);if(box.readyIn>0)continue;
    for(let i=0;i<karts.length;i++)if(!world.slots[i]&&Math.hypot(karts[i].x-box.x,karts[i].z-box.z)<1.65) {
      const kind=roll(world,ranks[i],karts.length);world.slots[i]=kind;world.heldFor[i]=0;box.readyIn=ITEM_RULES.boxRespawn;world.events.push({kind:'pickup',kart:i,item:kind});world.stats[kind].collected++;break;
    }
  }
  for(let i=0;i<karts.length;i++)if(activations[i]&&world.slots[i]) {
    const kind=world.slots[i]!;
    if(kind==='censor') {
      world.slots[i]=null;world.censorBannerRemaining[i]=Math.max(world.censorBannerRemaining[i],ITEM_RULES.censorBannerDuration);
      world.stats.censor.launched++;world.events.push({kind:'launch',kart:i,item:'censor'});
      for(let target=0;target<karts.length;target++)if(target!==i&&world.immune[target]<=0) {
        world.censorRemaining[target]=Math.max(world.censorRemaining[target],ITEM_RULES.censorDuration);world.censorBannerRemaining[target]=Math.max(world.censorBannerRemaining[target],ITEM_RULES.censorDuration);
        world.immune[target]=ITEM_RULES.immunity;world.stats.censor.hits++;
        if(target===0)world.events.push({kind:'hit',kart:target,item:'censor',owner:i});
      }
    } else if(launch(world,kind,i,karts,directions[i]??'forward'))world.slots[i]=null;
  }
  for(const o of world.objects) {
    const ax=o.x,az=o.z;o.age+=dt;o.remaining-=dt;
    if(o.kind!=='trap') {
      if(o.target!==null) {
        const target=karts[o.target];
        // Follow the course until close, then close in directly: no shortcuts through the park.
        const here=trackLocate(o.x,o.z),there=trackLocate(target.x,target.z);
        const backward=o.direction==='backward',distance=wrap(backward?here.s-there.s:there.s-here.s);
        const aim=distance>11?trackPoint(here.s+(backward?-7:7),Math.max(-3.5,Math.min(3.5,there.lane))):target;
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
      // Countermeasure: an item held behind the kart blocks one projectile arriving from behind (same rule for all).
      if(world.shield?.[i]&&world.slots[i]){const k=karts[i],fwd=(o.x-k.x)*Math.sin(k.heading)+(o.z-k.z)*Math.cos(k.heading);
        if(fwd<.6){world.slots[i]=null;world.heldFor[i]=0;o.remaining=0;world.events.push({kind:'block',kart:i,item:o.kind,owner:o.owner});break;}}
      const k=result[i];result[i]=(k.tankRemaining??0)>0?{...k,speed:k.speed*.88,impactRemaining:.12,impactKind:'item'}:o.kind==='censor'?{...k,speed:k.speed*ITEM_RULES.censorSpeedFactor,impactRemaining:.18,impactKind:'item'}:{...k,speed:k.speed*ITEM_RULES.hitSpeedFactor,drifting:false,driftCharge:0,turboRemaining:0,impactRemaining:.45,impactKind:'item',spinRemaining:.95};
      world.immune[i]=ITEM_RULES.immunity;world.events.push({kind:'hit',kart:i,item:o.kind,owner:o.owner});world.stats[o.kind].hits++;o.remaining=0;break;
    }
  }
  world.objects=world.objects.filter(o=>o.remaining>0);return result;
}

export function botUsesItem(world:ItemWorld,index:number,karts:KartState[],patience=1):boolean {
  const kind=world.slots[index];if(!kind||world.heldFor[index]<1.2*patience)return false;
  const k=karts[index];
  if(kind==='trap')return world.heldFor[index]>2;
  if(kind==='censor')return karts.some((other,i)=>i!==index&&Math.hypot(other.x-k.x,other.z-k.z)<65)||world.heldFor[index]>5;
  if(kind==='direct')return karts.some((other,i)=>{
    if(i===index||Math.hypot(other.x-k.x,other.z-k.z)>38)return false;
    const desired=Math.atan2(other.x-k.x,other.z-k.z),angle=Math.atan2(Math.sin(desired-k.heading),Math.cos(desired-k.heading));
    return Math.abs(angle)<.2&&wrap(trackProgress(other.x,other.z)-trackProgress(k.x,k.z))<34;
  });
  return karts.some((other,i)=>i!==index&&Math.hypot(other.x-k.x,other.z-k.z)<45&&wrap(trackProgress(other.x,other.z)-trackProgress(k.x,k.z))<50)||world.heldFor[index]>6;
}
