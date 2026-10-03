// Free offline GLB processing. Editable .blend files and named animation pivots remain source of truth.
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,weld,quantize,textureCompress} from '@gltf-transform/functions';
import sharp from 'sharp';
import {mkdir,copyFile,access,stat,writeFile} from 'node:fs/promises';
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
const root=new URL('../',import.meta.url),cache=new URL('.tools/raw-models/',root);await mkdir(cache,{recursive:true});
const results=[];
for(const name of ['hero-kart','stadium-world','stadium-props','park-tree','items']) {
  const input=new URL(name+'.glb',cache),output=new URL('public/assets/models/'+name+'.glb',root);
  try{await access(input);}catch{await copyFile(output,input);}
  const document=await io.read(input.pathname.replace(/^\/([A-Za-z]:)/,'$1'));
  await document.transform(dedup(),weld(),quantize({quantizePosition:16,quantizeNormal:12,quantizeTexcoord:14}),textureCompress({encoder:sharp,targetFormat:'jpeg',quality:88}));
  await io.write(output.pathname.replace(/^\/([A-Za-z]:)/,'$1'),document);
  const result={name,originalBytes:(await stat(input)).size,runtimeBytes:(await stat(output)).size};results.push(result);console.log(result);
}
await writeFile(new URL('docs/evidence/slice-asset-optimization.json',root),JSON.stringify({date:new Date().toISOString(),tool:'glTF Transform 4.5.1; lossless welding/deduplication, 16-bit positions, 12-bit normals, 14-bit UV, JPEG88 maps',results},null,2)+'\n');
