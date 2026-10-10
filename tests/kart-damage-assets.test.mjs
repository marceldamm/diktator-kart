import test from 'node:test';
import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {MeshoptDecoder} from 'meshoptimizer';

test('four exported damage groups preserve wheels, steering and every selectable body',async()=>{
 await MeshoptDecoder.ready;
 const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
 const doc=await io.read('public/assets/models/hero-kart.glb'),nodes=doc.getRoot().listNodes();
 const groups=[1,2,3,4].map(i=>nodes.find(n=>n.getName()===`detach-${i}`));
 assert.ok(groups.every(n=>n&&n.listChildren().length>0),'all damage groups contain actual exported geometry');
 const belowDamage=(node)=>groups.some(group=>{let current=node;while(current){if(current===group)return true;current=current.getParentNode();}return false;});
 for(const name of ['wheelPivot-0','wheelPivot-1','wheelPivot-2','wheelPivot-3','steeringWheel','pedal-gas','pedal-brake','driverPose']){
  const node=nodes.find(n=>n.getName()===name);assert.ok(node,`${name} exists`);assert.equal(belowDamage(node),false,`${name} remains after every damage stage`);
 }
 for(const node of nodes.filter(n=>n.getName().startsWith('body-')))assert.equal(belowDamage(node),false,`${node.getName()} remains selectable`);
});
