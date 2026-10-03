"""Satirical parade tank for the 'Größenbefehl' ability (Sarah's archived idea, rebuilt for Babylon).
Run: blender --background --python art-source/build_tank.py  -> art-source/parade-tank.blend, public/assets/models/parade-tank.glb
Original geometry, no historical insignia: fictional laurel/paragraph emblem, brass propaganda horns.
Blender: X right, Y forward, Z up; origin at ground centre like the hero kart.
Runtime contract (src/slice-scene.ts): 'tank' root, 'tankTurret', 'tankBarrel', 'tankWheel-L-0..6' / 'tankWheel-R-0..6',
materials 'Tank parade enamel' (recoloured), 'Tank track links' (scrolling link texture, u = metres along the belt / 0.9).
"""
import os, sys, math, bmesh
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mesh_tools import *

paint = mat('Tank parade enamel', (.36, .04, .05), .3, .38)
steel = mat('Tank gunmetal', (.09, .1, .11), .85, .38)
track_mat = mat('Tank track links', (.07, .07, .07), .7, .6)
ivory = cream
brass = gold

def smooth(o):
    for p in o.data.polygons: p.use_smooth = True
    return o

def ring(w, hh, zc, y, n=20, e=3.2):
    pts = []
    for i in range(n):
        c, s = math.cos(2 * math.pi * i / n), math.sin(2 * math.pi * i / n)
        pts.append((w * math.copysign(abs(c) ** (2 / e), c), y, zc + hh * math.copysign(abs(s) ** (2 / e), s)))
    return pts

def loft(name, rings, m, parent=None):
    n = len(rings[0]); vs = [p for r in rings for p in r]; fs = []
    for j in range(len(rings) - 1):
        for i in range(n): fs.append((j * n + i, j * n + (i + 1) % n, (j + 1) * n + (i + 1) % n, (j + 1) * n + i))
    fs += [tuple(reversed(range(n))), tuple((len(rings) - 1) * n + i for i in range(n))]
    o = smooth(mesh(name, vs, fs, m, parent)); mod = o.modifiers.new('Subdivision', 'SUBSURF'); mod.levels = 1; return o

def rod(name, a, b, r, m, parent=None):
    curve = bpy.data.curves.new(name, 'CURVE'); curve.dimensions = '3D'; curve.bevel_depth = r; curve.bevel_resolution = 1
    sp = curve.splines.new('POLY'); sp.points.add(1); sp.points[0].co = (*a, 1); sp.points[1].co = (*b, 1)
    o = bpy.data.objects.new(name, curve); bpy.context.collection.objects.link(o); o.data.materials.append(m); o.parent = parent
    bpy.context.view_layer.objects.active = o; o.select_set(True); bpy.ops.object.convert(target='MESH'); o.select_set(False); return o

def emblem_text(name, pos, rot, size, parent):
    t = bpy.data.curves.new(name, 'FONT'); t.body = '§'; t.align_x = 'CENTER'; t.size = size; t.extrude = .03; t.resolution_u = 3
    o = bpy.data.objects.new(name, t); bpy.context.collection.objects.link(o); o.location = pos; o.rotation_euler = rot
    o.data.materials.append(brass); bpy.ops.object.select_all(action='DESELECT'); o.select_set(True)
    bpy.context.view_layer.objects.active = o; bpy.ops.object.convert(target='MESH'); o.parent = parent; return o

tank = empty('tank')

# Hull: rounded parade body with a sloped glacis, ivory parade stripe and brass trim.
hull = [(-1.8, .9, .26, .86), (-1.5, 1.0, .36, .92), (.9, 1.0, .36, .92), (1.45, .92, .26, .8), (1.85, .78, .14, .66), (1.98, .62, .08, .6)]
loft('Hull', [ring(w, hh, zc, y) for y, w, hh, zc in hull], paint, tank)
box('Hull belly', (0, 0, .5), (1.7, 3.5, .36), steel, .06, tank)
for sd in [-1, 1]:
    box('Parade stripe', (sd * 1.0, -.2, .95), (.03, 2.8, .1), ivory, .01, tank)
    tube('Hull brass edge', [(sd * 1.0, -1.75, 1.12), (sd * 1.01, 0, 1.15), (sd * .95, 1.4, 1.08), (sd * .8, 1.92, .78)], .025, brass, tank)
    box('Track skirt', (sd * 1.22, 0, .86), (.5, 3.7, .08), paint, .02, tank)
    box('Skirt brass rim', (sd * 1.47, 0, .86), (.03, 3.7, .1), brass, .01, tank)
    cyl('Exhaust stack', (sd * .55, -1.78, 1.0), .09, .45, steel, tank, 'Y')
    cyl('Headlamp', (sd * .62, 1.82, .82), .1, .12, brass, tank, 'Y')
    ellipsoid('Headlamp glass', (sd * .62, 1.89, .82), (.08, .02, .08), glow, tank)
torus('Glacis laurel', (0, 1.83, .78), .2, .03, brass, tank, 'Y')
emblem_text('Glacis paragraph', (0, 1.86, .68), (math.pi / 2, 0, math.pi), .3, tank)

