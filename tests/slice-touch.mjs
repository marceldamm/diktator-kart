// Emulation proves input/layout plumbing, not performance or comfort on a phone.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {send,delay,evaluate,shot,load,errors,socket} from './cdp.mjs';
try {
  await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:932,height:430,deviceScaleFactor:1,mobile:true});
  await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});await load();await delay(1500);
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('#touch-controls')).display`),'flex');
  assert.equal(await evaluate(`document.querySelector('#app').getBoundingClientRect().height`),430);
  await evaluate(`document.querySelector('#race-start').click()`);await delay(4500);
  const point=async(action,id)=>evaluate(`(()=>{const r=document.querySelector('[data-drive-action="${action}"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,id:${id},radiusX:8,radiusY:8,force:1};})()`);
  const gas=await point('accelerate',0),left=await point('steerLeft',1);
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[gas,left]});await delay(600);
  const driven=await evaluate(`({speed:window.__DK.kart.speed,heading:window.__DK.kart.heading})`);
  console.log(JSON.stringify(driven));assert.ok(driven.speed>1);assert.ok(Math.abs(driven.heading)>.02,'Simultaneous touch steering failed');await shot('slice-touch-landscape');
  await send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await delay(2500);
  assert.ok((await evaluate(`window.__DK.kart.speed`))<driven.speed,'Touch cancel left gas held');
  const before=await evaluate(`document.querySelector('#camera-mode').textContent`),camera=await point('camera',2);
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[camera]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await delay(300);
  assert.notEqual(await evaluate(`document.querySelector('#camera-mode').textContent`),before);
  await evaluate(`document.querySelector('#motion-toggle').click()`);assert.equal(await evaluate(`localStorage.getItem('dk-reduced-motion')`),'1');
  await evaluate(`document.querySelector('#quality-toggle').click()`);assert.equal(await evaluate(`localStorage.getItem('dk-quality')`),'0');
  await load();assert.equal(await evaluate(`document.querySelector('#motion-toggle').textContent`),'Kamera ruhig');assert.equal(await evaluate(`document.querySelector('#quality-toggle').textContent`),'Grafik Basis');
  await evaluate(`document.querySelector('#motion-toggle').click();document.querySelector('#quality-toggle').click()`);
  assert.deepEqual(errors,[]);await writeFile('docs/evidence/slice-touch-emulation.json',JSON.stringify({date:new Date().toISOString(),viewport:'932x430, touch emulated on RTX/Chrome',driven,errors,deviceApproval:false},null,2)+'\n');console.log('TOUCH_LAYOUT_CANCEL_CAMERA_SETTINGS_PASS');
}finally{await send('Emulation.setTouchEmulationEnabled',{enabled:false});socket.close();}
