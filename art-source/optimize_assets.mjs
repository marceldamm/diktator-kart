// Free offline GLB processing. Editable .blend files and named animation pivots remain source of truth.
// 10.10.2026 (load time): every runtime model is additionally meshopt-compressed (EXT_meshopt_compression; the game
// decodes with the local copy public/vendor/meshopt_decoder.js). Driver/stand models (`node art-source/optimize_assets.mjs
// drivers`) are processed in place, because the Blender pose export writes them straight into public/.
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,weld,quantize,textureCompress,meshopt} from '@gltf-transform/functions';
import {MeshoptEncoder,MeshoptDecoder} from 'meshoptimizer';
import sharp from 'sharp';
import {mkdir,copyFile,access,stat,writeFile,readFile,readdir} from 'node:fs/promises';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder,'meshopt.encoder':MeshoptEncoder});
const root=new URL('../',import.meta.url),cache=new URL('.tools/raw-models/',root);await mkdir(cache,{recursive:true});
const path=(url)=>url.pathname.replace(/^\/([A-Za-z]:)/,'$1');
const results=[];
let names=process.argv[2]?process.argv.slice(2):['hero-kart','city-kit','park-tree','items','parade-tank','drivers'];
if(names.includes('drivers'))names=[...names.filter(n=>n!=='drivers'),...(await readdir(new URL('public/assets/models/',root))).filter(f=>/^(hitler|stalin|mussolini|mao|kim|castro)-(driver|stand)\.glb$/.test(f)).map(f=>f.slice(0,-4))];
for(const name of names) {
  const output=new URL('public/assets/models/'+name+'.glb',root),inPlace=/-(driver|stand)$/.test(name);
  const input=inPlace?output:new URL(name+'.glb',cache);
  if(!inPlace){try{await access(input);}catch{await copyFile(output,input);}}
  const originalBytes=(await stat(input)).size;
  const document=await io.read(path(input));
  // Driver rigs keep float data so their skins stay exact; the static kit and kart are quantized as before. The kit keeps
  // every material (identical-looking ones like crowd and banner cloth must stay separate for their runtime textures).
  const steps=inPlace?[dedup(),textureCompress({encoder:sharp,targetFormat:'jpeg',quality:88})]
    :[dedup(name==='city-kit'?{propertyTypes:['Accessor','Mesh','Texture']}:{}),weld(),quantize({quantizePosition:16,quantizeNormal:12,quantizeTexcoord:14,...(name==='city-kit'?{pattern:/^(POSITION|NORMAL)$/}:{})}),textureCompress({encoder:sharp,targetFormat:'jpeg',quality:88})];
  await document.transform(...steps,meshopt({encoder:MeshoptEncoder,level:'medium'}));
  await io.write(path(output),document);
  const result={name,originalBytes,runtimeBytes:(await stat(output)).size};results.push(result);console.log(result);
}
const evidenceFile=new URL('docs/evidence/slice-asset-optimization.json',root);
let previous=[];try{previous=JSON.parse(await readFile(evidenceFile,'utf8')).results??[];}catch{}
await writeFile(evidenceFile,JSON.stringify({date:new Date().toISOString(),tool:'glTF Transform 4.5.1 + meshoptimizer 0.25; lossless welding/deduplication, 16-bit positions, 12-bit normals, 14-bit UV, JPEG88 maps, EXT_meshopt_compression',results:[...previous.filter(p=>!results.some(r=>r.name===p.name)),...results]},null,2)+'\n');