# Running gear: sprocket, five road wheels, idler per side; each wheel is a named spin node.
wheels = [(1.6, .5, .26)] + [(1.15 - k * .58, .32, .3) for k in range(5)] + [(-1.62, .46, .25)]
for sd, tag in [(-1, 'L'), (1, 'R')]:
    for k, (y, z, r) in enumerate(wheels):
        w = empty(f'tankWheel-{tag}-{k}', (sd * 1.22, y, z), tank)
        cyl('Road wheel', (0, 0, 0), r, .34, steel, w, 'X', verts=20)
        cyl('Wheel brass hub', (sd * .18, 0, 0), r * .45, .04, brass, w, 'X', verts=16)
        for j in range(6):
            a = j * math.pi / 3; box('Wheel bolt', (sd * .2, r * .3 * math.sin(a), r * .3 * math.cos(a)), (.03, .04, .04), steel, 0, w)
    # Track belt: closed strip around the gear; u = arc length for the scrolling link texture.
    path = [(-1.45 + k * (3.0 / 12), .03) for k in range(13)]
    path += [(1.6 + .3 * math.cos(-math.pi / 2 + k * math.pi / 8), .5 + .47 * math.sin(-math.pi / 2 + k * math.pi / 8)) for k in range(1, 9)]
    path += [(1.55 - k * (3.15 / 12), .76) for k in range(1, 13)]
    path += [(-1.62 + .3 * math.cos(math.pi / 2 + k * math.pi / 8), .46 + .3 * math.sin(math.pi / 2 + k * math.pi / 8)) for k in range(1, 8)]
    vs = []; fs = []; uvs = []; dist = 0
    for i, (y, z) in enumerate(path):
        if i: dist += math.hypot(y - path[i - 1][0], z - path[i - 1][1])
        for xo in [-.22, .22]: vs.append((sd * 1.22 + xo, y, z)); uvs.append((dist / .9, (xo + .22) / .44))
    n = len(path)
    for i in range(n):
        a, b = i * 2, ((i + 1) % n) * 2
        fs.append((a, a + 1, b + 1, b))
    belt = mesh(f'Track belt {tag}', vs, fs, track_mat, tank)
    layer = belt.data.uv_layers.new(name='Track metre UV')
    for poly in belt.data.polygons:
        for li in poly.loop_indices: layer.data[li].uv = uvs[belt.data.loops[li].vertex_index]
    sol = belt.modifiers.new('Link thickness', 'SOLIDIFY'); sol.thickness = .07

# Turret with commander hatch, gun, mantlet and satirical brass propaganda horns.
turret = empty('tankTurret', (0, -.15, 1.12), tank)
loft('Turret', [ring(w, hh, zc, y, 24, 2.6) for y, w, hh, zc in [(-.95, .55, .18, .2), (-.7, .72, .28, .25), (.35, .74, .27, .25), (.75, .6, .2, .22), (.92, .42, .12, .2)]], paint, turret)
torus('Turret brass ring', (0, 0, .02), .78, .04, brass, turret)
cyl('Commander hatch ring', (0, -.3, .55), .38, .08, steel, turret, verts=24)
torus('Hatch brass lip', (0, -.3, .6), .38, .03, brass, turret)
box('Gun mantlet', (0, .9, .25), (.5, .3, .36), steel, .05, turret)
barrel = empty('tankBarrel', (0, .95, .27), turret)
cyl('Gun barrel', (0, 1.25, 0), .085, 2.4, steel, barrel, 'Y', r2=.07, verts=16)
cyl('Muzzle brake', (0, 2.5, 0), .13, .26, steel, barrel, 'Y', verts=12)
for k in range(3): torus('Barrel brass band', (0, .5 + k * .6, 0), .095, .018, brass, barrel, 'Y')
for sd in [-1, 1]:
    cyl('Propaganda horn', (sd * .62, .2, .62), .2, .45, brass, turret, 'Y', r2=.05)
    rod('Horn bracket', (sd * .55, .05, .3), (sd * .62, .1, .55), .025, steel, turret)
    torus('Turret side laurel', (sd * .74, -.1, .25), .14, .025, brass, turret, 'X')
rod('Antenna', (-.45, -.75, .4), (-.45, -.8, 1.9), .015, steel, turret)
vs = [(-.45, -.8 - i * .14, 1.62 + j * .26 + math.sin(i) * .03) for j in [0, 1] for i in range(5)]
mesh('Antenna pennant', vs, [(i, i + 1, i + 6, i + 5) for i in range(4)], red, turret)

# Outward normals, applied modifiers, then one mesh per (parent, material) like the hero kart.
for o in list(bpy.context.scene.objects):
    if o.type != 'MESH': continue
    bm = bmesh.new(); bm.from_mesh(o.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(o.data); bm.free()
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
    for m in list(o.modifiers): bpy.ops.object.modifier_apply(modifier=m.name)
groups = {}
for o in list(bpy.context.scene.objects):
    if o.type == 'MESH': groups.setdefault((o.parent.name if o.parent else '', o.data.materials[0].name), []).append(o)
for key, objs in groups.items():
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join(); bpy.context.object.name = key[0] + ' / ' + key[1]
save('parade-tank')
print('TANK_COMPLETE')
