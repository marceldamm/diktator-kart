// Original CC0 source meshes/textures retained in climate-trees. Keep leaf alpha; no JPEG conversion.
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,weld,meshopt,textureCompress,compactPrimitive} from '@gltf-transform/functions';
import {MeshoptEncoder,MeshoptSimplifier} from 'meshoptimizer';import sharp from 'sharp';
import {mkdir,stat} from 'node:fs/promises';import {fileURLToPath} from 'node:url';
await MeshoptEncoder.ready;await MeshoptSimplifier.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder});
const sources={broadleaf:'megakit/CommonTree_1.gltf',broadleafB:'megakit/CommonTree_3.gltf',pine:'megakit/Pine_1.gltf',birch:'ultimate/BirchTree_1.gltf',palm:'kenney/tree_palmDetailedTall.glb',palmB:'kenney/tree_palmDetailedShort.glb'};
await mkdir(new URL('../public/assets/models/',import.meta.url),{recursive:true});
for(const [name,source]of Object.entries(sources)){
 const doc=await io.read(fileURLToPath(new URL('climate-trees/'+source,import.meta.url)));
 if(name.startsWith('palm'))for(const material of doc.getRoot().listMaterials()){
   material.getExtension('KHR_materials_unlit')?.dispose();
   material.setBaseColorFactor(material.getName().includes('leaf')?[.09,.22,.045,1]:[.2,.1,.045,1]).setMetallicFactor(0).setRoughnessFactor(.9);
 }
 for(const material of doc.getRoot().listMaterials())if(material.getAlphaMode()==='BLEND')material.setAlphaMode('MASK').setAlphaCutoff(.45).setDoubleSided(true);
 // Performance 10.10.2026: these trees are merged into the city batches many times per tile. Bark needs neither
 // alpha testing nor 4,000 triangles; leaf cards stay untouched (simplifying would delete whole cards).
 for(const material of doc.getRoot().listMaterials())if(/bark/i.test(material.getName()))material.setAlphaMode('OPAQUE').setDoubleSided(false);
 await doc.transform(dedup(),weld());
 for(const mesh of doc.getRoot().listMeshes())for(const prim of mesh.listPrimitives())
  if(/bark/i.test(prim.getMaterial()?.getName()??'')&&prim.getIndices()&&prim.getIndices().getCount()/3>700){
   // Sloppy simplification ignores the many UV-seamed branch islands that block the regular simplifier.
   const indices=prim.getIndices(),positions=prim.getAttribute('POSITION').getArray();
   const [simplified]=MeshoptSimplifier.simplifySloppy(Uint32Array.from(indices.getArray()),Float32Array.from(positions),3,null,600*3,.05);
   indices.setArray(simplified);compactPrimitive(prim);
  }
 await doc.transform(textureCompress({encoder:sharp,targetFormat:'png',resize:[512,512]}),meshopt({encoder:MeshoptEncoder,level:'medium'}));
 const output=new URL('../public/assets/models/tree-'+name+'.glb',import.meta.url);await io.write(fileURLToPath(output),doc);
 console.log(name,(await stat(output)).size,'bytes');
}
