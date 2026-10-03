"""Reduce Poly Haven's CC0 tree to a measured browser asset, preserving its textures."""
import bpy,os,tempfile,shutil
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tempfile.tempdir=os.path.join(ROOT,'.tools','temp');os.makedirs(tempfile.tempdir,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT,'.tools','tree-source','tree.gltf'))
total=0
# Keep leaves separate from wood: a uniform reduction destroys the crown.
for o in list(bpy.context.scene.objects):
    if o.type!='MESH':continue
    bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
    bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.separate(type='MATERIAL');bpy.ops.object.mode_set(mode='OBJECT')
for o in list(bpy.context.scene.objects):
    if o.type!='MESH':continue
    tris=sum(len(p.vertices)-2 for p in o.data.polygons);total+=tris
    name=o.data.materials[0].name if o.data.materials else ''
    target=120000 if 'leaves' in name else 10000 if 'branches' in name else 5000
    if 'leaves' in name:
        bpy.context.view_layer.objects.active=o
        mod=o.modifiers.new('Remove coplanar leaf subdivisions','DECIMATE');mod.decimate_type='DISSOLVE';mod.angle_limit=.01
        bpy.ops.object.modifier_apply(modifier=mod.name)
        tris=sum(len(p.vertices)-2 for p in o.data.polygons)
    if tris>target:
        bpy.context.view_layer.objects.active=o
        mod=o.modifiers.new('Browser triangle budget','DECIMATE');mod.ratio=max(.005,target/tris)
        bpy.ops.object.modifier_apply(modifier=mod.name)
    for p in o.data.polygons:p.use_smooth=True
    for m in o.data.materials:
        if m and m.use_nodes:
            bsdf=m.node_tree.nodes.get('Principled BSDF')
            if bsdf:bsdf.inputs['Roughness'].default_value=.8
bpy.context.preferences.filepaths.save_version=0
# Pack all maps, so the .blend is editable without the local download cache.
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'art-source','park-tree.blend'))
raw=os.path.join(ROOT,'.tools','raw-models');os.makedirs(raw,exist_ok=True)
bpy.ops.export_scene.gltf(filepath=os.path.join(raw,'park-tree.glb'),export_format='GLB',export_apply=True)
shutil.copyfile(os.path.join(raw,'park-tree.glb'),os.path.join(ROOT,'public','assets','models','park-tree.glb'))
result=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in bpy.context.scene.objects if o.type=='MESH')
print('TREE_TRIANGLES',total,'=>',result)
