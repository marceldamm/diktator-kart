"""Standing presentation poses and head portraits for the driver selection (Claude, 09.10.2026).

From each art-source/<id>-im-kart.blend (never changed):
  public/assets/models/<id>-stand.glb     standing driver (rest = Tripo standing pose) with one animation per
                                          presentation pose; the selection screen plays a random one at frame 0
  public/assets/portraits/<id>.webp       head-and-shoulders portrait, rendered once here instead of in the browser
The poses are shared by all drivers and set through the same IK target bones Marcel uses for the seat pose.
Run: blender --background --factory-startup --python art-source/export_driver_stand.py -- <id[,id]|all>
"""
import bpy, os, sys, glob, math
from mathutils import Vector, Matrix, Quaternion

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Presentation poses in the standing figure's own frame (faces +Y, right = +X, feet on z = 0), as fractions of
# its measured joints so broad and slim drivers both work. Each hand: (target, direction it points), elbow pole.
STAGE = (-1.6, 1.3, 0)   # metres beside and ahead of the kart origin: right of the kart in the menu camera's view
STAGE_TURN = 48          # degrees towards the menu camera (positive = towards +X)
POSES = ('pose-haende-in-die-hueften', 'pose-haende-auf-dem-ruecken', 'pose-hand-am-ruecken', 'pose-laessig')


def joint(rig, name):
    return rig.matrix_world @ rig.data.bones[name].head_local


def place(rig, name, at, direction=None):
    pb = rig.pose.bones[name]
    m = pb.matrix.copy()
    if direction is not None:
        d = (rig.matrix_world.inverted().to_3x3() @ Vector(direction)).normalized()
        r = m.to_3x3().col[1].normalized().rotation_difference(d).to_matrix() @ m.to_3x3()
        m = r.to_4x4()
    m.translation = rig.matrix_world.inverted() @ Vector(at)
    pb.matrix = m
    bpy.context.view_layer.update()


def turn(rig, name, axis, deg):
    pb = rig.pose.bones[name]
    e = list(pb.rotation_euler); e['XYZ'.index(axis)] += math.radians(deg); pb.rotation_euler = e
    bpy.context.view_layer.update()


def reset(rig):
    for pb in rig.pose.bones:
        pb.location = (0, 0, 0); pb.rotation_euler = (0, 0, 0); pb.rotation_quaternion = (1, 0, 0, 0); pb.scale = (1, 1, 1)
    bpy.context.view_layer.update()
    for sd, sg in (('l', 1), ('r', -1)): turn(rig, f'fingers_{sd}', 'Z', sg * 30)   # relaxed hands


def set_pose(rig, pose):
    reset(rig)
    hip_l, hip_r = joint(rig, 'thigh_l'), joint(rig, 'thigh_r')     # character left = -X
    sh_l, sh_r = joint(rig, 'upperarm_l'), joint(rig, 'upperarm_r')
    hip_w = abs(hip_r.x - hip_l.x) / 2
    waist = (hip_l.z + joint(rig, 'spine_01').z) / 2 + .06
    chest = (joint(rig, 'spine_03').z + sh_l.z) / 2
    front = joint(rig, 'spine_02').y
    for sd, s in (('l', -1), ('r', 1)):
        sh = sh_l if sd == 'l' else sh_r
        if pose == 'pose-haende-in-die-hueften' or (pose in ('pose-laessig', 'pose-hand-am-ruecken') and sd == 'r'):
            place(rig, f'Hand-Ziel_{sd}', (s * (hip_w + .2), front + .02, waist), (-s * .6, .35, -.7))
            place(rig, f'Ellbogen-Richtung_{sd}', (s * (abs(sh.x) + .7), front - .1, waist + .25))
        elif pose == 'pose-haende-auf-dem-ruecken' or pose == 'pose-hand-am-ruecken':
            place(rig, f'Hand-Ziel_{sd}', (s * .07, front - .3, waist - .05), (-s * .8, -.1, -.4))
            place(rig, f'Ellbogen-Richtung_{sd}', (s * (abs(sh.x) + .4), front - .8, waist + .2))
        # 'pose-laessig' left arm: stays hanging.
    if pose == 'pose-laessig':
        turn(rig, 'Head', 'Z', 12); turn(rig, 'spine_02', 'Z', -5)
    elif pose == 'pose-haende-auf-dem-ruecken':
        turn(rig, 'spine_03', 'X', 4); turn(rig, 'Head', 'X', 4)
    elif pose == 'pose-hand-am-ruecken':
        turn(rig, 'Head', 'Z', -10); turn(rig, 'spine_02', 'Z', 4)


