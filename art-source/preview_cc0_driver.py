"""Deterministic Blender asset review, no game or track rebuild required.

blender --background --python art-source/preview_cc0_driver.py -- hitler before
Front/three-quarter/profile share framing and lighting. Seating includes the kart.
Preview .blend is separate from the clean export source; QA objects never ship.
"""
import bpy, math, os, sys, json
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
who, label = (args + ['hitler', 'review'])[:2]
out = os.path.join(ROOT, 'docs', 'evidence', 'hitler-face-20261007')
os.makedirs(out, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=os.path.join(ROOT, '.tools', 'raw-models', f'cc0-driver-{who}.blend'))
sc = bpy.context.scene
bpy.context.view_layer.update()
head = bpy.data.objects['Pilot head']
pts = [head.matrix_world @ v.co for v in head.data.vertices]
top = max(p.z for p in pts)
# Fixed target survives a sculpt change, so the before/after framing stays identical.
target = Vector((0, -.43945324, 1.88709569))
sc.render.engine = 'BLENDER_EEVEE_NEXT'
sc.render.resolution_x = 640; sc.render.resolution_y = 720; sc.render.resolution_percentage = 100
sc.render.image_settings.file_format = 'PNG'
sc.render.film_transparent = False
sc.view_settings.view_transform = 'AgX'
w = bpy.data.worlds.new('QA studio'); sc.world = w; w.use_nodes = True
bg = next(n for n in w.node_tree.nodes if n.type == 'BACKGROUND')
bg.inputs[0].default_value = (.12, .14, .17, 1)
bg.inputs[1].default_value = .5
for name, pos, power, size in [('key', (2, 4, 5), 350, 3), ('fill', (-3, 2, 3), 220, 3), ('rim', (0, -3, 4), 300, 2)]:
    data = bpy.data.lights.new('QA ' + name, 'AREA'); data.energy = power; data.shape = 'DISK'; data.size = size
    ob = bpy.data.objects.new('QA ' + name, data); sc.collection.objects.link(ob); ob.location = pos
    ob.rotation_euler = (target - ob.location).to_track_quat('-Z', 'Y').to_euler()
data = bpy.data.cameras.new('QA camera'); data.type = 'ORTHO'; data.ortho_scale = .66
camera = bpy.data.objects.new('QA camera', data); sc.collection.objects.link(camera); sc.camera = camera
def shot(name, at, look):
    camera.location = at; camera.rotation_euler = (look - camera.location).to_track_quat('-Z', 'Y').to_euler()
    sc.render.filepath = os.path.join(out, f'{label}-{name}.png')
    bpy.ops.render.render(write_still=True)
for name, deg in [('front', 0), ('threequarter', 35), ('profile', 90)]:
    a = math.radians(deg)
    shot(name, target + Vector((math.sin(a) * 2, math.cos(a) * 2, .015)), target)

# Import production kart into the same coordinates, select the actual runtime body and remove old driver.
before = set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, 'public', 'assets', 'models', 'hero-kart.glb'))
kart = set(bpy.data.objects) - before
def tree_hide(ob, value):
    ob.hide_render = value
    ob.hide_set(value)
    for child in ob.children: tree_hide(child, value)
for ob in kart:
    body_style = {'hitler': 'grandprix', 'stalin': 'limousine', 'mussolini': 'racer', 'mao': 'rounded', 'kim': 'rocket', 'castro': 'jeep'}[who]
    if ob.name.startswith('body-'): tree_hide(ob, ob.name != 'body-' + body_style)
    if ob.name.startswith(('driverPose', 'headPose', 'armPose', 'cast-', 'scarfFlap', 'gripHand', 'variant-')): tree_hide(ob, True)
    if ob.name == 'steeringPivot': ob.location.y -= .1
sc.render.resolution_x = 1000; sc.render.resolution_y = 720; data.ortho_scale = 4.5
seat = Vector((0, 0, 1.0))
shot('seating', Vector((3.5, 4.8, 2.8)), seat)
shot('seating-profile', Vector((5, 0, 1.5)), seat)
camera.location = (3.5, 4.8, 2.8); camera.rotation_euler = (seat - camera.location).to_track_quat('-Z', 'Y').to_euler()
for ob in bpy.context.scene.objects:
    ob.select_set(False)
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type == 'VIEW_3D':
            area.spaces.active.region_3d.view_perspective = 'CAMERA'
            area.spaces.active.shading.type = 'MATERIAL'
            area.spaces.active.overlay.show_overlays = False
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, '.tools', 'raw-models', f'qa-{who}-seated.blend'))
print('QA_DRIVER_COMPLETE', json.dumps({'driver': who, 'label': label, 'top': top, 'target': list(target)}))
