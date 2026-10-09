"""Split a Tripo officer GLB into body, cap and cape for local Blender review.

The source is passed explicitly because user-generated source models are kept in
the ignored .tools folder and are not copied to the public project repository.

Run from the repository root:
  blender --background --python art-source/prepare_tripo_officer.py -- \
    --source <original.glb> --output <local-review-directory>
"""
import argparse
import os
import sys

import bpy
from mathutils import Vector


def args_after_separator():
    values = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--output", required=True)
    return parser.parse_args(values)


def bounds(objects):
    points = [ob.matrix_world @ Vector(corner)
              for ob in objects for corner in ob.bound_box]
    return tuple(min(point[i] for point in points) for i in range(3)), \
        tuple(max(point[i] for point in points) for i in range(3))


def render_review(objects, output):
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.eevee.taa_render_samples = 16
    scene.render.resolution_x = 900
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "Medium High Contrast"

    low, high = bounds(objects)
    center = Vector(tuple((a + b) * 0.5 for a, b in zip(low, high)))
    size = max(high[i] - low[i] for i in range(3))
    world = bpy.data.worlds.new("Officer review world")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (.12, .14, .17, 1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = .6
    scene.world = world

    for name, offset, energy, radius in (
        ("key", (1.3, -1.6, 2.0), 480, 1.2),
        ("fill", (-1.8, -.4, .9), 260, 1.5),
        ("rim", (.1, 1.5, 1.7), 360, 1.0),
    ):
        data = bpy.data.lights.new("Review " + name, "AREA")
        data.energy = energy
        data.shape = "DISK"
        data.size = size * radius
        light = bpy.data.objects.new("Review " + name, data)
        scene.collection.objects.link(light)
        light.location = center + Vector(offset) * size
        light.rotation_euler = (center - light.location).to_track_quat("-Z", "Y").to_euler()

    camera_data = bpy.data.cameras.new("Review camera")
    camera_data.type = "ORTHO"
    camera_data.ortho_scale = size * 1.5
    camera = bpy.data.objects.new("Review camera", camera_data)
    scene.collection.objects.link(camera)
    scene.camera = camera
    camera.location = center + Vector((1, -1, .08)).normalized() * size * 3.2
    camera.rotation_euler = (center - camera.location).to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = os.path.join(output, "parts-separated.png")
    bpy.ops.render.render(write_still=True)


def main():
    options = args_after_separator()
    source = os.path.abspath(options.source)
    output = os.path.abspath(options.output)
    os.makedirs(output, exist_ok=True)
    if not os.path.isfile(source):
        raise FileNotFoundError(source)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=source)
    meshes = [ob for ob in bpy.context.scene.objects if ob.type == "MESH"]
    if len(meshes) != 1:
        raise RuntimeError(f"Expected the inspected single mesh, found {len(meshes)}")
    source_mesh = meshes[0]

    bpy.ops.object.select_all(action="DESELECT")
    source_mesh.select_set(True)
    bpy.context.view_layer.objects.active = source_mesh
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.separate(type="LOOSE")
    bpy.ops.object.mode_set(mode="OBJECT")
    islands = [ob for ob in bpy.context.scene.objects if ob.type == "MESH"]

    groups = {"Body": [], "Cap": [], "Cape": []}
    for ob in islands:
        points = [ob.matrix_world @ vertex.co for vertex in ob.data.vertices]
        cx = sum(point.x for point in points) / len(points)
        cz = sum(point.z for point in points) / len(points)
        # The source places the figure at negative X, cap above/right, and cape
        # farther right. Classify each disconnected island without editing it.
        if cx > .08 and cz > .75:
            groups["Cap"].append(ob)
        elif cx > .08:
            groups["Cape"].append(ob)
        else:
            groups["Body"].append(ob)

    final = []
    for name, members in groups.items():
        if not members:
            raise RuntimeError(f"No geometry classified as {name}")
        bpy.ops.object.select_all(action="DESELECT")
        for ob in members:
            ob.select_set(True)
        bpy.context.view_layer.objects.active = members[0]
        bpy.ops.object.join()
        merged = bpy.context.view_layer.objects.active
        merged.name = name
        merged.data.name = name + " Mesh"
        merged["source"] = "User-provided Tripo GLB; original is kept separately"
        merged["separation_method"] = "Disconnected surface-island spatial clustering"
        final.append(merged)

    bpy.context.view_layer.update()
    for ob in final:
        ob.select_set(False)
    scene = bpy.context.scene
    scene["asset_status"] = "Exploratory split; no rig or runtime approval"
    scene["source_mesh_islands"] = len(islands)
    scene["split_groups"] = "Body, Cap, Cape"
    render_review(final, output)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(output, "officer-parts.blend"))
    bpy.ops.object.select_all(action="DESELECT")
    for ob in final:
        ob.select_set(True)
    bpy.context.view_layer.objects.active = final[0]
    bpy.ops.export_scene.gltf(
        filepath=os.path.join(output, "soviet-officer-parts-separated.glb"),
        export_format="GLB",
        use_selection=True,
        export_apply=False,
    )
    print("SPLIT_SUMMARY", [(ob.name, len(ob.data.vertices), len(ob.data.polygons)) for ob in final])
    print("OUTPUT", os.path.join(output, "officer-parts.blend"))


if __name__ == "__main__":
    main()
