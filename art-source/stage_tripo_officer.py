"""Local, exploratory Tripo officer rig-and-seat fit for the Stalin kart.

Requires the ignored .blend saved by prepare_tripo_officer.py. This does not
replace any runtime driver or export a production asset.
"""
import argparse
import os
import sys

import bpy
from mathutils import Matrix, Vector


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCALE = 1.85
ROOT_Y = -0.20


def args_after_separator():
    values = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--parts", required=True)
    parser.add_argument("--output", required=True)
    return parser.parse_args(values)


def transform_mesh(ob, dx, dy, dz=0.0):
    for vertex in ob.data.vertices:
        vertex.co.x = (vertex.co.x + dx) * SCALE
        vertex.co.y = vertex.co.y * SCALE + dy
        vertex.co.z = vertex.co.z * SCALE + dz
    ob.data.update()


def aim(armature, name, target):
    bpy.context.view_layer.update()
    bone = armature.pose.bones.get(name)
    if bone is None:
        raise KeyError(f"Missing metarig bone: {name}")
    direction = (Vector(target) - bone.head).normalized()
    q = (bone.tail - bone.head).normalized().rotation_difference(direction)
    matrix = bone.matrix.copy()
    rotation = q.to_matrix().to_4x4() @ matrix.to_3x3().to_4x4()
    rotation.translation = matrix.to_translation()
    bone.matrix = rotation
    bpy.context.view_layer.update()


def hide_tree(ob, hidden):
    ob.hide_render = hidden
    ob.hide_set(hidden)
    for child in ob.children:
        hide_tree(child, hidden)


def parent_to_rig_root(ob, armature):
    world = ob.matrix_world.copy()
    ob.parent = armature
    ob.parent_type = "OBJECT"
    ob.matrix_world = world


