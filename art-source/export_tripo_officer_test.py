"""Export a staged Tripo officer as a static, posed local runtime test.

The source GLB and the resulting experimental asset are user-only files. This
script reads .tools/raw-models/tripo-soviet-officer/officer-seated-test.blend
and writes a GLB to public/assets/models for the local Vite runtime. Do not
publish that GLB until the model's distribution rights have been confirmed.
"""
import argparse
import os
import sys

import bpy


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def main():
    values = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--output", required=True)
    options = parser.parse_args(values)
    source_path = os.path.abspath(options.source)
    output_path = os.path.abspath(options.output)
    if not os.path.isfile(source_path):
        raise FileNotFoundError(source_path)
    bpy.ops.wm.open_mainfile(filepath=source_path)
    armature = bpy.data.objects.get("Officer Driver Rig")
    if armature is None:
        raise RuntimeError("Staged officer rig is missing")

    depsgraph = bpy.context.evaluated_depsgraph_get()
    root = bpy.data.objects.new("Tripo officer test root", None)
    bpy.context.scene.collection.objects.link(root)
    root.matrix_world = armature.matrix_world.copy()
    exported = [root]

    for name in ("Body", "Cap", "Cape"):
        source = bpy.data.objects.get(name)
        if source is None or source.type != "MESH":
            raise RuntimeError(f"Staged mesh {name} is missing")
        world = source.matrix_world.copy()
        if name == "Body":
            evaluated = source.evaluated_get(depsgraph)
            mesh = bpy.data.meshes.new_from_object(evaluated, preserve_all_data_layers=True, depsgraph=depsgraph)
        else:
            mesh = source.data.copy()
        obj = bpy.data.objects.new(f"Tripo officer {name}", mesh)
        bpy.context.scene.collection.objects.link(obj)
        obj.matrix_world = world
        obj.parent = root
        obj.matrix_parent_inverse = root.matrix_world.inverted()
        obj.matrix_world = world
        obj["asset_status"] = "Static posed local runtime test; not approved for publication"
        exported.append(obj)

    bpy.ops.object.select_all(action="DESELECT")
    for obj in exported:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = root
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_skins=False,
        export_animations=False,
        export_image_format="AUTO",
    )
    print(f"TEST_RUNTIME_GLB {output_path} {os.path.getsize(output_path)}")


if __name__ == "__main__":
    main()
