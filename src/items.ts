import { craterAt, overCanal, projectTrack, TRACK, trackLocate, trackPoint, trackProgress, wrap } from './track.ts';
import { BOOST_PADS, HAZARDS, ITEM_BOX_PROGRESS, RAMP_LENGTH, RAMP_LIPS, SHORTCUT } from './track-layout.ts';
export { ITEM_BOX_PROGRESS };
import { KART_TUNING, type KartState } from './kart-model.ts';

export type ItemKind = 'direct' | 'homing' | 'trap' | 'censor' | 'boost' | 'triple' | 'golden' | 'escort';
export type ItemDirection = 'forward' | 'backward';
export const ITEM_NAMES:Record<ItemKind,string>={direct:'Rohrpost',homing:'Suchauftrag',trap:'Stempelfalle',censor:'Zensurbalken',boost:'Eilerlass',
  // Mario-Kart counterparts (Marcel 11.10.2026): triple mushroom, golden mushroom and Bullet Bill, as bureaucratic satire.
  triple:'Eilerlass in dreifacher Ausfertigung',golden:'Goldener Dauererlass',escort:'Staatsbesuch'};
export interface ItemBox { id:number; x:number; z:number; readyIn:number }
export interface ItemObject { id:number; kind:ItemKind; owner:number; x:number; z:number; heading:number; age:number; remaining:number; target:number|null; direction?:ItemDirection; bounces?:number; nearMissed?:number[] }
export interface ItemEvent { kind:'pickup'|'launch'|'hit'|'block'|'defense-pickup'|'defense-use'|'near-miss'; kart:number; item:ItemKind|'shield'; owner?:number }
export interface ItemWorld { /** Karts holding their item behind them as a shield this step (set by the caller). */ shield?:boolean[];
  /** Owners whose straight projectile seeks targets on its own (Hitler's shepherd, 07.10.2026). */ seekers?:boolean[];
  slots:(ItemKind|null)[];/** Remaining uses of a multi-use item (triple decree). */ charges:number[];/** Seconds left in an opened golden decree. */ goldenRemaining:number[];/** Seconds left of a state-visit motorcade autopilot. */ escortRemaining:number[];defenseSlots:boolean[];defenseRemaining:number[];nearMissCooldown:number[];heldFor:number[];immune:number[];censorRemaining:number[];censorBannerRemaining:number[];objects:ItemObject[];boxes:ItemBox[];
  events:ItemEvent[];random:number;nextId:number;time:number;
  stats:Record<ItemKind,{collected:number;launched:number;hits:number}>;
}
export const ITEM_RULES={maxPerKind:6,speed:29,lifetime:5,trapLifetime:12,boxRespawn:6,immunity:1.8,hitSpeedFactor:.6,hitRadius:1.35,nearMissMargin:.55,nearMissCooldown:2.4,nearMissBoost:.6,homingTurnRate:2.4,maxBounces:3,censorDuration:4.2,censorSpeedFactor:.72,censorBannerDuration:.9,boostDuration:1.4,boostKick:5,defenseDuration:1.35,goldenDuration:7.5,goldenBoost:.75,escortDuration:4.2,escortSpeed:29,escortRadius:2.6,boxSpacing:215};
/** Dispatch box rows come from the active circuit (track-layout.ts). */
export function createItems(count:number,seed=921):ItemWorld {
  return {slots:Array(count).fill(null),charges:Array(count).fill(0),goldenRemaining:Array(count).fill(0),escortRemaining:Array(count).fill(0),defenseSlots:Array(count).fill(false),defenseRemaining:Array(count).fill(0),nearMissCooldown:Array(count).fill(0),heldFor:Array(count).fill(0),immune:Array(count).fill(0),censorRemaining:Array(count).fill(0),censorBannerRemaining:Array(count).fill(0),objects:[],
    boxes:itemBoxSpots().map((spot,id)=>({id,...trackPoint(spot.s,spot.lane),readyIn:0})),events:[],random:seed,nextId:1,time:0,
    stats:Object.fromEntries((Object.keys(ITEM_NAMES) as ItemKind[]).map(k=>[k,{collected:0,launched:0,hits:0}])) as ItemWorld['stats']};
}
/** Lap positions of dispatch-box rows: the circuit's own rows plus fillers so no gap exceeds ~215 m (Marcel 11.10.2026:
 *  fewer item droughts, as in Mario Kart). Fillers avoid ramps, canal, craters, boost pads, open hazards, the shortcut mouth
 *  and the start line. */
