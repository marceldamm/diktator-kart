import assert from 'node:assert/strict';import {writeFile} from 'node:fs/promises';
import {send,delay,evaluate,key,tap,shot,load,errors,socket} from './cdp.mjs';
const results=[];let injection;
const probe=async name=>{
  await evaluate(`document.querySelector('#menu-race').click()`);await delay(5000);
  assert.equal(await evaluate(`window.__DK.scene.getEngine().webGLVersion`),1);
  await key('keyDown','w','KeyW',87);await delay(700);await key('keyUp','w','KeyW',87);
  const speed=await evaluate(`window.__DK.kart.speed`);assert.ok(speed>0);
  for(let i=0;i<3;i++){if(i)await tap('c','KeyC',67);assert.ok(await evaluate(`window.__DK.scene.activeCamera.position.y`)>0);}
  const result=await evaluate(`({webgl:window.__DK.scene.getEngine().webGLVersion,view:window.__DK.view,meshes:window.__DK.scene.meshes.length,karts:window.__DK.bots.length+1})`);assert.equal(result.karts,6);results.push({name,speed,...result});await shot('slice-'+name);
};
try{
  await send('Page.enable');await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:1600,height:1000,deviceScaleFactor:1,mobile:false});
  await load('?webgl=1');await probe('forced-webgl1');
  injection=(await send('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{const original=HTMLCanvasElement.prototype.getContext;window.__DKBlockedWebgl2=0;HTMLCanvasElement.prototype.getContext=function(kind,...args){if(kind==='webgl2'||kind==='experimental-webgl2'){window.__DKBlockedWebgl2++;return null;}return original.call(this,kind,...args);};})();`})).identifier;
  await load();console.log('Fallback injection',await evaluate(`window.__DKBlockedWebgl2`));assert.ok(await evaluate(`window.__DKBlockedWebgl2`)>0);await probe('automatic-webgl1');await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:injection});injection=undefined;
  assert.deepEqual(errors,[]);await writeFile(`docs/evidence/slice-compatibility${process.env.EVIDENCE_SUFFIX??''}.json`,JSON.stringify({date:new Date().toISOString(),method:'Production Chrome on same RTX GPU: explicit WebGL1 and WebGL2 deliberately unavailable; six actual glTF karts, driving and camera switches. Not old-device approval.',results,errors},null,2)+'\n');console.log('SLICE_FORCED_AND_FALLBACK_WEBGL1_PASS');
}finally{if(injection)await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:injection});socket.close();}