def main():
    options = args_after_separator()
    parts = os.path.abspath(options.parts)
    output = os.path.abspath(options.output)
    os.makedirs(output, exist_ok=True)
    bpy.ops.wm.open_mainfile(filepath=parts)
    body = bpy.data.objects["Body"]
    cap = bpy.data.objects["Cap"]
    cape = bpy.data.objects["Cape"]

    # Put each disconnected group over the same centered avatar coordinate
    # frame, retaining the original materials, UVs and surface islands.
    body_center_x = (-.418 + .106) * .5
    cap_center_x = (.123 + .295) * .5
    cape_center_x = (.070 + .418) * .5
    transform_mesh(body, -body_center_x, ROOT_Y)
    transform_mesh(cap, -cap_center_x, ROOT_Y, .15)
    transform_mesh(cape, -cape_center_x, ROOT_Y + .08)

    bpy.ops.preferences.addon_enable(module="rigify")
    bpy.ops.object.armature_human_metarig_add()
    armature = bpy.context.object
    armature.name = "Officer Driver Rig"
    armature.data.name = "Officer Driver Armature"
    bpy.ops.object.mode_set(mode="EDIT")
    kept_bones = {
        "root", "spine", "spine.001", "spine.002", "spine.003", "spine.004", "spine.005", "spine.006",
        "pelvis.L", "pelvis.R", "shoulder.L", "shoulder.R", "upper_arm.L", "upper_arm.R",
        "forearm.L", "forearm.R", "hand.L", "hand.R", "thigh.L", "thigh.R", "shin.L", "shin.R",
        "foot.L", "foot.R", "toe.L", "toe.R",
    }
    for bone in list(armature.data.edit_bones):
        if bone.name not in kept_bones:
            armature.data.edit_bones.remove(bone)
            continue
        bone.head *= (SCALE * .5)
        bone.tail *= (SCALE * .5)
        bone.head.y += ROOT_Y
        bone.tail.y += ROOT_Y
        bone.use_deform = True
    bpy.ops.object.mode_set(mode="OBJECT")

    # Automatic weights bind the body and all of its disconnected face,
    # uniform and equipment islands to the humanoid metarig.
    bpy.ops.object.select_all(action="DESELECT")
    body.select_set(True)
    armature.select_set(True)
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.parent_set(type="ARMATURE")
    for modifier in list(body.modifiers):
        if modifier.type == "ARMATURE":
            body.modifiers.remove(modifier)
    deform_bones = [bone for bone in armature.data.bones if bone.use_deform]
    groups = {bone.name: body.vertex_groups.new(name=bone.name) for bone in deform_bones}
    segments = [(bone.name, bone.head_local.copy(), bone.tail_local.copy()) for bone in deform_bones]
    # Automatic heat weights fail on this source's many detached islands. Use
    # nearest-bone segment weights with a narrow two-bone blend at joints.
    for vertex in body.data.vertices:
        ranked = []
        point = vertex.co
        for name, start, end in segments:
            axis = end - start
            t = max(0.0, min(1.0, (point - start).dot(axis) / max(axis.length_squared, 1e-9)))
            distance = (point - (start + axis * t)).length
            ranked.append((distance, name))
        ranked.sort(key=lambda item: item[0])
        nearest = ranked[:2]
        if len(nearest) == 1 or nearest[1][0] - nearest[0][0] > .045:
            weights = [(nearest[0][1], 1.0)]
        else:
            a = max(1e-5, nearest[0][0])
            b = max(1e-5, nearest[1][0])
            wa, wb = 1 / (a * a), 1 / (b * b)
            total = wa + wb
            weights = [(nearest[0][1], wa / total), (nearest[1][1], wb / total)]
        for name, weight in weights:
            groups[name].add([vertex.index], weight, "REPLACE")
    modifier = body.modifiers.new("Officer Driver Rig", "ARMATURE")
    modifier.object = armature
    modifier.use_deform_preserve_volume = True

    # First driver-pose block: raise both hands toward the measured steering
    # wheel, fold the legs toward the pedals, and leave head/torso bones at rest.
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode="POSE")
    for name, target in (
        ("thigh.L", (.105, -.43, .63)),
        ("shin.L", (.105, -1.10, .37)),
        ("foot.L", (.105, -1.22, .31)),
        ("thigh.R", (-.105, -.43, .63)),
        ("shin.R", (-.105, -1.10, .37)),
        ("foot.R", (-.105, -1.22, .31)),
        ("upper_arm.L", (.24, -.34, 1.30)),
        ("forearm.L", (.21, -.57, 1.18)),
        ("hand.L", (.21, -.59, 1.16)),
        ("upper_arm.R", (-.24, -.34, 1.30)),
        ("forearm.R", (-.21, -.57, 1.18)),
        ("hand.R", (-.21, -.59, 1.16)),
    ):
        aim(armature, name, target)
    bpy.ops.object.mode_set(mode="OBJECT")
    # The Tripo figure faces -Y while the project kart and wheel face +Y.
    # Rotate the complete rig assembly so the face/hands point toward the wheel.
    armature.rotation_euler[2] = 3.141592653589793
    armature.location.y = -.39
    bpy.context.view_layer.update()
    print("POSE_CHECK", [(name, tuple(round(v, 3) for v in armature.pose.bones[name].rotation_quaternion))
                         for name in ("thigh.L", "shin.L", "upper_arm.L", "forearm.L", "spine.002")])

    # Keep the hat and cloak as separate static test layers under the rig root.
    # Bone attachment and cloth simulation still need a successful deformation pass.
    parent_to_rig_root(cap, armature)
    parent_to_rig_root(cape, armature)
    cap["fit_status"] = "Test fit; inspect before runtime use"
    cape["fit_status"] = "Rigid torso parent; cloth simulation not implemented"
    armature["fit_status"] = "Rigify human metarig, posed for static kart-fit review"

    # Import the exact production kart asset and keep only the Stalin body.
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, "public", "assets", "models", "hero-kart.glb"))
    kart_objects = set(bpy.data.objects) - before
    for ob in kart_objects:
        if ob.name.startswith("body-"):
            hide_tree(ob, ob.name != "body-limousine")
        elif ob.name.startswith(("driverPose", "headPose", "armPose", "cast-", "scarfFlap", "gripHand", "variant-")):
            hide_tree(ob, True)

    scene = bpy.context.scene
    scene["asset_status"] = "Local experimental fit; not a runtime driver"
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.eevee.taa_render_samples = 24
    scene.render.resolution_x = 1200
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
    world = bpy.data.worlds.new("Kart fit review")
    world.use_nodes = True
    background = world.node_tree.nodes.get("Background") or world.node_tree.nodes.new("ShaderNodeBackground")
    output_node = world.node_tree.nodes.get("World Output") or world.node_tree.nodes.new("ShaderNodeOutputWorld")
    world.node_tree.links.new(background.outputs[0], output_node.inputs["Surface"])
    background.inputs["Color"].default_value = (.08, .10, .13, 1)
    background.inputs["Strength"].default_value = .5
    scene.world = world
    for name, pos, power, size in (
        ("key", (2.4, -3.0, 4.5), 900, 3),
        ("fill", (-3.0, -1.5, 2.5), 620, 3),
        ("rim", (0, 3.5, 3.6), 850, 2),
    ):
        data = bpy.data.lights.new("Kart review " + name, "AREA")
        data.energy = power
        data.shape = "DISK"
        data.size = size
        light = bpy.data.objects.new("Kart review " + name, data)
        scene.collection.objects.link(light)
        light.location = pos
        light.rotation_euler = (Vector((0, -.3, 1.1)) - light.location).to_track_quat("-Z", "Y").to_euler()
    camera_data = bpy.data.cameras.new("Kart fit camera")
    camera_data.type = "ORTHO"
    camera_data.ortho_scale = 4.4
    camera = bpy.data.objects.new("Kart fit camera", camera_data)
    scene.collection.objects.link(camera)
    scene.camera = camera

    for name, position, target in (
        ("fit-threequarter", (3.5, 4.8, 3.0), (0, .2, 1.1)),
        ("fit-profile", (5.0, -.1, 1.9), (0, -.2, 1.1)),
        ("fit-front", (0, 5.5, 2.0), (0, .2, 1.2)),
    ):
        camera.location = position
        camera.rotation_euler = (Vector(target) - camera.location).to_track_quat("-Z", "Y").to_euler()
        scene.render.filepath = os.path.join(output, name + ".png")
        bpy.ops.render.render(write_still=True)

    for ob in bpy.context.scene.objects:
        ob.select_set(False)
    scene.render.filepath = os.path.join(output, "officer-seated-test.blend")
    bpy.ops.wm.save_as_mainfile(filepath=scene.render.filepath)
    print("STAGED_FIT", [(ob.name, len(ob.data.vertices), len(ob.data.polygons))
                          for ob in (body, cap, cape)])
    print("STAGED_BLEND", scene.render.filepath)


if __name__ == "__main__":
    main()