export function itemBoxRows():number[] {
  const length=TRACK.length;if(!length)return [...ITEM_BOX_PROGRESS];
  const clear=(s:number)=>{
    const at=wrap(s);
    if(RAMP_LIPS.some(r=>at>r-RAMP_LENGTH-10&&at<r+24)||BOOST_PADS.some(([from])=>at>from-8&&at<from+12)||HAZARDS.some(h=>at>h.from-6&&at<h.to+6))return false;
    if(Math.abs(wrap(at-TRACK.start+length/2)-length/2)<35||(at>SHORTCUT.from-12&&at<SHORTCUT.from+8)||(at>SHORTCUT.to-6&&at<SHORTCUT.to+8))return false;
    return [-.62,0,.62].every(f=>{const p=trackPoint(at,f*TRACK.halfWidth);return craterAt(p.x,p.z)<0&&!overCanal(p.x,p.z)&&projectTrack(p.x,p.z).kind===null;});
  };
  const rows=[...ITEM_BOX_PROGRESS].map(wrap).sort((a,b)=>a-b);
  const result:number[]=[];
  rows.forEach((s,i)=>{
    result.push(s);
    const next=i+1<rows.length?rows[i+1]:rows[0]+length,gap=next-s,extra=Math.ceil(gap/ITEM_RULES.boxSpacing)-1;
    for(let k=1;k<=extra;k++){
      const ideal=s+gap*k/(extra+1);
      // Nearest clear spot within 40 m of the even split.
      const found=[0,8,-8,16,-16,24,-24,32,-32,40,-40].map(d=>ideal+d).find(clear);
      if(found!==undefined)result.push(wrap(found));
    }
  });
  return result.sort((a,b)=>a-b);
}
/** Four boxes per row spread over the road (lanes scale with the circuit's width). */
export function itemBoxSpots():{s:number;lane:number}[] {
  return itemBoxRows().flatMap(s=>[-.62,-.21,.21,.62].map(f=>({s,lane:f*TRACK.halfWidth})));
}
/** Rank-weighted draw like Mario Kart: leaders mostly get traps and projectiles, the back of the field gets speed
 *  (triple and golden decree) and from mid-field on the state visit, the Bullet Bill counterpart. */
