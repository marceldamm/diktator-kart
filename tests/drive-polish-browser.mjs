import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {send,evaluate,delay,load,key,tap,shot,errors,socket} from './cdp.mjs';
const snapshot=()=>evaluate(`(()=>{const d=window.__DK,sc=d.scene,k=d.render.kart;return {state:d.state,menu:d.menu,kart:d.kart,render:k,wheels:Array.from({length:4},(_,i)=>{const p=sc.getTransformNodeByName('kart0/wheelPivot-'+i);p.computeWorldMatrix(true);return {parent:p.parent.name,y:p.getAbsolutePosition().y}}),body:sc.getTransformNodeByName('modelOrientation-0').rotation.asArray(),dust:sc.particleSystems.find(p=>p.name==='Tire smoke and dust').emitRate};})()`);
const waitFor=async(expression,label)=>{for(let i=0;i<70;i++){if(await evaluate(expression))return;await delay(300);}throw Error(`Timed out waiting for ${label}`);};
const place=()=>evaluate(`(async()=>{const m=await import('/src/track.ts');const p=m.trackPoint(m.TRACK.start+30,0);Object.assign(window.__DK.kart,{x:p.x,z:p.z,heading:p.heading-.4,travelHeading:p.heading-.4,speed:12,drifting:false,driftCharge:0,driftDirection:0,turboRemaining:0,steer:0,yawRate:0,spinRemaining:0,impactRemaining:0,impactVelocityX:0,impactVelocityZ:0});})()`);
try{
 await send('Runtime.enable');await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});await send('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});
 await load();await evaluate(`document.querySelector('#menu-practice').click();window.__qaKeys=[];document.querySelector('#debug').hidden=false;window.addEventListener('keydown',e=>window.__qaKeys.push({code:e.code,key:e.key}),true)`);await delay(300);await place();
 await key('keyDown','w','KeyW',87);await waitFor(`window.__DK.kart.speed>12`,'forward input on the next rendered physics frame');await key('keyUp','w','KeyW',87);
 const straight=await snapshot();const inputState=await evaluate(`JSON.stringify({keys:window.__qaKeys,state:window.__DK.state,phase:window.__DK.phase,menu:window.__DK.menu,body:document.body.className,visibility:document.visibilityState,position:{x:window.__DK.kart.x,z:window.__DK.kart.z},speed:window.__DK.kart.speed,debug:document.querySelector('#debug').textContent})`);console.log(`Drive input diagnostic: ${inputState}`);assert.ok(straight.kart.speed>12);assert.ok(straight.dust>0);
 for(const [i,w] of straight.wheels.entries())assert.ok(Math.abs(w.y-(.34+straight.render.height+straight.render.wheelGroundHeights[i]))<.003,'Grounded tyre must not inherit body pitch');
 assert.ok(straight.body[0]>0&&straight.body[0]<.06,'Subtle acceleration/speed bonnet lift');
 await key('keyDown','d','KeyD',68);await key('keyDown',' ','Space',32);await waitFor(`window.__DK.kart.drifting`,'drift initiation');
 const inside=await snapshot();assert.equal(inside.kart.drifting,true);
 await key('keyUp','d','KeyD',68);await key('keyDown','a','KeyA',65);await waitFor(`window.__DK.kart.driftCharge>${inside.kart.driftCharge}`,'countersteering charge');
 const counter=await snapshot();assert.equal(counter.kart.drifting,true,JSON.stringify({inside:inside.kart,counter:counter.kart}));assert.equal(counter.kart.driftDirection,1);assert.ok(counter.kart.driftCharge>inside.kart.driftCharge);assert.ok(counter.kart.yawRate>0);
 await key('keyUp',' ','Space',32);await key('keyUp','a','KeyA',65);await waitFor(`window.__DK.kart.turboRemaining>0`,'mini-turbo release');
 const turbo=await snapshot();assert.ok(turbo.kart.turboRemaining>0,JSON.stringify({inside:inside.kart,counter:counter.kart,turbo:turbo.kart}));
 // Screenshot compression takes real time: do not keep driving toward a wall while waiting for it.
 await key('keyUp','w','KeyW',87);await tap('p','KeyP',80);
 const turboImage=await send('Page.captureScreenshot',{format:'png'});await writeFile('docs/evidence/drive-polish-turbo-v1.png',Buffer.from(turboImage.data,'base64'));
 await tap('p','KeyP',80);
 await key('keyUp','w','KeyW',87);await tap('r','KeyR',82);for(let i=0;i<100;i++){if(await evaluate(`!!window.__DK.scene&&document.querySelector('#status').textContent==='Testszene läuft'`))break;await delay(100);}const reset=await snapshot();assert.equal(reset.kart.driftCharge,0);assert.equal(reset.kart.turboRemaining,0);
 assert.deepEqual(errors,[]);await writeFile('docs/evidence/drive-polish-check.json',JSON.stringify({fleet:6,qa:'Kart positioned on a clear normal-world straight, real input and fixed update thereafter',straight,inside,counter,turbo,reset,runtimeErrors:errors},null,2)+'\n');console.log('PASS: grounded wheels, subtle bonnet lift, dust, countersteering charges same drift, release turbo, restart, six karts.');
}finally{socket.close();}
