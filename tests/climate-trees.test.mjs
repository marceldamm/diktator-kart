import test from 'node:test';import assert from 'node:assert/strict';import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';import {MeshoptDecoder} from 'meshoptimizer';import sharp from 'sharp';
import {CLIMATE_TREES,PARK_TREE} from '../src/climate-trees.ts';import {TRACKS} from '../src/track-layout.ts';
test('climate trees have bounded geometry, complete textures and preserved leaf alpha',async()=>{
 assert.deepEqual(Object.keys(CLIMATE_TREES).sort(),Object.keys(TRACKS).sort());
 await MeshoptDecoder.ready;const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
 const variants=new Set([...Object.values(CLIMATE_TREES).flatMap(v=>Object.values(v)),...Object.values(PARK_TREE)]);
 for(const name of variants){const doc=await io.read(new URL(`../public/assets/models/tree-${name}.glb`,import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
  let tris=0;for(const mesh of doc.getRoot().listMeshes())for(const p of mesh.listPrimitives()){
   const pos=p.getAttribute('POSITION');assert.ok(pos.getCount()>0);assert.ok(Array.from(pos.getArray()).every(Number.isFinite));tris+=(p.getIndices()?.getCount()??pos.getCount())/3;
  }
  assert.ok(tris>50&&tris<20000,`${name}: geometry budget ${tris}`);
  for(const t of doc.getRoot().listTextures()){const m=await sharp(t.getImage()).metadata();assert.ok(m.width<=512&&m.height<=512);}
  if(!name.startsWith('palm'))assert.ok(doc.getRoot().listMaterials().some(m=>m.getAlphaMode()==='MASK'&&m.getBaseColorTexture()?.getMimeType()==='image/png'),`${name}: cutout leaves retained`);
  else assert.ok(doc.getRoot().listMaterials().every(m=>!m.getExtension('KHR_materials_unlit')),`${name}: actual daylight and headlight response`);
  console.log(name,Math.round(tris),'triangles');
 }
 assert.equal(CLIMATE_TREES.havanna['kit-palm'],'palm');assert.equal(CLIMATE_TREES.moscow['kit-linden'],'birch');
});