export function itemOdds(rank:number,count:number):Record<ItemKind,number> {
  const p=(rank-1)/Math.max(1,count-1);
  return {trap:4+30*(1-p),direct:8+18*(1-p*.5),homing:10+16*p,censor:2+8*p,boost:6+12*p,
    triple:Math.max(0,16*p-2),golden:Math.max(0,14*p-5),escort:Math.max(0,28*p-13)};
}
function roll(world:ItemWorld,rank:number,count:number):ItemKind {
  world.random=(Math.imul(world.random,1664525)+1013904223)>>>0;
  const entries=Object.entries(itemOdds(rank,count)) as [ItemKind,number][],total=entries.reduce((sum,[,w])=>sum+w,0);
  let n=world.random/4294967296*total;
  for(const [kind,weight] of entries){if(n<weight)return kind;n-=weight;}
  return 'boost';
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
export function stepItems(world:ItemWorld,karts:KartState[],activations:boolean[],ranks:number[],dt:number,directions:ItemDirection[]=[],defenseActivations:boolean[]=[]):KartState[] {
  world.events=[];world.time+=dt;world.immune=world.immune.map(n=>Math.max(0,n-dt));world.defenseRemaining=world.defenseRemaining.map(n=>Math.max(0,n-dt));world.nearMissCooldown=world.nearMissCooldown.map(n=>Math.max(0,n-dt));world.censorRemaining=world.censorRemaining.map(n=>Math.max(0,n-dt));world.censorBannerRemaining=world.censorBannerRemaining.map(n=>Math.max(0,n-dt));
  world.heldFor=world.heldFor.map((n,i)=>world.slots[i]?n+dt:0);
  const result=karts.slice();
  for(let i=0;i<karts.length;i++){
    if(world.goldenRemaining[i]>0){world.goldenRemaining[i]=Math.max(0,world.goldenRemaining[i]-dt);if(world.goldenRemaining[i]===0&&world.slots[i]==='golden')world.slots[i]=null;}
    if(world.escortRemaining[i]<=0)continue;
    world.escortRemaining[i]=Math.max(0,world.escortRemaining[i]-dt);
    // The motorcade clears the road: anyone in its way is shoved aside and spins (item-hit rules, immunity respected).
    for(let j=0;j<karts.length;j++){
      if(j===i||world.immune[j]>0||world.escortRemaining[j]>0)continue;
      const dx=karts[j].x-karts[i].x,dz=karts[j].z-karts[i].z,d=Math.hypot(dx,dz);if(d>ITEM_RULES.escortRadius)continue;
      const side=Math.sign(dx*Math.cos(karts[i].heading)-dz*Math.sin(karts[i].heading))||1,k=result[j];
      result[j]={...k,speed:k.speed*ITEM_RULES.hitSpeedFactor,drifting:false,driftCharge:0,turboRemaining:0,impactRemaining:.45,impactKind:'item',spinRemaining:.95,
        impactVelocityX:k.impactVelocityX+Math.cos(karts[i].heading)*side*4,impactVelocityZ:k.impactVelocityZ-Math.sin(karts[i].heading)*side*4};
      world.immune[j]=ITEM_RULES.immunity;world.stats.escort.hits++;world.events.push({kind:'hit',kart:j,item:'escort',owner:i});
    }
  }
  for(const box of world.boxes) {
    box.readyIn=Math.max(0,box.readyIn-dt);if(box.readyIn>0)continue;
    for(let i=0;i<karts.length;i++)if((!world.slots[i]||!world.defenseSlots[i])&&Math.hypot(karts[i].x-box.x,karts[i].z-box.z)<1.65) {
      box.readyIn=ITEM_RULES.boxRespawn;
      if(world.slots[i]){world.defenseSlots[i]=true;world.events.push({kind:'defense-pickup',kart:i,item:'shield'});}
      else {const kind=roll(world,ranks[i],karts.length);world.slots[i]=kind;world.charges[i]=kind==='triple'?3:0;world.heldFor[i]=0;world.events.push({kind:'pickup',kart:i,item:kind});world.stats[kind].collected++;}
      break;
    }
  }
  for(let i=0;i<karts.length;i++)if(defenseActivations[i]&&world.defenseSlots[i]){world.defenseSlots[i]=false;world.defenseRemaining[i]=ITEM_RULES.defenseDuration;world.events.push({kind:'defense-use',kart:i,item:'shield'});}
  for(let i=0;i<karts.length;i++)if(activations[i]&&world.slots[i]) {
    const kind=world.slots[i]!;
    if(kind==='boost'||kind==='triple'||kind==='golden') {
      // Golden decree: the first press opens a 7.5 s window, every further press in it is another (shorter) boost.
      const k=result[i],golden=kind==='golden';
      if(golden&&world.goldenRemaining[i]<=0)world.goldenRemaining[i]=ITEM_RULES.goldenDuration;
      if(kind==='triple')world.charges[i]=Math.max(0,(world.charges[i]||3)-1);
      if(kind==='boost'||kind==='triple'&&world.charges[i]===0)world.slots[i]=null;
      world.stats[kind].launched++;world.events.push({kind:'launch',kart:i,item:kind});
      result[i]={...k,turboRemaining:Math.max(k.turboRemaining,golden?ITEM_RULES.goldenBoost:ITEM_RULES.boostDuration),speed:Math.min(KART_TUNING.maxTurboSpeed,Math.max(k.speed,0)+ITEM_RULES.boostKick*(golden?.8:1))};
    } else if(kind==='escort') {
      world.slots[i]=null;world.escortRemaining[i]=ITEM_RULES.escortDuration;world.immune[i]=Math.max(world.immune[i],ITEM_RULES.escortDuration+.4);
      world.stats.escort.launched++;world.events.push({kind:'launch',kart:i,item:'escort'});
    } else if(kind==='censor') {
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
      // A seeking dog runs the course and locks on to the first rival that appears ahead of it.
      if(o.target===null&&o.kind==='direct'&&world.seekers?.[o.owner]&&o.age>.25){
        const fx=Math.sin(o.heading),fz=Math.cos(o.heading);let best=-1,bestD=36;
        karts.forEach((k,i)=>{if(i===o.owner)return;const dx=k.x-o.x,dz=k.z-o.z,d=Math.hypot(dx,dz);if(d<bestD&&(dx*fx+dz*fz)/Math.max(d,.01)>.45){best=i;bestD=d;}});
        if(best>=0)o.target=best;
      }
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
      const distance=sweptDistance(karts[i].x,karts[i].z,ax,az,o.x,o.z);
      if(distance>ITEM_RULES.hitRadius){
        const passed=(karts[i].x-o.x)*Math.sin(o.heading)+(karts[i].z-o.z)*Math.cos(o.heading)<0;
        if(passed&&distance<=ITEM_RULES.hitRadius+ITEM_RULES.nearMissMargin&&world.nearMissCooldown[i]<=0&&!o.nearMissed?.includes(i)){
          o.nearMissed=[...(o.nearMissed??[]),i];world.nearMissCooldown[i]=ITEM_RULES.nearMissCooldown;
          const k=result[i];result[i]={...k,speed:Math.min(20,Math.max(0,k.speed)+ITEM_RULES.nearMissBoost),turboRemaining:Math.max(k.turboRemaining,.28)};
          world.events.push({kind:'near-miss',kart:i,item:o.kind,owner:o.owner});
        }
        continue;
      }
      if(world.defenseRemaining[i]>0){world.defenseRemaining[i]=0;o.remaining=0;world.events.push({kind:'block',kart:i,item:'shield',owner:o.owner});break;}
      // Countermeasure: an item held behind the kart blocks one projectile arriving from behind (same rule for all).
      if(world.shield?.[i]&&world.slots[i]){const k=karts[i],fwd=(o.x-k.x)*Math.sin(k.heading)+(o.z-k.z)*Math.cos(k.heading);
        if(fwd<.6){world.slots[i]=null;world.heldFor[i]=0;o.remaining=0;world.events.push({kind:'block',kart:i,item:o.kind,owner:o.owner});break;}}
      const k=result[i];result[i]=(k.tankRemaining??0)>0?{...k,speed:k.speed*.88,impactRemaining:.12,impactKind:'item'}:o.kind==='censor'?{...k,speed:k.speed*ITEM_RULES.censorSpeedFactor,impactRemaining:.18,impactKind:'item'}:{...k,speed:k.speed*ITEM_RULES.hitSpeedFactor,drifting:false,driftCharge:0,turboRemaining:0,impactRemaining:.45,impactKind:'item',spinRemaining:.95};
      world.immune[i]=ITEM_RULES.immunity;world.events.push({kind:'hit',kart:i,item:o.kind,owner:o.owner});world.stats[o.kind].hits++;o.remaining=0;break;
    }
  }
  world.objects=world.objects.filter(o=>o.remaining>0);return result;
}

/** Aim behind only at a nearby aligned pursuer; the same backward launch is available to the player. */
export function botItemDirection(world:ItemWorld,index:number,karts:KartState[]): 'forward' | 'backward' {
  if(world.slots[index]!=='direct'&&world.slots[index]!=='homing')return 'forward';
  const k=karts[index];let front=Infinity,rear=Infinity;
  karts.forEach((other,i)=>{
    if(i===index)return;
    const dx=other.x-k.x,dz=other.z-k.z,d=Math.hypot(dx,dz);
    const angle=Math.atan2(Math.sin(Math.atan2(dx,dz)-k.heading),Math.cos(Math.atan2(dx,dz)-k.heading));
    const alignment=world.slots[index]==='direct'?.22:.65;
    if(Math.abs(angle)<alignment&&wrap(trackProgress(other.x,other.z)-trackProgress(k.x,k.z))<50)front=Math.min(front,d);
    if(Math.abs(Math.PI-Math.abs(angle))<alignment&&wrap(trackProgress(k.x,k.z)-trackProgress(other.x,other.z))<24)rear=Math.min(rear,d);
  });
  return rear<22&&rear<front?'backward':'forward';
}

export function botUsesItem(world:ItemWorld,index:number,karts:KartState[],patience=1):boolean {
  const kind=world.slots[index];if(!kind||world.heldFor[index]<1.2*patience)return false;
  const k=karts[index];
  if(kind==='trap')return world.heldFor[index]>4*patience||karts.some((other,i)=>i!==index&&Math.hypot(other.x-k.x,other.z-k.z)<16&&wrap(trackProgress(k.x,k.z)-trackProgress(other.x,other.z))<18);
  if(kind==='boost')return world.heldFor[index]>1.6*patience&&(karts[index].speed??0)>6;
  if(kind==='escort')return world.heldFor[index]>.6;
  if(kind==='golden')return (karts[index].speed??0)>6&&karts[index].turboRemaining<.15&&world.heldFor[index]>.8*patience;
  if(kind==='triple')return (karts[index].speed??0)>6&&karts[index].turboRemaining<.1&&world.heldFor[index]>1.2*patience;
  if(kind==='censor')return karts.some((other,i)=>i!==index&&Math.hypot(other.x-k.x,other.z-k.z)<65)||world.heldFor[index]>5;
  const backward=botItemDirection(world,index,karts)==='backward';
  if(kind==='direct')return karts.some((other,i)=>{
    if(i===index||Math.hypot(other.x-k.x,other.z-k.z)>38)return false;
    const desired=Math.atan2(other.x-k.x,other.z-k.z),heading=k.heading+(backward?Math.PI:0),angle=Math.atan2(Math.sin(desired-heading),Math.cos(desired-heading));
    return Math.abs(angle)<.2&&wrap(backward?trackProgress(k.x,k.z)-trackProgress(other.x,other.z):trackProgress(other.x,other.z)-trackProgress(k.x,k.z))<34;
  });
  return karts.some((other,i)=>i!==index&&Math.hypot(other.x-k.x,other.z-k.z)<45&&wrap(backward?trackProgress(k.x,k.z)-trackProgress(other.x,other.z):trackProgress(other.x,other.z)-trackProgress(k.x,k.z))<50)||world.heldFor[index]>6*patience;
}

/** Spend a bot's reserve defense only when relative motion predicts an incoming hit. */
export function botShouldUseDefense(world:ItemWorld,index:number,karts:KartState[]):boolean {
  if(!world.defenseSlots[index])return false;
  const kart=karts[index],kartHeading=kart.travelHeading??kart.heading;
  const kartVx=Math.sin(kartHeading)*kart.speed,kartVz=Math.cos(kartHeading)*kart.speed;
  const horizon=Math.min(.65,ITEM_RULES.defenseDuration);
  return world.objects.some((object)=>{
    if(object.owner===index||object.kind==='trap'||object.remaining<=0)return false;
    const rx=kart.x-object.x,rz=kart.z-object.z;
    // A locked homing order curves toward its target, so its current straight heading can understate the threat.
    if(object.kind==='homing'&&object.target===index&&Math.hypot(rx,rz)<=ITEM_RULES.speed*horizon)return true;
    const rvx=kartVx-Math.sin(object.heading)*ITEM_RULES.speed,rvz=kartVz-Math.cos(object.heading)*ITEM_RULES.speed;
    const relativeSpeedSq=rvx*rvx+rvz*rvz;
    const closestTime=relativeSpeedSq>1e-6?Math.max(0,Math.min(horizon,-(rx*rvx+rz*rvz)/relativeSpeedSq)):0;
    const dx=rx+rvx*closestTime,dz=rz+rvz*closestTime;
    return Math.hypot(dx,dz)<=ITEM_RULES.hitRadius+.35;
  });
}