def bake_poses(rig):
    """Evaluate each pose with the IK rig, then store it as a constraint-free one-frame action on the deform bones."""
    deform = [pb for pb in rig.pose.bones if pb.bone.use_deform]
    stored = {}
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode='POSE')
    for pose in POSES:
        set_pose(rig, pose)
        bpy.ops.pose.select_all(action='SELECT')
        bpy.ops.pose.visual_transform_apply()
        stored[pose] = {pb.name: pb.matrix_basis.copy() for pb in deform}
    for pb in rig.pose.bones:
        for c in list(pb.constraints): pb.constraints.remove(c)
    reset(rig)
    rig.animation_data_create()
    for pose in POSES:
        action = bpy.data.actions.new(pose); action.use_fake_user = True
        rig.animation_data.action = action
        for pb in deform:
            pb.rotation_mode = 'QUATERNION'
            loc, rot, scale = stored[pose][pb.name].decompose()
            pb.location, pb.rotation_quaternion, pb.scale = loc, rot, scale
            for path in ('location', 'rotation_quaternion', 'scale'): pb.keyframe_insert(path, frame=0)
        track = rig.animation_data.nla_tracks.new(); track.name = pose
        track.strips.new(pose, 0, action)
        rig.animation_data.action = None
    reset(rig)
    bpy.ops.object.mode_set(mode='OBJECT')


def portrait(rig, id, body):
    """Head-and-shoulders card in the selection's studio look (neutral fill, warm key)."""
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_EEVEE'
    sc.render.resolution_x, sc.render.resolution_y = 320, 360
    sc.render.film_transparent = True
    sc.render.image_settings.file_format = 'WEBP'; sc.render.image_settings.quality = 88
    sc.render.image_settings.color_mode = 'RGBA'
    try: sc.view_settings.view_transform = 'Standard'
    except TypeError: pass
    w = bpy.data.worlds.new('portrait'); sc.world = w; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs[0].default_value = (.35, .37, .38, 1)
    for name, rot, energy in (('Key', (55, 0, 30), 3.2), ('Fill', (65, 0, -40), 1.4), ('Rim', (60, 0, 180), 2.0)):
        l = bpy.data.lights.new(name, 'SUN'); l.energy = energy
        o = bpy.data.objects.new(name, l); sc.collection.objects.link(o); o.rotation_euler = [math.radians(a) for a in rot]
    head = joint(rig, 'Head')
    top = rig.matrix_world @ rig.data.bones['Head'].tail_local
    target = Vector((head.x, head.y, (head.z + top.z) / 2 - .11))
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam)
    cam.data.lens = 85
    a = math.radians(18)
    cam.location = target + Vector((math.sin(a), math.cos(a), .04)) * 2.0
    cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()
    sc.camera = cam
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.parent != rig: o.hide_render = True
    out = os.path.join(ROOT, 'public', 'assets', 'portraits', f'{id}.webp')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    sc.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print('PORTRAIT', out, os.path.getsize(out))


def export(source):
    id = os.path.basename(source)[:-len('-im-kart.blend')]
    bpy.ops.wm.open_mainfile(filepath=source)
    if bpy.context.object and bpy.context.object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    rig = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
    # Presentation spot in the kart frame (+Y forward, +X right): beside the kart on the side the menu camera looks
    # from, turned towards that camera. The selection screen hangs this GLB on the kart like the seated driver.
    rig.location = (0, 0, 0); rig.rotation_euler = (0, 0, math.pi)   # poses and portrait: upright at the origin, facing +Y
    bpy.context.view_layer.update()
    meshes = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == rig and not o.hide_get() and not o.hide_viewport]
    body = next(o for o in meshes if o.name.endswith('Koerper'))
    bake_poses(rig)
    for img in bpy.data.images:
        if img.size[0] > 1024: img.scale(1024, 1024)
    # Portrait in a neutral standing pose (rest), then the GLB.
    portrait(rig, id, body)
    # The presentation spot only moves the whole figure; the poses live in bone space and stay valid.
    rig.location = STAGE; rig.rotation_euler = (0, 0, math.pi - math.radians(STAGE_TURN))
    bpy.context.view_layer.update()
    bpy.ops.object.select_all(action='DESELECT')
    rig.select_set(True)
    for o in meshes: o.select_set(True)
    out = os.path.join(ROOT, 'public', 'assets', 'models', f'{id}-stand.glb')
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_yup=True,
                              export_def_bones=True, export_animations=True, export_animation_mode='NLA_TRACKS',
                              export_apply=False, export_force_sampling=True)
    print('STAND_EXPORTED', out, os.path.getsize(out))


def main():
    arg = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv and len(sys.argv) > sys.argv.index('--') + 1 else 'all'
    sources = sorted(glob.glob(os.path.join(ROOT, 'art-source', '*-im-kart.blend')))
    if arg != 'all':
        sources = [s for s in sources if os.path.basename(s)[:-len('-im-kart.blend')] in arg.split(',')]
    for s in sources: export(s)


if __name__ == '__main__':
    main()
